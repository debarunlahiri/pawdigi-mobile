import { FontAwesome5 } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, BackHandler, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';
import { HomeFragment, HomePet } from './HomeFragment';
import { DogsFragment } from './DogsFragment';
import { AlertsFragment } from './AlertsFragment';
import { NotificationsScreen } from './NotificationsScreen';
import { ProfileFragment } from './ProfileFragment';
import { MedicalRecordsScreen } from './MedicalRecordsScreen';
import { GuardianAccessScreen, IdentificationScreen, VaccinationRecordsScreen } from './PassportDetailScreens';
import { DogStoryViewer } from '../components/DogStoryViewer';

export type HomeTab = 'home' | 'dogs' | 'passport' | 'alerts' | 'profile';

type Props = {
  activeTab?: HomeTab;
  pet?: HomePet;
  onSignOut: () => void;
};

export function HomeScreen({ activeTab = 'home', pet, onSignOut }: Props) {
  const [selectedTab, setSelectedTab] = useState<HomeTab>(activeTab);
  const [selectedDog, setSelectedDog] = useState(0);
  const [showDogSwitcher, setShowDogSwitcher] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMedicalRecords, setShowMedicalRecords] = useState(false);
  const [passportDetail, setPassportDetail] = useState<'identification' | 'vaccinations' | 'guardian' | null>(null);
  const [showStory, setShowStory] = useState(false);
  const profileTransition = useRef(new Animated.Value(1)).current;
  const dogs: HomePet[] = pet ? [pet, createSecondDog(pet)] : [];
  const activePet = dogs[selectedDog] || pet;
  const changeTab = (tab: HomeTab) => {
    if (tab === selectedTab) return;
    setSelectedTab(tab);
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showNotifications) {
        setShowNotifications(false);
        return true;
      }
      if (showMedicalRecords) {
        setShowMedicalRecords(false);
        return true;
      }
      if (passportDetail) {
        setPassportDetail(null);
        return true;
      }
      if (showDogSwitcher) {
        setShowDogSwitcher(false);
        return true;
      }
      if (selectedTab !== 'home') {
        setSelectedTab('home');
        return true;
      }
      return false;
    });
    return () => subscription.remove();
  }, [passportDetail, selectedTab, showDogSwitcher, showMedicalRecords, showNotifications]);

  if (showNotifications) {
    return <NotificationsScreen onBack={() => setShowNotifications(false)} />;
  }
  if (showMedicalRecords) {
    return <MedicalRecordsScreen onBack={() => setShowMedicalRecords(false)} />;
  }
  if (passportDetail === 'identification' && activePet) return <IdentificationScreen pet={activePet} onBack={() => setPassportDetail(null)} />;
  if (passportDetail === 'vaccinations') return <VaccinationRecordsScreen onBack={() => setPassportDetail(null)} />;
  if (passportDetail === 'guardian') return <GuardianAccessScreen onBack={() => setPassportDetail(null)} />;

  return (
    <View style={styles.screen}>
      <HomeHeader photoUri={activePet?.photoUri} onAvatarPress={() => setShowStory(true)} onSwitchDog={() => setShowDogSwitcher(true)} onNotifications={() => setShowNotifications(true)} />
      <Animated.View style={[styles.profileContent, { opacity: profileTransition, transform: [{ translateX: profileTransition.interpolate({ inputRange: [0, 1], outputRange: [18, 0] }) }, { scale: profileTransition.interpolate({ inputRange: [0, 1], outputRange: [0.98, 1] }) }] }]}>
        {selectedTab === 'passport' && activePet ? (
          <PassportFragment pet={activePet} onMedicalHistory={() => setShowMedicalRecords(true)} onIdentification={() => setPassportDetail('identification')} onVaccinations={() => setPassportDetail('vaccinations')} onGuardian={() => setPassportDetail('guardian')} />
        ) : selectedTab === 'dogs' ? (
          <DogsFragment
            dogs={dogs}
            selectedDog={selectedDog}
            onSelectDog={(index) => {
              setSelectedDog(index);
              setSelectedTab('home');
            }}
            onAddDog={() => setShowDogSwitcher(true)}
          />
        ) : selectedTab === 'alerts' ? (
          <AlertsFragment dogs={dogs} />
        ) : selectedTab === 'profile' ? (
          <ProfileFragment dogCount={dogs.length} onSignOut={onSignOut} />
        ) : selectedTab === 'home' && activePet ? (
          <HomeFragment pet={activePet} />
        ) : (
          <View style={styles.homeCard}>
            <View style={styles.iconWrap}><FontAwesome5 name="shield-alt" size={24} color={colors.primary} /></View>
            <Text style={styles.homeTitle}>{selectedTab === 'home' ? 'PawDigi Home' : tabLabel(selectedTab)}</Text>
            <Text style={styles.homeSubtitle}>{selectedTab === 'home' ? 'My profile setup is complete.' : `${tabLabel(selectedTab)} section`}</Text>
          </View>
        )}
      </Animated.View>
      <BottomNavigation selectedTab={selectedTab} onSelect={changeTab} />
      <DogSwitcher
        visible={showDogSwitcher}
        dogs={dogs}
        selectedDog={selectedDog}
        onClose={() => setShowDogSwitcher(false)}
        onSelect={(index) => {
          setShowDogSwitcher(false);
          if (index === selectedDog) return;
          Animated.timing(profileTransition, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
            setSelectedDog(index);
            Animated.spring(profileTransition, { toValue: 1, friction: 8, tension: 90, useNativeDriver: true }).start();
          });
        }}
      />
      <DogStoryViewer visible={showStory} dogName={activePet?.name || 'My Story'} avatarUri={activePet?.photoUri} onClose={() => setShowStory(false)} />
    </View>
  );
}

