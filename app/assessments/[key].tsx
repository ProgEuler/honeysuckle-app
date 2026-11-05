import SafetySupport from "@/components/assessments/SafetySupport";
import AssessmentQuestionField from "@/components/dailycheck/AssessmentQuestionField";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import {
  useQuestionnaire,
  useQuestionnaireResults,
  useSubmitQuestionnaire,
} from "@/hooks/useQuestionnaires";
import type { AssessmentAnswerValue, AssessmentQuestion } from "@/lib/api/assessment";
import { ApiError } from "@/lib/api/client";
import type { QuestionnaireDetail, QuestionnaireResult } from "@/lib/api/questionnaires";
import * as Haptics from "expo-haptics";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { Check } from "lucide-react-native";
import { useRef, useState } from "react";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

type Phase = "intro" | "questions" | "safety" | "result";

const isAnswered = (value: AssessmentAnswerValue | undefined) =>
  Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());

const isSingleAnswer = (question: AssessmentQuestion) =>
  question.question_type === "scale" || question.question_type === "single_choice";

const maxScore = (questionnaire: QuestionnaireDetail) =>
  questionnaire.questions
    .filter((q) => q.question_type === "scale")
    .reduce((sum, q) => sum + Math.max(0, ...q.options.map((o) => o.value ?? 0)), 0);

