// ========================================
// GOD'S EYE EDTECH - REPORT SERVICE
// Backend Integration: /api/reports/
// ========================================

import { handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Generate a new report
 * @param {Object} data - Report generation data
 * @returns {Promise<Object>} Generated report response
 */
export const generateReport = async (data) => {
  try {
    if (__DEV__) {
      console.log('📊 Generating report...', data);
    }

    const response = await fetch(API_ENDPOINTS.REPORTS.GENERATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to generate report');
    }

    if (__DEV__) {
      console.log('✅ Report generated:', result.report_id);
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Generate report error:', error);
    return handleApiError(error);
  }
};

/**
 * Get list of reports
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Reports list
 */
export const getReports = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      report_type = null,
      report_format = null,
      school = null,
    } = params;

    if (__DEV__) {
      console.log('📋 Fetching reports...', params);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (report_type) queryParams.append('report_type', report_type);
    if (report_format) queryParams.append('report_format', report_format);
    if (school) queryParams.append('school', school);

    const response = await fetch(
      `${API_ENDPOINTS.REPORTS.LIST}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch reports');
    }

    if (__DEV__) {
      console.log('✅ Reports fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get reports error:', error);
    return handleApiError(error);
  }
};

/**
 * Get report by ID
 * @param {number} id - Report ID
 * @returns {Promise<Object>} Report details
 */
export const getReportById = async (id) => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching report details...', { id });
    }

    const response = await fetch(API_ENDPOINTS.REPORTS.DETAIL(id), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch report');
    }

    if (__DEV__) {
      console.log('✅ Report details fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get report error:', error);
    return handleApiError(error);
  }
};

/**
 * Download report file
 * @param {number} id - Report ID
 * @returns {Promise<Object>} Download URL or file blob
 */
export const downloadReport = async (id) => {
  try {
    if (__DEV__) {
      console.log('⬇️ Downloading report...', { id });
    }

    const response = await fetch(API_ENDPOINTS.REPORTS.DOWNLOAD(id), {
      method: 'GET',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to download report');
    }

    // For mobile, we'll return the blob URL
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    if (__DEV__) {
      console.log('✅ Report downloaded');
    }

    return {
      success: true,
      data: {
        url: url,
        blob: blob,
      },
    };
  } catch (error) {
    console.error('❌ Download report error:', error);
    return handleApiError(error);
  }
};

/**
 * Delete report
 * @param {number} id - Report ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteReport = async (id) => {
  try {
    if (__DEV__) {
      console.log('🗑️ Deleting report...', { id });
    }

    const response = await fetch(API_ENDPOINTS.REPORTS.DETAIL(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete report');
    }

    if (__DEV__) {
      console.log('✅ Report deleted');
    }

    return {
      success: true,
      message: 'Report deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete report error:', error);
    return handleApiError(error);
  }
};

// ========================================
// SCHEDULED REPORTS
// ========================================

/**
 * Get list of scheduled reports
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Scheduled reports list
 */
export const getScheduledReports = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      report_type = null,
      frequency = null,
      is_active = null,
      school = null,
    } = params;

    if (__DEV__) {
      console.log('📅 Fetching scheduled reports...', params);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (report_type) queryParams.append('report_type', report_type);
    if (frequency) queryParams.append('frequency', frequency);
    if (is_active !== null) queryParams.append('is_active', is_active);
    if (school) queryParams.append('school', school);

    const response = await fetch(
      `${API_ENDPOINTS.REPORTS.SCHEDULED.LIST}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch scheduled reports');
    }

    if (__DEV__) {
      console.log('✅ Scheduled reports fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get scheduled reports error:', error);
    return handleApiError(error);
  }
};

/**
 * Create scheduled report
 * @param {Object} data - Scheduled report data
 * @returns {Promise<Object>} Created scheduled report
 */
export const createScheduledReport = async (data) => {
  try {
    if (__DEV__) {
      console.log('➕ Creating scheduled report...', data);
    }

    const response = await fetch(API_ENDPOINTS.REPORTS.SCHEDULED.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create scheduled report');
    }

    if (__DEV__) {
      console.log('✅ Scheduled report created:', result.id);
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Create scheduled report error:', error);
    return handleApiError(error);
  }
};

/**
 * Update scheduled report
 * @param {number} id - Scheduled report ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated scheduled report
 */
export const updateScheduledReport = async (id, data) => {
  try {
    if (__DEV__) {
      console.log('✏️ Updating scheduled report...', { id, data });
    }

    const response = await fetch(API_ENDPOINTS.REPORTS.SCHEDULED.DETAIL(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update scheduled report');
    }

    if (__DEV__) {
      console.log('✅ Scheduled report updated');
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Update scheduled report error:', error);
    return handleApiError(error);
  }
};

/**
 * Delete scheduled report
 * @param {number} id - Scheduled report ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteScheduledReport = async (id) => {
  try {
    if (__DEV__) {
      console.log('🗑️ Deleting scheduled report...', { id });
    }

    const response = await fetch(API_ENDPOINTS.REPORTS.SCHEDULED.DETAIL(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete scheduled report');
    }

    if (__DEV__) {
      console.log('✅ Scheduled report deleted');
    }

    return {
      success: true,
      message: 'Scheduled report deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete scheduled report error:', error);
    return handleApiError(error);
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Get report type label
 * @param {string} type - Report type
 * @returns {string} Human-readable label
 */
export const getReportTypeLabel = (type) => {
  const labels = {
    attendance: 'Attendance Report',
    payment: 'Payment Report',
    student: 'Student Report',
    academic: 'Academic Report',
    comprehensive: 'Comprehensive Report',
  };
  return labels[type] || type;
};

/**
 * Get report format icon
 * @param {string} format - Report format
 * @returns {string} Icon name
 */
export const getReportFormatIcon = (format) => {
  const icons = {
    pdf: 'file-pdf-box',
    excel: 'file-excel',
    csv: 'file-delimited',
    json: 'code-json',
  };
  return icons[format] || 'file-document';
};

/**
 * Get report format color
 * @param {string} format - Report format
 * @returns {string} Color hex code
 */
export const getReportFormatColor = (format) => {
  const colors = {
    pdf: '#F44336',
    excel: '#4CAF50',
    csv: '#2196F3',
    json: '#FF9800',
  };
  return colors[format] || '#757575';
};

/**
 * Get frequency label
 * @param {string} frequency - Frequency value
 * @returns {string} Human-readable label
 */
export const getFrequencyLabel = (frequency) => {
  const labels = {
    daily: 'Daily',
    weekly: 'Weekly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
  };
  return labels[frequency] || frequency;
};

/**
 * Format generation time
 * @param {number} seconds - Time in seconds
 * @returns {string} Formatted time
 */
export const formatGenerationTime = (seconds) => {
  if (seconds < 1) {
    return `${(seconds * 1000).toFixed(0)}ms`;
  }
  return `${seconds.toFixed(2)}s`;
};

export default {
  // Reports
  generateReport,
  getReports,
  getReportById,
  downloadReport,
  deleteReport,
  // Scheduled Reports
  getScheduledReports,
  createScheduledReport,
  updateScheduledReport,
  deleteScheduledReport,
  // Utilities
  getReportTypeLabel,
  getReportFormatIcon,
  getReportFormatColor,
  getFrequencyLabel,
  formatGenerationTime,
};