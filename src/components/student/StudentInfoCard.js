import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Card, Avatar, Chip } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { formatDate } from '../../utils/formatters';

const StudentInfoCard = ({ student }) => {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <View style={styles.header}>
          <Avatar.Icon
            size={80}
            icon="account-circle"
            style={styles.avatar}
            color="#6200EE"
          />
          <View style={styles.headerInfo}>
            <Text style={styles.name}>
              {student.first_name} {student.last_name}
            </Text>
            <Chip mode="flat" style={styles.admissionChip}>
              {student.admission_number}
            </Chip>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="calendar" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Date of Birth:</Text>
            <Text style={styles.infoValue}>
              {student.date_of_birth ? formatDate(student.date_of_birth) : 'N/A'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="school" size={20} color="#757575" />
            <Text style={styles.infoLabel}>School:</Text>
            <Text style={styles.infoValue} numberOfLines={2}>
              {student.school?.name || 'N/A'}
            </Text>
          </View>

          {student.school?.county && (
            <View style={styles.infoRow}>
              <MaterialCommunityIcons name="map-marker" size={20} color="#757575" />
              <Text style={styles.infoLabel}>County:</Text>
              <Text style={styles.infoValue}>{student.school.county.name}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <MaterialCommunityIcons name="account-group" size={20} color="#757575" />
            <Text style={styles.infoLabel}>Guardians:</Text>
            <Text style={styles.infoValue}>
              {student.guardians?.length || 0} linked
            </Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    elevation: 2,
    borderRadius: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    backgroundColor: '#E3F2FD',
  },
  headerInfo: {
    marginLeft: 16,
    flex: 1,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#212121',
    marginBottom: 8,
  },
  admissionChip: {
    alignSelf: 'flex-start',
    backgroundColor: '#E8F5E9',
  },
  divider: {
    height: 1,
    backgroundColor: '#E0E0E0',
    marginVertical: 16,
  },
  infoSection: {
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#757575',
    marginLeft: 8,
    marginRight: 8,
    minWidth: 100,
  },
  infoValue: {
    fontSize: 14,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
});

export default StudentInfoCard;