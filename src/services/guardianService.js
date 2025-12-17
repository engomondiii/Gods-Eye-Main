// ========================================
// GOD'S EYE EDTECH - GUARDIAN SERVICE
// ========================================

import { get, post, put, patch, del, handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

// ============================================================
// GUARDIAN CRUD OPERATIONS
// ============================================================

/**
 * Get all guardians with optional filters
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} List of guardians
 * 
 * Backend Endpoint: GET /api/guardians/
 */
export const getGuardians = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('👨‍👩‍👧 Fetching guardians with filters:', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.school) params.append('school', filters.school);
    if (filters.is_verified !== undefined) params.append('is_verified', filters.is_verified);
    if (filters.search) params.append('search', filters.search);
    if (filters.ordering) params.append('ordering', filters.ordering);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.GUARDIANS.LIST}?${queryString}`
      : API_ENDPOINTS.GUARDIANS.LIST;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} guardians`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get guardians error:', error);

    return {
      success: false,
      message: 'Failed to fetch guardians',
      error: handleApiError(error),
    };
  }
};

/**
 * Get guardian by ID
 * @param {number} guardianId - Guardian ID
 * @returns {Promise<Object>} Guardian details with students
 * 
 * Backend Endpoint: GET /api/guardians/{id}/
 */
