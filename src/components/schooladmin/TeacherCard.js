import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Card, Chip, IconButton, Avatar } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const TeacherCard = ({ teacher, onPress, onEdit, onDelete }) => {
  const getInitials = () => {
    const firstInitial = teacher.first_name?.charAt(0) || '';
    const lastInitial = teacher.last_name?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const getAvatarColor = () => {
    return teacher.is_active ? '#6200EE' : '#9E9E9E';
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(teacher);
    } else {
      Alert.alert('Edit Teacher', 'Edit functionality coming soon!');
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(teacher);
    } else {
      Alert.alert('Delete Teacher', 'Delete functionality coming soon!');
    }
  };

  const classesCount = teacher.classes_assigned?.length || 0;
  const displayClasses = teacher.classes_assigned?.slice(0, 2) || [];
  const remainingClasses = classesCount - displayClasses.length;

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* Header with Avatar and Action Buttons */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Avatar.Text 
              size={48} 
              label={getInitials()}
              style={{ backgroundColor: getAvatarColor() }}
            />
            <View style={styles.nameContainer}>
              <Text style={styles.name}>
                {teacher.first_name} {teacher.middle_name} {teacher.last_name}
              </Text>
              <Text style={styles.employeeNumber}>
                {teacher.employee_number}
              </Text>
            </View>
          </View>
          <View style={styles.actionButtons}>
            <IconButton
              icon="pencil"
              size={20}
              iconColor="#2196F3"
              onPress={handleEdit}
            />
            <IconButton
              icon="delete"
              size={20}
              iconColor="#F44336"
              onPress={handleDelete}
            />
          </View>
        </View>

        {/* Status Badge */}
        <View style={styles.statusRow}>
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
          <MaterialCommunityIcons name="book-open-variant" size={18} color="#757575" />
          <Text style={styles.label}>Subject:</Text>
          <Text style={styles.value}>{teacher.subject_specialization}</Text>
        </View>

        {/* Contact Info */}
        <View style={styles.section}>
          <MaterialCommunityIcons name="email" size={18} color="#757575" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value} numberOfLines={1}>{teacher.email}</Text>
        </View>

        <View style={styles.section}>
          <MaterialCommunityIcons name="phone" size={18} color="#757575" />
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{teacher.phone}</Text>
        </View>

        {/* Classes Assigned Summary */}
        {classesCount > 0 && (
          <View style={styles.classesSection}>
            <View style={styles.classesSectionHeader}>
              <MaterialCommunityIcons name="google-classroom" size={18} color="#757575" />
              <Text style={styles.classesLabel}>
                Classes Assigned ({classesCount})
              </Text>
            </View>
            <View style={styles.classesContainer}>
              {displayClasses.map((className, index) => (
                <Chip 
                  key={index} 
                  style={styles.classChip} 
                  textStyle={styles.classChipText}
                  compact
                >
                  {className}
                </Chip>
              ))}
              {remainingClasses > 0 && (
                <Chip 
                  style={[styles.classChip, styles.moreClassChip]} 
                  textStyle={styles.classChipText}
                  compact
                >
                  +{remainingClasses} more
                </Chip>
              )}
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
    elevation: 3,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  statusRow: {
    marginBottom: 12,
  },
  statusChip: {
    height: 28,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 11,
    fontWeight: 'bold',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 8,
    marginRight: 6,
    minWidth: 50,
    fontWeight: '500',
  },
  value: {
    fontSize: 13,
    color: '#212121',
    fontWeight: '500',
    flex: 1,
  },
  classesSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  classesSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  classesLabel: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '600',
    marginLeft: 8,
  },
  classesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  classChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E3F2FD',
  },
  classChipText: {
    fontSize: 12,
    color: '#1976D2',
  },
  moreClassChip: {
    backgroundColor: '#FFF3E0',
  },
});

export default TeacherCard;