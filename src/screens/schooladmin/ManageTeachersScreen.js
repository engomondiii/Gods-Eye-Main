import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Searchbar, FAB, Chip } from 'react-native-paper';
import TeacherCard from '../../components/schooladmin/TeacherCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';

const ManageTeachersScreen = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch teachers
  const fetchTeachers = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await schoolAdminService.getTeachers();
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTeachers = [
        {
          id: 1,
          first_name: 'Mary',
          middle_name: 'Wanjiru',
          last_name: 'Ochieng',
          email: 'mary.ochieng@school.com',
          phone: '+254734567890',
          employee_number: 'EMP001',
          subject_specialization: 'Mathematics',
          classes_assigned: ['Grade 5 Red', 'Grade 6 Blue'],
          is_active: true,
          date_joined: '2023-01-15',
        },
        {
          id: 2,
          first_name: 'James',
          middle_name: 'Kipchoge',
          last_name: 'Kibet',
          email: 'james.kibet@school.com',
          phone: '+254745678901',
          employee_number: 'EMP002',
          subject_specialization: 'English',
          classes_assigned: ['Grade 4 Red', 'Grade 5 Blue'],
          is_active: true,
          date_joined: '2023-03-20',
        },
        {
          id: 3,
          first_name: 'Grace',
          middle_name: 'Akinyi',
          last_name: 'Odhiambo',
          email: 'grace.odhiambo@school.com',
          phone: '+254756789012',
          employee_number: 'EMP003',
          subject_specialization: 'Science',
          classes_assigned: ['Grade 6 Red'],
          is_active: false,
          date_joined: '2022-09-10',
        },
      ];
      
      setTeachers(mockTeachers);
      applyFilter(selectedFilter, mockTeachers);
    } catch (err) {
      setError('Failed to load teachers. Please try again.');
      console.error('Fetch teachers error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchTeachers();
  }, []);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      applyFilter(selectedFilter);
      return;
    }
    
    const filtered = teachers.filter((teacher) => {
      const fullName = `${teacher.first_name} ${teacher.middle_name} ${teacher.last_name}`.toLowerCase();
      const email = teacher.email.toLowerCase();
      const employeeNumber = teacher.employee_number.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        employeeNumber.includes(searchLower)
      );
    });
    
    setFilteredTeachers(filtered);
  };

  // Filter functionality
  const applyFilter = (filter, teachersList = teachers) => {
    setSelectedFilter(filter);
    
    let filtered = teachersList;
    
    if (filter === 'active') {
      filtered = teachersList.filter(t => t.is_active);
    } else if (filter === 'inactive') {
      filtered = teachersList.filter(t => !t.is_active);
    }
    
    // Apply search if active
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((teacher) => {
        const fullName = `${teacher.first_name} ${teacher.middle_name} ${teacher.last_name}`.toLowerCase();
        const email = teacher.email.toLowerCase();
        const employeeNumber = teacher.employee_number.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          email.includes(searchLower) ||
          employeeNumber.includes(searchLower)
        );
      });
    }
    
    setFilteredTeachers(filtered);
  };

  const handleTeacherPress = (teacher) => {
    // Navigate to teacher detail screen
    // navigation.navigate(SCREENS.TEACHER_DETAIL, { teacherId: teacher.id });
    console.log('Teacher pressed:', teacher);
  };

  const renderTeacher = ({ item }) => (
    <TeacherCard
      teacher={item}
      onPress={() => handleTeacherPress(item)}
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
          placeholder="Search teachers by name, email, or ID"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => applyFilter('all')}
          style={styles.filterChip}
        >
          All ({teachers.length})
        </Chip>
        <Chip
          selected={selectedFilter === 'active'}
          onPress={() => applyFilter('active')}
          style={styles.filterChip}
        >
          Active
        </Chip>
        <Chip
          selected={selectedFilter === 'inactive'}
          onPress={() => applyFilter('inactive')}
          style={styles.filterChip}
        >
          Inactive
        </Chip>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchTeachers} /> : null}

      {/* Teachers List */}
      {filteredTeachers.length > 0 ? (
        <FlatList
          data={filteredTeachers}
          renderItem={renderTeacher}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="account-tie"
          title="No Teachers Found"
          message={
            searchQuery
              ? 'No teachers match your search'
              : selectedFilter === 'all'
              ? 'Start by adding your first teacher'
              : `No ${selectedFilter} teachers`
          }
        />
      )}

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="account-plus"
        onPress={() => navigation.navigate(SCREENS.ADD_TEACHER)}
        label="Add Teacher"
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

export default ManageTeachersScreen;