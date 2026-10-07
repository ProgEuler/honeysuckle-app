import React from "react";
import { DimensionValue } from "react-native";
import Skeleton from "./Skeleton";

type Props = {
    size: DimensionValue;
};

/**
 * Circular skeleton (avatar, icon bubble, etc).
 */
export default function SkeletonCircle({ size }: Props) {
    return <Skeleton width={size} height={size} borderRadius={999} />;
}