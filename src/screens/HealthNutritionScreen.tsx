import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as DocumentPicker from "expo-document-picker";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput } from "../components/Typography";

import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { fontFamily } from "../theme/typography";

const foodTypes = ["Dry", "Wet", "Home made", "Raw", "Mixed"] as const;
const feedingFrequencies = ["Once daily", "Twice daily", "3+ meals"] as const;

export type UploadedDocument = {
  name: string;
  uri: string;
};

export type HealthNutritionFormData = {
  lastWeight: string;
  vaccinationDetails: string;
  specialNeeds: string;
  healthAllergies: string;
  previousRecords: UploadedDocument[];
  insurancePolicyNumber: string;
  insuranceCopy: UploadedDocument | null;
  foodType: string;
  goToMeal: string;
  feedingFrequency: string;
  nutritionAllergies: string;
  supplements: string;
};

export const initialHealthNutritionFormData: HealthNutritionFormData = {
  lastWeight: "",
  vaccinationDetails: "",
  specialNeeds: "",
  healthAllergies: "",
  previousRecords: [],
  insurancePolicyNumber: "",
  insuranceCopy: null,
  foodType: "",
  goToMeal: "",
  feedingFrequency: "",
  nutritionAllergies: "",
  supplements: "",
};

type Props = {
  birthDate: string;
  formData: HealthNutritionFormData;
  onFormChange: (data: HealthNutritionFormData) => void;
  onBack: () => void;
  onComplete: () => void;
};

