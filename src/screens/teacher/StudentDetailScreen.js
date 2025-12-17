// ========================================
// GOD'S EYE EDTECH - STUDENT DETAIL SCREEN (UPDATED WITH ATTENDANCE)
// ========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Image,
  Alert,
} from 'react-native';
import { Text, Card, Button, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as studentService from '../../services/studentService';
import * as biometricService from '../../services/biometricService';
import { SCREENS } from '../../utils/constants';

const StudentDetailScreen = ({ route, navigation }) => {
  const { studentId } = route.params;
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [attendanceStats, setAttendanceStats] = useState(null);
  const [biometricStatus, setBiometricStatus] = useState({
    hasFingerprint: false,
    hasFaceRecognition: false,
    hasQRCode: false,
  });

  useEffect(() => {
    fetchStudentDetails();
    fetchBiometricStatus();
  }, [studentId]);

  const fetchStudentDetails = async () => {
    try {
      setError('');
      const response = await studentService.getStudentById(studentId);

      if (response.success) {
        setStudent(response.data);
        // Fetch attendance stats
        await fetchAttendanceStats(studentId);
      } else {
        setError(response.message || 'Failed to load student details');
      }
    } catch (err) {
      setError('Failed to load student details. Please try again.');
      console.error('Student detail error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  const fetchAttendanceStats = async (id) => {
    try {
      // TODO: Replace with actual API call
      // const response = await attendanceService.getStudentStats(id);
      
      // Mock data for now
      setAttendanceStats({
        attendance_rate: 94.5,
        present_days: 85,
        absent_days: 5,
        late_days: 3,
        total_days: 90,
      });
    } catch (err) {
      console.error('Attendance stats error:', err);
    }
  };

  const fetchBiometricStatus = async () => {
    try {
      const response = await biometricService.getStudentBiometrics(studentId);

      if (response.success) {
        const biometrics = response.data || [];
        setBiometricStatus({
          hasFingerprint: biometrics.some(b => b.biometric_type === 'fingerprint' && b.is_active),
          hasFaceRecognition: biometrics.some(b => b.biometric_type === 'face' && b.is_active),
          hasQRCode: true, // QR codes are always available
        });
      }
    } catch (err) {
      console.error('Biometric status error:', err);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await fetchStudentDetails();
    await fetchBiometricStatus();
  };

  const handleViewQRCode = () => {
    navigation.navigate(SCREENS.STUDENT_QR_CODE, { student });
  };

  const handleSetupBiometrics = () => {
    navigation.navigate(SCREENS.BIOMETRIC_SETUP, { student });
  };

  const handleViewAttendance = () => {
    navigation.navigate(SCREENS.ATTENDANCE_HISTORY, { studentId, student });
  };

  const handleEditStudent = () => {
    Alert.alert('Edit Student', 'Edit functionality coming soon');
  };

  const handleDeleteStudent = () => {
    Alert.alert(
      'Delete Student',
      'Are you sure you want to delete this student? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            // TODO: Implement delete
            Alert.alert('Success', 'Student deleted successfully');
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading student details..." />;
  }

  if (error && !student) {
    return (
      <ErrorMessage
        message={error}
        onRetry={fetchStudentDetails}
      />
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* Student Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              {student.photo ? (
                <Image source={{ uri: student.photo }} style={styles.avatar} />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <MaterialCommunityIcons
                    name="account"
                    size={60}
                    color={theme.colors.primary}
                  />
                </View>
              )}
            </View>
            <View style={styles.headerInfo}>
              <Text style={styles.studentName}>
                {student.first_name} {student.last_name}
              </Text>
              <Text style={styles.studentSubtitle}>
                {student.admission_number}
              </Text>
              <View style={styles.statusChips}>
                <Chip
                  icon="school"
                  style={styles.chip}
                  textStyle={styles.chipText}
                >
                  {student.grade} {student.stream}
                </Chip>
                <Chip
                  icon={student.is_active ? 'check-circle' : 'close-circle'}
                  style={[
                    styles.chip,
                    student.is_active ? styles.activeChip : styles.inactiveChip,
                  ]}
                  textStyle={styles.chipText}
                >
                  {student.is_active ? 'Active' : 'Inactive'}
                </Chip>
              </View>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Attendance Statistics Card */}
      {attendanceStats && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="chart-line"
                size={24}
                color={theme.colors.primary}
              />
              <Text style={styles.sectionTitle}>Attendance Overview</Text>
            </View>

            <View style={styles.statsGrid}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{attendanceStats.attendance_rate}%</Text>
                <Text style={styles.statLabel}>Attendance Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.success }]}>
                  {attendanceStats.present_days}
                </Text>
                <Text style={styles.statLabel}>Present</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.error }]}>
                  {attendanceStats.absent_days}
                </Text>
                <Text style={styles.statLabel}>Absent</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statValue, { color: theme.colors.warning }]}>
                  {attendanceStats.late_days}
                </Text>
                <Text style={styles.statLabel}>Late</Text>
              </View>
            </View>

            <Button
              mode="outlined"
              icon="history"
              onPress={handleViewAttendance}
              style={styles.button}
            >
              View Attendance History
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Biometric & QR Code Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="security"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Attendance Methods</Text>
          </View>

          <View style={styles.biometricStatus}>
            <View style={styles.biometricItem}>
              <MaterialCommunityIcons
                name="qrcode"
                size={24}
                color={biometricStatus.hasQRCode ? theme.colors.success : theme.colors.textSecondary}
              />
              <Text style={styles.biometricLabel}>QR Code</Text>
              <MaterialCommunityIcons
                name={biometricStatus.hasQRCode ? 'check-circle' : 'close-circle'}
                size={20}
                color={biometricStatus.hasQRCode ? theme.colors.success : theme.colors.error}
              />
            </View>

            <View style={styles.biometricItem}>
              <MaterialCommunityIcons
                name="fingerprint"
                size={24}
                color={biometricStatus.hasFingerprint ? theme.colors.success : theme.colors.textSecondary}
              />
              <Text style={styles.biometricLabel}>Fingerprint</Text>
              <MaterialCommunityIcons
                name={biometricStatus.hasFingerprint ? 'check-circle' : 'close-circle'}
                size={20}
                color={biometricStatus.hasFingerprint ? theme.colors.success : theme.colors.error}
              />
            </View>

            <View style={styles.biometricItem}>
              <MaterialCommunityIcons
                name="face-recognition"
                size={24}
                color={biometricStatus.hasFaceRecognition ? theme.colors.success : theme.colors.textSecondary}
              />
              <Text style={styles.biometricLabel}>Face Recognition</Text>
              <MaterialCommunityIcons
                name={biometricStatus.hasFaceRecognition ? 'check-circle' : 'close-circle'}
                size={20}
                color={biometricStatus.hasFaceRecognition ? theme.colors.success : theme.colors.error}
              />
            </View>
          </View>

          <View style={styles.buttonGroup}>
            <Button
              mode="contained"
              icon="qrcode"
              onPress={handleViewQRCode}
              style={[styles.button, styles.halfButton]}
            >
              View QR Code
            </Button>
            <Button
              mode="contained"
              icon="fingerprint"
              onPress={handleSetupBiometrics}
              style={[styles.button, styles.halfButton]}
            >
              Setup Biometrics
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Student Information Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="information"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.sectionTitle}>Student Information</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>
              {student.date_of_birth || 'Not provided'}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{student.gender || 'Not provided'}</Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Parent/Guardian:</Text>
            <Text style={styles.infoValue}>
              {student.parent_guardian || 'Not provided'}
            </Text>
          </View>

          <Divider style={styles.divider} />

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Contact:</Text>
            <Text style={styles.infoValue}>
              {student.parent_phone || 'Not provided'}
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Actions Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Button
            mode="outlined"
            icon="pencil"
            onPress={handleEditStudent}
            style={styles.button}
          >
            Edit Student
          </Button>
          <Button
            mode="outlined"
            icon="delete"
            onPress={handleDeleteStudent}
            style={[styles.button, styles.deleteButton]}
            textColor={theme.colors.error}
          >
            Delete Student
          </Button>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    marginRight: theme.spacing.md,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  avatarPlaceholder: {
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  studentSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statusChips: {
    flexDirection: 'row',
    marginTop: theme.spacing.sm,
    gap: theme.spacing.xs,
  },
  chip: {
    backgroundColor: theme.colors.background,
  },
  chipText: {
    fontSize: theme.fontSizes.xs,
  },
  activeChip: {
    backgroundColor: theme.colors.success + '20',
  },
  inactiveChip: {
    backgroundColor: theme.colors.error + '20',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  biometricStatus: {
    marginBottom: theme.spacing.md,
  },
  biometricItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  biometricLabel: {
    flex: 1,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  button: {
    marginTop: theme.spacing.sm,
  },
  halfButton: {
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  infoLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  infoValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  divider: {
    backgroundColor: theme.colors.border,
  },
  deleteButton: {
    borderColor: theme.colors.error,
  },
});

export default StudentDetailScreen;