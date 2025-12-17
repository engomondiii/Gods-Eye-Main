// ========================================
// GOD'S EYE EDTECH - FINGERPRINT SCANNER
// ========================================

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import * as biometricService from '../../services/biometricService';

const FingerprintScanner = ({ onSuccess, onFail, onCancel, studentId }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [isAvailable, setIsAvailable] = useState(false);
  const [capabilities, setCapabilities] = useState(null);

  useEffect(() => {
    checkBiometricAvailability();
  }, []);

  const checkBiometricAvailability = async () => {
    try {
      const support = await biometricService.checkBiometricSupport();
      setCapabilities(support);
      setIsAvailable(support.isSupported && support.hasFingerprint);
    } catch (error) {
      console.error('Biometric check error:', error);
      setIsAvailable(false);
    }
  };

  const handleScan = async () => {
    setIsScanning(true);
    
    try {
      const response = await biometricService.verifyFingerprint(studentId, {
        deviceInfo: 'Mobile Device',
        location: 'Main Entrance',
      });

      if (response.success) {
        onSuccess({
          studentId,
          student: response.student,
          attendance: response.attendance,
          method: 'fingerprint',
          timestamp: new Date().toISOString(),
          confidenceScore: response.confidenceScore,
        });
      } else {
        onFail(response.message || 'Fingerprint verification failed');
      }
    } catch (error) {
      console.error('Fingerprint error:', error);
      onFail(error.message || 'Failed to verify fingerprint');
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
          {!capabilities?.hasHardware && 'Your device doesn\'t support fingerprint authentication'}
          {capabilities?.hasHardware && !capabilities?.isEnrolled && 'No fingerprints are enrolled on this device'}
          {capabilities?.hasHardware && capabilities?.isEnrolled && !capabilities?.hasFingerprint && 'Fingerprint sensor not detected'}
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
          : 'Tap the button to start fingerprint authentication'}
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
        disabled={isScanning}
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
    paddingHorizontal: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  helperText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  scanButton: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.primary,
    minWidth: 200,
  },
  scanButtonContent: {
    height: 50,
  },
  button: {
    marginTop: theme.spacing.sm,
    minWidth: 200,
  },
});

export default FingerprintScanner;