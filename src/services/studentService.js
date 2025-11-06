import api from './api';

/**
 * Student Service
 * Handles all student-related API calls including Kenya-specific fields
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

// Create new student (with Kenya-specific fields)
export const createStudent = async (studentData) => {
  try {
    // Prepare student data with Kenya-specific fields
    const payload = {
      // Personal Information
      first_name: studentData.first_name,
      middle_name: studentData.middle_name || null,
      last_name: studentData.last_name,
      date_of_birth: studentData.date_of_birth,
      gender: studentData.gender,
      birth_certificate_number: studentData.birth_certificate_number || null,
      
      // School Information (Kenya only)
      county_id: studentData.county_id,
      school_id: studentData.school_id,
      
      // Academic Information (CBC System)
      education_level: studentData.education_level,
      current_grade: studentData.current_grade,
      stream: studentData.stream,
      admission_number: studentData.admission_number,
      upi_number: studentData.upi_number || null,
      year_of_admission: studentData.year_of_admission,
      current_term: studentData.current_term,
      
      // House System (Optional)
      house_name: studentData.house_name || null,
      house_color: studentData.house_color || null,
      
      // Special Needs
      has_special_needs: studentData.has_special_needs || false,
      special_needs_description: studentData.special_needs_description || null,
    };
    
    const response = await api.post('/students/', payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Update student (with Kenya-specific fields)
export const updateStudent = async (studentId, studentData) => {
  try {
    // Prepare update data with Kenya-specific fields
    const payload = {
      // Personal Information
      first_name: studentData.first_name,
      middle_name: studentData.middle_name || null,
      last_name: studentData.last_name,
      date_of_birth: studentData.date_of_birth,
      gender: studentData.gender,
      birth_certificate_number: studentData.birth_certificate_number || null,
      
      // School Information (Kenya only)
      county_id: studentData.county_id,
      school_id: studentData.school_id,
      
      // Academic Information (CBC System)
      education_level: studentData.education_level,
      current_grade: studentData.current_grade,
      stream: studentData.stream,
      admission_number: studentData.admission_number,
      upi_number: studentData.upi_number || null,
      year_of_admission: studentData.year_of_admission,
      current_term: studentData.current_term,
      
      // House System (Optional)
      house_name: studentData.house_name || null,
      house_color: studentData.house_color || null,
      
      // Special Needs
      has_special_needs: studentData.has_special_needs || false,
      special_needs_description: studentData.special_needs_description || null,
    };
    
    const response = await api.patch(`/students/${studentId}/`, payload);
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

// Search students (with Kenya-specific filters)
export const searchStudents = async (query, filters = {}) => {
  try {
    const params = {
      q: query,
      ...filters,
    };
    
    const response = await api.get('/students/search/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Filter students by grade
export const filterStudentsByGrade = async (grade) => {
  try {
    const response = await api.get('/students/', {
      params: { current_grade: grade },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Filter students by stream
export const filterStudentsByStream = async (stream) => {
  try {
    const response = await api.get('/students/', {
      params: { stream },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Filter students by house
export const filterStudentsByHouse = async (house) => {
  try {
    const response = await api.get('/students/', {
      params: { house_name: house },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Filter students by education level
export const filterStudentsByLevel = async (level) => {
  try {
    const response = await api.get('/students/', {
      params: { education_level: level },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get students by multiple filters (Kenya-specific)
export const getStudentsWithFilters = async (filters = {}) => {
  try {
    // Filters can include:
    // - current_grade
    // - stream
    // - house_name
    // - education_level
    // - year_of_admission
    // - current_term
    // - has_guardians (boolean)
    // - has_biometric (boolean)
    
    const response = await api.get('/students/', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get student attendance records
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

// Get student attendance summary
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

// Get student QR code
export const getStudentQRCode = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/qrcode/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Generate student QR code
export const generateStudentQRCode = async (studentId) => {
  try {
    const response = await api.post(`/students/${studentId}/qrcode/generate/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Regenerate student QR code
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

// Get student biometric info
export const getStudentBiometricInfo = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/biometric/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Setup student fingerprint
export const setupStudentFingerprint = async (studentId, data) => {
  try {
    const response = await api.post(`/students/${studentId}/biometric/fingerprint/`, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Setup student face recognition
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

// Remove student fingerprint
export const removeStudentFingerprint = async (studentId) => {
  try {
    const response = await api.delete(`/students/${studentId}/biometric/fingerprint/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Remove student face recognition
export const removeStudentFaceRecognition = async (studentId) => {
  try {
    const response = await api.delete(`/students/${studentId}/biometric/face/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get student biometric enrollment status
export const getStudentBiometricStatus = async (studentId) => {
  try {
    const response = await api.get(`/students/${studentId}/biometric/status/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Validate UPI number
export const validateUPINumber = async (upiNumber) => {
  try {
    const response = await api.post('/students/validate-upi/', {
      upi_number: upiNumber,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Check admission number availability
export const checkAdmissionNumberAvailability = async (schoolId, admissionNumber) => {
  try {
    const response = await api.post('/students/check-admission-number/', {
      school_id: schoolId,
      admission_number: admissionNumber,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get students statistics by grade
export const getStudentStatsByGrade = async (schoolId) => {
  try {
    const response = await api.get(`/students/stats/by-grade/`, {
      params: { school_id: schoolId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get students statistics by stream
export const getStudentStatsByStream = async (schoolId, grade) => {
  try {
    const response = await api.get(`/students/stats/by-stream/`, {
      params: { school_id: schoolId, grade },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Get students statistics by house
export const getStudentStatsByHouse = async (schoolId) => {
  try {
    const response = await api.get(`/students/stats/by-house/`, {
      params: { school_id: schoolId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Bulk update students (e.g., promote to next grade)
export const bulkUpdateStudents = async (studentIds, updateData) => {
  try {
    const response = await api.post('/students/bulk-update/', {
      student_ids: studentIds,
      update_data: updateData,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Promote students to next grade
export const promoteStudentsToNextGrade = async (schoolId, fromGrade, toGrade, stream = null) => {
  try {
    const response = await api.post('/students/promote/', {
      school_id: schoolId,
      from_grade: fromGrade,
      to_grade: toGrade,
      stream,
    });
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
  filterStudentsByGrade,
  filterStudentsByStream,
  filterStudentsByHouse,
  filterStudentsByLevel,
  getStudentsWithFilters,
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
  validateUPINumber,
  checkAdmissionNumberAvailability,
  getStudentStatsByGrade,
  getStudentStatsByStream,
  getStudentStatsByHouse,
  bulkUpdateStudents,
  promoteStudentsToNextGrade,
};