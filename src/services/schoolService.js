// ========================================
// GOD'S EYE EDTECH - SCHOOL SERVICE
// ========================================

import { get, post, put, patch, del, handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

// ============================================================
// SCHOOL CRUD OPERATIONS
// ============================================================

/**
 * Get all schools with optional filters
 * @param {Object} filters - Optional filters (county, approval_status, is_active, search)
 * @returns {Promise<Object>} List of schools
 * 
 * Backend Endpoint: GET /api/schools/
 * Backend Response: [
 *   {
 *     "id": 1,
 *     "name": "Demo Primary School",
 *     "nemis_code": "123456789",
 *     "phone": "+254712345678",
 *     "email": "school@example.com",
 *     "address": "123 Main St",
 *     "county": 1,
 *     "county_name": "Nairobi",
 *     "approval_status": "approved",
 *     "approval_status_display": "Approved",
 *     "is_active": true,
 *     "created_at": "2025-01-01T00:00:00Z",
 *     "updated_at": "2025-01-01T00:00:00Z"
 *   }
 * ]
 */
export const getSchools = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('🏫 Fetching schools with filters:', filters);
    }

    // Build query parameters
    const params = new URLSearchParams();
    
    if (filters.county) params.append('county', filters.county);
    if (filters.approval_status) params.append('approval_status', filters.approval_status);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
    if (filters.search) params.append('search', filters.search);
    if (filters.ordering) params.append('ordering', filters.ordering);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.SCHOOLS.LIST}?${queryString}`
      : API_ENDPOINTS.SCHOOLS.LIST;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} schools`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get schools error:', error);

    return {
      success: false,
      message: 'Failed to fetch schools',
      error: handleApiError(error),
    };
  }
};

/**
 * Get all schools (convenience function)
 * @returns {Promise<Array>} List of all schools
 */
export const getAllSchools = async () => {
  return await getSchools();
};

/**
 * Get school by ID
 * @param {number} schoolId - School ID
 * @returns {Promise<Object>} School details with settings and county data
 * 
 * Backend Endpoint: GET /api/schools/{id}/
 * Backend Response: {
 *   "id": 1,
 *   "name": "Demo Primary School",
 *   "nemis_code": "123456789",
 *   "phone": "+254712345678",
 *   "email": "school@example.com",
 *   "address": "123 Main St",
 *   "county": 1,
 *   "county_data": {
 *     "id": 1,
 *     "name": "Nairobi",
 *     "code": "nairobi",
 *     "country": 1
 *   },
 *   "approval_status": "approved",
 *   "approval_status_display": "Approved",
 *   "approved_by": 1,
 *   "approved_by_name": "Super Admin",
 *   "approved_at": "2025-01-01T00:00:00Z",
 *   "rejection_reason": "",
 *   "is_active": true,
 *   "settings": {
 *     "enable_biometric": true,
 *     "enable_qr_code": true,
 *     "current_term": "term_1",
 *     "academic_year": "2025"
 *   },
 *   "created_at": "2025-01-01T00:00:00Z",
 *   "updated_at": "2025-01-01T00:00:00Z"
 * }
 */
export const getSchoolById = async (schoolId) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (__DEV__) {
      console.log(`🏫 Fetching school ${schoolId}...`);
    }

    const response = await get(API_ENDPOINTS.SCHOOLS.DETAIL(schoolId));

    if (__DEV__) {
      console.log(`✅ Fetched school: ${response.name}`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get school error:', error);

    return {
      success: false,
      message: 'Failed to fetch school',
      error: handleApiError(error),
    };
  }
};

/**
 * Get schools by county
 * @param {number} countyId - County ID
 * @param {boolean} approvedOnly - Only return approved schools (default: true)
 * @returns {Promise<Array>} List of schools in the county
 * 
 * Backend Endpoint: GET /api/schools/?county={countyId}&approval_status=approved
 */
export const getSchoolsByCounty = async (countyId, approvedOnly = true) => {
  try {
    if (!countyId) {
      throw new Error('County ID is required');
    }

    if (__DEV__) {
      console.log(`🏫 Fetching schools for county ${countyId}...`);
    }

    const filters = {
      county: countyId,
      ...(approvedOnly && { approval_status: 'approved' }),
    };

    const result = await getSchools(filters);

    return result;
  } catch (error) {
    console.error('❌ Get schools by county error:', error);

    return {
      success: false,
      message: 'Failed to fetch schools',
      error: handleApiError(error),
    };
  }
};

