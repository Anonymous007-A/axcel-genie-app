"use client";

import React, { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { X, FolderPlus, Loader2 } from "lucide-react";

interface NewProjectModalProps {
  onClose: () => void;
}

export default function NewProjectModal({ onClose }: NewProjectModalProps) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const handleCreate = async () => {
    if (!name.trim()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) throw new Error("Failed to create project");
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      onClose();
    } catch (error) {
      alert("Failed to create project");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-surface-950/80 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="w-full max-w-md glass-panel rounded-2xl border border-surface-700/50 overflow-hidden shadow-2xl">
        <div className="p-5 border-b border-surface-800 flex items-center justify-between bg-surface-900/50">
          <h3 className="text-lg font-bold text-surface-50">Create New Project</h3>
          <button onClick={onClose} className="p-2 hover:bg-surface-800 rounded-lg text-surface-400 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <input
            type="text"
            placeholder="Project Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 focus:outline-none focus:border-brand-500 transition-colors"
            autoFocus
          />
          <button
            onClick={handleCreate}
            disabled={!name.trim() || loading}
            className="w-full btn-genie py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              <FolderPlus size={18} />
            )}
            {loading ? "Creating..." : "Create Project"}
          </button>
        </div>
      </div>
    </div>
  );
}