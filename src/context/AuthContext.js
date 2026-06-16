// ========================================
// GOD'S EYE EDTECH - AUTHENTICATION CONTEXT
// ========================================

import React, { createContext, useState, useEffect, useContext } from 'react';
import * as authService from '../services/authService';
import * as storage from '../utils/storage';
import { USER_ROLES } from '../utils/constants';

// ============================================================
// CREATE CONTEXT
// ============================================================

export const AuthContext = createContext();

// ============================================================
// AUTH PROVIDER
// ============================================================

export const AuthProvider = ({ children }) => {
  // State
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Check authentication status on app start
   */
  useEffect(() => {
    checkAuthStatus();
  }, []);

  /**
   * Listen for auth:logout event (triggered by api.js on token refresh failure)
   */
  useEffect(() => {
    const handleLogoutEvent = () => {
      if (__DEV__) {
        console.log('🔔 AuthContext received auth:logout event');
      }
      logout();
    };

    if (typeof window !== 'undefined' && window.addEventListener) {
      window.addEventListener('auth:logout', handleLogoutEvent);
    }

    return () => {
      if (typeof window !== 'undefined' && window.removeEventListener) {
        window.removeEventListener('auth:logout', handleLogoutEvent);
      }
    };
  }, []);

  // ============================================================
  // AUTH STATUS CHECK
  // ============================================================

  /**
   * Check if user is logged in by validating stored token and user data
   */
  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);

      if (__DEV__) {
        console.log('🔍 Checking authentication status...');
      }

      // Check if tokens exist
      const token = await storage.getToken();
      const refreshToken = await storage.getRefreshToken();

      if (!token || !refreshToken) {
        if (__DEV__) {
          console.log('❌ No tokens found - user not authenticated');
        }
        await logout();
        return;
      }

      // Get stored user data
      const userData = await storage.getUserData();

      if (!userData) {
        if (__DEV__) {
          console.log('❌ No user data found - clearing tokens');
        }
        await logout();
        return;
      }

      // Verify token with backend
      const verifyResult = await authService.verifyToken(token);

      if (!verifyResult.success) {
        if (__DEV__) {
          console.log('❌ Token invalid - attempting refresh...');
        }

        // Try to refresh token
        const refreshResult = await authService.refreshToken(refreshToken);

        if (!refreshResult.success) {
          if (__DEV__) {
            console.log('❌ Token refresh failed - logging out');
          }
          await logout();
          return;
        }

        // Save new token
        await storage.setToken(refreshResult.access);
      }

      // Fetch latest user data from backend
      const userResult = await authService.getCurrentUser();

      if (!userResult.success) {
        if (__DEV__) {
          console.log('❌ Failed to fetch user data - using stored data');
        }
        // Use stored data if backend fetch fails
        setUser(userData);
        setUserRole(getUserRole(userData));
        setIsAuthenticated(true);
      } else {
        // Update with fresh data from backend
        await storage.setUserData(userResult.user);
        setUser(userResult.user);
        setUserRole(getUserRole(userResult.user));
        setIsAuthenticated(true);

        if (__DEV__) {
          console.log('✅ Authentication verified:', {
            user: userResult.user.username,
            role: getUserRole(userResult.user),
          });
        }
      }
    } catch (error) {
      console.error('❌ Check auth status error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // ROLE DETECTION
  // ============================================================

  /**
   * Get user role based on role flags
   * Priority: Super Admin > School Admin > Teacher > Guardian
   * @param {Object} userData - User object from backend
   * @returns {string|null} User role constant
   */
  const getUserRole = (userData) => {
    if (!userData) return null;

    if (userData.is_superadmin) return USER_ROLES.SUPER_ADMIN;
    if (userData.is_school_admin) return USER_ROLES.SCHOOL_ADMIN;
    if (userData.is_teacher) return USER_ROLES.TEACHER;
    if (userData.is_guardian) return USER_ROLES.GUARDIAN;

    return null;
  };

  // ============================================================
  // LOGIN
  // ============================================================

  /**
   * Login user with username and password
   * @param {string} username - Username
   * @param {string} password - Password
   * @returns {Promise<Object>} Login result
   */
  const login = async (username, password) => {
    try {
      setIsLoading(true);

      if (__DEV__) {
        console.log('🔐 Logging in:', username);
      }

      // Call backend login
      const result = await authService.login(username, password);

      if (!result.success) {
        if (__DEV__) {
          console.log('❌ Login failed:', result.message);
        }
        return {
          success: false,
          message: result.message || 'Login failed',
        };
      }

      // Store tokens
      await storage.setToken(result.access);
      await storage.setRefreshToken(result.refresh);

      // Store user data
      await storage.setUserData(result.user);

      // Update state
      setUser(result.user);
      setUserRole(getUserRole(result.user));
      setIsAuthenticated(true);

      if (__DEV__) {
        console.log('✅ Login successful:', {
          user: result.user.username,
          role: getUserRole(result.user),
          hasSchool: !!result.user.school_data,
        });
        console.log('✅ AuthContext state after login:', {
          isAuthenticated: true,
          user: result.user.username,
          role: getUserRole(result.user),
        });
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      console.error('❌ Login error:', error);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  /**
   * Logout user and clear all data
   */
  const logout = async () => {
    try {
      if (__DEV__) {
        console.log('🚪 Logging out...');
      }

      // Get refresh token before clearing
      const refreshToken = await storage.getRefreshToken();

      // Call backend logout to blacklist token
      if (refreshToken) {
        await authService.logout(refreshToken);
      }

      // Clear all stored data
      await storage.clearAuthData();

      // Clear state
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);

      if (__DEV__) {
        console.log('✅ Logout complete');
      }
    } catch (error) {
      console.error('❌ Logout error:', error);

      // Even if there's an error, clear local data
      await storage.clearAuthData();
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    }
  };

  // ============================================================
  // TOKEN REFRESH
  // ============================================================

  /**
   * Refresh access token
   * @returns {Promise<string|null>} New access token or null
   */
  const refreshAccessToken = async () => {
    try {
      const refreshToken = await storage.getRefreshToken();

      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      if (__DEV__) {
        console.log('🔄 Refreshing access token...');
      }

      const result = await authService.refreshToken(refreshToken);

      if (!result.success) {
        throw new Error('Token refresh failed');
      }

      // Save new token
      await storage.setToken(result.access);

      if (__DEV__) {
        console.log('✅ Access token refreshed');
      }

      return result.access;
    } catch (error) {
      console.error('❌ Token refresh error:', error);
      await logout();
      throw error;
    }
  };

  // ============================================================
  // UPDATE USER
  // ============================================================

  /**
   * Update user data (for profile changes)
   * @param {Object} updatedData - Updated user data
   * @returns {Promise<Object>} Update result
   */
  const updateUser = async (updatedData) => {
    try {
      if (__DEV__) {
        console.log('📝 Updating user data...');
      }

      // Merge with existing user data
      const updatedUser = { ...user, ...updatedData };

      // Save to storage
      await storage.setUserData(updatedUser);

      // Update state
      setUser(updatedUser);

      if (__DEV__) {
        console.log('✅ User data updated');
      }

      return { success: true };
    } catch (error) {
      console.error('❌ Update user error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  };

  // ============================================================
  // REGISTER
  // ============================================================

  /**
   * Register new user
   * @param {Object} userData - Registration data
   * @returns {Promise<Object>} Registration result
   */
  const register = async (userData) => {
    try {
      setIsLoading(true);

      if (__DEV__) {
        console.log('📝 Registering new user:', userData.username);
      }

      // Call backend registration
      const result = await authService.register(userData);

      if (!result.success) {
        if (__DEV__) {
          console.log('❌ Registration failed:', result.message);
        }
        return {
          success: false,
          message: result.message || 'Registration failed',
          errors: result.errors,
        };
      }

      // Store tokens and user data (same as login)
      await storage.setToken(result.access);
      await storage.setRefreshToken(result.refresh);
      await storage.setUserData(result.user);

      // Update state
      setUser(result.user);
      setUserRole(getUserRole(result.user));
      setIsAuthenticated(true);

      if (__DEV__) {
        console.log('✅ Registration successful:', result.user.username);
      }

      return {
        success: true,
        message: result.message,
      };
    } catch (error) {
      console.error('❌ Registration error:', error);
      return {
        success: false,
        message: 'An error occurred during registration',
      };
    } finally {
      setIsLoading(false);
    }
  };

  // ============================================================
  // CONTEXT VALUE
  // ============================================================

  const value = {
    // State
    user,
    userRole,
    isLoading,
    isAuthenticated,

    // Methods
    login,
    logout,
    register,
    updateUser,
    refreshAccessToken,
    checkAuthStatus,

    // Helpers
    getUserRole,
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================================
// EXPORTS
// ============================================================

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;