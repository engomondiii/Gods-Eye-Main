// ========================================
// GOD'S EYE EDTECH - VALIDATORS (COMPREHENSIVE UPDATE)
// Matching Backend Validators from core/validators.py
// ========================================

// ============================================================
// BASIC VALIDATORS
// ============================================================

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateEmail = (email) => {
  if (!email || email.trim() === '') {
    return 'Email is required';
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return 'Please enter a valid email address';
  }
  
  return null;
};

/**
 * Password validation
 * Must be at least 8 characters with uppercase, lowercase, and number
 * @param {string} password - Password to validate
 * @returns {string|null} Error message or null if valid
 */
export const validatePassword = (password) => {
  if (!password || password === '') {
    return 'Password is required';
  }
  
  if (password.length < 8) {
    return 'Password must be at least 8 characters long';
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    return 'Password must contain at least one lowercase letter';
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    return 'Password must contain at least one uppercase letter';
  }
  
  if (!/(?=.*\d)/.test(password)) {
    return 'Password must contain at least one number';
  }
  
  return null;
};

/**
 * Username validation
 * @param {string} username - Username to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateUsername = (username) => {
  if (!username || username.trim() === '') {
    return 'Username is required';
  }
  
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  if (!usernameRegex.test(username)) {
    return 'Username must be 3-20 characters (letters, numbers, underscore only)';
  }
  
  return null;
};

/**
 * Name validation
 * @param {string} name - Name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateName = (name) => {
  if (!name || name.trim() === '') {
    return 'Name is required';
  }
  
  const nameRegex = /^[a-zA-Z\s]{2,}$/;
  if (!nameRegex.test(name)) {
    return 'Name must contain only letters and spaces (min 2 characters)';
  }
  
  return null;
};

/**
 * Required field validation
 * @param {any} value - Value to validate
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateRequired = (value, fieldName = 'Field') => {
  if (value === null || value === undefined) {
    return `${fieldName} is required`;
  }
  
  if (typeof value === 'string' && value.trim().length === 0) {
    return `${fieldName} is required`;
  }
  
  return null;
};

/**
 * Minimum length validation
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (!value) return null; // Optional field
  
  if (value.toString().length < minLength) {
    return `${fieldName} must be at least ${minLength} characters`;
  }
  
  return null;
};

/**
 * Maximum length validation
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {string|null} Error message or null if valid
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (!value) return null; // Optional field
  
  if (value.toString().length > maxLength) {
    return `${fieldName} must not exceed ${maxLength} characters`;
  }
  
  return null;
};

// ============================================================
// KENYA-SPECIFIC VALIDATORS (MATCHING BACKEND)
// ============================================================

/**
 * Kenyan phone number validation
 * MATCHES: core/validators.py - validate_kenyan_phone
 * Pattern: ^\+254[17]\d{8}$
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateKenyanPhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return 'Phone number is required';
  }
  
  // Remove spaces and special characters
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Add +254 if starts with 0
  if (cleaned.startsWith('0')) {
    cleaned = '+254' + cleaned.substring(1);
  }
  // Add + if starts with 254
  else if (cleaned.startsWith('254')) {
    cleaned = '+' + cleaned;
  }
  // Must start with +254
  else if (!cleaned.startsWith('+254')) {
    return 'Phone number must start with +254, 254, or 0';
  }
  
  // Validate exact pattern: +254[17]XXXXXXXX
  const pattern = /^\+254[17]\d{8}$/;
  if (!pattern.test(cleaned)) {
    return 'Phone number must be in format +254XXXXXXXXX (Safaricom/Airtel only)';
  }
  
  return null;
};

/**
 * M-Pesa phone number validation
 * Stricter than regular Kenyan phone - must be +254 format
 * @param {string} phone - Phone number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateMpesaPhone = (phone) => {
  if (!phone || phone.trim() === '') {
    return 'M-Pesa phone number is required';
  }
  
  // Remove spaces and special characters
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Remove + if present
  if (cleaned.startsWith('+')) {
    cleaned = cleaned.substring(1);
  }
  
  // Must start with 254
  if (!cleaned.startsWith('254')) {
    return 'M-Pesa requires phone number in format 254XXXXXXXXX';
  }
  
  // Check length
  if (cleaned.length !== 12) {
    return 'Phone number must be 12 digits (254XXXXXXXXX)';
  }
  
  // Check if it's a valid Safaricom number (starts with 254 7 or 254 1)
  if (!cleaned.startsWith('2547') && !cleaned.startsWith('2541')) {
    return 'Please enter a valid Safaricom number';
  }
  
  return null;
};

/**
 * UPI Number validation
 * MATCHES: core/validators.py - validate_upi_number
 * Must be at least 10 characters
 * @param {string} upi - UPI number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateUPI = (upi) => {
  if (!upi || upi.trim() === '') {
    return null; // Optional field
  }
  
  if (upi.length < 10) {
    return 'UPI number must be at least 10 characters';
  }
  
  // Additional validation: alphanumeric only
  const upiRegex = /^[A-Z0-9]{10,}$/i;
  if (!upiRegex.test(upi)) {
    return 'UPI number must contain only letters and numbers';
  }
  
  return null;
};

// Alias for backward compatibility
export const validateUPINumber = validateUPI;

/**
 * Birth Certificate Number validation
 * MATCHES: core/validators.py - validate_birth_certificate
 * Must be 6-10 digits
 * @param {string} certNumber - Birth certificate number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateBirthCertificate = (certNumber) => {
  if (!certNumber || certNumber.trim() === '') {
    return null; // Optional field
  }
  
  const certRegex = /^\d{6,10}$/;
  if (!certRegex.test(certNumber)) {
    return 'Birth certificate must be 6-10 digits';
  }
  
  return null;
};

// Alias for backward compatibility
export const validateBirthCertificateNumber = validateBirthCertificate;

/**
 * NEMIS Code validation
 * MATCHES: core/validators.py - validate_nemis_code
 * Must be exactly 9 digits
 * @param {string} code - NEMIS code to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateNEMISCode = (code) => {
  if (!code || code.trim() === '') {
    return null; // Optional field
  }
  
  const nemisRegex = /^\d{9}$/;
  if (!nemisRegex.test(code)) {
    return 'NEMIS code must be exactly 9 digits';
  }
  
  return null;
};

/**
 * Admission number validation
 * @param {string} number - Admission number to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateAdmissionNumber = (number) => {
  if (!number || number.trim() === '') {
    return 'Admission number is required';
  }
  
  const admissionRegex = /^[a-zA-Z0-9/]{3,}$/;
  if (!admissionRegex.test(number)) {
    return 'Admission number must be at least 3 characters (letters, numbers, slash)';
  }
  
  return null;
};

/**
 * Date of birth validation
 * Must be between 3-25 years old
 * @param {Date|string} dob - Date of birth
 * @returns {string|null} Error message or null if valid
 */
