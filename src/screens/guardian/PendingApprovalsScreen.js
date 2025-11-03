import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import ApprovalRequestCard from '../../components/guardian/ApprovalRequestCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';

const PendingApprovalsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch pending approval requests
  const fetchRequests = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await guardianService.getPendingApprovals();
      
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
            relationship: 'Uncle',
          },
          created_at: '2025-10-26T10:00:00Z',
          expires_at: '2025-10-27T10:00:00Z',
          approved_by: [],
          total_guardians: 2,
          teacher: {
            first_name: 'Mrs.',
            last_name: 'Teacher',
          },
        },
      ];
      
      setRequests(mockRequests);
    } catch (err) {
      setError('Failed to load approval requests. Please try again.');
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

  const handleApprove = async (requestId) => {
    Alert.alert(
      'Approve Guardian Link',
      'Are you sure you want to approve this guardian link request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await guardianService.approveRequest(requestId);
              
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert('Success', 'Request approved successfully!');
              fetchRequests();
            } catch (error) {
              Alert.alert('Error', 'Failed to approve request. Please try again.');
              console.error('Approve error:', error);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (requestId) => {
    Alert.alert(
      'Reject Guardian Link',
      'Are you sure you want to reject this guardian link request? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await guardianService.rejectRequest(requestId);
              
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert('Rejected', 'Request has been rejected.');
              fetchRequests();
            } catch (error) {
              Alert.alert('Error', 'Failed to reject request. Please try again.');
              console.error('Reject error:', error);
            }
          },
        },
      ]
    );
  };

  const handleViewStudent = (studentId) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId });
  };

  const renderRequest = ({ item }) => (
    <ApprovalRequestCard
      request={item}
      onApprove={() => handleApprove(item.id)}
      onReject={() => handleReject(item.id)}
      onViewStudent={() => handleViewStudent(item.student.id)}
    />
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchRequests} /> : null}

      {/* Requests List */}
      {requests.length > 0 ? (
        <FlatList
          data={requests}
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
          icon="clipboard-check-outline"
          title="No Pending Approvals"
          message="You don't have any guardian link requests waiting for your approval."
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
  listContent: {
    padding: 16,
  },
});

export default PendingApprovalsScreen;