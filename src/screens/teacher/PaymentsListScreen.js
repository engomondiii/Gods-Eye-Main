import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Searchbar, Chip, FAB } from 'react-native-paper';
import PaymentRequestCard from '../../components/guardian/PaymentRequestCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS, PAYMENT_STATUS } from '../../utils/constants';
import * as paymentService from '../../services/paymentService';

const PaymentsListScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });

  // Fetch payment requests from API
  const fetchPayments = async (page = 1, resetData = false) => {
    try {
      setError('');
      
      const response = await paymentService.getPaymentRequests({
        page: page,
        page_size: pagination.page_size,
        status: selectedFilter !== 'all' ? selectedFilter : undefined,
        school: user.school?.id,
        search: searchQuery || undefined,
      });
      
      if (response.success) {
        const newPayments = response.data.results || [];
        
        if (resetData || page === 1) {
          setPayments(newPayments);
          setFilteredPayments(newPayments);
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
  }, [selectedFilter, searchQuery]);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Execute search
  const executeSearch = () => {
    setIsLoading(true);
    fetchPayments(1, true);
  };

  // Load more data
  const handleLoadMore = () => {
    if (!isLoading && payments.length < pagination.total) {
      fetchPayments(pagination.page + 1, false);
    }
  };

  // Filter functionality
  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handlePaymentPress = (payment) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, {
      studentId: payment.student.id,
    });
  };

  const renderPayment = ({ item }) => (
    <PaymentRequestCard
      payment={item}
      onPress={() => handlePaymentPress(item)}
      showActions={false}
      userRole="teacher"
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
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by student or purpose"
          onChangeText={handleSearch}
          onSubmitEditing={executeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => applyFilter('all')}
          style={styles.filterChip}
        >
          All ({pagination.total})
        </Chip>
        <Chip
          selected={selectedFilter === PAYMENT_STATUS.PENDING}
          onPress={() => applyFilter(PAYMENT_STATUS.PENDING)}
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
          selected={selectedFilter === PAYMENT_STATUS.APPROVED}
          onPress={() => applyFilter(PAYMENT_STATUS.APPROVED)}
          style={styles.filterChip}
        >
          Approved
        </Chip>
        <Chip
          selected={selectedFilter === PAYMENT_STATUS.PAID}
          onPress={() => applyFilter(PAYMENT_STATUS.PAID)}
          style={styles.filterChip}
        >
          Paid
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
            searchQuery
              ? 'No payment requests match your search'
              : selectedFilter === 'all'
              ? 'Start by creating your first payment request'
              : `No ${selectedFilter} payment requests`
          }
        />
      )}

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="cash-plus"
        onPress={() => navigation.navigate(SCREENS.CREATE_PAYMENT_REQUEST)}
        label="New Payment"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  listContent: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200EE',
  },
});

export default PaymentsListScreen;