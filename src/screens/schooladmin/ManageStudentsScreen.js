// ========================================
// MANAGE STUDENTS SCREEN - FULLY INTEGRATED
// Backend: GET /api/students/
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
  Alert,
} from 'react-native';
import { Searchbar, FAB, Chip } from 'react-native-paper';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS, KENYA_GRADES } from '../../utils/constants';
import * as schoolAdminService from '../../services/schoolAdminService';

const ManageStudentsScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [pagination, setPagination] = useState({
    page: 1,
    page_size: 20,
    total: 0,
  });

  // Fetch students from API
  const fetchStudents = async (page = 1, resetData = false) => {
    try {
      setError('');
      
      const response = await schoolAdminService.getStudents({
        page: page,
        page_size: pagination.page_size,
        search: searchQuery || null,
        grade: selectedFilter === 'all' ? null : selectedFilter,
        is_active: true,
      });
      
      if (response.success) {
        const newStudents = response.data.results || [];
        
        if (resetData || page === 1) {
          setStudents(newStudents);
          setFilteredStudents(newStudents);
        } else {
          setStudents(prev => [...prev, ...newStudents]);
          setFilteredStudents(prev => [...prev, ...newStudents]);
        }
        
        setPagination({
          page: page,
          page_size: pagination.page_size,
          total: response.data.count || 0,
        });
      } else {
        setError(response.message || 'Failed to load students');
      }
    } catch (err) {
      setError('Failed to load students. Please try again.');
      console.error('Fetch students error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStudents(1, true);
  }, [selectedFilter]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchStudents(1, true);
  }, [selectedFilter, searchQuery]);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Execute search
  const executeSearch = () => {
    setIsLoading(true);
    fetchStudents(1, true);
  };

  // Load more data
  const handleLoadMore = () => {
    if (!isLoading && students.length < pagination.total) {
      fetchStudents(pagination.page + 1, false);
    }
  };

  // Filter functionality
  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handleStudentPress = (student) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, {
      studentId: student.id,
    });
  };

  const handleDeleteStudent = (student) => {
    Alert.alert(
      'Delete Student',
      `Are you sure you want to delete ${student.first_name} ${student.last_name}?\n\nThis action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await schoolAdminService.deleteStudent(student.id);
            if (response.success) {
              Alert.alert('Success', 'Student deleted successfully');
              onRefresh();
            } else {
              Alert.alert('Error', response.message || 'Failed to delete student');
            }
          },
        },
      ]
    );
  };

  const renderStudent = ({ item }) => (
    <StudentCard
      student={item}
      onPress={() => handleStudentPress(item)}
      onLongPress={() => handleDeleteStudent(item)}
    />
  );

  const renderFooter = () => {
    if (!isLoading || pagination.page === 1) return null;
    return <LoadingSpinner />;
  };

  if (isLoading && pagination.page === 1) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search students by name or admission number"
          onChangeText={handleSearch}
          onSubmitEditing={executeSearch}
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
            All ({pagination.total})
          </Chip>
          <Chip
            selected={selectedFilter === KENYA_GRADES.GRADE_1}
            onPress={() => applyFilter(KENYA_GRADES.GRADE_1)}
            style={styles.filterChip}
          >
            Grade 1
          </Chip>
          <Chip
            selected={selectedFilter === KENYA_GRADES.GRADE_2}
            onPress={() => applyFilter(KENYA_GRADES.GRADE_2)}
            style={styles.filterChip}
          >
            Grade 2
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
      {error ? <ErrorMessage message={error} onRetry={() => fetchStudents(1, true)} /> : null}

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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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