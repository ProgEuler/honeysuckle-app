import React, { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import Robo from '@/assets/svgs/robo.svg';
import { Colors } from '@/constants/color';
import { RNText } from './input';

type Props = {
  onToggle: (toggled: boolean) => void;
  value?: boolean;
  label: string;
};

export function RNSwitch({ value, label, onToggle }: Props) {
  const [enabled, setEnabled] = useState(value ?? false);
  const isOn = useSharedValue(enabled);

  const toggleSwitch = () => {
    const newValue = !enabled;
    setEnabled(newValue);
    onToggle(newValue);
    isOn.value = newValue;
  };

  const height = useSharedValue(0);
  const width = useSharedValue(0);

  const trackAnimatedStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      isOn.value,
      [0, 1],
      [Colors.brown, Colors.green]
    );
    const colorValue = withTiming(color, { duration: 200 });

    return {
      backgroundColor: colorValue,
      borderRadius: height.value / 2,
    };
  });

  const thumbAnimatedStyle = useAnimatedStyle(() => {
    const moveValue = interpolate(
      Number(isOn.value),
      [0, 1],
      [0, width.value - height.value]
    );
    const translateValue = withTiming(moveValue, { duration: 200 });

    return {
      transform: [{ translateX: translateValue }],
      borderRadius: height.value / 2,
    };
  });

  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 8,
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          gap: 10,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{ padding: 12, backgroundColor: '#E5EAD7', borderRadius: 30 }}
        >
          <Robo />
        </View>
        {label && (
          <RNText size="lg" variant="title">
            {label}
          </RNText>
        )}
      </View>

      <Pressable onPress={toggleSwitch}>
        <Animated.View
          onLayout={(e) => {
            height.value = e.nativeEvent.layout.height;
            width.value = e.nativeEvent.layout.width;
          }}
          style={[switchStyles.track, trackAnimatedStyle]}
        >
          <Animated.View
            style={[switchStyles.thumb, thumbAnimatedStyle]}
          ></Animated.View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const switchStyles = StyleSheet.create({
  track: {
    alignItems: 'flex-start',
    width: 45,
    height: 25,
    padding: 1,
  },
  thumb: {
    height: '100%',
    aspectRatio: 1,
    backgroundColor: 'white',
  },
});
