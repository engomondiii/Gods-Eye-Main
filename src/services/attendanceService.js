import api from './api';
import { ATTENDANCE_TYPES, ATTENDANCE_METHODS } from '../utils/constants';

/**
 * Attendance Service
 * Handles all attendance-related API calls
 */
class AttendanceService {
  /**
   * Get dashboard data with statistics and recent records
   */
  async getDashboardData() {
    try {
      const response = await api.get('/attendance/dashboard');
      return response.data;
    } catch (error) {
      console.error('Get dashboard data error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create attendance record (check-in/check-out)
   * @param {Object} data - Attendance data
   * @param {string} data.studentId - Student ID
   * @param {string} data.type - check_in or check_out
   * @param {string} data.method - Method used (qr_code, fingerprint, etc)
   * @param {string} data.notes - Optional notes
   */
  async createAttendance(data) {
    try {
      const payload = {
        student_id: data.studentId,
        attendance_type: data.type || ATTENDANCE_TYPES.CHECK_IN,
        method: data.method || ATTENDANCE_METHODS.MANUAL,
        timestamp: data.timestamp || new Date().toISOString(),
        notes: data.notes || '',
        location: data.location || null,
      };

      const response = await api.post('/attendance', payload);
      return response.data;
    } catch (error) {
      console.error('Create attendance error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Check in student
   * @param {Object} data - Check-in data
   */
  async checkIn(data) {
    return this.createAttendance({
      ...data,
      type: ATTENDANCE_TYPES.CHECK_IN,
    });
  }

  /**
   * Check out student
   * @param {Object} data - Check-out data
   */
  async checkOut(data) {
    return this.createAttendance({
      ...data,
      type: ATTENDANCE_TYPES.CHECK_OUT,
    });
  }

  /**
   * Get attendance history with filters
   * @param {Object} filters - Filter options
   * @param {string} filters.startDate - Start date
   * @param {string} filters.endDate - End date
   * @param {string} filters.studentId - Student ID
   * @param {string} filters.method - Attendance method
   * @param {number} filters.page - Page number
   * @param {number} filters.limit - Items per page
   */
  async getHistory(filters = {}) {
    try {
      const params = {
        start_date: filters.startDate || null,
        end_date: filters.endDate || null,
        student_id: filters.studentId || null,
        method: filters.method || null,
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      const response = await api.get('/attendance/history', { params });
      return response.data;
    } catch (error) {
      console.error('Get attendance history error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance record by ID
   * @param {string} id - Record ID
   */
  async getById(id) {
    try {
      const response = await api.get(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get attendance by ID error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get student attendance records
   * @param {string} studentId - Student ID
   * @param {Object} filters - Filter options
   */
  async getStudentAttendance(studentId, filters = {}) {
    try {
      const params = {
        start_date: filters.startDate || null,
        end_date: filters.endDate || null,
        page: filters.page || 1,
        limit: filters.limit || 20,
      };

      const response = await api.get(`/students/${studentId}/attendance`, { params });
      return response.data;
    } catch (error) {
      console.error('Get student attendance error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance statistics
   * @param {Object} filters - Filter options
   * @param {string} filters.startDate - Start date
   * @param {string} filters.endDate - End date
   * @param {string} filters.classId - Class ID
   */
  async getStatistics(filters = {}) {
    try {
      const params = {
        start_date: filters.startDate || null,
        end_date: filters.endDate || null,
        class_id: filters.classId || null,
      };

      const response = await api.get('/attendance/statistics', { params });
      return response.data;
    } catch (error) {
      console.error('Get attendance statistics error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance report data
   * @param {string} period - Report period (today, week, month)
   * @param {Object} options - Additional options
   */
  async getReportData(period = 'today', options = {}) {
    try {
      const params = {
        period,
        class_id: options.classId || null,
        include_trends: options.includeTrends !== false,
        include_methods: options.includeMethods !== false,
      };

      const response = await api.get('/attendance/reports', { params });
      return response.data;
    } catch (error) {
      console.error('Get report data error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Create manual attendance entry
   * @param {Object} data - Manual entry data
   * @param {Array} data.studentIds - Array of student IDs
   * @param {string} data.type - check_in or check_out
   * @param {string} data.notes - Notes
   */
  async createManualEntry(data) {
    try {
      const payload = {
        student_ids: data.studentIds,
        attendance_type: data.type || ATTENDANCE_TYPES.CHECK_IN,
        method: ATTENDANCE_METHODS.MANUAL,
        timestamp: data.timestamp || new Date().toISOString(),
        notes: data.notes || '',
      };

      const response = await api.post('/attendance/manual', payload);
      return response.data;
    } catch (error) {
      console.error('Create manual entry error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Update attendance record
   * @param {string} id - Record ID
   * @param {Object} data - Update data
   */
  async updateAttendance(id, data) {
    try {
      const payload = {
        notes: data.notes,
        status: data.status,
      };

      const response = await api.put(`/attendance/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Update attendance error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete attendance record
   * @param {string} id - Record ID
   */
  async deleteAttendance(id) {
    try {
      const response = await api.delete(`/attendance/${id}`);
      return response.data;
    } catch (error) {
      console.error('Delete attendance error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance calendar data for a month
   * @param {string} studentId - Student ID
   * @param {string} month - Month (YYYY-MM format)
   */
  async getCalendarData(studentId, month) {
    try {
      const response = await api.get(`/students/${studentId}/attendance/calendar`, {
        params: { month },
      });
      return response.data;
    } catch (error) {
      console.error('Get calendar data error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance summary for a date range
   * @param {string} studentId - Student ID
   * @param {string} startDate - Start date
   * @param {string} endDate - End date
   */
  async getSummary(studentId, startDate, endDate) {
    try {
      const response = await api.get(`/students/${studentId}/attendance/summary`, {
        params: { start_date: startDate, end_date: endDate },
      });
      return response.data;
    } catch (error) {
      console.error('Get attendance summary error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Export attendance records
   * @param {Object} filters - Export filters
   * @param {string} format - Export format (csv, pdf, excel)
   */
  async exportRecords(filters = {}, format = 'csv') {
    try {
      const params = {
        ...filters,
        format,
      };

      const response = await api.get('/attendance/export', {
        params,
        responseType: 'blob',
      });
      
      return response.data;
    } catch (error) {
      console.error('Export records error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Validate attendance time (check if within allowed hours)
   * @param {string} type - check_in or check_out
   */
  async validateAttendanceTime(type) {
    try {
      const response = await api.post('/attendance/validate-time', {
        attendance_type: type,
        timestamp: new Date().toISOString(),
      });
      return response.data;
    } catch (error) {
      console.error('Validate attendance time error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get recent attendance activity
   * @param {number} limit - Number of records to fetch
   */
  async getRecentActivity(limit = 10) {
    try {
      const response = await api.get('/attendance/recent', {
        params: { limit },
      });
      return response.data;
    } catch (error) {
      console.error('Get recent activity error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance trends
   * @param {Object} options - Options
   * @param {string} options.period - Period (week, month, year)
   * @param {string} options.classId - Class ID
   */
  async getTrends(options = {}) {
    try {
      const params = {
        period: options.period || 'week',
        class_id: options.classId || null,
      };

      const response = await api.get('/attendance/trends', { params });
      return response.data;
    } catch (error) {
      console.error('Get attendance trends error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Get attendance by method statistics
   */
  async getMethodStatistics() {
    try {
      const response = await api.get('/attendance/statistics/methods');
      return response.data;
    } catch (error) {
      console.error('Get method statistics error:', error);
      throw this.handleError(error);
    }
  }

  /**
   * Bulk import attendance records
   * @param {Array} records - Array of attendance records
   */
  async bulkImport(records) {
    try {
      const response = await api.post('/attendance/bulk-import', { records });
      return response.data;
    } catch (error) {
      console.error('Bulk import error:', error);
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
          return new Error(data.message || 'Invalid request data');
        case 401:
          return new Error('Authentication required');
        case 403:
          return new Error('You do not have permission to perform this action');
        case 404:
          return new Error('Attendance record not found');
        case 409:
          return new Error(data.message || 'Attendance already recorded');
        case 422:
          return new Error(data.message || 'Validation failed');
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

export default new AttendanceService();