const navigationItems: { key: HomeTab; label: string; icon: string }[] = [
  { key: 'home', label: 'Home', icon: 'home' },
  { key: 'dogs', label: 'My Family', icon: 'paw' },
  { key: 'passport', label: 'Passport', icon: 'id-card' },
  { key: 'alerts', label: 'Alerts', icon: 'calendar-alt' },
  { key: 'profile', label: 'Profile', icon: 'user' }
];

function BottomNavigation({ selectedTab, onSelect }: { selectedTab: HomeTab; onSelect: (tab: HomeTab) => void }) {
  return (
    <View style={styles.bottomNavigation}>
      {navigationItems.map((item) => {
        const selected = selectedTab === item.key;
        return (
          <Pressable
            key={item.key}
            style={styles.navigationItem}
            onPress={() => onSelect(item.key)}
            accessibilityRole="tab"
            accessibilityLabel={item.label}
            accessibilityState={{ selected }}
          >
            <View style={[styles.navigationIcon, selected && styles.navigationIconSelected]}>
              <FontAwesome5 name={item.icon} size={20} color={selected ? '#FFFFFF' : colors.body} />
            </View>
          </Pressable>
        );
      })}
    </View>
  );
}

function tabLabel(tab: HomeTab) {
  return navigationItems.find((item) => item.key === tab)?.label || 'Home';
}

