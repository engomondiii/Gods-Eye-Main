// User Roles
export const USER_ROLES = {
  SUPER_ADMIN: 'super_admin',
  TEACHER: 'teacher',
  GUARDIAN: 'guardian',
};

// Screen Names
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
  
  // Admin
  ADMIN_DASHBOARD: 'AdminDashboard',
  SCHOOLS_LIST: 'SchoolsList',
  SCHOOL_DETAIL: 'SchoolDetail',
  USERS_MANAGEMENT: 'UsersManagement',
  SYSTEM_STATISTICS: 'SystemStatistics',
  
  // Shared
  NOTIFICATIONS: 'Notifications',
  PROFILE: 'Profile',
  SETTINGS: 'Settings',
  
  // ✨ NEW - Attendance Screens
  ATTENDANCE_DASHBOARD: 'AttendanceDashboard',
  CHECK_IN: 'CheckIn',
  ATTENDANCE_HISTORY: 'AttendanceHistory',
  ATTENDANCE_REPORTS: 'AttendanceReports',
  STUDENT_QR_CODE: 'StudentQRCode',
  BIOMETRIC_SETUP: 'BiometricSetup',
  MANUAL_ATTENDANCE: 'ManualAttendance',
};

// Payment Status
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  REJECTED: 'rejected',
};

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  FINALIZED: 'finalized',
};

// ✨ NEW - Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
  UNKNOWN: 'unknown',
};

// ✨ NEW - Attendance Types
export const ATTENDANCE_TYPES = {
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
};

// ✨ NEW - Attendance Methods
export const ATTENDANCE_METHODS = {
  QR_CODE: 'qr_code',
  FINGERPRINT: 'fingerprint',
  FACE_RECOGNITION: 'face_recognition',
  ONE_TIME_CODE: 'one_time_code',
  MANUAL: 'manual',
};

// ✨ NEW - Attendance Method Labels
export const ATTENDANCE_METHOD_LABELS = {
  [ATTENDANCE_METHODS.QR_CODE]: 'QR Code',
  [ATTENDANCE_METHODS.FINGERPRINT]: 'Fingerprint',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: 'Face Recognition',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: 'One-Time Code',
  [ATTENDANCE_METHODS.MANUAL]: 'Manual Entry',
};

// ✨ NEW - Attendance Method Icons
export const ATTENDANCE_METHOD_ICONS = {
  [ATTENDANCE_METHODS.QR_CODE]: 'qrcode-scan',
  [ATTENDANCE_METHODS.FINGERPRINT]: 'fingerprint',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: 'face-recognition',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: 'numeric',
  [ATTENDANCE_METHODS.MANUAL]: 'pencil',
};

// ✨ NEW - Attendance Method Colors
export const ATTENDANCE_METHOD_COLORS = {
  [ATTENDANCE_METHODS.QR_CODE]: '#2196F3',
  [ATTENDANCE_METHODS.FINGERPRINT]: '#4CAF50',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: '#FF9800',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: '#9C27B0',
  [ATTENDANCE_METHODS.MANUAL]: '#757575',
};

// ✨ NEW - Biometric Types
export const BIOMETRIC_TYPES = {
  FINGERPRINT: 'fingerprint',
  FACE_RECOGNITION: 'face_recognition',
  IRIS: 'iris',
};

// ✨ NEW - QR Code Settings
export const QR_CODE_CONFIG = {
  SIZE: 256,
  ERROR_CORRECTION_LEVEL: 'H',
  EXPIRY_HOURS: 24,
  VERSION: 1,
  MARGIN: 4,
};

// ✨ NEW - One-Time Code Settings
export const OTC_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  ALLOWED_CHARACTERS: '0123456789',
  MAX_ATTEMPTS: 3,
};

// ✨ NEW - Attendance Report Types
export const REPORT_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
  STUDENT: 'student',
  CLASS: 'class',
};

// ✨ NEW - Attendance Report Formats
export const REPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
};

// ✨ NEW - Attendance Time Windows
export const ATTENDANCE_TIME_WINDOWS = {
  EARLY_CHECKIN_MINUTES: 30,
  LATE_CHECKIN_MINUTES: 15,
  EARLY_CHECKOUT_MINUTES: 30,
  DEFAULT_CHECKIN_TIME: '07:00',
  DEFAULT_CHECKOUT_TIME: '15:00',
};

