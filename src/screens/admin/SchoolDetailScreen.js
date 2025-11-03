import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Button, Divider, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import { formatDate } from '../../utils/formatters';

const SchoolDetailScreen = ({ route, navigation }) => {
  const { schoolId } = route.params;
  const [school, setSchool] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch school details
  const fetchSchoolDetails = async () => {
    try {
      setError('');
      // TODO: Replace with actual API call
      // const response = await schoolService.getSchoolById(schoolId);
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockSchool = {
        id: schoolId,
        name: 'Nairobi Primary School',
        country: { id: 1, name: 'Kenya' },
        county: { id: 1, name: 'Nairobi' },
        sub_county: 'Westlands',
        ward: 'Kangemi',
        address: '123 Education Road, Nairobi',
        approved: false,
        created_at: '2025-10-25T10:00:00Z',
        approval_date: null,
        approved_by: null,
        total_students: 0,
        total_teachers: 1,
        total_guardians: 0,
      };
      
      setSchool(mockSchool);
    } catch (err) {
      setError('Failed to load school details. Please try again.');
      console.error('Fetch school error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSchoolDetails();
  }, [schoolId]);

  const handleApprove = async () => {
    Alert.alert(
      'Approve School',
      `Are you sure you want to approve ${school.name}?`,
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
              
              Alert.alert('Success', 'School approved successfully!', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to approve school. Please try again.');
              console.error('Approve error:', error);
            }
          },
        },
      ]
    );
  };

  const handleReject = async () => {
    Alert.alert(
      'Reject School',
      `Are you sure you want to reject ${school.name}? This action cannot be undone.`,
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
              
              Alert.alert('Rejected', 'School registration has been rejected.', [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ]);
            } catch (error) {
              Alert.alert('Error', 'Failed to reject school. Please try again.');
              console.error('Reject error:', error);
            }
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error && !school) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error} onRetry={fetchSchoolDetails} />
      </View>
    );
  }

  if (!school) {
    return (
      <View style={styles.container}>
        <Text style={styles.noDataText}>School not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* School Info Card */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.headerContainer}>
            <View style={styles.iconContainer}>
              <MaterialCommunityIcons name="school" size={60} color="#6200EE" />
            </View>
            <View style={styles.headerTextContainer}>
              <Title style={styles.schoolName}>{school.name}</Title>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  school.approved ? styles.approvedChip : styles.pendingChip,
                ]}
                textStyle={styles.chipText}
              >
                {school.approved ? 'APPROVED' : 'PENDING APPROVAL'}
              </Chip>
            </View>
          </View>

          <Divider style={styles.divider} />

          {/* Location Information */}
          <Text style={styles.sectionTitle}>Location Details</Text>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="earth" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Country:</Text>
            <Text style={styles.infoValue}>{school.country.name}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="map-marker" size={20} color="#757575" />
            <Text style={styles.infoLabel}>County:</Text>
            <Text style={styles.infoValue}>{school.county.name}</Text>
          </View>

          {school.sub_county && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map" size={20} color="#757575" />
              <Text style={styles.infoLabel}>Sub-County:</Text>
              <Text style={styles.infoValue}>{school.sub_county}</Text>
            </View>
          )}

          {school.ward && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-outline" size={20} color="#757575" />
              <Text style={styles.infoLabel}>Ward:</Text>
              <Text style={styles.infoValue}>{school.ward}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="home" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>{school.address}</Text>
          </View>

          <Divider style={styles.divider} />

          {/* Registration Information */}
          <Text style={styles.sectionTitle}>Registration Details</Text>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Created:</Text>
            <Text style={styles.infoValue}>{formatDate(school.created_at)}</Text>
          </View>

          {school.approved && school.approval_date && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="check-circle" size={20} color="#757575" />
              <Text style={styles.infoLabel}>Approved:</Text>
              <Text style={styles.infoValue}>{formatDate(school.approval_date)}</Text>
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Statistics Card */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>School Statistics</Title>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-school" size={32} color="#2196F3" />
              <Text style={styles.statNumber}>{school.total_students}</Text>
              <Text style={styles.statLabel}>Students</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-tie" size={32} color="#4CAF50" />
              <Text style={styles.statNumber}>{school.total_teachers}</Text>
              <Text style={styles.statLabel}>Teachers</Text>
            </View>
            
            <View style={styles.statDivider} />
            
            <View style={styles.statItem}>
              <MaterialCommunityIcons name="account-group" size={32} color="#9C27B0" />
              <Text style={styles.statNumber}>{school.total_guardians}</Text>
              <Text style={styles.statLabel}>Guardians</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      {!school.approved && (
        <View style={styles.actionButtonsContainer}>
          <Button
            mode="contained"
            onPress={handleApprove}
            style={styles.approveButton}
            icon="check-circle"
          >
            Approve School
          </Button>
          <Button
            mode="outlined"
            onPress={handleReject}
            style={styles.rejectButton}
            icon="close-circle"
            textColor="#F44336"
          >
            Reject School
          </Button>
        </View>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    marginRight: 16,
  },
  headerTextContainer: {
    flex: 1,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  statusChip: {
    alignSelf: 'flex-start',
  },
  approvedChip: {
    backgroundColor: '#E8F5E9',
  },
  pendingChip: {
    backgroundColor: '#FFF3E0',
  },
  chipText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    marginRight: 8,
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  noDataText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 32,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
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
    fontSize: 12,
    color: '#757575',
  },
  actionButtonsContainer: {
    marginBottom: 16,
  },
  approveButton: {
    marginBottom: 12,
    backgroundColor: '#4CAF50',
  },
  rejectButton: {
    borderColor: '#F44336',
  },
});

export default SchoolDetailScreen;