import Analysis from "@/assets/svgs/analysis.svg";
import Clock from "@/assets/svgs/clock.svg";
import Next from "@/assets/svgs/next.svg";
import Notification from "@/assets/svgs/notification.svg";
import Chat from "@/assets/svgs/xchat.svg";
import { RNText } from "@/components/ui/input";
import { Colors } from "@/constants/color";
import { router } from "expo-router";
import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import {
    SafeAreaView,
    useSafeAreaInsets,
} from "react-native-safe-area-context";

const HomeScreen = () => {
    return (
        <View style={styles.screen}>
            <KeyboardAwareScrollView
                style={styles.scroll}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                bottomOffset={24}
                showsVerticalScrollIndicator={false}
                stickyHeaderIndices={[0]}
            >
                <View style={styles.stickyHeaderContainer}>
                    <SafeAreaView edges={["top"]}>
                        <View style={styles.headerTopRow}>
                            <View style={styles.dateWrap}>
                                <RNText variant="header" size="lg">
                                    Tue, Nov 27
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
                            >
                                <View style={styles.notificationButton}>
                                    <Notification />
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.profileCollapseWrap}>
                            <View style={styles.profileRow}>
                                <View style={styles.profileImageFrame}>
                                    <Image
                                        source={require("@/assets/images/person.jpg")}
                                        style={styles.profileImage}
                                    />
                                </View>

                                <View style={styles.profileTextWrap}>
                                    <RNText
                                        variant="header"
                                        size="2xl"
                                        style={styles.welcomeText}
                                    >
                                        Welcome back, Selena 👋
                                    </RNText>
                                    <View style={styles.subtitleRow}>
                                        <RNText
                                            variant="subtitle"
                                            size="md"
                                            style={styles.subtitleText}
                                        >
                                            Let’s make today better than yesterday.
                                        </RNText>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </SafeAreaView>
                </View>

                <View style={styles.listWrap}>
                    <RNText variant="title" size="xl">
                        Mental Health Metrics
                    </RNText>

                    <TouchableOpacity
                        onPress={() => router.push("/(tabs)/dailycheck")}
                        style={styles.metricCard}
                    >
                        <View style={styles.iconBubbleGreen}>
                            <Clock />
                        </View>
                        <View style={styles.metricTextWrap}>
                            <RNText variant="title" size="lg">
                                Start Daily Check-In
                            </RNText>
                            <RNText variant="medium" size="md">
                                Take a moment to assess your mood.
                            </RNText>
                        </View>
                        <View>
                            <Next />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/(tabs)/analytics")}
                        style={styles.metricCard}
                    >
                        <View style={styles.iconBubbleOrange}>
                            <Analysis />
                        </View>
                        <View style={styles.metricTextWrap}>
                            <RNText variant="title" size="lg">
                                View Mood Insights
                            </RNText>
                            <RNText variant="medium" size="md">
                                Insightful graphs and mood analytics.
                            </RNText>
                        </View>
                        <View>
                            <Next />
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={() => router.push("/chatpages")}
                        style={styles.metricCard}
                    >
                        <View style={styles.iconBubblePurple}>
                            <Chat />
                        </View>
                        <View style={styles.metricTextWrap}>
                            <RNText variant="title" size="lg">
                                Chat with AI
                            </RNText>
                            <RNText variant="medium" size="md">
                                Get emotional support and guidance.
                            </RNText>
                        </View>
                        <View>
                            <Next />
                        </View>
                    </TouchableOpacity>

                    <View style={styles.statsCard}>
                        <View style={styles.statsBlock}>
                            <RNText variant="header" size="lg">
                                Current Steak
                            </RNText>
                            <RNText variant="medium" size="lg">
                                7 Days 🔥
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
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: Colors.background,
    },
    stickyHeaderContainer: {
        backgroundColor: Colors.white,
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 3,
        paddingBottom: 16,
        zIndex: 10,
    },
    headerTopRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingHorizontal: 20,
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
        padding: 12,
        borderRadius: 30,
        alignSelf: "flex-end",
    },
    profileRow: {
        flexDirection: "row",
        width: "90%",
        marginTop: 20,
        marginHorizontal: "auto",
    },
    profileCollapseWrap: {
        width: "100%",
        overflow: "hidden",
    },
    profileImageFrame: {
        borderWidth: 1,
        borderColor: Colors.green,
        borderRadius: 150,
        overflow: "hidden",
        alignSelf: "center",
    },
    profileImage: {
        height: 80,
        width: 80,
        overflow: "hidden",
    },
    profileTextWrap: {
        gap: 5,
        width: "70%",
        marginHorizontal: "auto",
    },
    welcomeText: {
        color: Colors.brown,
    },
    subtitleRow: {
        flexDirection: "row",
        gap: 5,
        justifyContent: "center",
        alignItems: "center",
    },
    subtitleText: {
        color: Colors.orange,
    },
    scroll: {
        flex: 1,
    },
    scrollContent: {},
    listWrap: {
        marginTop: 20,
        width: "90%",
        marginHorizontal: "auto",
        gap: 10,
        paddingBottom: 180,
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
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 2,
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
        width: "70%",
        marginHorizontal: "auto",
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
        shadowOpacity: 0.05,
        shadowRadius: 1,
        elevation: 2,
    },
    statsBlock: {
        gap: 10,
    },
});

export default HomeScreen;
