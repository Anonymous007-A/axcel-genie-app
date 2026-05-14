"use client";

import React, { useState, useMemo } from "react";
import { GENIE_TOOLS, ICON_MAP, type IconKey } from "@/constants/tool";
import { Search, Sparkles, Zap, Database, Filter as FilterIcon } from "lucide-react";
import ToolExecutionModal from "@/components/modals/ToolExecutionModal";
import type { Tool } from "@/types";

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [executingTool, setExecutingTool] = useState<Tool | null>(null);

  const categories = useMemo(() => {
    const cats = new Set(GENIE_TOOLS.map((t) => t.category));
    return ["All", ...Array.from(cats)];
  }, []);

  const filteredTools = useMemo(() => {
    return GENIE_TOOLS.filter((tool) => {
      const matchesSearch =
        tool.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || tool.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-surface-50 flex items-center gap-3">
            <Sparkles className="text-brand-400" size={28} />
            Genie Tool Hub
          </h1>
          <p className="text-surface-400 mt-2">
            AI-powered data operations for your <b>Clario</b> mineral water analytics.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-surface-500" size={18} />
          <input
            type="text"
            placeholder="Search data tools..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-surface-900 border border-surface-800 rounded-xl py-2.5 pl-10 pr-4 text-sm text-surface-200 focus:outline-none focus:border-brand-500/50 transition-all shadow-inner"
          />
        </div>
      </div>

      {/* Category Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <FilterIcon size={16} className="text-surface-500 mr-2 shrink-0" />
        {categories.map((cat, idx) => (
          <button
            key={`cat-${idx}`}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap border ${
              selectedCategory === cat
                ? "bg-brand-500 border-brand-500 text-surface-950 shadow-lg shadow-brand-500/20"
                : "bg-surface-900 border-surface-800 text-surface-400 hover:border-surface-700"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Tools Grid */}
      {filteredTools.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredTools.map((tool, idx) => {
            const ToolIcon = ICON_MAP[tool.iconName as IconKey] || Zap;
            return (
              <div
                key={`tool-${tool.id}-${idx}`}
                className="glass-panel p-5 rounded-2xl border border-surface-800 hover:border-brand-500/30 transition-all group flex flex-col justify-between h-full bg-surface-900/40"
              >
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2.5 bg-surface-800 rounded-xl group-hover:bg-brand-500/10 transition-colors">
                      <ToolIcon size={22} className="text-brand-400" />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[9px] font-black text-surface-500 uppercase tracking-tighter px-2 py-0.5 bg-surface-800/80 rounded">
                        {tool.category}
                      </span>
                      <span
                        className={`text-[8px] font-bold px-1.5 py-0.5 rounded ${
                          tool.minPlan === "ADVANCE"
                            ? "text-amber-400 bg-amber-400/10"
                            : "text-surface-400 bg-surface-800"
                        }`}
                      >
                        {tool.minPlan}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-bold text-surface-50 mb-2 group-hover:text-brand-300 transition-colors">
                    {tool.label}
                  </h3>
                  <p className="text-xs text-surface-400 leading-relaxed mb-6 line-clamp-2">
                    {tool.description}
                  </p>
                </div>

                <button
                  onClick={() => setExecutingTool(tool)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 bg-surface-800 hover:bg-brand-500 text-surface-200 hover:text-surface-950 text-sm font-bold rounded-xl transition-all border border-surface-700 hover:border-brand-500"
                >
                  <Zap size={14} fill="currentColor" />
                  Run Tool
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-24 glass-panel rounded-3xl border-dashed border-surface-800">
          <Database className="mx-auto text-surface-700 mb-4 opacity-20" size={64} />
          <h3 className="text-surface-400 font-bold text-lg">No tools found matching your criteria</h3>
          <p className="text-surface-600 text-sm mt-1">Try a different search term or category.</p>
        </div>
      )}

      {executingTool && (
        <ToolExecutionModal tool={executingTool} onClose={() => setExecutingTool(null)} />
      )}
    </div>
  );
}