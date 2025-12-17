// ========================================
// GOD'S EYE EDTECH - STUDENT DETAIL SCREEN
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Text,
  Button,
  Chip,
  Divider,
  List,
  Avatar,
  IconButton,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { SCREENS, KENYA_GRADE_LABELS } from '../../utils/constants';
import * as studentService from '../../services/studentService';
import theme from '../../styles/theme';

const StudentDetailScreen = ({ route, navigation }) => {
  const { studentId } = route.params;

  const [student, setStudent] = useState(null);
  const [guardians, setGuardians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch student details
  const fetchStudentDetails = async () => {
    try {
      setError('');

      // Fetch student details
      const studentResponse = await studentService.getStudentById(studentId);
      
      if (!studentResponse.success) {
        throw new Error(studentResponse.message || 'Failed to load student');
      }

      setStudent(studentResponse.data);

      // Fetch guardians
      const guardiansResponse = await studentService.getStudentGuardians(studentId);
      
      if (guardiansResponse.success) {
        setGuardians(guardiansResponse.data.guardians || []);
      }

    } catch (err) {
      console.error('Fetch student details error:', err);
      setError(err.message || 'Failed to load student details. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudentDetails();
  }, [studentId]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchStudentDetails();
  }, [studentId]);

  // Handle delete student
  const handleDeleteStudent = () => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.full_name}? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsLoading(true);
              const response = await studentService.deleteStudent(studentId);
              
              if (response.success) {
                Alert.alert('Success', 'Student deleted successfully', [
                  { text: 'OK', onPress: () => navigation.goBack() },
                ]);
              } else {
                throw new Error(response.message || 'Failed to delete student');
              }
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to delete student');
              setIsLoading(false);
            }
          },
        },
      ]
    );
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading student details..." />;
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
      showsVerticalScrollIndicator={false}
    >
      {/* HEADER CARD - Profile Photo & Name */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          {student.photo ? (
            <Image source={{ uri: student.photo }} style={styles.profilePhoto} />
          ) : (
            <Avatar.Text
              size={100}
              label={`${student.first_name[0]}${student.last_name[0]}`}
              style={styles.avatarFallback}
            />
          )}
          
          <View style={styles.headerInfo}>
            <Title style={styles.studentName}>{student.full_name}</Title>
            <Text style={styles.admissionNumber}>
              Admission: {student.admission_number}
            </Text>
            <Text style={styles.schoolName}>{student.school_name}</Text>
            
            <View style={styles.statusRow}>
              <Chip
                icon="school"
                mode="outlined"
                style={styles.infoChip}
                textStyle={styles.chipText}
              >
                {student.grade_and_stream}
              </Chip>
              <Chip
                icon={student.is_active ? 'check-circle' : 'close-circle'}
                mode="outlined"
                style={[
                  styles.statusChip,
                  { borderColor: student.is_active ? theme.colors.success : theme.colors.error },
                ]}
                textStyle={[
                  styles.chipText,
                  { color: student.is_active ? theme.colors.success : theme.colors.error },
                ]}
              >
                {student.is_active ? 'Active' : 'Inactive'}
              </Chip>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* PERSONAL INFORMATION */}
      <Card style={styles.card}>
        <Card.Title
          title="Personal Information"
          left={(props) => <List.Icon {...props} icon="account" />}
        />
        <Card.Content>
          <InfoRow label="Full Name" value={student.full_name} />
          <InfoRow label="Date of Birth" value={formatDate(student.date_of_birth)} />
          <InfoRow label="Age" value={`${student.age} years`} />
          <InfoRow label="Gender" value={student.gender_display} />
          {student.birth_certificate_number && (
            <InfoRow
              label="Birth Certificate"
              value={student.birth_certificate_number}
            />
          )}
        </Card.Content>
      </Card>

      {/* ACADEMIC INFORMATION */}
      <Card style={styles.card}>
        <Card.Title
          title="Academic Information"
          left={(props) => <List.Icon {...props} icon="book-open-variant" />}
        />
        <Card.Content>
          <InfoRow label="School" value={student.school_name} />
          <InfoRow label="County" value={student.county_name} />
          <InfoRow label="Education Level" value={student.education_level_display} />
          <InfoRow
            label="Current Grade"
            value={KENYA_GRADE_LABELS[student.current_grade] || student.current_grade}
          />
          <InfoRow label="Stream/Class" value={student.stream || 'N/A'} />
          <InfoRow label="Admission Number" value={student.admission_number} />
          {student.upi_number && (
            <InfoRow label="UPI Number" value={student.upi_number} />
          )}
          <InfoRow label="Year of Admission" value={student.year_of_admission} />
          <InfoRow label="Current Term" value={student.term_display} />
        </Card.Content>
      </Card>

      {/* HOUSE SYSTEM */}
      {(student.house_name || student.house_color) && (
        <Card style={styles.card}>
          <Card.Title
            title="House System"
            left={(props) => <List.Icon {...props} icon="home-group" />}
          />
          <Card.Content>
            {student.house_name && <InfoRow label="House Name" value={student.house_name} />}
            {student.house_color && (
              <View style={styles.colorRow}>
                <Text style={styles.infoLabel}>House Color:</Text>
                <View style={styles.colorInfo}>
                  <View
                    style={[
                      styles.colorIndicator,
                      { backgroundColor: student.house_color },
                    ]}
                  />
                  <Text style={styles.infoValue}>{student.house_color}</Text>
                </View>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {/* SPECIAL NEEDS */}
      {student.has_special_needs && (
        <Card style={styles.card}>
          <Card.Title
            title="Special Needs"
            left={(props) => <List.Icon {...props} icon="medical-bag" color={theme.colors.warning} />}
          />
          <Card.Content>
            <Text style={styles.specialNeedsText}>
              {student.special_needs_description || 'No description provided'}
            </Text>
          </Card.Content>
        </Card>
      )}

      {/* GUARDIANS */}
      <Card style={styles.card}>
        <Card.Title
          title={`Guardians (${guardians.length})`}
          left={(props) => <List.Icon {...props} icon="account-heart" />}
          right={(props) =>
            guardians.length < 5 && (
              <IconButton
                {...props}
                icon="plus"
                onPress={() =>
                  navigation.navigate(SCREENS.CREATE_GUARDIAN_LINK, {
                    studentId: student.id,
                  })
                }
              />
            )
          }
        />
        <Card.Content>
          {guardians.length > 0 ? (
            guardians.map((guardian, index) => (
              <View key={guardian.id}>
                <View style={styles.guardianRow}>
                  <View style={styles.guardianInfo}>
                    <Text style={styles.guardianName}>
                      {guardian.guardian_name}
                      {guardian.is_primary && (
                        <Chip
                          mode="flat"
                          style={styles.primaryChip}
                          textStyle={styles.primaryChipText}
                        >
                          PRIMARY
                        </Chip>
                      )}
                    </Text>
                    <Text style={styles.guardianDetail}>
                      {guardian.relationship_display}
                    </Text>
                    <Text style={styles.guardianDetail}>{guardian.guardian_phone}</Text>
                    {guardian.guardian_email && (
                      <Text style={styles.guardianDetail}>{guardian.guardian_email}</Text>
                    )}
                  </View>
                  <IconButton
                    icon="phone"
                    size={20}
                    onPress={() => Alert.alert('Call', `Call ${guardian.guardian_name}?`)}
                  />
                </View>
                {index < guardians.length - 1 && <Divider style={styles.guardianDivider} />}
              </View>
            ))
          ) : (
            <View style={styles.emptyGuardiansContainer}>
              <MaterialCommunityIcons
                name="account-alert"
                size={48}
                color={theme.colors.textSecondary}
              />
              <Text style={styles.emptyGuardiansText}>No guardians linked yet</Text>
              <Button
                mode="outlined"
                onPress={() =>
                  navigation.navigate(SCREENS.CREATE_GUARDIAN_LINK, {
                    studentId: student.id,
                  })
                }
                style={styles.addGuardianButton}
              >
                Link Guardian
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* BIOMETRIC & QR CODE */}
      <Card style={styles.card}>
        <Card.Title
          title="Attendance Methods"
          left={(props) => <List.Icon {...props} icon="fingerprint" />}
        />
        <Card.Content>
          <View style={styles.biometricRow}>
            <View style={styles.biometricItem}>
              <MaterialCommunityIcons
                name="fingerprint"
                size={32}
                color={student.fingerprint_id ? theme.colors.success : theme.colors.disabled}
              />
              <Text style={styles.biometricLabel}>
                Fingerprint {student.fingerprint_id ? '✓' : '✗'}
              </Text>
            </View>
            <View style={styles.biometricItem}>
              <MaterialCommunityIcons
                name="qrcode"
                size={32}
                color={student.qr_code ? theme.colors.success : theme.colors.disabled}
              />
              <Text style={styles.biometricLabel}>
                QR Code {student.qr_code ? '✓' : '✗'}
              </Text>
            </View>
            <View style={styles.biometricItem}>
              <MaterialCommunityIcons
                name="face-recognition"
                size={32}
                color={student.face_data ? theme.colors.success : theme.colors.disabled}
              />
              <Text style={styles.biometricLabel}>
                Face {student.face_data ? '✓' : '✗'}
              </Text>
            </View>
          </View>
          
          <View style={styles.biometricButtons}>
            <Button
              mode="outlined"
              icon="qrcode"
              onPress={() =>
                navigation.navigate(SCREENS.STUDENT_QR_CODE, { studentId: student.id })
              }
              style={styles.biometricButton}
            >
              View QR Code
            </Button>
            <Button
              mode="outlined"
              icon="fingerprint"
              onPress={() =>
                navigation.navigate(SCREENS.BIOMETRIC_SETUP, { studentId: student.id })
              }
              style={styles.biometricButton}
            >
              Setup Biometrics
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* ACTION BUTTONS */}
      <View style={styles.actionButtons}>
        <Button
          mode="contained"
          icon="pencil"
          onPress={() =>
            navigation.navigate(SCREENS.CREATE_STUDENT, {
              studentId: student.id,
              editMode: true,
            })
          }
          style={styles.editButton}
        >
          Edit Student
        </Button>
        <Button
          mode="outlined"
          icon="delete"
          onPress={handleDeleteStudent}
          style={styles.deleteButton}
          textColor={theme.colors.error}
        >
          Delete Student
        </Button>
      </View>

      {/* TIMESTAMPS */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.timestampText}>
            Created: {formatDate(student.created_at)}
          </Text>
          {student.updated_at && (
            <Text style={styles.timestampText}>
              Last Updated: {formatDate(student.updated_at)}
            </Text>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

// InfoRow Component
const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={styles.infoValue}>{value || 'N/A'}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  noDataText: {
    textAlign: 'center',
    marginTop: theme.spacing.xl,
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textSecondary,
  },
  
  // Header Card
  headerCard: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: theme.spacing.md,
  },
  avatarFallback: {
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  headerInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    marginBottom: theme.spacing.xs,
  },
  admissionNumber: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  schoolName: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary,
    marginBottom: theme.spacing.sm,
  },
  statusRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  infoChip: {
    marginRight: theme.spacing.xs,
  },
  statusChip: {
    borderWidth: 1.5,
  },
  chipText: {
    fontSize: theme.fontSizes.sm,
  },
  
  // Cards
  card: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 1,
  },
  
  // Info Rows
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  infoLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    fontWeight: '500',
    flex: 1,
  },
  infoValue: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    flex: 1,
    textAlign: 'right',
  },
  
  // Color Row
  colorRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.xs,
  },
  colorInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  colorIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  // Special Needs
  specialNeedsText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 22,
  },
  
  // Guardians
  guardianRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: theme.spacing.sm,
  },
  guardianInfo: {
    flex: 1,
  },
  guardianName: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  guardianDetail: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: 2,
  },
  guardianDivider: {
    marginVertical: theme.spacing.sm,
  },
  primaryChip: {
    marginLeft: theme.spacing.sm,
    backgroundColor: theme.colors.warning,
    height: 20,
  },
  primaryChipText: {
    fontSize: 10,
    color: theme.colors.text,
    fontWeight: 'bold',
  },
  emptyGuardiansContainer: {
    alignItems: 'center',
    paddingVertical: theme.spacing.lg,
  },
  emptyGuardiansText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  addGuardianButton: {
    marginTop: theme.spacing.sm,
  },
  
  // Biometric
  biometricRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: theme.spacing.md,
    paddingVertical: theme.spacing.md,
  },
  biometricItem: {
    alignItems: 'center',
  },
  biometricLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  biometricButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  biometricButton: {
    flex: 1,
  },
  
  // Action Buttons
  actionButtons: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  editButton: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  deleteButton: {
    flex: 1,
    borderColor: theme.colors.error,
  },
  
  // Timestamps
  timestampText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginVertical: 2,
  },
});

export default StudentDetailScreen;