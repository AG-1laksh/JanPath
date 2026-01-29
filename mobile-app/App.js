import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Button,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from './src/firebase';
import WorkerHomeScreen from './src/screens/WorkerHomeScreen';

const PRIORITIES = ['Low', 'Medium', 'High'];

function AuthScreen() {
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }

    if (mode === 'signup' && !name) {
      Alert.alert('Missing fields', 'Name is required for sign up.');
      return;
    }

    try {
      setLoading(true);
      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, 'users', userCred.user.uid), {
          name,
          email,
          role: 'USER',
          department: null,
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      Alert.alert('Auth failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>User Login</Text>
        {mode === 'signup' && (
          <TextInput
            style={styles.input}
            placeholder="Full name"
            value={name}
            onChangeText={setName}
          />
        )}
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Button
          title={loading ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
          onPress={handleAuth}
          disabled={loading}
        />
        <TouchableOpacity
          style={styles.linkButton}
          onPress={() => setMode(mode === 'signup' ? 'signin' : 'signup')}
        >
          <Text style={styles.linkText}>
            {mode === 'signup' ? 'Already have an account? Sign in' : 'No account? Sign up'}
          </Text>
        </TouchableOpacity>
      </View>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'Medium',
  });
  const [imageBase64, setImageBase64] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [grievances, setGrievances] = useState([]);
  const [selectedGrievance, setSelectedGrievance] = useState(null);
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (!currentUser) {
        setUserRole(null);
        setInitializing(false);
        return;
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userDocRef);
      if (!userSnap.exists()) {
        await setDoc(userDocRef, {
          name: currentUser.email ? currentUser.email.split('@')[0] : 'User',
          email: currentUser.email || '',
          role: 'USER',
          department: null,
          createdAt: serverTimestamp(),
        });
        setUserRole('USER');
      } else {
        setUserRole(userSnap.data()?.role || 'USER');
      }

      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!user) {
      setGrievances([]);
      return undefined;
    }

    const grievancesQuery = query(
      collection(db, 'grievances'),
      where('userId', '==', user.uid),
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
  }, [user]);

  useEffect(() => {
    if (!selectedGrievance) {
      setTimeline([]);
      return undefined;
    }

    const timelineQuery = query(
      collection(db, 'statusLogs'),
      where('grievanceId', '==', selectedGrievance.id),
      orderBy('timestamp', 'asc')
    );

    const unsubscribe = onSnapshot(timelineQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setTimeline(items);
    });

    return unsubscribe;
  }, [selectedGrievance]);

  const canSubmit = useMemo(() => {
    return form.title && form.description && form.category && form.priority;
  }, [form]);

  const pickImage = async () => {
    try {
      const existing = await ImagePicker.getMediaLibraryPermissionsAsync();
      let permission = existing;
      if (!permission.granted) {
        permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
      }

      if (!permission.granted) {
        Alert.alert('Permission needed', 'Please allow access to photos to attach an image.', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings() },
        ]);
        return;
      }

      const mediaTypes = ImagePicker.MediaType?.Images
        ? [ImagePicker.MediaType.Images]
        : undefined;

      const result = await ImagePicker.launchImageLibraryAsync({
        ...(mediaTypes ? { mediaTypes } : {}),
        base64: true,
        quality: 0.6,
      });

      if (!result.canceled && result.assets?.length) {
        setImageBase64(result.assets[0].base64 || '');
      }
    } catch (error) {
      Alert.alert('Image picker failed', error?.message || 'Please try again.');
    }
  };

  const submitGrievance = async () => {
    if (!user) return;
    if (!canSubmit) {
      Alert.alert('Missing fields', 'Please fill in all required fields.');
      return;
    }

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
        userId: user.uid,
        assignedWorkerId: null,
        createdAt: serverTimestamp(),
      });

      batch.set(statusRef, {
        grievanceId: grievanceRef.id,
        status: 'Submitted',
        updatedBy: user.uid,
        remarks: 'Complaint registered',
        timestamp: serverTimestamp(),
      });

      await batch.commit();

      setForm({ title: '', description: '', category: '', priority: 'Medium' });
      setImageBase64('');
      Alert.alert('Submitted', 'Your grievance has been submitted.');
    } catch (error) {
      Alert.alert('Submit failed', error.message || 'Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const signOutUser = async () => {
    await signOut(auth);
  };

  const formatDate = (timestamp) => {
    if (!timestamp?.toDate) return '';
    return timestamp.toDate().toLocaleString();
  };

  if (initializing) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <Text style={styles.title}>Loading...</Text>
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  if (!user) {
    return (
      <SafeAreaProvider>
        <AuthScreen />
      </SafeAreaProvider>
    );
  }

  if (userRole === 'WORKER') {
    return (
      <SafeAreaProvider>
        <WorkerHomeScreen currentUser={user} />
      </SafeAreaProvider>
    );
  }

  if (selectedGrievance) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.scrollContainer}>
            <View style={styles.rowBetween}>
              <Text style={styles.title}>Status Timeline</Text>
              <Button title="Back" onPress={() => setSelectedGrievance(null)} />
            </View>
            <Text style={styles.subTitle}>{selectedGrievance.title}</Text>
            <Text style={styles.metaText}>Status: {selectedGrievance.status}</Text>
            <Text style={styles.metaText}>Created: {formatDate(selectedGrievance.createdAt)}</Text>
            {selectedGrievance.imageBase64 ? (
              <Image
                source={{ uri: `data:image/jpeg;base64,${selectedGrievance.imageBase64}` }}
                style={styles.preview}
              />
            ) : null}

            {timeline.length === 0 && <Text style={styles.emptyText}>No updates yet.</Text>}

            {timeline.map((log) => (
              <View key={log.id} style={styles.timelineItem}>
                <Text style={styles.timelineStatus}>{log.status}</Text>
                <Text style={styles.metaText}>{log.remarks}</Text>
                <Text style={styles.metaText}>{formatDate(log.timestamp)}</Text>
              </View>
            ))}
          </ScrollView>
          <StatusBar style="auto" />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.rowBetween}>
            <Text style={styles.title}>Create Grievance</Text>
            <Button title="Sign out" onPress={signOutUser} />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Title"
            value={form.title}
            onChangeText={(value) => setForm((prev) => ({ ...prev, title: value }))}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Description"
            multiline
            value={form.description}
            onChangeText={(value) => setForm((prev) => ({ ...prev, description: value }))}
          />
          <TextInput
            style={styles.input}
            placeholder="Category"
            value={form.category}
            onChangeText={(value) => setForm((prev) => ({ ...prev, category: value }))}
          />

          <Text style={styles.label}>Priority</Text>
          <View style={styles.rowWrap}>
            {PRIORITIES.map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.pill, form.priority === level && styles.pillActive]}
                onPress={() => setForm((prev) => ({ ...prev, priority: level }))}
              >
                <Text style={form.priority === level ? styles.pillTextActive : styles.pillText}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity style={styles.primaryButton} onPress={pickImage}>
            <Text style={styles.primaryButtonText}>Pick image</Text>
          </TouchableOpacity>
          {imageBase64 ? (
            <Image
              source={{ uri: `data:image/jpeg;base64,${imageBase64}` }}
              style={styles.preview}
            />
          ) : null}

          <Button
            title={submitting ? 'Submitting...' : 'Submit grievance'}
            onPress={submitGrievance}
            disabled={submitting || !canSubmit}
          />

          <Text style={[styles.title, styles.listTitle]}>My Grievances</Text>
          {grievances.length === 0 && <Text style={styles.emptyText}>No grievances yet.</Text>}

          {grievances.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.listItem}
              onPress={() => setSelectedGrievance(item)}
            >
              <Text style={styles.listTitleText}>{item.title}</Text>
              <Text style={styles.metaText}>Status: {item.status}</Text>
              <Text style={styles.metaText}>Created: {formatDate(item.createdAt)}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <StatusBar style="auto" />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6f7fb',
  },
  scrollContainer: {
    padding: 16,
    paddingBottom: 40,
  },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
    gap: 12,
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1f2a44',
    marginBottom: 8,
  },
  subTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2a44',
    marginBottom: 8,
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    fontWeight: '600',
    color: '#1f2a44',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 12,
    borderWidth: 1,
    borderColor: '#d8deeb',
    marginBottom: 12,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  rowWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  pill: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#c7d2f2',
  },
  pillActive: {
    backgroundColor: '#3b6ef5',
    borderColor: '#3b6ef5',
  },
  pillText: {
    color: '#3b6ef5',
    fontWeight: '600',
  },
  pillTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  preview: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginVertical: 12,
  },
  listTitle: {
    marginTop: 20,
  },
  listItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e1e6f2',
  },
  listTitleText: {
    fontWeight: '700',
    color: '#1f2a44',
    marginBottom: 4,
  },
  metaText: {
    color: '#5c6b8a',
    fontSize: 12,
  },
  emptyText: {
    color: '#7b879f',
    marginTop: 8,
  },
  linkButton: {
    paddingTop: 8,
  },
  linkText: {
    color: '#3b6ef5',
    fontWeight: '600',
    textAlign: 'center',
  },
  timelineItem: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#e1e6f2',
  },
  timelineStatus: {
    fontWeight: '700',
    color: '#1f2a44',
  },
  primaryButton: {
    backgroundColor: '#3b6ef5',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
