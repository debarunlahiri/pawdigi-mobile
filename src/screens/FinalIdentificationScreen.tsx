import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { FORM_HANDLING_AND_VERIFICATION_ENABLED } from "../config/features";

const familyRoles = [
  "Mom",
  "Dad",
  "Bro",
  "Sis",
  "Guardian",
  "My Vet",
] as const;

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
  const [submitted, setSubmitted] = useState(false);
  const hasValidFamilyMember = formData.familyMembers.some(
    (member) => member.name.trim() && member.contact.trim(),
  );

  const update = (updates: Partial<FinalIdentificationFormData>) =>
    onFormChange({ ...formData, ...updates });

  const updateFamilyMember = (
    id: string,
    updates: Partial<FamilyMember>,
  ) => {
    update({
      familyMembers: formData.familyMembers.map((member) =>
        member.id === id ? { ...member, ...updates } : member,
      ),
    });
  };

  const markPrimary = (id: string) => {
    update({
      familyMembers: formData.familyMembers.map((member) => ({
        ...member,
        isPrimary: member.id === id,
      })),
    });
  };

  const addFamilyMember = () => {
    update({
      familyMembers: [
        ...formData.familyMembers,
        {
          id: `family-${Date.now()}`,
          name: "",
          role: "Guardian",
          contact: "",
          isPrimary: false,
        },
      ],
    });
  };

  const handleComplete = () => {
    setSubmitted(true);
    if (!FORM_HANDLING_AND_VERIFICATION_ENABLED || hasValidFamilyMember) {
      onComplete();
    }
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>My identifiers & family</Text>
          <Text style={styles.complete}>Step 3 of 4</Text>
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
            <Pressable
              accessibilityRole="switch"
              accessibilityState={{ checked: formData.hasMicrochip }}
              onPress={() =>
                update({ hasMicrochip: !formData.hasMicrochip })
              }
              style={[
                styles.switchTrack,
                formData.hasMicrochip && styles.switchTrackActive,
              ]}
            >
              <View
                style={[
                  styles.switchThumb,
                  formData.hasMicrochip && styles.switchThumbActive,
                ]}
              />
            </Pressable>
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

        <Section icon="users" title="My family">
          <Text style={styles.familyHint}>
            Add at least one person with contact details. If I have more than
            one, choose my primary caregiver.
          </Text>

          {formData.familyMembers.map((member, index) => (
            <View key={member.id} style={styles.familyCard}>
              <View style={styles.familyHeader}>
                <Text style={styles.familyNumber}>
                  {index === 0 ? "Caregiver" : `Family member ${index + 1}`}
                </Text>
                <Pressable
                  onPress={() => markPrimary(member.id)}
                  style={[
                    styles.primaryBadge,
                    member.isPrimary && styles.primaryBadgeActive,
                  ]}
                >
                  <Ionicons
                    name={
                      member.isPrimary
                        ? "checkmark-circle"
                        : "ellipse-outline"
                    }
                    size={15}
                    color={member.isPrimary ? "#FFFFFF" : colors.primary}
                  />
                  <Text
                    style={[
                      styles.primaryBadgeText,
                      member.isPrimary && styles.primaryBadgeTextActive,
                    ]}
                  >
                    Primary
                  </Text>
                </Pressable>
              </View>

              <Text style={styles.label}>Relationship to me</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.roleRow}
              >
                {familyRoles.map((role) => (
                  <Pressable
                    key={role}
                    onPress={() => updateFamilyMember(member.id, { role })}
                    style={[
                      styles.roleChip,
                      member.role === role && styles.roleChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.roleText,
                        member.role === role && styles.roleTextActive,
                      ]}
                    >
                      {role}
                    </Text>
                  </Pressable>
                ))}
              </ScrollView>

              <Text style={styles.label}>Name</Text>
              <Field
                icon="user"
                onChangeText={(name) => updateFamilyMember(member.id, { name })}
                placeholder="Full name"
                value={member.name}
              />

              <Text style={styles.label}>
                {member.role === "My Vet" ? "Vet contact details" : "Contact"}
              </Text>
              <Field
                icon="address-book"
                onChangeText={(contact) =>
                  updateFamilyMember(member.id, { contact })
                }
                placeholder="Phone number or email"
                value={member.contact}
              />

              {formData.familyMembers.length > 1 ? (
                <Pressable
                  onPress={() => {
                    const remainingMembers = formData.familyMembers.filter(
                      (item) => item.id !== member.id,
                    );
                    const hasPrimary = remainingMembers.some(
                      (item) => item.isPrimary,
                    );

                    update({
                      familyMembers: remainingMembers.map((item, itemIndex) => ({
                        ...item,
                        isPrimary:
                          item.isPrimary || (!hasPrimary && itemIndex === 0),
                      })),
                    });
                  }}
                  style={styles.removeButton}
                >
                  <Ionicons
                    name="trash-outline"
                    size={15}
                    color="#B91C1C"
                  />
                  <Text style={styles.removeText}>Remove</Text>
                </Pressable>
              ) : null}
            </View>
          ))}

          {submitted && !hasValidFamilyMember ? (
            <Text style={styles.errorText}>
              Add a family member’s name and contact details.
            </Text>
          ) : null}

          <Pressable onPress={addFamilyMember} style={styles.addButton}>
            <Ionicons name="person-add" size={17} color={colors.primary} />
            <Text style={styles.addButtonText}>Add another family member</Text>
          </Pressable>
        </Section>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleComplete}>
          <Text style={styles.buttonText}>Create My Passport</Text>
          <FontAwesome5 name="arrow-right" size={17} color="#FFFFFF" />
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
      <FontAwesome5 name={icon} size={14} color="#6F7D80" />
      <TextInput
        {...props}
        placeholderTextColor="#737D8D"
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
          <FontAwesome5 name={icon} size={14} color="#FFFFFF" />
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
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  title: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 19,
  },
  complete: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
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
    width: "75%",
    height: "100%",
    backgroundColor: colors.primary,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "#B8C9CC",
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
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
    borderColor: "#B9CBCD",
    backgroundColor: "#F5FAFB",
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
  switchTrack: {
    width: 48,
    height: 28,
    borderRadius: 14,
    padding: 3,
    backgroundColor: "#CBD5D7",
  },
  switchTrackActive: { backgroundColor: colors.primary },
  switchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
  },
  switchThumbActive: { transform: [{ translateX: 20 }] },
  familyHint: {
    color: colors.body,
    fontSize: 12,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
  },
  familyCard: {
    marginTop: 14,
    padding: 12,
    borderRadius: 12,
    backgroundColor: "#F7FBFB",
    borderWidth: 1,
    borderColor: colors.border,
  },
  familyHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  familyNumber: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  primaryBadge: {
    height: 28,
    paddingHorizontal: 9,
    borderRadius: 14,
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
  primaryBadgeTextActive: { color: "#FFFFFF" },
  roleRow: { gap: 7 },
  roleChip: {
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#B9CBCD",
    backgroundColor: colors.card,
  },
  roleChipActive: {
    borderColor: colors.primary,
    backgroundColor: colors.paleTeal,
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
    color: "#B91C1C",
    fontSize: 11,
    fontFamily: fontFamily.semiBold,
  },
  addButton: {
    height: 42,
    marginTop: 14,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: colors.primary,
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
    color: "#B91C1C",
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
    backgroundColor: "rgba(241,250,250,0.98)",
    borderTopWidth: 1,
    borderTopColor: "#E5EEEE",
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
    color: "#FFFFFF",
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
});
