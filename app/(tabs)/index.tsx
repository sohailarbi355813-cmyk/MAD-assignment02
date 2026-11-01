import { ScrollView, StyleSheet } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";

const assets = [
  { name: "Bitcoin", symbol: "BTC", price: "$68,200", change: "+3.5%", positive: true },
  { name: "Ethereum", symbol: "ETH", price: "$3,500", change: "+2.1%", positive: true },
  { name: "Solana", symbol: "SOL", price: "$155", change: "+6.4%", positive: true },
  { name: "Apple", symbol: "AAPL", price: "$230", change: "+0.8%", positive: true },
  { name: "Gold", symbol: "XAU", price: "$2,650", change: "-0.3%", positive: false },
];

export default function MarketsScreen() {
  const insets = useSafeAreaInsets();
  const muted = useThemeColor({}, "textMuted");
  const border = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surface");
  const accent = useThemeColor({}, "accent");
  const danger = useThemeColor({}, "danger");

  return (
    <ThemedView style={styles.screen}>
      <ScrollView
        contentContainerStyle={[styles.content, { paddingTop: insets.top + 24 }]}
        showsVerticalScrollIndicator={false}
      >
        <ThemedText variant="title">Markets</ThemedText>
        <ThemedText style={[styles.subtitle, { color: muted }]}>
          Prices at a glance
        </ThemedText>

        <ThemedView style={[styles.list, { backgroundColor: surface, borderColor: border }]}>
          {assets.map((asset, index) => (
            <ThemedView
              key={asset.symbol}
              style={[
                styles.assetRow,
                index < assets.length - 1 && { borderBottomWidth: 1, borderBottomColor: border },
              ]}
            >
              <ThemedView style={styles.assetDetails}>
                <ThemedText variant="subtitle" style={styles.assetName}>
                  {asset.name}
                </ThemedText>
                <ThemedText variant="caption" style={{ color: muted }}>
                  {asset.symbol}
                </ThemedText>
              </ThemedView>
              <ThemedView style={styles.priceDetails}>
                <ThemedText style={styles.price}>{asset.price}</ThemedText>
                <ThemedView
                  style={[
                    styles.changeBadge,
                    { backgroundColor: asset.positive ? accent + "18" : danger + "18" },
                  ]}
                >
                  <ThemedText
                    variant="caption"
                    style={{ color: asset.positive ? accent : danger, fontWeight: "700" }}
                  >
                    {asset.change}
                  </ThemedText>
                </ThemedView>
              </ThemedView>
            </ThemedView>
          ))}
        </ThemedView>
        <ThemedText variant="caption" style={[styles.note, { color: muted }]}>
          Prices are examples for demonstration only.
        </ThemedText>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20, paddingBottom: 28 },
  subtitle: { marginTop: 4, marginBottom: 22 },
  list: { borderWidth: 1, borderRadius: 16, paddingHorizontal: 15 },
  assetRow: {
    minHeight: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "transparent",
  },
  assetDetails: { gap: 2, backgroundColor: "transparent" },
  assetName: { fontSize: 16, lineHeight: 21 },
  priceDetails: { alignItems: "flex-end", gap: 4, backgroundColor: "transparent" },
  price: { fontSize: 15, lineHeight: 20, fontWeight: "700" },
  changeBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  note: { marginTop: 14, textAlign: "center" },
});
