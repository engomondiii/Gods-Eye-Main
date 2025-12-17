// ========================================
// GOD'S EYE EDTECH - CHECK-IN SCREEN
// ========================================

import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import theme from '../../styles/theme';
import QRCodeScanner from '../../components/attendance/QRCodeScanner';
import FingerprintScanner from '../../components/attendance/FingerprintScanner';
import FaceRecognitionCamera from '../../components/attendance/FaceRecognitionCamera';
import OTCInput from '../../components/attendance/OTCInput';
import useAttendance from '../../hooks/useAttendance';

const CheckInScreen = ({ route, navigation }) => {
  const preSelectedMethod = route?.params?.method || null;
  const [selectedMethod, setSelectedMethod] = useState(preSelectedMethod);
  const [checkInType, setCheckInType] = useState('check_in');

  const { scanQRCode, verifyFingerprint, submitOTC } = useAttendance();

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleCheckInSuccess = async (data) => {
    try {
      Alert.alert('Success', `Attendance marked successfully for ${data.student?.name || 'student'}`);
      
      // Navigate back
      if (navigation && navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Check-in success handler error:', error);
    }
  };

  const handleCheckInFail = (error) => {
    Alert.alert('Check-In Failed', error || 'Failed to mark attendance. Please try again.');
  };

  const handleCancel = () => {
    if (selectedMethod) {
      // If a method is selected, go back to method selector
      setSelectedMethod(null);
    } else if (navigation && navigation.canGoBack()) {
      // If no method selected, go back to previous screen
      navigation.goBack();
    }
  };

  const handleQRScan = async (qrCode) => {
    try {
      const response = await scanQRCode(qrCode, { type: checkInType });
      
      if (response.success) {
        await handleCheckInSuccess(response);
      } else {
        handleCheckInFail(response.message);
      }
    } catch (error) {
      handleCheckInFail(error.message);
    }
  };

  const handleFingerprintSuccess = async (data) => {
    await handleCheckInSuccess(data);
  };

  const handleOTCSubmit = async (response) => {
    await handleCheckInSuccess(response);
  };

  const handleFaceCapture = async (imageData) => {
    try {
      // In a real implementation, you'd call verifyFace here
      // For now, just show success
      Alert.alert('Success', 'Face captured successfully');
      
      if (navigation && navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      handleCheckInFail(error.message);
    }
  };

  const renderMethodSelector = () => {
    const methods = [
      {
        id: 'qr_code',
        title: 'QR Code',
        icon: 'qrcode-scan',
        description: 'Scan student QR code',
      },
      {
        id: 'fingerprint',
        title: 'Fingerprint',
        icon: 'fingerprint',
        description: 'Verify fingerprint',
      },
      {
        id: 'face_recognition',
        title: 'Face Recognition',
        icon: 'face-recognition',
        description: 'Capture face photo',
      },
      {
        id: 'one_time_code',
        title: 'One-Time Code',
        icon: 'numeric',
        description: 'Enter 6-digit code',
      },
      {
        id: 'manual',
        title: 'Manual Entry',
        icon: 'pencil',
        description: 'Manually mark attendance',
      },
    ];

    return (
      <View style={styles.methodSelectorContainer}>
        {methods.map((method) => (
          <View key={method.id} style={styles.methodCard}>
            {/* Method selection UI would go here */}
          </View>
        ))}
      </View>
    );
  };

  const renderMethodComponent = () => {
    switch (selectedMethod) {
      case 'qr_code':
        return (
          <QRCodeScanner
            onScan={handleQRScan}
            onCancel={handleCancel}
          />
        );
      
      case 'fingerprint':
        return (
          <FingerprintScanner
            onSuccess={handleFingerprintSuccess}
            onFail={handleCheckInFail}
            onCancel={handleCancel}
          />
        );
      
      case 'face_recognition':
        return (
          <FaceRecognitionCamera
            onCapture={handleFaceCapture}
            onCancel={handleCancel}
          />
        );
      
      case 'one_time_code':
        return (
          <OTCInput
            onSubmit={handleOTCSubmit}
            onCancel={handleCancel}
          />
        );
      
      case 'manual':
        // Navigate to manual attendance screen
        if (navigation) {
          navigation.replace('ManualAttendanceScreen');
        }
        return null;
      
      default:
        return renderMethodSelector();
    }
  };

  return (
    <View style={styles.container}>
      {!selectedMethod && (
        <View style={styles.typeSelector}>
          <SegmentedButtons
            value={checkInType}
            onValueChange={setCheckInType}
            buttons={[
              {
                value: 'check_in',
                label: 'Check In',
                icon: 'login',
              },
              {
                value: 'check_out',
                label: 'Check Out',
                icon: 'logout',
              },
            ]}
            style={styles.segmentedButtons}
          />
        </View>
      )}
      
      {renderMethodComponent()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  typeSelector: {
    padding: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  segmentedButtons: {
    backgroundColor: theme.colors.background,
  },
  methodSelectorContainer: {
    flex: 1,
    padding: theme.spacing.md,
  },
  methodCard: {
    marginBottom: theme.spacing.md,
  },
});

export default CheckInScreen;