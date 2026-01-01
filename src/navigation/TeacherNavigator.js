import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { View } from 'react-native';
import { useUnreadCount } from '../components/common/NotificationBadge';

// Teacher Screens
import TeacherDashboardScreen from '../screens/teacher/TeacherDashboardScreen';
import StudentListScreen from '../screens/teacher/StudentListScreen';
import StudentDetailScreen from '../screens/teacher/StudentDetailScreen';
import CreateStudentScreen from '../screens/teacher/CreateStudentScreen';
import GuardianLinkRequestsScreen from '../screens/teacher/GuardianLinkRequestsScreen';
import CreateGuardianLinkScreen from '../screens/teacher/CreateGuardianLinkScreen';
import CreatePaymentRequestScreen from '../screens/teacher/CreatePaymentRequestScreen';
import PaymentsListScreen from '../screens/teacher/PaymentsListScreen';

// Attendance Screens
import AttendanceDashboardScreen from '../screens/attendance/AttendanceDashboardScreen';
import CheckInScreen from '../screens/attendance/CheckInScreen';
import AttendanceHistoryScreen from '../screens/attendance/AttendanceHistoryScreen';
import ManualAttendanceScreen from '../screens/attendance/ManualAttendanceScreen';
import StudentQRCodeScreen from '../screens/attendance/StudentQRCodeScreen';
import BiometricSetupScreen from '../screens/attendance/BiometricSetupScreen';

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

// Students Stack
const StudentsStack = () => {
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
      <Stack.Screen 
        name={SCREENS.STUDENT_QR_CODE} 
        component={StudentQRCodeScreen}
        options={{ title: 'Student QR Code' }}
      />
      <Stack.Screen 
        name={SCREENS.BIOMETRIC_SETUP} 
        component={BiometricSetupScreen}
        options={{ title: 'Biometric Setup' }}
      />
      <Stack.Screen 
        name={SCREENS.ATTENDANCE_HISTORY} 
        component={AttendanceHistoryScreen}
        options={{ title: 'Attendance History' }}
      />
    </Stack.Navigator>
  );
};

// Attendance Stack
const AttendanceStack = () => {
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
        name={SCREENS.ATTENDANCE_DASHBOARD} 
        component={AttendanceDashboardScreen}
        options={{ 
          title: 'Attendance',
          headerRight: () => (
            <MaterialCommunityIcons 
              name="qrcode-scan" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
      <Stack.Screen 
        name={SCREENS.CHECK_IN} 
        component={CheckInScreen}
        options={{ title: 'Check In/Out' }}
      />
      <Stack.Screen 
        name={SCREENS.ATTENDANCE_HISTORY} 
        component={AttendanceHistoryScreen}
        options={{ title: 'Attendance History' }}
      />
      <Stack.Screen 
        name={SCREENS.MANUAL_ATTENDANCE} 
        component={ManualAttendanceScreen}
        options={{ title: 'Manual Attendance' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_QR_CODE} 
        component={StudentQRCodeScreen}
        options={{ title: 'Student QR Code' }}
      />
      <Stack.Screen 
        name={SCREENS.BIOMETRIC_SETUP} 
        component={BiometricSetupScreen}
        options={{ title: 'Biometric Setup' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
    </Stack.Navigator>
  );
};

// Approvals Stack
const ApprovalsStack = () => {
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
        name={SCREENS.GUARDIAN_LINK_REQUESTS} 
        component={GuardianLinkRequestsScreen}
        options={{ title: 'Guardian Approvals' }}
      />
      <Stack.Screen 
        name={SCREENS.CREATE_GUARDIAN_LINK} 
        component={CreateGuardianLinkScreen}
        options={{ title: 'Link Guardian' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
    </Stack.Navigator>
  );
};

// Payments Stack
const PaymentsStack = () => {
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
        name={SCREENS.PAYMENTS_LIST} 
        component={PaymentsListScreen}
        options={{ title: 'Payments' }}
      />
      <Stack.Screen 
        name={SCREENS.CREATE_PAYMENT_REQUEST} 
        component={CreatePaymentRequestScreen}
        options={{ title: 'Create Payment Request' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
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

// Main Teacher Navigator with Bottom Tabs
const TeacherNavigator = () => {
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
        name="AttendanceTab" 
        component={AttendanceStack}
        options={{
          tabBarLabel: 'Attendance',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-check" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ApprovalsTab" 
        component={ApprovalsStack}
        options={{
          tabBarLabel: 'Approvals',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check-circle" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="PaymentsTab" 
        component={PaymentsStack}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash-multiple" size={size} color={color} />
          ),
        }}
      />
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

export default TeacherNavigator;