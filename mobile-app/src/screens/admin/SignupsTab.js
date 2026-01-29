import React, { useEffect, useState } from 'react';
import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../../firebase';

const SignupsTab = ({ currentUser }) => {
  const [pendingSignups, setPendingSignups] = useState([]);
  const [selectedSignup, setSelectedSignup] = useState(null);

  useEffect(() => {
    const signupQuery = query(
      collection(db, 'workerSignupRequests'),
      where('status', '==', 'Pending'),
      orderBy('requestedAt', 'desc')
    );

    const unsubscribe = onSnapshot(signupQuery, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...docSnap.data(),
      }));
      setPendingSignups(items);
    });

    return unsubscribe;
  }, []);

  const approveSignup = async (signup) => {
    try {
      await updateDoc(doc(db, 'users', signup.workerId), {
        role: 'WORKER',
      });
      await updateDoc(doc(db, 'workerSignupRequests', signup.id), {
        status: 'Approved',
      });
      setSelectedSignup(null);
      Alert.alert('Success', 'Worker signup approved successfully.');
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to approve signup.');
    }
  };

  const rejectSignup = async (signup) => {
    try {
      await updateDoc(doc(db, 'workerSignupRequests', signup.id), {
        status: 'Rejected',
      });
      setSelectedSignup(null);
      Alert.alert('Rejected', 'Signup request has been rejected.');
    } catch (error) {
      Alert.alert('Error', error?.message || 'Failed to reject signup.');
    }
  };

  if (selectedSignup) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity style={styles.backButton} onPress={() => setSelectedSignup(null)}>
          <Ionicons name="arrow-back" size={24} color="#3b82f6" />
          <Text style={styles.backButtonText}>Back to Signups</Text>
        </TouchableOpacity>

        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={32} color="#fff" />
            </View>
          </View>
          <Text style={styles.profileName}>{selectedSignup.name}</Text>
          <Text style={styles.profileEmail}>{selectedSignup.email}</Text>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Ionicons name="calendar-outline" size={18} color="#64748b" />
              <View>
                <Text style={styles.infoLabel}>Date of Birth</Text>
                <Text style={styles.infoValue}>{selectedSignup.dob}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="call-outline" size={18} color="#64748b" />
              <View>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{selectedSignup.phone}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="card-outline" size={18} color="#64748b" />
              <View>
                <Text style={styles.infoLabel}>Aadhar</Text>
                <Text style={styles.infoValue}>{selectedSignup.aadhar}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <Ionicons name="location-outline" size={18} color="#64748b" />
              <View>
                <Text style={styles.infoLabel}>City</Text>
                <Text style={styles.infoValue}>{selectedSignup.city}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.detailCard}>
          <Text style={styles.sectionTitle}>Professional Information</Text>
          
          <View style={styles.infoItem}>
            <Ionicons name="business-outline" size={18} color="#64748b" />
            <View>
              <Text style={styles.infoLabel}>Department</Text>
              <Text style={styles.infoValue}>{selectedSignup.department}</Text>
            </View>
          </View>

          <View style={styles.infoItem}>
            <Ionicons name="time-outline" size={18} color="#64748b" />
            <View>
              <Text style={styles.infoLabel}>Experience</Text>
              <Text style={styles.infoValue}>
                {selectedSignup.experienceYears || '0'} years, {selectedSignup.experienceMonths || '0'} months
              </Text>
            </View>
          </View>

          <Text style={[styles.infoLabel, { marginTop: 16, marginBottom: 8 }]}>Skills</Text>
          <View style={styles.skillsContainer}>
            {(selectedSignup.skills || []).map((skill, index) => (
              <View key={index} style={styles.skillChip}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, styles.approveButton]}
            onPress={() => approveSignup(selectedSignup)}
          >
            <Ionicons name="checkmark-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Approve</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.rejectButton]}
            onPress={() => rejectSignup(selectedSignup)}
          >
            <Ionicons name="close-circle" size={20} color="#fff" />
            <Text style={styles.actionButtonText}>Reject</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Worker Signups</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{pendingSignups.length}</Text>
        </View>
      </View>

      {pendingSignups.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="people-outline" size={64} color="#cbd5e1" />
          <Text style={styles.emptyText}>No pending signups</Text>
          <Text style={styles.emptySubtext}>New worker signups will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={pendingSignups}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.signupCard} onPress={() => setSelectedSignup(item)}>
              <View style={styles.cardAvatar}>
                <Ionicons name="person" size={24} color="#3b82f6" />
              </View>
              <View style={styles.cardContent}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardMeta}>{item.department} • {item.city}</Text>
                <View style={styles.experienceTag}>
                  <Text style={styles.experienceText}>
                    {item.experienceYears || '0'}y {item.experienceMonths || '0'}m exp
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
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
  signupCard: {
    flexDirection: 'row',
    alignItems: 'center',
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
  cardAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardContent: {
    flex: 1,
  },
  cardName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: 2,
  },
  cardMeta: {
    fontSize: 13,
    color: '#64748b',
    marginBottom: 6,
  },
  experienceTag: {
    backgroundColor: '#f0fdf4',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  experienceText: {
    fontSize: 11,
    color: '#22c55e',
    fontWeight: '600',
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
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  avatarContainer: {
    marginBottom: 12,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#3b82f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#64748b',
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748b',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoGrid: {
    gap: 16,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#94a3b8',
    marginBottom: 2,
  },
  infoValue: {
    fontSize: 15,
    color: '#1e293b',
    fontWeight: '500',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillChip: {
    backgroundColor: '#eff6ff',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
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
  rejectButton: {
    backgroundColor: '#ef4444',
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SignupsTab;
