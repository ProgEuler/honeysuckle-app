import { BackButton } from "@/components/ui/BackButton";
import JournalHistorySkeleton from "@/components/skeletons/screens/JournalHistorySkeleton";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { getJournalEntries, JournalEntry } from "@/lib/api/checkin";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import {
    ActivityIndicator,
    FlatList,
    RefreshControl,
    StyleSheet,
    View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const PAGE_SIZE = 10;

const assessmentColor: Record<string, string> = {
  excellent: "#9BB068",
  good: "#9BB068",
  average: Colors.yellow,
  sad: Colors.orange,
  depressed: "#c0392b",
};

const formatDate = (iso: string) => {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const EntryCard = ({ item }: { item: JournalEntry }) => {
  const dot = assessmentColor[item.assesment.toLowerCase()] ?? Colors.primaryText;
  const details = [
    item.check_in_type === "quick" && "Quick check-in",
    item.anxiety_rating != null && `Anxiety ${item.anxiety_rating}/10`,
    item.sleep_hours != null &&
      `Slept ${Number(item.sleep_hours)}h${item.sleep_quality ? ` (${item.sleep_quality})` : ""}`,
  ].filter(Boolean) as string[];
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.assessmentRow}>
          <View style={[styles.dot, { backgroundColor: dot }]} />
          <RNText variant="title" size="lg">{capitalize(item.assesment)}</RNText>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.scorePill}>
            <RNText variant="subtitle" size="sm">Score: {item.score}/10</RNText>
          </View>
          <RNText variant="medium" size="sm" style={styles.dateText}>
            {formatDate(item.created_at ?? item.time)}
          </RNText>
        </View>
      </View>
      {details.length > 0 && (
        <RNText variant="medium" size="sm" style={styles.detailsText}>
          {details.join(" · ")}
        </RNText>
      )}
      {item.journal ? (
        <RNText variant="base" size="md" style={styles.journalText}>
          {item.journal}
        </RNText>
      ) : null}
      {item.tags && item.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {item.tags.map((tag) => (
            <View key={tag} style={styles.tagPill}>
              <RNText variant="subtitle" size="sm" style={styles.tagText}>
                {tag}
              </RNText>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  );
};

const JournalHistory = () => {
  const { bottom } = useSafeAreaInsets();

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

  const entries = data?.pages.flatMap((p) => p.results) ?? [];

  const renderItem = useCallback(
    ({ item }: { item: JournalEntry }) => <EntryCard item={item} />,
    [],
  );

  const keyExtractor = useCallback((item: JournalEntry) => item.id, []);

  const onEndReached = () => {
    if (hasNextPage && !isFetchingNextPage) fetchNextPage();
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>

      <FlatList
        data={entries}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
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
                Failed to load journal entries.
              </RNText>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <RNText variant="medium" size="md" style={styles.emptyText}>
                No journal entries yet.
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
    paddingHorizontal: 20,
    paddingVertical: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 14,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 16,
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  assessmentRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  scorePill: {
    backgroundColor: "#ECEEF2",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  dateText: {
    color: Colors.primaryText,
  },
  journalText: {
    color: Colors.primaryText,
    lineHeight: 22,
  },
  detailsText: {
    color: "#8F8985",
  },
  tagsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 10,
  },
  tagPill: {
    backgroundColor: "#F1F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  tagText: {
    color: Colors.brown,
  },
  emptyState: {
    alignItems: "center",
    marginTop: 60,
    gap: 12,
  },
  emptyText: {
    color: Colors.primaryText,
  },
});
