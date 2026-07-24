import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { FORM_HANDLING_AND_VERIFICATION_ENABLED } from "../config/features";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

export type VerificationChannel = "email" | "phone";

type EmailVerificationScreenProps = {
  mode: "reset" | "register";
  initialChannel: VerificationChannel;
  onBackPress: () => void;
  onVerified: () => void;
};

export function EmailVerificationScreen({
  mode,
  initialChannel,
  onBackPress,
  onVerified,
}: EmailVerificationScreenProps) {
  const [channel, setChannel] =
    useState<VerificationChannel>(initialChannel);
  const [code, setCode] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);
  const [message, setMessage] = useState("");

  const canResend = resendCooldown === 0;

  useEffect(() => {
    if (resendCooldown === 0) return;

    const timer = setTimeout(
      () => setResendCooldown((value) => Math.max(value - 1, 0)),
      1000,
    );
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const selectChannel = (nextChannel: VerificationChannel) => {
    setChannel(nextChannel);
    setCode("");
    setMessage("");
  };

  const handleOpenEmail = async () => {
    setMessage("");

    try {
      const canOpenMail = await Linking.canOpenURL("mailto:");
      if (canOpenMail) {
        await Linking.openURL("mailto:");
      } else {
        setMessage("No email app was found.");
      }
    } catch {
      setMessage("Unable to open the email app.");
    }
  };

  const handleVerifyCode = () => {
    if (FORM_HANDLING_AND_VERIFICATION_ENABLED && code.length !== 6) {
      setMessage("Enter the 6-digit code.");
      return;
    }

    onVerified();
  };

  const handleResend = () => {
    if (!canResend) return;

    setResendCooldown(30);
    setMessage(
      channel === "email" ? "Email sent again." : "Text message sent again.",
    );
  };

  return (
    <View style={styles.screen}>
      <View style={styles.card}>
        <View style={styles.iconCircle}>
          <Ionicons
            name={channel === "email" ? "mail" : "chatbubble"}
            size={32}
            color={colors.primary}
          />
        </View>

        <Text style={styles.title}>
          {channel === "email" ? "Check your email" : "Check your phone"}
        </Text>
        <Text style={styles.description}>
          {mode === "reset"
            ? "Choose where to receive your password reset."
            : "Choose how you’d like to verify your caregiver."}
        </Text>

        <View style={styles.channelPicker}>
          <Pressable
            onPress={() => selectChannel("email")}
            style={[
              styles.channelButton,
              channel === "email" && styles.channelButtonSelected,
            ]}
          >
            <Ionicons
              name="mail-outline"
              size={18}
              color={channel === "email" ? "#FFFFFF" : colors.primary}
            />
            <Text
              style={[
                styles.channelText,
                channel === "email" && styles.channelTextSelected,
              ]}
            >
              Email
            </Text>
          </Pressable>

          <Pressable
            onPress={() => selectChannel("phone")}
            style={[
              styles.channelButton,
              channel === "phone" && styles.channelButtonSelected,
            ]}
          >
            <Ionicons
              name="call-outline"
              size={18}
              color={channel === "phone" ? "#FFFFFF" : colors.primary}
            />
            <Text
              style={[
                styles.channelText,
                channel === "phone" && styles.channelTextSelected,
              ]}
            >
              Phone
            </Text>
          </Pressable>
        </View>

        {channel === "email" ? (
          <Pressable
            onPress={handleOpenEmail}
            style={({ pressed }) => [
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <FontAwesome5 name="external-link-alt" size={17} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Open Email App</Text>
          </Pressable>
        ) : (
          <>
            <TextInput
              keyboardType="number-pad"
              maxLength={6}
              onChangeText={(value) => {
                setCode(value.replace(/\D/g, ""));
                setMessage("");
              }}
              placeholder="6-digit code"
              placeholderTextColor="#849092"
              style={styles.codeInput}
              value={code}
            />
            <Pressable
              onPress={handleVerifyCode}
              style={({ pressed }) => [
                styles.primaryButton,
                styles.verifyButton,
                pressed && styles.primaryButtonPressed,
              ]}
            >
              <Text style={styles.primaryButtonText}>Verify Phone</Text>
              <Ionicons name="arrow-forward" size={19} color="#FFFFFF" />
            </Pressable>
          </>
        )}

        {message ? <Text style={styles.messageText}>{message}</Text> : null}

        <View style={styles.resendRow}>
          <Text style={styles.resendText}>
            Didn’t receive {channel === "email" ? "the email?" : "a code?"}
          </Text>
          <Pressable onPress={handleResend} disabled={!canResend}>
            <Text
              style={[styles.resendLink, !canResend && styles.resendDisabled]}
            >
              {canResend ? "Resend" : `${resendCooldown}s`}
            </Text>
          </Pressable>
        </View>

        <Pressable style={styles.backRow} onPress={onBackPress}>
          <Ionicons name="arrow-back" size={15} color={colors.primary} />
          <Text style={styles.backText}>Go back</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    paddingHorizontal: 16,
    justifyContent: "center",
    backgroundColor: colors.background,
  },
  card: {
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
    alignItems: "center",
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 22,
    paddingVertical: 30,
    backgroundColor: colors.card,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.14,
    shadowRadius: 22,
    elevation: 5,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.paleTeal,
  },
  title: {
    marginTop: 22,
    color: colors.ink,
    fontSize: 27,
    fontFamily: fontFamily.black,
    textAlign: "center",
  },
  description: {
    marginTop: 9,
    color: colors.body,
    fontSize: 14,
    lineHeight: 20,
    fontFamily: fontFamily.regular,
    textAlign: "center",
  },
  channelPicker: {
    width: "100%",
    marginTop: 22,
    padding: 4,
    borderRadius: 12,
    backgroundColor: "#E8F2F3",
    flexDirection: "row",
    gap: 4,
  },
  channelButton: {
    flex: 1,
    height: 40,
    borderRadius: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  channelButtonSelected: {
    backgroundColor: colors.primary,
  },
  channelText: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  channelTextSelected: {
    color: "#FFFFFF",
  },
  primaryButton: {
    width: "100%",
    height: 48,
    marginTop: 22,
    borderRadius: 11,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  verifyButton: {
    marginTop: 12,
  },
  primaryButtonPressed: {
    backgroundColor: colors.ink,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: fontFamily.semiBold,
  },
  codeInput: {
    width: "100%",
    height: 52,
    marginTop: 22,
    borderRadius: 11,
    borderWidth: 1.3,
    borderColor: "#BACACD",
    color: colors.ink,
    backgroundColor: colors.background,
    fontSize: 20,
    letterSpacing: 8,
    textAlign: "center",
    fontFamily: fontFamily.semiBold,
  },
  messageText: {
    marginTop: 10,
    color: colors.primary,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
    textAlign: "center",
  },
  resendRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
  },
  resendText: {
    color: colors.body,
    fontSize: 13,
    fontFamily: fontFamily.regular,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 13,
    fontFamily: fontFamily.semiBold,
  },
  resendDisabled: {
    color: "#8A9699",
  },
  backRow: {
    marginTop: 18,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  backText: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
});
