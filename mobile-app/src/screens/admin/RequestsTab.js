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

const RequestsTab = ({ currentUser }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [grievanceDetail, setGrievanceDetail] = useState(null);

  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'workerRequests'),
      where('status', '==', 'Pending'),
      orderBy('requestedAt', 'desc')
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPendingRequests(items);
    });

    return unsubscribe;
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

    if (selectedRequest?.grievanceId) {
      fetchGrievance(selectedRequest.grievanceId);
    } else {
      setGrievanceDetail(null);
    }
  }, [selectedRequest]);

  const approveRequest = async (request) => {
    try {
      await updateDoc(doc(db, 'grievances', request.grievanceId), {
        assignedWorkerId: request.workerId,
        status: 'Assigned',
      });

      await addDoc(collection(db, 'statusLogs'), {
        grievanceId: request.grievanceId,
        status: 'Assigned',
        updatedBy: currentUser.uid,
        remarks: 'Assigned by admin',
        timestamp: serverTimestamp(),
      });

      await updateDoc(doc(db, 'workerRequests', request.id), {
        status: 'Approved',
      });

      setSelectedRequest(null);
      Alert.alert('Success', 'Request approved and grievance assigned.');
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to approve request.');
    }
  };

  const denyRequest = async (request) => {
    try {
      await updateDoc(doc(db, 'workerRequests', request.id), {
        status: 'Rejected',
      });
      setSelectedRequest(null);
      Alert.alert('Denied', 'Request has been denied.');
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to deny request.');
    }
  };

  if (selectedRequest) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedRequest(null)}>
          <Ionicons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Back to Requests</Text>
        </TouchableOpacity>

        <View style={styles.detailCard}>
          <Text style={styles.detailTitle}>Worker Request Details</Text>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Worker ID</Text>
            <Text style={styles.detailValue}>{selectedRequest.workerId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Grievance ID</Text>
            <Text style={styles.detailValue}>{selectedRequest.grievanceId}</Text>
          </View>
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Reason</Text>
            <Text style={styles.detailValue}>{selectedRequest.reason}</Text>
          </View>
        </View>

        {grievanceDetail && (
          <View style={styles.grievanceCard}>
            <Text style={styles.cardSectionTitle}>Grievance Information</Text>
            <Text style={styles.grievanceTitle}>{grievanceDetail.title}</Text>
            
            <View style={styles.tagRow}>
              <View style={styles.tag}>
                <Text style={styles.tagText}>{grievanceDetail.category}</Text>
              </View>
              <View style={[styles.tag, styles.priorityTag]}>
                <Text style={styles.tagText}>{grievanceDetail.priority}</Text>
              </View>
              <View style={[styles.tag, styles.statusTag]}>
                <Text style={styles.tagText}>{grievanceDetail.status}</Text>
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

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => approveRequest(selectedRequest)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.denyButton]}
            onPress={() => denyRequest(selectedRequest)}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Deny</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Worker Requests</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pendingRequests.length}</Text>
        </View>
      </View>

      {pendingRequests.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="document-text-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No pending requests</Text>
          <Text style={styles.emptySubtext}>Worker requests will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={pendingRequests}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.requestCard} onPress={() => setSelectedRequest(item)}>
              <View style={styles.requestHeader}>
                <View style={styles.requestIcon}>
                  <Ionicons name="git-pull-request" size={20} color="#3b82f6" />
                </View>
                <View style={styles.requestInfo}>
                  <Text style={styles.requestTitle}>Grievance: {item.grievanceId?.slice(0, 8)}...</Text>
                  <Text style={styles.requestMeta}>Worker: {item.workerId?.slice(0, 8)}...</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
              </View>
              <Text style={styles.requestReason} numberOfLines={2}>{item.reason}</Text>
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
  listContainer: {
    padding: 16,
  },
  requestCard: {
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
  requestHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  requestIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  requestInfo: {
    flex: 1,
  },
  requestTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  requestMeta: {
    fontSize: 13,
    color: '#64748b',
  },
  requestReason: {
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
  detailCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 12,
    color: '#64748b',
    marginBottom: 4,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  grievanceCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardSectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  grievanceTitle: {
    fontSize: 18,
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
  statusTag: {
    backgroundColor: '#dbeafe',
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
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  approveButton: {
    backgroundColor: '#22c55e',
  },
  denyButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default RequestsTab;
