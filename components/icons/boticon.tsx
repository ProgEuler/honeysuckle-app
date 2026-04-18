import { StyleSheet, View } from "react-native";

export const Boticon = ({
  size = 40,
  bgColor = "#EDE7E3",
  dotColor = "#BFA79A",
}) => {
  const dotSize = size * 0.18;
  const centerOffset = size * 0.28;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor,
        },
      ]}
    >
      {/* Top */}
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            top: centerOffset - dotSize / 2,
          },
        ]}
      />

      {/* Bottom */}
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            bottom: centerOffset - dotSize / 2,
          },
        ]}
      />

      {/* Left */}
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            left: centerOffset - dotSize / 2,
          },
        ]}
      />

      {/* Right */}
      <View
        style={[
          styles.dot,
          {
            width: dotSize,
            height: dotSize,
            backgroundColor: dotColor,
            right: centerOffset - dotSize / 2,
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  dot: {
    position: "absolute",
    borderRadius: 999,
    padding: 4
  },
});
