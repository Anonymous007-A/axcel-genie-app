import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { User } from "@/types";

interface AppState {
  // 1. UI STATE
  sidebarOpen: boolean;
  
  // 2. WORKSPACE CONTEXT (Sirf IDs, metadata hooks se derive hoga)
  activeProjectId: string | null;
  activeFileId: string | null;
  
  // 3. AUTH STATE (Development ke liye persist kar rahe hain)
  currentUser: User | null;

  // ACTIONS
  toggleSidebar: () => void;
  setSidebar: (open: boolean) => void;
  setActiveContext: (projectId: string | null, fileId: string | null) => void;
  clearContext: () => void;
  setCurrentUser: (user: User | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial States
      sidebarOpen: true,
      activeProjectId: null,
      activeFileId: null,
      currentUser: null,

      // Actions
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
      
      setSidebar: (open) => set({ sidebarOpen: open }),

      setActiveContext: (projectId, fileId) => 
        set({ activeProjectId: projectId, activeFileId: fileId }),

      clearContext: () => 
        set({ activeProjectId: null, activeFileId: null }),

      setCurrentUser: (user) => set({ currentUser: user }),
    }),
    {
      name: "axcel-genie-storage", // Pro prefix
      storage: createJSONStorage(() => localStorage),
      // PARTIALIZE: Sirf wahi data save hoga jo refresh ke baad kaam ka hai.
      // Server-side lists (Projects/Files) yahan honi hi nahi chahiye.
      partialize: (state) => ({ 
        sidebarOpen: state.sidebarOpen,
        activeProjectId: state.activeProjectId,
        activeFileId: state.activeFileId,
        currentUser: state.currentUser 
      }),
    }
  )
);