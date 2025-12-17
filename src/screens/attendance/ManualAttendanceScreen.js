// ========================================
// GOD'S EYE EDTECH - MANUAL ATTENDANCE SCREEN
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  FlatList,
} from 'react-native';
import {
  Text,
  Searchbar,
  Button,
  Checkbox,
  TextInput,
  SegmentedButtons,
  Card,
  Chip,
  IconButton,
  Portal,
  Modal,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DatePicker from '../../components/form/DatePicker';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import theme from '../../styles/theme';
import { ATTENDANCE_STATUS, ATTENDANCE_STATUS_LABELS, ATTENDANCE_STATUS_COLORS } from '../../utils/constants';
import * as attendanceService from '../../services/attendanceService';
import * as studentService from '../../services/studentService';

const ManualAttendanceScreen = ({ navigation, route }) => {
  // Get params (if navigating from student detail)
  const { studentId, students: preselectedStudents } = route.params || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceStatus, setAttendanceStatus] = useState(ATTENDANCE_STATUS.PRESENT);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Students data
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);

  // Date picker modal
  const [datePickerVisible, setDatePickerVisible] = useState(false);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setError('');
      setIsLoading(true);

      const response = await studentService.getStudents({
        is_active: true,
        page_size: 100,
        ordering: 'first_name,last_name',
      });

      if (response.success) {
        const studentData = response.data.results || response.data;
        setStudents(studentData);
        setFilteredStudents(studentData);

        // If there's a preselected student, select them
        if (studentId) {
          setSelectedStudents([studentId]);
        } else if (preselectedStudents && Array.isArray(preselectedStudents)) {
          setSelectedStudents(preselectedStudents.map(s => s.id));
        }
      } else {
        throw new Error(response.message || 'Failed to load students');
      }
    } catch (err) {
      console.error('Fetch students error:', err);
      setError(err.message || 'Failed to load students. Please try again.');
      setStudents([]);
      setFilteredStudents([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Search functionality
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter((student) => {
      const fullName = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.toLowerCase();
      const admission = (student.admission_number || '').toLowerCase();
      const grade = (student.grade_and_stream || '').toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        admission.includes(searchLower) ||
        grade.includes(searchLower)
      );
    });
    
    setFilteredStudents(filtered);
  }, [students]);

  // Toggle student selection
  const toggleStudent = (studentIdToToggle) => {
    setSelectedStudents((prev) =>
      prev.includes(studentIdToToggle)
        ? prev.filter((id) => id !== studentIdToToggle)
        : [...prev, studentIdToToggle]
    );
  };

  // Toggle all students
  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setSelectedDate(date);
    setDatePickerVisible(false);
  };

  // Format date for display
  const formatDate = (date) => {
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  // Handle submit
  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      Alert.alert('No Selection', 'Please select at least one student.');
      return;
    }

    const statusLabel = ATTENDANCE_STATUS_LABELS[attendanceStatus] || attendanceStatus;

    Alert.alert(
      'Confirm Attendance',
      `Mark ${selectedStudents.length} student(s) as ${statusLabel} for ${formatDate(selectedDate)}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              
              // Prepare data for bulk marking
              const studentsData = selectedStudents.map(studentId => ({
                student_id: studentId,
                status: attendanceStatus,
                notes: notes.trim(),
              }));

              const response = await attendanceService.bulkMarkAttendance({
                date: selectedDate.toISOString().split('T')[0],
                students: studentsData,
              });

              if (response.success) {
                Alert.alert(
                  'Success',
                  `${selectedStudents.length} student(s) marked as ${statusLabel} successfully!`,
                  [
                    {
                      text: 'OK',
                      onPress: () => {
                        setSelectedStudents([]);
                        setNotes('');
                        navigation.goBack();
                      },
                    },
                  ]
                );
              } else {
                throw new Error(response.message || 'Failed to mark attendance');
              }
            } catch (error) {
              console.error('Manual attendance error:', error);
              Alert.alert('Error', error.message || 'Failed to mark attendance. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

  // Render student card
  const renderStudent = ({ item }) => {
    const isSelected = selectedStudents.includes(item.id);

    return (
      <Card style={styles.studentCard} onPress={() => toggleStudent(item.id)}>
        <Card.Content style={styles.studentCardContent}>
          <View style={styles.studentInfo}>
            <View style={styles.studentAvatar}>
              <MaterialCommunityIcons
                name="account"
                size={32}
                color={theme.colors.primary}
              />
            </View>
            <View style={styles.studentDetails}>
              <Text style={styles.studentName}>
                {item.full_name || `${item.first_name} ${item.last_name}`}
              </Text>
              <Text style={styles.studentAdmission}>
                {item.admission_number}
              </Text>
              {item.grade_and_stream && (
                <Text style={styles.studentGrade}>
                  {item.grade_and_stream}
                </Text>
              )}
            </View>
          </View>
          <Checkbox
            status={isSelected ? 'checked' : 'unchecked'}
            onPress={() => toggleStudent(item.id)}
          />
        </Card.Content>
      </Card>
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading students..." />;
  }

  if (isSubmitting) {
    return <LoadingSpinner message="Submitting attendance..." />;
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons
            name="pencil"
            size={32}
            color={theme.colors.primary}
          />
          <View style={styles.headerText}>
            <Text style={styles.headerTitle}>Manual Attendance</Text>
            <Text style={styles.headerSubtitle}>
              {selectedStudents.length} student(s) selected
            </Text>
          </View>
        </View>
      </View>

      {/* Date Selector */}
      <View style={styles.dateSelector}>
        <Text style={styles.dateSelectorLabel}>Date:</Text>
        <Chip
          icon="calendar"
          onPress={() => setDatePickerVisible(true)}
          style={styles.dateChip}
        >
          {formatDate(selectedDate)}
        </Chip>
      </View>

      {/* Attendance Status Selector */}
      <View style={styles.statusSelector}>
        <Text style={styles.statusSelectorLabel}>Status:</Text>
        <View style={styles.statusChips}>
          {Object.entries(ATTENDANCE_STATUS).map(([key, value]) => (
            <Chip
              key={value}
              selected={attendanceStatus === value}
              onPress={() => setAttendanceStatus(value)}
              style={[
                styles.statusChip,
                attendanceStatus === value && {
                  backgroundColor: ATTENDANCE_STATUS_COLORS[value] + '20',
                },
              ]}
              textStyle={[
                styles.statusChipText,
                attendanceStatus === value && {
                  color: ATTENDANCE_STATUS_COLORS[value],
                  fontWeight: 'bold',
                },
              ]}
            >
              {ATTENDANCE_STATUS_LABELS[value]}
            </Chip>
          ))}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name, admission, or grade..."
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Select All */}
      <View style={styles.selectAllContainer}>
        <Checkbox.Item
          label={`Select All (${filteredStudents.length})`}
          status={
            selectedStudents.length === filteredStudents.length && filteredStudents.length > 0
              ? 'checked'
              : selectedStudents.length > 0
              ? 'indeterminate'
              : 'unchecked'
          }
          onPress={toggleAll}
          labelStyle={styles.selectAllLabel}
        />
      </View>

      {/* Error Message */}
      {error ? (
        <ErrorMessage message={error} onRetry={fetchStudents} />
      ) : null}

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          renderItem={renderStudent}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="account-search"
          title="No Students Found"
          message={
            searchQuery
              ? 'No students match your search criteria'
              : 'No active students available'
          }
        />
      )}

      {/* Notes Input */}
      <View style={styles.notesContainer}>
        <TextInput
          label="Notes (Optional)"
          mode="outlined"
          value={notes}
          onChangeText={setNotes}
          multiline
          numberOfLines={2}
          placeholder="Add any notes about this attendance entry..."
          style={styles.notesInput}
        />
      </View>

      {/* Submit Button */}
      <View style={styles.submitContainer}>
        <Button
          mode="contained"
          onPress={handleSubmit}
          disabled={selectedStudents.length === 0}
          icon={
            attendanceStatus === ATTENDANCE_STATUS.PRESENT ? 'check' :
            attendanceStatus === ATTENDANCE_STATUS.ABSENT ? 'close' :
            attendanceStatus === ATTENDANCE_STATUS.LATE ? 'clock-alert' :
            'file-document'
          }
          contentStyle={styles.submitButtonContent}
          style={[
            styles.submitButton,
            { backgroundColor: ATTENDANCE_STATUS_COLORS[attendanceStatus] },
          ]}
        >
          Mark {selectedStudents.length} Student(s) as {ATTENDANCE_STATUS_LABELS[attendanceStatus]}
        </Button>
      </View>

      {/* Date Picker Modal */}
      <Portal>
        <Modal
          visible={datePickerVisible}
          onDismiss={() => setDatePickerVisible(false)}
          contentContainerStyle={styles.modalContent}
        >
          <View style={styles.datePickerContainer}>
            <Text style={styles.datePickerTitle}>Select Date</Text>
            <DatePicker
              value={selectedDate}
              onChange={handleDateChange}
              maximumDate={new Date()}
            />
            <Button
              mode="outlined"
              onPress={() => setDatePickerVisible(false)}
              style={styles.datePickerCloseButton}
            >
              Cancel
            </Button>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    ...theme.shadows.small,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  headerTitle: {
    fontSize: theme.fontSizes.h4,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  headerSubtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  dateSelectorLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginRight: theme.spacing.sm,
  },
  dateChip: {
    backgroundColor: theme.colors.primary + '20',
  },
  statusSelector: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  statusSelectorLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  statusChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  statusChip: {
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  statusChipText: {
    fontSize: theme.fontSizes.sm,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme.colors.background,
  },
  searchInput: {
    fontSize: theme.fontSizes.md,
  },
  selectAllContainer: {
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  selectAllLabel: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  studentCard: {
    marginBottom: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  studentCardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  studentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.sm,
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
  },
  studentAdmission: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  studentGrade: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  notesContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  notesInput: {
    backgroundColor: theme.colors.background,
  },
  submitContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...theme.shadows.large,
  },
  submitButton: {
    borderRadius: theme.borderRadius.md,
  },
  submitButtonContent: {
    height: 50,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.lg,
    margin: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
  },
  datePickerContainer: {
    width: '100%',
  },
  datePickerTitle: {
    fontSize: theme.fontSizes.h4,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: 'center',
  },
  datePickerCloseButton: {
    marginTop: theme.spacing.md,
  },
});

export default ManualAttendanceScreen;