import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import theme from '../../styles/theme';

const FingerprintScanner = ({ onSuccess, onFail, onCancel, studentId }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const compatible = await LocalAuthentication.hasHardwareAsync();
      const enrolled = await LocalAuthentication.isEnrolledAsync();
      
      setIsAvailable(compatible && enrolled);
    } catch (error) {
      console.error('Biometric check error:', error);
      setIsAvailable(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan fingerprint for attendance',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use passcode',
      });

      if (result.success) {
        onSuccess({
          studentId,
          method: 'fingerprint',
          timestamp: new Date().toISOString(),
        });
      } else {
        onFail('Authentication failed');
      }
    } catch (error) {
      console.error('Fingerprint error:', error);
      onFail(error.message);
    } finally {
      setIsScanning(false);
    }
  };

  if (!isAvailable) {
    return (
      <View style={styles.container}>
        <MaterialCommunityIcons 
          name="fingerprint-off" 
          size={100} 
          color={theme.colors.error} 
        />
        <Text style={styles.errorText}>
          Fingerprint authentication not available
        </Text>
        <Text style={styles.helperText}>
          Your device doesn't support fingerprint or no fingerprints are enrolled
        </Text>
        <Button mode="contained" onPress={onCancel} style={styles.button}>
          Use Another Method
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name={isScanning ? "fingerprint" : "fingerprint-off"} 
        size={120} 
        color={isScanning ? theme.colors.primary : theme.colors.textSecondary}
      />
      
      <Text style={styles.title}>
        {isScanning ? 'Scanning...' : 'Ready to Scan'}
      </Text>
      
      <Text style={styles.instruction}>
        {isScanning 
          ? 'Touch the sensor with your finger' 
          : 'Tap the button to start scanning'}
      </Text>

      {!isScanning && (
        <Button 
          mode="contained" 
          onPress={handleScan}
          style={styles.scanButton}
          icon="fingerprint"
          contentStyle={styles.scanButtonContent}
        >
          Scan Fingerprint
        </Button>
      )}

      <Button 
        mode="outlined" 
        onPress={onCancel}
        style={styles.button}
      >
        Cancel
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  title: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  instruction: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  helperText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  scanButton: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
  },
  scanButtonContent: {
    height: 50,
  },
  button: {
    marginTop: theme.spacing.sm,
  },
});

export default FingerprintScanner;