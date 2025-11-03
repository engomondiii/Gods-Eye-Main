import { useContext, useCallback } from 'react';
import { AttendanceContext } from '../context/AttendanceContext';
import attendanceService from '../services/attendanceService';

/**
 * Custom hook for attendance operations
 */
const useAttendance = () => {
  const context = useContext(AttendanceContext);

  if (!context) {
    throw new Error('useAttendance must be used within AttendanceProvider');
  }

  const {
    dashboardData,
    attendanceHistory,
    isLoading,
    error,
    selectedStudent,
    fetchDashboardData,
    fetchAttendanceHistory,
    createAttendance,
    checkIn,
    checkOut,
    scanQRCode,
    verifyFingerprint,
    verifyFace,
    submitOTC,
    createManualEntry,
    getStudentAttendance,
    getStatistics,
    getReportData,
    setSelectedStudent,
    setError,
  } = context;

  /**
   * Get attendance by ID
   */
  const getAttendanceById = useCallback(async (id) => {
    try {
      const data = await attendanceService.getById(id);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setError]);

  /**
   * Update attendance record
   */
  const updateAttendance = useCallback(async (id, data) => {
    try {
      const result = await attendanceService.updateAttendance(id, data);
      await fetchDashboardData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchDashboardData, setError]);

  /**
   * Delete attendance record
   */
  const deleteAttendance = useCallback(async (id) => {
    try {
      const result = await attendanceService.deleteAttendance(id);
      await fetchDashboardData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchDashboardData, setError]);

  /**
   * Get calendar data
   */
  const getCalendarData = useCallback(async (studentId, month) => {
    try {
      const data = await attendanceService.getCalendarData(studentId, month);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setError]);

  /**
   * Get attendance summary
   */
  const getAttendanceSummary = useCallback(async (studentId, startDate, endDate) => {
    try {
      const data = await attendanceService.getSummary(studentId, startDate, endDate);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setError]);

  /**
   * Export attendance records
   */
  const exportRecords = useCallback(async (filters = {}, format = 'csv') => {
    try {
      const data = await attendanceService.exportRecords(filters, format);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setError]);

  /**
   * Validate attendance time
   */
  const validateAttendanceTime = useCallback(async (type) => {
    try {
      const result = await attendanceService.validateAttendanceTime(type);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setError]);

  /**
   * Get recent activity
   */
  const getRecentActivity = useCallback(async (limit = 10) => {
    try {
      const data = await attendanceService.getRecentActivity(limit);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setError]);

  /**
   * Get attendance trends
   */
  const getTrends = useCallback(async (options = {}) => {
    try {
      const data = await attendanceService.getTrends(options);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setError]);

  /**
   * Get method statistics
   */
  const getMethodStatistics = useCallback(async () => {
    try {
      const data = await attendanceService.getMethodStatistics();
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [setError]);

  /**
   * Bulk import records
   */
  const bulkImport = useCallback(async (records) => {
    try {
      const result = await attendanceService.bulkImport(records);
      await fetchDashboardData();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, [fetchDashboardData, setError]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    // State
    dashboardData,
    attendanceHistory,
    isLoading,
    error,
    selectedStudent,

    // Actions
    setSelectedStudent,
    clearError,
    fetchDashboardData,
    fetchAttendanceHistory,
    createAttendance,
    checkIn,
    checkOut,
    scanQRCode,
    verifyFingerprint,
    verifyFace,
    submitOTC,
    createManualEntry,
    getStudentAttendance,
    getStatistics,
    getReportData,
    getAttendanceById,
    updateAttendance,
    deleteAttendance,
    getCalendarData,
    getAttendanceSummary,
    exportRecords,
    validateAttendanceTime,
    getRecentActivity,
    getTrends,
    getMethodStatistics,
    bulkImport,
  };
};

export default useAttendance;