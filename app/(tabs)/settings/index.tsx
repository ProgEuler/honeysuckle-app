import Edit from "@/assets/svgs/edit.svg";
import Feedback from "@/assets/svgs/feedback.svg";
import Logout from "@/assets/svgs/logout.svg";
import Next from "@/assets/svgs/next.svg";
import Notification from "@/assets/svgs/notification.svg";
import User from "@/assets/svgs/user.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { useMeQuery } from "@/hooks/useMeQuery";
import { updateMe } from "@/lib/api/auth";
import { useAuthStore } from "@/store/useAuthStore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import {
  FileText,
  HelpCircle,
  MoreVertical,
  ShieldCheck,
  Smile,
} from "lucide-react-native";
import { useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toast } from "sonner-native";

const { width } = Dimensions.get("window");
const AnimatedScrollView: any = Animated.createAnimatedComponent(ScrollView);

const PROFILE_IMAGE_SIZE = 100;
const PROFILE_IMAGE_BORDER = 4;
const PROFILE_IMAGE_TOTAL = PROFILE_IMAGE_SIZE + PROFILE_IMAGE_BORDER * 2 + 8; // wrapper padding
const PROFILE_INFO_HEIGHT = 90;
const PROFILE_OVERLAP = 46; // how much avatar overlaps the banner bottom
const SCROLL_DISTANCE = 100;
const PROFILE_IMAGE_FALLBACK = require("@/assets/images/avatar-fallback.png");

