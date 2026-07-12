import { Animated, Pressable, StyleSheet } from "react-native";

import { colors } from "../theme/colors";

export function IOSSwitch({
  value,
  onValueChange,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      onPress={() => onValueChange(!value)}
      style={[styles.track, value && styles.trackActive]}
    >
      <Animated.View style={[styles.thumb, value && styles.thumbActive]} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  track: {
    width: 46,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#E7EEEE",
    justifyContent: "center",
    paddingHorizontal: 3,
  },
  trackActive: {
    backgroundColor: "#BFE8E8",
  },
  thumb: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#FFFFFF",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 2,
    elevation: 2,
  },
  thumbActive: {
    transform: [{ translateX: 18 }],
    backgroundColor: colors.primary,
  },
});
