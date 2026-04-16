import Back from "@/assets/svgs/back.svg";
import Bell from "@/assets/svgs/notification.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { notificationsQueryKey, useNotificationsQuery } from "@/hooks/useNotificationsQuery";
import { markNotificationRead, type Notification, type NotificationsResponse } from "@/lib/api/notifications";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { ActivityIndicator, RefreshControl, ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const groupByDate = (notifications: Notification[]) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const groups: Record<string, Notification[]> = {};

  for (const n of notifications) {
    const date = new Date(n.created_at);
    date.setHours(0, 0, 0, 0);

    let label: string;
    if (date.getTime() === today.getTime()) {
      label = "Today";
    } else if (date.getTime() === yesterday.getTime()) {
      label = "Yesterday";
    } else {
      label = date.toLocaleDateString("en-US", { month: "long", day: "numeric" });
    }

    if (!groups[label]) groups[label] = [];
    groups[label].push(n);
  }

  return groups;
};

const formatTime = (iso: string) => {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
};

export default function NotificationsScreen() {
  const { data, isLoading, isError, refetch, isRefetching } = useNotificationsQuery();
  const queryClient = useQueryClient();

  const readMutation = useMutation({
    mutationFn: markNotificationRead,
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: notificationsQueryKey });
      const previous = queryClient.getQueryData<NotificationsResponse>(notificationsQueryKey);
      queryClient.setQueryData<NotificationsResponse>(notificationsQueryKey, (old) => {
        if (!old) return old;
        return {
          ...old,
          results: old.results.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
        };
      });
      return { previous };
    },
    onError: (_err, _id, context) => {
      queryClient.setQueryData(notificationsQueryKey, context?.previous);
    },
  });

  const notifications = (data?.results ?? []).filter((n) => n.title || n.body);
  const grouped = groupByDate(notifications);
  const sections = Object.entries(grouped);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Back />
        </TouchableOpacity>
        <RNText variant="title" size="xl" style={styles.headerTitle}>
          Notifications
        </RNText>
        <View style={styles.headerRightPlaceholder} />
      </View>

      {isLoading ? (
        <View style={styles.centered}>
          <ActivityIndicator color={Colors.green} size="large" />
        </View>
      ) : isError ? (
        <View style={styles.centered}>
          <RNText variant="medium" size="md" style={styles.emptyText}>
            Failed to load notifications.
          </RNText>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <RNText variant="header" size="sm" style={{ color: Colors.white }}>
              Retry
            </RNText>
          </TouchableOpacity>
        </View>
      ) : sections.length === 0 ? (
        <View style={styles.centered}>
          <Bell width={48} height={48} />
          <RNText variant="medium" size="md" style={styles.emptyText}>
            No notifications yet.
          </RNText>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          refreshControl={
            <RefreshControl refreshing={isRefetching} onRefresh={refetch} colors={[Colors.green]} tintColor={Colors.green} />
          }
        >
          {sections.map(([label, items]) => (
            <View key={label} style={styles.section}>
              <RNText variant="header" size="md" style={styles.sectionTitle}>
                {label}
              </RNText>
              <View style={styles.notificationList}>
                {items.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.75}
                    onPress={() => {
                      if (!item.is_read) readMutation.mutate(item.id);
                    }}
                    style={[styles.notificationItem, !item.is_read && styles.unreadItem]}
                  >
                    <View style={styles.iconContainer}>
                      <Bell width={24} height={24} />
                    </View>
                    <View style={styles.textContainer}>
                      <View style={styles.row}>
                        <RNText variant="header" size="md" style={styles.itemTitle} numberOfLines={1}>
                          {item.title}
                        </RNText>
                        {!item.is_read && <View style={styles.unreadDot} />}
                      </View>
                      {!!item.body && (
                        <RNText variant="medium" size="sm" numberOfLines={2} style={styles.itemDescription}>
                          {item.body}
                        </RNText>
                      )}
                      <RNText variant="base" size="xs" style={styles.itemTime}>
                        {formatTime(item.created_at)}
                      </RNText>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
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
  headerRightPlaceholder: { width: 44 },
  scrollContent: { paddingHorizontal: 20, paddingBottom: 40 },
  centered: { flex: 1, alignItems: "center", justifyContent: "center", gap: 12 },
  emptyText: { color: "#6D6661", marginTop: 8 },
  retryButton: {
    backgroundColor: Colors.brown,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  section: { marginTop: 24 },
  sectionTitle: { color: "#6D6661", marginBottom: 12, marginLeft: 4 },
  notificationList: { gap: 12 },
  notificationItem: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  unreadItem: { borderColor: Colors.green + "40", borderWidth: 1 },
  iconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
    backgroundColor: "#F2F5EB",
  },
  textContainer: { flex: 1 },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  itemTitle: { color: Colors.brown, flex: 1 },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
    marginLeft: 8,
  },
  itemDescription: { color: "#6D6661", marginBottom: 6, lineHeight: 18 },
  itemTime: { color: "#A09791" },
});
