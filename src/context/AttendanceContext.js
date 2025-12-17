// ========================================
// GOD'S EYE EDTECH - ATTENDANCE CONTEXT
// ========================================

import React, { createContext, useState, useEffect, useCallback } from 'react';
import * as attendanceService from '../services/attendanceService';
import * as qrCodeService from '../services/qrCodeService';
import * as biometricService from '../services/biometricService';
import * as otcService from '../services/otcService';

export const AttendanceContext = createContext();

export const AttendanceProvider = ({ children }) => {
  // State
  const [dashboardData, setDashboardData] = useState({
    stats: {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: 0,
      attendance_rate: 0,
    },
    recentRecords: [],
  });

  const [attendanceHistory, setAttendanceHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [biometricSupport, setBiometricSupport] = useState({
    isSupported: false,
    hasFingerprint: false,
    hasFaceRecognition: false,
  });

  /**
   * Fetch dashboard data
   */
  const fetchDashboardData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await attendanceService.getTodaysAttendance();

      if (response.success) {
        setDashboardData({
          stats: {
            present: response.data?.present || 0,
            absent: response.data?.absent || 0,
            late: response.data?.late || 0,
            excused: response.data?.excused || 0,
            total: response.data?.total_students || 0,
            attendance_rate: response.data?.attendance_rate || 0,
          },
          recentRecords: response.data?.records || [],
        });
      }
    } catch (err) {
      setError(err.message);
      console.error('Fetch dashboard data error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Fetch attendance history
   */
  const fetchAttendanceHistory = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await attendanceService.getAttendanceRecords(filters);

      if (response.success) {
        setAttendanceHistory(response.data?.results || response.data || []);
      }

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Fetch attendance history error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Mark attendance (present/absent/late/excused)
   */
  const markAttendance = useCallback(async (type, data) => {
    try {
      setIsLoading(true);
      setError(null);

      let response;
      switch (type) {
        case 'present':
          response = await attendanceService.markPresent(data);
          break;
        case 'absent':
          response = await attendanceService.markAbsent(data);
          break;
        case 'late':
          response = await attendanceService.markLate(data);
          break;
        case 'excused':
          response = await attendanceService.markExcused(data);
          break;
        default:
          throw new Error('Invalid attendance type');
      }

      if (response.success) {
        await fetchDashboardData();
      }

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Mark attendance error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Scan QR code for attendance
   */
  const scanQRCode = useCallback(async (qrCode, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await qrCodeService.scanQRCode(qrCode, options);

      if (response.success) {
        await fetchDashboardData();
      }

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Scan QR code error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Verify fingerprint for attendance
   */
  const verifyFingerprint = useCallback(async (studentId, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await biometricService.verifyFingerprint(studentId, options);

      if (response.success) {
        await fetchDashboardData();
      }

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Verify fingerprint error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Verify face for attendance
   */
  const verifyFace = useCallback(async (studentId, imageData, options = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await biometricService.verifyFaceRecognition(studentId, imageData, options);

      if (response.success) {
        await fetchDashboardData();
      }

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Verify face error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Submit one-time code
   */
  const submitOTC = useCallback(async (code) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await otcService.verifyOTC(code);

      if (response.success) {
        await fetchDashboardData();
      }

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Submit OTC error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Bulk mark attendance
   */
  const bulkMarkAttendance = useCallback(async (data) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await attendanceService.bulkMarkAttendance(data);

      if (response.success) {
        await fetchDashboardData();
      }

      return response;
    } catch (err) {
      setError(err.message);
      console.error('Bulk mark attendance error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Get student attendance records
   */
  const getStudentAttendance = useCallback(async (studentId, params = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await attendanceService.getStudentAttendance(studentId, params);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Get student attendance error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get attendance statistics
   */
  const getStatistics = useCallback(async (params = {}) => {
    try {
      setIsLoading(true);
      setError(null);

      const response = await attendanceService.getAttendanceStatistics(params);
      return response;
    } catch (err) {
      setError(err.message);
      console.error('Get statistics error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Check biometric support on mount
   */
  useEffect(() => {
    const checkBiometric = async () => {
      try {
        const support = await biometricService.checkBiometricSupport();
        setBiometricSupport(support);
      } catch (error) {
        console.error('Check biometric support error:', error);
      }
    };

    checkBiometric();
  }, []);

  /**
   * Initialize - fetch dashboard data
   */
  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  /**
   * Clear error after timeout
   */
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError(null);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [error]);

  const value = {
    // State
    dashboardData,
    attendanceHistory,
    isLoading,
    error,
    selectedStudent,
    biometricSupport,

    // Actions
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
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;