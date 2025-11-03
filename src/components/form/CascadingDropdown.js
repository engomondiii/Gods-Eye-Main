import React, { useState } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Menu, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const CascadingDropdown = ({
  label,
  value,
  items = [],
  onSelect,
  placeholder = 'Select...',
  error = false,
  disabled = false,
  icon = 'menu-down',
}) => {
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleSelect = (item) => {
    onSelect(item);
    closeMenu();
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
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
              error && styles.errorButton,
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