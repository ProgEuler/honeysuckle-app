import React from "react";
import { StyleSheet, View } from "react-native";
import Skeleton from "../Skeleton";
import SkeletonCircle from "../SkeletonCircle";
import SkeletonText from "../SkeletonText";

const AVATAR_SIZE = 100;
const SETTING_ICON_SIZE = 44;

function SettingRowSkeleton() {
    return (
        <View
            style={{
                flexDirection: "row",
                alignItems: "center",
                padding: 14,
                gap: 12,
            }}
        >
            <Skeleton
                width={SETTING_ICON_SIZE}
                height={SETTING_ICON_SIZE}
                borderRadius={22}
            />
            <View style={{ flex: 1 }}>
                <SkeletonText width="55%" size="md" />
            </View>
            <Skeleton width={20} height={20} borderRadius={4} />
        </View>
    );
}

function SectionSkeleton({ count = 3 }: { count?: number }) {
    return (
        <View
            style={{
                backgroundColor: "white",
                borderRadius: 24,
                paddingHorizontal: 8,
                marginBottom: 16,
                overflow: "hidden",
            }}
        >
            {Array.from({ length: count }).map((_, i) => (
                <View key={i}>
                    <SettingRowSkeleton />
                    {i < count - 1 && (
                        <View
                            style={{
                                height: StyleSheet.hairlineWidth,
                                backgroundColor: "#F0EBE7",
                                marginHorizontal: 14,
                            }}
                        />
                    )}
                </View>
            ))}
        </View>
    );
}

export default function SettingsSkeleton() {
    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {/* Banner block */}
            <Skeleton
                width="100%"
                height={140}
                borderRadius={24}
                style={{ marginBottom: 24 }}
            />

            {/* Avatar + name/email block */}
            <View
                style={{
                    alignItems: "center",
                    marginBottom: 30,
                    marginTop: -50,
                }}
            >
                <SkeletonCircle size={AVATAR_SIZE} />
                <View style={{ alignItems: "center", gap: 8, marginTop: 14 }}>
                    <SkeletonText width={180} size="lg" />
                    <SkeletonText width={220} size="sm" />
                </View>
            </View>

            {/* Section cards */}
            <View style={{ marginTop: 10 }}>
                <SectionSkeleton count={3} />
                <SectionSkeleton count={2} />
                <SectionSkeleton count={1} />
            </View>
        </View>
    );
}