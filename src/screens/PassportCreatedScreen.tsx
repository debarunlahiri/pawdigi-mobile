import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

type Props = {
  petName: string;
  breed: string;
  birthDate: string;
  gender: string;
  photoUri?: string;
  microchipNumber: string;
  onViewPassport: () => void;
  onGoHome: () => void;
};

const confetti = Array.from({ length: 22 }, (_, index) => ({
  left: `${(index * 37) % 96}%` as `${number}%`,
  top: 145 + ((index * 83) % 650),
  color: [colors.primary, colors.ink, colors.accent, "#FFFFFF"][index % 4],
  rotate: `${(index * 29) % 90}deg`,
}));

export function PassportCreatedScreen({
  petName,
  breed,
  birthDate,
  gender,
  photoUri,
  microchipNumber,
  onViewPassport,
  onGoHome,
}: Props) {
  const entrance = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;
  const confettiFall = useRef(new Animated.Value(-80)).current;
  const displayName = petName.trim() || "My Profile";
  const age = useMemo(() => getAge(birthDate), [birthDate]);

  useEffect(() => {
    Animated.parallel([
      Animated.spring(checkScale, {
        toValue: 1,
        friction: 5,
        tension: 85,
        useNativeDriver: true,
      }),
      Animated.timing(entrance, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(confettiFall, {
        toValue: 0,
        duration: 1100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [checkScale, confettiFall, entrance]);

  return (
    <View style={styles.screen}>
      <View pointerEvents="none" style={StyleSheet.absoluteFill}>
        {confetti.map((piece, index) => (
          <Animated.View
            key={index}
            style={[
              styles.confetti,
              {
                left: piece.left,
                top: piece.top,
                backgroundColor: piece.color,
                transform: [
                  { translateY: confettiFall },
                  { rotate: piece.rotate },
                ],
              },
            ]}
          />
        ))}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Animated.View
          style={[styles.checkCircle, { transform: [{ scale: checkScale }] }]}
        >
          <FontAwesome5 name="check-circle" size={34} color="#004B54" />
        </Animated.View>
        <Animated.View
          style={{
            opacity: entrance,
            transform: [
              {
                translateY: entrance.interpolate({
                  inputRange: [0, 1],
                  outputRange: [18, 0],
                }),
              },
            ],
          }}
        >
          <Text style={styles.title}>Passport Created!</Text>
          <Text style={styles.subtitle}>
            {displayName}'s official health profile is now active and{`\n`}
            verified for international travel.
          </Text>

          <View style={styles.passportCard}>
            <View style={styles.brandRow}>
              <View style={styles.logo}>
                <FontAwesome5 name="paw" size={20} color="#FFFFFF" />
              </View>
              <Text style={styles.brand}>PawDigi</Text>
              <View style={styles.verified}>
                <FontAwesome5 name="check-circle" size={14} color="#2C250B" solid />
                <Text style={styles.verifiedText}>VERIFIED STATUS</Text>
              </View>
            </View>

            <View style={styles.identityRow}>
              <Image
                source={{
                  uri:
                    photoUri ||
                    "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg",
                }}
                style={styles.photo}
              />
              <View style={styles.identityCopy}>
                <Text style={styles.petName}>{displayName}</Text>
                <Text style={styles.breed}>{breed || "Verified Profile"}</Text>
                <Text style={styles.meta}>
                  <FontAwesome5 name="calendar-alt" size={12} /> {age} •{" "}
                  {gender}
                </Text>
              </View>
            </View>

            <View style={styles.infoRow}>
              <InfoBox
                label="MICROCHIP ID"
                value={microchipNumber || "Not provided"}
              />
              <InfoBox label="TRAVEL REGION" value="European Union" />
            </View>
            <View style={styles.divider} />
            <View style={styles.securityRow}>
              <View style={styles.barcode}>
                {Array.from({ length: 14 }, (_, i) => (
                  <View
                    key={i}
                    style={[styles.bar, { width: i % 3 === 0 ? 3 : 1 }]}
                  />
                ))}
              </View>
              <Text style={styles.secured}>SECURED BY PAWDIGI V2.4</Text>
            </View>
          </View>

          <Pressable style={styles.primaryButton} onPress={onViewPassport}>
            <FontAwesome5 name="id-card" size={20} color="#FFFFFF" />
            <Text style={styles.primaryText}>View Digital Passport</Text>
          </Pressable>
          <Pressable style={styles.homeButton} onPress={onGoHome}>
            <Text style={styles.homeText}>Go to Home</Text>
            <FontAwesome5 name="home" size={18} color={colors.primary} />
          </Pressable>
          <Text style={styles.legal}>
            THIS IS A LEGALLY RECOGNIZED DIGITAL DOCUMENT IN 24 REGIONS
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

function InfoBox({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.infoBox}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  );
}

function getAge(value: string) {
  const match = value.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (!match) return "Age verified";
  const born = new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]),
  );
  const years = Math.max(
    0,
    Math.floor((Date.now() - born.getTime()) / 31557600000),
  );
  return `${years} ${years === 1 ? "year" : "years"}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 22 },
  confetti: { position: "absolute", width: 9, height: 13, zIndex: 0 },
  checkCircle: {
    alignSelf: "center",
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    marginTop: 14,
    textAlign: "center",
    color: colors.primary,
    fontFamily: fontFamily.black,
    fontSize: 23,
  },
  subtitle: {
    marginTop: 6,
    textAlign: "center",
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  passportCard: {
    marginTop: 18,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#B7C9CC",
    borderRadius: 20,
    padding: 14,
    shadowColor: "#61777B",
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  logo: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  brand: {
    marginLeft: 8,
    color: colors.primary,
    fontFamily: fontFamily.medium,
    fontSize: 15,
  },
  verified: {
    marginLeft: "auto",
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    height: 26,
    borderRadius: 13,
    backgroundColor: "#FFE28A",
    borderWidth: 1,
    borderColor: "#E8C452",
  },
  verifiedText: {
    color: "#2C250B",
    fontFamily: fontFamily.bold,
    fontSize: 9,
    letterSpacing: 0.8,
  },
  identityRow: { flexDirection: "row", alignItems: "center", marginTop: 20 },
  photo: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: "#FFFFFF",
  },
  identityCopy: { flex: 1, marginLeft: 14 },
  petName: { color: colors.ink, fontFamily: fontFamily.medium, fontSize: 17 },
  breed: {
    marginTop: 4,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 15,
  },
  meta: {
    marginTop: 7,
    color: colors.primary,
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  infoRow: { flexDirection: "row", gap: 8, marginTop: 20 },
  infoBox: {
    flex: 1,
    minHeight: 70,
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#CAD8DA",
    backgroundColor: "#F1F7F7",
    padding: 11,
  },
  infoLabel: { color: "#778386", fontFamily: fontFamily.medium, fontSize: 9 },
  infoValue: {
    marginTop: 5,
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 13,
    lineHeight: 18,
  },
  divider: {
    marginTop: 20,
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: "#D4DFE0",
  },
  securityRow: { marginTop: 13, flexDirection: "row", alignItems: "center" },
  barcode: { height: 29, flexDirection: "row", gap: 2, alignItems: "stretch" },
  bar: { height: "100%", backgroundColor: "#687174" },
  secured: {
    marginLeft: "auto",
    color: "#858D8F",
    fontFamily: fontFamily.medium,
    fontSize: 9,
    letterSpacing: 2,
  },
  primaryButton: {
    marginTop: 24,
    height: 50,
    borderRadius: 13,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 9,
  },
  primaryText: {
    color: "#FFFFFF",
    fontFamily: fontFamily.medium,
    fontSize: 16,
  },
  homeButton: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  homeText: {
    color: colors.primary,
    fontFamily: fontFamily.medium,
    fontSize: 15,
  },
  legal: {
    marginTop: 22,
    textAlign: "center",
    color: "#A3ADAF",
    fontFamily: fontFamily.regular,
    fontSize: 8,
    letterSpacing: 0.3,
  },
});
