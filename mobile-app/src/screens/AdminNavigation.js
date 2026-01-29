import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot } from 'firebase/firestore';
import { auth, db } from '../firebase';

import RequestsTab from './admin/RequestsTab';
import SignupsTab from './admin/SignupsTab';
import AssignTab from './admin/AssignTab';
import WorkersTab from './admin/WorkersTab';
import DashboardTab from './admin/DashboardTab';
import ProfileScreen from './ProfileScreen';

const AdminNavigation = ({ currentUser }) => {
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [activeTab, setActiveTab] = useState('Home');
  const [counts, setCounts] = useState({
    requests: 0,
    signups: 0,
    unassigned: 0,
    workers: 0,
  });

  useEffect(() => {
    const fetchProfile = async () => {
      const docSnap = await getDoc(doc(db, 'users', currentUser.uid));
      if (docSnap.exists()) {
        setProfile({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchProfile();
  }, [currentUser]);

  useEffect(() => {
    const requestsQuery = query(
      collection(db, 'workerRequests'),
      where('status', '==', 'Pending')
    );
    const signupsQuery = query(
      collection(db, 'workerSignupRequests'),
      where('status', '==', 'Pending')
    );
    const unassignedQuery = query(
      collection(db, 'grievances'),
      where('assignedWorkerId', '==', null)
    );
    const workersQuery = query(
      collection(db, 'users'),
      where('role', '==', 'WORKER')
    );

    const unsubs = [
      onSnapshot(requestsQuery, (snap) => setCounts(c => ({ ...c, requests: snap.size }))),
      onSnapshot(signupsQuery, (snap) => setCounts(c => ({ ...c, signups: snap.size }))),
      onSnapshot(unassignedQuery, (snap) => setCounts(c => ({ ...c, unassigned: snap.size }))),
      onSnapshot(workersQuery, (snap) => setCounts(c => ({ ...c, workers: snap.size }))),
    ];

    return () => unsubs.forEach(unsub => unsub());
  }, []);

  const tabs = [
    { key: 'Home', icon: 'grid', iconOutline: 'grid-outline' },
    { key: 'Requests', icon: 'git-pull-request', iconOutline: 'git-pull-request-outline' },
    { key: 'Signups', icon: 'person-add', iconOutline: 'person-add-outline' },
    { key: 'Assign', icon: 'clipboard', iconOutline: 'clipboard-outline' },
    { key: 'Workers', icon: 'people', iconOutline: 'people-outline' },
  ];

  const renderContent = () => {
    if (showProfile) {
      return <ProfileScreen currentUser={currentUser} />;
    }
    
    switch (activeTab) {
      case 'Home':
        return <DashboardTab currentUser={currentUser} />;
      case 'Requests':
        return <RequestsTab currentUser={currentUser} />;
      case 'Signups':
        return <SignupsTab currentUser={currentUser} />;
      case 'Assign':
        return <AssignTab currentUser={currentUser} />;
      case 'Workers':
        return <WorkersTab />;
      default:
        return <DashboardTab currentUser={currentUser} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuBtn}>
          <Ionicons name="menu" size={26} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {showProfile ? 'My Profile' : 'Admin Dashboard'}
        </Text>
        {showProfile ? (
          <TouchableOpacity onPress={() => setShowProfile(false)} style={styles.profileBtn}>
            <Ionicons name="close" size={24} color="#64748b" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowProfile(true)} style={styles.profileBtn}>
            <Ionicons name="person-circle" size={28} color="#3b82f6" />
          </TouchableOpacity>
        )}
      </View>

      {/* Content Area */}
      <View style={styles.content}>
        {renderContent()}
      </View>

      {/* Custom Bottom Tab Bar */}
      {!showProfile && (
        <View style={styles.tabBar}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tabItem}
                onPress={() => setActiveTab(tab.key)}
              >
                <Ionicons
                  name={isActive ? tab.icon : tab.iconOutline}
                  size={24}
                  color={isActive ? '#3b82f6' : '#94a3b8'}
                />
                <Text style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
                  {tab.key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* Menu Modal */}
      <Modal visible={showMenu} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.menuContainer}>
            <View style={styles.menuHeader}>
              <View style={styles.menuLogo}>
                <Ionicons name="shield-checkmark" size={28} color="#fff" />
              </View>
              <View style={styles.menuHeaderText}>
                <Text style={styles.menuTitle}>JanPath Admin</Text>
                <Text style={styles.menuSubtitle}>{profile?.email || currentUser?.email}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowMenu(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuItems}>
              <TouchableOpacity 
                style={styles.menuItem} 
                onPress={() => { setShowMenu(false); setShowProfile(true); }}
              >
                <Ionicons name="person-circle-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>View Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="notifications-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>Notifications</Text>
                {(counts.requests + counts.signups) > 0 && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{counts.requests + counts.signups}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="settings-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <Ionicons name="help-circle-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>Help & Support</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut(auth)}>
                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                <Text style={styles.signOutText}>Sign Out</Text>
              </TouchableOpacity>
            </ScrollView>

            <Text style={styles.versionText}>Version 1.0.0</Text>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  menuBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1e293b',
  },
  profileBtn: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    paddingBottom: 20,
    paddingTop: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: '#94a3b8',
    marginTop: 4,
  },
  tabLabelActive: {
    color: '#3b82f6',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    width: '80%',
    maxWidth: 320,
    height: '100%',
    backgroundColor: '#fff',
  },
  menuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#3b82f6',
    gap: 12,
  },
  menuLogo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuHeaderText: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  menuSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
  },
  closeBtn: {
    padding: 4,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 20,
  },
  menuItems: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 4,
    gap: 14,
  },
  menuItemText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  menuBadge: {
    backgroundColor: '#ef4444',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  menuBadgeText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '700',
  },
  menuDivider: {
    height: 1,
    backgroundColor: '#e2e8f0',
    marginVertical: 12,
  },
  signOutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 12,
    backgroundColor: '#fef2f2',
    borderRadius: 12,
    gap: 14,
  },
  signOutText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ef4444',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94a3b8',
    paddingBottom: 20,
  },
});

export default AdminNavigation;
