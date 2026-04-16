import ArrowRight from "@/assets/svgs/arrowright.svg";
import { Colors } from "@/constants/color";
import { router } from "expo-router";
import React from "react";
import { TouchableOpacity } from "react-native";
import { RNText } from "./input";

const RNButton = ({
  path,
  value,
  tag = "push",
  onPress,
  disabled = false,
}: {
  path?: string;
  value: string;
  tag?: "push" | "replace";
  onPress?: () => void;
  disabled?: boolean;
}) => {
  // console.log(path);
  return (
    <TouchableOpacity
      disabled={disabled}
      onPress={() => {
        if (onPress) {
          onPress();
          return;
        }

        if (!path) {
          return;
        }

        console.log("tag:", tag);
        if (tag === "push") {
          console.log("push the path");
          router.push(path as any);
        } else if (tag === "replace") {
          console.log("replace the path");
          router.replace(path as any);
        }
      }}
      style={{
        backgroundColor: Colors.brown,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingVertical: 13,
        gap: 15,
        borderRadius: 30,
        opacity: disabled ? 0.6 : 1,
      }}
    >
      <RNText variant="title" size="lg" style={{ color: Colors.white }}>
        {value}
      </RNText>
      <ArrowRight />
    </TouchableOpacity>
  );
};

export default RNButton;
