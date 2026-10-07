import React from "react";
import Skeleton from "./Skeleton";

type Props = {
    width?: number | `${number}%`;
    size?: "sm" | "md" | "lg" | "xl";
};

/**
 * Text-line placeholder. Default size is `md` (16px), matching body text.
 */
export default function SkeletonText({ width = "100%", size = "md" }: Props) {
    const height = size === "sm" ? 12 : size === "lg" ? 20 : size === "xl" ? 28 : 16;
    return <Skeleton width={width} height={height} borderRadius={4} />;
}