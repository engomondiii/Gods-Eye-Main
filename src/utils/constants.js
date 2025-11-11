// User Roles - UPDATED with SCHOOL_ADMIN
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

// Screen Names - UPDATED with School Admin screens
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

// Payment Status - 🆕 UPDATED with partial payment statuses
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  PAID: 'paid',
  PARTIALLY_PAID: 'partially_paid',  // 🆕 NEW
  REJECTED: 'rejected',
  OVERDUE: 'overdue',  // 🆕 NEW
};

// 🆕 NEW - Payment Status Labels
export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: 'Pending',
  [PAYMENT_STATUS.APPROVED]: 'Approved',
  [PAYMENT_STATUS.PAID]: 'Paid',
  [PAYMENT_STATUS.PARTIALLY_PAID]: 'Partially Paid',
  [PAYMENT_STATUS.REJECTED]: 'Rejected',
  [PAYMENT_STATUS.OVERDUE]: 'Overdue',
};

// 🆕 NEW - Payment Status Colors
export const PAYMENT_STATUS_COLORS = {
  [PAYMENT_STATUS.PENDING]: '#FF9800',
  [PAYMENT_STATUS.APPROVED]: '#2196F3',
  [PAYMENT_STATUS.PAID]: '#4CAF50',
  [PAYMENT_STATUS.PARTIALLY_PAID]: '#9C27B0',
  [PAYMENT_STATUS.REJECTED]: '#F44336',
  [PAYMENT_STATUS.OVERDUE]: '#D32F2F',
};

// 🆕 NEW - Payment Status Icons
export const PAYMENT_STATUS_ICONS = {
  [PAYMENT_STATUS.PENDING]: 'clock-outline',
  [PAYMENT_STATUS.APPROVED]: 'check-circle-outline',
  [PAYMENT_STATUS.PAID]: 'check-circle',
  [PAYMENT_STATUS.PARTIALLY_PAID]: 'progress-check',
  [PAYMENT_STATUS.REJECTED]: 'close-circle',
  [PAYMENT_STATUS.OVERDUE]: 'alert-circle',
};

// 🆕 NEW - Payment Flexibility Types
export const PAYMENT_FLEXIBILITY = {
  FULL_ONLY: 'full_only',              // Must pay full amount
  PARTIAL_ALLOWED: 'partial_allowed',  // Can pay any amount >= minimum
  INSTALLMENTS: 'installments',        // Fixed installment plan
};

// 🆕 NEW - Payment Flexibility Labels
export const PAYMENT_FLEXIBILITY_LABELS = {
  [PAYMENT_FLEXIBILITY.FULL_ONLY]: 'Full Payment Only',
  [PAYMENT_FLEXIBILITY.PARTIAL_ALLOWED]: 'Partial Payments Allowed',
  [PAYMENT_FLEXIBILITY.INSTALLMENTS]: 'Installment Plan',
};

// 🆕 NEW - Payment Configuration
export const PAYMENT_CONFIG = {
  MIN_PAYMENT_AMOUNT: 100,              // Minimum KES 100
  MAX_INSTALLMENTS: 12,                 // Maximum 12 installments
  DEFAULT_MINIMUM_PERCENTAGE: 20,       // 20% minimum payment
  ALLOW_OVERPAYMENT: false,            // Don't allow paying more than owed
  CURRENCY: 'KES',
  CURRENCY_SYMBOL: 'KES',
};

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  EXPIRED: 'expired',
  FINALIZED: 'finalized',
};

// Attendance Status
export const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LATE: 'late',
  EXCUSED: 'excused',
  UNKNOWN: 'unknown',
};

// Attendance Types
export const ATTENDANCE_TYPES = {
  CHECK_IN: 'check_in',
  CHECK_OUT: 'check_out',
};

// Attendance Methods
export const ATTENDANCE_METHODS = {
  QR_CODE: 'qr_code',
  FINGERPRINT: 'fingerprint',
  FACE_RECOGNITION: 'face_recognition',
  ONE_TIME_CODE: 'one_time_code',
  MANUAL: 'manual',
};

// Attendance Method Labels
export const ATTENDANCE_METHOD_LABELS = {
  [ATTENDANCE_METHODS.QR_CODE]: 'QR Code',
  [ATTENDANCE_METHODS.FINGERPRINT]: 'Fingerprint',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: 'Face Recognition',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: 'One-Time Code',
  [ATTENDANCE_METHODS.MANUAL]: 'Manual Entry',
};

// Attendance Method Icons
export const ATTENDANCE_METHOD_ICONS = {
  [ATTENDANCE_METHODS.QR_CODE]: 'qrcode-scan',
  [ATTENDANCE_METHODS.FINGERPRINT]: 'fingerprint',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: 'face-recognition',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: 'numeric',
  [ATTENDANCE_METHODS.MANUAL]: 'pencil',
};