export default function QuestionnaireScreen() {
  const { key } = useLocalSearchParams<{ key: string }>();
  const { bottom } = useSafeAreaInsets();
  const { data: questionnaire, isLoading, isError, refetch } = useQuestionnaire(key);
  const { data: history } = useQuestionnaireResults(key);
  const submit = useSubmitQuestionnaire();

  const [phase, setPhase] = useState<Phase>("intro");
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, AssessmentAnswerValue>>({});
  const [result, setResult] = useState<QuestionnaireResult | null>(null);
  // The result before this one, captured at submit time for comparison.
  const previousRef = useRef<QuestionnaireResult | null>(null);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const questions = questionnaire?.questions ?? [];
  const question = questions[index];
  const isLast = index === questions.length - 1;

  const goTo = (next: number) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    setIndex(Math.max(0, Math.min(questions.length - 1, next)));
  };

  const handleSubmit = () => {
    const missing = questions.findIndex((q) => q.is_required && !isAnswered(answers[q.id]));
    if (missing !== -1) {
      goTo(missing);
      toast.error("Please answer this question to see your results.");
      return;
    }
    previousRef.current = history?.[0] ?? null;
    submit.mutate(
      {
        key,
        answers: questions
          .filter((q) => isAnswered(answers[q.id]))
          .map((q) => ({ question_id: q.id, answer: answers[q.id] })),
      },
      {
        onSuccess: (saved) => {
          setResult(saved);
          setPhase(saved.needs_safety_followup ? "safety" : "result");
        },
        onError: (error) => {
          toast.error(
            error instanceof ApiError || error instanceof Error
              ? error.message
              : "Couldn't save your answers. Please try again.",
          );
        },
      },
    );
  };

  const selectOption = (label: string) => {
    if (!question) return;
    Haptics.selectionAsync().catch(() => {});
    setAnswers((prev) => ({ ...prev, [question.id]: label }));
    // Move on by itself, after a beat so the selection is visible.
    if (!isLast) {
      if (advanceTimer.current) clearTimeout(advanceTimer.current);
      advanceTimer.current = setTimeout(() => setIndex((i) => i + 1), 250);
    }
  };

  const renderBody = () => {
    if (isLoading) {
      return <ActivityIndicator color={Colors.green} style={{ marginTop: 80 }} />;
    }
    if (isError || !questionnaire) {
      return (
        <View style={styles.centered}>
          <RNText variant="header" size="lg" style={styles.center}>
            Couldn't load this questionnaire
          </RNText>
          <RNButton value="Try again" onPress={() => refetch()} />
        </View>
      );
    }

    if (phase === "intro") {
      return (
        <View style={styles.block}>
          <RNText variant="title" size="2xl">
            {questionnaire.name}
          </RNText>
          {!!questionnaire.description && (
            <RNText variant="medium" size="md" style={styles.muted}>
              {questionnaire.description}
            </RNText>
          )}
          <View style={styles.card}>
            <RNText variant="medium" size="md" style={styles.cardText}>
              Answer based on how you've felt, not how you think you should feel. There are no
              right or wrong answers.
            </RNText>
            <RNText variant="medium" size="sm" style={styles.muted}>
              This is a screening questionnaire, not a diagnosis. Your answers are private to
              your account.
            </RNText>
          </View>
          <RNButton value="Start" onPress={() => setPhase("questions")} />
          {!!questionnaire.copyright_notice && (
            <RNText variant="base" size="xs" style={styles.copyright}>
              {questionnaire.copyright_notice}
            </RNText>
          )}
        </View>
      );
    }

    if (phase === "safety") {
      return <SafetySupport onContinue={() => setPhase("result")} />;
    }

    if (phase === "result" && result) {
      const previous = previousRef.current;
      const max = maxScore(questionnaire);
      const change =
        previous?.total_score != null && result.total_score != null
          ? result.total_score - previous.total_score
          : null;
      return (
        <View style={styles.block}>
          <View style={[styles.card, styles.resultCard]}>
            <RNText variant="medium" size="sm" style={styles.muted}>
              Your score
            </RNText>
            <RNText variant="title" size="4xl">
              {result.total_score ?? "--"}
              {max > 0 && (
                <RNText variant="medium" size="lg" style={styles.muted}>
                  {" "}/ {max}
                </RNText>
              )}
            </RNText>
            {!!result.severity && (
              <View style={styles.severityPill}>
                <RNText variant="header" size="md" style={{ color: Colors.brown }}>
                  {result.severity}
                </RNText>
              </View>
            )}
            {change !== null && (
              <RNText variant="medium" size="sm" style={styles.muted}>
                {change === 0
                  ? "Same as last time"
                  : `${Math.abs(change)} ${change < 0 ? "lower" : "higher"} than last time (${previous?.total_score})`}
              </RNText>
            )}
          </View>
          <View style={styles.card}>
            <RNText variant="medium" size="md" style={styles.cardText}>
              This is a screening result, not a diagnosis. If your score is moderate or higher,
              or you're worried about how you've been feeling, consider talking with a doctor or
              mental health professional. Taking it again every couple of weeks helps you see how
              things change.
            </RNText>
          </View>
          <RNButton value="Done" onPress={() => router.back()} />
          <TouchableOpacity onPress={() => setPhase("safety")} style={styles.supportLink}>
            <RNText variant="medium" size="sm" style={styles.link}>
              Need to talk to someone now? Call or text 988
            </RNText>
          </TouchableOpacity>
        </View>
      );
    }

    if (!question) return null;
    const value = answers[question.id];
    return (
      <View style={styles.block}>
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, { width: `${((index + 1) / questions.length) * 100}%` }]} />
        </View>
        <RNText variant="medium" size="sm" style={styles.muted}>
          Question {index + 1} of {questions.length}
        </RNText>

        {isSingleAnswer(question) ? (
          <>
            {!!questionnaire.instructions && question.question_type === "scale" && (
              <RNText variant="medium" size="sm" style={styles.muted}>
                {questionnaire.instructions}
              </RNText>
            )}
            <RNText variant="header" size="2xl">
              {question.text}
            </RNText>
            {!question.is_required && (
              <RNText variant="medium" size="sm" style={styles.muted}>
                Optional
              </RNText>
            )}
            <View style={styles.options}>
              {question.options.map((option) => {
                const selected = value === option.label;
                return (
                  <TouchableOpacity
                    key={option.id}
                    onPress={() => selectOption(option.label)}
                    style={[styles.option, selected && styles.optionSelected]}
                    accessibilityRole="radio"
                    accessibilityState={{ checked: selected }}
                  >
                    <RNText variant="subtitle" size="md" style={{ flex: 1 }}>
                      {option.label}
                    </RNText>
                    {selected && <Check size={20} color={Colors.green} />}
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        ) : (
          <AssessmentQuestionField
            question={question}
            value={value}
            onChange={(next) => setAnswers((prev) => ({ ...prev, [question.id]: next }))}
          />
        )}

        <View style={styles.navRow}>
          <TouchableOpacity
            onPress={() => goTo(index - 1)}
            disabled={index === 0}
            style={[styles.navButton, index === 0 && styles.hidden]}
          >
            <RNText variant="subtitle" size="md">
              Back
            </RNText>
          </TouchableOpacity>
          {isLast ? (
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={submit.isPending}
              style={[styles.navButton, styles.navPrimary]}
            >
              {submit.isPending ? (
                <ActivityIndicator color={Colors.white} />
              ) : (
                <RNText variant="header" size="md" style={{ color: Colors.white }}>
                  See my results
                </RNText>
              )}
            </TouchableOpacity>
          ) : (
            (!isSingleAnswer(question) || !question.is_required || isAnswered(value)) && (
              <TouchableOpacity onPress={() => goTo(index + 1)} style={[styles.navButton, styles.navPrimary]}>
                <RNText variant="header" size="md" style={{ color: Colors.white }}>
                  {isAnswered(value) ? "Next" : "Skip"}
                </RNText>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: questionnaire?.name.replace(/\s*\(.*\)$/, "") ?? "Questionnaire",
          // Don't let a swipe-back silently lose answers mid-way.
          gestureEnabled: phase !== "questions",
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={[styles.content, { paddingBottom: bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {renderBody()}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: { width: "90%", marginHorizontal: "auto", paddingTop: 60 },
  block: { gap: 18 },
  centered: { gap: 16, marginTop: 80 },
  center: { textAlign: "center" },
  muted: { color: "#8F8985" },
  card: { backgroundColor: Colors.white, borderRadius: 24, padding: 18, gap: 10 },
  cardText: { color: Colors.primaryText, lineHeight: 24 },
  copyright: { color: "#A09791", textAlign: "center", lineHeight: 16 },
  resultCard: { alignItems: "center" },
  severityPill: {
    backgroundColor: "#E8DDD9",
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  progressTrack: { height: 6, borderRadius: 3, backgroundColor: "#E8DDD9", overflow: "hidden" },
  progressFill: { height: 6, borderRadius: 3, backgroundColor: Colors.green },
  options: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.white,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#E8DDD9",
    paddingHorizontal: 18,
    paddingVertical: 16,
    minHeight: 56,
  },
  optionSelected: { borderColor: Colors.green, backgroundColor: "#F2F5EB" },
  navRow: { flexDirection: "row", justifyContent: "space-between", gap: 12, marginTop: 8 },
  navButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 13,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.green,
    minHeight: 50,
  },
  navPrimary: { backgroundColor: Colors.brown, borderColor: Colors.brown },
  hidden: { opacity: 0 },
  supportLink: { alignItems: "center", paddingVertical: 6 },
  link: { color: Colors.green, textDecorationLine: "underline" },
});
