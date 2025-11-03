import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { HelperText } from 'react-native-paper';
import CascadingDropdown from './CascadingDropdown';

const CountyPicker = ({ countryId, value, onChange, error }) => {
  const [counties, setCounties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (countryId) {
      fetchCounties(countryId);
    } else {
      setCounties([]);
    }
  }, [countryId]);

  const fetchCounties = async (countryId) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await locationService.getCounties(countryId);
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockCounties = [
        { id: 1, name: 'Nairobi', country_id: 1 },
        { id: 2, name: 'Mombasa', country_id: 1 },
        { id: 3, name: 'Kisumu', country_id: 1 },
        { id: 4, name: 'Nakuru', country_id: 1 },
        { id: 5, name: 'Kiambu', country_id: 1 },
      ];
      
      setCounties(mockCounties.filter(c => c.country_id === countryId));
    } catch (error) {
      console.error('Fetch counties error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <CascadingDropdown
        label="County *"
        value={value}
        items={counties}
        onSelect={onChange}
        placeholder={countryId ? 'Select county' : 'Select country first'}
        error={!!error}
        disabled={!countryId || isLoading}
        icon="map-marker"
      />
      {error && <HelperText type="error">{error}</HelperText>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
});

export default CountyPicker;