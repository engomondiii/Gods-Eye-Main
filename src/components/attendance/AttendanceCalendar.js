// ========================================
// GOD'S EYE EDTECH - ATTENDANCE CALENDAR COMPONENT
// ========================================

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { ATTENDANCE_STATUS } from '../../utils/constants';

const AttendanceCalendar = ({ 
  studentId, 
  month = new Date(), 
  onDatePress,
  attendanceData = {} 
}) => {
  const [currentMonth, setCurrentMonth] = useState(new Date(month));

  // Status colors
  const STATUS_COLORS = {
    [ATTENDANCE_STATUS.PRESENT]: '#4CAF50',
    [ATTENDANCE_STATUS.ABSENT]: '#F44336',
    [ATTENDANCE_STATUS.LATE]: '#FF9800',
    [ATTENDANCE_STATUS.EXCUSED]: '#2196F3',
    [ATTENDANCE_STATUS.UNKNOWN]: '#757575',
  };

  const getColorForStatus = (status) => {
    if (!status) return null;
    return STATUS_COLORS[status] || STATUS_COLORS[ATTENDANCE_STATUS.UNKNOWN];
  };

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month, 1).getDay();
  };

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const isToday = (day) => {
    const today = new Date();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  const getStatusForDate = (day) => {
    const dateStr = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return attendanceData[dateStr] || null;
  };

  const calculateStats = () => {
    const values = Object.values(attendanceData);
    const present = values.filter(v => v === ATTENDANCE_STATUS.PRESENT).length;
    const absent = values.filter(v => v === ATTENDANCE_STATUS.ABSENT).length;
    const total = values.length;
    const percentage = total > 0 ? Math.round((present / total) * 100) : 0;
    
    return { present, absent, total, percentage };
  };

  const renderHeader = () => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    
    return (
      <View style={styles.header}>
        <IconButton
          icon="chevron-left"
          size={24}
          onPress={goToPreviousMonth}
        />
        <Text style={styles.headerText}>
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </Text>
        <IconButton
          icon="chevron-right"
          size={24}
          onPress={goToNextMonth}
        />
      </View>
    );
  };

  const renderDayNames = () => {
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    
    return (
      <View style={styles.dayNamesContainer}>
        {dayNames.map((day, index) => (
          <View key={index} style={styles.dayName}>
            <Text style={styles.dayNameText}>{day}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderDays = () => {
    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <View key={`empty-${i}`} style={styles.dayCell} />
      );
    }

    // Actual days
    for (let day = 1; day <= daysInMonth; day++) {
      const status = getStatusForDate(day);
      const isCurrentDay = isToday(day);
      const statusColor = getColorForStatus(status);
      
      days.push(
        <TouchableOpacity
          key={day}
          style={[
            styles.dayCell,
            isCurrentDay && styles.todayCell,
          ]}
          onPress={() => onDatePress && onDatePress(day, currentMonth)}
        >
          <View style={[
            styles.dayContent,
            statusColor && { backgroundColor: statusColor + '30' }
          ]}>
            <Text style={[
              styles.dayText,
              isCurrentDay && styles.todayText,
              status && { fontWeight: 'bold' }
            ]}>
              {day}
            </Text>
            {status && (
              <View style={[
                styles.statusDot,
                { backgroundColor: statusColor }
              ]} />
            )}
          </View>
        </TouchableOpacity>
      );
    }

    return <View style={styles.daysContainer}>{days}</View>;
  };

  const renderLegend = () => {
    return (
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS[ATTENDANCE_STATUS.PRESENT] }]} />
          <Text style={styles.legendText}>Present</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS[ATTENDANCE_STATUS.ABSENT] }]} />
          <Text style={styles.legendText}>Absent</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, { backgroundColor: STATUS_COLORS[ATTENDANCE_STATUS.LATE] }]} />
          <Text style={styles.legendText}>Late</Text>
        </View>
      </View>
    );
  };

  const renderStats = () => {
    const stats = calculateStats();
    
    return (
      <View style={styles.statsContainer}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.percentage}%</Text>
          <Text style={styles.statLabel}>Attendance</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.present}</Text>
          <Text style={styles.statLabel}>Present</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{stats.absent}</Text>
          <Text style={styles.statLabel}>Absent</Text>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {renderHeader()}
      {renderStats()}
      {renderDayNames()}
      {renderDays()}
      {renderLegend()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  headerText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
  },
  statBox: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  dayNamesContainer: {
    flexDirection: 'row',
    marginBottom: theme.spacing.sm,
  },
  dayName: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  dayNameText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  dayCell: {
    width: '14.28%',
    aspectRatio: 1,
    padding: 2,
  },
  todayCell: {
    backgroundColor: theme.colors.primary + '10',
    borderRadius: theme.borderRadius.sm,
  },
  dayContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: theme.borderRadius.sm,
  },
  dayText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  todayText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 2,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: theme.spacing.xs,
  },
  legendText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
  },
});

export default AttendanceCalendar;