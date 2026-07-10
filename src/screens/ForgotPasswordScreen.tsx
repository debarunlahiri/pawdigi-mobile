import { FontAwesome5 } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { BrandHeader } from '../components/BrandHeader';
import { colors } from '../theme/colors';
import { fontFamily } from '../theme/typography';

type ForgotPasswordScreenProps = {
  onBackToLogin: () => void;
  onResetLinkSent: () => void;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function ForgotPasswordScreen({ onBackToLogin, onResetLinkSent }: ForgotPasswordScreenProps) {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [resetLinkSent, setResetLinkSent] = useState(false);

  const emailError = useMemo(() => {
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      return 'Email address is required.';
    }

    if (!emailPattern.test(trimmedEmail)) {
      return 'Enter a valid email address.';
    }

    return '';
  }, [email]);

  const showError = submitted && Boolean(emailError);

  const handleReset = () => {
    setSubmitted(true);
    setResetLinkSent(false);

    if (!emailError) {
      setResetLinkSent(true);
      onResetLinkSent();
    }
  };

  return (
    <LinearGradient
      colors={['#C6F2F1', '#EAF5FB', '#F6FBFC']}
      locations={[0, 0.52, 1]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.screen}
    >
      <BrandHeader />

      <View style={styles.card}>
        <View style={styles.iconBox}>
          <FontAwesome5 name="undo-alt" size={31} color="#0D1B2A" />
        </View>

        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter the email associated with your account and we'll send you instructions to reset your password.
        </Text>

        <Text style={styles.label}>Email Address</Text>
        <View style={[styles.inputWrap, showError && styles.inputError]}>
          <FontAwesome5 name="envelope" size={18} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#727879"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              setResetLinkSent(false);
            }}
          />
        </View>
        {showError ? <Text style={styles.errorText}>{emailError}</Text> : null}

        <Pressable
          onPress={handleReset}
          style={({ pressed }) => [styles.resetButton, pressed && styles.resetButtonPressed, showError && styles.resetButtonDisabled]}
        >
          <Text style={styles.resetButtonText}>Send Reset Link</Text>
          <FontAwesome5 name="paper-plane" size={18} color="#FFFFFF" />
        </Pressable>
        {resetLinkSent ? <Text style={styles.successText}>Reset link sent. Check your email to continue.</Text> : null}

        <View style={styles.supportRow}>
          <FontAwesome5 name="question-circle" size={16} color={colors.body} />
          <Text style={styles.supportText}>Can't access your email?</Text>
          <Text style={styles.supportLink}>Contact Support</Text>
        </View>

        <Pressable style={styles.backLink} onPress={onBackToLogin}>
          <FontAwesome5 name="arrow-left" size={14} color={colors.primary} />
          <Text style={styles.backLinkText}>Back to Login</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16
  },
  card: {
    marginTop: 58,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: '#BACACD',
    backgroundColor: colors.card,
    paddingHorizontal: 28,
    paddingTop: 34,
    paddingBottom: 26,
    alignItems: 'center',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.16,
    shadowRadius: 22,
    elevation: 5
  },
  iconBox: {
    width: 62,
    height: 62,
    borderRadius: 16,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 30,
    color: colors.ink,
    fontSize: 29,
    lineHeight: 35,
    textAlign: 'center',
    fontFamily: fontFamily.black
  },
  subtitle: {
    marginTop: 12,
    color: colors.body,
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    fontFamily: fontFamily.regular
  },
  label: {
    alignSelf: 'flex-start',
    marginTop: 30,
    color: colors.body,
    fontSize: 15,
    fontFamily: fontFamily.semiBold
  },
  inputWrap: {
    width: '100%',
    height: 50,
    marginTop: 9,
    borderRadius: 10,
    borderWidth: 1.3,
    borderColor: '#BACACD',
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    gap: 12
  },
  inputError: {
    borderColor: '#B91C1C',
    backgroundColor: '#FFF7F7'
  },
  errorText: {
    alignSelf: 'flex-start',
    marginTop: 6,
    color: '#B91C1C',
    fontSize: 12,
    lineHeight: 15,
    fontFamily: fontFamily.medium
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 16,
    fontFamily: fontFamily.regular,
    paddingVertical: 0
  },
  resetButton: {
    width: '100%',
    height: 50,
    marginTop: 26,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10
  },
  resetButtonPressed: {
    backgroundColor: '#00676B'
  },
  resetButtonDisabled: {
    backgroundColor: '#8EA6A8'
  },
  resetButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: fontFamily.extraBold
  },
  successText: {
    marginTop: 10,
    color: colors.primary,
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'center',
    fontFamily: fontFamily.semiBold
  },
  supportRow: {
    marginTop: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: 6
  },
  supportText: {
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.medium
  },
  supportLink: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.semiBold
  },
  backLink: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4
  },
  backLinkText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.medium
  }
});
