// ========================================
// GOD'S EYE EDTECH - AUTHENTICATION SERVICE
// ========================================

import { post, get, handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';
import * as storage from '../utils/storage';

// ============================================================
// AUTHENTICATION FUNCTIONS
// ============================================================

/**
 * Login user with username and password
 * @param {string} username - User's username
 * @param {string} password - User's password
 * @returns {Promise<Object>} Login response with tokens and user data
 * 
 * Backend Endpoint: POST /api/auth/login/
 * Backend Response:
 * {
 *   "user": {
 *     "id": 1,
 *     "username": "teacher",
 *     "email": "teacher@school.com",
 *     "first_name": "Mary",
 *     "middle_name": "",
 *     "last_name": "Ochieng",
 *     "phone": "+254712345678",
 *     "profile_photo": null,
 *     "bio": "",
 *     "is_superadmin": false,
 *     "is_school_admin": false,
 *     "is_teacher": true,
 *     "is_guardian": false,
 *     "school": 1,
 *     "school_data": {
 *       "id": 1,
 *       "name": "Nairobi Primary School",
 *       "nemis_code": "001234567",
 *       "county": "Nairobi",
 *       "approval_status": "approved",
 *       "is_active": true
 *     },
 *     "role": "teacher",
 *     "role_display": "Teacher",
 *     "is_active": true,
 *     "date_joined": "2025-01-01T00:00:00Z",
 *     "last_login": "2025-01-15T10:30:00Z"
 *   },
 *   "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
 *   "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc...",
 *   "message": "Login successful"
 * }
 */
export const login = async (username, password) => {
  try {
    if (!username || !password) {
      throw new Error('Username and password are required');
    }

    if (__DEV__) {
      console.log('🔐 Attempting login for:', username);
    }

    const response = await post(API_ENDPOINTS.AUTH.LOGIN, {
      username: username.trim(),
      password,
    });

    if (__DEV__) {
      console.log('✅ Login successful:', {
        user: response.user.username,
        role: response.user.role,
        hasTokens: !!(response.access && response.refresh),
      });
    }

    return {
      success: true,
      user: response.user,
      access: response.access,
      refresh: response.refresh,
      message: response.message || 'Login successful',
    };
  } catch (error) {
    console.error('❌ Login error:', error);

    const errorData = handleApiError(error);

    return {
      success: false,
      message: errorData.message || 'Login failed. Please check your credentials.',
      error: errorData,
    };
  }
};

/**
 * Logout user and blacklist refresh token
 * @param {string} refreshToken - User's refresh token
 * @returns {Promise<Object>} Logout response
 * 
 * Backend Endpoint: POST /api/auth/logout/
 * Backend Request Body:
 * {
 *   "refresh": "refresh_token_here"
 * }
 */
export const logout = async (refreshToken) => {
  try {
    if (__DEV__) {
      console.log('🚪 Attempting logout...');
    }

    if (refreshToken) {
      // Try to blacklist token on backend
      await post(API_ENDPOINTS.AUTH.LOGOUT, {
        refresh: refreshToken,
      });
    }

    if (__DEV__) {
      console.log('✅ Logout successful');
    }

    return {
      success: true,
      message: 'Logout successful',
    };
  } catch (error) {
    console.error('❌ Logout error:', error);

    // Even if backend logout fails, we still want to clear local data
    // So we return success
    return {
      success: true,
      message: 'Logged out locally',
      error: handleApiError(error),
    };
  }
};

/**
 * Refresh access token using refresh token
 * @param {string} refreshToken - User's refresh token
 * @returns {Promise<Object>} New access token
 * 
 * Backend Endpoint: POST /api/auth/token/refresh/
 * Backend Request Body:
 * {
 *   "refresh": "refresh_token_here"
 * }
 * Backend Response:
 * {
 *   "access": "new_access_token_here"
 * }
 */
export const refreshToken = async (refreshToken) => {
  try {
    if (!refreshToken) {
      throw new Error('Refresh token is required');
    }

    if (__DEV__) {
      console.log('🔄 Refreshing access token...');
    }

    const response = await post(API_ENDPOINTS.AUTH.REFRESH_TOKEN, {
      refresh: refreshToken,
    });

    if (__DEV__) {
      console.log('✅ Token refreshed successfully');
    }

    return {
      success: true,
      access: response.access,
    };
  } catch (error) {
    console.error('❌ Refresh token error:', error);

    return {
      success: false,
      message: 'Failed to refresh token. Please login again.',
      error: handleApiError(error),
    };
  }
};

/**
 * Get current logged-in user data
 * @returns {Promise<Object>} Current user data
 * 
 * Backend Endpoint: GET /api/auth/me/
 * Backend Response: Same structure as login user object
 */
export const getCurrentUser = async () => {
  try {
    if (__DEV__) {
      console.log('👤 Fetching current user...');
    }

    const response = await get(API_ENDPOINTS.AUTH.ME);

    if (__DEV__) {
      console.log('✅ Current user fetched:', {
        user: response.username,
        role: response.role,
      });
    }

    return {
      success: true,
      user: response,
    };
  } catch (error) {
    console.error('❌ Get current user error:', error);

    return {
      success: false,
      message: 'Failed to fetch user data',
      error: handleApiError(error),
    };
  }
};

/**
 * Register new user
 * @param {Object} userData - User registration data
 * @returns {Promise<Object>} Registration response
 * 
 * Backend Endpoint: POST /api/auth/register/
 * Backend Request Body:
 * {
 *   "username": "string",
 *   "email": "string",
 *   "password": "string",
 *   "password2": "string",
 *   "first_name": "string",
 *   "middle_name": "string",
 *   "last_name": "string",
 *   "phone": "+254XXXXXXXXX",
 *   "is_teacher": true/false,
 *   "is_guardian": true/false,
 *   "is_school_admin": true/false,
 *   "school": 1
 * }
 */
export const register = async (userData) => {
  try {
    if (!userData.username || !userData.email || !userData.password) {
      throw new Error('Username, email, and password are required');
    }

    if (__DEV__) {
      console.log('📝 Attempting registration for:', userData.username);
    }

    const response = await post(API_ENDPOINTS.AUTH.REGISTER, userData);

    if (__DEV__) {
      console.log('✅ Registration successful:', response.user.username);
    }

    return {
      success: true,
      user: response.user,
      access: response.access,
      refresh: response.refresh,
      message: response.message || 'Registration successful',
    };
  } catch (error) {
    console.error('❌ Registration error:', error);

    const errorData = handleApiError(error);

    return {
      success: false,
      message: errorData.message || 'Registration failed',
      errors: errorData.errors,
      error: errorData,
    };
  }
};

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {Promise<Object>} Verification response
 * 
 * Backend Endpoint: POST /api/auth/token/verify/
 */
export const verifyToken = async (token) => {
  try {
    if (!token) {
      throw new Error('Token is required');
    }

    await post(API_ENDPOINTS.AUTH.VERIFY_TOKEN, {
      token,
    });

    return {
      success: true,
      message: 'Token is valid',
    };
  } catch (error) {
    console.error('❌ Token verification error:', error);

    return {
      success: false,
      message: 'Invalid token',
      error: handleApiError(error),
    };
  }
};

/**
 * Change user password
 * @param {string} oldPassword - Current password
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Password change response
 * 
 * Backend Endpoint: POST /api/auth/change-password/
 */
export const changePassword = async (oldPassword, newPassword) => {
  try {
    if (!oldPassword || !newPassword) {
      throw new Error('Old password and new password are required');
    }

    if (__DEV__) {
      console.log('🔑 Attempting password change...');
    }

    const response = await post(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, {
      old_password: oldPassword,
      new_password: newPassword,
      new_password2: newPassword,
    });

    if (__DEV__) {
      console.log('✅ Password changed successfully');
    }

    return {
      success: true,
      message: response.message || 'Password changed successfully',
    };
  } catch (error) {
    console.error('❌ Change password error:', error);

    const errorData = handleApiError(error);

    return {
      success: false,
      message: errorData.message || 'Failed to change password',
      errors: errorData.errors,
      error: errorData,
    };
  }
};

/**
 * Request password reset
 * @param {string} email - User's email
 * @returns {Promise<Object>} Password reset response
 * 
 * Backend Endpoint: POST /api/auth/reset-password/
 */
export const resetPassword = async (email) => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }

    if (__DEV__) {
      console.log('📧 Requesting password reset for:', email);
    }

    const response = await post(API_ENDPOINTS.AUTH.PASSWORD_RESET, {
      email,
    });

    if (__DEV__) {
      console.log('✅ Password reset email sent');
    }

    return {
      success: true,
      message: response.message || 'Password reset email sent',
    };
  } catch (error) {
    console.error('❌ Reset password error:', error);

    const errorData = handleApiError(error);

    return {
      success: false,
      message: errorData.message || 'Failed to send reset email',
      error: errorData,
    };
  }
};

