import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Searchbar, FAB, Chip } from 'react-native-paper';
import GuardianCard from '../../components/schooladmin/GuardianCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS } from '../../utils/constants';
import * as schoolAdminService from '../../services/schoolAdminService';

const ManageGuardiansScreen = ({ navigation }) => {
  const [guardians, setGuardians] = useState([]);
  const [filteredGuardians, setFilteredGuardians] = useState([]);
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

  const fetchGuardians = async (page = 1, resetData = false) => {
    try {
      setError('');
      
      const response = await schoolAdminService.getGuardians({
        page: page,
        page_size: pagination.page_size,
        search: searchQuery || null,
        is_primary: selectedFilter === 'all' ? null : selectedFilter === 'primary',
      });
      
      if (response.success) {
        const newGuardians = response.data.results || [];
        
        if (resetData || page === 1) {
          setGuardians(newGuardians);
          setFilteredGuardians(newGuardians);
        } else {
          setGuardians(prev => [...prev, ...newGuardians]);
          setFilteredGuardians(prev => [...prev, ...newGuardians]);
        }
        
        setPagination({
          page: page,
          page_size: pagination.page_size,
          total: response.data.count || 0,
        });
      } else {
        setError(response.message || 'Failed to load guardians');
      }
    } catch (err) {
      setError('Failed to load guardians. Please try again.');
      console.error('Fetch guardians error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchGuardians(1, true);
  }, [selectedFilter]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchGuardians(1, true);
  }, [selectedFilter, searchQuery]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const executeSearch = () => {
    setIsLoading(true);
    fetchGuardians(1, true);
  };

  const handleLoadMore = () => {
    if (!isLoading && guardians.length < pagination.total) {
      fetchGuardians(pagination.page + 1, false);
    }
  };

  const applyFilter = (filter) => {
    setSelectedFilter(filter);
  };

  const handleGuardianPress = (guardian) => {
    const studentsText = guardian.students && guardian.students.length > 0
      ? guardian.students.map(s => `${s.first_name} ${s.last_name}`).join('\n')
      : 'No students linked';

    Alert.alert(
      `${guardian.first_name} ${guardian.last_name}`,
      `Relationship: ${guardian.relationship}\nEmail: ${guardian.email}\nPhone: ${guardian.phone}\n\nLinked Students:\n${studentsText}`,
      [
        {
          text: 'Edit',
          onPress: () => {
            Alert.alert('Edit Guardian', 'Edit functionality coming soon!');
          },
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => handleDeleteGuardian(guardian),
        },
        { text: 'Close', style: 'cancel' },
      ]
    );
  };

  const handleDeleteGuardian = (guardian) => {
    Alert.alert(
      'Delete Guardian',
      `Are you sure you want to delete ${guardian.first_name} ${guardian.last_name}?\n\nThis will remove all links to students.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const response = await schoolAdminService.deleteGuardian(guardian.id);
            if (response.success) {
              Alert.alert('Success', 'Guardian deleted successfully');
              onRefresh();
            } else {
              Alert.alert('Error', response.message || 'Failed to delete guardian');
            }
          },
        },
      ]
    );
  };

  const renderGuardian = ({ item }) => (
    <GuardianCard
      guardian={item}
      onPress={() => handleGuardianPress(item)}
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
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search guardians by name, email, or phone"
          onChangeText={handleSearch}
          onSubmitEditing={executeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => applyFilter('all')}
          style={styles.filterChip}
        >
          All ({pagination.total})
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

      {error ? <ErrorMessage message={error} onRetry={() => fetchGuardians(1, true)} /> : null}

      {filteredGuardians.length > 0 ? (
        <FlatList
          data={filteredGuardians}
          renderItem={renderGuardian}
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