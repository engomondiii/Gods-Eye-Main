import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Searchbar, FAB, Chip } from 'react-native-paper';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS, KENYA_GRADES } from '../../utils/constants';
import { mockStudents } from '../../utils/mockData';

const ManageStudentsScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch students
  const fetchStudents = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await schoolAdminService.getStudents();
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStudents(mockStudents);
      applyFilter(selectedFilter, mockStudents);
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

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      applyFilter(selectedFilter);
      return;
    }
    
    const filtered = students.filter((student) => {
      const fullName = `${student.first_name} ${student.middle_name} ${student.last_name}`.toLowerCase();
      const admissionNumber = student.admission_number.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        admissionNumber.includes(searchLower)
      );
    });
    
    setFilteredStudents(filtered);
  };

  // Filter functionality
  const applyFilter = (filter, studentsList = students) => {
    setSelectedFilter(filter);
    
    let filtered = studentsList;
    
    if (filter !== 'all') {
      filtered = studentsList.filter(s => s.current_grade === filter);
    }
    
    // Apply search if active
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((student) => {
        const fullName = `${student.first_name} ${student.middle_name} ${student.last_name}`.toLowerCase();
        const admissionNumber = student.admission_number.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          admissionNumber.includes(searchLower)
        );
      });
    }
    
    setFilteredStudents(filtered);
  };

  const handleStudentPress = (student) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, {
      studentId: student.id,
    });
  };

  const renderStudent = ({ item }) => (
    <StudentCard
      student={item}
      onPress={() => handleStudentPress(item)}
    />
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search students by name or admission number"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <Chip
            selected={selectedFilter === 'all'}
            onPress={() => applyFilter('all')}
            style={styles.filterChip}
          >
            All ({students.length})
          </Chip>
          <Chip
            selected={selectedFilter === KENYA_GRADES.GRADE_3}
            onPress={() => applyFilter(KENYA_GRADES.GRADE_3)}
            style={styles.filterChip}
          >
            Grade 3
          </Chip>
          <Chip
            selected={selectedFilter === KENYA_GRADES.GRADE_4}
            onPress={() => applyFilter(KENYA_GRADES.GRADE_4)}
            style={styles.filterChip}
          >
            Grade 4
          </Chip>
          <Chip
            selected={selectedFilter === KENYA_GRADES.GRADE_5}
            onPress={() => applyFilter(KENYA_GRADES.GRADE_5)}
            style={styles.filterChip}
          >
            Grade 5
          </Chip>
          <Chip
            selected={selectedFilter === KENYA_GRADES.GRADE_6}
            onPress={() => applyFilter(KENYA_GRADES.GRADE_6)}
            style={styles.filterChip}
          >
            Grade 6
          </Chip>
        </ScrollView>
      </View>

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
          icon="account-school"
          title="No Students Found"
          message={
            searchQuery
              ? 'No students match your search'
              : selectedFilter === 'all'
              ? 'Start by adding your first student'
              : `No students in ${selectedFilter}`
          }
        />
      )}

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="account-plus"
        onPress={() => navigation.navigate(SCREENS.ADD_STUDENT)}
        label="Add Student"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    elevation: 2,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: '#F5F5F5',
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  filterChip: {
    marginRight: 8,
  },
  listContent: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#6200EE',
  },
});

export default ManageStudentsScreen;