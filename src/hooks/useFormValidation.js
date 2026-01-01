// ========================================
// GOD'S EYE EDTECH - FORM VALIDATION HOOK
// Real-time validation hook for forms
// ========================================

import { useState, useEffect, useCallback } from 'react';
import { validateForm } from '../utils/validators';

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} validationRules - Validation rules
 * @returns {Object} Form state and handlers
 */
export const useFormValidation = (initialValues = {}, validationRules = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isValid, setIsValid] = useState(false);

  // Validate form whenever values change
  useEffect(() => {
    const validation = validateForm(values, validationRules);
    setErrors(validation.errors);
    setIsValid(validation.isValid);
  }, [values, validationRules]);

  // Handle field change
  const handleChange = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Handle field blur
  const handleBlur = useCallback((field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }, []);

  // Reset form
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  // Set field error manually
  const setFieldError = useCallback((field, error) => {
    setErrors((prev) => ({ ...prev, [field]: error }));
  }, []);

  // Set field value manually
  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  // Get field error (only if touched)
  const getFieldError = useCallback(
    (field) => {
      return touched[field] ? errors[field] : null;
    },
    [errors, touched]
  );

  // Mark all fields as touched (for submit)
  const touchAll = useCallback(() => {
    const allTouched = Object.keys(validationRules).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {});
    setTouched(allTouched);
  }, [validationRules]);

  return {
    values,
    errors,
    touched,
    isSubmitting,
    isValid,
    handleChange,
    handleBlur,
    reset,
    setFieldError,
    setFieldValue,
    getFieldError,
    touchAll,
    setIsSubmitting,
    setValues,
  };
};

export default useFormValidation;