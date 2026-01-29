import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal, ScrollView, Switch, Linking, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { signOut } from 'firebase/auth';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy, limit } from 'firebase/firestore';
import { auth, db } from '../firebase';

import RequestsTab from './admin/RequestsTab';
import SignupsTab from './admin/SignupsTab';
import AssignTab from './admin/AssignTab';
import WorkersTab from './admin/WorkersTab';
import DashboardTab from './admin/DashboardTab';
import ProfileScreen from './ProfileScreen';
import { useLanguage, LANGUAGES } from '../i18n';

// Settings Screen Component
const SettingsScreen = ({ currentUser }) => {
  const { language, changeLanguage, t } = useLanguage();
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === language);

  return (
    <ScrollView style={settingsStyles.container}>
      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>{t('settings.notifications')}</Text>
        <View style={settingsStyles.sectionContent}>
          <View style={[settingsStyles.item, settingsStyles.itemBorder]}>
            <View style={settingsStyles.itemIcon}><Ionicons name="notifications" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>{t('settings.pushNotifications')}</Text>
            <Switch value={pushNotifications} onValueChange={setPushNotifications} trackColor={{ false: '#e2e8f0', true: '#bfdbfe' }} thumbColor={pushNotifications ? '#3b82f6' : '#94a3b8'} />
          </View>
        </View>
      </View>

      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>{t('settings.language')}</Text>
        <View style={settingsStyles.sectionContent}>
          <TouchableOpacity style={settingsStyles.item} onPress={() => setShowLanguageModal(true)}>
            <View style={settingsStyles.itemIcon}><Ionicons name="language" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>{currentLang?.nativeName || 'English'}</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={settingsStyles.section}>
        <Text style={settingsStyles.sectionTitle}>{t('settings.account')}</Text>
        <View style={settingsStyles.sectionContent}>
          <TouchableOpacity style={[settingsStyles.item, settingsStyles.itemBorder]}>
            <View style={settingsStyles.itemIcon}><Ionicons name="lock-closed" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>{t('settings.changePassword')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
          <TouchableOpacity style={settingsStyles.item}>
            <View style={settingsStyles.itemIcon}><Ionicons name="shield-checkmark" size={20} color="#3b82f6" /></View>
            <Text style={settingsStyles.itemLabel}>{t('settings.privacyPolicy')}</Text>
            <Ionicons name="chevron-forward" size={20} color="#94a3b8" />
          </TouchableOpacity>
        </View>
      </View>
      <Text style={settingsStyles.version}>{t('settings.version')} 1.0.0</Text>

      <Modal visible={showLanguageModal} animationType="slide" transparent>
        <View style={settingsStyles.modalOverlay}>
          <View style={settingsStyles.modalContent}>
            <View style={settingsStyles.modalHeader}>
              <Text style={settingsStyles.modalTitle}>{t('settings.selectLanguage')}</Text>
              <TouchableOpacity onPress={() => setShowLanguageModal(false)}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>
            <ScrollView>
              {LANGUAGES.map((lang) => (
                <TouchableOpacity
                  key={lang.code}
                  style={[settingsStyles.langItem, language === lang.code && settingsStyles.langItemActive]}
                  onPress={() => { changeLanguage(lang.code); setShowLanguageModal(false); }}
                >
                  <Text style={[settingsStyles.langName, language === lang.code && settingsStyles.langNameActive]}>{lang.nativeName}</Text>
                  <Text style={settingsStyles.langNameEn}>{lang.name}</Text>
                  {language === lang.code && <Ionicons name="checkmark-circle" size={22} color="#3b82f6" />}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const settingsStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 8, marginLeft: 4, textTransform: 'uppercase' },
  sectionContent: { backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' },
  item: { flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 },
  itemBorder: { borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  itemIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eff6ff', justifyContent: 'center', alignItems: 'center' },
  itemLabel: { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '500' },
  version: { textAlign: 'center', color: '#94a3b8', fontSize: 12, marginTop: 20, marginBottom: 40 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContent: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '70%', paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#1e293b' },
  langItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 12 },
  langItemActive: { backgroundColor: '#eff6ff' },
  langName: { fontSize: 16, fontWeight: '600', color: '#1e293b', flex: 1 },
  langNameActive: { color: '#3b82f6' },
  langNameEn: { fontSize: 14, color: '#64748b' },
});


// Notifications Screen Component
const NotificationsScreen = ({ counts }) => {
  const { t } = useLanguage();
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, 'grievances'),
      orderBy('createdAt', 'desc'),
      limit(20)
    );
    const unsub = onSnapshot(q, (snap) => {
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setNotifications(items);
    });
    return () => unsub();
  }, []);

  const formatTime = (timestamp) => {
    if (!timestamp?.toDate) return '';
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <ScrollView style={notifStyles.container}>
      {counts.requests > 0 && (
        <View style={notifStyles.alertCard}>
          <Ionicons name="git-pull-request" size={24} color="#f59e0b" />
          <View style={notifStyles.alertText}>
            <Text style={notifStyles.alertTitle}>{counts.requests} {t('admin.pendingRequests')}</Text>
            <Text style={notifStyles.alertDesc}>{t('admin.waitingApproval')}</Text>
          </View>
        </View>
      )}
      {counts.signups > 0 && (
        <View style={[notifStyles.alertCard, { borderLeftColor: '#8b5cf6' }]}>
          <Ionicons name="person-add" size={24} color="#8b5cf6" />
          <View style={notifStyles.alertText}>
            <Text style={notifStyles.alertTitle}>{counts.signups} {t('admin.pendingSignups')}</Text>
            <Text style={notifStyles.alertDesc}>{t('admin.newWorkersWaiting')}</Text>
          </View>
        </View>
      )}

      <Text style={notifStyles.sectionTitle}>{t('admin.recentActivity')}</Text>
      {notifications.map((notif) => (
        <View key={notif.id} style={notifStyles.item}>
          <View style={[notifStyles.itemIcon, { backgroundColor: notif.assignedWorkerId ? '#f0fdf4' : '#fef3c7' }]}>
            <Ionicons
              name={notif.assignedWorkerId ? 'checkmark-circle' : 'alert-circle'}
              size={20}
              color={notif.assignedWorkerId ? '#22c55e' : '#f59e0b'}
            />
          </View>
          <View style={notifStyles.itemContent}>
            <Text style={notifStyles.itemTitle} numberOfLines={1}>{notif.title}</Text>
            <Text style={notifStyles.itemDesc}>
              {notif.assignedWorkerId ? t('admin.taskAssigned') : t('admin.newGrievanceSubmitted')} • {notif.status}
            </Text>
          </View>
          <Text style={notifStyles.itemTime}>{formatTime(notif.createdAt)}</Text>
        </View>
      ))}
      {notifications.length === 0 && (
        <View style={notifStyles.empty}>
          <Ionicons name="notifications-off-outline" size={48} color="#cbd5e1" />
          <Text style={notifStyles.emptyText}>{t('admin.noNotifications')}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const notifStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  alertCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, gap: 12, borderLeftWidth: 4, borderLeftColor: '#f59e0b' },
  alertText: { flex: 1 },
  alertTitle: { fontSize: 15, fontWeight: '600', color: '#1e293b' },
  alertDesc: { fontSize: 13, color: '#64748b', marginTop: 2 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#64748b', marginTop: 16, marginBottom: 12, textTransform: 'uppercase' },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 8, gap: 12 },
  itemIcon: { width: 40, height: 40, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  itemContent: { flex: 1 },
  itemTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  itemDesc: { fontSize: 12, color: '#64748b', marginTop: 2 },
  itemTime: { fontSize: 11, color: '#94a3b8' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyText: { fontSize: 15, color: '#94a3b8', marginTop: 12 },
});

// Help & Support Screen Component
const HelpSupportScreen = () => {
  const { t } = useLanguage();
  const faqs = [
    { q: t('admin.faq1Q'), a: t('admin.faq1A') },
    { q: t('admin.faq2Q'), a: t('admin.faq2A') },
    { q: t('admin.faq3Q'), a: t('admin.faq3A') },
    { q: t('admin.faq4Q'), a: t('admin.faq4A') },
  ];

  const [expandedFaq, setExpandedFaq] = useState(null);

  return (
    <ScrollView style={helpStyles.container}>
      <View style={helpStyles.contactCard}>
        <Ionicons name="headset" size={40} color="#3b82f6" />
        <Text style={helpStyles.contactTitle}>{t('help.needHelp')}</Text>
        <Text style={helpStyles.contactDesc}>{t('help.supportTeam')}</Text>
        <View style={helpStyles.contactButtons}>
          <TouchableOpacity
            style={helpStyles.contactBtn}
            onPress={() => Linking.openURL('mailto:support@janpath.com')}
          >
            <Ionicons name="mail" size={20} color="#fff" />
            <Text style={helpStyles.contactBtnText}>{t('help.emailUs')}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[helpStyles.contactBtn, { backgroundColor: '#22c55e' }]}
            onPress={() => Linking.openURL('tel:+911234567890')}
          >
            <Ionicons name="call" size={20} color="#fff" />
            <Text style={helpStyles.contactBtnText}>{t('help.callUs')}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={helpStyles.sectionTitle}>{t('help.faq')}</Text>
      {faqs.map((faq, idx) => (
        <TouchableOpacity
          key={idx}
          style={helpStyles.faqItem}
          onPress={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
        >
          <View style={helpStyles.faqHeader}>
            <Text style={helpStyles.faqQuestion}>{faq.q}</Text>
            <Ionicons name={expandedFaq === idx ? 'chevron-up' : 'chevron-down'} size={20} color="#64748b" />
          </View>
          {expandedFaq === idx && (
            <Text style={helpStyles.faqAnswer}>{faq.a}</Text>
          )}
        </TouchableOpacity>
      ))}

      <View style={helpStyles.quickLinks}>
        <Text style={helpStyles.sectionTitle}>{t('help.quickLinks')}</Text>
        <TouchableOpacity style={helpStyles.linkItem}>
          <Ionicons name="document-text-outline" size={20} color="#3b82f6" />
          <Text style={helpStyles.linkText}>{t('help.userGuide')}</Text>
          <Ionicons name="open-outline" size={16} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity style={helpStyles.linkItem}>
          <Ionicons name="videocam-outline" size={20} color="#3b82f6" />
          <Text style={helpStyles.linkText}>{t('help.videoTutorials')}</Text>
          <Ionicons name="open-outline" size={16} color="#94a3b8" />
        </TouchableOpacity>
        <TouchableOpacity style={helpStyles.linkItem}>
          <Ionicons name="chatbubbles-outline" size={20} color="#3b82f6" />
          <Text style={helpStyles.linkText}>{t('help.communityForum')}</Text>
          <Ionicons name="open-outline" size={16} color="#94a3b8" />
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const helpStyles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', padding: 16 },
  contactCard: { backgroundColor: '#fff', borderRadius: 16, padding: 24, alignItems: 'center', marginBottom: 24 },
  contactTitle: { fontSize: 20, fontWeight: '700', color: '#1e293b', marginTop: 12 },
  contactDesc: { fontSize: 14, color: '#64748b', marginTop: 4 },
  contactButtons: { flexDirection: 'row', gap: 12, marginTop: 20 },
  contactBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#3b82f6', paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10, gap: 8 },
  contactBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  sectionTitle: { fontSize: 13, fontWeight: '600', color: '#64748b', marginBottom: 12, textTransform: 'uppercase' },
  faqItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8 },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { flex: 1, fontSize: 14, fontWeight: '600', color: '#1e293b', marginRight: 8 },
  faqAnswer: { fontSize: 13, color: '#64748b', marginTop: 12, lineHeight: 20 },
  quickLinks: { marginTop: 16, marginBottom: 40 },
  linkItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 8, gap: 12 },
  linkText: { flex: 1, fontSize: 15, color: '#1e293b', fontWeight: '500' },
});

const AdminNavigation = ({ currentUser }) => {
  const { t } = useLanguage();
  const [profile, setProfile] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
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

  const closeAllOverlays = () => {
    setShowProfile(false);
    setShowSettings(false);
    setShowNotifications(false);
    setShowHelp(false);
  };

  const getHeaderTitle = () => {
    if (showProfile) return t('profile.title');
    if (showSettings) return t('settings.title');
    if (showNotifications) return t('settings.notifications');
    if (showHelp) return t('help.title');
    return t('admin.dashboardTitle');
  };

  const isOverlayOpen = showProfile || showSettings || showNotifications || showHelp;

  const renderContent = () => {
    if (showProfile) {
      return <ProfileScreen currentUser={currentUser} />;
    }
    if (showSettings) {
      return <SettingsScreen currentUser={currentUser} />;
    }
    if (showNotifications) {
      return <NotificationsScreen counts={counts} />;
    }
    if (showHelp) {
      return <HelpSupportScreen />;
    }

    switch (activeTab) {
      case 'Home':
        return <DashboardTab currentUser={currentUser} onNavigate={setActiveTab} />;
      case 'Requests':
        return <RequestsTab currentUser={currentUser} />;
      case 'Signups':
        return <SignupsTab currentUser={currentUser} />;
      case 'Assign':
        return <AssignTab currentUser={currentUser} />;
      case 'Workers':
        return <WorkersTab />;
      default:
        return <DashboardTab currentUser={currentUser} onNavigate={setActiveTab} />;
    }
  };

  return (
    <View style={styles.container}>
      {/* Custom Header */}
      <View style={styles.header}>
        {isOverlayOpen ? (
          <TouchableOpacity onPress={closeAllOverlays} style={styles.menuBtn}>
            <Ionicons name="arrow-back" size={24} color="#1e293b" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={() => setShowMenu(true)} style={styles.menuBtn}>
            <Ionicons name="menu" size={26} color="#1e293b" />
          </TouchableOpacity>
        )}
        <Text style={styles.headerTitle}>{getHeaderTitle()}</Text>
        {isOverlayOpen ? (
          <View style={{ width: 40 }} />
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
      {!isOverlayOpen && (
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
                  {tab.key === 'Home' ? t('nav.home') :
                    tab.key === 'Requests' ? t('admin.requests') :
                      tab.key === 'Signups' ? t('admin.signups') :
                        tab.key === 'Assign' ? t('admin.assign') : t('admin.workers')}
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
                <Text style={styles.menuTitle}>{t('admin.dashboardTitle')}</Text>
                <Text style={styles.menuSubtitle}>{profile?.email || currentUser?.email}</Text>
              </View>
              <TouchableOpacity onPress={() => setShowMenu(false)} style={styles.closeBtn}>
                <Ionicons name="close" size={24} color="#64748b" />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.menuItems}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { setShowMenu(false); closeAllOverlays(); setShowProfile(true); }}
              >
                <Ionicons name="person-circle-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>{t('profile.viewProfile')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { setShowMenu(false); closeAllOverlays(); setShowNotifications(true); }}
              >
                <Ionicons name="notifications-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>{t('settings.notifications')}</Text>
                {(counts.requests + counts.signups) > 0 && (
                  <View style={styles.menuBadge}>
                    <Text style={styles.menuBadgeText}>{counts.requests + counts.signups}</Text>
                  </View>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { setShowMenu(false); closeAllOverlays(); setShowSettings(true); }}
              >
                <Ionicons name="settings-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>{t('settings.title')}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => { setShowMenu(false); closeAllOverlays(); setShowHelp(true); }}
              >
                <Ionicons name="help-circle-outline" size={22} color="#475569" />
                <Text style={styles.menuItemText}>{t('help.title')}</Text>
              </TouchableOpacity>

              <View style={styles.menuDivider} />

              <TouchableOpacity style={styles.signOutBtn} onPress={() => signOut(auth)}>
                <Ionicons name="log-out-outline" size={22} color="#ef4444" />
                <Text style={styles.signOutText}>{t('auth.signOut')}</Text>
              </TouchableOpacity>
            </ScrollView>

            <Text style={styles.versionText}>{t('settings.version')} 1.0.0</Text>
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
