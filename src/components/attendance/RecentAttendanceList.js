import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import AttendanceCard from './AttendanceCard';
import EmptyState from '../common/EmptyState';
import theme from '../../styles/theme';

const RecentAttendanceList = ({
  records = [],
  onRecordPress,
  onRefresh,
  refreshing = false,
  onLoadMore,
  loading = false,
  showStudent = true,
  emptyMessage = 'No attendance records yet',
}) => {
  const renderItem = ({ item }) => (
    <AttendanceCard
      record={item}
      onPress={() => onRecordPress && onRecordPress(item)}
      showStudent={showStudent}
    />
  );

  const renderFooter = () => {
    if (!loading) return null;
    
    return (
      <View style={styles.footerLoader}>
        <Text style={styles.loadingText}>Loading more...</Text>
      </View>
    );
  };

  const renderEmpty = () => (
    <EmptyState
      icon="clipboard-text-off"
      title="No Records"
      message={emptyMessage}
    />
  );

  return (
    <FlatList
      data={records}
      renderItem={renderItem}
      keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
      contentContainerStyle={[
        styles.listContent,
        records.length === 0 && styles.emptyContent,
      ]}
      ListEmptyComponent={renderEmpty}
      ListFooterComponent={renderFooter}
      onRefresh={onRefresh}
      refreshing={refreshing}
      onEndReached={onLoadMore}
      onEndReachedThreshold={0.5}
      showsVerticalScrollIndicator={false}
    />
  );
};

const styles = StyleSheet.create({
  listContent: {
    padding: theme.spacing.md,
  },
  emptyContent: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  footerLoader: {
    paddingVertical: theme.spacing.md,
    alignItems: 'center',
  },
  loadingText: {
    fontSize: theme.fontSizes.sm,
    color: theme.colors.textSecondary,
  },
});

export default RecentAttendanceList;
