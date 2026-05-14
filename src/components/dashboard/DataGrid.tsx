"use client";

import React, { useState, useMemo } from "react";
import { Table, ArrowUpDown, FileDown, Maximize2, Loader2 } from "lucide-react";
import { useAppStore } from "@/lib/store";

// Mock Data (will later be replaced by API call based on activeFileId)
const initialRows = [
  { id: 1, timestamp: "2026-05-12 08:00", tds: 120, ph: 7.2, status: "Clean" },
  { id: 2, timestamp: "2026-05-12 09:00", tds: 115, ph: 7.1, status: "Clean" },
  { id: 3, timestamp: "2026-05-12 10:00", tds: 240, ph: 6.8, status: "Action Required" },
  { id: 4, timestamp: "2026-05-12 11:00", tds: 118, ph: 7.3, status: "Clean" },
  { id: 5, timestamp: "2026-05-12 12:00", tds: 122, ph: 7.1, status: "Clean" },
];

type SortKey = "id" | "timestamp" | "tds" | "ph" | "status";

export default function DataGrid() {
  const { activeFileId } = useAppStore(); // Connected to global store
  
  const [sortKey, setSortKey] = useState<SortKey>("id");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [isExporting, setIsExporting] = useState(false);

  // 1. Client-Side Sorting Logic
  const sortedRows = useMemo(() => {
    return [...initialRows].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      
      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
  }, [sortKey, sortOrder]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  // 2. Export Simulation (Feedback instead of dead click)
  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      setIsExporting(false);
      // In production, this triggers actual CSV download
    }, 1500);
  };

  return (
    <div className="glass-panel rounded-2xl border border-surface-800 overflow-hidden bg-surface-900/20">
      
      {/* Grid Toolbar */}
      <div className="p-4 border-b border-surface-800 flex flex-col sm:flex-row items-center justify-between gap-4 bg-surface-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-brand-500/10 rounded-lg">
            <Table size={18} className="text-brand-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-surface-50">
              {activeFileId ? "Active Dataset Preview" : "System Telemetry Overview"}
            </h3>
            <p className="text-[10px] text-surface-500 uppercase tracking-tighter">
              Showing Top 5 Rows
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="p-2 hover:bg-surface-800 rounded-lg text-surface-400 transition-colors border border-transparent"
            title="Expand Grid (Coming Soon)"
          >
            <Maximize2 size={16} />
          </button>
          
          <button 
  disabled 
  className="p-2 bg-surface-800/30 rounded-lg text-surface-600 cursor-not-allowed opacity-40 border border-surface-800/50"
  title="Fullscreen (Coming Soon)"
>
  <Maximize2 size={16} />
</button>
           
        </div>
      </div>

      {/* Spreadsheet View */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[600px]">
          <thead>
            <tr className="bg-surface-800/30">
              {[
                { label: "ID", key: "id" },
                { label: "Timestamp", key: "timestamp" },
                { label: "TDS (ppm)", key: "tds" },
                { label: "pH Level", key: "ph" },
                { label: "Status", key: "status" },
              ].map((header) => (
                <th 
                  key={header.key} 
                  onClick={() => handleSort(header.key as SortKey)}
                  className="px-6 py-3 text-[10px] font-black text-surface-500 uppercase tracking-widest border-b border-surface-800 group cursor-pointer hover:bg-surface-800/50 transition-colors select-none"
                >
                  <div className="flex items-center justify-between">
                    <span className="group-hover:text-surface-300 transition-colors">{header.label}</span>
                    <ArrowUpDown 
                      size={12} 
                      className={`transition-colors ${sortKey === header.key ? 'text-brand-400' : 'text-surface-600 opacity-0 group-hover:opacity-100'}`} 
                    />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-800">
            {sortedRows.map((row) => (
              <tr key={row.id} className="hover:bg-surface-800/50 transition-colors group">
                <td className="px-6 py-4 text-xs font-mono text-surface-500">{row.id}</td>
                <td className="px-6 py-4 text-xs text-surface-300 font-medium">{row.timestamp}</td>
                <td className="px-6 py-4 text-xs">
                  <span className={`font-bold ${row.tds > 200 ? "text-amber-400" : "text-cyan-400"}`}>
                    {row.tds}
                  </span>
                </td>
                <td className="px-6 py-4 text-xs text-surface-300">{row.ph}</td>
                <td className="px-6 py-4 text-xs">
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                    row.status === "Clean" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                  }`}>
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Replaced Fake Load More with Context Info */}
      <div className="p-4 border-t border-surface-800 bg-surface-900/40 flex justify-between items-center text-[10px] uppercase font-bold text-surface-500 tracking-widest">
        <span>View limited to first 5 rows</span>
        <span className="text-brand-400/50">Pro Plan Feature</span>
      </div>
    </div>
  );
}