// Attendance Method Colors
export const ATTENDANCE_METHOD_COLORS = {
  [ATTENDANCE_METHODS.QR_CODE]: '#2196F3',
  [ATTENDANCE_METHODS.FINGERPRINT]: '#4CAF50',
  [ATTENDANCE_METHODS.FACE_RECOGNITION]: '#FF9800',
  [ATTENDANCE_METHODS.ONE_TIME_CODE]: '#9C27B0',
  [ATTENDANCE_METHODS.MANUAL]: '#757575',
};

// Biometric Types
export const BIOMETRIC_TYPES = {
  FINGERPRINT: 'fingerprint',
  FACE_RECOGNITION: 'face_recognition',
  IRIS: 'iris',
};

// QR Code Settings
export const QR_CODE_CONFIG = {
  SIZE: 256,
  ERROR_CORRECTION_LEVEL: 'H',
  EXPIRY_HOURS: 24,
  VERSION: 1,
  MARGIN: 4,
};

// One-Time Code Settings
export const OTC_CONFIG = {
  LENGTH: 6,
  EXPIRY_MINUTES: 5,
  ALLOWED_CHARACTERS: '0123456789',
  MAX_ATTEMPTS: 3,
};

// Attendance Report Types
export const REPORT_TYPES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
  STUDENT: 'student',
  CLASS: 'class',
};

// Attendance Report Formats
export const REPORT_FORMATS = {
  PDF: 'pdf',
  EXCEL: 'excel',
  CSV: 'csv',
};

// Attendance Time Windows
export const ATTENDANCE_TIME_WINDOWS = {
  EARLY_CHECKIN_MINUTES: 30,
  LATE_CHECKIN_MINUTES: 15,
  EARLY_CHECKOUT_MINUTES: 30,
  DEFAULT_CHECKIN_TIME: '07:00',
  DEFAULT_CHECKOUT_TIME: '15:00',
};

// Biometric Error Codes
export const BIOMETRIC_ERROR_CODES = {
  NOT_AVAILABLE: 'BIOMETRIC_NOT_AVAILABLE',
  NOT_ENROLLED: 'BIOMETRIC_NOT_ENROLLED',
  AUTHENTICATION_FAILED: 'BIOMETRIC_AUTH_FAILED',
  CANCELLED: 'BIOMETRIC_CANCELLED',
  TIMEOUT: 'BIOMETRIC_TIMEOUT',
  LOCKOUT: 'BIOMETRIC_LOCKOUT',
  SYSTEM_ERROR: 'BIOMETRIC_SYSTEM_ERROR',
};

// 🇰🇪 KENYA EDUCATION SYSTEM CONSTANTS

// Kenya's 47 Counties (Alphabetically Ordered)
export const KENYA_COUNTIES = [
  'Baringo',
  'Bomet',
  'Bungoma',
  'Busia',
  'Elgeyo-Marakwet',
  'Embu',
  'Garissa',
  'Homa Bay',
  'Isiolo',
  'Kajiado',
  'Kakamega',
  'Kericho',
  'Kiambu',
  'Kilifi',
  'Kirinyaga',
  'Kisii',
  'Kisumu',
  'Kitui',
  'Kwale',
  'Laikipia',
  'Lamu',
  'Machakos',
  'Makueni',
  'Mandera',
  'Marsabit',
  'Meru',
  'Migori',
  'Mombasa',
  'Murang\'a',
  'Nairobi',
  'Nakuru',
  'Nandi',
  'Narok',
  'Nyamira',
  'Nyandarua',
  'Nyeri',
  'Samburu',
  'Siaya',
  'Taita-Taveta',
  'Tana River',
  'Tharaka-Nithi',
  'Trans Nzoia',
  'Turkana',
  'Uasin Gishu',
  'Vihiga',
  'Wajir',
  'West Pokot',
];

// Kenya Education Levels (CBC System)
export const KENYA_EDUCATION_LEVELS = {
  PRE_PRIMARY: 'pre_primary',
  PRIMARY: 'primary',
  JUNIOR_SECONDARY: 'junior_secondary',
  SENIOR_SECONDARY: 'senior_secondary',
};

// Kenya Education Level Labels
export const KENYA_EDUCATION_LEVEL_LABELS = {
  [KENYA_EDUCATION_LEVELS.PRE_PRIMARY]: 'Pre-Primary (EYE)',
  [KENYA_EDUCATION_LEVELS.PRIMARY]: 'Primary',
  [KENYA_EDUCATION_LEVELS.JUNIOR_SECONDARY]: 'Junior Secondary',
  [KENYA_EDUCATION_LEVELS.SENIOR_SECONDARY]: 'Senior Secondary',
};

