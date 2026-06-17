// ========================================
// SMARTSCHOOL MVP - CLASS SELECTION SCREEN
// Teacher selects class before marking attendance
// ========================================

import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  Text,
  Card,
  ActivityIndicator,
  Chip,
  Button,
  Portal,
  Modal,
} from 'react-native-paper';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { useApi } from '../../hooks/useApi';
import theme from '../../styles/theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmptyState from '../../components/common/EmptyState';

const { width } = Dimensions.get('window');

const ClassSelectionScreen = ({ navigation }) => {
  const { user } = useAuth();
  const { get } = useApi();
  
  const [classes, setClasses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [selectedClassId, setSelectedClassId] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);

  // ============================================================
  // FETCH CLASSES
  // ============================================================

  const fetchClasses = useCallback(async () => {
    try {
      setError('');
      
      // Get teacher's classes
      const response = await get(`/api/classes/?teacher_id=${user?.teacher_id}`);
      
      if (response.success || Array.isArray(response)) {
        const classData = Array.isArray(response) ? response : response.data;
        setClasses(classData.sort((a, b) => a.name.localeCompare(b.name)));
      } else {
        throw new Error(response.message || 'Failed to load classes');
      }
    } catch (err) {
      console.error('Fetch classes error:', err);
      setError('Failed to load classes. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [user?.teacher_id, get]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchClasses();
  }, [fetchClasses]);

  // ============================================================
  // HANDLE CLASS SELECTION
  // ============================================================

  const handleSelectClass = (cls) => {
    setSelectedClass(cls);
    setSelectedClassId(cls.id);
    setShowConfirm(true);
  };

  const handleConfirmSelection = () => {
    setShowConfirm(false);
    
    // Navigate to student list for attendance marking
    navigation.navigate('ManualAttendance', {
      classId: selectedClass.id,
      className: selectedClass.name,
      classData: selectedClass,
    });
  };

  // ============================================================
  // RENDER
  // ============================================================

  if (isLoading) {
    return <LoadingSpinner message="Loading your classes..." />;
  }

  if (error && classes.length === 0) {
    return (
      <View style={styles.container}>
        <ErrorMessage 
          message={error}
          onRetry={fetchClasses}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
          />
        }
      >
        {/* HEADER */}
        <View style={styles.header}>
          <MaterialCommunityIcons
            name="book-open-variant"
            size={32}
            color={theme.colors.primary}
          />
          <Text style={styles.headerText}>Select Class</Text>
          <Text style={styles.headerSubtext}>
            Choose a class to mark attendance
          </Text>
        </View>

        {/* CLASSES GRID */}
        {classes.length === 0 ? (
          <EmptyState
            icon="inbox-outline"
            title="No Classes"
            message="You don't have any classes assigned yet."
            actionLabel="Refresh"
            onAction={fetchClasses}
          />
        ) : (
          <View style={styles.classesGrid}>
            {classes.map((cls) => (
              <TouchableOpacity
                key={cls.id}
                style={[
                  styles.classCard,
                  selectedClassId === cls.id && styles.classCardSelected,
                ]}
                onPress={() => handleSelectClass(cls)}
              >
                <Card
                  style={[
                    styles.card,
                    selectedClassId === cls.id && styles.cardSelected,
                  ]}
                >
                  <Card.Content>
                    <View style={styles.cardHeader}>
                      <View style={styles.iconContainer}>
                        <MaterialCommunityIcons
                          name="account-multiple"
                          size={28}
                          color={theme.colors.primary}
                        />
                      </View>
                      {selectedClassId === cls.id && (
                        <MaterialCommunityIcons
                          name="check-circle"
                          size={24}
                          color={theme.colors.success}
                          style={styles.checkIcon}
                        />
                      )}
                    </View>

                    {/* CLASS NAME */}
                    <Text
                      style={styles.className}
                      numberOfLines={1}
                      ellipsizeMode="tail"
                    >
                      {cls.name}
                    </Text>

                    {/* STUDENT COUNT */}
                    <View style={styles.statsRow}>
                      <MaterialCommunityIcons
                        name="account-multiple"
                        size={16}
                        color={theme.colors.secondary}
                      />
                      <Text style={styles.statText}>
                        {cls.student_count} students
                      </Text>
                    </View>

                    {/* STREAM BADGE */}
                    <Chip
                      icon="tag"
                      label={cls.stream || 'Stream'}
                      style={styles.streamChip}
                      mode="outlined"
                      size="small"
                    />
                  </Card.Content>
                </Card>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* INFO BOX */}
        <View style={styles.infoBox}>
          <MaterialCommunityIcons
            name="information"
            size={20}
            color={theme.colors.primary}
          />
          <Text style={styles.infoText}>
            Select your class above to mark attendance for today.
          </Text>
        </View>
      </ScrollView>

      {/* CONFIRMATION MODAL */}
      <Portal>
        <Modal
          visible={showConfirm}
          onDismiss={() => setShowConfirm(false)}
          contentContainerStyle={styles.modal}
        >
          <View style={styles.modalContent}>
            <MaterialCommunityIcons
              name="check-circle-outline"
              size={48}
              color={theme.colors.primary}
              style={styles.modalIcon}
            />

            <Text style={styles.modalTitle}>
              Mark Attendance for {selectedClass?.name}?
            </Text>

            <Text style={styles.modalSubtext}>
              You are about to mark attendance for {selectedClass?.student_count || 0} students in this class.
            </Text>

            <View style={styles.modalButtons}>
              <Button
                mode="outlined"
                onPress={() => setShowConfirm(false)}
                style={styles.cancelButton}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                onPress={handleConfirmSelection}
                style={styles.confirmButton}
              >
                Continue
              </Button>
            </View>
          </View>
        </Modal>
      </Portal>
    </View>
  );
};

// ============================================================
// STYLES
// ============================================================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: theme.colors.surfaceVariant,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.outlineVariant,
  },
  headerText: {
    fontSize: 24,
    fontWeight: '700',
    color: theme.colors.onSurface,
    marginTop: 12,
  },
  headerSubtext: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginTop: 4,
  },
  classesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  classCard: {
    width: '48%',
    marginHorizontal: '1%',
    marginBottom: 16,
  },
  classCardSelected: {
    opacity: 1,
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.outlineVariant,
  },
  cardSelected: {
    borderWidth: 2,
    borderColor: theme.colors.success,
    backgroundColor: theme.colors.surfaceVariant,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.primaryContainer,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkIcon: {
    marginTop: 2,
  },
  className: {
    fontSize: 16,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 8,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statText: {
    fontSize: 13,
    color: theme.colors.onSurfaceVariant,
    marginLeft: 6,
  },
  streamChip: {
    alignSelf: 'flex-start',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: theme.colors.primaryContainer,
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 16,
    marginTop: 8,
    alignItems: 'center',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: theme.colors.onPrimaryContainer,
    marginLeft: 12,
  },
  modal: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    width: width * 0.85,
  },
  modalIcon: {
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.onSurface,
    marginBottom: 8,
    textAlign: 'center',
  },
  modalSubtext: {
    fontSize: 14,
    color: theme.colors.onSurfaceVariant,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  confirmButton: {
    flex: 1,
    marginLeft: 8,
  },
});

export default ClassSelectionScreen;
