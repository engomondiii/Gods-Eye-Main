import api from './api';

export const getGuardians = async (filters = {}) => {
  try {
    const response = await api.get('/guardians/', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getGuardianById = async (guardianId) => {
  try {
    const response = await api.get(`/guardians/${guardianId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getMyStudents = async () => {
  try {
    const response = await api.get('/guardians/my-students/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getStudentDetails = async (studentId) => {
  try {
    const response = await api.get(`/guardians/students/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPendingApprovals = async () => {
  try {
    const response = await api.get('/guardian-link-requests/pending/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveRequest = async (requestId) => {
  try {
    const response = await api.post(
      `/guardian-link-requests/${requestId}/approve/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectRequest = async (requestId) => {
  try {
    const response = await api.post(
      `/guardian-link-requests/${requestId}/reject/`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getPaymentRequests = async (status = null) => {
  try {
    const params = status ? { status } : {};
    const response = await api.get('/guardians/payment-requests/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getDashboardStats = async () => {
  try {
    const response = await api.get('/guardians/dashboard/');
    return response.data;
  } catch (error) {
    throw error;
  }
};