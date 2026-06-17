// ========================================
// SMARTSCHOOL MVP - API CONFIGURATION
// Toggle between mock and real APIs
// ========================================

// ============================================================
// ENVIRONMENT CONFIGURATION
// ============================================================

/**
 * Use MOCK_API = true for development and testing
 * Use MOCK_API = false for production with real backend
 */
export const USE_MOCK_API = __DEV__; // Set to false when backend is ready

/**
 * API Response delay simulation (milliseconds)
 * Simulates network latency for realistic testing
 */
export const MOCK_API_DELAY = 300; // 300ms simulated delay

/**
 * Toggle SMS simulation vs real SMS
 * true = log SMS to console only
 * false = send via Africa's Talking API
 */
export const SIMULATE_SMS_ONLY = __DEV__;

// ============================================================
// CONFIGURATION DISPLAY
// ============================================================

export const logApiConfiguration = () => {
  console.log('🔧 API Configuration:');
  console.log(`   - Using ${USE_MOCK_API ? '📦 MOCK API' : '🌐 REAL BACKEND'}`);
  console.log(`   - SMS: ${SIMULATE_SMS_ONLY ? '📝 Simulated (logged)' : '📱 Real (Africa\'s Talking)'}`);
  console.log(`   - Mock API Delay: ${MOCK_API_DELAY}ms`);
};

// ============================================================
// API INTERCEPTOR
// ============================================================

/**
 * Routes API calls to mock or real backend based on configuration
 * Usage in services: const response = await apiRouter.get(url, config);
 */

import axios from 'axios';
import mockApi from './mockApi';

// Initialize mock database on app start
if (USE_MOCK_API) {
  mockApi.init();
}

/**
 * Simulate network delay for realistic testing
 */
const simulateNetworkDelay = () => {
  return new Promise((resolve) => setTimeout(resolve, MOCK_API_DELAY));
};

/**
 * Route API endpoint to mock or real
 * Handles endpoint pattern matching and delegates to appropriate handler
 */
export const routeApiCall = async (method, url, data = null, headers = null) => {
  if (!USE_MOCK_API) {
    // Use real API - return null to use actual axios
    return null;
  }

  // Simulate network delay
  await simulateNetworkDelay();

  // Parse URL to determine endpoint
  const urlPath = url.replace(/^.*\/api/, '');

  if (__DEV__) {
    console.log(`🔀 Routing ${method.toUpperCase()} ${urlPath} to MOCK API`);
  }

  // ============================================================
  // AUTHENTICATION ENDPOINTS
  // ============================================================

  if (urlPath === '/auth/login/' && method === 'POST') {
    return mockApi.auth.login(data);
  }

  if (urlPath === '/auth/logout/' && method === 'POST') {
    return mockApi.auth.logout();
  }

  if (urlPath === '/auth/token/verify/' && method === 'POST') {
    return mockApi.auth.verifyToken(data?.token);
  }

  // ============================================================
  // CLASSES ENDPOINTS
  // ============================================================

  if (urlPath === '/classes/' && method === 'GET') {
    return mockApi.classes.list(data);
  }

  const classDetailMatch = urlPath.match(/^\/classes\/(\d+)\/$/);
  if (classDetailMatch && method === 'GET') {
    return mockApi.classes.detail(parseInt(classDetailMatch[1]));
  }

  // ============================================================
  // STUDENTS ENDPOINTS
  // ============================================================

  if (urlPath === '/students/' && method === 'GET') {
    return mockApi.students.list(data);
  }

  if (urlPath === '/students/' && method === 'POST') {
    return mockApi.students.create(data);
  }

  const studentDetailMatch = urlPath.match(/^\/students\/(\d+)\/$/);
  if (studentDetailMatch && method === 'GET') {
    return mockApi.students.detail(parseInt(studentDetailMatch[1]));
  }

  // ============================================================
  // GUARDIANS ENDPOINTS
  // ============================================================

  if (urlPath === '/guardians/' && method === 'GET') {
    return mockApi.guardians.list(data);
  }

  if (urlPath === '/guardians/' && method === 'POST') {
    return mockApi.guardians.create(data);
  }

  const guardianDetailMatch = urlPath.match(/^\/guardians\/(\d+)\/$/);
  if (guardianDetailMatch && method === 'GET') {
    return mockApi.guardians.detail(parseInt(guardianDetailMatch[1]));
  }

  // ============================================================
  // ATTENDANCE ENDPOINTS
  // ============================================================

  if (urlPath === '/attendance/mark/' && method === 'POST') {
    return mockApi.attendance.mark(data);
  }

  if (urlPath === '/attendance/today/' && method === 'GET') {
    return mockApi.attendance.getTodaysAttendance(data);
  }

  if (urlPath === '/attendance/report/' && method === 'GET') {
    return mockApi.attendance.getReport(data);
  }

  // ============================================================
  // SMS ENDPOINTS
  // ============================================================

  if (urlPath === '/sms/send/' && method === 'POST') {
    return mockApi.sms.send(data);
  }

  if (urlPath === '/sms/log/' && method === 'GET') {
    return mockApi.sms.getSmsLog(data);
  }

  // ============================================================
  // FALLBACK - NOT IMPLEMENTED IN MOCK
  // ============================================================

  console.warn(`⚠️  Mock endpoint not implemented: ${method.toUpperCase()} ${urlPath}`);
  
  return {
    success: false,
    error: `Mock endpoint not implemented: ${method.toUpperCase()} ${urlPath}`,
  };
};

/**
 * Create axios instance with mock API interceptor
 */
export const createApiClient = (axiosInstance) => {
  if (!USE_MOCK_API) {
    // Return unmodified axios for real API
    return axiosInstance;
  }

  // Override axios request to route to mock API
  axiosInstance.interceptors.request.use(
    async (config) => {
      const mockResponse = await routeApiCall(
        config.method,
        config.url,
        config.data,
        config.headers
      );

      if (mockResponse) {
        // Convert mock response to axios response format
        return {
          ...config,
          adapter: async () => ({
            data: mockResponse,
            status: mockResponse.success ? 200 : 400,
            statusText: mockResponse.success ? 'OK' : 'Bad Request',
            headers: config.headers,
            config,
          }),
        };
      }

      return config;
    },
    (error) => Promise.reject(error)
  );

  return axiosInstance;
};

export default {
  USE_MOCK_API,
  MOCK_API_DELAY,
  SIMULATE_SMS_ONLY,
  logApiConfiguration,
  routeApiCall,
  createApiClient,
};
