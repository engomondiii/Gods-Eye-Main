import { MD3LightTheme } from 'react-native-paper';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    // Primary Colors
    primary: '#6200EE',
    primaryContainer: '#9D46FF',
    onPrimary: '#FFFFFF',
    onPrimaryContainer: '#FFFFFF',
    
    // Secondary Colors
    secondary: '#03DAC6',
    secondaryContainer: '#66FFF9',
    onSecondary: '#000000',
    onSecondaryContainer: '#000000',
    
    // Background Colors
    background: '#F5F5F5',
    onBackground: '#212121',
    surface: '#FFFFFF',
    surfaceVariant: '#FAFAFA',
    onSurface: '#212121',
    onSurfaceVariant: '#757575',
    
    // Status Colors
    error: '#F44336',
    errorContainer: '#FFEBEE',
    onError: '#FFFFFF',
    onErrorContainer: '#B00020',
    
    // Custom Colors (not part of MD3 but useful)
    success: '#4CAF50',
    successLight: '#E8F5E9',
    warning: '#FF9800',
    warningLight: '#FFF3E0',
    info: '#2196F3',
    infoLight: '#E3F2FD',
    
    // Text Colors
    text: '#212121',
    textSecondary: '#757575',
    textDisabled: '#9E9E9E',
    textPlaceholder: '#BDBDBD',
    
    // Border Colors
    border: '#E0E0E0',
    borderLight: '#EEEEEE',
    borderDark: '#BDBDBD',
    outline: '#E0E0E0',
    
    // UI Colors
    disabled: '#E0E0E0',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    overlay: 'rgba(0, 0, 0, 0.3)',
    
    // Role Colors
    superAdmin: '#F44336',
    teacher: '#2196F3',
    guardian: '#4CAF50',
  },
  
  // Spacing
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 40,
  },
  
  // Border Radius
  roundness: 8,
  
  // Custom roundness values
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 999,
  },
  
  // Shadows
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 2,
    },
    large: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.30,
      shadowRadius: 4.65,
      elevation: 4,
    },
  },
  
  // Font Sizes (custom)
  fontSizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 20,
    h1: 32,
    h2: 28,
    h3: 24,
    h4: 20,
    h5: 18,
    h6: 16,
  },
  
  // Animation
  animation: {
    scale: 1.2,
  },
};

export default theme;