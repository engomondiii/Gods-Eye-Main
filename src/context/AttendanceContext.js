import React, { createContext, useState, useEffect, useCallback } from 'react';
import attendanceService from '../services/attendanceService';
import qrCodeService from '../services/qrCodeService';
import biometricService from '../services/biometricService';
import otcService from '../services/otcService';

/**
 * Attendance Context
 * Manages global attendance state
 */
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
      const data = await attendanceService.getDashboardData();
      setDashboardData(data);
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
      const data = await attendanceService.getHistory(filters);
      setAttendanceHistory(data.records || data);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Fetch attendance history error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create attendance record
   */
  const createAttendance = useCallback(async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await attendanceService.createAttendance(data);
      
      // Refresh dashboard data
      await fetchDashboardData();
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Create attendance error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Check in student
   */
  const checkIn = useCallback(async (data) => {
    return createAttendance({ ...data, type: 'check_in' });
  }, [createAttendance]);

  /**
   * Check out student
   */
  const checkOut = useCallback(async (data) => {
    return createAttendance({ ...data, type: 'check_out' });
  }, [createAttendance]);

  /**
   * Scan QR code for attendance
   */
  const scanQRCode = useCallback(async (qrCode, attendanceType = 'check_in') => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await qrCodeService.scanQRCode(qrCode, attendanceType);
      
      // Refresh dashboard data
      await fetchDashboardData();
      
      return result;
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
  const verifyFingerprint = useCallback(async (studentId) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await biometricService.verifyFingerprint(studentId);
      
      // Create attendance record
      await createAttendance({
        studentId,
        method: 'fingerprint',
        type: 'check_in',
      });
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Verify fingerprint error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [createAttendance]);

  /**
   * Verify face for attendance
   */
  const verifyFace = useCallback(async (studentId, imageData) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await biometricService.verifyFace(studentId, imageData);
      
      // Create attendance record
      await createAttendance({
        studentId,
        method: 'face_recognition',
        type: 'check_in',
      });
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Verify face error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [createAttendance]);

  /**
   * Submit one-time code
   */
  const submitOTC = useCallback(async (code, attendanceType = 'check_in') => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await otcService.submitOTC(code, attendanceType);
      
      // Refresh dashboard data
      await fetchDashboardData();
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Submit OTC error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Create manual attendance entry
   */
  const createManualEntry = useCallback(async (data) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await attendanceService.createManualEntry(data);
      
      // Refresh dashboard data
      await fetchDashboardData();
      
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Create manual entry error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [fetchDashboardData]);

  /**
   * Get student attendance records
   */
  const getStudentAttendance = useCallback(async (studentId, filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await attendanceService.getStudentAttendance(studentId, filters);
      return data;
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
  const getStatistics = useCallback(async (filters = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await attendanceService.getStatistics(filters);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Get statistics error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Get report data
   */
  const getReportData = useCallback(async (period = 'today', options = {}) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await attendanceService.getReportData(period, options);
      return data;
    } catch (err) {
      setError(err.message);
      console.error('Get report data error:', err);
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
  };

  return (
    <AttendanceContext.Provider value={value}>
      {children}
    </AttendanceContext.Provider>
  );
};

export default AttendanceContext;