import { ViewStyle } from "react-native";

import { colors } from "./colors";
import { elevation } from "./elevation";

export const cardSurface: ViewStyle = {
  backgroundColor: colors.card,
  borderWidth: 1,
  borderColor: colors.borderStrong,
  borderRadius: 12,
  padding: 16,
  ...elevation.l1,
};
