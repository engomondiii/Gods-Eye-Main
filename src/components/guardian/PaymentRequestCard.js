import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '../../utils/formatters';
import { PAYMENT_STATUS } from '../../utils/constants';

const PaymentRequestCard = ({ payment, onPay, onPress, showActions = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.PENDING:
        return '#FF9800';
      case PAYMENT_STATUS.APPROVED:
        return '#2196F3';
      case PAYMENT_STATUS.PAID:
        return '#4CAF50';
      case PAYMENT_STATUS.REJECTED:
        return '#F44336';
      default:
        return '#757575';
    }
  };

  const getStatusBackgroundColor = (status) => {
    switch (status) {
      case PAYMENT_STATUS.PENDING:
        return '#FFF3E0';
      case PAYMENT_STATUS.APPROVED:
        return '#E3F2FD';
      case PAYMENT_STATUS.PAID:
        return '#E8F5E9';
      case PAYMENT_STATUS.REJECTED:
        return '#FFEBEE';
      default:
        return '#F5F5F5';
    }
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
            <Text style={styles.amount}>
              KES {payment.amount.toFixed(2)}
            </Text>
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
            {payment.status.toUpperCase()}
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
              {payment.status === PAYMENT_STATUS.PAID
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
          {payment.mpesa_ref && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="receipt" size={14} color="#757575" />
              <Text style={styles.detailLabel}>M-Pesa Ref:</Text>
              <Text style={styles.detailValue}>{payment.mpesa_ref}</Text>
            </View>
          )}
        </View>

        {/* Action Button */}
        {showActions && (payment.status === PAYMENT_STATUS.PENDING || payment.status === PAYMENT_STATUS.APPROVED) && (
          <Button
            mode="contained"
            onPress={onPay}
            style={styles.payButton}
            icon="cash-check"
          >
            Pay Now
          </Button>
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
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  amount: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 8,
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
  payButton: {
    backgroundColor: '#4CAF50',
    marginTop: 8,
  },
});

export default PaymentRequestCard;