import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

const Button = ({
  mode = 'contained',
  onPress,
  children,
  style,
  disabled = false,
  loading = false,
  icon,
  color,
  labelStyle,
  contentStyle,
  ...props
}) => {
  return (
    <PaperButton
      mode={mode}
      onPress={onPress}
      disabled={disabled}
      loading={loading}
      icon={icon}
      style={[styles.button, style]}
      labelStyle={[styles.label, labelStyle]}
      contentStyle={[styles.content, contentStyle]}
      buttonColor={color}
      {...props}
    >
      {children}
    </PaperButton>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    paddingVertical: 6,
  },
});

export default Button;