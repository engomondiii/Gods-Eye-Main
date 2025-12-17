// ========================================
// GOD'S EYE EDTECH - CREATE STUDENT SCREEN
// ========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, HelperText, Text, SegmentedButtons, Divider } from 'react-native-paper';
import DatePicker from '../../components/form/DatePicker';
import CountyPicker from '../../components/form/CountyPicker';
import SchoolPicker from '../../components/form/SchoolPicker';
import GradePicker from '../../components/form/GradePicker';
import StreamPicker from '../../components/form/StreamPicker';
import HousePicker from '../../components/form/HousePicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import theme from '../../styles/theme';
import { KENYA_ACADEMIC_TERMS } from '../../utils/constants';
import * as studentService from '../../services/studentService';

const CreateStudentScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: null,
    gender: 'male',
    birth_certificate_number: '',
    
    // School Information
    county: null,
    school: null,
    
    // Academic Information
    education_level: '',
    current_grade: '',
    stream: '',
    admission_number: '',
    upi_number: '',
    year_of_admission: new Date().getFullYear().toString(),
    current_term: 'term_1',
    
    // House System
    house_name: '',
    house_color: '',
    
    // Special Needs
    has_special_needs: false,
    special_needs_description: '',
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Auto-generate admission number when school is selected
  useEffect(() => {
    if (formData.school && !formData.admission_number) {
      generateAdmissionNumber();
    }
  }, [formData.school]);

  // Generate admission number
  const generateAdmissionNumber = async () => {
    try {
      const response = await studentService.generateAdmissionNumber(formData.school.id);
      if (response.success) {
        updateField('admission_number', response.data.admission_number);
      }
    } catch (error) {
      console.error('Generate admission number error:', error);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    // Clear error when user types
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Personal Information
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    } else {
      // Validate age (3-25 years)
      const age = Math.floor((new Date() - formData.date_of_birth) / (365.25 * 24 * 60 * 60 * 1000));
      if (age < 3) {
        newErrors.date_of_birth = 'Student must be at least 3 years old';
      } else if (age > 25) {
        newErrors.date_of_birth = 'Student age cannot exceed 25 years';
      }
    }

    // Birth certificate (optional but if provided, must be valid)
    if (formData.birth_certificate_number.trim()) {
      if (!/^\d+$/.test(formData.birth_certificate_number)) {
        newErrors.birth_certificate_number = 'Birth certificate must contain only digits';
      } else if (formData.birth_certificate_number.length < 6 || formData.birth_certificate_number.length > 10) {
        newErrors.birth_certificate_number = 'Birth certificate must be 6-10 digits';
      }
    }

    // School Information
    if (!formData.county) {
      newErrors.county = 'County is required';
    }

    if (!formData.school) {
      newErrors.school = 'School is required';
    }

    // Academic Information
    if (!formData.education_level) {
      newErrors.education_level = 'Education level is required';
    }

    if (!formData.current_grade) {
      newErrors.current_grade = 'Grade/Class is required';
    }

    if (!formData.stream.trim()) {
      newErrors.stream = 'Stream/Class is required';
    }

    if (!formData.admission_number.trim()) {
      newErrors.admission_number = 'Admission number is required';
    }

    // UPI Number (optional but if provided, must be valid)
    if (formData.upi_number.trim() && formData.upi_number.trim().length < 10) {
      newErrors.upi_number = 'UPI number must be at least 10 characters';
    }

    // Year of admission
    const currentYear = new Date().getFullYear();
    const admissionYear = parseInt(formData.year_of_admission);
    if (isNaN(admissionYear) || admissionYear < 1990 || admissionYear > currentYear + 1) {
      newErrors.year_of_admission = `Year must be between 1990 and ${currentYear + 1}`;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields correctly');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data for API
      const studentData = {
        first_name: formData.first_name.trim(),
        middle_name: formData.middle_name.trim() || null,
        last_name: formData.last_name.trim(),
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0],
        gender: formData.gender,
        birth_certificate_number: formData.birth_certificate_number.trim() || null,
        county: formData.county.id,
        school: formData.school.id,
        education_level: formData.education_level,
        current_grade: formData.current_grade,
        stream: formData.stream.trim(),
        admission_number: formData.admission_number.trim(),
        upi_number: formData.upi_number.trim() || null,
        year_of_admission: parseInt(formData.year_of_admission),
        current_term: formData.current_term,
        house_name: formData.house_name.trim() || null,
        house_color: formData.house_color.trim() || null,
        has_special_needs: formData.has_special_needs,
        special_needs_description: formData.has_special_needs ? formData.special_needs_description.trim() : null,
      };
      
      const response = await studentService.createStudent(studentData);
      
      if (response.success) {
        Alert.alert(
          'Success',
          'Student created successfully!',
          [
            {
              text: 'OK',
              onPress: () => navigation.goBack(),
            },
          ]
        );
      } else {
        throw new Error(response.message || 'Failed to create student');
      }
    } catch (error) {
      console.error('Create student error:', error);
      
      // Handle specific validation errors
      if (error.response?.data) {
        const backendErrors = error.response.data;
        const newErrors = {};
        
        Object.keys(backendErrors).forEach(key => {
          if (Array.isArray(backendErrors[key])) {
            newErrors[key] = backendErrors[key][0];
          } else {
            newErrors[key] = backendErrors[key];
          }
        });
        
        setErrors(newErrors);
        Alert.alert('Validation Error', 'Please check the form for errors');
      } else {
        Alert.alert('Error', error.message || 'Failed to create student. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Creating student..." />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: PERSONAL INFORMATION */}
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {/* First Name */}
        <TextInput
          label="First Name *"
          mode="outlined"
          value={formData.first_name}
          onChangeText={(text) => updateField('first_name', text)}
          error={!!errors.first_name}
          style={styles.input}
          autoCapitalize="words"
        />
        {errors.first_name && (
          <HelperText type="error">{errors.first_name}</HelperText>
        )}

        {/* Middle Name */}
        <TextInput
          label="Middle Name (Common in Kenya)"
          mode="outlined"
          value={formData.middle_name}
          onChangeText={(text) => updateField('middle_name', text)}
          style={styles.input}
          autoCapitalize="words"
        />

        {/* Last Name */}
        <TextInput
          label="Last Name *"
          mode="outlined"
          value={formData.last_name}
          onChangeText={(text) => updateField('last_name', text)}
          error={!!errors.last_name}
          style={styles.input}
          autoCapitalize="words"
        />
        {errors.last_name && (
          <HelperText type="error">{errors.last_name}</HelperText>
        )}

        {/* Date of Birth */}
        <DatePicker
          label="Date of Birth *"
          value={formData.date_of_birth}
          onChange={(date) => updateField('date_of_birth', date)}
          error={!!errors.date_of_birth}
          maximumDate={new Date()}
        />
        {errors.date_of_birth && (
          <HelperText type="error">{errors.date_of_birth}</HelperText>
        )}

        {/* Gender */}
        <Text style={styles.fieldLabel}>Gender *</Text>
        <SegmentedButtons
          value={formData.gender}
          onValueChange={(value) => updateField('gender', value)}
          buttons={[
            { value: 'male', label: 'Male' },
            { value: 'female', label: 'Female' },
            { value: 'other', label: 'Other' },
          ]}
          style={styles.segmentedButtons}
        />

        {/* Birth Certificate Number */}
        <TextInput
          label="Birth Certificate Number"
          mode="outlined"
          value={formData.birth_certificate_number}
          onChangeText={(text) => updateField('birth_certificate_number', text)}
          error={!!errors.birth_certificate_number}
          style={styles.input}
          keyboardType="numeric"
          placeholder="6-10 digits"
        />
        {errors.birth_certificate_number && (
          <HelperText type="error">{errors.birth_certificate_number}</HelperText>
        )}
        <HelperText type="info">Optional: Kenya birth certificate number</HelperText>

        <Divider style={styles.divider} />

        {/* SECTION 2: SCHOOL INFORMATION */}
        <Text style={styles.sectionTitle}>School Information</Text>
        <Text style={styles.sectionSubtitle}>Kenya schools only (Country: Kenya)</Text>

        {/* County Picker */}
        <CountyPicker
          value={formData.county}
          onChange={(county) => {
            updateField('county', county);
            updateField('school', null);
          }}
          error={!!errors.county}
        />
        {errors.county && (
          <HelperText type="error">{errors.county}</HelperText>
        )}

        {/* School Picker */}
        {formData.county && (
          <>
            <SchoolPicker
              countyId={formData.county.id}
              value={formData.school}
              onChange={(school) => updateField('school', school)}
              error={!!errors.school}
              approvedOnly
            />
            {errors.school && (
              <HelperText type="error">{errors.school}</HelperText>
            )}
          </>
        )}

        <Divider style={styles.divider} />

        {/* SECTION 3: ACADEMIC INFORMATION */}
        <Text style={styles.sectionTitle}>Academic Information (CBC System)</Text>

        {/* Grade Picker */}
        <GradePicker
          value={formData.current_grade}
          onGradeChange={(grade) => updateField('current_grade', grade)}
          onLevelChange={(level) => updateField('education_level', level)}
          error={!!errors.current_grade}
        />
        {errors.current_grade && (
          <HelperText type="error">{errors.current_grade}</HelperText>
        )}

        {/* Stream/Class */}
        <StreamPicker
          value={formData.stream}
          onChange={(stream) => updateField('stream', stream)}
          error={!!errors.stream}
        />
        {errors.stream && (
          <HelperText type="error">{errors.stream}</HelperText>
        )}

        {/* Admission Number */}
        <TextInput
          label="Admission/Registration Number *"
          mode="outlined"
          value={formData.admission_number}
          onChangeText={(text) => updateField('admission_number', text)}
          error={!!errors.admission_number}
          style={styles.input}
          autoCapitalize="characters"
          placeholder="e.g., 0012-001"
          right={
            formData.school && (
              <TextInput.Icon
                icon="refresh"
                onPress={generateAdmissionNumber}
              />
            )
          }
        />
        {errors.admission_number && (
          <HelperText type="error">{errors.admission_number}</HelperText>
        )}
        <HelperText type="info">Auto-generated, but you can edit it</HelperText>

        {/* UPI Number */}
        <TextInput
          label="UPI Number (Unique Personal Identifier)"
          mode="outlined"
          value={formData.upi_number}
          onChangeText={(text) => updateField('upi_number', text)}
          error={!!errors.upi_number}
          style={styles.input}
          autoCapitalize="characters"
          placeholder="Issued by Ministry of Education"
        />
        {errors.upi_number && (
          <HelperText type="error">{errors.upi_number}</HelperText>
        )}
        <HelperText type="info">Optional: 10+ character UPI from MOE</HelperText>

        {/* Year of Admission */}
        <TextInput
          label="Year of Admission *"
          mode="outlined"
          value={formData.year_of_admission}
          onChangeText={(text) => updateField('year_of_admission', text)}
          error={!!errors.year_of_admission}
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
        />
        {errors.year_of_admission && (
          <HelperText type="error">{errors.year_of_admission}</HelperText>
        )}

        {/* Current Term */}
        <Text style={styles.fieldLabel}>Current Term *</Text>
        <SegmentedButtons
          value={formData.current_term}
          onValueChange={(value) => updateField('current_term', value)}
          buttons={[
            { value: 'term_1', label: 'Term 1' },
            { value: 'term_2', label: 'Term 2' },
            { value: 'term_3', label: 'Term 3' },
          ]}
          style={styles.segmentedButtons}
        />

        <Divider style={styles.divider} />

        {/* SECTION 4: HOUSE SYSTEM */}
        <Text style={styles.sectionTitle}>House System (Optional)</Text>
        <Text style={styles.sectionSubtitle}>
          Common in Kenyan secondary schools for competitions
        </Text>

        <HousePicker
          houseName={formData.house_name}
          houseColor={formData.house_color}
          onHouseChange={(house) => updateField('house_name', house)}
          onColorChange={(color) => updateField('house_color', color)}
        />

        <Divider style={styles.divider} />

        {/* SECTION 5: SPECIAL NEEDS */}
        <Text style={styles.sectionTitle}>Special Needs (Optional)</Text>

        <SegmentedButtons
          value={formData.has_special_needs ? 'yes' : 'no'}
          onValueChange={(value) => updateField('has_special_needs', value === 'yes')}
          buttons={[
            { value: 'no', label: 'No Special Needs' },
            { value: 'yes', label: 'Has Special Needs' },
          ]}
          style={styles.segmentedButtons}
        />

        {formData.has_special_needs && (
          <TextInput
            label="Special Needs Description"
            mode="outlined"
            value={formData.special_needs_description}
            onChangeText={(text) => updateField('special_needs_description', text)}
            style={styles.input}
            multiline
            numberOfLines={3}
            placeholder="Describe any learning disabilities, physical disabilities, or medical conditions"
          />
        )}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          disabled={isLoading}
          loading={isLoading}
        >
          Create Student
        </Button>

        {/* Cancel Button */}
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          disabled={isLoading}
        >
          Cancel
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.h4,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.xs,
  },
  sectionSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  fieldLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  input: {
    marginBottom: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
  },
  segmentedButtons: {
    marginBottom: theme.spacing.md,
  },
  divider: {
    marginVertical: theme.spacing.lg,
    backgroundColor: theme.colors.border,
  },
  submitButton: {
    marginTop: theme.spacing.xl,
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.primary,
  },
  submitButtonContent: {
    height: 50,
  },
  cancelButton: {
    marginBottom: theme.spacing.md,
  },
});

export default CreateStudentScreen;