import axios from "axios";
import { Task, CreateTaskPayload, UpdateTaskPayload, ColumnType } from "@/types";

//  Base API url (env override supported)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

//  Axios instance for consistent baseURL + timeout
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

//  Fetch all tasks from backend
export const fetchTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get<Task[]>("/tasks");
    return response.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

//  Fetch tasks of one column (client-side filtering)
export const fetchTasksByColumn = async (column: ColumnType, search?: string): Promise<Task[]> => {
  try {
    const tasks = await fetchTasks();

    //  Filter by column first
    let filtered = tasks.filter((task) => task.column === column);

    //  Optional search filtering (title/description)
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(searchLower) ||
          task.description.toLowerCase().includes(searchLower)
      );
    }

    return filtered;
  } catch (error) {
    console.error(`Error fetching tasks for column ${column}:`, error);
    throw error;
  }
};

//  Create a new task
export const createTask = async (payload: CreateTaskPayload): Promise<Task> => {
  try {
    const response = await apiClient.post<Task>("/tasks", payload);
    return response.data;
  } catch (error) {
    console.error("Error creating task:", error);
    throw error;
  }
};

//  Update an existing task (partial patch)
export const updateTask = async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
  try {
    console.log("API_BASE_URL:", API_BASE_URL);
console.log("PUT URL:", `/tasks/${id}`);
    const response = await apiClient.put<Task>(`/tasks/${id}`, payload);
    return response.data;
  } catch (error) {
    console.error(`Error updating task ${id}:`, error);
    throw error;
  }
};

// Delete a task by id
export const deleteTask = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/tasks/${id}`);
  } catch (error) {
    console.error(`Error deleting task ${id}:`, error);
    throw error;
  }
};

//  Move a task = update column
export const moveTask = async (id: string, newColumn: ColumnType): Promise<Task> => {
  try {
    return await updateTask(id, { column: newColumn });
  } catch (error) {
    console.error(`Error moving task ${id}:`, error);
    throw error;
  }
};