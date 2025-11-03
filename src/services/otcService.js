import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { OTC_CONFIG } from '../utils/constants';

/**
 * One-Time Code (OTC) Service
 * Handles generation and validation of one-time attendance codes
 */
class OTCService {
  constructor() {
    this.STORAGE_KEY = '@otc_codes';
    this.CODE_LENGTH = OTC_CONFIG.LENGTH || 6;
    this.EXPIRY_MINUTES = OTC_CONFIG.EXPIRY_MINUTES || 5;
  }

  /**
   * Generate one-time code for a student
   * @param {string} studentId - Student ID
   * @param {Object} options - Generation options
   */
  async generateOTC(studentId, options = {}) {
    try {
      const payload = {
        student_id: studentId,
        expiry_minutes: options.expiryMinutes || this.EXPIRY_MINUTES,
        purpose: options.purpose || 'attendance',
      };

      const response = await api.post('/otc/generate', payload);

      // Cache the code locally
      await this.cacheOTC(studentId, response.data);

      return response.data;
    } catch (error) {
      console.error('Generate OTC error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate one-time code
   * @param {string} code - OTC to validate
   * @param {string} studentId - Optional student ID for verification
   */
  async validateOTC(code, studentId = null) {
    try {
      const response = await api.post('/otc/validate', {
        code,
        student_id: studentId,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Validate OTC error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Submit OTC for attendance
   * @param {string} code - OTC code
   * @param {string} attendanceType - check_in or check_out
   */
  async submitOTC(code, attendanceType = 'check_in') {
    try {
      // First validate the code
      const validation = await this.validateOTC(code);

      if (!validation.valid) {
        throw new Error(validation.message || 'Invalid or expired code');
      }

      // Create attendance record
      const response = await api.post('/otc/submit', {
        code,
        attendance_type: attendanceType,
        timestamp: new Date().toISOString(),
      });

      // Remove from cache after successful use
      if (validation.student_id) {
        await this.removeCachedOTC(validation.student_id);
      }

      return response.data;
    } catch (error) {
      console.error('Submit OTC error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get active OTC for a student
   * @param {string} studentId - Student ID
   */
  async getActiveOTC(studentId) {
    try {
      // Check cache first
      const cached = await this.getCachedOTC(studentId);
      if (cached && !this.isOTCExpired(cached)) {
        return cached.data;
      }

      // Fetch from API
      const response = await api.get(`/students/${studentId}/otc/active`);

      // Cache the result
      if (response.data) {
        await this.cacheOTC(studentId, response.data);
      }

      return response.data;
    } catch (error) {
      console.error('Get active OTC error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Revoke OTC
   * @param {string} studentId - Student ID
   * @param {string} code - Optional specific code to revoke
   */
  async revokeOTC(studentId, code = null) {
    try {
      const response = await api.delete(`/students/${studentId}/otc`, {
        data: { code },
      });

      // Remove from cache
      await this.removeCachedOTC(studentId);

      return response.data;
    } catch (error) {
      console.error('Revoke OTC error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get OTC usage history
   * @param {string} studentId - Student ID
   * @param {Object} filters - Filter options
   */
  async getOTCHistory(studentId, filters = {}) {
    try {
      const params = {
        start_date: filters.startDate || null,
        end_date: filters.endDate || null,
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      const response = await api.get(`/students/${studentId}/otc/history`, { params });
      return response.data;
    } catch (error) {
      console.error('Get OTC history error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get OTC statistics
   * @param {string} studentId - Student ID
   */
  async getOTCStats(studentId) {
    try {
      const response = await api.get(`/students/${studentId}/otc/statistics`);
      return response.data;
    } catch (error) {
      console.error('Get OTC stats error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify OTC integrity (check if code format is valid)
   * @param {string} code - Code to verify
   */
  verifyCodeFormat(code) {
    if (!code || typeof code !== 'string') {
      return {
        valid: false,
        error: 'Invalid code format',
      };
    }

    // Remove any spaces or dashes
    const cleanCode = code.replace(/[\s-]/g, '');

    // Check length
    if (cleanCode.length !== this.CODE_LENGTH) {
      return {
        valid: false,
        error: `Code must be ${this.CODE_LENGTH} digits`,
      };
    }

    // Check if all characters are digits
    if (!/^\d+$/.test(cleanCode)) {
      return {
        valid: false,
        error: 'Code must contain only numbers',
      };
    }

    return {
      valid: true,
      code: cleanCode,
    };
  }

  /**
   * Generate local OTC (for offline use - needs sync later)
   * @param {string} studentId - Student ID
   */
  generateLocalOTC(studentId) {
    const code = Math.floor(
      Math.pow(10, this.CODE_LENGTH - 1) +
      Math.random() * (Math.pow(10, this.CODE_LENGTH) - Math.pow(10, this.CODE_LENGTH - 1))
    ).toString();

    const otcData = {
      code,
      student_id: studentId,
      generated_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + this.EXPIRY_MINUTES * 60 * 1000).toISOString(),
      is_local: true,
      synced: false,
    };

    return otcData;
  }

  /**
   * Calculate remaining time for OTC
   * @param {string} expiresAt - Expiration timestamp
   */
  getRemainingTime(expiresAt) {
    const now = new Date().getTime();
    const expiry = new Date(expiresAt).getTime();
    const remaining = Math.max(0, expiry - now);

    return {
      milliseconds: remaining,
      seconds: Math.floor(remaining / 1000),
      minutes: Math.floor(remaining / 60000),
      isExpired: remaining === 0,
    };
  }

  /**
   * Format OTC with separators
   * @param {string} code - Code to format
   */
  formatOTC(code) {
    if (!code) return '';
    
    // Format as XXX-XXX for 6 digits
    const clean = code.replace(/\D/g, '');
    if (clean.length === 6) {
      return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    }
    
    return clean;
  }

  /**
   * Cache OTC locally
   * @param {string} studentId - Student ID
   * @param {Object} data - OTC data
   */
  async cacheOTC(studentId, data) {
    try {
      const cacheData = {
        studentId,
        data,
        cachedAt: new Date().toISOString(),
      };

      const key = `${this.STORAGE_KEY}_${studentId}`;
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache OTC error:', error);
    }
  }

  /**
   * Get cached OTC
   * @param {string} studentId - Student ID
   */
  async getCachedOTC(studentId) {
    try {
      const key = `${this.STORAGE_KEY}_${studentId}`;
      const cached = await AsyncStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Get cached OTC error:', error);
      return null;
    }
  }

  /**
   * Check if OTC is expired
   * @param {Object} cached - Cached OTC data
   */
  isOTCExpired(cached) {
    if (!cached || !cached.data || !cached.data.expires_at) return true;
    
    const expiryTime = new Date(cached.data.expires_at).getTime();
    const now = new Date().getTime();
    
    return now > expiryTime;
  }

  /**
   * Remove cached OTC
   * @param {string} studentId - Student ID
   */
  async removeCachedOTC(studentId) {
    try {
      const key = `${this.STORAGE_KEY}_${studentId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Remove cached OTC error:', error);
    }
  }

  /**
   * Clear all cached OTCs
   */
  async clearAllCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const otcKeys = keys.filter(key => key.startsWith(this.STORAGE_KEY));
      await AsyncStorage.multiRemove(otcKeys);
    } catch (error) {
      console.error('Clear all cache error:', error);
    }
  }

  /**
   * Send OTC via SMS
   * @param {string} studentId - Student ID
   * @param {string} phoneNumber - Phone number
   */
  async sendOTCViaSMS(studentId, phoneNumber) {
    try {
      const response = await api.post(`/students/${studentId}/otc/send-sms`, {
        phone_number: phoneNumber,
      });

      return response.data;
    } catch (error) {
      console.error('Send OTC via SMS error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Send OTC via Email
   * @param {string} studentId - Student ID
   * @param {string} email - Email address
   */
  async sendOTCViaEmail(studentId, email) {
    try {
      const response = await api.post(`/students/${studentId}/otc/send-email`, {
        email,
      });

      return response.data;
    } catch (error) {
      console.error('Send OTC via email error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Handle API errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          return new Error(data.message || 'Invalid OTC data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('OTC access denied');
        case 404:
          return new Error('OTC not found');
        case 409:
          return new Error('Active OTC already exists');
        case 410:
          return new Error('OTC has expired');
        case 422:
          return new Error(data.message || 'Invalid or expired code');
        case 429:
          return new Error('Too many attempts. Please try again later');
        case 500:
          return new Error('Server error. Please try again later');
        default:
          return new Error(data.message || 'An error occurred');
      }
    } else if (error.request) {
      return new Error('Network error. Please check your connection');
    } else {
      return new Error(error.message || 'An unexpected error occurred');
    }
  }
}

export default new OTCService();