import React from "react";
import { View } from "react-native";
import Skeleton from "../Skeleton";
import SkeletonCircle from "../SkeletonCircle";
import SkeletonText from "../SkeletonText";

const DOT_SIZE = 12;

export default function JournalHistorySkeleton() {
    return (
        <View style={{ paddingHorizontal: 16, paddingTop: 16, gap: 14 }}>
            {Array.from({ length: 5 }).map((_, i) => (
                <View
                    key={i}
                    style={{
                        backgroundColor: "white",
                        borderRadius: 20,
                        paddingHorizontal: 18,
                        paddingVertical: 16,
                        gap: 10,
                    }}
                >
                    {/* Header row: dot + assessment + score pill + date */}
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <SkeletonCircle size={DOT_SIZE} />
                            <SkeletonText width={90} size="md" />
                        </View>
                        <View
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 8,
                            }}
                        >
                            <Skeleton width={70} height={24} borderRadius={12} />
                            <SkeletonText width={70} size="sm" />
                        </View>
                    </View>

                    {/* Journal text lines */}
                    <View style={{ gap: 6, marginTop: 4 }}>
                        <SkeletonText width="92%" size="md" />
                        <SkeletonText width="75%" size="md" />
                    </View>

                    {/* Tag pills */}
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 6,
                            marginTop: 6,
                        }}
                    >
                        <Skeleton width={60} height={26} borderRadius={13} />
                        <Skeleton width={75} height={26} borderRadius={13} />
                    </View>
                </View>
            ))}
        </View>
    );
}