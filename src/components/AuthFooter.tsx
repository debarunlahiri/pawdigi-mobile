import { Pressable, StyleSheet, View } from "react-native";
import { Text } from "./Typography";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

export function AuthFooter() {
  return (
    <View style={styles.footer}>
      <Pressable accessibilityRole="link">
        <Text style={styles.link}>About Us</Text>
      </Pressable>
      <View style={styles.dot} />
      <Pressable accessibilityRole="link">
        <Text style={styles.link}>Enquiries</Text>
      </Pressable>
      <View style={styles.dot} />
      <Pressable accessibilityRole="link">
        <Text style={styles.link}>Contact Us</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    minHeight: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  link: {
    color: colors.primary,
    fontSize: 12,
    fontFamily: fontFamily.semiBold,
  },
  dot: {
    width: 3,
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
  },
});
