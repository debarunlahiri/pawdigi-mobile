import { FontAwesome5 } from '@expo/vector-icons';
import { useRef, useState } from 'react';
import { Animated, ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

const genderOptions = ['Male', 'Female'] as const;
const colorSuggestions = ['Black', 'Golden', 'Chocolate', 'White'];

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
  weightUnit: 'kg' | 'lb';
  height: string;
  heightUnit: 'cm' | 'in';
  isSterilized: boolean;
  primaryColor: string;
  markings: string;
};

export const initialAddDogFormData: AddDogFormData = {
  gender: 'Male',
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  isSterilized: false,
  primaryColor: '',
  markings: ''
};

export function AddDogScreen({ formData, petPhotoUri, onFormChange, onBackPress, onNextPress }: AddDogScreenProps) {
  const [gender, setGender] = useState<Gender>(formData.gender);
  const [weight, setWeight] = useState(formData.weight);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(formData.weightUnit);
  const [height, setHeight] = useState(formData.height);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'in'>(formData.heightUnit);
  const [isSterilized, setSterilized] = useState(formData.isSterilized);
  const [primaryColor, setPrimaryColor] = useState(formData.primaryColor);
  const [markings, setMarkings] = useState(formData.markings);
  const [genderSegmentWidth, setGenderSegmentWidth] = useState(0);
  const genderAnimation = useRef(new Animated.Value(genderOptions.indexOf(formData.gender))).current;
  const genderOptionWidth = genderSegmentWidth > 0 ? (genderSegmentWidth - 10) / genderOptions.length : 0;

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
      ...updates
    });
  };

  const handleGenderPress = (nextGender: Gender) => {
    setGender(nextGender);
    updateFormData({ gender: nextGender });
    Animated.spring(genderAnimation, {
      toValue: genderOptions.indexOf(nextGender),
      useNativeDriver: true,
      friction: 8,
      tension: 90
    }).start();
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.content}
      >
        <View style={styles.headerRow}>
          <Text style={styles.stepText}>Step 2 of 3</Text>
          <Text style={styles.headerLabel}>Physical Identity</Text>
        </View>

        <View style={styles.progressTrack}>
          <View style={styles.progressFill} />
        </View>

        <ImageBackground
          source={{ uri: petPhotoUri || 'https://images.dog.ceo/breeds/vizsla/n02100583_11523.jpg' }}
          style={styles.dogPreview}
          imageStyle={styles.dogPreviewImage}
        >
          <View style={styles.previewOverlay}>
            <Text style={styles.previewMeta}>Add Dog: Physical Details</Text>
            <Text style={styles.previewMeta}>Barkley - ID: A009</Text>
          </View>
          <View style={styles.previewBadge}>
            <FontAwesome5 name="image" size={10} color="#FFFFFF" />
          </View>
        </ImageBackground>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Gender</Text>
          <View
            style={styles.genderSegment}
            onLayout={(event) => setGenderSegmentWidth(event.nativeEvent.layout.width)}
          >
            {genderOptionWidth > 0 ? (
              <Animated.View
                style={[
                  styles.genderIndicator,
                  {
                    width: genderOptionWidth,
                    transform: [
                      {
                        translateX: genderAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [0, genderOptionWidth]
                        })
                      }
                    ]
                  }
                ]}
              />
            ) : null}
            {genderOptions.map((option) => (
              <Pressable key={option} style={styles.genderOption} onPress={() => handleGenderPress(option)}>
                <Text style={[styles.genderText, gender === option && styles.genderTextActive]}>{option}</Text>
              </Pressable>
            ))}
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
            <Text style={styles.statusText}>Has the dog been neutered or spayed?</Text>
          </View>
          <Text style={styles.switchLabel}>No</Text>
          <Pressable
            accessibilityRole="switch"
            accessibilityState={{ checked: isSterilized }}
            onPress={() => {
              const nextValue = !isSterilized;
              setSterilized(nextValue);
              updateFormData({ isSterilized: nextValue });
            }}
            style={[styles.iosSwitchTrack, isSterilized && styles.iosSwitchTrackActive]}
          >
            <Animated.View style={[styles.iosSwitchThumb, isSterilized && styles.iosSwitchThumbActive]} />
          </Pressable>
          <Text style={[styles.switchLabel, isSterilized && styles.switchLabelActive]}>Yes</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Primary Color</Text>
          <View style={styles.colorInputWrap}>
            <FontAwesome5 name="palette" size={17} color={colors.muted} />
            <TextInput
              style={styles.input}
              placeholder="Select or type color"
              placeholderTextColor="#6E7B86"
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
                  primaryColor.trim().toLowerCase() === item.toLowerCase() && styles.chipSelected
                ]}
                onPress={() => {
                  setPrimaryColor(item);
                  updateFormData({ primaryColor: item });
                }}
              >
                <Text
                  style={[
                    styles.chipText,
                    primaryColor.trim().toLowerCase() === item.toLowerCase() && styles.chipTextSelected
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
            placeholderTextColor="#9AA8AD"
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
          <Text style={styles.nextText}>Next</Text>
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
  onUnitChange
}: MeasurementCardProps<T>) {
  return (
    <View style={styles.card}>
      <Text style={styles.cardTitle}>{label}</Text>
      <View style={styles.measureInputWrap}>
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#6B7280"
          keyboardType="decimal-pad"
          value={value}
          onChangeText={(text) => onChangeText(text.replace(/[^0-9.]/g, ''))}
        />
        <View style={styles.unitToggle}>
          <Pressable
            style={[styles.unitButton, unit === firstUnit && styles.unitButtonActive]}
            onPress={() => onUnitChange(firstUnit)}
          >
            <Text style={[styles.unitText, unit === firstUnit && styles.unitTextActive]}>{firstUnit}</Text>
          </Pressable>
          <Pressable
            style={[styles.unitButton, unit === secondUnit && styles.unitButtonActive]}
            onPress={() => onUnitChange(secondUnit)}
          >
            <Text style={[styles.unitText, unit === secondUnit && styles.unitTextActive]}>{secondUnit}</Text>
          </Pressable>
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
    paddingTop: 8
  },
  content: {
    paddingBottom: 78
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  stepText: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fontFamily.semiBold
  },
  headerLabel: {
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.semiBold
  },
  progressTrack: {
    marginTop: 10,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#DDE5E6',
    overflow: 'hidden'
  },
  progressFill: {
    width: '66.66%',
    height: '100%',
    backgroundColor: colors.primary
  },
  dogPreview: {
    height: 132,
    marginTop: 18,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#DDE5E6'
  },
  dogPreviewImage: {
    resizeMode: 'cover'
  },
  previewOverlay: {
    position: 'absolute',
    top: 8,
    left: 10
  },
  previewMeta: {
    color: colors.primary,
    fontSize: 5,
    fontFamily: fontFamily.medium
  },
  previewBadge: {
    position: 'absolute',
    right: 8,
    bottom: 8,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: 'rgba(0, 121, 125, 0.74)',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B9CBCD',
    backgroundColor: colors.card,
    padding: 12
  },
  cardTitle: {
    color: colors.body,
    fontSize: 14,
    fontFamily: fontFamily.semiBold
  },
  genderSegment: {
    height: 44,
    marginTop: 9,
    borderRadius: 10,
    backgroundColor: '#E7EEEE',
    flexDirection: 'row',
    padding: 5,
    overflow: 'hidden'
  },
  genderIndicator: {
    position: 'absolute',
    top: 5,
    left: 5,
    bottom: 5,
    borderRadius: 8,
    backgroundColor: colors.primary
  },
  genderOption: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  genderText: {
    color: colors.body,
    fontSize: 14,
    fontFamily: fontFamily.semiBold
  },
  genderTextActive: {
    color: '#FFFFFF'
  },
  measureInputWrap: {
    height: 40,
    marginTop: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#B9CBCD',
    backgroundColor: '#F2F8F9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 12
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontFamily: fontFamily.regular,
    paddingVertical: 0
  },
  unitToggle: {
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    gap: 4
  },
  unitButton: {
    minWidth: 40,
    height: 28,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center'
  },
  unitButtonActive: {
    backgroundColor: colors.card
  },
  unitText: {
    color: colors.body,
    fontSize: 12,
    fontFamily: fontFamily.semiBold
  },
  unitTextActive: {
    color: colors.primary
  },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8
  },
  statusCopy: {
    flex: 1
  },
  statusText: {
    marginTop: 4,
    color: colors.body,
    fontSize: 13,
    lineHeight: 18,
    fontFamily: fontFamily.regular
  },
  switchLabel: {
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.medium
  },
  switchLabelActive: {
    color: colors.primary,
    fontFamily: fontFamily.extraBold
  },
  iosSwitchTrack: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#E7EEEE',
    justifyContent: 'center',
    paddingHorizontal: 3
  },
  iosSwitchTrackActive: {
    backgroundColor: '#BFE8E8'
  },
  iosSwitchThumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2
  },
  iosSwitchThumbActive: {
    transform: [{ translateX: 18 }],
    backgroundColor: colors.primary
  },
  colorInputWrap: {
    height: 40,
    marginTop: 9,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#B9CBCD',
    backgroundColor: '#F2F8F9',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 8
  },
  chipRow: {
    marginTop: 9,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7
  },
  chip: {
    height: 26,
    borderRadius: 15,
    backgroundColor: '#DDE5E6',
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center'
  },
  chipSelected: {
    backgroundColor: colors.primary
  },
  chipText: {
    color: '#596A78',
    fontSize: 12,
    fontFamily: fontFamily.semiBold
  },
  chipTextSelected: {
    color: '#FFFFFF',
    fontFamily: fontFamily.extraBold
  },
  markingsCard: {
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B9CBCD',
    backgroundColor: colors.card,
    padding: 12
  },
  markingsInput: {
    minHeight: 44,
    marginTop: 8,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: '#B9CBCD',
    backgroundColor: '#F2F8F9',
    paddingHorizontal: 12,
    paddingTop: 10,
    textAlignVertical: 'top',
    fontSize: 13
  },
  bottomActions: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    paddingBottom: 12,
    borderTopWidth: 1,
    borderTopColor: '#B9CBCD',
    backgroundColor: colors.background
  },
  backButton: {
    width: 92,
    height: 42,
    borderRadius: 10,
    borderWidth: 1.2,
    borderColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.card
  },
  backText: {
    color: colors.primary,
    fontSize: 16,
    fontFamily: fontFamily.extraBold
  },
  nextButton: {
    flex: 1,
    height: 42,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nextText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: fontFamily.extraBold
  }
});
