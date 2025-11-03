import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Searchbar, FAB, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';

const StudentListScreen = ({ navigation }) => {
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
      // const response = await studentService.getStudents();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          admission_number: 'NPS001',
          school: { name: 'Nairobi Primary School' },
          guardians: [
            { id: 1, first_name: 'Jane', last_name: 'Doe' },
            { id: 2, first_name: 'Michael', last_name: 'Doe' },
          ],
        },
        {
          id: 2,
          first_name: 'Sarah',
          last_name: 'Smith',
          admission_number: 'NPS002',
          school: { name: 'Nairobi Primary School' },
          guardians: [
            { id: 3, first_name: 'Emily', last_name: 'Smith' },
          ],
        },
        {
          id: 3,
          first_name: 'David',
          last_name: 'Johnson',
          admission_number: 'NPS003',
          school: { name: 'Nairobi Primary School' },
          guardians: [
            { id: 4, first_name: 'Robert', last_name: 'Johnson' },
            { id: 5, first_name: 'Linda', last_name: 'Johnson' },
          ],
        },
      ];
      
      setStudents(mockStudents);
      setFilteredStudents(mockStudents);
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
      setFilteredStudents(students);
      return;
    }
    
    const filtered = students.filter((student) => {
      const fullName = `${student.first_name} ${student.last_name}`.toLowerCase();
      const admissionNumber = student.admission_number.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return fullName.includes(searchLower) || admissionNumber.includes(searchLower);
    });
    
    setFilteredStudents(filtered);
  };

  // Filter functionality
  const handleFilter = (filter) => {
    setSelectedFilter(filter);
    
    if (filter === 'all') {
      setFilteredStudents(students);
    } else if (filter === 'with_guardians') {
      const filtered = students.filter(s => s.guardians.length > 0);
      setFilteredStudents(filtered);
    } else if (filter === 'without_guardians') {
      const filtered = students.filter(s => s.guardians.length === 0);
      setFilteredStudents(filtered);
    }
  };

  const handleStudentPress = (student) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: student.id });
  };

  const renderStudent = ({ item }) => (
    <StudentCard student={item} onPress={() => handleStudentPress(item)} />
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

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

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => handleFilter('all')}
          style={styles.filterChip}
        >
          All ({students.length})
        </Chip>
        <Chip
          selected={selectedFilter === 'with_guardians'}
          onPress={() => handleFilter('with_guardians')}
          style={styles.filterChip}
        >
          With Guardians
        </Chip>
        <Chip
          selected={selectedFilter === 'without_guardians'}
          onPress={() => handleFilter('without_guardians')}
          style={styles.filterChip}
        >
          No Guardians
        </Chip>
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
          icon="account-search"
          title="No Students Found"
          message={
            searchQuery
              ? 'No students match your search criteria'
              : 'Start by adding your first student'
          }
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
    flexDirection: 'row',
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

export default StudentListScreen;