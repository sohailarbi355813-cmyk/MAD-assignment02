import { Colors, type ThemeColor } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: ThemeColor,
) {
  const theme = useColorScheme();
  const colorFromProps = props[theme];

  return colorFromProps ?? Colors[theme][colorName];
}