const Index = () => {
  const { data: me, refetch, isRefetching } = useMeQuery();
  const clearAuthSession = useAuthStore((state) => state.clearAuthSession);
  const queryClient = useQueryClient();

  const [notifyEnabled, setNotifyEnabled] = useState<boolean>(
    me?.notify ?? false,
  );
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  // Sync once when me loads for the first time
  const syncedRef = useRef(false);
  if (!syncedRef.current && me !== undefined) {
    syncedRef.current = true;
    if (notifyEnabled !== me.notify) setNotifyEnabled(me.notify ?? false);
  }

  const toggleNotifyMutation = useMutation({
    mutationFn: (notify: boolean) => updateMe({ notify }),
    onSuccess: () => {
      toast.success("Notification settings updated");
    },
    onError: () => {
      setNotifyEnabled((prev: boolean) => !prev);
      toast.error("Failed to update notification settings");
    },
  });

  const handleToggleNotify = (val: boolean) => {
    setNotifyEnabled(val);
    toggleNotifyMutation.mutate(val);
  };
  const { top } = useSafeAreaInsets();
  const scrollY = useRef(new Animated.Value(0)).current;

  const handleLogout = () => {
    clearAuthSession();
    queryClient.clear();
    router.replace("/auth");
  };

  const confirmLogout = () => {
    setShowLogoutModal(false);
    handleLogout();
  };
  const displayName = me?.name?.trim() || "User";
  const displayEmail = me?.email || "";
  const displayBio = me?.bio?.trim() || "Your emotional wellness journey";
  const profileImageSource = me?.image
    ? { uri: me.image }
    : PROFILE_IMAGE_FALLBACK;

  const BANNER_EXPANDED = top + 120;
  const BANNER_COLLAPSED = top + 70; // just enough room for name + email

  // Total scroll content offset = bottom of profile section initially
  const SCROLL_PADDING_TOP =
    BANNER_EXPANDED -
    PROFILE_OVERLAP +
    PROFILE_IMAGE_TOTAL +
    PROFILE_INFO_HEIGHT;

  // ── useNativeDriver: false lets us animate height and top ──────────────

  const onScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { y: scrollY } } }],
    { useNativeDriver: false }, // must be false to animate layout props
  );

  // Banner height shrinks from expanded to collapsed
  const bannerHeight = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [BANNER_EXPANDED, BANNER_COLLAPSED],
    extrapolate: "clamp",
  });

  // Avatar section follows the banner's bottom edge
  const profileSectionTop = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE],
    outputRange: [
      BANNER_EXPANDED - PROFILE_OVERLAP,
      BANNER_COLLAPSED - PROFILE_OVERLAP,
    ],
    extrapolate: "clamp",
  });

  // Avatar + info: fade out
  const profileOpacity = scrollY.interpolate({
    inputRange: [0, SCROLL_DISTANCE * 0.75],
    outputRange: [1, 0],
    extrapolate: "clamp",
  });

  // Collapsed name/email inside banner: fade in
  const collapsedOpacity = scrollY.interpolate({
    inputRange: [SCROLL_DISTANCE * 0.4, SCROLL_DISTANCE],
    outputRange: [0, 1],
    extrapolate: "clamp",
  });
  const collapsedTranslateY = scrollY.interpolate({
    inputRange: [SCROLL_DISTANCE * 0.4, SCROLL_DISTANCE],
    outputRange: [8, 0],
    extrapolate: "clamp",
  });

  const SettingItem = ({
    icon: Icon,
    title,
    onPress,
    rightElement,
    showArrow = true,
    isLucide = false,
  }: any) => (
    <TouchableOpacity onPress={onPress} style={styles.settingItem}>
      <View style={styles.settingItemLeft}>
        <View style={styles.iconContainer}>
          {isLucide ? <Icon size={20} color={Colors.brown} /> : <Icon />}
        </View>
        <RNText variant="header" size="md" style={styles.settingItemTitle}>
          {title}
        </RNText>
      </View>
      <View style={styles.settingItemRight}>
        {rightElement ? rightElement : showArrow && <Next />}
      </View>
    </TouchableOpacity>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <View style={styles.sectionHeader}>
      <RNText variant="title" size="lg" style={styles.sectionTitle}>
        {title}
      </RNText>
      <TouchableOpacity>
        <MoreVertical size={20} color={Colors.primaryText} opacity={0.4} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* <StatusBar style="dark" backgroundColor={Colors.brown} /> */}
      {/*  BANNER — animates height, always flush to screen top  */}
      <Animated.View style={[styles.headerBanner, { height: bannerHeight }]}>
        {/* Collapsed name + email — fades in as banner shrinks */}
        <Animated.View
          style={[
            styles.collapsedHeader,
            {
              opacity: collapsedOpacity,
              transform: [{ translateY: collapsedTranslateY }],
            },
          ]}
        >
          <RNText variant="title" size="xl" style={styles.collapsedName}>
            {displayName}
          </RNText>
          <RNText variant="base" size="sm" style={styles.collapsedEmail}>
            {displayEmail}
          </RNText>
        </Animated.View>
      </Animated.View>

      {/* AVATAR SECTION — top follows banner bottom edge  */}
      <Animated.View
        style={[
          styles.profileSection,
          {
            top: profileSectionTop,
            opacity: profileOpacity,
          },
        ]}
      >
        {/* Avatar ring with status + edit badges */}
        <View style={styles.profileImageWrapper}>
          <View style={styles.profileCircle}>
            <Image source={profileImageSource} style={styles.profileImage} />
          </View>
          <View style={styles.statusBadge}>
            <Smile size={20} color={Colors.white} />
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Edit width={18} height={18} fill={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Name / email / location */}
        <View style={styles.profileInfo}>
          <RNText variant="title" size="3xl" style={styles.profileName}>
            {displayName}
          </RNText>
          <RNText variant="medium" size="md" style={styles.profileEmail}>
            {displayEmail}
          </RNText>
          <RNText variant="base" size="sm" style={styles.profileLocation}>
            {displayBio}
          </RNText>
        </View>
      </Animated.View>

      {/* SCROLL CONTENT */}
      <AnimatedScrollView
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={onScroll}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: SCROLL_PADDING_TOP },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={refetch}
            colors={[Colors.green]}
            tintColor={Colors.green}
          />
        }
      >
        <SectionHeader title="General Settings" />
        <View style={styles.card}>
          <SettingItem
            icon={User}
            title="Personal Information"
            onPress={() => router.push("/settings-sub-screens/personalinfo")}
          />
          <SettingItem
            icon={Notification}
            title="Push Notifications"
            rightElement={
              <Switch
                value={notifyEnabled}
                onValueChange={handleToggleNotify}
                trackColor={{ false: "#E0E0E0", true: Colors.green }}
                thumbColor={Colors.white}
                ios_backgroundColor="#E0E0E0"
              />
            }
          />
          {/* <SettingItem
            icon={Share}
            title="Invite Friends"
            onPress={() => router.push("/settings-sub-screens/invitefriends")}
          /> */}
          <SettingItem
            icon={Feedback}
            title="Submit Feedback"
            onPress={() => router.push("/settings-sub-screens/submitfeedback")}
          />
        </View>

        <SectionHeader title="Security & Privacy" />
        <View style={styles.card}>
          <SettingItem
            icon={ShieldCheck}
            title="Security"
            isLucide
            onPress={() => router.push("/settings-sub-screens/security")}
          />
          <SettingItem
            icon={FileText}
            title="Terms & Policy"
            isLucide
            onPress={() => router.push("/settings-sub-screens/termsandpolicy")}
          />
          {false && (
            <SettingItem
              icon={HelpCircle}
              title="Help & Support"
              isLucide
              onPress={() => router.push("/welcome")}
            />
          )}
        </View>

        <SectionHeader title="Log Out" />
        <View style={styles.card}>
          <SettingItem
            icon={Logout}
            title="Log Out"
            onPress={() => setShowLogoutModal(true)}
          />
        </View>
      </AnimatedScrollView>

      {/* Logout confirmation modal */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowLogoutModal(false)}
        >
          <TouchableOpacity activeOpacity={1} style={styles.modalCard}>
            <View style={styles.modalIconWrap}>
              <Logout width={32} height={32} />
            </View>
            <RNText variant="title" size="2xl" style={styles.modalTitle}>
              Log Out?
            </RNText>
            <RNText variant="medium" size="md" style={styles.modalMessage}>
              Are you sure you want to log out of your account?
            </RNText>
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => setShowLogoutModal(false)}
              >
                <RNText variant="header" size="md" style={styles.cancelText}>
                  Cancel
                </RNText>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.logoutButton}
                onPress={confirmLogout}
              >
                <RNText variant="header" size="md" style={styles.logoutText}>
                  Log Out
                </RNText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Banner spans full screen width with rounded bottom corners
  headerBanner: {
    position: "absolute",
    top: 0,
    left: -(width * 0.15),
    width: width * 1.3,
    backgroundColor: Colors.brown,
    borderBottomLeftRadius: 220,
    borderBottomRightRadius: 220,
    zIndex: 20,
    elevation: 20,
    alignItems: "center",
    justifyContent: "flex-end",
    paddingBottom: 14,
  },

  collapsedHeader: {
    alignItems: "center",
    gap: 2,
  },
  collapsedName: {
    color: Colors.white,
  },
  collapsedEmail: {
    color: Colors.white,
    opacity: 0.75,
  },

  // Avatar section — `top` is driven by animated value
  profileSection: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
    zIndex: 30,
    elevation: 30,
  },
  profileImageWrapper: {
    padding: 4,
    backgroundColor: Colors.background,
    borderRadius: 60,
    marginBottom: 10,
  },
  profileCircle: {
    width: PROFILE_IMAGE_SIZE,
    height: PROFILE_IMAGE_SIZE,
    borderRadius: PROFILE_IMAGE_SIZE / 2,
    overflow: "hidden",
    borderWidth: PROFILE_IMAGE_BORDER,
    borderColor: Colors.white,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    left: -18,
    bottom: 22,
    backgroundColor: Colors.green,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    elevation: 3,
  },
  editBadge: {
    position: "absolute",
    right: -18,
    bottom: 22,
    backgroundColor: Colors.orange,
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 3,
    borderColor: Colors.white,
    elevation: 3,
  },
  profileInfo: {
    alignItems: "center",
    gap: 3,
  },
  profileName: {
    color: Colors.brown,
  },
  profileEmail: {
    color: Colors.primaryText,
    opacity: 0.8,
  },
  profileLocation: {
    color: Colors.primaryText,
    opacity: 0.6,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 180,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 12,
  },
  sectionTitle: {
    color: Colors.brown,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 24,
    overflow: "hidden",
    paddingHorizontal: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  settingItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 12,
  },
  settingItemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingItemRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    backgroundColor: Colors.background,
    padding: 10,
    borderRadius: 14,
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
  settingItemTitle: {
    color: Colors.brown,
  },
  // Logout modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  modalCard: {
    width: "100%",
    backgroundColor: Colors.white,
    borderRadius: 28,
    padding: 28,
    alignItems: "center",
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.12,
    shadowRadius: 20,
    elevation: 10,
  },
  modalIconWrap: {
    backgroundColor: Colors.background,
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalTitle: {
    color: Colors.brown,
  },
  modalMessage: {
    color: Colors.primaryText,
    textAlign: "center",
    lineHeight: 24,
    opacity: 0.75,
  },
  modalActions: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
    width: "100%",
  },
  cancelButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    borderWidth: 1.5,
    borderColor: Colors.brown,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelText: {
    color: Colors.brown,
  },
  logoutButton: {
    flex: 1,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.brown,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutText: {
    color: Colors.white,
  },
});

export default Index;