// ✨ NEW - Biometric Error Codes
export const BIOMETRIC_ERROR_CODES = {
  NOT_AVAILABLE: 'BIOMETRIC_NOT_AVAILABLE',
  NOT_ENROLLED: 'BIOMETRIC_NOT_ENROLLED',
  AUTHENTICATION_FAILED: 'BIOMETRIC_AUTH_FAILED',
  CANCELLED: 'BIOMETRIC_CANCELLED',
  TIMEOUT: 'BIOMETRIC_TIMEOUT',
  LOCKOUT: 'BIOMETRIC_LOCKOUT',
  SYSTEM_ERROR: 'BIOMETRIC_SYSTEM_ERROR',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  APPROVAL_REQUEST: 'approval_request',
  APPROVAL_APPROVED: 'approval_approved',
  APPROVAL_REJECTED: 'approval_rejected',
  PAYMENT_REQUEST: 'payment_request',
  PAYMENT_RECEIVED: 'payment_received',
  SCHOOL_APPROVED: 'school_approved',
  SCHOOL_REJECTED: 'school_rejected',
  SYSTEM: 'system',
  ATTENDANCE_CHECKIN: 'attendance_checkin',
  ATTENDANCE_CHECKOUT: 'attendance_checkout',
  ATTENDANCE_LATE: 'attendance_late',
  ATTENDANCE_ABSENT: 'attendance_absent',
  ATTENDANCE_REMINDER: 'attendance_reminder',
};

// Date Formats
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
};

// API Error Messages
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
};

// Form Validation Messages
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
};

// App Configuration
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

// Storage Keys
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

// Async Storage Keys
export const ASYNC_STORAGE_KEYS = {
  ONBOARDING_COMPLETE: 'onboarding_complete',
  LAST_SYNC: 'last_sync',
  CACHED_DATA: 'cached_data',
  ATTENDANCE_FILTERS: 'attendance_filters',
  ATTENDANCE_SORT_PREFERENCE: 'attendance_sort_preference',
  LAST_SCAN_METHOD: 'last_scan_method',
  OFFLINE_ATTENDANCE_QUEUE: 'offline_attendance_queue',
};

// ✨ NEW - Permission Types
export const PERMISSION_TYPES = {
  CAMERA: 'camera',
  LOCATION: 'location',
  BIOMETRIC: 'biometric',
  NOTIFICATIONS: 'notifications',
};

// ✨ NEW - Camera Settings
export const CAMERA_SETTINGS = {
  QUALITY: 0.8,
  ASPECT_RATIO: [4, 3],
  FLASH_MODE: 'off',
  WHITE_BALANCE: 'auto',
  FOCUS_DEPTH: 0,
};

// ✨ NEW - Attendance Status Colors
export const ATTENDANCE_STATUS_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]: '#4CAF50',
  [ATTENDANCE_STATUS.ABSENT]: '#F44336',
  [ATTENDANCE_STATUS.LATE]: '#FF9800',
  [ATTENDANCE_STATUS.EXCUSED]: '#2196F3',
  [ATTENDANCE_STATUS.UNKNOWN]: '#757575',
};

// ✨ NEW - Attendance Status Labels
export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.EXCUSED]: 'Excused',
  [ATTENDANCE_STATUS.UNKNOWN]: 'Unknown',
};

// ✨ NEW - Attendance Status Icons
export const ATTENDANCE_STATUS_ICONS = {
  [ATTENDANCE_STATUS.PRESENT]: 'check-circle',
  [ATTENDANCE_STATUS.ABSENT]: 'close-circle',
  [ATTENDANCE_STATUS.LATE]: 'clock-alert',
  [ATTENDANCE_STATUS.EXCUSED]: 'information',
  [ATTENDANCE_STATUS.UNKNOWN]: 'help-circle',
};

// ✨ NEW - Export Limits
export const EXPORT_LIMITS = {
  MAX_RECORDS_CSV: 10000,
  MAX_RECORDS_EXCEL: 50000,
  MAX_RECORDS_PDF: 1000,
};

// ✨ NEW - Attendance Analytics Periods
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

// ✨ NEW - Default Values
export const DEFAULTS = {
  ATTENDANCE_METHOD: ATTENDANCE_METHODS.QR_CODE,
  REPORT_TYPE: REPORT_TYPES.DAILY,
  REPORT_FORMAT: REPORT_FORMATS.PDF,
  ITEMS_PER_PAGE: 20,
  ANALYTICS_PERIOD: ANALYTICS_PERIODS.THIS_WEEK,
};

// Export max guardians
export const MAX_GUARDIANS_PER_STUDENT = APP_CONFIG.MAX_GUARDIANS;