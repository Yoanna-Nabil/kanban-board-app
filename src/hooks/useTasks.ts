import { useQuery } from "@tanstack/react-query";
import { fetchTasks } from "@/services/taskService";
import { Task } from "@/types";

export function useTasks() {
  return useQuery<Task[]>({
    //  Cache key for tasks (used to store and invalidate data)
    queryKey: ["tasks"],

    //  Fetch function that hits the API
    queryFn: fetchTasks,
  });
}