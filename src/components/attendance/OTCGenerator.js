// ========================================
// GOD'S EYE EDTECH - OTC GENERATOR COMPONENT
// ========================================

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import theme from '../../styles/theme';
import * as otcService from '../../services/otcService';
import { OTC_CONFIG } from '../../utils/constants';

const OTCGenerator = ({ studentId, onGenerate }) => {
  const [otcData, setOtcData] = useState(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    let interval;
    if (otcData && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setOtcData(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otcData, timeLeft]);

  useEffect(() => {
    // Update time left when otcData changes
    if (otcData && otcData.expires_at) {
      const remaining = otcService.getRemainingTime(otcData.expires_at);
      setTimeLeft(remaining.seconds);
    }
  }, [otcData]);

  const generateCode = async () => {
    setIsGenerating(true);
    
    try {
      const response = await otcService.generateOTC(studentId);

      if (response.success) {
        setOtcData(response.data);
        
        // Calculate initial time left
        const remaining = otcService.getRemainingTime(response.data.expires_at);
        setTimeLeft(remaining.seconds);

        if (onGenerate) {
          onGenerate(response.data);
        }
      } else {
        throw new Error(response.message || 'Failed to generate code');
      }
    } catch (error) {
      console.error('Generate OTC error:', error);
      Alert.alert('Error', error.message || 'Failed to generate code');
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async () => {
    if (!otcData || !otcData.code) return;
    
    await Clipboard.setStringAsync(otcData.code);
    Alert.alert('Copied', 'Code copied to clipboard');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimeColor = () => {
    if (timeLeft > 180) return theme.colors.success;
    if (timeLeft > 60) return theme.colors.warning;
    return theme.colors.error;
  };

  return (
    <View style={styles.container}>
      {otcData ? (
        <>
          <View style={styles.codeContainer}>
            <Text style={styles.codeLabel}>Your One-Time Code</Text>
            <View style={styles.codeDisplay}>
              {otcData.code.split('').map((digit, index) => (
                <View key={index} style={styles.digitBox}>
                  <Text style={styles.digitText}>{digit}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.timerContainer}>
            <MaterialCommunityIcons 
              name="timer-sand" 
              size={20} 
              color={getTimeColor()} 
            />
            <Text style={[styles.timerText, { color: getTimeColor() }]}>
              Expires in {formatTime(timeLeft)}
            </Text>
          </View>

          <View style={styles.actionContainer}>
            <Button
              mode="outlined"
              onPress={copyToClipboard}
              icon="content-copy"
              style={styles.actionButton}
            >
              Copy Code
            </Button>
            <Button
              mode="outlined"
              onPress={generateCode}
              icon="refresh"
              style={styles.actionButton}
              loading={isGenerating}
              disabled={isGenerating}
            >
              New Code
            </Button>
          </View>

          <View style={styles.infoBox}>
            <MaterialCommunityIcons 
              name="information" 
              size={16} 
              color={theme.colors.info} 
            />
            <Text style={styles.infoText}>
              Share this code with the teacher for manual check-in
            </Text>
          </View>
        </>
      ) : (
        <>
          <MaterialCommunityIcons 
            name="numeric" 
            size={100} 
            color={theme.colors.primary} 
          />
          <Text style={styles.promptTitle}>Generate One-Time Code</Text>
          <Text style={styles.promptText}>
            Generate a 6-digit code valid for {OTC_CONFIG?.EXPIRY_MINUTES || 5} minutes
          </Text>
          <Button
            mode="contained"
            onPress={generateCode}
            loading={isGenerating}
            disabled={isGenerating}
            icon="plus-circle"
            contentStyle={styles.generateButtonContent}
            style={styles.generateButton}
          >
            Generate Code
          </Button>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    backgroundColor: theme.colors.background,
  },
  codeContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  codeLabel: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.textSecondary,
    marginBottom: theme.spacing.md,
  },
  codeDisplay: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  digitBox: {
    width: 50,
    height: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.shadows.medium,
  },
  digitText: {
    fontSize: theme.fontSizes.h2,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.lg,
  },
  timerText: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    marginLeft: theme.spacing.xs,
  },
  actionContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },
  actionButton: {
    flex: 1,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E3F2FD',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.sm,
    maxWidth: 300,
  },
  infoText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.info,
    marginLeft: theme.spacing.xs,
    flex: 1,
  },
  promptTitle: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  promptText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  generateButton: {
    backgroundColor: theme.colors.primary,
  },
  generateButtonContent: {
    height: 50,
  },
});

export default OTCGenerator;