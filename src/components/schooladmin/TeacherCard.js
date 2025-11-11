import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TeacherCard = ({ teacher, onPress }) => {
  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <MaterialCommunityIcons
              name="account-tie"
              size={24}
              color="#6200EE"
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {teacher.first_name} {teacher.middle_name} {teacher.last_name}
              </Text>
              <Text style={styles.employeeNumber}>{teacher.employee_number}</Text>
            </View>
          </View>
          <Chip
            mode="flat"
            style={[
              styles.statusChip,
              {
                backgroundColor: teacher.is_active ? '#E8F5E9' : '#FFEBEE',
              },
            ]}
            textStyle={[
              styles.statusText,
              {
                color: teacher.is_active ? '#2E7D32' : '#C62828',
              },
            ]}
          >
            {teacher.is_active ? 'Active' : 'Inactive'}
          </Chip>
        </View>

        {/* Subject Specialization */}
        <View style={styles.section}>
          <MaterialCommunityIcons name="book-open-variant" size={16} color="#757575" />
          <Text style={styles.label}>Subject:</Text>
          <Text style={styles.value}>{teacher.subject_specialization}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <MaterialCommunityIcons name="email" size={16} color="#757575" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value}>{teacher.email}</Text>
        </View>

        <View style={styles.section}>
          <MaterialCommunityIcons name="phone" size={16} color="#757575" />
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{teacher.phone}</Text>
        </View>

        {/* Classes Assigned */}
        {teacher.classes_assigned && teacher.classes_assigned.length > 0 && (
          <View style={styles.classesSection}>
            <Text style={styles.classesLabel}>Classes Assigned:</Text>
            <View style={styles.classesContainer}>
              {teacher.classes_assigned.map((className, index) => (
                <Chip key={index} style={styles.classChip} compact>
                  {className}
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
  employeeNumber: {
    fontSize: 13,
    color: '#757575',
  },
  statusChip: {
    height: 28,
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
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
  classesSection: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  classesLabel: {
    fontSize: 12,
    color: '#757575',
    fontWeight: '600',
    marginBottom: 8,
  },
  classesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  classChip: {
    marginRight: 8,
    marginBottom: 8,
  },
});

export default TeacherCard;