// ========================================
// M-PESA PAYMENT MODAL - GUARDIAN
// Backend Integration: POST /api/payments/mpesa/initiate/ & GET /api/payments/mpesa/query/
// ========================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  Modal,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  Portal,
  Dialog,
  Button,
  TextInput,
  Text,
  HelperText,
  ActivityIndicator,
  IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as paymentService from '../../services/paymentService';
import { validateMpesaPhone, validatePaymentAmount } from '../../utils/validators';
import { MPESA_STATUS } from '../../utils/constants';

const MpesaPaymentModal = ({ visible, onDismiss, paymentRequest, onSuccess }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [amount, setAmount] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState(null);
  const [checkoutRequestId, setCheckoutRequestId] = useState(null);
  const [errors, setErrors] = useState({});
  
  const pollingInterval = useRef(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
    };
  }, []);

  // Set default amount to remaining balance
  useEffect(() => {
    if (paymentRequest && visible) {
      setAmount(paymentRequest.balance.toString());
      setPhoneNumber('');
      setErrors({});
      setProcessingStage(null);
    }
  }, [paymentRequest, visible]);

  const validateForm = () => {
    const newErrors = {};

    // Phone validation
    const phoneValidation = validateMpesaPhone(phoneNumber);
    if (!phoneValidation.isValid) {
      newErrors.phone = phoneValidation.message;
    }

    // Amount validation
    const amountValidation = paymentService.validatePaymentAmount(
      paymentRequest,
      parseFloat(amount)
    );
    if (!amountValidation.isValid) {
      newErrors.amount = amountValidation.error;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInitiatePayment = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setIsProcessing(true);
      setProcessingStage('initiating');

      // Format phone number
      const formattedPhone = paymentService.formatMpesaPhone(phoneNumber);

      // Initiate M-Pesa STK push
      const response = await paymentService.initiateMpesaPayment({
        payment_request: paymentRequest.id,
        phone_number: formattedPhone,
        amount: amount,
      });

      if (response.success) {
        setCheckoutRequestId(response.data.transaction.checkout_request_id);
        setProcessingStage('pending');
        
        Alert.alert(
          'STK Push Sent',
          'Please check your phone and enter your M-Pesa PIN to complete the payment.',
          [{ text: 'OK' }]
        );

        // Start polling for payment status
        startPolling(response.data.transaction.checkout_request_id);
      } else {
        throw new Error(response.message || 'Failed to initiate payment');
      }
    } catch (error) {
      console.error('M-Pesa initiation error:', error);
      setIsProcessing(false);
      setProcessingStage(null);
      Alert.alert(
        'Payment Failed',
        error.message || 'Failed to initiate M-Pesa payment. Please try again.'
      );
    }
  };

  const startPolling = (checkoutId) => {
    let pollCount = 0;
    const maxPolls = 30; // Poll for 2 minutes (30 * 4 seconds)

    pollingInterval.current = setInterval(async () => {
      pollCount++;

      try {
        const response = await paymentService.queryMpesaTransaction(checkoutId);

        if (response.success) {
          const status = response.data.status;

          if (status === MPESA_STATUS.COMPLETED) {
            // Payment successful
            clearInterval(pollingInterval.current);
            setIsProcessing(false);
            setProcessingStage('completed');

            Alert.alert(
              'Payment Successful!',
              `Payment of KES ${amount} has been received.\n\nM-Pesa Receipt: ${response.data.mpesa_receipt}`,
              [
                {
                  text: 'OK',
                  onPress: () => {
                    onSuccess();
                    handleClose();
                  },
                },
              ]
            );
          } else if (status === MPESA_STATUS.FAILED || status === MPESA_STATUS.CANCELLED) {
            // Payment failed
            clearInterval(pollingInterval.current);
            setIsProcessing(false);
            setProcessingStage('failed');

            Alert.alert(
              'Payment Failed',
              response.data.result_desc || 'The M-Pesa payment was not completed.',
              [
                {
                  text: 'Try Again',
                  onPress: () => setProcessingStage(null),
                },
                {
                  text: 'Cancel',
                  onPress: handleClose,
                  style: 'cancel',
                },
              ]
            );
          }
        }

        // Stop polling after max attempts
        if (pollCount >= maxPolls) {
          clearInterval(pollingInterval.current);
          setIsProcessing(false);
          setProcessingStage('timeout');

          Alert.alert(
            'Payment Timeout',
            'We could not confirm your payment. Please check your M-Pesa messages and contact support if the payment was deducted.',
            [
              {
                text: 'OK',
                onPress: handleClose,
              },
            ]
          );
        }
      } catch (error) {
        console.error('Polling error:', error);
      }
    }, 4000); // Poll every 4 seconds
  };

  const handleClose = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    setPhoneNumber('');
    setAmount('');
    setErrors({});
    setIsProcessing(false);
    setProcessingStage(null);
    setCheckoutRequestId(null);
    onDismiss();
  };

  const renderProcessingStatus = () => {
    if (!processingStage) return null;

    let icon, title, message, color;

    switch (processingStage) {
      case 'initiating':
        icon = 'loading';
        title = 'Initiating Payment...';
        message = 'Please wait while we connect to M-Pesa';
        color = '#2196F3';
        break;
      case 'pending':
        icon = 'cellphone';
        title = 'Check Your Phone';
        message = 'Enter your M-Pesa PIN on your phone to complete payment';
        color = '#FF9800';
        break;
      case 'completed':
        icon = 'check-circle';
        title = 'Payment Successful!';
        message = 'Your payment has been received';
        color = '#4CAF50';
        break;
      case 'failed':
        icon = 'close-circle';
        title = 'Payment Failed';
        message = 'The payment could not be completed';
        color = '#F44336';
        break;
      case 'timeout':
        icon = 'clock-alert';
        title = 'Payment Timeout';
        message = 'Could not confirm payment status';
        color = '#757575';
        break;
      default:
        return null;
    }

    return (
      <View style={[styles.statusContainer, { backgroundColor: `${color}15` }]}>
        <MaterialCommunityIcons name={icon} size={48} color={color} />
        <Text style={[styles.statusTitle, { color }]}>{title}</Text>
        <Text style={styles.statusMessage}>{message}</Text>
        {processingStage === 'pending' && (
          <ActivityIndicator size="large" color={color} style={styles.spinner} />
        )}
      </View>
    );
  };

  if (!paymentRequest) return null;

  const studentName = `${paymentRequest.student.first_name} ${paymentRequest.student.last_name}`;
  const suggestions = paymentRequest.balance 
    ? paymentService.getSuggestedPaymentAmounts(paymentRequest)
    : [];

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={handleClose} style={styles.dialog}>
        <Dialog.Title style={styles.dialogTitle}>
          <MaterialCommunityIcons name="cellphone" size={24} color="#4CAF50" />
          <Text style={styles.titleText}>  M-Pesa Payment</Text>
        </Dialog.Title>

        <Dialog.ScrollArea>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          >
            <View style={styles.content}>
              {/* Payment Details */}
              <View style={styles.detailsCard}>
                <Text style={styles.detailsTitle}>Payment Details</Text>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Student:</Text>
                  <Text style={styles.detailValue}>{studentName}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Purpose:</Text>
                  <Text style={styles.detailValue}>{paymentRequest.title}</Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Total Amount:</Text>
                  <Text style={styles.detailValue}>
                    KES {paymentRequest.total_amount.toLocaleString()}
                  </Text>
                </View>
                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Amount Paid:</Text>
                  <Text style={[styles.detailValue, { color: '#4CAF50' }]}>
                    KES {paymentRequest.amount_paid.toLocaleString()}
                  </Text>
                </View>
                <View style={[styles.detailRow, styles.balanceRow]}>
                  <Text style={styles.balanceLabel}>Balance:</Text>
                  <Text style={styles.balanceValue}>
                    KES {paymentRequest.balance.toLocaleString()}
                  </Text>
                </View>
              </View>

              {/* Processing Status */}
              {renderProcessingStatus()}

              {/* Form - Only show if not processing */}
              {!isProcessing && (
                <>
                  {/* Phone Number */}
                  <TextInput
                    label="M-Pesa Phone Number *"
                    mode="outlined"
                    value={phoneNumber}
                    onChangeText={(text) => {
                      setPhoneNumber(text);
                      setErrors({ ...errors, phone: '' });
                    }}
                    placeholder="254712345678"
                    keyboardType="phone-pad"
                    error={!!errors.phone}
                    style={styles.input}
                    left={<TextInput.Icon icon="phone" />}
                    disabled={isProcessing}
                  />
                  {errors.phone && (
                    <HelperText type="error">{errors.phone}</HelperText>
                  )}
                  <HelperText type="info">
                    Enter number in format: 254712345678
                  </HelperText>

                  {/* Amount */}
                  <TextInput
                    label="Payment Amount (KES) *"
                    mode="outlined"
                    value={amount}
                    onChangeText={(text) => {
                      setAmount(text);
                      setErrors({ ...errors, amount: '' });
                    }}
                    placeholder="0.00"
                    keyboardType="decimal-pad"
                    error={!!errors.amount}
                    style={styles.input}
                    left={<TextInput.Icon icon="currency-usd" />}
                    disabled={isProcessing}
                  />
                  {errors.amount && (
                    <HelperText type="error">{errors.amount}</HelperText>
                  )}
                  {paymentRequest.flexibility !== 'full_only' && (
                    <HelperText type="info">
                      Minimum: KES {paymentRequest.minimum_payment.toLocaleString()}
                    </HelperText>
                  )}

                  {/* Suggested Amounts */}
                  {suggestions.length > 0 && (
                    <View style={styles.suggestionsContainer}>
                      <Text style={styles.suggestionsLabel}>Quick amounts:</Text>
                      <View style={styles.suggestionsButtons}>
                        {suggestions.map((suggestion, index) => (
                          <Button
                            key={index}
                            mode="outlined"
                            compact
                            onPress={() => setAmount(suggestion.amount.toString())}
                            style={styles.suggestionButton}
                          >
                            {suggestion.label}
                          </Button>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Info Box */}
                  <View style={styles.infoBox}>
                    <MaterialCommunityIcons
                      name="information"
                      size={16}
                      color="#1976D2"
                    />
                    <Text style={styles.infoText}>
                      You will receive an M-Pesa prompt on your phone. Enter your
                      PIN to complete the payment.
                    </Text>
                  </View>
                </>
              )}
            </View>
          </KeyboardAvoidingView>
        </Dialog.ScrollArea>

        <Dialog.Actions>
          {!isProcessing ? (
            <>
              <Button onPress={handleClose}>Cancel</Button>
              <Button
                mode="contained"
                onPress={handleInitiatePayment}
                style={styles.payButton}
              >
                Pay with M-Pesa
              </Button>
            </>
          ) : (
            <Button onPress={handleClose} disabled={processingStage === 'pending'}>
              Close
            </Button>
          )}
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '90%',
  },
  dialogTitle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  detailsCard: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  detailLabel: {
    fontSize: 13,
    color: '#757575',
  },
  detailValue: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '500',
  },
  balanceRow: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 8,
    marginTop: 4,
  },
  balanceLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
  },
  balanceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F44336',
  },
  statusContainer: {
    padding: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 12,
    marginBottom: 4,
  },
  statusMessage: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  spinner: {
    marginTop: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
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
    flexDirection: 'row',
    backgroundColor: '#E3F2FD',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  infoText: {
    flex: 1,
    fontSize: 12,
    color: '#1976D2',
    marginLeft: 8,
    lineHeight: 18,
  },
  payButton: {
    backgroundColor: '#4CAF50',
  },
});

export default MpesaPaymentModal;