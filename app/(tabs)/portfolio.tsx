import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const holdings = [
  { name: "Bitcoin", amount: "0.15 BTC", value: "$10,230" },
  { name: "Ethereum", amount: "0.5 ETH", value: "$1,750" },
  { name: "Cash / USDT", amount: "", value: "$520.00" },
];

export default function PortfolioScreen() {
  const insets = useSafeAreaInsets();
  const muted = useThemeColor({}, "textMuted");
  const border = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surface");
  const accent = useThemeColor({}, "accent");

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText variant="title">My Portfolio</ThemedText>
        <ThemedText style={[styles.subtitle, { color: muted }]}>
          Your assets in one place
        </ThemedText>

        <ThemedView style={[styles.balanceCard, { backgroundColor: surface, borderColor: border }]}>
          <ThemedText variant="caption" style={{ color: muted }}>TOTAL BALANCE</ThemedText>
          <ThemedText style={styles.balance}>$12,500.00</ThemedText>
          <ThemedText style={[styles.todayChange, { color: accent }]}>+$850 today</ThemedText>
        </ThemedView>

        <ThemedText variant="subtitle" style={styles.sectionTitle}>
          My assets
        </ThemedText>
        <ThemedView style={[styles.holdings, { backgroundColor: surface, borderColor: border }]}>
          {holdings.map((holding, index) => (
            <ThemedView
              key={holding.name}
              style={[
                styles.holdingRow,
                index < holdings.length - 1 && { borderBottomWidth: 1, borderBottomColor: border },
              ]}
            >
              <ThemedView style={styles.holdingName}>
                <ThemedText variant="subtitle" style={styles.assetTitle}>{holding.name}</ThemedText>
                {holding.amount ? (
                  <ThemedText variant="caption" style={{ color: muted }}>{holding.amount}</ThemedText>
                ) : null}
              </ThemedView>
              <ThemedText style={styles.value}>{holding.value}</ThemedText>
            </ThemedView>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  subtitle: { marginTop: 4, marginBottom: 22 },
  balanceCard: { padding: 20, borderRadius: 16, borderWidth: 1 },
  balance: { fontSize: 32, lineHeight: 40, fontWeight: "800", marginTop: 9 },
  todayChange: { fontSize: 15, lineHeight: 21, fontWeight: "700", marginTop: 5 },
  sectionTitle: { marginTop: 26, marginBottom: 12 },
  holdings: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 15 },
  holdingRow: {
    minHeight: 68,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  holdingName: { gap: 2, backgroundColor: "transparent" },
  assetTitle: { fontSize: 16, lineHeight: 21 },
  value: { fontSize: 15, lineHeight: 20, fontWeight: "700" },
});
