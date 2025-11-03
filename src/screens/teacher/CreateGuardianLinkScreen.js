import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, HelperText, Text, Searchbar } from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { MAX_GUARDIANS_PER_STUDENT } from '../../utils/constants';

const CreateGuardianLinkScreen = ({ route, navigation }) => {
  const preSelectedStudent = route.params?.student || null;
  
  const [isLoading, setIsLoading] = useState(false);
  const [students, setStudents] = useState([]);
  const [guardians, setGuardians] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    student: preSelectedStudent,
    guardian_email: '',
    guardian_phone: '',
    relationship: 'parent',
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Fetch students and guardians
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const [studentsRes, guardiansRes] = await Promise.all([
      //   studentService.getStudents(),
      //   guardianService.getGuardians(),
      // ]);
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          admission_number: 'NPS001',
          guardians_count: 2,
        },
        {
          id: 2,
          first_name: 'Sarah',
          last_name: 'Smith',
          admission_number: 'NPS002',
          guardians_count: 1,
        },
      ];
      
      setStudents(mockStudents);
    } catch (error) {
      console.error('Fetch data error:', error);
    }
  };

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

    if (!formData.student) {
      newErrors.student = 'Please select a student';
    } else if (formData.student.guardians_count >= MAX_GUARDIANS_PER_STUDENT) {
      newErrors.student = `Student already has maximum ${MAX_GUARDIANS_PER_STUDENT} guardians`;
    }

    if (!formData.guardian_email.trim() && !formData.guardian_phone.trim()) {
      newErrors.guardian = 'Please provide guardian email or phone number';
    }

    if (formData.guardian_email && !isValidEmail(formData.guardian_email)) {
      newErrors.guardian_email = 'Please enter a valid email address';
    }

    if (formData.guardian_phone && !isValidPhone(formData.guardian_phone)) {
      newErrors.guardian_phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone) => {
    return /^[\+]?[0-9]{10,13}$/.test(phone.replace(/\s/g, ''));
  };

  // Handle submit
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check the form and try again');
      return;
    }

    Alert.alert(
      'Confirm Guardian Link',
      `This will send a link request to the guardian. All existing guardians of ${formData.student.first_name} ${formData.student.last_name} must approve within 24 hours. Continue?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send Request',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              // TODO: Replace with actual API call
              // await guardianService.createLinkRequest(formData);
              
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              Alert.alert(
                'Request Sent',
                'Guardian link request has been created. You will be notified once all guardians approve.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to create link request. Please try again.');
              console.error('Create link error:', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Creating link request..." />;
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
        <Text style={styles.sectionTitle}>Select Student</Text>

        {preSelectedStudent ? (
          <StudentCard student={preSelectedStudent} onPress={null} />
        ) : (
          <>
            <Searchbar
              placeholder="Search students"
              onChangeText={setSearchQuery}
              value={searchQuery}
              style={styles.searchBar}
            />
            {/* TODO: Add student list with selection */}
            <Text style={styles.helperText}>
              Search and select a student to link a guardian
            </Text>
          </>
        )}
        {errors.student && (
          <HelperText type="error">{errors.student}</HelperText>
        )}

        <Text style={styles.sectionTitle}>Guardian Information</Text>

        <Text style={styles.infoText}>
          Enter the guardian's email or phone number. They will receive a
          notification to accept the link request.
        </Text>

        {/* Guardian Email */}
        <TextInput
          label="Guardian Email"
          mode="outlined"
          value={formData.guardian_email}
          onChangeText={(text) => updateField('guardian_email', text)}
          error={!!errors.guardian_email}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          left={<TextInput.Icon icon="email" />}
        />
        {errors.guardian_email && (
          <HelperText type="error">{errors.guardian_email}</HelperText>
        )}

        <Text style={styles.orText}>OR</Text>

        {/* Guardian Phone */}
        <TextInput
          label="Guardian Phone Number"
          mode="outlined"
          value={formData.guardian_phone}
          onChangeText={(text) => updateField('guardian_phone', text)}
          error={!!errors.guardian_phone}
          style={styles.input}
          keyboardType="phone-pad"
          placeholder="+254712345678"
          left={<TextInput.Icon icon="phone" />}
        />
        {errors.guardian_phone && (
          <HelperText type="error">{errors.guardian_phone}</HelperText>
        )}

        {errors.guardian && (
          <HelperText type="error">{errors.guardian}</HelperText>
        )}

        {/* Relationship */}
        <Text style={styles.label}>Relationship *</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={formData.relationship}
            onValueChange={(value) => updateField('relationship', value)}
            style={styles.picker}
          >
            <Picker.Item label="Parent" value="parent" />
            <Picker.Item label="Mother" value="mother" />
            <Picker.Item label="Father" value="father" />
            <Picker.Item label="Guardian" value="guardian" />
            <Picker.Item label="Uncle" value="uncle" />
            <Picker.Item label="Aunt" value="aunt" />
            <Picker.Item label="Grandparent" value="grandparent" />
            <Picker.Item label="Sibling" value="sibling" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            ℹ️ Guardian link requests expire in 24 hours. All existing guardians
            must approve before you can provide final approval.
          </Text>
        </View>

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          disabled={isLoading}
        >
          Send Link Request
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
  searchBar: {
    marginBottom: 16,
    elevation: 0,
    backgroundColor: '#FFFFFF',
  },
  helperText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
  },
  infoText: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 16,
    lineHeight: 20,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  orText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 12,
  },
  label: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 8,
    marginTop: 8,
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    marginBottom: 16,
  },
  picker: {
    height: 50,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
  },
  infoBoxText: {
    fontSize: 13,
    color: '#1976D2',
    lineHeight: 18,
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

export default CreateGuardianLinkScreen;