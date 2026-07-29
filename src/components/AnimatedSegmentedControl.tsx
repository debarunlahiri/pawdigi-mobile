import * as Haptics from "expo-haptics";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  LayoutChangeEvent,
  PanResponder,
  Pressable,
  StyleSheet,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import { elevation } from "../theme/elevation";
import { fontFamily } from "../theme/typography";
import { Text } from "./Typography";

type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (value: T) => void;
  compact?: boolean;
  accessibilityLabel?: string;
};

export function AnimatedSegmentedControl<T extends string>({
  options,
  value,
  onChange,
  compact = false,
  accessibilityLabel,
}: Props<T>) {
  const [trackWidth, setTrackWidth] = useState(0);
  const selectedIndex = Math.max(options.indexOf(value), 0);
  const [visualIndex, setVisualIndex] = useState(selectedIndex);
  const indicatorPosition = useRef(new Animated.Value(0)).current;
  const segmentWidth = trackWidth > 0 ? (trackWidth - 8) / options.length : 0;
  const segmentWidthRef = useRef(0);
  const currentPosition = useRef(0);
  const dragStart = useRef(0);

  segmentWidthRef.current = segmentWidth;

  const selectIndex = (index: number) => {
    const safeIndex = Math.max(0, Math.min(options.length - 1, index));

    Animated.spring(indicatorPosition, {
      toValue: safeIndex * segmentWidthRef.current,
      damping: 19,
      stiffness: 220,
      mass: 0.7,
      useNativeDriver: true,
    }).start();

    if (safeIndex !== selectedIndex) {
      Haptics.selectionAsync().catch(() => undefined);
      onChange(options[safeIndex]);
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, gestureState) =>
          Math.abs(gestureState.dx) > 4 &&
          Math.abs(gestureState.dx) > Math.abs(gestureState.dy),
        onPanResponderGrant: () => {
          indicatorPosition.stopAnimation();
          dragStart.current = currentPosition.current;
        },
        onPanResponderMove: (_, gestureState) => {
          const maximum =
            segmentWidthRef.current * Math.max(options.length - 1, 0);
          indicatorPosition.setValue(
            Math.max(0, Math.min(maximum, dragStart.current + gestureState.dx)),
          );
        },
        onPanResponderRelease: (_, gestureState) => {
          selectIndex(
            Math.round(
              (dragStart.current + gestureState.dx) /
                Math.max(segmentWidthRef.current, 1),
            ),
          );
        },
        onPanResponderTerminate: () => selectIndex(selectedIndex),
      }),
    [indicatorPosition, onChange, options, selectedIndex],
  );

  useEffect(() => {
    const listenerId = indicatorPosition.addListener(({ value: position }) => {
      currentPosition.current = position;

      if (segmentWidthRef.current > 0) {
        const nearest = Math.max(
          0,
          Math.min(
            options.length - 1,
            Math.round(position / segmentWidthRef.current),
          ),
        );
        setVisualIndex((current) => (current === nearest ? current : nearest));
      }
    });

    return () => indicatorPosition.removeListener(listenerId);
  }, [indicatorPosition, options.length]);

  useEffect(() => {
    if (!segmentWidth) return;

    setVisualIndex(selectedIndex);
    Animated.spring(indicatorPosition, {
      toValue: selectedIndex * segmentWidth,
      damping: 19,
      stiffness: 220,
      mass: 0.7,
      useNativeDriver: true,
    }).start();
  }, [indicatorPosition, segmentWidth, selectedIndex]);

  const handleLayout = (event: LayoutChangeEvent) => {
    setTrackWidth(event.nativeEvent.layout.width);
  };

  return (
    <View
      {...panResponder.panHandlers}
      accessibilityLabel={accessibilityLabel}
      onLayout={handleLayout}
      style={[styles.track, compact && styles.trackCompact]}
    >
      {segmentWidth ? (
        <Animated.View
          pointerEvents="none"
          style={[
            styles.indicator,
            compact && styles.indicatorCompact,
            {
              width: segmentWidth,
              transform: [{ translateX: indicatorPosition }],
            },
          ]}
        />
      ) : null}

      {options.map((option, index) => (
        <Pressable
          accessibilityRole="radio"
          accessibilityState={{ selected: value === option }}
          key={option}
          onPress={() => selectIndex(index)}
          style={styles.option}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.text,
              compact && styles.textCompact,
              visualIndex === index && styles.textActive,
            ]}
          >
            {option}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 46,
    flexDirection: "row",
    padding: 4,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    borderRadius: 13,
    backgroundColor: colors.surfaceMuted,
    overflow: "hidden",
  },
  trackCompact: {
    height: 36,
    borderRadius: 10,
  },
  indicator: {
    ...elevation.l1,
    position: "absolute",
    left: 4,
    top: 4,
    height: 36,
    borderRadius: 10,
    backgroundColor: colors.primary,
  },
  indicatorCompact: {
    height: 26,
    borderRadius: 7,
  },
  option: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1,
  },
  text: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 11,
    textAlign: "center",
  },
  textCompact: {
    fontSize: 10,
  },
  textActive: {
    color: colors.card,
    fontFamily: fontFamily.bold,
  },
});
