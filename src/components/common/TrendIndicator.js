// ========================================
// TREND INDICATOR COMPONENT
// Shows trend with arrow, percentage, and label
// ========================================

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TrendIndicator = ({
  value,
  direction = 'stable', // 'up', 'down', 'stable'
  label = '',
  showPercentage = true,
  showLabel = true,
  size = 'medium', // 'small', 'medium', 'large'
  style,
}) => {
  // Get icon based on direction
  const getIcon = () => {
    switch (direction) {
      case 'up':
        return 'trending-up';
      case 'down':
        return 'trending-down';
      case 'stable':
      default:
        return 'trending-neutral';
    }
  };

  // Get color based on direction
  const getColor = () => {
    switch (direction) {
      case 'up':
        return '#4CAF50'; // Green
      case 'down':
        return '#F44336'; // Red
      case 'stable':
      default:
        return '#757575'; // Gray
    }
  };

  // Get sizes based on size prop
  const getSizes = () => {
    switch (size) {
      case 'small':
        return {
          icon: 16,
          value: 12,
          label: 10,
        };
      case 'large':
        return {
          icon: 28,
          value: 20,
          label: 16,
        };
      case 'medium':
      default:
        return {
          icon: 20,
          value: 14,
          label: 12,
        };
    }
  };

  const icon = getIcon();
  const color = getColor();
  const sizes = getSizes();

  return (
    <View style={[styles.container, style]}>
      <MaterialCommunityIcons name={icon} size={sizes.icon} color={color} />
      
      {showPercentage && (
        <Text style={[styles.value, { fontSize: sizes.value, color }]}>
          {value > 0 ? '+' : ''}
          {value.toFixed(1)}%
        </Text>
      )}
      
      {showLabel && label && (
        <Text style={[styles.label, { fontSize: sizes.label }]}>
          {label}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  value: {
    fontWeight: 'bold',
    marginLeft: 4,
  },
  label: {
    color: '#757575',
    marginLeft: 4,
  },
});

export default TrendIndicator;