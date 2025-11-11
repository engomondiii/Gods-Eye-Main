import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// 🆕 School Admin Screens - Existing
import SchoolAdminDashboardScreen from '../screens/schooladmin/SchoolAdminDashboardScreen';
import SchoolTeachersManagementScreen from '../screens/schooladmin/SchoolTeachersManagementScreen';
import SchoolStudentsOverviewScreen from '../screens/schooladmin/SchoolStudentsOverviewScreen';
import SchoolReportsScreen from '../screens/schooladmin/SchoolReportsScreen';
import SchoolSettingsScreen from '../screens/schooladmin/SchoolSettingsScreen';

// 🆕 NEW - Management Screens
import ManageTeachersScreen from '../screens/schooladmin/ManageTeachersScreen';
import AddTeacherScreen from '../screens/schooladmin/AddTeacherScreen';
import ManageStudentsScreen from '../screens/schooladmin/ManageStudentsScreen';
import AddStudentScreen from '../screens/schooladmin/AddStudentScreen';
import ManageGuardiansScreen from '../screens/schooladmin/ManageGuardiansScreen';
import AddGuardianScreen from '../screens/schooladmin/AddGuardianScreen';
import SchoolAdminProfileScreen from '../screens/schooladmin/SchoolAdminProfileScreen';

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

// Teachers Stack - 🆕 UPDATED with new management screens
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
      {/* 🔧 FIXED - Set ManageTeachers as initial route */}
      <Stack.Screen 
        name={SCREENS.MANAGE_TEACHERS} 
        component={ManageTeachersScreen}
        options={{ title: 'Manage Teachers' }}
      />
      <Stack.Screen 
        name={SCREENS.SCHOOL_TEACHERS_MANAGEMENT} 
        component={SchoolTeachersManagementScreen}
        options={{ title: 'Teachers Management' }}
      />
      <Stack.Screen 
        name={SCREENS.ADD_TEACHER} 
        component={AddTeacherScreen}
        options={{ title: 'Add Teacher' }}
      />
    </Stack.Navigator>
  );
};

// Students Stack - 🆕 UPDATED with new management screens
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
      {/* 🔧 FIXED - Set ManageStudents as initial route */}
      <Stack.Screen 
        name={SCREENS.MANAGE_STUDENTS} 
        component={ManageStudentsScreen}
        options={{ title: 'Manage Students' }}
      />
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
      <Stack.Screen 
        name={SCREENS.ADD_STUDENT} 
        component={AddStudentScreen}
        options={{ title: 'Add Student' }}
      />
    </Stack.Navigator>
  );
};

// 🆕 NEW - Guardians Stack
const GuardiansStack = () => {
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
        name={SCREENS.MANAGE_GUARDIANS} 
        component={ManageGuardiansScreen}
        options={{ title: 'Guardians Management' }}
      />
      <Stack.Screen 
        name={SCREENS.ADD_GUARDIAN} 
        component={AddGuardianScreen}
        options={{ title: 'Add Guardian' }}
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

// 🔧 FIXED - Profile Stack with correct initial screen
const ProfileStack = () => {
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
      {/* 🔧 FIXED - School Admin Profile is now the FIRST/INITIAL screen */}
      <Stack.Screen 
        name={SCREENS.SCHOOL_ADMIN_PROFILE} 
        component={SchoolAdminProfileScreen}
        options={{ title: 'My Profile' }}
      />
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
      {/* 🆕 NEW - Guardians Tab */}
      <Tab.Screen 
        name="GuardiansTab" 
        component={GuardiansStack}
        options={{
          tabBarLabel: 'Guardians',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-supervisor" size={size} color={color} />
          ),
        }}
      />
      {/* 🔧 FIXED - Profile Tab now goes to ProfileStack (which starts with SchoolAdminProfile) */}
      <Tab.Screen 
        name="ProfileTab" 
        component={ProfileStack}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default SchoolAdminNavigator;