import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Menu, Button, TextInput, Chip, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { KENYA_COMMON_HOUSES, KENYA_HOUSE_COLORS } from '../../utils/constants';

const HousePicker = ({ 
  houseName,
  houseColor,
  onHouseChange, 
  onColorChange,
  disabled = false,
  error = null, // String error message - NEW
  helperText = '', // NEW
  onBlur, // NEW
}) => {
  const [houseMenuVisible, setHouseMenuVisible] = useState(false);
  const [colorMenuVisible, setColorMenuVisible] = useState(false);
  const [customHouseVisible, setCustomHouseVisible] = useState(false);
  const [customHouseInput, setCustomHouseInput] = useState('');

  const openHouseMenu = () => setHouseMenuVisible(true);
  
  const closeHouseMenu = () => {
    setHouseMenuVisible(false);
    if (onBlur) {
      onBlur();
    }
  };
  
  const openColorMenu = () => setColorMenuVisible(true);
  
  const closeColorMenu = () => {
    setColorMenuVisible(false);
    if (onBlur) {
      onBlur();
    }
  };

  const handleHouseSelect = (house) => {
    if (house === 'custom') {
      setCustomHouseVisible(true);
      closeHouseMenu();
    } else {
      onHouseChange(house);
      closeHouseMenu();
    }
  };

  const handleColorSelect = (color) => {
    onColorChange(color);
    closeColorMenu();
  };

  const handleCustomHouseSubmit = () => {
    if (customHouseInput.trim()) {
      onHouseChange(customHouseInput.trim());
      setCustomHouseInput('');
      setCustomHouseVisible(false);
      if (onBlur) {
        onBlur();
      }
    }
  };

  const handleCustomHouseCancel = () => {
    setCustomHouseInput('');
    setCustomHouseVisible(false);
  };

  const handleClearHouse = () => {
    onHouseChange('');
    onColorChange('');
    if (onBlur) {
      onBlur();
    }
  };

  const getHouseDisplayValue = () => {
    if (!houseName) {
      return 'Select House (Optional)';
    }
    return houseName;
  };

  const getColorDisplayValue = () => {
    if (!houseColor) {
      return 'Select House Color';
    }
    return houseColor;
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>House System (Optional)</Text>
        {houseName && (
          <Chip
            mode="flat"
            onPress={handleClearHouse}
            onClose={handleClearHouse}
            style={styles.clearChip}
            textStyle={styles.clearChipText}
            icon="close-circle"
          >
            Clear
          </Chip>
        )}
      </View>
      
      {/* House Name Picker */}
      {!customHouseVisible ? (
        <Menu
          visible={houseMenuVisible}
          onDismiss={closeHouseMenu}
          contentStyle={styles.menuContent}
          anchor={
            <Button
              mode="outlined"
              onPress={openHouseMenu}
              disabled={disabled}
              style={[
                styles.button,
                !!error && styles.buttonError,
              ]}
              contentStyle={styles.buttonContent}
              labelStyle={[
                styles.buttonLabel,
                !houseName && styles.placeholderLabel,
              ]}
              icon={() => (
                <MaterialCommunityIcons
                  name="home-group"
                  size={20}
                  color={error ? theme.colors.error : theme.colors.text}
                />
              )}
            >
              {getHouseDisplayValue()}
            </Button>
          }
        >
          {/* Mountain-based Houses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mountain-Based Houses</Text>
            {KENYA_COMMON_HOUSES.mountains.map((house) => (
              <Menu.Item
                key={house}
                onPress={() => handleHouseSelect(house)}
                title={`${house} House`}
                titleStyle={houseName === house && styles.selectedItem}
                style={houseName === house && styles.selectedItemBackground}
                leadingIcon="image-filter-hdr"
              />
            ))}
          </View>

          {/* Wildlife Park-based Houses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wildlife Park-Based Houses</Text>
            {KENYA_COMMON_HOUSES.wildlifeParks.map((house) => (
              <Menu.Item
                key={house}
                onPress={() => handleHouseSelect(house)}
                title={`${house} House`}
                titleStyle={houseName === house && styles.selectedItem}
                style={houseName === house && styles.selectedItemBackground}
                leadingIcon="paw"
              />
            ))}
          </View>

          {/* Historical Figure-based Houses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Historical Figure-Based Houses</Text>
            {KENYA_COMMON_HOUSES.historicalFigures.map((house) => (
              <Menu.Item
                key={house}
                onPress={() => handleHouseSelect(house)}
                title={`${house} House`}
                titleStyle={houseName === house && styles.selectedItem}
                style={houseName === house && styles.selectedItemBackground}
                leadingIcon="account-star"
              />
            ))}
          </View>

          {/* Color-based Houses */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Color-Based Houses</Text>
            {KENYA_COMMON_HOUSES.colors.map((house) => (
              <Menu.Item
                key={house}
                onPress={() => handleHouseSelect(house)}
                title={`${house} House`}
                titleStyle={houseName === house && styles.selectedItem}
                style={houseName === house && styles.selectedItemBackground}
                leadingIcon="palette"
              />
            ))}
          </View>

          {/* Custom House Option */}
          <View style={styles.section}>
            <Menu.Item
              onPress={() => handleHouseSelect('custom')}
              title="Custom House..."
              leadingIcon="pencil"
              style={styles.customMenuItem}
            />
          </View>
        </Menu>
      ) : (
        <View style={styles.customInputContainer}>
          <TextInput
            label="Enter Custom House Name"
            mode="outlined"
            value={customHouseInput}
            onChangeText={setCustomHouseInput}
            style={styles.customInput}
            autoCapitalize="words"
            autoFocus
            placeholder="e.g., Uhuru, Freedom, Excellence"
            right={
              <TextInput.Icon
                icon="close"
                onPress={handleCustomHouseCancel}
              />
            }
          />
          <View style={styles.customButtonsContainer}>
            <Button
              mode="outlined"
              onPress={handleCustomHouseCancel}
              style={styles.customButton}
            >
              Cancel
            </Button>
            <Button
              mode="contained"
              onPress={handleCustomHouseSubmit}
              style={styles.customButton}
              disabled={!customHouseInput.trim()}
            >
              Add House
            </Button>
          </View>
        </View>
      )}

      {/* House Color Picker - Only shown if house is selected */}
      {houseName && !customHouseVisible && (
        <View style={styles.colorPickerContainer}>
          <Menu
            visible={colorMenuVisible}
            onDismiss={closeColorMenu}
            contentStyle={styles.colorMenuContent}
            anchor={
              <Button
                mode="outlined"
                onPress={openColorMenu}
                disabled={disabled}
                style={styles.button}
                contentStyle={styles.buttonContent}
                labelStyle={[
                  styles.buttonLabel,
                  !houseColor && styles.placeholderLabel,
                ]}
                icon={() => (
                  <View style={styles.colorIconContainer}>
                    <MaterialCommunityIcons
                      name="palette"
                      size={20}
                      color={theme.colors.text}
                    />
                    {houseColor && (
                      <View 
                        style={[
                          styles.colorPreview, 
                          { backgroundColor: houseColor }
                        ]} 
                      />
                    )}
                  </View>
                )}
              >
                {getColorDisplayValue()}
              </Button>
            }
          >
            <View style={styles.colorGridContainer}>
              <Text style={styles.colorGridTitle}>Select House Color</Text>
              <View style={styles.colorGrid}>
                {KENYA_HOUSE_COLORS.map((colorObj) => (
                  <TouchableOpacity
                    key={colorObj.hex}
                    style={styles.colorOptionContainer}
                    onPress={() => handleColorSelect(colorObj.hex)}
                  >
                    <View 
                      style={[
                        styles.colorOption,
                        { backgroundColor: colorObj.hex },
                        houseColor === colorObj.hex && styles.selectedColorOption,
                      ]}
                    >
                      {houseColor === colorObj.hex && (
                        <MaterialCommunityIcons
                          name="check"
                          size={24}
                          color={colorObj.name === 'Yellow' ? '#000' : '#FFF'}
                        />
                      )}
                    </View>
                    <Text style={styles.colorName}>{colorObj.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </Menu>
        </View>
      )}

      {/* Helper Text */}
      <HelperText 
        type={error ? 'error' : 'info'} 
        visible={!!(error || helperText || houseName || customHouseVisible)}
      >
        {error || helperText || (
          customHouseVisible 
            ? 'Enter your school\'s custom house name' 
            : houseName
              ? 'House system is used for competitions and activities'
              : 'Common in Kenyan secondary schools for sports and academic competitions'
        )}
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  label: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
    fontWeight: '500',
  },
  clearChip: {
    height: 28,
    backgroundColor: theme.colors.errorContainer,
  },
  clearChipText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.error,
  },
  button: {
    justifyContent: 'flex-start',
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.xs,
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
    maxHeight: 450,
    backgroundColor: theme.colors.surface,
  },
  colorMenuContent: {
    backgroundColor: theme.colors.surface,
    minWidth: 280,
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
  customMenuItem: {
    backgroundColor: theme.colors.successLight || theme.colors.success + '20',
  },
  customInputContainer: {
    marginTop: theme.spacing.xs,
  },
  customInput: {
    backgroundColor: theme.colors.surface,
    marginBottom: theme.spacing.sm,
  },
  customButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: theme.spacing.sm,
  },
  customButton: {
    flex: 1,
  },
  colorPickerContainer: {
    marginTop: theme.spacing.xs,
  },
  colorIconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  colorPreview: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  colorGridContainer: {
    padding: theme.spacing.md,
  },
  colorGridTitle: {
    fontSize: theme.fontSizes.md,
    fontWeight: 'bold',
    color: theme.colors.text,
    marginBottom: theme.spacing.sm,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
  },
  colorOptionContainer: {
    alignItems: 'center',
    width: '22%',
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 3,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  selectedColorOption: {
    borderColor: theme.colors.primary,
    borderWidth: 3,
  },
  colorName: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.text,
    textAlign: 'center',
  },
});

export default HousePicker;