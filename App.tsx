import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  Inter_900Black,
  useFonts
} from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { BackHandler, StyleSheet, View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import { AddDogScreen, initialAddDogFormData } from './src/screens/AddDogScreen';
import { ForgotPasswordScreen } from './src/screens/ForgotPasswordScreen';
import { EmailVerificationScreen } from './src/screens/EmailVerificationScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { LoginScreen } from './src/screens/LoginScreen';
import { NewPassportScreen, initialNewPassportFormData } from './src/screens/NewPassportScreen';
import { RegisterScreen } from './src/screens/RegisterScreen';
import { SplashScreen } from './src/screens/SplashScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { colors } from './src/theme/colors';

const forgotPasswordTopBackground = '#C6F2F1';
const forgotPasswordBottomBackground = '#F6FBFC';

export default function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [screen, setScreen] = useState<
    'welcome' | 'login' | 'forgot-password' | 'register' | 'email-verification' | 'new-passport' | 'add-dog' | 'home'
  >('welcome');
  const [verificationMode, setVerificationMode] = useState<'reset' | 'register'>('reset');
  const [newPassportFormData, setNewPassportFormData] = useState(initialNewPassportFormData);
  const [addDogFormData, setAddDogFormData] = useState(initialAddDogFormData);
  const [isSetupComplete, setSetupComplete] = useState(false);
  const isForgotPasswordScreen = !showSplash && screen === 'forgot-password';
  const statusBarBackground = isForgotPasswordScreen ? forgotPasswordTopBackground : colors.background;
  const shellBackground = isForgotPasswordScreen ? forgotPasswordBottomBackground : colors.background;
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
    Inter_900Black
  });

  useEffect(() => {
    const timer = setTimeout(() => setShowSplash(false), 2100);
    return () => clearTimeout(timer);
  }, []);

  const getNextAuthenticatedScreen = () => {
    if (isSetupComplete || isAddDogStepComplete(addDogFormData)) {
      return 'home';
    }

    if (isNewPassportStepComplete(newPassportFormData)) {
      return 'add-dog';
    }

    return 'new-passport';
  };

  useEffect(() => {
    const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
      if (showSplash) {
        return true;
      }

      if (screen === 'email-verification') {
        setScreen(verificationMode === 'register' ? 'register' : 'forgot-password');
        return true;
      }

      if (screen === 'forgot-password' || screen === 'register') {
        setScreen('login');
        return true;
      }

      if (screen === 'login') {
        setScreen('welcome');
        return true;
      }

      if (screen === 'new-passport') {
        setScreen('login');
        return true;
      }

      if (screen === 'add-dog') {
        setScreen('new-passport');
        return true;
      }

      if (screen === 'home') {
        setScreen('login');
        return true;
      }

      return false;
    });

    return () => subscription.remove();
  }, [screen, showSplash, verificationMode]);

  if (!fontsLoaded) {
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.safeArea} edges={['top', 'right', 'bottom', 'left']}>
          <StatusBar style="dark" backgroundColor={colors.background} translucent={false} />
        </SafeAreaView>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: statusBarBackground }]} edges={['top', 'right', 'left']}>
        <StatusBar style="dark" backgroundColor={statusBarBackground} translucent={false} />
        <View style={[styles.screenInset, { backgroundColor: shellBackground, paddingTop: isForgotPasswordScreen ? 0 : 28 }]}>
          {showSplash ? (
            <SplashScreen />
          ) : screen === 'welcome' ? (
            <WelcomeScreen onLoginPress={() => setScreen('login')} />
          ) : screen === 'forgot-password' ? (
            <ForgotPasswordScreen
              onBackToLogin={() => setScreen('login')}
              onResetLinkSent={() => {
                setVerificationMode('reset');
                setScreen('email-verification');
              }}
            />
          ) : screen === 'register' ? (
            <RegisterScreen
              onLoginPress={() => setScreen('login')}
              onVerificationRequired={() => {
                setVerificationMode('register');
                setScreen('email-verification');
              }}
            />
          ) : screen === 'email-verification' ? (
            <EmailVerificationScreen
              mode={verificationMode}
              onBackPress={() => setScreen(verificationMode === 'register' ? 'register' : 'forgot-password')}
              onVerified={() => setScreen('new-passport')}
            />
          ) : screen === 'new-passport' ? (
            <NewPassportScreen
              formData={newPassportFormData}
              onFormChange={setNewPassportFormData}
              onContinue={() => setScreen('add-dog')}
            />
          ) : screen === 'add-dog' ? (
            <AddDogScreen
              formData={addDogFormData}
              petPhotoUri={newPassportFormData.petPhotoUri}
              onFormChange={setAddDogFormData}
              onBackPress={() => setScreen('new-passport')}
              onNextPress={() => {
                setSetupComplete(true);
                setScreen('home');
              }}
            />
          ) : screen === 'home' ? (
            <HomeScreen />
          ) : (
            <LoginScreen
              onForgotPassword={() => setScreen('forgot-password')}
              onLoginSuccess={() => setScreen(getNextAuthenticatedScreen())}
              onSignUpPress={() => setScreen('register')}
            />
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  screenInset: {
    flex: 1,
    paddingBottom: 12
  }
});

function isNewPassportStepComplete(formData: typeof initialNewPassportFormData) {
  return Boolean(
    formData.petName.trim() &&
      formData.breed.trim() &&
      formData.birthDate.trim().length === 8
  );
}

function isAddDogStepComplete(formData: typeof initialAddDogFormData) {
  return Boolean(
    formData.weight.trim() &&
      formData.height.trim() &&
      formData.primaryColor.trim()
  );
}
