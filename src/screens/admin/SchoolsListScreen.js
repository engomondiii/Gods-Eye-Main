import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Searchbar, Chip, FAB } from 'react-native-paper';
import SchoolCard from '../../components/admin/SchoolCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';

const SchoolsListScreen = ({ navigation }) => {
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('pending');

  // Fetch schools
  const fetchSchools = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await schoolService.getAllSchools();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSchools = [
        {
          id: 1,
          name: 'Nairobi Primary School',
          country: { name: 'Kenya' },
          county: { name: 'Nairobi' },
          address: '123 Education Road, Nairobi',
          approved: false,
          created_at: '2025-10-25T10:00:00Z',
          total_students: 0,
          total_teachers: 0,
        },
        {
          id: 2,
          name: 'Mombasa High School',
          country: { name: 'Kenya' },
          county: { name: 'Mombasa' },
          address: '456 Learning Street, Mombasa',
          approved: false,
          created_at: '2025-10-24T14:30:00Z',
          total_students: 0,
          total_teachers: 0,
        },
        {
          id: 3,
          name: 'Kisumu Secondary School',
          country: { name: 'Kenya' },
          county: { name: 'Kisumu' },
          address: '789 Knowledge Avenue, Kisumu',
          approved: true,
          created_at: '2025-10-20T09:00:00Z',
          approval_date: '2025-10-21T10:30:00Z',
          total_students: 450,
          total_teachers: 25,
        },
      ];
      
      setSchools(mockSchools);
      applyFilter(selectedFilter, mockSchools);
    } catch (err) {
      setError('Failed to load schools. Please try again.');
      console.error('Fetch schools error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchSchools();
  }, []);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      applyFilter(selectedFilter);
      return;
    }
    
    const filtered = schools.filter((school) => {
      const schoolName = school.name.toLowerCase();
      const countyName = school.county.name.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return schoolName.includes(searchLower) || countyName.includes(searchLower);
    });
    
    setFilteredSchools(filtered);
  };

  // Filter functionality
  const applyFilter = (filter, schoolsList = schools) => {
    setSelectedFilter(filter);
    
    let filtered = schoolsList;
    
    if (filter === 'pending') {
      filtered = schoolsList.filter(s => !s.approved);
    } else if (filter === 'approved') {
      filtered = schoolsList.filter(s => s.approved);
    }
    
    // Apply search if active
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((school) => {
        const schoolName = school.name.toLowerCase();
        const countyName = school.county.name.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        return schoolName.includes(searchLower) || countyName.includes(searchLower);
      });
    }
    
    setFilteredSchools(filtered);
  };

  const handleApprove = async (schoolId) => {
    Alert.alert(
      'Approve School',
      'Are you sure you want to approve this school registration?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Approve',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await schoolService.approveSchool(schoolId);
              
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert('Success', 'School approved successfully!');
              fetchSchools();
            } catch (error) {
              Alert.alert('Error', 'Failed to approve school. Please try again.');
              console.error('Approve error:', error);
            }
          },
        },
      ]
    );
  };

  const handleReject = async (schoolId) => {
    Alert.alert(
      'Reject School',
      'Are you sure you want to reject this school registration? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reject',
          style: 'destructive',
          onPress: async () => {
            try {
              // TODO: Replace with actual API call
              // await schoolService.rejectSchool(schoolId);
              
              // Mock API call
              await new Promise(resolve => setTimeout(resolve, 1000));
              
              Alert.alert('Rejected', 'School registration has been rejected.');
              fetchSchools();
            } catch (error) {
              Alert.alert('Error', 'Failed to reject school. Please try again.');
              console.error('Reject error:', error);
            }
          },
        },
      ]
    );
  };

  const handleViewDetails = (school) => {
    navigation.navigate(SCREENS.SCHOOL_DETAIL, { schoolId: school.id });
  };

  const renderSchool = ({ item }) => (
    <SchoolCard
      school={item}
      onApprove={() => handleApprove(item.id)}
      onReject={() => handleReject(item.id)}
      onViewDetails={() => handleViewDetails(item)}
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
          placeholder="Search by school name or county"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Filter Chips */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'pending'}
          onPress={() => applyFilter('pending')}
          style={styles.filterChip}
        >
          Pending Approval
        </Chip>
        <Chip
          selected={selectedFilter === 'approved'}
          onPress={() => applyFilter('approved')}
          style={styles.filterChip}
        >
          Approved
        </Chip>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => applyFilter('all')}
          style={styles.filterChip}
        >
          All Schools
        </Chip>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchSchools} /> : null}

      {/* Schools List */}
      {filteredSchools.length > 0 ? (
        <FlatList
          data={filteredSchools}
          renderItem={renderSchool}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="school-outline"
          title="No Schools Found"
          message={
            searchQuery
              ? 'No schools match your search criteria'
              : selectedFilter === 'pending'
              ? 'No schools pending approval'
              : 'No schools in the system yet'
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

export default SchoolsListScreen;