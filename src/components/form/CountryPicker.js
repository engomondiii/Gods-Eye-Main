import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { HelperText } from 'react-native-paper';
import CascadingDropdown from './CascadingDropdown';

const CountryPicker = ({ 
  value, 
  onChange, 
  error = null, // String error message
  required = false, // NEW
  helperText = '', // NEW
  onBlur, // NEW
}) => {
  const [countries, setCountries] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await locationService.getCountries();
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockCountries = [
        { id: 1, name: 'Kenya' },
        { id: 2, name: 'Uganda' },
        { id: 3, name: 'Tanzania' },
      ];
      
      setCountries(mockCountries);
    } catch (error) {
      console.error('Fetch countries error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CascadingDropdown
        label="Country"
        value={value}
        items={countries}
        onSelect={onChange}
        placeholder="Select country"
        error={error}
        required={required}
        helperText={helperText || (isLoading ? 'Loading countries...' : '')}
        disabled={isLoading}
        onBlur={onBlur}
        icon="earth"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});

export default CountryPicker;