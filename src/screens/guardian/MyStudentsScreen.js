// ========================================
// GOD'S EYE EDTECH - MY STUDENTS SCREEN (GUARDIAN)
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Searchbar, Card, Title, Text, Chip, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS, KENYA_GRADE_LABELS } from '../../utils/constants';
import * as guardianService from '../../services/guardianService';
import theme from '../../styles/theme';

const MyStudentsScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch guardian's students
  const fetchStudents = async () => {
    try {
      setError('');

      const response = await guardianService.getMyStudents();

      if (response.success) {
        // Data might be wrapped in guardian_links or directly as students
        const studentData = response.data.students || response.data || [];
        setStudents(studentData);
        setFilteredStudents(studentData);
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
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchStudents();
  }, []);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter((item) => {
      // Handle both direct student objects and wrapped objects
      const student = item.student || item;
      
      const fullName = `${student.first_name || ''} ${student.middle_name || ''} ${student.last_name || ''}`.toLowerCase();
      const admissionNumber = (student.admission_number || '').toLowerCase();
      const schoolName = (student.school_name || student.school?.name || '').toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        admissionNumber.includes(searchLower) ||
        schoolName.includes(searchLower)
      );
    });
    
    setFilteredStudents(filtered);
  };

  const handleStudentPress = (item) => {
    const student = item.student || item;
    navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: student.id });
  };

  // Calculate age
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 'N/A';
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  // Render student card
  const renderStudent = ({ item }) => {
    // Handle both direct student objects and wrapped objects
    const student = item.student || item;
    const relationship = item.relationship_display || item.relationship || '';
    const isPrimary = item.is_primary || false;

    return (
      <TouchableOpacity onPress={() => handleStudentPress(item)}>
        <Card style={styles.card}>
          <Card.Content style={styles.cardContent}>
            {/* Student Photo/Avatar */}
            {student.photo ? (
              <Image source={{ uri: student.photo }} style={styles.studentPhoto} />
            ) : (
              <Avatar.Text
                size={60}
                label={`${student.first_name?.[0] || ''}${student.last_name?.[0] || ''}`}
                style={styles.avatar}
              />
            )}

            {/* Student Info */}
            <View style={styles.studentInfo}>
              <View style={styles.nameRow}>
                <Text style={styles.studentName}>
                  {student.full_name || `${student.first_name} ${student.last_name}`}
                </Text>
                {isPrimary && (
                  <Chip
                    mode="flat"
                    style={styles.primaryChip}
                    textStyle={styles.primaryChipText}
                  >
                    PRIMARY
                  </Chip>
                )}
              </View>

              <Text style={styles.admissionNumber}>
                {student.admission_number}
              </Text>

              <View style={styles.detailsRow}>
                <MaterialCommunityIcons
                  name="school"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.detailText}>
                  {student.school_name || student.school?.name || 'N/A'}
                </Text>
              </View>

              <View style={styles.detailsRow}>
                <MaterialCommunityIcons
                  name="book-open-variant"
                  size={14}
                  color={theme.colors.textSecondary}
                />
                <Text style={styles.detailText}>
                  {student.grade_and_stream || 
                   `${KENYA_GRADE_LABELS[student.current_grade] || student.current_grade} ${student.stream || ''}`}
                </Text>
              </View>

              {relationship && (
                <View style={styles.detailsRow}>
                  <MaterialCommunityIcons
                    name="heart-outline"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.detailText}>
                    Relationship: {relationship}
                  </Text>
                </View>
              )}

              {student.date_of_birth && (
                <View style={styles.detailsRow}>
                  <MaterialCommunityIcons
                    name="calendar"
                    size={14}
                    color={theme.colors.textSecondary}
                  />
                  <Text style={styles.detailText}>
                    Age: {calculateAge(student.date_of_birth)} years
                  </Text>
                </View>
              )}
            </View>

            {/* Arrow Icon */}
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color={theme.colors.textSecondary}
            />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading your students..." />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name, admission number, or school"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchStudents} /> : null}

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          renderItem={renderStudent}
          keyExtractor={(item, index) => {
            const student = item.student || item;
            return student.id?.toString() || index.toString();
          }}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="account-search"
          title="No Students Found"
          message={
            searchQuery
              ? 'No students match your search criteria'
              : 'You are not linked to any students yet'
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme.colors.background,
  },
  searchInput: {
    fontSize: theme.fontSizes.md,
  },
  listContent: {
    padding: theme.spacing.md,
  },
  card: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    elevation: 2,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentPhoto: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: theme.spacing.md,
  },
  avatar: {
    marginRight: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  studentInfo: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  studentName: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    flex: 1,
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
  admissionNumber: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
});

export default MyStudentsScreen;