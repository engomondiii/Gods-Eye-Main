import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View, Text } from 'react-native';
import { useUnreadCount } from '../components/common/NotificationBadge';

// Teacher Screens
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import StudentListScreen from '../screens/teacher/StudentListScreen';
import StudentDetailScreen from '../screens/teacher/StudentDetailScreen';
import CreateStudentScreen from '../screens/teacher/CreateStudentScreen';
import ClassSelectionScreen from '../screens/teacher/ClassSelectionScreen';

// Attendance Screens
import ManualAttendanceScreen from '../screens/attendance/ManualAttendanceScreen';
import AttendanceSummaryScreen from '../screens/attendance/AttendanceSummaryScreen';
import AttendanceReportsScreen from '../screens/attendance/AttendanceReportsScreen';

// Shared Screens
import NotificationsScreen from '../screens/shared/NotificationsScreen';
import ProfileScreen from '../screens/shared/ProfileScreen';
import SettingsScreen from '../screens/shared/SettingsScreen';

import { SCREENS } from '../utils/constants';
import theme from '../styles/theme';

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
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.TEACHER_DASHBOARD} 
        component={TeacherDashboardScreen}
        options={{ 
          title: 'Dashboard',
          headerRight: () => (
            <View style={{ marginRight: 15, position: 'relative' }}>
              <MaterialCommunityIcons 
                name="bell-outline" 
                size={24} 
                color="#fff"
                onPress={() => {}} 
              />
              {unreadCount > 0 && (
                <View style={{
                  position: 'absolute',
                  right: -6,
                  top: -3,
                  backgroundColor: theme.colors.error,
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
// STUDENTS STACK
// ============================================================
const StudentsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen 
        name={SCREENS.STUDENT_LIST} 
        component={StudentListScreen}
        options={{ title: 'Students' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
      <Stack.Screen 
        name={SCREENS.CREATE_STUDENT} 
        component={CreateStudentScreen}
        options={{ title: 'Add New Student' }}
      />
    </Stack.Navigator>
  );
};
        name={SCREENS.ATTENDANCE_HISTORY} 
        component={AttendanceHistoryScreen}
        options={{ title: 'Attendance History' }}
      />
    </Stack.Navigator>
  );
};

// ============================================================
// ATTENDANCE STACK - MVP FOCUSED
// ============================================================
const AttendanceStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      {/* CLASS SELECTION - Primary screen for marking attendance */}
      <Stack.Screen 
        name="ClassSelection"
        component={ClassSelectionScreen}
        options={{ 
          title: 'Mark Attendance',
          headerLeft: () => null,
        }}
      />
      
      {/* MANUAL ATTENDANCE - Individual student marking */}
      <Stack.Screen 
        name="ManualAttendance"
        component={ManualAttendanceScreen}
        options={({ route }) => ({
          title: route.params?.className || 'Mark Attendance',
          headerBackTitle: 'Back',
        })}
      />
      
      {/* ATTENDANCE SUMMARY - View today's records */}
      <Stack.Screen 
        name="AttendanceSummary"
        component={AttendanceSummaryScreen}
        options={({ route }) => ({
          title: 'Today\'s Attendance',
          headerBackTitle: 'Back',
        })}
      />
      
      {/* ATTENDANCE REPORTS - View historical reports */}
      <Stack.Screen 
        name="AttendanceReports"
        component={AttendanceReportsScreen}
        options={{
          title: 'Attendance Reports',
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

// Settings Stack
const SettingsStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.primary,
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

// ============================================================
// MAIN TEACHER NAVIGATOR - MVP VERSION
// ============================================================

const TeacherNavigator = () => {
  const { unreadCount } = useUnreadCount();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.colors.surface,
          borderTopWidth: 1,
          borderTopColor: theme.colors.outlineVariant,
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
      {/* ATTENDANCE - Primary MVP Focus */}
      <Tab.Screen 
        name="AttendanceTab" 
        component={AttendanceStack}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-check" size={size} color={color} />
          ),
        }}
      />

      {/* DASHBOARD */}
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

      {/* STUDENTS */}
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

      {/* SETTINGS/PROFILE */}
      <Tab.Screen 
        name="SettingsTab" 
        component={SettingsStack}
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

export default TeacherNavigator;