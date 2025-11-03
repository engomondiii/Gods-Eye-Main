import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
} from 'react-native';
import { Chip, FAB } from 'react-native-paper';
import PendingApprovalCard from '../../components/teacher/PendingApprovalCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS, REQUEST_STATUS } from '../../utils/constants';

const GuardianLinkRequestsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');

  // Fetch guardian link requests
  const fetchRequests = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await guardianService.getLinkRequests();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRequests = [
        {
          id: 1,
          student: {
            id: 1,
            first_name: 'John',
            last_name: 'Doe',
            admission_number: 'NPS001',
          },
          new_guardian: {
            id: 3,
            first_name: 'Uncle',
            last_name: 'Doe',
            phone: '+254734567890',
          },
          created_at: '2025-10-26T10:00:00Z',
          expires_at: '2025-10-27T10:00:00Z',
          approved_by: [
            { id: 1, first_name: 'Jane', last_name: 'Doe' },
          ],
          total_guardians: 2,
          status: REQUEST_STATUS.PENDING,
          teacher_approved: false,
        },
        {
          id: 2,
          student: {
            id: 2,
            first_name: 'Sarah',
            last_name: 'Smith',
            admission_number: 'NPS002',
          },
          new_guardian: {
            id: 6,
            first_name: 'Aunt',
            last_name: 'Smith',
            phone: '+254745678901',
          },
          created_at: '2025-10-25T14:30:00Z',
          expires_at: '2025-10-26T14:30:00Z',
          approved_by: [
            { id: 3, first_name: 'Emily', last_name: 'Smith' },
          ],
          total_guardians: 1,
          status: REQUEST_STATUS.APPROVED,
          teacher_approved: false,
        },
      ];
      
      setRequests(mockRequests);
      applyFilter(selectedFilter, mockRequests);
    } catch (err) {
      setError('Failed to load requests. Please try again.');
      console.error('Fetch requests error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchRequests();
  }, []);

  // Filter functionality
  const applyFilter = (filter, requestsList = requests) => {
    setSelectedFilter(filter);
    
    if (filter === 'all') {
      setFilteredRequests(requestsList);
    } else if (filter === 'pending') {
      const filtered = requestsList.filter(
        r => r.status === REQUEST_STATUS.PENDING
      );
      setFilteredRequests(filtered);
    } else if (filter === 'approved') {
      const filtered = requestsList.filter(
        r => r.status === REQUEST_STATUS.APPROVED && !r.teacher_approved
      );
      setFilteredRequests(filtered);
    } else if (filter === 'finalized') {
      const filtered = requestsList.filter(r => r.teacher_approved);
      setFilteredRequests(filtered);
    }
  };

  const handleApprove = async (requestId) => {
    try {
      // TODO: Replace with actual API call
      // await guardianService.teacherApproveRequest(requestId);
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Refresh the list
      fetchRequests();
    } catch (error) {
      console.error('Approve error:', error);
    }
  };

  const handleViewDetails = (request) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, {
      studentId: request.student.id,
    });
  };

  const renderRequest = ({ item }) => (
    <PendingApprovalCard
      request={item}
      onApprove={() => handleApprove(item.id)}
      onViewDetails={() => handleViewDetails(item)}
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
          Pending Guardian
        </Chip>
        <Chip
          selected={selectedFilter === 'approved'}
          onPress={() => applyFilter('approved')}
          style={styles.filterChip}
        >
          Ready for Approval
        </Chip>
        <Chip
          selected={selectedFilter === 'finalized'}
          onPress={() => applyFilter('finalized')}
          style={styles.filterChip}
        >
          Finalized
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
      {error ? <ErrorMessage message={error} onRetry={fetchRequests} /> : null}

      {/* Requests List */}
      {filteredRequests.length > 0 ? (
        <FlatList
          data={filteredRequests}
          renderItem={renderRequest}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="clipboard-check"
          title="No Requests"
          message={
            selectedFilter === 'pending'
              ? 'No pending guardian link requests'
              : selectedFilter === 'approved'
              ? 'No requests ready for your approval'
              : 'No guardian link requests yet'
          }
        />
      )}

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="account-multiple-plus"
        onPress={() => navigation.navigate(SCREENS.CREATE_GUARDIAN_LINK)}
        label="Link Guardian"
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
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200EE',
  },
});

export default GuardianLinkRequestsScreen;