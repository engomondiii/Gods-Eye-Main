import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

/**
 * GOD'S EYE ATTENDANCE SERVICE
 * Works with Django Attendance API
 */

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * MARK SINGLE STUDENT PRESENT
 */
export const markPresent = async (studentId) => {
  try {
    const payload = {
      student: studentId,
      date: new Date().toISOString().split('T')[0],
    };

    const response = await api.post(
      '/api/attendance/mark_present/',
      payload
    );

    console.log('✅ Student marked present');

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error(
      '❌ Mark present error:',
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        'Failed to mark attendance',
    };
  }
};

/**
 * MARK SINGLE STUDENT ABSENT
 */
export const markAbsent = async (studentId, notes = '') => {
  try {
    const payload = {
      student: studentId,
      date: new Date().toISOString().split('T')[0],
      notes: notes,
    };

    const response = await api.post(
      '/api/attendance/mark_absent/',
      payload
    );

    console.log('✅ Student marked absent');

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error(
      '❌ Mark absent error:',
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        'Failed to mark absence',
    };
  }
};

/**
 * BULK MARK ATTENDANCE
 * Used for "All Present"
 */
export const bulkMarkAttendance = async (studentsData) => {
  try {
    const payload = {
      date: new Date().toISOString().split('T')[0],
      students: studentsData,
    };

    const response = await api.post(
      '/api/attendance/bulk_mark/',
      payload
    );

    console.log('✅ Bulk attendance marked');

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error(
      '❌ Bulk attendance error:',
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message ||
        'Failed to mark bulk attendance',
    };
  }
};

/**
 * GET TODAY ATTENDANCE
 */
export const getTodayAttendance = async () => {
  try {
    const response = await api.get('/api/attendance/today/');

    return {
      success: true,
      data: response.data,
    };

  } catch (error) {
    console.error(
      '❌ Fetch attendance error:',
      error.response?.data || error.message
    );

    return {
      success: false,
      message:
        error.response?.data?.error ||
        error.message,
    };
  }
};

export default {
  markPresent,
  markAbsent,
  bulkMarkAttendance,
  getTodayAttendance,
};