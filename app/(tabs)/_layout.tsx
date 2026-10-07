import { router, withLayoutContext } from "expo-router";
import type { TabNavigationState } from "@react-navigation/native";
import {
    createNativeBottomTabNavigator,
    type NativeBottomTabNavigationEventMap,
    type NativeBottomTabNavigationOptions,
} from "@bottom-tabs/react-navigation";

const { Navigator } = createNativeBottomTabNavigator();

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
                    tabBarIcon: () => ({ sfSymbol: "house.fill" }),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
            <Tabs.Screen
                name="dailycheck"
                options={{
                    title: "Daily Check",
                    tabBarIcon: () => ({ sfSymbol: "checkmark.circle.fill" }),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
            <Tabs.Screen
                name="chat"
                listeners={chatScreenListeners}
                options={{
                    title: "Chat",
                    tabBarIcon: () => ({
                        sfSymbol: "bubble.left.and.bubble.right.fill",
                    }),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
            <Tabs.Screen
                name="analytics"
                options={{
                    title: "Analytics",
                    tabBarIcon: () => ({ sfSymbol: "chart.bar.fill" }),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
            <Tabs.Screen
                name="settings"
                options={{
                    title: "Settings",
                    tabBarIcon: () => ({ sfSymbol: "gearshape.fill" }),
                    tabBarActiveTintColor: "#4B3425",
                }}
            />
        </Tabs>
    );
}