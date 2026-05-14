"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import type { Project, WorkspaceFile, ApiResponse } from "@/types";

// Syncing with our global cache time (5 minutes)
const STALE_TIME = 5 * 60 * 1000;

export function useActiveWorkspace() {
  const { activeProjectId, activeFileId } = useAppStore();

  // 1. Fetch Projects List (Reactive)
  const { 
    data: projectsData, 
    isLoading: projectsLoading, 
    error: projectsError 
  } = useQuery<ApiResponse<Project[]>>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    staleTime: STALE_TIME,
  });

  // 2. Fetch Files for the active project (Reactive)
  const { 
    data: filesData, 
    isLoading: filesLoading, 
    error: filesError 
  } = useQuery<ApiResponse<WorkspaceFile[]>>({
    queryKey: ["projects", activeProjectId, "files"],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${activeProjectId}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      return res.json();
    },
    enabled: !!activeProjectId, // Jab tak Project select nahi, tab tak fetch nahi
    staleTime: STALE_TIME,
  });

  // 3. Data Matching Logic
  const activeProject = projectsData?.data.find((p) => p.id === activeProjectId) || null;
  const activeFile = filesData?.data.find((f) => f.id === activeFileId) || null;

  // 4. Combined Result
  return {
    // Asli data jo components use karenge
    activeData: (activeProject && activeFile) ? {
      projectId: activeProject.id,
      projectName: activeProject.name,
      fileId: activeFile.id,
      fileName: activeFile.name,
      rows: activeFile.rows,
      isLocked: activeFile.locked,
      breadcrumb: `${activeProject.name} / ${activeFile.name}`
    } : null,
    
    // Status flags
    isLoading: projectsLoading || (!!activeProjectId && filesLoading),
    error: projectsError || filesError || null,
    isContextMissing: !activeProjectId || !activeFileId
  };
}
