import { router, withLayoutContext } from "expo-router";
import { Platform, type ImageSourcePropType } from "react-native";
import type { TabNavigationState } from "@react-navigation/native";
import {
    createNativeBottomTabNavigator,
    type NativeBottomTabNavigationEventMap,
    type NativeBottomTabNavigationOptions,
} from "@bottom-tabs/react-navigation";

const { Navigator } = createNativeBottomTabNavigator();

// SF Symbols only exist on iOS; Android needs image files (Lucide icons,
// tinted by the tab bar like the symbols are).
const ANDROID_ICONS = {
    home: require("@/assets/images/tabs/home.png"),
    dailycheck: require("@/assets/images/tabs/dailycheck.png"),
    chat: require("@/assets/images/tabs/chat.png"),
    analytics: require("@/assets/images/tabs/analytics.png"),
    settings: require("@/assets/images/tabs/settings.png"),
};

type TabIcon = ReturnType<NonNullable<NativeBottomTabNavigationOptions["tabBarIcon"]>>;

const tabIcon = (iosIcon: TabIcon, androidIcon: ImageSourcePropType): TabIcon =>
    Platform.OS === "ios" ? iosIcon : androidIcon;

const Tabs = withLayoutContext<
    NativeBottomTabNavigationOptions,
    typeof Navigator,
    TabNavigationState<any>,
    NativeBottomTabNavigationEventMap
>(Navigator);

// The chat tab is a launcher for /chatpages (the actual chat screen).
// We intercept tabPress so the tab doesn't focus on the empty chat screen
// (which would trigger an unhandled GO_BACK from the native bar).
const chatScreenListeners = {
    tabPress: (e: { preventDefault: () => void }) => {
        e.preventDefault();
        router.push("/chatpages");
    },
};

export default function TabsLayout() {
    return (
        <Tabs>
            <Tabs.Screen
                name="home"
                options={{
                    title: "Home",
                    tabBarIcon: () => tabIcon({ sfSymbol: "house.fill" }, ANDROID_ICONS.home),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
            <Tabs.Screen
                name="dailycheck"
                options={{
                    title: "Daily Check",
                    tabBarIcon: () => tabIcon({ sfSymbol: "checkmark.circle.fill" }, ANDROID_ICONS.dailycheck),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
            <Tabs.Screen
                name="chat"
                listeners={chatScreenListeners}
                options={{
                    title: "Chat",
                    tabBarIcon: () => tabIcon({ sfSymbol: "bubble.left.and.bubble.right.fill" }, ANDROID_ICONS.chat),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: "Analytics",
                    tabBarIcon: () => tabIcon({ sfSymbol: "chart.bar.fill" }, ANDROID_ICONS.analytics),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: () => tabIcon({ sfSymbol: "gearshape.fill" }, ANDROID_ICONS.settings),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
        </Tabs>
    );
}