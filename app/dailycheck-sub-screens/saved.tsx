import RNButton from "@/components/ui/button";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { moodForRating } from "@/constants/moodOptions";
import { useMeQuery } from "@/hooks/useMeQuery";
import { getLastSavedCheckin } from "@/lib/lastCheckin";
import { router, useFocusEffect } from "expo-router";
import { BedDouble, Check, Flame, MessageCircleHeart, Waves } from "lucide-react-native";
import { useCallback } from "react";
import { BackHandler, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const goHome = () => router.navigate("/(tabs)/home");

/**
 * Leave the finished check-in for Home, then open `path` on top of it, so
 * Back from there returns Home instead of into the check-in steps.
 */
const openFromHome = (path: "/dailycheck-sub-screens/journalhistory") => {
  goHome();
  setTimeout(() => router.push(path), 0);
};

const formatTime = (iso?: string) =>
  iso
    ? new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : "";

/** Shown right after a check-in is saved: what was logged, then back home. */
export default function CheckinSaved() {
  const { bottom } = useSafeAreaInsets();
  const { data: me } = useMeQuery();
  const entry = getLastSavedCheckin();

  // Back would return to the (now empty) check-in steps; go home instead.
  useFocusEffect(
    useCallback(() => {
      const sub = BackHandler.addEventListener("hardwareBackPress", () => {
        goHome();
        return true;
      });
      return () => sub.remove();
    }, []),
  );

  const mood = entry?.mood_rating != null ? moodForRating(entry.mood_rating) : null;
  const MoodIcon = mood?.icon;
  const sleepHours = entry?.sleep_hours != null ? Number(entry.sleep_hours) : null;
  // A gentle offer of support after a hard moment, never a diagnosis.
  const roughMoment =
    (entry?.mood_rating != null && entry.mood_rating <= 3) ||
    (entry?.anxiety_rating != null && entry.anxiety_rating >= 8);
  const streak = me?.streak ?? 0;

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.hero}>
          <View style={styles.checkCircle}>
            <Check size={32} color={Colors.white} strokeWidth={3} />
          </View>
          <RNText variant="title" size="2xl">
            Check-in saved
          </RNText>
          <RNText variant="medium" size="md" style={styles.muted}>
            {entry?.created_at ? `Today at ${formatTime(entry.created_at)}` : "Nice work taking a moment for yourself."}
          </RNText>
        </View>

        {entry && (
          <View style={styles.card}>
            {mood && MoodIcon && (
              <View style={styles.row}>
                <MoodIcon width={30} height={30} />
                <RNText variant="header" size="lg" style={{ flex: 1 }}>
                  {mood.label}
                </RNText>
                <RNText variant="title" size="lg" style={{ color: Colors.green }}>
                  {entry.mood_rating}/10
                </RNText>
              </View>
            )}
            {entry.anxiety_rating != null && (
              <View style={styles.row}>
                <Waves size={22} color={Colors.purple} />
                <RNText variant="medium" size="md" style={styles.rowLabel}>
                  Anxiety
                </RNText>
                <RNText variant="header" size="md">
                  {entry.anxiety_rating}/10
                </RNText>
              </View>
            )}
            {sleepHours != null && (
              <View style={styles.row}>
                <BedDouble size={22} color="#5B8DB8" />
                <RNText variant="medium" size="md" style={styles.rowLabel}>
                  Sleep
                </RNText>
                <RNText variant="header" size="md">
                  {sleepHours}h{entry.sleep_quality ? ` · ${entry.sleep_quality}` : ""}
                </RNText>
              </View>
            )}
            {!!entry.tags?.length && (
              <View style={styles.tags}>
                {entry.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <RNText variant="medium" size="sm" style={{ color: "#5B6B2F" }}>
                      {tag}
                    </RNText>
                  </View>
                ))}
              </View>
            )}
            {!!entry.journal && (
              <RNText variant="base" size="sm" style={styles.journal} numberOfLines={3}>
                “{entry.journal}”
              </RNText>
            )}
          </View>
        )}

        <View style={styles.streak}>
          <Flame size={20} color={Colors.orange} />
          <RNText variant="medium" size="md" style={{ flex: 1, color: Colors.brown }}>
            {streak > 1
              ? `${streak}-day streak. Keep it going!`
              : "Checking in again tomorrow starts a streak."}
          </RNText>
        </View>

        {roughMoment && (
          <View style={styles.support}>
            <RNText variant="header" size="md">
              Sounds like a hard moment
            </RNText>
            <RNText variant="medium" size="sm" style={styles.muted}>
              Talking it through can help. If you're in crisis, call or text 988.
            </RNText>
            <TouchableOpacity
              style={styles.supportButton}
              onPress={() => router.navigate("/(tabs)/chat")}
              accessibilityRole="button"
            >
              <MessageCircleHeart size={18} color={Colors.brown} />
              <RNText variant="subtitle" size="md">
                Talk it through with the AI
              </RNText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: Math.max(bottom, 16) }]}>
        <RNButton value="Done" onPress={goHome} />
        <TouchableOpacity
          onPress={() => openFromHome("/dailycheck-sub-screens/journalhistory")}
          style={styles.secondary}
          accessibilityRole="button"
        >
          <RNText variant="subtitle" size="md" style={{ color: Colors.brown }}>
            View journal
          </RNText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: {
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 16,
    gap: 16,
    width: "100%",
    maxWidth: 560,
    alignSelf: "center",
  },
  hero: { alignItems: "center", gap: 6, marginBottom: 8 },
  checkCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.green,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  muted: { color: Colors.primaryText, textAlign: "center", lineHeight: 21 },
  card: { backgroundColor: Colors.white, borderRadius: 20, padding: 16, gap: 14 },
  row: { flexDirection: "row", alignItems: "center", gap: 12 },
  rowLabel: { flex: 1, color: Colors.primaryText },
  tags: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  tag: { backgroundColor: "#F2F5EB", borderRadius: 999, paddingHorizontal: 12, paddingVertical: 6 },
  journal: { color: Colors.primaryText, fontStyle: "italic", lineHeight: 21 },
  streak: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FFF1EA",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  support: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    borderWidth: 1,
    borderColor: Colors.orange + "55",
    alignItems: "flex-start",
  },
  supportButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 999,
    backgroundColor: "#FFF1EA",
  },
  footer: { paddingHorizontal: 20, paddingTop: 12, gap: 4, width: "100%", maxWidth: 560, alignSelf: "center" },
  secondary: { alignItems: "center", paddingVertical: 12 },
});
