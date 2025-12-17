// ========================================
// GOD'S EYE EDTECH - LOCATION SERVICE
// ========================================

import { get, handleApiError } from './api';
import { API_ENDPOINTS } from '../utils/constants';

// ============================================================
// COUNTRIES
// ============================================================

/**
 * Get all countries
 * @returns {Promise<Array>} List of countries
 * 
 * Backend Endpoint: GET /api/locations/countries/
 * Backend Response: [
 *   {
 *     "id": 1,
 *     "name": "Kenya",
 *     "code": "KE",
 *     "created_at": "2025-01-01T00:00:00Z"
 *   }
 * ]
 */
export const getCountries = async () => {
  try {
    if (__DEV__) {
      console.log('🌍 Fetching countries...');
    }

    const response = await get(API_ENDPOINTS.LOCATIONS.COUNTRIES);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.length || 0} countries`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get countries error:', error);

    return {
      success: false,
      message: 'Failed to fetch countries',
      error: handleApiError(error),
    };
  }
};

/**
 * Get country by ID
 * @param {number} id - Country ID
 * @returns {Promise<Object>} Country details
 * 
 * Backend Endpoint: GET /api/locations/countries/{id}/
 */
export const getCountryById = async (id) => {
  try {
    if (!id) {
      throw new Error('Country ID is required');
    }

    if (__DEV__) {
      console.log(`🌍 Fetching country ${id}...`);
    }

    const response = await get(API_ENDPOINTS.LOCATIONS.COUNTRY_DETAIL(id));

    if (__DEV__) {
      console.log(`✅ Fetched country: ${response.name}`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get country error:', error);

    return {
      success: false,
      message: 'Failed to fetch country',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// COUNTIES (Kenya's 47 Counties)
// ============================================================

/**
 * Get all counties or counties by country
 * @param {number|null} countryId - Optional country ID to filter
 * @returns {Promise<Array>} List of counties
 * 
 * Backend Endpoint: GET /api/locations/counties/
 * Backend Endpoint: GET /api/locations/counties/?country=1
 * Backend Response: [
 *   {
 *     "id": 1,
 *     "country": 1,
 *     "name": "Nairobi",
 *     "code": "nairobi",
 *     "created_at": "2025-01-01T00:00:00Z",
 *     "sub_counties": [...]  // Optional, depends on query params
 *   }
 * ]
 */
export const getCounties = async (countryId = null) => {
  try {
    if (__DEV__) {
      console.log('📍 Fetching counties...');
    }

    // Build URL with optional country filter
    let url = API_ENDPOINTS.LOCATIONS.COUNTIES;
    if (countryId) {
      url += `?country=${countryId}`;
    }

    const response = await get(url);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.length || 0} counties`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get counties error:', error);

    return {
      success: false,
      message: 'Failed to fetch counties',
      error: handleApiError(error),
    };
  }
};

/**
 * Get county by ID
 * @param {number} id - County ID
 * @returns {Promise<Object>} County details with sub-counties
 * 
 * Backend Endpoint: GET /api/locations/counties/{id}/
 */
