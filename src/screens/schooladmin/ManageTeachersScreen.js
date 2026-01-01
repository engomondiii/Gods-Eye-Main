// ========================================
// MANAGE TEACHERS SCREEN - FULLY INTEGRATED
// Backend: GET /api/teachers/
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Searchbar, FAB, Chip } from 'react-native-paper';
import TeacherCard from '../../components/schooladmin/TeacherCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';
import * as schoolAdminService from '../../services/schoolAdminService';

const ManageTeachersScreen = ({ navigation }) => {
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
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

  // Fetch teachers from API
  const fetchTeachers = async (page = 1, resetData = false) => {
    try {
      setError('');
      
      const response = await schoolAdminService.getTeachers({
        page: page,
        page_size: pagination.page_size,
        search: searchQuery || null,
        is_active: selectedFilter === 'all' ? null : selectedFilter === 'active',
      });
      
      if (response.success) {
        const newTeachers = response.data.results || [];
        
        if (resetData || page === 1) {
          setTeachers(newTeachers);
          setFilteredTeachers(newTeachers);
        } else {
          setTeachers(prev => [...prev, ...newTeachers]);
          setFilteredTeachers(prev => [...prev, ...newTeachers]);
        }
        
        setPagination({
          page: page,
          page_size: pagination.page_size,
          total: response.data.count || 0,
        });
      } else {
        setError(response.message || 'Failed to load teachers');
      }
    } catch (err) {
      setError('Failed to load teachers. Please try again.');
      console.error('Fetch teachers error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchTeachers(1, true);
  }, [selectedFilter]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchTeachers(1, true);
  }, [selectedFilter, searchQuery]);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  // Execute search
  const executeSearch = () => {
    setIsLoading(true);
    fetchTeachers(1, true);
  };

  // Load more data
  const handleLoadMore = () => {
    if (!isLoading && teachers.length < pagination.total) {
      fetchTeachers(pagination.page + 1, false);
    }
  };

  // Filter functionality
  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handleTeacherPress = (teacher) => {
    // Navigate to teacher detail screen
    Alert.alert(
      teacher.first_name + ' ' + teacher.last_name,
      `Employee: ${teacher.employee_number}\nSubject: ${teacher.subject_specialization}\n\nEmail: ${teacher.email}\nPhone: ${teacher.phone}`,
      [
        {
          text: 'Edit',
          onPress: () => {
            Alert.alert('Edit Teacher', 'Edit functionality coming soon!');
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteTeacher(teacher),
        },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const handleDeleteTeacher = (teacher) => {
    Alert.alert(
      'Delete Teacher',
      `Are you sure you want to delete ${teacher.first_name} ${teacher.last_name}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await schoolAdminService.deleteTeacher(teacher.id);
            if (response.success) {
              Alert.alert('Success', 'Teacher deleted successfully');
              onRefresh();
            } else {
              Alert.alert('Error', response.message || 'Failed to delete teacher');
            }
          },
        },
      ]
    );
  };

  const renderTeacher = ({ item }) => (
    <TeacherCard
      teacher={item}
      onPress={() => handleTeacherPress(item)}
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
          placeholder="Search teachers by name, email, or ID"
          onChangeText={handleSearch}
          onSubmitEditing={executeSearch}
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
          All ({pagination.total})
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
      {error ? <ErrorMessage message={error} onRetry={() => fetchTeachers(1, true)} /> : null}

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
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={renderFooter}
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