import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { AnimatedSegmentedControl } from "../components/AnimatedSegmentedControl";
import { IOSSwitch } from "../components/IOSSwitch";
import { Text, TextInput } from "../components/Typography";

import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { fontFamily } from "../theme/typography";

const genderOptions = ["Male", "Female"] as const;
const colorSuggestions = ["Black", "Golden", "Chocolate", "White"];

export type Gender = (typeof genderOptions)[number];

type AddDogScreenProps = {
  formData: AddDogFormData;
  petPhotoUri?: string;
  onFormChange: (formData: AddDogFormData) => void;
  onBackPress: () => void;
  onNextPress: () => void;
};

export type AddDogFormData = {
  gender: Gender;
  weight: string;
  weightUnit: "kg" | "lb";
  height: string;
  heightUnit: "cm" | "in";
  isSterilized: boolean;
  primaryColor: string;
  markings: string;
};

export const initialAddDogFormData: AddDogFormData = {
  gender: "Male",
  weight: "",
  weightUnit: "kg",
  height: "",
  heightUnit: "cm",
  isSterilized: false,
  primaryColor: "",
  markings: "",
};

export function AddDogScreen({
  formData,
  petPhotoUri,
  onFormChange,
  onBackPress,
  onNextPress,
}: AddDogScreenProps) {
  const [gender, setGender] = useState<Gender>(formData.gender);
  const [weight, setWeight] = useState(formData.weight);
  const [weightUnit, setWeightUnit] = useState<"kg" | "lb">(
    formData.weightUnit,
  );
  const [height, setHeight] = useState(formData.height);
  const [heightUnit, setHeightUnit] = useState<"cm" | "in">(
    formData.heightUnit,
  );
  const [isSterilized, setSterilized] = useState(formData.isSterilized);
  const [primaryColor, setPrimaryColor] = useState(formData.primaryColor);
  const [markings, setMarkings] = useState(formData.markings);

  const updateFormData = (updates: Partial<AddDogFormData>) => {
    onFormChange({
      gender,
      weight,
      weightUnit,
      height,
      heightUnit,
      isSterilized,
      primaryColor,
      markings,
      ...updates,
    });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerRow}>
          <Text style={styles.stepText}>Step 2 of 6</Text>
          <Text style={styles.headerLabel}>Physical Identity</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <View style={styles.photoWrap}>
          <View style={styles.photoCircle}>
            <Image
              source={{
                uri:
                  petPhotoUri ||
                  "https://images.dog.ceo/breeds/vizsla/n02100583_11523.jpg",
              }}
              style={styles.petPhoto}
            />
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gender</Text>
          <View style={styles.genderControl}>
            <AnimatedSegmentedControl
              accessibilityLabel="Gender"
              onChange={(nextGender) => {
                setGender(nextGender);
                updateFormData({ gender: nextGender });
              }}
              options={genderOptions}
              value={gender}
            />
          </View>
        </View>

        <MeasurementCard
          label="Weight"
          value={weight}
          placeholder="0.0"
          onChangeText={(value) => {
            setWeight(value);
            updateFormData({ weight: value });
          }}
          unit={weightUnit}
          firstUnit="kg"
          secondUnit="lb"
          onUnitChange={(unit) => {
            setWeightUnit(unit);
            updateFormData({ weightUnit: unit });
          }}
        />

        <MeasurementCard
          label="Height (at shoulder)"
          value={height}
          placeholder="0.0"
          onChangeText={(value) => {
            setHeight(value);
            updateFormData({ height: value });
          }}
          unit={heightUnit}
          firstUnit="cm"
          secondUnit="in"
          onUnitChange={(unit) => {
            setHeightUnit(unit);
            updateFormData({ heightUnit: unit });
          }}
        />

        <View style={[styles.card, styles.statusCard]}>
          <View style={styles.statusCopy}>
            <Text style={styles.cardTitle}>Sterilization Status</Text>
            <Text style={styles.statusText}>
              Have I been neutered or spayed?
            </Text>
          </View>
          <IOSSwitch
            accessibilityLabel="Sterilization status"
            value={isSterilized}
            onValueChange={(nextValue) => {
              setSterilized(nextValue);
              updateFormData({ isSterilized: nextValue });
            }}
          />
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Primary Color</Text>
          <View style={styles.colorInputWrap}>
            <FontAwesome5 name="palette" size={17} color={colors.muted} />
            <TextInput
              style={styles.input}
              placeholder="Select or type color"
              placeholderTextColor={colors.body}
              value={primaryColor}
              onChangeText={(value) => {
                setPrimaryColor(value);
                updateFormData({ primaryColor: value });
              }}
            />
          </View>
          <View style={styles.chipRow}>
            {colorSuggestions.map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.chip,
                  primaryColor.trim().toLowerCase() === item.toLowerCase() &&
                    styles.chipSelected,
                ]}
                onPress={() => {
                  setPrimaryColor(item);
                  updateFormData({ primaryColor: item });
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    primaryColor.trim().toLowerCase() === item.toLowerCase() &&
                      styles.chipTextSelected,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.markingsCard}>
          <Text style={styles.cardTitle}>Distinguishing Markings</Text>
          <TextInput
            style={[styles.input, styles.markingsInput]}
            placeholder="Scars, spots, unique coat pattern..."
            placeholderTextColor={colors.borderStrong}
            value={markings}
            onChangeText={(value) => {
              setMarkings(value);
              updateFormData({ markings: value });
            }}
            multiline
          />
        </View>
      </ScrollView>

      <View style={styles.bottomActions}>
        <Pressable style={styles.backButton} onPress={onBackPress}>
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Pressable style={styles.nextButton} onPress={onNextPress}>
          <Text style={styles.nextText}>Continue</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.card} />
        </Pressable>
      </View>
    </View>
  );
}

