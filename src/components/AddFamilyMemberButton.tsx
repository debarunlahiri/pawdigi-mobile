import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { Text } from "./Typography";

type AddFamilyMemberButtonProps = {
  onPress?: () => void;
  label?: string;
  style?: ViewStyle;
};

export function AddFamilyMemberButton({
  onPress,
  label = "Add family member",
  style,
}: AddFamilyMemberButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.button, style, pressed && styles.pressed]}
    >
      <PressableIcon />
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}

function PressableIcon() {
  return (
    <Ionicons name="add" size={20} color={colors.primary} style={styles.icon} />
  );
}

const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 54,
    borderRadius: 12,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  icon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: colors.surfaceSubtle,
    textAlign: "center",
    lineHeight: 28,
  },
  label: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  pressed: {
    backgroundColor: colors.surfaceMuted,
    opacity: 0.88,
  },
});
