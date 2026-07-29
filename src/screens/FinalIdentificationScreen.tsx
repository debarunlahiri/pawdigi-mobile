import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { IOSSwitch } from "../components/IOSSwitch";
import { Text, TextInput } from "../components/Typography";

import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { fontFamily } from "../theme/typography";

const familyRoles = ["Mom", "Dad", "Bro", "Sis", "Guardian", "My Vet"] as const;

export type FamilyRole = (typeof familyRoles)[number];

export type FamilyMember = {
  id: string;
  name: string;
  role: FamilyRole;
  contact: string;
  isPrimary: boolean;
};

export type FinalIdentificationFormData = {
  hasMicrochip: boolean;
  microchipNumber: string;
  licenseType: string;
  licenseNumber: string;
  registrationBody: string;
  familyMembers: FamilyMember[];
};

export const initialFinalIdentificationFormData: FinalIdentificationFormData = {
  hasMicrochip: false,
  microchipNumber: "",
  licenseType: "",
  licenseNumber: "",
  registrationBody: "",
  familyMembers: [
    {
      id: "primary-caregiver",
      name: "",
      role: "Guardian",
      contact: "",
      isPrimary: true,
    },
  ],
};

type Props = {
  formData: FinalIdentificationFormData;
  onFormChange: (data: FinalIdentificationFormData) => void;
  onBack: () => void;
  onComplete: () => void;
};

export function FinalIdentificationScreen({
  formData,
  onFormChange,
  onBack,
  onComplete,
}: Props) {
  const update = (updates: Partial<FinalIdentificationFormData>) =>
    onFormChange({ ...formData, ...updates });

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.step}>Step 3 of 6</Text>
          <Text style={styles.headerLabel}>Identifiers & Family</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <Section icon="fingerprint" title="My identifiers">
          <View style={styles.switchRow}>
            <View style={styles.switchCopy}>
              <Text style={styles.label}>Do I have a microchip?</Text>
              <Text style={styles.helper}>Add it to my secure identity.</Text>
            </View>
            <IOSSwitch
              accessibilityLabel="Microchip status"
              value={formData.hasMicrochip}
              onValueChange={(hasMicrochip) => update({ hasMicrochip })}
            />
          </View>

          {formData.hasMicrochip ? (
            <>
              <Text style={styles.label}>Microchip number</Text>
              <Field
                icon="microchip"
                keyboardType="number-pad"
                maxLength={15}
                onChangeText={(value) =>
                  update({
                    microchipNumber: value.replace(/\D/g, "").slice(0, 15),
                  })
                }
                placeholder="15-digit microchip number"
                value={formData.microchipNumber}
              />
            </>
          ) : null}

          <Text style={styles.label}>License type</Text>
          <Field
            icon="id-card"
            onChangeText={(licenseType) => update({ licenseType })}
            placeholder="e.g. Municipal pet license"
            value={formData.licenseType}
          />

          <Text style={styles.label}>License number</Text>
          <Field
            icon="hashtag"
            onChangeText={(licenseNumber) => update({ licenseNumber })}
            placeholder="Enter license number"
            value={formData.licenseNumber}
          />

          <Text style={styles.label}>Registration body</Text>
          <Field
            icon="certificate"
            onChangeText={(registrationBody) => update({ registrationBody })}
            placeholder="e.g. KCI or another recognised body"
            value={formData.registrationBody}
          />
        </Section>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onComplete}>
          <Text style={styles.buttonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.card} />
        </Pressable>
      </View>
    </View>
  );
}

function Field({
  icon,
  ...props
}: React.ComponentProps<typeof TextInput> & { icon: string }) {
  return (
    <View style={styles.inputWrap}>
      <FontAwesome5 name={icon} size={14} color={colors.body} />
      <TextInput
        {...props}
        placeholderTextColor={colors.body}
        style={styles.input}
      />
    </View>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconBox}>
          <FontAwesome5 name={icon} size={14} color={colors.card} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 82 },
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
    color: colors.body,
    fontFamily: fontFamily.semiBold,
    fontSize: 12,
  },
  progressTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.progressTrack,
    marginTop: 10,
    marginBottom: 18,
    overflow: "hidden",
  },
  progressFill: {
    width: "50%",
    height: "100%",
    backgroundColor: colors.primary,
  },
  card: {
    marginBottom: 14,
    ...cardSurface,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 9,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  label: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 12,
    marginTop: 12,
    marginBottom: 6,
  },
  helper: {
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    marginTop: 3,
  },
  inputWrap: {
    height: 44,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 9,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    paddingVertical: 0,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  switchCopy: { flex: 1 },
  familyHint: {
    color: colors.body,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
    paddingHorizontal: 2,
  },
  familyCard: {
    marginTop: 16,
    ...cardSurface,
  },
  familyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.surfaceRaised,
  },
  familyIdentity: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  familyAvatar: {
    width: 38,
    height: 38,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    backgroundColor: colors.paleTeal,
  },
  familyNumber: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  familyStatus: {
    marginTop: 2,
    color: colors.body,
    fontSize: 10,
    fontFamily: fontFamily.regular,
  },
  primaryBadge: {
    height: 30,
    paddingHorizontal: 10,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  primaryBadgeActive: { backgroundColor: colors.primary },
  primaryBadgeText: {
    color: colors.primary,
    fontSize: 10,
    fontFamily: fontFamily.semiBold,
  },
  primaryBadgeTextActive: { color: colors.card },
  roleRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  roleChip: {
    minHeight: 34,
    paddingHorizontal: 12,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.surfaceMuted,
    alignItems: "center",
    justifyContent: "center",
  },
  roleChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.secondaryLight,
  },
  roleText: {
    color: colors.body,
    fontSize: 11,
    fontFamily: fontFamily.medium,
  },
  roleTextActive: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },
  removeButton: {
    marginTop: 12,
    alignSelf: "flex-end",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  removeText: {
    color: colors.error,
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
  },
  addButton: {
    height: 48,
    marginTop: 16,
    borderRadius: 13,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.primary,
    backgroundColor: colors.paleTeal,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  addButtonText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.bold,
  },
  errorText: {
    marginTop: 10,
    color: colors.error,
    fontSize: 11,
    fontFamily: fontFamily.medium,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    backgroundColor: "rgba(245,250,251,0.98)",
    borderTopWidth: 1,
    borderTopColor: colors.surfaceRaised,
    flexDirection: "row",
    gap: 8,
  },
  backButton: {
    width: 82,
    height: 50,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: colors.primary,
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  buttonText: {
    color: colors.card,
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
});
