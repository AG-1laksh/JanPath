import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';

const AssignTab = ({ currentUser }) => {
  const [unassignedGrievances, setUnassignedGrievances] = useState([]);
  const [registeredWorkers, setRegisteredWorkers] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [grievanceDetail, setGrievanceDetail] = useState(null);
  const [assigning, setAssigning] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const grievancesQuery = query(
      collection(db, 'grievances'),
      where('assignedWorkerId', '==', null),
      orderBy('createdAt', 'desc')
    );

    const workersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'WORKER')
    );

    const unsubGrievances = onSnapshot(grievancesQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setUnassignedGrievances(items);
    });

    const unsubWorkers = onSnapshot(workersQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setRegisteredWorkers(items);
    });

    return () => {
      unsubGrievances();
      unsubWorkers();
    };
  }, []);

  useEffect(() => {
    const fetchGrievance = async (grievanceId) => {
      if (!grievanceId) {
        setGrievanceDetail(null);
        return;
      }
      const docSnap = await getDoc(doc(db, 'grievances', grievanceId));
      if (docSnap.exists()) {
        setGrievanceDetail({ id: docSnap.id, ...docSnap.data() });
      } else {
        setGrievanceDetail(null);
      }
    };

    if (selectedGrievance?.id) {
      fetchGrievance(selectedGrievance.id);
    } else {
      setGrievanceDetail(null);
    }
  }, [selectedGrievance]);

  const assignGrievance = async (grievanceId, workerId) => {
    try {
      setAssigning(true);
      await updateDoc(doc(db, 'grievances', grievanceId), {
        assignedWorkerId: workerId,
        status: 'Assigned',
      });

      await addDoc(collection(db, 'statusLogs'), {
        grievanceId,
        status: 'Assigned',
        updatedBy: currentUser.uid,
        remarks: 'Assigned by admin',
        timestamp: serverTimestamp(),
      });

      setSelectedGrievance(null);
      Alert.alert('Success', 'Grievance assigned successfully.');
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to assign grievance.');
    } finally {
      setAssigning(false);
    }
  };

  const filteredWorkers = registeredWorkers.filter((worker) =>
    worker.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    worker.department?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedGrievance) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedGrievance(null)}>
          <Ionicons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Back to Grievances</Text>
        </TouchableOpacity>

        {grievanceDetail && (
          <View style={styles.grievanceCard}>
            <Text style={styles.grievanceTitle}>{grievanceDetail.title}</Text>
            
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{grievanceDetail.category}</Text>
              </View>
              <View style={[styles.tag, styles.priorityTag]}>
                <Text style={styles.tagText}>{grievanceDetail.priority}</Text>
              </View>
            </View>

            <Text style={styles.description}>{grievanceDetail.description}</Text>

            {grievanceDetail.location && (
              <View style={styles.locationRow}>
                <Ionicons name="location-outline" size={16} color="#64748b" />
                <Text style={styles.locationText}>
                  {grievanceDetail.location.address || `${grievanceDetail.location.latitude?.toFixed(5)}, ${grievanceDetail.location.longitude?.toFixed(5)}`}
                </Text>
              </View>
            )}

            {grievanceDetail.imageBase64 && (
              <Image
                source={{ uri: `data:image/jpeg;base64,${grievanceDetail.imageBase64}` }}
                style={styles.grievanceImage}
              />
            )}
          </View>
        )}

        <Text style={styles.sectionTitle}>Select Worker to Assign</Text>
        
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#94a3b8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or department..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#94a3b8"
          />
        </View>

        {filteredWorkers.map((worker) => (
          <TouchableOpacity
            key={worker.id}
            style={styles.workerCard}
            onPress={() => assignGrievance(selectedGrievance.id, worker.id)}
            disabled={assigning}
          >
            <View style={styles.workerAvatar}>
              <Ionicons name="person" size={20} color="#3b82f6" />
            </View>
            <View style={styles.workerInfo}>
              <Text style={styles.workerName}>{worker.name}</Text>
              <Text style={styles.workerDept}>{worker.department || 'No Department'}</Text>
            </View>
            <View style={[styles.statusIndicator, worker.isWorking ? styles.busyIndicator : styles.availableIndicator]}>
              <Text style={[styles.statusText, worker.isWorking ? styles.busyText : styles.availableText]}>
                {worker.isWorking ? 'Busy' : 'Available'}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Assign Grievances</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{unassignedGrievances.length}</Text>
        </View>
      </View>

      {unassignedGrievances.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="checkmark-done-circle-outline" size={64} color="#22c55e" />
          <Text style={styles.emptyText}>All caught up!</Text>
          <Text style={styles.emptySubtext}>No unassigned grievances</Text>
        </View>
      ) : (
        <FlatList
          data={unassignedGrievances}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.grievanceListCard} onPress={() => setSelectedGrievance(item)}>
              <View style={styles.grievanceListHeader}>
                <View style={styles.grievanceIcon}>
                  <Ionicons name="document-text" size={20} color="#3b82f6" />
                </View>
                <View style={styles.grievanceListInfo}>
                  <Text style={styles.grievanceListTitle} numberOfLines={1}>{item.title}</Text>
                  <Text style={styles.grievanceListMeta}>{item.category} • {item.priority}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>
              <Text style={styles.grievancePreview} numberOfLines={2}>{item.description}</Text>
            </TouchableOpacity>
          )}
        />
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
    backgroundColor: '#f59e0b',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  listContainer: {
    padding: 16,
  },
  grievanceListCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  grievanceListHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  grievanceIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  grievanceListInfo: {
    flex: 1,
  },
  grievanceListTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  grievanceListMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  grievancePreview: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
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
  grievanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  grievanceTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 12,
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  priorityTag: {
    backgroundColor: '#fef3c7',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  description: {
    fontSize: 15,
    color: '#475569',
    lineHeight: 22,
    marginBottom: 16,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 16,
  },
  locationText: {
    fontSize: 13,
    color: '#64748b',
    flex: 1,
  },
  grievanceImage: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchInput: {
    flex: 1,
    paddingVertical: 14,
    paddingLeft: 12,
    fontSize: 15,
    color: '#1e293b',
  },
  workerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
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
  workerDept: {
    fontSize: 13,
    color: '#64748b',
  },
  statusIndicator: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  availableIndicator: {
    backgroundColor: '#f0fdf4',
  },
  busyIndicator: {
    backgroundColor: '#fef3c7',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  availableText: {
    color: '#22c55e',
  },
  busyText: {
    color: '#f59e0b',
  },
});

export default AssignTab;
