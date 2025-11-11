import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { TextInput, Button, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';

const LoginScreen = ({ navigation }) => {
  const { login, isLoading } = useAuth();

  // Form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Error state
  const [errors, setErrors] = useState({
    username: '',
    password: '',
    general: '',
  });

  // Validation
  const validateForm = () => {
    let isValid = true;
    const newErrors = {
      username: '',
      password: '',
      general: '',
    };

    // Username validation
    if (!username.trim()) {
      newErrors.username = 'Username is required';
      isValid = false;
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
      isValid = false;
    }

    // Password validation
    if (!password) {
      newErrors.password = 'Password is required';
      isValid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  // Handle login
  const handleLogin = async () => {
    // Clear previous errors
    setErrors({ username: '', password: '', general: '' });

    // Validate form
    if (!validateForm()) {
      return;
    }

    try {
      const result = await login(username.trim(), password);
      
      if (!result.success) {
        setErrors({
          ...errors,
          general: result.message || 'Login failed. Please check your credentials.',
        });
      }
      // If login is successful, AppNavigator will automatically redirect
      // to the appropriate role-based navigator
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        ...errors,
        general: 'An error occurred. Please try again.',
      });
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.appTitle}>God's Eye</Text>
          <Text style={styles.subtitle}>EdTech Platform</Text>
        </View>

        {/* Welcome Text */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Welcome Back!</Text>
          <Text style={styles.welcomeSubtext}>
            Sign in to continue to your account
          </Text>
        </View>

        {/* Development Mode Hint - UPDATED with 4 roles */}
        <View style={styles.devModeContainer}>
          <Text style={styles.devModeText}>Development Mode - Test Users</Text>
          <Text style={styles.devModeSubtext}>
            🔑 Super Admin: admin / password{'\n'}
            🏫 School Admin: schooladmin / password{'\n'}
            👨‍🏫 Teacher: teacher / password{'\n'}
            👨‍👩‍👧 Guardian: guardian / password
          </Text>
        </View>

        {/* Login Form */}
        <View style={styles.formSection}>
          {/* General Error Message */}
          {errors.general ? (
            <View style={styles.errorContainer}>
              <MaterialCommunityIcons name="alert-circle" size={20} color="#B00020" />
              <Text style={styles.errorText}>{errors.general}</Text>
            </View>
          ) : null}

          {/* Username Input */}
          <TextInput
            label="Username"
            mode="outlined"
            value={username}
            onChangeText={(text) => {
              setUsername(text);
              setErrors({ ...errors, username: '' });
            }}
            error={!!errors.username}
            style={styles.input}
            left={<TextInput.Icon icon="account" />}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
            disabled={isLoading}
            theme={{
              colors: {
                primary: '#6200EE',
              },
            }}
          />
          {errors.username ? (
            <HelperText type="error" visible={!!errors.username}>
              {errors.username}
            </HelperText>
          ) : null}

          {/* Password Input */}
          <TextInput
            label="Password"
            mode="outlined"
            value={password}
            onChangeText={(text) => {
              setPassword(text);
              setErrors({ ...errors, password: '' });
            }}
            error={!!errors.password}
            secureTextEntry={!showPassword}
            style={styles.input}
            left={<TextInput.Icon icon="lock" />}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            returnKeyType="done"
            onSubmitEditing={handleLogin}
            disabled={isLoading}
            theme={{
              colors: {
                primary: '#6200EE',
              },
            }}
          />
          {errors.password ? (
            <HelperText type="error" visible={!!errors.password}>
              {errors.password}
            </HelperText>
          ) : null}

          {/* Forgot Password Link */}
          <TouchableOpacity
            style={styles.forgotPasswordContainer}
            onPress={() => {
              // TODO: Implement forgot password functionality
              console.log('Forgot password pressed');
            }}
            disabled={isLoading}
          >
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <Button
            mode="contained"
            onPress={handleLogin}
            loading={isLoading}
            disabled={isLoading}
            style={styles.loginButton}
            contentStyle={styles.loginButtonContent}
            labelStyle={styles.loginButtonLabel}
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </Button>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Need help? Contact your school administrator
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 20,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 16,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#757575',
  },
  welcomeSection: {
    marginBottom: 16,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  welcomeSubtext: {
    fontSize: 14,
    color: '#757575',
  },
  devModeContainer: {
    backgroundColor: '#E8F5E9',
    padding: 12,
    borderRadius: 8,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#4CAF50',
  },
  devModeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 4,
  },
  devModeSubtext: {
    fontSize: 11,
    color: '#388E3C',
    lineHeight: 16,
  },
  formSection: {
    marginBottom: 24,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFEBEE',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    color: '#B00020',
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  input: {
    marginBottom: 8,
    backgroundColor: '#FFFFFF',
  },
  forgotPasswordContainer: {
    alignSelf: 'flex-end',
    marginTop: 8,
    marginBottom: 24,
  },
  forgotPasswordText: {
    color: '#6200EE',
    fontSize: 14,
    fontWeight: '600',
  },
  loginButton: {
    backgroundColor: '#6200EE',
    borderRadius: 8,
  },
  loginButtonContent: {
    height: 50,
  },
  loginButtonLabel: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    paddingTop: 24,
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    textAlign: 'center',
  },
});

export default LoginScreen;