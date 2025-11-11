import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GuardianCard = ({ guardian, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="account-supervisor"
              size={24}
              color="#6200EE"
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {guardian.first_name} {guardian.middle_name} {guardian.last_name}
              </Text>
              <Text style={styles.relationship}>{guardian.relationship}</Text>
            </View>
          </View>
          {guardian.is_primary && (
            <Chip
              mode="flat"
              style={styles.primaryChip}
              textStyle={styles.primaryText}
            >
              Primary
            </Chip>
          )}
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <MaterialCommunityIcons name="email" size={16} color="#757575" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{guardian.email}</Text>
        </View>

        <View style={styles.section}>
          <MaterialCommunityIcons name="phone" size={16} color="#757575" />
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{guardian.phone}</Text>
        </View>

        {/* Students */}
        {guardian.students && guardian.students.length > 0 && (
          <View style={styles.studentsSection}>
            <Text style={styles.studentsLabel}>
              Linked Students ({guardian.students.length}):
            </Text>
            <View style={styles.studentsContainer}>
              {guardian.students.map((student, index) => (
                <Chip key={index} style={styles.studentChip} compact>
                  {student.first_name} {student.last_name} ({student.admission_number})
                </Chip>
              ))}
            </View>
          </View>
        )}
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
    elevation: 2,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  nameContainer: {
    marginLeft: 12,
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 4,
  },
  relationship: {
    fontSize: 13,
    color: '#757575',
  },
  primaryChip: {
    height: 28,
    backgroundColor: '#E8F5E9',
  },
  primaryText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#2E7D32',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 6,
    marginRight: 6,
    minWidth: 50,
  },
  value: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  studentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  studentsLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
    marginBottom: 8,
  },
  studentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  studentChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default GuardianCard;