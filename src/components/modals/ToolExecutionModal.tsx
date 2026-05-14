"use client";

import React, { useState } from "react";
import type { Tool } from "@/types";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { useSession } from "next-auth/react";
import { ICON_MAP, type IconKey } from "@/constants/tool";
import {
  X, Play, Loader2, CheckCircle2,
  AlertCircle, ShieldAlert, Sparkles,
  Zap, Database, FileText, Cpu, Info, Settings2
} from "lucide-react";

interface ExecutionResult {
  count: number;
  msg: string;
  executionId?: string;
}

interface ToolExecutionModalProps {
  tool: Tool | null;
  onClose: () => void;
}

// Plan Hierarchy for Gating
const PLAN_LEVELS: Record<string, number> = {
  "BASIC": 1,
  "PRO": 2,
  "ADVANCE": 3
};

export default function ToolExecutionModal({ tool, onClose }: ToolExecutionModalProps) {
  // 1. Workspace context – clean destructure (no 'as any')
  const { activeData, isLoading: isLoadingWorkspace, isContextMissing } = useActiveWorkspace();
  // 2. Real user plan from auth session
  const { data: session } = useSession();
  const userPlan = session?.user?.plan || "BASIC";

  // 3. Local component state
  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState("");
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [config] = useState<Record<string, any>>({
    optimizationLevel: 'standard',
    preserveOriginal: true
  });

  // Early exit
  if (!tool) return null;

  const toolMinPlan = tool.minPlan || "BASIC";
  const isPlanRestricted = PLAN_LEVELS[userPlan] < PLAN_LEVELS[toolMinPlan];
  const ToolIcon = tool.iconName ? ICON_MAP[tool.iconName as IconKey] : Sparkles;

  // Core execution handler
  const handleRunTool = async () => {
    // Use active file ID directly (no fallback confusion)
    const targetFileId = activeData?.fileId;
    if (!targetFileId) {
      setErrorMessage("No file selected. Please choose a dataset first.");
      setStatus('error');
      return;
    }

    setStatus('processing');
    setErrorMessage("");
    setResult(null);

    try {
      const response = await fetch("/api/tools/execute", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          toolId: tool.id,
          fileId: targetFileId,
          config: config,
        }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || "Execution failed on the Genie server.");
      }

      const { rowsProcessed, message, executionId } = responseData.data;
      setResult({
        count: rowsProcessed,
        msg: message || "Operation completed successfully!",
        executionId
      });
      setStatus('success');
    } catch (error: any) {
      console.error("GENIE_EXECUTION_ERROR:", error);
      setErrorMessage(error.message || "An unexpected error occurred during processing.");
      setStatus('error');
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-surface-950/90 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-xl glass-panel rounded-3xl shadow-2xl border border-surface-700/50 overflow-hidden bg-surface-900/80">

        {/* Header */}
        <div className="p-6 border-b border-surface-800 flex items-center justify-between bg-gradient-to-r from-brand-900/20 to-transparent">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-brand-400/10 rounded-2xl border border-brand-400/20 shadow-inner">
              <ToolIcon size={24} className="text-brand-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-surface-50 tracking-tight">{tool.label}</h3>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-[10px] uppercase tracking-widest text-surface-500 font-bold font-mono">
                  Clario AI Engine
                </span>
                {isPlanRestricted && (
                  <span className="px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] text-amber-500 font-bold uppercase">
                    Requires {toolMinPlan}
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-surface-800 rounded-xl text-surface-400 transition-all hover:rotate-90">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-10">
          {isLoadingWorkspace ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-6 text-center">
              <div className="relative">
                <Loader2 size={48} className="text-brand-400 animate-spin" />
                <div className="absolute inset-0 blur-xl bg-brand-400/20 animate-pulse" />
              </div>
              <div className="space-y-1">
                <p className="text-surface-50 font-bold">Initializing Workspace</p>
                <p className="text-surface-400 text-sm animate-pulse">Checking credentials for Clario Cloud...</p>
              </div>
            </div>
          ) : isContextMissing ? (
            <div className="text-center space-y-8 py-4 animate-in slide-in-from-bottom-4">
              <div className="mx-auto w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20">
                <AlertCircle size={36} className="text-amber-500" />
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-surface-50">Target Missing</h4>
                <p className="text-surface-400 text-sm leading-relaxed max-w-sm mx-auto">
                  Please select a file from a project first.
                </p>
              </div>
              <button onClick={onClose} className="w-full btn-genie py-4 text-lg font-bold shadow-lg shadow-brand-400/10">
                Select Dataset First
              </button>
            </div>
          ) : status === 'processing' ? (
            <div className="text-center space-y-10 py-6">
              <div className="relative mx-auto w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 border-[6px] border-brand-400/5 rounded-full" />
                <div className="absolute inset-0 border-[6px] border-t-brand-400 rounded-full animate-spin" />
                <div className="absolute inset-6 bg-brand-400/5 rounded-full flex items-center justify-center border border-brand-400/10">
                  <Cpu size={44} className="text-brand-400 animate-pulse" />
                </div>
              </div>
              <div className="space-y-3">
                <h4 className="text-2xl font-bold text-surface-50 tracking-tight">Processing Pipeline Active</h4>
                <p className="text-sm text-surface-400">Optimizing <b>{activeData?.fileName}</b> via encrypted API tunnel.</p>
              </div>
            </div>
          ) : status === 'success' ? (
            <div className="text-center space-y-8 animate-in zoom-in-95 duration-500">
              <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center border border-emerald-500/20 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <CheckCircle2 size={48} className="text-emerald-500" />
              </div>
              <div className="space-y-4">
                <h4 className="text-3xl font-extrabold text-surface-50 tracking-tighter">Genie Task Completed!</h4>
                <p className="text-base text-surface-300 px-4 leading-relaxed font-medium">{result?.msg}</p>
                <div className="grid grid-cols-2 gap-4 mt-8">
                  <div className="p-5 bg-surface-800/40 rounded-3xl border border-surface-700/50 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <Database size={14} className="text-surface-500" />
                      <span className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">Rows Processed</span>
                    </div>
                    <p className="text-3xl font-mono text-brand-400 font-black">{result?.count ?? 0}</p>
                  </div>
                  <div className="p-5 bg-surface-800/40 rounded-3xl border border-surface-700/50 shadow-inner">
                    <div className="flex items-center gap-2 mb-2">
                      <Zap size={14} className="text-surface-500" />
                      <span className="text-[10px] text-surface-500 font-bold uppercase tracking-wider">Analysis Status</span>
                    </div>
                    <p className="text-xl text-emerald-500 font-black uppercase tracking-tight">Verified</p>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="w-full bg-surface-50 text-surface-950 font-black py-5 rounded-2xl shadow-2xl hover:bg-white transition-all active:scale-[0.97] text-lg uppercase tracking-tight">
                Return to Workspace
              </button>
            </div>
          ) : status === 'error' ? (
            <div className="text-center space-y-8 animate-in slide-in-from-top-4">
              <div className="mx-auto w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center border border-red-500/20">
                <ShieldAlert size={36} className="text-red-500" />
              </div>
              <div className="space-y-3 px-6">
                <h4 className="text-2xl font-bold text-surface-50">Operation Failed</h4>
                <p className="text-sm text-red-400/80 leading-relaxed font-bold bg-red-500/5 py-3 rounded-xl border border-red-500/10">{errorMessage}</p>
              </div>
              <div className="flex gap-4">
                <button onClick={() => setStatus('idle')} className="flex-1 bg-surface-800 text-surface-100 py-4 rounded-xl border border-surface-700 hover:bg-surface-700 transition-all font-black text-sm uppercase">Retry Connection</button>
                <button onClick={onClose} className="px-6 bg-transparent text-surface-500 py-4 rounded-xl border border-surface-800 hover:text-surface-300 font-bold text-sm uppercase">Dismiss</button>
              </div>
            </div>
          ) : (
            /* IDLE STATE */
            <div className="space-y-8">
              <div className="space-y-4">
                {activeData?.isLocked && (
                  <div className="flex items-start gap-4 p-5 bg-red-500/5 border border-red-500/20 rounded-2xl shadow-inner">
                    <ShieldAlert size={20} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-red-400 tracking-tight">Data Integrity Lock</p>
                      <p className="text-[11px] text-red-500/80 mt-0.5 leading-tight">This dataset is currently read-only. Tool execution will not modify the primary storage record.</p>
                    </div>
                  </div>
                )}

                {isPlanRestricted && (
                  <div className="flex items-start gap-4 p-5 bg-amber-500/5 border border-amber-500/20 rounded-2xl">
                    <Zap size={20} className="text-amber-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-amber-500 tracking-tight">Advanced Feature Locked</p>
                      <p className="text-[11px] text-amber-500/80 mt-0.5 leading-tight">
                        Your current <b>{userPlan}</b> plan does not include this tool. Upgrade to <b>{toolMinPlan}</b> to proceed.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="p-6 bg-surface-950/40 border border-surface-800 rounded-3xl space-y-5">
                <div className="flex items-center justify-between border-b border-surface-800/50 pb-3">
                  <div className="flex items-center gap-2">
                    <Settings2 size={14} className="text-surface-500" />
                    <span className="text-[10px] font-black text-surface-500 uppercase tracking-[0.2em]">Deployment Context</span>
                  </div>
                  <Info size={14} className="text-surface-700 cursor-help" />
                </div>
                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-2">
                    <div className="flex items-center gap-1.5">
                      <Database size={10} className="text-brand-400" />
                      <span className="text-[9px] text-surface-500 font-black uppercase tracking-wider">Enterprise Node</span>
                    </div>
                    <p className="text-xs font-bold text-surface-100 truncate">{activeData?.projectName || "System Core"}</p>
                  </div>
                  <div className="space-y-2 text-right">
                    <div className="flex items-center gap-1.5 justify-end">
                      <span className="text-[9px] text-surface-500 font-black uppercase tracking-wider">Target Archive</span>
                      <FileText size={10} className="text-brand-400" />
                    </div>
                    <p className="text-xs font-bold text-surface-100 truncate">{activeData?.fileName || "Active_Data.csv"}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-5 pt-4">
                <button
                  onClick={handleRunTool}
                  disabled={activeData?.isLocked || isPlanRestricted}
                  className="w-full btn-genie py-6 flex items-center justify-center gap-4 text-xl font-black disabled:opacity-40 disabled:grayscale transition-all hover:scale-[1.01] active:scale-[0.99] shadow-2xl shadow-brand-400/20"
                >
                  {isPlanRestricted ? (
                    <>UPGRADE TO {toolMinPlan} TO UNLOCK</>
                  ) : (
                    <>
                      <Play size={24} fill="currentColor" />
                      INITIALIZE {tool.label.toUpperCase()}
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-2">
                  <div className="h-px w-8 bg-surface-800" />
                  <p className="text-[10px] text-surface-600 font-bold uppercase tracking-widest">Secure AES-256 Cloud Processing</p>
                  <div className="h-px w-8 bg-surface-800" />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}