export const getCountyById = async (id) => {
  try {
    if (!id) {
      throw new Error('County ID is required');
    }

    if (__DEV__) {
      console.log(`📍 Fetching county ${id}...`);
    }

    const response = await get(API_ENDPOINTS.LOCATIONS.COUNTY_DETAIL(id));

    if (__DEV__) {
      console.log(`✅ Fetched county: ${response.name}`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get county error:', error);

    return {
      success: false,
      message: 'Failed to fetch county',
      error: handleApiError(error),
    };
  }
};

/**
 * Get counties by country (alias for getCounties with country filter)
 * @param {number} countryId - Country ID
 * @returns {Promise<Array>} List of counties
 */
export const getCountiesByCountry = async (countryId) => {
  return await getCounties(countryId);
};

// ============================================================
// SUB-COUNTIES
// ============================================================

/**
 * Get all sub-counties or sub-counties by county
 * @param {number|null} countyId - Optional county ID to filter
 * @returns {Promise<Array>} List of sub-counties
 * 
 * Backend Endpoint: GET /api/locations/sub-counties/
 * Backend Endpoint: GET /api/locations/sub-counties/?county=1
 */
export const getSubCounties = async (countyId = null) => {
  try {
    if (__DEV__) {
      console.log('📍 Fetching sub-counties...');
    }

    // Build URL with optional county filter
    let url = `${API_BASE_URL}/locations/sub-counties/`;
    if (countyId) {
      url += `?county=${countyId}`;
    }

    const response = await get(url);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.length || 0} sub-counties`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get sub-counties error:', error);

    return {
      success: false,
      message: 'Failed to fetch sub-counties',
      error: handleApiError(error),
    };
  }
};

/**
 * Get sub-county by ID
 * @param {number} id - Sub-county ID
 * @returns {Promise<Object>} Sub-county details with wards
 */
export const getSubCountyById = async (id) => {
  try {
    if (!id) {
      throw new Error('Sub-county ID is required');
    }

    if (__DEV__) {
      console.log(`📍 Fetching sub-county ${id}...`);
    }

    const response = await get(`${API_BASE_URL}/locations/sub-counties/${id}/`);

    if (__DEV__) {
      console.log(`✅ Fetched sub-county: ${response.name}`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get sub-county error:', error);

    return {
      success: false,
      message: 'Failed to fetch sub-county',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// WARDS
// ============================================================

/**
 * Get all wards or wards by sub-county
 * @param {number|null} subCountyId - Optional sub-county ID to filter
 * @returns {Promise<Array>} List of wards
 * 
 * Backend Endpoint: GET /api/locations/wards/
 * Backend Endpoint: GET /api/locations/wards/?sub_county=1
 */
export const getWards = async (subCountyId = null) => {
  try {
    if (__DEV__) {
      console.log('📍 Fetching wards...');
    }

    // Build URL with optional sub-county filter
    let url = `${API_BASE_URL}/locations/wards/`;
    if (subCountyId) {
      url += `?sub_county=${subCountyId}`;
    }

    const response = await get(url);

    if (__DEV__) {
      console.log(`✅ Fetched ${response.length || 0} wards`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get wards error:', error);

    return {
      success: false,
      message: 'Failed to fetch wards',
      error: handleApiError(error),
    };
  }
};

/**
 * Get ward by ID
 * @param {number} id - Ward ID
 * @returns {Promise<Object>} Ward details
 */
export const getWardById = async (id) => {
  try {
    if (!id) {
      throw new Error('Ward ID is required');
    }

    if (__DEV__) {
      console.log(`📍 Fetching ward ${id}...`);
    }

    const response = await get(`${API_BASE_URL}/locations/wards/${id}/`);

    if (__DEV__) {
      console.log(`✅ Fetched ward: ${response.name}`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Get ward error:', error);

    return {
      success: false,
      message: 'Failed to fetch ward',
      error: handleApiError(error),
    };
  }
};

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Search locations by name (counties, sub-counties, wards)
 * @param {string} query - Search query
 * @param {string} type - Location type ('county', 'sub_county', 'ward')
 * @returns {Promise<Array>} Search results
 */
export const searchLocations = async (query, type = 'county') => {
  try {
    if (!query || query.trim().length < 2) {
      return {
        success: true,
        data: [],
      };
    }

    if (__DEV__) {
      console.log(`🔍 Searching ${type}s: "${query}"`);
    }

    let url;
    switch (type) {
      case 'county':
        url = `${API_BASE_URL}/locations/counties/?search=${encodeURIComponent(query)}`;
        break;
      case 'sub_county':
        url = `${API_BASE_URL}/locations/sub-counties/?search=${encodeURIComponent(query)}`;
        break;
      case 'ward':
        url = `${API_BASE_URL}/locations/wards/?search=${encodeURIComponent(query)}`;
        break;
      default:
        throw new Error('Invalid location type');
    }

    const response = await get(url);

    if (__DEV__) {
      console.log(`✅ Found ${response.length || 0} results`);
    }

    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('❌ Search locations error:', error);

    return {
      success: false,
      message: 'Failed to search locations',
      error: handleApiError(error),
    };
  }
};

/**
 * Get Kenya (default country)
 * @returns {Promise<Object>} Kenya country object
 */
export const getKenya = async () => {
  try {
    const result = await getCountries();

    if (result.success && result.data.length > 0) {
      // Find Kenya (code: 'KE')
      const kenya = result.data.find(country => country.code === 'KE');

      if (kenya) {
        return {
          success: true,
          data: kenya,
        };
      }
    }

    throw new Error('Kenya not found in database');
  } catch (error) {
    console.error('❌ Get Kenya error:', error);

    return {
      success: false,
      message: 'Failed to fetch Kenya',
      error,
    };
  }
};

/**
 * Get all Kenya counties (convenience function)
 * @returns {Promise<Array>} List of all Kenya counties (47)
 */
export const getKenyaCounties = async () => {
  try {
    // Get Kenya first
    const kenyaResult = await getKenya();

    if (!kenyaResult.success) {
      throw new Error('Failed to fetch Kenya');
    }

    // Get counties for Kenya
    const result = await getCounties(kenyaResult.data.id);

    return result;
  } catch (error) {
    console.error('❌ Get Kenya counties error:', error);

    return {
      success: false,
      message: 'Failed to fetch Kenya counties',
      error,
    };
  }
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Countries
  getCountries,
  getCountryById,
  getKenya,

  // Counties
  getCounties,
  getCountyById,
  getCountiesByCountry,
  getKenyaCounties,

  // Sub-Counties
  getSubCounties,
  getSubCountyById,

  // Wards
  getWards,
  getWardById,

  // Search
  searchLocations,
};