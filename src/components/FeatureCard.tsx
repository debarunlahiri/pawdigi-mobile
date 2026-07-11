import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";

import type { Feature } from "../data/onboarding";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

type FeatureCardProps = {
  feature: Feature;
};

export function FeatureCard({ feature }: FeatureCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.iconWrap}>
        <MaterialCommunityIcons
          name={feature.icon}
          size={27}
          color={colors.primary}
        />
      </View>
      <Text style={styles.title}>{feature.title}</Text>
      <Text style={styles.body}>{feature.body}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    minHeight: 132,
    borderRadius: 13,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.cardSoft,
    paddingHorizontal: 22,
    paddingVertical: 16,
    justifyContent: "center",
  },
  iconWrap: {
    width: 40,
    height: 40,
    borderRadius: 9,
    backgroundColor: colors.paleTeal,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  title: {
    color: colors.body,
    fontSize: 20,
    fontFamily: fontFamily.black,
    marginBottom: 8,
  },
  body: {
    color: colors.muted,
    fontSize: 13,
    fontFamily: fontFamily.regular,
    lineHeight: 19,
  },
});
