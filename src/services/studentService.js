// ========================================
// GOD'S EYE EDTECH - STUDENT SERVICE
// ========================================

import { get, post, put, patch, del, handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

// ============================================================
// STUDENT CRUD OPERATIONS
// ============================================================

/**
 * Get all students with optional filters
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} List of students
 * 
 * Backend Endpoint: GET /api/students/
 * Supported filters: school, county, education_level, current_grade, 
 *                   stream, gender, is_active, has_special_needs, house_name
 */
export const getStudents = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('👨‍🎓 Fetching students with filters:', filters);
    }

    // Build query parameters
    const params = new URLSearchParams();
    
    if (filters.school) params.append('school', filters.school);
    if (filters.county) params.append('county', filters.county);
    if (filters.education_level) params.append('education_level', filters.education_level);
    if (filters.current_grade) params.append('current_grade', filters.current_grade);
    if (filters.stream) params.append('stream', filters.stream);
    if (filters.gender) params.append('gender', filters.gender);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
    if (filters.has_special_needs !== undefined) params.append('has_special_needs', filters.has_special_needs);
    if (filters.house_name) params.append('house_name', filters.house_name);
    if (filters.search) params.append('search', filters.search);
    if (filters.ordering) params.append('ordering', filters.ordering);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.STUDENTS.LIST}?${queryString}`
      : API_ENDPOINTS.STUDENTS.LIST;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} students`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get students error:', error);

    return {
      success: false,
      message: 'Failed to fetch students',
      error: handleApiError(error),
    };
  }
};

/**
 * Get student by ID
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Student details with guardians
 * 
 * Backend Endpoint: GET /api/students/{id}/
 */
export const getStudentById = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`👨‍🎓 Fetching student ${studentId}...`);
    }

    const response = await get(API_ENDPOINTS.STUDENTS.DETAIL(studentId));

    if (__DEV__) {
      console.log(`✅ Fetched student: ${response.full_name}`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get student error:', error);

    return {
      success: false,
      message: 'Failed to fetch student',
      error: handleApiError(error),
    };
  }
};

/**
 * Create new student
 * @param {Object} studentData - Student data
 * @returns {Promise<Object>} Created student
 * 
 * Backend Endpoint: POST /api/students/
 */
export const createStudent = async (studentData) => {
  try {
    if (__DEV__) {
      console.log('👨‍🎓 Creating student:', studentData.first_name, studentData.last_name);
    }

    const response = await post(API_ENDPOINTS.STUDENTS.CREATE, studentData);

    if (__DEV__) {
      console.log(`✅ Student created: ${response.full_name}`);
    }

    return {
      success: true,
      data: response,
      message: 'Student created successfully',
    };
  } catch (error) {
    console.error('❌ Create student error:', error);

    return {
      success: false,
      message: 'Failed to create student',
      error: handleApiError(error),
    };
  }
};

/**
 * Update student
 * @param {number} studentId - Student ID
 * @param {Object} studentData - Updated student data
 * @returns {Promise<Object>} Updated student
 * 
 * Backend Endpoint: PATCH /api/students/{id}/
 */
export const updateStudent = async (studentId, studentData) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`👨‍🎓 Updating student ${studentId}...`);
    }

    const response = await patch(API_ENDPOINTS.STUDENTS.UPDATE(studentId), studentData);

    if (__DEV__) {
      console.log(`✅ Student updated: ${response.full_name}`);
    }

    return {
      success: true,
      data: response,
      message: 'Student updated successfully',
    };
  } catch (error) {
    console.error('❌ Update student error:', error);

    return {
      success: false,
      message: 'Failed to update student',
      error: handleApiError(error),
    };
  }
};

/**
 * Delete student
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Success response
 * 
 * Backend Endpoint: DELETE /api/students/{id}/
 */
