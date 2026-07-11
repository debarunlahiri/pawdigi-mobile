import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, Text } from "react-native";

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
        <Ionicons name="arrow-forward" size={24} color="#FFFFFF" />
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
    backgroundColor: "#00676B",
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: "#BACACD",
    backgroundColor: colors.card,
  },
  secondaryPressed: {
    backgroundColor: "#F8FBFB",
  },
  label: {
    fontSize: 15,
    fontFamily: fontFamily.extraBold,
  },
  primaryLabel: {
    color: "#FFFFFF",
  },
  secondaryLabel: {
    color: colors.primary,
  },
});
