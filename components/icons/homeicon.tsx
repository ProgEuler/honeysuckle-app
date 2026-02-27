import React from 'react';
import Svg, { Path, Rect } from 'react-native-svg';

type HomeIconProps = {
  width?: number;
  height?: number;
  color?: string; // default color is #D5C2B9
};

export default function HomeIcon({
  width = 24,
  height = 24,
  color = '#D5C2B9',
}: HomeIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M3 10L9.17158 3.82842C10.7337 2.26633 13.2663 2.26633 14.8284 3.82843L21 10"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Path
        d="M6 7V14C6 17.3137 8.68629 20 12 20C15.3137 20 18 17.3137 18 14V7"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Rect
        x={10}
        y={12}
        width={4}
        height={4}
        rx={2}
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}
