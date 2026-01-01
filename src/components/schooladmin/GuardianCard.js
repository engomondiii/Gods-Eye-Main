import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { Card, Chip, IconButton, Avatar, Badge } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const GuardianCard = ({ guardian, onPress, onEdit, onDelete }) => {
  const getInitials = () => {
    const firstInitial = guardian.first_name?.charAt(0) || '';
    const lastInitial = guardian.last_name?.charAt(0) || '';
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  const getAvatarColor = () => {
    return guardian.is_primary ? '#FF9800' : '#9C27B0';
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) {
      onEdit(guardian);
    } else {
      Alert.alert('Edit Guardian', 'Edit functionality coming soon!');
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(guardian);
    } else {
      Alert.alert('Delete Guardian', 'Delete functionality coming soon!');
    }
  };

  const studentsCount = guardian.students?.length || 0;
  const displayStudents = guardian.students?.slice(0, 2) || [];
  const remainingStudents = studentsCount - displayStudents.length;

  return (
    <Card style={styles.card} onPress={onPress}>
      <Card.Content>
        {/* Header with Avatar and Action Buttons */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View>
              <Avatar.Text 
                size={48} 
                label={getInitials()}
                style={{ backgroundColor: getAvatarColor() }}
              />
              {guardian.is_primary && (
                <Badge 
                  size={18}
                  style={styles.primaryBadge}
                >
                  ⭐
                </Badge>
              )}
            </View>
            <View style={styles.nameContainer}>
              <View style={styles.nameRow}>
                <Text style={styles.name}>
                  {guardian.first_name} {guardian.middle_name} {guardian.last_name}
                </Text>
                {guardian.is_primary && (
                  <MaterialCommunityIcons name="star" size={16} color="#FF9800" />
                )}
              </View>
              <Text style={styles.relationship}>
                {guardian.relationship}
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

        {/* Primary Badge */}
        {guardian.is_primary && (
          <View style={styles.statusRow}>
            <Chip
              mode="flat"
              style={styles.primaryChip}
              textStyle={styles.primaryText}
              icon="star"
            >
              Primary Guardian
            </Chip>
          </View>
        )}

        {/* Contact Info */}
        <View style={styles.section}>
          <MaterialCommunityIcons name="email" size={18} color="#757575" />
          <Text style={styles.label}>Email:</Text>
          <Text style={styles.value} numberOfLines={1}>{guardian.email}</Text>
        </View>

        <View style={styles.section}>
          <MaterialCommunityIcons name="phone" size={18} color="#757575" />
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{guardian.phone}</Text>
        </View>

        {/* Linked Students */}
        {studentsCount > 0 ? (
          <View style={styles.studentsSection}>
            <View style={styles.studentsSectionHeader}>
              <MaterialCommunityIcons name="account-group" size={18} color="#757575" />
              <Text style={styles.studentsLabel}>
                Linked Students ({studentsCount})
              </Text>
            </View>
            <View style={styles.studentsContainer}>
              {displayStudents.map((student, index) => (
                <Chip 
                  key={index} 
                  style={styles.studentChip}
                  textStyle={styles.studentChipText}
                  compact
                  icon="account"
                >
                  {student.first_name} {student.last_name}
                </Chip>
              ))}
              {remainingStudents > 0 && (
                <Chip 
                  style={[styles.studentChip, styles.moreStudentChip]}
                  textStyle={styles.studentChipText}
                  compact
                >
                  +{remainingStudents} more
                </Chip>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.noStudentsSection}>
            <MaterialCommunityIcons name="alert-circle" size={18} color="#FF9800" />
            <Text style={styles.noStudentsText}>
              No students linked
            </Text>
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
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    marginRight: 6,
  },
  relationship: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '500',
  },
  primaryBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#FF9800',
  },
  actionButtons: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  statusRow: {
    marginBottom: 12,
  },
  primaryChip: {
    height: 28,
    alignSelf: 'flex-start',
    backgroundColor: '#FFF3E0',
  },
  primaryText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#F57C00',
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
  studentsSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  studentsSectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  studentsLabel: {
    fontSize: 13,
    color: '#757575',
    fontWeight: '600',
    marginLeft: 8,
  },
  studentsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  studentChip: {
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: '#E8F5E9',
  },
  studentChipText: {
    fontSize: 12,
    color: '#2E7D32',
  },
  moreStudentChip: {
    backgroundColor: '#FFF3E0',
  },
  noStudentsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  noStudentsText: {
    fontSize: 13,
    color: '#FF9800',
    marginLeft: 8,
    fontStyle: 'italic',
  },
});

export default GuardianCard;