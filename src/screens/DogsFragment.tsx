import { FontAwesome5 } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native";
import { Text, TextInput } from "../components/Typography";
import { AddFamilyMemberButton } from "../components/AddFamilyMemberButton";

import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { fontFamily } from "../theme/typography";
import { assets } from "../theme/assets";
import { HomePet } from "./HomeFragment";

type Props = {
  dogs: HomePet[];
  selectedDog: number;
  onSelectDog: (index: number) => void;
  onAddDog: () => void;
};
type DogListItem = HomePet & {
  score: number;
  status: string;
  sourceIndex: number;
};

export function DogsFragment({
  dogs,
  selectedDog,
  onSelectDog,
  onAddDog,
}: Props) {
  const [query, setQuery] = useState("");
  const allDogs = useMemo<DogListItem[]>(() => {
    return dogs.map((dog, index) => ({
      ...dog,
      score: index === 0 ? 94 : 72,
      status:
        index === selectedDog ? "ACTIVE" : index === 1 ? "Due: Vac" : "HEALTHY",
      sourceIndex: index,
    }));
  }, [dogs, selectedDog]);
  const filtered = allDogs.filter((dog) =>
    `${dog.name} ${dog.breed}`
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>My Family</Text>
      <Text style={styles.subtitle}>
        Keep my family's health records and digital passports together.
      </Text>
      <View style={styles.search}>
        <FontAwesome5 name="search" size={18} color={colors.body} />
        <TextInput
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholder="Search by name or breed..."
          placeholderTextColor={colors.body}
        />
      </View>

      {filtered.map((dog, index) => {
        const active = dog.sourceIndex === selectedDog;
        return (
          <Pressable
            key={`${dog.name}-${index}`}
            style={[styles.dogCard, active && styles.dogCardActive]}
            onPress={() => dog.sourceIndex >= 0 && onSelectDog(dog.sourceIndex)}
          >
            <Image
              source={dog.photoUri ? { uri: dog.photoUri } : assets.logo}
              style={styles.photo}
            />
            <View style={styles.dogInfo}>
              <View style={styles.nameRow}>
                <View>
                  <Text style={styles.name}>{dog.name}</Text>
                  <Text style={styles.breed}>{dog.breed}</Text>
                </View>
                <View
                  style={[
                    styles.status,
                    dog.status === "Due: Vac" && styles.statusDue,
                  ]}
                >
                  {dog.status === "Due: Vac" ? (
                    <FontAwesome5
                      name="calendar-alt"
                      size={10}
                      color={colors.tertiary}
                    />
                  ) : null}
                  <Text
                    style={[
                      styles.statusText,
                      dog.status === "Due: Vac" && styles.statusDueText,
                    ]}
                  >
                    {dog.status}
                  </Text>
                </View>
              </View>
              <View style={styles.scoreRow}>
                <View style={styles.track}>
                  <View
                    style={[
                      styles.fill,
                      {
                        width: `${dog.score}%`,
                        backgroundColor:
                          dog.score < 80 ? colors.tertiaryDark : colors.primary,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.score, dog.score < 80 && styles.scoreDue]}>
                  {dog.score}/100
                </Text>
              </View>
            </View>
          </Pressable>
        );
      })}

      <AddFamilyMemberButton
        label="Add family member"
        onPress={onAddDog}
        style={styles.addFamilyButton}
      />
      <View style={styles.readiness}>
        <View>
          <Text style={styles.readinessTitle}>Passport Readiness</Text>
          <Text style={styles.readinessText}>
            All {dogs.length} family profile{dogs.length === 1 ? "" : "s"}{" "}
            {dogs.length === 1 ? "has" : "have"} verified digital documents.
          </Text>
        </View>
        <FontAwesome5 name="shield-alt" size={29} color={colors.primary} />
      </View>
      <View style={styles.records}>
        <Text style={styles.recordsNumber}>12</Text>
        <Text style={styles.recordsText}>Total Records Uploaded</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 9, paddingBottom: 104 },
  title: { color: colors.ink, fontFamily: fontFamily.black, fontSize: 20 },
  subtitle: {
    marginTop: 2,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
  },
  search: {
    marginTop: 13,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.card,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    color: colors.ink,
  },
  dogCard: {
    minHeight: 100,
    marginTop: 11,
    flexDirection: "row",
    ...cardSurface,
  },
  dogCardActive: { borderWidth: 2, borderColor: colors.primary },
  photo: { width: 76, height: 76, borderRadius: 38 },
  dogInfo: { flex: 1, marginLeft: 11 },
  nameRow: { flexDirection: "row", justifyContent: "space-between" },
  name: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 16 },
  breed: {
    marginTop: 2,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 10,
  },
  status: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    alignSelf: "flex-start",
    borderRadius: 11,
    backgroundColor: colors.surfaceRaised,
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  statusText: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 8,
  },
  statusDue: { backgroundColor: "transparent", paddingHorizontal: 0 },
  statusDueText: { color: colors.tertiary },
  scoreRow: { marginTop: "auto", flexDirection: "row", alignItems: "center" },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: colors.border,
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3 },
  score: {
    marginLeft: 6,
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 9,
  },
  scoreDue: { color: colors.tertiary },
  addFamilyButton: {
    marginTop: 11,
  },
  readiness: {
    marginTop: 13,
    minHeight: 78,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readinessTitle: {
    color: colors.inkSoft,
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
  readinessText: {
    marginTop: 3,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 10,
    lineHeight: 15,
  },
  records: {
    marginTop: 10,
    minHeight: 65,
    borderRadius: 14,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  recordsNumber: {
    color: colors.primary,
    fontFamily: fontFamily.black,
    fontSize: 22,
  },
  recordsText: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 9,
  },
});
