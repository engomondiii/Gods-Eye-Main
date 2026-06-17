// ========================================
// SMARTSCHOOL MVP - MOCK API SERVICE
// Intercepts API calls for local testing
// ========================================

import {
  generateMockClasses,
  generateMockStudents,
  generateMockGuardians,
  generateTodaysAttendance,
  generateSMSNotification,
  mockTeachers,
} from './mockData';

// ============================================================
// MOCK DATABASE (in-memory storage)
// ============================================================

let mockDatabase = {
  mockDataLoaded: false,
  classes: [],
  students: {},
  guardians: {},
  attendance: [],
  smsLog: [],
  teachers: mockTeachers,
};

// ============================================================
// INITIALIZE MOCK DATA
// ============================================================

export const initializeMockDatabase = () => {
  if (mockDatabase.mockDataLoaded) return;

  console.log('📋 Initializing mock database for 2,000 learners...');
  
  mockDatabase.classes = generateMockClasses();
  
  mockDatabase.classes.forEach((cls) => {
    const students = generateMockStudents(cls.id, 100);
    mockDatabase.students[cls.id] = students;
    
    students.forEach((student) => {
      const guardians = generateMockGuardians(student.id, 1);
      mockDatabase.guardians[student.id] = guardians;
    });
  });

  mockDatabase.mockDataLoaded = true;
  console.log(`✅ Mock database loaded: ${mockDatabase.classes.length} classes, 2,000 students`);
};

// ============================================================
// MOCK API ENDPOINTS
// ============================================================

/**
 * Mock Authentication Endpoints
 */
export const mockAuthEndpoints = {
  login: async ({ username, password }) => {
    // Find teacher by username
    const teacher = mockDatabase.teachers.find(
      (t) => t.user.username === username
    );

    if (!teacher) {
      return {
        success: false,
        error: 'Invalid username or password',
      };
    }

    // Mock token
    const token = `mock_jwt_token_${teacher.id}_${Date.now()}`;

    return {
      success: true,
      data: {
        access: token,
        refresh: `mock_refresh_token_${teacher.id}`,
        user: {
          id: teacher.user.id,
          username: teacher.user.username,
          email: teacher.user.email,
          first_name: teacher.user.first_name,
          last_name: teacher.user.last_name,
          role: 'teacher',
          school: teacher.school,
          teacher_id: teacher.id,
        },
      },
    };
  },

  logout: async () => {
    return { success: true };
  },

  verifyToken: async (token) => {
    if (!token || !token.startsWith('mock_jwt_token_')) {
      return { success: false, error: 'Invalid token' };
    }
    return { success: true };
  },
};

/**
 * Mock Classes Endpoints
 */
export const mockClassesEndpoints = {
  list: async ({ teacher_id } = {}) => {
    let classes = mockDatabase.classes;

    if (teacher_id) {
      classes = classes.filter((c) => c.teacher === teacher_id);
    }

    return {
      success: true,
      data: classes,
    };
  },

  detail: async (classId) => {
    const cls = mockDatabase.classes.find((c) => c.id === classId);
    
    if (!cls) {
      return { success: false, error: 'Class not found' };
    }

    return { success: true, data: cls };
  },
};

/**
 * Mock Students Endpoints
 */
export const mockStudentsEndpoints = {
  list: async ({ class_id, page = 1, page_size = 100 } = {}) => {
    let students = [];

    if (class_id) {
      students = mockDatabase.students[class_id] || [];
    } else {
      // Return all students
      Object.values(mockDatabase.students).forEach((classStudents) => {
        students = [...students, ...classStudents];
      });
    }

    // Pagination
    const start = (page - 1) * page_size;
    const paginatedStudents = students.slice(start, start + page_size);

    return {
      success: true,
      data: {
        count: students.length,
        page,
        page_size,
        results: paginatedStudents,
      },
    };
  },

  detail: async (studentId) => {
    let student = null;

    for (const classStudents of Object.values(mockDatabase.students)) {
      student = classStudents.find((s) => s.id === studentId);
      if (student) break;
    }

    if (!student) {
      return { success: false, error: 'Student not found' };
    }

    return { success: true, data: student };
  },

  create: async (studentData) => {
    const newStudent = {
      id: Math.floor(Math.random() * 1000000),
      ...studentData,
    };

    if (studentData.class) {
      if (!mockDatabase.students[studentData.class]) {
        mockDatabase.students[studentData.class] = [];
      }
      mockDatabase.students[studentData.class].push(newStudent);
    }

    return { success: true, data: newStudent };
  },
};

/**
 * Mock Guardians Endpoints
 */
