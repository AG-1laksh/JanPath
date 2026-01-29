import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import WorkerGrievanceDetailScreen from './WorkerGrievanceDetailScreen';

const WorkerHomeScreen = ({ currentUser }) => {
  const [assignedGrievances, setAssignedGrievances] = useState([]);
  const [availableGrievances, setAvailableGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [selectedTab, setSelectedTab] = useState('assigned');

  useEffect(() => {
    if (!currentUser?.uid) {
      setAssignedGrievances([]);
      setAvailableGrievances([]);
      return undefined;
    }

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

    const unsubscribeAssigned = onSnapshot(assignedQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAssignedGrievances(items);
    });

    const unsubscribeAvailable = onSnapshot(availableQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setAvailableGrievances(items);
    });

    return () => {
      unsubscribeAssigned();
      unsubscribeAvailable();
    };
  }, [currentUser]);

  if (selectedGrievance) {
    return (
      <WorkerGrievanceDetailScreen
        grievance={selectedGrievance}
        currentUser={currentUser}
        mode={selectedTab === 'available' ? 'available' : 'assigned'}
        onBack={() => setSelectedGrievance(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Worker</Text>
        <Button title="Sign out" onPress={() => signOut(auth)} />
      </View>
      <View style={styles.tabRow}>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'assigned' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('assigned')}
        >
          <Text style={selectedTab === 'assigned' ? styles.tabTextActive : styles.tabText}>
            Assigned
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, selectedTab === 'available' && styles.tabButtonActive]}
          onPress={() => setSelectedTab('available')}
        >
          <Text style={selectedTab === 'available' ? styles.tabTextActive : styles.tabText}>
            Available
          </Text>
        </TouchableOpacity>
      </View>

      {selectedTab === 'assigned' ? (
        assignedGrievances.length === 0 ? (
          <Text style={styles.emptyText}>No assigned grievances.</Text>
        ) : (
          <FlatList
            data={assignedGrievances}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <TouchableOpacity style={styles.card} onPress={() => setSelectedGrievance(item)}>
                <Text style={styles.cardTitle}>{item.title}</Text>
                <Text style={styles.cardMeta}>Category: {item.category}</Text>
                <Text style={styles.cardMeta}>Status: {item.status}</Text>
              </TouchableOpacity>
            )}
          />
        )
      ) : availableGrievances.length === 0 ? (
        <Text style={styles.emptyText}>No available grievances.</Text>
      ) : (
        <FlatList
          data={availableGrievances}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => setSelectedGrievance(item)}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardMeta}>Category: {item.category}</Text>
              <Text style={styles.cardMeta}>Status: {item.status}</Text>
            </TouchableOpacity>
          )}
        />
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2a44',
    marginBottom: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2f2',
    alignItems: 'center',
  },
  tabButtonActive: {
    backgroundColor: '#3b6ef5',
    borderColor: '#3b6ef5',
  },
  tabText: {
    color: '#3b6ef5',
    fontWeight: '600',
  },
  tabTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  list: {
    paddingBottom: 24,
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
  emptyText: {
    color: '#7b879f',
  },
});

export default WorkerHomeScreen;
