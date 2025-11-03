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
      
      // Mock data for development
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
          status: PAYMENT_STATUS.APPROVED,
          requested_by: {
            first_name: 'Mr.',
            last_name: 'Johnson',
          },
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

  const handlePay = async (payment) => {
    Alert.alert(
      'Make Payment',
      `Pay KES ${payment.amount.toFixed(2)} for ${payment.purpose}?\n\nThis will redirect you to M-Pesa payment.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Pay Now',
          onPress: async () => {
            try {
              // TODO: Replace with actual M-Pesa integration
              // await paymentService.initiatePayment(payment.id);
              
              // Mock payment
              await new Promise(resolve => setTimeout(resolve, 2000));
              
              Alert.alert(
                'Payment Initiated',
                'Please complete the payment on your phone. You will receive an M-Pesa prompt shortly.'
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
      onPay={() => handlePay(item)}
      showActions={item.status === PAYMENT_STATUS.PENDING || item.status === PAYMENT_STATUS.APPROVED}
    />
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'pending'}
          onPress={() => applyFilter('pending')}
          style={styles.filterChip}
        >
          Pending
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