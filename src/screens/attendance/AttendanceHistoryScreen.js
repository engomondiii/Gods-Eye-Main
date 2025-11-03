import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Searchbar, Chip, Menu, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { ATTENDANCE_METHODS } from '../../utils/constants';
import RecentAttendanceList from '../../components/attendance/RecentAttendanceList';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AttendanceHistoryScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [selectedDate, setSelectedDate] = useState('today');
  const [menuVisible, setMenuVisible] = useState(false);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    fetchAttendanceHistory();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [selectedMethod, selectedDate, searchQuery, records]);

  const fetchAttendanceHistory = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await attendanceService.getHistory();
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockRecords = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        student: {
          first_name: ['John', 'Sarah', 'Mike', 'Emma'][i % 4],
          last_name: ['Doe', 'Smith', 'Johnson', 'Williams'][i % 4],
        },
        attendance_type: i % 3 === 0 ? 'check_out' : 'check_in',
        method: Object.values(ATTENDANCE_METHODS)[i % 5],
        timestamp: new Date(Date.now() - i * 3600000).toISOString(),
        notes: i % 5 === 0 ? 'Late arrival' : '',
      }));
      
      setRecords(mockRecords);
      setFilteredRecords(mockRecords);
    } catch (err) {
      setError('Failed to load attendance history. Please try again.');
      console.error('History error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...records];

    // Filter by method
    if (selectedMethod !== 'all') {
      filtered = filtered.filter(r => r.method === selectedMethod);
    }

    // Filter by date
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    if (selectedDate === 'today') {
      filtered = filtered.filter(r => new Date(r.timestamp) >= today);
    } else if (selectedDate === 'week') {
      const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.timestamp) >= weekAgo);
    } else if (selectedDate === 'month') {
      const monthAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);
      filtered = filtered.filter(r => new Date(r.timestamp) >= monthAgo);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r => {
        const name = `${r.student.first_name} ${r.student.last_name}`.toLowerCase();
        return name.includes(query);
      });
    }

    setFilteredRecords(filtered);
  };

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchAttendanceHistory();
  }, []);

  const handleRecordPress = (record) => {
    console.log('Record pressed:', record);
  };

  if (isLoading) {
    return <LoadingSpinner />;
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
            selected={selectedMethod === 'all'}
            onPress={() => setSelectedMethod('all')}
            style={styles.filterChip}
          >
            All Methods
          </Chip>
          <Chip
            selected={selectedMethod === ATTENDANCE_METHODS.QR_CODE}
            onPress={() => setSelectedMethod(ATTENDANCE_METHODS.QR_CODE)}
            style={styles.filterChip}
            icon="qrcode"
          >
            QR
          </Chip>
          <Chip
            selected={selectedMethod === ATTENDANCE_METHODS.FINGERPRINT}
            onPress={() => setSelectedMethod(ATTENDANCE_METHODS.FINGERPRINT)}
            style={styles.filterChip}
            icon="fingerprint"
          >
            Fingerprint
          </Chip>
          <Chip
            selected={selectedMethod === ATTENDANCE_METHODS.MANUAL}
            onPress={() => setSelectedMethod(ATTENDANCE_METHODS.MANUAL)}
            style={styles.filterChip}
            icon="pencil"
          >
            Manual
          </Chip>
        </View>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchAttendanceHistory} /> : null}

      {/* Records List */}
      <RecentAttendanceList
        records={filteredRecords}
        onRecordPress={handleRecordPress}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        showStudent={true}
        emptyMessage={
          searchQuery
            ? 'No records match your search'
            : 'No attendance records found'
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
});

export default AttendanceHistoryScreen;