export const validateDateOfBirth = (dob) => {
  if (!dob) {
    return 'Date of birth is required';
  }
  
  const date = new Date(dob);
  const today = new Date();
  
  if (!(date instanceof Date && !isNaN(date))) {
    return 'Invalid date format';
  }
  
  if (date > today) {
    return 'Date of birth cannot be in the future';
  }
  
  // Calculate age
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  if (age < 3) {
    return 'Student must be at least 3 years old';
  }
  
  if (age > 25) {
    return 'Student must be 25 years or younger';
  }
  
  return null;
};

/**
 * Age validation
 * @param {Date|string} dateOfBirth - Date of birth
 * @param {number} minAge - Minimum age
 * @param {number} maxAge - Maximum age
 * @returns {string|null} Error message or null if valid
 */
export const validateAge = (dateOfBirth, minAge = 3, maxAge = 25) => {
  if (!dateOfBirth) {
    return 'Date of birth is required';
  }
  
  const date = new Date(dateOfBirth);
  const today = new Date();
  
  if (!(date instanceof Date && !isNaN(date))) {
    return 'Invalid date format';
  }
  
  if (date > today) {
    return 'Date of birth cannot be in the future';
  }
  
  // Calculate age
  let age = today.getFullYear() - date.getFullYear();
  const monthDiff = today.getMonth() - date.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < date.getDate())) {
    age--;
  }
  
  if (age < minAge) {
    return `Age must be at least ${minAge} years`;
  }
  
  if (age > maxAge) {
    return `Age must be ${maxAge} years or younger`;
  }
  
  return null;
};

/**
 * Date validation
 * @param {Date|string} date - Date to validate
 * @param {Date|string} minDate - Minimum date (optional)
 * @param {Date|string} maxDate - Maximum date (optional)
 * @returns {string|null} Error message or null if valid
 */
