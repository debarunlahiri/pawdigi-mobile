import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  Keyboard,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, TextInput } from "../components/Typography";
import { DeleteConfirmationDialog } from "../components/DeleteConfirmationDialog";

import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { elevation } from "../theme/elevation";
import { fontFamily } from "../theme/typography";

const relationships = [
  "Parent",
  "Co-Parent",
  "Caretaker",
  "Guardian",
  "Family Member",
  "Veterinarian",
  "Groomer",
] as const;

const accessLevels = [
  {
    value: "Owner",
    description: "Full access to records, passport and ownership transfer.",
    icon: "key-outline",
  },
  {
    value: "Caretaker",
    description: "Can update health logs and view passport information.",
    icon: "home-outline",
  },
  {
    value: "Emergency Contact",
    description: "Notified during incidents with vital health access.",
    icon: "medkit-outline",
  },
  {
    value: "Guardian",
    description: "Can manage care information and important contacts.",
    icon: "shield-checkmark-outline",
  },
  {
    value: "View Only",
    description: "Can securely view the information shared with them.",
    icon: "eye-outline",
  },
] as const;

export type Hooman = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photoUri: string;
  relationship: string;
  accessLevel: string;
  isPrimary: boolean;
};

export type HoomansFormData = {
  people: Hooman[];
  consentAccepted: boolean;
};

export const initialHoomansFormData: HoomansFormData = {
  people: [
    {
      id: "primary-caregiver",
      name: "",
      email: "",
      phone: "",
      photoUri: "",
      relationship: "Parent",
      accessLevel: "Owner",
      isPrimary: true,
    },
  ],
  consentAccepted: false,
};

type Props = {
  formData: HoomansFormData;
  onFormChange: (data: HoomansFormData) => void;
  onBack: () => void;
  onComplete: () => void;
};

