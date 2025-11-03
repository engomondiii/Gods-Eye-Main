import React, { useState } from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';

const QRCodeScannerMock = ({ onScan, onCancel }) => {
  const [qrCode, setQrCode] = useState('');

  const handleSimulateScan = () => {
    if (qrCode.trim()) {
      onScan(qrCode.trim());
    }
  };

  // Auto-generate sample student QR codes
  const simulateQuickScan = (studentId) => {
    const mockQRData = `GODS-EYE-STUDENT-${studentId}`;
    setQrCode(mockQRData);
    onScan(mockQRData);
  };

  return (
    <View style={styles.container}>
      <View style={styles.mockCamera}>
        <MaterialCommunityIcons 
          name="qrcode-scan" 
          size={120} 
          color={theme.colors.primary} 
        />
        <Text style={styles.title}>QR Code Scanner (Mock Mode)</Text>
        <Text style={styles.subtitle}>
          Expo Go doesn't support camera.{'\n'}
          Use this for testing!
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Enter QR Code Data:</Text>
        <TextInput
          style={styles.input}
          placeholder="e.g., GODS-EYE-STUDENT-12345"
          value={qrCode}
          onChangeText={setQrCode}
          autoCapitalize="none"
        />
        
        <Button 
          mode="contained" 
          onPress={handleSimulateScan}
          style={styles.button}
          icon="check"
          disabled={!qrCode.trim()}
        >
          Simulate Scan
        </Button>

        <View style={styles.divider}>
          <Text style={styles.dividerText}>Quick Test Scans</Text>
        </View>

        <View style={styles.quickButtons}>
          <Button 
            mode="outlined" 
            onPress={() => simulateQuickScan('001')}
            style={styles.quickButton}
            compact
          >
            Student 001
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => simulateQuickScan('002')}
            style={styles.quickButton}
            compact
          >
            Student 002
          </Button>
          <Button 
            mode="outlined" 
            onPress={() => simulateQuickScan('003')}
            style={styles.quickButton}
            compact
          >
            Student 003
          </Button>
        </View>

        <Button 
          mode="text" 
          onPress={onCancel}
          style={styles.cancelButton}
        >
          Cancel
        </Button>
      </View>

      <View style={styles.warningBanner}>
        <MaterialCommunityIcons name="information" size={20} color={theme.colors.warning} />
        <Text style={styles.warningText}>
          Install development build for real QR scanning
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mockCamera: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
  },
  label: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.roundness,
    padding: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    backgroundColor: theme.colors.background,
    marginBottom: theme.spacing.md,
  },
  button: {
    marginTop: theme.spacing.sm,
  },
  divider: {
    marginVertical: theme.spacing.lg,
    alignItems: 'center',
  },
  dividerText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    fontWeight: '600',
  },
  quickButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: theme.spacing.md,
  },
  quickButton: {
    flex: 1,
    marginHorizontal: theme.spacing.xs,
  },
  cancelButton: {
    marginTop: theme.spacing.md,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: theme.colors.warningLight || '#FFF3CD',
    padding: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.warning,
  },
  warningText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.warning,
    marginLeft: theme.spacing.sm,
    fontWeight: '600',
  },
});

export default QRCodeScannerMock;