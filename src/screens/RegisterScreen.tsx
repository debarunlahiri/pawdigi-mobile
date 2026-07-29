import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useMemo, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, TextInput } from "../components/Typography";
import { DateInput } from "../components/DateInput";

import { AuthFooter } from "../components/AuthFooter";
import { GoogleIcon } from "../components/GoogleIcon";
import { FORM_HANDLING_AND_VERIFICATION_ENABLED } from "../config/features";
import { assets } from "../theme/assets";
import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { fontFamily } from "../theme/typography";

type RegisterScreenProps = {
  petName: string;
  onLoginPress: () => void;
  onVerificationRequired: (channel: "email" | "phone") => void;
  onProfileChange: (profile: {
    birthDate: string;
    caregiverName: string;
    caregiverContact: string;
    caregiverPhotoUri: string;
  }) => void;
};

type RegisterErrors = {
  birthDate?: string;
  caregiverName?: string;
  contact?: string;
  email?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const birthDatePattern = /^\d{2}\/\d{2}\/\d{2}$/;
const registrationDraftKey = "@pawdigi/registration-draft";

export function RegisterScreen({
  petName,
  onVerificationRequired,
  onProfileChange,
}: RegisterScreenProps) {
  const [birthDate, setBirthDate] = useState("");
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [caregiverName, setCaregiverName] = useState("");
  const [caregiverPhotoUri, setCaregiverPhotoUri] = useState<string>();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isDraftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(registrationDraftKey)
      .then((savedDraft) => {
        if (!savedDraft) return;

        const draft = JSON.parse(savedDraft);
        const restoredBirthDate =
          typeof draft.birthDate === "string" ? draft.birthDate : "";

        setBirthDate(restoredBirthDate);
        setSelectedBirthDate(parseBirthDate(restoredBirthDate));
        setCaregiverName(
          typeof draft.caregiverName === "string" ? draft.caregiverName : "",
        );
        setCaregiverPhotoUri(
          typeof draft.caregiverPhotoUri === "string"
            ? draft.caregiverPhotoUri
            : undefined,
        );
        setPhone(typeof draft.phone === "string" ? draft.phone : "");
        setEmail(typeof draft.email === "string" ? draft.email : "");
      })
      .catch((error) =>
        console.warn("Unable to restore registration draft", error),
      )
      .finally(() => setDraftLoaded(true));
  }, []);

  useEffect(() => {
    if (!isDraftLoaded) return;

    AsyncStorage.setItem(
      registrationDraftKey,
      JSON.stringify({
        birthDate,
        caregiverName,
        caregiverPhotoUri: caregiverPhotoUri ?? "",
        phone,
        email,
        savedAt: new Date().toISOString(),
      }),
    ).catch((error) =>
      console.warn("Unable to save registration draft", error),
    );
  }, [
    birthDate,
    caregiverName,
    caregiverPhotoUri,
    email,
    isDraftLoaded,
    phone,
  ]);

  const errors = useMemo<RegisterErrors>(() => {
    const nextErrors: RegisterErrors = {};
    const trimmedEmail = email.trim();

    if (!birthDatePattern.test(birthDate.trim())) {
      nextErrors.birthDate = "Enter the date as DD/MM/YY.";
    }

    if (caregiverName.trim().length < 2) {
      nextErrors.caregiverName = "Enter the primary caregiver’s name.";
    }

    if (!phone.trim() && !trimmedEmail) {
      nextErrors.contact = "Add a phone number or email address.";
    }

    if (trimmedEmail && !emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    return nextErrors;
  }, [birthDate, caregiverName, email, phone]);

  const chooseCaregiverPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled) {
      setCaregiverPhotoUri(result.assets[0].uri);
    }
  };

  const handleStart = () => {
    setSubmitted(true);
    if (
      !FORM_HANDLING_AND_VERIFICATION_ENABLED ||
      Object.keys(errors).length === 0
    ) {
      onProfileChange({
        birthDate: birthDate.trim(),
        caregiverName: caregiverName.trim(),
        caregiverContact: email.trim() || phone.trim(),
        caregiverPhotoUri: caregiverPhotoUri ?? "",
      });
      onVerificationRequired(email.trim() ? "email" : "phone");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.identity}>
          <Image source={assets.logo} style={styles.logo} resizeMode="cover" />
          <Text style={styles.petName}>{petName}</Text>
          <Text style={styles.intro}>Let’s create my PawDigi.life</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.sectionTitle}>About me</Text>

          <Text style={styles.label}>My name</Text>
          <View style={[styles.inputWrap, styles.readOnlyInput]}>
            <Ionicons name="paw" size={18} color={colors.primary} />
            <Text style={styles.savedName}>{petName}</Text>
            <Ionicons
              name="checkmark-circle"
              size={19}
              color={colors.primary}
            />
          </View>

          <Text style={styles.label}>My date of birth</Text>
          <DateInput
            accessibilityLabel="Choose my date of birth"
            error={Boolean(submitted && errors.birthDate)}
            maxLength={8}
            onCalendarPress={() => setShowDatePicker(true)}
            onChangeText={(value) => {
              const formatted = formatDateInput(value);
              setBirthDate(formatted);
              setSelectedBirthDate(parseBirthDate(formatted));
            }}
            placeholder="DD/MM/YY"
            value={birthDate}
          />
          {submitted && errors.birthDate ? (
            <Text style={styles.errorText}>{errors.birthDate}</Text>
          ) : null}
          {showDatePicker ? (
            <DateTimePicker
              display="default"
              maximumDate={new Date()}
              mode="date"
              onChange={(event: DateTimePickerEvent, date?: Date) => {
                setShowDatePicker(false);

                if (event.type === "set" && date) {
                  setSelectedBirthDate(date);
                  setBirthDate(formatDateFromDate(date));
                }
              }}
              value={selectedBirthDate ?? new Date(2020, 0, 1)}
            />
          ) : null}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>My primary caregiver</Text>

          <View style={styles.caregiverRow}>
            <Pressable
              accessibilityLabel="Choose caregiver photo or avatar"
              accessibilityRole="button"
              onPress={chooseCaregiverPhoto}
              style={styles.avatarButton}
            >
              {caregiverPhotoUri ? (
                <Image
                  source={{ uri: caregiverPhotoUri }}
                  style={styles.avatarImage}
                />
              ) : (
                <FontAwesome5 name="user" size={24} color={colors.primary} />
              )}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={12} color={colors.card} />
              </View>
            </Pressable>

            <View style={styles.caregiverNameWrap}>
              <Text style={styles.label}>Caregiver’s name</Text>
              <View
                style={[
                  styles.inputWrap,
                  styles.caregiverNameInput,
                  submitted && errors.caregiverName && styles.inputError,
                ]}
              >
                <TextInput
                  autoCapitalize="words"
                  onChangeText={setCaregiverName}
                  placeholder="Full name"
                  placeholderTextColor={colors.body}
                  style={styles.input}
                  value={caregiverName}
                />
              </View>
            </View>
          </View>
          {submitted && errors.caregiverName ? (
            <Text style={styles.errorText}>{errors.caregiverName}</Text>
          ) : null}

          <Text style={styles.contactHint}>
            Add at least one contact for authentication
          </Text>

          <Text style={styles.label}>Phone number</Text>
          <View
            style={[
              styles.inputWrap,
              submitted && errors.contact && styles.inputError,
            ]}
          >
            <Ionicons name="call-outline" size={19} color={colors.muted} />
            <TextInput
              keyboardType="phone-pad"
              onChangeText={setPhone}
              placeholder="+91 98765 43210"
              placeholderTextColor={colors.body}
              style={styles.input}
              value={phone}
            />
          </View>

          <Text style={styles.orContact}>OR</Text>

          <Text style={styles.label}>Email address</Text>
          <View
            style={[
              styles.inputWrap,
              submitted &&
                (errors.contact || errors.email) &&
                styles.inputError,
            ]}
          >
            <Ionicons name="mail-outline" size={19} color={colors.muted} />
            <TextInput
              autoCapitalize="none"
              keyboardType="email-address"
              onChangeText={setEmail}
              placeholder="name@example.com"
              placeholderTextColor={colors.body}
              style={styles.input}
              value={email}
            />
          </View>
          {submitted && (errors.email || errors.contact) ? (
            <Text style={styles.errorText}>
              {errors.email ?? errors.contact}
            </Text>
          ) : null}

          <Pressable
            onPress={handleStart}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <Text style={styles.primaryButtonText}>Start My PawDigi.life</Text>
            <Ionicons name="arrow-forward" size={20} color={colors.card} />
          </Pressable>

          <View style={styles.orRow}>
            <View style={styles.orLine} />
            <Text style={styles.orText}>OR ASK MY CAREGIVER TO USE</Text>
            <View style={styles.orLine} />
          </View>

          <View style={styles.socialRow}>
            <Pressable
              onPress={() => onVerificationRequired("email")}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.socialButtonPressed,
              ]}
            >
              <GoogleIcon size={19} />
              <Text style={styles.socialText}>Google</Text>
            </Pressable>

            <Pressable
              onPress={() => onVerificationRequired("email")}
              style={({ pressed }) => [
                styles.socialButton,
                pressed && styles.socialButtonPressed,
              ]}
            >
              <FontAwesome5 name="apple" size={22} color={colors.ink} />
              <Text style={styles.socialText}>Apple</Text>
            </Pressable>
          </View>
        </View>

        <AuthFooter />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 6);
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 6);

  if (digits.length <= 2) {
    return day;
  }

  if (digits.length <= 4) {
    return `${day}/${month}`;
  }

  return `${day}/${month}/${year}`;
}

