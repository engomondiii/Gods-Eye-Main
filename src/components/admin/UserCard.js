import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card, Avatar, Chip, IconButton } from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { USER_ROLES } from '../../utils/constants';
import { formatDate } from '../../utils/formatters';

const UserCard = ({ user, onPress }) => {
  const getRoleColor = (role) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return '#F44336';
      case USER_ROLES.TEACHER:
        return '#2196F3';
      case USER_ROLES.GUARDIAN:
        return '#4CAF50';
      default:
        return '#757575';
    }
  };

  const getRoleName = (role) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return 'Super Admin';
      case USER_ROLES.TEACHER:
        return 'Teacher';
      case USER_ROLES.GUARDIAN:
        return 'Guardian';
      default:
        return 'User';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case USER_ROLES.SUPER_ADMIN:
        return 'shield-crown';
      case USER_ROLES.TEACHER:
        return 'account-tie';
      case USER_ROLES.GUARDIAN:
        return 'account-heart';
      default:
        return 'account';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <Avatar.Icon
            size={56}
            icon={getRoleIcon(user.role)}
            style={[styles.avatar, { backgroundColor: getRoleColor(user.role) + '20' }]}
            color={getRoleColor(user.role)}
          />
          
          <View style={styles.infoContainer}>
            <View style={styles.nameRow}>
              <Text style={styles.name}>
                {user.first_name} {user.last_name}
              </Text>
              <Chip
                mode="flat"
                style={[
                  styles.roleChip,
                  { backgroundColor: getRoleColor(user.role) + '20' },
                ]}
                textStyle={[styles.roleText, { color: getRoleColor(user.role) }]}
              >
                {getRoleName(user.role)}
              </Chip>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="account" size={14} color="#757575" />
              <Text style={styles.detailText}>{user.username}</Text>
            </View>

            <View style={styles.detailRow}>
              <MaterialCommunityIcons name="email" size={14} color="#757575" />
              <Text style={styles.detailText}>{user.email}</Text>
            </View>

            {user.phone && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="phone" size={14} color="#757575" />
                <Text style={styles.detailText}>{user.phone}</Text>
              </View>
            )}

            {user.school && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="school" size={14} color="#757575" />
                <Text style={styles.detailText} numberOfLines={1}>
                  {user.school.name}
                </Text>
              </View>
            )}

            {user.total_students !== undefined && (
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="account-multiple" size={14} color="#757575" />
                <Text style={styles.detailText}>
                  {user.total_students} {user.role === USER_ROLES.GUARDIAN ? 'student(s)' : 'students'}
                </Text>
              </View>
            )}

            <View style={styles.footer}>
              <View style={styles.detailRow}>
                <MaterialCommunityIcons name="calendar" size={12} color="#9E9E9E" />
                <Text style={styles.footerText}>
                  Joined: {formatDate(user.created_at)}
                </Text>
              </View>
              <Chip
                mode="flat"
                style={[
                  styles.statusChip,
                  user.is_active ? styles.activeChip : styles.inactiveChip,
                ]}
                textStyle={styles.statusText}
              >
                {user.is_active ? 'Active' : 'Inactive'}
              </Chip>
            </View>
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
    alignItems: 'flex-start',
  },
  avatar: {
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#212121',
    flex: 1,
  },
  roleChip: {
    height: 24,
    marginLeft: 8,
  },
  roleText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailText: {
    fontSize: 13,
    color: '#757575',
    marginLeft: 6,
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  footerText: {
    fontSize: 11,
    color: '#9E9E9E',
    marginLeft: 4,
  },
  statusChip: {
    height: 22,
  },
  activeChip: {
    backgroundColor: '#E8F5E9',
  },
  inactiveChip: {
    backgroundColor: '#FFEBEE',
  },
  statusText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});

export default UserCard;