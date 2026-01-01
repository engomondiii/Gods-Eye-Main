// ========================================
// GOD'S EYE EDTECH - ANALYTICS SERVICE
// Backend Integration: /api/analytics/
// ========================================

import { handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

/**
 * Get dashboard metrics for a school
 * @param {number} schoolId - School ID (optional for super admin)
 * @returns {Promise<Object>} Dashboard metrics
 */
export const getDashboardMetrics = async (schoolId = null) => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching dashboard metrics...', { schoolId });
    }

    let url = API_ENDPOINTS.ANALYTICS.DASHBOARD.METRICS;
    if (schoolId) {
      url += `?school=${schoolId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch dashboard metrics');
    }

    if (__DEV__) {
      console.log('✅ Dashboard metrics fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get dashboard metrics error:', error);
    return handleApiError(error);
  }
};

/**
 * Get comparative analytics (current vs previous period)
 * @param {string} period - Period type: 'week', 'month', 'year'
 * @param {number} schoolId - School ID (optional for super admin)
 * @returns {Promise<Object>} Comparative analytics
 */
export const getComparativeAnalytics = async (period = 'week', schoolId = null) => {
  try {
    if (__DEV__) {
      console.log('📈 Fetching comparative analytics...', { period, schoolId });
    }

    let url = `${API_ENDPOINTS.ANALYTICS.DASHBOARD.COMPARATIVE}?period=${period}`;
    if (schoolId) {
      url += `&school=${schoolId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch comparative analytics');
    }

    if (__DEV__) {
      console.log('✅ Comparative analytics fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get comparative analytics error:', error);
    return handleApiError(error);
  }
};

/**
 * Get top performers (students)
 * @param {string} metric - Metric type: 'attendance' or 'payment'
 * @param {number} limit - Number of results (default: 10)
 * @param {number} schoolId - School ID (optional for super admin)
 * @returns {Promise<Object>} Top performers list
 */
export const getTopPerformers = async (metric = 'attendance', limit = 10, schoolId = null) => {
  try {
    if (__DEV__) {
      console.log('🏆 Fetching top performers...', { metric, limit, schoolId });
    }

    let url = `${API_ENDPOINTS.ANALYTICS.DASHBOARD.TOP_PERFORMERS}?metric=${metric}&limit=${limit}`;
    if (schoolId) {
      url += `&school=${schoolId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch top performers');
    }

    if (__DEV__) {
      console.log('✅ Top performers fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get top performers error:', error);
    return handleApiError(error);
  }
};

/**
 * Get trends over time
 * @param {number} days - Number of days (default: 30, max: 365)
 * @param {number} schoolId - School ID (optional for super admin)
 * @returns {Promise<Object>} Trends data
 */
export const getTrends = async (days = 30, schoolId = null) => {
  try {
    if (__DEV__) {
      console.log('📉 Fetching trends...', { days, schoolId });
    }

    let url = `${API_ENDPOINTS.ANALYTICS.DASHBOARD.TRENDS}?days=${days}`;
    if (schoolId) {
      url += `&school=${schoolId}`;
    }

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch trends');
    }

    if (__DEV__) {
      console.log('✅ Trends fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get trends error:', error);
    return handleApiError(error);
  }
};

// ========================================
// DAILY ANALYTICS
// ========================================

/**
 * Get daily analytics list
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Daily analytics list
 */
export const getDailyAnalytics = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      school = null,
      date = null,
    } = params;

    if (__DEV__) {
      console.log('📅 Fetching daily analytics...', params);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (school) queryParams.append('school', school);
    if (date) queryParams.append('date', date);

    const response = await fetch(
      `${API_ENDPOINTS.ANALYTICS.DAILY.LIST}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch daily analytics');
    }

    if (__DEV__) {
      console.log('✅ Daily analytics fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get daily analytics error:', error);
    return handleApiError(error);
  }
};

/**
 * Get analytics by specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise<Object>} Analytics for specific date
 */
export const getAnalyticsByDate = async (date) => {
  try {
    if (__DEV__) {
      console.log('📅 Fetching analytics by date...', { date });
    }

    const response = await fetch(
      `${API_ENDPOINTS.ANALYTICS.DAILY.BY_DATE}?date=${date}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch analytics by date');
    }

    if (__DEV__) {
      console.log('✅ Analytics by date fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get analytics by date error:', error);
    return handleApiError(error);
  }
};

/**
 * Get analytics for date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise<Object>} Analytics for date range
 */
export const getAnalyticsDateRange = async (startDate, endDate) => {
  try {
    if (__DEV__) {
      console.log('📅 Fetching analytics date range...', { startDate, endDate });
    }

    const response = await fetch(
      `${API_ENDPOINTS.ANALYTICS.DAILY.DATE_RANGE}?start_date=${startDate}&end_date=${endDate}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch analytics date range');
    }

    if (__DEV__) {
      console.log('✅ Analytics date range fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get analytics date range error:', error);
    return handleApiError(error);
  }
};

// ========================================
// WEEKLY ANALYTICS
// ========================================

/**
 * Get weekly analytics list
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Weekly analytics list
 */
export const getWeeklyAnalytics = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      school = null,
      year = null,
      week_number = null,
    } = params;

    if (__DEV__) {
      console.log('📊 Fetching weekly analytics...', params);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (school) queryParams.append('school', school);
    if (year) queryParams.append('year', year);
    if (week_number) queryParams.append('week_number', week_number);

    const response = await fetch(
      `${API_ENDPOINTS.ANALYTICS.WEEKLY.LIST}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch weekly analytics');
    }

    if (__DEV__) {
      console.log('✅ Weekly analytics fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get weekly analytics error:', error);
    return handleApiError(error);
  }
};

/**
 * Get current week analytics
 * @returns {Promise<Object>} Current week analytics
 */
export const getCurrentWeekAnalytics = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching current week analytics...');
    }

    const response = await fetch(API_ENDPOINTS.ANALYTICS.WEEKLY.CURRENT_WEEK, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch current week analytics');
    }

    if (__DEV__) {
      console.log('✅ Current week analytics fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get current week analytics error:', error);
    return handleApiError(error);
  }
};

// ========================================
// MONTHLY ANALYTICS
// ========================================

/**
 * Get monthly analytics list
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Monthly analytics list
 */
export const getMonthlyAnalytics = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      school = null,
      year = null,
      month = null,
    } = params;

    if (__DEV__) {
      console.log('📊 Fetching monthly analytics...', params);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (school) queryParams.append('school', school);
    if (year) queryParams.append('year', year);
    if (month) queryParams.append('month', month);

    const response = await fetch(
      `${API_ENDPOINTS.ANALYTICS.MONTHLY.LIST}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch monthly analytics');
    }

    if (__DEV__) {
      console.log('✅ Monthly analytics fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get monthly analytics error:', error);
    return handleApiError(error);
  }
};

/**
 * Get current month analytics
 * @returns {Promise<Object>} Current month analytics
 */
export const getCurrentMonthAnalytics = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching current month analytics...');
    }

    const response = await fetch(API_ENDPOINTS.ANALYTICS.MONTHLY.CURRENT_MONTH, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch current month analytics');
    }

    if (__DEV__) {
      console.log('✅ Current month analytics fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get current month analytics error:', error);
    return handleApiError(error);
  }
};

