// ========================================
// CREATE PAYMENT REQUEST SCREEN - TEACHER
// Backend Integration: POST /api/payments/requests/
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
import {
  TextInput,
  Button,
  HelperText,
  Text,
  Switch,
  RadioButton,
  Card,
} from 'react-native-paper';
import { Picker } from '@react-native-picker/picker';
import DatePicker from '../../components/form/DatePicker';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import {
  PAYMENT_FLEXIBILITY,
  PAYMENT_FLEXIBILITY_LABELS,
  KENYA_ACADEMIC_TERMS,
  KENYA_ACADEMIC_TERM_LABELS,
} from '../../utils/constants';
import {
  validatePaymentAmount,
  validateMinimumPaymentAmount,
  validatePaymentRequestCreation,
} from '../../utils/validators';
import * as paymentService from '../../services/paymentService';
import { useAuth } from '../../contexts/AuthContext';

const CreatePaymentRequestScreen = ({ route, navigation }) => {
  const { user } = useAuth();
  const preSelectedStudent = route.params?.student || null;

  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    student: preSelectedStudent,
    guardian: null, // Will be selected from student's guardians
    title: '',
    description: '',
    total_amount: '',
    flexibility: PAYMENT_FLEXIBILITY.FLEXIBLE,
    minimum_payment: '',
    due_date: null,
    academic_year: new Date().getFullYear().toString(),
    term: KENYA_ACADEMIC_TERMS.TERM_1,
  });

  // Available guardians for selected student
  const [guardians, setGuardians] = useState([]);

  // Error state
  const [errors, setErrors] = useState({});

  // Load student's guardians when student is selected
  useEffect(() => {
    if (formData.student) {
      loadStudentGuardians();
    }
  }, [formData.student]);

  const loadStudentGuardians = async () => {
    try {
      setIsLoading(true);
      // Fetch guardians linked to this student
      // In real implementation, this would call studentService.getStudentGuardians(studentId)
      // For now, using mock data
      const mockGuardians = [
        {
          id: 1,
          user: {
            first_name: 'Jane',
            last_name: 'Doe',
            phone: '254712345678',
          },
          relationship: 'mother',
        },
      ];

      setGuardians(mockGuardians);

      // Auto-select first guardian if only one
      if (mockGuardians.length === 1) {
        updateField('guardian', mockGuardians[0].id);
      }
    } catch (error) {
      console.error('Error loading guardians:', error);
      Alert.alert('Error', 'Failed to load student guardians');
    } finally {
      setIsLoading(false);
    }
  };

  // Update form field
  const updateField = (field, value) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }

    // Auto-calculate minimum payment when flexibility changes or amount changes
    if (field === 'flexibility' || field === 'total_amount') {
      handleFlexibilityChange(
        field === 'flexibility' ? value : formData.flexibility,
        field === 'total_amount' ? value : formData.total_amount
      );
    }
  };

  // Handle flexibility change
  const handleFlexibilityChange = (flexibility, amount) => {
    if (flexibility === PAYMENT_FLEXIBILITY.FULL_ONLY) {
      // Reset minimum payment for full_only
      setFormData((prev) => ({
        ...prev,
        minimum_payment: '',
        flexibility,
      }));
    } else if (amount) {
      // Calculate default minimum (20% of total)
      const totalAmount = parseFloat(amount);
      if (!isNaN(totalAmount)) {
        const defaultMin = Math.round(totalAmount * 0.2);
        setFormData((prev) => ({
          ...prev,
          minimum_payment: defaultMin.toString(),
          flexibility,
        }));
      }
    }
  };

  // Calculate suggested minimum amounts
  const calculateSuggestedMinimum = () => {
    if (!formData.total_amount) return null;
    const amount = parseFloat(formData.total_amount);
    if (isNaN(amount)) return null;

    return {
      ten: Math.round(amount * 0.1),
      twenty: Math.round(amount * 0.2),
      thirty: Math.round(amount * 0.3),
      fifty: Math.round(amount * 0.5),
    };
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};

    // Student validation
    if (!formData.student) {
      newErrors.student = 'Please select a student';
    }

    // Guardian validation
    if (!formData.guardian) {
      newErrors.guardian = 'Please select a guardian';
    }

    // Title validation
    if (!formData.title || formData.title.trim().length < 5) {
      newErrors.title = 'Title must be at least 5 characters';
    }

    // Amount validation
    const amountValidation = validatePaymentAmount(
      formData.total_amount,
      100
    );
    if (!amountValidation.isValid) {
      newErrors.total_amount = amountValidation.message;
    }

    // Due date validation
    if (!formData.due_date) {
      newErrors.due_date = 'Please select a due date';
    } else {
      const dueDate = new Date(formData.due_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (dueDate < today) {
        newErrors.due_date = 'Due date cannot be in the past';
      }
    }

    // Minimum payment validation (for flexible/installment)
    if (
      formData.flexibility !== PAYMENT_FLEXIBILITY.FULL_ONLY &&
      formData.total_amount
    ) {
      const minValidation = validateMinimumPaymentAmount(
        formData.minimum_payment,
        formData.total_amount
      );
      if (!minValidation.isValid) {
        newErrors.minimum_payment = minValidation.message;
      }
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

    const amount = parseFloat(formData.total_amount);
    const minAmount =
      formData.flexibility !== PAYMENT_FLEXIBILITY.FULL_ONLY
        ? parseFloat(formData.minimum_payment)
        : amount;

    // Build confirmation message
    const studentName = `${formData.student.first_name} ${formData.student.last_name}`;
    const flexibilityLabel =
      PAYMENT_FLEXIBILITY_LABELS[formData.flexibility];

    let confirmMessage = `Create payment request:\n\n`;
    confirmMessage += `Student: ${studentName}\n`;
    confirmMessage += `Amount: KES ${amount.toLocaleString()}\n`;
    confirmMessage += `Flexibility: ${flexibilityLabel}\n`;

    if (formData.flexibility !== PAYMENT_FLEXIBILITY.FULL_ONLY) {
      confirmMessage += `Minimum Payment: KES ${minAmount.toLocaleString()}\n`;
    }

    confirmMessage += `\nAll linked guardians will be notified.`;

    Alert.alert('Confirm Payment Request', confirmMessage, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Create Request',
        onPress: submitPaymentRequest,
      },
    ]);
  };

  const submitPaymentRequest = async () => {
    try {
      setIsSubmitting(true);

      // Prepare data for backend
      const paymentData = {
        student: formData.student.id,
        guardian: formData.guardian,
        school: user.school, // From auth context
        title: formData.title.trim(),
        description: formData.description.trim(),
        total_amount: formData.total_amount,
        flexibility: formData.flexibility,
        minimum_payment:
          formData.flexibility !== PAYMENT_FLEXIBILITY.FULL_ONLY
            ? formData.minimum_payment
            : formData.total_amount,
        due_date: formData.due_date,
        academic_year: formData.academic_year,
        term: formData.term,
      };

      if (__DEV__) {
        console.log('Creating payment request:', paymentData);
      }

      // Call backend API
      const response = await paymentService.createPaymentRequest(paymentData);

      if (response.success) {
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
      } else {
        throw new Error(response.message || 'Failed to create payment request');
      }
    } catch (error) {
      console.error('Create payment error:', error);
      Alert.alert(
        'Error',
        error.message || 'Failed to create payment request. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading student details..." />;
  }

  const suggestedMinimums = calculateSuggestedMinimum();
  const isFlexible = formData.flexibility !== PAYMENT_FLEXIBILITY.FULL_ONLY;

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
        {/* Student Selection */}
        <Text style={styles.sectionTitle}>Student</Text>

        {preSelectedStudent ? (
          <StudentCard student={preSelectedStudent} onPress={null} />
        ) : (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.helperText}>
                Please select a student from the Students screen first
              </Text>
            </Card.Content>
          </Card>
        )}
        {errors.student && (
          <HelperText type="error">{errors.student}</HelperText>
        )}

        {/* Guardian Selection */}
        {guardians.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Guardian</Text>
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={formData.guardian}
                onValueChange={(value) => updateField('guardian', value)}
                style={styles.picker}
              >
                <Picker.Item label="Select Guardian..." value={null} />
                {guardians.map((guardian) => (
                  <Picker.Item
                    key={guardian.id}
                    label={`${guardian.user.first_name} ${guardian.user.last_name} (${guardian.relationship})`}
                    value={guardian.id}
                  />
                ))}
              </Picker>
            </View>
            {errors.guardian && (
              <HelperText type="error">{errors.guardian}</HelperText>
            )}
          </>
        )}

        {/* Payment Details */}
        <Text style={styles.sectionTitle}>Payment Details</Text>

        {/* Title */}
        <TextInput
          label="Payment Title *"
          mode="outlined"
          value={formData.title}
          onChangeText={(text) => updateField('title', text)}
          error={!!errors.title}
          style={styles.input}
          placeholder="e.g., Term 1 School Fees"
        />
        {errors.title && <HelperText type="error">{errors.title}</HelperText>}

        {/* Description */}
        <TextInput
          label="Description (Optional)"
          mode="outlined"
          value={formData.description}
          onChangeText={(text) => updateField('description', text)}
          style={styles.input}
          multiline
          numberOfLines={4}
          placeholder="Additional details about this payment..."
        />

        {/* Amount */}
        <TextInput
          label="Total Amount (KES) *"
          mode="outlined"
          value={formData.total_amount}
          onChangeText={(text) => updateField('total_amount', text)}
          error={!!errors.total_amount}
          style={styles.input}
          keyboardType="decimal-pad"
          left={<TextInput.Icon icon="currency-usd" />}
          placeholder="0.00"
        />
        {errors.total_amount && (
          <HelperText type="error">{errors.total_amount}</HelperText>
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

        {/* Academic Period */}
        <Text style={styles.sectionTitle}>Academic Period</Text>

        <TextInput
          label="Academic Year *"
          mode="outlined"
          value={formData.academic_year}
          onChangeText={(text) => updateField('academic_year', text)}
          style={styles.input}
          placeholder="2025"
          keyboardType="number-pad"
        />

        <View style={styles.pickerContainer}>
          <Text style={styles.pickerLabel}>Term *</Text>
          <Picker
            selectedValue={formData.term}
            onValueChange={(value) => updateField('term', value)}
            style={styles.picker}
          >
            {Object.entries(KENYA_ACADEMIC_TERM_LABELS).map(([key, label]) => (
              <Picker.Item key={key} label={label} value={key} />
            ))}
          </Picker>
        </View>

        {/* Payment Flexibility */}
        <Text style={styles.sectionTitle}>Payment Flexibility</Text>

        <RadioButton.Group
          onValueChange={(value) => updateField('flexibility', value)}
          value={formData.flexibility}
        >
          {Object.entries(PAYMENT_FLEXIBILITY_LABELS).map(([key, label]) => (
            <View key={key} style={styles.radioContainer}>
              <RadioButton value={key} />
              <Text style={styles.radioLabel}>{label}</Text>
            </View>
          ))}
        </RadioButton.Group>

        {/* Minimum Payment (for flexible/installment) */}
        {isFlexible && (
          <>
            <TextInput
              label="Minimum Payment Amount (KES) *"
              mode="outlined"
              value={formData.minimum_payment}
              onChangeText={(text) => updateField('minimum_payment', text)}
              error={!!errors.minimum_payment}
              style={styles.input}
              keyboardType="decimal-pad"
              left={<TextInput.Icon icon="cash-minus" />}
              placeholder="0.00"
            />
            {errors.minimum_payment && (
              <HelperText type="error">{errors.minimum_payment}</HelperText>
            )}

            {/* Suggested Minimums */}
            {suggestedMinimums && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsLabel}>Quick suggestions:</Text>
                <View style={styles.suggestionsButtons}>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() =>
                      updateField(
                        'minimum_payment',
                        suggestedMinimums.ten.toString()
                      )
                    }
                    style={styles.suggestionButton}
                  >
                    10% (KES {suggestedMinimums.ten.toLocaleString()})
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() =>
                      updateField(
                        'minimum_payment',
                        suggestedMinimums.twenty.toString()
                      )
                    }
                    style={styles.suggestionButton}
                  >
                    20% (KES {suggestedMinimums.twenty.toLocaleString()})
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() =>
                      updateField(
                        'minimum_payment',
                        suggestedMinimums.thirty.toString()
                      )
                    }
                    style={styles.suggestionButton}
                  >
                    30% (KES {suggestedMinimums.thirty.toLocaleString()})
                  </Button>
                </View>
              </View>
            )}

            {/* Info Box */}
            <View style={[styles.infoBox, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.infoBoxText, { color: '#2E7D32' }]}>
                ✓ Guardians can pay in multiple installments{'\n'}
                ✓ Each payment must be at least the minimum amount{'\n'}
                ✓ Payment history will be tracked automatically
              </Text>
            </View>
          </>
        )}

        {!isFlexible && (
          <View style={[styles.infoBox, { backgroundColor: '#FFF3E0' }]}>
            <Text style={[styles.infoBoxText, { color: '#E65100' }]}>
              ⚠️ Full payment required. Guardians cannot pay in installments.
            </Text>
          </View>
        )}

        {/* General Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            ℹ️ All linked guardians will receive a notification about this
            payment request. They can view and pay through their guardian
            portal.
          </Text>
        </View>

        {/* Payment Summary Preview */}
        {formData.total_amount && formData.student && (
          <View style={styles.previewBox}>
            <Text style={styles.previewTitle}>Payment Summary</Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Student:</Text>
              <Text style={styles.previewValue}>
                {formData.student.first_name} {formData.student.last_name}
              </Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Title:</Text>
              <Text style={styles.previewValue}>{formData.title || 'N/A'}</Text>
            </View>
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Total Amount:</Text>
              <Text style={[styles.previewValue, styles.amountText]}>
                KES {parseFloat(formData.total_amount || 0).toLocaleString()}
              </Text>
            </View>
            {isFlexible && formData.minimum_payment && (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Minimum Payment:</Text>
                <Text style={[styles.previewValue, styles.minAmountText]}>
                  KES{' '}
                  {parseFloat(
                    formData.minimum_payment || 0
                  ).toLocaleString()}
                </Text>
              </View>
            )}
            {formData.due_date && (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Due Date:</Text>
                <Text style={styles.previewValue}>
                  {new Date(formData.due_date).toLocaleDateString()}
                </Text>
              </View>
            )}
            <View style={styles.previewRow}>
              <Text style={styles.previewLabel}>Flexibility:</Text>
              <Text style={[styles.previewValue, { fontWeight: 'bold' }]}>
                {PAYMENT_FLEXIBILITY_LABELS[formData.flexibility]}
              </Text>
            </View>
          </View>
        )}

        {/* Submit Button */}
        <Button
          mode="contained"
          onPress={handleSubmit}
          style={styles.submitButton}
          contentStyle={styles.submitButtonContent}
          disabled={isSubmitting}
          loading={isSubmitting}
          icon="cash-plus"
        >
          Create Payment Request
        </Button>

        {/* Cancel Button */}
        <Button
          mode="outlined"
          onPress={() => navigation.goBack()}
          style={styles.cancelButton}
          disabled={isSubmitting}
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
    marginBottom: 12,
  },
  card: {
    marginBottom: 16,
  },
  helperText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  pickerContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    marginBottom: 8,
  },
  pickerLabel: {
    fontSize: 12,
    color: '#757575',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  picker: {
    height: 50,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioLabel: {
    fontSize: 15,
    color: '#212121',
    marginLeft: 8,
  },
  suggestionsContainer: {
    marginBottom: 16,
  },
  suggestionsLabel: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 8,
    fontWeight: '600',
  },
  suggestionsButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  suggestionButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  infoBox: {
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginVertical: 12,
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
  minAmountText: {
    fontSize: 14,
    color: '#4CAF50',
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