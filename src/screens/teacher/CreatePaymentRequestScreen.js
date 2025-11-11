import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Button, HelperText, Text, Searchbar, Switch, RadioButton } from 'react-native-paper';
import DatePicker from '../../components/form/DatePicker';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { PAYMENT_FLEXIBILITY } from '../../utils/constants';
import { validatePaymentRequestCreation } from '../../utils/validators';

const CreatePaymentRequestScreen = ({ route, navigation }) => {
  const preSelectedStudent = route.params?.student || null;
  
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Form state - 🆕 UPDATED with partial payment fields
  const [formData, setFormData] = useState({
    student: preSelectedStudent,
    amount: '',
    purpose: '',
    due_date: null,
    allow_partial: false,  // 🆕 NEW
    payment_flexibility: PAYMENT_FLEXIBILITY.FULL_ONLY,  // 🆕 NEW
    minimum_amount: '',  // 🆕 NEW
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

  // 🆕 NEW - Handle allow partial toggle
  const handleAllowPartialToggle = (value) => {
    const updates = {
      allow_partial: value,
      payment_flexibility: value ? PAYMENT_FLEXIBILITY.PARTIAL_ALLOWED : PAYMENT_FLEXIBILITY.FULL_ONLY,
    };
    
    // Reset minimum amount if disabling partial
    if (!value) {
      updates.minimum_amount = '';
    } else if (formData.amount) {
      // Set default minimum to 20% of amount
      const defaultMin = Math.round(parseFloat(formData.amount) * 0.2);
      updates.minimum_amount = defaultMin.toString();
    }
    
    setFormData({ ...formData, ...updates });
    if (errors.minimum_amount) {
      setErrors({ ...errors, minimum_amount: '' });
    }
  };

  // 🆕 NEW - Calculate suggested minimum amount
  const calculateSuggestedMinimum = () => {
    if (!formData.amount) return null;
    const amount = parseFloat(formData.amount);
    return {
      twenty: Math.round(amount * 0.2),
      thirty: Math.round(amount * 0.3),
      fifty: Math.round(amount * 0.5),
    };
  };

  // Validation - 🆕 UPDATED
  const validateForm = () => {
    const validation = validatePaymentRequestCreation({
      student_id: formData.student?.id,
      amount: formData.amount,
      purpose: formData.purpose,
      due_date: formData.due_date,
      allow_partial: formData.allow_partial,
      minimum_amount: formData.minimum_amount,
    });

    setErrors(validation.errors);
    return validation.isValid;
  };

  // Handle submit - 🆕 UPDATED
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Validation Error', 'Please check the form and try again');
      return;
    }

    const amount = parseFloat(formData.amount);
    const minAmount = formData.allow_partial ? parseFloat(formData.minimum_amount) : amount;
    
    // 🆕 UPDATED confirmation message
    const confirmMessage = formData.allow_partial
      ? `Create payment request of KES ${amount.toFixed(2)} for ${formData.student.first_name} ${formData.student.last_name}?\n\n✓ Partial payments allowed\n✓ Minimum payment: KES ${minAmount.toFixed(2)}\n\nAll guardians will be notified.`
      : `Create payment request of KES ${amount.toFixed(2)} for ${formData.student.first_name} ${formData.student.last_name}?\n\n⚠️ Full payment required\n\nAll guardians will be notified.`;
    
    Alert.alert(
      'Confirm Payment Request',
      confirmMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Create Request',
          onPress: async () => {
            try {
              setIsLoading(true);
              
              // 🆕 UPDATED - Include partial payment fields in request
              const paymentData = {
                student_id: formData.student.id,
                amount: amount,
                purpose: formData.purpose,
                due_date: formData.due_date,
                allow_partial: formData.allow_partial,
                payment_flexibility: formData.payment_flexibility,
                minimum_amount: minAmount,
              };
              
              // TODO: Replace with actual API call
              // await paymentService.createPaymentRequest(paymentData);
              
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

  const suggestedMinimums = calculateSuggestedMinimum();

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
          onChangeText={(text) => {
            updateField('amount', text);
            // Auto-calculate minimum if partial enabled
            if (formData.allow_partial && text) {
              const amount = parseFloat(text);
              if (!isNaN(amount)) {
                const defaultMin = Math.round(amount * 0.2);
                updateField('minimum_amount', defaultMin.toString());
              }
            }
          }}
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

        {/* 🆕 NEW - Payment Flexibility Section */}
        <Text style={styles.sectionTitle}>Payment Flexibility</Text>

        <View style={styles.switchContainer}>
          <View style={styles.switchLeft}>
            <Text style={styles.switchLabel}>Allow Partial Payments</Text>
            <Text style={styles.switchDescription}>
              Let guardians pay in installments
            </Text>
          </View>
          <Switch
            value={formData.allow_partial}
            onValueChange={handleAllowPartialToggle}
            color="#6200EE"
          />
        </View>

        {formData.allow_partial && (
          <>
            {/* Minimum Amount */}
            <TextInput
              label="Minimum Payment Amount (KES) *"
              mode="outlined"
              value={formData.minimum_amount}
              onChangeText={(text) => updateField('minimum_amount', text)}
              error={!!errors.minimum_amount}
              style={styles.input}
              keyboardType="decimal-pad"
              left={<TextInput.Icon icon="cash-minus" />}
              placeholder="0.00"
            />
            {errors.minimum_amount && (
              <HelperText type="error">{errors.minimum_amount}</HelperText>
            )}

            {/* Suggested Minimums */}
            {suggestedMinimums && (
              <View style={styles.suggestionsContainer}>
                <Text style={styles.suggestionsLabel}>Quick set:</Text>
                <View style={styles.suggestionsButtons}>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => updateField('minimum_amount', suggestedMinimums.twenty.toString())}
                    style={styles.suggestionButton}
                  >
                    20% (KES {suggestedMinimums.twenty})
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => updateField('minimum_amount', suggestedMinimums.thirty.toString())}
                    style={styles.suggestionButton}
                  >
                    30% (KES {suggestedMinimums.thirty})
                  </Button>
                  <Button
                    mode="outlined"
                    compact
                    onPress={() => updateField('minimum_amount', suggestedMinimums.fifty.toString())}
                    style={styles.suggestionButton}
                  >
                    50% (KES {suggestedMinimums.fifty})
                  </Button>
                </View>
              </View>
            )}

            {/* Info Box for Partial Payments */}
            <View style={[styles.infoBox, { backgroundColor: '#E8F5E9' }]}>
              <Text style={[styles.infoBoxText, { color: '#2E7D32' }]}>
                ✓ Guardians can pay in multiple installments{'\n'}
                ✓ Each payment must be at least the minimum amount{'\n'}
                ✓ Payment history will be tracked automatically
              </Text>
            </View>
          </>
        )}

        {!formData.allow_partial && (
          <View style={[styles.infoBox, { backgroundColor: '#FFF3E0' }]}>
            <Text style={[styles.infoBoxText, { color: '#E65100' }]}>
              ⚠️ Full payment will be required. Guardians cannot pay in installments.
            </Text>
          </View>
        )}

        {/* General Info Box */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxText}>
            ℹ️ All linked guardians will receive a notification about this payment
            request. They can view and pay it through their guardian portal.
          </Text>
        </View>

        {/* Preview Box - 🆕 UPDATED */}
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
              <Text style={styles.previewLabel}>Total Amount:</Text>
              <Text style={[styles.previewValue, styles.amountText]}>
                KES {parseFloat(formData.amount || 0).toFixed(2)}
              </Text>
            </View>
            {formData.allow_partial && formData.minimum_amount && (
              <View style={styles.previewRow}>
                <Text style={styles.previewLabel}>Minimum Payment:</Text>
                <Text style={[styles.previewValue, styles.minAmountText]}>
                  KES {parseFloat(formData.minimum_amount || 0).toFixed(2)}
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
              <Text style={styles.previewLabel}>Payment Type:</Text>
              <Text style={[styles.previewValue, { fontWeight: 'bold' }]}>
                {formData.allow_partial ? 'Partial Allowed ✓' : 'Full Payment Only'}
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
  // 🆕 NEW - Switch styles
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
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
  // 🆕 NEW - Suggestions styles
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