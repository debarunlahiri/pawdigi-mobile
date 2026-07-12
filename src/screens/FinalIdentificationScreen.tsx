import { FontAwesome5 } from "@expo/vector-icons";
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

export type FinalIdentificationFormData = {
  microchipNumber: string;
  allergiesAndNotes: string;
  behavioralNotes: string;
};

export const initialFinalIdentificationFormData: FinalIdentificationFormData = {
  microchipNumber: "",
  allergiesAndNotes: "",
  behavioralNotes: "",
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
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerRow}>
          <Text style={styles.title}>Final Identification</Text>
          <Text style={styles.complete}>100% Complete</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <Section icon="qrcode" title="Identification">
          <Text style={styles.label}>Microchip Number</Text>
          <View style={styles.singleInputWrap}>
            <FontAwesome5 name="microchip" size={15} color="#6F7D80" />
            <TextInput
              style={styles.singleInput}
              value={formData.microchipNumber}
              onChangeText={(value) =>
                update({
                  microchipNumber: value.replace(/\D/g, "").slice(0, 15),
                })
              }
              placeholder="e.g. 985112000123456"
              placeholderTextColor="#737D8D"
              keyboardType="number-pad"
              maxLength={15}
            />
          </View>
          <Text style={styles.helper}>
            The 15-digit ISO microchip number for international travel.
          </Text>
        </Section>

        <Section icon="briefcase-medical" title="Diet & Health">
          <Text style={styles.label}>Allergies & Notes</Text>
          <TextInput
            style={styles.textArea}
            value={formData.allergiesAndNotes}
            onChangeText={(value) => update({ allergiesAndNotes: value })}
            placeholder="Any dietary restrictions or chronic medical conditions..."
            placeholderTextColor="#737D8D"
            multiline
            textAlignVertical="top"
          />
        </Section>

        <Section icon="cog" title="Behavior">
          <Text style={styles.label}>Behavioral Notes</Text>
          <TextInput
            style={styles.textArea}
            value={formData.behavioralNotes}
            onChangeText={(value) => update({ behavioralNotes: value })}
            placeholder="Social temperament, reactivity, or fear triggers..."
            placeholderTextColor="#737D8D"
            multiline
            textAlignVertical="top"
          />
        </Section>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={onComplete}>
          <Text style={styles.buttonText}>Complete Passport</Text>
          <FontAwesome5 name="check-circle" size={18} color="#FFFFFF" />
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
  content: { paddingHorizontal: 16, paddingBottom: 78 },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
  },
  title: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 18,
    letterSpacing: -0.3,
    flexShrink: 1,
  },
  complete: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 12,
    paddingBottom: 1,
    marginLeft: 8,
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
    width: "100%",
    height: "100%",
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  card: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "#B8C9CC",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: colors.shadow,
    shadowOpacity: 0.12,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  iconBox: {
    width: 30,
    height: 30,
    borderRadius: 8,
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
    fontSize: 13,
    marginBottom: 6,
  },
  singleInputWrap: {
    height: 44,
    borderRadius: 11,
    borderWidth: 1.2,
    borderColor: "#B9CBCD",
    backgroundColor: "#F5FAFB",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
  },
  singleInput: {
    flex: 1,
    marginLeft: 10,
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 13,
  },
  helper: {
    color: "#788285",
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
    marginTop: 5,
  },
  textArea: {
    minHeight: 90,
    borderRadius: 11,
    borderWidth: 1.2,
    borderColor: "#B9CBCD",
    backgroundColor: "#F5FAFB",
    paddingHorizontal: 14,
    paddingTop: 12,
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 19,
  },
  bottomBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "rgba(241,250,250,0.97)",
    borderTopWidth: 1,
    borderTopColor: "#E5EEEE",
    flexDirection: "row",
    gap: 8,
  },
  backButton: {
    width: 92,
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
    fontSize: 15,
  },
  button: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  buttonText: { color: "#FFFFFF", fontFamily: fontFamily.bold, fontSize: 16 },
});
