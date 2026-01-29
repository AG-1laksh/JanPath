import React, { useEffect, useState } from 'react';
import { Button, FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import WorkerGrievanceDetailScreen from './WorkerGrievanceDetailScreen';

const WorkerHomeScreen = ({ currentUser }) => {
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setGrievances([]);
      return undefined;
    }

    const grievancesQuery = query(
      collection(db, 'grievances'),
      where('assignedWorkerId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(grievancesQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setGrievances(items);
    });

    return unsubscribe;
  }, [currentUser]);

  if (selectedGrievance) {
    return (
      <WorkerGrievanceDetailScreen
        grievance={selectedGrievance}
        currentUser={currentUser}
        onBack={() => setSelectedGrievance(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Assigned Grievances</Text>
        <Button title="Sign out" onPress={() => signOut(auth)} />
      </View>
      {grievances.length === 0 ? (
        <Text style={styles.emptyText}>No assigned grievances.</Text>
      ) : (
        <FlatList
          data={grievances}
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
