import { USER_ROLES, PAYMENT_STATUS, REQUEST_STATUS, KENYA_GRADES, KENYA_EDUCATION_LEVELS, KENYA_ACADEMIC_TERMS } from './constants';

// Mock Users
export const mockUsers = {
  superAdmin: {
    id: 1,
    username: 'admin',
    email: 'admin@godseye.com',
    first_name: 'Super',
    last_name: 'Admin',
    phone: '+254712345678',
    is_superadmin: true,
    is_teacher: false,
    is_guardian: false,
  },
  teacher: {
    id: 2,
    username: 'teacher1',
    email: 'teacher@school.com',
    first_name: 'John',
    middle_name: 'Kamau',
    last_name: 'Mwangi',
    phone: '+254723456789',
    is_superadmin: false,
    is_teacher: true,
    is_guardian: false,
    school: {
      id: 1,
      name: 'Nairobi Primary School',
      nemis_code: '001234567',
    },
  },
  guardian: {
    id: 3,
    username: 'guardian1',
    email: 'guardian@email.com',
    first_name: 'Jane',
    middle_name: 'Wanjiru',
    last_name: 'Ochieng',
    phone: '+254734567890',
    is_superadmin: false,
    is_teacher: false,
    is_guardian: true,
  },
};

// Mock Countries
export const mockCountries = [
  { id: 1, name: 'Kenya', code: 'KE' },
  { id: 2, name: 'Uganda', code: 'UG' },
  { id: 3, name: 'Tanzania', code: 'TZ' },
];

// Mock Counties (All 47 Kenyan Counties)
export const mockCounties = [
  { id: 1, name: 'Baringo', country_id: 1 },
  { id: 2, name: 'Bomet', country_id: 1 },
  { id: 3, name: 'Bungoma', country_id: 1 },
  { id: 4, name: 'Busia', country_id: 1 },
  { id: 5, name: 'Elgeyo-Marakwet', country_id: 1 },
  { id: 6, name: 'Embu', country_id: 1 },
  { id: 7, name: 'Garissa', country_id: 1 },
  { id: 8, name: 'Homa Bay', country_id: 1 },
  { id: 9, name: 'Isiolo', country_id: 1 },
  { id: 10, name: 'Kajiado', country_id: 1 },
  { id: 11, name: 'Kakamega', country_id: 1 },
  { id: 12, name: 'Kericho', country_id: 1 },
  { id: 13, name: 'Kiambu', country_id: 1 },
  { id: 14, name: 'Kilifi', country_id: 1 },
  { id: 15, name: 'Kirinyaga', country_id: 1 },
  { id: 16, name: 'Kisii', country_id: 1 },
  { id: 17, name: 'Kisumu', country_id: 1 },
  { id: 18, name: 'Kitui', country_id: 1 },
  { id: 19, name: 'Kwale', country_id: 1 },
  { id: 20, name: 'Laikipia', country_id: 1 },
  { id: 21, name: 'Lamu', country_id: 1 },
  { id: 22, name: 'Machakos', country_id: 1 },
  { id: 23, name: 'Makueni', country_id: 1 },
  { id: 24, name: 'Mandera', country_id: 1 },
  { id: 25, name: 'Marsabit', country_id: 1 },
  { id: 26, name: 'Meru', country_id: 1 },
  { id: 27, name: 'Migori', country_id: 1 },
  { id: 28, name: 'Mombasa', country_id: 1 },
  { id: 29, name: 'Murang\'a', country_id: 1 },
  { id: 30, name: 'Nairobi', country_id: 1 },
  { id: 31, name: 'Nakuru', country_id: 1 },
  { id: 32, name: 'Nandi', country_id: 1 },
  { id: 33, name: 'Narok', country_id: 1 },
  { id: 34, name: 'Nyamira', country_id: 1 },
  { id: 35, name: 'Nyandarua', country_id: 1 },
  { id: 36, name: 'Nyeri', country_id: 1 },
  { id: 37, name: 'Samburu', country_id: 1 },
  { id: 38, name: 'Siaya', country_id: 1 },
  { id: 39, name: 'Taita-Taveta', country_id: 1 },
  { id: 40, name: 'Tana River', country_id: 1 },
  { id: 41, name: 'Tharaka-Nithi', country_id: 1 },
  { id: 42, name: 'Trans Nzoia', country_id: 1 },
  { id: 43, name: 'Turkana', country_id: 1 },
  { id: 44, name: 'Uasin Gishu', country_id: 1 },
  { id: 45, name: 'Vihiga', country_id: 1 },
  { id: 46, name: 'Wajir', country_id: 1 },
  { id: 47, name: 'West Pokot', country_id: 1 },
];

