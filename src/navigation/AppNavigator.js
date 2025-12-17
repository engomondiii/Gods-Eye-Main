// ========================================
// GOD'S EYE EDTECH - APP NAVIGATOR
// ========================================

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import TeacherNavigator from './TeacherNavigator';
import GuardianNavigator from './GuardianNavigator';
import SchoolAdminNavigator from './SchoolAdminNavigator';
import AdminNavigator from './AdminNavigator';
import { USER_ROLES } from '../utils/constants';

const Stack = createStackNavigator();

// ============================================================
// APP NAVIGATOR
// ============================================================

const AppNavigator = () => {
  const { user, isLoading, userRole, checkAuthStatus, isAuthenticated } = useAuth();

  // ============================================================
  // INITIALIZATION
  // ============================================================

  /**
   * Check authentication status on app mount
   */
  useEffect(() => {
    if (__DEV__) {
      console.log('🧭 AppNavigator mounted - checking auth status');
    }
    checkAuthStatus();
  }, []);

  /**
   * Log navigation state changes for debugging
   */
  useEffect(() => {
    if (__DEV__) {
      console.log('🧭 Navigation State:', {
        isAuthenticated,
        hasUser: !!user,
        userRole,
        username: user?.username,
      });
    }
  }, [isAuthenticated, user, userRole]);

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (isLoading) {
    if (__DEV__) {
      console.log('⏳ AppNavigator: Loading...');
    }

    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  // ============================================================
  // NAVIGATION CONFIGURATION
  // ============================================================

  /**
   * Get appropriate navigator based on user role
   * Priority: Super Admin > School Admin > Teacher > Guardian
   */
  const getNavigator = () => {
    // Not authenticated - show auth screens
    if (!isAuthenticated || !user) {
      if (__DEV__) {
        console.log('🔒 User not authenticated - showing AuthNavigator');
      }
      return <Stack.Screen name="Auth" component={AuthNavigator} />;
    }

    // Check user role and return appropriate navigator
    switch (userRole) {
      case USER_ROLES.SUPER_ADMIN:
        if (__DEV__) {
          console.log('👑 Super Admin role detected - showing AdminNavigator');
        }
        return <Stack.Screen name="SuperAdmin" component={AdminNavigator} />;

      case USER_ROLES.SCHOOL_ADMIN:
        if (__DEV__) {
          console.log('🏫 School Admin role detected - showing SchoolAdminNavigator');
        }
        return <Stack.Screen name="SchoolAdmin" component={SchoolAdminNavigator} />;

      case USER_ROLES.TEACHER:
        if (__DEV__) {
          console.log('👨‍🏫 Teacher role detected - showing TeacherNavigator');
        }
        return <Stack.Screen name="Teacher" component={TeacherNavigator} />;

      case USER_ROLES.GUARDIAN:
        if (__DEV__) {
          console.log('👨‍👩‍👧 Guardian role detected - showing GuardianNavigator');
        }
        return <Stack.Screen name="Guardian" component={GuardianNavigator} />;

      default:
        // Role not recognized - show error or fallback to auth
        if (__DEV__) {
          console.error('❌ Unknown user role:', userRole);
          console.error('User flags:', {
            is_superadmin: user?.is_superadmin,
            is_school_admin: user?.is_school_admin,
            is_teacher: user?.is_teacher,
            is_guardian: user?.is_guardian,
          });
        }
        return (
          <Stack.Screen name="RoleError" component={RoleErrorScreen} />
        );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {getNavigator()}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

// ============================================================
// ROLE ERROR SCREEN
// ============================================================

/**
 * Error screen shown when user has no valid role
 */
const RoleErrorScreen = () => {
  const { logout, user } = useAuth();

  if (__DEV__) {
    console.log('🚨 RoleErrorScreen displayed for user:', user?.username);
  }

  return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorTitle}>Role Not Assigned</Text>
      <Text style={styles.errorMessage}>
        Your account does not have a valid role assigned.
        Please contact your administrator.
      </Text>
      
      {__DEV__ && (
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Debug Information:</Text>
          <Text style={styles.debugText}>
            Username: {user?.username || 'N/A'}{'\n'}
            Email: {user?.email || 'N/A'}{'\n'}
            Super Admin: {user?.is_superadmin ? 'Yes' : 'No'}{'\n'}
            School Admin: {user?.is_school_admin ? 'Yes' : 'No'}{'\n'}
            Teacher: {user?.is_teacher ? 'Yes' : 'No'}{'\n'}
            Guardian: {user?.is_guardian ? 'Yes' : 'No'}
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={logout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#757575',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 24,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#B00020',
    marginBottom: 16,
  },
  errorMessage: {
    fontSize: 16,
    color: '#212121',
    textAlign: 'center',
    marginBottom: 24,
  },
  debugContainer: {
    backgroundColor: '#F5F5F5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#757575',
    fontFamily: 'monospace',
  },
  logoutButton: {
    backgroundColor: '#6200EE',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  logoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// ============================================================
// EXPORTS
// ============================================================

export default AppNavigator;