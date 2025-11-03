import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_COLORS } from '../../utils/constants';

const AttendanceStatusBadge = ({ 
  status, 
  size = 'medium', 
  showIcon = true 
}) => {
  if (!status) return null;

  const getStatusConfig = () => {
    switch (status) {
      case ATTENDANCE_STATUS.PRESENT:
        return {
          label: 'Present',
          color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.PRESENT],
          icon: 'check-circle',
        };
      case ATTENDANCE_STATUS.ABSENT:
        return {
          label: 'Absent',
          color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.ABSENT],
          icon: 'close-circle',
        };
      case ATTENDANCE_STATUS.LATE:
        return {
          label: 'Late',
          color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.LATE],
          icon: 'clock-alert',
        };
      case ATTENDANCE_STATUS.EXCUSED:
        return {
          label: 'Excused',
          color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.EXCUSED],
          icon: 'information',
        };
      default:
        return {
          label: 'Unknown',
          color: ATTENDANCE_STATUS_COLORS[ATTENDANCE_STATUS.UNKNOWN],
          icon: 'help-circle',
        };
    }
  };

  const getSizeConfig = () => {
    switch (size) {
      case 'small':
        return {
          containerPadding: theme.spacing.xs,
          fontSize: theme.fontSizes.xs,
          iconSize: 14,
        };
      case 'large':
        return {
          containerPadding: theme.spacing.md,
          fontSize: theme.fontSizes.lg,
          iconSize: 22,
        };
      default:
        return {
          containerPadding: theme.spacing.sm,
          fontSize: theme.fontSizes.sm,
          iconSize: 18,
        };
    }
  };

  const config = getStatusConfig();
  const sizeConfig = getSizeConfig();

  return (
    <View 
      style={[
        styles.container,
        { 
          backgroundColor: config.color + '20',
          paddingVertical: sizeConfig.containerPadding / 2,
          paddingHorizontal: sizeConfig.containerPadding,
        }
      ]}
    >
      {showIcon && (
        <MaterialCommunityIcons
          name={config.icon}
          size={sizeConfig.iconSize}
          color={config.color}
          style={styles.icon}
        />
      )}
      <Text 
        style={[
          styles.label,
          { 
            color: config.color,
            fontSize: sizeConfig.fontSize,
            fontWeight: '600',
          }
        ]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.round,
    alignSelf: 'flex-start',
  },
  icon: {
    marginRight: 4,
  },
  label: {
    textTransform: 'capitalize',
  },
});

export default AttendanceStatusBadge;