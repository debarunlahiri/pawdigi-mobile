import { FontAwesome5 } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { BrandHeader } from "../components/BrandHeader";
import { GoogleIcon } from "../components/GoogleIcon";
import { TrustIcon } from "../components/TrustIcon";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

type LoginScreenProps = {
  onForgotPassword: () => void;
  onLoginSuccess: () => void;
  onSignUpPress: () => void;
};

type LoginErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function LoginScreen({
  onForgotPassword,
  onLoginSuccess,
  onSignUpPress,
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

    if (isFormValid) {
      onLoginSuccess();
    }
  };

  return (
    <View style={styles.screen}>
      <BrandHeader />

      <View style={styles.card}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Access your pet's professional health records.
        </Text>

        <Text style={styles.label}>Email Address</Text>
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
            placeholderTextColor="#6F7783"
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
          <Text style={styles.label}>Password</Text>
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
            placeholderTextColor="#6F7783"
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
          <Text style={styles.loginButtonText}>Log In</Text>
          <FontAwesome5 name="arrow-right" size={18} color="#FFFFFF" />
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
          <Text style={styles.socialText}>Continue with Google</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.socialButton,
            pressed && styles.socialPressed,
          ]}
        >
          <FontAwesome5 name="apple" size={23} color={colors.ink} />
          <Text style={styles.socialText}>Continue with Apple</Text>
        </Pressable>
      </View>

      <View style={styles.signupRow}>
        <Text style={styles.signupText}>New to PawDigi?</Text>
        <Pressable onPress={onSignUpPress}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </Pressable>
      </View>

      <View style={styles.footer}>
        <TrustIcon name="global-vet" size={20} color={colors.body} />
        <Text style={styles.footerText}>PawDigi Health</Text>
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
  card: {
    width: "100%",
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 22,
    paddingTop: 20,
    paddingBottom: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 5,
  },
  title: {
    color: colors.ink,
    fontSize: 23,
    fontFamily: fontFamily.black,
  },
  subtitle: {
    marginTop: 8,
    color: colors.body,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
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
    borderColor: "#BACACD",
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    gap: 12,
  },
  inputError: {
    borderColor: "#B91C1C",
    backgroundColor: "#FFF7F7",
  },
  errorText: {
    marginTop: -12,
    marginBottom: 10,
    color: "#B91C1C",
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
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.2,
    shadowRadius: 22,
    elevation: 4,
  },
  loginButtonPressed: {
    backgroundColor: colors.ink,
  },
  loginButtonDisabled: {
    backgroundColor: "#8EA6A8",
  },
  loginButtonText: {
    color: "#FFFFFF",
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
    backgroundColor: "#BACACD",
  },
  orText: {
    color: "#B0BEC1",
    fontSize: 13,
    letterSpacing: 2,
    fontFamily: fontFamily.semiBold,
  },
  socialButton: {
    height: 38,
    borderRadius: 19,
    borderWidth: 1.3,
    borderColor: "#BACACD",
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 14,
    marginBottom: 10,
  },
  socialPressed: {
    backgroundColor: "#F8FBFB",
  },
  socialText: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.medium,
  },
  signupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 16,
  },
  signupText: {
    color: colors.body,
    fontSize: 15,
    fontFamily: fontFamily.regular,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
  },
  footer: {
    marginHorizontal: -16,
    marginTop: "auto",
    height: 52,
    borderTopWidth: 1,
    borderColor: "#BACACD",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  footerText: {
    color: colors.body,
    fontSize: 19,
    fontFamily: fontFamily.extraBold,
  },
});
