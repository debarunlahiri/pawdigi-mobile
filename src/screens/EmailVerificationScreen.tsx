import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { BrandHeader } from "../components/BrandHeader";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

type EmailVerificationScreenProps = {
  mode: "reset" | "register";
  onBackPress: () => void;
  onVerified: () => void;
};

export function EmailVerificationScreen({
  mode,
  onBackPress,
  onVerified,
}: EmailVerificationScreenProps) {
  const pulse = useRef(new Animated.Value(0)).current;
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState("");

  const description =
    mode === "reset"
      ? "We've sent a password reset link to your email address. Please follow the instructions to continue."
      : "We've sent a verification link to your email address. Please verify your email to continue.";
  const canResend = resendCooldown === 0;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, {
          toValue: 1,
          duration: 950,
          useNativeDriver: true,
        }),
        Animated.timing(pulse, {
          toValue: 0,
          duration: 950,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [pulse]);

  useEffect(() => {
    const timer = setTimeout(onVerified, 10000);
    return () => clearTimeout(timer);
  }, [onVerified]);

  useEffect(() => {
    if (resendCooldown === 0) {
      return;
    }

    const timer = setTimeout(
      () => setResendCooldown((value) => Math.max(value - 1, 0)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const pulseScale = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [1, 1.08],
  });
  const pulseOpacity = pulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.52, 1],
  });

  const handleOpenEmail = async () => {
    setMessage("");

    try {
      const canOpenMail = await Linking.canOpenURL("mailto:");

      if (canOpenMail) {
        await Linking.openURL("mailto:");
      } else {
        setMessage("No email app found on this device.");
      }
    } catch {
      setMessage("Unable to open email app.");
    }
  };

  const handleResend = () => {
    if (!canResend) {
      return;
    }

    setResendCooldown(30);
    setMessage(
      mode === "reset" ? "Reset link resent." : "Verification email resent.",
    );
  };

  return (
    <View style={styles.screen}>
      <BrandHeader />
      <View style={styles.card}>
        <Animated.View
          style={[
            styles.iconHalo,
            { opacity: pulseOpacity, transform: [{ scale: pulseScale }] },
          ]}
        >
          <Animated.View
            style={[styles.iconCircle, { transform: [{ scale: pulseScale }] }]}
          >
            <FontAwesome5 name="envelope" size={32} color={colors.primary} />
            <View style={styles.notificationDot} />
          </Animated.View>
        </Animated.View>

        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.description}>{description}</Text>

        <Pressable
          onPress={handleOpenEmail}
          style={({ pressed }) => [
            styles.primaryButton,
            pressed && styles.primaryButtonPressed,
          ]}
        >
          <FontAwesome5 name="external-link-alt" size={18} color="#FFFFFF" />
          <Text style={styles.primaryButtonText}>Open Email App</Text>
        </Pressable>

        <View style={styles.waitingPill}>
          <Animated.View
            style={[styles.waitingDot, { opacity: pulseOpacity }]}
          />
          <Text style={styles.waitingText}>Waiting for verification...</Text>
        </View>
        {message ? <Text style={styles.messageText}>{message}</Text> : null}
      </View>

      <View style={styles.resendRow}>
        <Text style={styles.resendText}>Didn't receive an email?</Text>
        <Pressable onPress={handleResend} disabled={!canResend}>
          <Text
            style={[styles.resendLink, !canResend && styles.resendDisabled]}
          >
            {canResend ? "Resend" : `Resend in ${resendCooldown}s`}
          </Text>
        </Pressable>
      </View>

      <Pressable style={styles.backRow} onPress={onBackPress}>
        <FontAwesome5 name="arrow-left" size={13} color={colors.primary} />
        <Text style={styles.backText}>
          Back to {mode === "register" ? "Register" : "Reset Password"}
        </Text>
      </Pressable>

      <View style={styles.securityRow}>
        <View style={styles.securityItem}>
          <FontAwesome5 name="shield-alt" size={18} color="#A0AAAD" />
          <Text style={styles.securityText}>HIPAA COMPLIANT</Text>
        </View>
        <View style={styles.securityDot} />
        <View style={styles.securityItem}>
          <FontAwesome5 name="lock" size={15} color="#A0AAAD" />
          <Text style={styles.securityText}>AES-256 ENCRYPTED</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  card: {
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
    paddingHorizontal: 22,
    paddingTop: 32,
    paddingBottom: 26,
    alignItems: "center",
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.14,
    shadowRadius: 24,
    elevation: 5,
  },
  iconHalo: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: "#DDEFF1",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    width: 62,
    height: 62,
    borderRadius: 31,
    backgroundColor: "#B8DADC",
    alignItems: "center",
    justifyContent: "center",
  },
  notificationDot: {
    position: "absolute",
    top: 13,
    right: 16,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: colors.primary,
    borderWidth: 4,
    borderColor: "#B8DADC",
  },
  title: {
    marginTop: 42,
    color: colors.ink,
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    fontFamily: fontFamily.black,
  },
  description: {
    marginTop: 18,
    color: colors.body,
    fontSize: 15,
    lineHeight: 23,
    textAlign: "center",
    fontFamily: fontFamily.regular,
  },
  primaryButton: {
    width: "100%",
    height: 48,
    marginTop: 32,
    borderRadius: 10,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 18,
    elevation: 4,
  },
  primaryButtonPressed: {
    backgroundColor: "#00676B",
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
  },
  waitingPill: {
    marginTop: 28,
    borderRadius: 18,
    backgroundColor: "#E7EFF0",
    paddingHorizontal: 14,
    paddingVertical: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  waitingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: colors.primary,
  },
  waitingText: {
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.medium,
  },
  messageText: {
    marginTop: 12,
    color: colors.primary,
    fontSize: 12,
    lineHeight: 16,
    textAlign: "center",
    fontFamily: fontFamily.semiBold,
  },
  resendRow: {
    marginTop: 26,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  resendText: {
    color: colors.body,
    fontSize: 14,
    fontFamily: fontFamily.regular,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
  resendDisabled: {
    color: "#8A9699",
  },
  backRow: {
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  backText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  securityRow: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flexWrap: "wrap",
    gap: 12,
  },
  securityItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  securityDot: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#B7C0C3",
  },
  securityText: {
    color: "#A0AAAD",
    fontSize: 11,
    letterSpacing: 0.6,
    fontFamily: fontFamily.semiBold,
  },
});
