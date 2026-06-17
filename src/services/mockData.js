// ========================================
// SMARTSCHOOL MVP - MOCK DATA GENERATOR
// For development and testing without backend
// ========================================

import { format, addDays, subDays } from 'date-fns';

// ============================================================
// CONFIGURATION
// ============================================================

const SCHOOL_ID = 1;
const CLASSES_COUNT = 20;
const STUDENTS_PER_CLASS = 100;
const GUARDIANS_PER_STUDENT = 1.5;

// ============================================================
// MOCK TEACHERS
// ============================================================

export const mockTeachers = [
  {
    id: 1,
    user: {
      id: 1,
      username: 'teacher1',
      email: 'teacher1@smartschool.edu',
      first_name: 'James',
      last_name: 'Mwangi',
    },
    school: SCHOOL_ID,
    registration_number: 'TSC/001/2024',
    phone_number: '+254712345678',
    is_active: true,
    date_joined: '2024-01-15',
  },
  {
    id: 2,
    user: {
      id: 2,
      username: 'teacher2',
      email: 'teacher2@smartschool.edu',
      first_name: 'Mary',
      last_name: 'Kipchoge',
    },
    school: SCHOOL_ID,
    registration_number: 'TSC/002/2024',
    phone_number: '+254712345679',
    is_active: true,
    date_joined: '2024-01-15',
  },
  {
    id: 3,
    user: {
      id: 3,
      username: 'teacher3',
      email: 'teacher3@smartschool.edu',
      first_name: 'Peter',
      last_name: 'Omondi',
    },
    school: SCHOOL_ID,
    registration_number: 'TSC/003/2024',
    phone_number: '+254712345680',
    is_active: true,
    date_joined: '2024-01-15',
  },
];

// ============================================================
// MOCK CLASSES
// ============================================================

export const generateMockClasses = () => {
  const grades = ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'];
  const streams = ['A', 'B', 'C'];
  const classes = [];
  let id = 1;

  grades.forEach((grade, gradeIdx) => {
    streams.forEach((stream, streamIdx) => {
      if (id <= CLASSES_COUNT) {
        classes.push({
          id,
          school: SCHOOL_ID,
          name: `${grade} - ${stream}`,
          grade_level: gradeIdx + 1,
          stream,
          teacher: mockTeachers[id % mockTeachers.length].id,
          student_count: STUDENTS_PER_CLASS,
          is_active: true,
          created_at: '2024-01-15',
        });
        id++;
      }
    });
  });

  return classes;
};

// ============================================================
// MOCK STUDENTS
// ============================================================

const firstNames = [
  'John', 'Mary', 'Peter', 'Sarah', 'Michael', 'Jane', 'David', 'Grace', 'Joseph', 'Alice',
  'Daniel', 'Emily', 'Samuel', 'Victoria', 'James', 'Amelia', 'Robert', 'Sophia', 'Thomas', 'Olivia',
  'Mwangi', 'Kipchoge', 'Omondi', 'Kariuki', 'Koech', 'Mutua', 'Cheruiyot', 'Nyambura', 'Wanjiru', 'Njeri'
];

const lastNames = [
  'Mwangi', 'Kipchoge', 'Omondi', 'Kariuki', 'Koech', 'Mutua', 'Cheruiyot', 'Nyambura', 'Wanjiru', 'Njeri',
  'Okoro', 'Okafor', 'Adeyemi', 'Kwame', 'Mensah', 'Addo', 'Boateng', 'Asante', 'Kusi', 'Owusu'
];

