import Back from '@/assets/svgs/back.svg';
import { Colors } from '@/constants/color';
import { router } from 'expo-router';
import React from 'react';
import { StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';

interface BackButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  variant?: 'light' | 'dark';
}

/**
 * Reusable Back Button component.
 *
 * @param variant 'light' for dark backgrounds (white stroke/border),
 *                'dark' for light backgrounds (brown stroke/border).
 */
export const BackButton = ({ onPress, style, variant = 'dark' }: BackButtonProps) => {
  const isLight = variant === 'light';

  return (
    <TouchableOpacity
      onPress={onPress || (() => router.back())}
      style={[
        styles.container,
        isLight ? styles.lightContainer : styles.darkContainer,
        style,
      ]}
    >
      <Back stroke={isLight ? Colors.white : Colors.brown} />
      {/* <BracketLef */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 40, // More rounded like the design
    alignItems: 'center',
    justifyContent: 'center',
    width: 44,
    height: 44,
  },
  lightContainer: {
    borderColor: 'rgba(255,255,255,0.3)',
  },
  darkContainer: {
    borderColor: 'rgba(75, 52, 37, 0.2)',
  },
});
