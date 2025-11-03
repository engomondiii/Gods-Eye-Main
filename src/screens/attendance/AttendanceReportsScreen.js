import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Text, Card, Button, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import AttendanceStats from '../../components/attendance/AttendanceStats';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const AttendanceReportsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [reportData, setReportData] = useState({
    stats: {
      present: 0,
      absent: 0,
      late: 0,
      excused: 0,
      total: 0,
    },
    attendanceData: {},
    trends: [],
    topMethods: [],
  });

  useEffect(() => {
    fetchReportData();
  }, [selectedPeriod]);

  const fetchReportData = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await attendanceService.getReportData(selectedPeriod);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        stats: {
          present: 35,
          absent: 5,
          late: 3,
          excused: 2,
          total: 45,
        },
        attendanceData: {
          '2025-11-01': 'present',
          '2025-11-02': 'present',
          '2025-11-03': 'absent',
          '2025-11-04': 'present',
          '2025-11-05': 'late',
        },
        trends: [
          { label: 'Mon', present: 40, absent: 5 },
          { label: 'Tue', present: 38, absent: 7 },
          { label: 'Wed', present: 42, absent: 3 },
          { label: 'Thu', present: 35, absent: 10 },
          { label: 'Fri', present: 39, absent: 6 },
        ],
        topMethods: [
          { method: 'QR Code', count: 120, percentage: 60 },
          { method: 'Fingerprint', count: 50, percentage: 25 },
          { method: 'Manual', count: 30, percentage: 15 },
        ],
      };
      
      setReportData(mockData);
    } catch (err) {
      setError('Failed to load report data. Please try again.');
      console.error('Report error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = (format) => {
    Alert.alert(
      `Export as ${format.toUpperCase()}`,
      `Export functionality will be implemented for ${format} format.`,
      [{ text: 'OK' }]
    );
  };

  const renderOverviewReport = () => (
    <View>
      {/* Statistics */}
      <AttendanceStats
        present={reportData.stats.present}
        absent={reportData.stats.absent}
        late={reportData.stats.late}
        excused={reportData.stats.excused}
        total={reportData.stats.total}
        dateRange={selectedPeriod === 'today' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : 'This Month'}
        showPercentage={true}
      />

      {/* Top Methods */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Most Used Methods</Text>
          {reportData.topMethods.map((item, index) => (
            <View key={index} style={styles.methodRow}>
              <View style={styles.methodLeft}>
                <MaterialCommunityIcons
                  name={
                    item.method === 'QR Code' ? 'qrcode' :
                    item.method === 'Fingerprint' ? 'fingerprint' :
                    'pencil'
                  }
                  size={24}
                  color={theme.colors.primary}
                />
                <Text style={styles.methodName}>{item.method}</Text>
              </View>
              <View style={styles.methodRight}>
                <Text style={styles.methodCount}>{item.count}</Text>
                <Text style={styles.methodPercentage}>({item.percentage}%)</Text>
              </View>
            </View>
          ))}
        </Card.Content>
      </Card>

      {/* Weekly Trends */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Weekly Trends</Text>
          <View style={styles.trendsContainer}>
            {reportData.trends.map((day, index) => (
              <View key={index} style={styles.trendItem}>
                <Text style={styles.trendLabel}>{day.label}</Text>
                <View style={styles.trendBars}>
                  <View 
                    style={[
                      styles.trendBar,
                      { 
                        height: (day.present / reportData.stats.total) * 100,
                        backgroundColor: theme.colors.success 
                      }
                    ]} 
                  />
                  <View 
                    style={[
                      styles.trendBar,
                      { 
                        height: (day.absent / reportData.stats.total) * 100,
                        backgroundColor: theme.colors.error 
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.trendValue}>{day.present}</Text>
              </View>
            ))}
          </View>
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.success }]} />
              <Text style={styles.legendText}>Present</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, { backgroundColor: theme.colors.error }]} />
              <Text style={styles.legendText}>Absent</Text>
            </View>
          </View>
        </Card.Content>
      </Card>
    </View>
  );

  const renderCalendarReport = () => (
    <Card style={styles.card}>
      <Card.Content>
        <AttendanceCalendar
          studentId={null}
          month={new Date()}
          attendanceData={reportData.attendanceData}
          onDatePress={(day, month) => console.log('Date pressed:', day, month)}
        />
      </Card.Content>
    </Card>
  );

  const renderDetailedReport = () => (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.cardTitle}>Detailed Breakdown</Text>
        
        {/* By Class */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>By Class</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Grade 1</Text>
            <Text style={styles.detailValue}>95% attendance</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Grade 2</Text>
            <Text style={styles.detailValue}>88% attendance</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Grade 3</Text>
            <Text style={styles.detailValue}>92% attendance</Text>
          </View>
        </View>

        {/* By Time */}
        <View style={styles.detailSection}>
          <Text style={styles.detailSectionTitle}>Peak Check-in Times</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>7:00 - 8:00 AM</Text>
            <Text style={styles.detailValue}>60%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>8:00 - 9:00 AM</Text>
            <Text style={styles.detailValue}>35%</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>After 9:00 AM</Text>
            <Text style={styles.detailValue}>5%</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Period Selector */}
        <View style={styles.periodSelector}>
          <SegmentedButtons
            value={selectedPeriod}
            onValueChange={setSelectedPeriod}
            buttons={[
              { value: 'today', label: 'Today' },
              { value: 'week', label: 'Week' },
              { value: 'month', label: 'Month' },
            ]}
          />
        </View>

        {/* Report Type Selector */}
        <View style={styles.reportTypeSelector}>
          <SegmentedButtons
            value={reportType}
            onValueChange={setReportType}
            buttons={[
              { value: 'overview', label: 'Overview', icon: 'chart-line' },
              { value: 'calendar', label: 'Calendar', icon: 'calendar' },
              { value: 'detailed', label: 'Detailed', icon: 'format-list-bulleted' },
            ]}
          />
        </View>

        {/* Error Message */}
        {error ? <ErrorMessage message={error} onRetry={fetchReportData} /> : null}

        {/* Report Content */}
        <View style={styles.reportContent}>
          {reportType === 'overview' && renderOverviewReport()}
          {reportType === 'calendar' && renderCalendarReport()}
          {reportType === 'detailed' && renderDetailedReport()}
        </View>

        {/* Export Options */}
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.cardTitle}>Export Report</Text>
            <View style={styles.exportButtons}>
              <Button
                mode="outlined"
                icon="file-pdf-box"
                onPress={() => handleExportReport('pdf')}
                style={styles.exportButton}
              >
                PDF
              </Button>
              <Button
                mode="outlined"
                icon="file-excel"
                onPress={() => handleExportReport('excel')}
                style={styles.exportButton}
              >
                Excel
              </Button>
              <Button
                mode="outlined"
                icon="file-document"
                onPress={() => handleExportReport('csv')}
                style={styles.exportButton}
              >
                CSV
              </Button>
            </View>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  periodSelector: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  reportTypeSelector: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  reportContent: {
    padding: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.medium,
  },
  cardTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  methodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  methodLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  methodRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodCount: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginRight: theme.spacing.xs,
  },
  methodPercentage: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  trendsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: 150,
    marginBottom: theme.spacing.md,
  },
  trendItem: {
    alignItems: 'center',
    flex: 1,
  },
  trendLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  trendBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 100,
    gap: 2,
  },
  trendBar: {
    width: 15,
    borderRadius: theme.borderRadius.sm,
  },
  trendValue: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.xs,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: theme.spacing.md,
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
  detailSection: {
    marginBottom: theme.spacing.lg,
  },
  detailSectionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  detailLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  detailValue: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.primary,
  },
  exportButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.spacing.sm,
  },
  exportButton: {
    flex: 1,
  },
});

export default AttendanceReportsScreen;