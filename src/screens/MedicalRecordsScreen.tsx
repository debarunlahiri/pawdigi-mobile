import { FontAwesome5 } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

type RecordTab = 'All Records' | 'Prescriptions' | 'Lab Results';
const records = [
  { id: 1, title: 'Annual Blood Panel', date: 'Oct 14, 2023', provider: 'BlueCross Pet Clinic', type: 'Lab Results', icon: 'file-pdf', tone: 'red' },
  { id: 2, title: 'Rabies Vaccination Certificate', date: 'Aug 22, 2023', provider: 'Dr. Helena Smith', type: 'All Records', icon: 'image', tone: 'teal' },
  { id: 3, title: 'Heartworm Medication Rx', date: 'Jun 10, 2023', provider: 'VetCare Wellness', type: 'Prescriptions', icon: 'file-alt', tone: 'orange', active: true },
  { id: 4, title: 'Urinalysis Results', date: 'May 05, 2023', provider: 'City Animal Lab', type: 'Lab Results', icon: 'file-pdf', tone: 'red' }
];

export function MedicalRecordsScreen({ onBack }: { onBack: () => void }) {
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<RecordTab>('All Records');
  const [newestFirst, setNewestFirst] = useState(true);
  const filtered = useMemo(() => records.filter((record) => (tab === 'All Records' || record.type === tab) && `${record.title} ${record.provider}`.toLowerCase().includes(query.trim().toLowerCase())), [query, tab]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}><Pressable style={styles.back} onPress={onBack}><FontAwesome5 name="arrow-left" size={15} color={colors.ink} /></Pressable><View style={styles.headingCopy}><Text style={styles.heading}>Medical Records</Text><Text style={styles.subheading}>Centralized healthcare repository</Text></View><Pressable style={styles.headerIcon}><FontAwesome5 name="filter" size={14} color="#526077" /></Pressable><Pressable style={styles.headerIcon} onPress={() => setNewestFirst((value) => !value)}><FontAwesome5 name={newestFirst ? 'sort-amount-down' : 'sort-amount-up'} size={14} color="#526077" /></Pressable></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.search}><FontAwesome5 name="search" size={17} color="#718083" /><TextInput value={query} onChangeText={setQuery} style={styles.searchInput} placeholder="Search blood panels, clinics, or vaccines..." placeholderTextColor="#737D8D" multiline /></View>
        <View style={styles.tabs}>{(['All Records', 'Prescriptions', 'Lab Results'] as RecordTab[]).map((item) => <Pressable key={item} style={[styles.tab, tab === item && styles.tabActive]} onPress={() => setTab(item)}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text></Pressable>)}</View>
        <View style={styles.resultsHeader}><Text style={styles.resultsText}>{filtered.length} RECORDS</Text><Text style={styles.sortText}>{newestFirst ? 'Newest first' : 'Oldest first'}</Text></View>
        {[...(newestFirst ? filtered : filtered.slice().reverse())].map((record) => <RecordCard key={record.id} record={record} />)}
        {!filtered.length ? <View style={styles.empty}><FontAwesome5 name="folder-open" size={26} color="#9AA6A9" /><Text style={styles.emptyText}>No medical records found</Text></View> : null}
      </ScrollView>
      <Pressable style={styles.fab}><FontAwesome5 name="plus" size={21} color="#FFFFFF" /></Pressable>
    </View>
  );
}

function RecordCard({ record }: { record: typeof records[number] }) {
  const color = record.tone === 'red' ? '#F0444A' : record.tone === 'orange' ? '#F37922' : colors.primary;
  return <Pressable style={styles.card}><View style={[styles.recordIcon, { backgroundColor: `${color}12` }]}><FontAwesome5 name={record.icon} size={18} color={color} /></View><View style={styles.recordCopy}><View style={styles.cardTitleRow}><Text style={styles.cardTitle}>{record.title}</Text>{record.active ? <Text style={styles.active}>ACTIVE</Text> : <FontAwesome5 name="ellipsis-v" size={14} color="#748184" />}</View><View style={styles.metaRow}><Text style={styles.date}>{record.date}</Text><View style={styles.dot} /><Text style={styles.provider}>{record.provider}</Text></View></View></Pressable>;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, header: { minHeight: 70, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#CAD6D8', flexDirection: 'row', alignItems: 'center' }, back: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8EFF0', alignItems: 'center', justifyContent: 'center', marginRight: 9 }, headingCopy: { flex: 1 }, heading: { color: colors.ink, fontFamily: fontFamily.black, fontSize: 21 }, subheading: { marginTop: 2, color: colors.body, fontFamily: fontFamily.regular, fontSize: 10 }, headerIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#B9CBCD', alignItems: 'center', justifyContent: 'center', marginLeft: 7 },
  content: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 75 }, search: { minHeight: 54, borderRadius: 11, borderWidth: 1, borderColor: '#B9CBCD', backgroundColor: '#FFFFFF', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' }, searchInput: { flex: 1, marginLeft: 12, color: colors.ink, fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  tabs: { marginTop: 12, flexDirection: 'row', gap: 6 }, tab: { flex: 1, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' }, tabActive: { backgroundColor: colors.primary }, tabText: { color: '#526077', fontFamily: fontFamily.medium, fontSize: 10 }, tabTextActive: { color: '#FFFFFF' }, resultsHeader: { marginTop: 18, marginBottom: 7, flexDirection: 'row', justifyContent: 'space-between' }, resultsText: { color: colors.body, fontFamily: fontFamily.medium, fontSize: 9, letterSpacing: 0.8 }, sortText: { color: colors.muted, fontFamily: fontFamily.regular, fontSize: 9 },
  card: { minHeight: 92, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE6E7', padding: 13, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 }, recordIcon: { width: 46, height: 46, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, recordCopy: { flex: 1 }, cardTitleRow: { flexDirection: 'row', alignItems: 'center' }, cardTitle: { flex: 1, color: colors.ink, fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 20 }, active: { color: '#5F4900', backgroundColor: '#FFDF82', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 5, fontFamily: fontFamily.bold, fontSize: 8 }, metaRow: { marginTop: 7, flexDirection: 'row', alignItems: 'center' }, date: { color: colors.body, fontFamily: fontFamily.medium, fontSize: 10 }, dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 8, backgroundColor: '#B8C5C7' }, provider: { flex: 1, color: colors.primary, fontFamily: fontFamily.medium, fontSize: 10 },
  empty: { alignItems: 'center', paddingVertical: 45 }, emptyText: { marginTop: 9, color: colors.muted, fontFamily: fontFamily.medium, fontSize: 12 }, fab: { position: 'absolute', right: 16, bottom: 16, width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } }
});
