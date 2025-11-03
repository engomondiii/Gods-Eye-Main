import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

import { useAuth } from '../hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import TeacherNavigator from './TeacherNavigator';
import GuardianNavigator from './GuardianNavigator';
import AdminNavigator from './AdminNavigator';
import { USER_ROLES } from '../utils/constants';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { user, isLoading, userRole, checkAuthStatus } = useAuth();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200EE" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!user ? (
          // User is not logged in - show Auth Navigator
          <Stack.Screen name="Auth" component={AuthNavigator} />
        ) : (
          // User is logged in - show appropriate navigator based on role
          <>
            {userRole === USER_ROLES.TEACHER && (
              <Stack.Screen name="Teacher" component={TeacherNavigator} />
            )}
            {userRole === USER_ROLES.GUARDIAN && (
              <Stack.Screen name="Guardian" component={GuardianNavigator} />
            )}
            {userRole === USER_ROLES.SUPER_ADMIN && (
              <Stack.Screen name="Admin" component={AdminNavigator} />
            )}
            {/* Fallback in case role is not recognized */}
            {!userRole && (
              <Stack.Screen name="Auth" component={AuthNavigator} />
            )}
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
});

export default AppNavigator;