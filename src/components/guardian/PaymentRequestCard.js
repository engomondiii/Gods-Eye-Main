import React, { useState } from 'react';
import { View, StyleSheet, Text, Alert } from 'react-native';
import { Card, Button, Chip, TextInput, HelperText, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '../../utils/formatters';
import { PAYMENT_STATUS, PAYMENT_STATUS_COLORS, PAYMENT_STATUS_LABELS } from '../../utils/constants';
import { validatePartialPayment, calculatePaymentPercentage } from '../../utils/validators';

const PaymentRequestCard = ({ payment, onPay, onPress, showActions = true, userRole = 'guardian' }) => {
  // 🆕 NEW - State for custom payment amount
  const [customAmount, setCustomAmount] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [amountError, setAmountError] = useState('');

  // 🆕 NEW - Get status color from constants
  const getStatusColor = (status) => {
    return PAYMENT_STATUS_COLORS[status] || '#757575';
  };

  const getStatusBackgroundColor = (status) => {
    const color = getStatusColor(status);
    // Convert hex to rgba with 0.1 opacity
    const r = parseInt(color.slice(1, 3), 16);
    const g = parseInt(color.slice(3, 5), 16);
    const b = parseInt(color.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, 0.1)`;
  };

  // 🆕 NEW - Calculate payment progress
  const paymentProgress = payment.amount > 0 
    ? calculatePaymentPercentage(payment.paid_amount, payment.amount)
    : 0;

  // 🆕 NEW - Handle custom amount change
  const handleAmountChange = (text) => {
    setCustomAmount(text);
    setAmountError('');
  };

  // 🆕 NEW - Validate and submit custom amount
  const handleCustomPayment = () => {
    const validation = validatePartialPayment(payment, customAmount);
    
    if (!validation.isValid) {
      setAmountError(validation.message);
      return;
    }

    const amount = parseFloat(customAmount);
    onPay(payment, amount);
    setCustomAmount('');
    setShowCustomInput(false);
  };

  // 🆕 NEW - Quick payment buttons
  const renderQuickPaymentButtons = () => {
    if (!payment.allow_partial || payment.status === PAYMENT_STATUS.PAID) {
      return null;
    }

    const remaining = payment.remaining_amount;
    const minimum = payment.minimum_amount;

    const suggestions = [];

    // Full amount
    suggestions.push({
      label: 'Full Amount',
      amount: remaining,
      color: '#4CAF50',
    });

    // 50% if greater than minimum
    const halfAmount = Math.round(remaining / 2);
    if (halfAmount >= minimum && halfAmount !== remaining) {
      suggestions.push({
        label: '50%',
        amount: halfAmount,
        color: '#2196F3',
      });
    }

    // Minimum amount
    if (minimum !== remaining && minimum !== halfAmount) {
      suggestions.push({
        label: 'Minimum',
        amount: minimum,
        color: '#FF9800',
      });
    }

    return (
      <View style={styles.quickPaymentContainer}>
        <Text style={styles.quickPaymentLabel}>Quick amounts:</Text>
        <View style={styles.quickPaymentButtons}>
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              mode="outlined"
              compact
              onPress={() => onPay(payment, suggestion.amount)}
              style={[styles.quickPaymentButton, { borderColor: suggestion.color }]}
              labelStyle={{ color: suggestion.color, fontSize: 11 }}
            >
              {suggestion.label} (KES {suggestion.amount.toLocaleString()})
            </Button>
          ))}
          <Button
            mode="outlined"
            compact
            onPress={() => setShowCustomInput(!showCustomInput)}
            style={styles.quickPaymentButton}
            labelStyle={{ fontSize: 11 }}
          >
            Custom Amount
          </Button>
        </View>
      </View>
    );
  };

  // 🆕 NEW - Render custom amount input
  const renderCustomAmountInput = () => {
    if (!showCustomInput) return null;

    return (
      <View style={styles.customAmountContainer}>
        <TextInput
          label={`Amount (Min: KES ${payment.minimum_amount.toLocaleString()})`}
          mode="outlined"
          value={customAmount}
          onChangeText={handleAmountChange}
          keyboardType="decimal-pad"
          error={!!amountError}
          style={styles.customAmountInput}
          dense
          left={<TextInput.Icon icon="currency-usd" />}
        />
        {amountError ? (
          <HelperText type="error" style={styles.errorText}>
            {amountError}
          </HelperText>
        ) : null}
        <View style={styles.customAmountActions}>
          <Button
            mode="outlined"
            onPress={() => {
              setShowCustomInput(false);
              setCustomAmount('');
              setAmountError('');
            }}
            style={styles.customAmountCancel}
            compact
          >
            Cancel
          </Button>
          <Button
            mode="contained"
            onPress={handleCustomPayment}
            style={styles.customAmountPay}
            disabled={!customAmount}
            compact
          >
            Pay KES {customAmount || '0'}
          </Button>
        </View>
      </View>
    );
  };

  // 🆕 NEW - Render payment history
  const renderPaymentHistory = () => {
    if (!payment.payment_history || payment.payment_history.length === 0) {
      return null;
    }

    return (
      <View style={styles.historyContainer}>
        <Text style={styles.historyTitle}>
          Payment History ({payment.installment_count} payment{payment.installment_count !== 1 ? 's' : ''})
        </Text>
        {payment.payment_history.map((history, index) => (
          <View key={history.id || index} style={styles.historyItem}>
            <View style={styles.historyRow}>
              <MaterialCommunityIcons name="cash-check" size={16} color="#4CAF50" />
              <Text style={styles.historyAmount}>
                KES {history.amount.toFixed(2)}
              </Text>
              <Text style={styles.historyDate}>
                {formatDate(history.payment_date)}
              </Text>
            </View>
            {history.mpesa_ref && (
              <Text style={styles.historyRef}>Ref: {history.mpesa_ref}</Text>
            )}
          </View>
        ))}
      </View>
    );
  };

  // 🆕 NEW - Render payment progress bar
  const renderProgressBar = () => {
    if (payment.status === PAYMENT_STATUS.PAID || !payment.allow_partial) {
      return null;
    }

    return (
      <View style={styles.progressContainer}>
        <View style={styles.progressHeader}>
          <Text style={styles.progressLabel}>Payment Progress</Text>
          <Text style={styles.progressPercentage}>{paymentProgress}%</Text>
        </View>
        <View style={styles.progressBarContainer}>
          <View 
            style={[
              styles.progressBar, 
              { width: `${paymentProgress}%`, backgroundColor: getStatusColor(payment.status) }
            ]} 
          />
        </View>
        <View style={styles.progressAmounts}>
          <Text style={styles.progressPaid}>
            Paid: KES {payment.paid_amount.toFixed(2)}
          </Text>
          <Text style={styles.progressRemaining}>
            Remaining: KES {payment.remaining_amount.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* Header with Status */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="cash"
              size={24}
              color={getStatusColor(payment.status)}
            />
            <View style={styles.amountContainer}>
              <Text style={styles.amount}>
                KES {payment.amount.toFixed(2)}
              </Text>
              {payment.allow_partial && payment.status !== PAYMENT_STATUS.PAID && (
                <Text style={styles.partialLabel}>Partial allowed</Text>
              )}
            </View>
          </View>
          <Chip
            mode="flat"
            style={[
              styles.statusChip,
              { backgroundColor: getStatusBackgroundColor(payment.status) },
            ]}
            textStyle={[
              styles.statusText,
              { color: getStatusColor(payment.status) },
            ]}
          >
            {PAYMENT_STATUS_LABELS[payment.status] || payment.status.toUpperCase()}
          </Chip>
        </View>

        {/* Student Info */}
        <View style={styles.studentSection}>
          <Text style={styles.studentName}>
            {payment.student.first_name} {payment.student.last_name}
          </Text>
          <Text style={styles.admissionNumber}>
            {payment.student.admission_number}
          </Text>
        </View>

        {/* Purpose */}
        <View style={styles.purposeSection}>
          <Text style={styles.purposeLabel}>Purpose:</Text>
          <Text style={styles.purposeText} numberOfLines={2}>
            {payment.purpose}
          </Text>
        </View>

        {/* 🆕 NEW - Payment Progress */}
        {renderProgressBar()}

        {/* Details */}
        <View style={styles.detailsSection}>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={14} color="#757575" />
            <Text style={styles.detailLabel}>Created:</Text>
            <Text style={styles.detailValue}>{formatDate(payment.created_at)}</Text>
          </View>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons
              name={payment.status === PAYMENT_STATUS.PAID ? 'calendar-check' : 'calendar-clock'}
              size={14}
              color="#757575"
            />
            <Text style={styles.detailLabel}>
              {payment.status === PAYMENT_STATUS.PAID ? 'Paid:' : 'Due:'}
            </Text>
            <Text style={styles.detailValue}>
              {payment.status === PAYMENT_STATUS.PAID && payment.paid_date
                ? formatDate(payment.paid_date)
                : formatDate(payment.due_date)}
            </Text>
          </View>
          {payment.requested_by && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account-tie" size={14} color="#757575" />
              <Text style={styles.detailLabel}>Teacher:</Text>
              <Text style={styles.detailValue}>
                {payment.requested_by.first_name} {payment.requested_by.last_name}
              </Text>
            </View>
          )}
          {/* 🆕 NEW - Show minimum amount for partial payments */}
          {payment.allow_partial && payment.status !== PAYMENT_STATUS.PAID && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="cash-minus" size={14} color="#757575" />
              <Text style={styles.detailLabel}>Minimum:</Text>
              <Text style={styles.detailValue}>
                KES {payment.minimum_amount.toFixed(2)}
              </Text>
            </View>
          )}
          {payment.mpesa_ref && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="receipt" size={14} color="#757575" />
              <Text style={styles.detailLabel}>M-Pesa Ref:</Text>
              <Text style={styles.detailValue}>{payment.mpesa_ref}</Text>
            </View>
          )}
        </View>

        {/* 🆕 NEW - Payment History */}
        {userRole === 'guardian' && renderPaymentHistory()}

        {/* 🆕 NEW - Quick Payment Buttons for Guardians */}
        {userRole === 'guardian' && showActions && renderQuickPaymentButtons()}

        {/* 🆕 NEW - Custom Amount Input */}
        {userRole === 'guardian' && showActions && renderCustomAmountInput()}

        {/* Action Button - 🆕 UPDATED */}
        {showActions && !showCustomInput && (
          <>
            {payment.allow_partial ? (
              // Partial payment allowed - show in quick buttons above
              null
            ) : (
              // Full payment only
              <Button
                mode="contained"
                onPress={() => onPay(payment)}
                style={styles.payButton}
                icon="cash-check"
              >
                Pay Full Amount (KES {payment.remaining_amount.toFixed(2)})
              </Button>
            )}
          </>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  amountContainer: {
    marginLeft: 8,
    flex: 1,
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
  },
  partialLabel: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  studentSection: {
    marginBottom: 12,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 2,
  },
  admissionNumber: {
    fontSize: 13,
    color: '#757575',
  },
  purposeSection: {
    marginBottom: 12,
  },
  purposeLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 4,
    fontWeight: '600',
  },
  purposeText: {
    fontSize: 14,
    color: '#212121',
    lineHeight: 20,
  },
  // 🆕 NEW - Progress bar styles
  progressContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  progressPercentage: {
    fontSize: 12,
    color: '#212121',
    fontWeight: 'bold',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressAmounts: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  progressPaid: {
    fontSize: 11,
    color: '#4CAF50',
    fontWeight: '600',
  },
  progressRemaining: {
    fontSize: 11,
    color: '#F44336',
    fontWeight: '600',
  },
  detailsSection: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailLabel: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
    marginRight: 6,
    minWidth: 60,
  },
  detailValue: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  // 🆕 NEW - Payment history styles
  historyContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  historyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2E7D32',
    marginBottom: 8,
  },
  historyItem: {
    marginBottom: 8,
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  historyAmount: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginLeft: 6,
    flex: 1,
  },
  historyDate: {
    fontSize: 11,
    color: '#757575',
  },
  historyRef: {
    fontSize: 10,
    color: '#757575',
    marginLeft: 22,
  },
  // 🆕 NEW - Quick payment styles
  quickPaymentContainer: {
    marginBottom: 12,
  },
  quickPaymentLabel: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 8,
    fontWeight: '600',
  },
  quickPaymentButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  quickPaymentButton: {
    marginRight: 8,
    marginBottom: 8,
  },
  // 🆕 NEW - Custom amount styles
  customAmountContainer: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  customAmountInput: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  errorText: {
    marginTop: -4,
    marginBottom: 8,
  },
  customAmountActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  customAmountCancel: {
    marginRight: 8,
  },
  customAmountPay: {
    backgroundColor: '#4CAF50',
  },
  payButton: {
    backgroundColor: '#4CAF50',
    marginTop: 8,
  },
});

export default PaymentRequestCard;