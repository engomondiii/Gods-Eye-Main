// ========================================
// GOD'S EYE EDTECH - CONSTANTS (COMPLETE WITH PHASE 5 UPDATES)
// ========================================

import { Platform } from 'react-native';

// ============================================================
// API CONFIGURATION
// ============================================================

// ⚠️ IMPORTANT: This is your backend URL
// For Android Emulator: use 10.0.2.2:8000
// For iOS Simulator: use 127.0.0.1:8000
// For Physical Device: use your machine's IP (e.g., 192.168.1.100:8000)
const getApiBaseUrl = () => {
  // Development backend URL
  const BACKEND_BASE = 'http://127.0.0.1:8000';
  
  // Android emulator needs special IP
  if (Platform.OS === 'android') {
    // If running on Android emulator, use 10.0.2.2
    // If running on physical Android device, replace with your machine's IP
    return `http://10.0.2.2:8000/api`;
  }
  
  // iOS simulator and physical iOS devices can use 127.0.0.1
  return `${BACKEND_BASE}/api`;
};

// API Base URL
export const API_BASE_URL = getApiBaseUrl();

// Full API Endpoints
export const API_ENDPOINTS = {
  // Base
  BASE: API_BASE_URL,
  
  // Authentication
  AUTH: {
    BASE: `${API_BASE_URL}/auth`,
    LOGIN: `${API_BASE_URL}/auth/login/`,
    LOGOUT: `${API_BASE_URL}/auth/logout/`,
    REGISTER: `${API_BASE_URL}/auth/register/`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/token/refresh/`,
    VERIFY_TOKEN: `${API_BASE_URL}/auth/token/verify/`,
    ME: `${API_BASE_URL}/auth/me/`,
    PASSWORD_RESET: `${API_BASE_URL}/auth/reset-password/`,
    PASSWORD_RESET_CONFIRM: `${API_BASE_URL}/auth/reset-password/confirm/`,
    CHANGE_PASSWORD: `${API_BASE_URL}/auth/change-password/`,
  },
  
  // Users
  USERS: {
    BASE: `${API_BASE_URL}/users`,
    LIST: `${API_BASE_URL}/users/`,
    DETAIL: (id) => `${API_BASE_URL}/users/${id}/`,
    CREATE: `${API_BASE_URL}/users/`,
    UPDATE: (id) => `${API_BASE_URL}/users/${id}/`,
    DELETE: (id) => `${API_BASE_URL}/users/${id}/`,
  },
  
  // Locations
  LOCATIONS: {
    BASE: `${API_BASE_URL}/locations`,
    // Countries
    COUNTRIES: `${API_BASE_URL}/locations/countries/`,
    COUNTRY_DETAIL: (id) => `${API_BASE_URL}/locations/countries/${id}/`,
    // Counties (Kenya's 47 Counties)
    COUNTIES: `${API_BASE_URL}/locations/counties/`,
    COUNTY_DETAIL: (id) => `${API_BASE_URL}/locations/counties/${id}/`,
    // Sub-Counties
    SUB_COUNTIES: `${API_BASE_URL}/locations/sub-counties/`,
    SUB_COUNTY_DETAIL: (id) => `${API_BASE_URL}/locations/sub-counties/${id}/`,
    // Wards
    WARDS: `${API_BASE_URL}/locations/wards/`,
    WARD_DETAIL: (id) => `${API_BASE_URL}/locations/wards/${id}/`,
  },
  
  // Schools
  SCHOOLS: {
    BASE: `${API_BASE_URL}/schools`,
    LIST: `${API_BASE_URL}/schools/`,
    DETAIL: (id) => `${API_BASE_URL}/schools/${id}/`,
    CREATE: `${API_BASE_URL}/schools/`,
    UPDATE: (id) => `${API_BASE_URL}/schools/${id}/`,
    DELETE: (id) => `${API_BASE_URL}/schools/${id}/`,
    APPROVE: (id) => `${API_BASE_URL}/schools/${id}/approve_school/`,
    REJECT: (id) => `${API_BASE_URL}/schools/${id}/reject_school/`,
    PENDING: `${API_BASE_URL}/schools/pending/`,
    STATISTICS: (id) => `${API_BASE_URL}/schools/${id}/statistics/`,
    SETTINGS: (id) => `${API_BASE_URL}/schools/${id}/settings/`,
  },
  
  // Students
  STUDENTS: {
    BASE: `${API_BASE_URL}/students`,
    LIST: `${API_BASE_URL}/students/`,
    DETAIL: (id) => `${API_BASE_URL}/students/${id}/`,
    CREATE: `${API_BASE_URL}/students/`,
    UPDATE: (id) => `${API_BASE_URL}/students/${id}/`,
    DELETE: (id) => `${API_BASE_URL}/students/${id}/`,
    BULK_CREATE: `${API_BASE_URL}/students/bulk_create/`,
    GUARDIANS: (id) => `${API_BASE_URL}/students/${id}/guardians/`,
    ATTENDANCE: (id) => `${API_BASE_URL}/students/${id}/attendance/`,
    BY_GRADE: `${API_BASE_URL}/students/by_grade/`,
  },
  
  // Teachers
  TEACHERS: {
    BASE: `${API_BASE_URL}/teachers`,
    LIST: `${API_BASE_URL}/teachers/`,
    DETAIL: (id) => `${API_BASE_URL}/teachers/${id}/`,
    CREATE: `${API_BASE_URL}/teachers/`,
    UPDATE: (id) => `${API_BASE_URL}/teachers/${id}/`,
    DELETE: (id) => `${API_BASE_URL}/teachers/${id}/`,
    ASSIGN_CLASS: (id) => `${API_BASE_URL}/teachers/${id}/assign_class/`,
    CLASSES: (id) => `${API_BASE_URL}/teachers/${id}/classes/`,
  },
  
  // Guardians
  GUARDIANS: {
    BASE: `${API_BASE_URL}/guardians`,
    LIST: `${API_BASE_URL}/guardians/`,
    DETAIL: (id) => `${API_BASE_URL}/guardians/${id}/`,
    CREATE: `${API_BASE_URL}/guardians/`,
    UPDATE: (id) => `${API_BASE_URL}/guardians/${id}/`,
    DELETE: (id) => `${API_BASE_URL}/guardians/${id}/`,
    STUDENTS: (id) => `${API_BASE_URL}/guardians/${id}/students/`,
    LINK: `${API_BASE_URL}/guardians/link/`,
    APPROVE_LINK: `${API_BASE_URL}/guardians/approve_link/`,
    REJECT_LINK: `${API_BASE_URL}/guardians/reject_link/`,
    MY_STUDENTS: `${API_BASE_URL}/guardians/my_students/`,
  },
  
  // Attendance
  ATTENDANCE: {
    BASE: `${API_BASE_URL}/attendance`,
    LIST: `${API_BASE_URL}/attendance/`,
    DETAIL: (id) => `${API_BASE_URL}/attendance/${id}/`,
    CREATE: `${API_BASE_URL}/attendance/`,
    UPDATE: (id) => `${API_BASE_URL}/attendance/${id}/`,
    DELETE: (id) => `${API_BASE_URL}/attendance/${id}/`,
    TODAY: `${API_BASE_URL}/attendance/today/`,
    MARK_PRESENT: `${API_BASE_URL}/attendance/mark_present/`,
    MARK_ABSENT: `${API_BASE_URL}/attendance/mark_absent/`,
    MARK_LATE: `${API_BASE_URL}/attendance/mark_late/`,
    MARK_EXCUSED: `${API_BASE_URL}/attendance/mark_excused/`,
    BULK_MARK: `${API_BASE_URL}/attendance/bulk_mark/`,
    BY_DATE: `${API_BASE_URL}/attendance/by_date/`,
    BY_STUDENT: `${API_BASE_URL}/attendance/by_student/`,
    STATISTICS: `${API_BASE_URL}/attendance/statistics/`,
    HISTORY: `${API_BASE_URL}/attendance/history/`,
    SUMMARIES: `${API_BASE_URL}/attendance/summaries/`,
    ABSENT_STUDENTS: `${API_BASE_URL}/attendance/absent_students/`,
    LATE_STUDENTS: `${API_BASE_URL}/attendance/late_students/`,
  },
  
  // QR Codes
  QRCODES: {
    BASE: `${API_BASE_URL}/qrcodes`,
    LIST: `${API_BASE_URL}/qrcodes/`,
    DETAIL: (id) => `${API_BASE_URL}/qrcodes/${id}/`,
    GENERATE_FOR_STUDENT: `${API_BASE_URL}/qrcodes/generate_for_student/`,
    SCAN: `${API_BASE_URL}/qrcodes/scan/`,
    BULK_GENERATE: `${API_BASE_URL}/qrcodes/bulk_generate/`,
    BY_STUDENT: `${API_BASE_URL}/qrcodes/by_student/`,
    SCAN_LOGS: `${API_BASE_URL}/qrcodes/scan-logs/`,
  },
  
  // Biometrics
  BIOMETRICS: {
    BASE: `${API_BASE_URL}/biometrics`,
    LIST: `${API_BASE_URL}/biometrics/`,
    DETAIL: (id) => `${API_BASE_URL}/biometrics/${id}/`,
    ENROLL: `${API_BASE_URL}/biometrics/enroll/`,
    VERIFY: `${API_BASE_URL}/biometrics/verify/`,
    BY_STUDENT: `${API_BASE_URL}/biometrics/by_student/`,
    SCAN_LOGS: `${API_BASE_URL}/biometrics/scan-logs/`,
  },
  
  // OTC (One-Time Codes)
  OTC: {
    BASE: `${API_BASE_URL}/otc`,
    LIST: `${API_BASE_URL}/otc/`,
    DETAIL: (id) => `${API_BASE_URL}/otc/${id}/`,
    GENERATE: `${API_BASE_URL}/otc/generate/`,
    VERIFY: `${API_BASE_URL}/otc/verify/`,
    MY_CODES: `${API_BASE_URL}/otc/my_codes/`,
    ACTIVE_CODES: `${API_BASE_URL}/otc/active_codes/`,
  },
  
  // 💰 PAYMENTS (PHASE 5 - NEW)
  PAYMENTS: {
    BASE: `${API_BASE_URL}/payments`,
    // Fee Structures
    FEE_STRUCTURES: `${API_BASE_URL}/payments/fee-structures/`,
    FEE_STRUCTURE_DETAIL: (id) => `${API_BASE_URL}/payments/fee-structures/${id}/`,
    // Payment Requests
    REQUESTS: `${API_BASE_URL}/payments/requests/`,
    REQUEST_DETAIL: (id) => `${API_BASE_URL}/payments/requests/${id}/`,
    MY_PAYMENTS: `${API_BASE_URL}/payments/requests/my_payments/`,
    OVERDUE: `${API_BASE_URL}/payments/requests/overdue/`,
    STATISTICS: `${API_BASE_URL}/payments/requests/statistics/`,
    BULK_CREATE: `${API_BASE_URL}/payments/requests/bulk_create/`,
    // Payments (Transactions)
    PAYMENTS: `${API_BASE_URL}/payments/payments/`,
    PAYMENT_DETAIL: (id) => `${API_BASE_URL}/payments/payments/${id}/`,
    VERIFY_PAYMENT: (id) => `${API_BASE_URL}/payments/payments/${id}/verify/`,
    // M-Pesa
    MPESA: `${API_BASE_URL}/payments/mpesa/`,
    MPESA_INITIATE: `${API_BASE_URL}/payments/mpesa/initiate/`,
    MPESA_CALLBACK: `${API_BASE_URL}/payments/mpesa/callback/`,
    MPESA_QUERY: `${API_BASE_URL}/payments/mpesa/query/`,
  },
  
  // Notifications
  NOTIFICATIONS: {
    BASE: `${API_BASE_URL}/notifications`,
    LIST: `${API_BASE_URL}/notifications/`,
    DETAIL: (id) => `${API_BASE_URL}/notifications/${id}/`,
    MY_NOTIFICATIONS: `${API_BASE_URL}/notifications/my_notifications/`,
    MARK_READ: (id) => `${API_BASE_URL}/notifications/${id}/mark_read/`,
    MARK_ALL_READ: `${API_BASE_URL}/notifications/mark_all_read/`,
    UNREAD_COUNT: `${API_BASE_URL}/notifications/unread_count/`,
    PREFERENCES: {
      BASE: `${API_BASE_URL}/notifications/preferences`,
      MY_PREFERENCES: `${API_BASE_URL}/notifications/preferences/my_preferences/`,
      UPDATE: `${API_BASE_URL}/notifications/preferences/update_preferences/`,
    },
  },
  
  // Reports
  REPORTS: {
    BASE: `${API_BASE_URL}/reports`,
    LIST: `${API_BASE_URL}/reports/`,
    GENERATE: `${API_BASE_URL}/reports/generate/`,
    DETAIL: (id) => `${API_BASE_URL}/reports/${id}/`,
    DOWNLOAD: (id) => `${API_BASE_URL}/reports/${id}/download/`,
    SCHEDULED: {
      BASE: `${API_BASE_URL}/reports/scheduled`,
      LIST: `${API_BASE_URL}/reports/scheduled/`,
      CREATE: `${API_BASE_URL}/reports/scheduled/`,
      UPDATE: (id) => `${API_BASE_URL}/reports/scheduled/${id}/`,
      DELETE: (id) => `${API_BASE_URL}/reports/scheduled/${id}/`,
    },
  },
  
  // Analytics
  ANALYTICS: {
    BASE: `${API_BASE_URL}/analytics`,
    DASHBOARD: {
      METRICS: `${API_BASE_URL}/analytics/dashboard/metrics/`,
      COMPARATIVE: `${API_BASE_URL}/analytics/dashboard/comparative/`,
      TOP_PERFORMERS: `${API_BASE_URL}/analytics/dashboard/top_performers/`,
      TRENDS: `${API_BASE_URL}/analytics/dashboard/trends/`,
    },
    DAILY: {
      LIST: `${API_BASE_URL}/analytics/daily/`,
      BY_DATE: `${API_BASE_URL}/analytics/daily/by_date/`,
      DATE_RANGE: `${API_BASE_URL}/analytics/daily/date_range/`,
    },
    WEEKLY: {
      LIST: `${API_BASE_URL}/analytics/weekly/`,
      CURRENT: `${API_BASE_URL}/analytics/weekly/current_week/`,
    },
    MONTHLY: {
      LIST: `${API_BASE_URL}/analytics/monthly/`,
      CURRENT: `${API_BASE_URL}/analytics/monthly/current_month/`,
    },
  },
};

// API Configuration
export const API_CONFIG = {
  TIMEOUT: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000, // 1 second
  HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
};

// ============================================================
// USER ROLES & AUTHENTICATION
// ============================================================

// User Roles - MATCHES BACKEND EXACTLY
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  SCHOOL_ADMIN: 'school_admin',
  TEACHER: 'teacher',
  GUARDIAN: 'guardian',
};

// Role Labels
export const USER_ROLE_LABELS = {
  [USER_ROLES.SUPER_ADMIN]: 'Super Administrator',
  [USER_ROLES.SCHOOL_ADMIN]: 'School Administrator',
  [USER_ROLES.TEACHER]: 'Teacher',
  [USER_ROLES.GUARDIAN]: 'Guardian',
};

// Role Icons
export const USER_ROLE_ICONS = {
  [USER_ROLES.SUPER_ADMIN]: 'shield-crown',
  [USER_ROLES.SCHOOL_ADMIN]: 'shield-account',
  [USER_ROLES.TEACHER]: 'account-tie',
  [USER_ROLES.GUARDIAN]: 'account-heart',
};

// Role Colors
export const USER_ROLE_COLORS = {
  [USER_ROLES.SUPER_ADMIN]: '#F44336',
  [USER_ROLES.SCHOOL_ADMIN]: '#FF9800',
  [USER_ROLES.TEACHER]: '#2196F3',
  [USER_ROLES.GUARDIAN]: '#4CAF50',
};

// ============================================================
// ROLE HELPER FUNCTIONS
// ============================================================

/**
 * Get user role from user object
 * Priority: Super Admin > School Admin > Teacher > Guardian
 * @param {Object} user - User object from backend
 * @returns {string|null} User role constant
 */
export const getUserRole = (user) => {
  if (!user) return null;

  if (user.is_superadmin) return USER_ROLES.SUPER_ADMIN;
  if (user.is_school_admin) return USER_ROLES.SCHOOL_ADMIN;
  if (user.is_teacher) return USER_ROLES.TEACHER;
  if (user.is_guardian) return USER_ROLES.GUARDIAN;

  return null;
};

/**
 * Get user role display name
 * @param {Object} user - User object from backend
 * @returns {string} User role display name
 */
export const getUserRoleDisplay = (user) => {
  const role = getUserRole(user);
  return USER_ROLE_LABELS[role] || 'Unknown Role';
};

/**
 * Get user role icon
 * @param {Object} user - User object from backend
 * @returns {string} Material Community Icon name
 */
export const getUserRoleIcon = (user) => {
  const role = getUserRole(user);
  return USER_ROLE_ICONS[role] || 'account';
};

/**
 * Get user role color
 * @param {Object} user - User object from backend
 * @returns {string} Hex color code
 */
export const getUserRoleColor = (user) => {
  const role = getUserRole(user);
  return USER_ROLE_COLORS[role] || '#9E9E9E';
};

/**
 * Check if user has a specific role
 * @param {Object} user - User object from backend
 * @param {string} role - Role to check (USER_ROLES constant)
 * @returns {boolean} True if user has the role
 */
export const hasRole = (user, role) => {
  if (!user || !role) return false;

  switch (role) {
    case USER_ROLES.SUPER_ADMIN:
      return user.is_superadmin === true;
    case USER_ROLES.SCHOOL_ADMIN:
      return user.is_school_admin === true;
    case USER_ROLES.TEACHER:
      return user.is_teacher === true;
    case USER_ROLES.GUARDIAN:
      return user.is_guardian === true;
    default:
      return false;
  }
};

/**
 * Check if user has any of the specified roles
 * @param {Object} user - User object from backend
 * @param {Array<string>} roles - Array of roles to check
 * @returns {boolean} True if user has any of the roles
 */
export const hasAnyRole = (user, roles) => {
  if (!user || !Array.isArray(roles)) return false;
  return roles.some(role => hasRole(user, role));
};

/**
 * Check if user has all of the specified roles
 * @param {Object} user - User object from backend
 * @param {Array<string>} roles - Array of roles to check
 * @returns {boolean} True if user has all of the roles
 */
export const hasAllRoles = (user, roles) => {
  if (!user || !Array.isArray(roles)) return false;
  return roles.every(role => hasRole(user, role));
};

/**
 * Check if user is admin (Super Admin or School Admin)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user is admin
 */
export const isAdmin = (user) => {
  if (!user) return false;
  return user.is_superadmin === true || user.is_school_admin === true;
};

/**
 * Check if user is school member (School Admin or Teacher)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user is school member
 */
export const isSchoolMember = (user) => {
  if (!user) return false;
  return user.is_school_admin === true || user.is_teacher === true;
};

/**
 * Check if user has valid role assigned
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user has at least one role
 */
export const hasValidRole = (user) => {
  if (!user) return false;
  return (
    user.is_superadmin === true ||
    user.is_school_admin === true ||
    user.is_teacher === true ||
    user.is_guardian === true
  );
};

/**
 * Get all roles assigned to user
 * @param {Object} user - User object from backend
 * @returns {Array<string>} Array of role constants
 */
export const getUserRoles = (user) => {
  if (!user) return [];

  const roles = [];
  if (user.is_superadmin) roles.push(USER_ROLES.SUPER_ADMIN);
  if (user.is_school_admin) roles.push(USER_ROLES.SCHOOL_ADMIN);
  if (user.is_teacher) roles.push(USER_ROLES.TEACHER);
  if (user.is_guardian) roles.push(USER_ROLES.GUARDIAN);

  return roles;
};

/**
 * Get user's primary role (highest priority)
 * @param {Object} user - User object from backend
 * @returns {string|null} Primary role constant
 */
export const getPrimaryRole = (user) => {
  return getUserRole(user);
};

/**
 * Format user's full name
 * @param {Object} user - User object from backend
 * @returns {string} Formatted full name
 */
export const getUserFullName = (user) => {
  if (!user) return 'Unknown User';

  const parts = [
    user.first_name,
    user.middle_name,
    user.last_name,
  ].filter(Boolean);

  return parts.length > 0 ? parts.join(' ') : user.username || 'Unknown User';
};

/**
 * Get user's initials
 * @param {Object} user - User object from backend
 * @returns {string} User initials (max 2 characters)
 */
export const getUserInitials = (user) => {
  if (!user) return '?';

  const firstName = user.first_name || '';
  const lastName = user.last_name || '';

  if (firstName && lastName) {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  }

  if (firstName) {
    return firstName.substring(0, 2).toUpperCase();
  }

  if (user.username) {
    return user.username.substring(0, 2).toUpperCase();
  }

  return '?';
};

/**
 * Check if user belongs to a school
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user has a school
 */
export const hasSchool = (user) => {
  if (!user) return false;
  return !!user.school || !!user.school_data;
};

/**
 * Get user's school name
 * @param {Object} user - User object from backend
 * @returns {string|null} School name or null
 */
export const getUserSchoolName = (user) => {
  if (!user) return null;
  return user.school_data?.name || null;
};

/**
 * Check if user can manage school (Super Admin or School Admin)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user can manage school
 */
export const canManageSchool = (user) => {
  if (!user) return false;
  return user.is_superadmin === true || user.is_school_admin === true;
};

/**
 * Check if user can view all schools (Super Admin only)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user can view all schools
 */
export const canViewAllSchools = (user) => {
  if (!user) return false;
  return user.is_superadmin === true;
};

/**
 * Check if user can manage students (School Admin or Teacher)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user can manage students
 */
export const canManageStudents = (user) => {
  if (!user) return false;
  return (
    user.is_superadmin === true ||
    user.is_school_admin === true ||
    user.is_teacher === true
  );
};

/**
 * Check if user can view attendance (School Admin, Teacher, or Guardian)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user can view attendance
 */
export const canViewAttendance = (user) => {
  if (!user) return false;
  return (
    user.is_superadmin === true ||
    user.is_school_admin === true ||
    user.is_teacher === true ||
    user.is_guardian === true
  );
};

/**
 * Check if user can mark attendance (School Admin or Teacher)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user can mark attendance
 */
export const canMarkAttendance = (user) => {
  if (!user) return false;
  return (
    user.is_superadmin === true ||
    user.is_school_admin === true ||
    user.is_teacher === true
  );
};

/**
 * Check if user can view payments (All roles)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user can view payments
 */
export const canViewPayments = (user) => {
  if (!user) return false;
  return hasValidRole(user);
};

/**
 * Check if user can create payment requests (School Admin or Teacher)
 * @param {Object} user - User object from backend
 * @returns {boolean} True if user can create payment requests
 */
export const canCreatePaymentRequests = (user) => {
  if (!user) return false;
  return (
    user.is_superadmin === true ||
    user.is_school_admin === true ||
    user.is_teacher === true
  );
};

// ============================================================
// SCREEN NAMES
// ============================================================

export const SCREENS = {
  // Auth
  SPLASH: 'Splash',
  LOGIN: 'Login',
  
  // Teacher
  TEACHER_DASHBOARD: 'TeacherDashboard',
  STUDENT_LIST: 'StudentList',
  STUDENT_DETAIL: 'StudentDetail',
  CREATE_STUDENT: 'CreateStudent',
  GUARDIAN_LINK_REQUESTS: 'GuardianLinkRequests',
  CREATE_GUARDIAN_LINK: 'CreateGuardianLink',
  CREATE_PAYMENT_REQUEST: 'CreatePaymentRequest',
  PAYMENTS_LIST: 'PaymentsList',
  
  // Guardian
  GUARDIAN_DASHBOARD: 'GuardianDashboard',
  MY_STUDENTS: 'MyStudents',
  PENDING_APPROVALS: 'PendingApprovals',
  PAYMENT_REQUESTS: 'PaymentRequests',
  
  // School Admin
  SCHOOL_ADMIN_DASHBOARD: 'SchoolAdminDashboard',
  SCHOOL_TEACHERS_MANAGEMENT: 'SchoolTeachersManagement',
  SCHOOL_STUDENTS_OVERVIEW: 'SchoolStudentsOverview',
  SCHOOL_SETTINGS: 'SchoolSettings',
  SCHOOL_REPORTS: 'SchoolReports',
  MANAGE_TEACHERS: 'ManageTeachers',
  ADD_TEACHER: 'AddTeacher',
  MANAGE_STUDENTS: 'ManageStudents',
  ADD_STUDENT: 'AddStudent',
  MANAGE_GUARDIANS: 'ManageGuardians',
  ADD_GUARDIAN: 'AddGuardian',
  SCHOOL_ADMIN_PROFILE: 'SchoolAdminProfile',
  
  // Super Admin
  ADMIN_DASHBOARD: 'AdminDashboard',
  SCHOOLS_LIST: 'SchoolsList',
  SCHOOL_DETAIL: 'SchoolDetail',
  USERS_MANAGEMENT: 'UsersManagement',
  SYSTEM_STATISTICS: 'SystemStatistics',
  
  // Shared
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  
  // Attendance Screens
  ATTENDANCE_DASHBOARD: 'AttendanceDashboard',
  CHECK_IN: 'CheckIn',
  ATTENDANCE_HISTORY: 'AttendanceHistory',
  ATTENDANCE_REPORTS: 'AttendanceReports',
  STUDENT_QR_CODE: 'StudentQRCode',
  BIOMETRIC_SETUP: 'BiometricSetup',
  MANUAL_ATTENDANCE: 'ManualAttendance',
};

// ============================================================
// 💰 PAYMENT CONSTANTS (PHASE 5 - UPDATED)
// ============================================================

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PARTIALLY_PAID: 'partially_paid',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.PARTIALLY_PAID]: 'Partially Paid',
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.OVERDUE]: 'Overdue',
  [PAYMENT_STATUS.CANCELLED]: 'Cancelled',
};

export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: '#FFA500',
  [PAYMENT_STATUS.PARTIALLY_PAID]: '#17A2B8',
  [PAYMENT_STATUS.PAID]: '#28A745',
  [PAYMENT_STATUS.OVERDUE]: '#DC3545',
  [PAYMENT_STATUS.CANCELLED]: '#6C757D',
};

export const PAYMENT_STATUS_ICONS = {
  [PAYMENT_STATUS.PENDING]: 'clock-outline',
  [PAYMENT_STATUS.PARTIALLY_PAID]: 'progress-check',
  [PAYMENT_STATUS.PAID]: 'check-circle',
  [PAYMENT_STATUS.OVERDUE]: 'alert-circle',
  [PAYMENT_STATUS.CANCELLED]: 'close-circle',
};

export const PAYMENT_FLEXIBILITY = {
  FULL_ONLY: 'full_only',
  FLEXIBLE: 'flexible',
  INSTALLMENT_PLAN: 'installment_plan',
};

export const PAYMENT_FLEXIBILITY_LABELS = {
  [PAYMENT_FLEXIBILITY.FULL_ONLY]: 'Full Payment Only',
  [PAYMENT_FLEXIBILITY.FLEXIBLE]: 'Flexible Payment',
  [PAYMENT_FLEXIBILITY.INSTALLMENT_PLAN]: 'Installment Plan',
};

export const PAYMENT_METHOD = {
  MPESA: 'mpesa',
  BANK_TRANSFER: 'bank_transfer',
  CASH: 'cash',
  CHEQUE: 'cheque',
  CARD: 'card',
};

export const PAYMENT_METHOD_LABELS = {
  [PAYMENT_METHOD.MPESA]: 'M-Pesa',
  [PAYMENT_METHOD.BANK_TRANSFER]: 'Bank Transfer',
  [PAYMENT_METHOD.CASH]: 'Cash',
  [PAYMENT_METHOD.CHEQUE]: 'Cheque',
  [PAYMENT_METHOD.CARD]: 'Card',
};

export const PAYMENT_METHOD_ICONS = {
  [PAYMENT_METHOD.MPESA]: 'cellphone',
  [PAYMENT_METHOD.BANK_TRANSFER]: 'bank',
  [PAYMENT_METHOD.CASH]: 'cash',
  [PAYMENT_METHOD.CHEQUE]: 'checkbook',
  [PAYMENT_METHOD.CARD]: 'credit-card',
};

export const MPESA_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
};

export const PAYMENT_CONFIG = {
  MIN_PAYMENT_AMOUNT: 100,
  MAX_INSTALLMENTS: 12,
  DEFAULT_MINIMUM_PERCENTAGE: 10,
  ALLOW_OVERPAYMENT: false,
  CURRENCY: 'KES',
  CURRENCY_SYMBOL: 'KSh',
  CURRENCY_NAME: 'Kenyan Shilling',
  MIN_AMOUNT: 1,
  MAX_AMOUNT: 1000000,
};

// ============================================================
// REQUEST & APPROVAL CONSTANTS
// ============================================================

export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  FINALIZED: 'finalized',
};

// ============================================================
// ATTENDANCE CONSTANTS
// ============================================================

export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
  UNKNOWN: 'unknown',
};

export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.EXCUSED]: 'Excused',
  [ATTENDANCE_STATUS.UNKNOWN]: 'Unknown',
};

export const ATTENDANCE_STATUS_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]: '#4CAF50',
  [ATTENDANCE_STATUS.ABSENT]: '#F44336',
  [ATTENDANCE_STATUS.LATE]: '#FF9800',
  [ATTENDANCE_STATUS.EXCUSED]: '#2196F3',
  [ATTENDANCE_STATUS.UNKNOWN]: '#757575',
};

export const ATTENDANCE_STATUS_ICONS = {
  [ATTENDANCE_STATUS.PRESENT]: 'check-circle',
  [ATTENDANCE_STATUS.ABSENT]: 'close-circle',
  [ATTENDANCE_STATUS.LATE]: 'clock-alert',
  [ATTENDANCE_STATUS.EXCUSED]: 'information',
  [ATTENDANCE_STATUS.UNKNOWN]: 'help-circle',
};

export const ATTENDANCE_TYPES = {
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
};

export const ATTENDANCE_METHODS = {
  QR_CODE: 'qr_code',
  FINGERPRINT: 'fingerprint',
  FACE_RECOGNITION: 'face_recognition',
  ONE_TIME_CODE: 'one_time_code',
  MANUAL: 'manual',
};

export const ATTENDANCE_METHOD_LABELS = {
  [ATTENDANCE_METHODS.QR_CODE]: 'QR Code',
  [ATTENDANCE_METHODS.FINGERPRINT]: 'Fingerprint',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: 'Face Recognition',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: 'One-Time Code',
  [ATTENDANCE_METHODS.MANUAL]: 'Manual Entry',
};

export const ATTENDANCE_METHOD_ICONS = {
  [ATTENDANCE_METHODS.QR_CODE]: 'qrcode-scan',
  [ATTENDANCE_METHODS.FINGERPRINT]: 'fingerprint',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: 'face-recognition',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: 'numeric',
  [ATTENDANCE_METHODS.MANUAL]: 'pencil',
};

export const ATTENDANCE_METHOD_COLORS = {
  [ATTENDANCE_METHODS.QR_CODE]: '#2196F3',
  [ATTENDANCE_METHODS.FINGERPRINT]: '#4CAF50',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: '#FF9800',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: '#9C27B0',
  [ATTENDANCE_METHODS.MANUAL]: '#757575',
};

export const BIOMETRIC_TYPES = {
  FINGERPRINT: 'fingerprint',
  FACE_RECOGNITION: 'face_recognition',
  IRIS: 'iris',
};

export const QR_CODE_CONFIG = {
  SIZE: 256,
  ERROR_CORRECTION_LEVEL: 'H',
  EXPIRY_HOURS: 24,
  VERSION: 1,
  MARGIN: 4,
};

export const OTC_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  ALLOWED_CHARACTERS: '0123456789',
  MAX_ATTEMPTS: 3,
};

// ============================================================
// REPORT CONSTANTS - COMPLETE & UPDATED
// ============================================================

export const REPORT_TYPES = {
  ATTENDANCE: 'attendance',
  PAYMENT: 'payment',
  STUDENT: 'student',
  ACADEMIC: 'academic',
  COMPREHENSIVE: 'comprehensive',
  // Legacy types (keep for backward compatibility)
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
  CLASS: 'class',
};

export const REPORT_TYPE_OPTIONS = [
  { 
    value: 'attendance', 
    label: 'Attendance Report', 
    icon: 'clipboard-check', 
    color: '#2196F3',
    description: 'Detailed attendance records and statistics'
  },
  { 
    value: 'payment', 
    label: 'Payment Report', 
    icon: 'cash-multiple', 
    color: '#4CAF50',
    description: 'Payment history and financial summaries'
  },
  { 
    value: 'student', 
    label: 'Student Report', 
    icon: 'account-school', 
    color: '#FF9800',
    description: 'Student information and performance data'
  },
  { 
    value: 'academic', 
    label: 'Academic Report', 
    icon: 'school', 
    color: '#9C27B0',
    description: 'Academic performance and progress tracking'
  },
  { 
    value: 'comprehensive', 
    label: 'Comprehensive Report', 
    icon: 'file-chart', 
    color: '#00BCD4',
    description: 'Complete overview of all school activities'
  },
];

export const REPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
  JSON: 'json',
};

export const REPORT_FORMAT_OPTIONS = [
  { 
    value: 'pdf', 
    label: 'PDF', 
    icon: 'file-pdf-box', 
    color: '#F44336',
    extension: '.pdf',
    mimeType: 'application/pdf'
  },
  { 
    value: 'excel', 
    label: 'Excel', 
    icon: 'file-excel', 
    color: '#4CAF50',
    extension: '.xlsx',
    mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  },
  { 
    value: 'csv', 
    label: 'CSV', 
    icon: 'file-delimited', 
    color: '#2196F3',
    extension: '.csv',
    mimeType: 'text/csv'
  },
  { 
    value: 'json', 
    label: 'JSON', 
    icon: 'code-json', 
    color: '#FF9800',
    extension: '.json',
    mimeType: 'application/json'
  },
];

export const REPORT_FREQUENCIES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  QUARTERLY: 'quarterly',
};

export const REPORT_FREQUENCY_OPTIONS = [
  { value: 'daily', label: 'Daily', description: 'Generate report every day' },
  { value: 'weekly', label: 'Weekly', description: 'Generate report every week' },
  { value: 'monthly', label: 'Monthly', description: 'Generate report every month' },
  { value: 'quarterly', label: 'Quarterly', description: 'Generate report every quarter' },
];

export const REPORT_PERIODS = {
  TODAY: 'today',
  THIS_WEEK: 'this_week',
  THIS_MONTH: 'this_month',
  THIS_TERM: 'this_term',
  CUSTOM: 'custom',
};

export const REPORT_PERIOD_OPTIONS = [
  { value: 'today', label: 'Today' },
  { value: 'this_week', label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'this_term', label: 'This Term' },
  { value: 'custom', label: 'Custom Date Range' },
];

export const ATTENDANCE_TIME_WINDOWS = {
  EARLY_CHECKIN_MINUTES: 30,
  LATE_CHECKIN_MINUTES: 15,
  EARLY_CHECKOUT_MINUTES: 30,
  DEFAULT_CHECKIN_TIME: '07:00',
  DEFAULT_CHECKOUT_TIME: '15:00',
};

export const BIOMETRIC_ERROR_CODES = {
  NOT_AVAILABLE: 'BIOMETRIC_NOT_AVAILABLE',
  NOT_ENROLLED: 'BIOMETRIC_NOT_ENROLLED',
  AUTHENTICATION_FAILED: 'BIOMETRIC_AUTH_FAILED',
  CANCELLED: 'BIOMETRIC_CANCELLED',
  TIMEOUT: 'BIOMETRIC_TIMEOUT',
  LOCKOUT: 'BIOMETRIC_LOCKOUT',
  SYSTEM_ERROR: 'BIOMETRIC_SYSTEM_ERROR',
};

// ============================================================
// 🇰🇪 KENYA EDUCATION SYSTEM CONSTANTS
// ============================================================

export const KENYA_COUNTIES = [
  'Baringo', 'Bomet', 'Bungoma', 'Busia', 'Elgeyo-Marakwet', 'Embu', 'Garissa',
  'Homa Bay', 'Isiolo', 'Kajiado', 'Kakamega', 'Kericho', 'Kiambu', 'Kilifi',
  'Kirinyaga', 'Kisii', 'Kisumu', 'Kitui', 'Kwale', 'Laikipia', 'Lamu',
  'Machakos', 'Makueni', 'Mandera', 'Marsabit', 'Meru', 'Migori', 'Mombasa',
  'Murang\'a', 'Nairobi', 'Nakuru', 'Nandi', 'Narok', 'Nyamira', 'Nyandarua',
  'Nyeri', 'Samburu', 'Siaya', 'Taita-Taveta', 'Tana River', 'Tharaka-Nithi',
  'Trans Nzoia', 'Turkana', 'Uasin Gishu', 'Vihiga', 'Wajir', 'West Pokot',
];

// EDUCATION LEVELS
export const KENYA_EDUCATION_LEVELS = {
  PRE_PRIMARY: 'pre_primary',
  PRIMARY: 'primary',
  JUNIOR_SECONDARY: 'junior_secondary',
  SENIOR_SECONDARY: 'senior_secondary',
};

export const KENYA_EDUCATION_LEVEL_LABELS = {
  [KENYA_EDUCATION_LEVELS.PRE_PRIMARY]: 'Pre-Primary (EYE)',
  [KENYA_EDUCATION_LEVELS.PRIMARY]: 'Primary',
  [KENYA_EDUCATION_LEVELS.JUNIOR_SECONDARY]: 'Junior Secondary',
  [KENYA_EDUCATION_LEVELS.SENIOR_SECONDARY]: 'Senior Secondary',
};

// GRADES (Kenya CBC + 8-4-4 System)
export const KENYA_GRADES = {
  PP1: 'pp1',
  PP2: 'pp2',
  GRADE_1: 'grade_1',
  GRADE_2: 'grade_2',
  GRADE_3: 'grade_3',
  GRADE_4: 'grade_4',
  GRADE_5: 'grade_5',
  GRADE_6: 'grade_6',
  GRADE_7: 'grade_7',
  GRADE_8: 'grade_8',
  GRADE_9: 'grade_9',
  GRADE_10: 'grade_10',
  GRADE_11: 'grade_11',
  GRADE_12: 'grade_12',
  FORM_1: 'form_1',
  FORM_2: 'form_2',
  FORM_3: 'form_3',
  FORM_4: 'form_4',
};

export const KENYA_GRADE_LABELS = {
  [KENYA_GRADES.PP1]: 'PP1 (Pre-Primary 1)',
  [KENYA_GRADES.PP2]: 'PP2 (Pre-Primary 2)',
  [KENYA_GRADES.GRADE_1]: 'Grade 1',
  [KENYA_GRADES.GRADE_2]: 'Grade 2',
  [KENYA_GRADES.GRADE_3]: 'Grade 3',
  [KENYA_GRADES.GRADE_4]: 'Grade 4',
  [KENYA_GRADES.GRADE_5]: 'Grade 5',
  [KENYA_GRADES.GRADE_6]: 'Grade 6',
  [KENYA_GRADES.GRADE_7]: 'Grade 7 (Junior Secondary)',
  [KENYA_GRADES.GRADE_8]: 'Grade 8 (Junior Secondary)',
  [KENYA_GRADES.GRADE_9]: 'Grade 9 (Junior Secondary)',
  [KENYA_GRADES.GRADE_10]: 'Grade 10 (Senior Secondary)',
  [KENYA_GRADES.GRADE_11]: 'Grade 11 (Senior Secondary)',
  [KENYA_GRADES.GRADE_12]: 'Grade 12 (Senior Secondary)',
  [KENYA_GRADES.FORM_1]: 'Form 1 (8-4-4)',
  [KENYA_GRADES.FORM_2]: 'Form 2 (8-4-4)',
  [KENYA_GRADES.FORM_3]: 'Form 3 (8-4-4)',
  [KENYA_GRADES.FORM_4]: 'Form 4 (8-4-4)',
};

// GRADES BY EDUCATION LEVEL
export const KENYA_GRADES_BY_LEVEL = {
  [KENYA_EDUCATION_LEVELS.PRE_PRIMARY]: [
    KENYA_GRADES.PP1,
    KENYA_GRADES.PP2,
  ],
  [KENYA_EDUCATION_LEVELS.PRIMARY]: [
    KENYA_GRADES.GRADE_1,
    KENYA_GRADES.GRADE_2,
    KENYA_GRADES.GRADE_3,
    KENYA_GRADES.GRADE_4,
    KENYA_GRADES.GRADE_5,
    KENYA_GRADES.GRADE_6,
  ],
  [KENYA_EDUCATION_LEVELS.JUNIOR_SECONDARY]: [
    KENYA_GRADES.GRADE_7,
    KENYA_GRADES.GRADE_8,
    KENYA_GRADES.GRADE_9,
  ],
  [KENYA_EDUCATION_LEVELS.SENIOR_SECONDARY]: [
    KENYA_GRADES.GRADE_10,
    KENYA_GRADES.GRADE_11,
    KENYA_GRADES.GRADE_12,
    KENYA_GRADES.FORM_1,
    KENYA_GRADES.FORM_2,
    KENYA_GRADES.FORM_3,
    KENYA_GRADES.FORM_4,
  ],
};

// ACADEMIC TERMS
export const KENYA_ACADEMIC_TERMS = {
  TERM_1: 'term_1',
  TERM_2: 'term_2',
  TERM_3: 'term_3',
};

export const KENYA_ACADEMIC_TERM_LABELS = {
  [KENYA_ACADEMIC_TERMS.TERM_1]: 'Term 1 (Jan - Apr)',
  [KENYA_ACADEMIC_TERMS.TERM_2]: 'Term 2 (May - Aug)',
  [KENYA_ACADEMIC_TERMS.TERM_3]: 'Term 3 (Sep - Nov)',
};

// STREAM TYPES
export const KENYA_STREAM_TYPES = {
  COLORS: 'colors',
  DIRECTIONS: 'directions',
  LETTERS: 'letters',
  ANIMALS: 'animals',
  PLACES: 'places',
  CUSTOM: 'custom',
};

// COMMON STREAMS
export const KENYA_COMMON_STREAMS = {
  colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'White', 'Black'],
  directions: ['East', 'West', 'North', 'South', 'Northeast', 'Northwest', 'Southeast', 'Southwest'],
  letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  animals: ['Lion', 'Leopard', 'Cheetah', 'Buffalo', 'Elephant', 'Rhino', 'Giraffe', 'Zebra'],
  places: ['Kilimanjaro', 'Kenya', 'Mara', 'Tsavo', 'Amboseli', 'Nakuru', 'Nairobi', 'Mombasa'],
};

// COMMON HOUSES
export const KENYA_COMMON_HOUSES = {
  mountains: ['Kilimanjaro', 'Kenya', 'Elgon', 'Longonot', 'Aberdare', 'Meru'],
  wildlifeParks: ['Mara', 'Tsavo', 'Amboseli', 'Nakuru', 'Samburu', 'Nairobi'],
  historicalFigures: ['Kenyatta', 'Odinga', 'Wangari', 'Kimathi', 'Muindi', 'Waiyaki'],
  colors: ['Red', 'Blue', 'Green', 'Yellow'],
};

// HOUSE COLORS
export const KENYA_HOUSE_COLORS = [
  { name: 'Red', hex: '#F44336' },
  { name: 'Blue', hex: '#2196F3' },
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Yellow', hex: '#FFEB3B'},
  { name: 'Orange', hex: '#FF9800' },
  { name: 'Purple', hex: '#9C27B0' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
];

export const KENYA_SCHOOL_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INTERNATIONAL: 'international',
};

export const KENYA_SCHOOL_CATEGORIES = {
  NATIONAL: 'national',
  EXTRA_COUNTY: 'extra_county',
  COUNTY: 'county',
  SUB_COUNTY: 'sub_county',
};

export const KENYA_SCHOOL_GENDER = {
  BOYS: 'boys',
  GIRLS: 'girls',
  MIXED: 'mixed',
};

export const KENYA_SCHOOL_BOARDING = {
  DAY: 'day',
  BOARDING: 'boarding',
  DAY_AND_BOARDING: 'day_and_boarding',
};

// ============================================================
// STUDENT CONSTANTS
// ============================================================

// Gender Options
export const GENDER_OPTIONS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'other', label: 'Other' },
];

// Relationship Types (for Guardian-Student links)
export const RELATIONSHIP_TYPES = {
  PARENT: 'parent',
  FATHER: 'father',
  MOTHER: 'mother',
  GUARDIAN: 'guardian',
  SIBLING: 'sibling',
  RELATIVE: 'relative',
  OTHER: 'other',
};

export const RELATIONSHIP_LABELS = {
  [RELATIONSHIP_TYPES.PARENT]: 'Parent',
  [RELATIONSHIP_TYPES.FATHER]: 'Father',
  [RELATIONSHIP_TYPES.MOTHER]: 'Mother',
  [RELATIONSHIP_TYPES.GUARDIAN]: 'Legal Guardian',
  [RELATIONSHIP_TYPES.SIBLING]: 'Sibling',
  [RELATIONSHIP_TYPES.RELATIVE]: 'Relative',
  [RELATIONSHIP_TYPES.OTHER]: 'Other',
};

// ============================================================
// NOTIFICATION CONSTANTS
// ============================================================

export const NOTIFICATION_TYPES = {
  APPROVAL_REQUEST: 'approval_request',
  APPROVAL_APPROVED: 'approval_approved',
  APPROVAL_REJECTED: 'approval_rejected',
  PAYMENT_REQUEST: 'payment_request',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_PARTIAL: 'payment_partial',
  PAYMENT_REMINDER: 'payment_reminder',
  SCHOOL_APPROVED: 'school_approved',
  SCHOOL_REJECTED: 'school_rejected',
  SYSTEM: 'system',
  ATTENDANCE_CHECKIN: 'attendance_checkin',
  ATTENDANCE_CHECKOUT: 'attendance_checkout',
  ATTENDANCE_LATE: 'attendance_late',
  ATTENDANCE_ABSENT: 'attendance_absent',
  ATTENDANCE_REMINDER: 'attendance_reminder',
};

// ============================================================
// DATE & TIME FORMATS
// ============================================================

export const DATE_FORMATS = {
  SHORT: 'short',
  LONG: 'long',
  TIME: 'time',
  DATETIME: 'datetime',
  ATTENDANCE_DATE: 'YYYY-MM-DD',
  ATTENDANCE_TIME: 'HH:mm:ss',
  ATTENDANCE_DATETIME: 'YYYY-MM-DD HH:mm:ss',
  DISPLAY_DATE: 'MMM DD, YYYY',
  DISPLAY_TIME: 'hh:mm A',
  DISPLAY_DATETIME: 'MMM DD, YYYY hh:mm A',
  API_DATE: 'YYYY-MM-DD',
  API_DATETIME: 'YYYY-MM-DDTHH:mm:ss',
};

// ============================================================
// ERROR MESSAGES
// ============================================================

export const API_ERRORS = {
  NETWORK_ERROR: 'Network error. Please check your connection.',
  UNAUTHORIZED: 'Your session has expired. Please login again.',
  FORBIDDEN: 'You do not have permission to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error. Please try again later.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  UNKNOWN_ERROR: 'An unknown error occurred. Please try again.',
  QR_CODE_INVALID: 'Invalid QR code. Please try again.',
  QR_CODE_EXPIRED: 'QR code has expired. Please generate a new one.',
  BIOMETRIC_FAILED: 'Biometric verification failed. Please try again.',
  ATTENDANCE_ALREADY_RECORDED: 'Attendance already recorded for today.',
  ATTENDANCE_WINDOW_CLOSED: 'Attendance window is closed.',
  OTC_INVALID: 'Invalid one-time code.',
  OTC_EXPIRED: 'One-time code has expired.',
  PAYMENT_AMOUNT_INVALID: 'Invalid payment amount.',
  PAYMENT_AMOUNT_TOO_LOW: 'Payment amount is below minimum required.',
  PAYMENT_AMOUNT_TOO_HIGH: 'Payment amount exceeds remaining balance.',
};

export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  INVALID_EMAIL: 'Please enter a valid email address',
  INVALID_PHONE: 'Please enter a valid phone number',
  INVALID_PASSWORD: 'Password must be at least 8 characters with uppercase, lowercase, and number',
  PASSWORD_MISMATCH: 'Passwords do not match',
  INVALID_DATE: 'Please enter a valid date',
  INVALID_AMOUNT: 'Please enter a valid amount',
  INVALID_QR_CODE: 'Invalid QR code format',
  INVALID_OTC: 'One-time code must be 6 digits',
  INVALID_TIME: 'Please enter a valid time',
  ATTENDANCE_IN_FUTURE: 'Attendance cannot be recorded for future dates',
  ATTENDANCE_TOO_OLD: 'Attendance cannot be recorded for dates older than 7 days',
  INVALID_UPI: 'UPI number must be at least 10 characters',
  INVALID_ADMISSION_NUMBER: 'Invalid admission number format',
  INVALID_BIRTH_CERTIFICATE: 'Invalid birth certificate number',
  INVALID_GRADE: 'Please select a valid grade',
  INVALID_STREAM: 'Please enter a valid stream/class',
  PAYMENT_AMOUNT_BELOW_MINIMUM: 'Amount must be at least',
  PAYMENT_AMOUNT_ABOVE_MAXIMUM: 'Amount cannot exceed',
  PAYMENT_AMOUNT_REQUIRED: 'Payment amount is required',
  MIN_AMOUNT: (amount) => `Amount must be at least KES ${amount.toLocaleString()}`,
  MAX_AMOUNT: (amount) => `Amount cannot exceed KES ${amount.toLocaleString()}`,
  PHONE_FORMAT: 'Phone number must be in format 254XXXXXXXXX or 07XXXXXXXX',
  MPESA_PHONE_FORMAT: 'M-Pesa requires phone number in format 254XXXXXXXXX',
};

// ============================================================
// APP CONFIGURATION
// ============================================================

export const APP_CONFIG = {
  API_TIMEOUT: 30000,
  DEBOUNCE_DELAY: 500,
  MAX_FILE_SIZE: 5 * 1024 * 1024,
  ITEMS_PER_PAGE: 20,
  MAX_GUARDIANS: 5,
  REQUEST_EXPIRY_HOURS: 24,
  MAX_ATTENDANCE_RECORDS_PER_PAGE: 50,
  ATTENDANCE_SYNC_INTERVAL: 300000,
  QR_CODE_SCAN_TIMEOUT: 30000,
  BIOMETRIC_TIMEOUT: 30000,
  OTC_REFRESH_INTERVAL: 300000,
  FACE_RECOGNITION_CONFIDENCE_THRESHOLD: 0.75,
  FINGERPRINT_MATCH_THRESHOLD: 0.85,
};

// ============================================================
// STORAGE KEYS
// ============================================================

export const STORAGE_KEYS = {
  TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  APP_SETTINGS: 'app_settings',
  LAST_ATTENDANCE_SYNC: 'last_attendance_sync',
  CACHED_ATTENDANCE: 'cached_attendance',
  BIOMETRIC_ENABLED: 'biometric_enabled',
  QR_CODE_DATA: 'qr_code_data',
  ATTENDANCE_PREFERENCES: 'attendance_preferences',
};

export const ASYNC_STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'onboarding_complete',
  LAST_SYNC: 'last_sync',
  CACHED_DATA: 'cached_data',
  ATTENDANCE_FILTERS: 'attendance_filters',
  ATTENDANCE_SORT_PREFERENCE: 'attendance_sort_preference',
  LAST_SCAN_METHOD: 'last_scan_method',
  OFFLINE_ATTENDANCE_QUEUE: 'offline_attendance_queue',
};

// ============================================================
// PERMISSIONS & DEVICE SETTINGS
// ============================================================

export const PERMISSION_TYPES = {
  CAMERA: 'camera',
  LOCATION: 'location',
  BIOMETRIC: 'biometric',
  NOTIFICATIONS: 'notifications',
};

export const CAMERA_SETTINGS = {
  QUALITY: 0.8,
  ASPECT_RATIO: [4, 3],
  FLASH_MODE: 'off',
  WHITE_BALANCE: 'auto',
  FOCUS_DEPTH: 0,
};

// ============================================================
// EXPORT & ANALYTICS
// ============================================================

export const EXPORT_LIMITS = {
  MAX_RECORDS_CSV: 10000,
  MAX_RECORDS_EXCEL: 50000,
  MAX_RECORDS_PDF: 1000,
};

export const ANALYTICS_PERIODS = {
  TODAY: 'today',
  YESTERDAY: 'yesterday',
  THIS_WEEK: 'this_week',
  LAST_WEEK: 'last_week',
  THIS_MONTH: 'this_month',
  LAST_MONTH: 'last_month',
  THIS_YEAR: 'this_year',
  CUSTOM: 'custom',
};

// ============================================================
// DEFAULT VALUES
// ============================================================

export const DEFAULTS = {
  ATTENDANCE_METHOD: ATTENDANCE_METHODS.QR_CODE,
  REPORT_TYPE: REPORT_TYPES.DAILY,
  REPORT_FORMAT: REPORT_FORMATS.PDF,
  ITEMS_PER_PAGE: 20,
  ANALYTICS_PERIOD: ANALYTICS_PERIODS.THIS_WEEK,
  ACADEMIC_YEAR: '2025',
  TERM: KENYA_ACADEMIC_TERMS.TERM_1,
  PAYMENT_FLEXIBILITY: PAYMENT_FLEXIBILITY.FLEXIBLE,
  MINIMUM_PAYMENT: 100,
  PAGE_SIZE: 20,
};

export const MAX_GUARDIANS_PER_STUDENT = APP_CONFIG.MAX_GUARDIANS;

// ============================================================
// DEBUG LOGGING (Development Only)
// ============================================================

if (__DEV__) {
  console.log('🚀 God\'s Eye EdTech - API Configuration');
  console.log('📡 API Base URL:', API_BASE_URL);
  console.log('🔧 Platform:', Platform.OS);
  console.log('💰 Payment System: ENABLED');
}