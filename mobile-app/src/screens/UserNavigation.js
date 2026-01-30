import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, FlatList, TextInput, Image, Alert, Switch, Linking, Share } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, addDoc, deleteDoc, serverTimestamp, writeBatch, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { auth, db } from '../firebase';
import ProfileScreen from './ProfileScreen';
import { useLanguage, LANGUAGES } from '../i18n';


const PRIORITIES = ['Low', 'Medium', 'High'];
const CATEGORIES = ['Road', 'Water', 'Electricity', 'Sanitation', 'Other'];

// Dashboard Tab
const UserDashboard = ({ grievances, onNavigate, onSelectGrievance }) => {
  const { t } = useLanguage();
  const pendingGrievances = grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed');
  const resolvedGrievances = grievances.filter(g => g.status === 'Resolved' || g.status === 'Closed');

  const stats = [
    { title: t('dashboard.active'), value: pendingGrievances.length, icon: 'time', color: '#f59e0b', bgColor: '#fef3c7' },
    { title: t('dashboard.resolved'), value: resolvedGrievances.length, icon: 'checkmark-circle', color: '#22c55e', bgColor: '#f0fdf4' },
    { title: t('dashboard.total'), value: grievances.length, icon: 'document-text', color: '#3b82f6', bgColor: '#eff6ff' },
  ];

  return (
    <ScrollView style={dashStyles.container} contentContainerStyle={dashStyles.content}>
      <View style={dashStyles.welcome}>
        <Text style={dashStyles.welcomeText}>{t('dashboard.welcomeBack')}</Text>
        <Text style={dashStyles.welcomeName}>{t('dashboard.citizen')}</Text>
      </View>

      <View style={dashStyles.statsRow}>
        {stats.map((stat, idx) => (
          <TouchableOpacity key={idx} style={dashStyles.statCard} onPress={() => onNavigate?.('My Complaints')}>
            <View style={[dashStyles.statIcon, { backgroundColor: stat.bgColor }]}>
              <Ionicons name={stat.icon} size={22} color={stat.color} />
            </View>
            <Text style={dashStyles.statValue}>{stat.value}</Text>
            <Text style={dashStyles.statTitle}>{stat.title}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={dashStyles.createCard} onPress={() => onNavigate?.('Create')}>
        <View style={dashStyles.createIcon}>
          <Ionicons name="add-circle" size={32} color="#3b82f6" />
        </View>
        <View style={dashStyles.createText}>
          <Text style={dashStyles.createTitle}>{t('dashboard.reportProblem')}</Text>
          <Text style={dashStyles.createDesc}>{t('dashboard.submitNewGrievance')}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
      </TouchableOpacity>

      {pendingGrievances.length > 0 && (
        <View style={dashStyles.section}>
          <View style={dashStyles.sectionHeader}>
            <Text style={dashStyles.sectionTitle}>{t('dashboard.recentComplaints')}</Text>
            <TouchableOpacity onPress={() => onNavigate?.('My Complaints')}>
              <Text style={dashStyles.viewAll}>{t('common.viewAll')}</Text>
            </TouchableOpacity>
          </View>
          {pendingGrievances.slice(0, 3).map((item) => (
            <TouchableOpacity key={item.id} style={dashStyles.grievanceCard} onPress={() => onSelectGrievance(item)}>
              <View style={[dashStyles.grievanceIcon, { backgroundColor: item.status === 'In Progress' ? '#fef3c7' : '#eff6ff' }]}>
                <Ionicons
                  name={item.status === 'In Progress' ? 'time' : 'document-text'}
                  size={20}
                  color={item.status === 'In Progress' ? '#f59e0b' : '#3b82f6'}
                />
              </View>
              <View style={dashStyles.grievanceInfo}>
                <Text style={dashStyles.grievanceTitle} numberOfLines={1}>{item.title}</Text>
                <Text style={dashStyles.grievanceMeta}>{item.category} • {item.status}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
            </TouchableOpacity>
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
  createCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 24, gap: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  createIcon: { width: 56, height: 56, borderRadius: 14, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  createText: { flex: 1 },
  createTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  createDesc: { fontSize: 13, color: '#64748b', marginTop: 2 },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  viewAll: { fontSize: 14, color: '#3b82f6', fontWeight: '600' },
  grievanceCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, gap: 12 },
  grievanceIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  grievanceInfo: { flex: 1 },
  grievanceTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  grievanceMeta: { fontSize: 12, color: '#64748b', marginTop: 2 },
});

// Create Grievance Tab
const CreateGrievanceTab = ({ currentUser, onSuccess }) => {
  const { t } = useLanguage();
  const [form, setForm] = useState({ title: '', description: '', category: '', priority: 'Medium', isPublic: true });
  const [imageBase64, setImageBase64] = useState('');
  const [location, setLocation] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = form.title && form.description && form.category;

  const pickImage = async () => {
    try {
      let permission = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (!permission.granted) {
        permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }
      if (!permission.granted) {
        Alert.alert(t('messages.permissionNeeded'), t('messages.photoPermission'));
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({ base64: true, quality: 0.6 });
      if (!result.canceled && result.assets?.length) {
        setImageBase64(result.assets[0].base64 || '');
      }
    } catch (error) {
      Alert.alert(t('common.error'), t('messages.imagePickError'));
    }
  };

  const getLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(t('messages.permissionNeeded'), t('messages.locationPermission'));
        return;
      }
      const current = await Location.getCurrentPositionAsync({});
      const [place] = await Location.reverseGeocodeAsync({
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      });
      const address = place ? [place.name, place.street, place.city, place.region].filter(Boolean).join(', ') : '';
      setLocation({ latitude: current.coords.latitude, longitude: current.coords.longitude, address });
    } catch (error) {
      Alert.alert(t('common.error'), t('messages.locationError'));
    }
  };

  const submitGrievance = async () => {
    if (!currentUser || !canSubmit) return;
    try {
      setSubmitting(true);
      const grievanceRef = doc(collection(db, 'grievances'));
      const statusRef = doc(collection(db, 'statusLogs'));
      const batch = writeBatch(db);

      batch.set(grievanceRef, {
        title: form.title,
        description: form.description,
        category: form.category,
        priority: form.priority,
        status: 'Submitted',
        imageBase64: imageBase64 || '',
        location: location || null,
        userId: currentUser.uid,
        assignedWorkerId: null,
        isPublic: form.isPublic,
        createdAt: serverTimestamp(),
      });

      batch.set(statusRef, {
        grievanceId: grievanceRef.id,
        status: 'Submitted',
        updatedBy: currentUser.uid,
        remarks: 'Complaint registered',
        timestamp: serverTimestamp(),
      });

      await batch.commit();
      setForm({ title: '', description: '', category: '', priority: 'Medium', isPublic: true });
      setImageBase64('');
      setLocation(null);
      Alert.alert(t('common.success'), t('messages.submitted'));
      onSuccess?.();
    } catch (error) {
      Alert.alert(t('common.error'), error.message || t('messages.submitError'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={createStyles.container} contentContainerStyle={createStyles.content}>
      <View style={createStyles.card}>
        <Text style={createStyles.label}>{t('create.title')} *</Text>
        <TextInput
          style={createStyles.input}
          placeholder={t('create.titlePlaceholder')}
          value={form.title}
          onChangeText={(v) => setForm(p => ({ ...p, title: v }))}
        />

        <Text style={createStyles.label}>{t('create.description')} *</Text>
        <TextInput
          style={[createStyles.input, createStyles.textArea]}
          placeholder={t('create.descriptionPlaceholder')}
          multiline
          value={form.description}
          onChangeText={(v) => setForm(p => ({ ...p, description: v }))}
        />

        <Text style={createStyles.label}>{t('create.category')} *</Text>
        <View style={createStyles.categoryRow}>
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={[createStyles.categoryChip, form.category === cat && createStyles.categoryChipActive]}
              onPress={() => setForm(p => ({ ...p, category: cat }))}
            >
              <Text style={[createStyles.categoryText, form.category === cat && createStyles.categoryTextActive]}>{t('categories.' + cat.toLowerCase())}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={createStyles.label}>{t('create.priority')}</Text>
        <View style={createStyles.priorityRow}>
          {PRIORITIES.map((p) => (
            <TouchableOpacity
              key={p}
              style={[createStyles.priorityBtn, form.priority === p && createStyles.priorityBtnActive, { backgroundColor: form.priority === p ? (p === 'High' ? '#ef4444' : p === 'Medium' ? '#f59e0b' : '#22c55e') : '#f8fafc' }]}
              onPress={() => setForm(pr => ({ ...pr, priority: p }))}
            >
              <Text style={[createStyles.priorityText, form.priority === p && createStyles.priorityTextActive]}>{t('priorities.' + p.toLowerCase())}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={createStyles.card}>
        <Text style={createStyles.label}>{t('create.attachments')}</Text>
        <View style={createStyles.attachRow}>
          <TouchableOpacity style={createStyles.attachBtn} onPress={pickImage}>
            <Ionicons name="image" size={24} color="#3b82f6" />
            <Text style={createStyles.attachText}>{t('create.addPhoto')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={createStyles.attachBtn} onPress={getLocation}>
            <Ionicons name="location" size={24} color="#3b82f6" />
            <Text style={createStyles.attachText}>{t('create.addLocation')}</Text>
          </TouchableOpacity>
        </View>

        {imageBase64 ? (
          <View style={createStyles.previewContainer}>
            <Image source={{ uri: `data:image/jpeg;base64,${imageBase64}` }} style={createStyles.preview} />
            <TouchableOpacity style={createStyles.removeBtn} onPress={() => setImageBase64('')}>
              <Ionicons name="close-circle" size={24} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ) : null}

        {location ? (
          <View style={createStyles.locationCard}>
            <Ionicons name="location" size={20} color="#22c55e" />
            <Text style={createStyles.locationText} numberOfLines={2}>{location.address || `${location.latitude.toFixed(5)}, ${location.longitude.toFixed(5)}`}</Text>
            <TouchableOpacity onPress={() => setLocation(null)}>
              <Ionicons name="close-circle" size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        ) : null}

        <Text style={createStyles.label}>{t('create.visibility') || 'Visibility'}</Text>
        <View style={createStyles.visibilityRow}>
          <TouchableOpacity
            style={[createStyles.visibilityBtn, form.isPublic && createStyles.visibilityBtnActive]}
            onPress={() => setForm(p => ({ ...p, isPublic: true }))}
          >
            <Ionicons name="globe-outline" size={20} color={form.isPublic ? '#fff' : '#64748b'} />
            <Text style={[createStyles.visibilityText, form.isPublic && createStyles.visibilityTextActive]}>{t('create.shareInCommunity') || 'Share in Community'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[createStyles.visibilityBtn, !form.isPublic && createStyles.visibilityBtnPrivate]}
            onPress={() => setForm(p => ({ ...p, isPublic: false }))}
          >
            <Ionicons name="lock-closed-outline" size={20} color={!form.isPublic ? '#fff' : '#64748b'} />
            <Text style={[createStyles.visibilityText, !form.isPublic && createStyles.visibilityTextActive]}>{t('create.keepPrivate') || 'Keep Private'}</Text>
          </TouchableOpacity>
        </View>
        <Text style={createStyles.visibilityHint}>
          {form.isPublic
            ? (t('create.publicHint') || 'Your report will be visible in the Community section.')
            : (t('create.privateHint') || 'Your report will only be visible to you and assigned workers.')}
        </Text>
      </View>

      <TouchableOpacity
        style={[createStyles.submitBtn, (!canSubmit || submitting) && createStyles.submitBtnDisabled]}
        onPress={submitGrievance}
        disabled={!canSubmit || submitting}
      >
        <Ionicons name="send" size={20} color="#fff" />
        <Text style={createStyles.submitText}>{submitting ? t('create.submitting') : t('create.submitGrievance')}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const createStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  label: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 8 },
  input: { backgroundColor: '#f8fafc', borderRadius: 12, padding: 14, fontSize: 15, color: '#1e293b', marginBottom: 16 },
  textArea: { minHeight: 100, textAlignVertical: 'top' },
  categoryRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  categoryChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0' },
  categoryChipActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  categoryText: { fontSize: 14, fontWeight: '500', color: '#64748b' },
  categoryTextActive: { color: '#fff' },
  priorityRow: { flexDirection: 'row', gap: 12 },
  priorityBtn: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  priorityBtnActive: { borderWidth: 0 },
  priorityText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  priorityTextActive: { color: '#fff' },
  attachRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  attachBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#eff6ff', padding: 14, borderRadius: 12, gap: 8 },
  attachText: { fontSize: 14, fontWeight: '600', color: '#3b82f6' },
  previewContainer: { position: 'relative', marginBottom: 16 },
  preview: { width: '100%', height: 200, borderRadius: 12 },
  removeBtn: { position: 'absolute', top: 8, right: 8 },
  locationCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f0fdf4', padding: 12, borderRadius: 10, gap: 8 },
  locationText: { flex: 1, fontSize: 13, color: '#1e293b' },
  visibilityRow: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  visibilityBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8fafc', padding: 14, borderRadius: 12, gap: 8, borderWidth: 1, borderColor: '#e2e8f0' },
  visibilityBtnActive: { backgroundColor: '#22c55e', borderColor: '#22c55e' },
  visibilityBtnPrivate: { backgroundColor: '#f59e0b', borderColor: '#f59e0b' },
  visibilityText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  visibilityTextActive: { color: '#fff' },
  visibilityHint: { fontSize: 12, color: '#94a3b8', marginBottom: 16 },
  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3b82f6', padding: 16, borderRadius: 12, gap: 8, marginBottom: 40 },
  submitBtnDisabled: { opacity: 0.5 },
  submitText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});

// My Complaints Tab
const MyComplaintsTab = ({ grievances, onSelectGrievance, onDelete }) => {
  const { t } = useLanguage();
  const [filter, setFilter] = useState('all');

  const filteredGrievances = filter === 'all' ? grievances :
    filter === 'active' ? grievances.filter(g => g.status !== 'Resolved' && g.status !== 'Closed') :
      grievances.filter(g => g.status === 'Resolved' || g.status === 'Closed');

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return { bg: '#fef3c7', text: '#f59e0b' };
      case 'Completed': case 'Resolved': return { bg: '#f0fdf4', text: '#22c55e' };
      case 'Assigned': return { bg: '#ede9fe', text: '#8b5cf6' };
      default: return { bg: '#eff6ff', text: '#3b82f6' };
    }
  };

  return (
    <View style={complaintsStyles.container}>
      <View style={complaintsStyles.filterRow}>
        {['all', 'active', 'resolved'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[complaintsStyles.filterBtn, filter === f && complaintsStyles.filterBtnActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[complaintsStyles.filterText, filter === f && complaintsStyles.filterTextActive]}>
              {f === 'all' ? t('common.all') : f === 'active' ? t('dashboard.active') : t('dashboard.resolved')}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {filteredGrievances.length === 0 ? (
        <View style={complaintsStyles.empty}>
          <Ionicons name="document-text-outline" size={48} color="#cbd5e1" />
          <Text style={complaintsStyles.emptyText}>{t('complaints.noComplaints')}</Text>
          <Text style={complaintsStyles.emptySubtext}>{t('complaints.complaintsAppearHere')}</Text>
        </View>
      ) : (
        <FlatList
          data={filteredGrievances}
          keyExtractor={(item) => item.id}
          contentContainerStyle={complaintsStyles.list}
          renderItem={({ item }) => {
            const colors = getStatusColor(item.status);
            return (
              <TouchableOpacity style={complaintsStyles.card} onPress={() => onSelectGrievance(item)}>
                <View style={complaintsStyles.cardHeader}>
                  <View style={complaintsStyles.cardInfo}>
                    <Text style={complaintsStyles.cardTitle} numberOfLines={1}>{item.title}</Text>
                    <Text style={complaintsStyles.cardMeta}>{item.category} • {item.priority} Priority</Text>
                  </View>
                  <TouchableOpacity onPress={() => {
                    Alert.alert(t('common.delete'), t('complaints.deleteConfirm'), [
                      { text: t('common.cancel'), style: 'cancel' },
                      { text: t('common.delete'), style: 'destructive', onPress: () => onDelete(item.id) },
                    ]);
                  }}>
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
                <View style={[complaintsStyles.statusBadge, { backgroundColor: colors.bg }]}>
                  <Ionicons name={item.status === 'In Progress' ? 'time' : item.status === 'Resolved' ? 'checkmark-circle' : 'document-text'} size={14} color={colors.text} />
                  <Text style={[complaintsStyles.statusText, { color: colors.text }]}>{item.status}</Text>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

const complaintsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  filterRow: { flexDirection: 'row', padding: 16, gap: 8 },
  filterBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#fff', alignItems: 'center', borderWidth: 1, borderColor: '#e2e8f0' },
  filterBtnActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  filterText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  filterTextActive: { color: '#fff' },
  list: { padding: 16, paddingTop: 0 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  cardMeta: { fontSize: 13, color: '#64748b' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, gap: 6 },
  statusText: { fontSize: 12, fontWeight: '600' },
  empty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#64748b', marginTop: 12 },
  emptySubtext: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
});

// Community Tab - Public complaints with voting and sharing
const CommunityTab = ({ currentUser, onSelectGrievance }) => {
  const { t } = useLanguage();
  const [allGrievances, setAllGrievances] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(
      collection(db, 'grievances'),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      // Filter to only show public grievances (isPublic !== false for backward compatibility)
      const publicData = data.filter(g => g.isPublic !== false);
      setAllGrievances(publicData);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const sortedGrievances = [...allGrievances].sort((a, b) => {
    if (sortBy === 'upvotes') {
      const aVotes = (a.upvotes?.length || 0) - (a.downvotes?.length || 0);
      const bVotes = (b.upvotes?.length || 0) - (b.downvotes?.length || 0);
      return bVotes - aVotes;
    }
    return 0;
  });

  const handleVote = async (grievanceId, voteType) => {
    if (!currentUser?.uid) return;
    const grievanceRef = doc(db, 'grievances', grievanceId);
    const grievance = allGrievances.find(g => g.id === grievanceId);

    const upvotes = grievance?.upvotes || [];
    const downvotes = grievance?.downvotes || [];
    const hasUpvoted = upvotes.includes(currentUser.uid);
    const hasDownvoted = downvotes.includes(currentUser.uid);

    try {
      if (voteType === 'up') {
        if (hasUpvoted) {
          // Remove upvote
          const newUpvotes = upvotes.filter(id => id !== currentUser.uid);
          await updateDoc(grievanceRef, { upvotes: newUpvotes });
        } else {
          // Add upvote, remove from downvotes if present
          const newUpvotes = [...upvotes, currentUser.uid];
          const newDownvotes = downvotes.filter(id => id !== currentUser.uid);
          await updateDoc(grievanceRef, { upvotes: newUpvotes, downvotes: newDownvotes });
        }
      } else {
        if (hasDownvoted) {
          // Remove downvote
          const newDownvotes = downvotes.filter(id => id !== currentUser.uid);
          await updateDoc(grievanceRef, { downvotes: newDownvotes });
        } else {
          // Add downvote, remove from upvotes if present
          const newDownvotes = [...downvotes, currentUser.uid];
          const newUpvotes = upvotes.filter(id => id !== currentUser.uid);
          await updateDoc(grievanceRef, { upvotes: newUpvotes, downvotes: newDownvotes });
        }
      }
    } catch (error) {
      console.error('Vote error:', error);
      Alert.alert(t('common.error'), t('messages.voteError'));
    }
  };


  const handleShare = async (grievance) => {
    const shareUrl = `https://janpath.app/complaint/${grievance.id}`;
    const message = `Check out this complaint on JanPath: "${grievance.title}"\n\n${shareUrl}`;

    try {
      await Share.share({ message, title: grievance.title });
    } catch (error) {
      Alert.alert(t('common.error'), t('messages.shareError'));
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return { bg: '#fef3c7', text: '#f59e0b' };
      case 'Completed': case 'Resolved': return { bg: '#f0fdf4', text: '#22c55e' };
      case 'Assigned': return { bg: '#ede9fe', text: '#8b5cf6' };
      default: return { bg: '#eff6ff', text: '#3b82f6' };
    }
  };

  if (loading) {
    return (
      <View style={communityStyles.emptyContainer}>
        <Text style={communityStyles.loadingText}>{t('community.loading')}</Text>
      </View>
    );
  }

  return (
    <View style={communityStyles.container}>
      <View style={communityStyles.sortRow}>
        <Text style={communityStyles.sortLabel}>{t('community.sortBy')}</Text>
        <TouchableOpacity
          style={[communityStyles.sortBtn, sortBy === 'recent' && communityStyles.sortBtnActive]}
          onPress={() => setSortBy('recent')}
        >
          <Ionicons name="time-outline" size={16} color={sortBy === 'recent' ? '#fff' : '#64748b'} />
          <Text style={[communityStyles.sortText, sortBy === 'recent' && communityStyles.sortTextActive]}>{t('community.recent')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[communityStyles.sortBtn, sortBy === 'upvotes' && communityStyles.sortBtnActive]}
          onPress={() => setSortBy('upvotes')}
        >
          <Ionicons name="trending-up-outline" size={16} color={sortBy === 'upvotes' ? '#fff' : '#64748b'} />
          <Text style={[communityStyles.sortText, sortBy === 'upvotes' && communityStyles.sortTextActive]}>{t('community.topVoted')}</Text>
        </TouchableOpacity>
      </View>

      {sortedGrievances.length === 0 ? (
        <View style={communityStyles.emptyContainer}>
          <Ionicons name="people-outline" size={48} color="#cbd5e1" />
          <Text style={communityStyles.emptyText}>{t('community.noComplaints')}</Text>
          <Text style={communityStyles.emptySubtext}>{t('community.beFirst')}</Text>
        </View>
      ) : (
        <FlatList
          data={sortedGrievances}
          keyExtractor={(item) => item.id}
          contentContainerStyle={communityStyles.list}
          renderItem={({ item }) => {
            const colors = getStatusColor(item.status);
            const upvoteCount = item.upvotes?.length || 0;
            const downvoteCount = item.downvotes?.length || 0;
            const hasUpvoted = item.upvotes?.includes(currentUser?.uid);
            const hasDownvoted = item.downvotes?.includes(currentUser?.uid);

            return (
              <View style={communityStyles.card}>
                <TouchableOpacity onPress={() => onSelectGrievance(item)}>
                  <Text style={communityStyles.cardTitle} numberOfLines={2}>{item.title}</Text>
                  <Text style={communityStyles.cardDesc} numberOfLines={2}>{item.description}</Text>
                  <View style={communityStyles.cardMeta}>
                    <View style={[communityStyles.badge, { backgroundColor: '#eff6ff' }]}>
                      <Text style={[communityStyles.badgeText, { color: '#3b82f6' }]}>{item.category}</Text>
                    </View>
                    <View style={[communityStyles.badge, { backgroundColor: colors.bg }]}>
                      <Text style={[communityStyles.badgeText, { color: colors.text }]}>{item.status}</Text>
                    </View>
                  </View>
                </TouchableOpacity>

                <View style={communityStyles.actionRow}>
                  <TouchableOpacity
                    style={[communityStyles.voteBtn, hasUpvoted && communityStyles.voteBtnActive]}
                    onPress={() => handleVote(item.id, 'up')}
                  >
                    <Ionicons name={hasUpvoted ? 'arrow-up' : 'arrow-up-outline'} size={18} color={hasUpvoted ? '#22c55e' : '#64748b'} />
                    <Text style={[communityStyles.voteText, hasUpvoted && { color: '#22c55e' }]}>{upvoteCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[communityStyles.voteBtn, hasDownvoted && communityStyles.voteBtnActive]}
                    onPress={() => handleVote(item.id, 'down')}
                  >
                    <Ionicons name={hasDownvoted ? 'arrow-down' : 'arrow-down-outline'} size={18} color={hasDownvoted ? '#ef4444' : '#64748b'} />
                    <Text style={[communityStyles.voteText, hasDownvoted && { color: '#ef4444' }]}>{downvoteCount}</Text>
                  </TouchableOpacity>

                  <TouchableOpacity style={communityStyles.shareBtn} onPress={() => handleShare(item)}>
                    <Ionicons name="share-social-outline" size={18} color="#3b82f6" />
                    <Text style={communityStyles.shareText}>{t('community.share')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
        />
      )}
    </View>
  );
};

const communityStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  sortRow: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 8 },
  sortLabel: { fontSize: 14, fontWeight: '600', color: '#64748b', marginRight: 4 },
  sortBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#fff', borderWidth: 1, borderColor: '#e2e8f0', gap: 4 },
  sortBtnActive: { backgroundColor: '#3b82f6', borderColor: '#3b82f6' },
  sortText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  sortTextActive: { color: '#fff' },
  list: { padding: 16, paddingTop: 0 },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#1e293b', marginBottom: 6 },
  cardDesc: { fontSize: 14, color: '#64748b', marginBottom: 12, lineHeight: 20 },
  cardMeta: { flexDirection: 'row', gap: 8, marginBottom: 14 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  actionRow: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#f1f5f9', paddingTop: 12, gap: 4 },
  voteBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#f8fafc', gap: 4 },
  voteBtnActive: { backgroundColor: '#f0fdf4' },
  voteText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  shareBtn: { flexDirection: 'row', alignItems: 'center', marginLeft: 'auto', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8, backgroundColor: '#eff6ff', gap: 6 },
  shareText: { fontSize: 14, fontWeight: '600', color: '#3b82f6' },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 16, fontWeight: '600', color: '#64748b', marginTop: 12 },
  emptySubtext: { fontSize: 14, color: '#94a3b8', marginTop: 4 },
  loadingText: { fontSize: 14, color: '#64748b' },
});

// Grievance Detail Screen
const GrievanceDetailScreen = ({ grievance, onBack }) => {
  const { t } = useLanguage();
  const [timeline, setTimeline] = useState([]);
  const [activeTab, setActiveTab] = useState('details');

  useEffect(() => {
    if (!grievance?.id) return;
    const q = query(
      collection(db, 'statusLogs'),
      where('grievanceId', '==', grievance.id),
      orderBy('timestamp', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setTimeline(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [grievance?.id]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return { bg: '#fef3c7', text: '#f59e0b' };
      case 'Completed': case 'Resolved': return { bg: '#f0fdf4', text: '#22c55e' };
      case 'Assigned': return { bg: '#ede9fe', text: '#8b5cf6' };
      default: return { bg: '#eff6ff', text: '#3b82f6' };
    }
  };

  const colors = getStatusColor(grievance?.status);

  return (
    <ScrollView style={detailStyles.container} contentContainerStyle={detailStyles.content}>
      <View style={detailStyles.card}>
        <Text style={detailStyles.title}>{grievance?.title}</Text>
        <View style={detailStyles.metaRow}>
          <View style={[detailStyles.badge, { backgroundColor: '#eff6ff' }]}>
            <Text style={[detailStyles.badgeText, { color: '#3b82f6' }]}>{grievance?.category && t('categories.' + grievance.category.toLowerCase())}</Text>
          </View>
          <View style={[detailStyles.badge, { backgroundColor: grievance?.priority === 'High' ? '#fef2f2' : grievance?.priority === 'Medium' ? '#fef3c7' : '#f0fdf4' }]}>
            <Text style={[detailStyles.badgeText, { color: grievance?.priority === 'High' ? '#ef4444' : grievance?.priority === 'Medium' ? '#f59e0b' : '#22c55e' }]}>
              {grievance?.priority && t('priorities.' + grievance.priority.toLowerCase())} {t('create.priority')}
            </Text>
          </View>
        </View>
        <View style={[detailStyles.statusCard, { backgroundColor: colors.bg }]}>
          <Ionicons name={grievance?.status === 'In Progress' ? 'time' : grievance?.status === 'Resolved' ? 'checkmark-circle' : 'document-text'} size={24} color={colors.text} />
          <Text style={[detailStyles.statusText, { color: colors.text }]}>{grievance?.status === 'In Progress' ? t('common.inProgress') : grievance?.status && t('common.' + grievance.status.toLowerCase())}</Text>
        </View>
      </View>

      <View style={detailStyles.tabRow}>
        <TouchableOpacity style={[detailStyles.tabBtn, activeTab === 'details' && detailStyles.tabBtnActive]} onPress={() => setActiveTab('details')}>
          <Text style={[detailStyles.tabText, activeTab === 'details' && detailStyles.tabTextActive]}>{t('complaints.details')}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[detailStyles.tabBtn, activeTab === 'updates' && detailStyles.tabBtnActive]} onPress={() => setActiveTab('updates')}>
          <Text style={[detailStyles.tabText, activeTab === 'updates' && detailStyles.tabTextActive]}>{t('complaints.updates')} ({timeline.length})</Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'details' ? (
        <>
          <View style={detailStyles.card}>
            <Text style={detailStyles.sectionTitle}>{t('create.description')}</Text>
            <Text style={detailStyles.description}>{grievance?.description}</Text>
          </View>

          {grievance?.location && (
            <View style={detailStyles.card}>
              <Text style={detailStyles.sectionTitle}>{t('complaints.location')}</Text>
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
              <Text style={detailStyles.sectionTitle}>{t('complaints.attachedImage')}</Text>
              <Image source={{ uri: `data:image/jpeg;base64,${grievance.imageBase64}` }} style={detailStyles.image} />
            </View>
          )}
        </>
      ) : (
        <View style={detailStyles.card}>
          <Text style={detailStyles.sectionTitle}>{t('complaints.statusTimeline')}</Text>
          {timeline.length === 0 ? (
            <Text style={detailStyles.emptyTimeline}>{t('complaints.noUpdates')}</Text>
          ) : (
            timeline.map((log, idx) => (
              <View key={log.id} style={[detailStyles.timelineItem, idx < timeline.length - 1 && detailStyles.timelineItemBorder]}>
                <View style={[detailStyles.timelineDot, { backgroundColor: getStatusColor(log.status).bg }]}>
                  <View style={[detailStyles.timelineDotInner, { backgroundColor: getStatusColor(log.status).text }]} />
                </View>
                <View style={detailStyles.timelineContent}>
                  <Text style={detailStyles.timelineStatus}>{log.status}</Text>
                  <Text style={detailStyles.timelineRemarks}>{log.remarks}</Text>
                  <Text style={detailStyles.timelineDate}>{formatDate(log.timestamp)}</Text>
                </View>
              </View>
            ))
          )}
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
  metaRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  statusCard: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 16, borderRadius: 12 },
  statusText: { fontSize: 16, fontWeight: '600' },
  tabRow: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 4, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.03, shadowRadius: 4, elevation: 1 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  tabBtnActive: { backgroundColor: '#3b82f6' },
  tabText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#fff' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: '#64748b', marginBottom: 12 },
  description: { fontSize: 15, color: '#1e293b', lineHeight: 22 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  locationText: { flex: 1, fontSize: 14, color: '#1e293b' },
  image: { width: '100%', height: 200, borderRadius: 12 },
  emptyTimeline: { fontSize: 14, color: '#94a3b8', textAlign: 'center', paddingVertical: 20 },
  timelineItem: { flexDirection: 'row', paddingBottom: 16, marginBottom: 16 },
  timelineItemBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  timelineDot: { width: 32, height: 32, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  timelineDotInner: { width: 12, height: 12, borderRadius: 6 },
  timelineContent: { flex: 1 },
  timelineStatus: { fontSize: 15, fontWeight: '600', color: '#1e293b', marginBottom: 4 },
  timelineRemarks: { fontSize: 14, color: '#64748b', marginBottom: 4 },
  timelineDate: { fontSize: 12, color: '#94a3b8' },
});

// Settings Screen
const SettingsScreen = () => {
  const { language, changeLanguage, t } = useLanguage();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <ScrollView style={settingsStyles.container}>
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>{t('settings.notifications')}</Text>
        <View style={settingsStyles.sectionContent}>
          <View style={settingsStyles.item}>
            <View style={settingsStyles.itemIcon}><Ionicons name="notifications" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>{t('settings.pushNotifications')}</Text>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }} thumbColor={pushNotifications ? '#3b82f6' : '#94a3b8'} />
          </View>
        </View>
      </View>

      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>{t('settings.language')}</Text>
        <View style={settingsStyles.sectionContent}>
          <TouchableOpacity style={[settingsStyles.item, { borderBottomWidth: 0 }]} onPress={() => setShowLanguageModal(true)}>
            <View style={settingsStyles.itemIcon}><Ionicons name="language" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>{currentLang?.nativeName || 'English'}</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>{t('settings.account')}</Text>
        <View style={settingsStyles.sectionContent}>
          <TouchableOpacity style={settingsStyles.item}>
            <View style={settingsStyles.itemIcon}><Ionicons name="lock-closed" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>{t('settings.changePassword')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity style={[settingsStyles.item, { borderBottomWidth: 0 }]}>
            <View style={settingsStyles.itemIcon}><Ionicons name="shield-checkmark" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>{t('settings.privacyPolicy')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={settingsStyles.version}>{t('settings.version')} 1.0.0</Text>

      <Modal visible={showLanguageModal} animationType="slide" transparent>
        <View style={settingsStyles.modalOverlay}>
          <View style={settingsStyles.modalContent}>
            <View style={settingsStyles.modalHeader}>
              <Text style={settingsStyles.modalTitle}>{t('settings.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[settingsStyles.langItem, language === lang.code && settingsStyles.langItemActive]}
                  onPress={() => { changeLanguage(lang.code); setShowLanguageModal(false); }}
                >
                  <Text style={[settingsStyles.langName, language === lang.code && settingsStyles.langNameActive]}>{lang.nativeName}</Text>
                  <Text style={settingsStyles.langNameEn}>{lang.name}</Text>
                  {language === lang.code && <Ionicons name="checkmark-circle" size={22} color="#3b82f6" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%', paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  langItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 12 },
  langItemActive: { backgroundColor: '#eff6ff' },
  langName: { fontSize: 16, fontWeight: '600', color: '#1e293b', flex: 1 },
  langNameActive: { color: '#3b82f6' },
  langNameEn: { fontSize: 14, color: '#64748b' },
});


// Help Screen
const HelpScreen = () => {
  const { t } = useLanguage();
  const [expandedFaq, setExpandedFaq] = useState(null);
  const faqs = [
    { q: t('help.faq1Q'), a: t('help.faq1A') },
    { q: t('help.faq2Q'), a: t('help.faq2A') },
    { q: t('help.faq3Q'), a: t('help.faq3A') },
  ];

  return (
    <ScrollView style={helpStyles.container}>
      <View style={helpStyles.contactCard}>
        <Ionicons name="headset" size={40} color="#3b82f6" />
        <Text style={helpStyles.contactTitle}>{t('help.needHelp')}</Text>
        <Text style={helpStyles.contactDesc}>{t('help.supportDesc')}</Text>
        <View style={helpStyles.contactButtons}>
          <TouchableOpacity style={helpStyles.contactBtn} onPress={() => Linking.openURL('mailto:support@janpath.com')}>
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={helpStyles.contactBtnText}>{t('help.emailUs')}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[helpStyles.contactBtn, { backgroundColor: '#22c55e' }]} onPress={() => Linking.openURL('tel:+911234567890')}>
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={helpStyles.contactBtnText}>{t('help.callUs')}</Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text style={helpStyles.sectionTitle}>{t('help.faq')}</Text>
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

// Main User Navigation
const UserNavigation = ({ currentUser }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [grievances, setGrievances] = useState([]);

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
    const q = query(
      collection(db, 'grievances'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );
    const unsub = onSnapshot(q, (snap) => {
      setGrievances(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [currentUser]);

  const deleteGrievance = async (id) => {
    try {
      await deleteDoc(doc(db, 'grievances', id));
      Alert.alert('Deleted', 'Grievance deleted successfully.');
    } catch (error) {
      Alert.alert('Error', 'Failed to delete grievance.');
    }
  };

  const tabs = [
    { key: 'Home', icon: 'home', iconOutline: 'home-outline' },
    { key: 'Community', icon: 'people', iconOutline: 'people-outline' },
    { key: 'Create', icon: 'add-circle', iconOutline: 'add-circle-outline' },
    { key: 'My Complaints', icon: 'document-text', iconOutline: 'document-text-outline' },
  ];

  const closeAllOverlays = () => {
    setShowProfile(false);
    setShowSettings(false);
    setShowHelp(false);
    setSelectedGrievance(null);
  };

  const isOverlayOpen = showProfile || showSettings || showHelp || selectedGrievance;

  const getHeaderTitle = () => {
    if (selectedGrievance) return t('complaints.details');
    if (showProfile) return t('profile.title');
    if (showSettings) return t('settings.title');
    if (showHelp) return t('help.title');
    if (activeTab === 'Community') return t('community.title');
    if (activeTab === 'Create') return t('dashboard.reportProblem');
    if (activeTab === 'My Complaints') return t('complaints.myComplaints');
    return 'JanPath';
  };

  const renderContent = () => {
    if (selectedGrievance) return <GrievanceDetailScreen grievance={selectedGrievance} onBack={() => setSelectedGrievance(null)} />;
    if (showProfile) return <ProfileScreen currentUser={currentUser} />;
    if (showSettings) return <SettingsScreen />;
    if (showHelp) return <HelpScreen />;

    switch (activeTab) {
      case 'Home': return <UserDashboard grievances={grievances} onNavigate={setActiveTab} onSelectGrievance={setSelectedGrievance} />;
      case 'Community': return <CommunityTab currentUser={currentUser} onSelectGrievance={setSelectedGrievance} />;
      case 'Create': return <CreateGrievanceTab currentUser={currentUser} onSuccess={() => setActiveTab('My Complaints')} />;
      case 'My Complaints': return <MyComplaintsTab grievances={grievances} onSelectGrievance={setSelectedGrievance} onDelete={deleteGrievance} />;
      default: return <UserDashboard grievances={grievances} onNavigate={setActiveTab} onSelectGrievance={setSelectedGrievance} />;
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
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.key === 'Home' ? t('nav.home') :
                    tab.key === 'Community' ? t('nav.community') :
                      tab.key === 'Create' ? t('nav.create') : t('nav.complaints')}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      <Modal visible={showMenu} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View style={styles.menuLogo}><Ionicons name="leaf" size={28} color="#fff" /></View>
              <View style={styles.menuHeaderText}>
                <Text style={styles.menuTitle}>JanPath</Text>
                <Text style={styles.menuSubtitle}>{profile?.email || currentUser?.email}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowMenu(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.menuItems}>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); closeAllOverlays(); setShowProfile(true); }}>
                <Ionicons name="person-circle-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>{t('profile.viewProfile')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); closeAllOverlays(); setShowSettings(true); }}>
                <Ionicons name="settings-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>{t('settings.title')}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.menuItem} onPress={() => { setShowMenu(false); closeAllOverlays(); setShowHelp(true); }}>
                <Ionicons name="help-circle-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>{t('help.title')}</Text>
              </TouchableOpacity>
              <View style={styles.menuDivider} />
              <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut(auth)}>
                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                <Text style={styles.signOutText}>{t('auth.signOut')}</Text>
              </TouchableOpacity>
            </ScrollView>
            <Text style={styles.versionText}>{t('settings.version')} 1.0.0</Text>
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
  menuHeader: { flexDirection: 'row', alignItems: 'center', padding: 20, paddingTop: 60, backgroundColor: '#3b82f6', gap: 12 },
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

export default UserNavigation;
