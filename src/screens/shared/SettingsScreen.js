import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
  Alert,
} from 'react-native';
import { Card, Title, Switch, Divider, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useBiometric } from '../../hooks/useBiometric';

const SettingsScreen = ({ navigation }) => {
  const { isSupported, isEnrolled, checkSupport, testAuthentication } = useBiometric();
  
  const [settings, setSettings] = useState({
    pushNotifications: true,
    emailNotifications: false,
    smsNotifications: true,
    darkMode: false,
    // ✨ NEW - Biometric Settings
    biometricAuth: false,
    attendanceNotifications: true,
    qrCodeNotifications: true,
    autoSync: true,
  });

  // ✨ NEW - Check biometric availability on mount
  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    await checkSupport();
  };

  const handleToggle = (setting) => {
    // ✨ NEW - Special handling for biometric auth
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
        // Enabling biometric - test first
        testBiometricBeforeEnable();
        return;
      }
    }
    
    setSettings({ ...settings, [setting]: !settings[setting] });
    // TODO: Save settings to backend
  };

  // ✨ NEW - Test biometric before enabling
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

  const SettingItem = ({ icon, title, description, setting, switchValue }) => (
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
            onValueChange={() => handleToggle(setting)}
            color="#6200EE"
          />
        ) : (
          <MaterialCommunityIcons name="chevron-right" size={24} color="#757575" />
        )}
      </View>
      <Divider />
    </>
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

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Notifications Settings */}
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.sectionTitle}>Notifications</Title>
          
          <SettingItem
            icon="bell"
            title="Push Notifications"
            description="Receive push notifications on your device"
            setting="pushNotifications"
            switchValue={settings.pushNotifications}
          />
          
          <SettingItem
            icon="email"
            title="Email Notifications"
            description="Receive notifications via email"
            setting="emailNotifications"
            switchValue={settings.emailNotifications}
          />
          
          <SettingItem
            icon="message"
            title="SMS Notifications"
            description="Receive important updates via SMS"
            setting="smsNotifications"
            switchValue={settings.smsNotifications}
          />

          {/* ✨ NEW - Attendance Notifications */}
          <SettingItem
            icon="clipboard-check"
            title="Attendance Notifications"
            description="Get notified about student attendance"
            setting="attendanceNotifications"
            switchValue={settings.attendanceNotifications}
          />

          <SettingItem
            icon="qrcode"
            title="QR Code Notifications"
            description="Alerts when QR code is scanned"
            setting="qrCodeNotifications"
            switchValue={settings.qrCodeNotifications}
          />
        </Card.Content>
      </Card>

      {/* ✨ NEW - Security & Biometric Settings */}
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
                      // TODO: Implement account deletion
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
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
  // ✨ NEW - Biometric Status Styles
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