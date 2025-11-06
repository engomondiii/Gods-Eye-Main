import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { 
  ATTENDANCE_METHODS, 
  ATTENDANCE_METHOD_ICONS,  // ✅ FIXED: Correct import name
  ATTENDANCE_METHOD_COLORS, // ✅ FIXED: Correct import name
} from '../../utils/constants';

const AttendanceMethodSelector = ({ 
  onMethodSelect, 
  disabledMethods = [],
  selectedMethod = null
}) => {
  const methods = [
    {
      key: ATTENDANCE_METHODS.QR_CODE,
      label: 'QR Code',
      description: 'Scan student QR code',
      icon: ATTENDANCE_METHOD_ICONS[ATTENDANCE_METHODS.QR_CODE], // ✅ FIXED
      color: ATTENDANCE_METHOD_COLORS[ATTENDANCE_METHODS.QR_CODE], // ✅ FIXED
    },
    {
      key: ATTENDANCE_METHODS.FINGERPRINT,
      label: 'Fingerprint',
      description: 'Biometric scan',
      icon: ATTENDANCE_METHOD_ICONS[ATTENDANCE_METHODS.FINGERPRINT], // ✅ FIXED
      color: ATTENDANCE_METHOD_COLORS[ATTENDANCE_METHODS.FINGERPRINT], // ✅ FIXED
    },
    {
      key: ATTENDANCE_METHODS.FACE_RECOGNITION,
      label: 'Face Recognition',
      description: 'AI-powered ID',
      icon: ATTENDANCE_METHOD_ICONS[ATTENDANCE_METHODS.FACE_RECOGNITION], // ✅ FIXED
      color: ATTENDANCE_METHOD_COLORS[ATTENDANCE_METHODS.FACE_RECOGNITION], // ✅ FIXED
    },
    {
      key: ATTENDANCE_METHODS.ONE_TIME_CODE, // ✅ FIXED: Use correct constant name
      label: 'One-Time Code',
      description: '6-digit code',
      icon: ATTENDANCE_METHOD_ICONS[ATTENDANCE_METHODS.ONE_TIME_CODE], // ✅ FIXED
      color: ATTENDANCE_METHOD_COLORS[ATTENDANCE_METHODS.ONE_TIME_CODE], // ✅ FIXED
    },
    {
      key: ATTENDANCE_METHODS.MANUAL,
      label: 'Manual Entry',
      description: 'Search student',
      icon: ATTENDANCE_METHOD_ICONS[ATTENDANCE_METHODS.MANUAL], // ✅ FIXED
      color: ATTENDANCE_METHOD_COLORS[ATTENDANCE_METHODS.MANUAL], // ✅ FIXED
    },
  ];

  const isDisabled = (methodKey) => disabledMethods.includes(methodKey);
  const isSelected = (methodKey) => selectedMethod === methodKey;

  const renderMethod = (method) => {
    const disabled = isDisabled(method.key);
    const selected = isSelected(method.key);

    return (
      <TouchableOpacity
        key={method.key}
        style={[
          styles.methodCard,
          selected && styles.selectedCard,
          disabled && styles.disabledCard,
        ]}
        onPress={() => !disabled && onMethodSelect(method.key)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <View style={[
          styles.iconContainer,
          { backgroundColor: method.color + '20' },
          selected && { backgroundColor: method.color + '40' },
          disabled && styles.disabledIconContainer,
        ]}>
          <MaterialCommunityIcons
            name={method.icon}
            size={32}
            color={disabled ? theme.colors.disabled : method.color}
          />
        </View>
        
        <Text style={[
          styles.methodLabel,
          disabled && styles.disabledText,
        ]}>
          {method.label}
        </Text>
        
        <Text style={[
          styles.methodDescription,
          disabled && styles.disabledText,
        ]}>
          {method.description}
        </Text>

        {disabled && (
          <View style={styles.disabledOverlay}>
            <MaterialCommunityIcons
              name="lock"
              size={16}
              color={theme.colors.textSecondary}
            />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Attendance Method</Text>
      <View style={styles.grid}>
        {methods.map(renderMethod)}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  methodCard: {
    width: '48%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    alignItems: 'center',
    ...theme.shadows.medium,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedCard: {
    borderColor: theme.colors.primary,
    ...theme.shadows.large,
  },
  disabledCard: {
    opacity: 0.5,
    backgroundColor: theme.colors.background,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: theme.borderRadius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  disabledIconContainer: {
    backgroundColor: theme.colors.disabled + '20',
  },
  methodLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    textAlign: 'center',
    marginBottom: theme.spacing.xs,
  },
  methodDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
  disabledText: {
    color: theme.colors.textDisabled,
  },
  disabledOverlay: {
    position: 'absolute',
    top: theme.spacing.sm,
    right: theme.spacing.sm,
  },
});

export default AttendanceMethodSelector;