import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Title, Button, SegmentedButtons } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import DatePicker from '../../components/form/DatePicker';
import theme from '../../styles/theme';

const SchoolReportsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('attendance');
  const [reportPeriod, setReportPeriod] = useState('this_month');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const reportTypes = [
    {
      id: 'attendance',
      title: 'Attendance Report',
      description: 'Detailed attendance statistics by class, grade, and individual students',
      icon: 'clipboard-check',
      color: '#2196F3',
    },
    {
      id: 'academic',
      title: 'Academic Performance',
      description: 'Student performance analysis and grade distribution',
      icon: 'school',
      color: '#4CAF50',
    },
    {
      id: 'financial',
      title: 'Financial Report',
      description: 'Payment collections, pending fees, and financial overview',
      icon: 'cash-multiple',
      color: '#FF9800',
    },
    {
      id: 'enrollment',
      title: 'Enrollment Report',
      description: 'Student enrollment trends and demographics',
      icon: 'account-multiple',
      color: '#9C27B0',
    },
    {
      id: 'teacher',
      title: 'Teacher Report',
      description: 'Teacher assignments, class loads, and performance',
      icon: 'account-tie',
      color: '#00BCD4',
    },
  ];

  const handleGenerateReport = async () => {
    if (reportPeriod === 'custom' && (!startDate || !endDate)) {
      Alert.alert('Error', 'Please select start and end dates for custom period');
      return;
    }

    setIsGenerating(true);
    
    try {
      // TODO: Replace with actual API call
      // const response = await schoolAdminService.generateReport({
      //   schoolId: user.school.id,
      //   reportType,
      //   reportPeriod,
      //   startDate,
      //   endDate,
      // });
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      Alert.alert(
        'Report Generated',
        'Your report has been generated successfully. You can download it now.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Download',
            onPress: () => {
              Alert.alert('Download', 'Report download functionality coming soon!');
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to generate report. Please try again.');
      console.error('Generate report error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedReportType = reportTypes.find(r => r.id === reportType);

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
        {reportTypes.map((type) => (
          <TouchableOpacity
            key={type.id}
            style={[
              styles.reportTypeCard,
              reportType === type.id && styles.reportTypeCardSelected,
            ]}
            onPress={() => setReportType(type.id)}
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
                <Text style={styles.reportTypeTitle}>{type.title}</Text>
                <Text style={styles.reportTypeDescription}>{type.description}</Text>
              </View>
            </View>
            {reportType === type.id && (
              <MaterialCommunityIcons name="check-circle" size={24} color={type.color} />
            )}
          </TouchableOpacity>
        ))}
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
      {selectedReportType && (
        <Card style={styles.summaryCard}>
          <Card.Content>
            <Text style={styles.summaryTitle}>Report Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Report Type:</Text>
              <Text style={styles.summaryValue}>{selectedReportType.title}</Text>
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
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Format:</Text>
              <Text style={styles.summaryValue}>PDF</Text>
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

      {/* Recent Reports */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Recent Reports</Text>
        <Card style={styles.recentReportCard}>
          <Card.Content>
            <View style={styles.recentReportRow}>
              <MaterialCommunityIcons name="file-pdf-box" size={32} color="#F44336" />
              <View style={styles.recentReportInfo}>
                <Text style={styles.recentReportTitle}>Attendance Report - November 2025</Text>
                <Text style={styles.recentReportDate}>Generated on Nov 10, 2025</Text>
              </View>
              <TouchableOpacity>
                <MaterialCommunityIcons name="download" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.recentReportCard}>
          <Card.Content>
            <View style={styles.recentReportRow}>
              <MaterialCommunityIcons name="file-pdf-box" size={32} color="#F44336" />
              <View style={styles.recentReportInfo}>
                <Text style={styles.recentReportTitle}>Financial Report - Term 3 2025</Text>
                <Text style={styles.recentReportDate}>Generated on Nov 5, 2025</Text>
              </View>
              <TouchableOpacity>
                <MaterialCommunityIcons name="download" size={24} color="#2196F3" />
              </TouchableOpacity>
            </View>
          </Card.Content>
        </Card>
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
  },
});

export default SchoolReportsScreen;