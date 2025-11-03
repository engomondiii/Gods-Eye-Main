import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import {
  Text,
  Searchbar,
  Button,
  Checkbox,
  TextInput,
  SegmentedButtons,
  Card,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManualAttendanceScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [attendanceType, setAttendanceType] = useState('check_in');
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [students, setStudents] = useState([
    {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      admission_number: 'NPS001',
      isCheckedIn: false,
    },
    {
      id: 2,
      first_name: 'Sarah',
      last_name: 'Smith',
      admission_number: 'NPS002',
      isCheckedIn: true,
    },
    {
      id: 3,
      first_name: 'Mike',
      last_name: 'Johnson',
      admission_number: 'NPS003',
      isCheckedIn: false,
    },
    {
      id: 4,
      first_name: 'Emma',
      last_name: 'Williams',
      admission_number: 'NPS004',
      isCheckedIn: false,
    },
  ]);

  const filteredStudents = students.filter((student) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const name = `${student.first_name} ${student.last_name}`.toLowerCase();
    const admission = student.admission_number.toLowerCase();
    return name.includes(query) || admission.includes(query);
  });

  const toggleStudent = (studentId) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter((id) => id !== studentId)
        : [...prev, studentId]
    );
  };

  const toggleAll = () => {
    if (selectedStudents.length === filteredStudents.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(filteredStudents.map((s) => s.id));
    }
  };

  const handleSubmit = async () => {
    if (selectedStudents.length === 0) {
      Alert.alert('No Selection', 'Please select at least one student.');
      return;
    }

    Alert.alert(
      'Confirm Attendance',
      `Mark ${selectedStudents.length} student(s) as ${
        attendanceType === 'check_in' ? 'checked in' : 'checked out'
      }?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              setIsSubmitting(true);
              
              // TODO: Replace with actual API call
              // await attendanceService.createManualEntry({
              //   studentIds: selectedStudents,
              //   type: attendanceType,
              //   notes,
              // });
              
              await new Promise(resolve => setTimeout(resolve, 1500));
              
              Alert.alert(
                'Success',
                `${selectedStudents.length} student(s) marked successfully!`,
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
            } catch (error) {
              console.error('Manual attendance error:', error);
              Alert.alert('Error', 'Failed to mark attendance. Please try again.');
            } finally {
              setIsSubmitting(false);
            }
          },
        },
      ]
    );
  };

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

      {/* Attendance Type Selector */}
      <View style={styles.typeSelector}>
        <SegmentedButtons
          value={attendanceType}
          onValueChange={setAttendanceType}
          buttons={[
            {
              value: 'check_in',
              label: 'Check In',
              icon: 'login',
            },
            {
              value: 'check_out',
              label: 'Check Out',
              icon: 'logout',
            },
          ]}
        />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name or admission number..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
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

      {/* Students List */}
      <ScrollView 
        style={styles.listContainer}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredStudents.map((student) => (
          <Card key={student.id} style={styles.studentCard}>
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
                    {student.first_name} {student.last_name}
                  </Text>
                  <Text style={styles.studentAdmission}>
                    {student.admission_number}
                  </Text>
                  {student.isCheckedIn && (
                    <View style={styles.statusBadge}>
                      <MaterialCommunityIcons
                        name="check-circle"
                        size={14}
                        color={theme.colors.success}
                      />
                      <Text style={styles.statusText}>Already checked in</Text>
                    </View>
                  )}
                </View>
              </View>
              <Checkbox
                status={selectedStudents.includes(student.id) ? 'checked' : 'unchecked'}
                onPress={() => toggleStudent(student.id)}
              />
            </Card.Content>
          </Card>
        ))}

        {filteredStudents.length === 0 && (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons
              name="account-search"
              size={64}
              color={theme.colors.textSecondary}
            />
            <Text style={styles.emptyText}>No students found</Text>
          </View>
        )}
      </ScrollView>

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
          icon={attendanceType === 'check_in' ? 'login' : 'logout'}
          contentStyle={styles.submitButtonContent}
          style={styles.submitButton}
        >
          Mark {selectedStudents.length} Student(s) as {attendanceType === 'check_in' ? 'Checked In' : 'Checked Out'}
        </Button>
      </View>
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
  typeSelector: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme.colors.background,
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
  listContainer: {
    flex: 1,
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
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  statusText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.success,
    marginLeft: 4,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.spacing.xl * 2,
  },
  emptyText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.md,
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
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  submitButtonContent: {
    height: 50,
  },
});

export default ManualAttendanceScreen;