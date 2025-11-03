import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_COLORS } from '../../utils/constants';

const AttendanceStats = ({ 
  present = 0,
  absent = 0,
  late = 0,
  excused = 0,
  total = 0,
  dateRange = 'Today',
  showPercentage = true
}) => {
  const percentage = total > 0 ? Math.round((present / total) * 100) : 0;

  const stats = [
    {
      label: 'Present',
      value: present,
      icon: 'check-circle',
      color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.PRESENT],
    },
    {
      label: 'Absent',
      value: absent,
      icon: 'close-circle',
      color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.ABSENT],
    },
    {
      label: 'Late',
      value: late,
      icon: 'clock-alert',
      color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.LATE],
    },
    {
      label: 'Excused',
      value: excused,
      icon: 'information',
      color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.EXCUSED],
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.dateRange}>{dateRange}</Text>
        {showPercentage && (
          <View style={styles.percentageContainer}>
            <Text style={[
              styles.percentage,
              { 
                color: percentage >= 75 
                  ? ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.PRESENT] 
                  : ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.ABSENT] 
              }
            ]}>
              {percentage}%
            </Text>
            <Text style={styles.percentageLabel}>Present</Text>
          </View>
        )}
      </View>

      <View style={styles.grid}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statCard}>
            <View style={[styles.iconContainer, { backgroundColor: stat.color + '20' }]}>
              <MaterialCommunityIcons 
                name={stat.icon} 
                size={24} 
                color={stat.color} 
              />
            </View>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      <View style={styles.totalContainer}>
        <Text style={styles.totalText}>
          Total Students: <Text style={styles.totalValue}>{total}</Text>
        </Text>
      </View>

      {showPercentage && total > 0 && (
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${percentage}%`,
                  backgroundColor: percentage >= 75 
                    ? ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.PRESENT]
                    : percentage >= 50 
                      ? ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.LATE]
                      : ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.ABSENT]
                }
              ]} 
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    ...theme.shadows.medium,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  dateRange: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
  },
  percentageContainer: {
    alignItems: 'flex-end',
  },
  percentage: {
    fontSize: theme.fontSizes.h2,
    fontWeight: 'bold',
  },
  percentageLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -theme.spacing.xs,
  },
  statCard: {
    width: '50%',
    padding: theme.spacing.xs,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  totalContainer: {
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  totalText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  totalValue: {
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  progressContainer: {
    marginTop: theme.spacing.md,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.round,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: theme.borderRadius.round,
  },
});

export default AttendanceStats;