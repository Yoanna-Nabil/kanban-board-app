import { create } from "zustand";

//  UI-only store (NOT API data)
// Used for searchQuery because it’s purely presentation/state of input
interface TaskUIStore {
  searchQuery: string;                 //  current search string
  setSearchQuery: (query: string) => void; //  updates search string
}

export const useTaskStore = create<TaskUIStore>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
}));