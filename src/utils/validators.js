// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation (Kenyan format)
export const validatePhone = (phone) => {
  const phoneRegex = /^(\+254|0)?[17]\d{8}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
};

// Password validation
export const validatePassword = (password) => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Username validation
export const validateUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

// Name validation
export const validateName = (name) => {
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  return nameRegex.test(name);
};

// Admission number validation
export const validateAdmissionNumber = (number) => {
  const admissionRegex = /^[a-zA-Z0-9/]{3,}$/;
  return admissionRegex.test(number);
};

// 🇰🇪 UPI Number validation
export const validateUPINumber = (upi) => {
  if (!upi || upi.trim() === '') {
    return true;
  }
  const upiRegex = /^[A-Z0-9]{10,}$/i;
  return upiRegex.test(upi);
};

// 🇰🇪 Birth Certificate Number validation
export const validateBirthCertificateNumber = (certNumber) => {
  if (!certNumber || certNumber.trim() === '') {
    return true;
  }
  const certRegex = /^\d{6,10}$/;
  return certRegex.test(certNumber);
};

// 🇰🇪 NEMIS Code validation
export const validateNEMISCode = (nemis) => {
  if (!nemis || nemis.trim() === '') {
    return true;
  }
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
  const streamRegex = /^[a-zA-Z0-9\s]{1,20}$/;
  return streamRegex.test(stream);
};

// 🇰🇪 Validate House name
export const validateHouseName = (house) => {
  if (!house || house.trim() === '') {
    return true;
  }
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

// Date of birth validation
export const validateDateOfBirth = (dob) => {
  const date = new Date(dob);
  const today = new Date();
  
  if (!(date instanceof Date && !isNaN(date))) {
    return false;
  }
  
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

// 🆕 NEW - Payment Amount Validation
export const validatePaymentAmount = (amount, minAmount = 100, maxAmount = null) => {
  const numAmount = parseFloat(amount);
  
  // Check if amount is a valid number
  if (isNaN(numAmount) || numAmount <= 0) {
    return {
      isValid: false,
      message: 'Please enter a valid amount',
    };
  }
  
  // Check minimum amount
  if (numAmount < minAmount) {
    return {
      isValid: false,
      message: `Amount must be at least KES ${minAmount.toLocaleString()}`,
    };
  }
  
  // Check maximum amount if provided
  if (maxAmount && numAmount > maxAmount) {
    return {
      isValid: false,
      message: `Amount cannot exceed KES ${maxAmount.toLocaleString()}`,
    };
  }
  
  return {
    isValid: true,
    message: null,
  };
};

// 🆕 NEW - Validate Partial Payment
export const validatePartialPayment = (paymentRequest, proposedAmount) => {
  const amount = parseFloat(proposedAmount);
  const minAmount = parseFloat(paymentRequest.minimum_amount || 100);
  const remaining = parseFloat(paymentRequest.remaining_amount || paymentRequest.amount);
  
  // Basic amount validation
  if (isNaN(amount) || amount <= 0) {
    return {
      isValid: false,
      message: 'Please enter a valid amount',
    };
  }
  
  // Check if partial payments are allowed
  if (!paymentRequest.allow_partial) {
    if (amount !== remaining) {
      return {
        isValid: false,
        message: `Full payment of KES ${remaining.toLocaleString()} is required`,
      };
    }
  }
  
  // Check minimum payment
  if (amount < minAmount) {
    return {
      isValid: false,
      message: `Minimum payment is KES ${minAmount.toLocaleString()}`,
    };
  }
  
  // Check if amount exceeds remaining balance
  if (amount > remaining) {
    return {
      isValid: false,
      message: `Amount cannot exceed remaining balance of KES ${remaining.toLocaleString()}`,
    };
  }
  
  return {
    isValid: true,
    message: null,
  };
};

// 🆕 NEW - Validate Minimum Payment Amount
export const validateMinimumPaymentAmount = (amount, originalAmount) => {
  const numAmount = parseFloat(amount);
  const numOriginal = parseFloat(originalAmount);
  
  if (isNaN(numAmount) || isNaN(numOriginal)) {
    return {
      isValid: false,
      message: 'Invalid amount',
    };
  }
  
  // Minimum should be at least KES 100
  if (numAmount < 100) {
    return {
      isValid: false,
      message: 'Minimum payment must be at least KES 100',
    };
  }
  
  // Minimum cannot be more than the original amount
  if (numAmount > numOriginal) {
    return {
      isValid: false,
      message: 'Minimum payment cannot exceed the total amount',
    };
  }
  
  // Minimum should be at least 10% of original amount
  const tenPercent = numOriginal * 0.1;
  if (numAmount < tenPercent) {
    return {
      isValid: false,
      message: `Minimum payment should be at least 10% (KES ${Math.ceil(tenPercent).toLocaleString()})`,
    };
  }
  
  return {
    isValid: true,
    message: null,
  };
};

// 🆕 NEW - Calculate Payment Percentage
export const calculatePaymentPercentage = (paidAmount, totalAmount) => {
  const paid = parseFloat(paidAmount);
  const total = parseFloat(totalAmount);
  
  if (isNaN(paid) || isNaN(total) || total === 0) {
    return 0;
  }
  
  return Math.round((paid / total) * 100);
};

// 🆕 NEW - Validate Payment Request Creation
export const validatePaymentRequestCreation = (data) => {
  const errors = {};
  
  // Validate student
  if (!data.student_id) {
    errors.student = 'Please select a student';
  }
  
  // Validate amount
  if (!data.amount || parseFloat(data.amount) <= 0) {
    errors.amount = 'Please enter a valid amount';
  }
  
  // Validate purpose
  if (!data.purpose || data.purpose.trim() === '') {
    errors.purpose = 'Please enter the purpose of payment';
  } else if (data.purpose.length < 10) {
    errors.purpose = 'Purpose must be at least 10 characters';
  }
  
  // Validate due date
  if (!data.due_date) {
    errors.due_date = 'Please select a due date';
  } else {
    const dueDate = new Date(data.due_date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      errors.due_date = 'Due date cannot be in the past';
    }
  }
  
  // Validate minimum amount if partial payments are allowed
  if (data.allow_partial) {
    if (!data.minimum_amount) {
      errors.minimum_amount = 'Please enter minimum payment amount';
    } else {
      const validation = validateMinimumPaymentAmount(data.minimum_amount, data.amount);
      if (!validation.isValid) {
        errors.minimum_amount = validation.message;
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// 🇰🇪 Validate complete student data
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
  validatePaymentAmount,  // 🆕 NEW
  validatePartialPayment,  // 🆕 NEW
  validateMinimumPaymentAmount,  // 🆕 NEW
  calculatePaymentPercentage,  // 🆕 NEW
  validatePaymentRequestCreation,  // 🆕 NEW
  validateStudentData,
  validateForm,
};