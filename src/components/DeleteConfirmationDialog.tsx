import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { useEffect, useRef } from "react";
import { Animated, Modal, Pressable, StyleSheet, View } from "react-native";

import { colors } from "../theme/colors";
import { elevatedSurface } from "../theme/elevation";
import { fontFamily } from "../theme/typography";
import { Text } from "./Typography";

type DeleteConfirmationDialogProps = {
  visible: boolean;
  title: string;
  message: string;
  onCancel: () => void;
  onConfirm: () => void;
  confirmLabel?: string;
};

export function DeleteConfirmationDialog({
  visible,
  title,
  message,
  onCancel,
  onConfirm,
  confirmLabel = "Delete",
}: DeleteConfirmationDialogProps) {
  const scale = useRef(new Animated.Value(0.9)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const dogTilt = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!visible) {
      return;
    }

    scale.setValue(0.9);
    opacity.setValue(0);
    dogTilt.setValue(0);

    Animated.parallel([
      Animated.spring(scale, {
        toValue: 1,
        damping: 16,
        stiffness: 180,
        mass: 0.8,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
      Animated.sequence([
        Animated.timing(dogTilt, {
          toValue: -1,
          duration: 180,
          useNativeDriver: true,
        }),
        Animated.spring(dogTilt, {
          toValue: 0,
          damping: 7,
          stiffness: 130,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  }, [dogTilt, opacity, scale, visible]);

  const confirmDelete = () => {
    void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    onConfirm();
  };

  return (
    <Modal
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
      transparent
      visible={visible}
    >
      <View style={styles.backdrop}>
        <Pressable
          accessibilityLabel="Cancel deletion"
          onPress={onCancel}
          style={StyleSheet.absoluteFill}
        />

        <Animated.View
          style={[
            styles.card,
            {
              opacity,
              transform: [{ scale }],
            },
          ]}
        >
          <View style={styles.artWrap}>
            <Animated.View
              style={{
                transform: [
                  {
                    rotate: dogTilt.interpolate({
                      inputRange: [-1, 0, 1],
                      outputRange: ["-8deg", "0deg", "8deg"],
                    }),
                  },
                ],
              }}
            >
              <FontAwesome5 name="dog" size={38} color={colors.primary} />
            </Animated.View>
            <View style={styles.warningBadge}>
              <Ionicons name="trash-outline" size={17} color={colors.card} />
            </View>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.message}>{message}</Text>

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              onPress={onCancel}
              style={({ pressed }) => [
                styles.button,
                styles.cancelButton,
                pressed && styles.pressed,
              ]}
            >
              <Text style={styles.cancelText}>Keep it</Text>
            </Pressable>

            <Pressable
              accessibilityRole="button"
              onPress={confirmDelete}
              style={({ pressed }) => [
                styles.button,
                styles.deleteButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="trash-outline" size={17} color={colors.card} />
              <Text style={styles.deleteText}>{confirmLabel}</Text>
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(23, 29, 29, 0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  card: {
    ...elevatedSurface.l2,
    width: "100%",
    maxWidth: 380,
    borderRadius: 22,
    padding: 22,
    alignItems: "center",
  },
  artWrap: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: colors.errorSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  warningBadge: {
    position: "absolute",
    right: -2,
    bottom: 1,
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 3,
    borderColor: colors.card,
    backgroundColor: colors.error,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 16,
    color: colors.ink,
    fontFamily: fontFamily.extraBold,
    fontSize: 20,
    lineHeight: 28,
    textAlign: "center",
  },
  message: {
    marginTop: 7,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: "center",
  },
  actions: {
    width: "100%",
    marginTop: 22,
    flexDirection: "row",
    gap: 10,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
  },
  deleteButton: {
    backgroundColor: colors.error,
  },
  cancelText: {
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  deleteText: {
    color: colors.card,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  pressed: {
    opacity: 0.82,
    transform: [{ scale: 0.98 }],
  },
});
