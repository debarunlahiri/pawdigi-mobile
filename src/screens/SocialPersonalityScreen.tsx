import { FontAwesome5, Ionicons } from "@expo/vector-icons";
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

const identityOptions = [
  "Ma da ladla",
  "PawPaw ki pari",
  "Dogeshwar",
  "Ghar ka raja",
  "Ghar ki rani",
  "Mumma’s munchkin",
  "Papa’s partner",
  "Chhota nawab",
  "Treat inspector",
  "Chief cuddle officer",
  "Drama king or queen",
  "Something else",
] as const;

const personalityOptions = {
  energy: ["Low", "Moderate", "High"],
  friendliness: ["Reserved", "Friendly", "Very Social"],
  trainability: ["Beginner", "Intermediate", "Advanced"],
  confidence: ["Shy", "Balanced", "Confident"],
  protectiveness: ["Low", "Moderate", "High"],
} as const;

const sociabilityOptions = ["Dogs", "Cats", "Children", "Strangers"] as const;

export type SocialPersonalityFormData = {
  instagramHandle: string;
  facebookPage: string;
  youtubeChannel: string;
  identity: string;
  customIdentity: string;
  energy: string;
  friendliness: string;
  trainability: string;
  confidence: string;
  protectiveness: string;
  sociability: string[];
};

export const initialSocialPersonalityFormData: SocialPersonalityFormData = {
  instagramHandle: "",
  facebookPage: "",
  youtubeChannel: "",
  identity: "",
  customIdentity: "",
  energy: "",
  friendliness: "",
  trainability: "",
  confidence: "",
  protectiveness: "",
  sociability: [],
};

type Props = {
  petName: string;
  formData: SocialPersonalityFormData;
  onFormChange: (data: SocialPersonalityFormData) => void;
  onBack: () => void;
  onComplete: () => void;
};

