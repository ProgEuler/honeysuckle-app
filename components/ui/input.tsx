import { Colors } from '@/constants/color';
import { ReactNode } from 'react';
import { Text, TextProps } from 'react-native';

const sizes = {
  xs: { fontSize: 10, lineHeight: 16 },
  sm: { fontSize: 14, lineHeight: 20 },
  md: { fontSize: 16, lineHeight: 22 },
  lg: { fontSize: 18, lineHeight: 26 },
  xl: { fontSize: 22, lineHeight: 28 },
  '2xl': { fontSize: 24, lineHeight: 32 },
  '3xl': { fontSize: 30, lineHeight: 36 },
  '4xl': {
    fontSize: 36,
    lineHeight: 40,
  },
};

const variants = {
  base: { fontFamily: 'Regular', color: Colors.primaryText },
  medium: { fontFamily: 'Medium', color: Colors.primaryText },
  title: { fontFamily: 'ExtraBold', color: Colors.brown },
  header: { fontFamily: 'Bold', color: Colors.brown },
  subtitle: { fontStyle: "semibold", color: Colors.brown },
  // primary: { fontWeight: "bold", color: COLORS.primary },
  // accent: { fontWeight: "light", color: COLORS.accent },
  // secondary: { color: COLORS.secondaryText },
  // caption: { color: COLORS.muted },
};

export type RNTextProps = TextProps & {
  size?: keyof typeof sizes;
  variant?: keyof typeof variants;
  children: ReactNode;
};

export function RNText({
  size = 'md',
  variant = 'base',
  children,
  style,
  ...props
}: RNTextProps) {
  return (
    <Text style={[sizes[size], variants[variant], style]} {...props}>
      {children}
    </Text>
  );
}
