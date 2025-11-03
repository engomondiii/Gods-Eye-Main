import { useState, useEffect, useCallback, useRef } from 'react';
import { Camera } from 'expo-camera';
import { permissionHelpers } from '../utils/permissionHelpers';

/**
 * Custom hook for camera operations
 */
const useCamera = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [type, setType] = useState(Camera.Constants?.Type?.back || 'back');
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const cameraRef = useRef(null);

  /**
   * Request camera permission
   */
  const requestPermission = useCallback(async () => {
    try {
      setError(null);
      const result = await permissionHelpers.requestCameraPermission();
      setHasPermission(result.granted);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Request camera permission error:', err);
      return { granted: false, error: err.message };
    }
  }, []);

  /**
   * Check camera permission
   */
  const checkPermission = useCallback(async () => {
    try {
      const result = await permissionHelpers.checkCameraPermission();
      setHasPermission(result.granted);
      return result;
    } catch (err) {
      setError(err.message);
      console.error('Check camera permission error:', err);
      return { granted: false, error: err.message };
    }
  }, []);

  /**
   * Toggle camera type (front/back)
   */
  const toggleCameraType = useCallback(() => {
    setType((current) =>
      current === (Camera.Constants?.Type?.back || 'back')
        ? Camera.Constants?.Type?.front || 'front'
        : Camera.Constants?.Type?.back || 'back'
    );
  }, []);

  /**
   * Take picture
   */
  const takePicture = useCallback(async (options = {}) => {
    if (!cameraRef.current || !isReady) {
      setError('Camera not ready');
      return null;
    }

    try {
      setIsCapturing(true);
      setError(null);

      const photo = await cameraRef.current.takePictureAsync({
        quality: options.quality || 0.8,
        base64: options.base64 !== false,
        exif: options.exif || false,
        skipProcessing: options.skipProcessing || false,
      });

      return photo;
    } catch (err) {
      setError(err.message);
      console.error('Take picture error:', err);
      return null;
    } finally {
      setIsCapturing(false);
    }
  }, [isReady]);

  /**
   * Record video
   */
  const recordVideo = useCallback(async (options = {}) => {
    if (!cameraRef.current || !isReady) {
      setError('Camera not ready');
      return null;
    }

    try {
      setError(null);

      const video = await cameraRef.current.recordAsync({
        quality: options.quality || Camera.Constants?.VideoQuality?.['720p'] || '720p',
        maxDuration: options.maxDuration || 60,
        maxFileSize: options.maxFileSize || undefined,
        mute: options.mute || false,
      });

      return video;
    } catch (err) {
      setError(err.message);
      console.error('Record video error:', err);
      return null;
    }
  }, [isReady]);

  /**
   * Stop recording
   */
  const stopRecording = useCallback(() => {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
    }
  }, []);

  /**
   * Pause preview
   */
  const pausePreview = useCallback(async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.pausePreview();
      } catch (err) {
        console.error('Pause preview error:', err);
      }
    }
  }, []);

  /**
   * Resume preview
   */
  const resumePreview = useCallback(async () => {
    if (cameraRef.current) {
      try {
        await cameraRef.current.resumePreview();
      } catch (err) {
        console.error('Resume preview error:', err);
      }
    }
  }, []);

  /**
   * Get available picture sizes
   */
  const getAvailablePictureSizes = useCallback(async () => {
    if (cameraRef.current) {
      try {
        const sizes = await cameraRef.current.getAvailablePictureSizesAsync();
        return sizes;
      } catch (err) {
        console.error('Get available picture sizes error:', err);
        return [];
      }
    }
    return [];
  }, []);

  /**
   * Handle camera ready
   */
  const handleCameraReady = useCallback(() => {
    setIsReady(true);
  }, []);

  /**
   * Handle camera mount error
   */
  const handleMountError = useCallback((error) => {
    setError(error.message);
    console.error('Camera mount error:', error);
  }, []);

  /**
   * Clear error
   */
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  /**
   * Check permission on mount
   */
  useEffect(() => {
    checkPermission();
  }, [checkPermission]);

  /**
   * Cleanup on unmount
   */
  useEffect(() => {
    return () => {
      if (cameraRef.current) {
        try {
          cameraRef.current.pausePreview();
        } catch (err) {
          console.error('Cleanup error:', err);
        }
      }
    };
  }, []);

  return {
    // State
    hasPermission,
    isReady,
    type,
    isCapturing,
    error,
    cameraRef,

    // Actions
    requestPermission,
    checkPermission,
    toggleCameraType,
    setType,
    takePicture,
    recordVideo,
    stopRecording,
    pausePreview,
    resumePreview,
    getAvailablePictureSizes,
    handleCameraReady,
    handleMountError,
    clearError,
  };
};

export default useCamera;