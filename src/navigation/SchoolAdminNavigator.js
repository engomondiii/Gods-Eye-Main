import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 🆕 School Admin Screens
import SchoolAdminDashboardScreen from '../screens/schooladmin/SchoolAdminDashboardScreen';
import SchoolTeachersManagementScreen from '../screens/schooladmin/SchoolTeachersManagementScreen';
import SchoolStudentsOverviewScreen from '../screens/schooladmin/SchoolStudentsOverviewScreen';
import SchoolReportsScreen from '../screens/schooladmin/SchoolReportsScreen';
import SchoolSettingsScreen from '../screens/schooladmin/SchoolSettingsScreen';

// Reuse existing screens
import StudentDetailScreen from '../screens/teacher/StudentDetailScreen';
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

import { SCREENS } from '../utils/constants';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Dashboard Stack
const DashboardStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.SCHOOL_ADMIN_DASHBOARD} 
        component={SchoolAdminDashboardScreen}
        options={{ title: 'School Dashboard' }}
      />
      <Stack.Screen 
        name={SCREENS.NOTIFICATIONS} 
        component={NotificationsScreen}
        options={{ title: 'Notifications' }}
      />
    </Stack.Navigator>
  );
};

// Teachers Stack
const TeachersStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.SCHOOL_TEACHERS_MANAGEMENT} 
        component={SchoolTeachersManagementScreen}
        options={{ title: 'Teachers Management' }}
      />
    </Stack.Navigator>
  );
};

// Students Stack
const StudentsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.SCHOOL_STUDENTS_OVERVIEW} 
        component={SchoolStudentsOverviewScreen}
        options={{ title: 'Students Overview' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
    </Stack.Navigator>
  );
};

// Reports Stack
const ReportsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.SCHOOL_REPORTS} 
        component={SchoolReportsScreen}
        options={{ title: 'School Reports' }}
      />
    </Stack.Navigator>
  );
};

// Settings Stack
const SettingsStackNav = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#FF9800',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.SCHOOL_SETTINGS} 
        component={SchoolSettingsScreen}
        options={{ title: 'School Settings' }}
      />
      <Stack.Screen 
        name={SCREENS.PROFILE} 
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen 
        name={SCREENS.SETTINGS} 
        component={SettingsScreen}
        options={{ title: 'App Settings' }}
      />
    </Stack.Navigator>
  );
};

// Main School Admin Navigator with Bottom Tabs
const SchoolAdminNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#FF9800',
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
        }}
      />
      <Tab.Screen 
        name="TeachersTab" 
        component={TeachersStack}
        options={{
          tabBarLabel: 'Teachers',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-tie" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="StudentsTab" 
        component={StudentsStack}
        options={{
          tabBarLabel: 'Students',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-group" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ReportsTab" 
        component={ReportsStack}
        options={{
          tabBarLabel: 'Reports',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="chart-bar" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStackNav}
        options={{
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cog" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default SchoolAdminNavigator;