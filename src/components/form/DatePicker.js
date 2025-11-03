import React, { useState } from 'react';
import { View, StyleSheet, Platform, Text, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '../../utils/formatters';

const DatePicker = ({
  label,
  value,
  onChange,
  error = false,
  minimumDate,
  maximumDate,
  mode = 'date',
}) => {
  const [show, setShow] = useState(false);
  const [tempDate, setTempDate] = useState(value || new Date());

  const handleChange = (event, selectedDate) => {
    if (Platform.OS === 'android') {
      setShow(false);
    }
    
    if (event.type === 'set' && selectedDate) {
      setTempDate(selectedDate);
      onChange(selectedDate);
    }
  };

  const handleConfirm = () => {
    onChange(tempDate);
    setShow(false);
  };

  const handleCancel = () => {
    setTempDate(value || new Date());
    setShow(false);
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <TouchableOpacity
        style={[styles.button, error && styles.errorButton]}
        onPress={() => setShow(true)}
      >
        <View style={styles.buttonContent}>
          <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
          <Text style={[styles.buttonText, !value && styles.placeholderText]}>
            {value ? formatDate(value) : 'Select date'}
          </Text>
          <MaterialCommunityIcons name="menu-down" size={24} color="#757575" />
        </View>
      </TouchableOpacity>

      {show && (
        <View>
          <DateTimePicker
            value={tempDate}
            mode={mode}
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleChange}
            minimumDate={minimumDate}
            maximumDate={maximumDate}
          />
          
          {Platform.OS === 'ios' && (
            <View style={styles.iosButtons}>
              <Button onPress={handleCancel}>Cancel</Button>
              <Button onPress={handleConfirm}>Confirm</Button>
            </View>
          )}
        </View>
      )}
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
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  errorButton: {
    borderColor: '#F44336',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    color: '#212121',
    marginLeft: 8,
  },
  placeholderText: {
    color: '#9E9E9E',
  },
  iosButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 8,
  },
});

export default DatePicker;