import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type ChatIconProps = {
  width?: number;
  height?: number;
  color?: string; // default color
};

export default function ChatIcon({
  width = 24,
  height = 24,
  color = '#D5C2B9',
}: ChatIconProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 24 24" fill="none">
      <Path
        d="M21 10C21 6.13401 17.866 3 14 3H10C6.13401 3 3 6.13401 3 10V16.1716C3 17.9534 5.15428 18.8457 6.41421 17.5858L6.86842 17.1316C6.95267 17.0473 7.06693 17 7.18608 17H14C17.866 17 21 13.866 21 10Z"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
      />
      <Circle cx={8} cy={10} r={1} fill={color} />
      <Circle cx={12} cy={10} r={1} fill={color} />
      <Circle cx={16} cy={10} r={1} fill={color} />
    </Svg>
  );
}
