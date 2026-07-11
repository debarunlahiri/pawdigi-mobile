import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";

import { BrandHeader } from "../components/BrandHeader";
import { TrustIcon } from "../components/TrustIcon";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

type RegisterScreenProps = {
  onLoginPress: () => void;
  onVerificationRequired: () => void;
};

type RegisterErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  acceptedTerms?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const strongPasswordPattern =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

export function RegisterScreen({
  onLoginPress,
  onVerificationRequired,
}: RegisterScreenProps) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);

  const errors = useMemo<RegisterErrors>(() => {
    const nextErrors: RegisterErrors = {};
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName) {
      nextErrors.fullName = "Full name is required.";
    } else if (trimmedName.length < 2) {
      nextErrors.fullName = "Enter at least 2 characters.";
    }

    if (!trimmedEmail) {
      nextErrors.email = "Email address is required.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password) {
      nextErrors.password = "Password is required.";
    } else if (!strongPasswordPattern.test(password)) {
      nextErrors.password = "Use upper, lower, number, and symbol.";
    }

    if (!acceptedTerms) {
      nextErrors.acceptedTerms = "Accept the terms to continue.";
    }

    return nextErrors;
  }, [acceptedTerms, email, fullName, password]);

  const isFormValid = Object.keys(errors).length === 0;
  const showErrors = submitted;
  const passwordStrength = getPasswordStrength(password);

  const clearVerification = () => setVerificationSent(false);

  const handleSubmit = () => {
    setSubmitted(true);
    setVerificationSent(false);

    if (isFormValid) {
      setVerificationSent(true);
      onVerificationRequired();
    }
  };

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <View style={styles.card}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Securely manage your pet's medical journey with clinical-grade tools.
        </Text>

        <Text style={styles.label}>Full Name</Text>
        <View
          style={[
            styles.inputWrap,
            showErrors && errors.fullName && styles.inputError,
          ]}
        >
          <FontAwesome5 name="user" size={17} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor="#6F7783"
            value={fullName}
            onChangeText={(value) => {
              setFullName(value);
              clearVerification();
            }}
          />
        </View>
        {showErrors && errors.fullName ? (
          <Text style={styles.errorText}>{errors.fullName}</Text>
        ) : null}

        <Text style={styles.label}>Email Address</Text>
        <View
          style={[
            styles.inputWrap,
            showErrors && errors.email && styles.inputError,
          ]}
        >
          <FontAwesome5 name="envelope" size={17} color={colors.muted} />
          <TextInput
            style={styles.input}
            placeholder="name@example.com"
            placeholderTextColor="#6F7783"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={(value) => {
              setEmail(value);
              clearVerification();
            }}
          />
        </View>
        {showErrors && errors.email ? (
          <Text style={styles.errorText}>{errors.email}</Text>
        ) : null}

        <Text style={styles.label}>Password</Text>
        <View
          style={[
            styles.passwordWrap,
            showErrors && errors.password && styles.inputError,
          ]}
        >
          <View style={styles.passwordLeft}>
            <FontAwesome5 name="lock" size={17} color={colors.muted} />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#6F7783"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={(value) => {
                setPassword(value);
                clearVerification();
              }}
            />
          </View>
          <Pressable onPress={() => setShowPassword((value) => !value)}>
            <FontAwesome5
              name={showPassword ? "eye-slash" : "eye"}
              size={18}
              color={colors.muted}
            />
          </Pressable>
        </View>
        <View style={styles.passwordMetaRow}>
          <Text
            style={[
              styles.hint,
              showErrors && errors.password && styles.errorHint,
            ]}
          >
            8+ chars, upper, lower, number, symbol.
          </Text>
          {password ? (
            <Text style={[styles.strengthText, passwordStrength.style]}>
              {passwordStrength.label}
            </Text>
          ) : null}
        </View>
        {showErrors && errors.password ? (
          <Text style={styles.errorText}>{errors.password}</Text>
        ) : null}

        <Pressable
          style={styles.termsRow}
          onPress={() => {
            setAcceptedTerms((value) => !value);
            clearVerification();
          }}
        >
          <View
            style={[
              styles.checkbox,
              acceptedTerms && styles.checkboxChecked,
              showErrors && errors.acceptedTerms && styles.checkboxError,
            ]}
          >
            {acceptedTerms ? (
              <Ionicons name="checkmark" size={15} color="#FFFFFF" />
            ) : null}
          </View>
          <Text style={styles.termsText}>
            I agree to the <Text style={styles.linkText}>Terms of Service</Text>{" "}
            and{"\n"}
            <Text style={styles.linkText}>Privacy Policy</Text>
          </Text>
        </Pressable>
        {showErrors && errors.acceptedTerms ? (
          <Text style={styles.errorText}>{errors.acceptedTerms}</Text>
        ) : null}

        <Pressable
          onPress={handleSubmit}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
            submitted && !isFormValid && styles.primaryButtonDisabled,
          ]}
        >
          <Text style={styles.primaryButtonText}>Create Account</Text>
          <FontAwesome5 name="arrow-right" size={18} color="#FFFFFF" />
        </Pressable>
        {verificationSent ? (
          <Text style={styles.successText}>
            Verification email sent. Check your inbox.
          </Text>
        ) : null}

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Already have an account?</Text>
          <Pressable onPress={onLoginPress}>
            <Text style={styles.loginLink}>Log In</Text>
          </Pressable>
        </View>

        <View style={styles.divider} />

        <View style={styles.securityRow}>
          <View style={styles.securityItem}>
            <TrustIcon name="data-safe" size={14} color={colors.muted} />
            <Text style={styles.securityText}>SSL Encrypted</Text>
          </View>
          <View style={styles.securityItem}>
            <FontAwesome5 name="shield-alt" size={15} color={colors.muted} />
            <Text style={styles.securityText}>GDPR Compliant</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z\d]/.test(password)) score += 1;

  if (score >= 5) {
    return { label: "Strong", style: styles.strong };
  }

  if (score >= 3) {
    return { label: "Medium", style: styles.medium };
  }

  return { label: "Weak", style: styles.weak };
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: colors.card,
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 18,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.16,
    shadowRadius: 24,
    elevation: 5,
  },
  title: {
    color: colors.ink,
    fontSize: 27,
    lineHeight: 32,
    textAlign: "center",
    fontFamily: fontFamily.black,
  },
  subtitle: {
    marginTop: 9,
    color: colors.body,
    fontSize: 13,
    lineHeight: 19,
    textAlign: "center",
    fontFamily: fontFamily.regular,
  },
  label: {
    marginTop: 16,
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  inputWrap: {
    height: 42,
    marginTop: 7,
    borderRadius: 9,
    borderWidth: 1.3,
    borderColor: "#BACACD",
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    gap: 11,
  },
  passwordWrap: {
    height: 42,
    marginTop: 7,
    borderRadius: 9,
    borderWidth: 1.3,
    borderColor: "#BACACD",
    backgroundColor: colors.background,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
  },
  inputError: {
    borderColor: "#B91C1C",
    backgroundColor: "#FFF7F7",
  },
  passwordLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.regular,
    paddingVertical: 0,
  },
  passwordMetaRow: {
    marginTop: 6,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  hint: {
    color: colors.muted,
    fontSize: 12,
    lineHeight: 16,
    fontFamily: fontFamily.medium,
  },
  errorHint: {
    color: "#B91C1C",
  },
  strengthText: {
    fontSize: 12,
    fontFamily: fontFamily.extraBold,
  },
  weak: {
    color: "#B91C1C",
  },
  medium: {
    color: "#A16207",
  },
  strong: {
    color: colors.primary,
  },
  errorText: {
    marginTop: 4,
    color: "#B91C1C",
    fontSize: 11,
    lineHeight: 14,
    fontFamily: fontFamily.medium,
  },
  termsRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.3,
    borderColor: "#BACACD",
    backgroundColor: colors.card,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    borderColor: colors.primary,
    backgroundColor: colors.primary,
  },
  checkboxError: {
    borderColor: "#B91C1C",
  },
  termsText: {
    flex: 1,
    color: colors.body,
    fontSize: 13,
    lineHeight: 19,
    fontFamily: fontFamily.regular,
  },
  linkText: {
    color: colors.primary,
    fontFamily: fontFamily.medium,
  },
  primaryButton: {
    height: 48,
    marginTop: 20,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  primaryButtonPressed: {
    backgroundColor: "#00676B",
  },
  primaryButtonDisabled: {
    backgroundColor: "#8EA6A8",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontFamily: fontFamily.extraBold,
  },
  successText: {
    marginTop: 8,
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    fontFamily: fontFamily.semiBold,
  },
  loginRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  loginText: {
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.regular,
  },
  loginLink: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.extraBold,
  },
  divider: {
    height: 1,
    marginTop: 22,
    backgroundColor: "#BACACD",
  },
  securityRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 20,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  securityText: {
    color: colors.muted,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
});
