// ========================================
// GOD'S EYE EDTECH - GUARDIAN LINK REQUESTS SCREEN (TEACHER)
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Title, Text, Chip, Button, Avatar, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';
import * as guardianService from '../../services/guardianService';
import theme from '../../styles/theme';

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

      // Fetch all link requests
      const response = await guardianService.getLinkRequests({
        page_size: 100,
      });

      if (response.success) {
        const data = response.data.results || response.data;
        setRequests(data);
        applyFilter(selectedFilter, data);
      } else {
        throw new Error(response.message || 'Failed to load requests');
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
      setError(err.message || 'Failed to load requests. Please try again.');
      setRequests([]);
      setFilteredRequests([]);
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
    } else if (filter === 'pending_guardian') {
      // Pending guardian approval
      const filtered = requestsList.filter(
        r => r.status === 'pending' && !r.requires_teacher_approval
      );
      setFilteredRequests(filtered);
    } else if (filter === 'ready_for_teacher') {
      // All guardians approved, ready for teacher
      const filtered = requestsList.filter(
        r => r.status === 'approved' && 
             r.requires_teacher_approval && 
             !r.teacher_approved &&
             r.approval_progress?.is_complete
      );
      setFilteredRequests(filtered);
    } else if (filter === 'finalized') {
      // Teacher approved (finalized)
      const filtered = requestsList.filter(r => r.teacher_approved);
      setFilteredRequests(filtered);
    } else if (filter === 'expired') {
      const filtered = requestsList.filter(r => r.status === 'expired' || r.is_expired);
      setFilteredRequests(filtered);
    }
  };

  // Handle teacher approve
  const handleTeacherApprove = async (requestId) => {
    Alert.alert(
      'Approve Link Request',
      'Are you sure you want to approve this guardian link request?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await guardianService.teacherApproveLinkRequest(requestId);
              
              if (response.success) {
                Alert.alert('Success', 'Link request approved successfully!');
                fetchRequests();
              } else {
                throw new Error(response.message || 'Failed to approve request');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to approve request');
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle view student details
  const handleViewStudent = (studentId) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId });
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get status color
  const getStatusColor = (status, isExpired) => {
    if (isExpired) return theme.colors.disabled;
    switch (status) {
      case 'pending':
        return theme.colors.warning;
      case 'approved':
        return theme.colors.success;
      case 'rejected':
        return theme.colors.error;
      case 'expired':
        return theme.colors.disabled;
      default:
        return theme.colors.textSecondary;
    }
  };

  // Render request card
  const renderRequest = ({ item }) => {
    const progress = item.approval_progress || {};
    const isReadyForTeacher = 
      item.status === 'approved' && 
      item.requires_teacher_approval && 
      !item.teacher_approved &&
      progress.is_complete;

    return (
      <Card style={styles.card}>
        <Card.Content>
          {/* Header - Student & Guardian */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <MaterialCommunityIcons
                name="account-arrow-right"
                size={40}
                color={theme.colors.primary}
              />
              <View style={styles.headerText}>
                <Text style={styles.studentName}>{item.student_name}</Text>
                <Text style={styles.guardianName}>→ {item.guardian_name}</Text>
              </View>
            </View>
            <Chip
              mode="flat"
              style={[
                styles.statusChip,
                { backgroundColor: getStatusColor(item.status, item.is_expired) },
              ]}
              textStyle={styles.statusChipText}
            >
              {item.is_expired ? 'Expired' : item.status_display}
            </Chip>
          </View>

          <Divider style={styles.divider} />

          {/* Details */}
          <View style={styles.detailsRow}>
            <MaterialCommunityIcons name="heart-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              Relationship: {item.relationship_display}
            </Text>
          </View>

          <View style={styles.detailsRow}>
            <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.textSecondary} />
            <Text style={styles.detailText}>
              Created: {formatDate(item.created_at)}
            </Text>
          </View>

          {item.expires_at && !item.is_expired && (
            <View style={styles.detailsRow}>
              <MaterialCommunityIcons name="timer-sand" size={16} color={theme.colors.warning} />
              <Text style={[styles.detailText, { color: theme.colors.warning }]}>
                Expires: {formatDate(item.expires_at)} ({Math.ceil(item.hours_until_expiry)}h remaining)
              </Text>
            </View>
          )}

          {/* Approval Progress */}
          {item.requires_teacher_approval && progress && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressTitle}>Approval Progress:</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress.percentage || 0}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progress.approved || 0} / {progress.required || 0} approved
                {!item.teacher_approved && ' (Teacher approval pending)'}
              </Text>
            </View>
          )}

          {/* Teacher Approval Status */}
          {item.teacher_approved && (
            <View style={styles.approvedBanner}>
              <MaterialCommunityIcons name="check-circle" size={20} color={theme.colors.success} />
              <Text style={styles.approvedText}>
                Teacher Approved on {formatDate(item.teacher_approved_at)}
              </Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => handleViewStudent(item.student)}
              style={styles.actionButton}
              icon="eye"
              compact
            >
              View Student
            </Button>

            {isReadyForTeacher && (
              <Button
                mode="contained"
                onPress={() => handleTeacherApprove(item.id)}
                style={styles.approveButton}
                icon="check"
                compact
              >
                Approve
              </Button>
            )}
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (isLoading && !isRefreshing) {
    return <LoadingSpinner message="Loading link requests..." />;
  }

  return (
    <View style={styles.container}>
      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'pending_guardian'}
          onPress={() => applyFilter('pending_guardian')}
          style={styles.filterChip}
          icon="clock-outline"
        >
          Pending Guardian
        </Chip>
        <Chip
          selected={selectedFilter === 'ready_for_teacher'}
          onPress={() => applyFilter('ready_for_teacher')}
          style={styles.filterChip}
          icon="clipboard-check"
        >
          Ready for Approval
        </Chip>
        <Chip
          selected={selectedFilter === 'finalized'}
          onPress={() => applyFilter('finalized')}
          style={styles.filterChip}
          icon="check-circle"
        >
          Finalized
        </Chip>
        <Chip
          selected={selectedFilter === 'expired'}
          onPress={() => applyFilter('expired')}
          style={styles.filterChip}
          icon="timer-off"
        >
          Expired
        </Chip>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => applyFilter('all')}
          style={styles.filterChip}
          icon="format-list-bulleted"
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
          icon="clipboard-check-outline"
          title="No Requests"
          message={
            selectedFilter === 'pending_guardian'
              ? 'No pending guardian link requests'
              : selectedFilter === 'ready_for_teacher'
              ? 'No requests ready for your approval'
              : selectedFilter === 'finalized'
              ? 'No finalized requests'
              : selectedFilter === 'expired'
              ? 'No expired requests'
              : 'No guardian link requests yet'
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  filterChip: {
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  guardianName: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusChip: {
    height: 28,
  },
  statusChipText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.surface,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  detailText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  progressContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.sm,
  },
  progressTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.border,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: theme.spacing.xs,
  },
  progressFill: {
    height: '100%',
    backgroundColor: theme.colors.primary,
  },
  progressText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
  },
  approvedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: '#E8F5E9',
    borderRadius: theme.borderRadius.sm,
  },
  approvedText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  actionButton: {
    flex: 1,
  },
  approveButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
  },
});

export default GuardianLinkRequestsScreen;