type MeasurementCardProps<T extends string> = {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  unit: T;
  firstUnit: T;
  secondUnit: T;
  onUnitChange: (unit: T) => void;
};

function MeasurementCard<T extends string>({
  label,
  value,
  placeholder,
  onChangeText,
  unit,
  firstUnit,
  secondUnit,
  onUnitChange,
}: MeasurementCardProps<T>) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{label}</Text>
      <View style={styles.measureInputWrap}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={colors.body}
          keyboardType="decimal-pad"
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/[^0-9.]/g, ""))}
        />
        <View style={styles.unitToggle}>
          <AnimatedSegmentedControl
            compact
            onChange={onUnitChange}
            options={[firstUnit, secondUnit]}
            value={unit}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  content: {
    paddingBottom: 78,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepText: {
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
    marginTop: 10,
    marginBottom: 18,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.progressTrack,
    overflow: "hidden",
  },
  progressFill: {
    width: "33.33%",
    height: "100%",
    backgroundColor: colors.primary,
  },
  photoWrap: {
    alignSelf: "center",
    width: 120,
    height: 120,
    marginTop: 0,
  },
  photoCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
    borderColor: colors.borderStrong,
    overflow: "hidden",
    backgroundColor: colors.disabled,
  },
  petPhoto: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  card: {
    marginTop: 12,
    ...cardSurface,
  },
  cardTitle: {
    color: colors.body,
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
  genderControl: {
    marginTop: 9,
  },
  measureInputWrap: {
    height: 40,
    marginTop: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 12,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontFamily: fontFamily.regular,
    paddingVertical: 0,
  },
  unitToggle: {
    width: 92,
    height: 36,
  },
  statusCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  statusCopy: {
    flex: 1,
  },
  statusText: {
    marginTop: 4,
    color: colors.body,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontFamily.regular,
  },
  colorInputWrap: {
    height: 40,
    marginTop: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 8,
  },
  chipRow: {
    marginTop: 9,
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 7,
  },
  chip: {
    height: 26,
    borderRadius: 15,
    backgroundColor: colors.disabled,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  chipSelected: {
    backgroundColor: colors.primary,
  },
  chipText: {
    color: colors.body,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  chipTextSelected: {
    color: colors.card,
    fontFamily: fontFamily.extraBold,
  },
  markingsCard: {
    marginTop: 12,
    ...cardSurface,
  },
  markingsInput: {
    minHeight: 44,
    marginTop: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: 10,
    textAlignVertical: "top",
    fontSize: 13,
  },
  bottomActions: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 8,
    borderTopWidth: 1,
    borderTopColor: colors.borderStrong,
    backgroundColor: colors.background,
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
  backText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fontFamily.bold,
  },
  nextButton: {
    flex: 1,
    height: 50,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  nextText: {
    color: colors.card,
    fontSize: 15,
    fontFamily: fontFamily.extraBold,
  },
});
