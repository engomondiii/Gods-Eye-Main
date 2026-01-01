import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const SchoolStatsCard = ({ 
  title, 
  value, 
  icon, 
  color = '#6200EE', 
  trend = null,
  trendLabel = '',
  onPress 
}) => {
  const getTrendIcon = () => {
    if (trend === null || trend === 0) return null;
    return trend > 0 ? 'trending-up' : 'trending-down';
  };

  const getTrendColor = () => {
    if (trend === null || trend === 0) return '#757575';
    return trend > 0 ? '#4CAF50' : '#F44336';
  };

  const formatValue = (val) => {
    if (typeof val === 'number') {
      if (val >= 1000000) {
        return (val / 1000000).toFixed(1) + 'M';
      } else if (val >= 1000) {
        return (val / 1000).toFixed(1) + 'K';
      }
      return val.toString();
    }
    return val;
  };

  return (
    <Card style={[styles.card, { borderLeftColor: color }]} onPress={onPress}>
      <Card.Content style={styles.content}>
        {/* Icon Section */}
        <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
          <MaterialCommunityIcons name={icon} size={32} color={color} />
        </View>

        {/* Content Section */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.value}>{formatValue(value)}</Text>
          
          {/* Trend Indicator */}
          {trend !== null && getTrendIcon() && (
            <View style={styles.trendContainer}>
              <MaterialCommunityIcons 
                name={getTrendIcon()} 
                size={16} 
                color={getTrendColor()} 
              />
              <Text style={[styles.trendValue, { color: getTrendColor() }]}>
                {Math.abs(trend)}
              </Text>
              {trendLabel && (
                <Text style={styles.trendLabel}>{trendLabel}</Text>
              )}
            </View>
          )}
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    borderLeftWidth: 4,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  trendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trendValue: {
    fontSize: 13,
    fontWeight: 'bold',
    marginLeft: 2,
  },
  trendLabel: {
    fontSize: 11,
    color: '#757575',
    marginLeft: 4,
  },
});

export default SchoolStatsCard;