// Mock Schools (Kenya)
export const mockSchools = [
  {
    id: 1,
    name: 'Nairobi Primary School',
    nemis_code: '001234567',
    country: mockCountries[0],
    county: mockCounties[29], // Nairobi - index 29 (id 30)
    address: '123 Education Road, Nairobi',
    school_type: 'public',
    school_category: 'county',
    gender_type: 'mixed',
    boarding_status: 'day',
    approved: true,
    created_at: '2024-01-15T10:00:00Z',
    approval_date: '2024-01-16T14:30:00Z',
    total_students: 450,
    total_teachers: 25,
  },
  {
    id: 2,
    name: 'Mombasa Secondary School',
    nemis_code: '002345678',
    country: mockCountries[0],
    county: mockCounties[27], // Mombasa - index 27 (id 28)
    address: '456 Learning Street, Mombasa',
    school_type: 'public',
    school_category: 'extra_county',
    gender_type: 'mixed',
    boarding_status: 'day_and_boarding',
    approved: true,
    created_at: '2024-02-10T14:30:00Z',
    approval_date: '2024-02-11T09:00:00Z',
    total_students: 620,
    total_teachers: 35,
  },
  {
    id: 3,
    name: 'Alliance High School',
    nemis_code: '003456789',
    country: mockCountries[0],
    county: mockCounties[12], // Kiambu - index 12 (id 13)
    address: 'Kikuyu, Kiambu County',
    school_type: 'public',
    school_category: 'national',
    gender_type: 'boys',
    boarding_status: 'boarding',
    approved: true,
    created_at: '2023-09-01T10:00:00Z',
    approval_date: '2023-09-02T14:30:00Z',
    total_students: 800,
    total_teachers: 55,
  },
];

