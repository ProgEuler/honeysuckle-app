import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useInsightsQuery } from "@/hooks/useInsightsQuery";
import { Calendar, Flame, Heart, Smile, TrendingUp } from "lucide-react-native";
// import { Calendar, Flame } from 'lucide-react-native';
import Depressed from "@/assets/svgs/depressed.svg";
import Excellent from "@/assets/svgs/excellent.svg";
import Happy from "@/assets/svgs/happy.svg";
import Neutral from "@/assets/svgs/neutral.svg";
import Sad from "@/assets/svgs/sad.svg";
import RNButton from "@/components/ui/button";
import AnalyticsSkeleton from "@/components/skeletons/screens/AnalyticsSkeleton";
import { useMemo, useState } from "react";
import { RefreshControl, ScrollView, Text, View } from "react-native";
import { PieChart } from "react-native-gifted-charts";

const assessmentVisualMap: Record<
  string,
  {
    text: string;
    emoji: any;
    color: string;
    gradientCenterColor: string;
    bgColor: string;
  }
> = {
  excellent: {
    text: "Excellent",
    emoji: Excellent,
    color: "#9BB068",
    gradientCenterColor: "#9BB068",
    bgColor: "#C9D2AD",
  },
  good: {
    text: "Good",
    emoji: Happy,
    color: "#FFCE5C",
    gradientCenterColor: "#FFCE5C",
    bgColor: "#EFE497",
  },
  neutral: {
    text: "Neutral",
    emoji: Neutral,
    color: "#BDA193",
    gradientCenterColor: "#BDA193",
    bgColor: "#E0D6D0",
  },
  sad: {
    text: "Sad",
    emoji: Sad,
    color: "#FE814B",
    gradientCenterColor: "#FE814B",
    bgColor: "#F2C3AF",
  },
  depressed: {
    text: "Depressed",
    emoji: Depressed,
    color: "#A18FFF",
    gradientCenterColor: "#A18FFF",
    bgColor: "#D3CCF6",
  },
};

