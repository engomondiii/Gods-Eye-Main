import api from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * QR Code Service
 * Handles QR code generation and validation
 */
class QRCodeService {
  constructor() {
    this.STORAGE_KEY = '@qr_codes';
    this.CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours
  }

  /**
   * Generate QR code for a student
   * @param {string} studentId - Student ID
   * @param {Object} options - Generation options
   */
  async generateQRCode(studentId, options = {}) {
    try {
      const payload = {
        student_id: studentId,
        expires_at: options.expiresAt || null,
        single_use: options.singleUse || false,
        metadata: options.metadata || {},
      };

      const response = await api.post('/qrcode/generate', payload);

      // Cache the QR code locally
      await this.cacheQRCode(studentId, response.data);

      return response.data;
    } catch (error) {
      console.error('Generate QR code error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate QR code
   * @param {string} qrCode - QR code string
   */
  async validateQRCode(qrCode) {
    try {
      const response = await api.post('/qrcode/validate', {
        qr_code: qrCode,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Validate QR code error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Scan and process QR code for attendance
   * @param {string} qrCode - Scanned QR code
   * @param {string} attendanceType - check_in or check_out
   */
  async scanQRCode(qrCode, attendanceType = 'check_in') {
    try {
      // First validate the QR code
      const validation = await this.validateQRCode(qrCode);

      if (!validation.valid) {
        throw new Error(validation.message || 'Invalid QR code');
      }

      // Create attendance record
      const response = await api.post('/qrcode/scan', {
        qr_code: qrCode,
        attendance_type: attendanceType,
        timestamp: new Date().toISOString(),
      });

      return response.data;
    } catch (error) {
      console.error('Scan QR code error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get QR code for a student
   * @param {string} studentId - Student ID
   * @param {boolean} forceRefresh - Force API call even if cached
   */
  async getQRCode(studentId, forceRefresh = false) {
    try {
      // Check cache first
      if (!forceRefresh) {
        const cached = await this.getCachedQRCode(studentId);
        if (cached && !this.isCacheExpired(cached)) {
          return cached.data;
        }
      }

      // Fetch from API
      const response = await api.get(`/students/${studentId}/qrcode`);

      // Cache the result
      await this.cacheQRCode(studentId, response.data);

      return response.data;
    } catch (error) {
      console.error('Get QR code error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Regenerate QR code for a student
   * @param {string} studentId - Student ID
   * @param {string} reason - Reason for regeneration
   */
  async regenerateQRCode(studentId, reason = '') {
    try {
      const response = await api.post(`/students/${studentId}/qrcode/regenerate`, {
        reason,
        timestamp: new Date().toISOString(),
      });

      // Update cache
      await this.cacheQRCode(studentId, response.data);

      // Invalidate old QR code
      await this.invalidateCachedQRCode(studentId);

      return response.data;
    } catch (error) {
      console.error('Regenerate QR code error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Revoke QR code
   * @param {string} studentId - Student ID
   */
  async revokeQRCode(studentId) {
    try {
      const response = await api.delete(`/students/${studentId}/qrcode`);

      // Remove from cache
      await this.removeCachedQRCode(studentId);

      return response.data;
    } catch (error) {
      console.error('Revoke QR code error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get QR code usage history
   * @param {string} studentId - Student ID
   * @param {Object} filters - Filter options
   */
  async getQRCodeHistory(studentId, filters = {}) {
    try {
      const params = {
        start_date: filters.startDate || null,
        end_date: filters.endDate || null,
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      const response = await api.get(`/students/${studentId}/qrcode/history`, { params });
      return response.data;
    } catch (error) {
      console.error('Get QR code history error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get QR code statistics
   * @param {string} studentId - Student ID
   */
  async getQRCodeStats(studentId) {
    try {
      const response = await api.get(`/students/${studentId}/qrcode/statistics`);
      return response.data;
    } catch (error) {
      console.error('Get QR code stats error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Verify QR code integrity
   * @param {string} qrCode - QR code to verify
   */
  async verifyIntegrity(qrCode) {
    try {
      const response = await api.post('/qrcode/verify-integrity', {
        qr_code: qrCode,
      });
      return response.data;
    } catch (error) {
      console.error('Verify integrity error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Parse QR code data
   * @param {string} qrCode - QR code string
   */
  parseQRCode(qrCode) {
    try {
      // Expected format: GE-{studentId}-{timestamp}
      const parts = qrCode.split('-');
      
      if (parts.length < 3 || parts[0] !== 'GE') {
        return {
          valid: false,
          error: 'Invalid QR code format',
        };
      }

      return {
        valid: true,
        studentId: parts[1],
        timestamp: parts[2],
        data: qrCode,
      };
    } catch (error) {
      return {
        valid: false,
        error: 'Failed to parse QR code',
      };
    }
  }

  /**
   * Cache QR code locally
   * @param {string} studentId - Student ID
   * @param {Object} data - QR code data
   */
  async cacheQRCode(studentId, data) {
    try {
      const cacheData = {
        studentId,
        data,
        cachedAt: new Date().toISOString(),
      };

      const key = `${this.STORAGE_KEY}_${studentId}`;
      await AsyncStorage.setItem(key, JSON.stringify(cacheData));
    } catch (error) {
      console.error('Cache QR code error:', error);
    }
  }

  /**
   * Get cached QR code
   * @param {string} studentId - Student ID
   */
  async getCachedQRCode(studentId) {
    try {
      const key = `${this.STORAGE_KEY}_${studentId}`;
      const cached = await AsyncStorage.getItem(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.error('Get cached QR code error:', error);
      return null;
    }
  }

  /**
   * Check if cache is expired
   * @param {Object} cached - Cached data
   */
  isCacheExpired(cached) {
    if (!cached || !cached.cachedAt) return true;
    
    const cachedTime = new Date(cached.cachedAt).getTime();
    const now = new Date().getTime();
    
    return now - cachedTime > this.CACHE_DURATION;
  }

  /**
   * Invalidate cached QR code
   * @param {string} studentId - Student ID
   */
  async invalidateCachedQRCode(studentId) {
    try {
      const key = `${this.STORAGE_KEY}_${studentId}`;
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Invalidate cached QR code error:', error);
    }
  }

  /**
   * Remove cached QR code
   * @param {string} studentId - Student ID
   */
  async removeCachedQRCode(studentId) {
    return this.invalidateCachedQRCode(studentId);
  }

  /**
   * Clear all cached QR codes
   */
  async clearAllCache() {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const qrCodeKeys = keys.filter(key => key.startsWith(this.STORAGE_KEY));
      await AsyncStorage.multiRemove(qrCodeKeys);
    } catch (error) {
      console.error('Clear all cache error:', error);
    }
  }

  /**
   * Download QR code image
   * @param {string} qrCode - QR code data
   * @param {Object} options - Download options
   */
  async downloadQRCode(qrCode, options = {}) {
    try {
      const response = await api.post(
        '/qrcode/download',
        {
          qr_code: qrCode,
          format: options.format || 'png',
          size: options.size || 512,
        },
        {
          responseType: 'blob',
        }
      );

      return response.data;
    } catch (error) {
      console.error('Download QR code error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Share QR code
   * @param {string} studentId - Student ID
   * @param {Object} options - Share options
   */
  async shareQRCode(studentId, options = {}) {
    try {
      const response = await api.post(`/students/${studentId}/qrcode/share`, {
        method: options.method || 'email',
        recipient: options.recipient || null,
        message: options.message || null,
      });

      return response.data;
    } catch (error) {
      console.error('Share QR code error:', error);
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
          return new Error(data.message || 'Invalid QR code data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('QR code access denied');
        case 404:
          return new Error('QR code not found');
        case 409:
          return new Error('QR code already exists');
        case 410:
          return new Error('QR code has expired');
        case 422:
          return new Error(data.message || 'QR code validation failed');
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

export default new QRCodeService();