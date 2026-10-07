import React from "react";
import { View } from "react-native";
import Skeleton from "../Skeleton";
import SkeletonCircle from "../SkeletonCircle";
import SkeletonText from "../SkeletonText";

const ICON_BOX_SIZE = 52;

function SectionSkeleton() {
    return (
        <View style={{ paddingHorizontal: 16, marginBottom: 20 }}>
            {/* Section label */}
            <View style={{ marginBottom: 12 }}>
                <SkeletonText width={80} size="md" />
            </View>

            {/* 3 notification items */}
            <View style={{ gap: 10 }}>
                {Array.from({ length: 3 }).map((_, i) => (
                    <View
                        key={i}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 24,
                            padding: 16,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 12,
                        }}
                    >
                        <Skeleton width={ICON_BOX_SIZE} height={ICON_BOX_SIZE} borderRadius={16} />
                        <View style={{ flex: 1, gap: 6 }}>
                            <View
                                style={{
                                    flexDirection: "row",
                                    alignItems: "center",
                                    gap: 8,
                                }}
                            >
                                <SkeletonText width="55%" size="md" />
                                <SkeletonCircle size={8} />
                            </View>
                            <SkeletonText width="90%" size="sm" />
                            <SkeletonText width="70%" size="sm" />
                            <SkeletonText width={50} size="sm" />
                        </View>
                    </View>
                ))}
            </View>
        </View>
    );
}

export default function NotificationsSkeleton() {
    return (
        <View style={{ paddingTop: 16 }}>
            <SectionSkeleton />
            <SectionSkeleton />
        </View>
    );
}