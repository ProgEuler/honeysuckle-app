import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { WelcomeTabParamList } from "@/constants/onboarding";
import { ONBOARDING_STEPS } from "@/constants/onboardingSteps";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { router } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { ArrowRight, Check } from "lucide-react-native";
import { useState } from "react";
import {
  Dimensions,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import StepFourScreen from "./_screens/StepFourScreen";
import StepOneScreen from "./_screens/StepOneScreen";
import StepThreeScreen from "./_screens/StepThreeScreen";
import StepTwoScreen from "./_screens/StepTwoScreen";

const { width } = Dimensions.get("window");
const TopTab = createMaterialTopTabNavigator<WelcomeTabParamList>();

export default function WelcomeScreen() {
  const [showOnboarding, setShowOnboarding] = useState(false);

  if (!showOnboarding) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        <View style={styles.welcomeContent}>
          <View style={styles.welcomeHeader}>
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.logo}
            />
            <RNText variant="title" size="3xl" style={styles.welcomeTitle}>
              Welcome to Honeysuckle Trail
            </RNText>
            <View style={styles.subtitleWrapper}>
              <RNText variant="medium" size="md" style={styles.welcomeSubtitle}>
                A mindful mental health tool by{"\n"}
                  <RNText variant="header" size="md">
                    Honeysuckle Co.{" "}
                  </RNText>
                  <View style={styles.checkBadge}>
                    <Check color={Colors.white} size={10} strokeWidth={4} />
                </View>
              </RNText>
            </View>
          </View>

          <View style={styles.welcomeImageContainer}>
            <View style={styles.circleBackground} />
            <Image
              source={require("@/assets/images/logo.png")}
              style={styles.welcomeIllustration}
              resizeMode="contain"
            />
          </View>

          <View style={styles.welcomeFooter}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.getStartedButton}
              onPress={() => setShowOnboarding(true)}
            >
              <RNText variant="header" size="lg" style={styles.getStartedText}>
                Get Started
              </RNText>
              <ArrowRight
                color={Colors.white}
                size={20}
                style={{ marginLeft: 8 }}
              />
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.6}
              style={styles.signInLink}
              onPress={() => router.push("/auth")}
            >
              <RNText variant="medium" size="md" style={styles.signInText}>
                Already have an account?{" "}
                <RNText
                  variant="header"
                  size="md"
                  style={{ color: Colors.orange }}
                >
                  Sign In
                </RNText>
              </RNText>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={styles.tabsRoot}>
      <StatusBar style="light" />
      <TopTab.Navigator
        initialRouteName="StepOne"
        tabBar={() => null}
        screenOptions={{
          swipeEnabled: true,
          animationEnabled: true,
          tabBarStyle: styles.tabBar,
          tabBarIndicatorStyle: styles.tabIndicator,
          tabBarLabelStyle: styles.tabLabel,
          tabBarActiveTintColor: Colors.brown,
          tabBarInactiveTintColor: "rgba(255,255,255,0.7)",
          tabBarPressColor: "transparent",
          lazy: true,
          lazyPreloadDistance: 2,
        }}
      >
        <TopTab.Screen
          name="StepOne"
          component={StepOneScreen}
          options={{ tabBarLabel: ONBOARDING_STEPS[0].tabTitle }}
        />
        <TopTab.Screen
          name="StepTwo"
          component={StepTwoScreen}
          options={{ tabBarLabel: ONBOARDING_STEPS[1].tabTitle }}
        />
        <TopTab.Screen
          name="StepThree"
          component={StepThreeScreen}
          options={{ tabBarLabel: ONBOARDING_STEPS[2].tabTitle }}
        />
        <TopTab.Screen
          name="StepFour"
          component={StepFourScreen}
          options={{ tabBarLabel: ONBOARDING_STEPS[3].tabTitle }}
        />
      </TopTab.Navigator>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  welcomeContent: {
    flex: 1,
    paddingHorizontal: 28,
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  welcomeHeader: {
    alignItems: "center",
    gap: 12,
  },
  logo: {
    width: 64,
    height: 64,
    marginBottom: 8,
    resizeMode: "contain",
  },
  welcomeTitle: {
    textAlign: "center",
    color: "#1C1C1E",
  },
  subtitleWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  welcomeSubtitle: {
    textAlign: "center",
    color: "#6E6E73",
  },
  checkBadge: {
    backgroundColor: "#34C759",
    width: 12,
    height: 12,
    borderRadius: 8,
   //  padding: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  welcomeImageContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width,
  },
  circleBackground: {
    position: "absolute",
    width: width * 0.7,
    height: width * 0.7,
    borderRadius: width * 0.35,
    backgroundColor: "#FFFBE6",
  },
  welcomeIllustration: {
    width: width * 0.65,
    height: width * 0.65,
  },
  welcomeFooter: {
    width: "100%",
    alignItems: "center",
    gap: 16,
  },
  getStartedButton: {
    backgroundColor: Colors.brown,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 100,
    width: "100%",
    shadowColor: Colors.brown,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  getStartedText: {
    color: Colors.white,
    letterSpacing: 0.5,
  },
  signInLink: {
    paddingVertical: 10,
  },
  signInText: {
    color: "#6E6E73",
  },
  tabsRoot: {
    flex: 1,
    backgroundColor: "#000",
  },
  tabBar: {
    position: "absolute",
    top: 56,
    left: 0,
    right: 0,
    backgroundColor: "transparent",
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
    zIndex: 10,
  },
  tabIndicator: {
    backgroundColor: Colors.brown,
    height: 3,
    borderRadius: 3,
    marginHorizontal: 12,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
  },
});
