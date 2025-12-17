// ========================================
// GOD'S EYE EDTECH - BIOMETRIC SETUP SCREEN
// ========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Button, Card, List, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import * as biometricService from '../../services/biometricService';
import { SCREENS } from '../../utils/constants';

const BiometricSetupScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [biometricData, setBiometricData] = useState({
    fingerprintEnabled: false,
    faceRecognitionEnabled: false,
    fingerprintRecord: null,
    faceRecord: null,
  });
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    hasHardware: false,
    isEnrolled: false,
    supportedTypes: [],
    hasFingerprint: false,
    hasFaceRecognition: false,
  });

  useEffect(() => {
    initialize();
  }, []);

  const initialize = async () => {
    await checkBiometricCapabilities();
    await loadBiometricData();
  };

  const checkBiometricCapabilities = async () => {
    try {
      const capabilities = await biometricService.checkBiometricSupport();
      setDeviceCapabilities(capabilities);

      if (__DEV__) {
        console.log('Device capabilities:', capabilities);
      }
    } catch (error) {
      console.error('Capability check error:', error);
    }
  };

  const loadBiometricData = async () => {
    try {
      const response = await biometricService.getStudentBiometrics(student.id);

      if (response.success) {
        const fingerprintRecord = response.data?.find(b => b.biometric_type === 'fingerprint' && b.is_active);
        const faceRecord = response.data?.find(b => b.biometric_type === 'face' && b.is_active);

        setBiometricData({
          fingerprintEnabled: !!fingerprintRecord,
          faceRecognitionEnabled: !!faceRecord,
          fingerprintRecord,
          faceRecord,
        });
      }
    } catch (error) {
      console.error('Load biometric data error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnrollFingerprint = async () => {
    if (!deviceCapabilities.hasHardware || !deviceCapabilities.isEnrolled) {
      Alert.alert(
        'Not Available',
        'Fingerprint authentication is not available on this device or no fingerprints are enrolled.',
        [{ text: 'OK' }]
      );
      return;
    }

    try {
      setIsSaving(true);

      const response = await biometricService.enrollFingerprint(student.id);

      if (response.success) {
        Alert.alert('Success', 'Fingerprint enrolled successfully!');
        await loadBiometricData();
      } else {
        throw new Error(response.message || 'Failed to enroll fingerprint');
      }
    } catch (error) {
      console.error('Fingerprint enrollment error:', error);
      Alert.alert('Error', error.message || 'Failed to enroll fingerprint. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFingerprint = () => {
    if (!biometricData.fingerprintRecord) return;

    Alert.alert(
      'Remove Fingerprint',
      'Are you sure you want to remove fingerprint authentication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSaving(true);

              const response = await biometricService.deleteBiometric(
                biometricData.fingerprintRecord.id
              );

              if (response.success) {
                Alert.alert('Success', 'Fingerprint removed successfully');
                await biometricService.removeLocalBiometricData(student.id, 'fingerprint');
                await loadBiometricData();
              } else {
                throw new Error(response.message || 'Failed to remove fingerprint');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to remove fingerprint');
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const handleCaptureFace = () => {
    navigation.navigate(SCREENS.FACE_RECOGNITION_CAMERA || 'FaceRecognitionCamera', {
      student,
      onCapture: async (imageData) => {
        try {
          setIsSaving(true);

          const response = await biometricService.enrollFaceRecognition(
            student.id,
            imageData
          );

          if (response.success) {
            navigation.goBack();
            Alert.alert('Success', 'Face recognition enrolled successfully!');
            await loadBiometricData();
          } else {
            throw new Error(response.message || 'Failed to enroll face recognition');
          }
        } catch (error) {
          Alert.alert('Error', error.message || 'Failed to enroll face recognition');
        } finally {
          setIsSaving(false);
        }
      },
      onCancel: () => {
        navigation.goBack();
      },
    });
  };

  const handleRemoveFace = () => {
    if (!biometricData.faceRecord) return;

    Alert.alert(
      'Remove Face Recognition',
      'Are you sure you want to remove face recognition?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsSaving(true);

              const response = await biometricService.deleteBiometric(
                biometricData.faceRecord.id
              );

              if (response.success) {
                Alert.alert('Success', 'Face recognition removed successfully');
                await biometricService.removeLocalBiometricData(student.id, 'face_recognition');
                await loadBiometricData();
              } else {
                throw new Error(response.message || 'Failed to remove face recognition');
              }
            } catch (error) {
              Alert.alert('Error', error.message || 'Failed to remove face recognition');
            } finally {
              setIsSaving(false);
            }
          },
        },
      ]
    );
  };

  const handleTestBiometric = async () => {
    if (!biometricData.fingerprintEnabled && !biometricData.faceRecognitionEnabled) {
      Alert.alert('No Biometrics', 'Please enroll at least one biometric method first.');
      return;
    }

    const result = await biometricService.testBiometricAuthentication();

    if (result.success) {
      Alert.alert('Success', 'Biometric authentication successful!');
    } else {
      Alert.alert('Failed', result.message || 'Biometric authentication failed.');
    }
  };

  const handleViewQRCode = () => {
    navigation.navigate(SCREENS.STUDENT_QR_CODE, { student });
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading biometric data..." />;
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Student Info */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.studentHeader}>
            <MaterialCommunityIcons
              name="account-circle"
              size={60}
              color={theme.colors.primary}
            />
            <View style={styles.studentInfo}>
              <Text style={styles.studentName}>
                {student.first_name} {student.last_name}
              </Text>
              <Text style={styles.studentSubtitle}>Biometric Setup</Text>
              {student.admission_number && (
                <Text style={styles.admissionNumber}>
                  {student.admission_number}
                </Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Device Capabilities Warning */}
      {!deviceCapabilities.hasHardware && (
        <Card style={[styles.card, styles.warningCard]}>
          <Card.Content>
            <View style={styles.warningHeader}>
              <MaterialCommunityIcons
                name="alert"
                size={24}
                color={theme.colors.warning}
              />
              <Text style={styles.warningText}>
                This device doesn't support biometric authentication
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {deviceCapabilities.hasHardware && !deviceCapabilities.isEnrolled && (
        <Card style={[styles.card, styles.warningCard]}>
          <Card.Content>
            <View style={styles.warningHeader}>
              <MaterialCommunityIcons
                name="information"
                size={24}
                color={theme.colors.info}
              />
              <Text style={styles.warningText}>
                No biometrics enrolled on this device. Please add fingerprints or face data in device settings.
              </Text>
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Fingerprint */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="Fingerprint Authentication"
            description={
              biometricData.fingerprintEnabled
                ? `Enrolled on ${new Date(biometricData.fingerprintRecord?.enrolled_at).toLocaleDateString()}`
                : 'Not enrolled'
            }
            left={props => (
              <MaterialCommunityIcons
                name="fingerprint"
                size={40}
                color={
                  biometricData.fingerprintEnabled
                    ? theme.colors.success
                    : theme.colors.textSecondary
                }
              />
            )}
            right={props => (
              <View style={styles.switchContainer}>
                <Switch
                  value={biometricData.fingerprintEnabled}
                  disabled={true}
                />
              </View>
            )}
          />
          
          {deviceCapabilities.hasFingerprint && (
            <View style={styles.buttonGroup}>
              {!biometricData.fingerprintEnabled ? (
                <Button
                  mode="contained"
                  icon="fingerprint"
                  onPress={handleEnrollFingerprint}
                  loading={isSaving}
                  disabled={isSaving}
                >
                  Enroll Fingerprint
                </Button>
              ) : (
                <Button
                  mode="outlined"
                  icon="delete"
                  onPress={handleRemoveFingerprint}
                  loading={isSaving}
                  disabled={isSaving}
                >
                  Remove Fingerprint
                </Button>
              )}
            </View>
          )}

          {biometricData.fingerprintRecord && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Uses</Text>
                <Text style={styles.statValue}>
                  {biometricData.fingerprintRecord.use_count || 0}
                </Text>
              </View>
              {biometricData.fingerprintRecord.last_used && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Last Used</Text>
                  <Text style={styles.statValue}>
                    {new Date(biometricData.fingerprintRecord.last_used).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* Face Recognition */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="Face Recognition"
            description={
              biometricData.faceRecognitionEnabled
                ? `Enrolled on ${new Date(biometricData.faceRecord?.enrolled_at).toLocaleDateString()}`
                : 'Not enrolled'
            }
            left={props => (
              <MaterialCommunityIcons
                name="face-recognition"
                size={40}
                color={
                  biometricData.faceRecognitionEnabled
                    ? theme.colors.success
                    : theme.colors.textSecondary
                }
              />
            )}
            right={props => (
              <View style={styles.switchContainer}>
                <Switch value={biometricData.faceRecognitionEnabled} disabled={true} />
              </View>
            )}
          />
          
          <View style={styles.buttonGroup}>
            {!biometricData.faceRecognitionEnabled ? (
              <Button
                mode="contained"
                icon="camera"
                onPress={handleCaptureFace}
                loading={isSaving}
                disabled={isSaving}
              >
                Capture Face
              </Button>
            ) : (
              <Button
                mode="outlined"
                icon="delete"
                onPress={handleRemoveFace}
                loading={isSaving}
                disabled={isSaving}
              >
                Remove Face Data
              </Button>
            )}
          </View>

          {biometricData.faceRecord && (
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Uses</Text>
                <Text style={styles.statValue}>
                  {biometricData.faceRecord.use_count || 0}
                </Text>
              </View>
              {biometricData.faceRecord.last_used && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Last Used</Text>
                  <Text style={styles.statValue}>
                    {new Date(biometricData.faceRecord.last_used).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          )}
        </Card.Content>
      </Card>

      {/* QR Code Option */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="QR Code"
            description="Always available as fallback"
            left={props => (
              <MaterialCommunityIcons
                name="qrcode"
                size={40}
                color={theme.colors.success}
              />
            )}
          />
          
          <View style={styles.buttonGroup}>
            <Button
              mode="outlined"
              icon="qrcode"
              onPress={handleViewQRCode}
            >
              View QR Code
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Test Section */}
      {(biometricData.fingerprintEnabled || biometricData.faceRecognitionEnabled) && (
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.sectionTitle}>Test Authentication</Text>
            <Text style={styles.sectionDescription}>
              Test if biometric authentication works correctly
            </Text>
            <Button
              mode="contained"
              icon="test-tube"
              onPress={handleTestBiometric}
              style={styles.testButton}
            >
              Test Biometric
            </Button>
          </Card.Content>
        </Card>
      )}

      {/* Info */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.sectionTitle}>About Biometric Setup</Text>
          <Text style={styles.infoText}>
            • Biometric data is stored securely{'\n'}
            • Multiple authentication methods can be active{'\n'}
            • You can remove biometric data anytime{'\n'}
            • QR code remains available as fallback{'\n'}
            • Usage statistics are tracked for security
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.xl,
  },
  card: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.medium,
  },
  studentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  studentInfo: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  studentName: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  studentSubtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  admissionNumber: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  switchContainer: {
    justifyContent: 'center',
  },
  buttonGroup: {
    marginTop: theme.spacing.md,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.md,
    paddingTop: theme.spacing.md,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.xs,
  },
  statValue: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  sectionDescription: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  testButton: {
    marginTop: theme.spacing.sm,
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
});

export default BiometricSetupScreen;