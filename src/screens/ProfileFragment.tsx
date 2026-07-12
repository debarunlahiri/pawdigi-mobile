import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as LocalAuthentication from 'expo-local-authentication';
import { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { IOSSwitch } from '../components/IOSSwitch';

const biometricLockKey = '@pawdigi/biometric-lock';

export function ProfileFragment({ dogCount, onSignOut }: { dogCount: number; onSignOut: () => void }) {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(biometricLockKey)
      .then((value) => setBiometrics(value === 'true'))
      .catch(() => setBiometrics(false));
  }, []);

  const handleBiometricChange = async (enabled: boolean) => {
    if (!enabled) {
      setBiometrics(false);
      await AsyncStorage.setItem(biometricLockKey, 'false');
      return;
    }

    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);

    if (!hasHardware || !isEnrolled) {
      Alert.alert('Biometrics unavailable', 'Set up Face ID, Touch ID, or fingerprint authentication in your device settings first.');
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: 'Enable Biometric Lock',
      cancelLabel: 'Cancel',
      disableDeviceFallback: false,
    });

    if (result.success) {
      setBiometrics(true);
      await AsyncStorage.setItem(biometricLockKey, 'true');
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.profileCard}>
        <View style={styles.avatar}><Text style={styles.initials}>AR</Text><View style={styles.verified}><FontAwesome5 name="check" size={9} color="#FFFFFF" /></View></View>
        <Text style={styles.name}>Alex Rivera</Text>
        <Text style={styles.email}>alex.rivera@example.com</Text>
        <View style={styles.memberBadge}><FontAwesome5 name="shield-alt" size={10} color={colors.primary} /><Text style={styles.memberText}>VERIFIED GUARDIAN</Text></View>
        <Pressable style={styles.editButton}><FontAwesome5 name="pen" size={11} color={colors.primary} /><Text style={styles.editText}>Edit Profile</Text></Pressable>
      </View>

      <View style={styles.stats}>
        <Stat value={String(dogCount)} label="Dogs" />
        <View style={styles.statDivider} />
        <Stat value="12" label="Records" />
        <View style={styles.statDivider} />
        <Stat value="100%" label="Verified" />
      </View>

      <Text style={styles.sectionLabel}>ACCOUNT</Text>
      <View style={styles.sectionCard}>
        <Menu icon="user" title="Personal Information" subtitle="Name, email, and contact details" />
        <Divider />
        <Menu icon="user-friends" title="Guardian Access" subtitle="Family members and shared access" />
        <Divider />
        <Menu icon="credit-card" title="Subscription & Billing" subtitle="PawDigi Premium" badge="ACTIVE" />
      </View>

      <Text style={styles.sectionLabel}>PREFERENCES</Text>
      <View style={styles.sectionCard}>
        <Toggle icon="bell" title="Notifications" subtitle="Health and appointment alerts" value={notifications} onChange={setNotifications} />
        <Divider />
        <Toggle icon="fingerprint" title="Biometric Lock" subtitle="Protect your pet records" value={biometrics} onChange={handleBiometricChange} />
        <Divider />
        <Menu icon="globe" title="Language" subtitle="English" />
      </View>

      <Text style={styles.sectionLabel}>SUPPORT</Text>
      <View style={styles.sectionCard}>
        <Menu icon="question-circle" title="Help Center" />
        <Divider />
        <Menu icon="comment-alt" title="Contact Support" />
        <Divider />
        <Menu icon="file-contract" title="Privacy & Legal" />
      </View>
      <Pressable style={styles.signOut} onPress={() => setShowSignOutDialog(true)} accessibilityRole="button"><FontAwesome5 name="sign-out-alt" size={14} color="#C71E24" /><Text style={styles.signOutText}>Sign Out</Text></Pressable>
      <Text style={styles.version}>PawDigi version 1.0.0</Text>
      <Modal visible={showSignOutDialog} transparent animationType="fade" onRequestClose={() => setShowSignOutDialog(false)}>
        <View style={styles.dialogBackdrop}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setShowSignOutDialog(false)} />
          <View style={styles.dialogCard}>
            <View style={styles.dialogIcon}><FontAwesome5 name="sign-out-alt" size={20} color="#C71E24" /></View>
            <Text style={styles.dialogTitle}>Sign out?</Text>
            <Text style={styles.dialogMessage}>Are you sure you want to sign out?</Text>
            <View style={styles.dialogActions}>
              <Pressable style={styles.dialogCancel} onPress={() => setShowSignOutDialog(false)}><Text style={styles.dialogCancelText}>Cancel</Text></Pressable>
              <Pressable style={styles.dialogConfirm} onPress={onSignOut}><Text style={styles.dialogConfirmText}>Sign Out</Text></Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) { return <View style={styles.stat}><Text style={styles.statValue}>{value}</Text><Text style={styles.statLabel}>{label}</Text></View>; }
