export const fontFamily = {
  regular: "Inter_400Regular",
  medium: "Inter_500Medium",
  semiBold: "Inter_600SemiBold",
  bold: "Inter_700Bold",
  extraBold: "Inter_800ExtraBold",
  black: "Inter_900Black",
} as const;

export const typography = {
  headlineXL: {
    fontFamily: fontFamily.black,
    fontSize: 36,
    lineHeight: 44,
  },
  headlineLG: {
    fontFamily: fontFamily.extraBold,
    fontSize: 28,
    lineHeight: 36,
  },
  headlineMD: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 28,
  },
  bodyLG: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 28,
  },
  bodyMD: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  labelMD: {
    fontFamily: fontFamily.medium,
    fontSize: 14,
    lineHeight: 16,
  },
  button: {
    fontFamily: fontFamily.bold,
    fontSize: 16,
    lineHeight: 20,
  },
} as const;
