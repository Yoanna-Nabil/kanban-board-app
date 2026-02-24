//  Column names used across UI + backend
export type ColumnType = "backlog" | "in_progress" | "review" | "done";

//  A single task entity
export interface Task {
  id: string;
  title: string;
  description: string;
  column: ColumnType;
}

//  Payload used when creating a task
export interface CreateTaskPayload {
  title: string;
  description: string;
  column: ColumnType;
}

//  Payload used when updating a task (partial fields allowed)
export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  column?: ColumnType;
}