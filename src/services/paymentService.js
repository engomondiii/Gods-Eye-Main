import api from './api';

export const getPayments = async (filters = {}) => {
  try {
    const response = await api.get('/payments/', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentById = async (paymentId) => {
  try {
    const response = await api.get(`/payments/${paymentId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createPaymentRequest = async (paymentData) => {
  try {
    const response = await api.post('/payments/', paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updatePayment = async (paymentId, paymentData) => {
  try {
    const response = await api.patch(`/payments/${paymentId}/`, paymentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const initiatePayment = async (paymentId) => {
  try {
    const response = await api.post(`/payments/${paymentId}/initiate/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const markAsPaid = async (paymentId, mpesaRef) => {
  try {
    const response = await api.post(`/payments/${paymentId}/mark-paid/`, {
      mpesa_ref: mpesaRef,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectPayment = async (paymentId) => {
  try {
    const response = await api.post(`/payments/${paymentId}/reject/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentHistory = async (studentId) => {
  try {
    const response = await api.get(`/payments/student/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentStats = async () => {
  try {
    const response = await api.get('/payments/stats/');
    return response.data;
  } catch (error) {
    throw error;
  }
};