function HomeHeader({ photoUri, onAvatarPress, onSwitchDog, onNotifications }: { photoUri?: string; onAvatarPress: () => void; onSwitchDog: () => void; onNotifications: () => void }) {
  return (
    <View style={styles.header}>
      <Pressable style={styles.storyRing} onPress={onAvatarPress}><Image source={{ uri: photoUri || 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg' }} style={styles.avatar} /></Pressable>
      <View style={styles.greeting}>
        <Text style={styles.greetingText} numberOfLines={1} maxFontSizeMultiplier={1}>Good morning,</Text>
        <Text style={styles.ownerName} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.75} maxFontSizeMultiplier={1}>Alex Rivera</Text>
      </View>
      <Pressable style={styles.notification} onPress={onNotifications}>
        <FontAwesome5 name="bell" size={21} color={colors.primary} />
        <View style={styles.notificationDot} />
      </Pressable>
      <Pressable style={styles.switchButton} onPress={onSwitchDog}>
        <FontAwesome5 name="exchange-alt" size={18} color={colors.primary} />
        <Text style={styles.switchText} numberOfLines={1} maxFontSizeMultiplier={1}>Switch Profile</Text>
      </Pressable>
    </View>
  );
}

function DogSwitcher({ visible, dogs, selectedDog, onClose, onSelect }: { visible: boolean; dogs: HomePet[]; selectedDog: number; onClose: () => void; onSelect: (index: number) => void }) {
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <Pressable style={styles.modalBackdrop} onPress={onClose}>
        <Pressable style={styles.switchSheet} onPress={(event) => event.stopPropagation()}>
          <View style={styles.sheetHandle} />
          <View style={styles.sheetHeader}><View><Text style={styles.sheetTitle}>My Family</Text><Text style={styles.sheetSubtitle}>Choose whose profile is active</Text></View><Pressable style={styles.closeButton} onPress={onClose}><FontAwesome5 name="times" size={16} color={colors.body} /></Pressable></View>
          {dogs.map((dog, index) => {
            const selected = index === selectedDog;
            return <Pressable key={`${dog.name}-${index}`} style={[styles.dogOption, selected && styles.dogOptionSelected]} onPress={() => onSelect(index)}><Image source={{ uri: dog.photoUri || 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg' }} style={styles.dogAvatar} /><View style={styles.dogCopy}><Text style={styles.dogName}>{dog.name}</Text><Text style={styles.dogBreed}>{dog.breed}</Text></View>{selected ? <View style={styles.selectedCheck}><FontAwesome5 name="check" size={11} color="#FFFFFF" /></View> : <FontAwesome5 name="chevron-right" size={13} color="#8A9699" />}</Pressable>;
          })}
          <Pressable style={styles.addDogOption}><View style={styles.addDogIcon}><FontAwesome5 name="plus" size={14} color={colors.primary} /></View><Text style={styles.addDogText}>Add family member</Text></Pressable>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

function createSecondDog(source: HomePet): HomePet {
  return { ...source, name: 'Luna', breed: 'Siberian Husky', gender: 'Female', isSterilized: true, weight: '24', photoUri: 'https://images.dog.ceo/breeds/husky/n02110185_1469.jpg' };
}

function PassportFragment({ pet, onMedicalHistory, onIdentification, onVaccinations, onGuardian }: { pet: NonNullable<Props['pet']>; onMedicalHistory: () => void; onIdentification: () => void; onVaccinations: () => void; onGuardian: () => void }) {
  return (
    <ScrollView style={styles.passportScroll} contentContainerStyle={styles.passportContent} showsVerticalScrollIndicator={false}>
      <View style={styles.passportCard}>
        <View style={styles.passportTopRow}>
          <Text style={styles.eyebrow}>DIGITAL PASSPORT</Text>
          <View style={styles.verified}><FontAwesome5 name="check-circle" size={14} color="#715900" solid /><Text style={styles.verifiedText}>VERIFIED IDENTITY</Text></View>
        </View>
        <Text style={styles.petName}>{pet.name || 'My Profile'}</Text>
        <Image source={{ uri: pet.photoUri || 'https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg' }} style={styles.petPhoto} />
        <View style={styles.qrBadge}><FontAwesome5 name="qrcode" size={28} color={colors.primary} /></View>

        <View style={styles.detailGrid}>
          <Detail label="DOG CATEGORY" value={pet.species} />
          <Detail label="BREED" value={pet.breed || 'Not specified'} />
          <Detail label="GENDER" value={`${pet.gender}${pet.isSterilized ? ' (Neutered)' : ''}`} />
          <Detail label="BIRTH DATE" value={formatBirthDate(pet.birthDate)} />
        </View>
        <View style={styles.microchipBox}>
          <Text style={styles.detailLabel}>MICROCHIP NUMBER</Text>
          <Text style={styles.microchip}>{formatMicrochip(pet.microchipNumber)}</Text>
        </View>
      </View>

      <MenuCard icon="id-card-alt" title="My Identification" subtitle="My breed, markings, and physical traits" onPress={onIdentification} />
      <View style={styles.sectionCard}>
        <View style={styles.sectionHeading}>
          <View style={styles.menuIcon}><FontAwesome5 name="syringe" size={19} color={colors.primary} /></View>
          <View><Text style={styles.menuTitle}>Vaccination Record</Text><Text style={styles.menuSubtitle}>3 active, 1 upcoming</Text></View>
          <Pressable style={styles.viewAllButton} onPress={onVaccinations}><Text style={styles.viewAll}>View All</Text></Pressable>
        </View>
        <Vaccine name="Rabies (Annual)" date="Valid until 15 Nov 2024" />
        <Vaccine name="DHPP Booster" date="Valid until 02 Feb 2025" />
      </View>
      <MenuCard icon="file-medical-alt" title="Medical History" subtitle="Surgery logs, clinical reports, and notes" onPress={onMedicalHistory} />
      <MenuCard icon="user-friends" title="Guardian Access" subtitle="Manage sharing with vets and family" onPress={onGuardian} />

      <Pressable style={styles.pdfButton}><FontAwesome5 name="file-pdf" size={19} color="#FFFFFF" /><Text style={styles.pdfText}>Generate PDF Passport</Text></Pressable>
      <Pressable style={styles.shareButton}><FontAwesome5 name="share-alt" size={18} color={colors.primary} /><Text style={styles.shareText}>Share Secure Link</Text></Pressable>
    </ScrollView>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return <View style={styles.detail}><Text style={styles.detailLabel}>{label}</Text><Text style={styles.detailValue}>{value}</Text></View>;
}

function MenuCard({ icon, title, subtitle, onPress }: { icon: string; title: string; subtitle: string; onPress?: () => void }) {
  return <Pressable style={styles.menuCard} onPress={onPress}><View style={styles.menuIcon}><FontAwesome5 name={icon} size={19} color={colors.primary} /></View><View style={styles.menuCopy}><Text style={styles.menuTitle}>{title}</Text><Text style={styles.menuSubtitle}>{subtitle}</Text></View><FontAwesome5 name="chevron-right" size={16} color="#718083" /></Pressable>;
}

function Vaccine({ name, date }: { name: string; date: string }) {
  return <View style={styles.vaccine}><View style={styles.vaccineCheck}><FontAwesome5 name="check" size={11} color="#FFFFFF" /></View><View style={styles.menuCopy}><Text style={styles.vaccineName}>{name}</Text><Text style={styles.menuSubtitle}>{date}</Text></View><Text style={styles.current}>CURRENT</Text></View>;
}

function formatBirthDate(value: string) {
  const match = value.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (!match) return value || 'Not specified';
  return new Date(Number(match[3]), Number(match[2]) - 1, Number(match[1])).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatMicrochip(value: string) {
  if (!value) return 'NOT PROVIDED';
  return value.replace(/(.{3})/g, '$1 ').trim();
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  profileContent: { flex: 1 },
  header: { height: 70, paddingHorizontal: 12, borderBottomWidth: 1, borderBottomColor: '#B9CBCD', flexDirection: 'row', alignItems: 'center', backgroundColor: colors.background, overflow: 'hidden' },
  storyRing: { width: 48, height: 48, borderRadius: 24, borderWidth: 2, borderColor: colors.accent, padding: 2, flexShrink: 0 },
  avatar: { width: '100%', height: '100%', borderRadius: 22 },
  greeting: { marginLeft: 9, flex: 1, minWidth: 0 },
  greetingText: { color: colors.body, fontFamily: fontFamily.regular, fontSize: 13 },
  ownerName: { marginTop: 1, color: colors.ink, fontFamily: fontFamily.bold, fontSize: 19 },
  notification: { width: 34, height: 40, alignItems: 'center', justifyContent: 'center', marginHorizontal: 3, flexShrink: 0 },
  notificationDot: { position: 'absolute', top: 7, right: 7, width: 8, height: 8, borderRadius: 4, backgroundColor: '#D93025', borderWidth: 1, borderColor: colors.background },
  switchButton: { height: 40, maxWidth: 132, borderRadius: 20, borderWidth: 1, borderColor: '#B9CBCD', backgroundColor: '#E8F0F1', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', gap: 8, flexShrink: 1 },
  switchText: { color: colors.primary, fontFamily: fontFamily.medium, fontSize: 14, flexShrink: 1 },
  modalBackdrop: { flex: 1, backgroundColor: 'rgba(15,28,31,0.42)', justifyContent: 'flex-end' },
  switchSheet: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 18, paddingTop: 10, paddingBottom: 28 },
  sheetHandle: { alignSelf: 'center', width: 42, height: 4, borderRadius: 2, backgroundColor: '#D2DCDE', marginBottom: 16 },
  sheetHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 },
  sheetTitle: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 21 },
  sheetSubtitle: { marginTop: 3, color: colors.muted, fontFamily: fontFamily.regular, fontSize: 12 },
  closeButton: { width: 34, height: 34, borderRadius: 17, backgroundColor: '#EDF3F4', alignItems: 'center', justifyContent: 'center' },
  dogOption: { minHeight: 68, borderRadius: 13, borderWidth: 1, borderColor: '#DDE6E7', paddingHorizontal: 12, marginTop: 9, flexDirection: 'row', alignItems: 'center' },
  dogOptionSelected: { borderColor: colors.primary, backgroundColor: '#EFFAFA' },
  dogAvatar: { width: 46, height: 46, borderRadius: 23, borderWidth: 1.5, borderColor: colors.accent },
  dogCopy: { flex: 1, marginLeft: 12 },
  dogName: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 15 },
  dogBreed: { marginTop: 3, color: colors.body, fontFamily: fontFamily.regular, fontSize: 11 },
  selectedCheck: { width: 24, height: 24, borderRadius: 12, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' },
  addDogOption: { height: 54, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed', borderColor: '#9CC9CC', marginTop: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  addDogIcon: { width: 27, height: 27, borderRadius: 14, backgroundColor: '#E2F8F8', alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  addDogText: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 14 },
  passportScroll: { flex: 1, paddingHorizontal: 16 },
  homeCard: { marginHorizontal: 16, marginTop: 22, borderRadius: 16, borderWidth: 1, borderColor: colors.border, backgroundColor: colors.card, padding: 22, alignItems: 'center' },
  iconWrap: { width: 54, height: 54, borderRadius: 27, backgroundColor: '#DDF7F7', alignItems: 'center', justifyContent: 'center' },
  homeTitle: { marginTop: 16, color: colors.ink, fontSize: 24, fontFamily: fontFamily.black },
  homeSubtitle: { marginTop: 8, color: colors.body, fontSize: 14, textAlign: 'center', fontFamily: fontFamily.regular },
  passportContent: { paddingTop: 2, paddingBottom: 104 },
  passportCard: { borderRadius: 13, borderWidth: 1, borderColor: '#D5E0E2', backgroundColor: '#FFFFFF', padding: 16 },
  passportTopRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  eyebrow: { color: '#526077', fontFamily: fontFamily.medium, fontSize: 10, letterSpacing: 1.2 },
  verified: { flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: '#FFF9E8', borderWidth: 1, borderColor: '#E8DDAF', borderRadius: 15, paddingHorizontal: 9, height: 27 },
  verifiedText: { color: '#715900', fontFamily: fontFamily.bold, fontSize: 9, letterSpacing: 0.6 },
  petName: { marginTop: 6, color: colors.primary, fontFamily: fontFamily.black, fontSize: 20 },
  petPhoto: { alignSelf: 'center', marginTop: 18, width: 124, height: 124, borderRadius: 62, borderWidth: 4, borderColor: '#FFFFFF' },
  qrBadge: { alignSelf: 'center', marginTop: 8, width: 42, height: 42, borderRadius: 8, borderWidth: 1, borderColor: '#B9CBCD', backgroundColor: '#FFFFFF', alignItems: 'center', justifyContent: 'center' },
  detailGrid: { marginTop: 18, flexDirection: 'row', flexWrap: 'wrap', rowGap: 14 },
  detail: { width: '50%' },
  detailLabel: { color: colors.body, fontFamily: fontFamily.medium, fontSize: 10, letterSpacing: 0.8 },
  detailValue: { marginTop: 4, color: colors.ink, fontFamily: fontFamily.bold, fontSize: 13 },
  microchipBox: { marginTop: 18, borderRadius: 9, borderWidth: 1, borderColor: '#CADADB', backgroundColor: '#F1F7F7', padding: 11 },
  microchip: { marginTop: 6, color: colors.primary, fontFamily: fontFamily.bold, fontSize: 14, letterSpacing: 2.2 },
  menuCard: { marginTop: 11, minHeight: 62, borderRadius: 11, borderWidth: 1, borderColor: '#B9CBCD', backgroundColor: '#FFFFFF', padding: 12, flexDirection: 'row', alignItems: 'center' },
  menuIcon: { width: 36, height: 36, borderRadius: 8, backgroundColor: '#E2F8F8', alignItems: 'center', justifyContent: 'center', marginRight: 11 },
  menuCopy: { flex: 1 },
  menuTitle: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 14 },
  menuSubtitle: { marginTop: 2, color: colors.body, fontFamily: fontFamily.regular, fontSize: 11 },
  sectionCard: { marginTop: 11, borderRadius: 11, borderWidth: 1, borderColor: '#B9CBCD', backgroundColor: '#FFFFFF', padding: 12 },
  sectionHeading: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  viewAllButton: { marginLeft: 'auto', paddingHorizontal: 4, paddingVertical: 8 },
  viewAll: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 12 },
  vaccine: { minHeight: 52, borderRadius: 8, backgroundColor: '#EFF6F6', borderWidth: 1, borderColor: '#D7E2E3', flexDirection: 'row', alignItems: 'center', padding: 9, marginTop: 6 },
  vaccineCheck: { width: 21, height: 21, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', marginRight: 9 },
  vaccineName: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 12 },
  current: { color: '#796100', fontFamily: fontFamily.bold, fontSize: 8, borderWidth: 1, borderColor: '#DDCF91', backgroundColor: '#F7F3DF', paddingHorizontal: 7, paddingVertical: 5, borderRadius: 4 },
  pdfButton: { marginTop: 18, height: 50, borderRadius: 11, backgroundColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  pdfText: { color: '#FFFFFF', fontFamily: fontFamily.bold, fontSize: 15 },
  shareButton: { marginTop: 8, height: 50, borderRadius: 11, borderWidth: 2, borderColor: colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  shareText: { color: colors.primary, fontFamily: fontFamily.bold, fontSize: 15 },
  bottomNavigation: { position: 'absolute', left: 14, right: 14, bottom: 12, height: 64, borderRadius: 32, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFFFFF', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 10, shadowColor: colors.ink, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 6, overflow: 'hidden' },
  navigationItem: { flex: 1, height: 62, alignItems: 'center', justifyContent: 'center' },
  navigationIcon: { width: 48, height: 48, borderRadius: 999, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  navigationIconSelected: { backgroundColor: colors.primary, borderRadius: 999 }
});
