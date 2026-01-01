// ========================================
// ENHANCED STAT CARD COMPONENT
// With trend indicator and optional sparkline
// ========================================

import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LineChart } from 'react-native-chart-kit';
import TrendIndicator from '../common/TrendIndicator';

const StatCard = ({ 
  stat, 
  onPress,
  showTrend = false,
  trendData = null, // { value: 2.5, direction: 'up', label: 'vs last week' }
  showSparkline = false,
  sparklineData = null, // { labels: [], datasets: [{ data: [] }] }
}) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={styles.container}
    >
      <Card
        style={[
          styles.card,
          { borderLeftColor: stat.color, borderLeftWidth: 4 },
        ]}
      >
        <Card.Content style={styles.content}>
          {/* Icon Container */}
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: stat.bgColor || stat.color + '20' },
            ]}
          >
            <MaterialCommunityIcons
              name={stat.icon}
              size={28}
              color={stat.color}
            />
            {stat.badge !== undefined && stat.badge > 0 && (
              <Badge style={[styles.badge, { backgroundColor: '#F44336' }]}>
                {stat.badge}
              </Badge>
            )}
          </View>

          {/* Text Content */}
          <View style={styles.textContainer}>
            <View style={styles.valueRow}>
              <Text style={styles.value}>{stat.value.toLocaleString()}</Text>
              
              {/* Trend Indicator */}
              {showTrend && trendData && (
                <TrendIndicator
                  value={trendData.value}
                  direction={trendData.direction}
                  label={trendData.label}
                  showLabel={false}
                  size="small"
                  style={styles.trend}
                />
              )}
            </View>

            <Text style={styles.title} numberOfLines={2}>
              {stat.title}
            </Text>

            {/* Trend Label */}
            {showTrend && trendData && trendData.label && (
              <Text style={styles.trendLabel}>{trendData.label}</Text>
            )}

            {/* Sparkline Chart */}
            {showSparkline && sparklineData && (
              <View style={styles.sparklineContainer}>
                <LineChart
                  data={sparklineData}
                  width={120}
                  height={40}
                  chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFrom: '#FFFFFF',
                    backgroundGradientTo: '#FFFFFF',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `${stat.color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
                    strokeWidth: 2,
                    propsForDots: {
                      r: '0',
                    },
                  }}
                  bezier
                  withVerticalLabels={false}
                  withHorizontalLabels={false}
                  withInnerLines={false}
                  withOuterLines={false}
                  withVerticalLines={false}
                  withHorizontalLines={false}
                  style={styles.sparkline}
                />
              </View>
            )}
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  card: {
    elevation: 2,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  textContainer: {
    flex: 1,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
  },
  trend: {
    marginLeft: 8,
  },
  title: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 18,
  },
  trendLabel: {
    fontSize: 11,
    color: '#9E9E9E',
    marginTop: 2,
  },
  sparklineContainer: {
    marginTop: 8,
    overflow: 'hidden',
  },
  sparkline: {
    paddingRight: 0,
  },
});

export default StatCard;