// Mock Students (Kenya-specific)
export const mockStudents = [
  {
    id: 1,
    // Personal Information
    first_name: 'John',
    middle_name: 'Kamau',
    last_name: 'Mwangi',
    date_of_birth: '2010-05-15',
    gender: 'Male',
    birth_certificate_number: '123456789',
    
    // School Information
    school: mockSchools[0],
    admission_number: 'ADM/2020/001',
    
    // Academic Information (CBC)
    education_level: KENYA_EDUCATION_LEVELS.PRIMARY,
    current_grade: KENYA_GRADES.GRADE_5,
    stream: 'Red',
    upi_number: 'UPI1234567890',
    year_of_admission: 2020,
    current_term: KENYA_ACADEMIC_TERMS.TERM_1,
    
    // House System
    house_name: 'Kilimanjaro',
    house_color: '#F44336',
    
    // Special Needs
    has_special_needs: false,
    special_needs_description: null,
    
    // Guardians
    guardians: [
      {
        id: 1,
        first_name: 'Jane',
        middle_name: 'Wanjiru',
        last_name: 'Mwangi',
        phone: '+254712345678',
        email: 'jane.mwangi@email.com',
        relationship: 'Mother',
        is_primary: true,
      },
      {
        id: 2,
        first_name: 'Michael',
        middle_name: 'Kipchoge',
        last_name: 'Mwangi',
        phone: '+254723456789',
        email: 'michael.mwangi@email.com',
        relationship: 'Father',
        is_primary: false,
      },
    ],
    
    // Attendance & Biometric
    qr_code_generated: true,
    qr_code: 'GE-STU-001-2020',
    biometric_enrolled: {
      fingerprint: true,
      face_recognition: false,
    },
    attendance_percentage: 92,
    
    // Payment Summary
    pending_payments: 2,
    total_payments: 5,
  },
  {
    id: 2,
    // Personal Information
    first_name: 'Sarah',
    middle_name: 'Akinyi',
    last_name: 'Odhiambo',
    date_of_birth: '2011-08-22',
    gender: 'Female',
    birth_certificate_number: '234567890',
    
    // School Information
    school: mockSchools[0],
    admission_number: 'ADM/2020/002',
    
    // Academic Information (CBC)
    education_level: KENYA_EDUCATION_LEVELS.PRIMARY,
    current_grade: KENYA_GRADES.GRADE_5,
    stream: 'Blue',
    upi_number: 'UPI2345678901',
    year_of_admission: 2020,
    current_term: KENYA_ACADEMIC_TERMS.TERM_1,
    
    // House System
    house_name: 'Mara',
    house_color: '#2196F3',
    
    // Special Needs
    has_special_needs: false,
    special_needs_description: null,
    
    // Guardians
    guardians: [
      {
        id: 3,
        first_name: 'Emily',
        middle_name: 'Atieno',
        last_name: 'Odhiambo',
        phone: '+254734567890',
        email: 'emily.odhiambo@email.com',
        relationship: 'Mother',
        is_primary: true,
      },
    ],
    
    // Attendance & Biometric
    qr_code_generated: true,
    qr_code: 'GE-STU-002-2020',
    biometric_enrolled: {
      fingerprint: false,
      face_recognition: true,
    },
    attendance_percentage: 88,
    
    // Payment Summary
    pending_payments: 1,
    total_payments: 3,
  },
  {
    id: 3,
    // Personal Information
    first_name: 'David',
    middle_name: 'Kipchoge',
    last_name: 'Kibet',
    date_of_birth: '2012-03-10',
    gender: 'Male',
    birth_certificate_number: '345678901',
    
    // School Information
    school: mockSchools[0],
    admission_number: 'ADM/2021/003',
    
    // Academic Information (CBC)
    education_level: KENYA_EDUCATION_LEVELS.PRIMARY,
    current_grade: KENYA_GRADES.GRADE_4,
    stream: 'Red',
    upi_number: 'UPI3456789012',
    year_of_admission: 2021,
    current_term: KENYA_ACADEMIC_TERMS.TERM_1,
    
    // House System
    house_name: 'Kilimanjaro',
    house_color: '#F44336',
    
    // Special Needs
    has_special_needs: false,
    special_needs_description: null,
    
    // Guardians
    guardians: [
      {
        id: 4,
        first_name: 'Robert',
        middle_name: 'Cheruiyot',
        last_name: 'Kibet',
        phone: '+254745678901',
        email: 'robert.kibet@email.com',
        relationship: 'Father',
        is_primary: true,
      },
      {
        id: 5,
        first_name: 'Linda',
        middle_name: 'Jebet',
        last_name: 'Kibet',
        phone: '+254756789012',
        email: 'linda.kibet@email.com',
        relationship: 'Mother',
        is_primary: false,
      },
    ],
    
    // Attendance & Biometric
    qr_code_generated: true,
    qr_code: 'GE-STU-003-2021',
    biometric_enrolled: {
      fingerprint: true,
      face_recognition: true,
    },
    attendance_percentage: 95,
    
    // Payment Summary
    pending_payments: 0,
    total_payments: 4,
  },
  {
    id: 4,
    // Personal Information
    first_name: 'Grace',
    middle_name: 'Wanjiru',
    last_name: 'Njoroge',
    date_of_birth: '2009-11-18',
    gender: 'Female',
    birth_certificate_number: '456789012',
    
    // School Information
    school: mockSchools[1],
    admission_number: 'ADM/2019/004',
    
    // Academic Information (CBC)
    education_level: KENYA_EDUCATION_LEVELS.JUNIOR_SECONDARY,
    current_grade: KENYA_GRADES.GRADE_7,
    stream: 'East',
    upi_number: 'UPI4567890123',
    year_of_admission: 2019,
    current_term: KENYA_ACADEMIC_TERMS.TERM_1,
    
    // House System
    house_name: 'Tsavo',
    house_color: '#4CAF50',
    
    // Special Needs
    has_special_needs: false,
    special_needs_description: null,
    
    // Guardians
    guardians: [],
    
    // Attendance & Biometric
    qr_code_generated: false,
    qr_code: null,
    biometric_enrolled: {
      fingerprint: false,
      face_recognition: false,
    },
    attendance_percentage: 90,
    
    // Payment Summary
    pending_payments: 3,
    total_payments: 7,
  },
  {
    id: 5,
    // Personal Information
    first_name: 'James',
    middle_name: 'Otieno',
    last_name: 'Ouma',
    date_of_birth: '2010-07-25',
    gender: 'Male',
    birth_certificate_number: '567890123',
    
    // School Information
    school: mockSchools[0],
    admission_number: 'ADM/2019/005',
    
    // Academic Information (CBC)
    education_level: KENYA_EDUCATION_LEVELS.PRIMARY,
    current_grade: KENYA_GRADES.GRADE_6,
    stream: 'Blue',
    upi_number: 'UPI5678901234',
    year_of_admission: 2019,
    current_term: KENYA_ACADEMIC_TERMS.TERM_1,
    
    // House System
    house_name: 'Mara',
    house_color: '#2196F3',
    
    // Special Needs
    has_special_needs: true,
    special_needs_description: 'Requires reading glasses for visual impairment',
    
    // Guardians
    guardians: [
      {
        id: 6,
        first_name: 'Mary',
        middle_name: 'Achieng',
        last_name: 'Ouma',
        phone: '+254767890123',
        email: 'mary.ouma@email.com',
        relationship: 'Mother',
        is_primary: true,
      },
    ],
    
    // Attendance & Biometric
    qr_code_generated: true,
    qr_code: 'GE-STU-005-2019',
    biometric_enrolled: {
      fingerprint: true,
      face_recognition: false,
    },
    attendance_percentage: 85,
    
    // Payment Summary
    pending_payments: 1,
    total_payments: 6,
  },
  {
    id: 6,
    // Personal Information
    first_name: 'Faith',
    middle_name: 'Nyambura',
    last_name: 'Kariuki',
    date_of_birth: '2013-01-30',
    gender: 'Female',
    birth_certificate_number: '678901234',
    
    // School Information
    school: mockSchools[0],
    admission_number: 'ADM/2022/006',
    
    // Academic Information (CBC)
    education_level: KENYA_EDUCATION_LEVELS.PRIMARY,
    current_grade: KENYA_GRADES.GRADE_3,
    stream: 'Green',
    upi_number: 'UPI6789012345',
    year_of_admission: 2022,
    current_term: KENYA_ACADEMIC_TERMS.TERM_1,
    
    // House System
    house_name: 'Amboseli',
    house_color: '#FF9800',
    
    // Special Needs
    has_special_needs: false,
    special_needs_description: null,
    
    // Guardians
    guardians: [
      {
        id: 7,
        first_name: 'Peter',
        middle_name: 'Maina',
        last_name: 'Kariuki',
        phone: '+254778901234',
        email: 'peter.kariuki@email.com',
        relationship: 'Father',
        is_primary: true,
      },
    ],
    
    // Attendance & Biometric
    qr_code_generated: true,
    qr_code: 'GE-STU-006-2022',
    biometric_enrolled: {
      fingerprint: false,
      face_recognition: false,
    },
    attendance_percentage: 97,
    
    // Payment Summary
    pending_payments: 0,
    total_payments: 2,
  },
  {
    id: 7,
    // Personal Information
    first_name: 'Brian',
    middle_name: 'Omondi',
    last_name: 'Onyango',
    date_of_birth: '2008-09-14',
    gender: 'Male',
    birth_certificate_number: '789012345',
    
    // School Information
    school: mockSchools[2],
    admission_number: 'ADM/2023/007',
    
    // Academic Information (8-4-4 Transition)
    education_level: KENYA_EDUCATION_LEVELS.SENIOR_SECONDARY,
    current_grade: KENYA_GRADES.FORM_3,
    stream: 'North',
    upi_number: 'UPI7890123456',
    year_of_admission: 2021,
    current_term: KENYA_ACADEMIC_TERMS.TERM_1,
    
    // House System
    house_name: 'Kenyatta',
    house_color: '#9C27B0',
    
    // Special Needs
    has_special_needs: false,
    special_needs_description: null,
    
    // Guardians
    guardians: [
      {
        id: 8,
        first_name: 'Susan',
        middle_name: 'Adhiambo',
        last_name: 'Onyango',
        phone: '+254789012345',
        email: 'susan.onyango@email.com',
        relationship: 'Mother',
        is_primary: true,
      },
    ],
    
    // Attendance & Biometric
    qr_code_generated: true,
    qr_code: 'GE-STU-007-2023',
    biometric_enrolled: {
      fingerprint: true,
      face_recognition: true,
    },
    attendance_percentage: 89,
    
    // Payment Summary
    pending_payments: 2,
    total_payments: 8,
  },
];