/**
 * Confirm password reset with token
 * @param {string} token - Reset token
 * @param {string} newPassword - New password
 * @returns {Promise<Object>} Password reset confirmation response
 * 
 * Backend Endpoint: POST /api/auth/reset-password/confirm/
 */
export const resetPasswordConfirm = async (token, newPassword) => {
  try {
    if (!token || !newPassword) {
      throw new Error('Token and new password are required');
    }

    if (__DEV__) {
      console.log('🔐 Confirming password reset...');
    }

    const response = await post(API_ENDPOINTS.AUTH.PASSWORD_RESET_CONFIRM, {
      token,
      new_password: newPassword,
      new_password2: newPassword,
    });

    if (__DEV__) {
      console.log('✅ Password reset confirmed');
    }

    return {
      success: true,
      message: response.message || 'Password reset successfully',
    };
  } catch (error) {
    console.error('❌ Reset password confirm error:', error);

    const errorData = handleApiError(error);

    return {
      success: false,
      message: errorData.message || 'Failed to reset password',
      error: errorData,
    };
  }
};

/**
 * Update user profile
 * @param {Object} profileData - Profile data to update
 * @returns {Promise<Object>} Update response
 * 
 * Backend Endpoint: PATCH /api/auth/profile/
 */
export const updateProfile = async (profileData) => {
  try {
    if (__DEV__) {
      console.log('📝 Updating user profile...');
    }

    const response = await post(API_ENDPOINTS.AUTH.ME, profileData);

    if (__DEV__) {
      console.log('✅ Profile updated successfully');
    }

    return {
      success: true,
      user: response.user,
      message: response.message || 'Profile updated successfully',
    };
  } catch (error) {
    console.error('❌ Update profile error:', error);

    const errorData = handleApiError(error);

    return {
      success: false,
      message: errorData.message || 'Failed to update profile',
      errors: errorData.errors,
      error: errorData,
    };
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  login,
  logout,
  refreshToken,
  getCurrentUser,
  register,
  verifyToken,
  changePassword,
  resetPassword,
  resetPasswordConfirm,
  updateProfile,
};