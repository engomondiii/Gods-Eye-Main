import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Avatar, Chip, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '../../utils/formatters';
import theme from '../../styles/theme';

const StudentInfoCard = ({ student }) => {
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

  return (
    <Card style={styles.card}>
      <Card.Content>
        {/* Header with Avatar and Name */}
        <View style={styles.header}>
          <Avatar.Icon
            size={80}
            icon="account-circle"
            style={styles.avatar}
            color={theme.colors.primary}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {student.first_name} {student.middle_name ? `${student.middle_name} ` : ''}{student.last_name}
            </Text>
            <Chip mode="flat" style={styles.admissionChip} textStyle={styles.chipText}>
              {student.admission_number}
            </Chip>
            {student.gender && (
              <Chip 
                mode="flat" 
                style={styles.genderChip} 
                textStyle={styles.chipText}
                icon={student.gender === 'Male' ? 'gender-male' : student.gender === 'Female' ? 'gender-female' : 'gender-male-female'}
              >
                {student.gender}
              </Chip>
            )}
          </View>
        </View>

        <Divider style={styles.divider} />

        {/* Personal Information Section */}
        <Text style={styles.sectionTitle}>Personal Information</Text>
        
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="calendar" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.infoLabel}>Date of Birth:</Text>
          <Text style={styles.infoValue}>
            {student.date_of_birth ? formatDate(student.date_of_birth) : 'N/A'}
          </Text>
        </View>

        {student.birth_certificate_number && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="card-account-details" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Birth Certificate:</Text>
            <Text style={styles.infoValue}>{student.birth_certificate_number}</Text>
          </View>
        )}

        {student.upi_number && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="identifier" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>UPI Number:</Text>
            <Text style={styles.infoValue}>{student.upi_number}</Text>
          </View>
        )}

        <Divider style={styles.divider} />

        {/* School Information Section */}
        <Text style={styles.sectionTitle}>School Information</Text>

        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="school" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.infoLabel}>School:</Text>
          <Text style={styles.infoValue} numberOfLines={2}>
            {student.school?.name || 'N/A'}
          </Text>
        </View>

        {student.school?.county && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>County:</Text>
            <Text style={styles.infoValue}>{student.school.county.name}</Text>
          </View>
        )}

        {student.school?.nemis_code && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="barcode" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>NEMIS Code:</Text>
            <Text style={styles.infoValue}>{student.school.nemis_code}</Text>
          </View>
        )}

        <Divider style={styles.divider} />

        {/* Academic Information Section */}
        <Text style={styles.sectionTitle}>Academic Information (CBC)</Text>

        {student.education_level && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="school-outline" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Education Level:</Text>
            <Text style={styles.infoValue}>{getEducationLevelLabel(student.education_level)}</Text>
          </View>
        )}

        {student.current_grade && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="book-open-variant" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Grade/Class:</Text>
            <Text style={styles.infoValue}>{getGradeLabel(student.current_grade)}</Text>
          </View>
        )}

        {student.stream && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="format-list-bulleted" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Stream/Class:</Text>
            <Text style={styles.infoValue}>{student.stream}</Text>
          </View>
        )}

        {student.year_of_admission && (
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar-range" size={18} color={theme.colors.textSecondary} />
            <Text style={styles.infoLabel}>Year of Admission:</Text>
            <Text style={styles.infoValue}>{student.year_of_admission}</Text>
          </View>
        )}

        {/* House System (if applicable) */}
        {(student.house_name || student.house_color) && (
          <>
            <Divider style={styles.divider} />
            <Text style={styles.sectionTitle}>House System</Text>

            {student.house_name && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="home-group" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>House Name:</Text>
                <Text style={styles.infoValue}>{student.house_name} House</Text>
              </View>
            )}

            {student.house_color && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="palette" size={18} color={theme.colors.textSecondary} />
                <Text style={styles.infoLabel}>House Color:</Text>
                <View style={styles.colorContainer}>
                  <View style={[styles.colorDot, { backgroundColor: student.house_color }]} />
                  <Text style={styles.infoValue}>{student.house_color}</Text>
                </View>
              </View>
            )}
          </>
        )}

        <Divider style={styles.divider} />

        {/* Guardians Section */}
        <View style={styles.infoRow}>
          <MaterialCommunityIcons name="account-group" size={18} color={theme.colors.textSecondary} />
          <Text style={styles.infoLabel}>Guardians:</Text>
          <Text style={styles.infoValue}>
            {student.guardians?.length || 0} linked
          </Text>
        </View>

        {/* Attendance (if available) */}
        {student.attendance_percentage !== undefined && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="clipboard-check" size={18} color={theme.colors.textSecondary} />
              <Text style={styles.infoLabel}>Attendance Rate:</Text>
              <Chip 
                mode="flat" 
                style={[
                  styles.attendanceChip,
                  {
                    backgroundColor: 
                      student.attendance_percentage >= 90 ? theme.colors.successLight :
                      student.attendance_percentage >= 75 ? theme.colors.warningLight :
                      theme.colors.errorContainer
                  }
                ]}
                textStyle={[
                  styles.attendanceChipText,
                  {
                    color: 
                      student.attendance_percentage >= 90 ? theme.colors.success :
                      student.attendance_percentage >= 75 ? theme.colors.warning :
                      theme.colors.error
                  }
                ]}
              >
                {student.attendance_percentage}%
              </Chip>
            </View>
          </>
        )}

        {/* Special Needs Alert (if applicable) */}
        {student.has_special_needs && (
          <>
            <Divider style={styles.divider} />
            <View style={styles.specialNeedsContainer}>
              <MaterialCommunityIcons name="alert-circle" size={20} color={theme.colors.warning} />
              <Text style={styles.specialNeedsText}>Student has special needs</Text>
            </View>
          </>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    ...theme.shadows.medium,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    backgroundColor: theme.colors.primary + '20',
  },
  headerInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  name: {
    fontSize: theme.fontSizes.h4,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  admissionChip: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.successLight,
    marginBottom: theme.spacing.xs,
  },
  genderChip: {
    alignSelf: 'flex-start',
    backgroundColor: theme.colors.primary + '20',
  },
  chipText: {
    fontSize: theme.fontSizes.sm,
  },
  divider: {
    marginVertical: theme.spacing.md,
    backgroundColor: theme.colors.border,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
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
    minWidth: 100,
  },
  infoValue: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    fontWeight: '500',
    flex: 1,
  },
  colorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  colorDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: theme.spacing.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  attendanceChip: {
    height: 28,
  },
  attendanceChipText: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
  },
  specialNeedsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.warningLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
  },
  specialNeedsText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.warning,
    fontWeight: '600',
    marginLeft: theme.spacing.sm,
  },
});

export default StudentInfoCard;