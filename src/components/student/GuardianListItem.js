import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Avatar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GuardianListItem = ({ guardian }) => {
  return (
    <View style={styles.container}>
      <Avatar.Icon
        size={48}
        icon="account"
        style={[
          styles.avatar,
          guardian.is_primary && styles.primaryAvatar,
        ]}
        color={guardian.is_primary ? '#4CAF50' : '#2196F3'}
      />
      
      <View style={styles.infoContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.name}>
            {guardian.first_name} {guardian.last_name}
          </Text>
          {guardian.is_primary && (
            <Chip mode="flat" style={styles.primaryChip} textStyle={styles.chipText}>
              Primary
            </Chip>
          )}
        </View>
        
        {guardian.phone && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="phone" size={14} color="#757575" />
            <Text style={styles.detailText}>{guardian.phone}</Text>
          </View>
        )}
        
        {guardian.relationship && (
          <View style={styles.detailRow}>
            <MaterialCommunityIcons name="account-heart" size={14} color="#757575" />
            <Text style={styles.detailText}>{guardian.relationship}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  avatar: {
    backgroundColor: '#E3F2FD',
  },
  primaryAvatar: {
    backgroundColor: '#E8F5E9',
  },
  infoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 8,
  },
  primaryChip: {
    height: 24,
    backgroundColor: '#E8F5E9',
  },
  chipText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailText: {
    fontSize: 12,
    color: '#757575',
    marginLeft: 6,
  },
});

export default GuardianListItem;