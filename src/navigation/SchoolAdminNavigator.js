import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useUnreadCount } from '../components/common/NotificationBadge';

// School Admin Screens - Existing
import SchoolAdminDashboardScreen from '../screens/schooladmin/SchoolAdminDashboardScreen';
import SchoolTeachersManagementScreen from '../screens/schooladmin/SchoolTeachersManagementScreen';
import SchoolStudentsOverviewScreen from '../screens/schooladmin/SchoolStudentsOverviewScreen';
import SchoolReportsScreen from '../screens/schooladmin/SchoolReportsScreen';
import SchoolSettingsScreen from '../screens/schooladmin/SchoolSettingsScreen';

// Management Screens
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

// ============================================================
// DASHBOARD STACK
// ============================================================
const DashboardStack = () => {
  const { unreadCount } = useUnreadCount();

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
        options={{ 
          title: 'School Dashboard',
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

// ============================================================
// TEACHERS STACK
// ============================================================
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
        name={SCREENS.MANAGE_TEACHERS} 
        component={ManageTeachersScreen}
        options={{ title: 'Manage Teachers' }}
      />
      <Stack.Screen 
        name={SCREENS.ADD_TEACHER} 
        component={AddTeacherScreen}
        options={{ title: 'Add Teacher' }}
      />
      <Stack.Screen 
        name={SCREENS.SCHOOL_TEACHERS_MANAGEMENT} 
        component={SchoolTeachersManagementScreen}
        options={{ title: 'Teachers Management' }}
      />
    </Stack.Navigator>
  );
};

// ============================================================
// STUDENTS STACK
// ============================================================
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
        name={SCREENS.MANAGE_STUDENTS} 
        component={ManageStudentsScreen}
        options={{ title: 'Manage Students' }}
      />
      <Stack.Screen 
        name={SCREENS.ADD_STUDENT} 
        component={AddStudentScreen}
        options={{ title: 'Add Student' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
      <Stack.Screen 
        name={SCREENS.MANAGE_GUARDIANS} 
        component={ManageGuardiansScreen}
        options={{ title: 'Link Guardian' }}
      />
      <Stack.Screen 
        name={SCREENS.ADD_GUARDIAN} 
        component={AddGuardianScreen}
        options={{ title: 'Add Guardian' }}
      />
      <Stack.Screen 
        name={SCREENS.SCHOOL_STUDENTS_OVERVIEW} 
        component={SchoolStudentsOverviewScreen}
        options={{ title: 'Students Overview' }}
      />
    </Stack.Navigator>
  );
};

// ============================================================
// REPORTS STACK
// ============================================================
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

// ============================================================
// PROFILE STACK
// ============================================================
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
        name={SCREENS.MANAGE_GUARDIANS} 
        component={ManageGuardiansScreen}
        options={{ title: 'Manage Guardians' }}
      />
      <Stack.Screen 
        name={SCREENS.ADD_GUARDIAN} 
        component={AddGuardianScreen}
        options={{ title: 'Add Guardian' }}
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

// ============================================================
// MAIN SCHOOL ADMIN NAVIGATOR - 5 BOTTOM TABS
// ============================================================
const SchoolAdminNavigator = () => {
  const { unreadCount } = useUnreadCount();

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
      {/* TAB 1: DASHBOARD */}
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

      {/* TAB 2: TEACHERS */}
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

      {/* TAB 3: STUDENTS */}
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

      {/* TAB 4: REPORTS */}
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

      {/* TAB 5: PROFILE */}
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