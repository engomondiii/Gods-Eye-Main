import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Chip, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import GuardianListItem from '../../components/student/GuardianListItem';
import { 
  SCREENS, 
  MAX_GUARDIANS_PER_STUDENT,
  KENYA_EDUCATION_LEVELS,
  KENYA_ACADEMIC_TERMS,
} from '../../utils/constants';
import { formatDate } from '../../utils/formatters';
import theme from '../../styles/theme';

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
        // Personal Information
        first_name: 'John',
        middle_name: 'Kamau',
        last_name: 'Mwangi',
        date_of_birth: '2010-05-15',
        gender: 'Male',
        birth_certificate_number: '123456789',
        
        // School Information
        school: {
          id: 1,
          name: 'Nairobi Primary School',
          nemis_code: '001234567',
          county: { name: 'Nairobi' },
        },
        
        // Academic Information
        education_level: 'primary',
        current_grade: 'grade_5',
        stream: 'Red',
        admission_number: 'ADM/2020/0045',
        upi_number: 'UPI1234567890',
        year_of_admission: 2020,
        current_term: 'term_1',
        
        // House System
        house_name: 'Kilimanjaro',
        house_color: 'Red',
        
        // Special Needs
        has_special_needs: false,
        special_needs_description: null,
        
        // Guardians
        guardians: [
          {
            id: 1,
            first_name: 'Jane',
            last_name: 'Mwangi',
            phone: '+254712345678',
            relationship: 'Mother',
            is_primary: true,
          },
          {
            id: 2,
            first_name: 'Michael',
            last_name: 'Mwangi',
            phone: '+254723456789',
            relationship: 'Father',
            is_primary: false,
          },
        ],
        
        // Payment Summary
        pending_payments: 2,
        total_payments: 5,
        
        // Attendance & Biometric
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

  const handleViewQRCode = () => {
    navigation.navigate(SCREENS.STUDENT_QR_CODE, { student });
  };

  const handleBiometricSetup = () => {
    navigation.navigate(SCREENS.BIOMETRIC_SETUP, { student });
  };

  const handleViewAttendance = () => {
    navigation.navigate(SCREENS.ATTENDANCE_HISTORY, { 
      studentId: student.id,
      studentName: `${student.first_name} ${student.last_name}`,
    });
  };

  const handleEditStudent = () => {
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
            console.log('Delete student:', studentId);
          },
        },
      ]
    );
  };

  // Helper function to get grade label
  const getGradeLabel = (grade) => {
    const gradeLabels = {
      pp1: 'PP1 (Pre-Primary 1)',
      pp2: 'PP2 (Pre-Primary 2)',
      grade_1: 'Grade 1',
      grade_2: 'Grade 2',
      grade_3: 'Grade 3',
      grade_4: 'Grade 4',
      grade_5: 'Grade 5',
      grade_6: 'Grade 6',
      grade_7: 'Grade 7',
      grade_8: 'Grade 8',
      grade_9: 'Grade 9',
      grade_10: 'Grade 10',
      grade_11: 'Grade 11',
      grade_12: 'Grade 12',
      form_1: 'Form 1',
      form_2: 'Form 2',
      form_3: 'Form 3',
      form_4: 'Form 4',
    };
    return gradeLabels[grade] || grade;
  };

  // Helper function to get education level label
  const getEducationLevelLabel = (level) => {
    const levelLabels = {
      pre_primary: 'Pre-Primary',
      primary: 'Primary',
      junior_secondary: 'Junior Secondary',
      senior_secondary: 'Senior Secondary',
    };
    return levelLabels[level] || level;
  };

  // Helper function to get term label
  const getTermLabel = (term) => {
    const termLabels = {
      term_1: 'Term 1',
      term_2: 'Term 2',
      term_3: 'Term 3',
    };
    return termLabels[term] || term;
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
              <MaterialCommunityIcons name="account-circle" size={80} color={theme.colors.primary} />
            </View>
            <View style={styles.headerTextContainer}>
              <Title style={styles.studentName}>
                {student.first_name} {student.middle_name} {student.last_name}
              </Title>
              <Paragraph style={styles.admissionNumber}>
                {student.admission_number}
              </Paragraph>
              {student.gender && (
                <Chip mode="flat" style={styles.genderChip} textStyle={styles.chipText}>
                  {student.gender}
                </Chip>
              )}
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Basic Information */}
          <Text style={styles.subsectionTitle}>Personal Information</Text>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>{formatDate(student.date_of_birth)}</Text>
          </View>

          {student.birth_certificate_number && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="card-account-details" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.infoLabel}>Birth Certificate:</Text>
              <Text style={styles.infoValue}>{student.birth_certificate_number}</Text>
            </View>
          )}

          {student.upi_number && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="identifier" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.infoLabel}>UPI Number:</Text>
              <Text style={styles.infoValue}>{student.upi_number}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* School Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subsectionTitle}>School Information</Text>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="school" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>School:</Text>
            <Text style={styles.infoValue}>{student.school.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>County:</Text>
            <Text style={styles.infoValue}>{student.school.county.name}</Text>
          </View>

          {student.school.nemis_code && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="barcode" size={20} color={theme.colors.textSecondary} />
              <Text style={styles.infoLabel}>NEMIS Code:</Text>
              <Text style={styles.infoValue}>{student.school.nemis_code}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Academic Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.subsectionTitle}>Academic Information (CBC)</Text>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="school-outline" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Education Level:</Text>
            <Text style={styles.infoValue}>{getEducationLevelLabel(student.education_level)}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="book-open-variant" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Grade/Class:</Text>
            <Text style={styles.infoValue}>{getGradeLabel(student.current_grade)}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="format-list-bulleted" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Stream/Class:</Text>
            <Text style={styles.infoValue}>{student.stream}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-range" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Year of Admission:</Text>
            <Text style={styles.infoValue}>{student.year_of_admission}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-today" size={20} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Current Term:</Text>
            <Text style={styles.infoValue}>{getTermLabel(student.current_term)}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* House System Card (if applicable) */}
      {(student.house_name || student.house_color) && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.subsectionTitle}>House System</Text>
            
            {student.house_name && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="home-group" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>House Name:</Text>
                <Text style={styles.infoValue}>{student.house_name} House</Text>
              </View>
            )}

            {student.house_color && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="palette" size={20} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>House Color:</Text>
                <View style={styles.colorIndicatorContainer}>
                  <View style={[styles.colorIndicator, { backgroundColor: student.house_color }]} />
                  <Text style={styles.infoValue}>{student.house_color}</Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Special Needs Card (if applicable) */}
      {student.has_special_needs && (
        <Card style={[styles.card, styles.specialNeedsCard]}>
          <Card.Content>
            <View style={styles.specialNeedsHeader}>
              <MaterialCommunityIcons name="alert-circle" size={24} color={theme.colors.warning} />
              <Text style={styles.specialNeedsTitle}>Special Needs</Text>
            </View>
            {student.special_needs_description && (
              <Text style={styles.specialNeedsText}>
                {student.special_needs_description}
              </Text>
            )}
          </Card.Content>
        </Card>
      )}

      {/* Attendance & Identification Section */}
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
                color={student.qr_code_generated ? theme.colors.success : theme.colors.textSecondary} 
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
                    ? theme.colors.success
                    : theme.colors.textSecondary
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
          textColor={theme.colors.error}
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
    backgroundColor: theme.colors.background,
  },
  contentContainer: {
    padding: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.medium,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  headerTextContainer: {
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  admissionNumber: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  genderChip: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '20',
    marginTop: theme.spacing.xs,
  },
  chipText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.primary,
  },
  divider: {
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.border,
  },
  miniDivider: {
    marginVertical: theme.spacing.sm,
    backgroundColor: theme.colors.border,
  },
  subsectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.sm,
    marginRight: theme.spacing.sm,
    minWidth: 120,
  },
  infoValue: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: '500',
    flex: 1,
  },
  colorIndicatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  specialNeedsCard: {
    backgroundColor: theme.colors.warningLight,
  },
  specialNeedsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  specialNeedsTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.warning,
    marginLeft: theme.spacing.sm,
  },
  specialNeedsText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  noDataText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
  attendanceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
  },
  attendanceItem: {
    alignItems: 'flex-start',
  },
  attendancePercentage: {
    fontSize: theme.fontSizes.h2,
    fontWeight: 'bold',
    color: theme.colors.success,
  },
  attendanceLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  attendanceButton: {
    marginLeft: theme.spacing.sm,
  },
  identificationRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  identificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  identificationText: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  identificationTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  identificationStatus: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  biometricChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.xs,
  },
  biometricChip: {
    height: 24,
    backgroundColor: theme.colors.successLight,
    marginRight: theme.spacing.xs,
  },
  biometricChipText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.success,
  },
  paymentSummaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  paymentStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  paymentStatDivider: {
    width: 1,
    backgroundColor: theme.colors.border,
  },
  paymentStatNumber: {
    fontSize: theme.fontSizes.h2,
    fontWeight: 'bold',
    color: theme.colors.primary,
    marginBottom: theme.spacing.xs,
  },
  paymentStatLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
  paymentButton: {
    backgroundColor: theme.colors.primary,
  },
  actionButtonsContainer: {
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});

export default StudentDetailScreen;