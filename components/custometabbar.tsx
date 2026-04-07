import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AnalyticsIcon from "./icons/analyticsicon";
import ChatIcon from "./icons/chaticon";
import CheckIcon from "./icons/dailycheck";
import HomeIcon from "./icons/homeicon";
import SettingsIcon from "./icons/settingsicon";

export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
    const { bottom } = useSafeAreaInsets();
    // Map route names to SVG components
    const icons: Record<
        string,
        React.FC<{ width: number; height: number; color: string }>
    > = {
        home: HomeIcon,
        dailycheck: CheckIcon,
        chat: ChatIcon,
        analytics: AnalyticsIcon,
        settings: SettingsIcon,
    };

    const order = ["home", "dailycheck", "chat", "analytics", "settings"];

    return (
        <View style={[styles.tabBar, { bottom: Math.max(bottom, 10) + 10 }]}>
            {order.map((name, index) => {
                const route = state.routes.find((r) => r.name === name);
                if (!route) return null;

                const isFocused = state.index === state.routes.indexOf(route);
                const Icon = icons[name];

                const onPress = () => {
                    console.log(`Tab ${name} pressed`);
                    if (route.name === "chat") {
                        return router.push("/chatpages");
                    }
                    const event = navigation.emit({
                        type: "tabPress",
                        target: route.key,
                        canPreventDefault: true,
                    });
                    if (!isFocused && !event.defaultPrevented) {
                        navigation.navigate(route.name);
                    }
                };

                return (
                    <TouchableOpacity
                        key={route.key}
                        onPress={onPress}
                        style={[styles.tabItem, isFocused && styles.tabItemActive]}
                    >
                        <Icon
                            width={28}
                            height={28}
                            color={isFocused ? "#4B3425" : "#D5C2B9"}
                        />
                    </TouchableOpacity>
                );
            })}
        </View>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        position: "absolute",
        left: 16,
        right: 16,
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 999,
        backgroundColor: "white",
        borderWidth: 1,
        borderColor: "rgba(75, 52, 37, 0.1)",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 12,
        elevation: 10,
    },
    tabItem: {
        alignItems: "center",
        justifyContent: "center",
        padding: 12,
        borderRadius: 50,
    },
    tabItemActive: {
        backgroundColor: "rgba(247, 244, 242, 0.95)",
    },
});
