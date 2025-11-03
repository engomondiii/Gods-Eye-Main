import React, { createContext, useState, useEffect } from 'react';
import * as authService from '../services/authService';
import * as storage from '../utils/storage';
import { USER_ROLES } from '../utils/constants';

export const AuthContext = createContext();

// Enable mock mode for development (set to false when backend is ready)
const MOCK_MODE = true;

// Mock users for testing different roles
const MOCK_USERS = {
  teacher: {
    id: 1,
    username: 'teacher',
    email: 'teacher@school.com',
    first_name: 'John',
    last_name: 'Smith',
    is_teacher: true,
    is_guardian: false,
    is_superadmin: false,
  },
  guardian: {
    id: 2,
    username: 'guardian',
    email: 'guardian@example.com',
    first_name: 'Jane',
    last_name: 'Doe',
    is_teacher: false,
    is_guardian: true,
    is_superadmin: false,
  },
  admin: {
    id: 3,
    username: 'admin',
    email: 'admin@system.com',
    first_name: 'Admin',
    last_name: 'User',
    is_teacher: false,
    is_guardian: false,
    is_superadmin: true,
  },
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check if user is logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setIsLoading(true);
      const token = await storage.getToken();
      
      if (token) {
        const userData = await storage.getUserData();
        if (userData) {
          setUser(userData);
          setUserRole(getUserRole(userData));
          setIsAuthenticated(true);
        } else {
          // Token exists but no user data, clear everything
          await logout();
        }
      }
    } catch (error) {
      console.error('Check auth status error:', error);
      await logout();
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = (userData) => {
    if (userData.is_superadmin) return USER_ROLES.SUPER_ADMIN;
    if (userData.is_teacher) return USER_ROLES.TEACHER;
    if (userData.is_guardian) return USER_ROLES.GUARDIAN;
    return null;
  };

  const login = async (username, password) => {
    try {
      // MOCK MODE: Use mock data for development
      if (MOCK_MODE) {
        return await mockLogin(username, password);
      }

      // REAL MODE: Connect to backend
      const response = await authService.login(username, password);
      const { access, refresh, user: userData } = response;

      // Store tokens and user data
      await storage.setToken(access);
      await storage.setRefreshToken(refresh);
      await storage.setUserData(userData);

      setUser(userData);
      setUserRole(getUserRole(userData));
      setIsAuthenticated(true);

      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      return {
        success: false,
        message: error.response?.data?.detail || 'Invalid credentials',
      };
    }
  };

  const mockLogin = async (username, password) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Determine which mock user to use based on username
      let mockUser;
      const lowerUsername = username.toLowerCase();

      if (lowerUsername.includes('teacher') || lowerUsername === 'teacher') {
        mockUser = MOCK_USERS.teacher;
      } else if (lowerUsername.includes('guardian') || lowerUsername === 'guardian') {
        mockUser = MOCK_USERS.guardian;
      } else if (lowerUsername.includes('admin') || lowerUsername === 'admin') {
        mockUser = MOCK_USERS.admin;
      } else {
        // Default to teacher for any other username
        mockUser = MOCK_USERS.teacher;
      }

      // Mock tokens
      const mockToken = 'mock_access_token_' + Date.now();
      const mockRefreshToken = 'mock_refresh_token_' + Date.now();

      // Store tokens and user data
      await storage.setToken(mockToken);
      await storage.setRefreshToken(mockRefreshToken);
      await storage.setUserData(mockUser);

      setUser(mockUser);
      setUserRole(getUserRole(mockUser));
      setIsAuthenticated(true);

      console.log('Mock login successful:', { username, role: getUserRole(mockUser) });

      return { success: true };
    } catch (error) {
      console.error('Mock login error:', error);
      return {
        success: false,
        message: 'Login failed. Please try again.',
      };
    }
  };

  const logout = async () => {
    try {
      // Clear all stored data
      await storage.clearAll();
      
      setUser(null);
      setUserRole(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const updateUser = async (updatedData) => {
    try {
      const updatedUser = { ...user, ...updatedData };
      await storage.setUserData(updatedUser);
      setUser(updatedUser);
      return { success: true };
    } catch (error) {
      console.error('Update user error:', error);
      return { success: false, error: error.message };
    }
  };

  const refreshToken = async () => {
    try {
      if (MOCK_MODE) {
        // Mock token refresh
        const mockToken = 'mock_access_token_refreshed_' + Date.now();
        await storage.setToken(mockToken);
        return mockToken;
      }

      const refreshTokenValue = await storage.getRefreshToken();
      if (!refreshTokenValue) {
        throw new Error('No refresh token available');
      }

      const response = await authService.refreshToken(refreshTokenValue);
      await storage.setToken(response.access);
      return response.access;
    } catch (error) {
      console.error('Refresh token error:', error);
      await logout();
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    isLoading,
    isAuthenticated,
    login,
    logout,
    updateUser,
    refreshToken,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};