export function HealthNutritionScreen({
  birthDate,
  formData,
  onFormChange,
  onBack,
  onComplete,
}: Props) {
  const update = (updates: Partial<HealthNutritionFormData>) =>
    onFormChange({ ...formData, ...updates });

  const choosePreviousRecords = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: true,
      type: ["application/pdf", "image/*"],
    });

    if (!result.canceled) {
      update({
        previousRecords: result.assets.map(({ name, uri }) => ({ name, uri })),
      });
    }
  };

  const chooseInsuranceCopy = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      copyToCacheDirectory: true,
      multiple: false,
      type: ["application/pdf", "image/*"],
    });

    if (!result.canceled) {
      const { name, uri } = result.assets[0];
      update({ insuranceCopy: { name, uri } });
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
          <Text style={styles.step}>Step 5 of 6</Text>
          <Text style={styles.headerLabel}>Health & Nutrition</Text>
        </View>
        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <Text style={styles.title}>Help me live my healthiest life</Text>
        <Text style={styles.subtitle}>
          Add the essentials that caregivers and vets may need.
        </Text>

        <Section icon="medkit-outline" title="Health & protection">
          <Text style={styles.label}>Age</Text>
          <View style={[styles.inputWrap, styles.readOnlyInput]}>
            <Ionicons
              name="calendar-outline"
              size={19}
              color={colors.primary}
            />
            <Text style={styles.readOnlyText}>{getAgeLabel(birthDate)}</Text>
            <View style={styles.autoBadge}>
              <Text style={styles.autoBadgeText}>AUTO</Text>
            </View>
          </View>

          <Text style={styles.label}>Last weight</Text>
          <Field
            icon="scale-outline"
            keyboardType="decimal-pad"
            onChangeText={(lastWeight) =>
              update({ lastWeight: lastWeight.replace(/[^0-9.]/g, "") })
            }
            placeholder="e.g. 12.5 kg"
            value={formData.lastWeight}
          />

          <Text style={styles.label}>Vaccination details</Text>
          <MultilineField
            onChangeText={(vaccinationDetails) =>
              update({ vaccinationDetails })
            }
            placeholder="Vaccines, dates and next due date"
            value={formData.vaccinationDetails}
          />

          <Text style={styles.label}>Special needs</Text>
          <MultilineField
            onChangeText={(specialNeeds) => update({ specialNeeds })}
            placeholder="Mobility, behavioural or daily care needs"
            value={formData.specialNeeds}
          />

          <Text style={styles.label}>Allergies</Text>
          <Field
            icon="alert-circle-outline"
            onChangeText={(healthAllergies) => update({ healthAllergies })}
            placeholder="e.g. Chicken, bees, dust"
            value={formData.healthAllergies}
          />

          <Text style={styles.label}>Previous records</Text>
          <UploadButton
            icon="documents-outline"
            label={
              formData.previousRecords.length
                ? `${formData.previousRecords.length} file${formData.previousRecords.length === 1 ? "" : "s"} selected`
                : "Upload medical records"
            }
            onPress={choosePreviousRecords}
          />
          {formData.previousRecords.map((record) => (
            <FileRow
              key={record.uri}
              name={record.name}
              onRemove={() =>
                update({
                  previousRecords: formData.previousRecords.filter(
                    (item) => item.uri !== record.uri,
                  ),
                })
              }
            />
          ))}

          <Text style={styles.label}>Insurance policy number</Text>
          <Field
            icon="card-outline"
            onChangeText={(insurancePolicyNumber) =>
              update({ insurancePolicyNumber })
            }
            placeholder="Enter policy number"
            value={formData.insurancePolicyNumber}
          />

          <Text style={styles.label}>Insurance policy copy</Text>
          <UploadButton
            icon="cloud-upload-outline"
            label={formData.insuranceCopy?.name ?? "Upload policy copy"}
            onPress={chooseInsuranceCopy}
          />
          {formData.insuranceCopy ? (
            <FileRow
              name={formData.insuranceCopy.name}
              onRemove={() => update({ insuranceCopy: null })}
            />
          ) : null}
        </Section>

        <Section icon="restaurant-outline" title="Nutrition">
          <Text style={styles.label}>Food type</Text>
          <View style={styles.choiceGrid}>
            {foodTypes.map((foodType) => (
              <Choice
                key={foodType}
                label={foodType}
                onPress={() => update({ foodType })}
                selected={formData.foodType === foodType}
              />
            ))}
          </View>

          <Text style={styles.label}>Go-to meal</Text>
          <MultilineField
            onChangeText={(goToMeal) => update({ goToMeal })}
            placeholder="Describe the usual meal, brand or recipe"
            value={formData.goToMeal}
          />

          <Text style={styles.label}>Feeding frequency</Text>
          <View style={styles.choiceGrid}>
            {feedingFrequencies.map((feedingFrequency) => (
              <Choice
                key={feedingFrequency}
                label={feedingFrequency}
                onPress={() => update({ feedingFrequency })}
                selected={formData.feedingFrequency === feedingFrequency}
              />
            ))}
          </View>

          <Text style={styles.label}>Food allergies or sensitivities</Text>
          <Field
            icon="nutrition-outline"
            onChangeText={(nutritionAllergies) =>
              update({ nutritionAllergies })
            }
            placeholder="Ingredients to avoid"
            value={formData.nutritionAllergies}
          />

          <Text style={styles.label}>Supplements</Text>
          <MultilineField
            onChangeText={(supplements) => update({ supplements })}
            placeholder="Name, amount and schedule"
            value={formData.supplements}
          />
        </Section>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <Pressable onPress={onComplete} style={styles.completeButton}>
          <Text style={styles.completeButtonText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.card} />
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
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={styles.iconCircle}>
          <Ionicons name={icon} size={18} color={colors.card} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      {children}
    </View>
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

function MultilineField(props: React.ComponentProps<typeof TextInput>) {
  return (
    <TextInput
      multiline
      placeholderTextColor={colors.body}
      style={styles.multilineInput}
      textAlignVertical="top"
      {...props}
    />
  );
}

function Choice({
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
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.choice, selected && styles.choiceSelected]}
    >
      <Ionicons
        name={selected ? "checkmark-circle" : "ellipse-outline"}
        size={17}
        color={selected ? colors.primary : colors.muted}
      />
      <Text style={[styles.choiceText, selected && styles.choiceTextSelected]}>
        {label}
      </Text>
    </Pressable>
  );
}

