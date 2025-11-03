import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Button, Chip, ProgressBar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate, getTimeRemaining } from '../../utils/formatters';
import { REQUEST_STATUS } from '../../utils/constants';

const PendingApprovalCard = ({ request, onApprove, onViewDetails }) => {
  const timeRemaining = getTimeRemaining(request.expires_at);
  const approvalProgress = request.approved_by.length / request.total_guardians;
  const isReadyForTeacher = request.status === REQUEST_STATUS.APPROVED && !request.teacher_approved;
  const isExpiringSoon = timeRemaining && timeRemaining.includes('hour');

  const getStatusColor = () => {
    if (isReadyForTeacher) return '#4CAF50';
    if (isExpiringSoon) return '#F44336';
    return '#FF9800';
  };

  const getStatusText = () => {
    if (isReadyForTeacher) return 'Ready for Your Approval';
    if (request.teacher_approved) return 'Approved';
    return `Waiting for Guardians (${request.approved_by.length}/${request.total_guardians})`;
  };

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="clipboard-check"
              size={24}
              color={getStatusColor()}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.headerTitle}>Guardian Link Request</Text>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  { backgroundColor: getStatusColor() + '20' },
                ]}
                textStyle={[styles.statusText, { color: getStatusColor() }]}
              >
                {getStatusText()}
              </Chip>
            </View>
          </View>
        </View>

        {/* Student Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Student</Text>
          <Text style={styles.studentName}>
            {request.student.first_name} {request.student.last_name}
          </Text>
          <Text style={styles.admissionNumber}>
            {request.student.admission_number}
          </Text>
        </View>

        {/* New Guardian Info */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>New Guardian</Text>
          <Text style={styles.guardianName}>
            {request.new_guardian.first_name} {request.new_guardian.last_name}
          </Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="phone" size={14} color="#757575" />
            <Text style={styles.detailText}>{request.new_guardian.phone}</Text>
          </View>
        </View>

        {/* Progress Section */}
        {!isReadyForTeacher && !request.teacher_approved && (
          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressLabel}>Guardian Approval Progress</Text>
              <Text style={styles.progressText}>
                {request.approved_by.length}/{request.total_guardians}
              </Text>
            </View>
            <ProgressBar
              progress={approvalProgress}
              color={approvalProgress === 1 ? '#4CAF50' : '#FF9800'}
              style={styles.progressBar}
            />
          </View>
        )}

        {/* Details */}
        <View style={styles.detailsBox}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={14} color="#757575" />
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{formatDate(request.created_at)}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock" size={14} color="#757575" />
            <Text style={styles.infoLabel}>Expires:</Text>
            <Text style={[styles.infoValue, isExpiringSoon && styles.urgentText]}>
              {timeRemaining || 'Soon'}
            </Text>
          </View>
        </View>

        {/* Approved Guardians List */}
        {request.approved_by.length > 0 && (
          <View style={styles.approvedSection}>
            <Text style={styles.approvedLabel}>Approved by:</Text>
            {request.approved_by.map((guardian) => (
              <View key={guardian.id} style={styles.approvedItem}>
                <MaterialCommunityIcons name="check-circle" size={16} color="#4CAF50" />
                <Text style={styles.approvedName}>
                  {guardian.first_name} {guardian.last_name}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={onViewDetails}
            style={styles.viewButton}
            icon="eye"
          >
            View Details
          </Button>
          {isReadyForTeacher && (
            <Button
              mode="contained"
              onPress={onApprove}
              style={styles.approveButton}
              icon="check-circle"
            >
              Approve Request
            </Button>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
  },
  header: {
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    height: 28,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 12,
    color: '#757575',
    textTransform: 'uppercase',
    marginBottom: 4,
    fontWeight: '600',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2,
  },
  admissionNumber: {
    fontSize: 13,
    color: '#757575',
  },
  guardianName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
  },
  progressSection: {
    marginBottom: 12,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
  },
  progressText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
  },
  progressBar: {
    height: 8,
    borderRadius: 4,
  },
  detailsBox: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
    marginRight: 6,
    minWidth: 60,
  },
  infoValue: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  urgentText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  approvedSection: {
    backgroundColor: '#E8F5E9',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  approvedLabel: {
    fontSize: 12,
    color: '#4CAF50',
    fontWeight: '600',
    marginBottom: 8,
  },
  approvedItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  approvedName: {
    fontSize: 13,
    color: '#212121',
    marginLeft: 8,
  },
  actions: {
    marginTop: 8,
  },
  viewButton: {
    marginBottom: 8,
  },
  approveButton: {
    backgroundColor: '#4CAF50',
  },
});

export default PendingApprovalCard;