// Kenya Grades (CBC System)
export const KENYA_GRADES = {
  // Pre-Primary (Ages 4-6)
  PP1: 'pp1',
  PP2: 'pp2',
  
  // Lower Primary (Ages 6-9)
  GRADE_1: 'grade_1',
  GRADE_2: 'grade_2',
  GRADE_3: 'grade_3',
  
  // Upper Primary (Ages 9-12)
  GRADE_4: 'grade_4',
  GRADE_5: 'grade_5',
  GRADE_6: 'grade_6',
  
  // Junior Secondary (Ages 12-15)
  GRADE_7: 'grade_7',
  GRADE_8: 'grade_8',
  GRADE_9: 'grade_9',
  
  // Senior Secondary (Ages 15-18)
  GRADE_10: 'grade_10',
  GRADE_11: 'grade_11',
  GRADE_12: 'grade_12',
  
  // 8-4-4 System (Transition)
  FORM_1: 'form_1',
  FORM_2: 'form_2',
  FORM_3: 'form_3',
  FORM_4: 'form_4',
};

// Kenya Grade Labels
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

// Kenya Grades by Education Level
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

// Kenya Academic Terms
export const KENYA_ACADEMIC_TERMS = {
  TERM_1: 'term_1',
  TERM_2: 'term_2',
  TERM_3: 'term_3',
};

// Kenya Academic Term Labels
export const KENYA_ACADEMIC_TERM_LABELS = {
  [KENYA_ACADEMIC_TERMS.TERM_1]: 'Term 1 (Jan - Apr)',
  [KENYA_ACADEMIC_TERMS.TERM_2]: 'Term 2 (May - Aug)',
  [KENYA_ACADEMIC_TERMS.TERM_3]: 'Term 3 (Sep - Nov)',
};

// Kenya Stream/Class Naming Conventions
export const KENYA_STREAM_TYPES = {
  COLORS: 'colors',
  DIRECTIONS: 'directions',
  LETTERS: 'letters',
  ANIMALS: 'animals',
  PLACES: 'places',
  CUSTOM: 'custom',
};

// Kenya Common Streams
export const KENYA_COMMON_STREAMS = {
  // Colors
  colors: ['Red', 'Blue', 'Green', 'Yellow', 'Orange', 'Purple', 'White', 'Black'],
  
  // Directions
  directions: ['East', 'West', 'North', 'South', 'Northeast', 'Northwest', 'Southeast', 'Southwest'],
  
  // Letters
  letters: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'],
  
  // Animals (African Wildlife)
  animals: ['Lion', 'Leopard', 'Cheetah', 'Buffalo', 'Elephant', 'Rhino', 'Giraffe', 'Zebra'],
  
  // Famous Kenyan Places
  places: ['Kilimanjaro', 'Kenya', 'Mara', 'Tsavo', 'Amboseli', 'Nakuru', 'Nairobi', 'Mombasa'],
};

// Kenya House System
export const KENYA_COMMON_HOUSES = {
  // Mountains
  mountains: ['Kilimanjaro', 'Kenya', 'Elgon', 'Longonot', 'Aberdare', 'Meru'],
  
  // Wildlife Parks
  wildlifeParks: ['Mara', 'Tsavo', 'Amboseli', 'Nakuru', 'Samburu', 'Nairobi'],
  
  // Historical Figures
  historicalFigures: ['Kenyatta', 'Odinga', 'Wangari', 'Kimathi', 'Muindi', 'Waiyaki'],
  
  // Colors
  colors: ['Red', 'Blue', 'Green', 'Yellow'],
};

