import { FontAwesome5 } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as LocalAuthentication from "expo-local-authentication";
import { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "../components/Typography";

import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { fontFamily } from "../theme/typography";
import { assets } from "../theme/assets";
import { IOSSwitch } from "../components/IOSSwitch";
import type { HomePet } from "./HomeFragment";

const biometricLockKey = "@pawdigi/biometric-lock";

export function ProfileFragment({
  pet,
  onSignOut,
}: {
  pet?: HomePet;
  onSignOut: () => void;
}) {
  const [notifications, setNotifications] = useState(true);
  const [biometrics, setBiometrics] = useState(false);
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(biometricLockKey)
      .then((value) => setBiometrics(value === "true"))
      .catch(() => setBiometrics(false));
  }, []);

  const handleBiometricChange = async (enabled: boolean) => {
    if (!enabled) {
      setBiometrics(false);
      await AsyncStorage.setItem(biometricLockKey, "false");
      return;
    }

    const [hasHardware, isEnrolled] = await Promise.all([
      LocalAuthentication.hasHardwareAsync(),
      LocalAuthentication.isEnrolledAsync(),
    ]);

    if (!hasHardware || !isEnrolled) {
      Alert.alert(
        "Biometrics unavailable",
        "Set up Face ID, Touch ID, or fingerprint authentication in your device settings first.",
      );
      return;
    }

    const result = await LocalAuthentication.authenticateAsync({
      promptMessage: "Enable Biometric Lock",
      cancelLabel: "Cancel",
      disableDeviceFallback: false,
    });

    if (result.success) {
      setBiometrics(true);
      await AsyncStorage.setItem(biometricLockKey, "true");
    }
  };

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          {pet?.photoUri ? (
            <Image source={{ uri: pet.photoUri }} style={styles.avatarImage} />
          ) : (
            <Image source={assets.logo} style={styles.avatarImage} />
          )}
          <View style={styles.verified}>
            <FontAwesome5 name="check" size={9} color={colors.card} />
          </View>
        </View>
        <Text style={styles.name}>{pet?.name?.trim() || "My Pet"}</Text>
        <Text style={styles.email}>
          {[pet?.breed, pet?.species].filter(Boolean).join(" • ") ||
            "Digital pet profile"}
        </Text>
        <View style={styles.memberBadge}>
          <FontAwesome5 name="id-card" size={10} color={colors.primary} />
          <Text style={styles.memberText}>DIGITAL PASSPORT</Text>
        </View>
        <Pressable style={styles.editButton}>
          <FontAwesome5 name="pen" size={11} color={colors.primary} />
          <Text style={styles.editText}>Edit Pet Profile</Text>
        </Pressable>
      </View>

      <View style={styles.stats}>
        <Stat value={getAge(pet?.birthDate)} label="Age" />
        <View style={styles.statDivider} />
        <Stat
          value={pet?.weight ? `${pet.weight} ${pet.weightUnit}` : "Not set"}
          label="Weight"
        />
        <View style={styles.statDivider} />
        <Stat
          value={pet?.microchipNumber ? "Added" : "Pending"}
          label="Microchip"
        />
      </View>

      <Text style={styles.sectionLabel}>DOG PROFILE</Text>
      <View style={styles.sectionCard}>
        <Menu
          icon="paw"
          title="Basic Information"
          subtitle="Name, breed, birthday, gender and colour"
        />
        <Divider />
        <Menu
          icon="heartbeat"
          title="Health & Nutrition"
          subtitle="Weight, vaccinations, allergies and meals"
        />
        <Divider />
        <Menu
          icon="fingerprint"
          title="Identification"
          subtitle={
            pet?.microchipNumber
              ? `Microchip ${pet.microchipNumber}`
              : "Add microchip and registration details"
          }
          badge={pet?.microchipNumber ? "ADDED" : undefined}
        />
      </View>

      <Text style={styles.sectionLabel}>CARE & ACCESS</Text>
      <View style={styles.sectionCard}>
        <Menu
          icon="user-friends"
          title="Trusted Hoomans"
          subtitle="Caregivers and their access levels"
        />
        <Divider />
        <Menu
          icon="file-medical"
          title="Medical Records"
          subtitle="Clinical reports, prescriptions and files"
        />
        <Divider />
        <Menu
          icon="shield-alt"
          title="Passport Security"
          subtitle="Privacy, sharing and emergency access"
        />
      </View>

      <Text style={styles.sectionLabel}>PREFERENCES</Text>
      <View style={styles.sectionCard}>
        <Toggle
          icon="bell"
          title="Notifications"
          subtitle="Health and appointment alerts"
          value={notifications}
          onChange={setNotifications}
        />
        <Divider />
        <Toggle
          icon="fingerprint"
          title="Biometric Lock"
          subtitle="Protect your pet records"
          value={biometrics}
          onChange={handleBiometricChange}
        />
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
      <Pressable
        style={styles.signOut}
        onPress={() => setShowSignOutDialog(true)}
        accessibilityRole="button"
      >
        <FontAwesome5 name="sign-out-alt" size={14} color={colors.error} />
        <Text style={styles.signOutText}>Sign Out</Text>
      </Pressable>
      <Text style={styles.version}>PawDigi version 1.0.0</Text>
      <Modal
        visible={showSignOutDialog}
        transparent
        animationType="fade"
        onRequestClose={() => setShowSignOutDialog(false)}
      >
        <View style={styles.dialogBackdrop}>
          <Pressable
            style={StyleSheet.absoluteFill}
            onPress={() => setShowSignOutDialog(false)}
          />
          <View style={styles.dialogCard}>
            <View style={styles.dialogIcon}>
              <FontAwesome5
                name="sign-out-alt"
                size={20}
                color={colors.error}
              />
            </View>
            <Text style={styles.dialogTitle}>Sign out?</Text>
            <Text style={styles.dialogMessage}>
              Are you sure you want to sign out?
            </Text>
            <View style={styles.dialogActions}>
              <Pressable
                style={styles.dialogCancel}
                onPress={() => setShowSignOutDialog(false)}
              >
                <Text style={styles.dialogCancelText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.dialogConfirm} onPress={onSignOut}>
                <Text style={styles.dialogConfirmText}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}
