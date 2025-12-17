// ========================================
// GOD'S EYE EDTECH - QR CODE SCANNER
// ========================================

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, Alert } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import theme from '../../styles/theme';

// Try to import expo-camera
let CameraView, useCameraPermissions;
try {
  const Camera = require('expo-camera');
  CameraView = Camera.CameraView;
  useCameraPermissions = Camera.useCameraPermissions;
} catch (e) {
  CameraView = null;
  useCameraPermissions = null;
}

const QRCodeScanner = ({ onScan, onCancel }) => {
  // Check if running in Expo Go
  const isExpoGo = Constants.appOwnership === 'expo';
  
  // If in Expo Go or camera not available, use mock scanner
  if (isExpoGo || !CameraView || !useCameraPermissions) {
    return <MockQRCodeScanner onScan={onScan} onCancel={onCancel} />;
  }

  // Real scanner for development/production builds
  return <RealQRCodeScanner onScan={onScan} onCancel={onCancel} />;
};

// ============================================================
// MOCK QR CODE SCANNER (FOR EXPO GO TESTING)
// ============================================================

const MockQRCodeScanner = ({ onScan, onCancel }) => {
  const [manualCode, setManualCode] = useState('');

  const handleManualScan = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim());
    } else {
      Alert.alert('Error', 'Please enter a QR code');
    }
  };

  const handleQuickTest = () => {
    // Generate a test QR code for demo
    const testCode = `GE-1-${Date.now()}`;
    onScan(testCode);
  };

  return (
    <View style={styles.mockContainer}>
      <MaterialCommunityIcons
        name="qrcode-scan"
        size={100}
        color={theme.colors.primary}
      />
      
      <Text style={styles.mockTitle}>QR Code Scanner</Text>
      <Text style={styles.mockSubtitle}>
        Camera scanning not available in Expo Go
      </Text>

      <View style={styles.mockInputContainer}>
        <Text style={styles.mockLabel}>Enter QR Code Manually:</Text>
        <TextInput
          mode="outlined"
          value={manualCode}
          onChangeText={setManualCode}
          placeholder="GE-123-1704067200"
          style={styles.mockInput}
        />
      </View>

      <View style={styles.mockButtons}>
        <Button
          mode="contained"
          onPress={handleManualScan}
          style={styles.mockButton}
          icon="check"
        >
          Scan Code
        </Button>

        <Button
          mode="outlined"
          onPress={handleQuickTest}
          style={styles.mockButton}
          icon="test-tube"
        >
          Quick Test
        </Button>

        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.mockButton}
        >
          Cancel
        </Button>
      </View>

      <View style={styles.mockInfo}>
        <MaterialCommunityIcons name="information" size={20} color={theme.colors.info} />
        <Text style={styles.mockInfoText}>
          Camera scanning requires a development or production build. Use manual entry for testing.
        </Text>
      </View>
    </View>
  );
};

// ============================================================
// REAL QR CODE SCANNER (FOR DEV/PROD BUILDS)
// ============================================================

const RealQRCodeScanner = ({ onScan, onCancel }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.messageText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="camera-off" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Camera permission denied</Text>
        <Text style={styles.messageText}>
          We need camera access to scan QR codes for student attendance.
        </Text>
        <Button mode="contained" onPress={requestPermission} style={styles.button}>
          Grant Permission
        </Button>
        <Button mode="outlined" onPress={onCancel} style={styles.button}>
          Cancel
        </Button>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }) => {
    if (!scanned) {
      setScanned(true);
      onScan(data);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
      />
      
      <View style={styles.overlay}>
        <View style={styles.topOverlay} />
        <View style={styles.middleRow}>
          <View style={styles.sideOverlay} />
          <View style={styles.scanArea}>
            <View style={[styles.corner, styles.cornerTopLeft]} />
            <View style={[styles.corner, styles.cornerTopRight]} />
            <View style={[styles.corner, styles.cornerBottomLeft]} />
            <View style={[styles.corner, styles.cornerBottomRight]} />
          </View>
          <View style={styles.sideOverlay} />
        </View>
        <View style={styles.bottomOverlay}>
          <Text style={styles.instructionText}>
            {scanned ? 'Processing...' : 'Align QR code within frame'}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        {scanned && (
          <Button 
            mode="contained" 
            onPress={() => setScanned(false)}
            style={styles.actionButton}
            icon="refresh"
          >
            Scan Again
          </Button>
        )}
        <Button 
          mode="outlined" 
          onPress={onCancel}
          style={styles.actionButton}
          textColor={theme.colors.surface}
        >
          Cancel
        </Button>
      </View>
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.text,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  messageText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    textAlign: 'center',
    marginVertical: theme.spacing.md,
  },
  errorText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.error,
    textAlign: 'center',
    marginTop: theme.spacing.md,
    fontWeight: '600',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  topOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  middleRow: {
    flexDirection: 'row',
    height: 300,
  },
  sideOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  scanArea: {
    width: 300,
    height: 300,
    position: 'relative',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: theme.colors.primary,
  },
  cornerTopLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
  },
  cornerTopRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
  },
  cornerBottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
  },
  cornerBottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
  },
  bottomOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingBottom: 100,
  },
  instructionText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.surface,
    textAlign: 'center',
    fontWeight: '600',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  button: {
    marginTop: theme.spacing.md,
    minWidth: 200,
  },
  // Mock Scanner Styles
  mockContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  mockTitle: {
    fontSize: theme.fontSizes.h2,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  mockSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
  },
  mockInputContainer: {
    width: '100%',
    marginBottom: theme.spacing.lg,
  },
  mockLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
    fontWeight: '600',
  },
  mockInput: {
    backgroundColor: theme.colors.surface,
  },
  mockButtons: {
    width: '100%',
    gap: theme.spacing.sm,
  },
  mockButton: {
    width: '100%',
  },
  mockInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: theme.spacing.xl,
    padding: theme.spacing.md,
    backgroundColor: '#E3F2FD',
    borderRadius: theme.borderRadius.md,
  },
  mockInfoText: {
    flex: 1,
    fontSize: theme.fontSizes.sm,
    color: theme.colors.info,
    marginLeft: theme.spacing.sm,
    lineHeight: 20,
  },
});

export default QRCodeScanner;