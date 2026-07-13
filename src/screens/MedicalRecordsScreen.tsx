import { FontAwesome5 } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Alert, Animated, Image, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

type RecordTab = 'All Records' | 'Prescriptions' | 'Lab Results';
type RecordAttachment = { uri: string; name: string; isImage: boolean };
type MedicalRecord = { id: number; title: string; date: string; provider: string; type: RecordTab; icon: string; tone: 'red' | 'teal' | 'orange'; active?: boolean; attachments?: RecordAttachment[] };
const initialRecords: MedicalRecord[] = [
  { id: 1, title: 'Annual Blood Panel', date: 'Oct 14, 2023', provider: 'BlueCross Pet Clinic', type: 'Lab Results', icon: 'file-pdf', tone: 'red' },
  { id: 2, title: 'Rabies Vaccination Certificate', date: 'Aug 22, 2023', provider: 'Dr. Helena Smith', type: 'All Records', icon: 'image', tone: 'teal' },
  { id: 3, title: 'Heartworm Medication Rx', date: 'Jun 10, 2023', provider: 'VetCare Wellness', type: 'Prescriptions', icon: 'file-alt', tone: 'orange', active: true },
  { id: 4, title: 'Urinalysis Results', date: 'May 05, 2023', provider: 'City Animal Lab', type: 'Lab Results', icon: 'file-pdf', tone: 'red' }
];

export function MedicalRecordsScreen({ onBack }: { onBack: () => void }) {
  const [records, setRecords] = useState(initialRecords);
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<RecordTab>('All Records');
  const [newestFirst, setNewestFirst] = useState(true);
  const [tabsWidth, setTabsWidth] = useState(0);
  const tabPosition = useRef(new Animated.Value(0)).current;
  const contentTransition = useRef(new Animated.Value(1)).current;
  const [showAddRecord, setShowAddRecord] = useState(false);
  const tabWidth = tabsWidth > 0 ? (tabsWidth - 8) / 3 : 0;
  const filtered = useMemo(() => records.filter((record) => (tab === 'All Records' || record.type === tab) && `${record.title} ${record.provider}`.toLowerCase().includes(query.trim().toLowerCase())), [query, tab]);

  useEffect(() => {
    const tabIndex = ['All Records', 'Prescriptions', 'Lab Results'].indexOf(tab);
    contentTransition.setValue(0);
    Animated.parallel([
      Animated.spring(tabPosition, {
        toValue: tabIndex,
        damping: 20,
        stiffness: 220,
        mass: 0.8,
        useNativeDriver: true
      }),
      Animated.timing(contentTransition, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true
      })
    ]).start();
  }, [contentTransition, tab, tabPosition]);

  return (
    <View style={styles.screen}>
      <View style={styles.header}><Pressable style={styles.back} onPress={onBack}><FontAwesome5 name="arrow-left" size={15} color={colors.ink} /></Pressable><View style={styles.headingCopy}><Text style={styles.heading}>Medical Records</Text><Text style={styles.subheading}>Centralized healthcare repository</Text></View><Pressable style={styles.headerIcon}><FontAwesome5 name="filter" size={14} color="#526077" /></Pressable><Pressable style={styles.headerIcon} onPress={() => setNewestFirst((value) => !value)}><FontAwesome5 name={newestFirst ? 'sort-amount-down' : 'sort-amount-up'} size={14} color="#526077" /></Pressable></View>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.search}><FontAwesome5 name="search" size={17} color="#718083" /><TextInput value={query} onChangeText={setQuery} style={styles.searchInput} placeholder="Search blood panels, clinics, or vaccines..." placeholderTextColor="#737D8D" multiline /></View>
        <View style={styles.tabs} onLayout={(event) => setTabsWidth(event.nativeEvent.layout.width)}>
          {tabWidth > 0 ? <Animated.View style={[styles.tabIndicator, { width: tabWidth, transform: [{ translateX: tabPosition.interpolate({ inputRange: [0, 1, 2], outputRange: [0, tabWidth, tabWidth * 2] }) }] }]} /> : null}
          {(['All Records', 'Prescriptions', 'Lab Results'] as RecordTab[]).map((item) => <Pressable key={item} style={styles.tab} onPress={() => setTab(item)}><Text style={[styles.tabText, tab === item && styles.tabTextActive]}>{item}</Text></Pressable>)}
        </View>
        <Animated.View style={{ opacity: contentTransition, transform: [{ translateX: contentTransition.interpolate({ inputRange: [0, 1], outputRange: [12, 0] }) }] }}>
          <View style={styles.resultsHeader}><Text style={styles.resultsText}>{filtered.length} RECORDS</Text><Text style={styles.sortText}>{newestFirst ? 'Newest first' : 'Oldest first'}</Text></View>
          {[...(newestFirst ? filtered : filtered.slice().reverse())].map((record) => <RecordCard key={record.id} record={record} />)}
          {!filtered.length ? <View style={styles.empty}><FontAwesome5 name="folder-open" size={26} color="#9AA6A9" /><Text style={styles.emptyText}>No medical records found</Text></View> : null}
        </Animated.View>
      </ScrollView>
      <Pressable style={styles.fab} onPress={() => setShowAddRecord(true)} accessibilityRole="button" accessibilityLabel="Add medical record"><FontAwesome5 name="plus" size={21} color="#FFFFFF" /></Pressable>
      <AddMedicalRecordModal
        visible={showAddRecord}
        onClose={() => setShowAddRecord(false)}
        onAdd={(record) => {
          setRecords((items) => [{ ...record, id: Date.now() }, ...items]);
          setTab('All Records');
          setShowAddRecord(false);
        }}
      />
    </View>
  );
}

