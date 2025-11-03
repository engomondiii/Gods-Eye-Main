import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { 
  ATTENDANCE_TYPES, 
  METHOD_ICONS, 
  METHOD_COLORS 
} from '../../utils/constants';
import { formatRelativeTime } from '../../utils/formatters';

const AttendanceCard = ({ record, onPress, showStudent = true }) => {
  if (!record) return null;

  const isCheckIn = record.attendance_type === ATTENDANCE_TYPES.CHECK_IN;
  const methodIcon = METHOD_ICONS[record.method] || 'help-circle';
  const methodColor = METHOD_COLORS[record.method] || theme.colors.textSecondary;

  const getMethodLabel = (method) => {
    const labels = {
      qr_code: 'QR Code',
      fingerprint: 'Fingerprint',
      face_recognition: 'Face Recognition',
      otc: 'One-Time Code',
      manual: 'Manual Entry',
    };
    return labels[method] || method;
  };

  return (
    <TouchableOpacity 
      onPress={onPress} 
      disabled={!onPress}
      activeOpacity={0.7}
    >
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.container}>
            <View style={[styles.iconContainer, { backgroundColor: methodColor + '20' }]}>
              <MaterialCommunityIcons 
                name={methodIcon} 
                size={28} 
                color={methodColor} 
              />
            </View>

            <View style={styles.content}>
              {showStudent && record.student && (
                <Text style={styles.studentName}>
                  {record.student.first_name} {record.student.last_name}
                </Text>
              )}

              <View style={styles.row}>
                <MaterialCommunityIcons
                  name={isCheckIn ? 'login' : 'logout'}
                  size={16}
                  color={isCheckIn ? theme.colors.success : theme.colors.warning}
                />
                <Text style={[
                  styles.typeText,
                  { color: isCheckIn ? theme.colors.success : theme.colors.warning }
                ]}>
                  {isCheckIn ? 'Checked In' : 'Checked Out'}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.methodText}>
                  via {getMethodLabel(record.method)}
                </Text>
                <Text style={styles.dot}>•</Text>
                <Text style={styles.timeText}>
                  {formatRelativeTime(record.timestamp)}
                </Text>
              </View>

              {record.notes && (
                <Text style={styles.notesText} numberOfLines={2}>
                  {record.notes}
                </Text>
              )}
            </View>

            {onPress && (
              <MaterialCommunityIcons
                name="chevron-right"
                size={24}
                color={theme.colors.textSecondary}
              />
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    elevation: 2,
    backgroundColor: theme.colors.surface,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  content: {
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  typeText: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
  },
  methodText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  dot: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginHorizontal: theme.spacing.xs,
  },
  timeText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  notesText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
    fontStyle: 'italic',
  },
});

export default AttendanceCard;