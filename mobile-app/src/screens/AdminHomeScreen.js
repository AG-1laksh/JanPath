import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';

const AdminHomeScreen = ({ currentUser }) => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [pendingWorkerSignups, setPendingWorkerSignups] = useState([]);
  const [registeredWorkers, setRegisteredWorkers] = useState([]);
  const [unassignedGrievances, setUnassignedGrievances] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedSignup, setSelectedSignup] = useState(null);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [grievanceDetail, setGrievanceDetail] = useState(null);
  const [assignGrievanceId, setAssignGrievanceId] = useState('');
  const [assignWorkerId, setAssignWorkerId] = useState('');
  const [assigning, setAssigning] = useState(false);
  const [activeTab, setActiveTab] = useState('requests');

  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'workerRequests'),
      where('status', '==', 'Pending'),
      orderBy('requestedAt', 'desc')
    );

    const workerSignupQuery = query(
      collection(db, 'workerSignupRequests'),
      where('status', '==', 'Pending'),
      orderBy('requestedAt', 'desc')
    );

    const workersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'WORKER')
    );

    const grievancesQuery = query(
      collection(db, 'grievances'),
      where('assignedWorkerId', '==', null),
      orderBy('createdAt', 'desc')
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPendingRequests(items);
    });

    const unsubscribeWorkerSignups = onSnapshot(workerSignupQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPendingWorkerSignups(items);
    });

    const unsubscribeWorkers = onSnapshot(workersQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setRegisteredWorkers(items);
    });

    const unsubscribeGrievances = onSnapshot(grievancesQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setUnassignedGrievances(items);
    });

    return () => {
      unsubscribeRequests();
      unsubscribeWorkerSignups();
      unsubscribeWorkers();
      unsubscribeGrievances();
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

    if (selectedRequest?.grievanceId) {
      fetchGrievance(selectedRequest.grievanceId);
    } else if (selectedGrievance?.id) {
      fetchGrievance(selectedGrievance.id);
    } else {
      setGrievanceDetail(null);
    }
  }, [selectedRequest, selectedGrievance]);

  const assignGrievance = async (grievanceId, workerId, remarks) => {
    if (!grievanceId || !workerId) {
      Alert.alert('Missing fields', 'Grievance ID and Worker ID are required.');
      return;
    }

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
        remarks,
        timestamp: serverTimestamp(),
      });

      Alert.alert('Assigned', 'Grievance assigned to worker.');
    } catch (error) {
      Alert.alert('Assign failed', error?.message || 'Please try again.');
    } finally {
      setAssigning(false);
    }
  };

  const approveRequest = async (request) => {
    await assignGrievance(request.grievanceId, request.workerId, 'Assigned by admin');
    await updateDoc(doc(db, 'workerRequests', request.id), {
      status: 'Approved',
    });
  };

  const denyRequest = async (request) => {
    try {
      await updateDoc(doc(db, 'workerRequests', request.id), {
        status: 'Rejected',
      });
    } catch (error) {
      Alert.alert('Deny failed', error?.message || 'Please try again.');
    }
  };

  const approveWorkerSignup = async (request) => {
    try {
      await updateDoc(doc(db, 'users', request.workerId), {
        role: 'WORKER',
      });
      await updateDoc(doc(db, 'workerSignupRequests', request.id), {
        status: 'Approved',
      });
    } catch (error) {
      Alert.alert('Approve failed', error?.message || 'Please try again.');
    }
  };

  const denyWorkerSignup = async (request) => {
    try {
      await updateDoc(doc(db, 'workerSignupRequests', request.id), {
        status: 'Rejected',
      });
    } catch (error) {
      Alert.alert('Reject failed', error?.message || 'Please try again.');
    }
  };

  const handleManualAssign = async () => {
    await assignGrievance(assignGrievanceId.trim(), assignWorkerId.trim(), 'Assigned by admin');
    setAssignGrievanceId('');
    setAssignWorkerId('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Admin Panel</Text>
        <Button title="Sign out" onPress={() => signOut(auth)} />
      </View>

      {selectedSignup && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeaderRow}>
            <Text style={styles.sectionTitle}>Worker Signup Details</Text>
            <Button title="Back" onPress={() => setSelectedSignup(null)} />
          </View>
          <Text style={styles.cardTitle}>{selectedSignup.name}</Text>
          <Text style={styles.cardMeta}>Email: {selectedSignup.email}</Text>
          <Text style={styles.cardMeta}>DOB: {selectedSignup.dob}</Text>
          <Text style={styles.cardMeta}>Phone: {selectedSignup.phone}</Text>
          <Text style={styles.cardMeta}>Aadhar: {selectedSignup.aadhar}</Text>
          <Text style={styles.cardMeta}>City: {selectedSignup.city}</Text>
          <Text style={styles.cardMeta}>Department: {selectedSignup.department}</Text>
          <Text style={styles.cardMeta}>
            Experience: {selectedSignup.experienceYears || '0'}y {selectedSignup.experienceMonths || '0'}m
          </Text>
          <Text style={styles.cardMeta}>
            Skills: {(selectedSignup.skills || []).join(', ')}
          </Text>
          <View style={styles.actionRow}>
            <Button title="Approve" onPress={() => approveWorkerSignup(selectedSignup)} />
            <Button title="Reject" onPress={() => denyWorkerSignup(selectedSignup)} />
          </View>
        </View>
      )}

      {selectedRequest && !selectedSignup && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeaderRow}>
            <Text style={styles.sectionTitle}>Worker Request Details</Text>
            <Button title="Back" onPress={() => setSelectedRequest(null)} />
          </View>
          <Text style={styles.cardMeta}>Worker: {selectedRequest.workerId}</Text>
          <Text style={styles.cardMeta}>Grievance: {selectedRequest.grievanceId}</Text>
          <Text style={styles.cardMeta}>Reason: {selectedRequest.reason}</Text>
          {grievanceDetail && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>{grievanceDetail.title}</Text>
              <Text style={styles.cardMeta}>Category: {grievanceDetail.category}</Text>
              <Text style={styles.cardMeta}>Priority: {grievanceDetail.priority}</Text>
              <Text style={styles.cardMeta}>Status: {grievanceDetail.status}</Text>
              <Text style={styles.cardMeta}>Description: {grievanceDetail.description}</Text>
              {grievanceDetail.imageBase64 ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${grievanceDetail.imageBase64}` }}
                  style={styles.preview}
                />
              ) : null}
            </View>
          )}
          <View style={styles.actionRow}>
            <Button title="Approve" onPress={() => approveRequest(selectedRequest)} />
            <Button title="Deny" onPress={() => denyRequest(selectedRequest)} />
          </View>
        </View>
      )}

      {selectedGrievance && !selectedSignup && !selectedRequest && (
        <View style={styles.detailCard}>
          <View style={styles.detailHeaderRow}>
            <Text style={styles.sectionTitle}>Grievance Details</Text>
            <Button title="Back" onPress={() => setSelectedGrievance(null)} />
          </View>
          {grievanceDetail && (
            <>
              <Text style={styles.cardTitle}>{grievanceDetail.title}</Text>
              <Text style={styles.cardMeta}>Category: {grievanceDetail.category}</Text>
              <Text style={styles.cardMeta}>Priority: {grievanceDetail.priority}</Text>
              <Text style={styles.cardMeta}>Status: {grievanceDetail.status}</Text>
              <Text style={styles.cardMeta}>Description: {grievanceDetail.description}</Text>
              {grievanceDetail.imageBase64 ? (
                <Image
                  source={{ uri: `data:image/jpeg;base64,${grievanceDetail.imageBase64}` }}
                  style={styles.preview}
                />
              ) : null}
            </>
          )}
          <Text style={styles.sectionTitle}>Available Workers</Text>
          {registeredWorkers.length === 0 ? (
            <Text style={styles.emptyText}>No registered workers.</Text>
          ) : (
            registeredWorkers.map((worker) => (
              <View key={worker.id} style={styles.card}>
                <Text style={styles.cardTitle}>{worker.name}</Text>
                <Text style={styles.cardMeta}>Department: {worker.department || 'N/A'}</Text>
                <Text style={styles.cardMeta}>Email: {worker.email}</Text>
                <Button
                  title="Assign"
                  onPress={() => assignGrievance(selectedGrievance.id, worker.id, 'Assigned by admin')}
                />
              </View>
            ))
          )}
        </View>
      )}

      {!selectedSignup && !selectedRequest && !selectedGrievance && (
        <View style={styles.tabRow}>
          <Button title="Requests" onPress={() => setActiveTab('requests')} />
          <Button title="Signups" onPress={() => setActiveTab('signups')} />
          <Button title="Assign" onPress={() => setActiveTab('assign')} />
          <Button title="Workers" onPress={() => setActiveTab('workers')} />
        </View>
      )}

      {!selectedSignup && !selectedRequest && !selectedGrievance && activeTab === 'requests' && (
        <>
          <Text style={styles.sectionTitle}>Pending Worker Requests</Text>
          {pendingRequests.length === 0 ? (
            <Text style={styles.emptyText}>No pending requests.</Text>
          ) : (
            <FlatList
              data={pendingRequests}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => setSelectedRequest(item)}>
                  <Text style={styles.cardTitle}>Grievance: {item.grievanceId}</Text>
                  <Text style={styles.cardMeta}>Worker: {item.workerId}</Text>
                  <Text style={styles.cardMeta}>Reason: {item.reason}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}

      {!selectedSignup && !selectedRequest && !selectedGrievance && activeTab === 'signups' && (
        <>
          <Text style={styles.sectionTitle}>Worker Signup Requests</Text>
          {pendingWorkerSignups.length === 0 ? (
            <Text style={styles.emptyText}>No pending signups.</Text>
          ) : (
            <FlatList
              data={pendingWorkerSignups}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => setSelectedSignup(item)}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardMeta}>Dept: {item.department}</Text>
                  <Text style={styles.cardMeta}>City: {item.city}</Text>
                </TouchableOpacity>
              )}
            />
          )}
        </>
      )}

      {!selectedSignup && !selectedRequest && !selectedGrievance && activeTab === 'assign' && (
        <>
          <Text style={styles.sectionTitle}>Unassigned Grievances</Text>
          {unassignedGrievances.length === 0 ? (
            <Text style={styles.emptyText}>No unassigned grievances.</Text>
          ) : (
            <FlatList
              data={unassignedGrievances}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.card} onPress={() => setSelectedGrievance(item)}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>ID: {item.id}</Text>
                </TouchableOpacity>
              )}
            />
          )}

          <Text style={styles.sectionTitle}>Manual Assignment</Text>
          <TextInput
            style={styles.input}
            placeholder="Grievance ID"
            value={assignGrievanceId}
            onChangeText={setAssignGrievanceId}
          />
          <TextInput
            style={styles.input}
            placeholder="Worker UID"
            value={assignWorkerId}
            onChangeText={setAssignWorkerId}
          />
          <Button
            title={assigning ? 'Assigning...' : 'Assign Grievance'}
            onPress={handleManualAssign}
            disabled={assigning}
          />
        </>
      )}

      {!selectedSignup && !selectedRequest && !selectedGrievance && activeTab === 'workers' && (
        <>
          <Text style={styles.sectionTitle}>Registered Workers</Text>
          {registeredWorkers.length === 0 ? (
            <Text style={styles.emptyText}>No registered workers.</Text>
          ) : (
            Object.entries(
              registeredWorkers.reduce((acc, worker) => {
                const dept = worker.department || 'Unassigned';
                if (!acc[dept]) acc[dept] = [];
                acc[dept].push(worker);
                return acc;
              }, {})
            ).map(([dept, workers]) => (
              <View key={dept} style={styles.groupBlock}>
                <Text style={styles.groupTitle}>
                  {dept} ({workers.length})
                </Text>
                {workers.map((item) => (
                  <View key={item.id} style={styles.card}>
                    <Text style={styles.cardTitle}>{item.name}</Text>
                    <Text style={styles.cardMeta}>Department: {item.department || 'N/A'}</Text>
                    <Text style={styles.cardMeta}>Email: {item.email}</Text>
                  </View>
                ))}
              </View>
            ))
          )}
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2a44',
  },
  sectionTitle: {
    marginTop: 12,
    marginBottom: 8,
    fontWeight: '700',
    color: '#1f2a44',
  },
  list: {
    paddingBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e1e6f2',
  },
  cardTitle: {
    fontWeight: '700',
    color: '#1f2a44',
    marginBottom: 4,
  },
  cardMeta: {
    color: '#5c6b8a',
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  detailCard: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e1e6f2',
    marginBottom: 12,
  },
  detailHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 8,
  },
  groupBlock: {
    marginBottom: 8,
  },
  groupTitle: {
    fontWeight: '700',
    color: '#1f2a44',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d8deeb',
    marginBottom: 12,
  },
  emptyText: {
    color: '#7b879f',
  },
});

export default AdminHomeScreen;
