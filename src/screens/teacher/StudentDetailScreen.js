import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import GuardianListItem from '../../components/student/GuardianListItem';
import { SCREENS, MAX_GUARDIANS_PER_STUDENT } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

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
      // const response = await studentService.getStudentById(studentId);
      
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
        pending_payments: 2,
        total_payments: 5,
        // ✨ NEW - Biometric & QR Status
        qr_code_generated: true,
        biometric_enrolled: {
          fingerprint: true,
          face_recognition: false,
        },
        attendance_percentage: 92,
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

  const handleLinkGuardian = () => {
    if (student.guardians.length >= MAX_GUARDIANS_PER_STUDENT) {
      Alert.alert(
        'Maximum Guardians Reached',
        `A student can have a maximum of ${MAX_GUARDIANS_PER_STUDENT} guardians.`,
        [{ text: 'OK' }]
      );
      return;
    }
    
    navigation.navigate(SCREENS.CREATE_GUARDIAN_LINK, { student });
  };

  const handleCreatePayment = () => {
    navigation.navigate(SCREENS.CREATE_PAYMENT_REQUEST, { student });
  };

  // ✨ NEW - Navigate to QR Code Screen
  const handleViewQRCode = () => {
    navigation.navigate(SCREENS.STUDENT_QR_CODE, { student });
  };

  // ✨ NEW - Navigate to Biometric Setup
  const handleBiometricSetup = () => {
    navigation.navigate(SCREENS.BIOMETRIC_SETUP, { student });
  };

  // ✨ NEW - Navigate to Attendance History
  const handleViewAttendance = () => {
    navigation.navigate(SCREENS.ATTENDANCE_HISTORY, { 
      studentId: student.id,
      studentName: `${student.first_name} ${student.last_name}`,
    });
  };

  const handleEditStudent = () => {
    // TODO: Navigate to edit screen
    Alert.alert('Edit Student', 'Edit functionality coming soon!');
  };

  const handleDeleteStudent = () => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.first_name} ${student.last_name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement delete functionality
            console.log('Delete student:', studentId);
          },
        },
      ]
    );
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
            <Text style={styles.infoLabel}>County:</Text>
            <Text style={styles.infoValue}>{student.school.county.name}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* ✨ NEW - Attendance & Identification Section */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Attendance & Identification</Title>
          
          {/* Attendance Summary */}
          <View style={styles.attendanceContainer}>
            <View style={styles.attendanceItem}>
              <Text style={styles.attendancePercentage}>
                {student.attendance_percentage}%
              </Text>
              <Text style={styles.attendanceLabel}>Attendance Rate</Text>
            </View>
            <Button
              mode="outlined"
              onPress={handleViewAttendance}
              style={styles.attendanceButton}
              icon="history"
              compact
            >
              View History
            </Button>
          </View>

          <Divider style={styles.divider} />

          {/* QR Code Status */}
          <View style={styles.identificationRow}>
            <View style={styles.identificationLeft}>
              <MaterialCommunityIcons 
                name="qrcode" 
                size={32} 
                color={student.qr_code_generated ? '#4CAF50' : '#757575'} 
              />
              <View style={styles.identificationText}>
                <Text style={styles.identificationTitle}>QR Code</Text>
                <Text style={styles.identificationStatus}>
                  {student.qr_code_generated ? 'Generated' : 'Not Generated'}
                </Text>
              </View>
            </View>
            <Button
              mode="outlined"
              onPress={handleViewQRCode}
              compact
              icon={student.qr_code_generated ? 'eye' : 'qrcode-plus'}
            >
              {student.qr_code_generated ? 'View' : 'Generate'}
            </Button>
          </View>

          <Divider style={styles.miniDivider} />

          {/* Biometric Status */}
          <View style={styles.identificationRow}>
            <View style={styles.identificationLeft}>
              <MaterialCommunityIcons 
                name="fingerprint" 
                size={32} 
                color={
                  student.biometric_enrolled.fingerprint || student.biometric_enrolled.face_recognition 
                    ? '#4CAF50' 
                    : '#757575'
                } 
              />
              <View style={styles.identificationText}>
                <Text style={styles.identificationTitle}>Biometric</Text>
                <View style={styles.biometricChips}>
                  {student.biometric_enrolled.fingerprint && (
                    <Chip 
                      mode="flat" 
                      style={styles.biometricChip}
                      textStyle={styles.biometricChipText}
                    >
                      Fingerprint
                    </Chip>
                  )}
                  {student.biometric_enrolled.face_recognition && (
                    <Chip 
                      mode="flat" 
                      style={styles.biometricChip}
                      textStyle={styles.biometricChipText}
                    >
                      Face
                    </Chip>
                  )}
                  {!student.biometric_enrolled.fingerprint && 
                   !student.biometric_enrolled.face_recognition && (
                    <Text style={styles.identificationStatus}>Not Enrolled</Text>
                  )}
                </View>
              </View>
            </View>
            <Button
              mode="outlined"
              onPress={handleBiometricSetup}
              compact
              icon="fingerprint"
            >
              Setup
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Guardians Section */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>
              Guardians ({student.guardians.length}/{MAX_GUARDIANS_PER_STUDENT})
            </Title>
            <Button
              mode="outlined"
              onPress={handleLinkGuardian}
              disabled={student.guardians.length >= MAX_GUARDIANS_PER_STUDENT}
              compact
            >
              Add
            </Button>
          </View>

          {student.guardians.length > 0 ? (
            student.guardians.map((guardian) => (
              <GuardianListItem key={guardian.id} guardian={guardian} />
            ))
          ) : (
            <Text style={styles.noDataText}>No guardians linked yet</Text>
          )}
        </Card.Content>
      </Card>

      {/* Payment Summary */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Payment Summary</Title>
          
          <View style={styles.paymentSummaryContainer}>
            <View style={styles.paymentStatItem}>
              <Text style={styles.paymentStatNumber}>{student.pending_payments}</Text>
              <Text style={styles.paymentStatLabel}>Pending</Text>
            </View>
            <View style={styles.paymentStatDivider} />
            <View style={styles.paymentStatItem}>
              <Text style={styles.paymentStatNumber}>{student.total_payments}</Text>
              <Text style={styles.paymentStatLabel}>Total Requests</Text>
            </View>
          </View>

          <Button
            mode="contained"
            onPress={handleCreatePayment}
            style={styles.paymentButton}
            icon="cash-plus"
          >
            Create Payment Request
          </Button>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <View style={styles.actionButtonsContainer}>
        <Button
          mode="outlined"
          onPress={handleEditStudent}
          style={styles.actionButton}
          icon="pencil"
        >
          Edit Student
        </Button>
        <Button
          mode="outlined"
          onPress={handleDeleteStudent}
          style={[styles.actionButton, styles.deleteButton]}
          icon="delete"
          textColor="#F44336"
        >
          Delete Student
        </Button>
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
  miniDivider: {
    marginVertical: 12,
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
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 12,
    borderRadius: 8,
  },
  attendanceItem: {
    alignItems: 'flex-start',
  },
  attendancePercentage: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  attendanceLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  attendanceButton: {
    marginLeft: 8,
  },
  // ✨ NEW - Identification Styles
  identificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  identificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  identificationText: {
    marginLeft: 12,
    flex: 1,
  },
  identificationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginBottom: 4,
  },
  identificationStatus: {
    fontSize: 12,
    color: '#757575',
  },
  biometricChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginTop: 4,
  },
  biometricChip: {
    height: 24,
    backgroundColor: '#E8F5E9',
    marginRight: 4,
  },
  biometricChipText: {
    fontSize: 10,
    color: '#4CAF50',
  },
  paymentSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    marginBottom: 16,
  },
  paymentStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  paymentStatDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  paymentStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  paymentStatLabel: {
    fontSize: 14,
    color: '#757575',
  },
  paymentButton: {
    backgroundColor: '#6200EE',
  },
  actionButtonsContainer: {
    marginBottom: 16,
  },
  actionButton: {
    marginBottom: 12,
  },
  deleteButton: {
    borderColor: '#F44336',
  },
});

export default StudentDetailScreen;