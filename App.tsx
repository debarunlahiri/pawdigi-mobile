import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts,
} from "@expo-google-fonts/inter";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import { Animated, BackHandler, StyleSheet, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

import { FORM_HANDLING_AND_VERIFICATION_ENABLED } from "./src/config/features";
import {
  AddDogScreen,
  initialAddDogFormData,
} from "./src/screens/AddDogScreen";
import { ForgotPasswordScreen } from "./src/screens/ForgotPasswordScreen";
import {
  FinalIdentificationScreen,
  initialFinalIdentificationFormData,
} from "./src/screens/FinalIdentificationScreen";
import { EmailVerificationScreen } from "./src/screens/EmailVerificationScreen";
import type { VerificationChannel } from "./src/screens/EmailVerificationScreen";
import { HomeScreen, HomeTab } from "./src/screens/HomeScreen";
import type { HomePet } from "./src/screens/HomeFragment";
import {
  HealthNutritionScreen,
  initialHealthNutritionFormData,
} from "./src/screens/HealthNutritionScreen";
import {
  HoomansWhoMatterScreen,
  initialHoomansFormData,
} from "./src/screens/HoomansWhoMatterScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import {
  NewPassportScreen,
  initialNewPassportFormData,
} from "./src/screens/NewPassportScreen";
import { PassportCreatedScreen } from "./src/screens/PassportCreatedScreen";
import { RegisterScreen } from "./src/screens/RegisterScreen";
import { SplashScreen } from "./src/screens/SplashScreen";
import {
  initialSocialPersonalityFormData,
  SocialPersonalityScreen,
} from "./src/screens/SocialPersonalityScreen";
import { WelcomeScreen } from "./src/screens/WelcomeScreen";
import { colors } from "./src/theme/colors";

const passportDraftKey = "@pawdigi/passport-draft";

type AppScreen =
  | "welcome"
  | "login"
  | "forgot-password"
  | "register"
  | "email-verification"
  | "new-passport"
  | "add-dog"
  | "final-identification"
  | "social-personality"
  | "health-nutrition"
  | "hoomans-who-matter"
  | "passport-created"
  | "home";

type SetupScreen =
  | "new-passport"
  | "add-dog"
  | "final-identification"
  | "social-personality"
  | "health-nutrition"
  | "hoomans-who-matter";

