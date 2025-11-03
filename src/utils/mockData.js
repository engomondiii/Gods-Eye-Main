import { USER_ROLES, PAYMENT_STATUS, REQUEST_STATUS } from './constants';

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
    last_name: 'Kamau',
    phone: '+254723456789',
    is_superadmin: false,
    is_teacher: true,
    is_guardian: false,
    school: {
      id: 1,
      name: 'Nairobi Primary School',
    },
  },
  guardian: {
    id: 3,
    username: 'guardian1',
    email: 'guardian@email.com',
    first_name: 'Jane',
    last_name: 'Doe',
    phone: '+254734567890',
    is_superadmin: false,
    is_teacher: false,
    is_guardian: true,
  },
};

// Mock Countries
export const mockCountries = [
  { id: 1, name: 'Kenya' },
  { id: 2, name: 'Uganda' },
  { id: 3, name: 'Tanzania' },
];

// Mock Counties
export const mockCounties = [
  { id: 1, name: 'Nairobi', country_id: 1 },
  { id: 2, name: 'Mombasa', country_id: 1 },
  { id: 3, name: 'Kisumu', country_id: 1 },
  { id: 4, name: 'Nakuru', country_id: 1 },
  { id: 5, name: 'Kiambu', country_id: 1 },
];

// Mock Schools
export const mockSchools = [
  {
    id: 1,
    name: 'Nairobi Primary School',
    country: mockCountries[0],
    county: mockCounties[0],
    address: '123 Education Road, Nairobi',
    approved: true,
    created_at: '2025-01-15T10:00:00Z',
    approval_date: '2025-01-16T14:30:00Z',
    total_students: 450,
    total_teachers: 25,
  },
  {
    id: 2,
    name: 'Mombasa High School',
    country: mockCountries[0],
    county: mockCounties[1],
    address: '456 Learning Street, Mombasa',
    approved: false,
    created_at: '2025-10-24T14:30:00Z',
    total_students: 0,
    total_teachers: 0,
  },
];

// Mock Students
export const mockStudents = [
  {
    id: 1,
    first_name: 'John',
    last_name: 'Doe',
    date_of_birth: '2010-05-15',
    admission_number: 'NPS001',
    school: mockSchools[0],
    guardians: [
      {
        id: 1,
        first_name: 'Jane',
        last_name: 'Doe',
        phone: '+254712345678',
        relationship: 'Mother',
        is_primary: true,
      },
      {
        id: 2,
        first_name: 'Michael',
        last_name: 'Doe',
        phone: '+254723456789',
        relationship: 'Father',
        is_primary: false,
      },
    ],
  },
  {
    id: 2,
    first_name: 'Sarah',
    last_name: 'Smith',
    date_of_birth: '2012-08-22',
    admission_number: 'NPS002',
    school: mockSchools[0],
    guardians: [
      {
        id: 3,
        first_name: 'Emily',
        last_name: 'Smith',
        phone: '+254734567890',
        relationship: 'Mother',
        is_primary: true,
      },
    ],
  },
];

// Mock Guardian Link Requests
export const mockGuardianLinkRequests = [
  {
    id: 1,
    student: mockStudents[0],
    new_guardian: {
      id: 4,
      first_name: 'Uncle',
      last_name: 'Doe',
      phone: '+254745678901',
      relationship: 'Uncle',
    },
    created_at: '2025-10-26T10:00:00Z',
    expires_at: '2025-10-27T10:00:00Z',
    approved_by: [],
    rejected: false,
    finalized: false,
    teacher_approved: false,
    total_guardians: 2,
    teacher: {
      first_name: 'John',
      last_name: 'Kamau',
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
      last_name: 'Kamau',
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
      last_name: 'Kamau',
    },
  },
  {
    id: 3,
    student: mockStudents[0],
    amount: 2000.00,
    purpose: 'Field trip to museum',
    created_at: '2025-10-20T09:00:00Z',
    due_date: '2025-11-05',
    paid_date: '2025-10-22T15:30:00Z',
    status: PAYMENT_STATUS.PAID,
    mpesa_ref: 'RKJ123XYZ789',
    requested_by: {
      first_name: 'John',
      last_name: 'Kamau',
    },
  },
];

// Mock Notifications
export const mockNotifications = [
  {
    id: 1,
    type: 'approval_request',
    title: 'New Guardian Link Request',
    message: 'A new guardian link request has been created for John Doe',
    created_at: '2025-10-27T10:00:00Z',
    read: false,
    priority: 'high',
  },
  {
    id: 2,
    type: 'payment_request',
    title: 'Payment Request',
    message: 'New payment request for KES 5,000 - School fees',
    created_at: '2025-10-26T14:30:00Z',
    read: false,
    priority: 'medium',
  },
  {
    id: 3,
    type: 'approval_approved',
    title: 'Request Approved',
    message: 'Your guardian link request has been approved',
    created_at: '2025-10-25T09:15:00Z',
    read: true,
    priority: 'low',
  },
];

// Mock Dashboard Stats
export const mockDashboardStats = {
  teacher: {
    totalStudents: 45,
    pendingApprovals: 3,
    pendingPayments: 8,
    recentActivities: [
      {
        id: 1,
        type: 'student_added',
        message: 'New student registered: John Doe',
        time: '2 hours ago',
      },
      {
        id: 2,
        type: 'approval_pending',
        message: 'Guardian link request needs your approval',
        time: '1 day ago',
      },
    ],
  },
  guardian: {
    totalStudents: 2,
    pendingApprovals: 1,
    pendingPayments: 3,
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
        message: 'New school registration: Mombasa High School',
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