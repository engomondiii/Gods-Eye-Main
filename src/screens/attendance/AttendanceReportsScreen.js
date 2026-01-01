import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Card, Button, SegmentedButtons, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import AttendanceStats from '../../components/attendance/AttendanceStats';
import AttendanceCalendar from '../../components/attendance/AttendanceCalendar';
import ChartCard from '../../components/common/ChartCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as reportService from '../../services/reportService';
import { useAuth } from '../../hooks/useAuth';

const AttendanceReportsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [reportType, setReportType] = useState('overview');
  const [selectedPeriod, setSelectedPeriod] = useState('today');
  const [reportData, setReportData] = useState(null);
  const [generatedReportId, setGeneratedReportId] = useState(null);

  useEffect(() => {
    generateAndFetchReport();
  }, [selectedPeriod]);

  // Generate report and fetch data
  const generateAndFetchReport = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Calculate date range based on selected period
      const { startDate, endDate } = getDateRange(selectedPeriod);

      // Generate attendance report
      const response = await reportService.generateReport({
        report_type: 'attendance',
        title: `Attendance Report - ${selectedPeriod}`,
        description: `Attendance data for ${selectedPeriod}`,
        start_date: startDate,
        end_date: endDate,
        report_format: 'json', // Get JSON data for display
        filters: {
          school: user.school?.id,
        },
      });

      if (response.success) {
        setGeneratedReportId(response.data.report_id);
        
        // If we got data directly, use it
        if (response.data.data) {
          setReportData(response.data.data);
        } else {
          // Otherwise fetch the report
          const reportResponse = await reportService.getReportById(response.data.report_id);
          if (reportResponse.success) {
            setReportData(reportResponse.data.data);
          }
        }
      } else {
        setError(response.message || 'Failed to generate report');
      }
    } catch (err) {
      setError('Failed to load report data. Please try again.');
      console.error('Report error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Get date range based on period
  const getDateRange = (period) => {
    const now = new Date();
    let startDate, endDate;

    switch (period) {
      case 'today':
        startDate = endDate = now.toISOString().split('T')[0];
        break;
      case 'week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        startDate = weekStart.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      case 'month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        startDate = monthStart.toISOString().split('T')[0];
        endDate = now.toISOString().split('T')[0];
        break;
      default:
        startDate = endDate = now.toISOString().split('T')[0];
    }

    return { startDate, endDate };
  };

  // Handle export report
  const handleExportReport = async (format) => {
    try {
      setIsGenerating(true);
      
      const { startDate, endDate } = getDateRange(selectedPeriod);

      const response = await reportService.generateReport({
        report_type: 'attendance',
        title: `Attendance Report - ${selectedPeriod}`,
        description: `Attendance data for ${selectedPeriod}`,
        start_date: startDate,
        end_date: endDate,
        report_format: format,
        filters: {
          school: user.school?.id,
        },
      });

      if (response.success) {
        // Download the file
        const downloadResponse = await reportService.downloadReport(response.data.report_id);
        
        if (downloadResponse.success) {
          Alert.alert(
            'Success',
            `Report exported as ${format.toUpperCase()}. Generation time: ${reportService.formatGenerationTime(response.data.generation_time)}`,
            [{ text: 'OK' }]
          );
        } else {
          Alert.alert('Error', 'Failed to download report');
        }
      } else {
        Alert.alert('Error', response.message || 'Failed to export report');
      }
    } catch (err) {
      Alert.alert('Error', 'Failed to export report');
      console.error('Export error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  // Render overview report
  const renderOverviewReport = () => {
    if (!reportData || !reportData.summary) {
      return <Text style={styles.noDataText}>No data available</Text>;
    }

    const { summary, by_method, trends } = reportData;

    return (
      <View>
        {/* Statistics */}
        <AttendanceStats
          present={summary.present || 0}
          absent={summary.absent || 0}
          late={summary.late || 0}
          excused={summary.excused || 0}
          total={summary.total_records || 0}
          dateRange={selectedPeriod === 'today' ? 'Today' : selectedPeriod === 'week' ? 'This Week' : 'This Month'}
          showPercentage={true}
        />

        {/* Top Methods */}
        {by_method && by_method.length > 0 && (
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.cardTitle}>Most Used Methods</Text>
              {by_method.map((item, index) => (
                <View key={index} style={styles.methodRow}>
                  <View style={styles.methodLeft}>
                    <MaterialCommunityIcons
                      name={getMethodIcon(item.method)}
                      size={24}
                      color={theme.colors.primary}
                    />
                    <Text style={styles.methodName}>{item.method}</Text>
                  </View>
                  <View style={styles.methodRight}>
                    <Text style={styles.methodCount}>{item.count}</Text>
                    <Text style={styles.methodPercentage}>
                      ({((item.count / summary.total_records) * 100).toFixed(1)}%)
                    </Text>
                  </View>
                </View>
              ))}
            </Card.Content>
          </Card>
        )}

        {/* Weekly Trends Chart */}
        {trends && trends.length > 0 && (
          <ChartCard
            title="Attendance Trends"
            type="line"
            data={{
              labels: trends.map(t => t.label || t.date),
              datasets: [
                {
                  data: trends.map(t => t.present || 0),
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  strokeWidth: 2,
                },
              ],
              legend: ['Present'],
            }}
            height={220}
          />
        )}

        {/* Status Distribution Pie Chart */}
        {summary && (
          <ChartCard
            title="Attendance Distribution"
            type="pie"
            data={[
              {
                name: 'Present',
                population: summary.present || 0,
                color: '#4CAF50',
                legendFontColor: '#212121',
              },
              {
                name: 'Absent',
                population: summary.absent || 0,
                color: '#F44336',
                legendFontColor: '#212121',
              },
              {
                name: 'Late',
                population: summary.late || 0,
                color: '#FF9800',
                legendFontColor: '#212121',
              },
              {
                name: 'Excused',
                population: summary.excused || 0,
                color: '#2196F3',
                legendFontColor: '#212121',
              },
            ].filter(item => item.population > 0)}
            height={220}
          />
        )}
      </View>
    );
  };

  // Render calendar report
  const renderCalendarReport = () => {
    if (!reportData || !reportData.by_date) {
      return <Text style={styles.noDataText}>No calendar data available</Text>;
    }

    return (
      <Card style={styles.card}>
        <Card.Content>
          <AttendanceCalendar
            studentId={null}
            month={new Date()}
            attendanceData={reportData.by_date}
            onDatePress={(day, month) => console.log('Date pressed:', day, month)}
          />
        </Card.Content>
      </Card>
    );
  };

  // Render detailed report
  const renderDetailedReport = () => {
    if (!reportData) {
      return <Text style={styles.noDataText}>No detailed data available</Text>;
    }

    const { by_grade, by_time } = reportData;

    return (
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.cardTitle}>Detailed Breakdown</Text>
          
          {/* By Grade */}
          {by_grade && by_grade.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>By Grade</Text>
              {by_grade.map((grade, index) => (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{grade.grade}</Text>
                  <Text style={styles.detailValue}>
                    {grade.attendance_rate ? `${grade.attendance_rate.toFixed(1)}%` : 'N/A'}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {/* By Time */}
          {by_time && by_time.length > 0 && (
            <View style={styles.detailSection}>
              <Text style={styles.detailSectionTitle}>Peak Check-in Times</Text>
              {by_time.map((time, index) => (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{time.time_range}</Text>
                  <Text style={styles.detailValue}>{time.percentage}%</Text>
                </View>
              ))}
            </View>
          )}
        </Card.Content>
      </Card>
    );
  };

  // Get method icon
  const getMethodIcon = (method) => {
    const icons = {
      'QR Code': 'qrcode',
      'qr': 'qrcode',
      'Fingerprint': 'fingerprint',
      'fingerprint': 'fingerprint',
      'biometric': 'fingerprint',
      'Manual': 'pencil',
      'manual': 'pencil',
      'Face Recognition': 'face-recognition',
      'face': 'face-recognition',
      'OTC': 'numeric',
      'otc': 'numeric',
    };
    return icons[method] || 'checkbox-marked-circle';
  };

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
        {error ? <ErrorMessage message={error} onRetry={generateAndFetchReport} /> : null}

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
            {isGenerating && (
              <View style={styles.generatingContainer}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <Text style={styles.generatingText}>Generating report...</Text>
              </View>
            )}
            <View style={styles.exportButtons}>
              <Button
                mode="outlined"
                icon="file-pdf-box"
                onPress={() => handleExportReport('pdf')}
                style={styles.exportButton}
                disabled={isGenerating}
              >
                PDF
              </Button>
              <Button
                mode="outlined"
                icon="file-excel"
                onPress={() => handleExportReport('excel')}
                style={styles.exportButton}
                disabled={isGenerating}
              >
                Excel
              </Button>
              <Button
                mode="outlined"
                icon="file-document"
                onPress={() => handleExportReport('csv')}
                style={styles.exportButton}
                disabled={isGenerating}
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
  noDataText: {
    textAlign: 'center',
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    padding: theme.spacing.xl,
  },
  generatingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  generatingText: {
    marginLeft: theme.spacing.sm,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
});

export default AttendanceReportsScreen;