// Kenya House Colors (Array format for color picker component)
export const KENYA_HOUSE_COLORS = [
  { name: 'Red', hex: '#F44336' },
  { name: 'Blue', hex: '#2196F3' },
  { name: 'Green', hex: '#4CAF50' },
  { name: 'Yellow', hex: '#FFEB3B' },
  { name: 'Orange', hex: '#FF9800' },
  { name: 'Purple', hex: '#9C27B0' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Black', hex: '#000000' },
];

// Kenya School Types
export const KENYA_SCHOOL_TYPES = {
  PUBLIC: 'public',
  PRIVATE: 'private',
  INTERNATIONAL: 'international',
};

// Kenya School Categories (Performance-based)
export const KENYA_SCHOOL_CATEGORIES = {
  NATIONAL: 'national',
  EXTRA_COUNTY: 'extra_county',
  COUNTY: 'county',
  SUB_COUNTY: 'sub_county',
};

// Kenya School Gender Types
export const KENYA_SCHOOL_GENDER = {
  BOYS: 'boys',
  GIRLS: 'girls',
  MIXED: 'mixed',
};

// Kenya School Boarding Status
export const KENYA_SCHOOL_BOARDING = {
  DAY: 'day',
  BOARDING: 'boarding',
  DAY_AND_BOARDING: 'day_and_boarding',
};

// Notification Types
export const NOTIFICATION_TYPES = {
  APPROVAL_REQUEST: 'approval_request',
  APPROVAL_APPROVED: 'approval_approved',
  APPROVAL_REJECTED: 'approval_rejected',
  PAYMENT_REQUEST: 'payment_request',
  PAYMENT_RECEIVED: 'payment_received',
  PAYMENT_PARTIAL: 'payment_partial',  // 🆕 NEW
  PAYMENT_REMINDER: 'payment_reminder',  // 🆕 NEW
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
  PAYMENT_AMOUNT_INVALID: 'Invalid payment amount.',  // 🆕 NEW
  PAYMENT_AMOUNT_TOO_LOW: 'Payment amount is below minimum required.',  // 🆕 NEW
  PAYMENT_AMOUNT_TOO_HIGH: 'Payment amount exceeds remaining balance.',  // 🆕 NEW
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
  INVALID_UPI: 'UPI number must be at least 10 characters',
  INVALID_ADMISSION_NUMBER: 'Invalid admission number format',
  INVALID_BIRTH_CERTIFICATE: 'Invalid birth certificate number',
  INVALID_GRADE: 'Please select a valid grade',
  INVALID_STREAM: 'Please enter a valid stream/class',
  PAYMENT_AMOUNT_BELOW_MINIMUM: 'Amount must be at least',  // 🆕 NEW
  PAYMENT_AMOUNT_ABOVE_MAXIMUM: 'Amount cannot exceed',  // 🆕 NEW
  PAYMENT_AMOUNT_REQUIRED: 'Payment amount is required',  // 🆕 NEW
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

// Permission Types
export const PERMISSION_TYPES = {
  CAMERA: 'camera',
  LOCATION: 'location',
  BIOMETRIC: 'biometric',
  NOTIFICATIONS: 'notifications',
};

// Camera Settings
export const CAMERA_SETTINGS = {
  QUALITY: 0.8,
  ASPECT_RATIO: [4, 3],
  FLASH_MODE: 'off',
  WHITE_BALANCE: 'auto',
  FOCUS_DEPTH: 0,
};

// Attendance Status Colors
export const ATTENDANCE_STATUS_COLORS = {
  [ATTENDANCE_STATUS.PRESENT]: '#4CAF50',
  [ATTENDANCE_STATUS.ABSENT]: '#F44336',
  [ATTENDANCE_STATUS.LATE]: '#FF9800',
  [ATTENDANCE_STATUS.EXCUSED]: '#2196F3',
  [ATTENDANCE_STATUS.UNKNOWN]: '#757575',
};

// Attendance Status Labels
export const ATTENDANCE_STATUS_LABELS = {
  [ATTENDANCE_STATUS.PRESENT]: 'Present',
  [ATTENDANCE_STATUS.ABSENT]: 'Absent',
  [ATTENDANCE_STATUS.LATE]: 'Late',
  [ATTENDANCE_STATUS.EXCUSED]: 'Excused',
  [ATTENDANCE_STATUS.UNKNOWN]: 'Unknown',
};

// Attendance Status Icons
export const ATTENDANCE_STATUS_ICONS = {
  [ATTENDANCE_STATUS.PRESENT]: 'check-circle',
  [ATTENDANCE_STATUS.ABSENT]: 'close-circle',
  [ATTENDANCE_STATUS.LATE]: 'clock-alert',
  [ATTENDANCE_STATUS.EXCUSED]: 'information',
  [ATTENDANCE_STATUS.UNKNOWN]: 'help-circle',
};

// Export Limits
export const EXPORT_LIMITS = {
  MAX_RECORDS_CSV: 10000,
  MAX_RECORDS_EXCEL: 50000,
  MAX_RECORDS_PDF: 1000,
};

// Attendance Analytics Periods
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

// Default Values
export const DEFAULTS = {
  ATTENDANCE_METHOD: ATTENDANCE_METHODS.QR_CODE,
  REPORT_TYPE: REPORT_TYPES.DAILY,
  REPORT_FORMAT: REPORT_FORMATS.PDF,
  ITEMS_PER_PAGE: 20,
  ANALYTICS_PERIOD: ANALYTICS_PERIODS.THIS_WEEK,
};

// Export max guardians
export const MAX_GUARDIANS_PER_STUDENT = APP_CONFIG.MAX_GUARDIANS;