import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Card, Title, Paragraph, Divider, Chip, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import GuardianListItem from '../../components/student/GuardianListItem';
import { formatDate } from '../../utils/formatters';
import { SCREENS } from '../../utils/constants';

const StudentDetailScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch student details
  const fetchStudentDetails = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await guardianService.getStudentDetails(studentId);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudent = {
        id: studentId,
        first_name: 'John',
        last_name: 'Doe',
        date_of_birth: '2010-05-15',
        admission_number: 'NPS001',
        school: {
          id: 1,
          name: 'Nairobi Primary School',
          county: { name: 'Nairobi' },
          address: '123 Education Road, Nairobi',
        },
        guardians: [
          {
            id: 1,
            first_name: 'Jane',
            last_name: 'Doe',
            phone: '+254712345678',
            relationship: 'Mother',
            is_primary: true,
          },
          {
            id: 2,
            first_name: 'Michael',
            last_name: 'Doe',
            phone: '+254723456789',
            relationship: 'Father',
            is_primary: false,
          },
        ],
        recent_payments: [
          {
            id: 1,
            amount: 5000.00,
            purpose: 'School fees for Term 1, 2025',
            status: 'paid',
            paid_date: '2025-10-20',
          },
          {
            id: 2,
            amount: 3500.00,
            purpose: 'Exam fees',
            status: 'pending',
            due_date: '2025-11-15',
          },
        ],
        // ✨ NEW - Attendance Data
        attendance: {
          percentage: 92,
          present: 83,
          absent: 5,
          late: 7,
          total: 95,
          last_checkin: '2025-11-03T07:45:00Z',
          qr_code_active: true,
          biometric_enrolled: true,
        },
      };
      
      setStudent(mockStudent);
    } catch (err) {
      setError('Failed to load student details. Please try again.');
      console.error('Fetch student error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  // ✨ NEW - Navigate to Attendance History
  const handleViewAttendance = () => {
    navigation.navigate(SCREENS.ATTENDANCE_HISTORY, {
      studentId: student.id,
      studentName: `${student.first_name} ${student.last_name}`,
    });
  };

  // ✨ NEW - Navigate to QR Code
  const handleViewQRCode = () => {
    navigation.navigate(SCREENS.STUDENT_QR_CODE, { student });
  };

  // ✨ NEW - Navigate to Biometric Setup
  const handleBiometricSetup = () => {
    navigation.navigate(SCREENS.BIOMETRIC_SETUP, { student });
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error && !student) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={fetchStudentDetails} />
      </View>
    );
  }

  if (!student) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>Student not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Student Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <View style={styles.avatarContainer}>
              <MaterialCommunityIcons name="account-circle" size={80} color="#6200EE" />
            </View>
            <View style={styles.headerTextContainer}>
              <Title style={styles.studentName}>
                {student.first_name} {student.last_name}
              </Title>
              <Paragraph style={styles.admissionNumber}>
                {student.admission_number}
              </Paragraph>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Basic Information */}
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>{formatDate(student.date_of_birth)}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="school" size={20} color="#757575" />
            <Text style={styles.infoLabel}>School:</Text>
            <Text style={styles.infoValue}>{student.school.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Location:</Text>
            <Text style={styles.infoValue}>{student.school.county.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="home" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{student.school.address}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* ✨ NEW - Attendance Summary Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Attendance Summary</Title>
            <Button
              mode="text"
              onPress={handleViewAttendance}
              compact
            >
              View All
            </Button>
          </View>

          {/* Attendance Stats */}
          <View style={styles.attendanceStatsContainer}>
            <View style={styles.attendanceStatBox}>
              <Text style={[styles.attendancePercentage, { 
                color: student.attendance.percentage >= 90 ? '#4CAF50' : 
                       student.attendance.percentage >= 75 ? '#FF9800' : '#F44336'
              }]}>
                {student.attendance.percentage}%
              </Text>
              <Text style={styles.attendanceStatLabel}>Attendance Rate</Text>
            </View>

            <View style={styles.attendanceDetailsGrid}>
              <View style={styles.attendanceDetailItem}>
                <MaterialCommunityIcons name="check-circle" size={20} color="#4CAF50" />
                <Text style={styles.attendanceDetailNumber}>{student.attendance.present}</Text>
                <Text style={styles.attendanceDetailLabel}>Present</Text>
              </View>

              <View style={styles.attendanceDetailItem}>
                <MaterialCommunityIcons name="close-circle" size={20} color="#F44336" />
                <Text style={styles.attendanceDetailNumber}>{student.attendance.absent}</Text>
                <Text style={styles.attendanceDetailLabel}>Absent</Text>
              </View>

              <View style={styles.attendanceDetailItem}>
                <MaterialCommunityIcons name="clock-alert" size={20} color="#FF9800" />
                <Text style={styles.attendanceDetailNumber}>{student.attendance.late}</Text>
                <Text style={styles.attendanceDetailLabel}>Late</Text>
              </View>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Last Check-in */}
          <View style={styles.lastCheckinContainer}>
            <MaterialCommunityIcons name="clock-check" size={20} color="#757575" />
            <Text style={styles.lastCheckinText}>
              Last check-in: {new Date(student.attendance.last_checkin).toLocaleString()}
            </Text>
          </View>

          {/* Quick Actions */}
          <View style={styles.attendanceActionsRow}>
            <Button
              mode="outlined"
              onPress={handleViewQRCode}
              style={styles.attendanceActionButton}
              icon="qrcode"
              compact
            >
              QR Code
            </Button>
            <Button
              mode="outlined"
              onPress={handleBiometricSetup}
              style={styles.attendanceActionButton}
              icon="fingerprint"
              compact
            >
              Biometric
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Other Guardians */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>All Guardians</Title>

          {student.guardians.length > 0 ? (
            student.guardians.map((guardian) => (
              <GuardianListItem key={guardian.id} guardian={guardian} />
            ))
          ) : (
            <Text style={styles.noDataText}>No guardians linked</Text>
          )}
        </Card.Content>
      </Card>

      {/* Recent Payments */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Recent Payments</Title>
          
          {student.recent_payments.length > 0 ? (
            student.recent_payments.map((payment) => (
              <View key={payment.id} style={styles.paymentItem}>
                <View style={styles.paymentInfo}>
                  <Text style={styles.paymentAmount}>
                    KES {payment.amount.toFixed(2)}
                  </Text>
                  <Text style={styles.paymentPurpose}>{payment.purpose}</Text>
                  <Text style={styles.paymentDate}>
                    {payment.status === 'paid'
                      ? `Paid on ${formatDate(payment.paid_date)}`
                      : `Due on ${formatDate(payment.due_date)}`}
                  </Text>
                </View>
                <Chip
                  mode="flat"
                  style={[
                    styles.statusChip,
                    payment.status === 'paid'
                      ? styles.paidChip
                      : styles.pendingChip,
                  ]}
                  textStyle={styles.chipText}
                >
                  {payment.status.toUpperCase()}
                </Chip>
              </View>
            ))
          ) : (
            <Text style={styles.noDataText}>No payment history</Text>
          )}
        </Card.Content>
      </Card>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  admissionNumber: {
    fontSize: 14,
    color: '#757575',
  },
  divider: {
    marginVertical: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  noDataText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginVertical: 16,
  },
  // ✨ NEW - Attendance Styles
  attendanceStatsContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  attendanceStatBox: {
    alignItems: 'center',
    marginBottom: 16,
  },
  attendancePercentage: {
    fontSize: 48,
    fontWeight: 'bold',
  },
  attendanceStatLabel: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  attendanceDetailsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  attendanceDetailItem: {
    alignItems: 'center',
  },
  attendanceDetailNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 4,
  },
  attendanceDetailLabel: {
    fontSize: 11,
    color: '#757575',
    marginTop: 2,
  },
  lastCheckinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  lastCheckinText: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 8,
  },
  attendanceActionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  attendanceActionButton: {
    flex: 1,
  },
  paymentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  paymentInfo: {
    flex: 1,
    marginRight: 12,
  },
  paymentAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  paymentPurpose: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 2,
  },
  paymentDate: {
    fontSize: 12,
    color: '#9E9E9E',
  },
  statusChip: {
    height: 28,
  },
  paidChip: {
    backgroundColor: '#E8F5E9',
  },
  pendingChip: {
    backgroundColor: '#FFF3E0',
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
});

export default StudentDetailScreen;