function RecordCard({ record }: { record: MedicalRecord }) {
  const color = record.tone === 'red' ? '#F0444A' : record.tone === 'orange' ? '#F37922' : colors.primary;
  return <Pressable style={styles.card}><View style={[styles.recordIcon, { backgroundColor: `${color}12` }]}><FontAwesome5 name={record.icon} size={18} color={color} /></View><View style={styles.recordCopy}><View style={styles.cardTitleRow}><Text style={styles.cardTitle}>{record.title}</Text>{record.active ? <Text style={styles.active}>ACTIVE</Text> : <FontAwesome5 name="ellipsis-v" size={14} color="#748184" />}</View><View style={styles.metaRow}><Text style={styles.date}>{record.date}</Text><View style={styles.dot} /><Text style={styles.provider}>{record.provider}</Text></View></View></Pressable>;
}

function AddMedicalRecordModal({ visible, onClose, onAdd }: { visible: boolean; onClose: () => void; onAdd: (record: Omit<MedicalRecord, 'id'>) => void }) {
  const [title, setTitle] = useState('');
  const [provider, setProvider] = useState('');
  const [type, setType] = useState<RecordTab>('All Records');
  const [submitted, setSubmitted] = useState(false);
  const [attachments, setAttachments] = useState<RecordAttachment[]>([]);
  const [pickerError, setPickerError] = useState('');
  const [showAttachmentOptions, setShowAttachmentOptions] = useState(false);

  const close = () => {
    setSubmitted(false);
    onClose();
  };

  const save = () => {
    setSubmitted(true);
    if (!title.trim() || !provider.trim() || !attachments.length) return;

    onAdd({
      title: title.trim(),
      provider: provider.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      type,
      icon: type === 'Lab Results' ? 'file-pdf' : type === 'Prescriptions' ? 'file-alt' : 'file-medical',
      tone: type === 'Lab Results' ? 'red' : type === 'Prescriptions' ? 'orange' : 'teal',
      attachments
    });
    setTitle('');
    setProvider('');
    setType('All Records');
    setAttachments([]);
    setPickerError('');
    setSubmitted(false);
  };

  const pickFile = async () => {
    setPickerError('');
    const shouldContinue = await showPermissionRationale('Open file explorer?', 'PawDigi will open your device file explorer. The app can access only the medical files you choose.');
    if (!shouldContinue) return;
    try {
      const result = await DocumentPicker.getDocumentAsync({ type: ['application/pdf', 'image/*'], copyToCacheDirectory: true, multiple: true });
      if (!result.canceled) {
        const selected = result.assets.map((asset) => ({ uri: asset.uri, name: asset.name, isImage: asset.mimeType?.startsWith('image/') ?? false }));
        setAttachments((items) => [...items, ...selected.filter((asset) => !items.some((item) => item.uri === asset.uri))]);
      }
    } catch {
      setPickerError('Unable to open the file explorer. Please reinstall the latest app build.');
    }
  };

  const captureDocument = async () => {
    setPickerError('');
    const currentPermission = await ImagePicker.getCameraPermissionsAsync();
    if (!currentPermission.granted) {
      const shouldContinue = await showPermissionRationale('Allow camera access?', 'PawDigi needs camera access so you can photograph and attach a medical document.');
      if (!shouldContinue) return;
      const permission = await ImagePicker.requestCameraPermissionsAsync();
      if (!permission.granted) {
        setPickerError('Camera access was not allowed. Enable it in device settings to take a photo.');
        return;
      }
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, quality: 0.9 });
    if (!result.canceled && result.assets[0]?.uri) {
      setAttachments((items) => [...items, { uri: result.assets[0].uri, name: `Medical record ${items.length + 1}.jpg`, isImage: true }]);
    }
  };

  const chooseAttachmentSource = (picker: () => Promise<void>) => {
    setShowAttachmentOptions(false);
    setTimeout(() => void picker(), 250);
  };

  return <><Modal visible={visible} transparent animationType="slide" onRequestClose={close}>
    <View style={styles.modalBackdrop}>
      <Pressable style={StyleSheet.absoluteFill} onPress={close} />
      <View style={styles.addSheet}>
        <View style={styles.sheetHandle} />
        <View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>Add Medical Record</Text><Text style={styles.sheetSubtitle}>Save a new health document</Text></View><Pressable style={styles.sheetClose} onPress={close}><FontAwesome5 name="times" size={14} color={colors.body} /></Pressable></View>
        <Text style={styles.inputLabel}>Record Name</Text>
        <TextInput style={[styles.formInput, submitted && !title.trim() && styles.formInputError]} value={title} onChangeText={setTitle} placeholder="e.g. Annual Blood Panel" placeholderTextColor="#849095" />
        <Text style={styles.inputLabel}>Veterinarian or Clinic</Text>
        <TextInput style={[styles.formInput, submitted && !provider.trim() && styles.formInputError]} value={provider} onChangeText={setProvider} placeholder="Provider name" placeholderTextColor="#849095" />
        <Text style={styles.inputLabel}>Record Type</Text>
        <View style={styles.typeChoices}>{(['All Records', 'Prescriptions', 'Lab Results'] as RecordTab[]).map((item) => <Pressable key={item} style={[styles.typeChoice, type === item && styles.typeChoiceActive]} onPress={() => setType(item)}><Text style={[styles.typeChoiceText, type === item && styles.typeChoiceTextActive]}>{item === 'All Records' ? 'General' : item}</Text></Pressable>)}</View>
        <View style={styles.documentHeader}><Text style={styles.inputLabel}>Document</Text><Text style={styles.requiredText}>Required</Text></View>
        <View style={styles.previewSection}>
          <View style={styles.previewHeader}><Text style={styles.previewTitle}>Attachments</Text></View>
          <ScrollView horizontal nestedScrollEnabled directionalLockEnabled showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.previewList}>
            <Pressable style={styles.addDocumentButton} onPress={() => setShowAttachmentOptions(true)} accessibilityRole="button" accessibilityLabel="Add document"><View style={styles.addDocumentIcon}><FontAwesome5 name="plus" size={13} color="#FFFFFF" /></View><Text style={styles.addDocumentText}>Add Document</Text></Pressable>
            {attachments.map((attachment, index) => <Pressable key={`${attachment.uri}-${index}`} style={styles.previewCard} onPress={() => Linking.openURL(attachment.uri)}>{attachment.isImage ? <Image source={{ uri: attachment.uri }} style={styles.previewImage} /> : <View style={styles.filePreview}><FontAwesome5 name="file-pdf" size={27} color="#F0444A" /><Text style={styles.fileType}>PDF</Text></View>}<Pressable style={styles.removeFile} onPress={(event) => { event.stopPropagation(); setAttachments((items) => items.filter((_, itemIndex) => itemIndex !== index)); }} accessibilityLabel={`Remove ${attachment.name}`}><FontAwesome5 name="times" size={10} color="#FFFFFF" /></Pressable></Pressable>)}
          </ScrollView>
        </View>
        {pickerError ? <Text style={styles.formError}>{pickerError}</Text> : null}
        {submitted && (!title.trim() || !provider.trim() || !attachments.length) ? <Text style={styles.formError}>Enter the record details and attach at least one document.</Text> : null}
        <View style={styles.modalActions}><Pressable style={styles.cancelButton} onPress={close}><Text style={styles.cancelText}>Cancel</Text></Pressable><Pressable style={styles.saveButton} onPress={save}><Text style={styles.saveText}>Save Record</Text></Pressable></View>
      </View>
    </View>
  </Modal><Modal visible={visible && showAttachmentOptions} transparent animationType="slide" onRequestClose={() => setShowAttachmentOptions(false)}><View style={styles.sourceBackdrop}><Pressable style={StyleSheet.absoluteFill} onPress={() => setShowAttachmentOptions(false)} /><View style={styles.sourceSheet}><View style={styles.sheetHandle} /><View style={styles.sourceHeading}><Text style={styles.sourceTitle}>Add Document</Text><Pressable style={styles.sheetClose} onPress={() => setShowAttachmentOptions(false)}><FontAwesome5 name="times" size={14} color={colors.body} /></Pressable></View><Text style={styles.sourceSubtitle}>Choose how you want to attach your document</Text><Pressable style={styles.sourceOption} onPress={() => chooseAttachmentSource(pickFile)}><View style={styles.sourceOptionIcon}><FontAwesome5 name="folder-open" size={18} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.sourceOptionTitle}>Add Files</Text><Text style={styles.sourceOptionText}>Select one or multiple document images</Text></View><FontAwesome5 name="chevron-right" size={12} color={colors.muted} /></Pressable><Pressable style={styles.sourceOption} onPress={() => chooseAttachmentSource(captureDocument)}><View style={styles.sourceOptionIcon}><FontAwesome5 name="camera" size={18} color={colors.primary} /></View><View style={{ flex: 1 }}><Text style={styles.sourceOptionTitle}>Camera</Text><Text style={styles.sourceOptionText}>Take a clear photo of the document</Text></View><FontAwesome5 name="chevron-right" size={12} color={colors.muted} /></Pressable></View></View></Modal></>;
}

