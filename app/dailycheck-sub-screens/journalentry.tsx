import AI from "@/assets/svgs/ai.svg";
import AIGreen from "@/assets/svgs/aig.svg";
import ArrowRight from "@/assets/svgs/arrowright.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { inspirationQuestions } from "@/constants/prompt-inspirations";
import { useAssessmentQuestions } from "@/hooks/useAssessmentQuestions";
import { useSaveCheckin } from "@/hooks/useSaveCheckin";
import { useCheckinStore } from "@/store/useCheckinStore";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { X } from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { Portal } from "react-native-portalize";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const JournalEntry = () => {
  const { bottom } = useSafeAreaInsets();
  const moodRating = useCheckinStore((state) => state.moodRating);
  const anxietyRating = useCheckinStore((state) => state.anxietyRating);
  const sleepHours = useCheckinStore((state) => state.sleepHours);
  const sleepQuality = useCheckinStore((state) => state.sleepQuality);
  const tags = useCheckinStore((state) => state.tags);
  const answers = useCheckinStore((state) => state.answers);
  const { data: questions } = useAssessmentQuestions();
  const storedJournal = useCheckinStore((state) => state.journal);
  const setJournal = useCheckinStore((state) => state.setJournal);
  const resetCheckin = useCheckinStore((state) => state.resetCheckin);

  const [text, setText] = useState(storedJournal);
  const [insparation, setInsparation] = useState(false);

  const checkinMutation = useSaveCheckin();

  const handleSaveEntry = () => {
    const journalText = text.trim();

    if (moodRating === null || anxietyRating === null) {
      toast.error("Please complete step 1 and rate your mood and anxiety.");
      return;
    }

    if (sleepHours === null || !sleepQuality) {
      toast.error("Please complete step 2 and add your sleep.");
      return;
    }

    setJournal(journalText);

    checkinMutation.mutate({
      check_in_type: "detailed",
      mood_rating: moodRating,
      anxiety_rating: anxietyRating,
      sleep_hours: sleepHours,
      sleep_quality: sleepQuality,
      tags,
      // Only send answers for questions the server gave us; with the
      // offline fallback, the tags alone carry the selection.
      answers: questions
        ?.filter((question) => {
          const value = answers[question.id];
          return Array.isArray(value) ? value.length > 0 : Boolean(value?.trim());
        })
        .map((question) => ({ question_id: question.id, answer: answers[question.id] })),
      journal: journalText,
    });
  };

  return (
    <View style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{
          justifyContent: "center",
          paddingTop: 60,
          paddingBottom: bottom + 40,
        }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View
          style={{
            width: "90%",
            marginHorizontal: "auto",
          }}
        >
          <View style={{ gap: 50, marginBottom: 50 }}>
            <View style={{ width: "90%", marginHorizontal: "auto" }}>
              <RNText
                variant="header"
                size="3xl"
                style={{ textAlign: "center" }}
              >
                Want to share what is on your mind?
              </RNText>
            </View>
            <View>
              <RNText variant="header" size="lg">
                Journal Entry{" "}
                <RNText variant="medium" size="sm" style={{ color: "#8F8985" }}>
                  (optional)
                </RNText>
              </RNText>
              <View style={{ flex: 1, paddingVertical: 10 }}>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: "#ccc",
                    borderRadius: 10,
                    padding: 15,
                    fontSize: 16,
                    fontFamily: "Regular",
                    backgroundColor: "#D3DCBD",
                    height: 180,
                  }}
                  placeholder={"What feels most important right now?"}
                  multiline={true}
                  numberOfLines={6}
                  value={text}
                  onChangeText={(value) => {
                    setText(value);
                    setJournal(value);
                  }}
                  textAlignVertical="top"
                />
              </View>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setInsparation(true)}
            style={{
              flexDirection: "row",
              justifyContent: "center",
              borderWidth: 1,
              borderColor: Colors.green,
              paddingVertical: 13,
              borderRadius: 30,
              alignItems: "center",
              gap: 10,
              marginBottom: 30,
            }}
          >
            <AI />
            <RNText variant="subtitle" size="lg">
              Need inspiration?
            </RNText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveEntry}
            disabled={checkinMutation.isPending}
            style={{
              backgroundColor: Colors.brown,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 13,
              gap: 15,
              borderRadius: 30,
              opacity: checkinMutation.isPending ? 0.7 : 1,
            }}
          >
            <RNText variant="title" size="lg" style={{ color: Colors.white }}>
              {checkinMutation.isPending ? "Saving..." : "Save Entry"}
            </RNText>
            {checkinMutation.isPending ? (
              <ActivityIndicator color={Colors.white} />
            ) : (
              <ArrowRight />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              resetCheckin();
              router.replace("/(tabs)/home");
            }}
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              paddingVertical: 13,
              gap: 10,
              marginTop: 12,
            }}
          >
            <RNText
              variant="medium"
              size="md"
              style={{ color: Colors.brown }}
            >
              Go to Home
            </RNText>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
      {insparation && (
        <Portal>
          <BlurView
            intensity={30}
            tint="dark"
            experimentalBlurMethod="dimezisBlurView"
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  height: "70%",
                  width: "90%",
                  marginHorizontal: "auto",
                  marginVertical: "auto",
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                }}
              >
                <View
                  style={{
                    width: "85%",
                    marginHorizontal: "auto",
                    marginTop: 25,
                  }}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 10,
                      }}
                    >
                      <AIGreen />
                      <RNText variant="header" size="lg" style={{}}>
                        Writing Prompts
                      </RNText>
                    </View>
                    <TouchableOpacity onPress={() => setInsparation(false)}>
                      <X height={18} width={18} />
                    </TouchableOpacity>
                  </View>
                  <RNText
                    variant="base"
                    size="md"
                    style={{
                      color: Colors.green,
                      textAlign: "center",
                      marginTop: 10,
                      marginBottom: 25,
                    }}
                  >
                    Choose a prompt to help you get started with your journal
                    entry
                  </RNText>
                  <ScrollView style={{ height: "80%", paddingHorizontal: 5 }}>
                    {inspirationQuestions.map((item) => (
                      <TouchableOpacity
                        onPress={() => {
                          setText((prev) => `${item.question}\n\n`);
                          setInsparation(false);
                        }}
                        key={item.id}
                        style={{
                          borderColor: Colors.green,
                          padding: 10,
                          borderWidth: 1,
                          marginBottom: 15,
                          borderRadius: 15,
                        }}
                      >
                        <RNText variant="base" size="md">
                          {item.question}
                        </RNText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
          </BlurView>
        </Portal>
      )}
    </View>
  );
};

export default JournalEntry;
