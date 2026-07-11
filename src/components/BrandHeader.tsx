import { StyleSheet, Text, View } from "react-native";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
import { PawIcon } from "./PawIcon";

export function BrandHeader() {
  return (
    <View style={styles.brandRow}>
      <PawIcon size={22} />
      <Text style={styles.brandText}>PawDigi</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingTop: 6,
    paddingBottom: 18,
  },
  brandText: {
    color: colors.primary,
    fontSize: 28,
    fontFamily: fontFamily.extraBold,
  },
});
