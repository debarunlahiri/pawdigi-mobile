import { FontAwesome5 } from "@expo/vector-icons";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { Text, TextInput } from "../components/Typography";
import { AnimatedSegmentedControl } from "../components/AnimatedSegmentedControl";
import { DateInput } from "../components/DateInput";
import { Image } from "react-native";

import { colors } from "../theme/colors";
import { cardSurface } from "../theme/cards";
import { elevation } from "../theme/elevation";
import { fontFamily } from "../theme/typography";
import { assets } from "../theme/assets";
import { HomePet } from "./HomeFragment";

type ReminderFrequency =
  | "Minimal"
  | "Standard"
  | "Frequent"
  | "Very Frequent"
  | "Only Once"
  | "On Due Date"
  | "Custom"
  | "No Reminder";
type CreatedAlert = {
  id: number;
  dog: string;
  title: string;
  date: string;
  time: string;
  type: string;
  frequency: ReminderFrequency;
  customDays?: string;
};
const frequencies: ReminderFrequency[] = [
  "Minimal",
  "Standard",
  "Frequent",
  "Very Frequent",
  "Only Once",
  "On Due Date",
  "Custom",
  "No Reminder",
];
const frequencySchedules: Record<ReminderFrequency, string> = {
  Minimal: "7 days and 1 day before",
  Standard: "30 days, 7 days, and 1 day before",
  Frequent: "30, 15, 7, 3, and 1 day before",
  "Very Frequent": "60, 30, 15, 7, 3, and 1 day before",
  "Only Once": "One notification on the selected date",
  "On Due Date": "Only on the actual due date",
  Custom: "Choose your own reminder days",
  "No Reminder": "Notifications disabled",
};

export function AlertsFragment({ dogs }: { dogs: HomePet[] }) {
  const [tab, setTab] = useState<"upcoming" | "history">("upcoming");
  const [showCreate, setShowCreate] = useState(false);
  const [alerts, setAlerts] = useState<CreatedAlert[]>([]);
  const [rabiesDueDate, setRabiesDueDate] = useState("Oct 24, 2023");
  const [rabiesCompleted, setRabiesCompleted] = useState(false);
  const [showReschedulePicker, setShowReschedulePicker] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [tabsWidth, setTabsWidth] = useState(0);
  const tabPosition = useRef(new Animated.Value(0)).current;
  const tabWidth = tabsWidth > 0 ? (tabsWidth - 8) / 2 : 0;

  useEffect(() => {
    Animated.spring(tabPosition, {
      toValue: tab === "upcoming" ? 0 : 1,
      useNativeDriver: true,
      friction: 9,
      tension: 100,
    }).start();
  }, [tab, tabPosition]);
  const refreshAlerts = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 700);
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshAlerts}
            colors={[colors.primary]}
            tintColor={colors.primary}
            progressBackgroundColor={colors.card}
          />
        }
      >
        <AnimatedSegmentedControl
          accessibilityLabel="Alert category"
          onChange={(nextTab) =>
            setTab(nextTab === "Upcoming" ? "upcoming" : "history")
          }
          options={["Upcoming", "History"] as const}
          value={tab === "upcoming" ? "Upcoming" : "History"}
        />

        {tab === "upcoming" ? (
          <Upcoming
            createdAlerts={alerts}
            rabiesDueDate={rabiesDueDate}
            rabiesCompleted={rabiesCompleted}
            onCompleteRabies={() => setRabiesCompleted(true)}
            onRescheduleRabies={() => setShowReschedulePicker(true)}
          />
        ) : (
          <History rabiesCompleted={rabiesCompleted} />
        )}
      </ScrollView>
      <Pressable style={styles.fab} onPress={() => setShowCreate(true)}>
        <FontAwesome5 name="plus" size={21} color={colors.card} />
      </Pressable>
      <CreateAlertModal
        dogs={dogs}
        visible={showCreate}
        onClose={() => setShowCreate(false)}
        onCreate={(alert) => {
          setAlerts((current) => [{ ...alert, id: Date.now() }, ...current]);
          setShowCreate(false);
          setTab("upcoming");
        }}
      />
      {showReschedulePicker ? (
        <DateTimePicker
          value={new Date()}
          mode="date"
          minimumDate={new Date()}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={(_event, value) => {
            if (Platform.OS !== "ios") setShowReschedulePicker(false);
            if (value) {
              setRabiesDueDate(
                value.toLocaleDateString("en-US", {
                  month: "short",
                  day: "2-digit",
                  year: "numeric",
                }),
              );
              setRabiesCompleted(false);
            }
          }}
        />
      ) : null}
    </View>
  );
}