// Mock Guardian Link Requests
export const mockGuardianLinkRequests = [
  {
    id: 1,
    student: mockStudents[0],
    new_guardian: {
      id: 9,
      first_name: 'Uncle',
      middle_name: 'Mwenda',
      last_name: 'Mwangi',
      phone: '+254790123456',
      relationship: 'Uncle',
    },
    created_at: '2025-11-05T10:00:00Z',
    expires_at: '2025-11-06T10:00:00Z',
    approved_by: [],
    rejected: false,
    finalized: false,
    teacher_approved: false,
    total_guardians: 2,
    teacher: {
      first_name: 'John',
      middle_name: 'Kamau',
      last_name: 'Mwangi',
    },
    status: REQUEST_STATUS.PENDING,
  },
];

// Mock Payment Requests
export const mockPaymentRequests = [
  {
    id: 1,
    student: mockStudents[0],
    amount: 5000.00,
    purpose: 'School fees for Term 1, 2025',
    created_at: '2025-10-25T10:00:00Z',
    due_date: '2025-11-15',
    status: PAYMENT_STATUS.PENDING,
    requested_by: {
      first_name: 'John',
      middle_name: 'Kamau',
      last_name: 'Mwangi',
    },
  },
  {
    id: 2,
    student: mockStudents[1],
    amount: 3500.00,
    purpose: 'Exam fees for November 2025',
    created_at: '2025-10-24T14:30:00Z',
    due_date: '2025-11-10',
    status: PAYMENT_STATUS.APPROVED,
    requested_by: {
      first_name: 'John',
      middle_name: 'Kamau',
      last_name: 'Mwangi',
    },
  },
  {
    id: 3,
    student: mockStudents[0],
    amount: 2000.00,
    purpose: 'Field trip to Nairobi National Museum',
    created_at: '2025-10-20T09:00:00Z',
    due_date: '2025-11-05',
    paid_date: '2025-10-22T15:30:00Z',
    status: PAYMENT_STATUS.PAID,
    mpesa_ref: 'RKJ123XYZ789',
    requested_by: {
      first_name: 'John',
      middle_name: 'Kamau',
      last_name: 'Mwangi',
    },
  },
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 1,
    type: 'approval_request',
    title: 'New Guardian Link Request',
    message: 'A new guardian link request has been created for John Kamau Mwangi',
    created_at: '2025-11-06T10:00:00Z',
    read: false,
    priority: 'high',
  },
  {
    id: 2,
    type: 'payment_request',
    title: 'Payment Request',
    message: 'New payment request for KES 5,000 - School fees',
    created_at: '2025-11-05T14:30:00Z',
    read: false,
    priority: 'medium',
  },
  {
    id: 3,
    type: 'approval_approved',
    title: 'Request Approved',
    message: 'Your guardian link request has been approved',
    created_at: '2025-11-04T09:15:00Z',
    read: true,
    priority: 'low',
  },
  {
    id: 4,
    type: 'attendance_late',
    title: 'Late Arrival',
    message: 'John Kamau Mwangi checked in late today',
    created_at: '2025-11-06T08:30:00Z',
    read: false,
    priority: 'medium',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats = {
  teacher: {
    totalStudents: 45,
    pendingApprovals: 3,
    pendingPayments: 8,
    todayAttendance: {
      present: 38,
      absent: 5,
      late: 2,
      percentage: 84,
    },
    recentActivities: [
      {
        id: 1,
        type: 'student_added',
        message: 'New student registered: John Kamau Mwangi',
        time: '2 hours ago',
      },
      {
        id: 2,
        type: 'approval_pending',
        message: 'Guardian link request needs your approval',
        time: '1 day ago',
      },
      {
        id: 3,
        type: 'attendance_checkin',
        message: 'Sarah Akinyi Odhiambo checked in',
        time: '3 hours ago',
      },
    ],
  },
  guardian: {
    totalStudents: 2,
    pendingApprovals: 1,
    pendingPayments: 3,
    studentsAttendance: [
      {
        studentId: 1,
        studentName: 'John Kamau Mwangi',
        todayStatus: 'present',
        weekPercentage: 100,
      },
      {
        studentId: 2,
        studentName: 'Sarah Akinyi Odhiambo',
        todayStatus: 'late',
        weekPercentage: 80,
      },
    ],
    recentActivities: mockNotifications.slice(0, 3),
  },
  superAdmin: {
    totalSchools: 125,
    pendingSchools: 8,
    totalTeachers: 456,
    totalGuardians: 1234,
    totalStudents: 2567,
    recentActivities: [
      {
        id: 1,
        type: 'school_pending',
        message: 'New school registration: Mombasa Secondary School',
        time: '1 hour ago',
      },
      {
        id: 2,
        type: 'school_approved',
        message: 'School approved: Kisumu Primary School',
        time: '3 hours ago',
      },
    ],
  },
};

// Mock Attendance Records
export const mockAttendanceRecords = [
  {
    id: 1,
    student_id: 1,
    student: mockStudents[0],
    date: '2025-11-06',
    check_in_time: '07:45:00',
    check_out_time: '15:30:00',
    status: 'present',
    method: 'qr_code',
    notes: null,
  },
  {
    id: 2,
    student_id: 2,
    student: mockStudents[1],
    date: '2025-11-06',
    check_in_time: '08:15:00',
    check_out_time: null,
    status: 'late',
    method: 'fingerprint',
    notes: 'Arrived 15 minutes late',
  },
  {
    id: 3,
    student_id: 3,
    student: mockStudents[2],
    date: '2025-11-06',
    check_in_time: '07:30:00',
    check_out_time: '15:25:00',
    status: 'present',
    method: 'face_recognition',
    notes: null,
  },
];

// Export all mock data
export default {
  mockUsers,
  mockCountries,
  mockCounties,
  mockSchools,
  mockStudents,
  mockGuardianLinkRequests,
  mockPaymentRequests,
  mockNotifications,
  mockDashboardStats,
  mockAttendanceRecords,
};