import React, { useEffect } from 'react';
import { View, StyleSheet, Image, Text } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import { SCREENS } from '../../utils/constants';

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Display splash screen for at least 2 seconds
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to login screen
      // The auth check will happen in AppNavigator
      navigation.replace(SCREENS.LOGIN);
    } catch (error) {
      console.error('Initialization error:', error);
      // Even if there's an error, navigate to login
      navigation.replace(SCREENS.LOGIN);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* App Name */}
        <Text style={styles.appName}>God's Eye</Text>
        <Text style={styles.tagline}>EdTech Platform</Text>

        {/* Loading Indicator */}
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#6200EE" />
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Powered by God's Eye Systems</Text>
        <Text style={styles.versionText}>Version 1.0.0</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  logo: {
    width: 120,
    height: 120,
  },
  appName: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#6200EE',
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#757575',
    marginBottom: 40,
  },
  loaderContainer: {
    marginTop: 20,
  },
  footer: {
    paddingBottom: 40,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 12,
    color: '#9E9E9E',
    marginBottom: 4,
  },
  versionText: {
    fontSize: 10,
    color: '#BDBDBD',
  },
});

export default SplashScreen;