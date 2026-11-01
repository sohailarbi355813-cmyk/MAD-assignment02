import { Ionicons } from "@expo/vector-icons";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { getProducts, type Product } from "@/services/products";

const insights = [
  {
    title: "Market Status",
    detail: "Bullish trend today",
    icon: "trending-up" as const,
    color: "accent" as const,
  },
  {
    title: "Top Gainer",
    detail: "Solana (+6.4%)",
    icon: "star-outline" as const,
    color: "aqua" as const,
  },
  {
    title: "Daily Tip",
    detail: "Always manage your risk and set stop losses.",
    icon: "bulb-outline" as const,
    color: "accent" as const,
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const muted = useThemeColor({}, "textMuted");
  const border = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surface");
  const accent = useThemeColor({}, "accent");
  const aqua = useThemeColor({}, "aqua");
  const danger = useThemeColor({}, "danger");

  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = useCallback(async (refresh = false) => {
    setError(null);
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    try {
      setProducts(await getProducts());
    } catch {
      setError("Products could not be loaded. Check your connection and try again.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    void fetchProducts();
  }, [fetchProducts]);

  if (isLoading && products.length === 0) {
    return (
      <ThemedView style={[styles.centered, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={accent} />
        <ThemedText style={[styles.statusText, { color: muted }]}>Loading products…</ThemedText>
      </ThemedView>
    );
  }

  if (error && products.length === 0) {
    return (
      <ThemedView style={[styles.centered, styles.errorState, { paddingTop: insets.top }]}>
        <Ionicons name="cloud-offline-outline" size={40} color={danger} />
        <ThemedText variant="subtitle">Unable to load products</ThemedText>
        <ThemedText style={[styles.statusText, { color: muted }]}>{error}</ThemedText>
        <Pressable
          accessibilityRole="button"
          onPress={() => void fetchProducts(true)}
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
        data={products}
        keyExtractor={(product) => String(product.id)}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 24, paddingBottom: 28 + insets.bottom },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => void fetchProducts(true)}
            tintColor={accent}
            colors={[accent]}
          />
        }
        ListHeaderComponent={
          <View>
            <ThemedText variant="title">Market Insights</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              A few helpful things to know today
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

            <View style={styles.productsHeading}>
              <ThemedText variant="subtitle">Explore products</ThemedText>
              {isRefreshing ? <ActivityIndicator color={accent} /> : null}
            </View>
            {error ? (
              <View style={styles.errorRow}>
                <ThemedText accessibilityRole="alert" style={[styles.inlineError, { color: danger }]}>
                  {error}
                </ThemedText>
                <Pressable
                  accessibilityRole="button"
                  onPress={() => void fetchProducts()}
                  style={[styles.inlineRetryButton, { borderColor: border }]}
                >
                  <ThemedText style={{ color: accent, fontWeight: "700" }}>Retry</ThemedText>
                </Pressable>
              </View>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <ThemedView style={[styles.productCard, { backgroundColor: surface, borderColor: border }]}>
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
            <View style={styles.productDetails}>
              <ThemedText variant="subtitle" numberOfLines={2} style={styles.productTitle}>
                {item.title}
              </ThemedText>
              <ThemedText numberOfLines={3} style={[styles.productDescription, { color: muted }]}>
                {item.description}
              </ThemedText>
              <View style={styles.productMeta}>
                <ThemedText variant="caption" style={[styles.category, { color: aqua }]}>
                  {item.category}
                </ThemedText>
                <ThemedText style={[styles.price, { color: accent }]}>
                  ${item.price.toFixed(2)}
                </ThemedText>
              </View>
            </View>
          </ThemedView>
        )}
        ListEmptyComponent={
          <ThemedText style={[styles.statusText, { color: muted }]}>
            No products are available right now.
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
  productsHeading: {
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
  productCard: {
    flexDirection: "row",
    gap: 13,
    padding: 12,
    marginBottom: 11,
    borderWidth: 1,
    borderRadius: 15,
  },
  productImage: { width: 88, height: 88, borderRadius: 11, backgroundColor: "#e9eef2" },
  productDetails: { flex: 1, justifyContent: "space-between", gap: 5 },
  productTitle: { fontSize: 15, lineHeight: 20 },
  productDescription: { fontSize: 12, lineHeight: 17 },
  productMeta: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  category: { fontSize: 11, textTransform: "capitalize" },
  price: { fontSize: 15, fontWeight: "800" },
  retryButton: { paddingHorizontal: 20, paddingVertical: 11, borderRadius: 11, marginTop: 4 },
  retryText: { fontWeight: "800", color: "#07130c" },
});
