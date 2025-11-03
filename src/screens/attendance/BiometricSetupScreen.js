import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { Text, Button, Card, List, Switch } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import theme from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const BiometricSetupScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [biometricData, setBiometricData] = useState({
    fingerprintEnabled: false,
    faceRecognitionEnabled: false,
    qrCodeGenerated: false,
  });
  const [deviceCapabilities, setDeviceCapabilities] = useState({
    hasHardware: false,
    isEnrolled: false,
    supportedTypes: [],
  });

  useEffect(() => {
    checkBiometricCapabilities();
    loadBiometricData();
  }, []);

  const checkBiometricCapabilities = async () => {
    try {
      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();
      
      setDeviceCapabilities({
        hasHardware,
        isEnrolled,
        supportedTypes,
      });
    } catch (error) {
      console.error('Capability check error:', error);
    }
  };

  const loadBiometricData = async () => {
    try {
      // TODO: Replace with actual API call
      // const response = await biometricService.getBiometricInfo(student.id);
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = {
        fingerprintEnabled: false,
        faceRecognitionEnabled: false,
        qrCodeGenerated: true,
      };
      
      setBiometricData(mockData);
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
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Scan fingerprint to enroll',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        setIsSaving(true);
        // TODO: Replace with actual API call
        // await biometricService.setupBiometric(student.id, { type: 'fingerprint' });
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setBiometricData(prev => ({ ...prev, fingerprintEnabled: true }));
        Alert.alert('Success', 'Fingerprint enrolled successfully!');
      }
    } catch (error) {
      console.error('Fingerprint enrollment error:', error);
      Alert.alert('Error', 'Failed to enroll fingerprint. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRemoveFingerprint = () => {
    Alert.alert(
      'Remove Fingerprint',
      'Are you sure you want to remove fingerprint authentication?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setIsSaving(true);
            // TODO: API call to remove fingerprint
            await new Promise(resolve => setTimeout(resolve, 1000));
            setBiometricData(prev => ({ ...prev, fingerprintEnabled: false }));
            setIsSaving(false);
          },
        },
      ]
    );
  };

  const handleCaptureFace = () => {
    navigation.navigate('FaceRecognitionCamera', {
      onCapture: async (imageData) => {
        setIsSaving(true);
        // TODO: API call to save face data
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBiometricData(prev => ({ ...prev, faceRecognitionEnabled: true }));
        setIsSaving(false);
        navigation.goBack();
        Alert.alert('Success', 'Face recognition enrolled successfully!');
      },
    });
  };

  const handleRemoveFace = () => {
    Alert.alert(
      'Remove Face Recognition',
      'Are you sure you want to remove face recognition?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setIsSaving(true);
            // TODO: API call to remove face data
            await new Promise(resolve => setTimeout(resolve, 1000));
            setBiometricData(prev => ({ ...prev, faceRecognitionEnabled: false }));
            setIsSaving(false);
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

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage: 'Test biometric authentication',
        cancelLabel: 'Cancel',
      });

      if (result.success) {
        Alert.alert('Success', 'Biometric authentication successful!');
      } else {
        Alert.alert('Failed', 'Biometric authentication failed.');
      }
    } catch (error) {
      console.error('Test biometric error:', error);
    }
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
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Device Capabilities */}
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

      {/* Fingerprint */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="Fingerprint Authentication"
            description={
              biometricData.fingerprintEnabled
                ? 'Enrolled and active'
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
                  disabled={!deviceCapabilities.hasHardware}
                />
              </View>
            )}
          />
          
          {deviceCapabilities.hasHardware && (
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
        </Card.Content>
      </Card>

      {/* Face Recognition */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="Face Recognition"
            description={
              biometricData.faceRecognitionEnabled
                ? 'Enrolled and active'
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
                <Switch value={biometricData.faceRecognitionEnabled} />
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
        </Card.Content>
      </Card>

      {/* QR Code Status */}
      <Card style={styles.card}>
        <Card.Content>
          <List.Item
            title="QR Code"
            description={
              biometricData.qrCodeGenerated
                ? 'Generated and ready'
                : 'Not generated'
            }
            left={props => (
              <MaterialCommunityIcons
                name="qrcode"
                size={40}
                color={
                  biometricData.qrCodeGenerated
                    ? theme.colors.success
                    : theme.colors.textSecondary
                }
              />
            )}
          />
          
          <View style={styles.buttonGroup}>
            <Button
              mode="outlined"
              icon="qrcode"
              onPress={() => navigation.navigate('StudentQRCode', { student })}
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
            • QR code remains available as fallback
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
  warningCard: {
    backgroundColor: theme.colors.warningLight,
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  warningText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.warning,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  switchContainer: {
    justifyContent: 'center',
  },
  buttonGroup: {
    marginTop: theme.spacing.md,
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