function getAge(value?: string) {
  if (!value) return "Not set";
  const [dayText, monthText, yearText] = value.split("/");
  if (!dayText || !monthText || !yearText) return "Not set";
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const shortYear = Number(yearText);
  const year =
    currentCentury + shortYear > currentYear
      ? currentCentury + shortYear - 100
      : currentCentury + shortYear;
  const birthDate = new Date(year, Number(monthText) - 1, Number(dayText));
  if (Number.isNaN(birthDate.getTime())) return "Not set";
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  if (
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate())
  )
    age -= 1;
  return `${Math.max(age, 0)} yr`;
}
function Divider() {
  return <View style={styles.divider} />;
}
function Menu({
  icon,
  title,
  subtitle,
  badge,
}: {
  icon: string;
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <Pressable style={styles.row}>
      <View style={styles.rowIcon}>
        <FontAwesome5 name={icon} size={14} color={colors.primary} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        {subtitle ? <Text style={styles.rowSubtitle}>{subtitle}</Text> : null}
      </View>
      {badge ? (
        <Text style={styles.badge}>{badge}</Text>
      ) : (
        <FontAwesome5
          name="chevron-right"
          size={12}
          color={colors.borderStrong}
        />
      )}
    </Pressable>
  );
}
function Toggle({
  icon,
  title,
  subtitle,
  value,
  onChange,
}: {
  icon: string;
  title: string;
  subtitle: string;
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.row}>
      <View style={styles.rowIcon}>
        <FontAwesome5 name={icon} size={14} color={colors.primary} />
      </View>
      <View style={styles.rowCopy}>
        <Text style={styles.rowTitle}>{title}</Text>
        <Text style={styles.rowSubtitle}>{subtitle}</Text>
      </View>
      <IOSSwitch value={value} onValueChange={onChange} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 104 },
  profileCard: {
    alignItems: "center",
    ...cardSurface,
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 38 },
  verified: {
    position: "absolute",
    right: -1,
    bottom: 2,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  name: {
    marginTop: 11,
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 21,
  },
  email: {
    marginTop: 3,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  memberBadge: {
    marginTop: 10,
    borderRadius: 13,
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 11,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  memberText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 9,
    letterSpacing: 0.6,
  },
  editButton: {
    marginTop: 13,
    height: 39,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 19,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  editText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  stats: {
    marginTop: 12,
    height: 78,
    flexDirection: "row",
    alignItems: "center",
    ...cardSurface,
  },
  stat: { flex: 1, alignItems: "center" },
  statValue: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 19,
  },
  statLabel: {
    marginTop: 3,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 10,
  },
  statDivider: { width: 1, height: 36, backgroundColor: colors.disabled },
  sectionLabel: {
    marginTop: 18,
    marginBottom: 8,
    marginLeft: 3,
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 10,
    letterSpacing: 1,
  },
  sectionCard: {
    ...cardSurface,
    paddingHorizontal: 13,
    paddingVertical: 0,
  },
  row: { minHeight: 65, flexDirection: "row", alignItems: "center" },
  rowIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: colors.surfaceSubtle,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  rowCopy: { flex: 1 },
  rowTitle: { color: colors.ink, fontFamily: fontFamily.medium, fontSize: 13 },
  rowSubtitle: {
    marginTop: 2,
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 10,
  },
  divider: { height: 1, marginLeft: 49, backgroundColor: colors.surfaceRaised },
  badge: {
    color: colors.primary,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 9,
    paddingHorizontal: 8,
    paddingVertical: 5,
    fontFamily: fontFamily.bold,
    fontSize: 8,
  },
  signOut: {
    marginTop: 17,
    height: 44,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: colors.errorSoft,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  signOutText: {
    color: colors.error,
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  version: {
    marginTop: 12,
    textAlign: "center",
    color: colors.muted,
    fontFamily: fontFamily.regular,
    fontSize: 8,
  },
  dialogBackdrop: {
    flex: 1,
    paddingHorizontal: 24,
    backgroundColor: "rgba(23,29,29,0.48)",
    alignItems: "center",
    justifyContent: "center",
  },
  dialogCard: {
    width: "100%",
    maxWidth: 360,
    borderRadius: 20,
    backgroundColor: colors.card,
    padding: 22,
    alignItems: "center",
  },
  dialogIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogTitle: {
    marginTop: 14,
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 20,
  },
  dialogMessage: {
    marginTop: 7,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    textAlign: "center",
  },
  dialogActions: {
    width: "100%",
    marginTop: 22,
    flexDirection: "row",
    gap: 10,
  },
  dialogCancel: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogCancelText: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  dialogConfirm: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  dialogConfirmText: {
    color: colors.card,
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
});
