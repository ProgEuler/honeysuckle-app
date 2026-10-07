import React from "react";
import { View } from "react-native";
import Skeleton from "../Skeleton";
import SkeletonCircle from "../SkeletonCircle";
import SkeletonText from "../SkeletonText";

const AVATAR_SIZE = 120;

export default function PersonalInfoSkeleton() {
    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 16 }}>
            {/* Profile image */}
            <View style={{ alignItems: "center", marginVertical: 16 }}>
                <SkeletonCircle size={AVATAR_SIZE} />
            </View>

            {/* Form fields: 3 text fields */}
            <View style={{ gap: 16, marginBottom: 20 }}>
                {[0, 1].map((i) => (
                    <View key={i} style={{ gap: 8 }}>
                        <SkeletonText width={100} size="sm" />
                        <Skeleton
                            width="100%"
                            height={48}
                            borderRadius={12}
                        />
                    </View>
                ))}

                {/* Gender: 3 pill chips */}
                <View style={{ gap: 8 }}>
                    <SkeletonText width={80} size="sm" />
                    <View
                        style={{
                            flexDirection: "row",
                            gap: 10,
                            marginTop: 4,
                        }}
                    >
                        <Skeleton width={90} height={40} borderRadius={20} />
                        <Skeleton width={90} height={40} borderRadius={20} />
                        <Skeleton width={90} height={40} borderRadius={20} />
                    </View>
                </View>

                {/* Location */}
                <View style={{ gap: 8 }}>
                    <SkeletonText width={80} size="sm" />
                    <Skeleton
                        width="100%"
                        height={48}
                        borderRadius={12}
                    />
                </View>
            </View>

            {/* Additional Information header */}
            <SkeletonText width={200} size="lg" />
            <View style={{ gap: 10, marginTop: 14, marginBottom: 24 }}>
                {[0, 1, 2].map((i) => (
                    <View
                        key={i}
                        style={{
                            backgroundColor: "white",
                            borderRadius: 16,
                            padding: 14,
                            gap: 6,
                        }}
                    >
                        <SkeletonText width={90} size="sm" />
                        <SkeletonText width="60%" size="md" />
                    </View>
                ))}
            </View>

            {/* Submit button */}
            <Skeleton
                width="100%"
                height={56}
                borderRadius={28}
                style={{ marginBottom: 24 }}
            />
        </View>
    );
}