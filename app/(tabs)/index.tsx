import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const accent = useThemeColor({}, "accent");
  const aqua = useThemeColor({}, "aqua");
  const muted = useThemeColor({}, "textMuted");

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
      >
        <ThemedView style={styles.topline}>
          <ThemedText variant="label" style={{ color: accent }}>
            Vice City · Field Guide
          </ThemedText>
          <ThemedView style={[styles.liveDot, { backgroundColor: aqua }]} />
        </ThemedView>

        <ThemedView style={styles.hero}>
          <ThemedText variant="label" style={{ color: aqua }}>
            A NEW COASTLINE AWAITS
          </ThemedText>
          <ThemedText variant="title" style={styles.heroTitle}>
            Welcome to{"\n"}
            <ThemedText variant="title" style={{ color: accent }}>
              Vice City.
            </ThemedText>
          </ThemedText>
          <ThemedText style={[styles.heroCopy, { color: muted }]}>
            Neon nights, sun-soaked streets, and a city that never plays by the
            rules.
          </ThemedText>
          <ThemedView style={styles.heroArtwork}>
            <ThemedView style={[styles.sun, { backgroundColor: accent }]} />
            <ThemedView style={styles.skyline}>
              {[50, 78, 58, 92, 68, 108, 72, 46, 84, 62].map((height, index) => (
                <ThemedView
                  key={`${height}-${index}`}
                  style={[
                    styles.building,
                    {
                      height,
                      backgroundColor: index % 2 ? "#342247" : "#241936",
                    },
                  ]}
                >
                  <ThemedView style={styles.windows} />
                </ThemedView>
              ))}
            </ThemedView>
            <ThemedView style={styles.artLabel}>
              <ThemedText style={styles.artTitle}>GTASIX</ThemedText>
              <ThemedText variant="label" style={styles.artSubtitle}>
                STORIES FROM THE SUNSHINE STATE
              </ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.sectionHeading}>
          <ThemedText variant="subtitle">Your city briefing</ThemedText>
          <ThemedText variant="caption" style={{ color: muted }}>
            01 / 03
          </ThemedText>
        </ThemedView>
        <Link href="/explore" asChild>
          <Pressable style={({ pressed }) => pressed && styles.cardPressed}>
            <ThemedView style={styles.briefingCard}>
              <ThemedView style={[styles.iconBox, { backgroundColor: accent }]}>
                <Ionicons name="navigate" size={21} color="#fff" />
              </ThemedView>
              <ThemedView style={styles.briefingCopy}>
                <ThemedText variant="subtitle">Know your way around</ThemedText>
                <ThemedText variant="caption" style={{ color: muted }}>
                  Get the lay of the land before you hit the streets.
                </ThemedText>
              </ThemedView>
              <Ionicons name="arrow-forward" size={18} color={muted} />
            </ThemedView>
          </Pressable>
        </Link>
        <Link href="/characters" asChild>
          <Pressable style={({ pressed }) => pressed && styles.cardPressed}>
            <ThemedView style={[styles.briefingCard, styles.lastCard]}>
              <ThemedView style={[styles.iconBox, { backgroundColor: aqua }]}>
                <Ionicons name="people" size={21} color="#14202a" />
              </ThemedView>
              <ThemedView style={styles.briefingCopy}>
                <ThemedText variant="subtitle">Meet the crew</ThemedText>
                <ThemedText variant="caption" style={{ color: muted }}>
                  Profiles, backstories, and the latest intel.
                </ThemedText>
              </ThemedView>
              <Ionicons name="arrow-forward" size={18} color={muted} />
            </ThemedView>
          </Pressable>
        </Link>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 22, paddingTop: 24, paddingBottom: 36 },
  topline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  liveDot: { width: 8, height: 8, borderRadius: 4 },
  hero: { gap: 14 },
  heroTitle: { fontSize: 38, lineHeight: 42, letterSpacing: -1 },
  heroCopy: { maxWidth: 310 },
  heroArtwork: {
    height: 226,
    borderRadius: 22,
    overflow: "hidden",
    backgroundColor: "#171028",
    marginTop: 6,
    justifyContent: "flex-end",
  },
  sun: {
    position: "absolute",
    width: 142,
    height: 142,
    borderRadius: 71,
    top: 18,
    right: 33,
    opacity: 0.88,
  },
  skyline: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    height: 120,
  },
  building: {
    width: "10%",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
    justifyContent: "center",
    paddingHorizontal: 5,
  },
  windows: {
    height: "55%",
    borderRadius: 2,
    backgroundColor: "#f2bbd52e",
  },
  artLabel: { padding: 18, backgroundColor: "#100b1eaa", gap: 4 },
  artTitle: {
    color: "#fff",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
    letterSpacing: 5,
  },
  artSubtitle: { color: "#f4d8ed" },
  sectionHeading: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 28,
    marginBottom: 12,
  },
  briefingCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 13,
    borderRadius: 18,
    padding: 15,
    marginBottom: 10,
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#81718a30",
  },
  lastCard: { marginBottom: 0 },
  cardPressed: { opacity: 0.78 },
  iconBox: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 13,
  },
  briefingCopy: { flex: 1, gap: 3, backgroundColor: "transparent" },
});
