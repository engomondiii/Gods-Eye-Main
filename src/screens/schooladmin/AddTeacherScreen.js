import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, HelperText, Text, Switch } from 'react-native-paper';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AddTeacherScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone: '',
    employee_number: '',
    subject_specialization: '',
    is_active: true,
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^(\+254|0)[17]\d{8}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid Kenyan phone number';
    }

    if (!formData.employee_number.trim()) {
      newErrors.employee_number = 'Employee number is required';
    }

    if (!formData.subject_specialization.trim()) {
      newErrors.subject_specialization = 'Subject specialization is required';
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
      `Add ${formData.first_name} ${formData.last_name} as a teacher?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Add Teacher',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              // TODO: Replace with actual API call
              // await schoolAdminService.addTeacher(formData);
              
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              Alert.alert(
                'Success',
                'Teacher added successfully!',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to add teacher. Please try again.');
              console.error('Add teacher error:', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Adding teacher..." />;
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

        <Text style={styles.sectionTitle}>Contact Information</Text>

        {/* Email */}
        <TextInput
          label="Email *"
          mode="outlined"
          value={formData.email}
          onChangeText={(text) => updateField('email', text)}
          error={!!errors.email}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
        />
        {errors.email && (
          <HelperText type="error">{errors.email}</HelperText>
        )}

        {/* Phone */}
        <TextInput
          label="Phone Number *"
          mode="outlined"
          value={formData.phone}
          onChangeText={(text) => updateField('phone', text)}
          error={!!errors.phone}
          style={styles.input}
          keyboardType="phone-pad"
          left={<TextInput.Icon icon="phone" />}
          placeholder="+254712345678"
        />
        {errors.phone && (
          <HelperText type="error">{errors.phone}</HelperText>
        )}

        <Text style={styles.sectionTitle}>Employment Details</Text>

        {/* Employee Number */}
        <TextInput
          label="Employee Number *"
          mode="outlined"
          value={formData.employee_number}
          onChangeText={(text) => updateField('employee_number', text)}
          error={!!errors.employee_number}
          style={styles.input}
          left={<TextInput.Icon icon="badge-account" />}
          placeholder="EMP001"
        />
        {errors.employee_number && (
          <HelperText type="error">{errors.employee_number}</HelperText>
        )}

        {/* Subject Specialization */}
        <TextInput
          label="Subject Specialization *"
          mode="outlined"
          value={formData.subject_specialization}
          onChangeText={(text) => updateField('subject_specialization', text)}
          error={!!errors.subject_specialization}
          style={styles.input}
          left={<TextInput.Icon icon="book-open-variant" />}
          placeholder="e.g., Mathematics, English, Science"
        />
        {errors.subject_specialization && (
          <HelperText type="error">{errors.subject_specialization}</HelperText>
        )}

        {/* Active Status */}
        <View style={styles.switchContainer}>
          <View style={styles.switchLeft}>
            <Text style={styles.switchLabel}>Active Status</Text>
            <Text style={styles.switchDescription}>
              Is this teacher currently active?
            </Text>
          </View>
          <Switch
            value={formData.is_active}
            onValueChange={(value) => updateField('is_active', value)}
            color="#6200EE"
          />
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          disabled={isLoading}
          icon="account-plus"
        >
          Add Teacher
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
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginVertical: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  switchLeft: {
    flex: 1,
    marginRight: 16,
  },
  switchLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  switchDescription: {
    fontSize: 13,
    color: '#757575',
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

export default AddTeacherScreen;