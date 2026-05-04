import Analysis from "@/assets/svgs/analysis.svg";
import Clock from "@/assets/svgs/clock.svg";
import Next from "@/assets/svgs/next.svg";
import Notification from "@/assets/svgs/notification.svg";
import Chat from "@/assets/svgs/xchat.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useMeQuery } from "@/hooks/useMeQuery";
import { useNotificationsQuery } from "@/hooks/useNotificationsQuery";
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
import {
  Animated,
  Easing,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);
const SCROLL_DISTANCE = 120;
const HEADER_EXPANDED_OFFSET = 208;
const HEADER_COLLAPSED_OFFSET = 92;

const PROFILE_IMAGE_FALLBACK = require("@/assets/images/avatar-fallback.png");

const getEntranceStyle = (animation: Animated.Value) => ({
  opacity: animation,
  transform: [
    {
      translateY: animation.interpolate({
        inputRange: [0, 1],
        outputRange: [20, 0],
        extrapolate: "clamp",
      }),
    },
  ],
});

const HomeScreen = () => {
  const { top, bottom } = useSafeAreaInsets();
  const { data: me, refetch, isRefetching } = useMeQuery();
  const { data: notificationsData } = useNotificationsQuery();
  const unreadCount = (notificationsData?.results ?? []).filter(
    (n: { is_read: boolean }) => !n.is_read,
  ).length;
  const scrollY = useRef(new Animated.Value(0)).current;
  const cardAnimations = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ] as const).current;

  const todayLabel = useMemo(
    () =>
      new Date().toLocaleDateString("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }),
    [],
  );

  const displayName = me?.name?.trim() || "Friend";
  const firstName = displayName.split(" ")[0] || displayName;
  const subtitleText =
    me?.bio?.trim() || "Let's make today better than yesterday.";
  const profileImageSource = me?.image
    ? { uri: me.image }
    : PROFILE_IMAGE_FALLBACK;

  useEffect(() => {
    const entranceAnimation = Animated.stagger(
      85,
      cardAnimations.map((animation) =>
        Animated.timing(animation, {
          toValue: 1,
          duration: 420,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ),
    );

    entranceAnimation.start();

    return () => {
      entranceAnimation.stop();
    };
  }, [cardAnimations]);

  const headerExpandedHeight = top + HEADER_EXPANDED_OFFSET;
  const headerCollapsedHeight = top + HEADER_COLLAPSED_OFFSET;

  const headerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [headerExpandedHeight, headerCollapsedHeight],
    extrapolate: "clamp",
  });

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false },
  );

  // Profile section: fades out and slides up as user scrolls
  const profileOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE * 0.65],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  const profileTranslateY = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [0, -20],
    extrapolate: "clamp",
  });

  const profileScale = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [1, 0.96],
    extrapolate: "clamp",
  });

  // Collapsed header: greeting fades in as profile fades out
  const collapsedOpacity = scrollY.interpolate({
    inputRange: [SCROLL_DISTANCE * 0.5, SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });

  const collapsedTranslateY = scrollY.interpolate({
    inputRange: [SCROLL_DISTANCE * 0.5, SCROLL_DISTANCE],
    outputRange: [8, 0],
    extrapolate: "clamp",
  });

  return (
    <View style={styles.screen}>
      <Animated.View
        style={[
          styles.headerShell,
          {
            height: headerHeight,
            paddingTop: top + 8,
          },
        ]}
      >
        <View style={styles.headerTopRow}>
          <View style={styles.dateWrap}>
            <RNText variant="header" size="lg">
              {todayLabel}
            </RNText>
          </View>

          <View style={styles.logoWrap}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push("/notifications")}
            style={styles.notificationButtonWrap}
            activeOpacity={0.85}
          >
            <View style={styles.notificationButton}>
              <Notification />
              {unreadCount > 0 && (
                <View style={styles.badge}>
                  <RNText variant="header" size="xs" style={styles.badgeText}>
                    {unreadCount > 99 ? "99+" : unreadCount}
                  </RNText>
                </View>
              )}
            </View>
          </TouchableOpacity>
        </View>

        <Animated.View
          style={[
            styles.profileCollapseWrap,
            {
              opacity: profileOpacity,
              transform: [
                { translateY: profileTranslateY },
                { scale: profileScale },
              ],
            },
          ]}
        >
          <View style={styles.profileRow}>
            <View style={styles.profileImageFrame}>
              <Image source={profileImageSource} style={styles.profileImage} />
            </View>

            <View style={styles.profileTextWrap}>
              <RNText variant="header" size="xl" style={styles.welcomeText}>
                Welcome back, {firstName} 👋
              </RNText>
              <View style={styles.subtitleRow}>
                <RNText
                  variant="subtitle"
                  size="md"
                  style={styles.subtitleText}
                >
                  {subtitleText}
                </RNText>
              </View>
            </View>
          </View>
        </Animated.View>
      </Animated.View>

      <AnimatedScrollView
        style={styles.scroll}
        contentContainerStyle={[
          styles.scrollContent,
          {
            paddingTop: headerExpandedHeight + 18,
            paddingBottom: bottom + 140,
          },
        ]}
        onScroll={onScroll}
        keyboardShouldPersistTaps="handled"
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="never"
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.green]}
            tintColor={Colors.green}
          />
        }
      >
        <View style={styles.listWrap}>
          <RNText variant="title" size="xl">
            Mental Health Metrics
          </RNText>

          <Animated.View style={getEntranceStyle(cardAnimations[0])}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/dailycheck")}
              style={styles.metricCard}
              activeOpacity={0.85}
            >
              <View style={styles.iconBubbleGreen}>
                <Clock />
              </View>
              <View style={styles.metricTextWrap}>
                <RNText variant="title" size="lg">
                  Start Daily Check-In
                </RNText>
                <RNText variant="medium" size="sm">
                  Take a moment to assess your mood.
                </RNText>
              </View>
              <View>
                <Next />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={getEntranceStyle(cardAnimations[1])}>
            <TouchableOpacity
              onPress={() => router.push("/(tabs)/analytics")}
              style={styles.metricCard}
              activeOpacity={0.85}
            >
              <View style={styles.iconBubbleOrange}>
                <Analysis />
              </View>
              <View style={styles.metricTextWrap}>
                <RNText variant="title" size="lg">
                  View Mood Insights
                </RNText>
                <RNText variant="medium" size="sm">
                  Insightful graphs and mood analytics.
                </RNText>
              </View>
              <View>
                <Next />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={getEntranceStyle(cardAnimations[2])}>
            <TouchableOpacity
              onPress={() => router.push("/chatpages")}
              style={styles.metricCard}
              activeOpacity={0.85}
            >
              <View style={styles.iconBubblePurple}>
                <Chat />
              </View>
              <View style={styles.metricTextWrap}>
                <RNText variant="title" size="lg">
                  Chat with AI
                </RNText>
                <RNText variant="medium" size="sm">
                  Get emotional support and guidance.
                </RNText>
              </View>
              <View>
                <Next />
              </View>
            </TouchableOpacity>
          </Animated.View>

          <Animated.View style={getEntranceStyle(cardAnimations[3])}>
            <View style={styles.statsCard}>
              <View style={styles.statsBlock}>
                <RNText variant="header" size="lg">
                  Current Streak
                </RNText>
                <RNText variant="medium" size="lg">
                  {me?.streak || 0} Days 🔥
                </RNText>
              </View>

              <View style={styles.statsBlock}>
                <RNText variant="header" size="lg">
                  Total Check-ins
                </RNText>
                <RNText variant="medium" size="lg">
                  24
                </RNText>
              </View>
            </View>
          </Animated.View>
        </View>
      </AnimatedScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  headerShell: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 20,
    overflow: "hidden",
  },
  headerTopRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    alignItems: "center",
  },
  dateWrap: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
  },
  logoWrap: {
    flex: 1,
    alignItems: "center",
  },
  logo: {
    height: 60,
    width: 60,
  },
  notificationButtonWrap: {
    flex: 1,
    justifyContent: "center",
  },
  notificationButton: {
    borderWidth: 1,
    borderColor: Colors.brown,
    padding: 10,
    borderRadius: 30,
    alignSelf: "flex-end",
  },
  badge: {
    position: "absolute",
    top: -4,
    right: -4,
    backgroundColor: Colors.orange,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  badgeText: {
    color: Colors.white,
    fontSize: 10,
    lineHeight: 12,
  },
  // FIX: was absolute-positioned but had no bottom anchor — now anchored properly
  collapsedHeader: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 14,
    alignItems: "center",
  },
  collapsedTitle: {
    color: Colors.brown,
  },
  profileRow: {
    flexDirection: "row",
    width: "90%",
    marginTop: 20,
    marginHorizontal: "auto",
    alignItems: "center",
  },
  profileCollapseWrap: {
    width: "100%",
    overflow: "hidden",
    marginTop: 8,
  },
  profileImageFrame: {
    borderWidth: 1,
    borderColor: Colors.green,
    borderRadius: 150,
    overflow: "hidden",
    alignSelf: "center",
  },
  profileImage: {
    height: 72,
    width: 72,
  },
  // FIX: replaced marginHorizontal: "auto" (unreliable in RN) with flex + paddingLeft
  profileTextWrap: {
    flex: 1,
    gap: 5,
    paddingLeft: 14,
  },
  welcomeText: {
    color: Colors.brown,
  },
  subtitleRow: {
    flexDirection: "row",
    gap: 5,
    alignItems: "center",
  },
  subtitleText: {
    color: Colors.orange,
    fontSize: 14,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 0,
  },
  listWrap: {
    marginTop: 12,
    width: "90%",
    marginHorizontal: "auto",
    gap: 12,
  },
  metricCard: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  iconBubbleGreen: {
    backgroundColor: "#F2F5EB",
    padding: 12,
    borderRadius: 16,
  },
  iconBubbleOrange: {
    backgroundColor: "#FFF0EB",
    padding: 12,
    borderRadius: 16,
  },
  iconBubblePurple: {
    backgroundColor: "#EDEBFF",
    padding: 12,
    borderRadius: 16,
  },
  metricTextWrap: {
    flex: 1,
    paddingHorizontal: 14,
    alignSelf: "flex-start",
  },
  statsCard: {
    backgroundColor: Colors.white,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 30,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 3,
  },
  statsBlock: {
    gap: 10,
  },
});

export default HomeScreen;
