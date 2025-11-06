import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import theme from '../../styles/theme';
import { ATTENDANCE_METHODS } from '../../utils/constants';
import QRCodeScanner from '../../components/attendance/QRCodeScanner';
import FingerprintScanner from '../../components/attendance/FingerprintScanner';
import FaceRecognitionCamera from '../../components/attendance/FaceRecognitionCamera';
import OTCInput from '../../components/attendance/OTCInput';
import AttendanceMethodSelector from '../../components/attendance/AttendanceMethodSelector';

const CheckInScreen = ({ route, navigation }) => {
  const preSelectedMethod = route?.params?.method || null;
  const [selectedMethod, setSelectedMethod] = useState(preSelectedMethod);
  const [checkInType, setCheckInType] = useState('check_in');

  const handleMethodSelect = (method) => {
    setSelectedMethod(method);
  };

  const handleCheckInSuccess = async (data) => {
    try {
      // TODO: Replace with actual API call
      // await attendanceService.checkIn(data);
      
      console.log('Check-in successful:', data);
      
      // ✅ FIXED: Safe navigation check
      if (navigation && navigation.canGoBack()) {
        navigation.goBack();
      }
    } catch (error) {
      console.error('Check-in error:', error);
    }
  };

  const handleCheckInFail = (error) => {
    console.error('Check-in failed:', error);
  };

  // ✅ FIXED: Safe cancel handler
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
    await handleCheckInSuccess({
      qrCode,
      method: ATTENDANCE_METHODS.QR_CODE,
      type: checkInType,
    });
  };

  const handleOTCSubmit = async (code) => {
    await handleCheckInSuccess({
      code,
      method: ATTENDANCE_METHODS.ONE_TIME_CODE, // ✅ FIXED: Use correct constant name
      type: checkInType,
    });
  };

  const handleFaceCapture = async (imageData) => {
    await handleCheckInSuccess({
      imageData,
      method: ATTENDANCE_METHODS.FACE_RECOGNITION,
      type: checkInType,
    });
  };

  const renderMethodComponent = () => {
    switch (selectedMethod) {
      case ATTENDANCE_METHODS.QR_CODE:
        return (
          <QRCodeScanner
            onScan={handleQRScan}
            onCancel={handleCancel} // ✅ FIXED: Use safe cancel handler
          />
        );
      
      case ATTENDANCE_METHODS.FINGERPRINT:
        return (
          <FingerprintScanner
            onSuccess={handleCheckInSuccess}
            onFail={handleCheckInFail}
            onCancel={handleCancel} // ✅ FIXED: Use safe cancel handler
          />
        );
      
      case ATTENDANCE_METHODS.FACE_RECOGNITION:
        return (
          <FaceRecognitionCamera
            onCapture={handleFaceCapture}
            onCancel={handleCancel} // ✅ FIXED: Use safe cancel handler
          />
        );
      
      case ATTENDANCE_METHODS.ONE_TIME_CODE: // ✅ FIXED: Use correct constant name
        return (
          <OTCInput
            onSubmit={handleOTCSubmit}
            onCancel={handleCancel} // ✅ FIXED: Use safe cancel handler
          />
        );
      
      default:
        return (
          <AttendanceMethodSelector
            onMethodSelect={handleMethodSelect}
            selectedMethod={selectedMethod}
          />
        );
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
});

export default CheckInScreen;