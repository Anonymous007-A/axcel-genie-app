"use client";

import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAppStore } from "@/lib/store";
import AnalyticsOverview from "@/components/dashboard/AnalyticsOverview";
import GraphWizard from "@/components/dashboard/GraphWizard";
import DataGrid from "@/components/dashboard/DataGrid";
import type { Project, ApiResponse } from "@/types";
import { Sparkles, Database, FileText, Activity, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";

export default function DashboardHomePage() {
  const { currentUser } = useAppStore();

  const { data: projectsResponse, isLoading, error } = useQuery<ApiResponse<Project[]>>({
    queryKey: ["projects"],
    queryFn: async () => {
      const res = await fetch("/api/projects");
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });

  const projects = projectsResponse?.data || [];

  const dynamicStats = useMemo(() => {
    const totalProjects = projects.length;
    const totalFiles = totalProjects * 5; 
    return [
      { id: 1, label: "Active Workspaces", value: totalProjects.toString(), icon: Database, trend: "Stable" },
      { id: 2, label: "Files Indexed", value: totalFiles.toString(), icon: FileText, trend: "Synced" },
      { id: 3, label: "Total Rows", value: "1.2M", icon: Sparkles, trend: "Processed" },
      { id: 4, label: "System Health", value: error ? "Degraded" : "99.9%", icon: Activity, trend: "Online" },
    ];
  }, [projects, error]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-surface-50">
            Welcome back, {currentUser?.name || "Admin"}
          </h1>
          <p className="text-surface-400 mt-2">
            System overview and active data telemetry.
          </p>
        </div>
        <Link
          href="/tools"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-surface-950 font-bold py-2.5 px-6 rounded-xl transition-all shadow-lg active:scale-95"
        >
          <Sparkles size={18} />
          Open Tool Hub
        </Link>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="glass-panel p-6 rounded-2xl border border-surface-800 animate-pulse h-32 flex items-center justify-center">
              <Loader2 className="text-brand-400 animate-spin" size={20} />
            </div>
          ))
        ) : (
          dynamicStats.map((stat) => (
            <div key={stat.id} className="glass-panel p-6 rounded-2xl border border-surface-800 hover:border-brand-500/10 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="p-2.5 bg-surface-800 rounded-xl">
                  <stat.icon size={20} className="text-brand-400" />
                </div>
                <div className="text-[10px] font-bold text-surface-500 flex items-center gap-1">
                  <ArrowUpRight size={12} /> {stat.trend}
                </div>
              </div>
              <h3 className="text-surface-400 text-xs font-medium">{stat.label}</h3>
              <p className="text-2xl font-bold text-surface-50 mt-1">{stat.value}</p>
            </div>
          ))
        )}
      </div>

      {/* 3. Analytics Section */}
      <section className="space-y-4">
        <h2 className="text-sm font-bold text-surface-400 uppercase tracking-widest font-mono">System Analytics</h2>
        <AnalyticsOverview />
      </section>

      {/* 4. Interactive Workspace (Wizard & Data Grid) */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
        
        {/* Graph Wizard (Takes 2/5 columns on large screens) */}
        <div className="xl:col-span-2">
           <h2 className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-4 font-mono">Visualization Wizard</h2>
           <GraphWizard />
        </div>

        {/* Data Grid (Takes 3/5 columns on large screens) */}
        <div className="xl:col-span-3">
          <h2 className="text-sm font-bold text-surface-400 uppercase tracking-widest mb-4 font-mono">Data Preview</h2>
          <DataGrid />
        </div>

      </div>

    </div>
  );
}