export const validateDate = (date, minDate = null, maxDate = null) => {
  if (!date) {
    return 'Date is required';
  }
  
  const dateObj = new Date(date);
  
  if (!(dateObj instanceof Date && !isNaN(dateObj))) {
    return 'Invalid date format';
  }
  
  if (minDate) {
    const minDateObj = new Date(minDate);
    if (dateObj < minDateObj) {
      return `Date must be after ${minDateObj.toLocaleDateString()}`;
    }
  }
  
  if (maxDate) {
    const maxDateObj = new Date(maxDate);
    if (dateObj > maxDateObj) {
      return `Date must be before ${maxDateObj.toLocaleDateString()}`;
    }
  }
  
  return null;
};

/**
 * Kenya Grade validation
 * @param {string} grade - Grade to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateKenyaGrade = (grade) => {
  if (!grade || grade.trim() === '') {
    return 'Grade/Class is required';
  }
  
  const validGrades = [
    'pp1', 'pp2',
    'grade_1', 'grade_2', 'grade_3', 'grade_4', 'grade_5', 'grade_6',
    'grade_7', 'grade_8', 'grade_9', 'grade_10', 'grade_11', 'grade_12',
    'form_1', 'form_2', 'form_3', 'form_4',
  ];
  
  if (!validGrades.includes(grade)) {
    return 'Invalid grade selection';
  }
  
  return null;
};

/**
 * Stream/Class validation
 * @param {string} stream - Stream to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateStream = (stream) => {
  if (!stream || stream.trim() === '') {
    return 'Stream/Class is required';
  }
  
  const streamRegex = /^[a-zA-Z0-9\s]{1,20}$/;
  if (!streamRegex.test(stream)) {
    return 'Stream must be 1-20 characters (letters, numbers, spaces)';
  }
  
  return null;
};

/**
 * House name validation
 * @param {string} house - House name to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateHouseName = (house) => {
  if (!house || house.trim() === '') {
    return null; // Optional field
  }
  
  const houseRegex = /^[a-zA-Z\s]{2,30}$/;
  if (!houseRegex.test(house)) {
    return 'House name must be 2-30 characters (letters and spaces only)';
  }
  
  return null;
};

/**
 * Year of admission validation
 * @param {number|string} year - Year to validate
 * @returns {string|null} Error message or null if valid
 */
export const validateYearOfAdmission = (year) => {
  if (!year) {
    return null; // Optional field
  }
  
  const currentYear = new Date().getFullYear();
  const yearNum = parseInt(year);
  
  if (isNaN(yearNum)) {
    return 'Invalid year format';
  }
  
  if (yearNum < 1990) {
    return 'Year must be 1990 or later';
  }
  
  if (yearNum > currentYear + 1) {
    return `Year cannot be beyond ${currentYear + 1}`;
  }
  
  return null;
};

// ============================================================
// PAYMENT VALIDATORS
// ============================================================

/**
 * Payment amount validation
 * @param {number|string} amount - Amount to validate
 * @param {number} min - Minimum amount (default: 1)
 * @param {number} max - Maximum amount (optional)
 * @returns {string|null} Error message or null if valid
 */
export const validateAmount = (amount, min = 1, max = null) => {
  if (!amount) {
    return 'Amount is required';
  }
  
  const numAmount = parseFloat(amount);
  
  if (isNaN(numAmount) || numAmount <= 0) {
    return 'Please enter a valid amount';
  }
  
  if (numAmount < min) {
    return `Amount must be at least KES ${min.toLocaleString()}`;
  }
  
  if (max && numAmount > max) {
    return `Amount cannot exceed KES ${max.toLocaleString()}`;
  }
  
  return null;
};

/**
 * Payment amount validation (alias for validateAmount)
 * @param {number|string} amount - Amount to validate
 * @param {number} minAmount - Minimum amount
 * @param {number} maxAmount - Maximum amount
 * @returns {string|null} Error message or null if valid
 */
export const validatePaymentAmount = (amount, minAmount = 100, maxAmount = null) => {
  return validateAmount(amount, minAmount, maxAmount);
};

/**
 * Minimum payment amount validation
 * @param {number|string} minAmount - Minimum amount to validate
 * @param {number|string} totalAmount - Total amount
 * @returns {string|null} Error message or null if valid
 */
