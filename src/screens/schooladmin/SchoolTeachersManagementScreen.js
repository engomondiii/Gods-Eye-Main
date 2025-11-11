import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
  Text,
} from 'react-native';
import { Searchbar, FAB, Chip, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import UserCard from '../../components/admin/UserCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import theme from '../../styles/theme';

const SchoolTeachersManagementScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [teachers, setTeachers] = useState([]);
  const [filteredTeachers, setFilteredTeachers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch teachers for this school only
  const fetchTeachers = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await schoolAdminService.getSchoolTeachers(user.school.id);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockTeachers = [
        {
          id: 1,
          username: 'teacher1',
          email: 'teacher1@nairobiprimary.ac.ke',
          first_name: 'Mary',
          middle_name: 'Wanjiru',
          last_name: 'Ochieng',
          phone: '+254712345678',
          role: 'teacher',
          school: user.school,
          total_students: 45,
          is_active: true,
          created_at: '2024-01-15T10:00:00Z',
        },
        {
          id: 2,
          username: 'teacher2',
          email: 'teacher2@nairobiprimary.ac.ke',
          first_name: 'James',
          middle_name: 'Otieno',
          last_name: 'Ouma',
          phone: '+254723456789',
          role: 'teacher',
          school: user.school,
          total_students: 38,
          is_active: true,
          created_at: '2024-02-20T14:30:00Z',
        },
        {
          id: 3,
          username: 'teacher3',
          email: 'teacher3@nairobiprimary.ac.ke',
          first_name: 'Grace',
          middle_name: 'Nyambura',
          last_name: 'Kariuki',
          phone: '+254734567890',
          role: 'teacher',
          school: user.school,
          total_students: 42,
          is_active: false,
          created_at: '2023-09-10T09:00:00Z',
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
      const fullName = `${teacher.first_name} ${teacher.middle_name || ''} ${teacher.last_name}`.toLowerCase();
      const username = teacher.username.toLowerCase();
      const email = teacher.email.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        username.includes(searchLower) ||
        email.includes(searchLower)
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
        const fullName = `${teacher.first_name} ${teacher.middle_name || ''} ${teacher.last_name}`.toLowerCase();
        const username = teacher.username.toLowerCase();
        const email = teacher.email.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          username.includes(searchLower) ||
          email.includes(searchLower)
        );
      });
    }
    
    setFilteredTeachers(filtered);
  };

  const handleAddTeacher = () => {
    // TODO: Navigate to add teacher screen
    Alert.alert('Add Teacher', 'Add teacher functionality coming soon!');
  };

  const handleTeacherPress = (teacher) => {
    // TODO: Navigate to teacher detail screen
    Alert.alert(
      'Teacher Details',
      `Name: ${teacher.first_name} ${teacher.middle_name || ''} ${teacher.last_name}\nEmail: ${teacher.email}\nPhone: ${teacher.phone}\nStudents: ${teacher.total_students}\nStatus: ${teacher.is_active ? 'Active' : 'Inactive'}`
    );
  };

  const renderTeacher = ({ item }) => (
    <UserCard user={item} onPress={() => handleTeacherPress(item)} />
  );

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name, username, or email"
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
          All Teachers ({teachers.length})
        </Chip>
        <Chip
          selected={selectedFilter === 'active'}
          onPress={() => applyFilter('active')}
          style={styles.filterChip}
          icon="check-circle"
        >
          Active
        </Chip>
        <Chip
          selected={selectedFilter === 'inactive'}
          onPress={() => applyFilter('inactive')}
          style={styles.filterChip}
          icon="close-circle"
        >
          Inactive
        </Chip>
      </View>

      {/* School Info Banner */}
      <View style={styles.schoolBanner}>
        <MaterialCommunityIcons name="school" size={20} color="#FF9800" />
        <Text style={styles.schoolBannerText}>
          {user?.school?.name || 'Your School'}
        </Text>
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
          icon="account-search"
          title="No Teachers Found"
          message={
            searchQuery
              ? 'No teachers match your search criteria'
              : selectedFilter === 'active'
              ? 'No active teachers'
              : selectedFilter === 'inactive'
              ? 'No inactive teachers'
              : 'No teachers in your school yet'
          }
          action={handleAddTeacher}
          actionLabel="Add Teacher"
        />
      )}

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        onPress={handleAddTeacher}
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
  schoolBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  schoolBannerText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
    marginLeft: 8,
  },
  listContent: {
    padding: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#FF9800',
  },
});

export default SchoolTeachersManagementScreen;