import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { Searchbar } from 'react-native-paper';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';

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
      // TODO: Replace with actual API call
      // const response = await guardianService.getMyStudents();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents = [
        {
          id: 1,
          first_name: 'John',
          last_name: 'Doe',
          admission_number: 'NPS001',
          school: { name: 'Nairobi Primary School' },
          date_of_birth: '2010-05-15',
          guardians: [
            { id: 1, first_name: 'Jane', last_name: 'Doe', is_primary: true },
            { id: 2, first_name: 'Michael', last_name: 'Doe', is_primary: false },
          ],
        },
        {
          id: 2,
          first_name: 'Sarah',
          last_name: 'Smith',
          admission_number: 'NPS002',
          school: { name: 'Nairobi Primary School' },
          date_of_birth: '2012-08-22',
          guardians: [
            { id: 3, first_name: 'Emily', last_name: 'Smith', is_primary: true },
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
      const schoolName = student.school.name.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        admissionNumber.includes(searchLower) ||
        schoolName.includes(searchLower)
      );
    });
    
    setFilteredStudents(filtered);
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
          placeholder="Search by name, admission number, or school"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
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
  listContent: {
    padding: 16,
  },
});

export default MyStudentsScreen;