export const validateMinimumPaymentAmount = (minAmount, totalAmount) => {
  if (!minAmount) {
    return 'Minimum payment amount is required';
  }
  
  const min = parseFloat(minAmount);
  const total = parseFloat(totalAmount);
  
  if (isNaN(min) || min <= 0) {
    return 'Please enter a valid minimum amount';
  }
  
  if (isNaN(total) || total <= 0) {
    return 'Invalid total amount';
  }
  
  if (min > total) {
    return 'Minimum payment cannot exceed total amount';
  }
  
  if (min < 100) {
    return 'Minimum payment must be at least KES 100';
  }
  
  return null;
};

/**
 * Partial payment validation
 * @param {Object} paymentRequest - Payment request object
 * @param {number|string} proposedAmount - Proposed payment amount
 * @returns {string|null} Error message or null if valid
 */
export const validatePartialPayment = (paymentRequest, proposedAmount) => {
  const amount = parseFloat(proposedAmount);
  const minAmount = parseFloat(paymentRequest.minimum_payment || 100);
  const balance = parseFloat(
    paymentRequest.balance || 
    (paymentRequest.total_amount - paymentRequest.amount_paid)
  );
  
  if (isNaN(amount) || amount <= 0) {
    return 'Please enter a valid amount';
  }
  
  if (amount < minAmount) {
    return `Amount must be at least KES ${minAmount.toLocaleString()} (minimum payment)`;
  }
  
  if (amount > balance) {
    return `Amount cannot exceed balance of KES ${balance.toLocaleString()}`;
  }
  
  return null;
};

// ============================================================
// COMPLEX VALIDATORS
// ============================================================

/**
 * Validate student data
 * @param {Object} studentData - Student data object
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateStudentData = (studentData) => {
  const errors = {};
  
  // Personal Information
  const firstNameError = validateName(studentData.first_name);
  if (firstNameError) errors.first_name = firstNameError;
  
  if (studentData.middle_name) {
    const middleNameError = validateName(studentData.middle_name);
    if (middleNameError) errors.middle_name = middleNameError;
  }
  
  const lastNameError = validateName(studentData.last_name);
  if (lastNameError) errors.last_name = lastNameError;
  
  const dobError = validateDateOfBirth(studentData.date_of_birth);
  if (dobError) errors.date_of_birth = dobError;
  
  if (studentData.birth_certificate_number) {
    const certError = validateBirthCertificate(studentData.birth_certificate_number);
    if (certError) errors.birth_certificate_number = certError;
  }
  
  // Academic Information
  if (!studentData.education_level) {
    errors.education_level = 'Education level is required';
  }
  
  const gradeError = validateKenyaGrade(studentData.current_grade);
  if (gradeError) errors.current_grade = gradeError;
  
  const admissionError = validateAdmissionNumber(studentData.admission_number);
  if (admissionError) errors.admission_number = admissionError;
  
  if (studentData.upi_number) {
    const upiError = validateUPI(studentData.upi_number);
    if (upiError) errors.upi_number = upiError;
  }
  
  if (studentData.year_of_admission) {
    const yearError = validateYearOfAdmission(studentData.year_of_admission);
    if (yearError) errors.year_of_admission = yearError;
  }
  
  // School Information
  if (!studentData.school_id) {
    errors.school = 'School is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate payment request creation
 * @param {Object} data - Payment request data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validatePaymentRequestCreation = (data) => {
  const errors = {};
  
  // Student
  if (!data.student) {
    errors.student = 'Please select a student';
  }
  
  // Title
  if (!data.title || data.title.trim() === '') {
    errors.title = 'Please enter a title';
  } else if (data.title.length < 5) {
    errors.title = 'Title must be at least 5 characters';
  }
  
  // Amount
  const amountError = validateAmount(data.total_amount, 1);
  if (amountError) errors.total_amount = amountError;
  
  // Due date
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
  
  // Minimum amount if flexible payment
  if (data.flexibility !== 'full_only' && data.minimum_payment) {
    const minError = validateMinimumPaymentAmount(
      data.minimum_payment,
      data.total_amount
    );
    if (minError) errors.minimum_payment = minError;
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate M-Pesa payment
 * @param {Object} data - M-Pesa payment data
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateMpesaPayment = (data) => {
  const errors = {};
  
  // Phone number
  const phoneError = validateMpesaPhone(data.phone_number);
  if (phoneError) errors.phone_number = phoneError;
  
  // Amount
  const amountError = validateAmount(data.amount, 1);
  if (amountError) errors.amount = amountError;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Generic form validation
 * @param {Object} values - Form values
 * @param {Object} rules - Validation rules
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateForm = (values, rules) => {
  const errors = {};
  
  Object.keys(rules).forEach((field) => {
    const fieldRules = rules[field];
    const value = values[field];
    
    // Required validation
    if (fieldRules.required) {
      const requiredError = validateRequired(value, fieldRules.label || field);
      if (requiredError) {
        errors[field] = requiredError;
        return;
      }
    }
    
    // Skip other validations if field is empty and not required
    if (!value) return;
    
    // Email validation
    if (fieldRules.email) {
      const emailError = validateEmail(value);
      if (emailError) errors[field] = emailError;
      return;
    }
    
    // Phone validation
    if (fieldRules.phone) {
      const phoneError = validateKenyanPhone(value);
      if (phoneError) errors[field] = phoneError;
      return;
    }
    
    // Password validation
    if (fieldRules.password) {
      const passwordError = validatePassword(value);
      if (passwordError) errors[field] = passwordError;
      return;
    }
    
    // Min length validation
    if (fieldRules.minLength) {
      const minError = validateMinLength(value, fieldRules.minLength, fieldRules.label || field);
      if (minError) errors[field] = minError;
      return;
    }
    
    // Max length validation
    if (fieldRules.maxLength) {
      const maxError = validateMaxLength(value, fieldRules.maxLength, fieldRules.label || field);
      if (maxError) errors[field] = maxError;
      return;
    }
    
    // Custom validation
    if (fieldRules.custom) {
      const customError = fieldRules.custom(value);
      if (customError) {
        errors[field] = customError;
        return;
      }
    }
  });
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

// ============================================================
// UTILITY FUNCTIONS
// ============================================================

/**
 * Calculate payment percentage
 * @param {number} paidAmount - Amount paid
 * @param {number} totalAmount - Total amount
 * @returns {number} Percentage
 */
