import React from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Skeleton from "../Skeleton";
import SkeletonCircle from "../SkeletonCircle";
import SkeletonText from "../SkeletonText";

const PROFILE_SIZE = 72;
const METRIC_ICON_SIZE = 40;

export default function HomeSkeleton() {
    const { top } = useSafeAreaInsets();

    return (
        <View style={{ flex: 1, paddingTop: top + 8 }}>
            {/* Header: date + logo + bell */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                    paddingHorizontal: 20,
                    marginBottom: 24,
                }}
            >
                <SkeletonText width={110} size="lg" />
                <SkeletonCircle size={36} />
                <SkeletonCircle size={36} />
            </View>

            {/* Profile row: avatar + name/bio */}
            <View
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingHorizontal: 20,
                    marginBottom: 30,
                    gap: 14,
                }}
            >
                <SkeletonCircle size={PROFILE_SIZE} />
                <View style={{ flex: 1, gap: 8 }}>
                    <SkeletonText width="60%" size="lg" />
                    <SkeletonText width="80%" size="sm" />
                </View>
            </View>

            {/* 3 metric cards */}
            <View
                style={{
                    width: "90%",
                    marginHorizontal: "auto",
                    gap: 14,
                    marginBottom: 30,
                }}
            >
                {[0, 1, 2].map((i) => (
                    <View
                        key={i}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 30,
                            padding: 20,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 14,
                        }}
                    >
                        <SkeletonCircle size={METRIC_ICON_SIZE} />
                        <View style={{ flex: 1, gap: 8 }}>
                            <SkeletonText width="50%" size="md" />
                            <SkeletonText width="40%" size="sm" />
                        </View>
                        <Skeleton width={20} height={20} borderRadius={4} />
                    </View>
                ))}
            </View>

            {/* Stats card: 2 side-by-side stat blocks */}
            <View
                style={{
                    backgroundColor: "white",
                    width: "90%",
                    marginHorizontal: "auto",
                    borderRadius: 30,
                    padding: 20,
                    flexDirection: "row",
                    gap: 16,
                }}
            >
                {[0, 1].map((i) => (
                    <View key={i} style={{ flex: 1, gap: 8 }}>
                        <SkeletonText width="70%" size="sm" />
                        <SkeletonText width="50%" size="xl" />
                    </View>
                ))}
            </View>
        </View>
    );
}