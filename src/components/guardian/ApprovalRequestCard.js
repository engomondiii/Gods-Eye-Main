import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate, getTimeRemaining } from '../../utils/formatters';

const ApprovalRequestCard = ({ request, onApprove, onReject, onViewStudent }) => {
  const timeRemaining = getTimeRemaining(request.expires_at);
  const approvalProgress = `${request.approved_by.length}/${request.total_guardians}`;
  const isExpiringSoon = timeRemaining && timeRemaining.includes('hour');

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="account-multiple-plus"
              size={24}
              color="#FF9800"
            />
            <Text style={styles.headerText}>Guardian Link Request</Text>
          </View>
          {isExpiringSoon && (
            <Chip
              mode="flat"
              style={styles.urgentChip}
              textStyle={styles.urgentChipText}
              icon="clock-alert"
            >
              Urgent
            </Chip>
          )}
        </View>

        {/* Student Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Student</Text>
          <Text style={styles.studentName}>
            {request.student.first_name} {request.student.last_name}
          </Text>
          <Text style={styles.studentDetails}>
            {request.student.admission_number}
          </Text>
        </View>

        {/* New Guardian Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>New Guardian</Text>
          <Text style={styles.guardianName}>
            {request.new_guardian.first_name} {request.new_guardian.last_name}
          </Text>
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="phone" size={14} color="#757575" />
            <Text style={styles.detailText}>{request.new_guardian.phone}</Text>
          </View>
          {request.new_guardian.relationship && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account-heart" size={14} color="#757575" />
              <Text style={styles.detailText}>
                {request.new_guardian.relationship}
              </Text>
            </View>
          )}
        </View>

        {/* Request Details */}
        <View style={styles.infoBox}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#757575" />
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{formatDate(request.created_at)}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="clock" size={16} color="#757575" />
            <Text style={styles.infoLabel}>Expires:</Text>
            <Text style={[styles.infoValue, isExpiringSoon && styles.urgentText]}>
              {timeRemaining || 'Soon'}
            </Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="check-circle" size={16} color="#757575" />
            <Text style={styles.infoLabel}>Approvals:</Text>
            <Text style={styles.infoValue}>{approvalProgress}</Text>
          </View>
          {request.teacher && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account-tie" size={16} color="#757575" />
              <Text style={styles.infoLabel}>Requested by:</Text>
              <Text style={styles.infoValue}>
                {request.teacher.first_name} {request.teacher.last_name}
              </Text>
            </View>
          )}
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            mode="outlined"
            onPress={onViewStudent}
            style={styles.viewButton}
            icon="eye"
          >
            View Student
          </Button>
          <View style={styles.actionButtons}>
            <Button
              mode="outlined"
              onPress={onReject}
              style={styles.rejectButton}
              textColor="#F44336"
              icon="close"
            >
              Reject
            </Button>
            <Button
              mode="contained"
              onPress={onApprove}
              style={styles.approveButton}
              icon="check"
            >
              Approve
            </Button>
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 8,
  },
  urgentChip: {
    backgroundColor: '#FFEBEE',
    height: 28,
  },
  urgentChipText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F44336',
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
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
  studentDetails: {
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
    marginTop: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
  },
  infoBox: {
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 6,
    marginRight: 6,
    minWidth: 80,
  },
  infoValue: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  urgentText: {
    color: '#F44336',
    fontWeight: 'bold',
  },
  actions: {
    marginTop: 8,
  },
  viewButton: {
    marginBottom: 8,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rejectButton: {
    flex: 1,
    marginRight: 8,
    borderColor: '#F44336',
  },
  approveButton: {
    flex: 1,
    backgroundColor: '#4CAF50',
  },
});

export default ApprovalRequestCard;