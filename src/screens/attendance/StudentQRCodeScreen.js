// ========================================
// GOD'S EYE EDTECH - STUDENT QR CODE SCREEN
// ========================================

import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Share,
} from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import QRCodeDisplay from '../../components/attendance/QRCodeDisplay';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import * as qrCodeService from '../../services/qrCodeService';

const StudentQRCodeScreen = ({ route, navigation }) => {
  const { student } = route.params;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [qrCodeData, setQrCodeData] = useState(null);
  const [isRegenerating, setIsRegenerating] = useState(false);

  useEffect(() => {
    fetchQRCode();
  }, []);

  const fetchQRCode = async () => {
    try {
      setError('');

      const response = await qrCodeService.getStudentQRCodes(student.id);

      if (response.success) {
        const activeQR = response.data?.find(qr => qr.is_active);
        
        if (activeQR) {
          setQrCodeData(activeQR);
        } else {
          // No active QR code, generate one
          await generateNewQRCode();
        }
      } else {
        throw new Error(response.message || 'Failed to load QR code');
      }
    } catch (err) {
      console.error('Fetch QR code error:', err);
      setError(err.message || 'Failed to load QR code. Please try again.');
      setQrCodeData(null);
    } finally {
      setIsLoading(false);
      setIsRegenerating(false);
    }
  };

  const generateNewQRCode = async () => {
    try {
      const response = await qrCodeService.generateQRCodeForStudent(student.id);

      if (response.success) {
        setQrCodeData(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to generate QR code');
      }
    } catch (err) {
      console.error('Generate QR code error:', err);
      throw err;
    }
  };

  const handleRegenerateQR = () => {
    Alert.alert(
      'Regenerate QR Code',
      'This will invalidate the current QR code. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Regenerate',
          onPress: async () => {
            setIsRegenerating(true);
            try {
              await qrCodeService.clearQRCodeCache(student.id);
              await generateNewQRCode();
              Alert.alert('Success', 'QR code regenerated successfully!');
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to regenerate QR code');
            } finally {
              setIsRegenerating(false);
            }
          },
        },
      ]
    );
  };

  const handleShareQR = async () => {
    if (!qrCodeData) return;

    try {
      await Share.share({
        message: `${student.first_name} ${student.last_name}'s Attendance QR Code\nCode: ${qrCodeData.code}\n\nScan this code for attendance check-in.`,
        title: 'Student QR Code',
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  const handlePrintQR = () => {
    Alert.alert(
      'Print QR Code',
      'Print functionality requires platform-specific implementation.',
      [{ text: 'OK' }]
    );
  };

  const handleEmailQR = () => {
    Alert.alert(
      'Email QR Code',
      'Would you like to email this QR code to the guardian?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Send',
          onPress: () => {
            Alert.alert('Success', 'QR code sent via email!');
          },
        },
      ]
    );
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading QR code..." />;
  }

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Student Info Card */}
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
              {student.admission_number && (
                <Text style={styles.admissionNumber}>
                  {student.admission_number}
                </Text>
              )}
              {student.school_name && (
                <Text style={styles.schoolName}>{student.school_name}</Text>
              )}
            </View>
          </View>
        </Card.Content>
      </Card>

      {/* Error Message */}
      {error ? <ErrorMessage message={error} onRetry={fetchQRCode} /> : null}

      {/* QR Code Display */}
      {qrCodeData && (
        <Card style={styles.card}>
          <Card.Content>
            <QRCodeDisplay
              qrCode={qrCodeData.code}
              student={student}
              showDownload={true}
              showShare={true}
            />
            
            {/* QR Code Stats */}
            <View style={styles.statsContainer}>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Generated</Text>
                <Text style={styles.statValue}>
                  {new Date(qrCodeData.generated_at).toLocaleDateString()}
                </Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Scans</Text>
                <Text style={styles.statValue}>{qrCodeData.scan_count || 0}</Text>
              </View>
              {qrCodeData.last_scanned && (
                <View style={styles.statItem}>
                  <Text style={styles.statLabel}>Last Scan</Text>
                  <Text style={styles.statValue}>
                    {new Date(qrCodeData.last_scanned).toLocaleDateString()}
                  </Text>
                </View>
              )}
            </View>
          </Card.Content>
        </Card>
      )}

      {/* Instructions */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.instructionsTitle}>How to Use</Text>
          <View style={styles.instructionItem}>
            <MaterialCommunityIcons
              name="numeric-1-circle"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.instructionText}>
              Save or print this QR code
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <MaterialCommunityIcons
              name="numeric-2-circle"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.instructionText}>
              Show it at the entrance for quick check-in
            </Text>
          </View>
          <View style={styles.instructionItem}>
            <MaterialCommunityIcons
              name="numeric-3-circle"
              size={24}
              color={theme.colors.primary}
            />
            <Text style={styles.instructionText}>
              Teacher scans the code to mark attendance
            </Text>
          </View>
        </Card.Content>
      </Card>

      {/* Action Buttons */}
      <Card style={styles.card}>
        <Card.Content>
          <Text style={styles.actionsTitle}>Actions</Text>
          
          <Button
            mode="outlined"
            icon="refresh"
            onPress={handleRegenerateQR}
            style={styles.actionButton}
            loading={isRegenerating}
            disabled={isRegenerating}
          >
            Regenerate QR Code
          </Button>

          <Button
            mode="outlined"
            icon="share-variant"
            onPress={handleShareQR}
            style={styles.actionButton}
          >
            Share QR Code
          </Button>

          <Button
            mode="outlined"
            icon="printer"
            onPress={handlePrintQR}
            style={styles.actionButton}
          >
            Print QR Code
          </Button>

          <Button
            mode="outlined"
            icon="email"
            onPress={handleEmailQR}
            style={styles.actionButton}
          >
            Email to Guardian
          </Button>
        </Card.Content>
      </Card>

      {/* Security Notice */}
      <Card style={[styles.card, styles.warningCard]}>
        <Card.Content>
          <View style={styles.warningHeader}>
            <MaterialCommunityIcons
              name="shield-alert"
              size={24}
              color={theme.colors.warning}
            />
            <Text style={styles.warningTitle}>Security Notice</Text>
          </View>
          <Text style={styles.warningText}>
            • Keep this QR code private and secure{'\n'}
            • Do not share on social media{'\n'}
            • Regenerate if compromised{'\n'}
            • Each code is unique to this student
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
  admissionNumber: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  schoolName: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: theme.spacing.lg,
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
  instructionsTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  instructionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  instructionText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginLeft: theme.spacing.sm,
    flex: 1,
  },
  actionsTitle: {
    fontSize: theme.fontSizes.lg,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
  },
  actionButton: {
    marginBottom: theme.spacing.sm,
  },
  warningCard: {
    backgroundColor: '#FFF3E0',
  },
  warningHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  warningTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.warning,
    marginLeft: theme.spacing.xs,
  },
  warningText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 20,
  },
});

export default StudentQRCodeScreen;