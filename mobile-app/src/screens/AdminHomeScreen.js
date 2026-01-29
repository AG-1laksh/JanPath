import React, { useEffect, useState } from 'react';
import { Alert, Button, FlatList, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  addDoc,
  collection,
  doc,
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

      <View style={styles.tabRow}>
        <Button title="Requests" onPress={() => setActiveTab('requests')} />
        <Button title="Signups" onPress={() => setActiveTab('signups')} />
        <Button title="Assign" onPress={() => setActiveTab('assign')} />
        <Button title="Workers" onPress={() => setActiveTab('workers')} />
      </View>

      {activeTab === 'requests' && (
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
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>Grievance: {item.grievanceId}</Text>
                  <Text style={styles.cardMeta}>Worker: {item.workerId}</Text>
                  <View style={styles.actionRow}>
                    <Button title="Approve" onPress={() => approveRequest(item)} />
                    <Button title="Deny" onPress={() => denyRequest(item)} />
                  </View>
                </View>
              )}
            />
          )}
        </>
      )}

      {activeTab === 'signups' && (
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
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardMeta}>Dept: {item.department}</Text>
                  <Text style={styles.cardMeta}>City: {item.city}</Text>
                  <View style={styles.actionRow}>
                    <Button title="Approve" onPress={() => approveWorkerSignup(item)} />
                    <Button title="Reject" onPress={() => denyWorkerSignup(item)} />
                  </View>
                </View>
              )}
            />
          )}
        </>
      )}

      {activeTab === 'assign' && (
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
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardMeta}>ID: {item.id}</Text>
                </View>
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

      {activeTab === 'workers' && (
        <>
          <Text style={styles.sectionTitle}>Registered Workers</Text>
          {registeredWorkers.length === 0 ? (
            <Text style={styles.emptyText}>No registered workers.</Text>
          ) : (
            <FlatList
              data={registeredWorkers}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <Text style={styles.cardTitle}>{item.name}</Text>
                  <Text style={styles.cardMeta}>Department: {item.department || 'N/A'}</Text>
                  <Text style={styles.cardMeta}>Email: {item.email}</Text>
                </View>
              )}
            />
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
