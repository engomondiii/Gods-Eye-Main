import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const Header = ({
  title,
  subtitle,
  leftIcon,
  onLeftPress,
  rightIcon,
  onRightPress,
  backgroundColor = '#6200EE',
  textColor = '#FFFFFF',
}) => {
  return (
    <View style={[styles.container, { backgroundColor }]}>
      {leftIcon && (
        <TouchableOpacity onPress={onLeftPress} style={styles.iconButton}>
          <MaterialCommunityIcons name={leftIcon} size={24} color={textColor} />
        </TouchableOpacity>
      )}
      
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: textColor }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: textColor }]} numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightIcon && (
        <TouchableOpacity onPress={onRightPress} style={styles.iconButton}>
          <MaterialCommunityIcons name={rightIcon} size={24} color={textColor} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  iconButton: {
    padding: 8,
  },
  textContainer: {
    flex: 1,
    marginHorizontal: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
    opacity: 0.9,
  },
});

export default Header;