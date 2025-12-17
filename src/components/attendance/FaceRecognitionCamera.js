// ========================================
// GOD'S EYE EDTECH - FACE RECOGNITION CAMERA
// ========================================

import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert, Animated } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';

const FaceRecognitionCamera = ({ onCapture, onCancel, student }) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState('front');
  const [isCapturing, setIsCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [captureCountdown, setCaptureCountdown] = useState(null);
  const cameraRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const countdownTimer = useRef(null);

  useEffect(() => {
    if (permission && !permission.granted) {
      requestPermission();
    }
  }, []);

  // Pulse animation for face guide
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // Auto-capture countdown
  useEffect(() => {
    if (captureCountdown !== null && captureCountdown > 0) {
      countdownTimer.current = setTimeout(() => {
        setCaptureCountdown(captureCountdown - 1);
      }, 1000);
    } else if (captureCountdown === 0) {
      handleAutoCapture();
    }

    return () => {
      if (countdownTimer.current) {
        clearTimeout(countdownTimer.current);
      }
    };
  }, [captureCountdown]);

  // Simulate face detection (in production, integrate actual face detection)
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate face detection - in production, use expo-face-detector or similar
      const detected = Math.random() > 0.3;
      setFaceDetected(detected);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleAutoCapture = async () => {
    setCaptureCountdown(null);
    await handleCapture();
  };

  const startAutoCapture = () => {
    if (!faceDetected) {
      Alert.alert('Position Your Face', 'Please position your face within the frame guide.');
      return;
    }
    setCaptureCountdown(3);
  };

  const cancelAutoCapture = () => {
    setCaptureCountdown(null);
    if (countdownTimer.current) {
      clearTimeout(countdownTimer.current);
    }
  };

  const handleCapture = async () => {
    if (!cameraRef.current) return;

    try {
      setIsCapturing(true);
      
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: true,
        exif: false,
      });

      // Validate photo was taken
      if (!photo || !photo.uri) {
        throw new Error('Failed to capture photo');
      }

      if (__DEV__) {
        console.log('📸 Photo captured:', {
          uri: photo.uri.substring(0, 50) + '...',
          width: photo.width,
          height: photo.height,
        });
      }

      onCapture({
        uri: photo.uri,
        base64: photo.base64,
        width: photo.width,
        height: photo.height,
      });
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture photo. Please try again.');
      setIsCapturing(false);
      setCaptureCountdown(null);
    }
  };

  const toggleCameraType = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
    setFaceDetected(false);
    setCaptureCountdown(null);
  };

  if (!permission) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Requesting camera permission...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="camera-off" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Camera permission denied</Text>
        <Text style={styles.errorSubtext}>
          We need camera access to capture your face for biometric setup.
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

  return (
    <View style={styles.container}>
      <CameraView 
        style={styles.camera} 
        facing={facing}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <Animated.View 
            style={[
              styles.faceGuide,
              {
                borderColor: faceDetected ? theme.colors.success : theme.colors.primary,
                transform: [{ scale: pulseAnim }],
              }
            ]}
          >
            <MaterialCommunityIcons 
              name="face-recognition" 
              size={200} 
              color={faceDetected ? theme.colors.success : theme.colors.surface}
              style={styles.faceIcon}
            />
            
            {/* Face Detection Indicator */}
            <View style={[
              styles.detectionIndicator,
              { backgroundColor: faceDetected ? theme.colors.success : 'transparent' }
            ]}>
              <MaterialCommunityIcons 
                name={faceDetected ? "check-circle" : "alert-circle-outline"} 
                size={24} 
                color="white"
              />
            </View>
          </Animated.View>

          {/* Corner guides */}
          <View style={styles.cornerGuides}>
            <View style={[styles.corner, styles.topLeft]} />
            <View style={[styles.corner, styles.topRight]} />
            <View style={[styles.corner, styles.bottomLeft]} />
            <View style={[styles.corner, styles.bottomRight]} />
          </View>
        </View>

        {/* Instructions */}
        <View style={styles.instructionContainer}>
          <View style={styles.instructionBox}>
            <Text style={styles.instructionText}>
              {captureCountdown !== null 
                ? `Capturing in ${captureCountdown}...`
                : faceDetected 
                  ? '✓ Face detected - Ready to capture!'
                  : 'Position your face in the frame'}
            </Text>
            {!faceDetected && !captureCountdown && student && (
              <Text style={styles.instructionSubtext}>
                {student.first_name} {student.last_name}
              </Text>
            )}
            {!faceDetected && !captureCountdown && (
              <Text style={styles.instructionSubtext}>
                • Look directly at the camera{'\n'}
                • Ensure good lighting{'\n'}
                • Remove glasses if possible
              </Text>
            )}
          </View>
        </View>

        {/* Countdown Overlay */}
        {captureCountdown !== null && (
          <View style={styles.countdownOverlay}>
            <Text style={styles.countdownText}>{captureCountdown}</Text>
          </View>
        )}

        {/* Controls */}
        <View style={styles.controls}>
          <Button
            mode="outlined"
            onPress={toggleCameraType}
            icon="camera-flip"
            textColor={theme.colors.surface}
            style={styles.controlButton}
            disabled={isCapturing || captureCountdown !== null}
          >
            Flip
          </Button>

          {captureCountdown === null ? (
            <Button
              mode="contained"
              onPress={startAutoCapture}
              loading={isCapturing}
              disabled={isCapturing || !faceDetected}
              icon="camera"
              contentStyle={styles.captureButtonContent}
              style={[
                styles.captureButton,
                !faceDetected && styles.captureButtonDisabled
              ]}
            >
              {isCapturing ? 'Capturing...' : 'Capture'}
            </Button>
          ) : (
            <Button
              mode="contained"
              onPress={cancelAutoCapture}
              icon="close"
              contentStyle={styles.captureButtonContent}
              style={styles.cancelCaptureButton}
            >
              Cancel
            </Button>
          )}

          <Button
            mode="outlined"
            onPress={onCancel}
            icon="close"
            textColor={theme.colors.surface}
            style={styles.controlButton}
            disabled={isCapturing || captureCountdown !== null}
          >
            Back
          </Button>
        </View>

        {/* Status Bar */}
        <View style={styles.statusBar}>
          <View style={styles.statusItem}>
            <MaterialCommunityIcons 
              name={faceDetected ? "check-circle" : "close-circle"} 
              size={20} 
              color={faceDetected ? theme.colors.success : theme.colors.error}
            />
            <Text style={styles.statusText}>
              {faceDetected ? 'Face Detected' : 'No Face Detected'}
            </Text>
          </View>
          <View style={styles.statusItem}>
            <MaterialCommunityIcons 
              name="camera" 
              size={20} 
              color={theme.colors.surface}
            />
            <Text style={styles.statusText}>
              {facing === 'front' ? 'Front' : 'Back'} Camera
            </Text>
          </View>
        </View>
      </CameraView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  loadingText: {
    marginTop: theme.spacing.md,
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  faceGuide: {
    width: 280,
    height: 380,
    borderWidth: 4,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    position: 'relative',
  },
  faceIcon: {
    opacity: 0.4,
  },
  detectionIndicator: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cornerGuides: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  corner: {
    position: 'absolute',
    width: 30,
    height: 30,
    borderColor: theme.colors.primary,
  },
  topLeft: {
    top: 110,
    left: 55,
    borderTopWidth: 3,
    borderLeftWidth: 3,
  },
  topRight: {
    top: 110,
    right: 55,
    borderTopWidth: 3,
    borderRightWidth: 3,
  },
  bottomLeft: {
    bottom: 200,
    left: 55,
    borderBottomWidth: 3,
    borderLeftWidth: 3,
  },
  bottomRight: {
    bottom: 200,
    right: 55,
    borderBottomWidth: 3,
    borderRightWidth: 3,
  },
  instructionContainer: {
    position: 'absolute',
    top: theme.spacing.xl,
    left: theme.spacing.md,
    right: theme.spacing.md,
    alignItems: 'center',
  },
  instructionBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.surface,
    fontWeight: '600',
    textAlign: 'center',
  },
  instructionSubtext: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.surface,
    marginTop: theme.spacing.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  countdownOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  countdownText: {
    fontSize: 120,
    fontWeight: 'bold',
    color: theme.colors.surface,
  },
  controls: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: theme.spacing.md,
  },
  controlButton: {
    borderColor: theme.colors.surface,
    borderWidth: 2,
  },
  captureButton: {
    backgroundColor: theme.colors.primary,
  },
  captureButtonDisabled: {
    backgroundColor: theme.colors.disabled,
  },
  cancelCaptureButton: {
    backgroundColor: theme.colors.error,
  },
  captureButtonContent: {
    height: 50,
  },
  statusBar: {
    position: 'absolute',
    top: 50,
    left: theme.spacing.md,
    flexDirection: 'column',
    gap: theme.spacing.xs,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
  },
  statusText: {
    color: theme.colors.surface,
    fontSize: theme.fontSizes.sm,
    marginLeft: theme.spacing.xs,
  },
  errorText: {
    fontSize: theme.fontSizes.xl,
    fontWeight: 'bold',
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.sm,
    textAlign: 'center',
  },
  errorSubtext: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.lg,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.xl,
  },
  button: {
    marginTop: theme.spacing.md,
    minWidth: 200,
  },
});

export default FaceRecognitionCamera;