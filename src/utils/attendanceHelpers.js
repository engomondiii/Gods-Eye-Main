import { ATTENDANCE_STATUS, ATTENDANCE_TYPES, ATTENDANCE_METHODS } from './constants';

/**
 * Attendance Helper Functions
 * Utility functions for attendance operations
 */

/**
 * Calculate attendance percentage
 * @param {number} present - Number of present days
 * @param {number} total - Total number of days
 * @returns {number} - Percentage
 */
export const calculateAttendancePercentage = (present, total) => {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
};

/**
 * Get attendance status from percentage
 * @param {number} percentage - Attendance percentage
 * @returns {Object} - Status info
 */
export const getAttendanceStatusFromPercentage = (percentage) => {
  if (percentage >= 90) {
    return {
      status: 'excellent',
      color: '#4CAF50',
      label: 'Excellent',
      icon: 'emoticon-excited',
    };
  } else if (percentage >= 75) {
    return {
      status: 'good',
      color: '#2196F3',
      label: 'Good',
      icon: 'emoticon-happy',
    };
  } else if (percentage >= 60) {
    return {
      status: 'average',
      color: '#FF9800',
      label: 'Average',
      icon: 'emoticon-neutral',
    };
  } else {
    return {
      status: 'poor',
      color: '#F44336',
      label: 'Poor',
      icon: 'emoticon-sad',
    };
  }
};

/**
 * Determine if student is late
 * @param {string} checkInTime - Check-in time (ISO string)
 * @param {string} schoolStartTime - School start time (HH:MM format)
 * @returns {boolean} - True if late
 */
export const isLateCheckIn = (checkInTime, schoolStartTime = '08:00') => {
  const checkIn = new Date(checkInTime);
  const [hours, minutes] = schoolStartTime.split(':');
  
  const startTime = new Date(checkIn);
  startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  return checkIn > startTime;
};

/**
 * Calculate late duration in minutes
 * @param {string} checkInTime - Check-in time
 * @param {string} schoolStartTime - School start time
 * @returns {number} - Minutes late
 */
export const calculateLateDuration = (checkInTime, schoolStartTime = '08:00') => {
  if (!isLateCheckIn(checkInTime, schoolStartTime)) return 0;
  
  const checkIn = new Date(checkInTime);
  const [hours, minutes] = schoolStartTime.split(':');
  
  const startTime = new Date(checkIn);
  startTime.setHours(parseInt(hours), parseInt(minutes), 0, 0);
  
  const diffMs = checkIn - startTime;
  return Math.floor(diffMs / 60000); // Convert to minutes
};

/**
 * Get attendance status for a specific date
 * @param {Object} attendanceData - Attendance data object
 * @param {Date} date - Date to check
 * @returns {string|null} - Status or null
 */
export const getAttendanceForDate = (attendanceData, date) => {
  const dateStr = formatDateKey(date);
  return attendanceData[dateStr] || null;
};

/**
 * Format date as key for attendance data
 * @param {Date} date - Date object
 * @returns {string} - Formatted date (YYYY-MM-DD)
 */
export const formatDateKey = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get attendance streak (consecutive present days)
 * @param {Object} attendanceData - Attendance data object
 * @returns {number} - Streak count
 */
