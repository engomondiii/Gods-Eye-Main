import React, { useState } from 'react';
import { View, StyleSheet, Alert, Share } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import theme from '../../styles/theme';
import { APP_CONFIG } from '../../utils/constants';

const QRCodeDisplay = ({ 
  studentId,
  qrCode,
  size = APP_CONFIG.QR_CODE_SIZE || 250,
  showDownload = true,
  showShare = true,
  student = null
}) => {
  const [qrRef, setQrRef] = useState(null);

  if (!qrCode) {
    return (
      <View style={styles.errorContainer}>
        <MaterialCommunityIcons 
          name="qrcode-remove" 
          size={64} 
          color={theme.colors.error} 
        />
        <Text style={styles.errorText}>QR Code not available</Text>
      </View>
    );
  }

  const handleShare = async () => {
    try {
      const studentName = student 
        ? `${student.first_name} ${student.last_name}` 
        : 'Student';
      
      await Share.share({
        message: `QR Code for ${studentName}\nCode: ${qrCode}\n\nUse this QR code for attendance check-in.`,
        title: `${studentName} - Attendance QR Code`,
      });
    } catch (error) {
      console.error('Share error:', error);
      Alert.alert('Error', 'Failed to share QR code');
    }
  };

  const handleDownload = () => {
    Alert.alert(
      'Download QR Code',
      'QR Code download functionality requires native implementation. Use Share instead.',
      [{ text: 'OK' }]
    );
  };

  const handlePrint = () => {
    Alert.alert(
      'Print QR Code',
      'Print functionality requires platform-specific implementation.',
      [{ text: 'OK' }]
    );
  };

  return (
    <View style={styles.container}>
      {student && (
        <View style={styles.studentInfo}>
          <Text style={styles.studentName}>
            {student.first_name} {student.last_name}
          </Text>
          {student.admission_number && (
            <Text style={styles.admissionNumber}>
              {student.admission_number}
            </Text>
          )}
        </View>
      )}

      <View style={styles.qrContainer}>
        <QRCode
          value={qrCode}
          size={size}
          color={theme.colors.text}
          backgroundColor={theme.colors.surface}
          getRef={(ref) => setQrRef(ref)}
        />
      </View>

      <View style={styles.codeContainer}>
        <Text style={styles.codeLabel}>Code:</Text>
        <Text style={styles.codeValue}>{qrCode}</Text>
      </View>

      <View style={styles.infoBox}>
        <MaterialCommunityIcons 
          name="information" 
          size={16} 
          color={theme.colors.info} 
        />
        <Text style={styles.infoText}>
          Show this QR code at the entrance for quick check-in
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        {showShare && (
          <Button
            mode="outlined"
            onPress={handleShare}
            style={styles.button}
            icon="share-variant"
          >
            Share
          </Button>
        )}
        
        {showDownload && (
          <Button
            mode="outlined"
            onPress={handleDownload}
            style={styles.button}
            icon="download"
          >
            Download
          </Button>
        )}

        <Button
          mode="outlined"
          onPress={handlePrint}
          style={styles.button}
          icon="printer"
        >
          Print
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
  },
  studentInfo: {
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  studentName: {
    fontSize: theme.fontSizes.h4,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  admissionNumber: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
  },
  qrContainer: {
    padding: theme.spacing.lg,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  codeLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginRight: theme.spacing.xs,
  },
  codeValue: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    color: theme.colors.text,
    fontFamily: 'monospace',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.infoLight,
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    marginBottom: theme.spacing.md,
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.info,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  button: {
    marginHorizontal: theme.spacing.xs,
  },
  errorContainer: {
    alignItems: 'center',
    padding: theme.spacing.xl,
  },
  errorText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
  },
});

export default QRCodeDisplay;