function UploadButton({
  icon,
  label,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable onPress={onPress} style={styles.uploadButton}>
      <Ionicons name={icon} size={21} color={colors.primary} />
      <Text numberOfLines={1} style={styles.uploadText}>
        {label}
      </Text>
      <Ionicons name="chevron-forward" size={18} color={colors.muted} />
    </Pressable>
  );
}

function FileRow({ name, onRemove }: { name: string; onRemove: () => void }) {
  return (
    <View style={styles.fileRow}>
      <FontAwesome5 name="file-medical" size={15} color={colors.primary} />
      <Text numberOfLines={1} style={styles.fileName}>
        {name}
      </Text>
      <Pressable
        accessibilityLabel={`Remove ${name}`}
        hitSlop={8}
        onPress={onRemove}
      >
        <Ionicons name="close-circle" size={20} color={colors.muted} />
      </Pressable>
    </View>
  );
}

function getAgeLabel(birthDate: string) {
  const parts = birthDate.split("/");

  if (parts.length !== 3) {
    return "Add a valid birthday first";
  }

  const day = Number(parts[0]);
  const month = Number(parts[1]);
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const shortYear = Number(parts[2]);
  const year =
    currentCentury + shortYear > currentYear
      ? currentCentury + shortYear - 100
      : currentCentury + shortYear;
  const birthday = new Date(year, month - 1, day);

  if (
    birthday.getFullYear() !== year ||
    birthday.getMonth() !== month - 1 ||
    birthday.getDate() !== day
  ) {
    return "Add a valid birthday first";
  }

  const today = new Date();
  let months =
    (today.getFullYear() - year) * 12 + today.getMonth() - (month - 1);

  if (today.getDate() < day) {
    months -= 1;
  }

  if (months < 12) {
    return `${Math.max(months, 0)} month${months === 1 ? "" : "s"}`;
  }

  const years = Math.floor(months / 12);
  const remainingMonths = months % 12;
  return remainingMonths
    ? `${years} yr ${remainingMonths} mo`
    : `${years} year${years === 1 ? "" : "s"}`;
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
    width: "83.33%",
    height: "100%",
    backgroundColor: colors.primary,
  },
  title: {
    marginTop: 0,
    color: colors.ink,
    fontFamily: fontFamily.extraBold,
    fontSize: 25,
    lineHeight: 31,
  },
  subtitle: {
    marginTop: 6,
    marginBottom: 16,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  card: {
    marginBottom: 16,
    ...cardSurface,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 15,
  },
  iconCircle: {
    width: 34,
    height: 34,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 17,
    backgroundColor: colors.primary,
  },
  sectionTitle: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 18,
  },
  label: {
    marginTop: 11,
    marginBottom: 7,
    color: colors.ink,
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
  },
  inputWrap: {
    minHeight: 49,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    backgroundColor: colors.card,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  readOnlyInput: { backgroundColor: colors.paleTeal },
  readOnlyText: {
    flex: 1,
    color: colors.ink,
    fontFamily: fontFamily.semiBold,
    fontSize: 14,
  },
  autoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: colors.primary,
  },
  autoBadgeText: {
    color: colors.card,
    fontFamily: fontFamily.bold,
    fontSize: 9,
  },
  multilineInput: {
    minHeight: 84,
    padding: 13,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    color: colors.ink,
    backgroundColor: colors.card,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  choiceGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    minHeight: 40,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 20,
    backgroundColor: colors.card,
  },
  choiceSelected: {
    borderColor: colors.primary,
    backgroundColor: colors.paleTeal,
  },
  choiceText: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 13,
  },
  choiceTextSelected: {
    color: colors.ink,
    fontFamily: fontFamily.semiBold,
  },
  uploadButton: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: colors.primary,
    borderRadius: 13,
    backgroundColor: colors.paleTeal,
  },
  uploadText: {
    flex: 1,
    color: colors.ink,
    fontFamily: fontFamily.semiBold,
    fontSize: 13,
  },
  fileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    marginTop: 8,
    paddingHorizontal: 11,
    paddingVertical: 9,
    borderRadius: 10,
    backgroundColor: colors.background,
  },
  fileName: {
    flex: 1,
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 12,
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
});