export const generateMockStudents = (classId, count) => {
  const students = [];
  
  for (let i = 1; i <= count; i++) {
    const studentId = classId * 1000 + i;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    students.push({
      id: studentId,
      user: {
        id: studentId,
        username: `student_${studentId}`,
        email: `student${studentId}@smartschool.edu`,
        first_name: firstName,
        last_name: lastName,
      },
      school: SCHOOL_ID,
      admission_number: `ADM/${2024}/${String(studentId).padStart(6, '0')}`,
      date_of_birth: `${2010 + Math.floor(Math.random() * 5)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
      gender: Math.random() > 0.5 ? 'M' : 'F',
      class: classId,
      current_class: classId,
      is_active: true,
      date_enrolled: '2024-01-15',
    });
  }

  return students;
};

// ============================================================
// MOCK GUARDIANS
// ============================================================

export const generateMockGuardians = (studentId, count = 1) => {
  const guardians = [];
  const phoneCountryCodes = ['+254', '+255', '+256'];
  
  for (let i = 1; i <= count; i++) {
    const guardianId = studentId * 10 + i;
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const countryCode = phoneCountryCodes[Math.floor(Math.random() * phoneCountryCodes.length)];
    const phoneNumber = countryCode + String(Math.floor(Math.random() * 900000000) + 100000000);
    
    guardians.push({
      id: guardianId,
      user: {
        id: guardianId,
        username: `guardian_${guardianId}`,
        email: `guardian${guardianId}@smartschool.edu`,
        first_name: firstName,
        last_name: lastName,
      },
      school: SCHOOL_ID,
      phone_number: phoneNumber,
      relationship: i === 1 ? 'Parent' : 'Guardian',
      is_primary: i === 1,
      is_active: true,
      date_created: '2024-01-15',
    });
  }

  return guardians;
};

// ============================================================
// MOCK ATTENDANCE
// ============================================================

export const generateMockAttendanceRecord = (studentId, studentName, status = 'PRESENT', timestamp = null) => {
  const now = new Date();
  const attendanceTime = timestamp || new Date(now.getHours() * 3600000 + Math.random() * 3600000);
  
  return {
    id: Math.random() * 100000,
    student: studentId,
    student_name: studentName,
    date: format(now, 'yyyy-MM-dd'),
    time_marked: format(attendanceTime, 'HH:mm:ss'),
    status,
    marked_by_teacher: 1,
    school: SCHOOL_ID,
    created_at: new Date().toISOString(),
  };
};

export const generateTodaysAttendance = (classId, students) => {
  return students.map(student => {
    // 85% present, 15% absent
    const isPresent = Math.random() < 0.85;
    const status = isPresent ? 'PRESENT' : 'ABSENT';
    const timestamp = isPresent 
      ? new Date(Date.now() - Math.random() * 3600000) // Within last hour
      : null;
    
    return generateMockAttendanceRecord(
      student.id,
      `${student.user.first_name} ${student.user.last_name}`,
      status,
      timestamp
    );
  });
};

// ============================================================
// MOCK SMS NOTIFICATIONS
// ============================================================

export const generateSMSNotification = (studentName, guardianPhone, status) => {
  const now = new Date();
  const timeString = format(now, 'h:mm a');
  
  let message = '';
  if (status === 'PRESENT') {
    message = `SMARTSCHOOL EdTech Alert:\n\n${studentName} arrived at school today at ${timeString}.\n\nHave a great day.`;
  } else {
    message = `SMARTSCHOOL EdTech Alert:\n\n${studentName} has not been marked present at school as of ${format(new Date(now.getHours() + ':00'), 'h:mm a')}.\n\nPlease contact the school if necessary.`;
  }
  
  return {
    id: Math.random() * 100000,
    recipient_phone: guardianPhone,
    message,
    status: 'sent', // or 'pending', 'failed'
    sent_at: new Date().toISOString(),
    student_name: studentName,
    attendance_status: status,
  };
};

// ============================================================
// GENERATE COMPLETE MOCK DATABASE
// ============================================================

export const generateCompleteMockData = () => {
  const classes = generateMockClasses();
  const allStudents = {};
  const allGuardians = {};
  const allAttendance = {};
  
  classes.forEach(cls => {
    const students = generateMockStudents(cls.id, STUDENTS_PER_CLASS);
    allStudents[cls.id] = students;
    
    students.forEach(student => {
      const guardianCount = Math.ceil(GUARDIANS_PER_STUDENT);
      allGuardians[student.id] = generateMockGuardians(student.id, guardianCount);
    });
  });

  return {
    classes,
    students: allStudents,
    guardians: allGuardians,
    teachers: mockTeachers,
    school: {
      id: SCHOOL_ID,
      name: 'SMARTSCHOOL Test Pilot',
      location: 'Nairobi, Kenya',
      principal: 'Dr. Jane Kipchoge',
    },
  };
};

// ============================================================
// STATISTICS
// ============================================================

export const calculateAttendanceStats = (attendanceRecords) => {
  const total = attendanceRecords.length;
  const present = attendanceRecords.filter(r => r.status === 'PRESENT').length;
  const absent = total - present;
  const presentPercentage = ((present / total) * 100).toFixed(1);

  return {
    total,
    present,
    absent,
    presentPercentage,
  };
};
