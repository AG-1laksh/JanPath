import React, { useEffect, useState } from 'react';
import { FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  onSnapshot,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';

const WorkersTab = () => {
  const [registeredWorkers, setRegisteredWorkers] = useState([]);
  const [assignedGrievances, setAssignedGrievances] = useState([]);
  const [workerFilter, setWorkerFilter] = useState('all');
  const [selectedWorker, setSelectedWorker] = useState(null);

  useEffect(() => {
    const workersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'WORKER')
    );

    const assignedGrievancesQuery = query(
      collection(db, 'grievances'),
      where('assignedWorkerId', '!=', null)
    );

    const unsubWorkers = onSnapshot(workersQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setRegisteredWorkers(items);
    });

    const unsubGrievances = onSnapshot(assignedGrievancesQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAssignedGrievances(items);
    });

    return () => {
      unsubWorkers();
      unsubGrievances();
    };
  }, []);

  const getWorkerGrievances = (workerId) => {
    return assignedGrievances.filter((g) => g.assignedWorkerId === workerId);
  };

  const getActiveGrievances = (workerId) => {
    return getWorkerGrievances(workerId).filter(
      (g) => g.status !== 'Resolved' && g.status !== 'Closed'
    );
  };

  const getFilteredWorkers = () => {
    switch (workerFilter) {
      case 'available':
        return registeredWorkers.filter((w) => !w.isWorking);
      case 'working':
        return registeredWorkers.filter((w) => w.isWorking);
      default:
        return registeredWorkers;
    }
  };

  const getWorkersByDepartment = () => {
    const filtered = getFilteredWorkers();
    return filtered.reduce((acc, worker) => {
      const dept = worker.department || 'Unassigned';
      if (!acc[dept]) acc[dept] = [];
      acc[dept].push(worker);
      return acc;
    }, {});
  };

  const filterOptions = [
    { key: 'all', label: 'All', icon: 'people' },
    { key: 'available', label: 'Available', icon: 'checkmark-circle' },
    { key: 'working', label: 'Working', icon: 'time' },
  ];

  if (selectedWorker) {
    const workerGrievances = getWorkerGrievances(selectedWorker.id);
    const activeGrievances = workerGrievances.filter(
      (g) => g.status !== 'Resolved' && g.status !== 'Closed'
    );
    const completedGrievances = workerGrievances.filter(
      (g) => g.status === 'Resolved' || g.status === 'Closed'
    );

    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedWorker(null)}>
          <Ionicons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Back to Workers</Text>
        </TouchableOpacity>

        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <Text style={styles.profileName}>{selectedWorker.name}</Text>
          <Text style={styles.profileEmail}>{selectedWorker.email}</Text>
          <View style={[styles.statusBadge, selectedWorker.isWorking ? styles.busyBadge : styles.availableBadge]}>
            <Text style={[styles.statusBadgeText, selectedWorker.isWorking ? styles.busyText : styles.availableText]}>
              {selectedWorker.isWorking ? 'Working' : 'Available'}
            </Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{activeGrievances.length}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{completedGrievances.length}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{workerGrievances.length}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
        </View>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="business-outline" size={18} color="#64748b" />
            <Text style={styles.infoLabel}>Department</Text>
            <Text style={styles.infoValue}>{selectedWorker.department || 'N/A'}</Text>
          </View>
        </View>

        {activeGrievances.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Active Tasks</Text>
            {activeGrievances.map((grievance) => (
              <View key={grievance.id} style={styles.taskCard}>
                <View style={styles.taskHeader}>
                  <View style={styles.taskIcon}>
                    <Ionicons name="document-text" size={18} color="#f59e0b" />
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{grievance.title}</Text>
                    <Text style={styles.taskMeta}>{grievance.category}</Text>
                  </View>
                  <View style={styles.taskStatus}>
                    <Text style={styles.taskStatusText}>{grievance.status}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}

        {completedGrievances.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Completed Tasks</Text>
            {completedGrievances.map((grievance) => (
              <View key={grievance.id} style={[styles.taskCard, styles.completedTask]}>
                <View style={styles.taskHeader}>
                  <View style={[styles.taskIcon, styles.completedIcon]}>
                    <Ionicons name="checkmark-circle" size={18} color="#22c55e" />
                  </View>
                  <View style={styles.taskInfo}>
                    <Text style={styles.taskTitle} numberOfLines={1}>{grievance.title}</Text>
                    <Text style={styles.taskMeta}>{grievance.category}</Text>
                  </View>
                </View>
              </View>
            ))}
          </>
        )}
      </ScrollView>
    );
  }

  const workersByDept = getWorkersByDepartment();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Workers</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{registeredWorkers.length}</Text>
        </View>
      </View>

      <View style={styles.filterContainer}>
        {filterOptions.map((option) => (
          <TouchableOpacity
            key={option.key}
            style={[styles.filterButton, workerFilter === option.key && styles.filterButtonActive]}
            onPress={() => setWorkerFilter(option.key)}
          >
            <Ionicons
              name={option.icon}
              size={16}
              color={workerFilter === option.key ? '#fff' : '#64748b'}
            />
            <Text style={[styles.filterText, workerFilter === option.key && styles.filterTextActive]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {registeredWorkers.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No workers registered</Text>
          <Text style={styles.emptySubtext}>Workers will appear here once approved</Text>
        </View>
      ) : (
        <ScrollView style={styles.scrollContainer} contentContainerStyle={styles.scrollContent}>
          {Object.entries(workersByDept).map(([dept, workers]) => (
            <View key={dept} style={styles.deptSection}>
              <View style={styles.deptHeader}>
                <Ionicons name="briefcase-outline" size={16} color="#64748b" />
                <Text style={styles.deptTitle}>{dept}</Text>
                <View style={styles.deptBadge}>
                  <Text style={styles.deptBadgeText}>{workers.length}</Text>
                </View>
              </View>

              {workers.map((worker) => {
                const activeCount = getActiveGrievances(worker.id).length;
                return (
                  <TouchableOpacity
                    key={worker.id}
                    style={styles.workerCard}
                    onPress={() => setSelectedWorker(worker)}
                  >
                    <View style={styles.workerAvatar}>
                      <Ionicons name="person" size={20} color="#3b82f6" />
                    </View>
                    <View style={styles.workerInfo}>
                      <Text style={styles.workerName}>{worker.name}</Text>
                      <Text style={styles.workerEmail}>{worker.email}</Text>
                    </View>
                    <View style={styles.workerStats}>
                      {activeCount > 0 && (
                        <View style={styles.taskBadge}>
                          <Text style={styles.taskBadgeText}>{activeCount} tasks</Text>
                        </View>
                      )}
                      <View style={[styles.statusDot, worker.isWorking ? styles.busyDot : styles.availableDot]} />
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  contentContainer: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
  },
  badge: {
    marginLeft: 12,
    backgroundColor: '#3b82f6',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 8,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
  },
  filterButtonActive: {
    backgroundColor: '#3b82f6',
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  filterTextActive: {
    color: '#fff',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
  },
  deptSection: {
    marginBottom: 24,
  },
  deptHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 8,
  },
  deptTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  deptBadge: {
    backgroundColor: '#e2e8f0',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  deptBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748b',
  },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  workerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  workerInfo: {
    flex: 1,
  },
  workerName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  workerEmail: {
    fontSize: 12,
    color: '#64748b',
  },
  workerStats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  taskBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taskBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f59e0b',
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  availableDot: {
    backgroundColor: '#22c55e',
  },
  busyDot: {
    backgroundColor: '#f59e0b',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#64748b',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#94a3b8',
    marginTop: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 8,
  },
  backButtonText: {
    fontSize: 16,
    color: '#3b82f6',
    fontWeight: '600',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  availableBadge: {
    backgroundColor: '#f0fdf4',
  },
  busyBadge: {
    backgroundColor: '#fef3c7',
  },
  statusBadgeText: {
    fontSize: 13,
    fontWeight: '600',
  },
  availableText: {
    color: '#22c55e',
  },
  busyText: {
    color: '#f59e0b',
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  statLabel: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 4,
  },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoLabel: {
    fontSize: 14,
    color: '#64748b',
    flex: 1,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 12,
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  completedTask: {
    opacity: 0.7,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#fef3c7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  completedIcon: {
    backgroundColor: '#f0fdf4',
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  taskMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  taskStatus: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  taskStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#3b82f6',
  },
});

export default WorkersTab;