export const getGuardianById = async (guardianId) => {
  try {
    if (!guardianId) {
      throw new Error('Guardian ID is required');
    }

    if (__DEV__) {
      console.log(`👨‍👩‍👧 Fetching guardian ${guardianId}...`);
    }

    const response = await get(API_ENDPOINTS.GUARDIANS.DETAIL(guardianId));

    if (__DEV__) {
      console.log(`✅ Fetched guardian: ${response.full_name}`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get guardian error:', error);

    return {
      success: false,
      message: 'Failed to fetch guardian',
      error: handleApiError(error),
    };
  }
};

/**
 * Create new guardian
 * @param {Object} guardianData - Guardian data
 * @returns {Promise<Object>} Created guardian
 * 
 * Backend Endpoint: POST /api/guardians/
 */
export const createGuardian = async (guardianData) => {
  try {
    if (__DEV__) {
      console.log('👨‍👩‍👧 Creating guardian...');
    }

    const response = await post(API_ENDPOINTS.GUARDIANS.CREATE, guardianData);

    if (__DEV__) {
      console.log(`✅ Guardian created: ${response.full_name}`);
    }

    return {
      success: true,
      data: response,
      message: 'Guardian created successfully',
    };
  } catch (error) {
    console.error('❌ Create guardian error:', error);

    return {
      success: false,
      message: 'Failed to create guardian',
      error: handleApiError(error),
    };
  }
};

/**
 * Update guardian
 * @param {number} guardianId - Guardian ID
 * @param {Object} guardianData - Updated guardian data
 * @returns {Promise<Object>} Updated guardian
 * 
 * Backend Endpoint: PATCH /api/guardians/{id}/
 */
export const updateGuardian = async (guardianId, guardianData) => {
  try {
    if (!guardianId) {
      throw new Error('Guardian ID is required');
    }

    if (__DEV__) {
      console.log(`👨‍👩‍👧 Updating guardian ${guardianId}...`);
    }

    const response = await patch(API_ENDPOINTS.GUARDIANS.UPDATE(guardianId), guardianData);

    if (__DEV__) {
      console.log(`✅ Guardian updated: ${response.full_name}`);
    }

    return {
      success: true,
      data: response,
      message: 'Guardian updated successfully',
    };
  } catch (error) {
    console.error('❌ Update guardian error:', error);

    return {
      success: false,
      message: 'Failed to update guardian',
      error: handleApiError(error),
    };
  }
};

/**
 * Delete guardian
 * @param {number} guardianId - Guardian ID
 * @returns {Promise<Object>} Success response
 * 
 * Backend Endpoint: DELETE /api/guardians/{id}/
 */
export const deleteGuardian = async (guardianId) => {
  try {
    if (!guardianId) {
      throw new Error('Guardian ID is required');
    }

    if (__DEV__) {
      console.log(`👨‍👩‍👧 Deleting guardian ${guardianId}...`);
    }

    await del(API_ENDPOINTS.GUARDIANS.DELETE(guardianId));

    if (__DEV__) {
      console.log(`✅ Guardian deleted`);
    }

    return {
      success: true,
      message: 'Guardian deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete guardian error:', error);

    return {
      success: false,
      message: 'Failed to delete guardian',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// GUARDIAN STUDENTS
// ============================================================

/**
 * Get guardian's students
 * @param {number} guardianId - Guardian ID
 * @returns {Promise<Object>} Guardian's students
 * 
 * Backend Endpoint: GET /api/guardians/{id}/students/
 */
export const getGuardianStudents = async (guardianId) => {
  try {
    if (!guardianId) {
      throw new Error('Guardian ID is required');
    }

    if (__DEV__) {
      console.log(`👨‍👩‍👧 Fetching students for guardian ${guardianId}...`);
    }

    const response = await get(API_ENDPOINTS.GUARDIANS.STUDENTS(guardianId));

    if (__DEV__) {
      console.log(`✅ Found ${response.length || 0} students`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get guardian students error:', error);

    return {
      success: false,
      message: 'Failed to fetch guardian students',
      error: handleApiError(error),
    };
  }
};

/**
 * Get current guardian's students (authenticated guardian)
 * @returns {Promise<Object>} Current guardian's students
 * 
 * Backend Endpoint: GET /api/guardians/my_students/
 */
export const getMyStudents = async () => {
  try {
    if (__DEV__) {
      console.log('👨‍👩‍👧 Fetching my students...');
    }

    const response = await get(API_ENDPOINTS.GUARDIANS.MY_STUDENTS);

    if (__DEV__) {
      console.log(`✅ Found ${response.length || 0} students`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get my students error:', error);

    return {
      success: false,
      message: 'Failed to fetch your students',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// GUARDIAN LINK REQUESTS
// ============================================================

/**
 * Get guardian link requests with filters
 * @param {Object} filters - Optional filters
 * @returns {Promise<Object>} Link requests
 * 
 * Backend Endpoint: GET /api/guardians/link-requests/
 */
export const getLinkRequests = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('🔗 Fetching link requests with filters:', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.student) params.append('student', filters.student);
    if (filters.guardian) params.append('guardian', filters.guardian);
    if (filters.requires_teacher_approval !== undefined) {
      params.append('requires_teacher_approval', filters.requires_teacher_approval);
    }
    if (filters.teacher_approved !== undefined) {
      params.append('teacher_approved', filters.teacher_approved);
    }
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.GUARDIANS.BASE}/link-requests/?${queryString}`
      : `${API_ENDPOINTS.GUARDIANS.BASE}/link-requests/`;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} link requests`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get link requests error:', error);

    return {
      success: false,
      message: 'Failed to fetch link requests',
      error: handleApiError(error),
    };
  }
};

/**
 * Get pending link requests (for teachers)
 * @returns {Promise<Object>} Pending link requests
 * 
 * Backend Endpoint: GET /api/guardians/link-requests/?status=pending
 */
export const getPendingLinkRequests = async () => {
  return await getLinkRequests({ status: 'pending' });
};

/**
 * Get pending approvals for current guardian
 * @returns {Promise<Object>} Pending approval requests
 * 
 * Backend Endpoint: GET /api/guardians/pending_approvals/
 */
export const getPendingApprovals = async () => {
  try {
    if (__DEV__) {
      console.log('🔗 Fetching pending approvals...');
    }

    const response = await get(`${API_ENDPOINTS.GUARDIANS.BASE}/pending_approvals/`);

    if (__DEV__) {
      console.log(`✅ Found ${response.length || 0} pending approvals`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get pending approvals error:', error);

    return {
      success: false,
      message: 'Failed to fetch pending approvals',
      error: handleApiError(error),
    };
  }
};

/**
 * Create guardian link request
 * @param {Object} requestData - Link request data
 * @returns {Promise<Object>} Created link request
 * 
 * Backend Endpoint: POST /api/guardians/link-requests/
 */
export const createLinkRequest = async (requestData) => {
  try {
    if (__DEV__) {
      console.log('🔗 Creating link request:', requestData);
    }

    const response = await post(`${API_ENDPOINTS.GUARDIANS.BASE}/link-requests/`, requestData);

    if (__DEV__) {
      console.log(`✅ Link request created`);
    }

    return {
      success: true,
      data: response,
      message: 'Link request created successfully',
    };
  } catch (error) {
    console.error('❌ Create link request error:', error);

    return {
      success: false,
      message: 'Failed to create link request',
      error: handleApiError(error),
    };
  }
};

/**
 * Approve guardian link request (by guardian)
 * @param {number} requestId - Link request ID
 * @param {string} notes - Optional approval notes
 * @returns {Promise<Object>} Success response
 * 
 * Backend Endpoint: POST /api/guardians/link-requests/{id}/approve/
 */
export const approveLinkRequest = async (requestId, notes = '') => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    if (__DEV__) {
      console.log(`🔗 Approving link request ${requestId}...`);
    }

    const response = await post(
      `${API_ENDPOINTS.GUARDIANS.BASE}/link-requests/${requestId}/approve/`,
      { notes }
    );

    if (__DEV__) {
      console.log(`✅ Link request approved`);
    }

    return {
      success: true,
      data: response,
      message: 'Link request approved successfully',
    };
  } catch (error) {
    console.error('❌ Approve link request error:', error);

    return {
      success: false,
      message: 'Failed to approve link request',
      error: handleApiError(error),
    };
  }
};

/**
 * Reject guardian link request (by guardian)
 * @param {number} requestId - Link request ID
 * @param {string} reason - Rejection reason
 * @returns {Promise<Object>} Success response
 * 
 * Backend Endpoint: POST /api/guardians/link-requests/{id}/reject/
 */
export const rejectLinkRequest = async (requestId, reason = '') => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    if (__DEV__) {
      console.log(`🔗 Rejecting link request ${requestId}...`);
    }

    const response = await post(
      `${API_ENDPOINTS.GUARDIANS.BASE}/link-requests/${requestId}/reject/`,
      { rejection_reason: reason }
    );

    if (__DEV__) {
      console.log(`✅ Link request rejected`);
    }

    return {
      success: true,
      data: response,
      message: 'Link request rejected',
    };
  } catch (error) {
    console.error('❌ Reject link request error:', error);

    return {
      success: false,
      message: 'Failed to reject link request',
      error: handleApiError(error),
    };
  }
};

/**
 * Teacher approve guardian link request
 * @param {number} requestId - Link request ID
 * @returns {Promise<Object>} Success response
 * 
 * Backend Endpoint: POST /api/guardians/link-requests/{id}/teacher_approve/
 */
export const teacherApproveLinkRequest = async (requestId) => {
  try {
    if (!requestId) {
      throw new Error('Request ID is required');
    }

    if (__DEV__) {
      console.log(`🔗 Teacher approving link request ${requestId}...`);
    }

    const response = await post(
      `${API_ENDPOINTS.GUARDIANS.BASE}/link-requests/${requestId}/teacher_approve/`
    );

    if (__DEV__) {
      console.log(`✅ Teacher approved link request`);
    }

    return {
      success: true,
      data: response,
      message: 'Link request approved successfully',
    };
  } catch (error) {
    console.error('❌ Teacher approve link request error:', error);

    return {
      success: false,
      message: 'Failed to approve link request',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// GUARDIAN DASHBOARD
// ============================================================

/**
 * Get guardian dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 * 
 * Backend Endpoint: GET /api/guardians/dashboard/
 */
export const getDashboardStats = async () => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching guardian dashboard stats...');
    }

    const response = await get(`${API_ENDPOINTS.GUARDIANS.BASE}/dashboard/`);

    if (__DEV__) {
      console.log(`✅ Dashboard stats fetched`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get dashboard stats error:', error);

    return {
      success: false,
      message: 'Failed to fetch dashboard statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Get guardian payment requests
 * @param {string} status - Optional status filter
 * @returns {Promise<Object>} Payment requests
 * 
 * Backend Endpoint: GET /api/guardians/payment_requests/
 */
export const getPaymentRequests = async (status = null) => {
  try {
    if (__DEV__) {
      console.log('💰 Fetching payment requests...');
    }

    const params = status ? `?status=${status}` : '';
    const response = await get(`${API_ENDPOINTS.GUARDIANS.BASE}/payment_requests/${params}`);

    if (__DEV__) {
      console.log(`✅ Found ${response.length || 0} payment requests`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get payment requests error:', error);

    return {
      success: false,
      message: 'Failed to fetch payment requests',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// SEARCH & FILTERS
// ============================================================

/**
 * Search guardians
 * @param {string} query - Search query
 * @returns {Promise<Object>} Search results
 */
export const searchGuardians = async (query) => {
  return await getGuardians({ search: query });
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // CRUD
  getGuardians,
  getGuardianById,
  createGuardian,
  updateGuardian,
  deleteGuardian,

  // Students
  getGuardianStudents,
  getMyStudents,

  // Link Requests
  getLinkRequests,
  getPendingLinkRequests,
  getPendingApprovals,
  createLinkRequest,
  approveLinkRequest,
  rejectLinkRequest,
  teacherApproveLinkRequest,

  // Dashboard
  getDashboardStats,
  getPaymentRequests,

  // Search
  searchGuardians,
};