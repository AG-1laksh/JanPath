import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, FlatList, TextInput, Image, Alert, Switch, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, addDoc, updateDoc, serverTimestamp, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ProfileScreen from './ProfileScreen';

// Dashboard Tab for Worker
const WorkerDashboard = ({ currentUser, assignedGrievances, onNavigate }) => {
  const activeGrievances = assignedGrievances.filter(g => g.status !== 'Completed' && g.status !== 'Resolved');
  const completedGrievances = assignedGrievances.filter(g => g.status === 'Completed' || g.status === 'Resolved');

  const stats = [
    { title: 'Active Tasks', value: activeGrievances.length, icon: 'time', color: '#f59e0b', bgColor: '#fef3c7', tab: 'Assigned' },
    { title: 'Completed', value: completedGrievances.length, icon: 'checkmark-circle', color: '#22c55e', bgColor: '#f0fdf4', tab: 'Assigned' },
    { title: 'Total Assigned', value: assignedGrievances.length, icon: 'clipboard', color: '#3b82f6', bgColor: '#eff6ff', tab: 'Assigned' },
  ];

  return (
    <ScrollView style={dashStyles.container} contentContainerStyle={dashStyles.content}>
      <View style={dashStyles.welcome}>
        <Text style={dashStyles.welcomeText}>Welcome back,</Text>
        <Text style={dashStyles.welcomeName}>Worker</Text>
      </View>

      <View style={dashStyles.statsRow}>
        {stats.map((stat, idx) => (
          <TouchableOpacity key={idx} style={dashStyles.statCard} onPress={() => onNavigate?.(stat.tab)}>
            <View style={[dashStyles.statIcon, { backgroundColor: stat.bgColor }]}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
            </View>
            <Text style={dashStyles.statValue}>{stat.value}</Text>
            <Text style={dashStyles.statTitle}>{stat.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={dashStyles.section}>
        <Text style={dashStyles.sectionTitle}>Quick Actions</Text>
        <View style={dashStyles.actionsRow}>
          <TouchableOpacity style={dashStyles.actionCard} onPress={() => onNavigate?.('Assigned')}>
            <View style={[dashStyles.actionIcon, { backgroundColor: '#eff6ff' }]}>
              <Ionicons name="list" size={24} color="#3b82f6" />
            </View>
            <Text style={dashStyles.actionText}>My Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dashStyles.actionCard} onPress={() => onNavigate?.('Available')}>
            <View style={[dashStyles.actionIcon, { backgroundColor: '#f0fdf4' }]}>
              <Ionicons name="search" size={24} color="#22c55e" />
            </View>
            <Text style={dashStyles.actionText}>Find Tasks</Text>
          </TouchableOpacity>
          <TouchableOpacity style={dashStyles.actionCard} onPress={() => onNavigate?.('Requests')}>
            <View style={[dashStyles.actionIcon, { backgroundColor: '#fef3c7' }]}>
              <Ionicons name="git-pull-request" size={24} color="#f59e0b" />
            </View>
            <Text style={dashStyles.actionText}>My Requests</Text>
          </TouchableOpacity>
        </View>
      </View>

      {activeGrievances.length > 0 && (
        <View style={dashStyles.section}>
          <View style={dashStyles.sectionHeader}>
            <Text style={dashStyles.sectionTitle}>Active Tasks</Text>
            <TouchableOpacity onPress={() => onNavigate?.('Assigned')}>
              <Text style={dashStyles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {activeGrievances.slice(0, 3).map((item) => (
            <View key={item.id} style={dashStyles.taskCard}>
              <View style={[dashStyles.taskIcon, { backgroundColor: '#fef3c7' }]}>
                <Ionicons name="construct" size={20} color="#f59e0b" />
              </View>
              <View style={dashStyles.taskInfo}>
                <Text style={dashStyles.taskTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={dashStyles.taskMeta}>{item.category} • {item.status}</Text>
              </View>
              <View style={[dashStyles.statusBadge, { backgroundColor: item.status === 'In Progress' ? '#fef3c7' : '#eff6ff' }]}>
                <Text style={[dashStyles.statusText, { color: item.status === 'In Progress' ? '#f59e0b' : '#3b82f6' }]}>
                  {item.status}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
};

const dashStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 20 },
  welcome: { marginBottom: 24 },
  welcomeText: { fontSize: 14, color: '#64748b' },
  welcomeName: { fontSize: 28, fontWeight: '700', color: '#1e293b' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#fff', borderRadius: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statValue: { fontSize: 24, fontWeight: '700', color: '#1e293b' },
  statTitle: { fontSize: 12, color: '#64748b', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 16 },
  viewAll: { fontSize: 14, color: '#3b82f6', fontWeight: '600' },
  actionsRow: { flexDirection: 'row', gap: 12 },
  actionCard: { flex: 1, backgroundColor: '#fff', borderRadius: 12, padding: 16, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  actionIcon: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
  actionText: { fontSize: 12, fontWeight: '600', color: '#475569', textAlign: 'center' },
  taskCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, gap: 12 },
  taskIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  taskInfo: { flex: 1 },
  taskTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  taskMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  statusText: { fontSize: 11, fontWeight: '600' },
});

// Assigned Tasks Tab
const AssignedTab = ({ grievances, onSelectGrievance }) => {
  const activeGrievances = grievances.filter(g => g.status !== 'Completed' && g.status !== 'Resolved');
  const completedGrievances = grievances.filter(g => g.status === 'Completed' || g.status === 'Resolved');
  const [filter, setFilter] = useState('active');

  const displayGrievances = filter === 'active' ? activeGrievances : completedGrievances;

  return (
    <View style={listStyles.container}>
      <View style={listStyles.filterRow}>
        <TouchableOpacity 
          style={[listStyles.filterBtn, filter === 'active' && listStyles.filterBtnActive]}
          onPress={() => setFilter('active')}
        >
          <Text style={[listStyles.filterText, filter === 'active' && listStyles.filterTextActive]}>
            Active ({activeGrievances.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[listStyles.filterBtn, filter === 'completed' && listStyles.filterBtnActive]}
          onPress={() => setFilter('completed')}
        >
          <Text style={[listStyles.filterText, filter === 'completed' && listStyles.filterTextActive]}>
            Completed ({completedGrievances.length})
          </Text>
        </TouchableOpacity>
      </View>

      {displayGrievances.length === 0 ? (
        <View style={listStyles.empty}>
          <Ionicons name={filter === 'active' ? 'clipboard-outline' : 'checkmark-done-circle-outline'} size={48} color="#cbd5e1" />
          <Text style={listStyles.emptyText}>No {filter} tasks</Text>
        </View>
      ) : (
        <FlatList
          data={displayGrievances}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listStyles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={listStyles.card} onPress={() => onSelectGrievance(item, 'assigned')}>
              <View style={listStyles.cardHeader}>
                <View style={[listStyles.cardIcon, { backgroundColor: item.status === 'In Progress' ? '#fef3c7' : item.status === 'Completed' ? '#f0fdf4' : '#eff6ff' }]}>
                  <Ionicons 
                    name={item.status === 'Completed' ? 'checkmark-circle' : item.status === 'In Progress' ? 'time' : 'clipboard'} 
                    size={20} 
                    color={item.status === 'In Progress' ? '#f59e0b' : item.status === 'Completed' ? '#22c55e' : '#3b82f6'} 
                  />
                </View>
                <View style={listStyles.cardInfo}>
                  <Text style={listStyles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={listStyles.cardMeta}>{item.category} • {item.priority} Priority</Text>
                </View>
              </View>
              <View style={[listStyles.statusBadge, { backgroundColor: item.status === 'In Progress' ? '#fef3c7' : item.status === 'Completed' ? '#f0fdf4' : '#eff6ff' }]}>
                <Text style={[listStyles.statusText, { color: item.status === 'In Progress' ? '#f59e0b' : item.status === 'Completed' ? '#22c55e' : '#3b82f6' }]}>
                  {item.status}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

// Available Tasks Tab
const AvailableTab = ({ grievances, onSelectGrievance }) => {
  return (
    <View style={listStyles.container}>
      {grievances.length === 0 ? (
        <View style={listStyles.empty}>
          <Ionicons name="search-outline" size={48} color="#cbd5e1" />
          <Text style={listStyles.emptyText}>No available tasks</Text>
          <Text style={listStyles.emptySubtext}>Check back later for new tasks</Text>
        </View>
      ) : (
        <FlatList
          data={grievances}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listStyles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={listStyles.card} onPress={() => onSelectGrievance(item, 'available')}>
              <View style={listStyles.cardHeader}>
                <View style={[listStyles.cardIcon, { backgroundColor: '#eff6ff' }]}>
                  <Ionicons name="document-text" size={20} color="#3b82f6" />
                </View>
                <View style={listStyles.cardInfo}>
                  <Text style={listStyles.cardTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={listStyles.cardMeta}>{item.category} • {item.priority} Priority</Text>
                </View>
              </View>
              <View style={[listStyles.priorityBadge, { backgroundColor: item.priority === 'High' ? '#fef2f2' : item.priority === 'Medium' ? '#fef3c7' : '#f0fdf4' }]}>
                <Text style={[listStyles.priorityText, { color: item.priority === 'High' ? '#ef4444' : item.priority === 'Medium' ? '#f59e0b' : '#22c55e' }]}>
                  {item.priority}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

// My Requests Tab
const RequestsTab = ({ currentUser }) => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    if (!currentUser?.uid) return;
    const q = query(
      collection(db, 'workerRequests'),
      where('workerId', '==', currentUser.uid),
      orderBy('requestedAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setRequests(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved': return { bg: '#f0fdf4', text: '#22c55e' };
      case 'Rejected': return { bg: '#fef2f2', text: '#ef4444' };
      default: return { bg: '#fef3c7', text: '#f59e0b' };
    }
  };

  return (
    <View style={listStyles.container}>
      {requests.length === 0 ? (
        <View style={listStyles.empty}>
          <Ionicons name="git-pull-request-outline" size={48} color="#cbd5e1" />
          <Text style={listStyles.emptyText}>No requests yet</Text>
          <Text style={listStyles.emptySubtext}>Request access to available tasks</Text>
        </View>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={listStyles.list}
          renderItem={({ item }) => {
            const colors = getStatusColor(item.status);
            return (
              <View style={listStyles.card}>
                <View style={listStyles.cardHeader}>
                  <View style={[listStyles.cardIcon, { backgroundColor: colors.bg }]}>
                    <Ionicons 
                      name={item.status === 'Approved' ? 'checkmark-circle' : item.status === 'Rejected' ? 'close-circle' : 'time'} 
                      size={20} 
                      color={colors.text} 
                    />
                  </View>
                  <View style={listStyles.cardInfo}>
                    <Text style={listStyles.cardTitle} numberOfLines={1}>Task Request</Text>
                    <Text style={listStyles.cardMeta}>{item.reason}</Text>
                  </View>
                </View>
                <View style={[listStyles.statusBadge, { backgroundColor: colors.bg }]}>
                  <Text style={[listStyles.statusText, { color: colors.text }]}>{item.status}</Text>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const listStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  filterRow: { flexDirection: 'row', padding: 16, gap: 12 },
  filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  filterBtnActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  filterTextActive: { color: '#fff' },
  list: { padding: 16, paddingTop: 0 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  cardIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  cardMeta: { fontSize: 13, color: '#64748b', marginTop: 2 },
  statusBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  statusText: { fontSize: 12, fontWeight: '600' },
  priorityBadge: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  priorityText: { fontSize: 12, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#64748b', marginTop: 12 },
  emptySubtext: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
});

// Grievance Detail Screen
const GrievanceDetail = ({ grievance, currentUser, mode, onBack }) => {
  const [status, setStatus] = useState(grievance?.status || '');
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [requestReason, setRequestReason] = useState('');

  const updateStatus = async (nextStatus, remarks) => {
    if (!grievance?.id || !currentUser?.uid) return;
    try {
      setLoading(true);
      await updateDoc(doc(db, 'grievances', grievance.id), { status: nextStatus });
      await addDoc(collection(db, 'statusLogs'), {
        grievanceId: grievance.id,
        status: nextStatus,
        updatedBy: currentUser.uid,
        remarks,
        timestamp: serverTimestamp(),
      });
      setStatus(nextStatus);
      Alert.alert('Updated', `Status set to ${nextStatus}`);
    } catch (error) {
      Alert.alert('Update failed', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const requestAccess = async () => {
    if (!grievance?.id || !currentUser?.uid || !requestReason.trim()) {
      Alert.alert('Missing reason', 'Please add a short reason for the request.');
      return;
    }
    try {
      setLoading(true);
      await addDoc(collection(db, 'workerRequests'), {
        grievanceId: grievance.id,
        workerId: currentUser.uid,
        reason: requestReason.trim(),
        status: 'Pending',
        requestedAt: serverTimestamp(),
      });
      setRequestReason('');
      Alert.alert('Requested', 'Access request sent to admin.');
      onBack();
    } catch (error) {
      Alert.alert('Request failed', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const addProgressUpdate = async () => {
    if (!grievance?.id || !currentUser?.uid || !progressText.trim()) return;
    try {
      setLoading(true);
      if (!status || status === 'Assigned') {
        await updateDoc(doc(db, 'grievances', grievance.id), { status: 'In Progress' });
        setStatus('In Progress');
      }
      await addDoc(collection(db, 'statusLogs'), {
        grievanceId: grievance.id,
        status: status && status !== 'Assigned' ? status : 'In Progress',
        updatedBy: currentUser.uid,
        remarks: progressText.trim(),
        timestamp: serverTimestamp(),
      });
      setProgressText('');
      Alert.alert('Update sent', 'Progress update added.');
    } catch (error) {
      Alert.alert('Update failed', error?.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const canStart = status === 'Assigned' || status === 'Accepted';
  const canComplete = status === 'In Progress';
  const canRequest = mode === 'available' && !grievance?.assignedWorkerId;

  return (
    <ScrollView style={detailStyles.container} contentContainerStyle={detailStyles.content}>
      <View style={detailStyles.card}>
        <Text style={detailStyles.title}>{grievance?.title}</Text>
        <View style={detailStyles.metaRow}>
          <View style={[detailStyles.badge, { backgroundColor: '#eff6ff' }]}>
            <Text style={[detailStyles.badgeText, { color: '#3b82f6' }]}>{grievance?.category}</Text>
          </View>
          <View style={[detailStyles.badge, { backgroundColor: grievance?.priority === 'High' ? '#fef2f2' : grievance?.priority === 'Medium' ? '#fef3c7' : '#f0fdf4' }]}>
            <Text style={[detailStyles.badgeText, { color: grievance?.priority === 'High' ? '#ef4444' : grievance?.priority === 'Medium' ? '#f59e0b' : '#22c55e' }]}>
              {grievance?.priority} Priority
            </Text>
          </View>
        </View>
      </View>

      <View style={detailStyles.card}>
        <Text style={detailStyles.sectionTitle}>Description</Text>
        <Text style={detailStyles.description}>{grievance?.description}</Text>
      </View>

      {grievance?.location && (
        <View style={detailStyles.card}>
          <Text style={detailStyles.sectionTitle}>Location</Text>
          <View style={detailStyles.locationRow}>
            <Ionicons name="location" size={20} color="#3b82f6" />
            <Text style={detailStyles.locationText}>
              {grievance.location.address || `${grievance.location.latitude?.toFixed(5)}, ${grievance.location.longitude?.toFixed(5)}`}
            </Text>
          </View>
        </View>
      )}

      {grievance?.imageBase64 && (
        <View style={detailStyles.card}>
          <Text style={detailStyles.sectionTitle}>Attached Image</Text>
          <Image source={{ uri: `data:image/jpeg;base64,${grievance.imageBase64}` }} style={detailStyles.image} />
        </View>
      )}

      <View style={detailStyles.card}>
        <Text style={detailStyles.sectionTitle}>Current Status</Text>
        <View style={[detailStyles.statusCard, { backgroundColor: status === 'In Progress' ? '#fef3c7' : status === 'Completed' ? '#f0fdf4' : '#eff6ff' }]}>
          <Ionicons 
            name={status === 'Completed' ? 'checkmark-circle' : status === 'In Progress' ? 'time' : 'clipboard'} 
            size={24} 
            color={status === 'In Progress' ? '#f59e0b' : status === 'Completed' ? '#22c55e' : '#3b82f6'} 
          />
          <Text style={[detailStyles.statusText, { color: status === 'In Progress' ? '#f59e0b' : status === 'Completed' ? '#22c55e' : '#3b82f6' }]}>
            {status}
          </Text>
        </View>
      </View>

      {mode === 'available' ? (
        <View style={detailStyles.card}>
          <Text style={detailStyles.sectionTitle}>Request Access</Text>
          <TextInput
            style={detailStyles.input}
            placeholder="Write a short reason for the request..."
            value={requestReason}
            onChangeText={setRequestReason}
            multiline
          />
          <TouchableOpacity 
            style={[detailStyles.primaryBtn, (!canRequest || loading) && detailStyles.disabledBtn]}
            onPress={requestAccess}
            disabled={!canRequest || loading}
          >
            <Ionicons name="git-pull-request" size={20} color="#fff" />
            <Text style={detailStyles.primaryBtnText}>{loading ? 'Sending...' : 'Request Access'}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={detailStyles.card}>
          <Text style={detailStyles.sectionTitle}>Update Progress</Text>
          <TextInput
            style={detailStyles.input}
            placeholder="Write a progress update..."
            value={progressText}
            onChangeText={setProgressText}
            multiline
          />
          <TouchableOpacity 
            style={[detailStyles.secondaryBtn, (loading || !progressText.trim()) && detailStyles.disabledBtn]}
            onPress={addProgressUpdate}
            disabled={loading || !progressText.trim()}
          >
            <Ionicons name="chatbubble" size={18} color="#3b82f6" />
            <Text style={detailStyles.secondaryBtnText}>Add Update</Text>
          </TouchableOpacity>

          <View style={detailStyles.actionRow}>
            <TouchableOpacity 
              style={[detailStyles.actionBtn, { backgroundColor: '#3b82f6' }, (loading || !canStart) && detailStyles.disabledBtn]}
              onPress={() => updateStatus('In Progress', 'Work started')}
              disabled={loading || !canStart}
            >
              <Ionicons name="play" size={18} color="#fff" />
              <Text style={detailStyles.actionBtnText}>Start Work</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[detailStyles.actionBtn, { backgroundColor: '#22c55e' }, (loading || !canComplete) && detailStyles.disabledBtn]}
              onPress={() => updateStatus('Completed', 'Work completed')}
              disabled={loading || !canComplete}
            >
              <Ionicons name="checkmark" size={18} color="#fff" />
              <Text style={detailStyles.actionBtnText}>Complete</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const detailStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  title: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginBottom: 12 },
  metaRow: { flexDirection: 'row', gap: 8 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 12 },
  description: { fontSize: 15, color: '#1e293b', lineHeight: 22 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationText: { flex: 1, fontSize: 14, color: '#1e293b' },
  image: { width: '100%', height: 200, borderRadius: 12 },
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12 },
  statusText: { fontSize: 16, fontWeight: '600' },
  input: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, fontSize: 15, color: '#1e293b', marginBottom: 12, minHeight: 80, textAlignVertical: 'top' },
  primaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', padding: 14, borderRadius: 12, gap: 8 },
  primaryBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  secondaryBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', padding: 14, borderRadius: 12, gap: 8, marginBottom: 12 },
  secondaryBtnText: { color: '#3b82f6', fontSize: 15, fontWeight: '600' },
  actionRow: { flexDirection: 'row', gap: 12 },
  actionBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', padding: 14, borderRadius: 12, gap: 8 },
  actionBtnText: { color: '#fff', fontSize: 14, fontWeight: '600' },
  disabledBtn: { opacity: 0.5 },
});

// Settings Screen
const SettingsScreen = () => {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);

  return (
    <ScrollView style={settingsStyles.container}>
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Notifications</Text>
        <View style={settingsStyles.sectionContent}>
          <View style={settingsStyles.item}>
            <View style={settingsStyles.itemIcon}><Ionicons name="notifications" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>Push Notifications</Text>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }} thumbColor={pushNotifications ? '#3b82f6' : '#94a3b8'} />
          </View>
          <View style={[settingsStyles.item, { borderBottomWidth: 0 }]}>
            <View style={settingsStyles.itemIcon}><Ionicons name="mail" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>Email Notifications</Text>
            <Switch value={emailNotifications} onValueChange={setEmailNotifications} trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }} thumbColor={emailNotifications ? '#3b82f6' : '#94a3b8'} />
          </View>
        </View>
      </View>
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>Account</Text>
        <View style={settingsStyles.sectionContent}>
          <TouchableOpacity style={settingsStyles.item}>
            <View style={settingsStyles.itemIcon}><Ionicons name="lock-closed" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>Change Password</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity style={[settingsStyles.item, { borderBottomWidth: 0 }]}>
            <View style={settingsStyles.itemIcon}><Ionicons name="shield-checkmark" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={settingsStyles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
};

const settingsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  sectionContent: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  itemIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  itemLabel: { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '500' },
  version: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20 },
});

// Help Screen
const HelpScreen = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const faqs = [
    { q: 'How do I request access to a task?', a: 'Go to the Available tab, select a task, and tap "Request Access" with a brief reason.' },
    { q: 'How do I update my progress?', a: 'Open an assigned task and use the "Add Update" field to share your progress.' },
    { q: 'How do I mark a task as complete?', a: 'After starting work on a task, the "Complete" button will become active. Tap it to mark the task done.' },
  ];

  return (
    <ScrollView style={helpStyles.container}>
      <View style={helpStyles.contactCard}>
        <Ionicons name="headset" size={40} color="#3b82f6" />
        <Text style={helpStyles.contactTitle}>Need Help?</Text>
        <Text style={helpStyles.contactDesc}>Our support team is here to assist you</Text>
        <View style={helpStyles.contactButtons}>
          <TouchableOpacity style={helpStyles.contactBtn} onPress={() => Linking.openURL('mailto:support@janpath.com')}>
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={helpStyles.contactBtnText}>Email Us</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[helpStyles.contactBtn, { backgroundColor: '#22c55e' }]} onPress={() => Linking.openURL('tel:+911234567890')}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={helpStyles.contactBtnText}>Call Us</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={helpStyles.sectionTitle}>Frequently Asked Questions</Text>
      {faqs.map((faq, idx) => (
        <TouchableOpacity key={idx} style={helpStyles.faqItem} onPress={() => setExpandedFaq(expandedFaq === idx ? null : idx)}>
          <View style={helpStyles.faqHeader}>
            <Text style={helpStyles.faqQuestion}>{faq.q}</Text>
            <Ionicons name={expandedFaq === idx ? 'chevron-up' : 'chevron-down'} size={20} color="#64748b" />
          </View>
          {expandedFaq === idx && <Text style={helpStyles.faqAnswer}>{faq.a}</Text>}
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
};

const helpStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  contactCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  contactTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginTop: 12 },
  contactDesc: { fontSize: 14, color: '#64748b', marginTop: 4 },
  contactButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, gap: 8 },
  contactBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 12, textTransform: 'uppercase' },
  faqItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1e293b', marginRight: 8 },
  faqAnswer: { fontSize: 13, color: '#64748b', marginTop: 12, lineHeight: 20 },
});

// Main Worker Navigation
const WorkerNavigation = ({ currentUser }) => {
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [grievanceMode, setGrievanceMode] = useState('assigned');
  const [assignedGrievances, setAssignedGrievances] = useState([]);
  const [availableGrievances, setAvailableGrievances] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchProfile();
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser?.uid) return;

    const assignedQuery = query(
      collection(db, 'grievances'),
      where('assignedWorkerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const availableQuery = query(
      collection(db, 'grievances'),
      where('assignedWorkerId', '==', null),
      orderBy('createdAt', 'desc')
    );

    const unsub1 = onSnapshot(assignedQuery, (snap) => {
      setAssignedGrievances(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    const unsub2 = onSnapshot(availableQuery, (snap) => {
      setAvailableGrievances(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsub1(); unsub2(); };
  }, [currentUser]);

  const tabs = [
    { key: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { key: 'Assigned', icon: 'clipboard', iconOutline: 'clipboard-outline' },
    { key: 'Available', icon: 'search', iconOutline: 'search-outline' },
    { key: 'Requests', icon: 'git-pull-request', iconOutline: 'git-pull-request-outline' },
  ];

  const closeAllOverlays = () => {
    setShowProfile(false);
    setShowSettings(false);
    setShowHelp(false);
    setSelectedGrievance(null);
  };

  const isOverlayOpen = showProfile || showSettings || showHelp || selectedGrievance;

  const getHeaderTitle = () => {
    if (selectedGrievance) return 'Task Details';
    if (showProfile) return 'My Profile';
    if (showSettings) return 'Settings';
    if (showHelp) return 'Help & Support';
    return 'Worker Dashboard';
  };

  const handleSelectGrievance = (grievance, mode) => {
    setSelectedGrievance(grievance);
    setGrievanceMode(mode);
  };

  const renderContent = () => {
    if (selectedGrievance) {
      return <GrievanceDetail grievance={selectedGrievance} currentUser={currentUser} mode={grievanceMode} onBack={() => setSelectedGrievance(null)} />;
    }
    if (showProfile) return <ProfileScreen currentUser={currentUser} />;
    if (showSettings) return <SettingsScreen />;
    if (showHelp) return <HelpScreen />;
    
    switch (activeTab) {
      case 'Home': return <WorkerDashboard currentUser={currentUser} assignedGrievances={assignedGrievances} onNavigate={setActiveTab} />;
      case 'Assigned': return <AssignedTab grievances={assignedGrievances} onSelectGrievance={handleSelectGrievance} />;
      case 'Available': return <AvailableTab grievances={availableGrievances} onSelectGrievance={handleSelectGrievance} />;
      case 'Requests': return <RequestsTab currentUser={currentUser} />;
      default: return <WorkerDashboard currentUser={currentUser} assignedGrievances={assignedGrievances} onNavigate={setActiveTab} />;
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {isOverlayOpen ? (
          <TouchableOpacity onPress={closeAllOverlays} style={styles.menuBtn}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuBtn}>
            <Ionicons name="menu" size={26} color="#1e293b" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        {isOverlayOpen ? (
          <View style={{ width: 40 }} />
        ) : (
          <TouchableOpacity onPress={() => setShowProfile(true)} style={styles.profileBtn}>
            <Ionicons name="person-circle" size={28} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.content}>{renderContent()}</View>

      {!isOverlayOpen && (
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => setActiveTab(tab.key)}>
                <Ionicons name={isActive ? tab.icon : tab.iconOutline} size={24} color={isActive ? '#3b82f6' : '#94a3b8'} />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>{tab.key}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Modal visible={showMenu} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View style={styles.menuLogo}><Ionicons name="construct" size={28} color="#fff" /></View>
              <View style={styles.menuHeaderText}>
                <Text style={styles.menuTitle}>JanPath Worker</Text>
                <Text style={styles.menuSubtitle}>{profile?.email || currentUser?.email}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowMenu(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); closeAllOverlays(); setShowProfile(true); }}>
                <Ionicons name="person-circle-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>View Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); closeAllOverlays(); setShowSettings(true); }}>
                <Ionicons name="settings-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); closeAllOverlays(); setShowHelp(true); }}>
                <Ionicons name="help-circle-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut(auth)}>
                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </ScrollView>
            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  menuBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  profileBtn: { padding: 4 },
  content: { flex: 1 },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e2e8f0', paddingBottom: 20, paddingTop: 8 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 6 },
  tabLabel: { fontSize: 11, fontWeight: '600', color: '#94a3b8', marginTop: 4 },
  tabLabelActive: { color: '#3b82f6' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  menuContainer: { width: '80%', maxWidth: 320, height: '100%', backgroundColor: '#fff' },
  menuHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#22c55e', gap: 12 },
  menuLogo: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center' },
  menuHeaderText: { flex: 1 },
  menuTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  menuSubtitle: { fontSize: 12, color: 'rgba(255,255,255,0.8)' },
  closeBtn: { padding: 4, backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: 20 },
  menuItems: { flex: 1, padding: 16 },
  menuItem: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, borderRadius: 12, marginBottom: 4, gap: 14 },
  menuItemText: { flex: 1, fontSize: 15, fontWeight: '500', color: '#1e293b' },
  menuDivider: { height: 1, backgroundColor: '#e2e8f0', marginVertical: 12 },
  signOutBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 12, backgroundColor: '#fef2f2', borderRadius: 12, gap: 14 },
  signOutText: { fontSize: 15, fontWeight: '600', color: '#ef4444' },
  versionText: { textAlign: 'center', fontSize: 12, color: '#94a3b8', paddingBottom: 20 },
});

export default WorkerNavigation;
