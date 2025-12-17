// ========================================
// GOD'S EYE EDTECH - USE ATTENDANCE HOOK
// ========================================

import { useContext, useCallback } from 'react';
import { AttendanceContext } from '../context/AttendanceContext';

/**
 * Custom hook for attendance operations
 * Provides easy access to attendance context and additional utilities
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
    biometricSupport,
    setSelectedStudent,
    setError,
    fetchDashboardData,
    fetchAttendanceHistory,
    markAttendance,
    scanQRCode,
    verifyFingerprint,
    verifyFace,
    submitOTC,
    bulkMarkAttendance,
    getStudentAttendance,
    getStatistics,
  } = context;

  /**
   * Mark student as present
   */
  const markPresent = useCallback(async (data) => {
    return markAttendance('present', data);
  }, [markAttendance]);

  /**
   * Mark student as absent
   */
  const markAbsent = useCallback(async (data) => {
    return markAttendance('absent', data);
  }, [markAttendance]);

  /**
   * Mark student as late
   */
  const markLate = useCallback(async (data) => {
    return markAttendance('late', data);
  }, [markAttendance]);

  /**
   * Mark student as excused
   */
  const markExcused = useCallback(async (data) => {
    return markAttendance('excused', data);
  }, [markAttendance]);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, [setError]);

  /**
   * Refresh all data
   */
  const refreshAll = useCallback(async () => {
    await fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Get attendance rate
   */
  const getAttendanceRate = useCallback(() => {
    const { present, total } = dashboardData.stats;
    if (total === 0) return 0;
    return ((present / total) * 100).toFixed(2);
  }, [dashboardData.stats]);

  /**
   * Get absent count
   */
  const getAbsentCount = useCallback(() => {
    return dashboardData.stats.absent;
  }, [dashboardData.stats]);

  /**
   * Check if biometrics are supported
   */
  const isBiometricSupported = useCallback(() => {
    return biometricSupport.isSupported;
  }, [biometricSupport.isSupported]);

  /**
   * Check if fingerprint is supported
   */
  const isFingerprintSupported = useCallback(() => {
    return biometricSupport.hasFingerprint;
  }, [biometricSupport.hasFingerprint]);

  /**
   * Check if face recognition is supported
   */
  const isFaceRecognitionSupported = useCallback(() => {
    return biometricSupport.hasFaceRecognition;
  }, [biometricSupport.hasFaceRecognition]);

  return {
    // State
    dashboardData,
    attendanceHistory,
    isLoading,
    error,
    selectedStudent,
    biometricSupport,

    // Actions
    setSelectedStudent,
    clearError,
    fetchDashboardData,
    fetchAttendanceHistory,
    refreshAll,

    // Mark Attendance
    markAttendance,
    markPresent,
    markAbsent,
    markLate,
    markExcused,
    bulkMarkAttendance,

    // Check-in Methods
    scanQRCode,
    verifyFingerprint,
    verifyFace,
    submitOTC,

    // Queries
    getStudentAttendance,
    getStatistics,

    // Utilities
    getAttendanceRate,
    getAbsentCount,
    isBiometricSupported,
    isFingerprintSupported,
    isFaceRecognitionSupported,
  };
};

export default useAttendance;