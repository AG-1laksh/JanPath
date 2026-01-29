import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import {
  addDoc,
  collection,
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import { auth, db } from './src/firebase';
import WorkerNavigation from './src/screens/WorkerNavigation';
import AdminNavigation from './src/screens/AdminNavigation';
import UserNavigation from './src/screens/UserNavigation';

const WORKER_SKILLS = [
  'Road Repair',
  'Plumbing',
  'Electrical Work',
  'Construction',
  'Drainage Systems',
  'Water Treatment',
  'Sewage Management',
  'Equipment Maintenance',
  'Emergency Response',
  'Safety Protocols',
  'Quality Control',
  'Project Management',
];

function AuthScreen() {
  const [mode, setMode] = useState('signin');
  const [selectedRole, setSelectedRole] = useState('USER');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');
  const [aadhar, setAadhar] = useState('');
  const [city, setCity] = useState('');
  const [department, setDepartment] = useState('');
  const [experienceYears, setExperienceYears] = useState('');
  const [experienceMonths, setExperienceMonths] = useState('');
  const [skills, setSkills] = useState([]);
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

    if (mode === 'signup' && selectedRole === 'WORKER') {
      if (!dob || !phone || !aadhar || !city || !department || skills.length === 0) {
        Alert.alert('Missing fields', 'Please fill all worker details.');
        return;
      }
    }

    try {
      setLoading(true);
      if (mode === 'signup') {
        const userCred = await createUserWithEmailAndPassword(auth, email, password);
        const roleToSave = selectedRole === 'WORKER' ? 'WORKER_PENDING' : selectedRole;
        await setDoc(doc(db, 'users', userCred.user.uid), {
          name,
          email,
          role: roleToSave,
          department: selectedRole === 'WORKER' ? department : null,
          createdAt: serverTimestamp(),
        });

        if (selectedRole === 'WORKER') {
          await addDoc(collection(db, 'workerSignupRequests'), {
            workerId: userCred.user.uid,
            name,
            email,
            dob,
            phone,
            aadhar,
            city,
            department,
            skills,
            experienceYears,
            experienceMonths,
            status: 'Pending',
            requestedAt: serverTimestamp(),
          });
          Alert.alert('Request sent', 'Admin approval is required before login.');
        }
      } else {
        const userCred = await signInWithEmailAndPassword(auth, email, password);
        const roleSnap = await getDoc(doc(db, 'users', userCred.user.uid));
        const actualRole = roleSnap.data()?.role || 'USER';
        if (actualRole === 'WORKER_PENDING') {
          await signOut(auth);
          Alert.alert('Pending approval', 'Admin approval is required for worker access.');
        } else if (actualRole !== selectedRole) {
          await signOut(auth);
          Alert.alert('Role mismatch', `Please sign in as ${actualRole}.`);
        }
      }
    } catch (error) {
      Alert.alert('Auth failed', error.message || 'Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.authContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          <Text style={styles.title}>User Login</Text>
          <View style={styles.roleRow}>
            {['USER', 'WORKER', 'ADMIN'].map((role) => (
              <TouchableOpacity
                key={role}
                style={[styles.roleButton, selectedRole === role && styles.roleButtonActive]}
                onPress={() => setSelectedRole(role)}
              >
                <Text
                  style={selectedRole === role ? styles.roleTextActive : styles.roleText}
                >
                  {role}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          {mode === 'signup' && (
            <TextInput
              style={styles.input}
              placeholder="Full name"
              value={name}
              onChangeText={setName}
            />
          )}
          {mode === 'signup' && selectedRole === 'WORKER' && (
            <>
              <TextInput
                style={styles.input}
                placeholder="Date of birth (DD/MM/YYYY)"
                value={dob}
                onChangeText={setDob}
              />
              <TextInput
                style={styles.input}
                placeholder="Phone"
                keyboardType="phone-pad"
                value={phone}
                onChangeText={setPhone}
              />
              <TextInput
                style={styles.input}
                placeholder="Aadhar"
                keyboardType="number-pad"
                value={aadhar}
                onChangeText={setAadhar}
              />
              <TextInput
                style={styles.input}
                placeholder="City"
                value={city}
                onChangeText={setCity}
              />
              <TextInput
                style={styles.input}
                placeholder="Department"
                value={department}
                onChangeText={setDepartment}
              />
              <View style={styles.skillRow}>
                {WORKER_SKILLS.map((skill) => {
                  const active = skills.includes(skill);
                  return (
                    <TouchableOpacity
                      key={skill}
                      style={[styles.skillChip, active && styles.skillChipActive]}
                      onPress={() =>
                        setSkills((prev) =>
                          prev.includes(skill)
                            ? prev.filter((item) => item !== skill)
                            : [...prev, skill]
                        )
                      }
                    >
                      <Text style={active ? styles.skillTextActive : styles.skillText}>
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <TextInput
                style={styles.input}
                placeholder="Experience years"
                keyboardType="number-pad"
                value={experienceYears}
                onChangeText={setExperienceYears}
              />
              <TextInput
                style={styles.input}
                placeholder="Experience months"
                keyboardType="number-pad"
                value={experienceMonths}
                onChangeText={setExperienceMonths}
              />
            </>
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
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [initializing, setInitializing] = useState(true);

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
        <WorkerNavigation currentUser={user} />
      </SafeAreaProvider>
    );
  }

  if (userRole === 'ADMIN') {
    return (
      <SafeAreaProvider>
        <AdminNavigation currentUser={user} />
      </SafeAreaProvider>
    );
  }

  // Regular USER role - use the new UserNavigation
  return (
    <SafeAreaProvider>
      <UserNavigation currentUser={user} />
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
  tabRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 6,
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
  roleRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  roleButton: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c7d2f2',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#3b6ef5',
    borderColor: '#3b6ef5',
  },
  roleText: {
    color: '#3b6ef5',
    fontWeight: '600',
  },
  roleTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  skillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillChip: {
    borderWidth: 1,
    borderColor: '#c7d2f2',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  skillChipActive: {
    backgroundColor: '#3b6ef5',
    borderColor: '#3b6ef5',
  },
  skillText: {
    color: '#3b6ef5',
    fontWeight: '600',
    fontSize: 12,
  },
  skillTextActive: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 12,
  },
  authContainer: {
    padding: 16,
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
  secondaryButton: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#c7d2f2',
    marginBottom: 8,
  },
  secondaryButtonText: {
    color: '#3b6ef5',
    fontWeight: '600',
  },
});
