import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Card, Title, Button, SegmentedButtons, ActivityIndicator, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import DatePicker from '../../components/form/DatePicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as reportService from '../../services/reportService';
import { REPORT_TYPE_OPTIONS, REPORT_FORMAT_OPTIONS } from '../../utils/constants';
import theme from '../../styles/theme';

const SchoolReportsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('attendance');
  const [reportFormat, setReportFormat] = useState('pdf');
  const [reportPeriod, setReportPeriod] = useState('this_month');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoadingReports, setIsLoadingReports] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [recentReports, setRecentReports] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchRecentReports();
  }, []);

  // Fetch recent reports
  const fetchRecentReports = async () => {
    try {
      setError('');
      const response = await reportService.getReports({
        page: 1,
        page_size: 10,
        school: user.school?.id,
      });

      if (response.success) {
        setRecentReports(response.data.results || []);
      } else {
        setError(response.message || 'Failed to load recent reports');
      }
    } catch (err) {
      setError('Failed to load recent reports');
      console.error('Fetch reports error:', err);
    } finally {
      setIsLoadingReports(false);
      setIsRefreshing(false);
    }
  };

  const onRefresh = () => {
    setIsRefreshing(true);
    fetchRecentReports();
  };

  // Generate report
  const handleGenerateReport = async () => {
    if (reportPeriod === 'custom' && (!startDate || !endDate)) {
      Alert.alert('Error', 'Please select start and end dates for custom period');
      return;
    }

    setIsGenerating(true);
    
    try {
      const { start, end } = getDateRange();
      
      const response = await reportService.generateReport({
        report_type: reportType,
        title: `${getReportTypeLabel(reportType)} - ${reportPeriod}`,
        description: `Generated for ${user.school?.name}`,
        start_date: start,
        end_date: end,
        report_format: reportFormat,
        filters: {
          school: user.school?.id,
        },
      });

      if (response.success) {
        const genTime = reportService.formatGenerationTime(response.data.generation_time);
        
        Alert.alert(
          'Report Generated',
          `Your ${reportFormat.toUpperCase()} report has been generated successfully in ${genTime}.`,
          [
            { text: 'View Reports', onPress: () => fetchRecentReports() },
            {
              text: 'Download',
              onPress: () => handleDownloadReport(response.data.report_id),
            },
          ]
        );
      } else {
        Alert.alert('Error', response.message || 'Failed to generate report');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report. Please try again.');
      console.error('Generate report error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // Download report
  const handleDownloadReport = async (reportId) => {
    try {
      const response = await reportService.downloadReport(reportId);
      
      if (response.success) {
        Alert.alert('Success', 'Report downloaded successfully!');
        // In a real app, you would open the file or share it
      } else {
        Alert.alert('Error', 'Failed to download report');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to download report');
      console.error('Download error:', error);
    }
  };

  // Delete report
  const handleDeleteReport = async (reportId) => {
    Alert.alert(
      'Delete Report',
      'Are you sure you want to delete this report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await reportService.deleteReport(reportId);
            if (response.success) {
              Alert.alert('Success', 'Report deleted successfully');
              fetchRecentReports();
            } else {
              Alert.alert('Error', 'Failed to delete report');
            }
          },
        },
      ]
    );
  };

  // Get date range based on period
  const getDateRange = () => {
    const now = new Date();
    let start, end;

    switch (reportPeriod) {
      case 'this_week':
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        start = weekStart.toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case 'this_month':
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        start = monthStart.toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case 'this_term':
        // Assuming 3-month term
        const termStart = new Date(now);
        termStart.setMonth(now.getMonth() - 3);
        start = termStart.toISOString().split('T')[0];
        end = now.toISOString().split('T')[0];
        break;
      case 'custom':
        start = startDate ? startDate.toISOString().split('T')[0] : now.toISOString().split('T')[0];
        end = endDate ? endDate.toISOString().split('T')[0] : now.toISOString().split('T')[0];
        break;
      default:
        start = end = now.toISOString().split('T')[0];
    }

    return { start, end };
  };

  // Get report type label
  const getReportTypeLabel = (type) => {
    const option = REPORT_TYPE_OPTIONS.find(opt => opt.value === type);
    return option ? option.label : type;
  };

  // Get report type info
  const getReportTypeInfo = (type) => {
    return REPORT_TYPE_OPTIONS.find(opt => opt.value === type);
  };

  // Get format info
  const getFormatInfo = (format) => {
    return REPORT_FORMAT_OPTIONS.find(opt => opt.value === format);
  };

  // Render recent report item
  const renderReportItem = ({ item }) => {
    const formatInfo = getFormatInfo(item.report_format);
    const typeInfo = getReportTypeInfo(item.report_type);
    
    return (
      <Card style={styles.recentReportCard}>
        <Card.Content>
          <View style={styles.recentReportRow}>
            <MaterialCommunityIcons 
              name={formatInfo?.icon || 'file-document'} 
              size={32} 
              color={formatInfo?.color || '#757575'} 
            />
            <View style={styles.recentReportInfo}>
              <Text style={styles.recentReportTitle}>{item.title}</Text>
              <Text style={styles.recentReportDate}>
                Generated on {new Date(item.created_at).toLocaleDateString()}
              </Text>
              {item.generation_time && (
                <Text style={styles.recentReportTime}>
                  Generation time: {reportService.formatGenerationTime(item.generation_time)}
                </Text>
              )}
              <View style={styles.recentReportChips}>
                <Chip 
                  icon={typeInfo?.icon}
                  style={[styles.chip, { backgroundColor: typeInfo?.color + '20' }]}
                  textStyle={{ color: typeInfo?.color, fontSize: 11 }}
                >
                  {getReportTypeLabel(item.report_type)}
                </Chip>
              </View>
            </View>
            <View style={styles.reportActions}>
              <TouchableOpacity onPress={() => handleDownloadReport(item.id)}>
                <MaterialCommunityIcons name="download" size={24} color="#2196F3" />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={() => handleDeleteReport(item.id)}
                style={styles.deleteButton}
              >
                <MaterialCommunityIcons name="delete" size={24} color="#F44336" />
              </TouchableOpacity>
            </View>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (isLoadingReports) {
    return <LoadingSpinner />;
  }

  const selectedTypeInfo = getReportTypeInfo(reportType);
  const selectedFormatInfo = getFormatInfo(reportFormat);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* School Header */}
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="school" size={48} color="#FF9800" />
            <View style={styles.headerText}>
              <Title style={styles.schoolName}>{user?.school?.name || 'Your School'}</Title>
              <Text style={styles.schoolCode}>NEMIS: {user?.school?.nemis_code || 'N/A'}</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Report Type Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Report Type</Text>
        {REPORT_TYPE_OPTIONS.map((type) => (
          <TouchableOpacity
            key={type.value}
            style={[
              styles.reportTypeCard,
              reportType === type.value && styles.reportTypeCardSelected,
            ]}
            onPress={() => setReportType(type.value)}
          >
            <View style={styles.reportTypeLeft}>
              <View
                style={[
                  styles.reportTypeIcon,
                  { backgroundColor: type.color + '20' },
                ]}
              >
                <MaterialCommunityIcons
                  name={type.icon}
                  size={32}
                  color={type.color}
                />
              </View>
              <View style={styles.reportTypeText}>
                <Text style={styles.reportTypeTitle}>{type.label}</Text>
                <Text style={styles.reportTypeDescription}>{type.description}</Text>
              </View>
            </View>
            {reportType === type.value && (
              <MaterialCommunityIcons name="check-circle" size={24} color={type.color} />
            )}
          </TouchableOpacity>
        ))}
      </View>

      {/* Report Format Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Format</Text>
        <View style={styles.formatButtons}>
          {REPORT_FORMAT_OPTIONS.map((format) => (
            <TouchableOpacity
              key={format.value}
              style={[
                styles.formatButton,
                reportFormat === format.value && styles.formatButtonSelected,
                { borderColor: format.color },
              ]}
              onPress={() => setReportFormat(format.value)}
            >
              <MaterialCommunityIcons 
                name={format.icon} 
                size={24} 
                color={reportFormat === format.value ? format.color : '#757575'} 
              />
              <Text 
                style={[
                  styles.formatButtonText,
                  { color: reportFormat === format.value ? format.color : '#757575' }
                ]}
              >
                {format.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Report Period Selection */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Time Period</Text>
        <SegmentedButtons
          value={reportPeriod}
          onValueChange={setReportPeriod}
          buttons={[
            { value: 'this_week', label: 'This Week' },
            { value: 'this_month', label: 'This Month' },
            { value: 'this_term', label: 'This Term' },
            { value: 'custom', label: 'Custom' },
          ]}
          style={styles.segmentedButtons}
        />

        {reportPeriod === 'custom' && (
          <View style={styles.datePickersContainer}>
            <View style={styles.datePickerWrapper}>
              <Text style={styles.dateLabel}>Start Date</Text>
              <DatePicker
                label="Start Date"
                value={startDate}
                onChange={setStartDate}
                maximumDate={new Date()}
              />
            </View>
            <View style={styles.datePickerWrapper}>
              <Text style={styles.dateLabel}>End Date</Text>
              <DatePicker
                label="End Date"
                value={endDate}
                onChange={setEndDate}
                minimumDate={startDate}
                maximumDate={new Date()}
              />
            </View>
          </View>
        )}
      </View>

      {/* Selected Report Summary */}
      {selectedTypeInfo && selectedFormatInfo && (
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Report Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Report Type:</Text>
              <Text style={styles.summaryValue}>{selectedTypeInfo.label}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Format:</Text>
              <Text style={styles.summaryValue}>{selectedFormatInfo.label}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>School:</Text>
              <Text style={styles.summaryValue}>{user?.school?.name}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Period:</Text>
              <Text style={styles.summaryValue}>
                {reportPeriod === 'this_week' && 'This Week'}
                {reportPeriod === 'this_month' && 'This Month'}
                {reportPeriod === 'this_term' && 'This Term'}
                {reportPeriod === 'custom' && startDate && endDate && 
                  `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
                {reportPeriod === 'custom' && (!startDate || !endDate) && 'Select dates'}
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Generate Button */}
      <Button
        mode="contained"
        onPress={handleGenerateReport}
        loading={isGenerating}
        disabled={isGenerating}
        style={styles.generateButton}
        contentStyle={styles.generateButtonContent}
        icon="file-document"
      >
        {isGenerating ? 'Generating Report...' : 'Generate Report'}
      </Button>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchRecentReports} /> : null}

      {/* Recent Reports */}
      <View style={styles.section}>
        <View style={styles.recentReportsHeader}>
          <Text style={styles.sectionTitle}>Recent Reports ({recentReports.length})</Text>
          <TouchableOpacity onPress={onRefresh}>
            <MaterialCommunityIcons name="refresh" size={24} color="#2196F3" />
          </TouchableOpacity>
        </View>
        
        {recentReports.length > 0 ? (
          <FlatList
            data={recentReports}
            renderItem={renderReportItem}
            keyExtractor={(item) => item.id.toString()}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
            }
          />
        ) : (
          <Card style={styles.emptyCard}>
            <Card.Content>
              <Text style={styles.emptyText}>No recent reports found</Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  schoolCode: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  reportTypeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  reportTypeCardSelected: {
    borderColor: '#FF9800',
    backgroundColor: '#FFF3E0',
  },
  reportTypeLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  reportTypeIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportTypeText: {
    marginLeft: 16,
    flex: 1,
  },
  reportTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  reportTypeDescription: {
    fontSize: 12,
    color: '#757575',
    lineHeight: 16,
  },
  formatButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  formatButton: {
    flex: 1,
    minWidth: '45%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E0E0E0',
  },
  formatButtonSelected: {
    backgroundColor: '#FFF3E0',
  },
  formatButtonText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  segmentedButtons: {
    marginBottom: 16,
  },
  datePickersContainer: {
    marginTop: 16,
  },
  datePickerWrapper: {
    marginBottom: 16,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 8,
  },
  summaryCard: {
    marginBottom: 24,
    backgroundColor: '#E3F2FD',
    elevation: 2,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1565C0',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    color: '#424242',
    fontWeight: '600',
    minWidth: 100,
  },
  summaryValue: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
  },
  generateButton: {
    backgroundColor: '#FF9800',
    marginBottom: 24,
  },
  generateButtonContent: {
    height: 50,
  },
  recentReportsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  recentReportCard: {
    marginBottom: 12,
    elevation: 1,
  },
  recentReportRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  recentReportInfo: {
    flex: 1,
    marginLeft: 16,
  },
  recentReportTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  recentReportDate: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 2,
  },
  recentReportTime: {
    fontSize: 11,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  recentReportChips: {
    flexDirection: 'row',
    marginTop: 4,
  },
  chip: {
    height: 24,
  },
  reportActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deleteButton: {
    marginLeft: 16,
  },
  emptyCard: {
    elevation: 0,
    backgroundColor: '#FAFAFA',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#757575',
    padding: 16,
  },
});

export default SchoolReportsScreen;