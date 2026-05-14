"use client";

import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePathname } from "next/navigation";
import { useAppStore } from "@/lib/store";
import type { Project, WorkspaceFile, ApiResponse } from "@/types";
import {
  Folder, FileText, ChevronDown, ChevronRight, Loader2, Database, Plus,
  Home, Wrench, TrendingUp, Users, Settings, MessageCircle
} from "lucide-react";
import Link from "next/link";
import UploadModal from "@/components/modals/UploadModal";
import NewProjectModal from "@/components/modals/NewProjectModal";

// Sub-component: Project Folder Logic
function ProjectNode({ project }: { project: Project }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const { activeFileId, setActiveContext } = useAppStore();

  const { data: filesData, isLoading } = useQuery<ApiResponse<WorkspaceFile[]>>({
    queryKey: ["projects", project.id, "files"],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${project.id}/files`);
      if (!res.ok) throw new Error("Failed to fetch files");
      return res.json();
    },
    enabled: isExpanded,
    staleTime: 5 * 60 * 1000,
  });

  return (
    <div className="mb-1">
      <div className="group flex items-center justify-between pr-2 hover:bg-surface-800 rounded-lg transition-colors">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex-1 flex items-center gap-2 px-3 py-2 text-sm text-surface-200"
        >
          {isExpanded ? <ChevronDown size={14} className="text-surface-400" /> : <ChevronRight size={14} className="text-surface-400" />}
          <Folder size={16} className={isExpanded ? "text-brand-400" : "text-surface-400"} />
          <span className="truncate font-medium">{project.name}</span>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowUploadModal(true);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-surface-700 rounded text-surface-400 hover:text-brand-400 transition-all"
          title="Upload file to this project"
        >
          <Plus size={16} />
        </button>
      </div>

      {isExpanded && (
        <div className="ml-6 pl-2 border-l border-surface-800 mt-1 space-y-1 py-1">
          {isLoading ? (
            <div className="px-3 py-2 text-[10px] text-surface-500">Loading...</div>
          ) : (
            filesData?.data?.map((file) => {
              const isActive = activeFileId === file.id;
              return (
                <button
                  key={file.id}
                  onClick={() => setActiveContext(project.id, file.id)}
                  className={`w-full flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg transition-all ${
                    isActive ? "bg-brand-500/10 text-brand-300" : "text-surface-400 hover:text-surface-200"
                  }`}
                >
                  <FileText size={14} />
                  <span className="truncate">{file.name}</span>
                </button>
              );
            })
          )}
        </div>
      )}

      {showUploadModal && (
        <UploadModal projectId={project.id} onClose={() => setShowUploadModal(false)} />
      )}
    </div>
  );
}

// Main navigation links
const mainNavItems = [
  { label: "Home", href: "/", icon: Home },
  { label: "Toolbox", href: "/tools", icon: Wrench },
  { label: "Graph Wizard", href: "/graph-wizard", icon: TrendingUp },
  { label: "Team", href: "/team", icon: Users },
];

const bottomNavItems = [
  { label: "Settings", href: "/settings", icon: Settings },
  { label: "Help", href: "/help", icon: MessageCircle },
];

export default function Sidebar() {
  const { sidebarOpen } = useAppStore();
  const pathname = usePathname();
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);

  const { data: projectsData, isLoading, error } = useQuery<ApiResponse<Project[]>>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  if (!sidebarOpen) return null;

  return (
    <aside className="w-64 h-screen bg-surface-950 border-r border-surface-800 flex flex-col flex-shrink-0 transition-all duration-300 z-40 relative">
      {/* Brand Header */}
      <div className="p-4 border-b border-surface-800 flex items-center gap-3">
        <div className="p-2 bg-brand-500/20 rounded-lg border border-brand-500/30">
          <Database size={20} className="text-brand-400" />
        </div>
        <h2 className="font-bold text-lg text-surface-50 tracking-wide">Clario<span className="text-brand-400">Genie</span></h2>
      </div>

      {/* Main Navigation */}
      <nav className="px-3 py-4 border-b border-surface-800">
        <ul className="space-y-1">
          {mainNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-brand-400/10 text-brand-200 border border-brand-400/30"
                      : "text-surface-300 hover:bg-surface-800 hover:text-surface-100 border border-transparent"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-brand-400" : "text-surface-500"} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Workpaces Section */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="flex items-center justify-between px-3 mb-3">
          <h3 className="text-[10px] font-bold text-surface-500 uppercase tracking-wider">
            Your Workspaces
          </h3>
          <button
            onClick={() => setShowNewProjectModal(true)}
            className="p-1 hover:bg-surface-800 rounded text-surface-400 hover:text-brand-400 transition-colors"
            title="New Project"
          >
            <Plus size={14} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center p-6">
            <Loader2 size={24} className="text-brand-400 animate-spin" />
          </div>
        ) : error ? (
          <div className="text-xs text-red-400 p-3 bg-red-500/10 rounded-lg border border-red-500/20">
            Failed to load projects. Ensure APIs are running.
          </div>
        ) : (
          projectsData?.data?.map((project) => (
            <ProjectNode key={project.id} project={project} />
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="border-t border-surface-800 p-3">
        <ul className="space-y-1">
          {bottomNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm transition-all duration-200 ${
                    isActive
                      ? "bg-brand-400/10 text-brand-200 border border-brand-400/30"
                      : "text-surface-300 hover:bg-surface-800 hover:text-surface-100 border border-transparent"
                  }`}
                >
                  <Icon size={16} className={isActive ? "text-brand-400" : "text-surface-500"} />
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Modals */}
      {showNewProjectModal && (
        <NewProjectModal onClose={() => setShowNewProjectModal(false)} />
      )}
    </aside>
  );
}