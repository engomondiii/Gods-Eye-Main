import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Menu, Button, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CascadingDropdown = ({
  label,
  value,
  items = [],
  onSelect,
  placeholder = 'Select...',
  error = null, // String error message
  disabled = false,
  required = false, // NEW
  helperText = '', // NEW
  onBlur, // NEW
  icon = 'menu-down',
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  
  const closeMenu = () => {
    setVisible(false);
    if (onBlur) {
      onBlur();
    }
  };

  const handleSelect = (item) => {
    onSelect(item);
    closeMenu();
  };

  return (
    <View style={styles.container}>
      {label && (
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button
            mode="outlined"
            onPress={openMenu}
            disabled={disabled}
            style={[
              styles.button,
              !!error && styles.errorButton,
              disabled && styles.disabledButton,
            ]}
            contentStyle={styles.buttonContent}
            labelStyle={[
              styles.buttonLabel,
              !value && styles.placeholderLabel,
            ]}
            icon={icon}
          >
            {value?.name || placeholder}
          </Button>
        }
        style={styles.menu}
      >
        {items.length > 0 ? (
          items.map((item) => (
            <Menu.Item
              key={item.id}
              onPress={() => handleSelect(item)}
              title={item.name}
              style={value?.id === item.id && styles.selectedItem}
            />
          ))
        ) : (
          <Menu.Item title="No options available" disabled />
        )}
      </Menu>

      {/* Helper Text */}
      <HelperText 
        type={error ? 'error' : 'info'} 
        visible={!!(error || helperText || value)}
      >
        {error || helperText || (value ? `Selected: ${value.name}` : '')}
      </HelperText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#212121',
    marginBottom: 8,
    fontWeight: '500',
  },
  required: {
    color: '#F44336',
  },
  button: {
    borderColor: '#BDBDBD',
    borderRadius: 4,
  },
  errorButton: {
    borderColor: '#F44336',
  },
  disabledButton: {
    backgroundColor: '#F5F5F5',
  },
  buttonContent: {
    justifyContent: 'space-between',
    flexDirection: 'row-reverse',
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 16,
    color: '#212121',
  },
  placeholderLabel: {
    color: '#9E9E9E',
  },
  menu: {
    marginTop: 8,
  },
  selectedItem: {
    backgroundColor: '#E3F2FD',
  },
});

export default CascadingDropdown;