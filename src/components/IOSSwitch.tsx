import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { Animated, Pressable, StyleSheet } from "react-native";

import { colors } from "../theme/colors";
import { elevation } from "../theme/elevation";

export function IOSSwitch({
  value,
  onValueChange,
  accessibilityLabel,
  disabled = false,
}: {
  value: boolean;
  onValueChange: (value: boolean) => void;
  accessibilityLabel?: string;
  disabled?: boolean;
}) {
  const progress = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.spring(progress, {
      toValue: value ? 1 : 0,
      damping: 18,
      stiffness: 220,
      mass: 0.7,
      useNativeDriver: false,
    }).start();
  }, [progress, value]);

  const handlePress = () => {
    if (disabled) {
      return;
    }

    void Haptics.selectionAsync();
    onValueChange(!value);
  };

  return (
    <Pressable
      accessibilityLabel={accessibilityLabel}
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      disabled={disabled}
      hitSlop={8}
      onPress={handlePress}
      style={({ pressed }) => [
        styles.pressable,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
    >
      <Animated.View
        style={[
          styles.track,
          {
            backgroundColor: progress.interpolate({
              inputRange: [0, 1],
              outputRange: [colors.borderStrong, colors.primary],
            }),
          },
        ]}
      >
        <Animated.View
          style={[
            styles.thumb,
            {
              transform: [
                {
                  translateX: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 20],
                  }),
                },
              ],
            },
          ]}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    width: 48,
    height: 28,
    borderRadius: 14,
  },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    padding: 3,
  },
  thumb: {
    ...elevation.l1,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.card,
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    opacity: 0.5,
  },
});
