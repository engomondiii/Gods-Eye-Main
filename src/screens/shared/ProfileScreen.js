// ========================================
// GOD'S EYE EDTECH - PROFILE SCREEN
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
  RefreshControl,
  Image,
} from 'react-native';
import {
  Card,
  Title,
  Paragraph,
  Avatar,
  Button,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import * as authService from '../../services/authService';
import { upload } from '../../services/api';
import {
  SCREENS,
  USER_ROLES,
  getUserRoleDisplay,
  getUserRoleColor,
  getUserFullName,
  getUserInitials,
  hasSchool,
  getUserSchoolName,
} from '../../utils/constants';

// ============================================================
// PROFILE SCREEN COMPONENT
// ============================================================

const ProfileScreen = ({ navigation }) => {
  const { user, userRole, logout, updateUser } = useAuth();

  // State
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [profileData, setProfileData] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  // ============================================================
  // DATA FETCHING
  // ============================================================

  /**
   * Fetch user profile data from backend
   */
  const fetchProfileData = async () => {
    try {
      if (__DEV__) {
        console.log('📥 Fetching profile data...');
      }

      const result = await authService.getCurrentUser();

      if (result.success) {
        setProfileData(result.user);
        
        // Update auth context with latest user data
        await updateUser(result.user);

        if (__DEV__) {
          console.log('✅ Profile data loaded:', result.user.username);
        }
      } else {
        throw new Error(result.message || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('❌ Fetch profile error:', error);
      Alert.alert(
        'Error',
        'Failed to load profile data. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  /**
   * Refresh profile data
   */
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchProfileData();
  }, []);

  /**
   * Initial data load
   */
  useEffect(() => {
    fetchProfileData();
  }, []);

  // ============================================================
  // PROFILE PHOTO UPLOAD
  // ============================================================

  /**
   * Pick image from gallery
   */
  const pickImage = async () => {
    try {
      // Request permissions
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (status !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Please allow access to your photo library to upload a profile picture.'
        );
        return;
      }

      // Launch image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        await uploadProfilePhoto(result.assets[0]);
      }
    } catch (error) {
      console.error('❌ Image picker error:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  /**
   * Upload profile photo to backend
   */
  const uploadProfilePhoto = async (imageAsset) => {
    try {
      setUploadingPhoto(true);

      if (__DEV__) {
        console.log('📤 Uploading profile photo...');
      }

      // Prepare form data
      const photoData = {
        profile_photo: {
          uri: imageAsset.uri,
          type: 'image/jpeg',
          name: `profile_${user.id}.jpg`,
        },
      };

      // Upload to backend
      const response = await upload(
        `/users/${user.id}/`,
        photoData,
        (progress) => {
          if (__DEV__) {
            console.log(`Upload progress: ${progress}%`);
          }
        }
      );

      // Update local state
      const updatedUser = { ...profileData, profile_photo: response.profile_photo };
      setProfileData(updatedUser);
      await updateUser(updatedUser);

      Alert.alert('Success', 'Profile photo updated successfully!');

      if (__DEV__) {
        console.log('✅ Profile photo uploaded');
      }
    } catch (error) {
      console.error('❌ Upload photo error:', error);
      Alert.alert('Error', 'Failed to upload photo. Please try again.');
    } finally {
      setUploadingPhoto(false);
    }
  };

  /**
   * Show photo options
   */
  const handlePhotoPress = () => {
    Alert.alert(
      'Profile Photo',
      'Choose an option',
      [
        {
          text: 'Upload Photo',
          onPress: pickImage,
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  // ============================================================
  // PROFILE EDITING
  // ============================================================

  /**
   * Navigate to edit profile screen
   */
  const handleEditProfile = () => {
    // TODO: Create EditProfileScreen
    Alert.alert(
      'Edit Profile',
      'Edit profile feature coming soon!',
      [
        {
          text: 'OK',
        },
      ]
    );
  };

  // ============================================================
  // PASSWORD CHANGE
  // ============================================================

  /**
   * Navigate to change password screen
   */
  const handleChangePassword = () => {
    // TODO: Create ChangePasswordScreen
    Alert.alert(
      'Change Password',
      'Change password feature coming soon!',
      [
        {
          text: 'OK',
        },
      ]
    );
  };

  // ============================================================
  // LOGOUT
  // ============================================================

  /**
   * Handle logout with confirmation
   */
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              if (__DEV__) {
                console.log('🚪 Logging out...');
              }
              await logout();
            } catch (error) {
              console.error('❌ Logout error:', error);
            }
          },
        },
      ]
    );
  };

  // ============================================================
  // HELPER FUNCTIONS
  // ============================================================

  /**
   * Format date to readable string
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return dateString;
    }
  };

  /**
   * Get statistics for role-specific information
   */
  const getStatistics = () => {
    // TODO: Fetch statistics from backend
    // For now, return mock data based on role
    return null;
  };

  // ============================================================
  // RENDER LOADING STATE
  // ============================================================

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  // ============================================================
  // RENDER ERROR STATE
  // ============================================================

  if (!profileData) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons name="alert-circle" size={64} color="#F44336" />
        <Text style={styles.errorText}>Failed to load profile</Text>
        <Button mode="contained" onPress={fetchProfileData} style={styles.retryButton}>
          Retry
        </Button>
      </View>
    );
  }

  // ============================================================
  // RENDER PROFILE
  // ============================================================

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={['#6200EE']}
        />
      }
    >
      {/* Profile Header Card */}
      <Card style={styles.headerCard}>
        <Card.Content style={styles.headerContent}>
          {/* Profile Photo */}
          <TouchableOpacity onPress={handlePhotoPress} disabled={uploadingPhoto}>
            {uploadingPhoto ? (
              <View style={styles.avatarContainer}>
                <ActivityIndicator size="large" color="#6200EE" />
              </View>
            ) : profileData.profile_photo ? (
              <Image
                source={{ uri: profileData.profile_photo }}
                style={styles.profileImage}
              />
            ) : (
              <Avatar.Text
                size={100}
                label={getUserInitials(profileData)}
                style={[
                  styles.avatar,
                  { backgroundColor: getUserRoleColor(profileData) },
                ]}
                labelStyle={styles.avatarLabel}
              />
            )}
            <View style={styles.photoEditBadge}>
              <MaterialCommunityIcons name="camera" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          {/* Name */}
          <Title style={styles.name}>{getUserFullName(profileData)}</Title>

          {/* Username */}
          <Text style={styles.username}>@{profileData.username}</Text>

          {/* Role Badge */}
          <View
            style={[
              styles.roleBadge,
              { backgroundColor: getUserRoleColor(profileData) + '20' },
            ]}
          >
            <MaterialCommunityIcons
              name={
                userRole === USER_ROLES.SUPER_ADMIN
                  ? 'shield-crown'
                  : userRole === USER_ROLES.SCHOOL_ADMIN
                  ? 'shield-account'
                  : userRole === USER_ROLES.TEACHER
                  ? 'account-tie'
                  : 'account-heart'
              }
              size={16}
              color={getUserRoleColor(profileData)}
            />
            <Text style={[styles.roleText, { color: getUserRoleColor(profileData) }]}>
              {getUserRoleDisplay(profileData)}
            </Text>
          </View>

          {/* Edit Profile Button */}
          <Button
            mode="outlined"
            onPress={handleEditProfile}
            style={styles.editButton}
            icon="pencil"
            disabled={isUpdating}
          >
            Edit Profile
          </Button>
        </Card.Content>
      </Card>

      {/* Personal Information */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="account-details" size={24} color="#6200EE" />
            <Title style={styles.sectionTitle}>Personal Information</Title>
          </View>

          <InfoRow
            icon="email"
            label="Email"
            value={profileData.email || 'Not provided'}
          />

          <InfoRow
            icon="phone"
            label="Phone"
            value={profileData.phone || 'Not provided'}
          />

          {profileData.middle_name && (
            <InfoRow
              icon="account"
              label="Middle Name"
              value={profileData.middle_name}
            />
          )}

          <InfoRow
            icon="calendar"
            label="Member Since"
            value={formatDate(profileData.date_joined)}
          />

          <InfoRow
            icon="clock-outline"
            label="Last Login"
            value={formatDate(profileData.last_login)}
          />
        </Card.Content>
      </Card>

      {/* School Information (for School Admin and Teachers) */}
      {hasSchool(profileData) && profileData.school_data && (
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons name="school" size={24} color="#6200EE" />
              <Title style={styles.sectionTitle}>School Information</Title>
            </View>

            <InfoRow
              icon="school"
              label="School"
              value={profileData.school_data.name}
            />

            <InfoRow
              icon="identifier"
              label="NEMIS Code"
              value={profileData.school_data.nemis_code || 'N/A'}
            />

            {profileData.school_data.county && (
              <InfoRow
                icon="map-marker"
                label="County"
                value={profileData.school_data.county}
              />
            )}

            <InfoRow
              icon="check-circle"
              label="Status"
              value={profileData.school_data.is_active ? 'Active' : 'Inactive'}
              valueColor={profileData.school_data.is_active ? '#4CAF50' : '#F44336'}
            />
          </Card.Content>
        </Card>
      )}

      {/* Account Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="cog" size={24} color="#6200EE" />
            <Title style={styles.sectionTitle}>Account Settings</Title>
          </View>

          <ActionItem
            icon="lock-reset"
            text="Change Password"
            onPress={handleChangePassword}
          />

          <Divider style={styles.actionDivider} />

          <ActionItem
            icon="cog"
            text="Settings"
            onPress={() => navigation.navigate(SCREENS.SETTINGS)}
          />

          <Divider style={styles.actionDivider} />

          <ActionItem
            icon="bell"
            text="Notifications"
            onPress={() => navigation.navigate(SCREENS.NOTIFICATIONS)}
          />
        </Card.Content>
      </Card>

      {/* Support & About */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons name="help-circle" size={24} color="#6200EE" />
            <Title style={styles.sectionTitle}>Support & About</Title>
          </View>

          <ActionItem
            icon="help-circle"
            text="Help & Support"
            onPress={() =>
              Alert.alert(
                'Help & Support',
                'For assistance, please contact your school administrator.'
              )
            }
          />

          <Divider style={styles.actionDivider} />

          <ActionItem
            icon="information"
            text="About"
            onPress={() =>
              Alert.alert(
                'About God\'s Eye EdTech',
                'Version 1.0.0\n\nA comprehensive school management platform.\n\n© 2025 Prodvestor Innovation Labs'
              )
            }
          />
        </Card.Content>
      </Card>

      {/* Logout Button */}
      <Button
        mode="contained"
        onPress={handleLogout}
        style={styles.logoutButton}
        icon="logout"
        buttonColor="#F44336"
        textColor="#FFFFFF"
      >
        Logout
      </Button>

      {/* Bottom Padding */}
      <View style={styles.bottomPadding} />
    </ScrollView>
  );
};

// ============================================================
// SUB-COMPONENTS
// ============================================================

/**
 * Info Row Component
 */
const InfoRow = ({ icon, label, value, valueColor }) => (
  <View style={styles.infoRow}>
    <MaterialCommunityIcons name={icon} size={20} color="#757575" />
    <Text style={styles.infoLabel}>{label}:</Text>
    <Text style={[styles.infoValue, valueColor && { color: valueColor }]}>
      {value}
    </Text>
  </View>
);

/**
 * Action Item Component
 */
const ActionItem = ({ icon, text, onPress }) => (
  <TouchableOpacity style={styles.actionItem} onPress={onPress}>
    <MaterialCommunityIcons name={icon} size={24} color="#757575" />
    <Text style={styles.actionText}>{text}</Text>
    <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
  </TouchableOpacity>
);

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  contentContainer: {
    padding: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    padding: 24,
  },
  errorText: {
    fontSize: 18,
    color: '#212121',
    marginTop: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#6200EE',
  },
  headerCard: {
    marginBottom: 16,
    elevation: 2,
  },
  headerContent: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 16,
  },
  avatar: {
    marginBottom: 16,
  },
  avatarLabel: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  photoEditBadge: {
    position: 'absolute',
    bottom: 16,
    right: 0,
    backgroundColor: '#6200EE',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
    textAlign: 'center',
  },
  username: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  roleText: {
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 6,
  },
  editButton: {
    marginTop: 8,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginLeft: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 12,
    marginRight: 12,
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
    marginTop: 8,
  },
  bottomPadding: {
    height: 24,
  },
});

// ============================================================
// EXPORTS
// ============================================================

export default ProfileScreen;