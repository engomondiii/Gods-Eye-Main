// ========================================
// GOD'S EYE EDTECH - COUNTY PICKER (WITH VALIDATION)
// ========================================

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Keyboard,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Text, TextInput, Chip, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as locationService from '../../services/locationService';

// ============================================================
// COUNTY PICKER COMPONENT
// ============================================================

const CountyPicker = ({
  value,
  onChange,
  error = null, // Now accepts error message string
  disabled = false,
  label = 'County',
  placeholder = 'Type or select county...',
  required = false,
  helperText = '',
  onBlur, // For validation on blur
}) => {
  // State
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [counties, setCounties] = useState([]);
  const [filteredCounties, setFilteredCounties] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCounties, setIsLoadingCounties] = useState(true);

  const inputRef = useRef(null);

  // ============================================================
  // FETCH COUNTIES FROM BACKEND
  // ============================================================

  /**
   * Fetch all Kenya counties from backend
   */
  const fetchCounties = async () => {
    try {
      setIsLoadingCounties(true);

      if (__DEV__) {
        console.log('🗺️ Fetching counties from backend...');
      }

      const result = await locationService.getKenyaCounties();

      if (result.success) {
        setCounties(result.data);
        setFilteredCounties(result.data);

        if (__DEV__) {
          console.log(`✅ Loaded ${result.data.length} counties`);
        }
      } else {
        console.error('❌ Failed to fetch counties:', result.message);
      }
    } catch (error) {
      console.error('❌ Fetch counties error:', error);
    } finally {
      setIsLoadingCounties(false);
    }
  };

  /**
   * Initial load
   */
  useEffect(() => {
    fetchCounties();
  }, []);

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
   * Filter counties as user types
   */
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredCounties(counties);
      setShowSuggestions(false);
    } else {
      const filtered = counties.filter((county) =>
        county.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredCounties(filtered);
      setShowSuggestions(true);
    }
  }, [searchQuery, counties]);

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
   * Handle county selection
   */
  const handleCountySelect = (county) => {
    onChange(county);
    setSearchQuery(county.name);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  /**
   * Handle manual entry (custom county)
   */
  const handleManualEntry = () => {
    if (searchQuery.trim()) {
      const customCounty = {
        id: null,
        name: searchQuery.trim(),
        code: searchQuery.trim().toLowerCase().replace(/\s+/g, '_'),
        isCustom: true,
      };
      onChange(customCounty);
      setShowSuggestions(false);
      Keyboard.dismiss();
    }
  };

  /**
   * Clear county selection
   */
  const handleClearCounty = () => {
    onChange(null);
    setSearchQuery('');
    setFilteredCounties(counties);
    setShowSuggestions(false);
  };

  /**
   * Handle input focus
   */
  const handleFocus = () => {
    if (searchQuery.trim() === '') {
      setFilteredCounties(counties);
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
      if (onBlur) {
        onBlur();
      }
    }, 200);
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
            onPress={handleClearCounty}
            onClose={handleClearCounty}
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
        error={!!error}
        disabled={disabled || isLoadingCounties}
        style={styles.input}
        placeholder={placeholder}
        autoCapitalize="words"
        left={<TextInput.Icon icon="map-marker" />}
        right={
          isLoadingCounties ? (
            <TextInput.Icon icon={() => <ActivityIndicator size={20} />} />
          ) : searchQuery ? (
            <TextInput.Icon icon="close" onPress={handleClearCounty} />
          ) : (
            <TextInput.Icon icon="menu-down" />
          )
        }
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && !disabled && !isLoadingCounties && (
        <View style={styles.suggestionsContainer}>
          {filteredCounties.length > 0 ? (
            <>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>
                  {searchQuery
                    ? `${filteredCounties.length} ${
                        filteredCounties.length === 1 ? 'county' : 'counties'
                      } found`
                    : `All ${counties.length} Kenya Counties`}
                </Text>
              </View>
              <ScrollView
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={true}
              >
                {filteredCounties.map((county) => {
                  const isSelected = value?.id === county.id;
                  return (
                    <TouchableOpacity
                      key={county.id}
                      onPress={() => handleCountySelect(county)}
                      style={[
                        styles.suggestionItem,
                        isSelected && styles.selectedSuggestionItem,
                      ]}
                    >
                      <MaterialCommunityIcons
                        name="map-marker"
                        size={20}
                        color={isSelected ? '#6200EE' : '#757575'}
                        style={styles.suggestionIcon}
                      />
                      <Text
                        style={[
                          styles.suggestionText,
                          isSelected && styles.selectedSuggestionText,
                        ]}
                      >
                        {county.name}
                      </Text>
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
                name="map-marker-off"
                size={32}
                color="#757575"
              />
              <Text style={styles.noResultsText}>
                No counties found matching "{searchQuery}"
              </Text>
              <TouchableOpacity
                onPress={handleManualEntry}
                style={styles.manualEntryButton}
              >
                <MaterialCommunityIcons name="plus" size={18} color="#FFF" />
                <Text style={styles.manualEntryButtonText}>
                  Add "{searchQuery}" as custom county
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}

      {/* Error/Helper Text */}
      <HelperText type={error ? 'error' : 'info'} visible={!!(error || helperText || value || isLoadingCounties)}>
        {error ||
          helperText ||
          (value
            ? value.isCustom
              ? `Custom entry: ${value.name}`
              : `Selected: ${value.name}`
            : isLoadingCounties
            ? 'Loading counties...'
            : `Type to search from ${counties.length} Kenya counties`)}
      </HelperText>

      {/* Custom Badge */}
      {value?.isCustom && (
        <View style={styles.customBadge}>
          <MaterialCommunityIcons name="pencil" size={14} color="#FF9800" />
          <Text style={styles.customBadgeText}>Custom county entry</Text>
        </View>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F5F5F5',
  },
  selectedSuggestionItem: {
    backgroundColor: '#F3E5F5',
  },
  suggestionIcon: {
    marginRight: 12,
  },
  suggestionText: {
    fontSize: 16,
    color: '#212121',
    flex: 1,
  },
  selectedSuggestionText: {
    color: '#6200EE',
    fontWeight: 'bold',
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
    marginBottom: 16,
  },
  manualEntryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  manualEntryButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#FFF3E0',
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  customBadgeText: {
    fontSize: 12,
    color: '#FF9800',
    marginLeft: 6,
    fontWeight: '500',
  },
});

// ============================================================
// EXPORTS
// ============================================================

export default CountyPicker;