import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Button, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '../../utils/formatters';

const SchoolCard = ({ school, onApprove, onReject, onViewDetails }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="school"
              size={32}
              color={school.approved ? '#4CAF50' : '#FF9800'}
            />
            <View style={styles.headerTextContainer}>
              <Text style={styles.schoolName} numberOfLines={2}>
                {school.name}
              </Text>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  school.approved ? styles.approvedChip : styles.pendingChip,
                ]}
                textStyle={styles.chipText}
              >
                {school.approved ? 'APPROVED' : 'PENDING'}
              </Chip>
            </View>
          </View>
        </View>

        {/* Location Info */}
        <View style={styles.locationSection}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={16} color="#757575" />
            <Text style={styles.infoLabel}>County:</Text>
            <Text style={styles.infoValue}>{school.county.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="earth" size={16} color="#757575" />
            <Text style={styles.infoLabel}>Country:</Text>
            <Text style={styles.infoValue}>{school.country.name}</Text>
          </View>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="home" size={16} color="#757575" />
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue} numberOfLines={1}>
              {school.address}
            </Text>
          </View>
        </View>

        {/* Statistics */}
        {school.approved && (
          <View style={styles.statsSection}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{school.total_students || 0}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{school.total_teachers || 0}</Text>
              <Text style={styles.statLabel}>Teachers</Text>
            </View>
          </View>
        )}

        {/* Dates */}
        <View style={styles.datesSection}>
          <View style={styles.dateRow}>
            <MaterialCommunityIcons name="calendar" size={14} color="#757575" />
            <Text style={styles.dateLabel}>Created:</Text>
            <Text style={styles.dateValue}>{formatDate(school.created_at)}</Text>
          </View>
          {school.approved && school.approval_date && (
            <View style={styles.dateRow}>
              <MaterialCommunityIcons name="check-circle" size={14} color="#757575" />
              <Text style={styles.dateLabel}>Approved:</Text>
              <Text style={styles.dateValue}>{formatDate(school.approval_date)}</Text>
            </View>
          )}
        </View>

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
          {!school.approved && (
            <View style={styles.approvalButtons}>
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
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
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
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
    height: 28,
  },
  approvedChip: {
    backgroundColor: '#E8F5E9',
  },
  pendingChip: {
    backgroundColor: '#FFF3E0',
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  locationSection: {
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  infoLabel: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 6,
    marginRight: 6,
    minWidth: 60,
  },
  infoValue: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  statsSection: {
    flexDirection: 'row',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  datesSection: {
    backgroundColor: '#F5F5F5',
    padding: 10,
    borderRadius: 8,
    marginBottom: 12,
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  dateLabel: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
    marginRight: 6,
    minWidth: 70,
  },
  dateValue: {
    fontSize: 12,
    color: '#212121',
    fontWeight: '500',
  },
  actions: {
    marginTop: 8,
  },
  viewButton: {
    marginBottom: 8,
  },
  approvalButtons: {
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

export default SchoolCard;