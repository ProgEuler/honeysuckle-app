import Average from "@/assets/svgs/average.svg";
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
import { useReportQuery } from "@/hooks/useReportQuery";
import { ReportEmotionItem } from "@/lib/api/report";
import { router } from "expo-router";
import { ComponentType, useMemo } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const Performance = () => {
  const { bottom } = useSafeAreaInsets();
  const { data: report, isLoading, isError, refetch, isRefetching } = useReportQuery();

  const assessmentMeta: Record<
    string,
    {
      label: string;
      color: string;
      icon: ComponentType<{ width?: number; height?: number }>;
    }
  > = {
    excellent: { label: "Excellent", color: "#9BB068", icon: Excellent },
    good: { label: "Good", color: "#FFCE5C", icon: Happy },
    neutral: { label: "Neutral", color: "#BDA193", icon: Neutral },
    sad: { label: "Sad", color: "#FE814B", icon: Sad },
    depressed: { label: "Depressed", color: "#6D4C41", icon: Depressed },
  };

  const fallbackChart = [
    { value: 0, label: "Week 1", frontColor: "#D7D7D7" },
    { value: 0, label: "Week 2", frontColor: "#D7D7D7" },
    { value: 0, label: "Week 3", frontColor: "#D7D7D7" },
    { value: 0, label: "Week 4", frontColor: "#D7D7D7" },
  ];

  const chartData = useMemo(() => {
    if (!report?.level?.length) {
      return fallbackChart;
    }

    return report.level.map((item) => {
      const key = item.top_assesment?.toLowerCase() ?? "";
      const meta = assessmentMeta[key];

      return {
        value: Number(item.percentage) || 0,
        label: item.week,
        frontColor: meta?.color ?? "#D7D7D7",
      };
    });
  }, [report?.level]);

  const emotionRows = useMemo(() => {
    if (!report?.top_emotions?.length) {
      return [] as ReportEmotionItem[];
    }

    return report.top_emotions;
  }, [report?.top_emotions]);

  const streakText =
    (report?.streak ?? 0) > 0
      ? `🔥 ${report?.streak ?? 0} day${(report?.streak ?? 0) === 1 ? "" : "s"} streak!`
      : "No streak yet";

  return (
    <>
      <SafeAreaView edges={["top"]}>
        <View style={styles.headerContainer}>
          <View style={styles.headerLeft}>
            <BackButton onPress={() => router.push("/(tabs)/home")} />
            <RNText variant="title" size="xl">
              Performance Level
            </RNText>
          </View>
        </View>
      </SafeAreaView>
      <ScrollView
        contentContainerStyle={{ paddingBottom: bottom + 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.green]} tintColor={Colors.green} />
        }
      >
        <View style={styles.chartContainer}>
          <BarChart
            data={chartData}
            height={250}
            spacing={40}
            xAxisLabelTextStyle={styles.xAxisLabel}
            yAxisTextStyle={styles.yAxisLabel}
            maxValue={100}
          />
        </View>
        <View style={styles.emotionsCard}>
          <RNText variant="subtitle" size="lg" style={styles.emotionsTitle}>
            Top Emotions
          </RNText>
          <RNText variant="medium" size="md" style={styles.emotionsSubtitle}>
            Most frequent emotions this month
          </RNText>
          {isLoading ? (
            <RNText variant="medium" size="md">
              Loading report...
            </RNText>
          ) : isError ? (
            <RNText variant="medium" size="md" style={{ color: Colors.orange }}>
              Unable to load report.
            </RNText>
          ) : emotionRows.length === 0 ? (
            <RNText variant="medium" size="md">
              No emotion data yet.
            </RNText>
          ) : (
            emotionRows.map((item) => {
              const key = item.assesment?.toLowerCase();
              const meta = assessmentMeta[key] ?? {
                label: item.assesment,
                color: Colors.green,
                icon: Neutral,
              };
              const IconComponent = meta.icon;
              const boundedPercentage = Math.max(
                0,
                Math.min(100, Number(item.percentage) || 0),
              );

              return (
                <View style={styles.emotionRow} key={item.assesment}>
                  <View style={styles.emotionLabel}>
                    <IconComponent width={24} height={24} />
                    <RNText variant="header" size="md">
                      {meta.label}
                    </RNText>
                  </View>
                  <View style={styles.emotionStats}>
                    <View style={styles.progressBarBackground}>
                      <View
                        style={[
                          styles.progressBarFill,
                          {
                            width: `${boundedPercentage}%`,
                            backgroundColor: meta.color,
                          },
                        ]}
                      />
                    </View>
                    <View style={styles.percentageBadge}>
                      <RNText variant="subtitle" size="sm">
                        {`${Math.round(boundedPercentage)}%`}
                      </RNText>
                    </View>
                  </View>
                </View>
              );
            })
          )}
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
                {isLoading ? "Loading..." : streakText}
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
                {isLoading ? "Loading..." : (report?.average_mood ?? "0/10")}
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
                {isLoading
                  ? "Loading..."
                  : `${report?.entries ?? 0} entr${(report?.entries ?? 0) === 1 ? "y" : "ies"}`}
              </RNText>
            </View>
          </View>
        </View>
        <View style={styles.buttonContainer}>
          <RNButton
            value={"View Full Journal"}
            path={"/dailycheck-sub-screens/journalhistory"}
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
    width: 130,
    height: 15,
    backgroundColor: Colors.brown,
    borderRadius: 30,
    overflow: "hidden",
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
