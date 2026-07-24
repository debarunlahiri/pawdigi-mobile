import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { FORM_HANDLING_AND_VERIFICATION_ENABLED } from "../config/features";
import { assets } from "../theme/assets";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

type WelcomeScreenProps = {
  onLoginPress: () => void;
  onCreatePress: (petName: string) => void;
};

export function WelcomeScreen({
  onLoginPress,
  onCreatePress,
}: WelcomeScreenProps) {
  const [isNamingPet, setIsNamingPet] = useState(false);
  const [petName, setPetName] = useState("");
  const [showNameError, setShowNameError] = useState(false);

  const handleCreatePress = () => {
    if (!isNamingPet) {
      setIsNamingPet(true);
      return;
    }

    const trimmedPetName = petName.trim();
    if (FORM_HANDLING_AND_VERIFICATION_ENABLED && !trimmedPetName) {
      setShowNameError(true);
      return;
    }

    onCreatePress(trimmedPetName || "My Pet");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <View style={styles.content}>
        <Text style={styles.welcome}>
          Welcoming you with{"\n"}a wagging tail
          <Text style={styles.welcomeAccent}>.</Text>
        </Text>

        <View style={styles.logoWrap}>
          <Image source={assets.logo} style={styles.logo} resizeMode="cover" />
        </View>

        <Text style={styles.brandName}>PawDigi.life</Text>
        <Text style={styles.prompt}>What would you like to do?</Text>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            onPress={onLoginPress}
            style={({ pressed }) => [
              styles.actionButton,
              styles.primaryButton,
              pressed && styles.primaryButtonPressed,
            ]}
          >
            <View style={styles.actionIcon}>
              <Ionicons name="log-in-outline" size={22} color="#FFFFFF" />
            </View>
            <View style={styles.actionCopy}>
              <Text style={styles.primaryButtonText}>
                Sign in to your PawDigi.life
              </Text>
              <Text style={styles.primaryButtonHint}>
                I already have an account
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color="#FFFFFF" />
          </Pressable>

          <View style={styles.createCard}>
            <Pressable
              accessibilityRole="button"
              onPress={handleCreatePress}
              style={({ pressed }) => [
                styles.actionButton,
                styles.secondaryButton,
                pressed && styles.secondaryButtonPressed,
              ]}
            >
              <View style={[styles.actionIcon, styles.secondaryIcon]}>
                <Ionicons name="paw" size={21} color={colors.primary} />
              </View>
              <View style={styles.actionCopy}>
                <Text style={styles.secondaryButtonText}>
                  Create your own PawDigi.life
                </Text>
                <Text style={styles.secondaryButtonHint}>
                  Start a new digital pet passport
                </Text>
              </View>
              <Ionicons
                name={isNamingPet ? "arrow-forward" : "chevron-down"}
                size={22}
                color={colors.primary}
              />
            </Pressable>

            {isNamingPet ? (
              <View style={styles.nameSection}>
                <Text style={styles.nameLabel}>First, what’s your pet’s name?</Text>
                <View
                  style={[
                    styles.inputWrap,
                    showNameError && styles.inputWrapError,
                  ]}
                >
                  <Ionicons name="paw-outline" size={19} color={colors.muted} />
                  <TextInput
                    autoFocus
                    autoCapitalize="words"
                    maxLength={40}
                    onChangeText={(value) => {
                      setPetName(value);
                      if (value.trim()) setShowNameError(false);
                    }}
                    onSubmitEditing={handleCreatePress}
                    placeholder="Your pet’s name"
                    placeholderTextColor="#849092"
                    returnKeyType="go"
                    style={styles.input}
                    value={petName}
                  />
                </View>
                {showNameError ? (
                  <Text style={styles.errorText}>
                    Please enter your pet’s name to continue.
                  </Text>
                ) : null}
              </View>
            ) : null}
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: 22,
    paddingBottom: 20,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    maxWidth: 460,
    alignSelf: "center",
  },
  welcome: {
    color: colors.ink,
    fontSize: 31,
    lineHeight: 38,
    fontFamily: fontFamily.black,
    textAlign: "center",
  },
  welcomeAccent: {
    color: colors.primary,
  },
  logoWrap: {
    width: 142,
    height: 142,
    marginTop: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  logo: {
    width: 140,
    height: 140,
    borderRadius: 70,
  },
  brandName: {
    marginTop: 2,
    color: colors.primary,
    fontSize: 25,
    fontFamily: fontFamily.extraBold,
  },
  prompt: {
    marginTop: 24,
    color: colors.body,
    fontSize: 15,
    fontFamily: fontFamily.medium,
  },
  actions: {
    width: "100%",
    marginTop: 16,
    gap: 12,
  },
  actionButton: {
    minHeight: 72,
    borderRadius: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  primaryButton: {
    backgroundColor: colors.primary,
  },
  primaryButtonPressed: {
    backgroundColor: "#008F98",
  },
  secondaryButton: {
    borderWidth: 1.5,
    borderColor: "#B8D5D7",
    backgroundColor: colors.card,
  },
  secondaryButtonPressed: {
    backgroundColor: "#F7FCFC",
  },
  actionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.18)",
  },
  secondaryIcon: {
    backgroundColor: colors.paleTeal,
  },
  actionCopy: {
    flex: 1,
  },
  primaryButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontFamily: fontFamily.extraBold,
  },
  primaryButtonHint: {
    marginTop: 3,
    color: "rgba(255, 255, 255, 0.78)",
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  secondaryButtonText: {
    color: colors.ink,
    fontSize: 15,
    fontFamily: fontFamily.extraBold,
  },
  secondaryButtonHint: {
    marginTop: 3,
    color: colors.body,
    fontSize: 12,
    fontFamily: fontFamily.regular,
  },
  createCard: {
    overflow: "hidden",
    borderRadius: 16,
    backgroundColor: colors.card,
  },
  nameSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 18,
    borderWidth: 1.5,
    borderTopWidth: 0,
    borderColor: "#B8D5D7",
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
  },
  nameLabel: {
    color: colors.ink,
    fontSize: 14,
    fontFamily: fontFamily.semiBold,
  },
  inputWrap: {
    height: 48,
    marginTop: 10,
    borderRadius: 10,
    borderWidth: 1.3,
    borderColor: "#BACACD",
    backgroundColor: colors.background,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputWrapError: {
    borderColor: "#B91C1C",
    backgroundColor: "#FFF7F7",
  },
  input: {
    flex: 1,
    color: colors.ink,
    fontSize: 15,
    fontFamily: fontFamily.regular,
  },
  errorText: {
    marginTop: 7,
    color: "#B91C1C",
    fontSize: 11,
    fontFamily: fontFamily.medium,
  },
});