export const deleteStudent = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`👨‍🎓 Deleting student ${studentId}...`);
    }

    await del(API_ENDPOINTS.STUDENTS.DELETE(studentId));

    if (__DEV__) {
      console.log(`✅ Student deleted`);
    }

    return {
      success: true,
      message: 'Student deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete student error:', error);

    return {
      success: false,
      message: 'Failed to delete student',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// STUDENT QUERIES
// ============================================================

/**
 * Get students by grade
 * @param {string} grade - Grade code (e.g., 'grade_5')
 * @returns {Promise<Array>} Students in the grade
 * 
 * Backend Endpoint: GET /api/students/?current_grade=grade_5
 */
export const getStudentsByGrade = async (grade) => {
  return await getStudents({ current_grade: grade });
};

/**
 * Get students by stream
 * @param {string} stream - Stream name
 * @returns {Promise<Array>} Students in the stream
 */
export const getStudentsByStream = async (stream) => {
  return await getStudents({ stream });
};

/**
 * Get students by house
 * @param {string} houseName - House name
 * @returns {Promise<Array>} Students in the house
 */
export const getStudentsByHouse = async (houseName) => {
  return await getStudents({ house_name: houseName });
};

/**
 * Get students by education level
 * @param {string} level - Education level code
 * @returns {Promise<Array>} Students in the education level
 */
export const getStudentsByLevel = async (level) => {
  return await getStudents({ education_level: level });
};

/**
 * Search students
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 * 
 * Backend Endpoint: GET /api/students/search/?q=query
 */
export const searchStudents = async (query) => {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        data: { count: 0, results: [] },
      };
    }

    if (__DEV__) {
      console.log(`🔍 Searching students: "${query}"`);
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/search/?q=${encodeURIComponent(query)}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Search students error:', error);

    return {
      success: false,
      message: 'Failed to search students',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// STUDENT GUARDIANS
// ============================================================

/**
 * Get student's guardians
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Student's guardians
 * 
 * Backend Endpoint: GET /api/students/{id}/get_guardians/
 */
export const getStudentGuardians = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`👨‍👩‍👧 Fetching guardians for student ${studentId}...`);
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.DETAIL(studentId)}/get_guardians/`);

    if (__DEV__) {
      console.log(`✅ Found ${response.guardian_count} guardians`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get student guardians error:', error);

    return {
      success: false,
      message: 'Failed to fetch student guardians',
      error: handleApiError(error),
    };
  }
};

/**
 * Get student's attendance records
 * @param {number} studentId - Student ID
 * @param {Object} filters - Optional filters (start_date, end_date)
 * @returns {Promise<Object>} Student's attendance
 * 
 * Backend Endpoint: GET /api/students/{id}/get_attendance/
 */
export const getStudentAttendance = async (studentId, filters = {}) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`📅 Fetching attendance for student ${studentId}...`);
    }

    const params = new URLSearchParams();
    if (filters.start_date) params.append('start_date', filters.start_date);
    if (filters.end_date) params.append('end_date', filters.end_date);

    const queryString = params.toString();
    const url = queryString
      ? `${API_ENDPOINTS.STUDENTS.DETAIL(studentId)}/get_attendance/?${queryString}`
      : `${API_ENDPOINTS.STUDENTS.DETAIL(studentId)}/get_attendance/`;

    const response = await get(url);

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
 * Get student's payment requests
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Student's payments
 * 
 * Backend Endpoint: GET /api/students/{id}/get_payments/
 */
export const getStudentPayments = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`💰 Fetching payments for student ${studentId}...`);
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.DETAIL(studentId)}/get_payments/`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get student payments error:', error);

    return {
      success: false,
      message: 'Failed to fetch student payments',
      error: handleApiError(error),
    };
  }
};

/**
 * Get student's QR code
 * @param {number} studentId - Student ID
 * @returns {Promise<Object>} Student's QR code
 * 
 * Backend Endpoint: GET /api/students/{id}/get_qr_code/
 */
