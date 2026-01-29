import React, { useEffect, useState } from 'react';
import { Button, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const GrievanceDetailScreen = ({ grievanceId, onBack, grievance }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!grievanceId) {
      setLogs([]);
      return undefined;
    }

    const logsQuery = query(
      collection(db, 'statusLogs'),
      where('grievanceId', '==', grievanceId),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(logsQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setLogs(items);
    });

    return unsubscribe;
  }, [grievanceId]);

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleString();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Status Timeline</Text>
          <Button title="Back" onPress={onBack} />
        </View>

        {grievance?.imageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${grievance.imageBase64}` }}
            style={styles.preview}
          />
        ) : null}

        {logs.length === 0 ? (
          <Text style={styles.emptyText}>No updates yet.</Text>
        ) : (
          logs.map((log, index) => (
            <View key={log.id} style={styles.timelineItem}>
              <View style={styles.timelineLeft}>
                <View style={styles.dot} />
                {index !== logs.length - 1 && <View style={styles.line} />}
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.statusText}>{log.status}</Text>
                <Text style={styles.metaText}>{formatDate(log.timestamp)}</Text>
                <Text style={styles.remarksText}>{log.remarks}</Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  title: {
    fontSize: 20,
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
  emptyText: {
    color: '#7b879f',
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineLeft: {
    alignItems: 'center',
    width: 20,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3b6ef5',
    marginTop: 4,
  },
  line: {
    width: 2,
    flex: 1,
    backgroundColor: '#c7d2f2',
    marginTop: 4,
  },
  timelineContent: {
    flex: 1,
    paddingLeft: 12,
    paddingBottom: 4,
  },
  statusText: {
    fontWeight: '700',
    color: '#1f2a44',
  },
  metaText: {
    color: '#5c6b8a',
    fontSize: 12,
    marginTop: 2,
  },
  remarksText: {
    color: '#1f2a44',
    marginTop: 4,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 12,
  },
});

export default GrievanceDetailScreen;
