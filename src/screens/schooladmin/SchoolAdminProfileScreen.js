import React from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { List, Avatar, Divider, Button, Text } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

const SchoolAdminProfileScreen = ({ navigation }) => {
  const { user, logout } = useAuth();

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

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be available soon.');
  };

  const getInitials = () => {
    if (user?.first_name && user?.last_name) {
      return `${user.first_name[0]}${user.last_name[0]}`.toUpperCase();
    }
    return 'SA';
  };

  return (
    <ScrollView style={styles.container}>
      {/* Profile Header */}
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={getInitials()}
          style={styles.avatar}
        />
        <Text style={styles.name}>
          {user?.first_name} {user?.middle_name} {user?.last_name}
        </Text>
        <Text style={styles.role}>School Administrator</Text>
        {user?.school && (
          <View style={styles.schoolBadge}>
            <MaterialCommunityIcons name="school" size={16} color="#6200EE" />
            <Text style={styles.schoolName}>{user.school.name}</Text>
          </View>
        )}
      </View>

      <Divider style={styles.divider} />

      {/* Account Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account Information</Text>
        
        <List.Item
          title="Email"
          description={user?.email || 'Not set'}
          left={(props) => <List.Icon {...props} icon="email" />}
          style={styles.listItem}
        />
        
        <List.Item
          title="Phone"
          description={user?.phone || 'Not set'}
          left={(props) => <List.Icon {...props} icon="phone" />}
          style={styles.listItem}
        />
        
        <List.Item
          title="Username"
          description={user?.username || 'Not set'}
          left={(props) => <List.Icon {...props} icon="account" />}
          style={styles.listItem}
        />

        {user?.school && (
          <>
            <List.Item
              title="School"
              description={user.school.name}
              left={(props) => <List.Icon {...props} icon="school" />}
              style={styles.listItem}
            />
            
            <List.Item
              title="NEMIS Code"
              description={user.school.nemis_code}
              left={(props) => <List.Icon {...props} icon="identifier" />}
              style={styles.listItem}
            />
          </>
        )}
      </View>

      <Divider style={styles.divider} />

      {/* Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        
        <List.Item
          title="Change Password"
          description="Update your account password"
          left={(props) => <List.Icon {...props} icon="lock-reset" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleChangePassword}
          style={styles.listItem}
        />
        
        <List.Item
          title="Notifications"
          description="Manage notification preferences"
          left={(props) => <List.Icon {...props} icon="bell" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => Alert.alert('Notifications', 'This feature will be available soon.')}
          style={styles.listItem}
        />
        
        <List.Item
          title="Privacy"
          description="Privacy and security settings"
          left={(props) => <List.Icon {...props} icon="shield-account" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => Alert.alert('Privacy', 'This feature will be available soon.')}
          style={styles.listItem}
        />
      </View>

      <Divider style={styles.divider} />

      {/* Help & Support */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Help & Support</Text>
        
        <List.Item
          title="Help Center"
          description="Get help and support"
          left={(props) => <List.Icon {...props} icon="help-circle" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => Alert.alert('Help Center', 'This feature will be available soon.')}
          style={styles.listItem}
        />
        
        <List.Item
          title="About"
          description="App version and information"
          left={(props) => <List.Icon {...props} icon="information" />}
          right={(props) => <List.Icon {...props} icon="chevron-right" />}
          onPress={() => Alert.alert('About', "God's Eye EdTech Platform\nVersion 1.0.0")}
          style={styles.listItem}
        />
      </View>

      {/* Logout Button */}
      <View style={styles.logoutContainer}>
        <Button
          mode="contained"
          onPress={handleLogout}
          style={styles.logoutButton}
          contentStyle={styles.logoutButtonContent}
          icon="logout"
          buttonColor="#D32F2F"
        >
          Logout
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#FFFFFF',
  },
  avatar: {
    backgroundColor: '#6200EE',
    marginBottom: 16,
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  role: {
    fontSize: 14,
    color: '#757575',
    marginBottom: 8,
  },
  schoolBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3E5F5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginTop: 8,
  },
  schoolName: {
    fontSize: 13,
    color: '#6200EE',
    fontWeight: '600',
    marginLeft: 6,
  },
  divider: {
    marginVertical: 8,
  },
  section: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 8,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200EE',
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
  },
  listItem: {
    paddingVertical: 8,
  },
  logoutContainer: {
    padding: 16,
    marginTop: 16,
    marginBottom: 32,
  },
  logoutButton: {
    borderRadius: 8,
  },
  logoutButtonContent: {
    height: 50,
  },
});

export default SchoolAdminProfileScreen;