// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Kenyan format)
export const validatePhone = (phone) => {
  // Accepts formats: +254712345678, 0712345678, 712345678
  const phoneRegex = /^(\+254|0)?[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Username validation
export const validateUsername = (username) => {
  // 3-20 characters, alphanumeric and underscore only
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Name validation
export const validateName = (name) => {
  // At least 2 characters, letters only (including spaces)
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name);
};

// Admission number validation
export const validateAdmissionNumber = (number) => {
  // At least 3 characters, alphanumeric with optional slashes
  const admissionRegex = /^[a-zA-Z0-9/]{3,}$/;
  return admissionRegex.test(number);
};

// 🇰🇪 UPI Number validation (Kenya Unique Personal Identifier)
export const validateUPINumber = (upi) => {
  if (!upi || upi.trim() === '') {
    return true; // UPI is optional
  }
  // UPI format: At least 10 alphanumeric characters
  const upiRegex = /^[A-Z0-9]{10,}$/i;
  return upiRegex.test(upi);
};

// 🇰🇪 Birth Certificate Number validation (Kenya)
export const validateBirthCertificateNumber = (certNumber) => {
  if (!certNumber || certNumber.trim() === '') {
    return true; // Birth certificate is optional
  }
  // Kenya birth certificate: numeric, 6-10 digits
  const certRegex = /^\d{6,10}$/;
  return certRegex.test(certNumber);
};

// 🇰🇪 NEMIS Code validation (National Education Management Information System)
export const validateNEMISCode = (nemis) => {
  if (!nemis || nemis.trim() === '') {
    return true; // NEMIS is optional
  }
  // NEMIS format: 9-digit number
  const nemisRegex = /^\d{9}$/;
  return nemisRegex.test(nemis);
};

// 🇰🇪 Validate Kenya Grade
export const validateKenyaGrade = (grade) => {
  const validGrades = [
    'pp1', 'pp2',
    'grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6',
    'grade_7', 'grade_8', 'grade_9',
    'grade_10', 'grade_11', 'grade_12',
    'form_1', 'form_2', 'form_3', 'form_4'
  ];
  return validGrades.includes(grade);
};

// 🇰🇪 Validate Stream/Class name
export const validateStream = (stream) => {
  if (!stream || stream.trim() === '') {
    return false;
  }
  // Stream should be 1-20 characters, letters and numbers
  const streamRegex = /^[a-zA-Z0-9\s]{1,20}$/;
  return streamRegex.test(stream);
};

// 🇰🇪 Validate House name
export const validateHouseName = (house) => {
  if (!house || house.trim() === '') {
    return true; // House is optional
  }
  // House should be 2-30 characters, letters and spaces
  const houseRegex = /^[a-zA-Z\s]{2,30}$/;
  return houseRegex.test(house);
};

// 🇰🇪 Validate Year of Admission
export const validateYearOfAdmission = (year) => {
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    return false;
  }
  
  // Year should be between 1990 and current year + 1
  return yearNum >= 1990 && yearNum <= currentYear + 1;
};

// Amount validation
export const validateAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return !isNaN(numAmount) && numAmount > 0;
};

// Date validation
export const validateDate = (date) => {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
};

// Date of birth validation (must be at least 3 years old, max 25 years old)
export const validateDateOfBirth = (dob) => {
  const date = new Date(dob);
  const today = new Date();
  
  // Check if date is valid
  if (!(date instanceof Date && !isNaN(date))) {
    return false;
  }
  
  // Check if date is not in the future
  if (date > today) {
    return false;
  }
  
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  return age >= 3 && age <= 25;
};

// Required field validation
export const validateRequired = (value) => {
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined;
};

// Minimum length validation
export const validateMinLength = (value, minLength) => {
  if (!value) return false;
  return value.toString().length >= minLength;
};

// Maximum length validation
export const validateMaxLength = (value, maxLength) => {
  if (!value) return true;
  return value.toString().length <= maxLength;
};

