import { BackButton } from "@/components/ui/BackButton";
import RNButton from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { RNText } from "@/components/ui/input";
import { useCheckinStore } from "@/store/useCheckinStore";
import { router } from "expo-router";
import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { toast } from "sonner-native";

const TimeStart = () => {
  const { bottom } = useSafeAreaInsets();
  const storedTime = useCheckinStore((state) => state.time);
  const setTime = useCheckinStore((state) => state.setTime);

  const parseCheckinDateTime = (value: string): Date | undefined => {
    const parts = value.split(":");
    if (parts.length !== 4) return undefined;

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
  };

  const formatCheckinDateTime = (date: Date) => {
    const pad = (value: number) => value.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}:${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
  };

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(() =>
    parseCheckinDateTime(storedTime),
  );

  const handleDateChange = (value: Date | undefined) => {
    setSelectedDate(value);
    setTime(value ? formatCheckinDateTime(value) : "");
  };

  const handleContinue = () => {
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
      <View style={[styles.contentWrapper, { paddingBottom: bottom + 40 }]}>
        <View style={styles.contentBlock}>
          <View style={styles.titleContainer}>
            <RNText variant="header" size="3xl" style={styles.titleText}>
              Since When Have You Been Feeling This Way?
            </RNText>
          </View>
          <View>
            <RNText variant="header" size="xl" style={styles.questionText}>
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
        <RNButton value={"Save Entry"} onPress={handleContinue} />
      </View>
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
    gap: 100,
    marginBottom: 40,
  },
  titleContainer: {
    width: "90%",
    marginHorizontal: "auto",
  },
  titleText: {
    textAlign: "center",
  },
  questionText: {
    marginBottom: 20,
  },
});
