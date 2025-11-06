import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Searchbar, FAB, Chip, Menu, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS, KENYA_EDUCATION_LEVELS } from '../../utils/constants';
import theme from '../../styles/theme';

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  
  // Menu visibility
  const [gradeMenuVisible, setGradeMenuVisible] = useState(false);
  const [streamMenuVisible, setStreamMenuVisible] = useState(false);
  const [houseMenuVisible, setHouseMenuVisible] = useState(false);

  // Get unique streams and houses from students
  const [availableStreams, setAvailableStreams] = useState([]);
  const [availableHouses, setAvailableHouses] = useState([]);

  // Fetch students
  const fetchStudents = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await studentService.getStudents();
      
      // Mock data for development with Kenya-specific fields
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents = [
        {
          id: 1,
          first_name: 'John',
          middle_name: 'Kamau',
          last_name: 'Mwangi',
          admission_number: 'ADM/2020/001',
          school: { name: 'Nairobi Primary School' },
          education_level: 'primary',
          current_grade: 'grade_5',
          stream: 'Red',
          house_name: 'Kilimanjaro',
          house_color: 'Red',
          guardians: [
            { id: 1, first_name: 'Jane', last_name: 'Mwangi' },
            { id: 2, first_name: 'Michael', last_name: 'Mwangi' },
          ],
          attendance_percentage: 92,
        },
        {
          id: 2,
          first_name: 'Sarah',
          middle_name: 'Akinyi',
          last_name: 'Odhiambo',
          admission_number: 'ADM/2020/002',
          school: { name: 'Nairobi Primary School' },
          education_level: 'primary',
          current_grade: 'grade_5',
          stream: 'Blue',
          house_name: 'Mara',
          house_color: 'Blue',
          guardians: [
            { id: 3, first_name: 'Emily', last_name: 'Odhiambo' },
          ],
          attendance_percentage: 88,
        },
        {
          id: 3,
          first_name: 'David',
          middle_name: 'Kipchoge',
          last_name: 'Kibet',
          admission_number: 'ADM/2021/003',
          school: { name: 'Nairobi Primary School' },
          education_level: 'primary',
          current_grade: 'grade_4',
          stream: 'Red',
          house_name: 'Kilimanjaro',
          house_color: 'Red',
          guardians: [
            { id: 4, first_name: 'Robert', last_name: 'Kibet' },
            { id: 5, first_name: 'Linda', last_name: 'Kibet' },
          ],
          attendance_percentage: 95,
        },
        {
          id: 4,
          first_name: 'Grace',
          middle_name: 'Wanjiru',
          last_name: 'Njoroge',
          admission_number: 'ADM/2021/004',
          school: { name: 'Nairobi Primary School' },
          education_level: 'junior_secondary',
          current_grade: 'grade_7',
          stream: 'East',
          house_name: 'Tsavo',
          house_color: 'Green',
          guardians: [],
          attendance_percentage: 90,
        },
        {
          id: 5,
          first_name: 'James',
          middle_name: 'Otieno',
          last_name: 'Ouma',
          admission_number: 'ADM/2019/005',
          school: { name: 'Nairobi Primary School' },
          education_level: 'primary',
          current_grade: 'grade_6',
          stream: 'Blue',
          house_name: 'Mara',
          house_color: 'Blue',
          guardians: [
            { id: 6, first_name: 'Mary', last_name: 'Ouma' },
          ],
          attendance_percentage: 85,
        },
      ];
      
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
      
      // Extract unique streams and houses
      const streams = [...new Set(mockStudents.map(s => s.stream))].filter(Boolean);
      const houses = [...new Set(mockStudents.map(s => s.house_name))].filter(Boolean);
      setAvailableStreams(streams);
      setAvailableHouses(houses);
      
    } catch (err) {
      setError('Failed to load students. Please try again.');
      console.error('Fetch students error:', err);
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

  // Apply all filters
  const applyFilters = useCallback(() => {
    let filtered = [...students];

    // Search filter
    if (searchQuery.trim() !== '') {
      const searchLower = searchQuery.toLowerCase();
      filtered = filtered.filter((student) => {
        const fullName = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.toLowerCase();
        const admissionNumber = student.admission_number.toLowerCase();
        return fullName.includes(searchLower) || admissionNumber.includes(searchLower);
      });
    }

    // Guardian filter
    if (selectedFilter === 'with_guardians') {
      filtered = filtered.filter(s => s.guardians.length > 0);
    } else if (selectedFilter === 'without_guardians') {
      filtered = filtered.filter(s => s.guardians.length === 0);
    }

    // Grade filter
    if (selectedGrade) {
      filtered = filtered.filter(s => s.current_grade === selectedGrade);
    }

    // Stream filter
    if (selectedStream) {
      filtered = filtered.filter(s => s.stream === selectedStream);
    }

    // House filter
    if (selectedHouse) {
      filtered = filtered.filter(s => s.house_name === selectedHouse);
    }

    setFilteredStudents(filtered);
  }, [students, searchQuery, selectedFilter, selectedGrade, selectedStream, selectedHouse]);

  // Apply filters whenever dependencies change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilter('all');
    setSelectedGrade(null);
    setSelectedStream(null);
    setSelectedHouse(null);
    setSearchQuery('');
  };

  const handleStudentPress = (student) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: student.id });
  };

  const renderStudent = ({ item }) => (
    <StudentCard student={item} onPress={() => handleStudentPress(item)} />
  );

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

  // Get unique grades from current students
  const availableGrades = [...new Set(students.map(s => s.current_grade))].filter(Boolean);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const activeFiltersCount = 
    (selectedFilter !== 'all' ? 1 : 0) + 
    (selectedGrade ? 1 : 0) + 
    (selectedStream ? 1 : 0) + 
    (selectedHouse ? 1 : 0);

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name or admission number"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filter Chips - Row 1: Guardian & Grade */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => setSelectedFilter('all')}
          style={styles.filterChip}
          icon="account-group"
        >
          All ({students.length})
        </Chip>
        <Chip
          selected={selectedFilter === 'with_guardians'}
          onPress={() => setSelectedFilter('with_guardians')}
          style={styles.filterChip}
          icon="account-check"
        >
          With Guardians
        </Chip>
        <Chip
          selected={selectedFilter === 'without_guardians'}
          onPress={() => setSelectedFilter('without_guardians')}
          style={styles.filterChip}
          icon="account-alert"
        >
          No Guardians
        </Chip>
      </View>

      {/* Filter Chips - Row 2: Kenya-specific filters */}
      <View style={styles.filterContainer}>
        {/* Grade Filter */}
        <Menu
          visible={gradeMenuVisible}
          onDismiss={() => setGradeMenuVisible(false)}
          anchor={
            <Chip
              selected={!!selectedGrade}
              onPress={() => setGradeMenuVisible(true)}
              style={styles.filterChip}
              icon="book-open-variant"
              onClose={selectedGrade ? () => setSelectedGrade(null) : undefined}
            >
              {selectedGrade ? getGradeLabel(selectedGrade) : 'Grade'}
            </Chip>
          }
        >
          {availableGrades.map((grade) => (
            <Menu.Item
              key={grade}
              onPress={() => {
                setSelectedGrade(grade);
                setGradeMenuVisible(false);
              }}
              title={getGradeLabel(grade)}
            />
          ))}
        </Menu>

        {/* Stream Filter */}
        <Menu
          visible={streamMenuVisible}
          onDismiss={() => setStreamMenuVisible(false)}
          anchor={
            <Chip
              selected={!!selectedStream}
              onPress={() => setStreamMenuVisible(true)}
              style={styles.filterChip}
              icon="format-list-bulleted"
              onClose={selectedStream ? () => setSelectedStream(null) : undefined}
            >
              {selectedStream ? selectedStream : 'Stream'}
            </Chip>
          }
        >
          {availableStreams.map((stream) => (
            <Menu.Item
              key={stream}
              onPress={() => {
                setSelectedStream(stream);
                setStreamMenuVisible(false);
              }}
              title={stream}
            />
          ))}
        </Menu>

        {/* House Filter */}
        <Menu
          visible={houseMenuVisible}
          onDismiss={() => setHouseMenuVisible(false)}
          anchor={
            <Chip
              selected={!!selectedHouse}
              onPress={() => setHouseMenuVisible(true)}
              style={styles.filterChip}
              icon="home-group"
              onClose={selectedHouse ? () => setSelectedHouse(null) : undefined}
            >
              {selectedHouse ? selectedHouse : 'House'}
            </Chip>
          }
        >
          {availableHouses.map((house) => (
            <Menu.Item
              key={house}
              onPress={() => {
                setSelectedHouse(house);
                setHouseMenuVisible(false);
              }}
              title={house}
            />
          ))}
        </Menu>
      </View>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <View style={styles.clearFiltersContainer}>
          <Button
            mode="text"
            onPress={clearAllFilters}
            icon="filter-remove"
            compact
          >
            Clear {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''}
          </Button>
        </View>
      )}

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchStudents} /> : null}

      {/* Students List */}
      {filteredStudents.length > 0 ? (
        <FlatList
          data={filteredStudents}
          renderItem={renderStudent}
          keyExtractor={(item) => item.id.toString()}
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
            searchQuery || activeFiltersCount > 0
              ? 'No students match your search or filter criteria'
              : 'Start by adding your first student'
          }
          action={activeFiltersCount > 0 ? clearAllFilters : undefined}
          actionLabel={activeFiltersCount > 0 ? 'Clear Filters' : undefined}
        />
      )}

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={() => navigation.navigate(SCREENS.CREATE_STUDENT)}
        label="Add Student"
      />
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
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  filterChip: {
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  clearFiltersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    alignItems: 'flex-start',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
});

export default StudentListScreen;