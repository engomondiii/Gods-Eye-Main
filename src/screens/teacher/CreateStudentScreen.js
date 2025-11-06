import React, { useState } from 'react';
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
import { KENYA_EDUCATION_LEVELS, KENYA_ACADEMIC_TERMS } from '../../utils/constants';

const CreateStudentScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state - Personal Information
  const [formData, setFormData] = useState({
    // Personal Information
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: null,
    gender: 'male',
    birth_certificate_number: '',
    
    // School Information (Kenya is default, no country picker)
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
    
    // House System (Optional)
    house_name: '',
    house_color: '',
    
    // Special Needs
    has_special_needs: false,
    special_needs_description: '',
  });

  // Error state
  const [errors, setErrors] = useState({});

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

    // Personal Information Validation
    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    // School Information Validation
    if (!formData.county) {
      newErrors.county = 'County is required';
    }

    if (!formData.school) {
      newErrors.school = 'School is required';
    }

    // Academic Information Validation
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

    // UPI Number Format Validation (Optional but if provided, must be valid)
    if (formData.upi_number.trim() && formData.upi_number.trim().length < 10) {
      newErrors.upi_number = 'UPI number must be at least 10 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please fill in all required fields');
      return;
    }

    try {
      setIsLoading(true);
      
      // Prepare data for API
      const studentData = {
        ...formData,
        // Convert date to ISO string
        date_of_birth: formData.date_of_birth.toISOString().split('T')[0],
        // Extract IDs from objects
        county_id: formData.county.id,
        school_id: formData.school.id,
      };
      
      // TODO: Replace with actual API call
      // const response = await studentService.createStudent(studentData);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    } catch (error) {
      Alert.alert('Error', 'Failed to create student. Please try again.');
      console.error('Create student error:', error);
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
          style={styles.input}
          autoCapitalize="characters"
          keyboardType="numeric"
        />

        <Divider style={styles.divider} />

        {/* SECTION 2: SCHOOL INFORMATION */}
        <Text style={styles.sectionTitle}>School Information</Text>
        <Text style={styles.sectionSubtitle}>Kenya schools only (Country: Kenya)</Text>

        {/* County Picker */}
        <CountyPicker
          countryId={1} // Kenya is always ID 1 in your system
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
            />
            {errors.school && (
              <HelperText type="error">{errors.school}</HelperText>
            )}
          </>
        )}

        <Divider style={styles.divider} />

        {/* SECTION 3: ACADEMIC INFORMATION */}
        <Text style={styles.sectionTitle}>Academic Information (CBC System)</Text>

        {/* Education Level */}
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
          placeholder="e.g., ADM/2025/001"
        />
        {errors.admission_number && (
          <HelperText type="error">{errors.admission_number}</HelperText>
        )}

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
        <HelperText type="info">
          Optional: UPI number from Ministry of Education
        </HelperText>

        {/* Year of Admission */}
        <TextInput
          label="Year of Admission *"
          mode="outlined"
          value={formData.year_of_admission}
          onChangeText={(text) => updateField('year_of_admission', text)}
          style={styles.input}
          keyboardType="numeric"
          maxLength={4}
        />

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

        {/* SECTION 4: HOUSE SYSTEM (OPTIONAL) */}
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

        {/* SECTION 5: SPECIAL NEEDS (OPTIONAL) */}
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
    marginBottom: theme.spacing.xl,
  },
});

export default CreateStudentScreen;