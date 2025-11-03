import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, HelperText, Text } from 'react-native-paper';
import DatePicker from '../../components/form/DatePicker';
import CountryPicker from '../../components/form/CountryPicker';
import CountyPicker from '../../components/form/CountyPicker';
import SchoolPicker from '../../components/form/SchoolPicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CreateStudentScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    date_of_birth: null,
    admission_number: '',
    country: null,
    county: null,
    school: null,
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

    if (!formData.first_name.trim()) {
      newErrors.first_name = 'First name is required';
    }

    if (!formData.last_name.trim()) {
      newErrors.last_name = 'Last name is required';
    }

    if (!formData.date_of_birth) {
      newErrors.date_of_birth = 'Date of birth is required';
    }

    if (!formData.admission_number.trim()) {
      newErrors.admission_number = 'Admission number is required';
    }

    if (!formData.country) {
      newErrors.country = 'Country is required';
    }

    if (!formData.county) {
      newErrors.county = 'County is required';
    }

    if (!formData.school) {
      newErrors.school = 'School is required';
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
      
      // TODO: Replace with actual API call
      // const response = await studentService.createStudent(formData);
      
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
        <Text style={styles.sectionTitle}>Student Information</Text>

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

        {/* Admission Number */}
        <TextInput
          label="Admission Number *"
          mode="outlined"
          value={formData.admission_number}
          onChangeText={(text) => updateField('admission_number', text)}
          error={!!errors.admission_number}
          style={styles.input}
          autoCapitalize="characters"
        />
        {errors.admission_number && (
          <HelperText type="error">{errors.admission_number}</HelperText>
        )}

        <Text style={styles.sectionTitle}>School Information</Text>

        {/* Country Picker */}
        <CountryPicker
          value={formData.country}
          onChange={(country) => {
            updateField('country', country);
            updateField('county', null);
            updateField('school', null);
          }}
          error={!!errors.country}
        />
        {errors.country && (
          <HelperText type="error">{errors.country}</HelperText>
        )}

        {/* County Picker */}
        {formData.country && (
          <>
            <CountyPicker
              countryId={formData.country.id}
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
          </>
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
    backgroundColor: '#F5F5F5',
  },
  scrollContent: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 16,
    marginBottom: 16,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 12,
    backgroundColor: '#6200EE',
  },
  submitButtonContent: {
    height: 50,
  },
  cancelButton: {
    marginBottom: 24,
  },
});

export default CreateStudentScreen;