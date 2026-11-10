import JournalHistorySkeleton from "@/components/skeletons/screens/JournalHistorySkeleton";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { moodForRating, moodOptions } from "@/constants/moodOptions";
import { getJournalEntries, JournalEntry } from "@/lib/api/checkin";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    SectionList,
    StyleSheet,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const PAGE_SIZE = 20;

type Filter = "all" | "detailed" | "quick" | "journal";
const FILTERS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "detailed", label: "Full" },
  { key: "quick", label: "Quick" },
  { key: "journal", label: "With journal" },
];

const matches = (entry: JournalEntry, filter: Filter) => {
  if (filter === "detailed") return entry.check_in_type !== "quick";
  if (filter === "quick") return entry.check_in_type === "quick";
  if (filter === "journal") return Boolean(entry.journal?.trim());
  return true;
};

const whenOf = (entry: JournalEntry) => new Date(entry.created_at ?? entry.time);

const dayLabel = (date: Date) => {
  const day = new Date(date);
  day.setHours(0, 0, 0, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const diffDays = Math.round((today.getTime() - day.getTime()) / 86400000);
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    ...(date.getFullYear() !== today.getFullYear() ? { year: "numeric" } : {}),
  });
};

// Older check-ins only have a mood label, not a 0–10 rating.
const LABEL_TO_MOOD: Record<string, number> = { excellent: 0, good: 1, neutral: 2, sad: 3, depressed: 4 };

const EntryCard = ({ item }: { item: JournalEntry }) => {
  const [expanded, setExpanded] = useState(false);
  const mood =
    item.mood_rating != null
      ? moodForRating(item.mood_rating)
      : moodOptions[LABEL_TO_MOOD[item.assesment?.toLowerCase()] ?? 2];
  const MoodIcon = mood.icon;
  const details = [
    item.anxiety_rating != null && `Anxiety ${item.anxiety_rating}/10`,
    item.sleep_hours != null &&
      `Slept ${Number(item.sleep_hours)}h${item.sleep_quality ? ` (${item.sleep_quality})` : ""}`,
  ].filter(Boolean) as string[];

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MoodIcon width={28} height={28} />
        <View style={{ flex: 1 }}>
          <RNText variant="header" size="md">
            {mood.label}
            {item.mood_rating != null && (
              <RNText variant="medium" size="sm" style={styles.muted}> · {item.mood_rating}/10</RNText>
            )}
          </RNText>
          {item.check_in_type === "quick" && (
            <RNText variant="medium" size="xs" style={styles.muted}>Quick check-in</RNText>
          )}
        </View>
        <RNText variant="medium" size="sm" style={styles.muted}>
          {whenOf(item).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </RNText>
      </View>

      {details.length > 0 && (
        <RNText variant="medium" size="sm" style={styles.muted}>
          {details.join(" · ")}
        </RNText>
      )}

      {!!item.tags?.length && (
        <View style={styles.tagsRow}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <RNText variant="medium" size="xs" style={{ color: "#5B6B2F" }}>
                {tag}
              </RNText>
            </View>
          ))}
        </View>
      )}

      {!!item.journal?.trim() && (
        <TouchableOpacity activeOpacity={0.7} onPress={() => setExpanded((e) => !e)} accessibilityRole="button">
          <RNText variant="base" size="md" style={styles.journalText} numberOfLines={expanded ? undefined : 3}>
            {item.journal}
          </RNText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const JournalHistory = () => {
  const { bottom } = useSafeAreaInsets();
  const [filter, setFilter] = useState<Filter>("all");

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
    isRefetching,
  } = useInfiniteQuery({
    queryKey: ["journal-entries"],
    queryFn: ({ pageParam = 1 }) =>
      getJournalEntries({ page: pageParam as number, page_size: PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (last, pages) =>
      last.next ? pages.length + 1 : undefined,
  });

  const sections = useMemo(() => {
    const groups: { title: string; data: JournalEntry[] }[] = [];
    for (const entry of data?.pages.flatMap((p) => p.results) ?? []) {
      if (!matches(entry, filter)) continue;
      const title = dayLabel(whenOf(entry));
      const last = groups[groups.length - 1];
      if (last?.title === title) last.data.push(entry);
      else groups.push({ title, data: [entry] });
    }
    return groups;
  }, [data, filter]);

  const renderItem = useCallback(
    ({ item }: { item: JournalEntry }) => <EntryCard item={item} />,
    [],
  );

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <SectionList
        sections={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        renderSectionHeader={({ section }) => (
          <RNText variant="header" size="sm" style={styles.sectionTitle}>
            {section.title}
          </RNText>
        )}
        ListHeaderComponent={
          <View style={styles.filters}>
            {FILTERS.map(({ key, label }) => {
              const active = filter === key;
              return (
                <TouchableOpacity
                  key={key}
                  onPress={() => setFilter(key)}
                  style={[styles.filterChip, active && styles.filterChipActive]}
                  accessibilityRole="tab"
                  accessibilityState={{ selected: active }}
                >
                  <RNText variant="header" size="sm" style={{ color: active ? Colors.white : Colors.brown }}>
                    {label}
                  </RNText>
                </TouchableOpacity>
              );
            })}
          </View>
        }
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        stickySectionHeadersEnabled={false}
        contentContainerStyle={[styles.listContent, { paddingBottom: bottom + 40 }]}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.green]}
            tintColor={Colors.green}
          />
        }
        ListFooterComponent={
          isFetchingNextPage ? (
            <ActivityIndicator color={Colors.green} style={{ marginVertical: 16 }} />
          ) : null
        }
        ListEmptyComponent={
          isLoading ? (
            <JournalHistorySkeleton />
          ) : isError ? (
            <View style={styles.emptyState}>
              <RNText variant="medium" size="md" style={{ color: Colors.orange }}>
                Couldn't load your entries. Pull down to try again.
              </RNText>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <RNText variant="medium" size="md" style={styles.muted}>
                {filter === "all"
                  ? "No check-ins yet. They'll show up here."
                  : "Nothing matches this filter yet."}
              </RNText>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default JournalHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    paddingTop: 64,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  filters: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 4 },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E8DDD9",
  },
  filterChipActive: { backgroundColor: Colors.brown, borderColor: Colors.brown },
  sectionTitle: {
    color: "#A09791",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginTop: 20,
    marginBottom: 10,
    marginLeft: 4,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 10,
  },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  muted: { color: "#8F8985" },
  journalText: { color: Colors.primaryText, lineHeight: 22 },
  tagsRow: { flexDirection: "row", flexWrap: "wrap", gap: 6 },
  tagPill: {
    backgroundColor: "#F2F5EB",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 999,
  },
  emptyState: { alignItems: "center", marginTop: 60, paddingHorizontal: 24 },
});
