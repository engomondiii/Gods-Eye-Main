// ========================================
// GOD'S EYE EDTECH - SCHOOL ADMIN SERVICE
// Comprehensive school management functions
// Backend Integration: Teachers, Students, Guardians, Schools APIs
// ========================================

import { handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

// ========================================
// TEACHER MANAGEMENT
// ========================================

/**
 * Get list of teachers
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Teachers list
 */
export const getTeachers = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      search = null,
      is_active = null,
      subject = null,
    } = params;

    if (__DEV__) {
      console.log('👨‍🏫 Fetching teachers...', params);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search) queryParams.append('search', search);
    if (is_active !== null) queryParams.append('is_active', is_active);
    if (subject) queryParams.append('subject_specialization', subject);

    const response = await fetch(
      `${API_ENDPOINTS.TEACHERS.LIST}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch teachers');
    }

    if (__DEV__) {
      console.log('✅ Teachers fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get teachers error:', error);
    return handleApiError(error);
  }
};

/**
 * Create teacher
 * @param {Object} data - Teacher data
 * @returns {Promise<Object>} Created teacher
 */
export const createTeacher = async (data) => {
  try {
    if (__DEV__) {
      console.log('➕ Creating teacher...', data);
    }

    const response = await fetch(API_ENDPOINTS.TEACHERS.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create teacher');
    }

    if (__DEV__) {
      console.log('✅ Teacher created:', result.id);
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Create teacher error:', error);
    return handleApiError(error);
  }
};

/**
 * Update teacher
 * @param {number} id - Teacher ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated teacher
 */
export const updateTeacher = async (id, data) => {
  try {
    if (__DEV__) {
      console.log('✏️ Updating teacher...', { id, data });
    }

    const response = await fetch(API_ENDPOINTS.TEACHERS.DETAIL(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update teacher');
    }

    if (__DEV__) {
      console.log('✅ Teacher updated');
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Update teacher error:', error);
    return handleApiError(error);
  }
};

/**
 * Delete teacher
 * @param {number} id - Teacher ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteTeacher = async (id) => {
  try {
    if (__DEV__) {
      console.log('🗑️ Deleting teacher...', { id });
    }

    const response = await fetch(API_ENDPOINTS.TEACHERS.DETAIL(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete teacher');
    }

    if (__DEV__) {
      console.log('✅ Teacher deleted');
    }

    return {
      success: true,
      message: 'Teacher deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete teacher error:', error);
    return handleApiError(error);
  }
};

/**
 * Assign class to teacher
 * @param {number} teacherId - Teacher ID
 * @param {Object} classData - Class assignment data
 * @returns {Promise<Object>} Assignment response
 */
export const assignClass = async (teacherId, classData) => {
  try {
    if (__DEV__) {
      console.log('📚 Assigning class to teacher...', { teacherId, classData });
    }

    const response = await fetch(
      API_ENDPOINTS.TEACHERS.ASSIGN_CLASS(teacherId),
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(classData),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to assign class');
    }

    if (__DEV__) {
      console.log('✅ Class assigned to teacher');
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Assign class error:', error);
    return handleApiError(error);
  }
};

// ========================================
// STUDENT MANAGEMENT
// ========================================

/**
 * Get list of students
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Students list
 */
export const getStudents = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      search = null,
      grade = null,
      stream = null,
      is_active = null,
    } = params;

    if (__DEV__) {
      console.log('👨‍🎓 Fetching students...', params);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search) queryParams.append('search', search);
    if (grade) queryParams.append('current_grade', grade);
    if (stream) queryParams.append('stream', stream);
    if (is_active !== null) queryParams.append('is_active', is_active);

    const response = await fetch(
      `${API_ENDPOINTS.STUDENTS.LIST}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch students');
    }

    if (__DEV__) {
      console.log('✅ Students fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get students error:', error);
    return handleApiError(error);
  }
};

/**
 * Create student
 * @param {Object} data - Student data
 * @returns {Promise<Object>} Created student
 */
