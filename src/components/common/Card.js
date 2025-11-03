import React from 'react';
import { StyleSheet } from 'react-native';
import { Card as PaperCard } from 'react-native-paper';

const Card = ({ children, style, onPress, elevation = 2, ...props }) => {
  return (
    <PaperCard
      style={[styles.card, { elevation }, style]}
      onPress={onPress}
      {...props}
    >
      {children}
    </PaperCard>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    marginBottom: 12,
  },
});

export default Card;