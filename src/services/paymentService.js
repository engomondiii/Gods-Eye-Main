// ========================================
// GOD'S EYE EDTECH - PAYMENT SERVICE (COMPLETE)
// ========================================

import { get, post, put, patch, del, handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

// ============================================================
// PAYMENT REQUEST FUNCTIONS
// ============================================================

/**
 * Get all payment requests with filters
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Payment requests list
 * 
 * Backend Endpoint: GET /api/payments/requests/
 */
export const getPaymentRequests = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching payment requests...', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.student) params.append('student', filters.student);
    if (filters.guardian) params.append('guardian', filters.guardian);
    if (filters.status) params.append('status', filters.status);
    if (filters.school) params.append('school', filters.school);
    if (filters.is_overdue !== undefined) params.append('is_overdue', filters.is_overdue);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);
    if (filters.search) params.append('search', filters.search);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.PAYMENTS.REQUESTS}?${queryString}`
      : API_ENDPOINTS.PAYMENTS.REQUESTS;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} payment requests`);
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

/**
 * Create payment request
 * @param {Object} data - Payment request data
 * @returns {Promise<Object>} Created payment request
 * 
 * Backend Endpoint: POST /api/payments/requests/
 */
export const createPaymentRequest = async (data) => {
  try {
    if (__DEV__) {
      console.log('💰 Creating payment request...', data);
    }

    const response = await post(API_ENDPOINTS.PAYMENTS.REQUESTS, data);

    if (__DEV__) {
      console.log('✅ Payment request created:', response.id);
    }

    return {
      success: true,
      data: response,
      message: 'Payment request created successfully',
    };
  } catch (error) {
    console.error('❌ Create payment request error:', error);

    return {
      success: false,
      message: 'Failed to create payment request',
      error: handleApiError(error),
    };
  }
};

/**
 * Get payment request by ID
 * @param {number} id - Payment request ID
 * @returns {Promise<Object>} Payment request details
 * 
 * Backend Endpoint: GET /api/payments/requests/{id}/
 */
export const getPaymentRequestById = async (id) => {
  try {
    if (__DEV__) {
      console.log(`📋 Fetching payment request ${id}...`);
    }

    const response = await get(`${API_ENDPOINTS.PAYMENTS.REQUESTS}${id}/`);

    if (__DEV__) {
      console.log('✅ Payment request fetched:', response.title);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get payment request error:', error);

    return {
      success: false,
      message: 'Failed to fetch payment request',
      error: handleApiError(error),
    };
  }
};

/**
 * Update payment request
 * @param {number} id - Payment request ID
 * @param {Object} data - Update data
 * @returns {Promise<Object>} Updated payment request
 * 
 * Backend Endpoint: PUT /api/payments/requests/{id}/
 */
export const updatePaymentRequest = async (id, data) => {
  try {
    if (__DEV__) {
      console.log(`📝 Updating payment request ${id}...`);
    }

    const response = await put(`${API_ENDPOINTS.PAYMENTS.REQUESTS}${id}/`, data);

    if (__DEV__) {
      console.log('✅ Payment request updated');
    }

    return {
      success: true,
      data: response,
      message: 'Payment request updated successfully',
    };
  } catch (error) {
    console.error('❌ Update payment request error:', error);

    return {
      success: false,
      message: 'Failed to update payment request',
      error: handleApiError(error),
    };
  }
};

/**
 * Delete payment request
 * @param {number} id - Payment request ID
 * @returns {Promise<Object>} Deletion result
 * 
 * Backend Endpoint: DELETE /api/payments/requests/{id}/
 */
export const deletePaymentRequest = async (id) => {
  try {
    if (__DEV__) {
      console.log(`🗑️ Deleting payment request ${id}...`);
    }

    await del(`${API_ENDPOINTS.PAYMENTS.REQUESTS}${id}/`);

    if (__DEV__) {
      console.log('✅ Payment request deleted');
    }

    return {
      success: true,
      message: 'Payment request deleted successfully',
    };
  } catch (error) {
    console.error('❌ Delete payment request error:', error);

    return {
      success: false,
      message: 'Failed to delete payment request',
      error: handleApiError(error),
    };
  }
};

/**
 * Get guardian's payment requests
 * @returns {Promise<Object>} Guardian's payment requests
 * 
 * Backend Endpoint: GET /api/payments/requests/my_payments/
 */
export const getMyPayments = async () => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching my payment requests...');
    }

    const response = await get(`${API_ENDPOINTS.PAYMENTS.REQUESTS}my_payments/`);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.count || 0} payment requests`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get my payments error:', error);

    return {
      success: false,
      message: 'Failed to fetch payment requests',
      error: handleApiError(error),
    };
  }
};

/**
 * Get overdue payments
 * @returns {Promise<Object>} Overdue payment requests
 * 
 * Backend Endpoint: GET /api/payments/requests/overdue/
 */
export const getOverduePayments = async () => {
  try {
    if (__DEV__) {
      console.log('⚠️ Fetching overdue payments...');
    }

    const response = await get(`${API_ENDPOINTS.PAYMENTS.REQUESTS}overdue/`);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.count || 0} overdue payments`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get overdue payments error:', error);

    return {
      success: false,
      message: 'Failed to fetch overdue payments',
      error: handleApiError(error),
    };
  }
};

