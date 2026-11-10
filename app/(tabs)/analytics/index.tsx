import MoodAnxietyChart from "@/components/analytics/MoodAnxietyChart";
import MoodBreakdown from "@/components/analytics/MoodBreakdown";
import StatCard from "@/components/analytics/StatCard";
import TopFactors from "@/components/analytics/TopFactors";
import QuestionnaireTrends from "@/components/assessments/QuestionnaireTrends";
import AnalyticsSkeleton from "@/components/skeletons/screens/AnalyticsSkeleton";
import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useInsightsQuery } from "@/hooks/useInsightsQuery";
import { useMeQuery } from "@/hooks/useMeQuery";
import { questionnairesQueryKey } from "@/hooks/useQuestionnaires";
import { useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  BedDouble,
  CalendarCheck,
  CalendarHeart,
  Flame,
  Smile,
  TrendingUp,
  Waves,
} from "lucide-react-native";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";

const formatOneDecimal = (value: number | null | undefined) =>
  value === null || value === undefined ? "--" : String(Number(value.toFixed(1)));

const AnalyticsScreen = () => {
  const { data: insights, isLoading, refetch, isRefetching } = useInsightsQuery();
  const { data: me } = useMeQuery();
  const queryClient = useQueryClient();

  const entries = insights?.entries ?? 0;
  const streak = me?.streak ?? 0;
  const averageMood = entries ? formatOneDecimal(parseFloat(insights?.average_mood ?? "")) : "--";
  const moodTrend = insights?.mood_trend ?? "--";
  const bestDay = insights?.best_day?.day;
  const monthName = new Date().toLocaleDateString("en-US", { month: "long" });

  const onRefresh = () => {
    refetch();
    queryClient.invalidateQueries({ queryKey: questionnairesQueryKey });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      contentInsetAdjustmentBehavior="automatic"
      refreshControl={
        <RefreshControl refreshing={isRefetching} onRefresh={onRefresh} colors={[Colors.green]} tintColor={Colors.green} />
      }
    >
      {isLoading && !insights ? (
        <AnalyticsSkeleton />
      ) : (
        <>
          <View style={styles.titleBlock}>
            <RNText variant="title" size="2xl">
              Your insights
            </RNText>
            <RNText variant="medium" size="md" style={styles.muted}>
              {monthName} so far
            </RNText>
          </View>

          {entries === 0 ? (
            <View style={styles.emptyCard}>
              <RNText variant="header" size="lg">
                No check-ins this month yet
              </RNText>
              <RNText variant="medium" size="sm" style={styles.muted}>
                Your mood, anxiety and sleep patterns will show up here after a few check-ins.
              </RNText>
              <RNButton value="Check in now" onPress={() => router.push("/(tabs)/dailycheck")} />
            </View>
          ) : (
            <>
              <View style={styles.streak}>
                <Flame size={22} color={Colors.orange} />
                <RNText variant="header" size="md" style={{ flex: 1 }}>
                  {streak > 0
                    ? `${streak}-day check-in streak`
                    : "Check in today to start a streak"}
                </RNText>
              </View>

              <View style={styles.grid}>
                <View style={styles.row}>
                  <StatCard icon={CalendarCheck} tint="#FFF1EA" color={Colors.orange} label="Check-ins" value={String(entries)} />
                  <StatCard icon={Smile} tint="#F2F5EB" color={Colors.green} label="Average mood" value={averageMood} unit="/10" />
                </View>
                <View style={styles.row}>
                  <StatCard
                    icon={Waves}
                    tint="#EEEBFF"
                    color={Colors.purple}
                    label="Average anxiety"
                    value={formatOneDecimal(insights?.average_anxiety)}
                    unit={insights?.average_anxiety != null ? "/10" : undefined}
                  />
                  <StatCard
                    icon={BedDouble}
                    tint="#E9F1F7"
                    color="#5B8DB8"
                    label="Average sleep"
                    value={formatOneDecimal(insights?.average_sleep)}
                    unit={insights?.average_sleep != null ? "hours" : undefined}
                  />
                </View>
                <View style={styles.row}>
                  <StatCard icon={TrendingUp} tint="#F2F5EB" color={Colors.green} label="Mood vs last month" value={moodTrend} />
                  <StatCard
                    icon={CalendarHeart}
                    tint="#FFF6DE"
                    color="#D99A00"
                    label="Best day"
                    value={bestDay ?? "--"}
                    unit={bestDay ? `avg ${formatOneDecimal(insights?.best_day.avg)}` : undefined}
                  />
                </View>
              </View>

              <MoodAnxietyChart days={insights?.daily ?? []} />
              <MoodBreakdown summary={insights?.summary ?? []} />
              <TopFactors factors={insights?.top_factors ?? []} />
            </>
          )}

          <QuestionnaireTrends />

          <RNButton value="View journal entries" path="/dailycheck-sub-screens/journalhistory" />
        </>
      )}
    </ScrollView>
  );
};

export default AnalyticsScreen;

const styles = StyleSheet.create({
  content: { width: "90%", marginHorizontal: "auto", paddingTop: 16, paddingBottom: 120, gap: 16 },
  titleBlock: { gap: 2, marginBottom: 4 },
  muted: { color: "#8F8985", lineHeight: 20 },
  emptyCard: { backgroundColor: Colors.white, borderRadius: 20, padding: 20, gap: 12 },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF1EA",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  grid: { gap: 12 },
  row: { flexDirection: "row", gap: 12 },
});