function Upcoming({
  createdAlerts,
  rabiesDueDate,
  rabiesCompleted,
  onCompleteRabies,
  onRescheduleRabies,
}: {
  createdAlerts: CreatedAlert[];
  rabiesDueDate: string;
  rabiesCompleted: boolean;
  onCompleteRabies: () => void;
  onRescheduleRabies: () => void;
}) {
  return (
    <>
      <SectionTitle>Today</SectionTitle>
      {createdAlerts.map((alert) => (
        <AlertCard
          key={alert.id}
          icon={
            alert.type === "Vaccination"
              ? "syringe"
              : alert.type === "Medication"
                ? "pills"
                : "calendar-check"
          }
          tone="blue"
          title={alert.title}
          subtitle={`${alert.dog} • ${alert.date}${alert.time ? ` at ${alert.time}` : ""}`}
          badge="NEW"
        />
      ))}
      {!rabiesCompleted ? (
        <AlertCard
          icon="syringe"
          tone="red"
          title="Rabies Booster"
          subtitle={`Due ${rabiesDueDate}`}
          badge="OVERDUE"
          actions
          onComplete={onCompleteRabies}
          onReschedule={onRescheduleRabies}
        />
      ) : null}
      <AlertCard
        icon="briefcase-medical"
        tone="blue"
        title="Monthly Heartworm"
        subtitle="Today at 8:00 PM"
        badge="DUE SOON"
      />
      <SectionTitle>This Week</SectionTitle>
      <AlertCard
        icon="cut"
        tone="teal"
        title="Professional Grooming"
        subtitle="Friday, Oct 27 • 2:30 PM"
        badge="In 3 days"
      />
      <SectionTitle>Next Month</SectionTitle>
      <AlertCard
        icon="shield-alt"
        tone="gold"
        title="Annual Physical Exam"
        subtitle="Pre-travel checkup required"
        badge="Nov 12"
      />
    </>
  );
}

