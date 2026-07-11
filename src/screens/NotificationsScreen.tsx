import { FontAwesome5 } from '@expo/vector-icons';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

const initialNotifications = [
  { id: 1, icon: 'syringe', title: 'Rabies Booster overdue', message: 'Cooper’s vaccination needs attention.', time: '10 min ago', unread: true, tone: 'red' },
  { id: 2, icon: 'calendar-check', title: 'Appointment reminder', message: 'Professional grooming is scheduled in 3 days.', time: '2 hours ago', unread: true, tone: 'teal' },
  { id: 3, icon: 'shield-alt', title: 'Passport verified', message: 'Cooper’s digital passport is ready for EU travel.', time: 'Yesterday', unread: false, tone: 'gold' },
  { id: 4, icon: 'notes-medical', title: 'Health record added', message: 'Dr. Smith Clinic uploaded a clinical note.', time: '3 days ago', unread: false, tone: 'blue' }
];

export function NotificationsScreen({ onBack }: { onBack: () => void }) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const markAllRead = () => setNotifications((items) => items.map((item) => ({ ...item, unread: false })));

  return (
    <View style={styles.screen}>
      <View style={styles.header}>
        <Pressable style={styles.back} onPress={onBack}><FontAwesome5 name="arrow-left" size={16} color={colors.ink} /></Pressable>
        <Text style={styles.headerTitle}>Notifications</Text>
        <Pressable onPress={markAllRead}><Text style={styles.markAll}>Mark all read</Text></Pressable>
      </View>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.section}>RECENT</Text>
        {notifications.slice(0, 2).map((item) => <NotificationItem key={item.id} item={item} onPress={() => setNotifications((items) => items.map((current) => current.id === item.id ? { ...current, unread: false } : current))} />)}
        <Text style={styles.section}>EARLIER</Text>
        {notifications.slice(2).map((item) => <NotificationItem key={item.id} item={item} onPress={() => undefined} />)}
      </ScrollView>
    </View>
  );
}

function NotificationItem({ item, onPress }: { item: typeof initialNotifications[number]; onPress: () => void }) {
  const color = item.tone === 'red' ? '#C71E24' : item.tone === 'gold' ? '#9A7700' : colors.primary;
  return (
    <Pressable style={[styles.card, item.unread && styles.cardUnread]} onPress={onPress}>
      <View style={[styles.icon, { backgroundColor: `${color}12` }]}><FontAwesome5 name={item.icon} size={16} color={color} /></View>
      <View style={styles.copy}><View style={styles.titleRow}><Text style={styles.title}>{item.title}</Text>{item.unread ? <View style={styles.dot} /> : null}</View><Text style={styles.message}>{item.message}</Text><Text style={styles.time}>{item.time}</Text></View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  header: { height: 64, paddingHorizontal: 15, borderBottomWidth: 1, borderBottomColor: '#CCD8DA', flexDirection: 'row', alignItems: 'center' },
  back: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#E8EFF0', alignItems: 'center', justifyContent: 'center' },
  headerTitle: { marginLeft: 11, flex: 1, color: colors.ink, fontFamily: fontFamily.bold, fontSize: 19 },
  markAll: { color: colors.primary, fontFamily: fontFamily.medium, fontSize: 11 },
  content: { paddingHorizontal: 14, paddingBottom: 24 }, section: { marginTop: 18, marginBottom: 8, color: colors.body, fontFamily: fontFamily.medium, fontSize: 10, letterSpacing: 1 },
  card: { minHeight: 82, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE7E8', padding: 12, marginBottom: 9, flexDirection: 'row' }, cardUnread: { borderColor: '#A5D4D6', backgroundColor: '#F2FBFB' },
  icon: { width: 40, height: 40, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 11 }, copy: { flex: 1 }, titleRow: { flexDirection: 'row', alignItems: 'center' }, title: { flex: 1, color: colors.ink, fontFamily: fontFamily.bold, fontSize: 13 }, dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: '#D93025' },
  message: { marginTop: 4, color: colors.body, fontFamily: fontFamily.regular, fontSize: 11, lineHeight: 16 }, time: { marginTop: 5, color: colors.muted, fontFamily: fontFamily.regular, fontSize: 9 }
});
