import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { HelperText, Button } from 'react-native-paper';
import CascadingDropdown from './CascadingDropdown';

const SchoolPicker = ({ countyId, value, onChange, error }) => {
  const [schools, setSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (countyId) {
      fetchSchools(countyId);
    } else {
      setSchools([]);
    }
  }, [countyId]);

  const fetchSchools = async (countyId) => {
    try {
      setIsLoading(true);
      // TODO: Replace with actual API call
      // const response = await schoolService.getSchoolsByCounty(countyId);
      
      // Mock data
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockSchools = [
        { id: 1, name: 'Nairobi Primary School', county_id: 1, approved: true },
        { id: 2, name: 'Westlands Secondary School', county_id: 1, approved: true },
        { id: 3, name: 'Mombasa High School', county_id: 2, approved: true },
        { id: 4, name: 'Kisumu Academy', county_id: 3, approved: true },
      ];
      
      // Only show approved schools
      setSchools(
        mockSchools.filter(s => s.county_id === countyId && s.approved)
      );
    } catch (error) {
      console.error('Fetch schools error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddNewSchool = () => {
    Alert.alert(
      'Add New School',
      'This will allow you to add a new school to the system. The school will need to be approved by an administrator before it can be used.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Continue',
          onPress: () => {
            // TODO: Navigate to add school screen
            Alert.alert('Coming Soon', 'Add school functionality will be implemented soon!');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CascadingDropdown
        label="School *"
        value={value}
        items={schools}
        onSelect={onChange}
        placeholder={countyId ? 'Select school' : 'Select county first'}
        error={!!error}
        disabled={!countyId || isLoading}
        icon="school"
      />
      {error && <HelperText type="error">{error}</HelperText>}
      
      {countyId && (
        <Button
          mode="text"
          onPress={handleAddNewSchool}
          style={styles.addButton}
          icon="plus"
          compact
        >
          School not listed? Add new school
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
  },
  addButton: {
    marginTop: 4,
    alignSelf: 'flex-start',
  },
});

export default SchoolPicker;