/**
 * Create a new school
 * @param {Object} schoolData - School data
 * @returns {Promise<Object>} Created school
 * 
 * Backend Endpoint: POST /api/schools/
 * Body: {
 *   "name": "New School",
 *   "nemis_code": "123456789",
 *   "phone": "+254712345678",
 *   "email": "school@example.com",
 *   "address": "123 Main St",
 *   "county": 1
 * }
 */
export const createSchool = async (schoolData) => {
  try {
    if (__DEV__) {
      console.log('🏫 Creating school:', schoolData.name);
    }

    const response = await post(API_ENDPOINTS.SCHOOLS.CREATE, schoolData);

    if (__DEV__) {
      console.log(`✅ School created: ${response.name}`);
    }

    return {
      success: true,
      data: response,
      message: 'School created successfully. Awaiting approval.',
    };
  } catch (error) {
    console.error('❌ Create school error:', error);

    return {
      success: false,
      message: 'Failed to create school',
      error: handleApiError(error),
    };
  }
};

/**
 * Update school
 * @param {number} schoolId - School ID
 * @param {Object} schoolData - Updated school data
 * @returns {Promise<Object>} Updated school
 * 
 * Backend Endpoint: PUT /api/schools/{id}/
 * Backend Endpoint: PATCH /api/schools/{id}/
 */
export const updateSchool = async (schoolId, schoolData) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (__DEV__) {
      console.log(`🏫 Updating school ${schoolId}...`);
    }

    const response = await patch(API_ENDPOINTS.SCHOOLS.UPDATE(schoolId), schoolData);

    if (__DEV__) {
      console.log(`✅ School updated: ${response.name}`);
    }

    return {
      success: true,
      data: response,
      message: 'School updated successfully',
    };
  } catch (error) {
    console.error('❌ Update school error:', error);

    return {
      success: false,
      message: 'Failed to update school',
      error: handleApiError(error),
    };
  }
};

/**
 * Delete school (Super Admin only)
 * @param {number} schoolId - School ID
 * @returns {Promise<Object>} Success response
 * 
 * Backend Endpoint: DELETE /api/schools/{id}/
 */
export const deleteSchool = async (schoolId) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (__DEV__) {
      console.log(`🏫 Deleting school ${schoolId}...`);
    }

    await del(API_ENDPOINTS.SCHOOLS.DELETE(schoolId));

    if (__DEV__) {
      console.log(`✅ School deleted`);
    }

    return {
      success: true,
      message: 'School deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete school error:', error);

    return {
      success: false,
      message: 'Failed to delete school',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// SCHOOL APPROVAL OPERATIONS (Super Admin only)
// ============================================================

/**
 * Approve school
 * @param {number} schoolId - School ID
 * @returns {Promise<Object>} Approved school
 * 
 * Backend Endpoint: POST /api/schools/{id}/approve_school/
 */
export const approveSchool = async (schoolId) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (__DEV__) {
      console.log(`✅ Approving school ${schoolId}...`);
    }

    const response = await post(API_ENDPOINTS.SCHOOLS.APPROVE(schoolId));

    if (__DEV__) {
      console.log(`✅ School approved: ${response.school?.name}`);
    }

    return {
      success: true,
      data: response.school,
      message: response.message || 'School approved successfully',
    };
  } catch (error) {
    console.error('❌ Approve school error:', error);

    return {
      success: false,
      message: 'Failed to approve school',
      error: handleApiError(error),
    };
  }
};

/**
 * Reject school
 * @param {number} schoolId - School ID
 * @param {string} rejectionReason - Reason for rejection
 * @returns {Promise<Object>} Rejected school
 * 
 * Backend Endpoint: POST /api/schools/{id}/reject_school/
 * Body: { "rejection_reason": "Reason" }
 */
export const rejectSchool = async (schoolId, rejectionReason) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (!rejectionReason) {
      throw new Error('Rejection reason is required');
    }

    if (__DEV__) {
      console.log(`❌ Rejecting school ${schoolId}...`);
    }

    const response = await post(API_ENDPOINTS.SCHOOLS.REJECT(schoolId), {
      rejection_reason: rejectionReason,
    });

    if (__DEV__) {
      console.log(`✅ School rejected: ${response.school?.name}`);
    }

    return {
      success: true,
      data: response.school,
      message: response.message || 'School rejected',
    };
  } catch (error) {
    console.error('❌ Reject school error:', error);

    return {
      success: false,
      message: 'Failed to reject school',
      error: handleApiError(error),
    };
  }
};

/**
 * Get pending schools (awaiting approval)
 * @returns {Promise<Array>} List of pending schools
 * 
 * Backend Endpoint: GET /api/schools/?approval_status=pending
 */