export const calculatePaymentPercentage = (paidAmount, totalAmount) => {
  const paid = parseFloat(paidAmount);
  const total = parseFloat(totalAmount);
  
  if (isNaN(paid) || isNaN(total) || total === 0) {
    return 0;
  }
  
  return Math.round((paid / total) * 100);
};

/**
 * Format amount for display
 * @param {number} amount - Amount to format
 * @returns {string} Formatted amount
 */
export const formatAmount = (amount) => {
  const num = parseFloat(amount);
  if (isNaN(num)) return 'KES 0.00';
  return `KES ${num.toLocaleString('en-KE', { 
    minimumFractionDigits: 2, 
    maximumFractionDigits: 2 
  })}`;
};

/**
 * Format Kenyan phone to +254 format
 * @param {string} phone - Phone number
 * @returns {string} Formatted phone
 */
export const formatKenyanPhone = (phone) => {
  if (!phone) return '';
  
  let cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  if (cleaned.startsWith('0')) {
    return '+254' + cleaned.substring(1);
  } else if (cleaned.startsWith('254')) {
    return '+' + cleaned;
  } else if (cleaned.startsWith('+254')) {
    return cleaned;
  }
  
  return phone;
};

// ============================================================
// EXPORTS
// ============================================================

export default {
  // Basic validators
  validateEmail,
  validatePassword,
  validateUsername,
  validateName,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateAmount,
  validateDate,
  validateAge,

  // Kenya-specific validators (matching backend)
  validateKenyanPhone,
  validateMpesaPhone,
  validateUPI,
  validateUPINumber, // Alias
  validateBirthCertificate,
  validateBirthCertificateNumber, // Alias
  validateNEMISCode,
  validateAdmissionNumber,
  validateDateOfBirth,
  validateKenyaGrade,
  validateStream,
  validateHouseName,
  validateYearOfAdmission,

  // Payment validators
  validatePaymentAmount,
  validatePartialPayment,
  validateMinimumPaymentAmount,
  validatePaymentRequestCreation,
  validateMpesaPayment,

  // Complex validators
  validateStudentData,
  validateForm,

  // Utility functions
  calculatePaymentPercentage,
  formatAmount,
  formatKenyanPhone,
};