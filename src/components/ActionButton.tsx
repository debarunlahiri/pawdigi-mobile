import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet } from "react-native";
import { Text } from "./Typography";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

type ActionButtonProps = {
  label: string;
  variant: "primary" | "secondary";
  onPress?: () => void;
};

export function ActionButton({ label, variant, onPress }: ActionButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isPrimary ? styles.primary : styles.secondary,
        pressed &&
          (isPrimary ? styles.primaryPressed : styles.secondaryPressed),
      ]}
    >
      <Text
        style={[
          styles.label,
          isPrimary ? styles.primaryLabel : styles.secondaryLabel,
        ]}
      >
        {label}
      </Text>
      {isPrimary ? (
        <Ionicons name="arrow-forward" size={24} color={colors.card} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    borderRadius: 9,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
  },
  primary: {
    backgroundColor: colors.primary,
  },
  primaryPressed: {
    backgroundColor: colors.ink,
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
  },
  secondaryPressed: {
    backgroundColor: colors.background,
  },
  label: {
    fontSize: 15,
    fontFamily: fontFamily.extraBold,
  },
  primaryLabel: {
    color: colors.card,
  },
  secondaryLabel: {
    color: colors.primary,
  },
});