export const createStudent = async (data) => {
  try {
    if (__DEV__) {
      console.log('➕ Creating student...', data);
    }

    const response = await fetch(API_ENDPOINTS.STUDENTS.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create student');
    }

    if (__DEV__) {
      console.log('✅ Student created:', result.id);
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Create student error:', error);
    return handleApiError(error);
  }
};

/**
 * Update student
 * @param {number} id - Student ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated student
 */
export const updateStudent = async (id, data) => {
  try {
    if (__DEV__) {
      console.log('✏️ Updating student...', { id, data });
    }

    const response = await fetch(API_ENDPOINTS.STUDENTS.DETAIL(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update student');
    }

    if (__DEV__) {
      console.log('✅ Student updated');
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Update student error:', error);
    return handleApiError(error);
  }
};

/**
 * Delete student
 * @param {number} id - Student ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteStudent = async (id) => {
  try {
    if (__DEV__) {
      console.log('🗑️ Deleting student...', { id });
    }

    const response = await fetch(API_ENDPOINTS.STUDENTS.DETAIL(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete student');
    }

    if (__DEV__) {
      console.log('✅ Student deleted');
    }

    return {
      success: true,
      message: 'Student deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete student error:', error);
    return handleApiError(error);
  }
};

/**
 * Bulk create students
 * @param {Array} studentsData - Array of student data
 * @returns {Promise<Object>} Creation response
 */
export const bulkCreateStudents = async (studentsData) => {
  try {
    if (__DEV__) {
      console.log('📦 Bulk creating students...', studentsData.length);
    }

    const response = await fetch(API_ENDPOINTS.STUDENTS.BULK_CREATE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ students: studentsData }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to bulk create students');
    }

    if (__DEV__) {
      console.log('✅ Students bulk created:', result.created);
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Bulk create students error:', error);
    return handleApiError(error);
  }
};

// ========================================
// GUARDIAN MANAGEMENT
// ========================================

/**
 * Get list of guardians
 * @param {Object} params - Query parameters
 * @returns {Promise<Object>} Guardians list
 */
export const getGuardians = async (params = {}) => {
  try {
    const {
      page = 1,
      page_size = 20,
      search = null,
      is_primary = null,
    } = params;

    if (__DEV__) {
      console.log('👪 Fetching guardians...', params);
    }

    const queryParams = new URLSearchParams({
      page: page.toString(),
      page_size: page_size.toString(),
    });

    if (search) queryParams.append('search', search);
    if (is_primary !== null) queryParams.append('is_primary', is_primary);

    const response = await fetch(
      `${API_ENDPOINTS.GUARDIANS.LIST}?${queryParams}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch guardians');
    }

    if (__DEV__) {
      console.log('✅ Guardians fetched:', data.count);
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get guardians error:', error);
    return handleApiError(error);
  }
};

/**
 * Create guardian
 * @param {Object} data - Guardian data
 * @returns {Promise<Object>} Created guardian
 */
export const createGuardian = async (data) => {
  try {
    if (__DEV__) {
      console.log('➕ Creating guardian...', data);
    }

    const response = await fetch(API_ENDPOINTS.GUARDIANS.LIST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create guardian');
    }

    if (__DEV__) {
      console.log('✅ Guardian created:', result.id);
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Create guardian error:', error);
    return handleApiError(error);
  }
};

/**
 * Update guardian
 * @param {number} id - Guardian ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated guardian
 */
export const updateGuardian = async (id, data) => {
  try {
    if (__DEV__) {
      console.log('✏️ Updating guardian...', { id, data });
    }

    const response = await fetch(API_ENDPOINTS.GUARDIANS.DETAIL(id), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update guardian');
    }

    if (__DEV__) {
      console.log('✅ Guardian updated');
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Update guardian error:', error);
    return handleApiError(error);
  }
};

/**
 * Delete guardian
 * @param {number} id - Guardian ID
 * @returns {Promise<Object>} Deletion response
 */
export const deleteGuardian = async (id) => {
  try {
    if (__DEV__) {
      console.log('🗑️ Deleting guardian...', { id });
    }

    const response = await fetch(API_ENDPOINTS.GUARDIANS.DETAIL(id), {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to delete guardian');
    }

    if (__DEV__) {
      console.log('✅ Guardian deleted');
    }

    return {
      success: true,
      message: 'Guardian deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete guardian error:', error);
    return handleApiError(error);
  }
};

// ========================================
// SCHOOL SETTINGS MANAGEMENT
// ========================================

/**
 * Get school settings
 * @param {number} schoolId - School ID
 * @returns {Promise<Object>} School settings
 */
export const getSchoolSettings = async (schoolId) => {
  try {
    if (__DEV__) {
      console.log('⚙️ Fetching school settings...', { schoolId });
    }

    const response = await fetch(API_ENDPOINTS.SCHOOLS.SETTINGS(schoolId), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Failed to fetch school settings');
    }

    if (__DEV__) {
      console.log('✅ School settings fetched');
    }

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error('❌ Get school settings error:', error);
    return handleApiError(error);
  }
};

/**
 * Update school settings
 * @param {number} schoolId - School ID
 * @param {Object} data - Settings data
 * @returns {Promise<Object>} Updated settings
 */
export const updateSchoolSettings = async (schoolId, data) => {
  try {
    if (__DEV__) {
      console.log('✏️ Updating school settings...', { schoolId, data });
    }

    const response = await fetch(API_ENDPOINTS.SCHOOLS.SETTINGS(schoolId), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to update school settings');
    }

    if (__DEV__) {
      console.log('✅ School settings updated');
    }

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error('❌ Update school settings error:', error);
    return handleApiError(error);
  }
};

export default {
  // Teachers
  getTeachers,
  createTeacher,
  updateTeacher,
  deleteTeacher,
  assignClass,
  // Students
  getStudents,
  createStudent,
  updateStudent,
  deleteStudent,
  bulkCreateStudents,
  // Guardians
  getGuardians,
  createGuardian,
  updateGuardian,
  deleteGuardian,
  // Settings
  getSchoolSettings,
  updateSchoolSettings,
};