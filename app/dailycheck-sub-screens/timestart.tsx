import { BackButton } from "@/components/ui/BackButton";
import RNButton from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { RNText } from "@/components/ui/input";
import { useCheckinStore } from "@/store/useCheckinStore";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { toast } from "sonner-native";

const moodTags = [
  "Sleep",
  "Work/School",
  "Relationships",
  "Health",
  "Money",
  "Family",
  "Loneliness",
  "Stress",
  "Not sure",
  "Other",
];

const TimeStart = () => {
  const { bottom } = useSafeAreaInsets();
  const storedTime = useCheckinStore((state) => state.time);
  const storedTags = useCheckinStore((state) => state.tags);
  const setTime = useCheckinStore((state) => state.setTime);
  const setTags = useCheckinStore((state) => state.setTags);
  const [selectedTags, setSelectedTags] = useState<string[]>(
    () => storedTags ?? [],
  );
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() => {
    if (!storedTime) {
      return undefined;
    }

    const parts = storedTime.split(":");
    if (parts.length !== 4) {
      return undefined;
    }

    const [datePart, hoursPart, minutesPart, secondsPart] = parts;
    const [year, month, day] = datePart.split("-").map(Number);
    const hours = Number(hoursPart);
    const minutes = Number(minutesPart);
    const seconds = Number(secondsPart);

    if (
      [year, month, day, hours, minutes, seconds].some((part) =>
        Number.isNaN(part),
      )
    ) {
      return undefined;
    }

    return new Date(year, month - 1, day, hours, minutes, seconds);
  });

  const formatCheckinDateTime = (date: Date) => {
    const pad = (value: number) => value.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}:${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const handleDateChange = (value: Date | undefined) => {
    setSelectedDate(value);
    setTime(value ? formatCheckinDateTime(value) : "");
  };

  const handleTagSelect = (label: string) => {
    setSelectedTags((currentTags) => {
      const next = currentTags.includes(label)
        ? currentTags.filter((tag) => tag !== label)
        : [...currentTags, label];

      setTags(next);
      return next;
    });
  };

  const handleContinue = () => {
    if (!selectedTags.length) {
      toast.error("Please select at least one tag to continue.");
      return;
    }

    if (!selectedDate) {
      toast.error("Please select date and time to continue.");
      return;
    }

    router.push("/dailycheck-sub-screens/journalentry");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <BackButton />
          <RNText variant="title" size="xl">
            Assessment
          </RNText>
        </View>
        <View style={styles.progressBadge}>
          <RNText variant="title" size="sm" style={styles.progressText}>
            2 OF 3
          </RNText>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={[styles.contentWrapper, { paddingBottom: bottom + 40 }]}>
          <View style={styles.contentBlock}>
            <View style={styles.titleContainer}>
              <RNText variant="header" size="3xl" style={styles.titleText}>
                What may be affecting your mood today?
              </RNText>
            </View>
            <View style={styles.tagsContainer}>
              {moodTags.map((tag) => {
                const isActive = selectedTags.includes(tag);

                return (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => handleTagSelect(tag)}
                    style={[styles.tag, isActive && styles.tagActive]}
                  >
                    <RNText
                      variant="medium"
                      size="sm"
                      style={[styles.tagText, isActive && styles.tagTextActive]}
                    >
                      {tag}
                    </RNText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.timeSection}>
              <RNText variant="header" size="xl" style={styles.timeLabel}>
                About when did this start?
              </RNText>
              <DatePicker
                placeholder="Select date and time"
                onChange={handleDateChange}
                value={selectedDate}
                mode="datetime"
                timeFormat="24"
              />
            </View>
          </View>
          <RNButton value={"Continue"} onPress={handleContinue} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TimeStart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    paddingHorizontal: 20,
  },
  headerLeft: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: 20,
  },
  progressBadge: {
    backgroundColor: "#E8DDD9",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 30,
  },
  progressText: {
    color: "#926247",
  },
  contentWrapper: {
    width: "90%",
    marginHorizontal: "auto",
    flex: 1,
    justifyContent: "center",
  },
  contentBlock: {
    gap: 28,
    marginBottom: 40,
  },
  titleContainer: {
    width: "90%",
    marginHorizontal: "auto",
  },
  titleText: {
    textAlign: "center",
  },
  tagsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    justifyContent: "center",
    marginTop: 10,
  },
  tag: {
    borderWidth: 1,
    borderColor: "#9BB068",
    backgroundColor: "#FFFFFF",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tagActive: {
    backgroundColor: "#CFD9B5",
  },
  tagText: {
    color: "#8F8985",
  },
  tagTextActive: {
    color: "#5B6B2F",
  },
  timeSection: {
    gap: 20,
    marginTop: 8,
  },
  timeLabel: {
    marginBottom: 4,
  },
});
