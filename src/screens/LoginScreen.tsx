import { FontAwesome5 } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, Pressable, StyleSheet, View } from "react-native";
import { Text, TextInput } from "../components/Typography";

import { AuthFooter } from "../components/AuthFooter";
import { GoogleIcon } from "../components/GoogleIcon";
import { FORM_HANDLING_AND_VERIFICATION_ENABLED } from "../config/features";
import { assets } from "../theme/assets";
import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { elevation } from "../theme/elevation";
import { fontFamily } from "../theme/typography";

type LoginScreenProps = {
  petName?: string;
  onForgotPassword: () => void;
  onLoginSuccess: () => void;
  onBackPress: () => void;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({
  petName,
  onForgotPassword,
  onLoginSuccess,
  onBackPress,
}: LoginScreenProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const errors = useMemo<LoginErrors>(() => {
    const nextErrors: LoginErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    }

    return nextErrors;
  }, [email, password]);

  const showErrors = submitted;
  const isFormValid = Object.keys(errors).length === 0;

  const handleLogin = () => {
    setSubmitted(true);

    if (!FORM_HANDLING_AND_VERIFICATION_ENABLED || isFormValid) {
      onLoginSuccess();
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.identity}>
        <Image source={assets.logo} style={styles.logo} resizeMode="cover" />
        {petName ? <Text style={styles.petName}>{petName}</Text> : null}
        <Text style={styles.intro}>
          {petName
            ? `I’m ${petName}. Let me into my PawDigi.life`
            : "Let me into my PawDigi.life"}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>My human’s email address</Text>
        <View
          style={[
            styles.inputWrap,
            showErrors && errors.email && styles.inputError,
          ]}
        >
          <FontAwesome5 name="envelope" size={18} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor={colors.body}
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        {showErrors && errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <View style={styles.passwordHeader}>
          <Text style={styles.label}>My password</Text>
          <Pressable onPress={onForgotPassword}>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </Pressable>
        </View>
        <View
          style={[
            styles.inputWrap,
            showErrors && errors.password && styles.inputError,
          ]}
        >
          <FontAwesome5 name="lock" size={18} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor={colors.body}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>
        {showErrors && errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <Pressable
          onPress={handleLogin}
          style={({ pressed }) => [
            styles.loginButton,
            pressed && styles.loginButtonPressed,
            submitted && !isFormValid && styles.loginButtonDisabled,
          ]}
        >
          <Text style={styles.loginButtonText}>Let Me In</Text>
          <FontAwesome5 name="arrow-right" size={18} color={colors.card} />
        </Pressable>

        <View style={styles.orRow}>
          <View style={styles.orLine} />
          <Text style={styles.orText}>OR</Text>
          <View style={styles.orLine} />
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            pressed && styles.socialPressed,
          ]}
        >
          <GoogleIcon size={20} />
          <Text style={styles.socialText}>Let me in with Google</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            pressed && styles.socialPressed,
          ]}
        >
          <FontAwesome5 name="apple" size={23} color={colors.ink} />
          <Text style={styles.socialText}>Let me in with Apple</Text>
        </Pressable>
      </View>

      <Pressable
        accessibilityLabel="Go back to my pup’s welcome screen"
        accessibilityRole="button"
        onPress={onBackPress}
        style={styles.backToWelcome}
      >
        <FontAwesome5 name="arrow-left" size={14} color={colors.primary} />
        <Text style={styles.backToWelcomeText}>
          Go back to my pup’s welcome
        </Text>
      </Pressable>

      <View style={styles.footerWrap}>
        <AuthFooter />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
  },
  identity: {
    alignItems: "center",
    paddingTop: 4,
    paddingBottom: 14,
  },
  logo: {
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  petName: {
    color: colors.primary,
    fontSize: 24,
    fontFamily: fontFamily.extraBold,
  },
  intro: {
    marginTop: 6,
    color: colors.ink,
    fontSize: 18,
    lineHeight: 24,
    textAlign: "center",
    fontFamily: fontFamily.black,
  },
  card: {
    width: "100%",
    ...cardSurface,
  },
  label: {
    color: colors.body,
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
  inputWrap: {
    height: 42,
    marginTop: 7,
    marginBottom: 17,
    borderRadius: 9,
    borderWidth: 1.3,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 12,
  },
  inputError: {
    borderColor: colors.error,
    backgroundColor: colors.background,
  },
  errorText: {
    marginTop: -12,
    marginBottom: 10,
    color: colors.error,
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fontFamily.medium,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontFamily: fontFamily.regular,
    paddingVertical: 0,
  },
  passwordHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  forgot: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  loginButton: {
    height: 46,
    borderRadius: 23,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    ...elevation.l2,
  },
  loginButtonPressed: {
    backgroundColor: colors.ink,
  },
  loginButtonDisabled: {
    backgroundColor: colors.borderStrong,
  },
  loginButtonText: {
    color: colors.card,
    fontSize: 16,
    fontFamily: fontFamily.semiBold,
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginVertical: 16,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.borderStrong,
  },
  orText: {
    color: colors.borderStrong,
    fontSize: 13,
    letterSpacing: 2,
    fontFamily: fontFamily.semiBold,
  },
  socialButton: {
    height: 38,
    borderRadius: 19,
    borderWidth: 1.3,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 10,
  },
  socialPressed: {
    backgroundColor: colors.background,
  },
  socialText: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  backToWelcome: {
    minHeight: 44,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    alignSelf: "center",
    marginTop: 12,
    paddingHorizontal: 14,
  },
  backToWelcomeText: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
  footerWrap: {
    marginHorizontal: -16,
    marginTop: "auto",
    borderTopWidth: 1,
    borderColor: colors.borderStrong,
  },
});
