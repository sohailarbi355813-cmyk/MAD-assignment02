import { Link } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function NotFoundScreen() {
  return (
    <ThemedView style={styles.container}>
      <ThemedText variant="title">Page not found</ThemedText>
      <Link href="/" style={styles.link}>
        <ThemedText>Return to home</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
    padding: 24,
  },
  link: {
    padding: 12,
  },
});
