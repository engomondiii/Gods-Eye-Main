// ========================================
// GOD'S EYE EDTECH - SCHOOL DETAIL SCREEN
// ========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Button,
  Divider,
  Chip,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as schoolService from '../../services/schoolService';

// ============================================================
// SCHOOL DETAIL SCREEN COMPONENT
// ============================================================

const SchoolDetailScreen = ({ route, navigation }) => {
  const { schoolId } = route.params;

  // State
  const [school, setSchool] = useState(null);
  const [statistics, setStatistics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // ============================================================
  // DATA FETCHING
  // ============================================================

  /**
   * Fetch school details
   */
  const fetchSchoolDetails = async () => {
    try {
      setError('');

      if (__DEV__) {
        console.log(`🏫 Fetching school ${schoolId}...`);
      }

      const result = await schoolService.getSchoolById(schoolId);

      if (result.success) {
        setSchool(result.data);

        if (__DEV__) {
          console.log(`✅ School loaded: ${result.data.name}`);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch school details');
      }
    } catch (err) {
      console.error('❌ Fetch school error:', err);
      setError('Failed to load school details. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  /**
   * Fetch school statistics
   */
  const fetchSchoolStatistics = async () => {
    try {
      if (__DEV__) {
        console.log(`📊 Fetching statistics for school ${schoolId}...`);
      }

      const result = await schoolService.getSchoolStatistics(schoolId);

      if (result.success) {
        setStatistics(result.data);

        if (__DEV__) {
          console.log(`✅ Statistics loaded`);
        }
      }
    } catch (err) {
      console.error('❌ Fetch statistics error:', err);
    }
  };

  /**
   * Initial data load
   */
  useEffect(() => {
    fetchSchoolDetails();
    fetchSchoolStatistics();
  }, [schoolId]);

  /**
   * Pull to refresh
   */
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchSchoolDetails();
    fetchSchoolStatistics();
  };

  // ============================================================
  // APPROVAL ACTIONS
  // ============================================================

  /**
   * Handle school approval
   */
  const handleApprove = async () => {
    Alert.alert(
      'Approve School',
      `Are you sure you want to approve "${school.name}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              if (__DEV__) {
                console.log(`✅ Approving school ${schoolId}...`);
              }

              const result = await schoolService.approveSchool(schoolId);

              if (result.success) {
                Alert.alert('Success', result.message || 'School approved successfully!', [
                  {
                    text: 'OK',
                    onPress: () => {
                      fetchSchoolDetails();
                      fetchSchoolStatistics();
                    },
                  },
                ]);
              } else {
                throw new Error(result.message || 'Failed to approve school');
              }
            } catch (error) {
              console.error('❌ Approve error:', error);
              Alert.alert('Error', 'Failed to approve school. Please try again.');
            }
          },
        },
      ]
    );
  };

  /**
   * Handle school rejection
   */
  const handleReject = async () => {
    Alert.prompt(
      'Reject School',
      `Please provide a reason for rejecting "${school.name}":`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async (rejectionReason) => {
            if (!rejectionReason || rejectionReason.trim() === '') {
              Alert.alert('Error', 'Rejection reason is required');
              return;
            }

            try {
              if (__DEV__) {
                console.log(`❌ Rejecting school ${schoolId}...`);
              }

              const result = await schoolService.rejectSchool(
                schoolId,
                rejectionReason
              );

              if (result.success) {
                Alert.alert('Rejected', result.message || 'School has been rejected', [
                  {
                    text: 'OK',
                    onPress: () => {
                      fetchSchoolDetails();
                      fetchSchoolStatistics();
                    },
                  },
                ]);
              } else {
                throw new Error(result.message || 'Failed to reject school');
              }
            } catch (error) {
              console.error('❌ Reject error:', error);
              Alert.alert('Error', 'Failed to reject school. Please try again.');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  // ============================================================
  // RENDER LOADING STATE
  // ============================================================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading school details...</Text>
      </View>
    );
  }

  // ============================================================
  // RENDER ERROR STATE
  // ============================================================

  if (error && !school) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorTitle}>Error</Text>
        <Text style={styles.errorMessage}>{error}</Text>
        <Button mode="contained" onPress={fetchSchoolDetails} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  // ============================================================
  // RENDER NO DATA STATE
  // ============================================================

  if (!school) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="school-outline" size={64} color="#BDBDBD" />
        <Text style={styles.errorTitle}>School Not Found</Text>
        <Button mode="contained" onPress={() => navigation.goBack()}>
          Go Back
        </Button>
      </View>
    );
  }

  // ============================================================
  // RENDER SCHOOL DETAILS
  // ============================================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#6200EE']}
        />
      }
    >
      {/* School Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="school" size={60} color="#6200EE" />
            </View>
            <View style={styles.headerTextContainer}>
              <Title style={styles.schoolName}>{school.name}</Title>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  school.approval_status === 'approved' && styles.approvedChip,
                  school.approval_status === 'pending' && styles.pendingChip,
                  school.approval_status === 'rejected' && styles.rejectedChip,
                ]}
                textStyle={styles.chipText}
              >
                {school.approval_status_display || school.approval_status}
              </Chip>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Basic Information */}
          <Text style={styles.sectionTitle}>Basic Information</Text>

          <InfoRow icon="identifier" label="NEMIS Code" value={school.nemis_code || 'N/A'} />
          <InfoRow icon="email" label="Email" value={school.email || 'N/A'} />
          <InfoRow icon="phone" label="Phone" value={school.phone || 'N/A'} />
          <InfoRow icon="home" label="Address" value={school.address || 'N/A'} />

          <Divider style={styles.divider} />

          {/* Location Information */}
          <Text style={styles.sectionTitle}>Location Details</Text>

          <InfoRow
            icon="map-marker"
            label="County"
            value={school.county_data?.name || school.county_name || 'N/A'}
          />

          <Divider style={styles.divider} />

          {/* Registration Information */}
          <Text style={styles.sectionTitle}>Registration Details</Text>

          <InfoRow icon="calendar" label="Created" value={formatDate(school.created_at)} />

          {school.approval_status === 'approved' && school.approved_at && (
            <>
              <InfoRow
                icon="check-circle"
                label="Approved"
                value={formatDate(school.approved_at)}
              />
              {school.approved_by_name && (
                <InfoRow
                  icon="account-check"
                  label="Approved By"
                  value={school.approved_by_name}
                />
              )}
            </>
          )}

          {school.approval_status === 'rejected' && school.rejection_reason && (
            <View style={styles.rejectionContainer}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#F44336" />
              <View style={styles.rejectionTextContainer}>
                <Text style={styles.rejectionLabel}>Rejection Reason:</Text>
                <Text style={styles.rejectionText}>{school.rejection_reason}</Text>
              </View>
            </View>
          )}

          <InfoRow
            icon="power"
            label="Status"
            value={school.is_active ? 'Active' : 'Inactive'}
            valueColor={school.is_active ? '#4CAF50' : '#F44336'}
          />
        </Card.Content>
      </Card>

      {/* Statistics Card */}
      {statistics && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>School Statistics</Title>

            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="account-school"
                  size={32}
                  color="#2196F3"
                />
                <Text style={styles.statNumber}>
                  {statistics.total_students || 0}
                </Text>
                <Text style={styles.statLabel}>Students</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <MaterialCommunityIcons name="account-tie" size={32} color="#4CAF50" />
                <Text style={styles.statNumber}>
                  {statistics.total_teachers || 0}
                </Text>
                <Text style={styles.statLabel}>Teachers</Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <MaterialCommunityIcons
                  name="account-group"
                  size={32}
                  color="#9C27B0"
                />
                <Text style={styles.statNumber}>
                  {statistics.total_guardians || 0}
                </Text>
                <Text style={styles.statLabel}>Guardians</Text>
              </View>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* School Settings Card */}
      {school.settings && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>School Settings</Title>

            <View style={styles.settingsRow}>
              <Text style={styles.settingLabel}>Current Term:</Text>
              <Text style={styles.settingValue}>
                {school.settings.current_term || 'N/A'}
              </Text>
            </View>

            <View style={styles.settingsRow}>
              <Text style={styles.settingLabel}>Academic Year:</Text>
              <Text style={styles.settingValue}>
                {school.settings.academic_year || 'N/A'}
              </Text>
            </View>

            <View style={styles.settingsRow}>
              <Text style={styles.settingLabel}>Biometric Enabled:</Text>
              <MaterialCommunityIcons
                name={
                  school.settings.enable_biometric ? 'check-circle' : 'close-circle'
                }
                size={20}
                color={school.settings.enable_biometric ? '#4CAF50' : '#F44336'}
              />
            </View>

            <View style={styles.settingsRow}>
              <Text style={styles.settingLabel}>QR Code Enabled:</Text>
              <MaterialCommunityIcons
                name={school.settings.enable_qr_code ? 'check-circle' : 'close-circle'}
                size={20}
                color={school.settings.enable_qr_code ? '#4CAF50' : '#F44336'}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Action Buttons */}
      {school.approval_status === 'pending' && (
        <View style={styles.actionButtonsContainer}>
          <Button
            mode="contained"
            onPress={handleApprove}
            style={styles.approveButton}
            icon="check-circle"
          >
            Approve School
          </Button>
          <Button
            mode="outlined"
            onPress={handleReject}
            style={styles.rejectButton}
            icon="close-circle"
            textColor="#F44336"
          >
            Reject School
          </Button>
        </View>
      )}
    </ScrollView>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

/**
 * Info Row Component
 */
const InfoRow = ({ icon, label, value, valueColor }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#757575" />
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>{value}</Text>
  </View>
);

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#F44336',
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: '#6200EE',
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  approvedChip: {
    backgroundColor: '#E8F5E9',
  },
  pendingChip: {
    backgroundColor: '#FFF3E0',
  },
  rejectedChip: {
    backgroundColor: '#FFEBEE',
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  rejectionContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  rejectionTextContainer: {
    marginLeft: 12,
    flex: 1,
  },
  rejectionLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
    marginBottom: 4,
  },
  rejectionText: {
    fontSize: 14,
    color: '#212121',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
  },
  settingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  settingLabel: {
    fontSize: 14,
    color: '#757575',
  },
  settingValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
  },
  actionButtonsContainer: {
    marginBottom: 16,
  },
  approveButton: {
    marginBottom: 12,
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
});

// ============================================================
// EXPORTS
// ============================================================

export default SchoolDetailScreen;