export function HoomansWhoMatterScreen({
  formData,
  onFormChange,
  onBack,
  onComplete,
}: Props) {
  const scrollRef = useRef<ScrollView>(null);
  const [submitted, setSubmitted] = useState(false);
  const [validationDialog, setValidationDialog] = useState<{
    title: string;
    message: string;
  } | null>(null);
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null);
  const update = (updates: Partial<HoomansFormData>) =>
    onFormChange({ ...formData, ...updates });

  const updatePerson = (id: string, updates: Partial<Hooman>) => {
    update({
      people: formData.people.map((person) =>
        person.id === id ? { ...person, ...updates } : person,
      ),
    });
  };

  const choosePhoto = async (id: string) => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85,
    });

    if (!result.canceled) {
      updatePerson(id, { photoUri: result.assets[0].uri });
    }
  };

  const addPerson = () => {
    update({
      people: [
        ...formData.people,
        {
          id: `hooman-${Date.now()}`,
          name: "",
          email: "",
          phone: "",
          photoUri: "",
          relationship: "Family Member",
          accessLevel: "View Only",
          isPrimary: false,
        },
      ],
    });
  };

  const removePerson = (id: string) => {
    update({ people: formData.people.filter((person) => person.id !== id) });
  };

  const canComplete =
    formData.consentAccepted &&
    formData.people.some(
      (person) =>
        person.isPrimary &&
        person.name.trim() &&
        (person.email.trim() || person.phone.trim()),
    );

  const handleComplete = () => {
    setSubmitted(true);

    const primaryCaregiver = formData.people.find((person) => person.isPrimary);

    if (
      !primaryCaregiver?.name.trim() ||
      (!primaryCaregiver.email.trim() && !primaryCaregiver.phone.trim())
    ) {
      Keyboard.dismiss();
      setValidationDialog({
        title: "Complete the primary caregiver",
        message:
          "Add your primary hooman’s name and either an email address or phone number before finishing the passport.",
      });
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ y: 0, animated: true }),
      );
      return;
    }

    if (!formData.consentAccepted) {
      Keyboard.dismiss();
      setValidationDialog({
        title: "Privacy agreement required",
        message:
          "Please accept the secure data storage and processing agreement before saving the passport.",
      });
      requestAnimationFrame(() =>
        scrollRef.current?.scrollTo({ y: 0, animated: true }),
      );
      return;
    }

    onComplete();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.step}>Step 6 of 6</Text>
          <Text style={styles.headerLabel}>My Trusted Circle</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        {submitted && !canComplete ? (
          <View style={styles.validationBanner}>
            <Ionicons
              name="alert-circle-outline"
              size={20}
              color={colors.error}
            />
            <Text style={styles.errorText}>
              Complete the primary caregiver’s name and contact, then accept the
              data usage agreement.
            </Text>
          </View>
        ) : null}

        <Text style={styles.title}>Hoomans Who Matter</Text>
        <Text style={styles.subtitle}>
          Add the people who care for me and choose the right access for each
          person.
        </Text>

        <View style={styles.privacyNote}>
          <Ionicons name="lock-closed" size={20} color={colors.primary} />
          <View style={styles.privacyCopy}>
            <Text style={styles.privacyTitle}>Privacy note</Text>
            <Text style={styles.privacyText}>
              Human data is stored securely and shared only according to the
              access level you choose.
            </Text>
          </View>
        </View>

        {formData.people.map((person, index) => (
          <View key={person.id} style={styles.card}>
            <View style={styles.personHeader}>
              <Text style={styles.cardTitle}>
                {person.isPrimary
                  ? "Primary caregiver"
                  : `Trusted hooman ${index + 1}`}
              </Text>
              {!person.isPrimary ? (
                <Pressable
                  accessibilityLabel={`Remove ${person.name || "person"}`}
                  hitSlop={8}
                  onPress={() => setPendingDeleteId(person.id)}
                >
                  <Ionicons
                    name="trash-outline"
                    size={19}
                    color={colors.error}
                  />
                </Pressable>
              ) : (
                <View style={styles.primaryBadge}>
                  <Ionicons name="star" size={12} color={colors.card} />
                  <Text style={styles.primaryText}>PRIMARY</Text>
                </View>
              )}
            </View>

            <Pressable
              accessibilityLabel="Choose human avatar"
              onPress={() => choosePhoto(person.id)}
              style={styles.avatarButton}
            >
              {person.photoUri ? (
                <Image
                  source={{ uri: person.photoUri }}
                  style={styles.avatarImage}
                />
              ) : (
                <Ionicons
                  name="person-outline"
                  size={34}
                  color={colors.primary}
                />
              )}
              <View style={styles.cameraBadge}>
                <Ionicons name="camera" size={13} color={colors.card} />
              </View>
            </Pressable>
            <Text style={styles.avatarLabel}>Human avatar</Text>

            <Text style={styles.label}>Human name</Text>
            <Field
              autoCapitalize="words"
              icon="person-outline"
              onChangeText={(name) => updatePerson(person.id, { name })}
              placeholder="Full name"
              value={person.name}
            />

            <Text style={styles.label}>Email address</Text>
            <Field
              autoCapitalize="none"
              icon="mail-outline"
              keyboardType="email-address"
              onChangeText={(email) => updatePerson(person.id, { email })}
              placeholder="name@example.com"
              value={person.email}
            />

            <Text style={styles.label}>Phone number</Text>
            <Field
              icon="call-outline"
              keyboardType="phone-pad"
              onChangeText={(phone) => updatePerson(person.id, { phone })}
              placeholder="+91 98765 43210"
              value={person.phone}
            />

            <Text style={styles.label}>Relationship</Text>
            <View style={styles.chipGrid}>
              {relationships.map((relationship) => (
                <Chip
                  key={relationship}
                  label={relationship}
                  onPress={() => updatePerson(person.id, { relationship })}
                  selected={person.relationship === relationship}
                />
              ))}
            </View>

            <Text style={styles.label}>Permission and role</Text>
            {accessLevels.map((access) => {
              const selected = person.accessLevel === access.value;
              return (
                <Pressable
                  key={access.value}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  onPress={() =>
                    updatePerson(person.id, { accessLevel: access.value })
                  }
                  style={[
                    styles.accessOption,
                    selected && styles.accessOptionSelected,
                  ]}
                >
                  <Ionicons
                    name={
                      selected ? "radio-button-on" : "radio-button-off-outline"
                    }
                    size={20}
                    color={selected ? colors.primary : colors.muted}
                  />
                  <View style={styles.accessCopy}>
                    <Text style={styles.accessTitle}>{access.value}</Text>
                    <Text style={styles.accessDescription}>
                      {access.description}
                    </Text>
                  </View>
                  <Ionicons
                    name={access.icon as keyof typeof Ionicons.glyphMap}
                    size={19}
                    color={selected ? colors.primary : colors.muted}
                  />
                </Pressable>
              );
            })}
          </View>
        ))}

        <Pressable onPress={addPerson} style={styles.addButton}>
          <Ionicons
            name="person-add-outline"
            size={20}
            color={colors.primary}
          />
          <Text style={styles.addButtonText}>Add another trusted hooman</Text>
        </Pressable>

        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: formData.consentAccepted }}
          onPress={() => update({ consentAccepted: !formData.consentAccepted })}
          style={[
            styles.consentCard,
            submitted && !formData.consentAccepted && styles.consentCardError,
          ]}
        >
          <Ionicons
            name={formData.consentAccepted ? "checkbox" : "square-outline"}
            size={24}
            color={colors.primary}
          />
          <Text style={styles.consentText}>
            I agree to the collection, secure storage, and processing of my and
            my pet’s information in accordance with the Privacy Policy and Terms
            of Use. I understand that I can manage my data and permissions at
            any time, subject to applicable laws.
          </Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={handleComplete} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Save & Finish</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.card} />
        </Pressable>
      </View>

      <ValidationDialog
        message={validationDialog?.message ?? ""}
        onClose={() => setValidationDialog(null)}
        title={validationDialog?.title ?? ""}
        visible={validationDialog !== null}
      />

      <DeleteConfirmationDialog
        confirmLabel="Remove hooman"
        message={`This will remove ${
          formData.people.find((person) => person.id === pendingDeleteId)
            ?.name || "this trusted hooman"
        } and their access from this passport.`}
        onCancel={() => setPendingDeleteId(null)}
        onConfirm={() => {
          if (pendingDeleteId) {
            removePerson(pendingDeleteId);
          }
          setPendingDeleteId(null);
        }}
        title="Remove this trusted hooman?"
        visible={pendingDeleteId !== null}
      />
    </View>
  );
}

