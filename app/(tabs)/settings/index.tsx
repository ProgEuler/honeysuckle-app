import Edit from "@/assets/svgs/edit.svg";
import Feedback from "@/assets/svgs/feedback.svg";
import Logout from "@/assets/svgs/logout.svg";
import Next from "@/assets/svgs/next.svg";
import Notification from "@/assets/svgs/notification.svg";
import Share from "@/assets/svgs/share.svg";
import User from "@/assets/svgs/user.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { router } from "expo-router";
import {
    HelpCircle,
    MoreVertical,
    ShieldCheck,
    Smile,
} from "lucide-react-native";
import React, { useState } from "react";
import {
    Dimensions,
    Image,
    ScrollView,
    StyleSheet,
    Switch,
    TouchableOpacity,
    View,
} from "react-native";

const { width } = Dimensions.get("window");

const Index = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

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
    <>
      <View style={styles.headerBanner}>
        {/* <SafeAreaView edges={["top"]}>
          <View style={styles.headerTop}>
            <BackButton variant="light" />
            <RNText variant="title" size="xl" style={styles.headerTitle}>
              Settings
            </RNText>
          </View>
        </SafeAreaView> */}
      </View>

      <View style={styles.profileSection}>
        <View style={styles.profileImageWrapper}>
          <View style={styles.profileCircle}>
            <Image
              source={require("@/assets/images/person.jpg")}
              style={styles.profileImage}
            />
          </View>
          <View style={styles.statusBadge}>
            <Smile size={24} color={Colors.white} />
          </View>
          <TouchableOpacity style={styles.editBadge}>
            <Edit width={20} height={20} fill={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={styles.profileInfo}>
          <RNText variant="title" size="3xl" style={styles.profileName}>
            Shinomiya Kaguya
          </RNText>
          <RNText variant="medium" size="md" style={styles.profileEmail}>
            elementary221b@gmail.com
          </RNText>
          <RNText variant="base" size="sm" style={styles.profileLocation}>
            Tokyo, Japan
          </RNText>
        </View>
      </View>
      <ScrollView>
        <View style={styles.settingsContent}>
          <SectionHeader title="General Settings" />
          <View style={styles.card}>
            <SettingItem
              icon={User}
              title="Personal Information"
              onPress={() => router.push("/(tabs)/settings/personalinfo")}
            />
            <SettingItem
              icon={Notification}
              title="Push Notifications"
              rightElement={
                <Switch
                  value={notificationsEnabled}
                  onValueChange={setNotificationsEnabled}
                  trackColor={{ false: "#E0E0E0", true: Colors.green }}
                  thumbColor={Colors.white}
                  ios_backgroundColor="#E0E0E0"
                />
              }
            />
            <SettingItem icon={Share} title="Invite Friends" onPress={() => router.push("/(tabs)/settings/invitefriends")} />
            <SettingItem icon={Feedback} title="Submit Feedback" onPress={() => router.push("/(tabs)/settings/submitfeedback")} />
          </View>

          <SectionHeader title="Security & Privacy" />
          <View style={styles.card}>
            <SettingItem icon={ShieldCheck} title="Security" isLucide onPress={() => router.push("/(tabs)/settings/security")} />
            <SettingItem icon={HelpCircle} title="Help & Support" isLucide onPress={() => router.push("/welcome")} />
          </View>

          <SectionHeader title="Log Out" />
          <View style={styles.card}>
            <SettingItem
              icon={Logout}
              title="Log Out"
              onPress={() => router.push("/auth")}
            />
          </View>
        </View>
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  headerBanner: {
    height: 220,
    backgroundColor: Colors.brown,
    borderBottomLeftRadius: 200,
    borderBottomRightRadius: 200,
    width: width * 1.3,
    alignSelf: "center",
    marginBottom: -100, // Pull content up to overlap
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 40,
    gap: 15,
    marginTop: 10,
    left: 50,
  },
  headerTitle: {
    color: Colors.white,
  },
  profileSection: {
    alignItems: "center",
    zIndex: 10,
  },
  profileImageWrapper: {
    padding: 4,
    backgroundColor: Colors.background,
    borderRadius: 75,
    marginBottom: 15,
  },
  profileCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    overflow: "hidden",
    borderWidth: 4,
    borderColor: Colors.white,
  },
  profileImage: {
    width: "100%",
    height: "100%",
  },
  statusBadge: {
    position: "absolute",
    left: -20,
    bottom: 30,
    backgroundColor: Colors.green,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  editBadge: {
    position: "absolute",
    right: -20,
    bottom: 30,
    backgroundColor: Colors.orange,
    width: 54,
    height: 54,
    borderRadius: 27,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileInfo: {
    alignItems: "center",
    marginTop: 10,
    gap: 4,
    marginBottom: 20,
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
  settingsContent: {
    //  marginTop: 20,
    paddingHorizontal: 20,
    marginBottom: 40,
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
});

export default Index;
