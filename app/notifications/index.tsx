import Back from "@/assets/svgs/back.svg";
import NotificationPermissionBanner from "@/components/shared/NotificationPermissionBanner";
import NotificationsSkeleton from "@/components/skeletons/screens/NotificationsSkeleton";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { notificationsQueryKey, useNotificationsQuery } from "@/hooks/useNotificationsQuery";
import { markNotificationRead, type Notification, type NotificationsResponse } from "@/lib/api/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useFocusEffect } from "expo-router";
import { Bell, BellOff, CheckCheck, RefreshCw } from "lucide-react-native";
import { useCallback, useMemo, useState } from "react";
import { ActivityIndicator, RefreshControl, SectionList, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Filter = "all" | "unread";

const startOfDay = (date: Date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getDateLabel = (iso: string) => {
  const day = startOfDay(new Date(iso)).getTime();
  const today = startOfDay(new Date()).getTime();
  const dayMs = 24 * 60 * 60 * 1000;

  if (day === today) return "Today";
  if (day === today - dayMs) return "Yesterday";
  if (day > today - 7 * dayMs) return "This week";
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
};

const groupByDate = (notifications: Notification[]) => {
  const groups: { title: string; data: Notification[] }[] = [];
  for (const n of notifications) {
    const label = getDateLabel(n.created_at);
    const last = groups[groups.length - 1];
    if (last?.title === label) {
      last.data.push(n);
    } else {
      groups.push({ title: label, data: [n] });
    }
  }
  return groups;
};

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
};

const markAllAsRead = (old: NotificationsResponse | undefined, ids?: Set<string>) => {
  if (!old) return old;
  return {
    ...old,
    results: old.results.map((n) => (!ids || ids.has(n.id) ? { ...n, is_read: true } : n)),
  };
};

export default function NotificationsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useNotificationsQuery();
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<Filter>("all");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const previous = queryClient.getQueryData<NotificationsResponse>(notificationsQueryKey);
      queryClient.setQueryData<NotificationsResponse>(notificationsQueryKey, (old) =>
        markAllAsRead(old, new Set([id]))
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(notificationsQueryKey, context?.previous);
    },
  });

  const readAllMutation = useMutation({
    mutationFn: (ids: string[]) => Promise.allSettled(ids.map(markNotificationRead)),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      queryClient.setQueryData<NotificationsResponse>(notificationsQueryKey, (old) => markAllAsRead(old));
    },
    // Some requests may have failed; let the server be the source of truth.
    onSettled: () => queryClient.invalidateQueries({ queryKey: notificationsQueryKey }),
  });

  const notifications = useMemo(
    () => (data?.results ?? []).filter((n) => n.title || n.body),
    [data]
  );
  const unreadIds = useMemo(
    () => notifications.filter((n) => !n.is_read).map((n) => n.id),
    [notifications]
  );
  const sections = useMemo(
    () => groupByDate(filter === "unread" ? notifications.filter((n) => !n.is_read) : notifications),
    [notifications, filter]
  );

  const handlePress = (item: Notification) => {
    if (!item.is_read) readMutation.mutate(item.id);
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const renderEmpty = () => {
    if (isError) {
      return (
        <View style={styles.centered}>
          <View style={styles.emptyIcon}>
            <RefreshCw size={28} color={Colors.orange} />
          </View>
          <RNText variant="header" size="lg" style={styles.emptyTitle}>
            Couldn't load notifications
          </RNText>
          <RNText variant="medium" size="sm" style={styles.emptyText}>
            Check your connection and try again.
          </RNText>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton} disabled={isRefetching}>
            {isRefetching ? (
              <ActivityIndicator color={Colors.white} size="small" />
            ) : (
              <RNText variant="header" size="sm" style={{ color: Colors.white }}>
                Try again
              </RNText>
            )}
          </TouchableOpacity>
        </View>
      );
    }

    const caughtUp = filter === "unread" && notifications.length > 0;
    return (
      <View style={styles.centered}>
        <View style={styles.emptyIcon}>
          {caughtUp ? <CheckCheck size={28} color={Colors.green} /> : <BellOff size={28} color={Colors.green} />}
        </View>
        <RNText variant="header" size="lg" style={styles.emptyTitle}>
          {caughtUp ? "You're all caught up" : "No notifications yet"}
        </RNText>
        <RNText variant="medium" size="sm" style={styles.emptyText}>
          {caughtUp
            ? "You've read every notification."
            : "Reminders and updates will show up here."}
        </RNText>
        {caughtUp && (
          <TouchableOpacity onPress={() => setFilter("all")} style={styles.secondaryButton}>
            <RNText variant="header" size="sm" style={{ color: Colors.brown }}>
              View all
            </RNText>
          </TouchableOpacity>
        )}
      </View>
    );
  };

  const renderItem = ({ item }: { item: Notification }) => {
    const expanded = expandedIds.has(item.id);
    return (
      <TouchableOpacity
        activeOpacity={0.75}
        onPress={() => handlePress(item)}
        style={[styles.notificationItem, !item.is_read && styles.unreadItem]}
        accessibilityRole="button"
        accessibilityLabel={`${item.is_read ? "" : "Unread. "}${item.title}. ${item.body}`}
        accessibilityHint={expanded ? "Collapses the notification" : "Expands the notification"}
      >
        <View style={[styles.iconContainer, !item.is_read && styles.unreadIconContainer]}>
          <Bell size={22} color={item.is_read ? "#A09791" : Colors.green} />
        </View>
        <View style={styles.textContainer}>
          <View style={styles.row}>
            <RNText
              variant={item.is_read ? "subtitle" : "header"}
              size="md"
              style={[styles.itemTitle, item.is_read && styles.readTitle]}
              numberOfLines={expanded ? undefined : 1}
            >
              {item.title}
            </RNText>
            <RNText variant="base" size="xs" style={styles.itemTime}>
              {formatTime(item.created_at)}
            </RNText>
          </View>
          {!!item.body && (
            <RNText
              variant="medium"
              size="sm"
              numberOfLines={expanded ? undefined : 2}
              style={styles.itemDescription}
            >
              {item.body}
            </RNText>
          )}
        </View>
        {!item.is_read && <View style={styles.unreadDot} />}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton} accessibilityLabel="Go back">
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl" style={styles.headerTitle}>
          Notifications
        </RNText>
        <TouchableOpacity
          onPress={() => readAllMutation.mutate(unreadIds)}
          disabled={unreadIds.length === 0 || readAllMutation.isPending}
          style={[styles.markAllButton, unreadIds.length === 0 && styles.disabled]}
          accessibilityLabel="Mark all as read"
        >
          {readAllMutation.isPending ? (
            <ActivityIndicator size="small" color={Colors.green} />
          ) : (
            <CheckCheck size={20} color={Colors.brown} />
          )}
        </TouchableOpacity>
      </View>

      <NotificationPermissionBanner />

      {!isLoading && !isError && notifications.length > 0 && (
        <View style={styles.filterRow}>
          {(["all", "unread"] as const).map((key) => {
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
                  {key === "all" ? "All" : "Unread"}
                </RNText>
                {key === "unread" && unreadIds.length > 0 && (
                  <View style={[styles.badge, active && styles.badgeActive]}>
                    <RNText variant="header" size="xs" style={{ color: active ? Colors.brown : Colors.white }}>
                      {unreadIds.length > 99 ? "99+" : unreadIds.length}
                    </RNText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {isLoading ? (
        <NotificationsSkeleton />
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderSectionHeader={({ section }) => (
            <RNText variant="header" size="sm" style={styles.sectionTitle}>
              {section.title}
            </RNText>
          )}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={renderEmpty}
          stickySectionHeadersEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={[styles.scrollContent, sections.length === 0 && { flexGrow: 1 }]}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.green]} tintColor={Colors.green} />
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    borderWidth: 1,
    borderColor: "#E8DDD9",
    padding: 10,
    borderRadius: 20,
    backgroundColor: Colors.white,
  },
  headerTitle: { color: Colors.brown },
  markAllButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E8DDD9",
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: { opacity: 0.4 },
  filterRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 4 },
  filterChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: "#E8DDD9",
  },
  filterChipActive: { backgroundColor: Colors.brown, borderColor: Colors.brown },
  badge: {
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: 10,
    backgroundColor: Colors.orange,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeActive: { backgroundColor: Colors.white },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, paddingBottom: 60 },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 24,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyTitle: { color: Colors.brown, textAlign: "center" },
  emptyText: { color: Colors.primaryText, marginTop: 6, textAlign: "center" },
  retryButton: {
    marginTop: 20,
    minWidth: 120,
    alignItems: "center",
    backgroundColor: Colors.brown,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  secondaryButton: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E8DDD9",
    backgroundColor: Colors.white,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sectionTitle: { color: "#A09791", marginTop: 20, marginBottom: 10, marginLeft: 4, textTransform: "uppercase", letterSpacing: 0.5 },
  notificationItem: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 14,
    flexDirection: "row",
    alignItems: "flex-start",
    borderWidth: 1,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  unreadItem: { borderColor: Colors.green + "55", backgroundColor: "#FBFCF7" },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    backgroundColor: "#F3EFEC",
  },
  unreadIconContainer: { backgroundColor: "#F2F5EB" },
  textContainer: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 2,
  },
  itemTitle: { color: Colors.brown, flex: 1 },
  readTitle: { color: "#6D6661" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
    marginLeft: 8,
    marginTop: 6,
  },
  itemDescription: { color: "#6D6661", lineHeight: 20 },
  itemTime: { color: "#A09791", marginTop: 3 },
});
