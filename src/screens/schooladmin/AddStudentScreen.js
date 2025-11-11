import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, HelperText, Text, RadioButton } from 'react-native-paper';
import DatePicker from '../../components/form/DatePicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { KENYA_GRADES, KENYA_EDUCATION_LEVELS } from '../../utils/constants';

const AddStudentScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    date_of_birth: null,
    gender: 'Male',
    birth_certificate_number: '',
    admission_number: '',
    current_grade: KENYA_GRADES.GRADE_1,
    stream: '',
    upi_number: '',
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Update form field
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
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

    if (!formData.current_grade) {
      newErrors.current_grade = 'Grade is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check the form and try again');
      return;
    }

    Alert.alert(
      'Confirm',
      `Add ${formData.first_name} ${formData.last_name} as a student?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Student',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              // TODO: Replace with actual API call
              // await schoolAdminService.addStudent(formData);
              
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              Alert.alert(
                'Success',
                'Student added successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to add student. Please try again.');
              console.error('Add student error:', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Adding student..." />;
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
        <Text style={styles.sectionTitle}>Personal Information</Text>

        {/* First Name */}
        <TextInput
          label="First Name *"
          mode="outlined"
          value={formData.first_name}
          onChangeText={(text) => updateField('first_name', text)}
          error={!!errors.first_name}
          style={styles.input}
        />
        {errors.first_name && (
          <HelperText type="error">{errors.first_name}</HelperText>
        )}

        {/* Middle Name */}
        <TextInput
          label="Middle Name"
          mode="outlined"
          value={formData.middle_name}
          onChangeText={(text) => updateField('middle_name', text)}
          style={styles.input}
        />

        {/* Last Name */}
        <TextInput
          label="Last Name *"
          mode="outlined"
          value={formData.last_name}
          onChangeText={(text) => updateField('last_name', text)}
          error={!!errors.last_name}
          style={styles.input}
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
        <Text style={styles.label}>Gender *</Text>
        <RadioButton.Group
          onValueChange={(value) => updateField('gender', value)}
          value={formData.gender}
        >
          <View style={styles.radioContainer}>
            <View style={styles.radioItem}>
              <RadioButton value="Male" />
              <Text>Male</Text>
            </View>
            <View style={styles.radioItem}>
              <RadioButton value="Female" />
              <Text>Female</Text>
            </View>
          </View>
        </RadioButton.Group>

        {/* Birth Certificate Number */}
        <TextInput
          label="Birth Certificate Number"
          mode="outlined"
          value={formData.birth_certificate_number}
          onChangeText={(text) => updateField('birth_certificate_number', text)}
          style={styles.input}
          left={<TextInput.Icon icon="certificate" />}
        />

        <Text style={styles.sectionTitle}>School Information</Text>

        {/* Admission Number */}
        <TextInput
          label="Admission Number *"
          mode="outlined"
          value={formData.admission_number}
          onChangeText={(text) => updateField('admission_number', text)}
          error={!!errors.admission_number}
          style={styles.input}
          left={<TextInput.Icon icon="card-account-details" />}
          placeholder="ADM/2025/001"
        />
        {errors.admission_number && (
          <HelperText type="error">{errors.admission_number}</HelperText>
        )}

        {/* UPI Number */}
        <TextInput
          label="UPI Number"
          mode="outlined"
          value={formData.upi_number}
          onChangeText={(text) => updateField('upi_number', text)}
          style={styles.input}
          left={<TextInput.Icon icon="identifier" />}
          placeholder="UPI1234567890"
        />

        {/* Current Grade */}
        <TextInput
          label="Current Grade *"
          mode="outlined"
          value={formData.current_grade}
          onChangeText={(text) => updateField('current_grade', text)}
          error={!!errors.current_grade}
          style={styles.input}
          left={<TextInput.Icon icon="school" />}
          placeholder="Grade 1"
        />
        {errors.current_grade && (
          <HelperText type="error">{errors.current_grade}</HelperText>
        )}

        {/* Stream */}
        <TextInput
          label="Stream/Class"
          mode="outlined"
          value={formData.stream}
          onChangeText={(text) => updateField('stream', text)}
          style={styles.input}
          left={<TextInput.Icon icon="google-classroom" />}
          placeholder="Red, Blue, Green, etc."
        />

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          disabled={isLoading}
          icon="account-plus"
        >
          Add Student
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
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginTop: 8,
    marginBottom: 8,
  },
  radioContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  radioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 24,
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

export default AddStudentScreen;