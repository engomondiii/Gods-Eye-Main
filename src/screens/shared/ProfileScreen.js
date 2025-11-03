import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Card, Title, Paragraph, Avatar, Button, Divider } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { SCREENS, USER_ROLES } from '../../utils/constants';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfileScreen = ({ navigation }) => {
  const { user, userRole, logout } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await userService.getProfile();
      
      // Mock data for development
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockProfile = {
        username: user?.username || 'user123',
        email: user?.email || 'user@example.com',
        first_name: user?.first_name || 'John',
        last_name: user?.last_name || 'Doe',
        phone: user?.phone || '+254712345678',
        role: userRole,
        school: userRole === USER_ROLES.TEACHER ? { name: 'Nairobi Primary School' } : null,
        total_students: userRole === USER_ROLES.GUARDIAN ? 2 : userRole === USER_ROLES.TEACHER ? 45 : null,
        member_since: '2025-01-15',
      };
      
      setProfileData(mockProfile);
    } catch (error) {
      console.error('Fetch profile error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Profile editing feature coming soon!');
  };

  const getRoleName = (role) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return 'Super Administrator';
      case USER_ROLES.TEACHER:
        return 'Teacher';
      case USER_ROLES.GUARDIAN:
        return 'Guardian';
      default:
        return 'User';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return '#F44336';
      case USER_ROLES.TEACHER:
        return '#2196F3';
      case USER_ROLES.GUARDIAN:
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!profileData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Profile Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          <Avatar.Icon
            size={80}
            icon="account-circle"
            style={[styles.avatar, { backgroundColor: getRoleColor(profileData.role) }]}
          />
          <Title style={styles.name}>
            {profileData.first_name} {profileData.last_name}
          </Title>
          <View style={[styles.roleBadge, { backgroundColor: getRoleColor(profileData.role) + '20' }]}>
            <Text style={[styles.roleText, { color: getRoleColor(profileData.role) }]}>
              {getRoleName(profileData.role)}
            </Text>
          </View>
          <Button
            mode="outlined"
            onPress={handleEditProfile}
            style={styles.editButton}
            icon="pencil"
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      {/* Personal Information */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Personal Information</Title>
          
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Username:</Text>
            <Text style={styles.infoValue}>{profileData.username}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="email" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{profileData.email}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="phone" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Phone:</Text>
            <Text style={styles.infoValue}>{profileData.phone}</Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Member Since:</Text>
            <Text style={styles.infoValue}>{profileData.member_since}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* Role-Specific Information */}
      {profileData.school && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>School Information</Title>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="school" size={20} color="#757575" />
              <Text style={styles.infoLabel}>School:</Text>
              <Text style={styles.infoValue}>{profileData.school.name}</Text>
            </View>

            {profileData.total_students !== null && (
              <View style={styles.infoRow}>
                <MaterialCommunityIcons name="account-group" size={20} color="#757575" />
                <Text style={styles.infoLabel}>Students:</Text>
                <Text style={styles.infoValue}>{profileData.total_students}</Text>
              </View>
            )}
          </Card.Content>
        </Card>
      )}

      {profileData.role === USER_ROLES.GUARDIAN && profileData.total_students !== null && (
        <Card style={styles.card}>
          <Card.Content>
            <Title style={styles.sectionTitle}>Guardian Information</Title>
            
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="account-multiple" size={20} color="#757575" />
              <Text style={styles.infoLabel}>Linked Students:</Text>
              <Text style={styles.infoValue}>{profileData.total_students}</Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Quick Actions */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Quick Actions</Title>
          
          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => navigation.navigate(SCREENS.SETTINGS)}
          >
            <MaterialCommunityIcons name="cog" size={24} color="#757575" />
            <Text style={styles.actionText}>Settings</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>

          <Divider style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('Help', 'Help & Support feature coming soon!')}
          >
            <MaterialCommunityIcons name="help-circle" size={24} color="#757575" />
            <Text style={styles.actionText}>Help & Support</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>

          <Divider style={styles.actionDivider} />

          <TouchableOpacity
            style={styles.actionItem}
            onPress={() => Alert.alert('About', 'God\'s Eye EdTech Platform v1.0.0')}
          >
            <MaterialCommunityIcons name="information" size={24} color="#757575" />
            <Text style={styles.actionText}>About</Text>
            <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
          </TouchableOpacity>
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
        buttonColor="#F44336"
      >
        Logout
      </Button>
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
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatar: {
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  roleBadge: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
  },
  editButton: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
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
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
    marginLeft: 16,
  },
  actionDivider: {
    marginVertical: 4,
  },
  logoutButton: {
    marginBottom: 24,
    marginTop: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#757575',
    textAlign: 'center',
    marginTop: 32,
  },
});

export default ProfileScreen;