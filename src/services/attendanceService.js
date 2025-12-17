// ========================================
// GOD'S EYE EDTECH - ATTENDANCE SERVICE
// ========================================

import { get, post, put, patch, del, handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

// ============================================================
// ATTENDANCE CRUD OPERATIONS
// ============================================================

/**
 * Get today's attendance records
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Today's attendance records
 * 
 * Backend Endpoint: GET /api/attendance/today/
 */
export const getTodaysAttendance = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching today\'s attendance...');
    }

    const params = new URLSearchParams();
    
    if (filters.school) params.append('school', filters.school);
    if (filters.grade) params.append('grade', filters.grade);
    if (filters.stream) params.append('stream', filters.stream);
    if (filters.status) params.append('status', filters.status);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.ATTENDANCE.BASE}/today/?${queryString}`
      : `${API_ENDPOINTS.ATTENDANCE.BASE}/today/`;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} attendance records for today`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get today\'s attendance error:', error);

    return {
      success: false,
      message: 'Failed to fetch today\'s attendance',
      error: handleApiError(error),
    };
  }
};

/**
 * Get attendance records with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Attendance records
 * 
 * Backend Endpoint: GET /api/attendance/
 */
export const getAttendanceRecords = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching attendance records with filters:', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.student) params.append('student', filters.student);
    if (filters.school) params.append('school', filters.school);
    if (filters.date) params.append('date', filters.date);
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);
    if (filters.status) params.append('status', filters.status);
    if (filters.method) params.append('method', filters.method);
    if (filters.academic_year) params.append('academic_year', filters.academic_year);
    if (filters.term) params.append('term', filters.term);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.ATTENDANCE.LIST}?${queryString}`
      : API_ENDPOINTS.ATTENDANCE.LIST;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} attendance records`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get attendance records error:', error);

    return {
      success: false,
      message: 'Failed to fetch attendance records',
      error: handleApiError(error),
    };
  }
};

/**
 * Get attendance record by ID
 * @param {number} recordId - Attendance record ID
 * @returns {Promise<Object>} Attendance record details
 * 
 * Backend Endpoint: GET /api/attendance/{id}/
 */
