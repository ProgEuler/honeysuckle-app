import RatingScale from "@/components/dailycheck/RatingScale";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { moodOptions } from "@/constants/moodOptions";
import { useSaveCheckin } from "@/hooks/useSaveCheckin";
import { useCheckinStore } from "@/store/useCheckinStore";
import { router } from "expo-router";
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";

// Same bands the server uses to turn a rating into a mood label.
const moodForRating = (rating: number) => {
  const [excellent, happy, neutral, sad, depressed] = moodOptions;
  if (rating >= 8) return excellent;
  if (rating >= 6) return happy;
  if (rating >= 4) return neutral;
  if (rating >= 2) return sad;
  return depressed;
};

const Index = () => {
  const moodRating = useCheckinStore((state) => state.moodRating);
  const anxietyRating = useCheckinStore((state) => state.anxietyRating);
  const setMoodRating = useCheckinStore((state) => state.setMoodRating);
  const setAnxietyRating = useCheckinStore((state) => state.setAnxietyRating);
  const saveCheckin = useSaveCheckin();

  const mood = moodRating === null ? null : moodForRating(moodRating);

  const validate = () => {
    if (moodRating === null) {
      toast.error("Please rate your mood to continue.");
      return false;
    }
    if (anxietyRating === null) {
      toast.error("Please rate your anxiety to continue.");
      return false;
    }
    return true;
  };

  const handleContinue = () => {
    if (validate()) router.push("/dailycheck-sub-screens/timestart");
  };

  const handleQuickSave = () => {
    if (!validate() || moodRating === null || anxietyRating === null) return;
    saveCheckin.mutate({
      check_in_type: "quick",
      mood_rating: moodRating,
      anxiety_rating: anxietyRating,
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
    >
      <RNText variant="title" size="2xl" style={styles.heading}>
        Every day is different. How are you right now?
      </RNText>

      <View style={styles.scales}>
        <RatingScale
          title="Mood"
          value={moodRating}
          onChange={setMoodRating}
          lowLabel="Very low"
          highLabel="Excellent"
          summary={mood && <mood.icon width={28} height={28} />}
        />
        <RatingScale
          title="Anxiety"
          value={anxietyRating}
          onChange={setAnxietyRating}
          lowLabel="Calm"
          highLabel="Very anxious"
        />
      </View>

      <View style={styles.actions}>
        <RNButton value={"Continue full assessment"} onPress={handleContinue} disabled={saveCheckin.isPending} />
        <TouchableOpacity
          onPress={handleQuickSave}
          disabled={saveCheckin.isPending}
          style={styles.quickButton}
          accessibilityHint="Saves just your mood and anxiety"
        >
          {saveCheckin.isPending ? (
            <ActivityIndicator color={Colors.brown} />
          ) : (
            <RNText variant="subtitle" size="lg">
              Save quick check-in
            </RNText>
          )}
        </TouchableOpacity>
        <RNText variant="medium" size="sm" style={styles.hint}>
          Check in as often as you like. The full assessment adds sleep, what's affecting you, and an optional journal.
        </RNText>
      </View>
    </ScrollView>
  );
};

export default Index;

const styles = StyleSheet.create({
  content: {
    width: "90%",
    marginHorizontal: "auto",
    paddingTop: 20,
    paddingBottom: 180,
    gap: 28,
  },
  heading: { textAlign: "center" },
  scales: { gap: 16 },
  actions: { gap: 12 },
  quickButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 30,
    paddingVertical: 13,
    minHeight: 52,
  },
  hint: { textAlign: "center", color: "#8F8985", lineHeight: 20 },
});
