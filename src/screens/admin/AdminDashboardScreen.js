// ========================================
// ADMIN DASHBOARD SCREEN (SUPER ADMIN)
// Backend Integration: GET /api/analytics/dashboard/metrics/ (all schools)
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Text,
} from 'react-native';
import { Card, Title, Paragraph, Badge, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as schoolService from '../../services/schoolService';

const AdminDashboardScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [systemData, setSystemData] = useState({
    totalSchools: 0,
    activeSchools: 0,
    pendingSchools: 0,
    totalTeachers: 0,
    totalGuardians: 0,
    totalStudents: 0,
    schools: [],
  });

  // Fetch system data
  const fetchSystemData = async () => {
    try {
      setError('');
      
      // Fetch all schools
      const schoolsResponse = await schoolService.getSchools({
        page_size: 100,
      });
      
      if (schoolsResponse.success) {
        const schools = schoolsResponse.data.results || [];
        const activeSchools = schools.filter(s => s.approval_status === 'approved');
        const pendingSchools = schools.filter(s => s.approval_status === 'pending');
        
        // Aggregate statistics
        const totalTeachers = activeSchools.reduce((sum, s) => sum + (s.teacher_count || 0), 0);
        const totalStudents = activeSchools.reduce((sum, s) => sum + (s.student_count || 0), 0);
        const totalGuardians = activeSchools.reduce((sum, s) => sum + (s.guardian_count || 0), 0);
        
        setSystemData({
          totalSchools: schools.length,
          activeSchools: activeSchools.length,
          pendingSchools: pendingSchools.length,
          totalTeachers,
          totalGuardians,
          totalStudents,
          schools: schools.slice(0, 5), // Top 5 for display
        });
      }
    } catch (err) {
      setError('Failed to load system data. Please try again.');
      console.error('System dashboard error:', err);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchSystemData();
  }, []);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchSystemData();
  }, []);

  // System statistics cards
  const systemStats = [
    {
      id: 1,
      title: 'Total Schools',
      value: systemData.totalSchools,
      icon: 'school',
      color: '#2196F3',
      bgColor: '#E3F2FD',
    },
    {
      id: 2,
      title: 'Active Schools',
      value: systemData.activeSchools,
      icon: 'check-circle',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
    {
      id: 3,
      title: 'Pending Approvals',
      value: systemData.pendingSchools,
      icon: 'clock-alert',
      color: '#FF9800',
      bgColor: '#FFF3E0',
      badge: systemData.pendingSchools > 0,
    },
    {
      id: 4,
      title: 'Total Teachers',
      value: systemData.totalTeachers,
      icon: 'account-tie',
      color: '#9C27B0',
      bgColor: '#F3E5F5',
    },
    {
      id: 5,
      title: 'Total Guardians',
      value: systemData.totalGuardians,
      icon: 'account-supervisor',
      color: '#00BCD4',
      bgColor: '#E0F7FA',
    },
    {
      id: 6,
      title: 'Total Students',
      value: systemData.totalStudents,
      icon: 'account-school',
      color: '#4CAF50',
      bgColor: '#E8F5E9',
    },
  ];

  // Quick action cards
  const quickActions = [
    {
      id: 1,
      title: 'Approve Schools',
      icon: 'school-outline',
      color: '#FF9800',
      badge: systemData.pendingSchools,
      onPress: () => navigation.navigate(SCREENS.SCHOOLS_LIST, {
        filter: 'pending',
      }),
    },
    {
      id: 2,
      title: 'Manage Users',
      icon: 'account-cog',
      color: '#2196F3',
      onPress: () => navigation.navigate(SCREENS.USERS_MANAGEMENT),
    },
    {
      id: 3,
      title: 'System Stats',
      icon: 'chart-bar',
      color: '#4CAF50',
      onPress: () => navigation.navigate(SCREENS.SYSTEM_STATISTICS),
    },
    {
      id: 4,
      title: 'System Health',
      icon: 'heart-pulse',
      color: '#F44336',
      onPress: () => navigation.navigate(SCREENS.SYSTEM_STATISTICS),
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return '#4CAF50';
      case 'pending':
        return '#FF9800';
      case 'rejected':
        return '#F44336';
      default:
        return '#757575';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
      }
    >
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <View style={styles.welcomeTextContainer}>
          <Text style={styles.welcomeText}>SUPER ADMIN PORTAL</Text>
          <Text style={styles.adminName}>
            Welcome, {user?.first_name || 'Admin'}!
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate(SCREENS.NOTIFICATIONS)}
        >
          <MaterialCommunityIcons name="bell" size={28} color="#6200EE" />
          {systemData.pendingSchools > 0 && (
            <Badge style={styles.notificationBadge}>
              {systemData.pendingSchools}
            </Badge>
          )}
        </TouchableOpacity>
      </View>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchSystemData} /> : null}

      {/* System Overview */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>System Overview</Text>
        <View style={styles.statsGrid}>
          {systemStats.map((stat) => (
            <Card key={stat.id} style={[styles.statCard, { backgroundColor: stat.bgColor }]}>
              <Card.Content style={styles.statContent}>
                <View style={styles.statIconContainer}>
                  <MaterialCommunityIcons
                    name={stat.icon}
                    size={32}
                    color={stat.color}
                  />
                  {stat.badge && (
                    <Badge style={styles.statBadge}>{stat.value}</Badge>
                  )}
                </View>
                <View style={styles.statText}>
                  <Title style={styles.statNumber}>{stat.value}</Title>
                  <Paragraph style={styles.statLabel}>{stat.title}</Paragraph>
                </View>
              </Card.Content>
            </Card>
          ))}
        </View>
      </View>

      {/* Pending Approvals Alert */}
      {systemData.pendingSchools > 0 && (
        <Card style={styles.alertCard}>
          <Card.Content style={styles.alertContent}>
            <MaterialCommunityIcons
              name="alert-circle"
              size={24}
              color="#FF9800"
            />
            <View style={styles.alertText}>
              <Text style={styles.alertTitle}>Pending Approvals</Text>
              <Text style={styles.alertMessage}>
                {systemData.pendingSchools} school{systemData.pendingSchools !== 1 ? 's' : ''} waiting for approval
              </Text>
            </View>
            <TouchableOpacity
              style={styles.alertButton}
              onPress={() => navigation.navigate(SCREENS.SCHOOLS_LIST, {
                filter: 'pending',
              })}
            >
              <Text style={styles.alertButtonText}>Review</Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={20}
                color="#FF9800"
              />
            </TouchableOpacity>
          </Card.Content>
        </Card>
      )}

      {/* Recent Schools */}
      <View style={styles.sectionContainer}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Schools</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(SCREENS.SCHOOLS_LIST)}
          >
            <Text style={styles.viewAllText}>View All</Text>
          </TouchableOpacity>
        </View>

        {systemData.schools.length > 0 ? (
          systemData.schools.map((school) => (
            <Card key={school.id} style={styles.schoolCard}>
              <Card.Content style={styles.schoolContent}>
                <View style={styles.schoolInfo}>
                  <Text style={styles.schoolName}>{school.name}</Text>
                  <Text style={styles.schoolLocation}>
                    {school.county}, {school.sub_county}
                  </Text>
                  <View style={styles.schoolStats}>
                    <View style={styles.schoolStat}>
                      <MaterialCommunityIcons
                        name="account-school"
                        size={14}
                        color="#757575"
                      />
                      <Text style={styles.schoolStatText}>
                        {school.student_count || 0} students
                      </Text>
                    </View>
                    <View style={styles.schoolStat}>
                      <MaterialCommunityIcons
                        name="account-tie"
                        size={14}
                        color="#757575"
                      />
                      <Text style={styles.schoolStatText}>
                        {school.teacher_count || 0} teachers
                      </Text>
                    </View>
                  </View>
                </View>
                <Chip
                  style={[
                    styles.statusChip,
                    { backgroundColor: getStatusColor(school.approval_status) + '20' },
                  ]}
                  textStyle={{
                    color: getStatusColor(school.approval_status),
                    fontSize: 11,
                    fontWeight: 'bold',
                  }}
                >
                  {school.approval_status}
                </Chip>
              </Card.Content>
            </Card>
          ))
        ) : (
          <Text style={styles.noDataText}>No schools registered yet</Text>
        )}
      </View>

      {/* Quick Actions */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickActionsContainer}>
          {quickActions.map((action) => (
            <TouchableOpacity
              key={action.id}
              style={styles.quickActionCard}
              onPress={action.onPress}
            >
              <View
                style={[
                  styles.quickActionIconContainer,
                  { backgroundColor: action.color + '20' },
                ]}
              >
                <MaterialCommunityIcons
                  name={action.icon}
                  size={28}
                  color={action.color}
                />
                {action.badge > 0 && (
                  <Badge style={styles.actionBadge}>{action.badge}</Badge>
                )}
              </View>
              <Text style={styles.quickActionTitle}>{action.title}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
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
  welcomeSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  welcomeTextContainer: {
    flex: 1,
  },
  welcomeText: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
    letterSpacing: 1,
  },
  adminName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: '#F44336',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  viewAllText: {
    fontSize: 14,
    color: '#6200EE',
    fontWeight: '600',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statCard: {
    width: '48%',
    marginBottom: 12,
    elevation: 2,
  },
  statContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statIconContainer: {
    position: 'relative',
  },
  statBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: '#F44336',
  },
  statText: {
    marginLeft: 12,
    flex: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  statLabel: {
    fontSize: 12,
    color: '#757575',
    marginTop: 0,
  },
  alertCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: '#FFF3E0',
    borderLeftWidth: 4,
    borderLeftColor: '#FF9800',
  },
  alertContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertText: {
    flex: 1,
    marginLeft: 12,
  },
  alertTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 2,
  },
  alertMessage: {
    fontSize: 12,
    color: '#757575',
  },
  alertButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9800',
    marginRight: 4,
  },
  schoolCard: {
    marginBottom: 12,
    elevation: 1,
    backgroundColor: '#FFFFFF',
  },
  schoolContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  schoolInfo: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  schoolLocation: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 8,
  },
  schoolStats: {
    flexDirection: 'row',
  },
  schoolStat: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  schoolStatText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 4,
  },
  statusChip: {
    height: 24,
  },
  noDataText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 16,
  },
  quickActionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    elevation: 2,
  },
  quickActionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  actionBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#F44336',
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
    textAlign: 'center',
  },
});

export default AdminDashboardScreen;