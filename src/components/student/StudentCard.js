import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Avatar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';

const StudentCard = ({ student, onPress }) => {
  const guardianCount = student.guardians?.length || 0;

  // Helper function to get grade label
  const getGradeLabel = (grade) => {
    const gradeLabels = {
      pp1: 'PP1',
      pp2: 'PP2',
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

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.leftSection}>
            <Avatar.Icon
              size={56}
              icon="account-circle"
              style={styles.avatar}
              color={theme.colors.primary}
            />
            <View style={styles.infoContainer}>
              {/* Student Name */}
              <Text style={styles.name}>
                {student.first_name} {student.middle_name ? `${student.middle_name} ` : ''}{student.last_name}
              </Text>
              
              {/* Admission Number */}
              <View style={styles.detailRow}>
                <MaterialCommunityIcons 
                  name="card-account-details" 
                  size={14} 
                  color={theme.colors.textSecondary} 
                />
                <Text style={styles.detailText}>{student.admission_number}</Text>
              </View>
              
              {/* Grade & Stream */}
              {student.current_grade && (
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons 
                    name="book-open-variant" 
                    size={14} 
                    color={theme.colors.textSecondary} 
                  />
                  <Text style={styles.detailText}>
                    {getGradeLabel(student.current_grade)}
                    {student.stream && ` - ${student.stream}`}
                  </Text>
                </View>
              )}
              
              {/* House (if available) */}
              {student.house_name && (
                <View style={styles.detailRow}>
                  <MaterialCommunityIcons 
                    name="home-group" 
                    size={14} 
                    color={theme.colors.textSecondary} 
                  />
                  <Text style={styles.detailText}>
                    {student.house_name} House
                  </Text>
                  {student.house_color && (
                    <View 
                      style={[
                        styles.houseColorDot, 
                        { backgroundColor: student.house_color }
                      ]} 
                    />
                  )}
                </View>
              )}
            </View>
          </View>
          
          <View style={styles.rightSection}>
            {/* Attendance Percentage */}
            {student.attendance_percentage !== undefined && (
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
                  styles.attendanceText,
                  {
                    color: 
                      student.attendance_percentage >= 90 ? theme.colors.success :
                      student.attendance_percentage >= 75 ? theme.colors.warning :
                      theme.colors.error
                  }
                ]}
                icon="clipboard-check"
              >
                {student.attendance_percentage}%
              </Chip>
            )}
            
            {/* Guardian Count */}
            <Chip
              mode="flat"
              style={[
                styles.guardianChip,
                guardianCount === 0 && styles.noGuardianChip,
              ]}
              textStyle={styles.chipText}
              icon="account-multiple"
            >
              {guardianCount}
            </Chip>
            
            {/* Chevron */}
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
              style={styles.chevron}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: theme.spacing.sm,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: theme.colors.primary + '20',
  },
  infoContainer: {
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  name: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  houseColorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: theme.spacing.xs,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rightSection: {
    alignItems: 'flex-end',
    marginLeft: theme.spacing.sm,
  },
  attendanceChip: {
    marginBottom: theme.spacing.xs,
    height: 24,
  },
  attendanceText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: 'bold',
  },
  guardianChip: {
    backgroundColor: theme.colors.successLight,
    marginBottom: theme.spacing.xs,
    height: 24,
  },
  noGuardianChip: {
    backgroundColor: theme.colors.errorContainer,
  },
  chipText: {
    fontSize: theme.fontSizes.xs,
    fontWeight: 'bold',
  },
  chevron: {
    marginTop: theme.spacing.xs,
  },
});

export default StudentCard;