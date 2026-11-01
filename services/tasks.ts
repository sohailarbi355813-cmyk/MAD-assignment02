import AsyncStorage from "@react-native-async-storage/async-storage";

const TASKS_STORAGE_KEY = "@tradepulse/tasks";

export type TaskRecord = {
  id: string;
  title: string;
  description: string;
  category: string;
  createdAt: string;
};

function isTaskRecord(value: unknown): value is TaskRecord {
  if (typeof value !== "object" || value === null) {
    return false;
  }

  const task = value as Record<string, unknown>;

  return (
    typeof task.id === "string" &&
    typeof task.title === "string" &&
    typeof task.description === "string" &&
    typeof task.category === "string" &&
    typeof task.createdAt === "string"
  );
}

export async function loadTasks(): Promise<TaskRecord[]> {
  const storedTasks = await AsyncStorage.getItem(TASKS_STORAGE_KEY);
  if (storedTasks === null) {
    return [];
  }

  const parsedTasks: unknown = JSON.parse(storedTasks);
  if (!Array.isArray(parsedTasks) || !parsedTasks.every(isTaskRecord)) {
    throw new Error("Saved tasks have an invalid format.");
  }

  return parsedTasks;
}

export function saveTasks(tasks: TaskRecord[]): Promise<void> {
  return AsyncStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}
