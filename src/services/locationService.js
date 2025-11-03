import api from './api';

export const getCountries = async () => {
  try {
    const response = await api.get('/countries/');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCountyByCountry = async (countryId) => {
  try {
    const response = await api.get('/counties/', {
      params: { country: countryId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getCounties = async (countryId = null) => {
  try {
    const params = countryId ? { country: countryId } : {};
    const response = await api.get('/counties/', { params });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubCounties = async (countyId) => {
  try {
    const response = await api.get('/sub-counties/', {
      params: { county: countyId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getWards = async (subCountyId) => {
  try {
    const response = await api.get('/wards/', {
      params: { sub_county: subCountyId },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};