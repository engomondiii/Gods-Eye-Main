import api from './api';

export const getSchools = async (filters = {}) => {
  try {
    const response = await api.get('/schools/', { params: filters });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAllSchools = async () => {
  try {
    const response = await api.get('/schools/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSchoolById = async (schoolId) => {
  try {
    const response = await api.get(`/schools/${schoolId}/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSchoolsByCounty = async (countyId) => {
  try {
    const response = await api.get('/schools/', {
      params: { county: countyId, approved: true },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createSchool = async (schoolData) => {
  try {
    const response = await api.post('/schools/', schoolData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateSchool = async (schoolId, schoolData) => {
  try {
    const response = await api.patch(`/schools/${schoolId}/`, schoolData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const approveSchool = async (schoolId) => {
  try {
    const response = await api.post(`/schools/${schoolId}/approve/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const rejectSchool = async (schoolId) => {
  try {
    const response = await api.post(`/schools/${schoolId}/reject/`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const searchSchools = async (query) => {
  try {
    const response = await api.get('/schools/search/', {
      params: { q: query },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};