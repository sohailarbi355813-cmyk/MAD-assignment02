import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const characters = [
  {
    name: "Lucia",
    role: "THE STRATEGIST",
    chapter: "A fresh start is never free.",
    bio: "Sharp instincts, bigger plans. Lucia knows the city rewards patience—and punishes hesitation.",
    initials: "L",
    color: "#d65e8d",
    stats: [82, 68, 91],
  },
  {
    name: "Jason",
    role: "THE GETAWAY",
    chapter: "Trust is the hardest thing to earn.",
    bio: "Cool under pressure and always watching the exits, Jason learned to make every move count.",
    initials: "J",
    color: "#3e9b98",
    stats: [74, 92, 71],
  },
];

const statLabels = ["Instinct", "Streetwise", "Resolve"];

export default function CharactersScreen() {
  const [active, setActive] = useState(0);
  const insets = useSafeAreaInsets();
  const accent = useThemeColor({}, "accent");
  const muted = useThemeColor({}, "textMuted");
  const border = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surfaceRaised");
  const character = characters[active];

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 26 }]}
      >
        <ThemedView style={styles.header}>
          <ThemedView style={styles.headerCopy}>
            <ThemedText variant="label" style={{ color: accent }}>
              PEOPLE OF LEONIDA
            </ThemedText>
            <ThemedText variant="title" style={styles.title}>
              Know your{"\n"}co-conspirators.
            </ThemedText>
          </ThemedView>
          <ThemedView style={[styles.countBadge, { borderColor: border }]}>
            <ThemedText variant="subtitle">02</ThemedText>
            <ThemedText variant="caption" style={{ color: muted }}>
              PROFILES
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.switcher}>
          {characters.map((item, index) => {
            const selected = active === index;
            return (
              <Pressable
                key={item.name}
                accessibilityRole="tab"
                accessibilityState={{ selected }}
                onPress={() => setActive(index)}
                style={({ pressed }) => [
                  styles.personTab,
                  {
                    borderColor: selected ? item.color : border,
                    backgroundColor: selected ? item.color + "18" : "transparent",
                  },
                  pressed && styles.pressed,
                ]}
              >
                <ThemedView
                  style={[
                    styles.avatarSmall,
                    { backgroundColor: item.color },
                  ]}
                >
                  <ThemedText style={styles.avatarInitial}>
                    {item.initials}
                  </ThemedText>
                </ThemedView>
                <ThemedText
                  variant="subtitle"
                  style={selected ? { color: item.color } : undefined}
                >
                  {item.name}
                </ThemedText>
                {selected && (
                  <Ionicons name="checkmark-circle" size={18} color={item.color} />
                )}
              </Pressable>
            );
          })}
        </ThemedView>

        <ThemedView style={[styles.profileCard, { borderColor: border }]}>
          <ThemedView
            style={[
              styles.portrait,
              { backgroundColor: character.color + "24" },
            ]}
          >
            <ThemedView style={[styles.portraitHalo, { borderColor: character.color }]} />
            <ThemedView style={[styles.portraitCore, { backgroundColor: character.color }]}>
              <ThemedText style={styles.portraitInitial}>
                {character.initials}
              </ThemedText>
            </ThemedView>
            <ThemedView style={styles.clearanceBadge}>
              <Ionicons name="checkmark-circle" size={14} color="#70ded3" />
              <ThemedText variant="label" style={styles.clearanceText}>
                KNOWN ASSOCIATE
              </ThemedText>
            </ThemedView>
          </ThemedView>
          <ThemedView style={styles.profileInfo}>
            <ThemedText variant="label" style={{ color: character.color }}>
              {character.role}
            </ThemedText>
            <ThemedText variant="title" style={styles.name}>
              {character.name}
            </ThemedText>
            <ThemedText style={[styles.quote, { color: muted }]}>
              “{character.chapter}”
            </ThemedText>
            <ThemedText variant="caption" style={{ color: muted }}>
              {character.bio}
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.intelHeader}>
          <ThemedView>
            <ThemedText variant="label" style={{ color: accent }}>
              FIELD INTEL
            </ThemedText>
            <ThemedText variant="subtitle">Read the room</ThemedText>
          </ThemedView>
          <Ionicons name="pulse" size={21} color={accent} />
        </ThemedView>
        <ThemedView style={styles.statsCard}>
          {character.stats.map((value, index) => (
            <ThemedView key={statLabels[index]} style={styles.statRow}>
              <ThemedText variant="caption" style={styles.statName}>
                {statLabels[index]}
              </ThemedText>
              <ThemedView style={[styles.statTrack, { backgroundColor: surface }]}>
                <ThemedView
                  style={[
                    styles.statFill,
                    { width: `${value}%`, backgroundColor: character.color },
                  ]}
                />
              </ThemedView>
              <ThemedText variant="caption" style={[styles.statValue, { color: muted }]}>
                {value}
              </ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
        <ThemedText variant="caption" style={[styles.disclaimer, { color: muted }]}>
          Original fan-made field guide. Not affiliated with or endorsed by the
          game publisher.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 22, paddingTop: 26, paddingBottom: 36 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  headerCopy: { gap: 8, backgroundColor: "transparent" },
  title: { fontSize: 31, lineHeight: 36 },
  countBadge: {
    alignItems: "center",
    gap: 2,
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 14,
    borderWidth: 1,
  },
  switcher: { flexDirection: "row", gap: 10, marginBottom: 14 },
  personTab: {
    flex: 1,
    minHeight: 59,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 15,
  },
  pressed: { opacity: 0.75 },
  avatarSmall: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 16,
  },
  avatarInitial: { color: "#fff", fontSize: 16, fontWeight: "800" },
  profileCard: { borderWidth: 1, borderRadius: 21, overflow: "hidden" },
  portrait: {
    height: 188,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  portraitHalo: {
    position: "absolute",
    width: 168,
    height: 168,
    borderRadius: 84,
    borderWidth: 1,
    opacity: 0.45,
  },
  portraitCore: {
    width: 112,
    height: 112,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 56,
    borderWidth: 8,
    borderColor: "#ffffff30",
  },
  portraitInitial: {
    color: "#fff",
    fontSize: 58,
    lineHeight: 66,
    fontWeight: "800",
  },
  clearanceBadge: {
    position: "absolute",
    bottom: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: "#100b1eaa",
  },
  clearanceText: { color: "#fff", fontSize: 9 },
  profileInfo: { padding: 17, gap: 7 },
  name: { fontSize: 29, lineHeight: 34 },
  quote: { fontStyle: "italic", marginBottom: 2 },
  intelHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 22,
    marginBottom: 11,
  },
  statsCard: { gap: 15, padding: 16, borderRadius: 17, backgroundColor: "transparent" },
  statRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  statName: { width: 72 },
  statTrack: { flex: 1, height: 7, borderRadius: 4, overflow: "hidden" },
  statFill: { height: "100%", borderRadius: 4 },
  statValue: { width: 25, textAlign: "right" },
  disclaimer: { marginTop: 20, textAlign: "center" },
});
