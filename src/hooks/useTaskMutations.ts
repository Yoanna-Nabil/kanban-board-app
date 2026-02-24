import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTask, updateTask, deleteTask, moveTask } from "@/services/taskService";
import { ColumnType, CreateTaskPayload, UpdateTaskPayload } from "@/types";

export function useTaskMutations() {
  //  Gives access to React Query cache
  const queryClient = useQueryClient();

  //  Utility to re-fetch tasks after any mutation
  const refetchTasks = () => queryClient.invalidateQueries({ queryKey: ["tasks"] });

  //  Create task mutation
  const addTaskMutation = useMutation({
    mutationFn: (payload: CreateTaskPayload) => createTask(payload),
    onSuccess: refetchTasks, //  Refresh cached tasks after success
  });

  //  Update task mutation
  const editTaskMutation = useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateTaskPayload }) =>
      updateTask(id, payload),
    onSuccess: refetchTasks,
  });

  //  Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: refetchTasks,
  });

  //  Move task mutation (updates column)
  const moveTaskMutation = useMutation({
    mutationFn: ({ id, column }: { id: string; column: ColumnType }) => moveTask(id, column),
    onSuccess: refetchTasks,
  });

  return {
    addTaskMutation,
    editTaskMutation,
    deleteTaskMutation,
    moveTaskMutation,
  };
}