/**
 * Get payment statistics
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Payment statistics
 * 
 * Backend Endpoint: GET /api/payments/requests/statistics/
 */
export const getPaymentStatistics = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📊 Fetching payment statistics...');
    }

    const params = new URLSearchParams();
    if (filters.school) params.append('school', filters.school);
    if (filters.academic_year) params.append('academic_year', filters.academic_year);
    if (filters.term) params.append('term', filters.term);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.PAYMENTS.REQUESTS}statistics/?${queryString}`
      : `${API_ENDPOINTS.PAYMENTS.REQUESTS}statistics/`;

    const response = await get(url);

    if (__DEV__) {
      console.log('✅ Statistics fetched');
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get payment statistics error:', error);

    return {
      success: false,
      message: 'Failed to fetch statistics',
      error: handleApiError(error),
    };
  }
};

/**
 * Bulk create payment requests
 * @param {Object} data - Bulk creation data
 * @returns {Promise<Object>} Created payment requests
 * 
 * Backend Endpoint: POST /api/payments/requests/bulk_create/
 */
export const bulkCreatePaymentRequests = async (data) => {
  try {
    if (__DEV__) {
      console.log('💰 Bulk creating payment requests...', data.students?.length);
    }

    const response = await post(`${API_ENDPOINTS.PAYMENTS.REQUESTS}bulk_create/`, data);

    if (__DEV__) {
      console.log(`✅ Created ${response.created_count || 0} payment requests`);
    }

    return {
      success: true,
      data: response,
      message: `${response.created_count || 0} payment requests created successfully`,
    };
  } catch (error) {
    console.error('❌ Bulk create error:', error);

    return {
      success: false,
      message: 'Failed to create payment requests',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// PAYMENT TRANSACTION FUNCTIONS
// ============================================================

/**
 * Get all payments
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Payments list
 * 
 * Backend Endpoint: GET /api/payments/payments/
 */
export const getPayments = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching payments...', filters);
    }

    const params = new URLSearchParams();
    
    if (filters.payment_request) params.append('payment_request', filters.payment_request);
    if (filters.payment_method) params.append('payment_method', filters.payment_method);
    if (filters.status) params.append('status', filters.status);
    if (filters.page) params.append('page', filters.page);
    if (filters.page_size) params.append('page_size', filters.page_size);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.PAYMENTS.PAYMENTS}?${queryString}`
      : API_ENDPOINTS.PAYMENTS.PAYMENTS;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} payments`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get payments error:', error);

    return {
      success: false,
      message: 'Failed to fetch payments',
      error: handleApiError(error),
    };
  }
};

/**
 * Create payment
 * @param {Object} data - Payment data
 * @returns {Promise<Object>} Created payment
 * 
 * Backend Endpoint: POST /api/payments/payments/
 */
export const createPayment = async (data) => {
  try {
    if (__DEV__) {
      console.log('💳 Creating payment...', data);
    }

    const response = await post(API_ENDPOINTS.PAYMENTS.PAYMENTS, data);

    if (__DEV__) {
      console.log('✅ Payment created:', response.transaction_id);
    }

    return {
      success: true,
      data: response,
      message: 'Payment created successfully',
    };
  } catch (error) {
    console.error('❌ Create payment error:', error);

    return {
      success: false,
      message: 'Failed to create payment',
      error: handleApiError(error),
    };
  }
};

/**
 * Verify payment
 * @param {number} id - Payment ID
 * @returns {Promise<Object>} Verification result
 * 
 * Backend Endpoint: POST /api/payments/payments/{id}/verify/
 */
export const verifyPayment = async (id) => {
  try {
    if (__DEV__) {
      console.log(`✅ Verifying payment ${id}...`);
    }

    const response = await post(`${API_ENDPOINTS.PAYMENTS.PAYMENTS}${id}/verify/`, {});

    if (__DEV__) {
      console.log('✅ Payment verified');
    }

    return {
      success: true,
      data: response,
      message: 'Payment verified successfully',
    };
  } catch (error) {
    console.error('❌ Verify payment error:', error);

    return {
      success: false,
      message: 'Failed to verify payment',
      error: handleApiError(error),
    };
  }
};

/**
 * Get payment history for a request
 * @param {number} requestId - Payment request ID
 * @returns {Promise<Object>} Payment history
 */
export const getPaymentHistory = async (requestId) => {
  try {
    if (__DEV__) {
      console.log(`📋 Fetching payment history for request ${requestId}...`);
    }

    const response = await getPayments({ payment_request: requestId });

    if (__DEV__) {
      console.log('✅ Payment history fetched');
    }

    return response;
  } catch (error) {
    console.error('❌ Get payment history error:', error);

    return {
      success: false,
      message: 'Failed to fetch payment history',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// M-PESA FUNCTIONS
// ============================================================

/**
 * Initiate M-Pesa STK push
 * @param {Object} data - M-Pesa payment data
 * @returns {Promise<Object>} Transaction result
 * 
 * Backend Endpoint: POST /api/payments/mpesa/initiate/
 */
export const initiateMpesaPayment = async (data) => {
  try {
    if (__DEV__) {
      console.log('📱 Initiating M-Pesa payment...', data);
    }

    const response = await post(`${API_ENDPOINTS.PAYMENTS.MPESA}initiate/`, data);

    if (__DEV__) {
      console.log('✅ M-Pesa STK push sent:', response.transaction?.checkout_request_id);
    }

    return {
      success: true,
      data: response,
      message: response.message || 'STK push sent successfully',
    };
  } catch (error) {
    console.error('❌ Initiate M-Pesa error:', error);

    return {
      success: false,
      message: error.response?.data?.error || 'Failed to initiate M-Pesa payment',
      error: handleApiError(error),
    };
  }
};

/**
 * Query M-Pesa transaction status
 * @param {string} checkoutRequestId - Checkout request ID
 * @returns {Promise<Object>} Transaction status
 * 
 * Backend Endpoint: GET /api/payments/mpesa/query/?checkout_request_id=X
 */
export const queryMpesaTransaction = async (checkoutRequestId) => {
  try {
    if (__DEV__) {
      console.log(`🔍 Querying M-Pesa transaction: ${checkoutRequestId}`);
    }

    const response = await get(
      `${API_ENDPOINTS.PAYMENTS.MPESA}query/?checkout_request_id=${checkoutRequestId}`
    );

    if (__DEV__) {
      console.log('✅ Transaction status:', response.status);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Query M-Pesa transaction error:', error);

    return {
      success: false,
      message: 'Failed to query transaction status',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// FEE STRUCTURE FUNCTIONS
// ============================================================

/**
 * Get fee structures
 * @param {Object} filters - Filter options
 * @returns {Promise<Object>} Fee structures list
 * 
 * Backend Endpoint: GET /api/payments/fee-structures/
 */
export const getFeeStructures = async (filters = {}) => {
  try {
    if (__DEV__) {
      console.log('📋 Fetching fee structures...');
    }

    const params = new URLSearchParams();
    
    if (filters.school) params.append('school', filters.school);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active);
    if (filters.is_recurring !== undefined) params.append('is_recurring', filters.is_recurring);

    const queryString = params.toString();
    const url = queryString 
      ? `${API_ENDPOINTS.PAYMENTS.FEE_STRUCTURES}?${queryString}`
      : API_ENDPOINTS.PAYMENTS.FEE_STRUCTURES;

    const response = await get(url);

    if (__DEV__) {
      const count = Array.isArray(response) ? response.length : response.results?.length || 0;
      console.log(`✅ Fetched ${count} fee structures`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get fee structures error:', error);

    return {
      success: false,
      message: 'Failed to fetch fee structures',
      error: handleApiError(error),
    };
  }
};

/**
 * Create fee structure
 * @param {Object} data - Fee structure data
 * @returns {Promise<Object>} Created fee structure
 * 
 * Backend Endpoint: POST /api/payments/fee-structures/
 */
export const createFeeStructure = async (data) => {
  try {
    if (__DEV__) {
      console.log('💰 Creating fee structure...', data);
    }

    const response = await post(API_ENDPOINTS.PAYMENTS.FEE_STRUCTURES, data);

    if (__DEV__) {
      console.log('✅ Fee structure created:', response.name);
    }

    return {
      success: true,
      data: response,
      message: 'Fee structure created successfully',
    };
  } catch (error) {
    console.error('❌ Create fee structure error:', error);

    return {
      success: false,
      message: 'Failed to create fee structure',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Validate payment amount
 * @param {Object} paymentRequest - Payment request object
 * @param {number} proposedAmount - Proposed payment amount
 * @returns {Object} Validation result
 */
export const validatePaymentAmount = (paymentRequest, proposedAmount) => {
  const amount = parseFloat(proposedAmount);
  const minAmount = parseFloat(paymentRequest.minimum_payment || 100);
  const balance = parseFloat(paymentRequest.balance || paymentRequest.total_amount - paymentRequest.amount_paid);
  
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      error: 'Please enter a valid amount',
    };
  }
  
  if (paymentRequest.flexibility === 'full_only' && amount !== balance) {
    return {
      isValid: false,
      error: `Full payment of KES ${balance.toLocaleString()} is required`,
    };
  }
  
  if (amount < minAmount) {
    return {
      isValid: false,
      error: `Minimum payment is KES ${minAmount.toLocaleString()}`,
    };
  }
  
  if (amount > balance) {
    return {
      isValid: false,
      error: `Amount cannot exceed balance of KES ${balance.toLocaleString()}`,
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
};

/**
 * Get suggested payment amounts
 * @param {Object} paymentRequest - Payment request object
 * @returns {Array} Suggested amounts
 */
export const getSuggestedPaymentAmounts = (paymentRequest) => {
  const balance = parseFloat(paymentRequest.balance || paymentRequest.total_amount - paymentRequest.amount_paid);
  const minimum = parseFloat(paymentRequest.minimum_payment || 100);
  
  const suggestions = [];
  
  suggestions.push({
    label: 'Full Amount',
    amount: balance,
    description: 'Pay the full balance',
  });
  
  if (paymentRequest.flexibility !== 'full_only') {
    const halfAmount = Math.round(balance / 2);
    if (halfAmount >= minimum && halfAmount !== balance) {
      suggestions.push({
        label: '50% Payment',
        amount: halfAmount,
        description: 'Pay half of the balance',
      });
    }
    
    const quarterAmount = Math.round(balance / 4);
    if (quarterAmount >= minimum && quarterAmount !== halfAmount) {
      suggestions.push({
        label: '25% Payment',
        amount: quarterAmount,
        description: 'Pay a quarter',
      });
    }
    
    if (minimum !== balance && minimum !== halfAmount && minimum !== quarterAmount) {
      suggestions.push({
        label: 'Minimum Payment',
        amount: minimum,
        description: 'Minimum amount',
      });
    }
  }
  
  return suggestions;
};

/**
 * Format Kenyan phone number for M-Pesa
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone number (254...)
 */
export const formatMpesaPhone = (phone) => {
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('+254')) {
    cleaned = cleaned.substring(1);
  } else if (cleaned.startsWith('0')) {
    cleaned = '254' + cleaned.substring(1);
  } else if (!cleaned.startsWith('254')) {
    cleaned = '254' + cleaned;
  }
  
  return cleaned;
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Payment Requests
  getPaymentRequests,
  createPaymentRequest,
  getPaymentRequestById,
  updatePaymentRequest,
  deletePaymentRequest,
  getMyPayments,
  getOverduePayments,
  getPaymentStatistics,
  bulkCreatePaymentRequests,

  // Payments
  getPayments,
  createPayment,
  verifyPayment,
  getPaymentHistory,

  // M-Pesa
  initiateMpesaPayment,
  queryMpesaTransaction,

  // Fee Structures
  getFeeStructures,
  createFeeStructure,

  // Utilities
  validatePaymentAmount,
  getSuggestedPaymentAmounts,
  formatMpesaPhone,
};