export const getStudentQRCode = async (studentId) => {
  try {
    if (!studentId) {
      throw new Error('Student ID is required');
    }

    if (__DEV__) {
      console.log(`📱 Fetching QR code for student ${studentId}...`);
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.DETAIL(studentId)}/get_qr_code/`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get student QR code error:', error);

    return {
      success: false,
      message: 'Failed to fetch student QR code',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// VALIDATION OPERATIONS
// ============================================================

/**
 * Validate UPI number (for new student)
 * @param {string} upi - UPI number to validate
 * @returns {Promise<Object>} Validation result
 * 
 * Backend Endpoint: POST /api/students/validate_upi_new/
 */
export const validateUPI = async (upi) => {
  try {
    if (!upi) {
      throw new Error('UPI number is required');
    }

    if (__DEV__) {
      console.log(`✓ Validating UPI: ${upi}`);
    }

    const response = await post(`${API_ENDPOINTS.STUDENTS.BASE}/validate_upi_new/`, { upi });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Validate UPI error:', error);

    return {
      success: false,
      message: 'Failed to validate UPI',
      error: handleApiError(error),
    };
  }
};

/**
 * Check admission number availability
 * @param {number} schoolId - School ID
 * @param {string} admissionNumber - Admission number to check
 * @returns {Promise<Object>} Availability result
 * 
 * Backend Endpoint: POST /api/students/check_admission_number/
 */
export const checkAdmissionNumber = async (schoolId, admissionNumber) => {
  try {
    if (!schoolId || !admissionNumber) {
      throw new Error('School ID and admission number are required');
    }

    if (__DEV__) {
      console.log(`✓ Checking admission number: ${admissionNumber}`);
    }

    const response = await post(`${API_ENDPOINTS.STUDENTS.BASE}/check_admission_number/`, {
      school: schoolId,
      admission_number: admissionNumber,
    });

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Check admission number error:', error);

    return {
      success: false,
      message: 'Failed to check admission number',
      error: handleApiError(error),
    };
  }
};

/**
 * Generate admission number for school
 * @param {number} schoolId - School ID
 * @returns {Promise<Object>} Generated admission number
 * 
 * Backend Endpoint: GET /api/students/generate_admission_number/?school=1
 */
export const generateAdmissionNumber = async (schoolId) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (__DEV__) {
      console.log(`🔢 Generating admission number for school ${schoolId}...`);
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/generate_admission_number/?school=${schoolId}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Generate admission number error:', error);

    return {
      success: false,
      message: 'Failed to generate admission number',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// STATISTICS OPERATIONS
// ============================================================

/**
 * Get student statistics by grade
 * @returns {Promise<Object>} Statistics by grade
 * 
 * Backend Endpoint: GET /api/students/statistics_by_grade/
 */
export const getStatisticsByGrade = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching student statistics by grade...');
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/statistics_by_grade/`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get statistics by grade error:', error);

    return {
      success: false,
      message: 'Failed to fetch statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Get student statistics by stream
 * @returns {Promise<Object>} Statistics by stream
 * 
 * Backend Endpoint: GET /api/students/statistics_by_stream/
 */
export const getStatisticsByStream = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching student statistics by stream...');
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/statistics_by_stream/`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get statistics by stream error:', error);

    return {
      success: false,
      message: 'Failed to fetch statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Get student statistics by gender
 * @returns {Promise<Object>} Statistics by gender
 * 
 * Backend Endpoint: GET /api/students/statistics_by_gender/
 */
export const getStatisticsByGender = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching student statistics by gender...');
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/statistics_by_gender/`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get statistics by gender error:', error);

    return {
      success: false,
      message: 'Failed to fetch statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Get student statistics by house
 * @returns {Promise<Object>} Statistics by house
 * 
 * Backend Endpoint: GET /api/students/statistics_by_house/
 */
export const getStatisticsByHouse = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching student statistics by house...');
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/statistics_by_house/`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get statistics by house error:', error);

    return {
      success: false,
      message: 'Failed to fetch statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Get comprehensive student statistics
 * @returns {Promise<Object>} Comprehensive statistics
 * 
 * Backend Endpoint: GET /api/students/statistics/
 */
export const getStatistics = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching comprehensive student statistics...');
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/statistics/`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get statistics error:', error);

    return {
      success: false,
      message: 'Failed to fetch statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Get students grouped by grade and stream
 * @returns {Promise<Object>} Students grouped by grade and stream
 * 
 * Backend Endpoint: GET /api/students/by_grade_and_stream/
 */
export const getByGradeAndStream = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching students by grade and stream...');
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/by_grade_and_stream/`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get by grade and stream error:', error);

    return {
      success: false,
      message: 'Failed to fetch data',
      error: handleApiError(error),
    };
  }
};

/**
 * Get recently added students
 * @param {number} limit - Number of students to return (default: 10)
 * @returns {Promise<Object>} Recent students
 * 
 * Backend Endpoint: GET /api/students/recent/?limit=10
 */
export const getRecentStudents = async (limit = 10) => {
  try {
    if (__DEV__) {
      console.log(`📅 Fetching ${limit} recent students...`);
    }

    const response = await get(`${API_ENDPOINTS.STUDENTS.BASE}/recent/?limit=${limit}`);

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get recent students error:', error);

    return {
      success: false,
      message: 'Failed to fetch recent students',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // CRUD
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,

  // Queries
  getStudentsByGrade,
  getStudentsByStream,
  getStudentsByHouse,
  getStudentsByLevel,
  searchStudents,

  // Relations
  getStudentGuardians,
  getStudentAttendance,
  getStudentPayments,
  getStudentQRCode,

  // Validation
  validateUPI,
  checkAdmissionNumber,
  generateAdmissionNumber,

  // Statistics
  getStatisticsByGrade,
  getStatisticsByStream,
  getStatisticsByGender,
  getStatisticsByHouse,
  getStatistics,
  getByGradeAndStream,
  getRecentStudents,
};