function ValidationDialog({
  visible,
  title,
  message,
  onClose,
}: {
  visible: boolean;
  title: string;
  message: string;
  onClose: () => void;
}) {
  const dialogScale = useRef(new Animated.Value(0.86)).current;
  const dialogOpacity = useRef(new Animated.Value(0)).current;
  const dogBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) return;

    dialogScale.setValue(0.86);
    dialogOpacity.setValue(0);
    dogBounce.setValue(0);

    Animated.parallel([
      Animated.spring(dialogScale, {
        toValue: 1,
        friction: 7,
        tension: 90,
        useNativeDriver: true,
      }),
      Animated.timing(dialogOpacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();

    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(dogBounce, {
          toValue: -7,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(dogBounce, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
    );

    bounceAnimation.start();
    return () => bounceAnimation.stop();
  }, [dialogOpacity, dialogScale, dogBounce, visible]);

  return (
    <Modal
      animationType="fade"
      onRequestClose={onClose}
      transparent
      visible={visible}
    >
      <View style={styles.dialogBackdrop}>
        <Pressable onPress={onClose} style={StyleSheet.absoluteFill} />
        <Animated.View
          style={[
            styles.dialogCard,
            {
              opacity: dialogOpacity,
              transform: [{ scale: dialogScale }],
            },
          ]}
        >
          <View style={styles.dogArtWrap}>
            <Animated.View
              style={[
                styles.dogArt,
                { transform: [{ translateY: dogBounce }] },
              ]}
            >
              <FontAwesome5 name="dog" size={43} color={colors.primary} />
            </Animated.View>
            <View style={styles.pawOne}>
              <Ionicons name="paw" size={16} color={colors.accent} />
            </View>
            <View style={styles.pawTwo}>
              <Ionicons name="paw" size={11} color={colors.primary} />
            </View>
          </View>

          <Text style={styles.dialogTitle}>{title}</Text>
          <Text style={styles.dialogMessage}>{message}</Text>

          <Pressable onPress={onClose} style={styles.dialogButton}>
            <Text style={styles.dialogButtonText}>Got it</Text>
            <Ionicons name="paw" size={17} color={colors.card} />
          </Pressable>
        </Animated.View>
      </View>
    </Modal>
  );
}

function Field({
  icon,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View style={styles.inputWrap}>
      <Ionicons name={icon} size={19} color={colors.muted} />
      <TextInput
        placeholderTextColor={colors.body}
        style={styles.input}
        {...props}
      />
    </View>
  );
}

function Chip({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingBottom: 112 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  step: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  headerLabel: {
    color: colors.muted,
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
  },
  progressTrack: {
    height: 4,
    marginTop: 10,
    marginBottom: 18,
    borderRadius: 2,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  progressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
  },
  title: {
    marginTop: 0,
    color: colors.ink,
    fontFamily: fontFamily.extraBold,
    fontSize: 27,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  privacyNote: {
    flexDirection: "row",
    gap: 11,
    marginBottom: 16,
    padding: 14,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: 14,
    backgroundColor: colors.paleTeal,
  },
  privacyCopy: { flex: 1 },
  privacyTitle: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  privacyText: {
    marginTop: 3,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  card: {
    marginBottom: 15,
    ...cardSurface,
  },
  personHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 17,
  },
  primaryBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  primaryText: {
    color: colors.card,
    fontFamily: fontFamily.bold,
    fontSize: 9,
  },
  avatarButton: {
    width: 82,
    height: 82,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 18,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 41,
    backgroundColor: colors.paleTeal,
  },
  avatarImage: { width: "100%", height: "100%", borderRadius: 41 },
  cameraBadge: {
    position: "absolute",
    right: -1,
    bottom: 1,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.card,
    borderRadius: 13,
    backgroundColor: colors.primary,
  },
  avatarLabel: {
    marginTop: 6,
    marginBottom: 4,
    textAlign: "center",
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  label: {
    marginTop: 12,
    marginBottom: 7,
    color: colors.ink,
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
  },
  inputWrap: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.background,
  },
  input: {
    flex: 1,
    paddingVertical: 11,
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  chipGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 18,
    backgroundColor: colors.card,
  },
  chipSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  chipTextSelected: { color: colors.card, fontFamily: fontFamily.semiBold },
  accessOption: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 8,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.card,
  },
  accessOptionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.paleTeal,
  },
  accessCopy: { flex: 1 },
  accessTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  accessDescription: {
    marginTop: 2,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
  },
  addButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 15,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: 14,
    backgroundColor: colors.paleTeal,
  },
  addButtonText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 13,
  },
  consentCard: {
    ...cardSurface,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  consentCardError: { borderColor: colors.error },
  consentText: {
    flex: 1,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 17,
  },
  errorText: {
    flex: 1,
    color: colors.error,
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 17,
  },
  validationBanner: {
    marginBottom: 16,
    borderWidth: 1,
    borderColor: colors.error,
    borderRadius: 12,
    backgroundColor: colors.errorSoft,
    paddingHorizontal: 12,
    paddingVertical: 11,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 9,
  },
  bottomBar: {
    position: "absolute",
    right: 0,
    bottom: 0,
    left: 0,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.card,
  },
  backButton: {
    width: 82,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: colors.primary,
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  backButtonText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  completeButton: {
    height: 50,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  completeButtonText: {
    color: colors.card,
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
  dialogBackdrop: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    backgroundColor: "rgba(23,29,29,0.58)",
  },
  dialogCard: {
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 18,
    paddingBottom: 20,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 22,
    backgroundColor: colors.card,
    ...elevation.l2,
  },
  dogArtWrap: {
    width: 92,
    height: 82,
    alignItems: "center",
    justifyContent: "center",
  },
  dogArt: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 36,
    backgroundColor: colors.paleTeal,
  },
  pawOne: {
    position: "absolute",
    top: 2,
    right: 2,
    transform: [{ rotate: "18deg" }],
  },
  pawTwo: {
    position: "absolute",
    right: 0,
    bottom: 7,
    transform: [{ rotate: "-15deg" }],
  },
  dialogTitle: {
    marginTop: 5,
    color: colors.ink,
    fontFamily: fontFamily.extraBold,
    fontSize: 20,
    lineHeight: 26,
    textAlign: "center",
  },
  dialogMessage: {
    marginTop: 8,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 20,
    textAlign: "center",
  },
  dialogButton: {
    width: "100%",
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 18,
    borderRadius: 12,
    backgroundColor: colors.primary,
  },
  dialogButtonText: {
    color: colors.card,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
});
