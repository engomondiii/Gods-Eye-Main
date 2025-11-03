import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { Camera } from 'expo-camera';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';

const FaceRecognitionCamera = ({ onCapture, onCancel }) => {
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants?.Type?.front || 'front');
  const [isCapturing, setIsCapturing] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
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

      onCapture({
        uri: photo.uri,
        base64: photo.base64,
        width: photo.width,
        height: photo.height,
      });
    } catch (error) {
      console.error('Capture error:', error);
      Alert.alert('Error', 'Failed to capture photo');
    } finally {
      setIsCapturing(false);
    }
  };

  const toggleCameraType = () => {
    setType(
      type === (Camera.Constants?.Type?.back || 'back')
        ? Camera.Constants?.Type?.front || 'front'
        : Camera.Constants?.Type?.back || 'back'
    );
  };

  if (hasPermission === null) {
    return (
      <View style={styles.centerContainer}>
        <Text>Requesting camera permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons name="camera-off" size={64} color={theme.colors.error} />
        <Text style={styles.errorText}>Camera permission denied</Text>
        <Button mode="contained" onPress={requestCameraPermission}>
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
      <Camera style={styles.camera} type={type} ref={cameraRef}>
        <View style={styles.overlay}>
          <View style={styles.faceGuide}>
            <MaterialCommunityIcons 
              name="face-recognition" 
              size={200} 
              color={theme.colors.surface}
              style={styles.faceIcon}
            />
          </View>
        </View>

        <View style={styles.instructionContainer}>
          <Text style={styles.instructionText}>
            Position your face in the frame
          </Text>
        </View>

        <View style={styles.controls}>
          <Button
            mode="outlined"
            onPress={toggleCameraType}
            icon="camera-flip"
            textColor={theme.colors.surface}
            style={styles.controlButton}
          >
            Flip
          </Button>

          <Button
            mode="contained"
            onPress={handleCapture}
            loading={isCapturing}
            disabled={isCapturing}
            icon="camera"
            contentStyle={styles.captureButtonContent}
            style={styles.captureButton}
          >
            Capture
          </Button>

          <Button
            mode="outlined"
            onPress={onCancel}
            icon="close"
            textColor={theme.colors.surface}
            style={styles.controlButton}
          >
            Cancel
          </Button>
        </View>
      </Camera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
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
    width: 300,
    height: 400,
    borderWidth: 3,
    borderColor: theme.colors.primary,
    borderRadius: theme.borderRadius.xl,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  faceIcon: {
    opacity: 0.3,
  },
  instructionContainer: {
    position: 'absolute',
    top: theme.spacing.xl,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  instructionText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.surface,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 10,
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
  },
  captureButton: {
    backgroundColor: theme.colors.primary,
  },
  captureButtonContent: {
    height: 50,
  },
  errorText: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.error,
    marginTop: theme.spacing.md,
    marginBottom: theme.spacing.lg,
  },
  button: {
    marginTop: theme.spacing.md,
  },
});

export default FaceRecognitionCamera;