function formatDateFromDate(date: Date) {
  const day = `${date.getDate()}`.padStart(2, "0");
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const year = `${date.getFullYear()}`.slice(-2);

  return `${day}/${month}/${year}`;
}

function parseBirthDate(value: string) {
  if (!birthDatePattern.test(value)) {
    return null;
  }

  const [dayText, monthText, yearText] = value.split("/");
  const day = Number(dayText);
  const month = Number(monthText);
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const twoDigitYear = Number(yearText);
  const year =
    currentCentury + twoDigitYear > currentYear
      ? currentCentury + twoDigitYear - 100
      : currentCentury + twoDigitYear;
  const date = new Date(year, month - 1, day);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  identity: {
    alignItems: "center",
    paddingTop: 2,
    paddingBottom: 12,
  },
  logo: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  petName: {
    color: colors.primary,
    fontSize: 23,
    fontFamily: fontFamily.extraBold,
  },
  intro: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 18,
    fontFamily: fontFamily.black,
    textAlign: "center",
  },
  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    ...cardSurface,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 17,
    fontFamily: fontFamily.extraBold,
  },
  label: {
    marginTop: 13,
    color: colors.body,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  inputWrap: {
    height: 44,
    marginTop: 6,
    borderRadius: 10,
    borderWidth: 1.3,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    paddingHorizontal: 13,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  readOnlyInput: {
    borderColor: colors.borderStrong,
    backgroundColor: colors.paleTeal,
  },
  savedName: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    paddingVertical: 0,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.background,
  },
  errorText: {
    marginTop: 5,
    color: colors.error,
    fontSize: 11,
    fontFamily: fontFamily.medium,
  },
  divider: {
    height: 1,
    marginVertical: 18,
    backgroundColor: colors.border,
  },
  caregiverRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 12,
  },
  avatarButton: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 1.3,
    borderColor: colors.borderStrong,
    backgroundColor: colors.paleTeal,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
    borderRadius: 31,
  },
  cameraBadge: {
    position: "absolute",
    right: -1,
    bottom: -1,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.card,
  },
  caregiverNameWrap: {
    flex: 1,
  },
  caregiverNameInput: {
    paddingLeft: 12,
  },
  contactHint: {
    marginTop: 18,
    color: colors.primary,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  orContact: {
    marginTop: 10,
    marginBottom: -4,
    color: colors.muted,
    fontSize: 10,
    letterSpacing: 1.2,
    textAlign: "center",
    fontFamily: fontFamily.bold,
  },
  primaryButton: {
    height: 48,
    marginTop: 20,
    borderRadius: 12,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButtonPressed: {
    backgroundColor: colors.ink,
  },
  primaryButtonText: {
    color: colors.card,
    fontSize: 16,
    fontFamily: fontFamily.extraBold,
  },
  orRow: {
    marginVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderStrong,
  },
  orText: {
    color: colors.muted,
    fontSize: 9,
    letterSpacing: 0.5,
    fontFamily: fontFamily.semiBold,
  },
  socialRow: {
    flexDirection: "row",
    gap: 10,
  },
  socialButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.3,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  socialButtonPressed: {
    backgroundColor: colors.background,
  },
  socialText: {
    color: colors.ink,
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
});
