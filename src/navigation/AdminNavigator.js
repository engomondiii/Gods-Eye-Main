import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useUnreadCount } from '../components/common/NotificationBadge';

// Admin Screens
import AdminDashboardScreen from '../screens/admin/AdminDashboardScreen';
import SchoolsListScreen from '../screens/admin/SchoolsListScreen';
import SchoolDetailScreen from '../screens/admin/SchoolDetailScreen';
import UsersManagementScreen from '../screens/admin/UsersManagementScreen';
import SystemStatisticsScreen from '../screens/admin/SystemStatisticsScreen';

// Shared Screens
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

import { SCREENS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack
const DashboardStack = () => {
  const { unreadCount } = useUnreadCount();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200EE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.ADMIN_DASHBOARD} 
        component={AdminDashboardScreen}
        options={{ 
          title: 'Admin Dashboard',
          headerRight: () => (
            <View style={{ marginRight: 15, position: 'relative' }}>
              <MaterialCommunityIcons 
                name="bell-outline" 
                size={24} 
                color="#fff"
              />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute',
                  right: -6,
                  top: -3,
                  backgroundColor: '#F44336',
                  borderRadius: 10,
                  minWidth: 18,
                  height: 18,
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 4,
                }}>
                  <Text style={{ color: '#fff', fontSize: 10, fontWeight: 'bold' }}>
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Stack.Screen 
        name={SCREENS.NOTIFICATIONS} 
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
    </Stack.Navigator>
  );
};

// Schools Stack
const SchoolsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200EE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.SCHOOLS_LIST} 
        component={SchoolsListScreen}
        options={{ title: 'Schools Management' }}
      />
      <Stack.Screen 
        name={SCREENS.SCHOOL_DETAIL} 
        component={SchoolDetailScreen}
        options={{ title: 'School Details' }}
      />
    </Stack.Navigator>
  );
};

// Users Stack
const UsersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200EE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.USERS_MANAGEMENT} 
        component={UsersManagementScreen}
        options={{ title: 'Users Management' }}
      />
    </Stack.Navigator>
  );
};

// System Stack
const SystemStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200EE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.SYSTEM_STATISTICS} 
        component={SystemStatisticsScreen}
        options={{ title: 'System Statistics' }}
      />
    </Stack.Navigator>
  );
};

// Profile Stack
const ProfileStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#6200EE',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.PROFILE} 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name={SCREENS.SETTINGS} 
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
    </Stack.Navigator>
  );
};

// Main Admin Navigator with Bottom Tabs
const AdminNavigator = () => {
  const { unreadCount } = useUnreadCount();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#6200EE',
        tabBarInactiveTintColor: '#757575',
        tabBarStyle: {
          backgroundColor: '#FFFFFF',
          borderTopWidth: 1,
          borderTopColor: '#E0E0E0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        },
      }}
    >
      <Tab.Screen 
        name="DashboardTab" 
        component={DashboardStack}
        options={{
          tabBarLabel: 'Dashboard',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="view-dashboard" size={size} color={color} />
          ),
          tabBarBadge: unreadCount > 0 ? unreadCount : undefined,
        }}
      />
      <Tab.Screen 
        name="SchoolsTab" 
        component={SchoolsStack}
        options={{
          tabBarLabel: 'Schools',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="school" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="UsersTab" 
        component={UsersStack}
        options={{
          tabBarLabel: 'Users',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="SystemTab" 
        component={SystemStack}
        options={{
          tabBarLabel: 'System',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-line" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default AdminNavigator;