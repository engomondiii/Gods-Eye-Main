// ========================================
// GOD'S EYE EDTECH - PENDING APPROVALS SCREEN (GUARDIAN)
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Card, Title, Text, Button, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';
import * as guardianService from '../../services/guardianService';
import theme from '../../styles/theme';

const PendingApprovalsScreen = ({ navigation }) => {
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch pending approval requests
  const fetchRequests = async () => {
    try {
      setError('');

      const response = await guardianService.getPendingApprovals();

      if (response.success) {
        setRequests(response.data || []);
      } else {
        throw new Error(response.message || 'Failed to load approval requests');
      }
    } catch (err) {
      console.error('Fetch requests error:', err);
      setError(err.message || 'Failed to load approval requests. Please try again.');
      setRequests([]);
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

  // Handle approve
  const handleApprove = async (requestId) => {
    Alert.alert(
      'Approve Guardian Link',
      'Are you sure you want to approve this guardian link request? This will allow the new guardian to access this student\'s information.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await guardianService.approveLinkRequest(requestId);
              
              if (response.success) {
                Alert.alert('Success', 'Request approved successfully!');
                fetchRequests();
              } else {
                throw new Error(response.message || 'Failed to approve request');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to approve request. Please try again.');
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Handle reject
  const handleReject = async (requestId) => {
    Alert.prompt(
      'Reject Guardian Link',
      'Please provide a reason for rejection (optional):',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (reason) => {
            try {
              setIsLoading(true);
              const response = await guardianService.rejectLinkRequest(requestId, reason || '');
              
              if (response.success) {
                Alert.alert('Rejected', 'Request has been rejected.');
                fetchRequests();
              } else {
                throw new Error(response.message || 'Failed to reject request');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to reject request. Please try again.');
              setIsLoading(false);
            }
          },
        },
      ],
      'plain-text'
    );
  };

  // Handle view student
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

  // Render request card
  const renderRequest = ({ item }) => {
    const progress = item.approval_progress || {};

    return (
      <Card style={styles.card}>
        <Card.Content>
          {/* Header */}
          <View style={styles.header}>
            <MaterialCommunityIcons
              name="account-plus"
              size={32}
              color={theme.colors.primary}
            />
            <View style={styles.headerText}>
              <Text style={styles.studentName}>{item.student_name}</Text>
              <Text style={styles.subtitle}>New Guardian Link Request</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* New Guardian Info */}
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>New Guardian:</Text>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>{item.guardian_name}</Text>
            </View>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="heart-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>
                Relationship: {item.relationship_display}
              </Text>
            </View>
          </View>

          {/* Request Details */}
          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clock-outline" size={16} color={theme.colors.textSecondary} />
              <Text style={styles.infoText}>
                Requested: {formatDate(item.created_at)}
              </Text>
            </View>
            {item.expires_at && !item.is_expired && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="timer-sand" size={16} color={theme.colors.warning} />
                <Text style={[styles.infoText, { color: theme.colors.warning }]}>
                  Expires: {formatDate(item.expires_at)}
                </Text>
              </View>
            )}
          </View>

          {/* Approval Progress */}
          {progress && (
            <View style={styles.progressContainer}>
              <Text style={styles.progressTitle}>Approval Status:</Text>
              <View style={styles.progressBar}>
                <View
                  style={[
                    styles.progressFill,
                    { width: `${progress.percentage || 0}%` },
                  ]}
                />
              </View>
              <Text style={styles.progressText}>
                {progress.approved || 0} / {progress.required || 0} guardians approved
              </Text>
            </View>
          )}

          {/* Notes */}
          {item.notes && (
            <View style={styles.notesContainer}>
              <Text style={styles.notesTitle}>Notes:</Text>
              <Text style={styles.notesText}>{item.notes}</Text>
            </View>
          )}

          {/* Actions */}
          <View style={styles.actions}>
            <Button
              mode="outlined"
              onPress={() => handleViewStudent(item.student)}
              style={styles.viewButton}
              icon="eye"
              compact
            >
              View Student
            </Button>
            <Button
              mode="contained"
              onPress={() => handleApprove(item.id)}
              style={styles.approveButton}
              icon="check"
              compact
            >
              Approve
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleReject(item.id)}
              style={styles.rejectButton}
              textColor={theme.colors.error}
              icon="close"
              compact
            >
              Reject
            </Button>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (isLoading && !isRefreshing) {
    return <LoadingSpinner message="Loading pending approvals..." />;
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
    backgroundColor: theme.colors.background,
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
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  headerText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  divider: {
    marginVertical: theme.spacing.sm,
  },
  infoSection: {
    marginBottom: theme.spacing.sm,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  infoText: {
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
  notesContainer: {
    marginTop: theme.spacing.sm,
    padding: theme.spacing.sm,
    backgroundColor: '#FFF3E0',
    borderRadius: theme.borderRadius.sm,
    borderLeftWidth: 3,
    borderLeftColor: theme.colors.warning,
  },
  notesTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  notesText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    marginTop: theme.spacing.md,
    gap: theme.spacing.sm,
  },
  viewButton: {
    flex: 1,
  },
  approveButton: {
    flex: 1,
    backgroundColor: theme.colors.success,
  },
  rejectButton: {
    flex: 1,
    borderColor: theme.colors.error,
  },
});

export default PendingApprovalsScreen;