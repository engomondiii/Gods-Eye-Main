// ========================================
// GOD'S EYE EDTECH - STUDENT LIST SCREEN
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { Searchbar, FAB, Chip, Menu, Button, Text } from 'react-native-paper';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS, KENYA_GRADE_LABELS } from '../../utils/constants';
import * as studentService from '../../services/studentService';
import theme from '../../styles/theme';

const StudentListScreen = ({ navigation }) => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Filter states
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedGrade, setSelectedGrade] = useState(null);
  const [selectedStream, setSelectedStream] = useState(null);
  const [selectedHouse, setSelectedHouse] = useState(null);
  
  // Menu visibility
  const [gradeMenuVisible, setGradeMenuVisible] = useState(false);
  const [streamMenuVisible, setStreamMenuVisible] = useState(false);
  const [houseMenuVisible, setHouseMenuVisible] = useState(false);

  // Get unique streams and houses from students
  const [availableStreams, setAvailableStreams] = useState([]);
  const [availableHouses, setAvailableHouses] = useState([]);
  const [availableGrades, setAvailableGrades] = useState([]);

  // Fetch students with backend integration
  const fetchStudents = async (page = 1, append = false) => {
    try {
      if (!append) {
        setError('');
        setIsLoading(true);
      } else {
        setIsLoadingMore(true);
      }

      // Build filters
      const filters = {
        page,
        page_size: 20,
        ordering: 'first_name,last_name',
      };

      // Add guardian filter
      if (selectedFilter === 'with_guardians') {
        // Backend doesn't have direct filter, we'll filter client-side
      } else if (selectedFilter === 'without_guardians') {
        // Backend doesn't have direct filter, we'll filter client-side
      }

      // Add grade filter
      if (selectedGrade) {
        filters.current_grade = selectedGrade;
      }

      // Add stream filter
      if (selectedStream) {
        filters.stream = selectedStream;
      }

      // Add house filter
      if (selectedHouse) {
        filters.house_name = selectedHouse;
      }

      // Add search query
      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const response = await studentService.getStudents(filters);

      if (response.success) {
        const data = response.data;
        
        // Handle pagination response
        const results = data.results || data;
        const count = data.count || results.length;
        const nextPage = data.next;

        if (append) {
          setStudents(prev => [...prev, ...results]);
          setFilteredStudents(prev => [...prev, ...results]);
        } else {
          setStudents(results);
          setFilteredStudents(results);
          
          // Extract unique values for filters
          const grades = [...new Set(results.map(s => s.current_grade))].filter(Boolean);
          const streams = [...new Set(results.map(s => s.stream))].filter(Boolean);
          const houses = [...new Set(results.map(s => s.house_name))].filter(Boolean);
          
          setAvailableGrades(grades);
          setAvailableStreams(streams);
          setAvailableHouses(houses);
        }

        setTotalCount(count);
        setHasNextPage(!!nextPage);
        setCurrentPage(page);
      } else {
        throw new Error(response.message || 'Failed to load students');
      }
    } catch (err) {
      console.error('Fetch students error:', err);
      setError(err.message || 'Failed to load students. Please try again.');
      
      if (!append) {
        setStudents([]);
        setFilteredStudents([]);
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchStudents(1, false);
  }, [selectedGrade, selectedStream, selectedHouse, searchQuery]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setCurrentPage(1);
    fetchStudents(1, false);
  }, [selectedGrade, selectedStream, selectedHouse, searchQuery]);

  // Load more (pagination)
  const handleLoadMore = () => {
    if (!isLoadingMore && hasNextPage && !isLoading) {
      fetchStudents(currentPage + 1, true);
    }
  };

  // Apply client-side guardian filter
  const applyGuardianFilter = useCallback(() => {
    let filtered = [...students];

    // Guardian filter (client-side)
    if (selectedFilter === 'with_guardians') {
      filtered = filtered.filter(s => s.guardian_count > 0);
    } else if (selectedFilter === 'without_guardians') {
      filtered = filtered.filter(s => s.guardian_count === 0);
    }

    setFilteredStudents(filtered);
  }, [students, selectedFilter]);

  useEffect(() => {
    applyGuardianFilter();
  }, [applyGuardianFilter]);

  // Search functionality
  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedFilter('all');
    setSelectedGrade(null);
    setSelectedStream(null);
    setSelectedHouse(null);
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleStudentPress = (student) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: student.id });
  };

  const renderStudent = ({ item }) => (
    <StudentCard student={item} onPress={() => handleStudentPress(item)} />
  );

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={styles.loadingMore}>
        <Text>Loading more students...</Text>
      </View>
    );
  };

  const activeFiltersCount = 
    (selectedFilter !== 'all' ? 1 : 0) + 
    (selectedGrade ? 1 : 0) + 
    (selectedStream ? 1 : 0) + 
    (selectedHouse ? 1 : 0) +
    (searchQuery.trim() ? 1 : 0);

  if (isLoading) {
    return <LoadingSpinner message="Loading students..." />;
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
          inputStyle={styles.searchInput}
        />
      </View>

      {/* Filter Chips - Row 1: Guardian Status */}
      <View style={styles.filterContainer}>
        <Chip
          selected={selectedFilter === 'all'}
          onPress={() => setSelectedFilter('all')}
          style={styles.filterChip}
          icon="account-group"
        >
          All ({totalCount})
        </Chip>
        <Chip
          selected={selectedFilter === 'with_guardians'}
          onPress={() => setSelectedFilter('with_guardians')}
          style={styles.filterChip}
          icon="account-check"
        >
          With Guardians
        </Chip>
        <Chip
          selected={selectedFilter === 'without_guardians'}
          onPress={() => setSelectedFilter('without_guardians')}
          style={styles.filterChip}
          icon="account-alert"
        >
          No Guardians
        </Chip>
      </View>

      {/* Filter Chips - Row 2: Kenya-specific filters */}
      <View style={styles.filterContainer}>
        {/* Grade Filter */}
        <Menu
          visible={gradeMenuVisible}
          onDismiss={() => setGradeMenuVisible(false)}
          anchor={
            <Chip
              selected={!!selectedGrade}
              onPress={() => setGradeMenuVisible(true)}
              style={styles.filterChip}
              icon="book-open-variant"
              onClose={selectedGrade ? () => setSelectedGrade(null) : undefined}
            >
              {selectedGrade ? KENYA_GRADE_LABELS[selectedGrade] : 'Grade'}
            </Chip>
          }
        >
          {availableGrades.map((grade) => (
            <Menu.Item
              key={grade}
              onPress={() => {
                setSelectedGrade(grade);
                setGradeMenuVisible(false);
              }}
              title={KENYA_GRADE_LABELS[grade] || grade}
            />
          ))}
        </Menu>

        {/* Stream Filter */}
        {availableStreams.length > 0 && (
          <Menu
            visible={streamMenuVisible}
            onDismiss={() => setStreamMenuVisible(false)}
            anchor={
              <Chip
                selected={!!selectedStream}
                onPress={() => setStreamMenuVisible(true)}
                style={styles.filterChip}
                icon="format-list-bulleted"
                onClose={selectedStream ? () => setSelectedStream(null) : undefined}
              >
                {selectedStream ? selectedStream : 'Stream'}
              </Chip>
            }
          >
            {availableStreams.map((stream) => (
              <Menu.Item
                key={stream}
                onPress={() => {
                  setSelectedStream(stream);
                  setStreamMenuVisible(false);
                }}
                title={stream}
              />
            ))}
          </Menu>
        )}

        {/* House Filter */}
        {availableHouses.length > 0 && (
          <Menu
            visible={houseMenuVisible}
            onDismiss={() => setHouseMenuVisible(false)}
            anchor={
              <Chip
                selected={!!selectedHouse}
                onPress={() => setHouseMenuVisible(true)}
                style={styles.filterChip}
                icon="home-group"
                onClose={selectedHouse ? () => setSelectedHouse(null) : undefined}
              >
                {selectedHouse ? selectedHouse : 'House'}
              </Chip>
            }
          >
            {availableHouses.map((house) => (
              <Menu.Item
                key={house}
                onPress={() => {
                  setSelectedHouse(house);
                  setHouseMenuVisible(false);
                }}
                title={house}
              />
            ))}
          </Menu>
        )}
      </View>

      {/* Clear Filters Button */}
      {activeFiltersCount > 0 && (
        <View style={styles.clearFiltersContainer}>
          <Button
            mode="text"
            onPress={clearAllFilters}
            icon="filter-remove"
            compact
          >
            Clear {activeFiltersCount} Filter{activeFiltersCount > 1 ? 's' : ''}
          </Button>
        </View>
      )}

      {/* Error Message */}
      {error ? (
        <ErrorMessage message={error} onRetry={() => fetchStudents(1, false)} />
      ) : null}

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
          icon="account-search"
          title="No Students Found"
          message={
            searchQuery || activeFiltersCount > 0
              ? 'No students match your search or filter criteria'
              : 'Start by adding your first student'
          }
          action={activeFiltersCount > 0 ? clearAllFilters : undefined}
          actionLabel={activeFiltersCount > 0 ? 'Clear Filters' : undefined}
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
    backgroundColor: theme.colors.background,
  },
  searchContainer: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.small,
  },
  searchBar: {
    elevation: 0,
    backgroundColor: theme.colors.background,
  },
  searchInput: {
    fontSize: theme.fontSizes.md,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  filterChip: {
    marginRight: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  clearFiltersContainer: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.surface,
    alignItems: 'flex-start',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  loadingMore: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  fab: {
    position: 'absolute',
    right: theme.spacing.md,
    bottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
});

export default StudentListScreen;