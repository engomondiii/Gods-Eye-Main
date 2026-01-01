// ========================================
// SETTINGS SCREEN - SHARED
// Backend Integration: Notification Preferences API
// ========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Card, Title, Switch, Divider, Button, ActivityIndicator } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBiometric } from '../../hooks/useBiometric';
import * as notificationService from '../../services/notificationService';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const SettingsScreen = ({ navigation }) => {
  const { isSupported, isEnrolled, checkSupport, testAuthentication } = useBiometric();
  
  const [isLoadingPreferences, setIsLoadingPreferences] = useState(true);
  const [isSavingPreferences, setIsSavingPreferences] = useState(false);
  
  const [settings, setSettings] = useState({
    darkMode: false,
    autoSync: true,
    biometricAuth: false,
  });

  // Notification Preferences (from backend)
  const [notificationPreferences, setNotificationPreferences] = useState({
    // Attendance
    attendance_email: true,
    attendance_sms: true,
    attendance_push: true,
    // Payment
    payment_email: true,
    payment_sms: true,
    payment_push: true,
    // General
    general_email: true,
    general_sms: false,
    general_push: true,
    // Academic
    academic_email: true,
    academic_sms: false,
    academic_push: true,
    // Emergency (always enabled)
    emergency_email: true,
    emergency_sms: true,
    emergency_push: true,
  });

  useEffect(() => {
    checkBiometricAvailability();
    loadNotificationPreferences();
  }, []);

  const checkBiometricAvailability = async () => {
    await checkSupport();
  };

  // Load notification preferences from backend
  const loadNotificationPreferences = async () => {
    try {
      setIsLoadingPreferences(true);
      const response = await notificationService.getMyPreferences();

      if (response.success) {
        setNotificationPreferences({
          attendance_email: response.data.attendance_email,
          attendance_sms: response.data.attendance_sms,
          attendance_push: response.data.attendance_push,
          payment_email: response.data.payment_email,
          payment_sms: response.data.payment_sms,
          payment_push: response.data.payment_push,
          general_email: response.data.general_email,
          general_sms: response.data.general_sms,
          general_push: response.data.general_push,
          academic_email: response.data.academic_email,
          academic_sms: response.data.academic_sms,
          academic_push: response.data.academic_push,
          emergency_email: response.data.emergency_email,
          emergency_sms: response.data.emergency_sms,
          emergency_push: response.data.emergency_push,
        });
      }
    } catch (error) {
      console.error('Failed to load notification preferences:', error);
      Alert.alert('Error', 'Failed to load notification preferences');
    } finally {
      setIsLoadingPreferences(false);
    }
  };

  // Save notification preferences to backend
  const saveNotificationPreferences = async (updatedPreferences) => {
    try {
      setIsSavingPreferences(true);
      const response = await notificationService.updatePreferences(updatedPreferences);

      if (response.success) {
        setNotificationPreferences(response.data);
        // Optional: Show success message
        // Alert.alert('Success', 'Preferences updated successfully');
      } else {
        throw new Error(response.message || 'Failed to update preferences');
      }
    } catch (error) {
      console.error('Failed to save notification preferences:', error);
      Alert.alert('Error', 'Failed to save notification preferences');
      // Revert changes on error
      await loadNotificationPreferences();
    } finally {
      setIsSavingPreferences(false);
    }
  };

  const handleToggle = (setting) => {
    // Biometric auth toggle
    if (setting === 'biometricAuth') {
      if (!isSupported || !isEnrolled) {
        Alert.alert(
          'Biometric Not Available',
          'Biometric authentication is not available on this device or no biometrics are enrolled.',
          [{ text: 'OK' }]
        );
        return;
      }
      
      if (!settings.biometricAuth) {
        testBiometricBeforeEnable();
        return;
      }
    }
    
    setSettings({ ...settings, [setting]: !settings[setting] });
    // TODO: Save app settings to AsyncStorage
  };

  // Handle notification preference toggle
  const handleNotificationToggle = (preference) => {
    // Prevent disabling emergency notifications
    if (preference.startsWith('emergency_')) {
      Alert.alert(
        'Emergency Notifications',
        'Emergency notifications cannot be disabled for your safety.',
        [{ text: 'OK' }]
      );
      return;
    }

    const updatedPreferences = {
      ...notificationPreferences,
      [preference]: !notificationPreferences[preference],
    };

    setNotificationPreferences(updatedPreferences);
    saveNotificationPreferences(updatedPreferences);
  };

  const testBiometricBeforeEnable = async () => {
    try {
      const result = await testAuthentication();
      if (result.success) {
        setSettings({ ...settings, biometricAuth: true });
        Alert.alert('Success', 'Biometric authentication enabled!');
      } else {
        Alert.alert('Authentication Failed', result.message);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to test biometric authentication');
    }
  };

  const SettingItem = ({ icon, title, description, setting, switchValue, onToggle }) => (
    <>
      <View style={styles.settingItem}>
        <View style={styles.settingInfo}>
          <MaterialCommunityIcons name={icon} size={24} color="#757575" />
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>{title}</Text>
            {description && (
              <Text style={styles.settingDescription}>{description}</Text>
            )}
          </View>
        </View>
        {switchValue !== undefined ? (
          <Switch
            value={switchValue}
            onValueChange={onToggle || (() => handleToggle(setting))}
            color="#6200EE"
            disabled={isSavingPreferences}
          />
        ) : (
          <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
        )}
      </View>
      <Divider />
    </>
  );

  const NotificationChannelSection = ({ type, title, icon, description }) => (
    <View style={styles.channelSection}>
      <View style={styles.channelHeader}>
        <MaterialCommunityIcons name={icon} size={20} color="#6200EE" />
        <Text style={styles.channelTitle}>{title}</Text>
      </View>
      {description && (
        <Text style={styles.channelDescription}>{description}</Text>
      )}
      
      <View style={styles.channelToggles}>
        <View style={styles.channelToggle}>
          <MaterialCommunityIcons name="email" size={18} color="#757575" />
          <Text style={styles.channelToggleLabel}>Email</Text>
          <Switch
            value={notificationPreferences[`${type}_email`]}
            onValueChange={() => handleNotificationToggle(`${type}_email`)}
            color="#6200EE"
            disabled={isSavingPreferences || type === 'emergency'}
          />
        </View>
        
        <View style={styles.channelToggle}>
          <MaterialCommunityIcons name="message" size={18} color="#757575" />
          <Text style={styles.channelToggleLabel}>SMS</Text>
          <Switch
            value={notificationPreferences[`${type}_sms`]}
            onValueChange={() => handleNotificationToggle(`${type}_sms`)}
            color="#6200EE"
            disabled={isSavingPreferences || type === 'emergency'}
          />
        </View>
        
        <View style={styles.channelToggle}>
          <MaterialCommunityIcons name="bell" size={18} color="#757575" />
          <Text style={styles.channelToggleLabel}>Push</Text>
          <Switch
            value={notificationPreferences[`${type}_push`]}
            onValueChange={() => handleNotificationToggle(`${type}_push`)}
            color="#6200EE"
            disabled={isSavingPreferences || type === 'emergency'}
          />
        </View>
      </View>
      
      {type === 'emergency' && (
        <Text style={styles.emergencyNote}>
          ⚠️ Emergency notifications are always enabled for your safety
        </Text>
      )}
    </View>
  );

  const ActionItem = ({ icon, title, onPress, color = '#212121' }) => (
    <>
      <TouchableOpacity style={styles.actionItem} onPress={onPress}>
        <MaterialCommunityIcons name={icon} size={24} color={color} />
        <Text style={[styles.actionText, { color }]}>{title}</Text>
        <MaterialCommunityIcons name="chevron-right" size={24} color={color} />
      </TouchableOpacity>
      <Divider />
    </>
  );

  if (isLoadingPreferences) {
    return <LoadingSpinner message="Loading preferences..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Notification Preferences */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.sectionHeader}>
            <Title style={styles.sectionTitle}>Notification Preferences</Title>
            {isSavingPreferences && (
              <ActivityIndicator size="small" color="#6200EE" />
            )}
          </View>
          
          <Text style={styles.sectionDescription}>
            Customize how you receive notifications for different types of events
          </Text>

          {/* Attendance Notifications */}
          <NotificationChannelSection
            type="attendance"
            title="Attendance Notifications"
            icon="calendar-check"
            description="Receive updates about student attendance, check-ins, and absences"
          />

          <Divider style={styles.sectionDivider} />

          {/* Payment Notifications */}
          <NotificationChannelSection
            type="payment"
            title="Payment Notifications"
            icon="cash"
            description="Get notified about payment requests, reminders, and confirmations"
          />

          <Divider style={styles.sectionDivider} />

          {/* Academic Notifications */}
          <NotificationChannelSection
            type="academic"
            title="Academic Notifications"
            icon="school"
            description="Updates about grades, assignments, and academic progress"
          />

          <Divider style={styles.sectionDivider} />

          {/* General Notifications */}
          <NotificationChannelSection
            type="general"
            title="General Notifications"
            icon="bell"
            description="General announcements and school updates"
          />

          <Divider style={styles.sectionDivider} />

          {/* Emergency Notifications */}
          <NotificationChannelSection
            type="emergency"
            title="Emergency Notifications"
            icon="alert"
            description="Critical alerts that require immediate attention"
          />
        </Card.Content>
      </Card>

      {/* Security & Biometric Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Security & Biometric</Title>
          
          {/* Biometric Status */}
          <View style={styles.biometricStatusContainer}>
            <View style={styles.biometricStatusRow}>
              <MaterialCommunityIcons 
                name={isSupported ? "shield-check" : "shield-off"} 
                size={24} 
                color={isSupported ? "#4CAF50" : "#757575"} 
              />
              <View style={styles.biometricStatusText}>
                <Text style={styles.biometricStatusTitle}>Biometric Status</Text>
                <Text style={styles.biometricStatusDescription}>
                  {isSupported 
                    ? isEnrolled 
                      ? 'Available and enrolled' 
                      : 'Available but not enrolled'
                    : 'Not available on this device'}
                </Text>
              </View>
            </View>
            {isSupported && isEnrolled && (
              <Button 
                mode="text" 
                onPress={testBiometricBeforeEnable}
                compact
              >
                Test
              </Button>
            )}
          </View>

          <Divider />

          <SettingItem
            icon="fingerprint"
            title="Biometric Authentication"
            description={
              isSupported 
                ? "Use fingerprint or face ID to login"
                : "Not available on this device"
            }
            setting="biometricAuth"
            switchValue={settings.biometricAuth}
          />
          
          <ActionItem
            icon="shield-key"
            title="Manage Biometric Data"
            onPress={() => Alert.alert('Manage Biometric', 'Navigate to biometric management')}
          />
        </Card.Content>
      </Card>

      {/* App Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>App Settings</Title>
          
          <SettingItem
            icon="theme-light-dark"
            title="Dark Mode"
            description="Use dark theme for the app"
            setting="darkMode"
            switchValue={settings.darkMode}
          />
          
          <SettingItem
            icon="sync"
            title="Auto Sync"
            description="Automatically sync data in the background"
            setting="autoSync"
            switchValue={settings.autoSync}
          />
        </Card.Content>
      </Card>

      {/* Account Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Account</Title>
          
          <ActionItem
            icon="lock-reset"
            title="Change Password"
            onPress={() => Alert.alert('Change Password', 'Feature coming soon!')}
          />
          
          <ActionItem
            icon="phone"
            title="Update Phone Number"
            onPress={() => Alert.alert('Update Phone', 'Feature coming soon!')}
          />
          
          <ActionItem
            icon="email-edit"
            title="Update Email"
            onPress={() => Alert.alert('Update Email', 'Feature coming soon!')}
          />
        </Card.Content>
      </Card>

      {/* Privacy & Security */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Privacy & Security</Title>
          
          <ActionItem
            icon="shield-account"
            title="Privacy Policy"
            onPress={() => Alert.alert('Privacy Policy', 'Feature coming soon!')}
          />
          
          <ActionItem
            icon="file-document"
            title="Terms of Service"
            onPress={() => Alert.alert('Terms of Service', 'Feature coming soon!')}
          />
          
          <ActionItem
            icon="security"
            title="Data & Security"
            onPress={() => Alert.alert('Data & Security', 'Feature coming soon!')}
          />
        </Card.Content>
      </Card>

      {/* Danger Zone */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={[styles.sectionTitle, { color: '#F44336' }]}>Danger Zone</Title>
          
          <ActionItem
            icon="delete-forever"
            title="Delete Account"
            color="#F44336"
            onPress={() => {
              Alert.alert(
                'Delete Account',
                'Are you sure you want to delete your account? This action cannot be undone.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                      Alert.alert('Deleted', 'Account deletion initiated.');
                    },
                  },
                ]
              );
            }}
          />
        </Card.Content>
      </Card>

      {/* App Info */}
      <View style={styles.appInfo}>
        <Text style={styles.appInfoText}>God's Eye EdTech Platform</Text>
        <Text style={styles.appInfoText}>Version 1.0.0</Text>
        <Text style={styles.appInfoText}>© 2025 God's Eye Systems</Text>
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
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
  },
  sectionDescription: {
    fontSize: 13,
    color: '#757575',
    marginBottom: 16,
    lineHeight: 18,
  },
  sectionDivider: {
    marginVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  settingInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 16,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 2,
  },
  settingDescription: {
    fontSize: 12,
    color: '#757575',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  actionText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 16,
  },
  biometricStatusContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  biometricStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  biometricStatusText: {
    marginLeft: 12,
    flex: 1,
  },
  biometricStatusTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212121',
  },
  biometricStatusDescription: {
    fontSize: 12,
    color: '#757575',
    marginTop: 2,
  },
  // Notification Channel Styles
  channelSection: {
    marginBottom: 16,
  },
  channelHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  channelTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212121',
    marginLeft: 8,
  },
  channelDescription: {
    fontSize: 12,
    color: '#757575',
    marginBottom: 12,
    lineHeight: 16,
  },
  channelToggles: {
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
    padding: 12,
  },
  channelToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  channelToggleLabel: {
    fontSize: 14,
    color: '#212121',
    flex: 1,
    marginLeft: 12,
  },
  emergencyNote: {
    fontSize: 11,
    color: '#F44336',
    marginTop: 8,
    fontStyle: 'italic',
  },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  appInfoText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 4,
  },
});

export default SettingsScreen;