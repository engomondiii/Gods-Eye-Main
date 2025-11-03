import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StatCard = ({ stat, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={styles.container}
    >
      <Card
        style={[
          styles.card,
          { borderLeftColor: stat.color, borderLeftWidth: 4 },
        ]}
      >
        <Card.Content style={styles.content}>
          <View
            style={[
              styles.iconContainer,
              { backgroundColor: stat.bgColor || stat.color + '20' },
            ]}
          >
            <MaterialCommunityIcons
              name={stat.icon}
              size={28}
              color={stat.color}
            />
            {stat.badge !== undefined && stat.badge > 0 && (
              <Badge style={[styles.badge, { backgroundColor: '#F44336' }]}>
                {stat.badge}
              </Badge>
            )}
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.value}>{stat.value.toLocaleString()}</Text>
            <Text style={styles.title} numberOfLines={2}>
              {stat.title}
            </Text>
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 12,
  },
  card: {
    elevation: 2,
    borderRadius: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  textContainer: {
    flex: 1,
  },
  value: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    color: '#757575',
    lineHeight: 18,
  },
});

export default StatCard;