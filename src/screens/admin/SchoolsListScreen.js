// ========================================
// GOD'S EYE EDTECH - SCHOOLS LIST SCREEN
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {
  Searchbar,
  Chip,
  Card,
  Title,
  Paragraph,
  Button,
  Text,
  Divider,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as schoolService from '../../services/schoolService';
import { SCREENS } from '../../utils/constants';

// ============================================================
// SCHOOLS LIST SCREEN COMPONENT
// ============================================================

const SchoolsListScreen = ({ navigation }) => {
  // State
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');
  const [statistics, setStatistics] = useState(null);

  // ============================================================
  // DATA FETCHING
  // ============================================================

  /**
   * Fetch schools from backend
   */
  const fetchSchools = async () => {
    try {
      setError('');

      if (__DEV__) {
        console.log('🏫 Fetching schools...');
      }

      const result = await schoolService.getSchools();

      if (result.success) {
        // Handle both array and paginated response
        const schoolsData = Array.isArray(result.data)
          ? result.data
          : result.data.results || [];

        setSchools(schoolsData);
        applyFilter(selectedFilter, schoolsData);

        if (__DEV__) {
          console.log(`✅ Loaded ${schoolsData.length} schools`);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch schools');
      }
    } catch (err) {
      console.error('❌ Fetch schools error:', err);
      setError('Failed to load schools. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  /**
   * Fetch system statistics
   */
  const fetchStatistics = async () => {
    try {
      const result = await schoolService.getSystemStatistics();

      if (result.success) {
        setStatistics(result.data);

        if (__DEV__) {
          console.log('✅ Statistics loaded:', result.data);
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
    fetchSchools();
    fetchStatistics();
  }, []);

  /**
   * Pull to refresh
   */
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchSchools();
    fetchStatistics();
  }, []);

  // ============================================================
  // SEARCH & FILTER
  // ============================================================

  /**
   * Search functionality
   */
  const handleSearch = (query) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      applyFilter(selectedFilter);
      return;
    }

    const filtered = schools.filter((school) => {
      const schoolName = school.name.toLowerCase();
      const countyName = school.county_name?.toLowerCase() || '';
      const nemisCode = school.nemis_code?.toLowerCase() || '';
      const searchLower = query.toLowerCase();

      return (
        schoolName.includes(searchLower) ||
        countyName.includes(searchLower) ||
        nemisCode.includes(searchLower)
      );
    });

    setFilteredSchools(filtered);
  };

  /**
   * Filter functionality
   */
  const applyFilter = (filter, schoolsList = schools) => {
    setSelectedFilter(filter);

    let filtered = schoolsList;

    if (filter === 'pending') {
      filtered = schoolsList.filter((s) => s.approval_status === 'pending');
    } else if (filter === 'approved') {
      filtered = schoolsList.filter((s) => s.approval_status === 'approved');
    } else if (filter === 'rejected') {
      filtered = schoolsList.filter((s) => s.approval_status === 'rejected');
    }

    // Apply search if active
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((school) => {
        const schoolName = school.name.toLowerCase();
        const countyName = school.county_name?.toLowerCase() || '';
        const nemisCode = school.nemis_code?.toLowerCase() || '';
        const searchLower = searchQuery.toLowerCase();

        return (
          schoolName.includes(searchLower) ||
          countyName.includes(searchLower) ||
          nemisCode.includes(searchLower)
        );
      });
    }

    setFilteredSchools(filtered);
  };

  // ============================================================
  // APPROVAL ACTIONS
  // ============================================================

  /**
   * Handle school approval
   */
  const handleApprove = async (school) => {
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
                console.log(`✅ Approving school ${school.id}...`);
              }

              const result = await schoolService.approveSchool(school.id);

              if (result.success) {
                Alert.alert('Success', result.message || 'School approved successfully!');
                fetchSchools();
                fetchStatistics();
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
  const handleReject = async (school) => {
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
                console.log(`❌ Rejecting school ${school.id}...`);
              }

              const result = await schoolService.rejectSchool(
                school.id,
                rejectionReason
              );

              if (result.success) {
                Alert.alert('Rejected', result.message || 'School has been rejected');
                fetchSchools();
                fetchStatistics();
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

  /**
   * Navigate to school details
   */
  const handleViewDetails = (school) => {
    navigation.navigate(SCREENS.SCHOOL_DETAIL, { schoolId: school.id });
  };

  // ============================================================
  // RENDER FUNCTIONS
  // ============================================================

  /**
   * Render school card
   */
  const renderSchool = ({ item: school }) => (
    <Card style={styles.schoolCard} onPress={() => handleViewDetails(school)}>
      <Card.Content>
        {/* School Header */}
        <View style={styles.schoolHeader}>
          <View style={styles.schoolIcon}>
            <MaterialCommunityIcons name="school" size={40} color="#6200EE" />
          </View>
          <View style={styles.schoolInfo}>
            <Title style={styles.schoolName} numberOfLines={2}>
              {school.name}
            </Title>
            <View style={styles.schoolMeta}>
              <MaterialCommunityIcons name="map-marker" size={14} color="#757575" />
              <Text style={styles.schoolMetaText}>{school.county_name}</Text>
              {school.nemis_code && (
                <>
                  <Text style={styles.separator}>•</Text>
                  <Text style={styles.schoolMetaText}>
                    NEMIS: {school.nemis_code}
                  </Text>
                </>
              )}
            </View>
          </View>
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

        <Divider style={styles.divider} />

        {/* School Details */}
        <View style={styles.schoolDetails}>
          {school.address && (
            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="home" size={16} color="#757575" />
              <Text style={styles.detailText} numberOfLines={1}>
                {school.address}
              </Text>
            </View>
          )}
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="calendar" size={16} color="#757575" />
            <Text style={styles.detailText}>
              Created: {new Date(school.created_at).toLocaleDateString()}
            </Text>
          </View>
        </View>

        {/* Action Buttons for Pending Schools */}
        {school.approval_status === 'pending' && (
          <View style={styles.actionButtons}>
            <Button
              mode="contained"
              onPress={() => handleApprove(school)}
              style={styles.approveButton}
              icon="check-circle"
              compact
            >
              Approve
            </Button>
            <Button
              mode="outlined"
              onPress={() => handleReject(school)}
              style={styles.rejectButton}
              icon="close-circle"
              textColor="#F44336"
              compact
            >
              Reject
            </Button>
          </View>
        )}
      </Card.Content>
    </Card>
  );

  /**
   * Render statistics header
   */
  const renderStatistics = () => {
    if (!statistics) return null;

    return (
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.statsTitle}>System Overview</Title>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>{statistics.total_schools}</Text>
              <Text style={styles.statLabel}>Total</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.pendingNumber]}>
                {statistics.pending_schools}
              </Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.approvedNumber]}>
                {statistics.approved_schools}
              </Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={[styles.statNumber, styles.rejectedNumber]}>
                {statistics.rejected_schools}
              </Text>
              <Text style={styles.statLabel}>Rejected</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  /**
   * Render empty state
   */
  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <MaterialCommunityIcons name="school-outline" size={64} color="#BDBDBD" />
      <Text style={styles.emptyTitle}>No Schools Found</Text>
      <Text style={styles.emptyMessage}>
        {searchQuery
          ? 'No schools match your search criteria'
          : selectedFilter === 'pending'
          ? 'No schools pending approval'
          : selectedFilter === 'approved'
          ? 'No approved schools yet'
          : selectedFilter === 'rejected'
          ? 'No rejected schools'
          : 'No schools in the system yet'}
      </Text>
    </View>
  );

  /**
   * Render error state
   */
  const renderErrorState = () => (
    <View style={styles.errorState}>
      <MaterialCommunityIcons name="alert-circle" size={64} color="#F44336" />
      <Text style={styles.errorTitle}>Error Loading Schools</Text>
      <Text style={styles.errorMessage}>{error}</Text>
      <Button mode="contained" onPress={fetchSchools} style={styles.retryButton}>
        Retry
      </Button>
    </View>
  );

  // ============================================================
  // RENDER MAIN
  // ============================================================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading schools...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name, county, or NEMIS code"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          icon="school"
        />
      </View>

      {/* Statistics */}
      {renderStatistics()}

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'pending'}
          onPress={() => applyFilter('pending')}
          style={styles.filterChip}
          icon="clock-outline"
        >
          Pending ({statistics?.pending_schools || 0})
        </Chip>
        <Chip
          selected={selectedFilter === 'approved'}
          onPress={() => applyFilter('approved')}
          style={styles.filterChip}
          icon="check-circle"
        >
          Approved ({statistics?.approved_schools || 0})
        </Chip>
        <Chip
          selected={selectedFilter === 'rejected'}
          onPress={() => applyFilter('rejected')}
          style={styles.filterChip}
          icon="close-circle"
        >
          Rejected ({statistics?.rejected_schools || 0})
        </Chip>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => applyFilter('all')}
          style={styles.filterChip}
          icon="school"
        >
          All ({statistics?.total_schools || 0})
        </Chip>
      </View>

      {/* Error State */}
      {error && !isRefreshing ? renderErrorState() : null}

      {/* Schools List */}
      {!error && filteredSchools.length > 0 ? (
        <FlatList
          data={filteredSchools}
          renderItem={renderSchool}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={onRefresh}
              colors={['#6200EE']}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : !error && filteredSchools.length === 0 ? (
        renderEmptyState()
      ) : null}
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  statsCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
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
    marginBottom: 4,
  },
  pendingNumber: {
    color: '#FF9800',
  },
  approvedNumber: {
    color: '#4CAF50',
  },
  rejectedNumber: {
    color: '#F44336',
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
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
  schoolCard: {
    marginBottom: 16,
    elevation: 2,
  },
  schoolHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  schoolIcon: {
    marginRight: 12,
  },
  schoolInfo: {
    flex: 1,
    marginRight: 8,
  },
  schoolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  schoolMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  schoolMetaText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  separator: {
    fontSize: 12,
    color: '#757575',
    marginHorizontal: 6,
  },
  statusChip: {
    height: 28,
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
    marginVertical: 12,
  },
  schoolDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    flex: 1,
  },
  actionButtons: {
    flexDirection: 'row',
    marginTop: 8,
  },
  approveButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    flex: 1,
    borderColor: '#F44336',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

// ============================================================
// EXPORTS
// ============================================================

export default SchoolsListScreen;