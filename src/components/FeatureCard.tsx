import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import { Text } from "./Typography";

import type { Feature } from "../data/onboarding";
import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
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
    justifyContent: "center",
    ...cardSurface,
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
