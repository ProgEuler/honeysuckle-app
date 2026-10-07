import React from "react";
import { View } from "react-native";
import Skeleton from "../Skeleton";
import SkeletonCircle from "../SkeletonCircle";
import SkeletonText from "../SkeletonText";

const AVATAR_SIZE = 32;

export default function ChatHistorySkeleton() {
    // Alternating bot/user rows: widths and alignment match real messages
    const rows: Array<{
        side: "left" | "right";
        bubbleWidth: `${number}%`;
        lines: number;
    }> = [
        { side: "left", bubbleWidth: "65%", lines: 1 },
        { side: "right", bubbleWidth: "55%", lines: 2 },
        { side: "left", bubbleWidth: "70%", lines: 1 },
        { side: "right", bubbleWidth: "45%", lines: 1 },
        { side: "left", bubbleWidth: "75%", lines: 2 },
        { side: "right", bubbleWidth: "60%", lines: 1 },
    ];

    return (
        <View style={{ paddingHorizontal: 20, paddingTop: 16, gap: 15 }}>
            {rows.map((row, i) => {
                const isUser = row.side === "right";
                return (
                    <View
                        key={i}
                        style={{
                            flexDirection: isUser ? "row-reverse" : "row",
                            alignItems: "flex-end",
                            gap: 8,
                        }}
                    >
                        <SkeletonCircle size={AVATAR_SIZE} />
                        <View
                            style={{
                                maxWidth: "90%",
                                alignItems: isUser ? "flex-end" : "flex-start",
                                flex: 1,
                                gap: 6,
                            }}
                        >
                            <View
                                style={{
                                    backgroundColor: "#EFE6DD",
                                    paddingVertical: 12,
                                    paddingHorizontal: 18,
                                    borderTopLeftRadius: 20,
                                    borderTopRightRadius: 20,
                                    borderBottomLeftRadius: isUser ? 20 : 6,
                                    borderBottomRightRadius: isUser ? 6 : 20,
                                    width: row.bubbleWidth,
                                    gap: 6,
                                }}
                            >
                                {Array.from({ length: row.lines }).map((_, j) => (
                                    <SkeletonText
                                        key={j}
                                        width={`${85 - j * 15}%` as `${number}%`}
                                        size="md"
                                    />
                                ))}
                            </View>
                        </View>
                    </View>
                );
            })}
        </View>
    );
}