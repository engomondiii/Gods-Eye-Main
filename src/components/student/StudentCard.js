import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Avatar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const StudentCard = ({ student, onPress }) => {
  const guardianCount = student.guardians?.length || 0;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.leftSection}>
            <Avatar.Icon
              size={56}
              icon="account-circle"
              style={styles.avatar}
              color="#6200EE"
            />
            <View style={styles.infoContainer}>
              <Text style={styles.name}>
                {student.first_name} {student.last_name}
              </Text>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="card-account-details" size={16} color="#757575" />
                <Text style={styles.detailText}>{student.admission_number}</Text>
              </View>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="school" size={16} color="#757575" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {student.school?.name || 'N/A'}
                </Text>
              </View>
            </View>
          </View>
          
          <View style={styles.rightSection}>
            <Chip
              mode="flat"
              style={[
                styles.guardianChip,
                guardianCount === 0 && styles.noGuardianChip,
              ]}
              textStyle={styles.chipText}
              icon="account-multiple"
            >
              {guardianCount}
            </Chip>
            <MaterialCommunityIcons
              name="chevron-right"
              size={24}
              color="#757575"
              style={styles.chevron}
            />
          </View>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 12,
    elevation: 2,
    borderRadius: 12,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    backgroundColor: '#E3F2FD',
  },
  infoContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  detailText: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 6,
    flex: 1,
  },
  rightSection: {
    alignItems: 'center',
    marginLeft: 8,
  },
  guardianChip: {
    backgroundColor: '#E8F5E9',
    marginBottom: 4,
  },
  noGuardianChip: {
    backgroundColor: '#FFEBEE',
  },
  chipText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  chevron: {
    marginTop: 4,
  },
});

export default StudentCard;