import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, HelperText, Text, Searchbar } from 'react-native-paper';
import DatePicker from '../../components/form/DatePicker';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CreatePaymentRequestScreen = ({ route, navigation }) => {
  const preSelectedStudent = route.params?.student || null;
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    student: preSelectedStudent,
    amount: '',
    purpose: '',
    due_date: null,
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

    if (!formData.student) {
      newErrors.student = 'Please select a student';
    }

    if (!formData.amount.trim()) {
      newErrors.amount = 'Amount is required';
    } else if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!formData.purpose.trim()) {
      newErrors.purpose = 'Payment purpose is required';
    } else if (formData.purpose.length < 10) {
      newErrors.purpose = 'Please provide a detailed purpose (minimum 10 characters)';
    }

    if (!formData.due_date) {
      newErrors.due_date = 'Due date is required';
    } else if (new Date(formData.due_date) < new Date()) {
      newErrors.due_date = 'Due date must be in the future';
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

    const amount = parseFloat(formData.amount);
    
    Alert.alert(
      'Confirm Payment Request',
      `Create payment request of KES ${amount.toFixed(2)} for ${formData.student.first_name} ${formData.student.last_name}?\n\nAll guardians will be notified.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Request',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              // TODO: Replace with actual API call
              // await paymentService.createPaymentRequest(formData);
              
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              Alert.alert(
                'Success',
                'Payment request created successfully! All guardians have been notified.',
                [
                  {
                    text: 'OK',
                    onPress: () => navigation.goBack(),
                  },
                ]
              );
            } catch (error) {
              Alert.alert('Error', 'Failed to create payment request. Please try again.');
              console.error('Create payment error:', error);
            } finally {
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Creating payment request..." />;
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
              Search and select a student to create payment request
            </Text>
          </>
        )}
        {errors.student && (
          <HelperText type="error">{errors.student}</HelperText>
        )}

        <Text style={styles.sectionTitle}>Payment Details</Text>

        {/* Amount */}
        <TextInput
          label="Amount (KES) *"
          mode="outlined"
          value={formData.amount}
          onChangeText={(text) => updateField('amount', text)}
          error={!!errors.amount}
          style={styles.input}
          keyboardType="decimal-pad"
          left={<TextInput.Icon icon="currency-usd" />}
          placeholder="0.00"
        />
        {errors.amount && (
          <HelperText type="error">{errors.amount}</HelperText>
        )}

        {/* Purpose */}
        <TextInput
          label="Payment Purpose *"
          mode="outlined"
          value={formData.purpose}
          onChangeText={(text) => updateField('purpose', text)}
          error={!!errors.purpose}
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="e.g., School fees for Term 1, 2025"
        />
        {errors.purpose && (
          <HelperText type="error">{errors.purpose}</HelperText>
        )}

        {/* Due Date */}
        <DatePicker
          label="Due Date *"
          value={formData.due_date}
          onChange={(date) => updateField('due_date', date)}
          error={!!errors.due_date}
          minimumDate={new Date()}
        />
        {errors.due_date && (
          <HelperText type="error">{errors.due_date}</HelperText>
        )}

        {/* Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            ℹ️ All linked guardians will receive a notification about this payment
            request. They can view and approve it through their guardian portal.
          </Text>
        </View>

        {/* Preview Box */}
        {formData.amount && formData.student && (
          <View style={styles.previewBox}>
            <Text style={styles.previewTitle}>Payment Summary</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Student:</Text>
              <Text style={styles.previewValue}>
                {formData.student.first_name} {formData.student.last_name}
              </Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Amount:</Text>
              <Text style={[styles.previewValue, styles.amountText]}>
                KES {parseFloat(formData.amount || 0).toFixed(2)}
              </Text>
            </View>
            {formData.due_date && (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Due Date:</Text>
                <Text style={styles.previewValue}>
                  {new Date(formData.due_date).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          disabled={isLoading}
          icon="cash-plus"
        >
          Create Payment Request
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
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
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
  previewBox: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  previewTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  previewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  previewLabel: {
    fontSize: 14,
    color: '#757575',
  },
  previewValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  amountText: {
    fontSize: 18,
    color: '#6200EE',
    fontWeight: 'bold',
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

export default CreatePaymentRequestScreen;