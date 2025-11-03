import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
} from 'react-native';
import { Searchbar, Chip, FAB } from 'react-native-paper';
import PaymentRequestCard from '../../components/guardian/PaymentRequestCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS, PAYMENT_STATUS } from '../../utils/constants';

const PaymentsListScreen = ({ navigation }) => {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch payment requests
  const fetchPayments = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await paymentService.getPaymentRequests();
      
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
          mpesa_ref: null,
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
          mpesa_ref: null,
        },
        {
          id: 3,
          student: {
            id: 3,
            first_name: 'David',
            last_name: 'Johnson',
            admission_number: 'NPS003',
          },
          amount: 2000.00,
          purpose: 'Field trip to museum',
          created_at: '2025-10-20T09:00:00Z',
          due_date: '2025-11-05',
          status: PAYMENT_STATUS.PAID,
          mpesa_ref: 'RKJ123XYZ789',
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

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      applyFilter(selectedFilter);
      return;
    }
    
    const filtered = payments.filter((payment) => {
      const studentName = `${payment.student.first_name} ${payment.student.last_name}`.toLowerCase();
      const admissionNumber = payment.student.admission_number.toLowerCase();
      const purpose = payment.purpose.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        studentName.includes(searchLower) ||
        admissionNumber.includes(searchLower) ||
        purpose.includes(searchLower)
      );
    });
    
    setFilteredPayments(filtered);
  };

  // Filter functionality
  const applyFilter = (filter, paymentsList = payments) => {
    setSelectedFilter(filter);
    
    let filtered = paymentsList;
    
    if (filter !== 'all') {
      filtered = paymentsList.filter(p => p.status === filter);
    }
    
    // Apply search if active
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((payment) => {
        const studentName = `${payment.student.first_name} ${payment.student.last_name}`.toLowerCase();
        const admissionNumber = payment.student.admission_number.toLowerCase();
        const purpose = payment.purpose.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        return (
          studentName.includes(searchLower) ||
          admissionNumber.includes(searchLower) ||
          purpose.includes(searchLower)
        );
      });
    }
    
    setFilteredPayments(filtered);
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
    />
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by student or purpose"
          onChangeText={handleSearch}
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
          All ({payments.length})
        </Chip>
        <Chip
          selected={selectedFilter === PAYMENT_STATUS.PENDING}
          onPress={() => applyFilter(PAYMENT_STATUS.PENDING)}
          style={styles.filterChip}
        >
          Pending
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
  },
  filterChip: {
    marginRight: 8,
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