export const calculateAttendanceStreak = (attendanceData) => {
  const dates = Object.keys(attendanceData).sort().reverse();
  let streak = 0;
  
  for (const date of dates) {
    if (attendanceData[date] === ATTENDANCE_STATUS.PRESENT) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
};

/**
 * Get attendance summary for a date range
 * @param {Array} records - Array of attendance records
 * @returns {Object} - Summary statistics
 */
export const getAttendanceSummary = (records) => {
  const summary = {
    total: records.length,
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
    checkIns: 0,
    checkOuts: 0,
    byMethod: {},
  };

  records.forEach((record) => {
    // Count by status
    if (record.status) {
      summary[record.status] = (summary[record.status] || 0) + 1;
    }

    // Count by type
    if (record.attendance_type === ATTENDANCE_TYPES.CHECK_IN) {
      summary.checkIns++;
    } else if (record.attendance_type === ATTENDANCE_TYPES.CHECK_OUT) {
      summary.checkOuts++;
    }

    // Count by method
    if (record.method) {
      summary.byMethod[record.method] = (summary.byMethod[record.method] || 0) + 1;
    }
  });

  summary.percentage = calculateAttendancePercentage(summary.present, summary.total);

  return summary;
};

/**
 * Filter attendance records by date range
 * @param {Array} records - Array of attendance records
 * @param {Date} startDate - Start date
 * @param {Date} endDate - End date
 * @returns {Array} - Filtered records
 */
export const filterRecordsByDateRange = (records, startDate, endDate) => {
  return records.filter((record) => {
    const recordDate = new Date(record.timestamp);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

/**
 * Group attendance records by date
 * @param {Array} records - Array of attendance records
 * @returns {Object} - Records grouped by date
 */
export const groupRecordsByDate = (records) => {
  return records.reduce((grouped, record) => {
    const dateKey = formatDateKey(new Date(record.timestamp));
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(record);
    return grouped;
  }, {});
};

/**
 * Get most used attendance method
 * @param {Array} records - Array of attendance records
 * @returns {Object} - Most used method info
 */
export const getMostUsedMethod = (records) => {
  const methodCounts = {};
  
  records.forEach((record) => {
    if (record.method) {
      methodCounts[record.method] = (methodCounts[record.method] || 0) + 1;
    }
  });

  let maxMethod = null;
  let maxCount = 0;

  Object.entries(methodCounts).forEach(([method, count]) => {
    if (count > maxCount) {
      maxMethod = method;
      maxCount = count;
    }
  });

  return {
    method: maxMethod,
    count: maxCount,
    percentage: records.length > 0 ? Math.round((maxCount / records.length) * 100) : 0,
  };
};

/**
 * Check if attendance is allowed at current time
 * @param {string} type - check_in or check_out
 * @param {Object} schedule - School schedule
 * @returns {Object} - Validation result
 */
export const validateAttendanceTime = (type, schedule = {}) => {
  const now = new Date();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();
  const currentTime = currentHour * 60 + currentMinute;

  if (type === ATTENDANCE_TYPES.CHECK_IN) {
    const startTime = schedule.checkInStart || '06:00';
    const endTime = schedule.checkInEnd || '10:00';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;

    if (currentTime < start) {
      return {
        allowed: false,
        message: `Check-in not allowed before ${startTime}`,
      };
    }
    if (currentTime > end) {
      return {
        allowed: false,
        message: `Check-in not allowed after ${endTime}`,
      };
    }
  }

  if (type === ATTENDANCE_TYPES.CHECK_OUT) {
    const startTime = schedule.checkOutStart || '14:00';
    const endTime = schedule.checkOutEnd || '20:00';
    
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    const start = startHour * 60 + startMin;
    const end = endHour * 60 + endMin;

    if (currentTime < start) {
      return {
        allowed: false,
        message: `Check-out not allowed before ${startTime}`,
      };
    }
    if (currentTime > end) {
      return {
        allowed: false,
        message: `Check-out not allowed after ${endTime}`,
      };
    }
  }

  return {
    allowed: true,
    message: 'Attendance allowed',
  };
};

/**
 * Generate attendance report data
 * @param {Array} records - Attendance records
 * @param {string} period - Report period
 * @returns {Object} - Report data
 */
export const generateAttendanceReport = (records, period = 'week') => {
  const now = new Date();
  let startDate;

  switch (period) {
    case 'today':
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
      break;
    default:
      startDate = new Date(0);
  }

  const filteredRecords = filterRecordsByDateRange(records, startDate, now);
  const summary = getAttendanceSummary(filteredRecords);
  const grouped = groupRecordsByDate(filteredRecords);
  const mostUsedMethod = getMostUsedMethod(filteredRecords);

  return {
    period,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    summary,
    dailyRecords: grouped,
    mostUsedMethod,
    records: filteredRecords,
  };
};

/**
 * Validate attendance data
 * @param {Object} data - Attendance data
 * @returns {Object} - Validation result
 */
export const validateAttendanceData = (data) => {
  const errors = [];

  if (!data.studentId) {
    errors.push('Student ID is required');
  }

  if (!data.type || ![ATTENDANCE_TYPES.CHECK_IN, ATTENDANCE_TYPES.CHECK_OUT].includes(data.type)) {
    errors.push('Valid attendance type is required');
  }

  if (!data.method || !Object.values(ATTENDANCE_METHODS).includes(data.method)) {
    errors.push('Valid attendance method is required');
  }

  if (data.timestamp && isNaN(new Date(data.timestamp).getTime())) {
    errors.push('Invalid timestamp');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};

/**
 * Format attendance method for display
 * @param {string} method - Method key
 * @returns {string} - Formatted method name
 */
export const formatMethodName = (method) => {
  const methodNames = {
    [ATTENDANCE_METHODS.QR_CODE]: 'QR Code',
    [ATTENDANCE_METHODS.FINGERPRINT]: 'Fingerprint',
    [ATTENDANCE_METHODS.FACE_RECOGNITION]: 'Face Recognition',
    [ATTENDANCE_METHODS.OTC]: 'One-Time Code',
    [ATTENDANCE_METHODS.MANUAL]: 'Manual Entry',
  };

  return methodNames[method] || method;
};

/**
 * Get attendance color by status
 * @param {string} status - Attendance status
 * @returns {string} - Color hex code
 */
export const getStatusColor = (status) => {
  const colors = {
    [ATTENDANCE_STATUS.PRESENT]: '#4CAF50',
    [ATTENDANCE_STATUS.ABSENT]: '#F44336',
    [ATTENDANCE_STATUS.LATE]: '#FF9800',
    [ATTENDANCE_STATUS.EXCUSED]: '#2196F3',
  };

  return colors[status] || '#9E9E9E';
};

/**
 * Calculate average check-in time
 * @param {Array} records - Check-in records
 * @returns {string} - Average time (HH:MM format)
 */
export const calculateAverageCheckInTime = (records) => {
  const checkIns = records.filter(r => r.attendance_type === ATTENDANCE_TYPES.CHECK_IN);
  
  if (checkIns.length === 0) return '00:00';

  const totalMinutes = checkIns.reduce((sum, record) => {
    const date = new Date(record.timestamp);
    return sum + date.getHours() * 60 + date.getMinutes();
  }, 0);

  const avgMinutes = Math.floor(totalMinutes / checkIns.length);
  const hours = Math.floor(avgMinutes / 60);
  const minutes = avgMinutes % 60;

  return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
};

/**
 * Get attendance trends
 * @param {Array} records - Attendance records
 * @param {number} days - Number of days to analyze
 * @returns {Array} - Trend data
 */
export const getAttendanceTrends = (records, days = 7) => {
  const trends = [];
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const dayRecords = records.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= date && recordDate < nextDate;
    });

    const present = dayRecords.filter(r => r.status === ATTENDANCE_STATUS.PRESENT).length;
    const absent = dayRecords.filter(r => r.status === ATTENDANCE_STATUS.ABSENT).length;
    const late = dayRecords.filter(r => r.status === ATTENDANCE_STATUS.LATE).length;

    trends.push({
      date: formatDateKey(date),
      label: date.toLocaleDateString('en-US', { weekday: 'short' }),
      present,
      absent,
      late,
      total: dayRecords.length,
    });
  }

  return trends;
};

export default {
  calculateAttendancePercentage,
  getAttendanceStatusFromPercentage,
  isLateCheckIn,
  calculateLateDuration,
  getAttendanceForDate,
  formatDateKey,
  calculateAttendanceStreak,
  getAttendanceSummary,
  filterRecordsByDateRange,
  groupRecordsByDate,
  getMostUsedMethod,
  validateAttendanceTime,
  generateAttendanceReport,
  validateAttendanceData,
  formatMethodName,
  getStatusColor,
  calculateAverageCheckInTime,
  getAttendanceTrends,
};