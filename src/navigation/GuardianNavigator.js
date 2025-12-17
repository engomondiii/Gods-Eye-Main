// ========================================
// GOD'S EYE EDTECH - GUARDIAN NAVIGATOR
// ========================================

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Guardian Screens
import GuardianDashboardScreen from '../screens/guardian/GuardianDashboardScreen';
import MyStudentsScreen from '../screens/guardian/MyStudentsScreen';
import StudentDetailScreen from '../screens/guardian/StudentDetailScreen';
import PendingApprovalsScreen from '../screens/guardian/PendingApprovalsScreen';
import PaymentRequestsScreen from '../screens/guardian/PaymentRequestsScreen';

// Attendance Screens (Guardian View)
import AttendanceHistoryScreen from '../screens/attendance/AttendanceHistoryScreen';
import StudentQRCodeScreen from '../screens/attendance/StudentQRCodeScreen';
import BiometricSetupScreen from '../screens/attendance/BiometricSetupScreen';

// Shared Screens
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
        name={SCREENS.GUARDIAN_DASHBOARD} 
        component={GuardianDashboardScreen}
        options={{ 
          title: 'Dashboard',
          headerRight: () => (
            <MaterialCommunityIcons 
              name="bell-outline" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 15 }}
            />
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
// MY STUDENTS STACK (WITH ATTENDANCE FEATURES)
// ============================================================
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
        name={SCREENS.MY_STUDENTS} 
        component={MyStudentsScreen}
        options={{ title: 'My Students' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ 
          title: 'Student Details',
          headerRight: () => (
            <MaterialCommunityIcons 
              name="qrcode" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
      {/* Attendance Features */}
      <Stack.Screen 
        name={SCREENS.STUDENT_QR_CODE} 
        component={StudentQRCodeScreen}
        options={{ 
          title: 'Student QR Code',
          headerRight: () => (
            <MaterialCommunityIcons 
              name="share-variant" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
      <Stack.Screen 
        name={SCREENS.BIOMETRIC_SETUP} 
        component={BiometricSetupScreen}
        options={{ title: 'Biometric Setup' }}
      />
      <Stack.Screen 
        name={SCREENS.ATTENDANCE_HISTORY} 
        component={AttendanceHistoryScreen}
        options={{ 
          title: 'Attendance History',
          headerRight: () => (
            <MaterialCommunityIcons 
              name="calendar-month" 
              size={24} 
              color="#fff" 
              style={{ marginRight: 15 }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
};

// ============================================================
// APPROVALS STACK
// ============================================================
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
        name={SCREENS.PENDING_APPROVALS} 
        component={PendingApprovalsScreen}
        options={{ title: 'Pending Approvals' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
      />
    </Stack.Navigator>
  );
};

// ============================================================
// PAYMENTS STACK
// ============================================================
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
        name={SCREENS.PAYMENT_REQUESTS} 
        component={PaymentRequestsScreen}
        options={{ title: 'Payment Requests' }}
      />
      <Stack.Screen 
        name={SCREENS.STUDENT_DETAIL} 
        component={StudentDetailScreen}
        options={{ title: 'Student Details' }}
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

// ============================================================
// MAIN GUARDIAN NAVIGATOR WITH BOTTOM TABS
// ============================================================
const GuardianNavigator = () => {
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
        }}
      />
      <Tab.Screen 
        name="StudentsTab" 
        component={StudentsStack}
        options={{
          tabBarLabel: 'My Students',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account-multiple" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ApprovalsTab" 
        component={ApprovalsStack}
        options={{
          tabBarLabel: 'Approvals',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="clipboard-check" size={size} color={color} />
          ),
          tabBarBadge: null, // Can add badge count here for pending approvals
        }}
      />
      <Tab.Screen 
        name="PaymentsTab" 
        component={PaymentsStack}
        options={{
          tabBarLabel: 'Payments',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cash" size={size} color={color} />
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

export default GuardianNavigator;