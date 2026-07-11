import { FontAwesome5 } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

import { colors } from "../theme/colors";
import { fontFamily } from "../theme/typography";
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
    const base = dogs.map((dog, index) => ({
      ...dog,
      score: index === 0 ? 94 : 72,
      status:
        index === selectedDog ? "ACTIVE" : index === 1 ? "Due: Vac" : "HEALTHY",
      sourceIndex: index,
    }));
    return [
      ...base,
      {
        ...dogs[0],
        name: "Bella",
        breed: "French Bulldog",
        gender: "Female",
        photoUri:
          "https://images.dog.ceo/breeds/bulldog-french/n02108915_4474.jpg",
        score: 88,
        status: "HEALTHY",
        sourceIndex: -1,
      },
    ];
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
      <Text style={styles.title}>My Dogs</Text>
      <Text style={styles.subtitle}>
        Manage health records and digital passports for your pets.
      </Text>
      <Pressable style={styles.addButton} onPress={onAddDog}>
        <FontAwesome5 name="plus" size={18} color="#FFFFFF" />
        <Text style={styles.addText}>Add Dog</Text>
      </Pressable>
      <View style={styles.search}>
        <FontAwesome5 name="search" size={18} color="#748185" />
        <TextInput
          value={query}
          onChangeText={setQuery}
          style={styles.searchInput}
          placeholder="Search by name or breed..."
          placeholderTextColor="#737D8D"
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
              source={{
                uri:
                  dog.photoUri ||
                  "https://images.dog.ceo/breeds/retriever-golden/n02099601_3004.jpg",
              }}
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
                      color="#8B6D00"
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
                          dog.score < 80 ? "#C09A14" : colors.primary,
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

      <Pressable style={styles.addDashed} onPress={onAddDog}>
        <View style={styles.addCircle}>
          <FontAwesome5 name="plus" size={19} color={colors.ink} />
        </View>
        <Text style={styles.addAnother}>Add another dog</Text>
      </Pressable>
      <View style={styles.readiness}>
        <View>
          <Text style={styles.readinessTitle}>Passport Readiness</Text>
          <Text style={styles.readinessText}>
            3 out of 3 dogs have verified EU{`\n`}documents.
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
  content: { paddingHorizontal: 14, paddingTop: 9, paddingBottom: 20 },
  title: { color: colors.ink, fontFamily: fontFamily.black, fontSize: 20 },
  subtitle: {
    marginTop: 2,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 11,
    lineHeight: 16,
  },
  addButton: {
    marginTop: 8,
    height: 38,
    borderRadius: 11,
    backgroundColor: colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  addText: { color: "#FFFFFF", fontFamily: fontFamily.medium, fontSize: 13 },
  search: {
    marginTop: 13,
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#B9CBCD",
    backgroundColor: "#FFFFFF",
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
    borderRadius: 11,
    borderWidth: 1,
    borderColor: "#B9CBCD",
    backgroundColor: "#FFFFFF",
    padding: 11,
    flexDirection: "row",
  },
  dogCardActive: { borderWidth: 2, borderColor: colors.primary },
  photo: { width: 76, height: 76, borderRadius: 8 },
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
    backgroundColor: "#DCE8FA",
    paddingHorizontal: 7,
    paddingVertical: 4,
  },
  statusText: { color: "#526077", fontFamily: fontFamily.medium, fontSize: 8 },
  statusDue: { backgroundColor: "transparent", paddingHorizontal: 0 },
  statusDueText: { color: "#8B6D00" },
  scoreRow: { marginTop: "auto", flexDirection: "row", alignItems: "center" },
  track: {
    flex: 1,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#E2E8E9",
    overflow: "hidden",
  },
  fill: { height: "100%", borderRadius: 3 },
  score: {
    marginLeft: 6,
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 9,
  },
  scoreDue: { color: "#796100" },
  addDashed: {
    marginTop: 11,
    height: 62,
    borderRadius: 11,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderColor: "#B6C5C8",
    alignItems: "center",
    justifyContent: "center",
  },
  addCircle: {
    width: 29,
    height: 29,
    borderRadius: 15,
    backgroundColor: "#EDF3F4",
    alignItems: "center",
    justifyContent: "center",
  },
  addAnother: {
    marginTop: 3,
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 9,
  },
  readiness: {
    marginTop: 13,
    minHeight: 78,
    borderRadius: 14,
    backgroundColor: "#DCE8FA",
    padding: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  readinessTitle: {
    color: "#1B2D49",
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
  readinessText: {
    marginTop: 3,
    color: "#40516A",
    fontFamily: fontFamily.regular,
    fontSize: 10,
    lineHeight: 15,
  },
  records: {
    marginTop: 10,
    minHeight: 65,
    borderRadius: 14,
    backgroundColor: "#E8EEEE",
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
