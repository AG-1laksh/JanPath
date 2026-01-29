import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  limit,
} from 'firebase/firestore';
import { db } from '../../firebase';
import { useLanguage } from '../../i18n';

const DashboardTab = ({ currentUser, onNavigate }) => {
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    pendingRequests: 0,
    pendingSignups: 0,
    unassignedGrievances: 0,
    totalWorkers: 0,
    availableWorkers: 0,
  });
  const [recentGrievances, setRecentGrievances] = useState([]);

  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'workerRequests'),
      where('status', '==', 'Pending')
    );
    const signupsQuery = query(
      collection(db, 'workerSignupRequests'),
      where('status', '==', 'Pending')
    );
    const unassignedQuery = query(
      collection(db, 'grievances'),
      where('assignedWorkerId', '==', null)
    );
    const workersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'WORKER')
    );
    const recentQuery = query(
      collection(db, 'grievances'),
      orderBy('createdAt', 'desc'),
      limit(5)
    );

    const unsubs = [
      onSnapshot(requestsQuery, (snap) =>
        setStats(s => ({ ...s, pendingRequests: snap.size }))),
      onSnapshot(signupsQuery, (snap) =>
        setStats(s => ({ ...s, pendingSignups: snap.size }))),
      onSnapshot(unassignedQuery, (snap) =>
        setStats(s => ({ ...s, unassignedGrievances: snap.size }))),
      onSnapshot(workersQuery, (snap) => {
        const workers = snap.docs.map(d => d.data());
        setStats(s => ({
          ...s,
          totalWorkers: workers.length,
          availableWorkers: workers.filter(w => !w.isWorking).length,
        }));
      }),
      onSnapshot(recentQuery, (snap) => {
        const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        setRecentGrievances(items);
      }),
    ];

    return () => unsubs.forEach(u => u());
  }, []);

  const statCards = [
    {
      title: t('admin.pendingRequests'),
      value: stats.pendingRequests,
      icon: 'git-pull-request',
      color: '#f59e0b',
      bgColor: '#fef3c7',
      tab: 'Requests',
    },
    {
      title: t('admin.pendingSignups'),
      value: stats.pendingSignups,
      icon: 'person-add',
      color: '#8b5cf6',
      bgColor: '#ede9fe',
      tab: 'Signups',
    },
    {
      title: t('admin.unassigned'),
      value: stats.unassignedGrievances,
      icon: 'clipboard',
      color: '#ef4444',
      bgColor: '#fef2f2',
      tab: 'Assign',
    },
    {
      title: t('admin.totalWorkers'),
      value: stats.totalWorkers,
      icon: 'people',
      color: '#3b82f6',
      bgColor: '#eff6ff',
      tab: 'Workers',
    },
  ];

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeText}>{t('dashboard.welcomeBack')}</Text>
        <Text style={styles.welcomeName}>{t('roles.admin')}</Text>
      </View>

      {/* Stats Grid */}
      <View style={styles.statsGrid}>
        {statCards.map((card, index) => (
          <TouchableOpacity
            key={index}
            style={styles.statCard}
            onPress={() => onNavigate?.(card.tab)}
          >
            <View style={[styles.statIcon, { backgroundColor: card.bgColor }]}>
              <Ionicons name={card.icon} size={22} color={card.color} />
            </View>
            <Text style={styles.statValue}>{card.value}</Text>
            <Text style={styles.statTitle}>{card.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Quick Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('worker.quickActions')}</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate?.('Assign')}>
            <View style={[styles.actionIcon, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="add-circle" size={24} color="#3b82f6" />
            </View>
            <Text style={styles.actionText}>{t('admin.assignTask')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate?.('Signups')}>
            <View style={[styles.actionIcon, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="person-add" size={24} color="#22c55e" />
            </View>
            <Text style={styles.actionText}>{t('admin.reviewSignups')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionCard} onPress={() => onNavigate?.('Workers')}>
            <View style={[styles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="analytics" size={24} color="#f59e0b" />
            </View>
            <Text style={styles.actionText}>{t('admin.viewWorkers')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Worker Availability */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{t('admin.workerAvailability')}</Text>
        <View style={styles.availabilityCard}>
          <View style={styles.availabilityRow}>
            <View style={styles.availabilityItem}>
              <View style={[styles.availabilityDot, { backgroundColor: '#22c55e' }]} />
              <Text style={styles.availabilityLabel}>{t('worker.available')}</Text>
              <Text style={styles.availabilityValue}>{stats.availableWorkers}</Text>
            </View>
            <View style={styles.availabilityItem}>
              <View style={[styles.availabilityDot, { backgroundColor: '#f59e0b' }]} />
              <Text style={styles.availabilityLabel}>{t('admin.working')}</Text>
              <Text style={styles.availabilityValue}>{stats.totalWorkers - stats.availableWorkers}</Text>
            </View>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${stats.totalWorkers > 0 ? (stats.availableWorkers / stats.totalWorkers) * 100 : 0}%` }
              ]}
            />
          </View>
        </View>
      </View>

      {/* Recent Grievances */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('admin.recentGrievances')}</Text>
          <TouchableOpacity onPress={() => onNavigate?.('Assign')}>
            <Text style={styles.viewAllText}>{t('common.viewAll')}</Text>
          </TouchableOpacity>
        </View>

        {recentGrievances.map((grievance) => (
          <View key={grievance.id} style={styles.grievanceItem}>
            <View style={styles.grievanceIcon}>
              <Ionicons
                name={grievance.assignedWorkerId ? 'checkmark-circle' : 'time'}
                size={20}
                color={grievance.assignedWorkerId ? '#22c55e' : '#f59e0b'}
              />
            </View>
            <View style={styles.grievanceInfo}>
              <Text style={styles.grievanceTitle} numberOfLines={1}>{grievance.title}</Text>
              <Text style={styles.grievanceMeta}>
                {grievance.category} • {grievance.status}
              </Text>
            </View>
            <Text style={styles.grievanceTime}>{formatDate(grievance.createdAt)}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
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
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 14,
    color: '#64748b',
  },
  welcomeName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  statTitle: {
    fontSize: 13,
    color: '#64748b',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  viewAllText: {
    fontSize: 14,
    color: '#3b82f6',
    fontWeight: '600',
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionCard: {
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
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
    textAlign: 'center',
  },
  availabilityCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  availabilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  availabilityItem: {
    alignItems: 'center',
  },
  availabilityDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginBottom: 8,
  },
  availabilityLabel: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 4,
  },
  availabilityValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1e293b',
  },
  progressBar: {
    height: 8,
    backgroundColor: '#fef3c7',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#22c55e',
    borderRadius: 4,
  },
  grievanceItem: {
    flexDirection: 'row',
    alignItems: 'center',
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
  grievanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f8fafc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  grievanceInfo: {
    flex: 1,
  },
  grievanceTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  grievanceMeta: {
    fontSize: 12,
    color: '#64748b',
  },
  grievanceTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
});

export default DashboardTab;
