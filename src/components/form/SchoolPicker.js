// ========================================
// GOD'S EYE EDTECH - SCHOOL PICKER
// ========================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Text, TextInput, Chip, Button } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as schoolService from '../../services/schoolService';

// ============================================================
// SCHOOL PICKER COMPONENT
// ============================================================

const SchoolPicker = ({
  countyId,
  value,
  onChange,
  error = false,
  disabled = false,
  label = 'School',
  placeholder = 'Type or select school...',
  required = false,
  helperText = '',
  approvedOnly = true,
  onAddNewSchool,
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);

  const inputRef = useRef(null);

  // ============================================================
  // FETCH SCHOOLS FROM BACKEND
  // ============================================================

  /**
   * Fetch schools for the selected county
   */
  const fetchSchools = async (county) => {
    try {
      setIsLoadingSchools(true);

      if (__DEV__) {
        console.log(`🏫 Fetching schools for county ${county}...`);
      }

      const result = await schoolService.getSchoolsByCounty(county, approvedOnly);

      if (result.success) {
        // Handle both array and paginated response
        const schoolsData = Array.isArray(result.data) 
          ? result.data 
          : result.data.results || [];

        setSchools(schoolsData);
        setFilteredSchools(schoolsData);

        if (__DEV__) {
          console.log(`✅ Loaded ${schoolsData.length} schools`);
        }
      } else {
        console.error('❌ Failed to fetch schools:', result.message);
        Alert.alert('Error', result.message || 'Failed to load schools');
      }
    } catch (error) {
      console.error('❌ Fetch schools error:', error);
      Alert.alert('Error', 'Failed to load schools. Please try again.');
    } finally {
      setIsLoadingSchools(false);
    }
  };

  /**
   * Load schools when county changes
   */
  useEffect(() => {
    if (countyId) {
      fetchSchools(countyId);
    } else {
      setSchools([]);
      setFilteredSchools([]);
    }
  }, [countyId]);

  // ============================================================
  // SEARCH & FILTER
  // ============================================================

  /**
   * Update search query when value changes externally
   */
  useEffect(() => {
    if (value?.name) {
      setSearchQuery(value.name);
    } else {
      setSearchQuery('');
    }
  }, [value]);

  /**
   * Filter schools as user types
   */
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredSchools(schools);
      setShowSuggestions(false);
    } else {
      const filtered = schools.filter((school) =>
        school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        school.nemis_code?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSchools(filtered);
      setShowSuggestions(true);
    }
  }, [searchQuery, schools]);

  // ============================================================
  // HANDLERS
  // ============================================================

  /**
   * Handle input text change
   */
  const handleInputChange = (text) => {
    setSearchQuery(text);

    // Clear the value when user is typing
    if (value && text !== value.name) {
      onChange(null);
    }
  };

  /**
   * Handle school selection
   */
  const handleSchoolSelect = (school) => {
    onChange(school);
    setSearchQuery(school.name);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  /**
   * Clear school selection
   */
  const handleClearSchool = () => {
    onChange(null);
    setSearchQuery('');
    setFilteredSchools(schools);
    setShowSuggestions(false);
  };

  /**
   * Handle input focus
   */
  const handleFocus = () => {
    if (searchQuery.trim() === '') {
      setFilteredSchools(schools);
    }
    setShowSuggestions(true);
  };

  /**
   * Handle input blur
   */
  const handleBlur = () => {
    // Delay to allow item selection
    setTimeout(() => {
      setShowSuggestions(false);
    }, 200);
  };

  /**
   * Handle add new school
   */
  const handleAddNewSchool = () => {
    if (onAddNewSchool) {
      onAddNewSchool();
    } else {
      Alert.alert(
        'Add New School',
        'This will allow you to add a new school to the system. The school will need to be approved by an administrator before it can be used.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Continue',
            onPress: () => {
              Alert.alert('Coming Soon', 'Add school functionality will be implemented soon!');
            },
          },
        ]
      );
    }
  };

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <View style={styles.container}>
      {/* Header Row */}
      <View style={styles.headerRow}>
        <Text style={styles.label}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {value && (
          <Chip
            mode="flat"
            onPress={handleClearSchool}
            onClose={handleClearSchool}
            style={styles.clearChip}
            textStyle={styles.clearChipText}
            icon="close-circle"
          >
            Clear
          </Chip>
        )}
      </View>

      {/* Searchable Input */}
      <TextInput
        ref={inputRef}
        label={placeholder}
        mode="outlined"
        value={searchQuery}
        onChangeText={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={error}
        disabled={disabled || !countyId || isLoadingSchools}
        style={styles.input}
        placeholder={countyId ? placeholder : 'Select county first'}
        autoCapitalize="words"
        left={<TextInput.Icon icon="school" />}
        right={
          isLoadingSchools ? (
            <TextInput.Icon icon={() => <ActivityIndicator size={20} />} />
          ) : searchQuery ? (
            <TextInput.Icon icon="close" onPress={handleClearSchool} />
          ) : (
            <TextInput.Icon icon="menu-down" />
          )
        }
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && !disabled && !isLoadingSchools && countyId && (
        <View style={styles.suggestionsContainer}>
          {filteredSchools.length > 0 ? (
            <>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>
                  {searchQuery
                    ? `${filteredSchools.length} ${
                        filteredSchools.length === 1 ? 'school' : 'schools'
                      } found`
                    : `${schools.length} Schools in County`}
                </Text>
              </View>
              <ScrollView
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {filteredSchools.map((school) => {
                  const isSelected = value?.id === school.id;
                  return (
                    <TouchableOpacity
                      key={school.id}
                      onPress={() => handleSchoolSelect(school)}
                      style={[
                        styles.suggestionItem,
                        isSelected && styles.selectedSuggestionItem,
                      ]}
                    >
                      <View style={styles.schoolInfo}>
                        <MaterialCommunityIcons
                          name="school"
                          size={24}
                          color={isSelected ? '#6200EE' : '#757575'}
                          style={styles.suggestionIcon}
                        />
                        <View style={styles.schoolDetails}>
                          <Text
                            style={[
                              styles.schoolName,
                              isSelected && styles.selectedText,
                            ]}
                          >
                            {school.name}
                          </Text>
                          {school.nemis_code && (
                            <Text style={styles.nemisCode}>
                              NEMIS: {school.nemis_code}
                            </Text>
                          )}
                        </View>
                      </View>
                      {isSelected && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={20}
                          color="#6200EE"
                        />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <View style={styles.noResultsContainer}>
              <MaterialCommunityIcons
                name="school-outline"
                size={48}
                color="#757575"
              />
              <Text style={styles.noResultsText}>
                {searchQuery
                  ? `No schools found matching "${searchQuery}"`
                  : 'No schools found in this county'}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Helper Text */}
      <Text style={[styles.helperText, error && styles.helperTextError]}>
        {error
          ? 'School is required'
          : helperText ||
            (value
              ? `Selected: ${value.name}${
                  value.nemis_code ? ` (${value.nemis_code})` : ''
                }`
              : countyId
              ? isLoadingSchools
                ? 'Loading schools...'
                : `Type to search from ${schools.length} schools`
              : 'Please select a county first')}
      </Text>

      {/* Add New School Button */}
      {countyId && !isLoadingSchools && (
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

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    zIndex: 1000,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: '#212121',
    fontWeight: '500',
  },
  required: {
    color: '#F44336',
  },
  clearChip: {
    height: 28,
    backgroundColor: '#FFEBEE',
  },
  clearChipText: {
    fontSize: 12,
    color: '#F44336',
  },
  input: {
    backgroundColor: '#FFFFFF',
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    maxHeight: 300,
    zIndex: 1000,
  },
  suggestionsHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#F5F5F5',
  },
  suggestionsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#6200EE',
  },
  suggestionsList: {
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  selectedSuggestionItem: {
    backgroundColor: '#F3E5F5',
  },
  schoolInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  suggestionIcon: {
    marginRight: 12,
  },
  schoolDetails: {
    flex: 1,
  },
  schoolName: {
    fontSize: 16,
    color: '#212121',
    marginBottom: 4,
  },
  selectedText: {
    color: '#6200EE',
    fontWeight: 'bold',
  },
  nemisCode: {
    fontSize: 12,
    color: '#757575',
  },
  noResultsContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: 14,
    color: '#757575',
    textAlign: 'center',
    marginTop: 12,
  },
  helperText: {
    fontSize: 12,
    color: '#757575',
    marginTop: 4,
  },
  helperTextError: {
    color: '#F44336',
  },
  addButton: {
    marginTop: 8,
    alignSelf: 'flex-start',
  },
});

// ============================================================
// EXPORTS
// ============================================================

export default SchoolPicker;