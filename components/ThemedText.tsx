import { Text, type TextProps } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  variant?: "default" | "title" | "subtitle" | "caption" | "label";
};

const variantStyles = {
  default: { fontSize: 15, lineHeight: 23 },
  title: { fontSize: 30, lineHeight: 36, fontWeight: "800" as const },
  subtitle: { fontSize: 19, lineHeight: 25, fontWeight: "700" as const },
  caption: { fontSize: 12, lineHeight: 17 },
  label: {
    fontSize: 11,
    lineHeight: 16,
    fontWeight: "800" as const,
    letterSpacing: 1.5,
    textTransform: "uppercase" as const,
  },
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  variant = "default",
  ...otherProps
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return (
    <Text
      style={[{ color }, variantStyles[variant], style]}
      {...otherProps}
    />
  );
}
