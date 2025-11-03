import { StyleSheet, Dimensions } from 'react-native';
import theme from './theme';

const { width, height } = Dimensions.get('window');

const globalStyles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  
  contentContainer: {
    padding: theme.spacing.md,
  },
  
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: theme.spacing.md,
    paddingBottom: theme.spacing.lg,
  },
  
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.md,
  },
  
  // Card Styles
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.medium,
  },
  
  cardElevated: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.md,
    ...theme.shadows.large,
  },
  
  // Row Styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  rowSpaceBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  
  rowCenter: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  // Text Styles
  textCenter: {
    textAlign: 'center',
  },
  
  textBold: {
    fontWeight: 'bold',
  },
  
  textSemiBold: {
    fontWeight: '600',
  },
  
  textMuted: {
    color: theme.colors.textSecondary,
  },
  
  // Margin Styles
  mt4: { marginTop: theme.spacing.xs },
  mt8: { marginTop: theme.spacing.sm },
  mt16: { marginTop: theme.spacing.md },
  mt24: { marginTop: theme.spacing.lg },
  
  mb4: { marginBottom: theme.spacing.xs },
  mb8: { marginBottom: theme.spacing.sm },
  mb16: { marginBottom: theme.spacing.md },
  mb24: { marginBottom: theme.spacing.lg },
  
  ml4: { marginLeft: theme.spacing.xs },
  ml8: { marginLeft: theme.spacing.sm },
  ml16: { marginLeft: theme.spacing.md },
  
  mr4: { marginRight: theme.spacing.xs },
  mr8: { marginRight: theme.spacing.sm },
  mr16: { marginRight: theme.spacing.md },
  
  // Padding Styles
  p4: { padding: theme.spacing.xs },
  p8: { padding: theme.spacing.sm },
  p16: { padding: theme.spacing.md },
  p24: { padding: theme.spacing.lg },
  
  ph8: { paddingHorizontal: theme.spacing.sm },
  ph16: { paddingHorizontal: theme.spacing.md },
  ph24: { paddingHorizontal: theme.spacing.lg },
  
  pv8: { paddingVertical: theme.spacing.sm },
  pv16: { paddingVertical: theme.spacing.md },
  pv24: { paddingVertical: theme.spacing.lg },
  
  // Flex Styles
  flex1: { flex: 1 },
  flex2: { flex: 2 },
  flex3: { flex: 3 },
  
  // Shadow Styles
  shadowSmall: theme.shadows.small,
  shadowMedium: theme.shadows.medium,
  shadowLarge: theme.shadows.large,
  
  // Border Styles
  border: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  
  borderRadius: {
    borderRadius: theme.borderRadius.md,
  },
  
  // Background Styles
  bgPrimary: {
    backgroundColor: theme.colors.primary,
  },
  
  bgSuccess: {
    backgroundColor: theme.colors.success,
  },
  
  bgError: {
    backgroundColor: theme.colors.error,
  },
  
  bgWarning: {
    backgroundColor: theme.colors.warning,
  },
  
  bgInfo: {
    backgroundColor: theme.colors.info,
  },
  
  // Button Styles
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  
  buttonPrimary: {
    backgroundColor: theme.colors.primary,
  },
  
  buttonSuccess: {
    backgroundColor: theme.colors.success,
  },
  
  buttonError: {
    backgroundColor: theme.colors.error,
  },
  
  // Input Styles
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: theme.fontSizes.md,
  },
  
  inputError: {
    borderColor: theme.colors.error,
  },
  
  // Divider
  divider: {
    height: 1,
    backgroundColor: theme.colors.border,
    marginVertical: theme.spacing.md,
  },
  
  // Screen Dimensions
  fullWidth: {
    width: width,
  },
  
  fullHeight: {
    height: height,
  },
  
  // Status Bar
  statusBarHeight: {
    paddingTop: 24, // Default status bar height
  },
});

export default globalStyles;