function Divider() { return <View style={styles.divider} />; }
function Menu({ icon, title, subtitle, badge }: { icon: string; title: string; subtitle?: string; badge?: string }) { return <Pressable style={styles.row}><View style={styles.rowIcon}><FontAwesome5 name={icon} size={14} color={colors.primary} /></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text>{subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}</View>{badge ? <Text style={styles.badge}>{badge}</Text> : <FontAwesome5 name="chevron-right" size={12} color="#879396" />}</Pressable>; }
function Toggle({ icon, title, subtitle, value, onChange }: { icon: string; title: string; subtitle: string; value: boolean; onChange: (value: boolean) => void }) { return <View style={styles.row}><View style={styles.rowIcon}><FontAwesome5 name={icon} size={14} color={colors.primary} /></View><View style={styles.rowCopy}><Text style={styles.rowTitle}>{title}</Text><Text style={styles.rowSubtitle}>{subtitle}</Text></View><IOSSwitch value={value} onValueChange={onChange} /></View>; }

const styles = StyleSheet.create({
  screen: { flex: 1 }, content: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 104 },
  profileCard: { borderRadius: 16, backgroundColor: '#FFFFFF', alignItems: 'center', padding: 21, elevation: 1 }, avatar: { width: 76, height: 76, borderRadius: 38, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, initials: { color: '#FFFFFF', fontFamily: fontFamily.bold, fontSize: 25 }, verified: { position: 'absolute', right: -1, bottom: 2, width: 22, height: 22, borderRadius: 11, backgroundColor: '#10A54A', borderWidth: 2, borderColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  name: { marginTop: 11, color: colors.ink, fontFamily: fontFamily.bold, fontSize: 21 }, email: { marginTop: 3, color: colors.body, fontFamily: fontFamily.regular, fontSize: 12 }, memberBadge: { marginTop: 10, borderRadius: 13, backgroundColor: '#E4F7F7', paddingHorizontal: 11, paddingVertical: 6, flexDirection: 'row', alignItems: 'center', gap: 5 }, memberText: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 9, letterSpacing: 0.6 }, editButton: { marginTop: 13, height: 39, borderRadius: 9, borderWidth: 1, borderColor: colors.primary, paddingHorizontal: 19, flexDirection: 'row', alignItems: 'center', gap: 7 }, editText: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 12 },
  stats: { marginTop: 12, height: 78, borderRadius: 13, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center' }, stat: { flex: 1, alignItems: 'center' }, statValue: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 19 }, statLabel: { marginTop: 3, color: colors.body, fontFamily: fontFamily.regular, fontSize: 10 }, statDivider: { width: 1, height: 36, backgroundColor: '#DDE5E6' },
  sectionLabel: { marginTop: 18, marginBottom: 8, marginLeft: 3, color: colors.body, fontFamily: fontFamily.medium, fontSize: 10, letterSpacing: 1 }, sectionCard: { borderRadius: 13, backgroundColor: '#FFFFFF', paddingHorizontal: 13, elevation: 1 }, row: { minHeight: 65, flexDirection: 'row', alignItems: 'center' }, rowIcon: { width: 38, height: 38, borderRadius: 10, backgroundColor: '#E5F7F7', alignItems: 'center', justifyContent: 'center', marginRight: 11 }, rowCopy: { flex: 1 }, rowTitle: { color: colors.ink, fontFamily: fontFamily.medium, fontSize: 13 }, rowSubtitle: { marginTop: 2, color: colors.muted, fontFamily: fontFamily.regular, fontSize: 10 }, divider: { height: 1, marginLeft: 49, backgroundColor: '#E7EDEE' }, badge: { color: colors.primary, backgroundColor: '#E4F7F7', borderRadius: 9, paddingHorizontal: 8, paddingVertical: 5, fontFamily: fontFamily.bold, fontSize: 8 },
  signOut: { marginTop: 17, height: 44, borderRadius: 11, borderWidth: 1, borderColor: '#E7B7B9', backgroundColor: '#FFF5F5', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 }, signOutText: { color: '#C71E24', fontFamily: fontFamily.bold, fontSize: 12 }, version: { marginTop: 12, textAlign: 'center', color: colors.muted, fontFamily: fontFamily.regular, fontSize: 8 },
  dialogBackdrop: { flex: 1, paddingHorizontal: 24, backgroundColor: 'rgba(13,27,42,0.48)', alignItems: 'center', justifyContent: 'center' },
  dialogCard: { width: '100%', maxWidth: 360, borderRadius: 20, backgroundColor: '#FFFFFF', padding: 22, alignItems: 'center' },
  dialogIcon: { width: 52, height: 52, borderRadius: 26, backgroundColor: '#FFF0F0', alignItems: 'center', justifyContent: 'center' },
  dialogTitle: { marginTop: 14, color: colors.ink, fontFamily: fontFamily.bold, fontSize: 20 },
  dialogMessage: { marginTop: 7, color: colors.body, fontFamily: fontFamily.regular, fontSize: 13, textAlign: 'center' },
  dialogActions: { width: '100%', marginTop: 22, flexDirection: 'row', gap: 10 },
  dialogCancel: { flex: 1, height: 46, borderRadius: 12, borderWidth: 1, borderColor: colors.border, alignItems: 'center', justifyContent: 'center' },
  dialogCancelText: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 13 },
  dialogConfirm: { flex: 1, height: 46, borderRadius: 12, backgroundColor: '#C71E24', alignItems: 'center', justifyContent: 'center' },
  dialogConfirmText: { color: '#FFFFFF', fontFamily: fontFamily.bold, fontSize: 13 }
});
