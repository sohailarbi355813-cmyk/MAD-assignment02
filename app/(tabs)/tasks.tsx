import { Ionicons } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { useThemeColor } from "@/hooks/useThemeColor";
import { loadTasks, saveTasks, type TaskRecord } from "@/services/tasks";

export default function TasksScreen() {
  const insets = useSafeAreaInsets();
  const text = useThemeColor({}, "text");
  const muted = useThemeColor({}, "textMuted");
  const border = useThemeColor({}, "border");
  const surface = useThemeColor({}, "surface");
  const raised = useThemeColor({}, "surfaceRaised");
  const accent = useThemeColor({}, "accent");
  const danger = useThemeColor({}, "danger");

  const [tasks, setTasks] = useState<TaskRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskRecord | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    let isMounted = true;

    loadTasks()
      .then((savedTasks) => {
        if (isMounted) {
          setTasks(savedTasks);
          setLoadError(null);
        }
      })
      .catch(() => {
        if (isMounted) {
          setLoadError("Saved tasks could not be loaded. Please try again.");
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => ["All", ...new Set(tasks.map((task) => task.category))],
    [tasks],
  );

  const filteredTasks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return tasks.filter((task) => {
      const matchesCategory =
        categoryFilter === "All" || task.category === categoryFilter;
      const matchesSearch =
        query.length === 0 ||
        [task.title, task.description, task.category].some((value) =>
          value.toLowerCase().includes(query),
        );
      return matchesCategory && matchesSearch;
    });
  }, [categoryFilter, search, tasks]);

  async function persistTasks(nextTasks: TaskRecord[]): Promise<boolean> {
    setIsSaving(true);
    setSaveError(null);
    try {
      await saveTasks(nextTasks);
      setTasks(nextTasks);
      return true;
    } catch {
      setSaveError("Your changes could not be saved. Please try again.");
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  function openCreateModal() {
    setEditingTask(null);
    setTitle("");
    setDescription("");
    setCategory("");
    setIsModalVisible(true);
  }

  function openEditModal(task: TaskRecord) {
    setEditingTask(task);
    setTitle(task.title);
    setDescription(task.description);
    setCategory(task.category);
    setIsModalVisible(true);
  }

  async function handleSave() {
    const cleanTitle = title.trim();
    const cleanCategory = category.trim();
    if (!cleanTitle || !cleanCategory || isSaving) {
      return;
    }

    const updatedTask: TaskRecord = {
      id: editingTask?.id ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      title: cleanTitle,
      description: description.trim(),
      category: cleanCategory,
      createdAt: editingTask?.createdAt ?? new Date().toISOString(),
    };
    const nextTasks = editingTask
      ? tasks.map((task) => (task.id === editingTask.id ? updatedTask : task))
      : [updatedTask, ...tasks];

    if (await persistTasks(nextTasks)) {
      setIsModalVisible(false);
    }
  }

  function confirmDelete(task: TaskRecord) {
    Alert.alert("Delete task", `Remove "${task.title}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () => {
          void persistTasks(tasks.filter((item) => item.id !== task.id));
        },
      },
    ]);
  }

  function retryLoad() {
    setIsLoading(true);
    setLoadError(null);
    loadTasks()
      .then(setTasks)
      .catch(() => {
        setLoadError("Saved tasks could not be loaded. Please try again.");
      })
      .finally(() => setIsLoading(false));
  }

  const inputStyle = [
    styles.input,
    { backgroundColor: raised, borderColor: border, color: text },
  ];

  return (
    <ThemedView style={styles.screen}>
      <FlatList
        data={filteredTasks}
        keyExtractor={(task) => task.id}
        contentContainerStyle={[
          styles.content,
          { paddingTop: insets.top + 20, paddingBottom: 30 + insets.bottom },
          filteredTasks.length === 0 && styles.emptyList,
        ]}
        keyboardShouldPersistTaps="handled"
        ListHeaderComponent={
          <View>
            <ThemedText variant="title">Task Manager</ThemedText>
            <ThemedText style={[styles.subtitle, { color: muted }]}>
              Keep your notes and tasks organized
            </ThemedText>

            <View style={[styles.searchBox, { backgroundColor: surface, borderColor: border }]}>
              <Ionicons name="search" size={18} color={muted} />
              <TextInput
                accessibilityLabel="Search tasks"
                value={search}
                onChangeText={setSearch}
                placeholder="Search tasks"
                placeholderTextColor={muted}
                returnKeyType="search"
                style={[styles.searchInput, { color: text }]}
              />
            </View>

            <FlatList
              horizontal
              data={categories}
              keyExtractor={(item) => item}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filters}
              renderItem={({ item }) => {
                const selected = categoryFilter === item;
                return (
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={{ selected }}
                    onPress={() => setCategoryFilter(item)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: selected ? accent : surface,
                        borderColor: selected ? accent : border,
                      },
                    ]}
                  >
                    <ThemedText
                      style={[styles.filterText, { color: selected ? "#07130c" : text }]}
                    >
                      {item}
                    </ThemedText>
                  </Pressable>
                );
              }}
            />

            <View style={styles.sectionHeading}>
              <ThemedText variant="subtitle">Your tasks</ThemedText>
              <ThemedText variant="caption" style={{ color: muted }}>
                {filteredTasks.length} {filteredTasks.length === 1 ? "item" : "items"}
              </ThemedText>
            </View>

            {saveError ? (
              <ThemedText accessibilityRole="alert" style={[styles.errorText, { color: danger }]}>
                {saveError}
              </ThemedText>
            ) : null}
          </View>
        }
        renderItem={({ item }) => (
          <ThemedView style={[styles.taskCard, { backgroundColor: surface, borderColor: border }]}>
            <View style={styles.taskContent}>
              <View style={styles.taskTitleRow}>
                <ThemedText variant="subtitle" style={styles.taskTitle}>
                  {item.title}
                </ThemedText>
                <View style={[styles.categoryBadge, { backgroundColor: accent + "20" }]}>
                  <ThemedText style={[styles.categoryText, { color: accent }]}>
                    {item.category}
                  </ThemedText>
                </View>
              </View>
              {item.description ? (
                <ThemedText style={[styles.description, { color: muted }]}>
                  {item.description}
                </ThemedText>
              ) : null}
              <ThemedText variant="caption" style={{ color: muted }}>
                Created {new Date(item.createdAt).toLocaleDateString()}
              </ThemedText>
            </View>
            <View style={styles.actions}>
              <Pressable
                accessibilityLabel={`Edit ${item.title}`}
                accessibilityRole="button"
                onPress={() => openEditModal(item)}
                disabled={isSaving}
                hitSlop={8}
                style={[styles.actionButton, isSaving && styles.disabled]}
              >
                <Ionicons name="create-outline" size={21} color={accent} />
              </Pressable>
              <Pressable
                accessibilityLabel={`Delete ${item.title}`}
                accessibilityRole="button"
                onPress={() => confirmDelete(item)}
                disabled={isSaving}
                hitSlop={8}
                style={[styles.actionButton, isSaving && styles.disabled]}
              >
                <Ionicons name="trash-outline" size={20} color={danger} />
              </Pressable>
            </View>
          </ThemedView>
        )}
        ListEmptyComponent={
          isLoading ? (
            <ActivityIndicator color={accent} style={styles.loader} />
          ) : loadError ? (
            <View style={styles.emptyState}>
              <ThemedText style={{ color: danger, textAlign: "center" }}>{loadError}</ThemedText>
              <Pressable onPress={retryLoad} style={[styles.retryButton, { backgroundColor: accent }]}>
                <ThemedText style={styles.retryText}>Retry</ThemedText>
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="checkbox-outline" size={38} color={muted} />
              <ThemedText variant="subtitle">No tasks found</ThemedText>
              <ThemedText style={{ color: muted, textAlign: "center" }}>
                Add a task or try a different search.
              </ThemedText>
            </View>
          )
        }
      />

      <Pressable
        accessibilityLabel="Add task"
        accessibilityRole="button"
        onPress={openCreateModal}
        disabled={isLoading || Boolean(loadError) || isSaving}
        style={[
          styles.addButton,
          { backgroundColor: accent, bottom: Math.max(insets.bottom, 14) + 10 },
          (isLoading || Boolean(loadError) || isSaving) && styles.disabled,
        ]}
      >
        <Ionicons name="add" size={24} color="#07130c" />
        <ThemedText style={styles.addButtonText}>Add task</ThemedText>
      </Pressable>

      <Modal
        animationType="slide"
        transparent
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.modalBackdrop}
        >
          <View style={[styles.modalCard, { backgroundColor: surface, borderColor: border }]}>
            <View style={styles.modalHeading}>
              <ThemedText variant="subtitle">
                {editingTask ? "Edit task" : "New task"}
              </ThemedText>
              <Pressable
                accessibilityLabel="Close"
                accessibilityRole="button"
                onPress={() => setIsModalVisible(false)}
                hitSlop={10}
              >
                <Ionicons name="close" size={23} color={muted} />
              </Pressable>
            </View>
            <TextInput
              accessibilityLabel="Task title"
              value={title}
              onChangeText={setTitle}
              placeholder="Title"
              placeholderTextColor={muted}
              maxLength={100}
              style={inputStyle}
            />
            <TextInput
              accessibilityLabel="Task category"
              value={category}
              onChangeText={setCategory}
              placeholder="Category (e.g. Personal)"
              placeholderTextColor={muted}
              maxLength={40}
              style={inputStyle}
            />
            <TextInput
              accessibilityLabel="Task description"
              value={description}
              onChangeText={setDescription}
              placeholder="Description (optional)"
              placeholderTextColor={muted}
              multiline
              maxLength={500}
              textAlignVertical="top"
              style={[inputStyle, styles.descriptionInput]}
            />
            {saveError ? (
              <ThemedText accessibilityRole="alert" style={[styles.errorText, { color: danger }]}>
                {saveError}
              </ThemedText>
            ) : null}
            <Pressable
              accessibilityRole="button"
              onPress={() => void handleSave()}
              disabled={!title.trim() || !category.trim() || isSaving}
              style={[
                styles.submitButton,
                { backgroundColor: accent },
                (!title.trim() || !category.trim() || isSaving) && styles.disabled,
              ]}
            >
              {isSaving ? (
                <ActivityIndicator color="#07130c" />
              ) : (
                <ThemedText style={styles.submitText}>
                  {editingTask ? "Save changes" : "Add task"}
                </ThemedText>
              )}
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  content: { paddingHorizontal: 20 },
  emptyList: { flexGrow: 1 },
  subtitle: { marginTop: 4, marginBottom: 18 },
  searchBox: {
    height: 48,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderRadius: 13,
  },
  searchInput: { flex: 1, height: "100%", fontSize: 15 },
  filters: { gap: 8, paddingVertical: 14 },
  filterChip: { paddingHorizontal: 13, paddingVertical: 8, borderRadius: 18, borderWidth: 1 },
  filterText: { fontSize: 13, fontWeight: "700" },
  sectionHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 12,
  },
  taskCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderRadius: 15,
  },
  taskContent: { flex: 1, gap: 7 },
  taskTitleRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", gap: 8 },
  taskTitle: { fontSize: 16, lineHeight: 21, flexShrink: 1 },
  categoryBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 9 },
  categoryText: { fontSize: 11, fontWeight: "700" },
  description: { fontSize: 14, lineHeight: 20 },
  actions: { flexDirection: "row", gap: 10 },
  actionButton: { padding: 2 },
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", gap: 10, padding: 22 },
  loader: { marginTop: 28 },
  errorText: { marginBottom: 10, fontSize: 13 },
  retryButton: { paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, marginTop: 5 },
  retryText: { fontWeight: "700", color: "#07130c" },
  addButton: {
    position: "absolute",
    right: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 18,
    paddingVertical: 13,
    borderRadius: 25,
    elevation: 4,
  },
  addButtonText: { fontWeight: "800", color: "#07130c" },
  disabled: { opacity: 0.55 },
  modalBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "#00000080",
  },
  modalCard: {
    gap: 13,
    padding: 20,
    paddingBottom: 32,
    borderTopLeftRadius: 22,
    borderTopRightRadius: 22,
    borderWidth: 1,
  },
  modalHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  input: {
    minHeight: 48,
    paddingHorizontal: 13,
    borderWidth: 1,
    borderRadius: 11,
    fontSize: 15,
  },
  descriptionInput: { minHeight: 100, paddingTop: 12 },
  submitButton: { minHeight: 48, justifyContent: "center", alignItems: "center", borderRadius: 11 },
  submitText: { fontWeight: "800", color: "#07130c" },
});