function CreateAlertModal({
  dogs,
  visible,
  onClose,
  onCreate,
}: {
  dogs: HomePet[];
  visible: boolean;
  onClose: () => void;
  onCreate: (alert: Omit<CreatedAlert, "id">) => void;
}) {
  const [dog, setDog] = useState(dogs[0]?.name || "Cooper");
  const [type, setType] = useState("Vaccination");
  const [customType, setCustomType] = useState("");
  const [frequency, setFrequency] = useState<ReminderFrequency>("Standard");
  const [customDays, setCustomDays] = useState("");
  const [title, setTitle] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const date = selectedDate ? selectedDate.toLocaleDateString("en-GB") : "";
  const time = selectedTime
    ? selectedTime.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";
  const valid =
    title.trim() &&
    selectedDate &&
    (type !== "Custom" || customType.trim()) &&
    (frequency !== "Custom" || customDays.trim());
  const save = () => {
    setSubmitted(true);
    if (!valid) return;
    onCreate({
      dog,
      type: type === "Custom" ? customType.trim() : type,
      title: title.trim(),
      date,
      time,
      frequency,
      customDays: frequency === "Custom" ? customDays.trim() : undefined,
    });
    setTitle("");
    setCustomType("");
    setCustomDays("");
    setSelectedDate(null);
    setSelectedTime(null);
    setSubmitted(false);
  };
  const handleDateChange = (_event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS !== "ios") setShowDatePicker(false);
    if (value) setSelectedDate(value);
  };
  const handleTimeChange = (_event: DateTimePickerEvent, value?: Date) => {
    if (Platform.OS !== "ios") setShowTimePicker(false);
    if (value) setSelectedTime(value);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalBackdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
        <View style={styles.createSheet}>
          <View style={styles.sheetHandle} />
          <View style={styles.createHeader}>
            <View>
              <Text style={styles.createTitle}>Create New Alert</Text>
              <Text style={styles.createSubtitle}>
                Set a reminder for my care
              </Text>
            </View>
            <Pressable style={styles.close} onPress={onClose}>
              <FontAwesome5 name="times" size={15} color={colors.body} />
            </Pressable>
          </View>
          <Text style={styles.fieldLabel}>Family Profile</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dogChoices}
          >
            {dogs.map((item) => (
              <Pressable
                key={item.name}
                style={[
                  styles.dogChoice,
                  dog === item.name && styles.choiceActive,
                ]}
                onPress={() => setDog(item.name)}
              >
                <Image
                  source={item.photoUri ? { uri: item.photoUri } : assets.logo}
                  style={styles.choiceAvatar}
                />
                <Text
                  style={[
                    styles.choiceText,
                    dog === item.name && styles.choiceTextActive,
                  ]}
                >
                  {item.name}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <Text style={styles.fieldLabel}>Reminder Type</Text>
          <View style={styles.typeChoices}>
            {["Vaccination", "Medication", "Appointment", "Custom"].map(
              (item) => (
                <Pressable
                  key={item}
                  style={[
                    styles.typeChoice,
                    type === item && styles.choiceActive,
                  ]}
                  onPress={() => setType(item)}
                >
                  <Text
                    style={[
                      styles.choiceText,
                      type === item && styles.choiceTextActive,
                    ]}
                  >
                    {item}
                  </Text>
                </Pressable>
              ),
            )}
          </View>
          {type === "Custom" ? (
            <>
              <Text style={styles.fieldLabel}>Custom Reminder Type</Text>
              <TextInput
                style={[
                  styles.input,
                  submitted && !customType.trim() && styles.inputError,
                ]}
                value={customType}
                onChangeText={setCustomType}
                placeholder="e.g. Grooming, Training, Travel"
                placeholderTextColor={colors.body}
              />
            </>
          ) : null}
          <Text style={styles.fieldLabel}>Frequency Preference</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.frequencyChoices}
          >
            {frequencies.map((item) => (
              <Pressable
                key={item}
                style={[
                  styles.frequencyChoice,
                  frequency === item && styles.choiceActive,
                ]}
                onPress={() => setFrequency(item)}
              >
                <Text
                  style={[
                    styles.choiceText,
                    frequency === item && styles.choiceTextActive,
                  ]}
                >
                  {item}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
          <View style={styles.scheduleInfo}>
            <FontAwesome5
              name={frequency === "No Reminder" ? "bell-slash" : "bell"}
              size={12}
              color={colors.primary}
            />
            <Text style={styles.scheduleText}>
              {frequencySchedules[frequency]}
            </Text>
          </View>
          {frequency === "Custom" ? (
            <>
              <Text style={styles.fieldLabel}>Custom Reminder Days</Text>
              <TextInput
                style={[
                  styles.input,
                  submitted && !customDays.trim() && styles.inputError,
                ]}
                value={customDays}
                onChangeText={setCustomDays}
                placeholder="e.g. 45, 20, 5, 1 days before"
                placeholderTextColor={colors.body}
                keyboardType="numbers-and-punctuation"
              />
            </>
          ) : null}
          <Text style={styles.fieldLabel}>Alert Title</Text>
          <TextInput
            style={[
              styles.input,
              submitted && !title.trim() && styles.inputError,
            ]}
            value={title}
            onChangeText={setTitle}
            placeholder="e.g. Rabies Booster"
            placeholderTextColor={colors.body}
          />
          <View style={styles.dateRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Date</Text>
              <DateInput
                accessibilityLabel="Choose alert date"
                error={Boolean(submitted && !selectedDate)}
                onCalendarPress={() => setShowDatePicker(true)}
                value={date}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Time</Text>
              <Pressable
                style={[styles.input, styles.pickerField]}
                onPress={() => setShowTimePicker(true)}
              >
                <FontAwesome5 name="clock" size={13} color={colors.primary} />
                <Text
                  style={[
                    styles.pickerText,
                    !selectedTime && styles.placeholder,
                  ]}
                >
                  {time || "08:00 PM"}
                </Text>
              </Pressable>
            </View>
          </View>
          {showDatePicker ? (
            <DateTimePicker
              value={selectedDate || new Date()}
              mode="date"
              minimumDate={new Date()}
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleDateChange}
            />
          ) : null}
          {showTimePicker ? (
            <DateTimePicker
              value={selectedTime || new Date()}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
            />
          ) : null}
          {submitted && !valid ? (
            <Text style={styles.error}>
              Please complete all required alert and reminder fields.
            </Text>
          ) : null}
          <View style={styles.formActions}>
            <Pressable style={styles.cancelButton} onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable style={styles.saveButton} onPress={save}>
              <Text style={styles.saveText}>Create Alert</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function History({ rabiesCompleted }: { rabiesCompleted: boolean }) {
  return (
    <>
      <SectionTitle>Completed</SectionTitle>
      {rabiesCompleted ? (
        <AlertCard
          icon="check-circle"
          tone="teal"
          title="Rabies Booster"
          subtitle={`Completed ${new Date().toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" })}`}
          badge="DONE"
        />
      ) : null}
      <AlertCard
        icon="check-circle"
        tone="teal"
        title="DHPP Booster"
        subtitle="Completed Oct 02, 2023"
        badge="DONE"
      />
      <AlertCard
        icon="check-circle"
        tone="teal"
        title="Routine Wellness Exam"
        subtitle="Completed Sep 14, 2023"
        badge="DONE"
      />
    </>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <Text style={styles.sectionTitle}>{children}</Text>;
}

function AlertCard({
  icon,
  tone,
  title,
  subtitle,
  badge,
  actions,
  onComplete,
  onReschedule,
}: {
  icon: string;
  tone: "red" | "blue" | "teal" | "gold";
  title: string;
  subtitle: string;
  badge: string;
  actions?: boolean;
  onComplete?: () => void;
  onReschedule?: () => void;
}) {
  const iconColor =
    tone === "red"
      ? colors.error
      : tone === "gold"
        ? colors.tertiary
        : colors.primary;
  return (
    <View style={[styles.card, tone === "red" && styles.cardOverdue]}>
      <View style={[styles.iconBox, styles[`icon_${tone}`]]}>
        <FontAwesome5 name={icon} size={17} color={iconColor} />
      </View>
      <View style={styles.cardBody}>
        <View style={styles.titleRow}>
          <Text style={styles.title}>{title}</Text>
          <View style={[styles.badge, styles[`badge_${tone}`]]}>
            <Text
              style={[
                styles.badgeText,
                { color: tone === "red" ? colors.card : iconColor },
              ]}
            >
              {badge}
            </Text>
          </View>
        </View>
        <Text style={styles.subtitle}>{subtitle}</Text>
        {actions ? (
          <View style={styles.actions}>
            <Pressable style={styles.completeButton} onPress={onComplete}>
              <Text style={styles.completeText}>Complete</Text>
            </Pressable>
            <Pressable style={styles.rescheduleButton} onPress={onReschedule}>
              <Text style={styles.rescheduleText}>Reschedule</Text>
            </Pressable>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 14, paddingTop: 10, paddingBottom: 104 },
  tabs: {
    height: 48,
    borderRadius: 13,
    backgroundColor: colors.surfaceRaised,
    padding: 4,
    flexDirection: "row",
  },
  tabIndicator: {
    position: "absolute",
    left: 4,
    top: 4,
    bottom: 4,
    borderRadius: 10,
    backgroundColor: colors.card,
  },
  tab: {
    flex: 1,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  tabText: { color: colors.body, fontFamily: fontFamily.medium, fontSize: 13 },
  tabTextActive: { color: colors.primary },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 10,
    marginLeft: 3,
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 13,
    letterSpacing: 1,
  },
  card: {
    minHeight: 84,
    marginBottom: 12,
    flexDirection: "row",
    ...cardSurface,
  },
  cardOverdue: { borderWidth: 1, borderColor: colors.errorSoft },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 13,
  },
  icon_red: { backgroundColor: colors.surfaceMuted },
  icon_blue: { backgroundColor: colors.surfaceSubtle },
  icon_teal: { backgroundColor: colors.surfaceRaised },
  icon_gold: { backgroundColor: colors.surfaceSubtle },
  cardBody: { flex: 1 },
  titleRow: { flexDirection: "row", alignItems: "center" },
  title: {
    flex: 1,
    color: colors.ink,
    fontFamily: fontFamily.bold,
    fontSize: 15,
  },
  subtitle: {
    marginTop: 4,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  badge: { borderRadius: 12, paddingHorizontal: 8, paddingVertical: 5 },
  badge_red: { backgroundColor: colors.error },
  badge_blue: { backgroundColor: colors.accent },
  badge_teal: { backgroundColor: "transparent" },
  badge_gold: { backgroundColor: colors.surfaceMuted },
  badgeText: { fontFamily: fontFamily.bold, fontSize: 8 },
  actions: { marginTop: 13, flexDirection: "row", gap: 8 },
  completeButton: {
    flex: 1,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  completeText: {
    color: colors.card,
    fontFamily: fontFamily.medium,
    fontSize: 12,
  },
  rescheduleButton: {
    width: 94,
    height: 34,
    borderRadius: 8,
    backgroundColor: colors.surfaceRaised,
    alignItems: "center",
    justifyContent: "center",
  },
  rescheduleText: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
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
    ...elevation.l2,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(23,29,29,0.42)",
    justifyContent: "flex-end",
  },
  createSheet: {
    backgroundColor: colors.card,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    paddingHorizontal: 17,
    paddingTop: 9,
    paddingBottom: 24,
  },
  sheetHandle: {
    alignSelf: "center",
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.borderStrong,
    marginBottom: 14,
  },
  createHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  createTitle: { color: colors.ink, fontFamily: fontFamily.bold, fontSize: 20 },
  createSubtitle: { marginTop: 2, color: colors.muted, fontSize: 11 },
  close: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.surfaceSubtle,
    alignItems: "center",
    justifyContent: "center",
  },
  fieldLabel: {
    marginTop: 12,
    marginBottom: 5,
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 11,
  },
  dogChoices: { gap: 8 },
  dogChoice: {
    minWidth: 94,
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 9,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
  },
  choiceAvatar: { width: 29, height: 29, borderRadius: 15 },
  typeChoices: { flexDirection: "row", flexWrap: "wrap", gap: 7 },
  typeChoice: {
    width: "48.8%",
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    alignItems: "center",
    justifyContent: "center",
  },
  choiceActive: {
    borderColor: colors.primary,
    backgroundColor: colors.surfaceSubtle,
  },
  choiceText: {
    color: colors.body,
    fontFamily: fontFamily.medium,
    fontSize: 9,
  },
  choiceTextActive: { color: colors.primary },
  frequencyChoices: { gap: 7 },
  frequencyChoice: {
    height: 34,
    borderRadius: 9,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  scheduleInfo: {
    marginTop: 7,
    minHeight: 32,
    borderRadius: 8,
    backgroundColor: colors.surfaceMuted,
    paddingHorizontal: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  scheduleText: {
    flex: 1,
    color: colors.body,
    fontFamily: fontFamily.regular,
    fontSize: 9,
  },
  input: {
    height: 42,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.borderStrong,
    backgroundColor: colors.background,
    paddingHorizontal: 12,
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 12,
  },
  inputError: { borderColor: colors.error },
  dateRow: { flexDirection: "row", gap: 10 },
  error: {
    marginTop: 7,
    color: colors.error,
    fontFamily: fontFamily.medium,
    fontSize: 10,
  },
  pickerField: { flexDirection: "row", alignItems: "center", gap: 8 },
  pickerText: {
    color: colors.ink,
    fontFamily: fontFamily.regular,
    fontSize: 11,
  },
  placeholder: { color: colors.body },
  formActions: { flexDirection: "row", gap: 9, marginTop: 18 },
  cancelButton: {
    width: 92,
    height: 44,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: colors.primary,
    fontFamily: fontFamily.bold,
    fontSize: 12,
  },
  saveButton: {
    flex: 1,
    height: 44,
    borderRadius: 10,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  saveText: { color: colors.card, fontFamily: fontFamily.bold, fontSize: 13 },
});
