import AssessmentQuestionField from "@/components/dailycheck/AssessmentQuestionField";
import { BackButton } from "@/components/ui/BackButton";
import RNButton from "@/components/ui/button";
import { DatePicker } from "@/components/ui/date-picker";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { FALLBACK_ASSESSMENT_QUESTIONS } from "@/constants/assessmentFallback";
import { useAssessmentQuestions } from "@/hooks/useAssessmentQuestions";
import type { AssessmentAnswerValue } from "@/lib/api/assessment";
import { useCheckinStore } from "@/store/useCheckinStore";
import { router } from "expo-router";
import { useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { toast } from "sonner-native";

const isAnswered = (value: AssessmentAnswerValue | undefined) =>
  Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());

const TimeStart = () => {
  const { bottom } = useSafeAreaInsets();
  const storedTime = useCheckinStore((state) => state.time);
  const setTime = useCheckinStore((state) => state.setTime);
  const setTags = useCheckinStore((state) => state.setTags);
  const answers = useCheckinStore((state) => state.answers);
  const setAnswer = useCheckinStore((state) => state.setAnswer);

  const { data, isLoading, isError } = useAssessmentQuestions();
  // If the questions can't be loaded, fall back to the built-in one so
  // the check-in still works offline.
  const questions = data ?? (isError ? FALLBACK_ASSESSMENT_QUESTIONS : []);
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

  const handleContinue = () => {
    if (isLoading) return;

    const unanswered = questions.find(
      (question) => question.is_required && !isAnswered(answers[question.id]),
    );
    if (unanswered) {
      toast.error(`Please answer: ${unanswered.text}`);
      return;
    }

    if (!selectedDate) {
      toast.error("Please select date and time to continue.");
      return;
    }

    const tags = questions
      .filter((question) => question.saves_as_tags)
      .flatMap((question) => {
        const value = answers[question.id];
        return Array.isArray(value) ? value : value ? [value] : [];
      });
    setTags([...new Set(tags)]);

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
            {isLoading ? (
              <ActivityIndicator color={Colors.green} style={styles.loader} />
            ) : (
              questions.map((question) => (
                <AssessmentQuestionField
                  key={question.id}
                  question={question}
                  value={answers[question.id]}
                  onChange={(value) => setAnswer(question.id, value)}
                />
              ))
            )}
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
   //  backgroundColor: "red",
    marginTop: 40,
  },
  contentBlock: {
    gap: 28,
    marginBottom: 40,
  },
  loader: {
    marginVertical: 40,
  },
  timeSection: {
    gap: 20,
    marginTop: 8,
  },
  timeLabel: {
    marginBottom: 4,
  },
});
