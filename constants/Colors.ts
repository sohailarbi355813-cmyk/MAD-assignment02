const tint = "#e85b9f";

export const Colors = {
  light: {
    text: "#21182c",
    textMuted: "#756c7c",
    background: "#faf7fb",
    surface: "#ffffff",
    surfaceRaised: "#f1eaf4",
    border: "#e6dce9",
    tint,
    tabIconDefault: "#958a9b",
    tabIconSelected: tint,
    accent: "#7652b5",
    aqua: "#268d91",
  },
  dark: {
    text: "#f7eff8",
    textMuted: "#b5a9bd",
    background: "#100b1e",
    surface: "#1b1329",
    surfaceRaised: "#281b39",
    border: "#392846",
    tint: "#ff76ad",
    tabIconDefault: "#95869f",
    tabIconSelected: "#ff76ad",
    accent: "#bd8cff",
    aqua: "#70ded3",
  },
};

export type ThemeColor = keyof typeof Colors.light;
