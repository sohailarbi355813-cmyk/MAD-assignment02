export const Colors = {
  light: {
    text: "#15202b",
    textMuted: "#728091",
    background: "#f3f6f8",
    surface: "#ffffff",
    surfaceRaised: "#e9eef2",
    border: "#dce3e9",
    tint: "#00a957",
    tabIconDefault: "#81909e",
    tabIconSelected: "#00a957",
    accent: "#00a957",
    aqua: "#148bb5",
    danger: "#d94358",
  },
  dark: {
    text: "#f0f4f7",
    textMuted: "#8b98a7",
    background: "#0b0e14",
    surface: "#121821",
    surfaceRaised: "#19222d",
    border: "#252f3b",
    tint: "#00e676",
    tabIconDefault: "#758290",
    tabIconSelected: "#00e676",
    accent: "#00e676",
    aqua: "#42d7f5",
    danger: "#ff6477",
  },
};

export type ThemeColor = keyof typeof Colors.light;
