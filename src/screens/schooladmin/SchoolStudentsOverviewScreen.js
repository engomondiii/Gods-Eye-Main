import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  Text,
  TouchableOpacity,
} from 'react-native';
import { Searchbar, Chip, Card, Title } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vec-icons';
import { useAuth } from '../../hooks/useAuth';
import StudentCard from '../../components/student/StudentCard';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';
import { SCREENS, KENYA_GRADES, KENYA_GRADE_LABELS } from '../../utils/constants';
import theme from '../../styles/theme';

const SchoolStudentsOverviewScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState('all');
  const [statistics, setStatistics] = useState({
    totalStudents: 0,
    byGrade: {},
    withGuardians: 0,
    withoutGuardians: 0,
    attendanceAverage: 0,
  });

  // Fetch students for this school only
  const fetchStudents = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await schoolAdminService.getSchoolStudents(user.school.id);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockStudents = [
        {
          id: 1,
          first_name: 'John',
          middle_name: 'Kamau',
          last_name: 'Mwangi',
          admission_number: 'ADM/2020/001',
          school: user.school,
          education_level: 'primary',
          current_grade: 'grade_5',
          stream: 'Red',
          house_name: 'Kilimanjaro',
          house_color: 'Red',
          guardians: [
            { id: 1, first_name: 'Jane', last_name: 'Mwangi' },
            { id: 2, first_name: 'Michael', last_name: 'Mwangi' },
          ],
          attendance_percentage: 92,
        },
        {
          id: 2,
          first_name: 'Sarah',
          middle_name: 'Akinyi',
          last_name: 'Odhiambo',
          admission_number: 'ADM/2020/002',
          school: user.school,
          education_level: 'primary',
          current_grade: 'grade_5',
          stream: 'Blue',
          house_name: 'Mara',
          house_color: 'Blue',
          guardians: [
            { id: 3, first_name: 'Emily', last_name: 'Odhiambo' },
          ],
          attendance_percentage: 88,
        },
        {
          id: 3,
          first_name: 'David',
          middle_name: 'Kipchoge',
          last_name: 'Kibet',
          admission_number: 'ADM/2021/003',
          school: user.school,
          education_level: 'primary',
          current_grade: 'grade_4',
          stream: 'Red',
          house_name: 'Kilimanjaro',
          house_color: 'Red',
          guardians: [
            { id: 4, first_name: 'Robert', last_name: 'Kibet' },
            { id: 5, first_name: 'Linda', last_name: 'Kibet' },
          ],
          attendance_percentage: 95,
        },
        {
          id: 4,
          first_name: 'Grace',
          middle_name: 'Wanjiru',
          last_name: 'Njoroge',
          admission_number: 'ADM/2021/004',
          school: user.school,
          education_level: 'junior_secondary',
          current_grade: 'grade_7',
          stream: 'East',
          house_name: 'Tsavo',
          house_color: 'Green',
          guardians: [],
          attendance_percentage: 90,
        },
        {
          id: 5,
          first_name: 'James',
          middle_name: 'Otieno',
          last_name: 'Ouma',
          admission_number: 'ADM/2019/005',
          school: user.school,
          education_level: 'primary',
          current_grade: 'grade_6',
          stream: 'Blue',
          house_name: 'Mara',
          house_color: 'Blue',
          guardians: [
            { id: 6, first_name: 'Mary', last_name: 'Ouma' },
          ],
          attendance_percentage: 85,
        },
      ];
      
      setStudents(mockStudents);
      
      // Calculate statistics
      const stats = {
        totalStudents: mockStudents.length,
        byGrade: {},
        withGuardians: mockStudents.filter(s => s.guardians.length > 0).length,
        withoutGuardians: mockStudents.filter(s => s.guardians.length === 0).length,
        attendanceAverage: Math.round(
          mockStudents.reduce((sum, s) => sum + s.attendance_percentage, 0) / mockStudents.length
        ),
      };
      
      // Count by grade
      mockStudents.forEach(student => {
        stats.byGrade[student.current_grade] = (stats.byGrade[student.current_grade] || 0) + 1;
      });
      
      setStatistics(stats);
      applyFilter(selectedGrade, mockStudents);
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
      applyFilter(selectedGrade);
      return;
    }
    
    const filtered = students.filter((student) => {
      const fullName = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.toLowerCase();
      const admissionNumber = student.admission_number.toLowerCase();
      const searchLower = query.toLowerCase();
      
      return fullName.includes(searchLower) || admissionNumber.includes(searchLower);
    });
    
    setFilteredStudents(filtered);
  };

  // Filter by grade
  const applyFilter = (grade, studentsList = students) => {
    setSelectedGrade(grade);
    
    let filtered = studentsList;
    
    if (grade !== 'all') {
      filtered = studentsList.filter(s => s.current_grade === grade);
    }
    
    // Apply search if active
    if (searchQuery.trim() !== '') {
      filtered = filtered.filter((student) => {
        const fullName = `${student.first_name} ${student.middle_name || ''} ${student.last_name}`.toLowerCase();
        const admissionNumber = student.admission_number.toLowerCase();
        const searchLower = searchQuery.toLowerCase();
        
        return fullName.includes(searchLower) || admissionNumber.includes(searchLower);
      });
    }
    
    setFilteredStudents(filtered);
  };

  const handleStudentPress = (student) => {
    navigation.navigate(SCREENS.STUDENT_DETAIL, { studentId: student.id });
  };

  const renderStudent = ({ item }) => (
    <StudentCard student={item} onPress={() => handleStudentPress(item)} />
  );

  // Get unique grades from students
  const availableGrades = [...new Set(students.map(s => s.current_grade))].sort();

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <View style={styles.container}>
      {/* Statistics Card */}
      <Card style={styles.statsCard}>
        <Card.Content>
          <Title style={styles.statsTitle}>School Statistics</Title>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-school" size={32} color="#2196F3" />
              <Text style={styles.statNumber}>{statistics.totalStudents}</Text>
              <Text style={styles.statLabel}>Total Students</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={32} color="#4CAF50" />
              <Text style={styles.statNumber}>{statistics.withGuardians}</Text>
              <Text style={styles.statLabel}>With Guardians</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="clipboard-check" size={32} color="#FF9800" />
              <Text style={styles.statNumber}>{statistics.attendanceAverage}%</Text>
              <Text style={styles.statLabel}>Avg Attendance</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Searchbar
          placeholder="Search by name or admission number"
          onChangeText={handleSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
      </View>

      {/* Grade Filter Chips */}
      <View style={styles.filterContainer}>
        <Text style={styles.filterTitle}>Filter by Grade:</Text>
        <View style={styles.chipsContainer}>
          <Chip
            selected={selectedGrade === 'all'}
            onPress={() => applyFilter('all')}
            style={styles.filterChip}
          >
            All ({statistics.totalStudents})
          </Chip>
          {availableGrades.map((grade) => (
            <Chip
              key={grade}
              selected={selectedGrade === grade}
              onPress={() => applyFilter(grade)}
              style={styles.filterChip}
            >
              {KENYA_GRADE_LABELS[grade] || grade} ({statistics.byGrade[grade] || 0})
            </Chip>
          ))}
        </View>
      </View>

      {/* School Info Banner */}
      <View style={styles.schoolBanner}>
        <MaterialCommunityIcons name="school" size={20} color="#FF9800" />
        <Text style={styles.schoolBannerText}>
          {user?.school?.name || 'Your School'}
        </Text>
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
              : selectedGrade !== 'all'
              ? `No students in ${KENYA_GRADE_LABELS[selectedGrade]}`
              : 'No students in your school yet'
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
  statsCard: {
    margin: 16,
    marginBottom: 8,
    elevation: 2,
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E0E0E0',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginTop: 8,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#757575',
    textAlign: 'center',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: '#FFFFFF',
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
  filterTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#757575',
    marginBottom: 8,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterChip: {
    marginRight: 8,
    marginBottom: 8,
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
});

export default SchoolStudentsOverviewScreen;