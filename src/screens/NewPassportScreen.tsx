import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { FontAwesome5 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useEffect, useRef, useState } from 'react';
import { Animated, Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

const speciesOptions = ['Canine', 'Feline', 'Other'] as const;
export type Species = (typeof speciesOptions)[number];
type PassportErrors = {
  petName?: string;
  breed?: string;
  birthDate?: string;
};

const breedOptions: Record<Species, string[]> = {
  Canine: [
    'Affenpinscher',
    'Afghan Hound',
    'Airedale Terrier',
    'Akita',
    'Alaskan Malamute',
    'American Bulldog',
    'American Eskimo Dog',
    'American Foxhound',
    'American Pit Bull Terrier',
    'American Staffordshire Terrier',
    'Anatolian Shepherd Dog',
    'Australian Cattle Dog',
    'Australian Shepherd',
    'Australian Terrier',
    'Basenji',
    'Basset Hound',
    'Beagle',
    'Bearded Collie',
    'Beauceron',
    'Bedlington Terrier',
    'Belgian Malinois',
    'Belgian Sheepdog',
    'Belgian Tervuren',
    'Bernese Mountain Dog',
    'Bichon Frise',
    'Black and Tan Coonhound',
    'Bloodhound',
    'Bluetick Coonhound',
    'Border Collie',
    'Border Terrier',
    'Borzoi',
    'Boston Terrier',
    'Bouvier des Flandres',
    'Boxer',
    'Boykin Spaniel',
    'Brittany',
    'Brussels Griffon',
    'Bull Terrier',
    'Bulldog',
    'Bullmastiff',
    'Cairn Terrier',
    'Cane Corso',
    'Cardigan Welsh Corgi',
    'Cavalier King Charles Spaniel',
    'Chesapeake Bay Retriever',
    'Chihuahua',
    'Chinese Shar-Pei',
    'Chinese Crested',
    'Chow Chow',
    'Clumber Spaniel',
    'Cockapoo',
    'Cocker Spaniel',
    'Collie',
    'Coton de Tulear',
    'Curly-Coated Retriever',
    'Dachshund',
    'Dalmatian',
    'Dandie Dinmont Terrier',
    'Doberman Pinscher',
    'Dogo Argentino',
    'Dogue de Bordeaux',
    'English Cocker Spaniel',
    'English Foxhound',
    'English Springer Spaniel',
    'English Toy Spaniel',
    'Entlebucher Mountain Dog',
    'Field Spaniel',
    'Finnish Spitz',
    'Flat-Coated Retriever',
    'French Bulldog',
    'German Pinscher',
    'German Shepherd',
    'German Shorthaired Pointer',
    'German Wirehaired Pointer',
    'Giant Schnauzer',
    'Glen of Imaal Terrier',
    'Goldador',
    'Golden Retriever',
    'Goldendoodle',
    'Gordon Setter',
    'Great Dane',
    'Great Pyrenees',
    'Greater Swiss Mountain Dog',
    'Greyhound',
    'Harrier',
    'Havanese',
    'Ibizan Hound',
    'Irish Red and White Setter',
    'Irish Setter',
    'Irish Terrier',
    'Irish Water Spaniel',
    'Irish Wolfhound',
    'Italian Greyhound',
    'Jack Russell Terrier',
    'Japanese Chin',
    'Keeshond',
    'Kerry Blue Terrier',
    'Komondor',
    'Kuvasz',
    'Labradoodle',
    'Labrador Retriever',
    'Lagotto Romagnolo',
    'Lakeland Terrier',
    'Leonberger',
    'Lhasa Apso',
    'Lowchen',
    'Maltese',
    'Manchester Terrier',
    'Mastiff',
    'Miniature Schnauzer',
    'Miniature Pinscher',
    'Miniature Poodle',
    'Neapolitan Mastiff',
    'Mixed Breed',
    'Newfoundland',
    'Norfolk Terrier',
    'Norwegian Buhund',
    'Norwegian Elkhound',
    'Norwich Terrier',
    'Nova Scotia Duck Tolling Retriever',
    'Old English Sheepdog',
    'Otterhound',
    'Papillon',
    'Parson Russell Terrier',
    'Pekingese',
    'Pembroke Welsh Corgi',
    'Petit Basset Griffon Vendeen',
    'Pharaoh Hound',
    'Plott Hound',
    'Pointer',
    'Pomeranian',
    'Poodle',
    'Portuguese Water Dog',
    'Presa Canario',
    'Pug',
    'Puli',
    'Rat Terrier',
    'Redbone Coonhound',
    'Rhodesian Ridgeback',
    'Rottweiler',
    'Russell Terrier',
    'Saluki',
    'Saint Bernard',
    'Samoyed',
    'Schipperke',
    'Scottish Deerhound',
    'Scottish Terrier',
    'Sealyham Terrier',
    'Shar Pei',
    'Shetland Sheepdog',
    'Shiba Inu',
    'Shih Tzu',
    'Siberian Husky',
    'Silky Terrier',
    'Skye Terrier',
    'Smooth Fox Terrier',
    'Soft Coated Wheaten Terrier',
    'Spanish Water Dog',
    'Spinone Italiano',
    'Staffordshire Bull Terrier',
    'Standard Schnauzer',
    'Standard Poodle',
    'Sussex Spaniel',
    'Tibetan Mastiff',
    'Tibetan Spaniel',
    'Tibetan Terrier',
    'Toy Fox Terrier',
    'Toy Poodle',
    'Treeing Walker Coonhound',
    'Vizsla',
    'Weimaraner',
    'Welsh Springer Spaniel',
    'Welsh Terrier',
    'West Highland White Terrier',
    'Whippet',
    'Wire Fox Terrier',
    'Wirehaired Pointing Griffon',
    'Xoloitzcuintli',
    'Yorkshire Terrier'
  ],
  Feline: [
    'Abyssinian',
    'American Bobtail',
    'American Curl',
    'American Shorthair',
    'Balinese',
    'Bengal',
    'Birman',
    'Bombay',
    'British Shorthair',
    'Burmese',
    'Chartreux',
    'Cornish Rex',
    'Devon Rex',
    'Domestic Longhair',
    'Domestic Mediumhair',
    'Domestic Shorthair',
    'Egyptian Mau',
    'Exotic Shorthair',
    'Himalayan',
    'Maine Coon',
    'Manx',
    'Mixed Breed',
    'Norwegian Forest Cat',
    'Ocicat',
    'Oriental Shorthair',
    'Persian',
    'Ragdoll',
    'Russian Blue',
    'Savannah',
    'Scottish Fold',
    'Selkirk Rex',
    'Siamese',
    'Siberian',
    'Sphynx',
    'Tonkinese',
    'Turkish Angora'
  ],
  Other: [
    'Bird',
    'Rabbit',
    'Guinea Pig',
    'Hamster',
    'Ferret',
    'Reptile',
    'Turtle',
    'Fish',
    'Horse',
    'Goat',
    'Mixed Species',
    'Other'
  ]
};
const dogCeoBreedPaths: Record<string, string> = {
  Affenpinscher: 'affenpinscher',
  'Afghan Hound': 'hound/afghan',
  'Airedale Terrier': 'airedale',
  Akita: 'akita',
  'Alaskan Malamute': 'malamute',
  'Australian Shepherd': 'australian/shepherd',
  Basenji: 'basenji',
  'Basset Hound': 'hound/basset',
  Beagle: 'beagle',
  'Bernese Mountain Dog': 'mountain/bernese',
  'Bichon Frise': 'frise/bichon',
  'Border Collie': 'collie/border',
  'Boston Terrier': 'terrier/boston',
  Boxer: 'boxer',
  Bulldog: 'bulldog/english',
  'Cane Corso': 'cane/corso',
  Chihuahua: 'chihuahua',
  'Chow Chow': 'chow',
  'Cocker Spaniel': 'spaniel/cocker',
  Collie: 'collie',
  Dachshund: 'dachshund',
  Dalmatian: 'dalmatian',
  'Doberman Pinscher': 'doberman',
  'English Springer Spaniel': 'springer/english',
  'French Bulldog': 'bulldog/french',
  'German Shepherd': 'germanshepherd',
  'Golden Retriever': 'retriever/golden',
  'Great Dane': 'dane/great',
  Greyhound: 'greyhound/italian',
  Havanese: 'havanese',
  'Irish Setter': 'setter/irish',
  'Labrador Retriever': 'retriever/labrador',
  'Lhasa Apso': 'lhasa',
  Maltese: 'maltese',
  Mastiff: 'mastiff/english',
  'Miniature Schnauzer': 'schnauzer/miniature',
  Newfoundland: 'newfoundland',
  Papillon: 'papillon',
  Pomeranian: 'pomeranian',
  Poodle: 'poodle/standard',
  Pug: 'pug',
  Rottweiler: 'rottweiler',
  'Saint Bernard': 'stbernard',
  Samoyed: 'samoyed',
  'Shar Pei': 'sharpei',
  'Shetland Sheepdog': 'sheepdog/shetland',
  'Shiba Inu': 'shiba',
  'Shih Tzu': 'shihtzu',
  'Siberian Husky': 'husky',
  Vizsla: 'vizsla',
  Weimaraner: 'weimaraner',
  Whippet: 'whippet',
  'Yorkshire Terrier': 'terrier/yorkshire'
};

type NewPassportScreenProps = {
  formData: NewPassportFormData;
  onFormChange: (formData: NewPassportFormData) => void;
  onContinue?: () => void;
};

export type NewPassportFormData = {
  species: Species;
  petName: string;
  petPhotoUri: string;
  breed: string;
  birthDate: string;
};

export const initialNewPassportFormData: NewPassportFormData = {
  species: 'Canine',
  petName: '',
  petPhotoUri: '',
  breed: '',
  birthDate: ''
};

export function NewPassportScreen({ formData, onFormChange, onContinue }: NewPassportScreenProps) {
  const [species, setSpecies] = useState<Species>(formData.species);
  const [petName, setPetName] = useState(formData.petName);
  const [petPhotoUri, setPetPhotoUri] = useState(formData.petPhotoUri);
  const [breed, setBreed] = useState(formData.breed);
  const [breedQuery, setBreedQuery] = useState('');
  const [breedImages, setBreedImages] = useState<Record<string, string>>({});
  const [isBreedDropdownOpen, setBreedDropdownOpen] = useState(false);
  const [birthDate, setBirthDate] = useState(formData.birthDate);
  const [selectedBirthDate, setSelectedBirthDate] = useState<Date | null>(parseBirthDate(formData.birthDate));
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState('');
  const [segmentedWidth, setSegmentedWidth] = useState(0);
  const tabAnimation = useRef(new Animated.Value(0)).current;
  const verifiedBreed = resolveBreedSelection({ species, breed, breedQuery });
  const errors = getPassportErrors({ petName, breed: verifiedBreed, species, birthDate });
  const isFormValid = Object.keys(errors).length === 0;
  const showErrors = submitted;
  const activeBreedText = isBreedDropdownOpen ? breedQuery : breed;
  const filteredBreeds = breedOptions[species]
    .filter((item) => item.toLowerCase().includes(breedQuery.trim().toLowerCase()))
    .slice(0, 7);

  const updateFormData = (updates: Partial<NewPassportFormData>) => {
    onFormChange({ species, petName, petPhotoUri, breed, birthDate, ...updates });
  };

  useEffect(() => {
    if (species !== 'Canine' || !isBreedDropdownOpen) {
      return;
    }

    let isMounted = true;
    const breedsToFetch = filteredBreeds.filter((item) => dogCeoBreedPaths[item] && !breedImages[item]);

    breedsToFetch.forEach(async (item) => {
      try {
        const response = await fetch(`https://dog.ceo/api/breed/${dogCeoBreedPaths[item]}/images/random`);
        const payload = (await response.json()) as { status?: string; message?: string };

        if (isMounted && payload.status === 'success' && payload.message) {
          setBreedImages((current) => ({ ...current, [item]: payload.message ?? '' }));
        }
      } catch {
        // Keep the local placeholder when the remote image cannot be fetched.
      }
    });

    return () => {
      isMounted = false;
    };
  }, [breedImages, filteredBreeds, isBreedDropdownOpen, species]);

  useEffect(() => {
    Animated.spring(tabAnimation, {
      toValue: speciesOptions.indexOf(species),
      useNativeDriver: true,
      friction: 8,
      tension: 90
    }).start();
  }, [species, tabAnimation]);

  const segmentWidth = segmentedWidth > 0 ? (segmentedWidth - 8) / speciesOptions.length : 0;

  const clearVerification = () => {
    if (verificationMessage) {
      setVerificationMessage('');
    }
  };

  const handlePickPetPhoto = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.85
    });

    if (!result.canceled && result.assets[0]?.uri) {
      clearVerification();
      setPetPhotoUri(result.assets[0].uri);
      updateFormData({ petPhotoUri: result.assets[0].uri });
    }
  };

  const handleContinue = () => {
    const nextBreed = resolveBreedSelection({ species, breed, breedQuery });
    const nextErrors = getPassportErrors({ petName, breed: nextBreed, species, birthDate });

    setSubmitted(true);
    setVerificationMessage('');
    setBreedDropdownOpen(false);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    setBreed(nextBreed);
    setBreedQuery('');
    updateFormData({ breed: nextBreed });
    setVerificationMessage('Pet identity verified. Continue to medical history.');
    onContinue?.();
  };

  return (
    <View style={styles.screen}>
      <View style={styles.headerRow}>
        <Text style={styles.stepText}>Step 1 of 3</Text>
        <Text style={styles.headerLabel}>Primary Identity</Text>
      </View>

      <View style={styles.progressRow}>
        <View style={styles.progressFill} />
      </View>

      <Text style={styles.title}>Tell us about your pet</Text>
      <Text style={styles.subtitle}>Step 1: Primary Identity Details</Text>

      <View style={styles.photoWrap}>
        <Pressable style={styles.photoCircle} onPress={handlePickPetPhoto}>
          {petPhotoUri ? (
            <Image source={{ uri: petPhotoUri }} style={styles.petPhoto} />
          ) : (
            <>
              <FontAwesome5 name="camera" size={28} color={colors.muted} />
              <Text style={styles.photoText}>Add Photo</Text>
            </>
          )}
        </Pressable>
        <Pressable style={styles.editPhotoButton} onPress={handlePickPetPhoto}>
          <FontAwesome5 name="pencil-alt" size={11} color="#FFFFFF" />
        </Pressable>
      </View>

      <Text style={styles.label}>Pet Name</Text>
      <View style={[styles.inputWrap, showErrors && errors.petName && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder="e.g. Luna"
          placeholderTextColor="#B7C5C8"
          value={petName}
          autoCapitalize="words"
          returnKeyType="next"
          onChangeText={(value) => {
            clearVerification();
            setPetName(value);
            updateFormData({ petName: value });
          }}
        />
      </View>
      {showErrors && errors.petName ? <Text style={styles.errorText}>{errors.petName}</Text> : null}

      <Text style={styles.label}>Species</Text>
      <View
        style={styles.segmented}
        onLayout={(event) => setSegmentedWidth(event.nativeEvent.layout.width)}
      >
        {segmentWidth > 0 ? (
          <Animated.View
            style={[
              styles.segmentIndicator,
              {
                width: segmentWidth,
                transform: [
                  {
                    translateX: tabAnimation.interpolate({
                      inputRange: [0, 1, 2],
                      outputRange: [0, segmentWidth, segmentWidth * 2]
                    })
                  }
                ]
              }
            ]}
          />
        ) : null}
        {speciesOptions.map((option) => (
          <Pressable
            key={option}
            onPress={() => {
              clearVerification();
              setSpecies(option);
              setBreed('');
              setBreedQuery('');
              setBreedDropdownOpen(false);
              updateFormData({ species: option, breed: '' });
            }}
            style={styles.segment}
          >
            <Text style={[styles.segmentText, species === option && styles.segmentTextActive]}>{option}</Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.label}>Breed</Text>
      <View style={styles.breedField}>
        <Pressable
          style={[styles.inputWrap, styles.breedInputWrap, showErrors && errors.breed && styles.inputError]}
          onPress={() => {
            setBreedQuery('');
            setBreedDropdownOpen(true);
          }}
        >
          <FontAwesome5 name="search" size={15} color="#B7C5C8" />
          <TextInput
            style={styles.input}
            placeholder="Search breeds..."
            placeholderTextColor="#B7C5C8"
            value={activeBreedText}
            onFocus={() => {
              setBreedQuery('');
              setBreedDropdownOpen(true);
            }}
            onPressIn={() => {
              setBreedQuery('');
              setBreedDropdownOpen(true);
            }}
            onChangeText={(value) => {
              clearVerification();
              setBreed('');
              setBreedQuery(value);
              setBreedDropdownOpen(true);
              updateFormData({ breed: '' });
            }}
          />
          <Pressable
            onPress={() => {
              setBreedQuery('');
              setBreedDropdownOpen((value) => !value);
            }}
            hitSlop={10}
          >
            <FontAwesome5 name={isBreedDropdownOpen ? 'chevron-up' : 'chevron-down'} size={12} color="#B7C5C8" />
          </Pressable>
        </Pressable>
        {isBreedDropdownOpen ? (
          <View style={styles.dropdown}>
            {filteredBreeds.map((item) => (
              <Pressable
                key={item}
                style={[styles.dropdownItem, breed === item && styles.dropdownItemSelected]}
                onPress={() => {
                  clearVerification();
                  setBreed(item);
                  setBreedQuery('');
                  setBreedDropdownOpen(false);
                  updateFormData({ breed: item });
                }}
              >
                <View style={styles.breedThumb}>
                  {breedImages[item] ? (
                    <Image source={{ uri: breedImages[item] }} style={styles.breedImage} />
                  ) : (
                    <FontAwesome5 name={species === 'Canine' ? 'dog' : 'paw'} size={15} color={colors.muted} />
                  )}
                </View>
                <Text style={[styles.dropdownText, breed === item && styles.dropdownTextSelected]}>{item}</Text>
                {breed === item ? <FontAwesome5 name="check" size={12} color={colors.primary} /> : null}
              </Pressable>
            ))}
            {filteredBreeds.length === 0 ? <Text style={styles.noResultsText}>No matching breeds</Text> : null}
          </View>
        ) : null}
      </View>
      {showErrors && errors.breed ? <Text style={styles.errorText}>{errors.breed}</Text> : null}

      <Text style={styles.label}>Date of Birth</Text>
      <View style={[styles.inputWrap, showErrors && errors.birthDate && styles.inputError]}>
        <TextInput
          style={styles.input}
          placeholder="dd/mm/yy"
          placeholderTextColor={colors.ink}
          keyboardType="number-pad"
          maxLength={8}
          value={birthDate}
          onChangeText={(value) => {
            clearVerification();
            const formattedDate = formatDateInput(value);
            setBirthDate(formattedDate);
            setSelectedBirthDate(parseBirthDate(formattedDate));
            updateFormData({ birthDate: formattedDate });
          }}
        />
        <Pressable onPress={() => setShowDatePicker(true)} hitSlop={10}>
          <FontAwesome5 name="calendar-alt" size={17} color="#B7C5C8" />
        </Pressable>
      </View>
      {showErrors && errors.birthDate ? <Text style={styles.errorText}>{errors.birthDate}</Text> : null}
      {showDatePicker ? (
        <DateTimePicker
          value={selectedBirthDate ?? new Date(2020, 0, 1)}
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(event: DateTimePickerEvent, date?: Date) => {
            setShowDatePicker(false);

            if (event.type === 'set' && date) {
              clearVerification();
              setSelectedBirthDate(date);
              const formattedDate = formatDateFromDate(date);
              setBirthDate(formattedDate);
              updateFormData({ birthDate: formattedDate });
            }
          }}
        />
      ) : null}

      <View style={styles.bottomActions}>
        <Pressable
          onPress={handleContinue}
          style={({ pressed }) => [
            styles.continueButton,
            submitted && !isFormValid && styles.continueButtonDisabled,
            pressed && styles.continueButtonPressed
          ]}
        >
          <Text style={styles.continueText}>Continue</Text>
          <FontAwesome5 name="arrow-right" size={18} color="#FFFFFF" />
        </Pressable>

        {verificationMessage ? <Text style={styles.successText}>{verificationMessage}</Text> : null}
        <Text style={styles.footerText}>You can add medical history in the next step.</Text>
      </View>
    </View>
  );
}

function formatDateInput(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 6);
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
  const day = `${date.getDate()}`.padStart(2, '0');
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const year = `${date.getFullYear()}`.slice(-2);

  return `${day}/${month}/${year}`;
}

function parseBirthDate(value: string) {
  if (value.length !== 8) {
    return null;
  }

  const [dayText, monthText, yearText] = value.split('/');
  const day = Number(dayText);
  const month = Number(monthText);
  const year = resolveTwoDigitYear(Number(yearText));
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

function getBirthDateError(value: string) {
  const date = parseBirthDate(value);

  if (!date) {
    return 'Enter a valid date.';
  }

  if (date > new Date()) {
    return 'Date of birth cannot be in the future.';
  }

  if (getAgeInYears(date) > 20) {
    return 'Please enter an age of 20 years or younger.';
  }

  return '';
}

function resolveTwoDigitYear(year: number) {
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const candidate = currentCentury + year;

  if (candidate > currentYear) {
    return candidate - 100;
  }

  return candidate;
}

function getAgeInYears(date: Date) {
  const today = new Date();
  let age = today.getFullYear() - date.getFullYear();
  const birthdayPassed =
    today.getMonth() > date.getMonth() ||
    (today.getMonth() === date.getMonth() && today.getDate() >= date.getDate());

  if (!birthdayPassed) {
    age -= 1;
  }

  return age;
}

function getPassportErrors({
  petName,
  breed,
  species,
  birthDate
}: {
  petName: string;
  breed: string;
  species: Species;
  birthDate: string;
}) {
  const errors: PassportErrors = {};
  const trimmedPetName = petName.trim();

  if (!trimmedPetName) {
    errors.petName = 'Pet name is required.';
  } else if (trimmedPetName.length < 2) {
    errors.petName = 'Pet name must be at least 2 characters.';
  }

  if (!breed) {
    errors.breed = 'Select a breed from the list.';
  } else if (!breedOptions[species].includes(breed)) {
    errors.breed = 'Select a valid breed from the list.';
  }

  if (!birthDate) {
    errors.birthDate = 'Date of birth is required.';
  } else if (birthDate.length !== 8) {
    errors.birthDate = 'Use dd/mm/yy format.';
  } else {
    const birthDateError = getBirthDateError(birthDate);

    if (birthDateError) {
      errors.birthDate = birthDateError;
    }
  }

  return errors;
}

function resolveBreedSelection({
  species,
  breed,
  breedQuery
}: {
  species: Species;
  breed: string;
  breedQuery: string;
}) {
  const trimmedQuery = breedQuery.trim();

  if (!trimmedQuery) {
    return breed;
  }

  const exactMatch = breedOptions[species].find((item) => item.toLowerCase() === trimmedQuery.toLowerCase());

  return exactMatch ?? breed;
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    paddingTop: 8
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
  progressRow: {
    marginTop: 10,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#D8E3E5',
    overflow: 'hidden'
  },
  progressFill: {
    width: '33.33%',
    height: '100%',
    backgroundColor: colors.accent
  },
  title: {
    marginTop: 26,
    color: colors.ink,
    fontSize: 23,
    lineHeight: 28,
    textAlign: 'center',
    fontFamily: fontFamily.black
  },
  subtitle: {
    marginTop: 5,
    color: colors.body,
    fontSize: 13,
    textAlign: 'center',
    fontFamily: fontFamily.regular
  },
  photoWrap: {
    alignSelf: 'center',
    marginTop: 22,
    width: 120,
    height: 120
  },
  photoCircle: {
    width: 116,
    height: 116,
    borderRadius: 58,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#B9CBCD',
    backgroundColor: colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  },
  petPhoto: {
    width: '100%',
    height: '100%'
  },
  photoText: {
    marginTop: 5,
    color: colors.muted,
    fontSize: 12,
    fontFamily: fontFamily.semiBold
  },
  editPhotoButton: {
    position: 'absolute',
    right: 0,
    bottom: 2,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center'
  },
  label: {
    marginTop: 16,
    marginBottom: 6,
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.semiBold
  },
  inputWrap: {
    height: 42,
    borderRadius: 11,
    borderWidth: 1.2,
    borderColor: '#B9CBCD',
    backgroundColor: colors.card,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    gap: 10
  },
  breedInputWrap: {
    zIndex: 4
  },
  breedField: {
    position: 'relative',
    zIndex: 20
  },
  inputError: {
    borderColor: '#B91C1C',
    backgroundColor: '#FFF7F7'
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    paddingVertical: 0
  },
  errorText: {
    marginTop: 5,
    color: '#B91C1C',
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fontFamily.medium
  },
  segmented: {
    height: 44,
    borderRadius: 15,
    backgroundColor: '#DDE5E6',
    flexDirection: 'row',
    padding: 4,
    overflow: 'hidden'
  },
  segmentIndicator: {
    position: 'absolute',
    top: 4,
    bottom: 4,
    left: 4,
    borderRadius: 12,
    backgroundColor: colors.primary
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1
  },
  segmentText: {
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.semiBold
  },
  segmentTextActive: {
    color: '#FFFFFF'
  },
  dropdown: {
    position: 'absolute',
    top: 46,
    left: 0,
    right: 0,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#B9CBCD',
    backgroundColor: colors.card,
    overflow: 'hidden',
    zIndex: 30,
    elevation: 0,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0
  },
  dropdownItem: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border
  },
  dropdownItemSelected: {
    backgroundColor: '#E6F7F7'
  },
  dropdownText: {
    flex: 1,
    color: colors.body,
    fontSize: 12,
    fontFamily: fontFamily.medium
  },
  dropdownTextSelected: {
    color: colors.primary,
    fontFamily: fontFamily.extraBold
  },
  breedThumb: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#E8F2F3',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center'
  },
  breedImage: {
    width: '100%',
    height: '100%'
  },
  noResultsText: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: colors.muted,
    fontSize: 11,
    fontFamily: fontFamily.medium
  },
  continueButton: {
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  continueButtonPressed: {
    backgroundColor: '#00676B'
  },
  continueButtonDisabled: {
    backgroundColor: '#8EA6A8'
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: fontFamily.extraBold
  },
  bottomActions: {
    marginTop: 'auto',
    paddingTop: 18,
    paddingBottom: 28
  },
  footerText: {
    marginTop: 12,
    color: colors.muted,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: fontFamily.medium
  },
  successText: {
    marginTop: 9,
    color: colors.primary,
    fontSize: 12,
    textAlign: 'center',
    fontFamily: fontFamily.semiBold
  }
});
