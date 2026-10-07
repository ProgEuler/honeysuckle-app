import React from "react";
import { View } from "react-native";
import Skeleton from "../Skeleton";
import SkeletonCircle from "../SkeletonCircle";
import SkeletonText from "../SkeletonText";

const ICON_PILL_SIZE = 48;

export default function AnalyticsSkeleton() {
    return (
        <View style={{ width: "90%", marginHorizontal: "auto", marginVertical: 30 }}>
            {/* Title block */}
            <View style={{ gap: 10, marginBottom: 20 }}>
                <SkeletonText width={170} size="xl" />
                <SkeletonText width={260} size="md" />
            </View>

            {/* 2x2 stat grid */}
            <View style={{ marginVertical: 20, gap: 20 }}>
                {[0, 1].map((row) => (
                    <View key={row} style={{ flexDirection: "row", gap: 20 }}>
                        {[0, 1].map((col) => (
                            <View
                                key={col}
                                style={{
                                    backgroundColor: "white",
                                    flex: 1,
                                    padding: 20,
                                    borderRadius: 15,
                                    gap: 10,
                                }}
                            >
                                <SkeletonCircle size={ICON_PILL_SIZE} />
                                <SkeletonText width="70%" size="md" />
                                <SkeletonText width="50%" size="xl" />
                                <SkeletonText width="60%" size="sm" />
                            </View>
                        ))}
                    </View>
                ))}
            </View>

            {/* Streak banner */}
            <View
                style={{
                    backgroundColor: "#C9D2AD",
                    padding: 24,
                    borderRadius: 20,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 14,
                    marginBottom: 30,
                }}
            >
                <SkeletonCircle size={56} />
                <View style={{ flex: 1, gap: 8 }}>
                    <SkeletonText width="85%" size="md" />
                    <SkeletonText width="70%" size="sm" />
                </View>
            </View>

            {/* Mood summary block: pie chart + legend */}
            <View style={{ alignItems: "center", paddingVertical: 20 }}>
                <SkeletonText width={160} size="lg" />

                {/* Donut chart placeholder */}
                <View style={{ marginTop: 30, marginBottom: 20 }}>
                    <Skeleton width={300} height={300} borderRadius={150} />
                </View>

                {/* Legend row */}
                <View
                    style={{
                        flexDirection: "row",
                        flexWrap: "wrap",
                        justifyContent: "center",
                        gap: 10,
                        marginTop: 10,
                    }}
                >
                    {[0, 1, 2, 3].map((i) => (
                        <View
                            key={i}
                            style={{
                                backgroundColor: "white",
                                paddingHorizontal: 16,
                                paddingVertical: 12,
                                borderRadius: 30,
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 10,
                            }}
                        >
                            <SkeletonCircle size={24} />
                            <SkeletonText width={60} size="sm" />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}