function showPermissionRationale(title: string, message: string) {
  return new Promise<boolean>((resolve) => {
    Alert.alert(title, message, [
      { text: 'Not Now', style: 'cancel', onPress: () => resolve(false) },
      { text: 'Continue', onPress: () => resolve(true) }
    ], { cancelable: true, onDismiss: () => resolve(false) });
  });
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background }, header: { minHeight: 70, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: '#CAD6D8', flexDirection: 'row', alignItems: 'center' }, back: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#E8EFF0', alignItems: 'center', justifyContent: 'center', marginRight: 9 }, headingCopy: { flex: 1 }, heading: { color: colors.ink, fontFamily: fontFamily.black, fontSize: 21 }, subheading: { marginTop: 2, color: colors.body, fontFamily: fontFamily.regular, fontSize: 10 }, headerIcon: { width: 34, height: 34, borderRadius: 10, borderWidth: 1, borderColor: '#B9CBCD', alignItems: 'center', justifyContent: 'center', marginLeft: 7 },
  content: { paddingHorizontal: 14, paddingTop: 12, paddingBottom: 75 }, search: { minHeight: 54, borderRadius: 11, borderWidth: 1, borderColor: '#B9CBCD', backgroundColor: '#FFFFFF', paddingHorizontal: 14, flexDirection: 'row', alignItems: 'center' }, searchInput: { flex: 1, marginLeft: 12, color: colors.ink, fontFamily: fontFamily.regular, fontSize: 12, lineHeight: 16 },
  tabs: { height: 48, marginTop: 12, borderRadius: 13, backgroundColor: '#E7EDEE', padding: 4, flexDirection: 'row' }, tabIndicator: { position: 'absolute', left: 4, top: 4, bottom: 4, borderRadius: 10, backgroundColor: '#FFFFFF' }, tab: { flex: 1, borderRadius: 10, alignItems: 'center', justifyContent: 'center' }, tabText: { color: colors.body, fontFamily: fontFamily.medium, fontSize: 11 }, tabTextActive: { color: colors.primary, fontFamily: fontFamily.semiBold }, resultsHeader: { marginTop: 18, marginBottom: 7, flexDirection: 'row', justifyContent: 'space-between' }, resultsText: { color: colors.body, fontFamily: fontFamily.medium, fontSize: 9, letterSpacing: 0.8 }, sortText: { color: colors.muted, fontFamily: fontFamily.regular, fontSize: 9 },
  card: { minHeight: 92, borderRadius: 12, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DFE6E7', padding: 13, marginBottom: 10, flexDirection: 'row', alignItems: 'center', elevation: 1 }, recordIcon: { width: 46, height: 46, borderRadius: 11, alignItems: 'center', justifyContent: 'center', marginRight: 13 }, recordCopy: { flex: 1 }, cardTitleRow: { flexDirection: 'row', alignItems: 'center' }, cardTitle: { flex: 1, color: colors.ink, fontFamily: fontFamily.medium, fontSize: 15, lineHeight: 20 }, active: { color: '#5F4900', backgroundColor: '#FFDF82', borderRadius: 5, paddingHorizontal: 8, paddingVertical: 5, fontFamily: fontFamily.bold, fontSize: 8 }, metaRow: { marginTop: 7, flexDirection: 'row', alignItems: 'center' }, date: { color: colors.body, fontFamily: fontFamily.medium, fontSize: 10 }, dot: { width: 4, height: 4, borderRadius: 2, marginHorizontal: 8, backgroundColor: '#B8C5C7' }, provider: { flex: 1, color: colors.primary, fontFamily: fontFamily.medium, fontSize: 10 },
  empty: { alignItems: 'center', paddingVertical: 45 }, emptyText: { marginTop: 9, color: colors.muted, fontFamily: fontFamily.medium, fontSize: 12 }, fab: { position: 'absolute', right: 16, bottom: 16, width: 48, height: 48, borderRadius: 24, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 5, shadowColor: '#000000', shadowOpacity: 0.2, shadowRadius: 5, shadowOffset: { width: 0, height: 3 } },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,28,31,0.42)', justifyContent: 'flex-end' }, addSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 19, paddingBottom: 27 }, sheetHandle: { alignSelf: 'center', width: 42, height: 4, borderRadius: 2, backgroundColor: '#D2DCDE', marginBottom: 15 }, sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sheetTitle: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 21 }, sheetSubtitle: { marginTop: 3, color: colors.muted, fontSize: 11 }, sheetClose: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#EDF3F4', alignItems: 'center', justifyContent: 'center' }, inputLabel: { marginTop: 14, marginBottom: 6, color: colors.body, fontFamily: fontFamily.medium, fontSize: 11 }, formInput: { height: 47, borderRadius: 10, borderWidth: 1, borderColor: '#B9CBCD', backgroundColor: '#F8FBFB', paddingHorizontal: 13, color: colors.ink, fontSize: 13 }, formInputError: { borderColor: '#C71E24' }, typeChoices: { flexDirection: 'row', gap: 7 }, typeChoice: { flex: 1, minHeight: 40, borderRadius: 8, borderWidth: 1, borderColor: '#C8D5D7', alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 }, typeChoiceActive: { borderColor: colors.primary, backgroundColor: '#E5F7F7' }, typeChoiceText: { color: colors.body, fontSize: 9, textAlign: 'center' }, typeChoiceTextActive: { color: colors.primary, fontFamily: fontFamily.bold }, documentHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, requiredText: { marginTop: 14, color: colors.primary, fontFamily: fontFamily.semiBold, fontSize: 9 }, addDocumentButton: { width: 132, height: 82, borderRadius: 12, borderWidth: 1.5, borderColor: colors.primary, backgroundColor: '#F5FCFC', alignItems: 'center', justifyContent: 'center', gap: 7 }, addDocumentIcon: { width: 25, height: 25, borderRadius: 13, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, addDocumentText: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 11, textAlign: 'center' }, previewSection: { marginTop: 2, overflow: 'hidden' }, previewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 7 }, previewTitle: { color: colors.ink, fontFamily: fontFamily.semiBold, fontSize: 11 }, previewList: { flexDirection: 'row', gap: 9, paddingTop: 4, paddingRight: 4 }, previewCard: { width: 82, height: 82, borderRadius: 12, overflow: 'hidden', borderWidth: 1, borderColor: '#D5E4E5', backgroundColor: '#FFFFFF' }, previewImage: { width: '100%', height: '100%', backgroundColor: '#EAF1F2' }, filePreview: { width: '100%', height: '100%', backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center' }, fileType: { marginTop: 4, color: '#F0444A', fontFamily: fontFamily.bold, fontSize: 8 }, removeFile: { position: 'absolute', right: 4, top: 4, width: 22, height: 22, borderRadius: 11, backgroundColor: 'rgba(13,27,42,0.82)', alignItems: 'center', justifyContent: 'center' }, sourceBackdrop: { flex: 1, backgroundColor: 'rgba(15,28,31,0.42)', justifyContent: 'flex-end' }, sourceSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 19, paddingBottom: 30 }, sourceHeading: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, sourceTitle: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 20 }, sourceSubtitle: { marginTop: 3, marginBottom: 15, color: colors.muted, fontSize: 11 }, sourceOption: { minHeight: 68, borderRadius: 12, borderWidth: 1, borderColor: '#DCE6E7', backgroundColor: '#FAFCFC', paddingHorizontal: 13, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }, sourceOptionIcon: { width: 42, height: 42, borderRadius: 11, backgroundColor: '#E2F7F7', alignItems: 'center', justifyContent: 'center', marginRight: 12 }, sourceOptionTitle: { color: colors.ink, fontFamily: fontFamily.semiBold, fontSize: 13 }, sourceOptionText: { marginTop: 3, color: colors.muted, fontSize: 9 }, formError: { marginTop: 8, color: '#C71E24', fontSize: 10 }, modalActions: { marginTop: 19, flexDirection: 'row', gap: 9 }, cancelButton: { width: 98, height: 48, borderRadius: 10, borderWidth: 1, borderColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, cancelText: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 12 }, saveButton: { flex: 1, height: 48, borderRadius: 10, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }, saveText: { color: '#FFFFFF', fontFamily: fontFamily.bold, fontSize: 12 }
});
