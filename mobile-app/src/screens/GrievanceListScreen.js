import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import GrievanceDetailScreen from './GrievanceDetailScreen';

const GrievanceListScreen = ({ currentUser, navigation, onSelect }) => {
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievanceId, setSelectedGrievanceId] = useState(null);

  useEffect(() => {
    if (!currentUser?.uid) {
      setGrievances([]);
      return undefined;
    }

    const grievancesQuery = query(
      collection(db, 'grievances'),
      where('userId', '==', currentUser.uid),
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

  const handleSelect = (item) => {
    setSelectedGrievanceId(item.id);
  };

  if (selectedGrievanceId) {
    return (
      <GrievanceDetailScreen
        grievanceId={selectedGrievanceId}
        onBack={() => setSelectedGrievanceId(null)}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>My Grievances</Text>
      {grievances.length === 0 ? (
        <Text style={styles.emptyText}>No grievances yet.</Text>
      ) : (
        <FlatList
          data={grievances}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => handleSelect(item)}>
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

export default GrievanceListScreen;