// 🇰🇪 Validate complete student data (Kenya-specific)
export const validateStudentData = (studentData) => {
  const errors = {};
  
  // Personal Information
  if (!validateRequired(studentData.first_name)) {
    errors.first_name = 'First name is required';
  } else if (!validateName(studentData.first_name)) {
    errors.first_name = 'Invalid first name format';
  }
  
  if (studentData.middle_name && !validateName(studentData.middle_name)) {
    errors.middle_name = 'Invalid middle name format';
  }
  
  if (!validateRequired(studentData.last_name)) {
    errors.last_name = 'Last name is required';
  } else if (!validateName(studentData.last_name)) {
    errors.last_name = 'Invalid last name format';
  }
  
  if (!validateRequired(studentData.date_of_birth)) {
    errors.date_of_birth = 'Date of birth is required';
  } else if (!validateDateOfBirth(studentData.date_of_birth)) {
    errors.date_of_birth = 'Invalid date of birth (age must be 3-25 years)';
  }
  
  if (studentData.birth_certificate_number && !validateBirthCertificateNumber(studentData.birth_certificate_number)) {
    errors.birth_certificate_number = 'Invalid birth certificate format';
  }
  
  // Academic Information
  if (!validateRequired(studentData.education_level)) {
    errors.education_level = 'Education level is required';
  }
  
  if (!validateRequired(studentData.current_grade)) {
    errors.current_grade = 'Grade/Class is required';
  } else if (!validateKenyaGrade(studentData.current_grade)) {
    errors.current_grade = 'Invalid grade selection';
  }
  
  if (!validateRequired(studentData.stream)) {
    errors.stream = 'Stream/Class is required';
  } else if (!validateStream(studentData.stream)) {
    errors.stream = 'Invalid stream format';
  }
  
  if (!validateRequired(studentData.admission_number)) {
    errors.admission_number = 'Admission number is required';
  } else if (!validateAdmissionNumber(studentData.admission_number)) {
    errors.admission_number = 'Invalid admission number format';
  }
  
  if (studentData.upi_number && !validateUPINumber(studentData.upi_number)) {
    errors.upi_number = 'Invalid UPI number format (min 10 characters)';
  }
  
  if (studentData.year_of_admission && !validateYearOfAdmission(studentData.year_of_admission)) {
    errors.year_of_admission = 'Invalid year of admission';
  }
  
  // House System
  if (studentData.house_name && !validateHouseName(studentData.house_name)) {
    errors.house_name = 'Invalid house name format';
  }
  
  // School Information
  if (!validateRequired(studentData.county_id)) {
    errors.county = 'County is required';
  }
  
  if (!validateRequired(studentData.school_id)) {
    errors.school = 'School is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Form validation helper
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];
    
    if (fieldRules.required && !validateRequired(value)) {
      errors[field] = fieldRules.requiredMessage || `${field} is required`;
      return;
    }
    
    if (fieldRules.email && value && !validateEmail(value)) {
      errors[field] = 'Invalid email address';
      return;
    }
    
    if (fieldRules.phone && value && !validatePhone(value)) {
      errors[field] = 'Invalid phone number';
      return;
    }
    
    if (fieldRules.password && value && !validatePassword(value)) {
      errors[field] = 'Password must be at least 8 characters with uppercase, lowercase, and number';
      return;
    }
    
    if (fieldRules.minLength && value && !validateMinLength(value, fieldRules.minLength)) {
      errors[field] = `Minimum length is ${fieldRules.minLength} characters`;
      return;
    }
    
    if (fieldRules.maxLength && value && !validateMaxLength(value, fieldRules.maxLength)) {
      errors[field] = `Maximum length is ${fieldRules.maxLength} characters`;
      return;
    }
    
    if (fieldRules.admissionNumber && value && !validateAdmissionNumber(value)) {
      errors[field] = 'Invalid admission number format';
      return;
    }
    
    if (fieldRules.upiNumber && value && !validateUPINumber(value)) {
      errors[field] = 'Invalid UPI number format';
      return;
    }
    
    if (fieldRules.birthCertificate && value && !validateBirthCertificateNumber(value)) {
      errors[field] = 'Invalid birth certificate format';
      return;
    }
    
    if (fieldRules.kenyaGrade && value && !validateKenyaGrade(value)) {
      errors[field] = 'Invalid grade selection';
      return;
    }
    
    if (fieldRules.stream && value && !validateStream(value)) {
      errors[field] = 'Invalid stream format';
      return;
    }
    
    if (fieldRules.yearOfAdmission && value && !validateYearOfAdmission(value)) {
      errors[field] = 'Invalid year of admission';
      return;
    }
    
    if (fieldRules.custom && !fieldRules.custom(value)) {
      errors[field] = fieldRules.customMessage || 'Invalid value';
      return;
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// Default export
export default {
  validateEmail,
  validatePhone,
  validatePassword,
  validateUsername,
  validateName,
  validateAdmissionNumber,
  validateUPINumber,
  validateBirthCertificateNumber,
  validateNEMISCode,
  validateKenyaGrade,
  validateStream,
  validateHouseName,
  validateYearOfAdmission,
  validateAmount,
  validateDate,
  validateDateOfBirth,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateStudentData,
  validateForm,
};