import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const districts = [
  {
    name: "Vice City",
    tag: "NEON & NIGHTLIFE",
    detail: "Ocean Drive lights up after dark. Keep your head on a swivel.",
    icon: "business" as const,
  },
  {
    name: "Leonida Keys",
    tag: "ISLAND TIME",
    detail: "A string of sun-drenched keys where the water runs deep.",
    icon: "boat" as const,
  },
  {
    name: "Grassrivers",
    tag: "WILDER COUNTRY",
    detail: "Backwater trails, open skies, and plenty of room to disappear.",
    icon: "leaf" as const,
  },
];

export default function ExploreScreen() {
  const [selected, setSelected] = useState(0);
  const insets = useSafeAreaInsets();
  const accent = useThemeColor({}, "accent");
  const muted = useThemeColor({}, "textMuted");
  const border = useThemeColor({}, "border");

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 28 }]}
      >
        <ThemedText variant="label" style={{ color: accent }}>
          THE LEONIDA DOSSIER
        </ThemedText>
        <ThemedText variant="title" style={styles.title}>
          Explore the{"\n"}neighborhood.
        </ThemedText>
        <ThemedText style={{ color: muted }}>
          Every corner has a story. Pick a district to check its pulse.
        </ThemedText>

        <ThemedView style={styles.mapCard}>
          <ThemedView style={styles.mapCircleOne} />
          <ThemedView style={styles.mapCircleTwo} />
          <ThemedView style={styles.mapRoadHorizontal} />
          <ThemedView style={styles.mapRoadVertical} />
          <ThemedView style={[styles.mapPin, { backgroundColor: accent }]}>
            <Ionicons name="location" size={19} color="#fff" />
          </ThemedView>
          <ThemedView style={styles.mapLabels}>
            <ThemedText variant="label" style={styles.mapTitle}>
              LEONIDA
            </ThemedText>
            <ThemedText variant="caption" style={styles.mapCaption}>
              FIELD MAP · 3 REGIONS
            </ThemedText>
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.listHeader}>
          <ThemedText variant="subtitle">Choose a district</ThemedText>
          <ThemedText variant="caption" style={{ color: muted }}>
            0{selected + 1} / 03
          </ThemedText>
        </ThemedView>
        {districts.map((district, index) => {
          const isSelected = selected === index;
          return (
            <Pressable
              key={district.name}
              accessibilityRole="button"
              accessibilityState={{ selected: isSelected }}
              onPress={() => setSelected(index)}
              style={({ pressed }) => [
                styles.districtCard,
                { borderColor: isSelected ? accent : border },
                isSelected && styles.selectedCard,
                pressed && styles.pressedCard,
              ]}
            >
              <ThemedView
                style={[
                  styles.districtIcon,
                  { backgroundColor: isSelected ? accent : "transparent" },
                  !isSelected && { borderColor: border, borderWidth: 1 },
                ]}
              >
                <Ionicons
                  name={district.icon}
                  size={21}
                  color={isSelected ? "#fff" : muted}
                />
              </ThemedView>
              <ThemedView style={styles.districtCopy}>
                <ThemedText variant="label" style={{ color: muted }}>
                  {district.tag}
                </ThemedText>
                <ThemedText variant="subtitle">{district.name}</ThemedText>
                {isSelected && (
                  <ThemedText variant="caption" style={{ color: muted }}>
                    {district.detail}
                  </ThemedText>
                )}
              </ThemedView>
              <Ionicons
                name={isSelected ? "checkmark-circle" : "chevron-forward"}
                size={20}
                color={isSelected ? accent : muted}
              />
            </Pressable>
          );
        })}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { padding: 22, paddingTop: 28, paddingBottom: 36, gap: 12 },
  title: { fontSize: 34, lineHeight: 39, marginVertical: 2 },
  mapCard: {
    height: 190,
    overflow: "hidden",
    borderRadius: 22,
    marginTop: 8,
    backgroundColor: "#18252a",
  },
  mapCircleOne: {
    position: "absolute",
    width: 210,
    height: 210,
    borderRadius: 105,
    backgroundColor: "#307b6b",
    opacity: 0.7,
    left: -36,
    top: -74,
  },
  mapCircleTwo: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: "#b26b82",
    opacity: 0.7,
    right: -55,
    bottom: -128,
  },
  mapRoadHorizontal: {
    position: "absolute",
    height: 3,
    left: -10,
    right: -10,
    top: 95,
    backgroundColor: "#f9dfbd88",
    transform: [{ rotate: "-12deg" }],
  },
  mapRoadVertical: {
    position: "absolute",
    width: 3,
    top: -10,
    bottom: -10,
    right: "37%",
    backgroundColor: "#f9dfbd88",
    transform: [{ rotate: "20deg" }],
  },
  mapPin: {
    position: "absolute",
    top: 47,
    left: "48%",
    width: 39,
    height: 39,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 20,
    borderWidth: 3,
    borderColor: "#ffffff88",
  },
  mapLabels: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 15,
    gap: 3,
    backgroundColor: "#0d1524aa",
  },
  mapTitle: { color: "#fff", fontSize: 16, letterSpacing: 3 },
  mapCaption: { color: "#eddae9" },
  listHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 12,
    marginBottom: 2,
  },
  districtCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 13,
    borderRadius: 17,
    borderWidth: 1,
    marginBottom: 2,
  },
  selectedCard: { backgroundColor: "#e85b9f12" },
  pressedCard: { opacity: 0.78 },
  districtIcon: {
    width: 43,
    height: 43,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  districtCopy: { flex: 1, gap: 3, backgroundColor: "transparent" },
});
