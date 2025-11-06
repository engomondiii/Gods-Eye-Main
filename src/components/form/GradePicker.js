import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Menu, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import {
  KENYA_EDUCATION_LEVELS,
  KENYA_EDUCATION_LEVEL_LABELS,
  KENYA_GRADES,
  KENYA_GRADE_LABELS,
  KENYA_GRADES_BY_LEVEL,
} from '../../utils/constants';

const GradePicker = ({ 
  value, 
  onGradeChange, 
  onLevelChange, 
  error = false,
  disabled = false 
}) => {
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleGradeSelect = (grade, level) => {
    onGradeChange(grade);
    onLevelChange(level);
    setSelectedLevel(level);
    closeMenu();
  };

  const getDisplayValue = () => {
    if (!value) {
      return 'Select Grade/Class *';
    }
    return KENYA_GRADE_LABELS[value] || value;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Grade/Class (CBC System) *</Text>
      
      <Menu
        visible={menuVisible}
        onDismiss={closeMenu}
        contentStyle={styles.menuContent}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            disabled={disabled}
            style={[
              styles.button,
              error && styles.buttonError,
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={[
              styles.buttonLabel,
              !value && styles.placeholderLabel,
            ]}
            icon={() => (
              <MaterialCommunityIcons
                name="school-outline"
                size={20}
                color={error ? theme.colors.error : theme.colors.text}
              />
            )}
          >
            {getDisplayValue()}
          </Button>
        }
      >
        {/* Pre-Primary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {KENYA_EDUCATION_LEVEL_LABELS[KENYA_EDUCATION_LEVELS.PRE_PRIMARY]}
          </Text>
          {KENYA_GRADES_BY_LEVEL[KENYA_EDUCATION_LEVELS.PRE_PRIMARY].map((grade) => (
            <Menu.Item
              key={grade}
              onPress={() => handleGradeSelect(grade, KENYA_EDUCATION_LEVELS.PRE_PRIMARY)}
              title={KENYA_GRADE_LABELS[grade]}
              titleStyle={value === grade && styles.selectedItem}
              style={value === grade && styles.selectedItemBackground}
            />
          ))}
        </View>

        {/* Primary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {KENYA_EDUCATION_LEVEL_LABELS[KENYA_EDUCATION_LEVELS.PRIMARY]}
          </Text>
          {KENYA_GRADES_BY_LEVEL[KENYA_EDUCATION_LEVELS.PRIMARY].map((grade) => (
            <Menu.Item
              key={grade}
              onPress={() => handleGradeSelect(grade, KENYA_EDUCATION_LEVELS.PRIMARY)}
              title={KENYA_GRADE_LABELS[grade]}
              titleStyle={value === grade && styles.selectedItem}
              style={value === grade && styles.selectedItemBackground}
            />
          ))}
        </View>

        {/* Junior Secondary Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {KENYA_EDUCATION_LEVEL_LABELS[KENYA_EDUCATION_LEVELS.JUNIOR_SECONDARY]}
          </Text>
          {KENYA_GRADES_BY_LEVEL[KENYA_EDUCATION_LEVELS.JUNIOR_SECONDARY].map((grade) => (
            <Menu.Item
              key={grade}
              onPress={() => handleGradeSelect(grade, KENYA_EDUCATION_LEVELS.JUNIOR_SECONDARY)}
              title={KENYA_GRADE_LABELS[grade]}
              titleStyle={value === grade && styles.selectedItem}
              style={value === grade && styles.selectedItemBackground}
            />
          ))}
        </View>

        {/* Senior Secondary Section (includes 8-4-4 forms) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {KENYA_EDUCATION_LEVEL_LABELS[KENYA_EDUCATION_LEVELS.SENIOR_SECONDARY]}
          </Text>
          {KENYA_GRADES_BY_LEVEL[KENYA_EDUCATION_LEVELS.SENIOR_SECONDARY].map((grade) => (
            <Menu.Item
              key={grade}
              onPress={() => handleGradeSelect(grade, KENYA_EDUCATION_LEVELS.SENIOR_SECONDARY)}
              title={KENYA_GRADE_LABELS[grade]}
              titleStyle={value === grade && styles.selectedItem}
              style={value === grade && styles.selectedItemBackground}
            />
          ))}
        </View>
      </Menu>

      <Text style={styles.helperText}>
        Select the student's current grade level in the CBC system
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  label: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    marginBottom: theme.spacing.xs,
    fontWeight: '500',
  },
  button: {
    justifyContent: 'flex-start',
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  buttonError: {
    borderColor: theme.colors.error,
  },
  buttonContent: {
    justifyContent: 'flex-start',
    paddingVertical: theme.spacing.sm,
  },
  buttonLabel: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    textAlign: 'left',
  },
  placeholderLabel: {
    color: theme.colors.textSecondary,
  },
  menuContent: {
    maxHeight: 400,
    backgroundColor: theme.colors.surface,
  },
  section: {
    paddingVertical: theme.spacing.xs,
  },
  sectionTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
    color: theme.colors.primary,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    backgroundColor: theme.colors.primaryLight || theme.colors.primary + '20',
  },
  selectedItem: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  selectedItemBackground: {
    backgroundColor: theme.colors.primaryLight || theme.colors.primary + '10',
  },
  helperText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.xs,
  },
});

export default GradePicker;