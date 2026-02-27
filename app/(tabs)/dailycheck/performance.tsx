import Average from "@/assets/svgs/average.svg";
import Back from "@/assets/svgs/back.svg";
import Depressed from "@/assets/svgs/depressed.svg";
import Entry from "@/assets/svgs/entry.svg";
import Excellent from "@/assets/svgs/excellent.svg";
import Fire from "@/assets/svgs/fire.svg";
import Happy from "@/assets/svgs/happy.svg";
import Neutral from "@/assets/svgs/neutral.svg";
import Sad from "@/assets/svgs/sad.svg";
import { BackButton } from "@/components/ui/BackButton";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { SafeAreaView } from "react-native-safe-area-context";

const Performance = () => {
  const [previousService, setPreviousService] = useState(true);
  const data = [
    { value: 50, label: "Week 1", frontColor: "#9BB068" }, // Excellent
    { value: 80, label: "Week 2", frontColor: "#FFCE5C" }, // Happy
    { value: 65, label: "Week 3", frontColor: "#BDA193" }, // Neutral
    { value: 90, label: "Week 4", frontColor: "#FE814B" }, // Sad
  ];

  return (
    <>
      <SafeAreaView>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <BackButton />
            <RNText variant="title" size="xl">
              Performance Level
            </RNText>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView>
        <View style={styles.chartContainer}>
          <BarChart
            data={data}
            height={250}
            spacing={40}
            xAxisLabelTextStyle={styles.xAxisLabel}
            yAxisTextStyle={styles.yAxisLabel}
          />
        </View>
        <View style={styles.emotionsCard}>
          <RNText variant="subtitle" size="lg" style={styles.emotionsTitle}>
            Top Emotions
          </RNText>
          <RNText variant="medium" size="md" style={styles.emotionsSubtitle}>
            Most frequesnt emotions this month
          </RNText>
          <View style={styles.emotionRow}>
            <View style={styles.emotionLabel}>
              <Excellent width={24} height={24} />
              <RNText variant="header" size="md">
                Excellent
              </RNText>
            </View>
            <View style={styles.emotionStats}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: "60%" }]} />
              </View>
              <View style={styles.percentageBadge}>
                <RNText variant="subtitle" size="sm">
                  30%
                </RNText>
              </View>
            </View>
          </View>
          <View style={styles.emotionRow}>
            <View style={styles.emotionLabel}>
              <Happy width={24} height={24} />
              <RNText variant="header" size="md">
                Happy
              </RNText>
            </View>
            <View style={styles.emotionStats}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: "60%" }]} />
              </View>
              <View style={styles.percentageBadge}>
                <RNText variant="subtitle" size="sm">
                  25%
                </RNText>
              </View>
            </View>
          </View>
          <View style={styles.emotionRow}>
            <View style={styles.emotionLabel}>
              <Neutral width={24} height={24} />
              <RNText variant="header" size="md">
                Neutral
              </RNText>
            </View>
            <View style={styles.emotionStats}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: "60%" }]} />
              </View>
              <View style={styles.percentageBadge}>
                <RNText variant="subtitle" size="sm">
                  25%
                </RNText>
              </View>
            </View>
          </View>
          <View style={styles.emotionRow}>
            <View style={styles.emotionLabel}>
              <Sad width={24} height={24} />
              <RNText variant="header" size="md">
                Sad
              </RNText>
            </View>
            <View style={styles.emotionStats}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: "60%" }]} />
              </View>
              <View style={styles.percentageBadge}>
                <RNText variant="subtitle" size="sm">
                  25%
                </RNText>
              </View>
            </View>
          </View>
          <View style={styles.emotionRow}>
            <View style={styles.emotionLabel}>
              <Depressed width={24} height={24} />
              <RNText variant="header" size="md">
                Depressed
              </RNText>
            </View>
            <View style={styles.emotionStats}>
              <View style={styles.progressBarBackground}>
                <View style={[styles.progressBarFill, { width: "60%" }]} />
              </View>
              <View style={styles.percentageBadge}>
                <RNText variant="subtitle" size="sm">
                  25%
                </RNText>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <View
              style={[styles.statIconContainer, { backgroundColor: "#F2F5EB" }]}
            >
              <Fire />
            </View>
            <View>
              <RNText variant="title" size="lg">
                Current Streak
              </RNText>
              <RNText variant="medium" size="md">
                🔥 7 days streak!
              </RNText>
            </View>
          </View>
          <View style={styles.statCard}>
            <View
              style={[styles.statIconContainer, { backgroundColor: "#FFF0EB" }]}
            >
              <Average />
            </View>
            <View>
              <RNText variant="title" size="lg">
                Average Mood
              </RNText>
              <RNText variant="medium" size="md">
                6.8 / 10
              </RNText>
            </View>
          </View>
          <View style={styles.statCard}>
            <View
              style={[styles.statIconContainer, { backgroundColor: "#EDEBFF" }]}
            >
              <Entry />
            </View>
            <View>
              <RNText variant="title" size="lg">
                Total Entries
              </RNText>
              <RNText variant="medium" size="md">
                42 entries
              </RNText>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <RNButton
            value={"View Full Journal"}
            path={"/(tabs)/dailycheck/journalhistory"}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
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
  backButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.brown,
    alignItems: "flex-start",
    borderRadius: 40,
  },
  chartContainer: {
    width: "90%",
    marginHorizontal: "auto",
    alignItems: "center",
    paddingTop: 10,
  },
  xAxisLabel: {
    fontSize: 12,
    color: "#444",
  },
  yAxisLabel: {
    color: "#333",
  },
  emotionsCard: {
    width: "90%",
    marginHorizontal: "auto",
    borderWidth: 1,
    borderColor: Colors.green,
    padding: 20,
    marginTop: 50,
    borderRadius: 15,
    backgroundColor: Colors.white,
    shadowColor: Colors.green,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 50,
  },
  emotionsTitle: {
    marginBottom: 5,
  },
  emotionsSubtitle: {
    marginBottom: 25,
  },
  emotionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  emotionLabel: {
    flexDirection: "row",
    gap: 15,
    alignItems: "center",
  },
  emotionStats: {
    flexDirection: "row",
    gap: 20,
    alignItems: "center",
    justifyContent: "flex-end",
  },
  progressBarBackground: {
    width: "40%",
    height: 15,
    backgroundColor: Colors.brown,
    borderRadius: 30,
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: Colors.green,
    borderRadius: 30,
  },
  percentageBadge: {
    backgroundColor: Colors.green,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 30,
  },
  statsContainer: {
    width: "90%",
    marginHorizontal: "auto",
    marginBottom: 50,
    gap: 20,
  },
  statCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 15,
    alignItems: "center",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  statIconContainer: {
    padding: 16,
    borderRadius: 50,
  },
  buttonContainer: {
    width: "70%",
    marginHorizontal: "auto",
    marginBottom: 50,
  },
});

export default Performance;
