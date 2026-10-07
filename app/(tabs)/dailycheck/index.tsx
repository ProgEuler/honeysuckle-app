import { moodOptions } from "@/constants/moodOptions";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useCheckinStore } from "@/store/useCheckinStore";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { toast } from "sonner-native";

const Index = () => {
  const storedMood = useCheckinStore((state) => state.selectedMoodLabel);
  const setMood = useCheckinStore((state) => state.setMood);
  const [selectedMood, setSelectedMood] = useState<string | null>(storedMood);

  const handleMoodSelect = (label: string) => {
    setSelectedMood(label);
    setMood(label);
  };

  const handleContinue = () => {
    if (!selectedMood) {
      toast.error("Please select your mood to continue.");
      return;
    }

    router.push("/dailycheck-sub-screens/timestart");
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={{ paddingBottom: 180 }}>
          <View
            style={{
              width: "90%",
              marginHorizontal: "auto",
              marginTop: 20,
            }}
          >
            <RNText variant="title" size="2xl" style={{ textAlign: "center" }}>
              Every day is different. Choose the mood that fits best today.
            </RNText>
          </View>
          <View
            style={{
              width: "90%",
              marginHorizontal: "auto",
              gap: 20,
              marginTop: 50,
              marginBottom: 30,
            }}
          >
            {moodOptions.map((mood, index) => {
              const isActive = selectedMood === mood.label;
              return (
                <TouchableOpacity
                  onPress={() => handleMoodSelect(mood.label)}
                  key={index}
                  style={{
                    flexDirection: "row",
                    borderColor: Colors.green,
                    backgroundColor: isActive ? "#CFD9B5" : Colors.white,
                    borderWidth: 1,
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingHorizontal: 25,
                    paddingVertical: 10,
                    borderRadius: 20,
                  }}
                >
                  <RNText
                    variant="title"
                    size="xl"
                    style={{ color: "#8F8985" }}
                  >
                    {mood.label}
                  </RNText>
                  <View
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.1,
                      shadowRadius: 3,
                      elevation: 3,
                    }}
                  >
                    <mood.icon />
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          <View
            style={{
              width: "90%",
              marginHorizontal: "auto",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              gap: 30,
              marginTop: 20,
            }}
          >
            <View style={{ width: "100%" }}>
              <RNButton value={"Continue"} onPress={handleContinue} />
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Index;
