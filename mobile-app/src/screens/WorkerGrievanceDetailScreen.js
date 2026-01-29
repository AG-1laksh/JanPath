import React, { useState } from 'react';
import { Alert, Button, Image, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { addDoc, collection, doc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

const WorkerGrievanceDetailScreen = ({ grievance, currentUser, onBack, mode }) => {
  const [status, setStatus] = useState(grievance?.status || '');
  const [loading, setLoading] = useState(false);
  const [requesting, setRequesting] = useState(false);
  const [progressText, setProgressText] = useState('');
  
  const updateStatus = async (nextStatus, remarks) => {
    if (!grievance?.id || !currentUser?.uid) return;

    try {
      setLoading(true);
      await updateDoc(doc(db, 'grievances', grievance.id), {
        status: nextStatus,
      });

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

  const canStart = status === 'Assigned' || status === 'Accepted';
  const canComplete = status === 'In Progress';
  const canRequest = mode === 'available' && !grievance?.assignedWorkerId;

  const requestAccess = async () => {
    if (!grievance?.id || !currentUser?.uid) return;

    try {
      setRequesting(true);
      await addDoc(collection(db, 'workerRequests'), {
        grievanceId: grievance.id,
        workerId: currentUser.uid,
        status: 'Pending',
        requestedAt: serverTimestamp(),
      });
      Alert.alert('Requested', 'Access request sent to admin.');
    } catch (error) {
      Alert.alert('Request failed', error?.message || 'Please try again.');
    } finally {
      setRequesting(false);
    }
  };

  const addProgressUpdate = async () => {
    if (!grievance?.id || !currentUser?.uid || !progressText.trim()) return;

    try {
      setLoading(true);
      if (!status || status === 'Assigned') {
        await updateDoc(doc(db, 'grievances', grievance.id), {
          status: 'In Progress',
        });
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

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Grievance Detail</Text>
          <Button title="Back" onPress={onBack} />
        </View>

        <Text style={styles.label}>Title</Text>
        <Text style={styles.value}>{grievance?.title}</Text>

        <Text style={styles.label}>Category</Text>
        <Text style={styles.value}>{grievance?.category}</Text>

        <Text style={styles.label}>Description</Text>
        <Text style={styles.value}>{grievance?.description}</Text>

        {grievance?.imageBase64 ? (
          <Image
            source={{ uri: `data:image/jpeg;base64,${grievance.imageBase64}` }}
            style={styles.preview}
          />
        ) : null}

        <Text style={styles.label}>Current Status</Text>
        <Text style={styles.value}>{status}</Text>

        <View style={styles.buttonGroup}>
          {mode === 'available' ? (
            <Button
              title={requesting ? 'Please wait...' : 'Request Access'}
              onPress={requestAccess}
              disabled={requesting || !canRequest}
            />
          ) : (
            <>
              <Text style={styles.label}>Progress Update</Text>
              <TextInput
                style={styles.input}
                placeholder="Write a short update"
                value={progressText}
                onChangeText={setProgressText}
              />
              <Button
                title={loading ? 'Please wait...' : 'Add Update'}
                onPress={addProgressUpdate}
                disabled={loading || !progressText.trim()}
              />
              <Button
                title={loading ? 'Please wait...' : 'Start Work'}
                onPress={() => updateStatus('In Progress', 'Work started')}
                disabled={loading || !canStart}
              />
              <Button
                title={loading ? 'Please wait...' : 'Mark Completed'}
                onPress={() => updateStatus('Completed', 'Work completed')}
                disabled={loading || !canComplete}
              />
            </>
          )}
        </View>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1f2a44',
  },
  label: {
    marginTop: 12,
    color: '#5c6b8a',
    fontSize: 12,
  },
  value: {
    color: '#1f2a44',
    fontSize: 14,
    marginTop: 4,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d8deeb',
    marginTop: 8,
    marginBottom: 8,
  },
  buttonGroup: {
    marginTop: 20,
    gap: 10,
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginTop: 12,
  },
});

export default WorkerGrievanceDetailScreen;
