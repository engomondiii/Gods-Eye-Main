// ========================================
// SMARTSCHOOL MVP - ATTENDANCE SUMMARY SCREEN
// Shows today's attendance + SMS sent status
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Dimensions,
  FlatList,
} from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
  Chip,
  Button,
  Divider,
  IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import theme from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const { width } = Dimensions.get('window');

const AttendanceSummaryScreen = ({ navigation, route }) => {
  const { user } = useAuth();
  const { get } = useApi();
  
  const classId = route?.params?.classId;
  const className = route?.params?.className;
  
  const [todaysAttendance, setTodaysAttendance] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);
  const [filterStatus, setFilterStatus] = useState('ALL'); // ALL, PRESENT, ABSENT, SMS_FAILED

  // ============================================================
  // FETCH TODAY'S ATTENDANCE
  // ============================================================

  const fetchTodaysAttendance = useCallback(async () => {
    try {
      setError('');
      
      // Get today's attendance records
      const params = classId ? `?class_id=${classId}` : '';
      const response = await get(`/api/attendance/today/${params}`);
      
      if (response.success || Array.isArray(response)) {
        const attendanceData = Array.isArray(response) ? response : response.data;
        setTodaysAttendance(attendanceData);
        
        // Calculate statistics
        const total = attendanceData.length;
        const present = attendanceData.filter(a => a.status === 'PRESENT').length;
        const absent = total - present;
        const smsSent = attendanceData.filter(a => a.sms_sent).length;
        
        setStats({
          total,
          present,
          absent,
          smsSent,
          presentPercentage: total > 0 ? ((present / total) * 100).toFixed(1) : 0,
        });
      } else {
        throw new Error(response.message || 'Failed to load attendance');
      }
    } catch (err) {
      console.error('Fetch attendance error:', err);
      setError('Failed to load attendance. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [classId, get]);

  useEffect(() => {
    fetchTodaysAttendance();
  }, [fetchTodaysAttendance]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchTodaysAttendance();
  }, [fetchTodaysAttendance]);

  // ============================================================
  // FILTER ATTENDANCE
  // ============================================================

  const getFilteredAttendance = () => {
    switch (filterStatus) {
      case 'PRESENT':
        return todaysAttendance.filter(a => a.status === 'PRESENT');
      case 'ABSENT':
        return todaysAttendance.filter(a => a.status === 'ABSENT');
      case 'SMS_FAILED':
        return todaysAttendance.filter(a => !a.sms_sent);
      default:
        return todaysAttendance;
    }
  };

  // ============================================================
  // RENDER ATTENDANCE ITEM
  // ============================================================

  const renderAttendanceItem = ({ item }) => {
    const isPresent = item.status === 'PRESENT';
    const statusColor = isPresent ? theme.colors.success : theme.colors.error;
    const statusIcon = isPresent ? 'check-circle' : 'close-circle';
    
    return (
      <Card style={styles.attendanceCard}>
        <Card.Content style={styles.cardContent}>
          <View style={styles.itemRow}>
            {/* STUDENT NAME */}
            <View style={styles.studentInfo}>
              <Text 
                style={styles.studentName}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.student_name}
              </Text>
              {item.time_marked && (
                <Text style={styles.timestamp}>
                  {item.time_marked}
                </Text>
              )}
            </View>

            {/* STATUS BADGE */}
            <View style={styles.statusSection}>
              <MaterialCommunityIcons
                name={statusIcon}
                size={20}
                color={statusColor}
              />
              <Text style={[styles.statusText, { color: statusColor }]}>
                {isPresent ? 'Present' : 'Absent'}
              </Text>
            </View>
          </View>

          {/* SMS STATUS */}
          <View style={styles.smsRow}>
            <View style={styles.smsStatus}>
              <MaterialCommunityIcons
                name={item.sms_sent ? 'check-circle' : 'alert-circle-outline'}
                size={16}
                color={item.sms_sent ? theme.colors.success : theme.colors.warning}
              />
              <Text 
                style={[
                  styles.smsText,
                  { color: item.sms_sent ? theme.colors.success : theme.colors.warning }
                ]}
              >
                SMS {item.sms_sent ? 'Sent' : 'Pending'}
              </Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return <LoadingSpinner message="Loading attendance..." />;
  }

  if (error && !todaysAttendance.length) {
    return (
      <View style={styles.container}>
        <ErrorMessage 
          message={error}
          onRetry={fetchTodaysAttendance}
        />
      </View>
    );
  }

  const filteredAttendance = getFilteredAttendance();

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerText}>Today's Attendance</Text>
            {className && (
              <Text style={styles.headerSubtext}>{className}</Text>
            )}
          </View>
          <IconButton
            icon="refresh"
            size={24}
            onPress={onRefresh}
            loading={isRefreshing}
          />
        </View>

        {/* STATISTICS CARDS */}
        {stats && (
          <View style={styles.statsContainer}>
            <StatCard
              icon="account-multiple-check"
              label="Present"
              value={stats.present}
              color={theme.colors.success}
            />
            <StatCard
              icon="account-multiple-minus"
              label="Absent"
              value={stats.absent}
              color={theme.colors.error}
            />
            <StatCard
              icon="percent"
              label="Attendance"
              value={`${stats.presentPercentage}%`}
              color={theme.colors.primary}
            />
            <StatCard
              icon="message-check"
              label="SMS Sent"
              value={stats.smsSent}
              color={theme.colors.tertiary}
            />
          </View>
        )}

        {/* FILTER BUTTONS */}
        <View style={styles.filterContainer}>
          <Text style={styles.filterLabel}>Filter:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['ALL', 'PRESENT', 'ABSENT', 'SMS_FAILED'].map((filter) => (
              <Chip
                key={filter}
                selected={filterStatus === filter}
                onPress={() => setFilterStatus(filter)}
                style={styles.filterChip}
                mode={filterStatus === filter ? 'flat' : 'outlined'}
              >
                {filter === 'ALL' && 'All'}
                {filter === 'PRESENT' && 'Present'}
                {filter === 'ABSENT' && 'Absent'}
                {filter === 'SMS_FAILED' && 'SMS Failed'}
              </Chip>
            ))}
          </ScrollView>
        </View>

        {/* ATTENDANCE LIST */}
        {filteredAttendance.length === 0 ? (
          <EmptyState
            icon="inbox-outline"
            title="No Records"
            message={`No attendance records found for this filter.`}
            actionLabel="Clear Filter"
            onAction={() => setFilterStatus('ALL')}
          />
        ) : (
          <View style={styles.listContainer}>
            <Text style={styles.listTitle}>
              Showing {filteredAttendance.length} of {todaysAttendance.length}
            </Text>
            <FlatList
              data={filteredAttendance}
              renderItem={renderAttendanceItem}
              keyExtractor={(item) => `${item.student}-${item.date}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.separator} />}
            />
          </View>
        )}

        {/* ACTION BUTTONS */}
        <View style={styles.actionsContainer}>
          <Button
            mode="outlined"
            icon="pencil"
            onPress={() => navigation.navigate('ManualAttendance', { classId })}
            style={styles.actionButton}
          >
            Edit Attendance
          </Button>
          <Button
            mode="contained"
            icon="download"
            onPress={() => {
              // Export functionality (future)
              console.log('Export attendance');
            }}
            style={styles.actionButton}
          >
            Export Report
          </Button>
        </View>
      </ScrollView>
    </View>
  );
};

// ============================================================
// STAT CARD COMPONENT
// ============================================================

const StatCard = ({ icon, label, value, color }) => (
  <Card style={styles.statCard}>
    <Card.Content style={styles.statCardContent}>
      <MaterialCommunityIcons
        name={icon}
        size={24}
        color={color}
        style={styles.statIcon}
      />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card.Content>
  </Card>
);

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  headerText: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  headerSubtext: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  statsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 12,
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginHorizontal: 4,
    marginVertical: 8,
  },
  statCardContent: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  statIcon: {
    marginBottom: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: '700',
    color: theme.colors.onSurface,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  filterLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  filterChip: {
    marginRight: 8,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
  },
  listTitle: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 8,
  },
  attendanceCard: {
    marginBottom: 8,
    backgroundColor: theme.colors.surface,
  },
  cardContent: {
    paddingVertical: 12,
  },
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentInfo: {
    flex: 1,
    marginRight: 12,
  },
  studentName: {
    fontSize: 15,
    fontWeight: '600',
    color: theme.colors.onSurface,
  },
  timestamp: {
    fontSize: 12,
    color: theme.colors.onSurfaceVariant,
    marginTop: 2,
  },
  statusSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 13,
    fontWeight: '600',
    marginLeft: 6,
  },
  smsRow: {
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: theme.colors.outlineVariant,
  },
  smsStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smsText: {
    fontSize: 12,
    fontWeight: '500',
    marginLeft: 6,
  },
  separator: {
    height: 0,
  },
  actionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingTop: 8,
    gap: 8,
  },
  actionButton: {
    flex: 1,
  },
});

export default AttendanceSummaryScreen;
