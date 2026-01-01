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
import MpesaPaymentModal from '../../components/payment/MpesaPaymentModal';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { PAYMENT_STATUS } from '../../utils/constants';
import * as paymentService from '../../services/paymentService';

const PaymentRequestsScreen = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  
  // M-Pesa modal state
  const [showMpesaModal, setShowMpesaModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [customAmount, setCustomAmount] = useState(null);

  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });

  // Fetch payment requests from API
  const fetchPayments = async (page = 1, resetData = false) => {
    try {
      setError('');
      
      const response = await paymentService.getMyPayments({
        page: page,
        page_size: pagination.page_size,
        status: selectedFilter !== 'all' ? selectedFilter : undefined,
      });
      
      if (response.success) {
        const newPayments = response.data.results || [];
        
        if (resetData || page === 1) {
          setPayments(newPayments);
          applyFilter(selectedFilter, newPayments);
        } else {
          setPayments(prev => [...prev, ...newPayments]);
          setFilteredPayments(prev => [...prev, ...newPayments]);
        }
        
        setPagination({
          page: page,
          page_size: pagination.page_size,
          total: response.data.count || 0,
        });
      } else {
        setError(response.message || 'Failed to load payment requests');
      }
    } catch (err) {
      setError('Failed to load payment requests. Please try again.');
      console.error('Fetch payments error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPayments(1, true);
  }, [selectedFilter]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchPayments(1, true);
  }, [selectedFilter]);

  // Load more data
  const handleLoadMore = () => {
    if (!isLoading && payments.length < pagination.total) {
      fetchPayments(pagination.page + 1, false);
    }
  };

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

  // Handle pay with M-Pesa modal
  const handlePay = (payment, amount = null) => {
    setSelectedPayment(payment);
    setCustomAmount(amount);
    setShowMpesaModal(true);
  };

  // Handle successful payment
  const handlePaymentSuccess = () => {
    setShowMpesaModal(false);
    setSelectedPayment(null);
    setCustomAmount(null);
    
    // Refresh the list
    fetchPayments(1, true);
    
    Alert.alert(
      'Payment Initiated',
      'Please complete the payment on your phone. The payment status will be updated once confirmed.',
      [{ text: 'OK' }]
    );
  };

  const renderPayment = ({ item }) => (
    <PaymentRequestCard
      payment={item}
      onPay={handlePay}
      showActions={
        item.status === PAYMENT_STATUS.PENDING || 
        item.status === PAYMENT_STATUS.APPROVED ||
        item.status === PAYMENT_STATUS.PARTIALLY_PAID
      }
      userRole="guardian"
    />
  );

  const renderFooter = () => {
    if (!isLoading || pagination.page === 1) return null;
    return <LoadingSpinner />;
  };

  if (isLoading && pagination.page === 1) {
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
      {error ? <ErrorMessage message={error} onRetry={() => fetchPayments(1, true)} /> : null}

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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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

      {/* M-Pesa Payment Modal */}
      <MpesaPaymentModal
        visible={showMpesaModal}
        onDismiss={() => {
          setShowMpesaModal(false);
          setSelectedPayment(null);
          setCustomAmount(null);
        }}
        paymentRequest={selectedPayment}
        customAmount={customAmount}
        onSuccess={handlePaymentSuccess}
      />
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