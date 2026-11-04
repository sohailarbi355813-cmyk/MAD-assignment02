import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getMarketAssets, type MarketAsset } from "@/services/markets";

const insights = [
  {
    title: "Crypto market",
    detail: "Explore digital assets by market cap",
    icon: "trending-up" as const,
    color: "accent" as const,
  },
  {
    title: "24-hour movers",
    detail: "Compare the latest daily price changes",
    icon: "swap-vertical" as const,
    color: "aqua" as const,
  },
  {
    title: "Daily Tip",
    detail: "Market prices can change quickly. Manage your risk.",
    icon: "bulb-outline" as const,
    color: "accent" as const,
  },
];

function formatPrice(price: number): string {
  return `$${price.toLocaleString("en-US", {
    maximumFractionDigits: price < 1 ? 6 : 2,
  })}`;
}

function formatMarketCap(marketCap: number): string {
  if (marketCap >= 1_000_000_000_000) {
    return `$${(marketCap / 1_000_000_000_000).toFixed(1)}T`;
  }
  if (marketCap >= 1_000_000_000) {
    return `$${(marketCap / 1_000_000_000).toFixed(1)}B`;
  }
  return `$${(marketCap / 1_000_000).toFixed(0)}M`;
}

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const muted = useThemeColor({}, "textMuted");
  const border = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surface");
  const accent = useThemeColor({}, "accent");
  const aqua = useThemeColor({}, "aqua");
  const danger = useThemeColor({}, "danger");

  const [assets, setAssets] = useState<MarketAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAssets = useCallback(async (refresh = false) => {
    setError(null);
    setIsLoading(true);
    if (refresh) {
      setIsRefreshing(true);
    }

    try {
      setAssets(await getMarketAssets());
    } catch {
      setError("Market data could not be loaded. Check your connection and try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchAssets();
  }, [fetchAssets]);

  if (isLoading && assets.length === 0) {
    return (
      <ThemedView style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={accent} />
        <ThemedText style={[styles.statusText, { color: muted }]}>Loading market data…</ThemedText>
      </ThemedView>
    );
  }

  if (error && assets.length === 0) {
    return (
      <ThemedView style={[styles.centered, styles.errorState, { paddingTop: insets.top }]}>
        <Ionicons name="cloud-offline-outline" size={40} color={danger} />
        <ThemedText variant="subtitle">Unable to load market data</ThemedText>
        <ThemedText style={[styles.statusText, { color: muted }]}>{error}</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => void fetchAssets(true)}
          style={[styles.retryButton, { backgroundColor: accent }]}
        >
          <ThemedText style={styles.retryText}>Retry</ThemedText>
        </Pressable>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={assets}
        keyExtractor={(asset) => asset.id}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: 28 + insets.bottom },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void fetchAssets(true)}
            tintColor={accent}
            colors={[accent]}
          />
        }
        ListHeaderComponent={
          <View>
            <ThemedText variant="title">Market Insights</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Live cryptocurrency prices and market trends
            </ThemedText>

            {insights.map((insight) => {
              const color = insight.color === "accent" ? accent : aqua;

              return (
                <ThemedView
                  key={insight.title}
                  style={[styles.insightCard, { backgroundColor: surface, borderColor: border }]}
                >
                  <ThemedView style={[styles.icon, { backgroundColor: color + "18" }]}>
                    <Ionicons name={insight.icon} size={21} color={color} />
                  </ThemedView>
                  <ThemedView style={styles.cardText}>
                    <ThemedText variant="subtitle" style={styles.cardTitle}>
                      {insight.title}
                    </ThemedText>
                    <ThemedText style={{ color: muted }}>{insight.detail}</ThemedText>
                  </ThemedView>
                </ThemedView>
              );
            })}

            <View style={styles.assetsHeading}>
              <ThemedText variant="subtitle">Top crypto assets</ThemedText>
              {isRefreshing ? <ActivityIndicator color={accent} /> : null}
            </View>
            {error ? (
              <View style={styles.errorRow}>
                <ThemedText accessibilityRole="alert" style={[styles.inlineError, { color: danger }]}>
                  {error}
                </ThemedText>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void fetchAssets(true)}
                  style={[styles.inlineRetryButton, { borderColor: border }]}
                >
                  <ThemedText style={{ color: accent, fontWeight: "700" }}>Retry</ThemedText>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <ThemedView style={[styles.assetCard, { backgroundColor: surface, borderColor: border }]}>
            <View style={[styles.assetSymbol, { backgroundColor: accent + "18" }]}>
              <ThemedText style={[styles.symbolText, { color: accent }]}>
                {item.symbol.toUpperCase().slice(0, 3)}
              </ThemedText>
            </View>
            <View style={styles.assetDetails}>
              <ThemedText variant="subtitle" numberOfLines={1} style={styles.assetName}>
                {item.name}
              </ThemedText>
              <ThemedText variant="caption" style={{ color: muted }}>
                {item.symbol.toUpperCase()} · Market cap {formatMarketCap(item.market_cap)}
              </ThemedText>
            </View>
            <View style={styles.assetPrice}>
              <ThemedText style={styles.price}>
                {formatPrice(item.current_price)}
              </ThemedText>
              <ThemedText
                variant="caption"
                style={{
                  color:
                    item.price_change_percentage_24h === null
                      ? muted
                      : item.price_change_percentage_24h >= 0
                        ? accent
                        : danger,
                  fontWeight: "700",
                }}
              >
                {item.price_change_percentage_24h === null
                  ? "—"
                  : `${item.price_change_percentage_24h >= 0 ? "+" : ""}${item.price_change_percentage_24h.toFixed(2)}%`}
                </ThemedText>
            </View>
          </ThemedView>
        )}
        ListEmptyComponent={
          <ThemedText style={[styles.statusText, { color: muted }]}>
            No market assets are available right now.
          </ThemedText>
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center", gap: 12, padding: 24 },
  errorState: { paddingHorizontal: 32 },
  statusText: { marginTop: 4, textAlign: "center", lineHeight: 21 },
  content: { paddingHorizontal: 20 },
  subtitle: { marginTop: 4, marginBottom: 22 },
  insightCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderRadius: 16,
  },
  icon: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 13 },
  cardText: { flex: 1, gap: 3, backgroundColor: "transparent" },
  cardTitle: { fontSize: 16, lineHeight: 21 },
  assetsHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 12,
  },
  inlineError: { marginBottom: 10, fontSize: 13 },
  errorRow: { gap: 8, marginBottom: 10 },
  inlineRetryButton: {
    alignSelf: "flex-start",
    paddingHorizontal: 13,
    paddingVertical: 7,
    borderWidth: 1,
    borderRadius: 9,
  },
  assetCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    marginBottom: 11,
    borderWidth: 1,
    borderRadius: 15,
  },
  assetSymbol: { width: 42, height: 42, alignItems: "center", justifyContent: "center", borderRadius: 13 },
  symbolText: { fontSize: 12, fontWeight: "800" },
  assetDetails: { flex: 1, gap: 4, backgroundColor: "transparent" },
  assetName: { fontSize: 15, lineHeight: 20 },
  assetPrice: { alignItems: "flex-end", gap: 4, backgroundColor: "transparent" },
  price: { fontSize: 14, fontWeight: "800" },
  retryButton: { paddingHorizontal: 20, paddingVertical: 11, borderRadius: 11, marginTop: 4 },
  retryText: { fontWeight: "800", color: "#07130c" },
});
