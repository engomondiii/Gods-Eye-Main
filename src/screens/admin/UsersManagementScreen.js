import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
} from 'react-native';
import { Searchbar, Chip } from 'react-native-paper';
import UserCard from '../../components/admin/UserCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { USER_ROLES } from '../../utils/constants';

const UsersManagementScreen = ({ navigation }) => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch users
  const fetchUsers = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await adminService.getAllUsers();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockUsers = [
        {
          id: 1,
          username: 'teacher1',
          email: 'teacher1@school.com',
          first_name: 'John',
          last_name: 'Kamau',
          phone: '+254712345678',
          role: USER_ROLES.TEACHER,
          school: { name: 'Nairobi Primary School' },
          is_active: true,
          created_at: '2025-10-20T10:00:00Z',
        },
        {
          id: 2,
          username: 'guardian1',
          email: 'guardian1@email.com',
          first_name: 'Jane',
          last_name: 'Doe',
          phone: '+254723456789',
          role: USER_ROLES.GUARDIAN,
          total_students: 2,
          is_active: true,
          created_at: '2025-10-22T14:30:00Z',
        },
        {
          id: 3,
          username: 'teacher2',
          email: 'teacher2@school.com',
          first_name: 'Mary',
          last_name: 'Wanjiku',
          phone: '+254734567890',
          role: USER_ROLES.TEACHER,
          school: { name: 'Mombasa High School' },
          is_active: false,
          created_at: '2025-10-18T09:00:00Z',
        },
      ];
      
      setUsers(mockUsers);
      applyFilter(selectedFilter, mockUsers);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error('Fetch users error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchUsers();
  }, []);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      applyFilter(selectedFilter);
      return;
    }
    
    const filtered = users.filter((user) => {
      const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
      const username = user.username.toLowerCase();
      const email = user.email.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        username.includes(searchLower) ||
        email.includes(searchLower)
      );
    });
    
    setFilteredUsers(filtered);
  };

  // Filter functionality
  const applyFilter = (filter, usersList = users) => {
    setSelectedFilter(filter);
    
    let filtered = usersList;
    
    if (filter !== 'all') {
      filtered = usersList.filter(u => u.role === filter);
    }
    
    // Apply search if active
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((user) => {
        const fullName = `${user.first_name} ${user.last_name}`.toLowerCase();
        const username = user.username.toLowerCase();
        const email = user.email.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          username.includes(searchLower) ||
          email.includes(searchLower)
        );
      });
    }
    
    setFilteredUsers(filtered);
  };

  const renderUser = ({ item }) => <UserCard user={item} />;

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
          All Users
        </Chip>
        <Chip
          selected={selectedFilter === USER_ROLES.TEACHER}
          onPress={() => applyFilter(USER_ROLES.TEACHER)}
          style={styles.filterChip}
        >
          Teachers
        </Chip>
        <Chip
          selected={selectedFilter === USER_ROLES.GUARDIAN}
          onPress={() => applyFilter(USER_ROLES.GUARDIAN)}
          style={styles.filterChip}
        >
          Guardians
        </Chip>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchUsers} /> : null}

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <FlatList
          data={filteredUsers}
          renderItem={renderUser}
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
          title="No Users Found"
          message={
            searchQuery
              ? 'No users match your search criteria'
              : 'No users in the system yet'
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
});

export default UsersManagementScreen;