import api from './api';

/**
 * Student Service
 * Handles all student-related API calls
 */

// Get students with optional filters
export const getStudents = async (filters = {}) => {
  try {
    const response = await api.get('/students/', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get student by ID
export const getStudentById = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Create new student
export const createStudent = async (studentData) => {
  try {
    const response = await api.post('/students/', studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update student
export const updateStudent = async (studentId, studentData) => {
  try {
    const response = await api.patch(`/students/${studentId}/`, studentData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Delete student
export const deleteStudent = async (studentId) => {
  try {
    const response = await api.delete(`/students/${studentId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get student guardians
export const getStudentGuardians = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/guardians/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get student payments
export const getStudentPayments = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/payments/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Search students
export const searchStudents = async (query) => {
  try {
    const response = await api.get('/students/search/', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Get student attendance records
export const getStudentAttendance = async (studentId, filters = {}) => {
  try {
    const response = await api.get(`/students/${studentId}/attendance/`, {
      params: filters,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Get student attendance summary
export const getStudentAttendanceSummary = async (studentId, startDate, endDate) => {
  try {
    const response = await api.get(`/students/${studentId}/attendance/summary/`, {
      params: { start_date: startDate, end_date: endDate },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Get student QR code
export const getStudentQRCode = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/qrcode/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Generate student QR code
export const generateStudentQRCode = async (studentId) => {
  try {
    const response = await api.post(`/students/${studentId}/qrcode/generate/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Regenerate student QR code
export const regenerateStudentQRCode = async (studentId, reason = '') => {
  try {
    const response = await api.post(`/students/${studentId}/qrcode/regenerate/`, {
      reason,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Get student biometric info
export const getStudentBiometricInfo = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/biometric/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Setup student fingerprint
export const setupStudentFingerprint = async (studentId, data) => {
  try {
    const response = await api.post(`/students/${studentId}/biometric/fingerprint/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Setup student face recognition
export const setupStudentFaceRecognition = async (studentId, imageData) => {
  try {
    const response = await api.post(`/students/${studentId}/biometric/face/`, {
      image_data: imageData,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Remove student fingerprint
export const removeStudentFingerprint = async (studentId) => {
  try {
    const response = await api.delete(`/students/${studentId}/biometric/fingerprint/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Remove student face recognition
export const removeStudentFaceRecognition = async (studentId) => {
  try {
    const response = await api.delete(`/students/${studentId}/biometric/face/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// ✨ NEW - Get student biometric enrollment status
export const getStudentBiometricStatus = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/biometric/status/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Default export with all functions
export default {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
  getStudentGuardians,
  getStudentPayments,
  searchStudents,
  getStudentAttendance,
  getStudentAttendanceSummary,
  getStudentQRCode,
  generateStudentQRCode,
  regenerateStudentQRCode,
  getStudentBiometricInfo,
  setupStudentFingerprint,
  setupStudentFaceRecognition,
  removeStudentFingerprint,
  removeStudentFaceRecognition,
  getStudentBiometricStatus,
};