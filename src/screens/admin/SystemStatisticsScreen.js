// ========================================
// SYSTEM STATISTICS SCREEN (SUPER ADMIN)
// Comprehensive system analytics and statistics
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
  Dimensions,
  Alert,
} from 'react-native';
import { Card, Title, Button, DataTable, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { PieChart } from 'react-native-chart-kit';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as schoolService from '../../services/schoolService';

const screenWidth = Dimensions.get('window').width;

const SystemStatisticsScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [stats, setStats] = useState(null);

  // Fetch statistics
  const fetchStatistics = async () => {
    try {
      setError('');
      
      // Fetch schools
      const schoolsResponse = await schoolService.getSchools({
        page_size: 1000,
      });
      
      if (schoolsResponse.success) {
        const schools = schoolsResponse.data.results || [];
        
        // Calculate statistics
        const byCounty = {};
        const byStatus = {
          approved: 0,
          pending: 0,
          rejected: 0,
        };
        
        let totalStudents = 0;
        let totalTeachers = 0;
        let totalGuardians = 0;
        
        schools.forEach(school => {
          // County breakdown
          const county = school.county || 'Unknown';
          byCounty[county] = (byCounty[county] || 0) + 1;
          
          // Status breakdown
          byStatus[school.approval_status] = (byStatus[school.approval_status] || 0) + 1;
          
          // Aggregate counts
          if (school.approval_status === 'approved') {
            totalStudents += school.student_count || 0;
            totalTeachers += school.teacher_count || 0;
            totalGuardians += school.guardian_count || 0;
          }
        });
        
        setStats({
          totalSchools: schools.length,
          byCounty,
          byStatus,
          totalStudents,
          totalTeachers,
          totalGuardians,
          topCounties: Object.entries(byCounty)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 5),
        });
      }
    } catch (err) {
      setError('Failed to load statistics. Please try again.');
      console.error('Statistics error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchStatistics();
  }, []);

  const handleExportReport = () => {
    Alert.alert(
      'Export Report',
      'System report export functionality coming soon!',
      [{ text: 'OK' }]
    );
  };

  // Prepare pie chart data for user roles
  const getUserRolesPieData = () => {
    if (!stats) return [];
    
    return [
      {
        name: 'Students',
        population: stats.totalStudents,
        color: '#4CAF50',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Teachers',
        population: stats.totalTeachers,
        color: '#2196F3',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Guardians',
        population: stats.totalGuardians,
        color: '#FF9800',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];
  };

  // Prepare pie chart data for school status
  const getSchoolStatusPieData = () => {
    if (!stats) return [];
    
    return [
      {
        name: 'Approved',
        population: stats.byStatus.approved,
        color: '#4CAF50',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Pending',
        population: stats.byStatus.pending,
        color: '#FF9800',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
      {
        name: 'Rejected',
        population: stats.byStatus.rejected,
        color: '#F44336',
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
      },
    ];
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  const userRolesPieData = getUserRolesPieData();
  const schoolStatusPieData = getSchoolStatusPieData();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>System Statistics</Text>
          <Text style={styles.headerSubtitle}>
            God's Eye EdTech Platform Overview
          </Text>
        </View>
        <Button
          mode="contained"
          icon="download"
          onPress={handleExportReport}
          style={styles.exportButton}
        >
          Export
        </Button>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchStatistics} /> : null}

      {stats && (
        <>
          {/* Overview Cards */}
          <View style={styles.overviewGrid}>
            <Card style={[styles.overviewCard, { backgroundColor: '#E3F2FD' }]}>
              <Card.Content style={styles.overviewContent}>
                <MaterialCommunityIcons
                  name="school"
                  size={32}
                  color="#2196F3"
                />
                <View style={styles.overviewText}>
                  <Title style={styles.overviewNumber}>
                    {stats.totalSchools}
                  </Title>
                  <Text style={styles.overviewLabel}>Total Schools</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.overviewCard, { backgroundColor: '#E8F5E9' }]}>
              <Card.Content style={styles.overviewContent}>
                <MaterialCommunityIcons
                  name="account-school"
                  size={32}
                  color="#4CAF50"
                />
                <View style={styles.overviewText}>
                  <Title style={styles.overviewNumber}>
                    {stats.totalStudents.toLocaleString()}
                  </Title>
                  <Text style={styles.overviewLabel}>Total Students</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.overviewCard, { backgroundColor: '#F3E5F5' }]}>
              <Card.Content style={styles.overviewContent}>
                <MaterialCommunityIcons
                  name="account-tie"
                  size={32}
                  color="#9C27B0"
                />
                <View style={styles.overviewText}>
                  <Title style={styles.overviewNumber}>
                    {stats.totalTeachers.toLocaleString()}
                  </Title>
                  <Text style={styles.overviewLabel}>Total Teachers</Text>
                </View>
              </Card.Content>
            </Card>

            <Card style={[styles.overviewCard, { backgroundColor: '#FFF3E0' }]}>
              <Card.Content style={styles.overviewContent}>
                <MaterialCommunityIcons
                  name="account-supervisor"
                  size={32}
                  color="#FF9800"
                />
                <View style={styles.overviewText}>
                  <Title style={styles.overviewNumber}>
                    {stats.totalGuardians.toLocaleString()}
                  </Title>
                  <Text style={styles.overviewLabel}>Total Guardians</Text>
                </View>
              </Card.Content>
            </Card>
          </View>

          {/* User Roles Distribution */}
          <Card style={styles.chartCard}>
            <Card.Content>
              <Title style={styles.chartTitle}>Users by Role</Title>
              <PieChart
                data={userRolesPieData}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </Card.Content>
          </Card>

          {/* School Status Distribution */}
          <Card style={styles.chartCard}>
            <Card.Content>
              <Title style={styles.chartTitle}>Schools by Status</Title>
              <PieChart
                data={schoolStatusPieData}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
              
              <View style={styles.statusSummary}>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#4CAF50' }]} />
                  <Text style={styles.statusText}>
                    Approved: {stats.byStatus.approved}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#FF9800' }]} />
                  <Text style={styles.statusText}>
                    Pending: {stats.byStatus.pending}
                  </Text>
                </View>
                <View style={styles.statusItem}>
                  <View style={[styles.statusDot, { backgroundColor: '#F44336' }]} />
                  <Text style={styles.statusText}>
                    Rejected: {stats.byStatus.rejected}
                  </Text>
                </View>
              </View>
            </Card.Content>
          </Card>

          {/* Top Counties */}
          <Card style={styles.tableCard}>
            <Card.Content>
              <Title style={styles.chartTitle}>Top 5 Counties</Title>
              <DataTable>
                <DataTable.Header>
                  <DataTable.Title>County</DataTable.Title>
                  <DataTable.Title numeric>Schools</DataTable.Title>
                  <DataTable.Title numeric>Percentage</DataTable.Title>
                </DataTable.Header>

                {stats.topCounties.map(([county, count], index) => (
                  <DataTable.Row key={county}>
                    <DataTable.Cell>
                      <View style={styles.countyCell}>
                        <Text style={styles.countyRank}>{index + 1}</Text>
                        <Text style={styles.countyName}>{county}</Text>
                      </View>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>{count}</DataTable.Cell>
                    <DataTable.Cell numeric>
                      {((count / stats.totalSchools) * 100).toFixed(1)}%
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
              </DataTable>
            </Card.Content>
          </Card>

          {/* System Health Indicators */}
          <Card style={styles.healthCard}>
            <Card.Content>
              <Title style={styles.chartTitle}>System Health</Title>
              
              <View style={styles.healthIndicators}>
                <View style={styles.healthItem}>
                  <MaterialCommunityIcons
                    name="check-circle"
                    size={24}
                    color="#4CAF50"
                  />
                  <Text style={styles.healthLabel}>Schools Active</Text>
                  <Chip
                    style={styles.healthChip}
                    textStyle={styles.healthChipText}
                  >
                    {stats.byStatus.approved}
                  </Chip>
                </View>

                <View style={styles.healthItem}>
                  <MaterialCommunityIcons
                    name="clock-alert"
                    size={24}
                    color="#FF9800"
                  />
                  <Text style={styles.healthLabel}>Pending Review</Text>
                  <Chip
                    style={[styles.healthChip, { backgroundColor: '#FF98001A' }]}
                    textStyle={[styles.healthChipText, { color: '#FF9800' }]}
                  >
                    {stats.byStatus.pending}
                  </Chip>
                </View>

                <View style={styles.healthItem}>
                  <MaterialCommunityIcons
                    name="account-check"
                    size={24}
                    color="#4CAF50"
                  />
                  <Text style={styles.healthLabel}>Total Users</Text>
                  <Chip
                    style={styles.healthChip}
                    textStyle={styles.healthChipText}
                  >
                    {(stats.totalStudents + stats.totalTeachers + stats.totalGuardians).toLocaleString()}
                  </Chip>
                </View>
              </View>
            </Card.Content>
          </Card>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  exportButton: {
    backgroundColor: '#6200EE',
  },
  overviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  overviewCard: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  overviewText: {
    marginLeft: 12,
  },
  overviewNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#757575',
  },
  chartCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  chartTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  statusSummary: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#757575',
  },
  tableCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  countyCell: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countyRank: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200EE',
    marginRight: 12,
    width: 20,
  },
  countyName: {
    fontSize: 14,
    color: '#212121',
  },
  healthCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFFFFF',
  },
  healthIndicators: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  healthItem: {
    alignItems: 'center',
  },
  healthLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 8,
    marginBottom: 8,
  },
  healthChip: {
    backgroundColor: '#4CAF501A',
  },
  healthChipText: {
    color: '#4CAF50',
    fontWeight: 'bold',
  },
});

export default SystemStatisticsScreen;