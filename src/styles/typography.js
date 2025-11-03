import { StyleSheet } from 'react-native';
import theme from './theme';

const typography = StyleSheet.create({
  // Headings
  h1: {
    fontSize: theme.fontSizes.h1,
    fontWeight: 'bold',
    color: theme.colors.text,
    lineHeight: 40,
  },
  
  h2: {
    fontSize: theme.fontSizes.h2,
    fontWeight: 'bold',
    color: theme.colors.text,
    lineHeight: 36,
  },
  
  h3: {
    fontSize: theme.fontSizes.h3,
    fontWeight: 'bold',
    color: theme.colors.text,
    lineHeight: 32,
  },
  
  h4: {
    fontSize: theme.fontSizes.h4,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 28,
  },
  
  h5: {
    fontSize: theme.fontSizes.h5,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 24,
  },
  
  h6: {
    fontSize: theme.fontSizes.h6,
    fontWeight: '600',
    color: theme.colors.text,
    lineHeight: 22,
  },
  
  // Body Text
  bodyLarge: {
    fontSize: theme.fontSizes.lg,
    color: theme.colors.text,
    lineHeight: 24,
  },
  
  body: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    lineHeight: 20,
  },
  
  bodySmall: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.text,
    lineHeight: 18,
  },
  
  // Labels
  label: {
    fontSize: theme.fontSizes.md,
    fontWeight: '500',
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
  },
  
  labelSmall: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '500',
    color: theme.colors.text,
  },
  
  // Caption
  caption: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    lineHeight: 16,
  },
  
  captionSmall: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    lineHeight: 14,
  },
  
  // Overline
  overline: {
    fontSize: theme.fontSizes.xs,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    color: theme.colors.textSecondary,
  },
  
  // Button Text
  button: {
    fontSize: theme.fontSizes.md,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  buttonSmall: {
    fontSize: theme.fontSizes.sm,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  buttonLarge: {
    fontSize: theme.fontSizes.lg,
    fontWeight: '600',
    textAlign: 'center',
  },
  
  // Link
  link: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.primary,
    textDecorationLine: 'underline',
  },
  
  // Error Text
  error: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.error,
  },
  
  // Success Text
  success: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.success,
  },
  
  // Warning Text
  warning: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.warning,
  },
  
  // Text Alignment
  textLeft: {
    textAlign: 'left',
  },
  
  textCenter: {
    textAlign: 'center',
  },
  
  textRight: {
    textAlign: 'right',
  },
  
  // Text Weight
  regular: {
    fontWeight: '400',
  },
  
  medium: {
    fontWeight: '500',
  },
  
  semiBold: {
    fontWeight: '600',
  },
  
  bold: {
    fontWeight: '700',
  },
  
  // Text Transform
  uppercase: {
    textTransform: 'uppercase',
  },
  
  lowercase: {
    textTransform: 'lowercase',
  },
  
  capitalize: {
    textTransform: 'capitalize',
  },
  
  // Text Decoration
  underline: {
    textDecorationLine: 'underline',
  },
  
  lineThrough: {
    textDecorationLine: 'line-through',
  },
  
  // Line Height
  lineHeightTight: {
    lineHeight: 16,
  },
  
  lineHeightNormal: {
    lineHeight: 20,
  },
  
  lineHeightRelaxed: {
    lineHeight: 24,
  },
  
  lineHeightLoose: {
    lineHeight: 28,
  },
});

export default typography;