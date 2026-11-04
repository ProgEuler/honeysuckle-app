import AssessmentQuestionField from "@/components/dailycheck/AssessmentQuestionField";
import SleepInput from "@/components/dailycheck/SleepInput";
import RNButton from "@/components/ui/button";
import { Colors } from "@/constants/color";
import { FALLBACK_ASSESSMENT_QUESTIONS } from "@/constants/assessmentFallback";
import { useAssessmentQuestions } from "@/hooks/useAssessmentQuestions";
import type { AssessmentAnswerValue } from "@/lib/api/assessment";
import { useCheckinStore } from "@/store/useCheckinStore";
import { router } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const isAnswered = (value: AssessmentAnswerValue | undefined) =>
  Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());

const TimeStart = () => {
  const { bottom } = useSafeAreaInsets();
  const sleepHours = useCheckinStore((state) => state.sleepHours);
  const sleepQuality = useCheckinStore((state) => state.sleepQuality);
  const setSleepHours = useCheckinStore((state) => state.setSleepHours);
  const setSleepQuality = useCheckinStore((state) => state.setSleepQuality);
  const setTags = useCheckinStore((state) => state.setTags);
  const answers = useCheckinStore((state) => state.answers);
  const setAnswer = useCheckinStore((state) => state.setAnswer);

  const { data, isLoading, isError } = useAssessmentQuestions();
  // If the questions can't be loaded, fall back to the built-in one so
  // the check-in still works offline.
  const questions = data ?? (isError ? FALLBACK_ASSESSMENT_QUESTIONS : []);
  const handleContinue = () => {
    if (isLoading) return;

    if (sleepHours === null) {
      toast.error("Please enter how long you slept.");
      return;
    }

    if (!sleepQuality) {
      toast.error("Please choose how well you slept.");
      return;
    }

    const unanswered = questions.find(
      (question) => question.is_required && !isAnswered(answers[question.id]),
    );
    if (unanswered) {
      toast.error(`Please answer: ${unanswered.text}`);
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
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={{ paddingTop: 60 }}
      >
        <View style={[styles.contentWrapper, { paddingBottom: bottom + 40 }]}>
          <View style={styles.contentBlock}>
            <SleepInput
              hours={sleepHours}
              quality={sleepQuality}
              onHoursChange={setSleepHours}
              onQualityChange={setSleepQuality}
            />
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
          </View>
          <RNButton value={"Continue"} onPress={handleContinue} />
        </View>
      </ScrollView>
    </View>
  );
};

export default TimeStart;

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  loader: {
    marginVertical: 40,
  },
});