const setupScreens: SetupScreen[] = [
  "new-passport",
  "add-dog",
  "final-identification",
  "social-personality",
  "health-nutrition",
  "hoomans-who-matter",
];

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<AppScreen>("welcome");
  const [currentSetupScreen, setCurrentSetupScreen] =
    useState<SetupScreen>("new-passport");
  const [hasSetupStarted, setSetupStarted] = useState(false);
  const [verificationMode, setVerificationMode] = useState<
    "reset" | "register"
  >("reset");
  const [verificationChannel, setVerificationChannel] =
    useState<VerificationChannel>("email");
  const [newPassportFormData, setNewPassportFormData] = useState(
    initialNewPassportFormData,
  );
  const [addDogFormData, setAddDogFormData] = useState(initialAddDogFormData);
  const [finalIdentificationFormData, setFinalIdentificationFormData] =
    useState(initialFinalIdentificationFormData);
  const [socialPersonalityFormData, setSocialPersonalityFormData] = useState(
    initialSocialPersonalityFormData,
  );
  const [healthNutritionFormData, setHealthNutritionFormData] = useState(
    initialHealthNutritionFormData,
  );
  const [hoomansFormData, setHoomansFormData] = useState(
    initialHoomansFormData,
  );
  const [isSetupComplete, setSetupComplete] = useState(false);
  const [savedPets, setSavedPets] = useState<HomePet[]>([]);
  const [homeTab, setHomeTab] = useState<HomeTab>("home");
  const screenTransition = useState(() => new Animated.Value(1))[0];
  const transitionDirection = useRef<1 | -1>(1);
  const [isDraftLoaded, setDraftLoaded] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black,
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    screenTransition.setValue(0);
    Animated.timing(screenTransition, {
      toValue: 1,
      duration: 260,
      useNativeDriver: true,
    }).start();
  }, [screen, screenTransition, showSplash]);

  const navigateWithSlide = (nextScreen: AppScreen, direction: 1 | -1) => {
    transitionDirection.current = direction;
    setScreen(nextScreen);
  };

  useEffect(() => {
    async function loadPassportDraft() {
      try {
        const savedDraft = await AsyncStorage.getItem(passportDraftKey);
        if (savedDraft) {
          const draft = JSON.parse(savedDraft);
          setNewPassportFormData({
            ...initialNewPassportFormData,
            ...draft.newPassport,
          });
          setAddDogFormData({ ...initialAddDogFormData, ...draft.addDog });
          setFinalIdentificationFormData({
            ...initialFinalIdentificationFormData,
            ...draft.finalIdentification,
          });
          setSocialPersonalityFormData({
            ...initialSocialPersonalityFormData,
            ...draft.socialPersonality,
          });
          setHealthNutritionFormData({
            ...initialHealthNutritionFormData,
            ...draft.healthNutrition,
          });
          setHoomansFormData({ ...initialHoomansFormData, ...draft.hoomans });
          setSavedPets(Array.isArray(draft.savedPets) ? draft.savedPets : []);
          setSetupComplete(Boolean(draft.isSetupComplete));

          const restoredSetupScreen = isSetupScreen(draft.currentSetupScreen)
            ? draft.currentSetupScreen
            : "new-passport";
          const setupStarted = Boolean(draft.hasSetupStarted);

          setCurrentSetupScreen(restoredSetupScreen);
          setSetupStarted(setupStarted);
        }
      } catch (error) {
        console.warn("Unable to restore passport draft", error);
      } finally {
        setDraftLoaded(true);
      }
    }

    loadPassportDraft();
  }, []);

  useEffect(() => {
    if (!isDraftLoaded) return;

    AsyncStorage.setItem(
      passportDraftKey,
      JSON.stringify({
        newPassport: newPassportFormData,
        addDog: addDogFormData,
        finalIdentification: finalIdentificationFormData,
        socialPersonality: socialPersonalityFormData,
        healthNutrition: healthNutritionFormData,
        hoomans: hoomansFormData,
        savedPets,
        currentSetupScreen,
        hasSetupStarted,
        isSetupComplete,
        savedAt: new Date().toISOString(),
      }),
    ).catch((error) => console.warn("Unable to save passport draft", error));
  }, [
    addDogFormData,
    currentSetupScreen,
    finalIdentificationFormData,
    hasSetupStarted,
    healthNutritionFormData,
    hoomansFormData,
    isDraftLoaded,
    isSetupComplete,
    newPassportFormData,
    savedPets,
    socialPersonalityFormData,
  ]);

  useEffect(() => {
    if (isSetupScreen(screen)) {
      setCurrentSetupScreen(screen);
      setSetupStarted(true);
    }
  }, [screen]);

  useEffect(() => {
    const savedPrimaryCaregiver =
      finalIdentificationFormData.familyMembers.find(
        (member) => member.isPrimary,
      );

    if (
      !savedPrimaryCaregiver?.name.trim() ||
      !savedPrimaryCaregiver.contact.trim()
    ) {
      return;
    }

    setHoomansFormData((currentFormData) => {
      const primaryIndex = currentFormData.people.findIndex(
        (person) => person.isPrimary,
      );

      if (primaryIndex < 0) {
        return currentFormData;
      }

      const primaryHooman = currentFormData.people[primaryIndex];
      const isEmail = savedPrimaryCaregiver.contact.includes("@");
      const alreadyHasContact =
        primaryHooman.email.trim() || primaryHooman.phone.trim();

      if (primaryHooman.name.trim() && alreadyHasContact) {
        return currentFormData;
      }

      return {
        ...currentFormData,
        people: currentFormData.people.map((person, index) =>
          index === primaryIndex
            ? {
                ...person,
                name: person.name.trim()
                  ? person.name
                  : savedPrimaryCaregiver.name,
                email:
                  person.email.trim() || !isEmail
                    ? person.email
                    : savedPrimaryCaregiver.contact,
                phone:
                  person.phone.trim() || isEmail
                    ? person.phone
                    : savedPrimaryCaregiver.contact,
              }
            : person,
        ),
      };
    });
  }, [finalIdentificationFormData.familyMembers]);

  const getNextAuthenticatedScreen = () => {
    if (isSetupComplete) {
      return "passport-created";
    }

    if (hasSetupStarted) {
      return currentSetupScreen;
    }

    if (isAddDogStepComplete(addDogFormData)) {
      return "final-identification";
    }

    if (isNewPassportStepComplete(newPassportFormData)) {
      return "add-dog";
    }

    return "new-passport";
  };

  const currentPet: HomePet = {
    name: newPassportFormData.petName,
    species: newPassportFormData.species,
    breed: newPassportFormData.breed,
    birthDate: newPassportFormData.birthDate,
    gender: addDogFormData.gender,
    isSterilized: addDogFormData.isSterilized,
    photoUri: newPassportFormData.petPhotoUri,
    microchipNumber: finalIdentificationFormData.microchipNumber,
    weight: addDogFormData.weight,
    weightUnit: addDogFormData.weightUnit,
  };

  const saveCurrentPet = () => {
    if (!currentPet.name.trim()) {
      return;
    }

    setSavedPets((pets) => upsertPet(pets, currentPet));
  };

  const startFamilyMemberSetup = () => {
    saveCurrentPet();
    setNewPassportFormData(initialNewPassportFormData);
    setAddDogFormData(initialAddDogFormData);
    setFinalIdentificationFormData(initialFinalIdentificationFormData);
    setSocialPersonalityFormData(initialSocialPersonalityFormData);
    setHealthNutritionFormData(initialHealthNutritionFormData);
    setHoomansFormData(initialHoomansFormData);
    setSetupComplete(false);
    setCurrentSetupScreen("new-passport");
    setSetupStarted(true);
    navigateWithSlide("new-passport", 1);
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (showSplash) {
          return true;
        }

        if (screen === "email-verification") {
          setScreen(
            verificationMode === "register" ? "register" : "forgot-password",
          );
          return true;
        }

        if (screen === "forgot-password") {
          setScreen("login");
          return true;
        }

        if (screen === "login" || screen === "register") {
          setScreen("welcome");
          return true;
        }

        if (screen === "new-passport") {
          navigateWithSlide("welcome", -1);
          return true;
        }

        if (screen === "add-dog") {
          navigateWithSlide("new-passport", -1);
          return true;
        }

        if (screen === "final-identification") {
          navigateWithSlide("add-dog", -1);
          return true;
        }

        if (screen === "social-personality") {
          navigateWithSlide("final-identification", -1);
          return true;
        }

        if (screen === "health-nutrition") {
          navigateWithSlide("social-personality", -1);
          return true;
        }

        if (screen === "hoomans-who-matter") {
          navigateWithSlide("health-nutrition", -1);
          return true;
        }

        if (screen === "passport-created") {
          setScreen("home");
          return true;
        }

        if (screen === "home") {
          setScreen("welcome");
          return true;
        }

        return false;
      },
    );

    return () => subscription.remove();
  }, [screen, showSplash, verificationMode]);

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView
          style={styles.safeArea}
          edges={["top", "right", "bottom", "left"]}
        >
          <StatusBar
            style="dark"
            backgroundColor={colors.background}
            translucent={false}
          />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={["top", "right", "left"]}>
        <StatusBar
          style="dark"
          backgroundColor={colors.background}
          translucent={false}
        />
        <View style={styles.screenInset}>
          <Animated.View
            style={[
              styles.transitionScreen,
              {
                opacity: screenTransition,
                transform: [
                  {
                    translateX: screenTransition.interpolate({
                      inputRange: [0, 1],
                      outputRange: [44 * transitionDirection.current, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {showSplash ? (
              <SplashScreen />
            ) : screen === "welcome" ? (
              <WelcomeScreen
                onLoginPress={() => setScreen("login")}
                onCreatePress={(petName) => {
                  setNewPassportFormData((currentFormData) => ({
                    ...currentFormData,
                    petName,
                  }));
                  setScreen("register");
                }}
              />
            ) : screen === "forgot-password" ? (
              <ForgotPasswordScreen
                onBackToLogin={() => setScreen("login")}
                onResetLinkSent={() => {
                  if (!FORM_HANDLING_AND_VERIFICATION_ENABLED) {
                    setScreen("login");
                    return;
                  }
                  setVerificationMode("reset");
                  setVerificationChannel("email");
                  setScreen("email-verification");
                }}
              />
            ) : screen === "register" ? (
              <RegisterScreen
                petName={newPassportFormData.petName}
                onProfileChange={({
                  birthDate,
                  caregiverName,
                  caregiverContact,
                  caregiverPhotoUri,
                }) => {
                  setNewPassportFormData((currentFormData) => ({
                    ...currentFormData,
                    birthDate,
                  }));
                  setFinalIdentificationFormData((currentFormData) => ({
                    ...currentFormData,
                    familyMembers: [
                      {
                        ...currentFormData.familyMembers[0],
                        name: caregiverName,
                        contact: caregiverContact,
                        isPrimary: true,
                      },
                      ...currentFormData.familyMembers.slice(1),
                    ],
                  }));
                  setHoomansFormData((currentFormData) => ({
                    ...currentFormData,
                    people: [
                      {
                        ...currentFormData.people[0],
                        name: caregiverName,
                        email: caregiverContact.includes("@")
                          ? caregiverContact
                          : "",
                        phone: caregiverContact.includes("@")
                          ? ""
                          : caregiverContact,
                        photoUri: caregiverPhotoUri,
                        isPrimary: true,
                      },
                      ...currentFormData.people.slice(1),
                    ],
                  }));
                }}
                onLoginPress={() => setScreen("login")}
                onVerificationRequired={(channel) => {
                  if (!FORM_HANDLING_AND_VERIFICATION_ENABLED) {
                    setScreen("new-passport");
                    return;
                  }
                  setVerificationMode("register");
                  setVerificationChannel(channel);
                  setScreen("email-verification");
                }}
              />
            ) : screen === "email-verification" ? (
              <EmailVerificationScreen
                mode={verificationMode}
                initialChannel={verificationChannel}
                onBackPress={() =>
                  setScreen(
                    verificationMode === "register"
                      ? "register"
                      : "forgot-password",
                  )
                }
                onVerified={() => setScreen("new-passport")}
              />
            ) : screen === "new-passport" ? (
              <NewPassportScreen
                formData={newPassportFormData}
                onFormChange={setNewPassportFormData}
                onContinue={() => navigateWithSlide("add-dog", 1)}
              />
            ) : screen === "add-dog" ? (
              <AddDogScreen
                formData={addDogFormData}
                petPhotoUri={newPassportFormData.petPhotoUri}
                onFormChange={setAddDogFormData}
                onBackPress={() => navigateWithSlide("new-passport", -1)}
                onNextPress={() => navigateWithSlide("final-identification", 1)}
              />
            ) : screen === "final-identification" ? (
              <FinalIdentificationScreen
                formData={finalIdentificationFormData}
                onFormChange={setFinalIdentificationFormData}
                onBack={() => navigateWithSlide("add-dog", -1)}
                onComplete={() => navigateWithSlide("social-personality", 1)}
              />
            ) : screen === "social-personality" ? (
              <SocialPersonalityScreen
                petName={newPassportFormData.petName}
                formData={socialPersonalityFormData}
                onFormChange={setSocialPersonalityFormData}
                onBack={() => navigateWithSlide("final-identification", -1)}
                onComplete={() => navigateWithSlide("health-nutrition", 1)}
              />
            ) : screen === "health-nutrition" ? (
              <HealthNutritionScreen
                birthDate={newPassportFormData.birthDate}
                formData={healthNutritionFormData}
                onFormChange={setHealthNutritionFormData}
                onBack={() => navigateWithSlide("social-personality", -1)}
                onComplete={() => navigateWithSlide("hoomans-who-matter", 1)}
              />
            ) : screen === "hoomans-who-matter" ? (
              <HoomansWhoMatterScreen
                formData={hoomansFormData}
                onFormChange={setHoomansFormData}
                onBack={() => navigateWithSlide("health-nutrition", -1)}
                onComplete={() => {
                  saveCurrentPet();
                  setSetupComplete(true);
                  navigateWithSlide("passport-created", 1);
                }}
              />
            ) : screen === "passport-created" ? (
              <PassportCreatedScreen
                petName={newPassportFormData.petName}
                photoUri={newPassportFormData.petPhotoUri}
                microchipNumber={finalIdentificationFormData.microchipNumber}
                vaccinationDetails={healthNutritionFormData.vaccinationDetails}
                previousRecordCount={
                  healthNutritionFormData.previousRecords.length
                }
                onViewPassport={() => {
                  setHomeTab("passport");
                  setScreen("home");
                }}
                onGoHome={() => {
                  setHomeTab("home");
                  setScreen("home");
                }}
              />
            ) : screen === "home" ? (
              <HomeScreen
                activeTab={homeTab}
                onAddFamilyMember={startFamilyMemberSetup}
                onSignOut={() => {
                  setHomeTab("home");
                  setScreen("welcome");
                }}
                pet={currentPet}
                pets={savedPets}
              />
            ) : (
              <LoginScreen
                petName={newPassportFormData.petName}
                onForgotPassword={() => setScreen("forgot-password")}
                onLoginSuccess={() => {
                  const nextScreen = getNextAuthenticatedScreen();
                  setScreen(nextScreen);
                }}
                onBackPress={() => setScreen("welcome")}
              />
            )}
          </Animated.View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  screenInset: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: 28,
    paddingBottom: 12,
  },
  transitionScreen: { flex: 1 },
});

function isNewPassportStepComplete(
  formData: typeof initialNewPassportFormData,
) {
  return Boolean(
    formData.petName.trim() &&
      formData.breed.trim() &&
      formData.birthDate.trim().length === 8,
  );
}

function isAddDogStepComplete(formData: typeof initialAddDogFormData) {
  return Boolean(
    formData.weight.trim() &&
      formData.height.trim() &&
      formData.primaryColor.trim(),
  );
}

function upsertPet(pets: HomePet[], pet: HomePet) {
  const identity = pet.microchipNumber.trim()
    ? `microchip:${pet.microchipNumber.trim()}`
    : `profile:${pet.name.trim().toLowerCase()}:${pet.birthDate}`;
  const existingIndex = pets.findIndex((item) => {
    const itemIdentity = item.microchipNumber.trim()
      ? `microchip:${item.microchipNumber.trim()}`
      : `profile:${item.name.trim().toLowerCase()}:${item.birthDate}`;
    return itemIdentity === identity;
  });

  if (existingIndex < 0) {
    return [pet, ...pets];
  }

  return pets.map((item, index) => (index === existingIndex ? pet : item));
}

function isSetupScreen(value: unknown): value is SetupScreen {
  return (
    typeof value === "string" && setupScreens.includes(value as SetupScreen)
  );
}