export const getAttendanceById = async (recordId) => {
  try {
    if (!recordId) {
      throw new Error('Attendance record ID is required');
    }

    if (__DEV__) {
      console.log(`📋 Fetching attendance record ${recordId}...`);
    }

    const response = await get(API_ENDPOINTS.ATTENDANCE.DETAIL(recordId));

    if (__DEV__) {
      console.log(`✅ Fetched attendance record for ${response.student_name}`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get attendance by ID error:', error);

    return {
      success: false,
      message: 'Failed to fetch attendance record',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// MARK ATTENDANCE
// ============================================================

/**
 * Mark student as present
 * @param {Object} data - Attendance data
 * @returns {Promise<Object>} Created attendance record
 * 
 * Backend Endpoint: POST /api/attendance/mark_present/
 */
export const markPresent = async (data) => {
  try {
    if (__DEV__) {
      console.log('✅ Marking student as present:', data);
    }

    const payload = {
      student: data.studentId,
      date: data.date || new Date().toISOString().split('T')[0],
      status: 'present',
      check_in_time: data.checkInTime || new Date().toISOString(),
      check_in_method: data.method || 'manual',
      notes: data.notes || '',
    };

    const response = await post(`${API_ENDPOINTS.ATTENDANCE.BASE}/mark_present/`, payload);

    if (__DEV__) {
      console.log(`✅ Student marked as present`);
    }

    return {
      success: true,
      data: response,
      message: 'Student marked as present successfully',
    };
  } catch (error) {
    console.error('❌ Mark present error:', error);

    return {
      success: false,
      message: 'Failed to mark student as present',
      error: handleApiError(error),
    };
  }
};

/**
 * Mark student as absent
 * @param {Object} data - Attendance data
 * @returns {Promise<Object>} Created attendance record
 * 
 * Backend Endpoint: POST /api/attendance/mark_absent/
 */
export const markAbsent = async (data) => {
  try {
    if (__DEV__) {
      console.log('❌ Marking student as absent:', data);
    }

    const payload = {
      student: data.studentId,
      date: data.date || new Date().toISOString().split('T')[0],
      status: 'absent',
      notes: data.reason || '',
    };

    const response = await post(`${API_ENDPOINTS.ATTENDANCE.BASE}/mark_absent/`, payload);

    if (__DEV__) {
      console.log(`✅ Student marked as absent`);
    }

    return {
      success: true,
      data: response,
      message: 'Student marked as absent successfully',
    };
  } catch (error) {
    console.error('❌ Mark absent error:', error);

    return {
      success: false,
      message: 'Failed to mark student as absent',
      error: handleApiError(error),
    };
  }
};

/**
 * Mark student as late
 * @param {Object} data - Attendance data
 * @returns {Promise<Object>} Created attendance record
 * 
 * Backend Endpoint: POST /api/attendance/mark_late/
 */
export const markLate = async (data) => {
  try {
    if (__DEV__) {
      console.log('⏰ Marking student as late:', data);
    }

    const payload = {
      student: data.studentId,
      date: data.date || new Date().toISOString().split('T')[0],
      status: 'late',
      check_in_time: data.checkInTime || new Date().toISOString(),
      check_in_method: data.method || 'manual',
      notes: data.notes || '',
    };

    const response = await post(`${API_ENDPOINTS.ATTENDANCE.BASE}/mark_late/`, payload);

    if (__DEV__) {
      console.log(`✅ Student marked as late`);
    }

    return {
      success: true,
      data: response,
      message: 'Student marked as late successfully',
    };
  } catch (error) {
    console.error('❌ Mark late error:', error);

    return {
      success: false,
      message: 'Failed to mark student as late',
      error: handleApiError(error),
    };
  }
};

/**
 * Mark student as excused
 * @param {Object} data - Attendance data
 * @returns {Promise<Object>} Created attendance record
 * 
 * Backend Endpoint: POST /api/attendance/mark_excused/
 */
export const markExcused = async (data) => {
  try {
    if (__DEV__) {
      console.log('📝 Marking student as excused:', data);
    }

    const payload = {
      student: data.studentId,
      date: data.date || new Date().toISOString().split('T')[0],
      status: 'excused',
      notes: data.reason || '',
    };

    const response = await post(`${API_ENDPOINTS.ATTENDANCE.BASE}/mark_excused/`, payload);

    if (__DEV__) {
      console.log(`✅ Student marked as excused`);
    }

    return {
      success: true,
      data: response,
      message: 'Student marked as excused successfully',
    };
  } catch (error) {
    console.error('❌ Mark excused error:', error);

    return {
      success: false,
      message: 'Failed to mark student as excused',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// BULK OPERATIONS
// ============================================================

/**
 * Bulk mark attendance for multiple students
 * @param {Object} data - Bulk attendance data
 * @returns {Promise<Object>} Success response
 * 
 * Backend Endpoint: POST /api/attendance/bulk_mark/
 */
export const bulkMarkAttendance = async (data) => {
  try {
    if (__DEV__) {
      console.log(`📋 Bulk marking ${data.students.length} students...`);
    }

    const payload = {
      date: data.date || new Date().toISOString().split('T')[0],
      students: data.students, // Array of {student_id, status, notes}
    };

    const response = await post(`${API_ENDPOINTS.ATTENDANCE.BASE}/bulk_mark/`, payload);

    if (__DEV__) {
      console.log(`✅ Bulk marked ${data.students.length} students`);
    }

    return {
      success: true,
      data: response,
      message: `Successfully marked ${data.students.length} students`,
    };
  } catch (error) {
    console.error('❌ Bulk mark attendance error:', error);

    return {
      success: false,
      message: 'Failed to bulk mark attendance',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// STUDENT ATTENDANCE
// ============================================================

/**
 * Get student's attendance history
 * @param {number} studentId - Student ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Student's attendance records
 * 
 * Backend Endpoint: GET /api/attendance/by_student/?student_id=1
 */
export const getStudentAttendance = async (studentId, params = {}) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`📋 Fetching attendance for student ${studentId}...`);
    }

    const queryParams = new URLSearchParams();
    queryParams.append('student_id', studentId);
    
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.academic_year) queryParams.append('academic_year', params.academic_year);
    if (params.term) queryParams.append('term', params.term);
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);

    const response = await get(
      `${API_ENDPOINTS.ATTENDANCE.BASE}/by_student/?${queryParams.toString()}`
    );

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} attendance records for student`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get student attendance error:', error);

    return {
      success: false,
      message: 'Failed to fetch student attendance',
      error: handleApiError(error),
    };
  }
};

/**
 * Get student's attendance summary
 * @param {number} studentId - Student ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Student's attendance summary
 * 
 * Backend Endpoint: GET /api/attendance/summaries/?student=1
 */
export const getStudentAttendanceSummary = async (studentId, params = {}) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`📊 Fetching attendance summary for student ${studentId}...`);
    }

    const queryParams = new URLSearchParams();
    queryParams.append('student', studentId);
    
    if (params.academic_year) queryParams.append('academic_year', params.academic_year);
    if (params.term) queryParams.append('term', params.term);

    const response = await get(
      `${API_ENDPOINTS.ATTENDANCE.BASE}/summaries/?${queryParams.toString()}`
    );

    if (__DEV__) {
      console.log(`✅ Fetched attendance summary`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get student attendance summary error:', error);

    return {
      success: false,
      message: 'Failed to fetch attendance summary',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// STATISTICS & REPORTS
// ============================================================

/**
 * Get attendance statistics
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Attendance statistics
 * 
 * Backend Endpoint: GET /api/attendance/statistics/
 */
export const getAttendanceStatistics = async (params = {}) => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching attendance statistics...');
    }

    const queryParams = new URLSearchParams();
    
    if (params.date) queryParams.append('date', params.date);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.school) queryParams.append('school', params.school);
    if (params.grade) queryParams.append('grade', params.grade);
    if (params.stream) queryParams.append('stream', params.stream);

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.ATTENDANCE.BASE}/statistics/?${queryString}`
      : `${API_ENDPOINTS.ATTENDANCE.BASE}/statistics/`;

    const response = await get(url);

    if (__DEV__) {
      console.log(`✅ Fetched attendance statistics`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get attendance statistics error:', error);

    return {
      success: false,
      message: 'Failed to fetch attendance statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Get attendance history with filters
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Attendance history
 * 
 * Backend Endpoint: GET /api/attendance/history/
 */
export const getAttendanceHistory = async (params = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching attendance history...');
    }

    const queryParams = new URLSearchParams();
    
    if (params.student) queryParams.append('student', params.student);
    if (params.school) queryParams.append('school', params.school);
    if (params.start_date) queryParams.append('start_date', params.start_date);
    if (params.end_date) queryParams.append('end_date', params.end_date);
    if (params.status) queryParams.append('status', params.status);
    if (params.method) queryParams.append('method', params.method);
    if (params.page) queryParams.append('page', params.page);
    if (params.page_size) queryParams.append('page_size', params.page_size);

    const queryString = queryParams.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.ATTENDANCE.BASE}/history/?${queryString}`
      : `${API_ENDPOINTS.ATTENDANCE.BASE}/history/`;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} history records`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get attendance history error:', error);

    return {
      success: false,
      message: 'Failed to fetch attendance history',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// UPDATE & DELETE
// ============================================================

/**
 * Update attendance record
 * @param {number} recordId - Attendance record ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated attendance record
 * 
 * Backend Endpoint: PATCH /api/attendance/{id}/
 */
export const updateAttendance = async (recordId, data) => {
  try {
    if (!recordId) {
      throw new Error('Attendance record ID is required');
    }

    if (__DEV__) {
      console.log(`📝 Updating attendance record ${recordId}...`);
    }

    const response = await patch(API_ENDPOINTS.ATTENDANCE.UPDATE(recordId), data);

    if (__DEV__) {
      console.log(`✅ Attendance record updated`);
    }

    return {
      success: true,
      data: response,
      message: 'Attendance record updated successfully',
    };
  } catch (error) {
    console.error('❌ Update attendance error:', error);

    return {
      success: false,
      message: 'Failed to update attendance record',
      error: handleApiError(error),
    };
  }
};

/**
 * Delete attendance record
 * @param {number} recordId - Attendance record ID
 * @returns {Promise<Object>} Success response
 * 
 * Backend Endpoint: DELETE /api/attendance/{id}/
 */
export const deleteAttendance = async (recordId) => {
  try {
    if (!recordId) {
      throw new Error('Attendance record ID is required');
    }

    if (__DEV__) {
      console.log(`🗑️ Deleting attendance record ${recordId}...`);
    }

    await del(API_ENDPOINTS.ATTENDANCE.DELETE(recordId));

    if (__DEV__) {
      console.log(`✅ Attendance record deleted`);
    }

    return {
      success: true,
      message: 'Attendance record deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete attendance error:', error);

    return {
      success: false,
      message: 'Failed to delete attendance record',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Read Operations
  getTodaysAttendance,
  getAttendanceRecords,
  getAttendanceById,
  getStudentAttendance,
  getStudentAttendanceSummary,
  getAttendanceStatistics,
  getAttendanceHistory,

  // Mark Attendance
  markPresent,
  markAbsent,
  markLate,
  markExcused,
  bulkMarkAttendance,

  // Update & Delete
  updateAttendance,
  deleteAttendance,
};