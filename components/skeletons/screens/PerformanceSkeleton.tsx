import React from "react";
import { View } from "react-native";
import Skeleton from "../Skeleton";
import SkeletonCircle from "../SkeletonCircle";
import SkeletonText from "../SkeletonText";

const EMOTION_ICON_SIZE = 30;
const STAT_CARDS = [
    { color: "#FF8D28" },
    { color: "#FFCC00" },
    { color: "#34C759" },
];

export default function PerformanceSkeleton() {
    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {/* Bar chart placeholder */}
            <View style={{ marginBottom: 30, alignItems: "center" }}>
                <Skeleton width="100%" height={250} borderRadius={12} />
            </View>

            {/* Top Emotions card */}
            <View
                style={{
                    borderWidth: 1,
                    borderColor: "#EFE6DD",
                    borderRadius: 15,
                    padding: 20,
                    marginVertical: 30,
                    gap: 16,
                }}
            >
                <SkeletonText width={140} size="lg" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <View
                        key={i}
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 10,
                        }}
                    >
                        <SkeletonCircle size={EMOTION_ICON_SIZE} />
                        <SkeletonText width={90} size="md" />
                        <View style={{ flex: 1 }}>
                            <Skeleton
                                width="100%"
                                height={15}
                                borderRadius={8}
                            />
                        </View>
                        <Skeleton width={50} height={26} borderRadius={13} />
                    </View>
                ))}
            </View>

            {/* 3 stat cards */}
            <View style={{ flexDirection: "row", gap: 12 }}>
                {STAT_CARDS.map((c, i) => (
                    <View
                        key={i}
                        style={{
                            backgroundColor: "white",
                            flex: 1,
                            padding: 16,
                            borderRadius: 30,
                            gap: 8,
                        }}
                    >
                        <SkeletonCircle size={40} />
                        <SkeletonText width="70%" size="md" />
                        <SkeletonText width="50%" size="lg" />
                    </View>
                ))}
            </View>
        </View>
    );
}