const AnalyticsScreen = () => {
  const { data: insights, isLoading, refetch, isRefetching } = useInsightsQuery();
  const [selectedSlice, setSelectedSlice] = useState<string | null>(null);

  const pieData = useMemo(
    () =>
      (insights?.summary ?? []).map((item) => {
        const visual =
          assessmentVisualMap[item.assesment] ?? assessmentVisualMap.neutral;

        return {
          assesment: item.assesment,
          count: item.count,
          percentage: item.percentage,
          value: item.percentage,
          color: visual.color,
          gradientCenterColor: visual.gradientCenterColor,
          text: visual.text,
          emoji: visual.emoji,
          bgColor: visual.bgColor,
        };
      }),
    [insights?.summary],
  );

  const hasSummaryData = pieData.some((item) => item.value > 0);

  const activeSummary = useMemo(() => {
    if (!pieData.length) {
      return null;
    }

    if (selectedSlice) {
      return pieData.find((item) => item.assesment === selectedSlice) ?? null;
    }

    return pieData.reduce((max, current) =>
      current.percentage > max.percentage ? current : max,
    );
  }, [pieData, selectedSlice]);

  const entries = insights?.entries ?? 0;
  const averageMood = insights?.average_mood ?? "0.0/10";
  const moodTrend = insights?.mood_trend ?? "0%";
  const bestDay = insights?.best_day?.day ?? "--";
  const bestDayAvg = insights?.best_day?.avg ?? 0;

  const centerText = {
    value: activeSummary
      ? `${Number(activeSummary.percentage.toFixed(1)).toString()}%`
      : "0%",
    label: activeSummary?.text ?? "No Data",
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.green]} tintColor={Colors.green} />
        }
      >
        {isLoading && !insights ? (
          <AnalyticsSkeleton />
        ) : (
        <>
        <View
          style={{
            width: "90%",
            marginHorizontal: "auto",
          }}
        >
          <View style={{ gap: 10 }}>
            <RNText variant="title" size="2xl">
              Your Insights
            </RNText>
            <RNText variant="base" size="lg">
              Track your emotinal wellness journey
            </RNText>
          </View>
          <View style={{ marginVertical: 20, gap: 20 }}>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  gap: 5,
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    padding: 12,
                    backgroundColor: "#FF8D28",
                    alignSelf: "flex-start",
                    borderRadius: 12,
                  }}
                >
                  <Calendar size={24} stroke={Colors.white} />
                </View>
                <RNText variant="title" size="lg">
                  Total Entries
                </RNText>
                <RNText variant="header" size="3xl">
                  {entries}
                </RNText>
                <RNText>This Month</RNText>
              </View>
              <View
                style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  gap: 5,
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    padding: 12,
                    backgroundColor: "#FFCC00",
                    alignSelf: "flex-start",
                    borderRadius: 12,
                  }}
                >
                  <Smile size={24} stroke={Colors.white} />
                </View>
                <RNText variant="title" size="lg">
                  Average Mood
                </RNText>
                <RNText variant="header" size="3xl">
                  {averageMood}
                </RNText>
                <RNText>This Month</RNText>
              </View>
            </View>
            <View style={{ flexDirection: "row", gap: 20 }}>
              <View
                style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  gap: 5,
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    padding: 12,
                    backgroundColor: "#34C759",
                    alignSelf: "flex-start",
                    borderRadius: 12,
                  }}
                >
                  <TrendingUp size={24} stroke={Colors.white} />
                </View>
                <RNText variant="title" size="lg">
                  Mood Trend
                </RNText>
                <RNText variant="header" size="3xl">
                  {moodTrend}
                </RNText>
                <RNText>vs Last month</RNText>
              </View>
              <View
                style={{
                  backgroundColor: Colors.white,
                  flex: 1,
                  padding: 20,
                  borderRadius: 15,
                  gap: 5,
                  shadowColor: Colors.green,
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 4,
                }}
              >
                <View
                  style={{
                    padding: 12,
                    backgroundColor: "#FF383C",
                    alignSelf: "flex-start",
                    borderRadius: 12,
                  }}
                >
                  <Heart size={24} stroke={Colors.white} />
                </View>
                <RNText variant="title" size="lg">
                  Best Day
                </RNText>
                <RNText variant="header" size="3xl">
                  {bestDay}
                </RNText>
                <RNText>Avg: {bestDayAvg.toFixed(1)}</RNText>
              </View>
            </View>
          </View>
        </View>
        <View
          style={{
            flexDirection: "row",
            gap: 20,
            backgroundColor: Colors.green,
            width: "90%",
            marginHorizontal: "auto",
            padding: 24,
            alignItems: "center",
            borderRadius: 20,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 3 },
            shadowOpacity: 0.2,
            shadowRadius: 3,
            elevation: 4,
          }}
        >
          <View
            style={{
              backgroundColor: "#AFC086",
              alignSelf: "center",
              paddingVertical: 16,
              paddingHorizontal: 8,
              borderRadius: 24,
            }}
          >
            <Flame size={32} stroke={Colors.white} />
          </View>
          <View style={{ width: "60%", gap: 5 }}>
            <RNText variant="medium" size="xl" style={{ color: Colors.white }}>
              {isLoading
                ? "Loading insights..."
                : `You've logged ${entries} check-in${entries === 1 ? "" : "s"}.`}
            </RNText>
            <RNText variant="medium" size="lg" style={{ color: Colors.white }}>
              Keep up the amazing consistency!
            </RNText>
          </View>
        </View>
        <View
          style={{
            width: "90%",
            marginHorizontal: "auto",
            marginVertical: 40,
          }}
        >
          <View
            style={{
              padding: 20,
              borderRadius: 20,
              alignItems: "center",
            }}
          >
            <RNText variant="title" size="xl" style={{ marginBottom: 30 }}>
              Mood Summary
            </RNText>

            {hasSummaryData ? (
              <PieChart
                data={pieData}
                donut
                focusOnPress
                innerRadius={90}
                radius={150}
                showGradient
                sectionAutoFocus
                innerCircleColor="#0F1A45"
                onPress={(item: any) => {
                  setSelectedSlice(item.assesment);
                }}
                centerLabelComponent={() => {
                  return (
                    <View style={{ alignItems: "center" }}>
                      <Text
                        style={{
                          color: "white",
                          fontSize: 26,
                          fontWeight: "bold",
                        }}
                      >
                        {centerText.value}
                      </Text>
                      <Text
                        style={{ color: "white", fontSize: 14, marginTop: 4 }}
                      >
                        {centerText.label}
                      </Text>
                    </View>
                  );
                }}
              />
            ) : (
              <View
                style={{
                  width: 240,
                  height: 240,
                  borderRadius: 120,
                  backgroundColor: "#F0ECE9",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <RNText
                  variant="medium"
                  size="md"
                  style={{ color: Colors.primaryText }}
                >
                  No mood data yet.
                </RNText>
              </View>
            )}

            {/* Legend */}
            <View
              style={{
                marginTop: 25,
                gap: 20,
                flexDirection: "row",
                flexWrap: "wrap",
              }}
            >
              {pieData.map((item, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    borderWidth: 1,
                    borderColor: Colors.white,
                    padding: 15,
                    borderRadius: 30,
                    backgroundColor:
                      selectedSlice === item.assesment
                        ? item.bgColor
                        : Colors.white,
                  }}
                >
                  <View>
                    <item.emoji height={24} width={24} />
                  </View>
                  <Text style={{ color: "black" }}>
                    {item.text}: {Number(item.percentage.toFixed(1)).toString()}
                    %
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        <View
          style={{
            width: "90%",
            marginHorizontal: "auto",
            marginBottom: 20,
          }}
        >
          <RNButton
            value="View Journal Entries"
            path="/dailycheck-sub-screens/journalhistory"
          />
        </View>
        </>
        )}
      </ScrollView>
    </View>
  );
};

export default AnalyticsScreen;
