import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  Alert,
} from 'react-native';
import { Card, Title, List, Switch, Button, Divider, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as schoolAdminService from '../../services/schoolAdminService';

const SchoolSettingsScreen = ({ navigation }) => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [settings, setSettings] = useState({
    schoolName: user?.school?.name || '',
    nemisCode: user?.school?.nemis_code || '',
    phoneNumber: user?.school?.phone || '',
    email: user?.school?.email || '',
    address: user?.school?.address || '',
    enableBiometric: true,
    enableQRCode: true,
    enableOTC: true,
    autoMarkAbsent: true,
    attendanceGracePeriod: 15,
    requirePaymentApproval: true,
    autoSendReminders: true,
    reminderDaysBefore: 7,
    enableSMS: false,
    enableEmail: true,
    enablePushNotifications: true,
    currentTerm: 'term_1',
    academicYear: '2025',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await schoolAdminService.getSchoolSettings(user.school.id);
      if (response.success) {
        setSettings({
          ...settings,
          enableBiometric: response.data.enable_biometric,
          enableQRCode: response.data.enable_qr_code,
          enableOTC: response.data.enable_otc,
          autoMarkAbsent: response.data.auto_mark_absent,
          attendanceGracePeriod: response.data.attendance_grace_period,
          requirePaymentApproval: response.data.require_payment_approval,
          autoSendReminders: response.data.auto_send_reminders,
          reminderDaysBefore: response.data.reminder_days_before,
          enableSMS: response.data.enable_sms,
          enableEmail: response.data.enable_email,
          enablePushNotifications: response.data.enable_push_notifications,
          currentTerm: response.data.current_term,
          academicYear: response.data.academic_year,
        });
      }
    } catch (error) {
      console.error('Fetch settings error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = (key) => {
    setSettings({ ...settings, [key]: !settings[key] });
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    
    try {
      const settingsData = {
        enable_biometric: settings.enableBiometric,
        enable_qr_code: settings.enableQRCode,
        enable_otc: settings.enableOTC,
        auto_mark_absent: settings.autoMarkAbsent,
        attendance_grace_period: settings.attendanceGracePeriod,
        require_payment_approval: settings.requirePaymentApproval,
        auto_send_reminders: settings.autoSendReminders,
        reminder_days_before: settings.reminderDaysBefore,
        enable_sms: settings.enableSMS,
        enable_email: settings.enableEmail,
        enable_push_notifications: settings.enablePushNotifications,
        current_term: settings.currentTerm,
        academic_year: settings.academicYear,
      };

      const response = await schoolAdminService.updateSchoolSettings(
        user.school.id,
        settingsData
      );
      
      if (response.success) {
        Alert.alert('Success', 'School settings updated successfully!');
      } else {
        Alert.alert('Error', response.message || 'Failed to update settings');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to update settings. Please try again.');
      console.error('Save settings error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading settings..." />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Card style={styles.headerCard}>
        <Card.Content>
          <View style={styles.headerContent}>
            <MaterialCommunityIcons name="school" size={48} color="#FF9800" />
            <View style={styles.headerText}>
              <Title style={styles.schoolName}>{user?.school?.name}</Title>
              <Text style={styles.schoolType}>School Administrator Settings</Text>
            </View>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            <MaterialCommunityIcons name="cog" size={20} color="#212121" /> General Settings
          </Title>
          
          <TextInput
            label="School Name"
            mode="outlined"
            value={settings.schoolName}
            onChangeText={(text) => setSettings({ ...settings, schoolName: text })}
            style={styles.input}
          />
          
          <TextInput
            label="NEMIS Code"
            mode="outlined"
            value={settings.nemisCode}
            editable={false}
            style={styles.input}
          />
          
          <TextInput
            label="Phone Number"
            mode="outlined"
            value={settings.phoneNumber}
            onChangeText={(text) => setSettings({ ...settings, phoneNumber: text })}
            keyboardType="phone-pad"
            style={styles.input}
          />
          
          <TextInput
            label="Email Address"
            mode="outlined"
            value={settings.email}
            onChangeText={(text) => setSettings({ ...settings, email: text })}
            keyboardType="email-address"
            autoCapitalize="none"
            style={styles.input}
          />
          
          <TextInput
            label="School Address"
            mode="outlined"
            value={settings.address}
            onChangeText={(text) => setSettings({ ...settings, address: text })}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            <MaterialCommunityIcons name="clipboard-check" size={20} color="#212121" /> Attendance Settings
          </Title>
          
          <List.Item
            title="Enable Biometric Attendance"
            description="Allow fingerprint and face recognition"
            left={() => <MaterialCommunityIcons name="fingerprint" size={24} color="#4CAF50" />}
            right={() => (
              <Switch
                value={settings.enableBiometric}
                onValueChange={() => handleToggle('enableBiometric')}
                color="#FF9800"
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Enable QR Code Attendance"
            description="Allow attendance via QR code scanning"
            left={() => <MaterialCommunityIcons name="qrcode-scan" size={24} color="#2196F3" />}
            right={() => (
              <Switch
                value={settings.enableQRCode}
                onValueChange={() => handleToggle('enableQRCode')}
                color="#FF9800"
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Enable One-Time Code"
            description="Allow attendance via temporary codes"
            left={() => <MaterialCommunityIcons name="numeric" size={24} color="#9C27B0" />}
            right={() => (
              <Switch
                value={settings.enableOTC}
                onValueChange={() => handleToggle('enableOTC')}
                color="#FF9800"
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Auto-Mark Absent"
            description="Automatically mark students absent after cutoff"
            left={() => <MaterialCommunityIcons name="clock-alert" size={24} color="#F44336" />}
            right={() => (
              <Switch
                value={settings.autoMarkAbsent}
                onValueChange={() => handleToggle('autoMarkAbsent')}
                color="#FF9800"
              />
            )}
          />
          
          <TextInput
            label="Attendance Grace Period (minutes)"
            mode="outlined"
            value={settings.attendanceGracePeriod.toString()}
            onChangeText={(text) => setSettings({ ...settings, attendanceGracePeriod: parseInt(text) || 0 })}
            keyboardType="numeric"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            <MaterialCommunityIcons name="cash-multiple" size={20} color="#212121" /> Payment Settings
          </Title>
          
          <List.Item
            title="Require Payment Approval"
            description="Guardians must approve before payment"
            left={() => <MaterialCommunityIcons name="check-circle" size={24} color="#4CAF50" />}
            right={() => (
              <Switch
                value={settings.requirePaymentApproval}
                onValueChange={() => handleToggle('requirePaymentApproval')}
                color="#FF9800"
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Auto-Send Payment Reminders"
            description="Send automatic payment reminders"
            left={() => <MaterialCommunityIcons name="bell-ring" size={24} color="#FF9800" />}
            right={() => (
              <Switch
                value={settings.autoSendReminders}
                onValueChange={() => handleToggle('autoSendReminders')}
                color="#FF9800"
              />
            )}
          />
          
          <TextInput
            label="Reminder Days Before Due Date"
            mode="outlined"
            value={settings.reminderDaysBefore.toString()}
            onChangeText={(text) => setSettings({ ...settings, reminderDaysBefore: parseInt(text) || 0 })}
            keyboardType="numeric"
            style={styles.input}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            <MaterialCommunityIcons name="bell" size={20} color="#212121" /> Notification Settings
          </Title>
          
          <List.Item
            title="Enable SMS Notifications"
            description="Send SMS to guardians (requires credits)"
            left={() => <MaterialCommunityIcons name="message-text" size={24} color="#00BCD4" />}
            right={() => (
              <Switch
                value={settings.enableSMS}
                onValueChange={() => handleToggle('enableSMS')}
                color="#FF9800"
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Enable Email Notifications"
            description="Send email notifications to guardians"
            left={() => <MaterialCommunityIcons name="email" size={24} color="#2196F3" />}
            right={() => (
              <Switch
                value={settings.enableEmail}
                onValueChange={() => handleToggle('enableEmail')}
                color="#FF9800"
              />
            )}
          />
          <Divider />
          
          <List.Item
            title="Enable Push Notifications"
            description="Send in-app push notifications"
            left={() => <MaterialCommunityIcons name="cellphone" size={24} color="#9C27B0" />}
            right={() => (
              <Switch
                value={settings.enablePushNotifications}
                onValueChange={() => handleToggle('enablePushNotifications')}
                color="#FF9800"
              />
            )}
          />
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.cardTitle}>
            <MaterialCommunityIcons name="calendar-month" size={20} color="#212121" /> Academic Settings
          </Title>
          
          <TextInput
            label="Current Academic Year"
            mode="outlined"
            value={settings.academicYear}
            onChangeText={(text) => setSettings({ ...settings, academicYear: text })}
            keyboardType="numeric"
            style={styles.input}
          />
          
          <TextInput
            label="Current Term"
            mode="outlined"
            value={settings.currentTerm}
            editable={false}
            style={styles.input}
            right={<TextInput.Icon icon="menu-down" />}
          />
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handleSaveSettings}
        loading={isSaving}
        disabled={isSaving}
        style={styles.saveButton}
        contentStyle={styles.saveButtonContent}
        icon="content-save"
      >
        {isSaving ? 'Saving Settings...' : 'Save All Settings'}
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
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 16,
    flex: 1,
  },
  schoolName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
  },
  schoolType: {
    fontSize: 14,
    color: '#757575',
    marginTop: 4,
  },
  card: {
    marginBottom: 16,
    elevation: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 16,
  },
  input: {
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#FF9800',
    marginBottom: 24,
  },
  saveButtonContent: {
    height: 50,
  },
});

export default SchoolSettingsScreen;