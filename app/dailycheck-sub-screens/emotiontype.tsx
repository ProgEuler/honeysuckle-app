import { BackButton } from "@/components/ui/BackButton";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

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

const EmotionType = () => {
  const { bottom } = useSafeAreaInsets();

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const handleTagSelect = (label: string) => {
    setSelectedTags((currentTags) =>
      currentTags.includes(label)
        ? currentTags.filter((tag) => tag !== label)
        : [...currentTags, label],
    );
  };

  return (
    <>
      <SafeAreaView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 10,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: 20,
            }}
          >
            <BackButton />
            <RNText variant="title" size="xl">
              Assessment
            </RNText>
          </View>
          <View
            style={{
              backgroundColor: "#E8DDD9",
              paddingHorizontal: 15,
              paddingVertical: 8,
              borderRadius: 30,
            }}
          >
            <RNText variant="title" size="sm" style={{ color: "#926247" }}>
              2 OF 4
            </RNText>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ paddingBottom: bottom + 40 }}>
          <View
            style={{
              width: "90%",
              marginHorizontal: "auto",
              marginTop: 20,
            }}
          >
            <RNText variant="title" size="3xl" style={styles.titleText}>
              What may be affecting your mood today?
            </RNText>
          </View>
          <View style={styles.tagsContainer}>
            {moodTags.map((tag) => {
              const isActive = selectedTags.includes(tag);

              return (
                <TouchableOpacity
                  onPress={() => handleTagSelect(tag)}
                  key={tag}
                  style={[styles.tag, isActive && styles.tagActive]}
                >
                  <RNText
                    variant="title"
                    size="md"
                    style={[styles.tagText, isActive && styles.tagTextActive]}
                  >
                    {tag}
                  </RNText>
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
              <RNButton
                value={"Continue"}
                path={"/dailycheck-sub-screens/timestart"}
                // tag={'replace'}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </>
  );
};

export default EmotionType;

const styles = StyleSheet.create({
  titleText: {
    textAlign: "center",
  },
  tagsContainer: {
    width: "90%",
    marginHorizontal: "auto",
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 40,
  },
  tag: {
    borderWidth: 1,
    borderColor: Colors.green,
    backgroundColor: Colors.white,
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
});
