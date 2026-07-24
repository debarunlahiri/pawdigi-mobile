import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import { Animated, Image, StyleSheet, Text, View } from "react-native";

import { assets } from "../theme/assets";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

export function SplashScreen() {
  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;
  const progress = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: 0,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.timing(progress, {
        toValue: 1,
        duration: 1850,
        useNativeDriver: false,
      }),
    ]).start();
  }, [fade, progress, translateY]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View style={styles.splash}>
      <View style={styles.center}>
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: fade, transform: [{ translateY }] },
          ]}
        >
          <Image
            source={assets.logo}
            style={styles.logo}
            resizeMode="cover"
          />
        </Animated.View>
        <View style={styles.progressTrack}>
          <Animated.View
            style={[styles.progressFill, { width: progressWidth }]}
          />
        </View>
        <Text style={styles.syncText}>SYNCHRONIZING HEALTH DATA</Text>
      </View>

      <View style={styles.footer}>
        <View style={styles.footerBadge}>
          <Ionicons name="shield-checkmark" size={19} color={colors.primary} />
          <Text style={styles.footerBadgeText}>Clinical Grade Care for Me</Text>
        </View>
        <Text style={styles.footerMeta}>
          Secured by PawDigi Encryption | v4.2.0
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.background,
    paddingHorizontal: 36,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    transform: [{ translateY: 52 }],
  },
  logoWrap: {
    alignItems: "center",
    justifyContent: "center",
    width: 190,
    height: 172,
  },
  logo: {
    width: 164,
    height: 164,
    borderRadius: 82,
  },
  progressTrack: {
    width: 226,
    height: 4,
    overflow: "hidden",
    borderRadius: 2,
    backgroundColor: colors.progressTrack,
    marginTop: 22,
  },
  progressFill: {
    height: "100%",
    borderRadius: 2,
    backgroundColor: colors.primary,
  },
  syncText: {
    color: colors.trust,
    fontSize: 18,
    fontFamily: fontFamily.semiBold,
    letterSpacing: 3,
    marginTop: 32,
    textAlign: "center",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 42,
    gap: 16,
  },
  footerBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  footerBadgeText: {
    color: colors.primary,
    fontSize: 20,
    fontFamily: fontFamily.extraBold,
  },
  footerMeta: {
    color: "#9AA3A5",
    fontSize: 16,
    fontFamily: fontFamily.bold,
    textAlign: "center",
  },
});
