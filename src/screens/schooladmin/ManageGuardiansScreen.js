import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ScrollView,
} from 'react-native';
import { Searchbar, FAB, Chip } from 'react-native-paper';
import GuardianCard from '../../components/schooladmin/GuardianCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';

const ManageGuardiansScreen = ({ navigation }) => {
  const [guardians, setGuardians] = useState([]);
  const [filteredGuardians, setFilteredGuardians] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');

  // Fetch guardians
  const fetchGuardians = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await schoolAdminService.getGuardians();
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockGuardians = [
        {
          id: 1,
          first_name: 'Jane',
          middle_name: 'Wanjiru',
          last_name: 'Mwangi',
          email: 'jane.mwangi@email.com',
          phone: '+254712345678',
          relationship: 'Mother',
          students: [
            {
              id: 1,
              first_name: 'John',
              last_name: 'Mwangi',
              admission_number: 'ADM/2020/001',
            },
          ],
          is_primary: true,
          date_registered: '2023-01-15',
        },
        {
          id: 2,
          first_name: 'Michael',
          middle_name: 'Kipchoge',
          last_name: 'Mwangi',
          email: 'michael.mwangi@email.com',
          phone: '+254723456789',
          relationship: 'Father',
          students: [
            {
              id: 1,
              first_name: 'John',
              last_name: 'Mwangi',
              admission_number: 'ADM/2020/001',
            },
          ],
          is_primary: false,
          date_registered: '2023-01-15',
        },
        {
          id: 3,
          first_name: 'Emily',
          middle_name: 'Atieno',
          last_name: 'Odhiambo',
          email: 'emily.odhiambo@email.com',
          phone: '+254734567890',
          relationship: 'Mother',
          students: [
            {
              id: 2,
              first_name: 'Sarah',
              last_name: 'Odhiambo',
              admission_number: 'ADM/2020/002',
            },
          ],
          is_primary: true,
          date_registered: '2023-02-20',
        },
        {
          id: 4,
          first_name: 'Robert',
          middle_name: 'Cheruiyot',
          last_name: 'Kibet',
          email: 'robert.kibet@email.com',
          phone: '+254745678901',
          relationship: 'Father',
          students: [
            {
              id: 3,
              first_name: 'David',
              last_name: 'Kibet',
              admission_number: 'ADM/2021/003',
            },
          ],
          is_primary: true,
          date_registered: '2023-03-10',
        },
      ];
      
      setGuardians(mockGuardians);
      applyFilter(selectedFilter, mockGuardians);
    } catch (err) {
      setError('Failed to load guardians. Please try again.');
      console.error('Fetch guardians error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchGuardians();
  }, []);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    
    if (query.trim() === '') {
      applyFilter(selectedFilter);
      return;
    }
    
    const filtered = guardians.filter((guardian) => {
      const fullName = `${guardian.first_name} ${guardian.middle_name} ${guardian.last_name}`.toLowerCase();
      const email = guardian.email.toLowerCase();
      const phone = guardian.phone.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return (
        fullName.includes(searchLower) ||
        email.includes(searchLower) ||
        phone.includes(searchLower)
      );
    });
    
    setFilteredGuardians(filtered);
  };

  // Filter functionality
  const applyFilter = (filter, guardiansList = guardians) => {
    setSelectedFilter(filter);
    
    let filtered = guardiansList;
    
    if (filter === 'primary') {
      filtered = guardiansList.filter(g => g.is_primary);
    } else if (filter === 'secondary') {
      filtered = guardiansList.filter(g => !g.is_primary);
    }
    
    // Apply search if active
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((guardian) => {
        const fullName = `${guardian.first_name} ${guardian.middle_name} ${guardian.last_name}`.toLowerCase();
        const email = guardian.email.toLowerCase();
        const phone = guardian.phone.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        return (
          fullName.includes(searchLower) ||
          email.includes(searchLower) ||
          phone.includes(searchLower)
        );
      });
    }
    
    setFilteredGuardians(filtered);
  };

  const handleGuardianPress = (guardian) => {
    // Navigate to guardian detail screen
    console.log('Guardian pressed:', guardian);
  };

  const renderGuardian = ({ item }) => (
    <GuardianCard
      guardian={item}
      onPress={() => handleGuardianPress(item)}
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
          placeholder="Search guardians by name, email, or phone"
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
          All ({guardians.length})
        </Chip>
        <Chip
          selected={selectedFilter === 'primary'}
          onPress={() => applyFilter('primary')}
          style={styles.filterChip}
        >
          Primary
        </Chip>
        <Chip
          selected={selectedFilter === 'secondary'}
          onPress={() => applyFilter('secondary')}
          style={styles.filterChip}
        >
          Secondary
        </Chip>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchGuardians} /> : null}

      {/* Guardians List */}
      {filteredGuardians.length > 0 ? (
        <FlatList
          data={filteredGuardians}
          renderItem={renderGuardian}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
          }
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <EmptyState
          icon="account-supervisor"
          title="No Guardians Found"
          message={
            searchQuery
              ? 'No guardians match your search'
              : selectedFilter === 'all'
              ? 'Guardians will appear here once students are linked'
              : `No ${selectedFilter} guardians`
          }
        />
      )}

      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="account-plus"
        onPress={() => navigation.navigate(SCREENS.ADD_GUARDIAN)}
        label="Add Guardian"
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

export default ManageGuardiansScreen;