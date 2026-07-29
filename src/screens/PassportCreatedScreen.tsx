import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text } from "../components/Typography";

import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { elevation } from "../theme/elevation";
import { fontFamily } from "../theme/typography";
import { assets } from "../theme/assets";

type Props = {
  petName: string;
  photoUri?: string;
  microchipNumber: string;
  vaccinationDetails: string;
  previousRecordCount: number;
  onViewPassport: () => void;
  onGoHome: () => void;
};

export function PassportCreatedScreen({
  petName,
  photoUri,
  microchipNumber,
  vaccinationDetails,
  previousRecordCount,
  onViewPassport,
  onGoHome,
}: Props) {
  const entrance = useRef(new Animated.Value(0)).current;
  const greetingAnimation = useRef(new Animated.Value(0)).current;
  const displayName = petName.trim() || "my friend";
  const idTag = useMemo(
    () => createIdTag(displayName, microchipNumber),
    [displayName, microchipNumber],
  );

  useEffect(() => {
    Animated.spring(entrance, {
      toValue: 1,
      friction: 8,
      tension: 70,
      useNativeDriver: true,
    }).start();
  }, [entrance]);

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(greetingAnimation, {
          toValue: 1,
          duration: 700,
          useNativeDriver: true,
        }),
        Animated.timing(greetingAnimation, {
          toValue: 0,
          duration: 700,
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();
    return () => animation.stop();
  }, [greetingAnimation]);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View
          style={{
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [22, 0],
                }),
              },
            ],
          }}
        >
          <View style={styles.hero}>
            <View style={styles.photoFrame}>
              <Image
                source={photoUri ? { uri: photoUri } : assets.logo}
                style={styles.photo}
              />
              <View style={styles.verifiedBadge}>
                <Ionicons
                  name="shield-checkmark"
                  size={22}
                  color={colors.card}
                />
              </View>
            </View>

            <View style={styles.greetingRow}>
              <Animated.View
                style={[
                  styles.greetingIcon,
                  {
                    transform: [
                      {
                        translateY: greetingAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, -3],
                        }),
                      },
                      {
                        rotate: greetingAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: ["-8deg", "8deg"],
                        }),
                      },
                      {
                        scale: greetingAnimation.interpolate({
                          inputRange: [0, 1],
                          outputRange: [1, 1.12],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <Ionicons name="paw" size={21} color={colors.ink} />
              </Animated.View>
              <Text style={styles.greeting}>
                Woof woof, {displayName}! How’ve you been?
              </Text>
            </View>
            <Text style={styles.readyTitle}>
              Your Digital Passport is Ready.
            </Text>
            <Text style={styles.description}>
              Thanks to my human, I have a secure place for my health records,
              memories, vaccinations, adventures, and everything that makes me
              who I am.
            </Text>
          </View>

          <View style={styles.statusGrid}>
            <StatusCard
              icon="medical-outline"
              label="Immunizations"
              value={
                vaccinationDetails.trim() ? "Details Added" : "Needs Update"
              }
            />
            <StatusCard
              icon="airplane-outline"
              label="Travel Status"
              value={microchipNumber.trim() ? "Identity Ready" : "Setup Needed"}
            />
            <StatusCard icon="id-card-outline" label="ID Tag" value={idTag} />
            <StatusCard
              icon="heart-circle-outline"
              label="Health Records"
              value={
                previousRecordCount
                  ? `${previousRecordCount} Secured`
                  : "Encrypted"
              }
            />
          </View>
        </Animated.View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable onPress={onViewPassport} style={styles.primaryButton}>
          <Ionicons name="id-card-outline" size={18} color={colors.card} />
          <Text style={styles.primaryButtonText}>View My Passport</Text>
          <Ionicons name="arrow-forward" size={18} color={colors.card} />
        </Pressable>

        <Pressable onPress={onGoHome} style={styles.homeButton}>
          <Ionicons name="home-outline" size={18} color={colors.primary} />
          <Text style={styles.homeButtonText}>Take Me Home</Text>
        </Pressable>
      </View>
    </View>
  );
}

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.statusCard}>
      <View style={styles.statusIcon}>
        <Ionicons name={icon} size={21} color={colors.primary} />
      </View>
      <Text style={styles.statusLabel}>{label}</Text>
      <Text numberOfLines={2} style={styles.statusValue}>
        {value}
      </Text>
    </View>
  );
}

function createIdTag(name: string, microchipNumber: string) {
  if (microchipNumber.trim()) {
    const compact = microchipNumber.replace(/\s/g, "");
    return `PD-${compact.slice(-6)}`;
  }

  const hash = name
    .toUpperCase()
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return `PD-${String(hash * 37)
    .padStart(6, "0")
    .slice(-6)}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 18, paddingTop: 4, paddingBottom: 16 },
  hero: { alignItems: "center" },
  photoFrame: {
    width: 138,
    height: 138,
    marginTop: 2,
    borderWidth: 5,
    borderColor: colors.card,
    borderRadius: 69,
    backgroundColor: colors.paleTeal,
    ...elevation.l2,
  },
  photo: { width: "100%", height: "100%", borderRadius: 64 },
  verifiedBadge: {
    position: "absolute",
    right: -5,
    bottom: 4,
    width: 45,
    height: 45,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: colors.background,
    borderRadius: 23,
    backgroundColor: colors.primary,
  },
  greetingRow: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 6,
  },
  greetingIcon: {
    width: 30,
    height: 30,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  greeting: {
    maxWidth: 290,
    flexShrink: 1,
    color: colors.ink,
    fontFamily: fontFamily.black,
    fontSize: 20,
    lineHeight: 25,
    textAlign: "center",
    includeFontPadding: false,
  },
  readyTitle: {
    maxWidth: 330,
    marginTop: 12,
    color: colors.primary,
    fontFamily: fontFamily.extraBold,
    fontSize: 23,
    lineHeight: 29,
    textAlign: "center",
  },
  description: {
    maxWidth: 350,
    marginTop: 10,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 19,
    textAlign: "center",
  },
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 17,
  },
  statusCard: {
    width: "48%",
    minHeight: 106,
    alignItems: "center",
    justifyContent: "center",
    ...cardSurface,
  },
  statusIcon: {
    width: 35,
    height: 35,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 5,
    borderRadius: 11,
    backgroundColor: colors.paleTeal,
  },
  statusLabel: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 11,
    textAlign: "center",
  },
  statusValue: {
    marginTop: 2,
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 13,
    lineHeight: 17,
    textAlign: "center",
  },
  primaryButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 25,
    backgroundColor: colors.primary,
    ...elevation.l2,
  },
  primaryButtonText: {
    color: colors.card,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  homeButton: {
    minHeight: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
    marginTop: 9,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 25,
    backgroundColor: "transparent",
  },
  homeButtonText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  bottomBar: {
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.background,
  },
});
