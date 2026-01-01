import React, { useState, useEffect, useRef } from 'react';
import { View, StyleSheet, ScrollView, Keyboard, TouchableOpacity } from 'react-native';
import { Text, TextInput, Chip, HelperText } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { KENYA_COMMON_STREAMS } from '../../utils/constants';

const StreamPicker = ({ 
  value, 
  onChange, 
  error = null, // String error message
  disabled = false,
  required = false, // NEW
  helperText = '', // NEW
  onBlur, // NEW
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredStreams, setFilteredStreams] = useState([]);
  const [allStreams, setAllStreams] = useState([]);
  const inputRef = useRef(null);

  // Flatten all streams into one array on mount
  useEffect(() => {
    const streams = [
      ...KENYA_COMMON_STREAMS.colors,
      ...KENYA_COMMON_STREAMS.directions,
      ...KENYA_COMMON_STREAMS.letters,
      ...KENYA_COMMON_STREAMS.animals,
      ...KENYA_COMMON_STREAMS.places,
    ];
    setAllStreams(streams);
    setFilteredStreams(streams);
  }, []);

  // Update search query when value changes externally
  useEffect(() => {
    if (value) {
      setSearchQuery(value);
    } else {
      setSearchQuery('');
    }
  }, [value]);

  // Filter streams as user types
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStreams(allStreams);
      setShowSuggestions(false);
    } else {
      const filtered = allStreams.filter(stream =>
        stream.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredStreams(filtered);
      setShowSuggestions(true);
    }
  }, [searchQuery, allStreams]);

  const handleInputChange = (text) => {
    setSearchQuery(text);
    onChange(text); // Update value in real-time
  };

  const handleStreamSelect = (stream) => {
    onChange(stream);
    setSearchQuery(stream);
    setShowSuggestions(false);
    Keyboard.dismiss();
  };

  const handleClearStream = () => {
    onChange('');
    setSearchQuery('');
    setFilteredStreams(allStreams);
    setShowSuggestions(false);
  };

  const handleFocus = () => {
    if (searchQuery.trim() === '') {
      setFilteredStreams(allStreams);
    }
    setShowSuggestions(true);
  };

  const handleBlur = () => {
    // Delay to allow item selection
    setTimeout(() => {
      setShowSuggestions(false);
      if (onBlur) {
        onBlur();
      }
    }, 200);
  };

  // Determine which category a stream belongs to
  const getStreamCategory = (stream) => {
    if (KENYA_COMMON_STREAMS.colors.includes(stream)) return 'Color';
    if (KENYA_COMMON_STREAMS.directions.includes(stream)) return 'Direction';
    if (KENYA_COMMON_STREAMS.letters.includes(stream)) return 'Letter';
    if (KENYA_COMMON_STREAMS.animals.includes(stream)) return 'Animal';
    if (KENYA_COMMON_STREAMS.places.includes(stream)) return 'Place';
    return 'Custom';
  };

  const getStreamIcon = (stream) => {
    const category = getStreamCategory(stream);
    const icons = {
      Color: 'palette',
      Direction: 'compass',
      Letter: 'alpha-a-box',
      Animal: 'paw',
      Place: 'map-marker',
      Custom: 'pencil',
    };
    return icons[category] || 'format-list-bulleted';
  };

  const isCommonStream = (stream) => {
    return allStreams.includes(stream);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.label}>
          Stream/Class
          {required && <Text style={styles.required}> *</Text>}
        </Text>
        {value && (
          <Chip
            mode="flat"
            onPress={handleClearStream}
            onClose={handleClearStream}
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
        label="Type or select stream/class"
        mode="outlined"
        value={searchQuery}
        onChangeText={handleInputChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        error={!!error}
        disabled={disabled}
        style={styles.input}
        placeholder="e.g., Red, East, A, Lion..."
        autoCapitalize="words"
        left={<TextInput.Icon icon="format-list-bulleted" />}
        right={
          searchQuery ? (
            <TextInput.Icon
              icon="close"
              onPress={handleClearStream}
            />
          ) : (
            <TextInput.Icon icon="menu-down" />
          )
        }
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && !disabled && (
        <View style={styles.suggestionsContainer}>
          {filteredStreams.length > 0 ? (
            <>
              <View style={styles.suggestionsHeader}>
                <Text style={styles.suggestionsTitle}>
                  {searchQuery 
                    ? `${filteredStreams.length} streams found` 
                    : 'Common Stream Names'}
                </Text>
              </View>
              <ScrollView
                style={styles.suggestionsList}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled={false}
              >
                {filteredStreams.map((item, index) => {
                  const isSelected = value === item;
                  const category = getStreamCategory(item);
                  
                  return (
                    <TouchableOpacity
                      key={`${item}-${index}`}
                      onPress={() => handleStreamSelect(item)}
                      style={[
                        styles.suggestionItem,
                        isSelected && styles.selectedSuggestionItem,
                      ]}
                    >
                      <MaterialCommunityIcons 
                        name={getStreamIcon(item)} 
                        size={20} 
                        color={isSelected ? theme.colors.primary : theme.colors.textSecondary}
                        style={styles.suggestionIcon}
                      />
                      <View style={styles.suggestionTextContainer}>
                        <Text
                          style={[
                            styles.suggestionText,
                            isSelected && styles.selectedSuggestionText,
                          ]}
                        >
                          {item}
                          {category !== 'Custom' && (
                            <Text style={styles.categoryBadge}> • {category}</Text>
                          )}
                        </Text>
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </>
          ) : (
            <View style={styles.noResultsContainer}>
              <MaterialCommunityIcons 
                name="format-list-bulleted" 
                size={32} 
                color={theme.colors.textSecondary} 
              />
              <Text style={styles.noResultsText}>
                No common streams found
              </Text>
              <Text style={styles.customEntryHint}>
                Just keep typing - "{searchQuery}" will be used as your custom stream
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Helper Text */}
      <HelperText 
        type={error ? 'error' : 'info'} 
        visible={!!(error || helperText || value)}
      >
        {error || helperText || (
          value 
            ? isCommonStream(value)
              ? `Selected: ${value} (${getStreamCategory(value)})`
              : `Custom entry: ${value}`
            : 'Type to search common streams or enter your own'
        )}
      </HelperText>

      {value && !isCommonStream(value) && (
        <View style={styles.customBadge}>
          <MaterialCommunityIcons 
            name="pencil" 
            size={14} 
            color={theme.colors.success} 
          />
          <Text style={styles.customBadgeText}>
            Custom stream entry
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.sm,
    zIndex: 999,
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
  required: {
    color: theme.colors.error,
  },
  clearChip: {
    height: 28,
    backgroundColor: theme.colors.errorContainer,
  },
  clearChipText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.error,
  },
  input: {
    backgroundColor: theme.colors.surface,
  },
  suggestionsContainer: {
    position: 'absolute',
    top: 80,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    ...theme.shadows.medium,
    maxHeight: 300,
    zIndex: 999,
    elevation: 5,
  },
  suggestionsHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
    backgroundColor: theme.colors.primaryLight || theme.colors.primary + '10',
  },
  suggestionsTitle: {
    fontSize: theme.fontSizes.sm,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  suggestionsList: {
    maxHeight: 250,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border + '30',
  },
  selectedSuggestionItem: {
    backgroundColor: theme.colors.primaryLight || theme.colors.primary + '10',
  },
  suggestionIcon: {
    marginRight: theme.spacing.sm,
  },
  suggestionTextContainer: {
    flex: 1,
  },
  suggestionText: {
    fontSize: theme.fontSizes.md,
    color: theme.colors.text,
  },
  selectedSuggestionText: {
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  categoryBadge: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  noResultsContainer: {
    padding: theme.spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noResultsText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    marginTop: theme.spacing.sm,
    marginBottom: theme.spacing.xs,
  },
  customEntryHint: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.success,
    textAlign: 'center',
    fontWeight: '500',
    marginTop: theme.spacing.xs,
  },
  customBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: 4,
    backgroundColor: theme.colors.successLight || theme.colors.success + '20',
    borderRadius: theme.borderRadius.xs,
    alignSelf: 'flex-start',
  },
  customBadgeText: {
    fontSize: theme.fontSizes.xs,
    color: theme.colors.success,
    marginLeft: theme.spacing.xs,
    fontWeight: '500',
  },
});

export default StreamPicker;