export const mockGuardiansEndpoints = {
  list: async ({ student_id } = {}) => {
    let guardians = [];

    if (student_id) {
      guardians = mockDatabase.guardians[student_id] || [];
    } else {
      Object.values(mockDatabase.guardians).forEach((studentGuardians) => {
        guardians = [...guardians, ...studentGuardians];
      });
    }

    return {
      success: true,
      data: guardians,
    };
  },

  detail: async (guardianId) => {
    let guardian = null;

    for (const studentGuardians of Object.values(mockDatabase.guardians)) {
      guardian = studentGuardians.find((g) => g.id === guardianId);
      if (guardian) break;
    }

    if (!guardian) {
      return { success: false, error: 'Guardian not found' };
    }

    return { success: true, data: guardian };
  },

  create: async (guardianData) => {
    const newGuardian = {
      id: Math.floor(Math.random() * 1000000),
      ...guardianData,
    };

    if (guardianData.student) {
      if (!mockDatabase.guardians[guardianData.student]) {
        mockDatabase.guardians[guardianData.student] = [];
      }
      mockDatabase.guardians[guardianData.student].push(newGuardian);
    }

    return { success: true, data: newGuardian };
  },
};

/**
 * Mock Attendance Endpoints
 */
export const mockAttendanceEndpoints = {
  mark: async (attendanceData) => {
    const { student_id, student_name, status, class_id } = attendanceData;

    const attendanceRecord = {
      id: Math.floor(Math.random() * 1000000),
      student: student_id,
      student_name,
      status,
      class: class_id,
      date: new Date().toISOString().split('T')[0],
      time_marked: new Date().toLocaleTimeString('en-US', { hour12: false }),
      sms_sent: false,
    };

    mockDatabase.attendance.push(attendanceRecord);

    // Trigger SMS notification
    const guardians = mockDatabase.guardians[student_id] || [];
    if (guardians.length > 0) {
      const primaryGuardian = guardians.find((g) => g.is_primary) || guardians[0];
      
      const smsNotification = generateSMSNotification(
        student_name,
        primaryGuardian.phone_number,
        status
      );
      
      mockDatabase.smsLog.push(smsNotification);
      attendanceRecord.sms_sent = true;

      if (__DEV__) {
        console.log('📱 SMS logged:', {
          to: primaryGuardian.phone_number,
          message: smsNotification.message,
          status: smsNotification.status,
        });
      }
    }

    return {
      success: true,
      data: attendanceRecord,
      message: 'Attendance marked and SMS sent',
    };
  },

  getTodaysAttendance: async ({ class_id } = {}) => {
    const today = new Date().toISOString().split('T')[0];
    let todaysRecords = mockDatabase.attendance.filter((a) => a.date === today);

    if (class_id) {
      todaysRecords = todaysRecords.filter((a) => a.class === class_id);
    }

    return {
      success: true,
      data: todaysRecords,
    };
  },

  getReport: async ({ class_id, start_date, end_date } = {}) => {
    let records = mockDatabase.attendance;

    if (class_id) {
      records = records.filter((a) => a.class === class_id);
    }

    if (start_date) {
      records = records.filter((a) => a.date >= start_date);
    }

    if (end_date) {
      records = records.filter((a) => a.date <= end_date);
    }

    const summary = {
      total: records.length,
      present: records.filter((a) => a.status === 'PRESENT').length,
      absent: records.filter((a) => a.status === 'ABSENT').length,
    };

    return {
      success: true,
      data: {
        records,
        summary,
      },
    };
  },
};

/**
 * Mock SMS Endpoints
 */
export const mockSmsEndpoints = {
  send: async ({ recipient_phone, message, student_id, status }) => {
    const smsRecord = {
      id: Math.floor(Math.random() * 1000000),
      recipient_phone,
      message,
      student_id,
      status,
      sent_at: new Date().toISOString(),
      sms_gateway: 'mock',
    };

    mockDatabase.smsLog.push(smsRecord);

    if (__DEV__) {
      console.log('📱 SMS sent (mock):', {
        to: recipient_phone,
        message: message.substring(0, 50) + '...',
        sent_at: smsRecord.sent_at,
      });
    }

    return {
      success: true,
      data: smsRecord,
      message: 'SMS logged successfully',
    };
  },

  getSmsLog: async ({ limit = 50 } = {}) => {
    const log = mockDatabase.smsLog.slice(-limit);
    return {
      success: true,
      data: log,
    };
  },
};

/**
 * Generate SMS Notification (helper)
 */
function generateSMSNotification(studentName, guardianPhone, status) {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const timeString = `${hours}:${minutes}`;

  let message = '';
  if (status === 'PRESENT') {
    message = `SMARTSCHOOL EdTech Alert:\n\n${studentName} arrived at school today at ${timeString}.\n\nHave a great day.`;
  } else {
    message = `SMARTSCHOOL EdTech Alert:\n\n${studentName} has not been marked present at school as of ${hours}:00.\n\nPlease contact the school if necessary.`;
  }

  return {
    id: Math.floor(Math.random() * 1000000),
    recipient_phone: guardianPhone,
    message,
    status: 'sent',
    sent_at: new Date().toISOString(),
    student_name: studentName,
    attendance_status: status,
  };
}

// ============================================================
// EXPORT MOCK API ROUTER
// ============================================================

export const mockApi = {
  auth: mockAuthEndpoints,
  classes: mockClassesEndpoints,
  students: mockStudentsEndpoints,
  guardians: mockGuardiansEndpoints,
  attendance: mockAttendanceEndpoints,
  sms: mockSmsEndpoints,
  database: mockDatabase,
  init: initializeMockDatabase,
};

export default mockApi;