// ========================================
// UTILITY FUNCTIONS
// ========================================

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency
 */
export const formatCurrency = (amount) => {
  return `KES ${parseFloat(amount || 0).toLocaleString('en-KE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

/**
 * Format percentage for display
 * @param {number} value - Value to format
 * @returns {string} Formatted percentage
 */
export const formatPercentage = (value) => {
  return `${parseFloat(value || 0).toFixed(1)}%`;
};

/**
 * Get attendance rate color
 * @param {number} rate - Attendance rate
 * @returns {string} Color hex code
 */
export const getAttendanceRateColor = (rate) => {
  if (rate >= 90) return '#4CAF50'; // Green
  if (rate >= 75) return '#FF9800'; // Orange
  return '#F44336'; // Red
};

/**
 * Get trend icon
 * @param {string} trend - Trend direction: 'up', 'down', 'stable'
 * @returns {string} Icon name
 */
export const getTrendIcon = (trend) => {
  const icons = {
    up: 'trending-up',
    down: 'trending-down',
    stable: 'trending-neutral',
  };
  return icons[trend] || 'minus';
};

/**
 * Get trend color
 * @param {string} trend - Trend direction: 'up', 'down', 'stable'
 * @returns {string} Color hex code
 */
export const getTrendColor = (trend) => {
  const colors = {
    up: '#4CAF50',
    down: '#F44336',
    stable: '#757575',
  };
  return colors[trend] || '#757575';
};

export default {
  // Dashboard
  getDashboardMetrics,
  getComparativeAnalytics,
  getTopPerformers,
  getTrends,
  // Daily
  getDailyAnalytics,
  getAnalyticsByDate,
  getAnalyticsDateRange,
  // Weekly
  getWeeklyAnalytics,
  getCurrentWeekAnalytics,
  // Monthly
  getMonthlyAnalytics,
  getCurrentMonthAnalytics,
  // Utilities
  formatCurrency,
  formatPercentage,
  getAttendanceRateColor,
  getTrendIcon,
  getTrendColor,
};