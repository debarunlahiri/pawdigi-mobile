import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { Text, TextInput } from "./Typography";

type DateInputProps = {
  value: string;
  placeholder?: string;
  onCalendarPress: () => void;
  onChangeText?: (value: string) => void;
  accessibilityLabel?: string;
  error?: boolean;
  maxLength?: number;
  style?: ViewStyle;
};

export function DateInput({
  value,
  placeholder = "DD/MM/YYYY",
  onCalendarPress,
  onChangeText,
  accessibilityLabel = "Choose date",
  error = false,
  maxLength = 10,
  style,
}: DateInputProps) {
  const displayValue = value || placeholder;

  return (
    <View style={[styles.container, error && styles.error, style]}>
      <FontAwesome5 name="calendar-alt" size={16} color={colors.body} />

      {onChangeText ? (
        <TextInput
          accessibilityLabel={accessibilityLabel}
          keyboardType="number-pad"
          maxLength={maxLength}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.body}
          style={styles.input}
          value={value}
        />
      ) : (
        <Pressable
          accessibilityLabel={accessibilityLabel}
          accessibilityRole="button"
          onPress={onCalendarPress}
          style={styles.valueButton}
        >
          <Text style={[styles.value, !value && styles.placeholder]}>
            {displayValue}
          </Text>
        </Pressable>
      )}

      <Pressable
        accessibilityLabel={accessibilityLabel}
        accessibilityRole="button"
        hitSlop={10}
        onPress={onCalendarPress}
        style={({ pressed }) => [
          styles.calendarButton,
          pressed && styles.calendarButtonPressed,
        ]}
      >
        <Ionicons
          name="calendar-number-outline"
          size={20}
          color={colors.primary}
        />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: 46,
    borderRadius: 11,
    borderWidth: 1.2,
    borderColor: colors.borderStrong,
    backgroundColor: colors.cardSoft,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 13,
    gap: 11,
  },
  error: {
    borderColor: colors.error,
    backgroundColor: colors.errorSoft,
  },
  input: {
    flex: 1,
    height: "100%",
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    paddingVertical: 0,
  },
  valueButton: {
    flex: 1,
    height: "100%",
    justifyContent: "center",
  },
  value: {
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 14,
  },
  placeholder: {
    color: colors.body,
  },
  calendarButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  calendarButtonPressed: {
    backgroundColor: colors.paleTeal,
  },
});
