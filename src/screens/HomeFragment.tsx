import { FontAwesome5 } from "@expo/vector-icons";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { assets } from "../theme/assets";
import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";

export type HomePet = {
  name: string;
  species: string;
  breed: string;
  birthDate: string;
  gender: string;
  isSterilized: boolean;
  photoUri?: string;
  microchipNumber: string;
  weight: string;
  weightUnit: string;
};

export function HomeFragment({ pet }: { pet: HomePet }) {
  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <View style={styles.petCard}>
          <Image
            source={assets.logo}
            style={styles.logo}
            resizeMode="cover"
          />
          <View style={styles.activeRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.badge}>ACTIVE PROFILE</Text>
              <Text style={styles.petName}>{pet.name || "My Profile"}</Text>
              <Text style={styles.breed}>{pet.breed || "Verified Profile"}</Text>
            </View>
            <View style={styles.passportIcon}>
              <FontAwesome5
                name="id-card-alt"
                size={18}
                color={colors.primary}
              />
            </View>
          </View>
          <View style={styles.stats}>
            <Stat label="AGE" value={age(pet.birthDate)} />
            <Stat
              label="WEIGHT"
              value={pet.weight ? `${pet.weight}${pet.weightUnit}` : "Not set"}
            />
          </View>
        </View>
        <View style={styles.headingRow}>
          <Text style={styles.heading}>Health Status</Text>
          <Text style={styles.link}>View Records ›</Text>
        </View>
        <View style={styles.healthRow}>
          <Health
            icon="syringe"
            label="Next Vaccination"
            value="Rabies Booster"
            footer="12 days left"
          />
          <Health
            icon="check-circle"
            label="Deworming"
            value="Quarterly"
            footer="Completed"
            positive
          />
        </View>
        <View style={styles.activityCard}>
          <View style={styles.activityHeading}>
            <Text style={styles.heading}>Recent Activity</Text>
            <FontAwesome5 name="history" size={16} color="#526077" />
          </View>
          <Activity
            icon="briefcase-medical"
            title="Dr. Smith Clinic Visit"
            time="Yesterday, 14:30"
            description={`My routine wellness exam is complete. All vital signs are normal for my age and weight.`}
            tags={["CLINICAL NOTE", "PRESCRIPTION"]}
          />
          <Activity
            icon="walking"
            title="Afternoon Walk"
            time="3 days ago"
            description="45 min outdoor activity tracked. Total distance: 3.2km."
            muted
          />
        </View>
        <Text style={[styles.heading, styles.quickHeading]}>Quick Actions</Text>
        <View style={styles.quickGrid}>
          <Quick icon="plus-circle" label={"Add\nRecord"} kind="primary" />
          <Quick icon="share-alt" label={"Share\nPassport"} kind="blue" />
          <Quick icon="file-upload" label={"Upload\nLab Result"} kind="plain" />
          <Quick
            icon="exclamation-triangle"
            label={"Emergency\nAccess"}
            kind="danger"
          />
        </View>
        <View style={styles.travel}>
          <View style={styles.travelIcon}>
            <FontAwesome5 name="shield-alt" size={14} color="#D6A91C" />
          </View>
          <View>
            <Text style={styles.travelTitle}>Digital Passport Verified</Text>
            <Text style={styles.travelText}>
              Valid for EU Travel until 2025
            </Text>
          </View>
        </View>
      </ScrollView>
      <Pressable style={styles.fab}>
        <FontAwesome5 name="plus" size={21} color="#FFFFFF" />
      </Pressable>
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat}>
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );
}
function Health({
  icon,
  label,
  value,
  footer,
  positive,
}: {
  icon: string;
  label: string;
  value: string;
  footer: string;
  positive?: boolean;
}) {
  return (
    <View style={styles.health}>
      <View style={[styles.healthIcon, positive && styles.healthPositive]}>
        <FontAwesome5
          name={icon}
          size={15}
          color={positive ? "#10A54A" : colors.primary}
        />
      </View>
      <Text style={styles.healthLabel}>{label}</Text>
      <Text style={styles.healthValue}>{value}</Text>
      <Text style={[styles.healthFooter, positive && { color: "#10A54A" }]}>
        {footer}
      </Text>
    </View>
  );
}
function Activity({
  icon,
  title,
  time,
  description,
  tags,
  muted,
}: {
  icon: string;
  title: string;
  time: string;
  description: string;
  tags?: string[];
  muted?: boolean;
}) {
  return (
    <View style={[styles.activity, muted && { opacity: 0.5 }]}>
      <View style={styles.timelineIcon}>
        <FontAwesome5
          name={icon}
          size={9}
          color={muted ? "#849096" : colors.primary}
        />
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.activityLine}>
          <Text style={styles.activityName}>{title}</Text>
          <Text style={styles.activityTime}>{time}</Text>
        </View>
        <Text style={styles.description}>{description}</Text>
        {tags ? (
          <View style={styles.tags}>
            {tags.map((tag) => (
              <Text key={tag} style={styles.tag}>
                {tag}
              </Text>
            ))}
          </View>
        ) : null}
      </View>
    </View>
  );
}
function Quick({
  icon,
  label,
  kind,
}: {
  icon: string;
  label: string;
  kind: "primary" | "blue" | "plain" | "danger";
}) {
  const fg =
    kind === "primary"
      ? "#FFFFFF"
      : kind === "danger"
        ? "#C71E24"
        : colors.primary;
  return (
    <Pressable style={[styles.quick, styles[kind]]}>
      <FontAwesome5 name={icon} size={18} color={fg} />
      <Text style={[styles.quickText, { color: fg }]}>{label}</Text>
    </Pressable>
  );
}
function age(value: string) {
  const match = value.match(/^(\d{2})(\d{2})(\d{4})$/);
  if (!match) return "Verified";
  const years = Math.max(
    0,
    Math.floor(
      (Date.now() - new Date(+match[3], +match[2] - 1, +match[1]).getTime()) /
        31557600000,
    ),
  );
  return `${years} ${years === 1 ? "year" : "years"}`;
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 12, paddingTop: 9, paddingBottom: 104 },
  petCard: {
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    padding: 16,
    shadowColor: "#98A7AA",
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 2,
  },
  logo: {
    alignSelf: "center",
    width: 108,
    height: 108,
    borderRadius: 54,
  },
  activeRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  badge: {
    alignSelf: "flex-start",
    color: colors.primary,
    backgroundColor: "#E2F8F8",
    borderRadius: 11,
    paddingHorizontal: 9,
    paddingVertical: 4,
    fontFamily: fontFamily.bold,
    fontSize: 8,
  },
  petName: {
    marginTop: 6,
    color: colors.ink,
    fontFamily: fontFamily.black,
    fontSize: 22,
  },
  breed: { color: "#526077", fontFamily: fontFamily.regular, fontSize: 13 },
  passportIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#E7EEEE",
    alignItems: "center",
    justifyContent: "center",
  },
  stats: { flexDirection: "row", gap: 10, marginTop: 18 },
  stat: { flex: 1, borderRadius: 10, backgroundColor: "#F3F8F8", padding: 12 },
  statLabel: { color: colors.body, fontFamily: fontFamily.medium, fontSize: 9 },
  statValue: {
    marginTop: 5,
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
  headingRow: {
    marginTop: 17,
    marginBottom: 10,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  heading: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 16 },
  link: { color: colors.primary, fontFamily: fontFamily.medium, fontSize: 11 },
  healthRow: { flexDirection: "row", gap: 9 },
  health: {
    flex: 1,
    minHeight: 126,
    borderRadius: 13,
    backgroundColor: "#FFFFFF",
    padding: 13,
    elevation: 1,
  },
  healthIcon: {
    width: 33,
    height: 33,
    borderRadius: 17,
    backgroundColor: "#E5F1F2",
    alignItems: "center",
    justifyContent: "center",
  },
  healthPositive: { backgroundColor: "#ECFBF1" },
  healthLabel: { marginTop: 11, color: colors.body, fontSize: 10 },
  healthValue: {
    marginTop: 4,
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 14,
  },
  healthFooter: {
    marginTop: "auto",
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 9,
  },
  activityCard: {
    marginTop: 17,
    borderRadius: 14,
    backgroundColor: "#FFFFFF",
    padding: 15,
    elevation: 1,
  },
  activityHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  activity: { flexDirection: "row", paddingBottom: 13 },
  timelineIcon: {
    width: 31,
    height: 31,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  activityLine: { flexDirection: "row", justifyContent: "space-between" },
  activityName: {
    color: colors.ink,
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  activityTime: { color: colors.body, fontSize: 8 },
  description: { marginTop: 4, color: "#526077", fontSize: 10, lineHeight: 15 },
  tags: { marginTop: 7, flexDirection: "row", gap: 5 },
  tag: {
    color: colors.body,
    backgroundColor: "#E6EBEC",
    paddingHorizontal: 6,
    paddingVertical: 4,
    fontFamily: fontFamily.bold,
    fontSize: 7,
  },
  quickHeading: { marginTop: 18, marginBottom: 10 },
  quickGrid: { flexDirection: "row", flexWrap: "wrap", gap: 9 },
  quick: {
    width: "48.5%",
    height: 105,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    borderWidth: 1,
  },
  primary: { backgroundColor: colors.primary, borderColor: colors.primary },
  blue: { backgroundColor: "#DCE8FA", borderColor: "#D0DDF0" },
  plain: { backgroundColor: "#FFFFFF", borderColor: "#DFE6E7" },
  danger: { backgroundColor: "#FFF1F1", borderColor: "#F0BDBD" },
  quickText: {
    textAlign: "center",
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  travel: {
    marginTop: 13,
    minHeight: 68,
    borderRadius: 14,
    backgroundColor: "#FFFDF1",
    borderWidth: 1,
    borderColor: "#E7D790",
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
  },
  travelIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FAEFC2",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 11,
  },
  travelTitle: {
    color: colors.ink,
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  travelText: { marginTop: 2, color: "#796100", fontSize: 10 },
  fab: {
    position: "absolute",
    right: 16,
    bottom: 16,
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    elevation: 5,
    shadowColor: "#000000",
    shadowOpacity: 0.2,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
});
