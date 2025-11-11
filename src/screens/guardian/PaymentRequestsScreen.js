import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Chip } from 'react-native-paper';
import PaymentRequestCard from '../../components/guardian/PaymentRequestCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { PAYMENT_STATUS } from '../../utils/constants';

const PaymentRequestsScreen = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');

  // Fetch payment requests
  const fetchPayments = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await guardianService.getPaymentRequests();
      
      // Mock data for development - 🆕 UPDATED with partial payment examples
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockPayments = [
        {
          id: 1,
          student: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            admission_number: 'NPS001',
          },
          amount: 5000.00,
          purpose: 'School fees for Term 1, 2025',
          created_at: '2025-10-25T10:00:00Z',
          due_date: '2025-11-15',
          status: PAYMENT_STATUS.PENDING,
          requested_by: {
            first_name: 'Mrs.',
            last_name: 'Teacher',
          },
          // 🆕 NEW - Partial payment fields
          allow_partial: true,
          minimum_amount: 1000.00,
          paid_amount: 0.00,
          remaining_amount: 5000.00,
          installment_count: 0,
          payment_history: [],
        },
        {
          id: 2,
          student: {
            id: 2,
            first_name: 'Sarah',
            last_name: 'Smith',
            admission_number: 'NPS002',
          },
          amount: 3500.00,
          purpose: 'Exam fees for November 2025',
          created_at: '2025-10-24T14:30:00Z',
          due_date: '2025-11-10',
          status: PAYMENT_STATUS.PARTIALLY_PAID,
          requested_by: {
            first_name: 'Mr.',
            last_name: 'Johnson',
          },
          // 🆕 NEW - Partial payment fields
          allow_partial: true,
          minimum_amount: 1000.00,
          paid_amount: 1500.00,
          remaining_amount: 2000.00,
          installment_count: 1,
          payment_history: [
            {
              id: 1,
              amount: 1500.00,
              payment_date: '2025-10-26T10:30:00Z',
              mpesa_ref: 'QJK789ABC456',
              guardian: {
                first_name: 'Jane',
                last_name: 'Doe',
              },
            },
          ],
        },
        {
          id: 3,
          student: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            admission_number: 'NPS001',
          },
          amount: 2000.00,
          purpose: 'Field trip to museum',
          created_at: '2025-10-20T09:00:00Z',
          due_date: '2025-11-05',
          status: PAYMENT_STATUS.PAID,
          mpesa_ref: 'RKJ123XYZ789',
          requested_by: {
            first_name: 'Mrs.',
            last_name: 'Teacher',
          },
          // 🆕 NEW - Partial payment fields
          allow_partial: false,
          minimum_amount: 2000.00,
          paid_amount: 2000.00,
          remaining_amount: 0.00,
          installment_count: 1,
          payment_history: [
            {
              id: 2,
              amount: 2000.00,
              payment_date: '2025-10-22T15:30:00Z',
              mpesa_ref: 'RKJ123XYZ789',
              guardian: {
                first_name: 'Jane',
                last_name: 'Doe',
              },
            },
          ],
        },
        {
          id: 4,
          student: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            admission_number: 'NPS001',
          },
          amount: 1200.00,
          purpose: 'School Uniform - Full Set',
          created_at: '2025-11-01T10:00:00Z',
          due_date: '2025-11-20',
          status: PAYMENT_STATUS.PENDING,
          requested_by: {
            first_name: 'Mrs.',
            last_name: 'Teacher',
          },
          // 🆕 NEW - Full payment only example
          allow_partial: false,
          minimum_amount: 1200.00,
          paid_amount: 0.00,
          remaining_amount: 1200.00,
          installment_count: 0,
          payment_history: [],
        },
      ];
      
      setPayments(mockPayments);
      applyFilter(selectedFilter, mockPayments);
    } catch (err) {
      setError('Failed to load payment requests. Please try again.');
      console.error('Fetch payments error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPayments();
  }, []);

  // Filter functionality
  const applyFilter = (filter, paymentsList = payments) => {
    setSelectedFilter(filter);
    
    if (filter === 'all') {
      setFilteredPayments(paymentsList);
    } else {
      const filtered = paymentsList.filter(p => p.status === filter);
      setFilteredPayments(filtered);
    }
  };

  // 🆕 UPDATED - Handle pay with custom amount support
  const handlePay = async (payment, customAmount = null) => {
    const amountToPay = customAmount || payment.remaining_amount;
    
    // Build payment confirmation message
    let confirmMessage = `Pay KES ${amountToPay.toFixed(2)} for ${payment.purpose}?`;
    
    if (payment.allow_partial && customAmount) {
      const remainingAfterPayment = payment.remaining_amount - amountToPay;
      confirmMessage += `\n\n✓ Partial payment\n`;
      confirmMessage += `✓ Remaining balance: KES ${remainingAfterPayment.toFixed(2)}`;
    } else if (payment.allow_partial && !customAmount) {
      confirmMessage += `\n\n✓ Full remaining balance`;
    }
    
    confirmMessage += `\n\nThis will redirect you to M-Pesa payment.`;
    
    Alert.alert(
      'Make Payment',
      confirmMessage,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: async () => {
            try {
              // TODO: Replace with actual M-Pesa integration
              // await paymentService.submitPartialPayment(payment.id, amountToPay);
              
              // Mock payment
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              const remainingAfterPayment = payment.remaining_amount - amountToPay;
              const isFullyPaid = remainingAfterPayment <= 0;
              
              Alert.alert(
                'Payment Initiated',
                isFullyPaid
                  ? 'Please complete the payment on your phone. Payment will be marked as fully paid once confirmed.'
                  : `Please complete the payment on your phone.\n\nRemaining balance: KES ${remainingAfterPayment.toFixed(2)}`
              );
              fetchPayments();
            } catch (error) {
              Alert.alert('Error', 'Failed to initiate payment. Please try again.');
              console.error('Payment error:', error);
            }
          },
        },
      ]
    );
  };

  const renderPayment = ({ item }) => (
    <PaymentRequestCard
      payment={item}
      onPay={handlePay}  // 🆕 UPDATED - Now supports custom amounts
      showActions={
        item.status === PAYMENT_STATUS.PENDING || 
        item.status === PAYMENT_STATUS.APPROVED ||
        item.status === PAYMENT_STATUS.PARTIALLY_PAID  // 🆕 NEW
      }
      userRole="guardian"  // 🆕 NEW
    />
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Filter Chips - 🆕 UPDATED with partial paid */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'pending'}
          onPress={() => applyFilter('pending')}
          style={styles.filterChip}
        >
          Pending
        </Chip>
        <Chip
          selected={selectedFilter === PAYMENT_STATUS.PARTIALLY_PAID}
          onPress={() => applyFilter(PAYMENT_STATUS.PARTIALLY_PAID)}
          style={styles.filterChip}
        >
          Partial
        </Chip>
        <Chip
          selected={selectedFilter === 'approved'}
          onPress={() => applyFilter('approved')}
          style={styles.filterChip}
        >
          Approved
        </Chip>
        <Chip
          selected={selectedFilter === 'paid'}
          onPress={() => applyFilter('paid')}
          style={styles.filterChip}
        >
          Paid
        </Chip>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => applyFilter('all')}
          style={styles.filterChip}
        >
          All
        </Chip>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchPayments} /> : null}

      {/* Payments List */}
      {filteredPayments.length > 0 ? (
        <FlatList
          data={filteredPayments}
          renderItem={renderPayment}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="cash-remove"
          title="No Payment Requests"
          message={
            selectedFilter === 'all'
              ? 'You have no payment requests'
              : `No ${selectedFilter} payment requests`
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
});

export default PaymentRequestsScreen;