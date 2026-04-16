import { Colors } from "@/constants/color";

type ColorName =
  | "text"
  | "textMuted"
  | "icon"
  | "background"
  | "card"
  | "border"
  | "primary"
  | "primaryForeground"
  | "muted"
  | "mutedForeground"
  | "red";

const colorMap: Record<ColorName, string> = {
  text: Colors.brown,
  textMuted: Colors.primaryText,
  icon: Colors.brown,
  background: Colors.background,
  card: Colors.white,
  border: Colors.green,
  primary: Colors.green,
  primaryForeground: Colors.white,
  muted: Colors.background,
  mutedForeground: Colors.primaryText,
  red: Colors.orange,
};

export function useColor(
  colorName: ColorName,
  props?: { light?: string; dark?: string },
) {
  if (props?.light) {
    return props.light;
  }

  return colorMap[colorName] ?? Colors.brown;
}
