// ========================================
// GOD'S EYE EDTECH - OTC INPUT COMPONENT
// ========================================

import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TextInput, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import * as otcService from '../../services/otcService';
import { OTC_CONFIG } from '../../utils/constants';

const OTCInput = ({ onSubmit, onCancel }) => {
  const codeLength = OTC_CONFIG?.LENGTH || 6;
  const [code, setCode] = useState(Array(codeLength).fill(''));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (code.every(digit => digit !== '')) {
      handleSubmit();
    }
  }, [code]);

  const handleChangeText = (text, index) => {
    if (text && !/^\d$/.test(text)) return;

    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);

    if (text && index < codeLength - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = ({ nativeEvent: { key } }, index) => {
    if (key === 'Backspace') {
      if (code[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newCode = [...code];
        newCode[index] = '';
        setCode(newCode);
      }
    }
  };

  const handleSubmit = async () => {
    const enteredCode = code.join('');
    
    if (enteredCode.length !== codeLength) {
      Alert.alert('Incomplete Code', `Please enter all ${codeLength} digits`);
      return;
    }

    setIsSubmitting(true);
    
    try {
      const response = await otcService.verifyOTC(enteredCode);

      if (response.success) {
        await onSubmit(response);
      } else {
        throw new Error(response.message || 'Invalid code');
      }
    } catch (error) {
      console.error('OTC submit error:', error);
      Alert.alert('Error', error.message || 'Invalid or expired code');
      handleClear();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = () => {
    setCode(Array(codeLength).fill(''));
    inputRefs.current[0]?.focus();
  };

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons 
        name="numeric" 
        size={80} 
        color={theme.colors.primary} 
      />
      
      <Text style={styles.title}>Enter One-Time Code</Text>
      <Text style={styles.subtitle}>
        Enter the {codeLength}-digit code provided by the teacher
      </Text>

      <View style={styles.codeContainer}>
        {code.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[
              styles.input,
              digit && styles.inputFilled,
            ]}
            value={digit}
            onChangeText={(text) => handleChangeText(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            keyboardType="number-pad"
            maxLength={1}
            selectTextOnFocus
            editable={!isSubmitting}
          />
        ))}
      </View>

      <View style={styles.buttonContainer}>
        <Button
          mode="outlined"
          onPress={handleClear}
          style={styles.button}
          disabled={isSubmitting}
          icon="backspace"
        >
          Clear
        </Button>
        
        <Button
          mode="contained"
          onPress={handleSubmit}
          loading={isSubmitting}
          disabled={isSubmitting || code.some(d => d === '')}
          style={styles.button}
          icon="check"
        >
          Verify
        </Button>
      </View>

      <Button
        mode="text"
        onPress={onCancel}
        disabled={isSubmitting}
        style={styles.cancelButton}
      >
        Use Different Method
      </Button>

      <View style={styles.infoBox}>
        <MaterialCommunityIcons 
          name="information" 
          size={14} 
          color={theme.colors.textSecondary} 
        />
        <Text style={styles.infoText}>
          Codes expire after {OTC_CONFIG?.EXPIRY_MINUTES || 5} minutes
        </Text>
      </View>
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
  title: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginBottom: theme.spacing.xl,
    paddingHorizontal: theme.spacing.md,
  },
  codeContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.xl,
  },
  input: {
    width: 50,
    height: 60,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    borderWidth: 2,
    borderColor: theme.colors.border,
    fontSize: theme.fontSizes.h2,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.text,
  },
  inputFilled: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.primary + '10',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  button: {
    flex: 1,
  },
  cancelButton: {
    marginTop: theme.spacing.sm,
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xl,
  },
  infoText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginLeft: theme.spacing.xs,
  },
});

export default OTCInput;