// ========================================
// CHART CARD COMPONENT
// Reusable chart wrapper with multiple chart types
// Dependencies: react-native-chart-kit
// ========================================

import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Card, Title } from 'react-native-paper';
import { LineChart, BarChart, PieChart, ProgressChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const ChartCard = ({
  title,
  type = 'line', // 'line', 'bar', 'pie', 'progress'
  data,
  width = screenWidth - 64,
  height = 220,
  chartConfig = {},
  style,
  ...props
}) => {
  // Default chart configuration
  const defaultChartConfig = {
    backgroundColor: '#FFFFFF',
    backgroundGradientFrom: '#FFFFFF',
    backgroundGradientTo: '#FFFFFF',
    decimalPlaces: 1,
    color: (opacity = 1) => `rgba(98, 0, 238, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: {
      borderRadius: 16,
    },
    propsForDots: {
      r: '4',
      strokeWidth: '2',
      stroke: '#6200EE',
    },
    ...chartConfig,
  };

  // Render chart based on type
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart
            data={data}
            width={width}
            height={height}
            chartConfig={defaultChartConfig}
            bezier
            style={styles.chart}
            {...props}
          />
        );

      case 'bar':
        return (
          <BarChart
            data={data}
            width={width}
            height={height}
            chartConfig={defaultChartConfig}
            style={styles.chart}
            {...props}
          />
        );

      case 'pie':
        return (
          <PieChart
            data={data}
            width={width}
            height={height}
            chartConfig={defaultChartConfig}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="15"
            absolute
            style={styles.chart}
            {...props}
          />
        );

      case 'progress':
        return (
          <ProgressChart
            data={data}
            width={width}
            height={height}
            chartConfig={defaultChartConfig}
            style={styles.chart}
            {...props}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Card style={[styles.card, style]}>
      <Card.Content>
        {title && <Title style={styles.title}>{title}</Title>}
        {renderChart()}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#212121',
  },
  chart: {
    marginVertical: 8,
    borderRadius: 16,
  },
});

export default ChartCard;