import api from './api';

// Get all payments with optional filters
export const getPayments = async (filters = {}) => {
  try {
    const response = await api.get('/payments/', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment by ID
export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🆕 UPDATED - Create payment request with partial payment options
export const createPaymentRequest = async (paymentData) => {
  try {
    const requestBody = {
      student_id: paymentData.student_id,
      amount: paymentData.amount,
      purpose: paymentData.purpose,
      due_date: paymentData.due_date,
      // 🆕 NEW - Partial payment fields
      allow_partial: paymentData.allow_partial || false,
      payment_flexibility: paymentData.payment_flexibility || 'full_only',
      minimum_amount: paymentData.minimum_amount || paymentData.amount,
    };
    
    const response = await api.post('/payments/', requestBody);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update payment
export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await api.patch(`/payments/${paymentId}/`, paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Initiate payment (for M-Pesa STK push)
export const initiatePayment = async (paymentId) => {
  try {
    const response = await api.post(`/payments/${paymentId}/initiate/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🆕 UPDATED - Mark as paid with custom amount (supports partial payments)
export const markAsPaid = async (paymentId, paymentAmount, mpesaRef) => {
  try {
    const response = await api.post(`/payments/${paymentId}/mark-paid/`, {
      amount: paymentAmount,
      mpesa_ref: mpesaRef,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🆕 NEW - Submit partial payment
export const submitPartialPayment = async (paymentId, amount, paymentMethod = 'M-Pesa') => {
  try {
    const response = await api.post(`/payments/${paymentId}/partial-payment/`, {
      amount: amount,
      payment_method: paymentMethod,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🆕 NEW - Get payment history for a specific payment request
export const getPaymentTransactionHistory = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/history/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Reject payment
export const rejectPayment = async (paymentId, reason = '') => {
  try {
    const response = await api.post(`/payments/${paymentId}/reject/`, {
      reason: reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment history for a student
export const getPaymentHistory = async (studentId) => {
  try {
    const response = await api.get(`/payments/student/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🆕 NEW - Get student's outstanding balance
export const getStudentOutstandingBalance = async (studentId) => {
  try {
    const response = await api.get(`/payments/student/${studentId}/balance/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get payment statistics
export const getPaymentStats = async (filters = {}) => {
  try {
    const response = await api.get('/payments/stats/', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🆕 NEW - Calculate payment breakdown
export const calculatePaymentBreakdown = async (paymentId, proposedAmount) => {
  try {
    const response = await api.post(`/payments/${paymentId}/calculate/`, {
      amount: proposedAmount,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 🆕 NEW - Validate payment amount
export const validatePaymentAmount = (paymentRequest, proposedAmount) => {
  const amount = parseFloat(proposedAmount);
  const minAmount = parseFloat(paymentRequest.minimum_amount);
  const remainingAmount = parseFloat(paymentRequest.remaining_amount);
  
  // Check if amount is a valid number
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      error: 'Please enter a valid amount',
    };
  }
  
  // Check if partial payments are allowed
  if (!paymentRequest.allow_partial && amount !== remainingAmount) {
    return {
      isValid: false,
      error: `Full payment of KES ${remainingAmount.toLocaleString()} is required`,
    };
  }
  
  // Check if amount meets minimum requirement
  if (amount < minAmount) {
    return {
      isValid: false,
      error: `Minimum payment is KES ${minAmount.toLocaleString()}`,
    };
  }
  
  // Check if amount exceeds remaining balance
  if (amount > remainingAmount) {
    return {
      isValid: false,
      error: `Amount cannot exceed remaining balance of KES ${remainingAmount.toLocaleString()}`,
    };
  }
  
  return {
    isValid: true,
    error: null,
  };
};

// 🆕 NEW - Get suggested payment amounts
export const getSuggestedPaymentAmounts = (paymentRequest) => {
  const remaining = parseFloat(paymentRequest.remaining_amount);
  const minimum = parseFloat(paymentRequest.minimum_amount);
  
  const suggestions = [];
  
  // Full amount
  suggestions.push({
    label: 'Full Amount',
    amount: remaining,
    description: 'Pay the full remaining balance',
  });
  
  // Only show other options if partial payments are allowed
  if (paymentRequest.allow_partial) {
    // 50% of remaining
    const halfAmount = Math.round(remaining / 2);
    if (halfAmount >= minimum && halfAmount !== remaining) {
      suggestions.push({
        label: '50% Payment',
        amount: halfAmount,
        description: `Pay half of the remaining balance`,
      });
    }
    
    // 25% of remaining
    const quarterAmount = Math.round(remaining / 4);
    if (quarterAmount >= minimum && quarterAmount !== halfAmount) {
      suggestions.push({
        label: '25% Payment',
        amount: quarterAmount,
        description: `Pay a quarter of the remaining balance`,
      });
    }
    
    // Minimum amount
    if (minimum !== remaining && minimum !== halfAmount && minimum !== quarterAmount) {
      suggestions.push({
        label: 'Minimum Payment',
        amount: minimum,
        description: `Pay the minimum required amount`,
      });
    }
  }
  
  return suggestions;
};

// Export all functions
export default {
  getPayments,
  getPaymentById,
  createPaymentRequest,
  updatePayment,
  initiatePayment,
  markAsPaid,
  submitPartialPayment,
  getPaymentTransactionHistory,
  rejectPayment,
  getPaymentHistory,
  getStudentOutstandingBalance,
  getPaymentStats,
  calculatePaymentBreakdown,
  validatePaymentAmount,
  getSuggestedPaymentAmounts,
};