export const getPendingSchools = async () => {
  return await getSchools({ approval_status: 'pending' });
};

// ============================================================
// SCHOOL STATISTICS
// ============================================================

/**
 * Get school statistics
 * @param {number} schoolId - School ID
 * @returns {Promise<Object>} School statistics
 * 
 * Backend Endpoint: GET /api/schools/{id}/statistics/
 * Backend Response: {
 *   "total_students": 500,
 *   "total_teachers": 30,
 *   "total_classes": 15,
 *   "attendance_rate": 95.5,
 *   "payment_rate": 85.2
 * }
 */
export const getSchoolStatistics = async (schoolId) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (__DEV__) {
      console.log(`📊 Fetching statistics for school ${schoolId}...`);
    }

    const response = await get(API_ENDPOINTS.SCHOOLS.STATISTICS(schoolId));

    if (__DEV__) {
      console.log(`✅ Statistics fetched`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get school statistics error:', error);

    return {
      success: false,
      message: 'Failed to fetch school statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Get system-wide school statistics (Super Admin only)
 * @returns {Promise<Object>} System statistics
 * 
 * Backend Endpoint: GET /api/schools/get_statistics/
 * Backend Response: {
 *   "total_schools": 100,
 *   "pending_schools": 5,
 *   "approved_schools": 90,
 *   "rejected_schools": 5,
 *   "active_schools": 85
 * }
 */
export const getSystemStatistics = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching system statistics...');
    }

    // Note: The backend endpoint is /get_statistics/ (custom action)
    const response = await get(`${API_ENDPOINTS.SCHOOLS.BASE}/get_statistics/`);

    if (__DEV__) {
      console.log(`✅ System statistics fetched`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get system statistics error:', error);

    return {
      success: false,
      message: 'Failed to fetch system statistics',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// SCHOOL SETTINGS
// ============================================================

/**
 * Get school settings
 * @param {number} schoolId - School ID
 * @returns {Promise<Object>} School settings
 * 
 * Backend Endpoint: GET /api/schools/settings/{schoolId}/
 */
export const getSchoolSettings = async (schoolId) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (__DEV__) {
      console.log(`⚙️ Fetching settings for school ${schoolId}...`);
    }

    const response = await get(API_ENDPOINTS.SCHOOLS.SETTINGS(schoolId));

    if (__DEV__) {
      console.log(`✅ Settings fetched`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get school settings error:', error);

    return {
      success: false,
      message: 'Failed to fetch school settings',
      error: handleApiError(error),
    };
  }
};

/**
 * Update school settings
 * @param {number} schoolId - School ID
 * @param {Object} settingsData - Updated settings
 * @returns {Promise<Object>} Updated settings
 * 
 * Backend Endpoint: PATCH /api/schools/settings/{schoolId}/
 */
export const updateSchoolSettings = async (schoolId, settingsData) => {
  try {
    if (!schoolId) {
      throw new Error('School ID is required');
    }

    if (__DEV__) {
      console.log(`⚙️ Updating settings for school ${schoolId}...`);
    }

    const response = await patch(API_ENDPOINTS.SCHOOLS.SETTINGS(schoolId), settingsData);

    if (__DEV__) {
      console.log(`✅ Settings updated`);
    }

    return {
      success: true,
      data: response,
      message: 'Settings updated successfully',
    };
  } catch (error) {
    console.error('❌ Update school settings error:', error);

    return {
      success: false,
      message: 'Failed to update school settings',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// SEARCH OPERATIONS
// ============================================================

/**
 * Search schools by name or NEMIS code
 * @param {string} query - Search query
 * @returns {Promise<Array>} Search results
 * 
 * Backend Endpoint: GET /api/schools/?search={query}
 */
export const searchSchools = async (query) => {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        data: [],
      };
    }

    if (__DEV__) {
      console.log(`🔍 Searching schools: "${query}"`);
    }

    const result = await getSchools({ search: query });

    return result;
  } catch (error) {
    console.error('❌ Search schools error:', error);

    return {
      success: false,
      message: 'Failed to search schools',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // CRUD
  getSchools,
  getAllSchools,
  getSchoolById,
  getSchoolsByCounty,
  createSchool,
  updateSchool,
  deleteSchool,

  // Approval
  approveSchool,
  rejectSchool,
  getPendingSchools,

  // Statistics
  getSchoolStatistics,
  getSystemStatistics,

  // Settings
  getSchoolSettings,
  updateSchoolSettings,

  // Search
  searchSchools,
};