import { ViewStyle } from "react-native";

import { colors } from "./colors";

type ElevationTokens = {
  l1: ViewStyle;
  l2: ViewStyle;
};

export const elevation: ElevationTokens = {
  l1: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  l2: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
  },
};

export const elevatedSurface: ElevationTokens = {
  l1: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    ...elevation.l1,
  },
  l2: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: "#F3F4F6",
    ...elevation.l2,
  },
};
