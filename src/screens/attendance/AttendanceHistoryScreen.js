// ========================================
// GOD'S EYE EDTECH - ATTENDANCE HISTORY SCREEN
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Searchbar, Chip, Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { ATTENDANCE_STATUS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import useAttendance from '../../hooks/useAttendance';

const AttendanceHistoryScreen = ({ navigation }) => {
  const {
    attendanceHistory,
    isLoading,
    error,
    fetchAttendanceHistory,
  } = useAttendance();

  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedMethod, selectedStatus, selectedDate, searchQuery, attendanceHistory]);

  const loadHistory = async () => {
    await fetchAttendanceHistory();
  };

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    await fetchAttendanceHistory();
    setIsRefreshing(false);
  }, [fetchAttendanceHistory]);

  const applyFilters = () => {
    let filtered = [...attendanceHistory];

    // Filter by method
    if (selectedMethod !== 'all') {
      filtered = filtered.filter(r => r.check_in_method === selectedMethod);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(r => r.status === selectedStatus);
    }

    // Filter by date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (selectedDate === 'today') {
      filtered = filtered.filter(r => {
        const recordDate = new Date(r.date);
        return recordDate >= today;
      });
    } else if (selectedDate === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.date) >= weekAgo);
    } else if (selectedDate === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.date) >= monthAgo);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        const name = r.student_name?.toLowerCase() || '';
        const admission = r.student_admission?.toLowerCase() || '';
        return name.includes(query) || admission.includes(query);
      });
    }

    setFilteredRecords(filtered);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return theme.colors.success;
      case ATTENDANCE_STATUS.ABSENT:
        return theme.colors.error;
      case ATTENDANCE_STATUS.LATE:
        return theme.colors.warning;
      case ATTENDANCE_STATUS.EXCUSED:
        return theme.colors.info;
      default:
        return theme.colors.textSecondary;
    }
  };

  const getMethodIcon = (method) => {
    switch (method) {
      case 'qr_code':
        return 'qrcode';
      case 'fingerprint':
        return 'fingerprint';
      case 'face_recognition':
        return 'face-recognition';
      case 'one_time_code':
        return 'numeric';
      case 'manual':
        return 'pencil';
      default:
        return 'help-circle';
    }
  };

  const renderRecord = ({ item }) => (
    <Card style={styles.recordCard} onPress={() => console.log('Record pressed:', item)}>
      <Card.Content style={styles.recordContent}>
        <View style={styles.recordLeft}>
          <MaterialCommunityIcons
            name="account-circle"
            size={40}
            color={theme.colors.primary}
          />
          <View style={styles.recordInfo}>
            <Text style={styles.recordName}>{item.student_name}</Text>
            <View style={styles.recordDetails}>
              <MaterialCommunityIcons
                name={getMethodIcon(item.check_in_method)}
                size={14}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.recordDetailText}>
                {new Date(item.date).toLocaleDateString()} • {item.check_in_time ? new Date(item.check_in_time).toLocaleTimeString() : 'N/A'}
              </Text>
            </View>
          </View>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: getStatusColor(item.status) + '20' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: getStatusColor(item.status) }
          ]}>
            {item.status_display || item.status}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading && !isRefreshing && attendanceHistory.length === 0) {
    return <LoadingSpinner message="Loading history..." />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search students..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filters */}
      <View style={styles.filtersContainer}>
        <View style={styles.filterRow}>
          <Chip
            selected={selectedDate === 'today'}
            onPress={() => setSelectedDate('today')}
            style={styles.filterChip}
          >
            Today
          </Chip>
          <Chip
            selected={selectedDate === 'week'}
            onPress={() => setSelectedDate('week')}
            style={styles.filterChip}
          >
            This Week
          </Chip>
          <Chip
            selected={selectedDate === 'month'}
            onPress={() => setSelectedDate('month')}
            style={styles.filterChip}
          >
            This Month
          </Chip>
          <Chip
            selected={selectedDate === 'all'}
            onPress={() => setSelectedDate('all')}
            style={styles.filterChip}
          >
            All Time
          </Chip>
        </View>

        <View style={styles.filterRow}>
          <Chip
            selected={selectedStatus === 'all'}
            onPress={() => setSelectedStatus('all')}
            style={styles.filterChip}
          >
            All Status
          </Chip>
          <Chip
            selected={selectedStatus === ATTENDANCE_STATUS.PRESENT}
            onPress={() => setSelectedStatus(ATTENDANCE_STATUS.PRESENT)}
            style={styles.filterChip}
            icon="check-circle"
          >
            Present
          </Chip>
          <Chip
            selected={selectedStatus === ATTENDANCE_STATUS.ABSENT}
            onPress={() => setSelectedStatus(ATTENDANCE_STATUS.ABSENT)}
            style={styles.filterChip}
            icon="close-circle"
          >
            Absent
          </Chip>
        </View>

        <View style={styles.filterRow}>
          <Chip
            selected={selectedMethod === 'all'}
            onPress={() => setSelectedMethod('all')}
            style={styles.filterChip}
          >
            All Methods
          </Chip>
          <Chip
            selected={selectedMethod === 'qr_code'}
            onPress={() => setSelectedMethod('qr_code')}
            style={styles.filterChip}
            icon="qrcode"
          >
            QR
          </Chip>
          <Chip
            selected={selectedMethod === 'fingerprint'}
            onPress={() => setSelectedMethod('fingerprint')}
            style={styles.filterChip}
            icon="fingerprint"
          >
            Fingerprint
          </Chip>
          <Chip
            selected={selectedMethod === 'manual'}
            onPress={() => setSelectedMethod('manual')}
            style={styles.filterChip}
            icon="pencil"
          >
            Manual
          </Chip>
        </View>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={loadHistory} /> : null}

      {/* Records List */}
      <FlatList
        data={filteredRecords}
        renderItem={renderRecord}
        keyExtractor={(item, index) => item.id?.toString() || index.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={isRefreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="clipboard-text-outline"
              size={64}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'No records match your search' : 'No attendance records found'}
            </Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme.colors.background,
  },
  filtersContainer: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: theme.spacing.sm,
  },
  filterChip: {
    marginRight: theme.spacing.sm,
    marginBottom: theme.spacing.sm,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  recordCard: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  recordContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  recordInfo: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  recordName: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  recordDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  recordDetailText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
  statusBadge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    marginLeft: theme.spacing.sm,
  },
  statusText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: theme.spacing.xl,
    marginTop: theme.spacing.xl,
  },
  emptyStateText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
    textAlign: 'center',
  },
});

export default AttendanceHistoryScreen;