export function SocialPersonalityScreen({
  petName,
  formData,
  onFormChange,
  onBack,
  onComplete,
}: Props) {
  const update = (updates: Partial<SocialPersonalityFormData>) =>
    onFormChange({ ...formData, ...updates });

  const toggleSociability = (option: string) => {
    update({
      sociability: formData.sociability.includes(option)
        ? formData.sociability.filter((item) => item !== option)
        : [...formData.sociability, option],
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerRow}>
          <Text style={styles.step}>Step 4 of 4</Text>
          <Text style={styles.headerLabel}>My Social Side</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.title}>Here’s more about me</Text>
        <Text style={styles.subtitle}>
          {petName}, show everyone what makes you special.
        </Text>

        <Section icon="share-alt" title="My social profiles">
          <Text style={styles.helper}>
            Optional links to the places where my adventures are shared.
          </Text>
          <SocialField
            icon="instagram"
            label="Instagram handle"
            onChangeText={(instagramHandle) => update({ instagramHandle })}
            placeholder="@myhandle"
            value={formData.instagramHandle}
          />
          <SocialField
            icon="facebook"
            label="Facebook page"
            onChangeText={(facebookPage) => update({ facebookPage })}
            placeholder="facebook.com/mypage"
            value={formData.facebookPage}
          />
          <SocialField
            icon="youtube"
            label="YouTube channel"
            onChangeText={(youtubeChannel) => update({ youtubeChannel })}
            placeholder="youtube.com/@mychannel"
            value={formData.youtubeChannel}
          />
        </Section>

        <Section icon="paw" title="I identify myself as">
          <View style={styles.identityGrid}>
            {identityOptions.map((option) => {
              const selected = formData.identity === option;
              return (
                <Pressable
                  key={option}
                  onPress={() => update({ identity: option })}
                  style={[
                    styles.identityOption,
                    selected && styles.optionSelected,
                  ]}
                >
                  <Ionicons
                    name={selected ? "checkmark-circle" : "ellipse-outline"}
                    size={18}
                    color={selected ? colors.primary : colors.muted}
                  />
                  <Text
                    style={[
                      styles.identityText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {formData.identity === "Something else" ? (
            <TextInput
              autoCapitalize="sentences"
              onChangeText={(customIdentity) => update({ customIdentity })}
              placeholder="Tell us your own title"
              placeholderTextColor="#7B898B"
              style={styles.customInput}
              value={formData.customIdentity}
            />
          ) : null}
        </Section>

        <Section icon="heart" title="My personality">
          <PersonalitySelector
            label="Energy"
            options={personalityOptions.energy}
            value={formData.energy}
            onChange={(energy) => update({ energy })}
          />
          <PersonalitySelector
            label="Friendliness"
            options={personalityOptions.friendliness}
            value={formData.friendliness}
            onChange={(friendliness) => update({ friendliness })}
          />
          <PersonalitySelector
            label="Trainability"
            options={personalityOptions.trainability}
            value={formData.trainability}
            onChange={(trainability) => update({ trainability })}
          />
          <PersonalitySelector
            label="Confidence"
            options={personalityOptions.confidence}
            value={formData.confidence}
            onChange={(confidence) => update({ confidence })}
          />
          <PersonalitySelector
            label="Protectiveness"
            options={personalityOptions.protectiveness}
            value={formData.protectiveness}
            onChange={(protectiveness) => update({ protectiveness })}
          />

          <Text style={styles.selectorLabel}>I’m comfortable around</Text>
          <View style={styles.sociabilityGrid}>
            {sociabilityOptions.map((option) => {
              const selected = formData.sociability.includes(option);
              return (
                <Pressable
                  key={option}
                  onPress={() => toggleSociability(option)}
                  style={[
                    styles.sociabilityOption,
                    selected && styles.optionSelected,
                  ]}
                >
                  <Ionicons
                    name={selected ? "checkmark-circle" : "add-circle-outline"}
                    size={18}
                    color={selected ? colors.primary : colors.muted}
                  />
                  <Text
                    style={[
                      styles.identityText,
                      selected && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Section>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={onComplete} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Finish My Profile</Text>
          <Ionicons name="sparkles" size={18} color="#FFFFFF" />
        </Pressable>
      </View>
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
        <View style={styles.iconCircle}>
          <FontAwesome5 name={icon} size={14} color="#FFFFFF" />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
  );
}

function SocialField({
  icon,
  label,
  ...props
}: React.ComponentProps<typeof TextInput> & {
  icon: string;
  label: string;
}) {
  return (
    <>
      <Text style={styles.fieldLabel}>{label}</Text>
      <View style={styles.inputWrap}>
        <FontAwesome5 name={icon} size={16} color={colors.primary} />
        <TextInput
          {...props}
          autoCapitalize="none"
          placeholderTextColor="#7B898B"
          style={styles.input}
        />
      </View>
    </>
  );
}

function PersonalitySelector({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <View style={styles.selector}>
      <Text style={styles.selectorLabel}>{label}</Text>
      <View style={styles.selectorRow}>
        {options.map((option) => (
          <Pressable
            key={option}
            onPress={() => onChange(option)}
            style={[
              styles.selectorOption,
              value === option && styles.selectorOptionActive,
            ]}
          >
            <Text
              style={[
                styles.selectorText,
                value === option && styles.selectorTextActive,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 16, paddingBottom: 84 },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  step: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fontFamily.bold,
  },
  headerLabel: {
    color: colors.body,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  progressTrack: {
    height: 4,
    marginTop: 10,
    marginBottom: 18,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: colors.progressTrack,
  },
  progressFill: {
    width: "100%",
    height: "100%",
    backgroundColor: colors.primary,
  },
  title: {
    color: colors.ink,
    fontSize: 25,
    lineHeight: 31,
    fontFamily: fontFamily.black,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 7,
    marginBottom: 18,
    color: colors.body,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fontFamily.regular,
    textAlign: "center",
  },
  card: {
    marginBottom: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#B8C9CC",
    backgroundColor: colors.card,
  },
  sectionHeader: {
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    color: colors.ink,
    fontSize: 17,
    fontFamily: fontFamily.bold,
  },
  helper: {
    color: colors.body,
    fontSize: 11,
    lineHeight: 16,
    fontFamily: fontFamily.regular,
  },
  fieldLabel: {
    marginTop: 12,
    marginBottom: 6,
    color: colors.body,
    fontSize: 12,
    fontFamily: fontFamily.medium,
  },
  inputWrap: {
    height: 44,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: "#B9CBCD",
    backgroundColor: "#F5FAFB",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 13,
    fontFamily: fontFamily.regular,
    paddingVertical: 0,
  },
  identityGrid: { gap: 8 },
  identityOption: {
    minHeight: 42,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD7D9",
    backgroundColor: "#F8FBFB",
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
  },
  optionSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.paleTeal,
  },
  identityText: {
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
  optionTextSelected: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
  },
  customInput: {
    height: 44,
    marginTop: 10,
    paddingHorizontal: 13,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: "#B9CBCD",
    color: colors.ink,
    backgroundColor: "#F5FAFB",
    fontSize: 13,
    fontFamily: fontFamily.regular,
  },
  selector: { marginBottom: 16 },
  selectorLabel: {
    marginBottom: 7,
    color: colors.body,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  selectorRow: {
    flexDirection: "row",
    gap: 6,
  },
  selectorOption: {
    flex: 1,
    minHeight: 38,
    paddingHorizontal: 4,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: "#CBD7D9",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F8FBFB",
  },
  selectorOptionActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  selectorText: {
    color: colors.body,
    fontSize: 10,
    fontFamily: fontFamily.medium,
    textAlign: "center",
  },
  selectorTextActive: {
    color: "#FFFFFF",
    fontFamily: fontFamily.bold,
  },
  sociabilityGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  sociabilityOption: {
    width: "48%",
    minHeight: 40,
    paddingHorizontal: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#CBD7D9",
    backgroundColor: "#F8FBFB",
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
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
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.card,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  completeButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  completeButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: fontFamily.bold,
  },
});
