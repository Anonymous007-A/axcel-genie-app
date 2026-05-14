"use client";

import React, { useState } from "react";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import Link from "next/link";
import {
  TrendingUp, BarChart3, LineChart, PieChart,
  ScatterChart, AlertCircle, ArrowRight, CheckCircle2
} from "lucide-react";

const CHART_TYPES = [
  { id: "bar", name: "Bar Chart", desc: "Compare categorical data.", icon: BarChart3 },
  { id: "line", name: "Line Chart", desc: "Show trends over time.", icon: LineChart },
  { id: "scatter", name: "Scatter Plot", desc: "Identify correlations.", icon: ScatterChart },
  { id: "pie", name: "Pie Chart", desc: "Display proportions.", icon: PieChart },
];

export default function GraphWizardPage() {
  const workspace = useActiveWorkspace() as any;
  const activeData = workspace.activeData || workspace.data;
  const isLoading = workspace.isLoading;
  const isContextMissing = workspace.isContextMissing;

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedChart, setSelectedChart] = useState<string | null>(null);

  // Guard: if no file selected, show prompt
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <p className="text-surface-400">Loading workspace context...</p>
      </div>
    );
  }

  if (isContextMissing || !activeData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 animate-in fade-in duration-500">
        <div className="glass-panel rounded-2xl p-12 text-center border-dashed border-2 border-surface-700">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-surface-800 mb-6 shadow-lg">
            <AlertCircle size={40} className="text-brand-400" />
          </div>
          <h2 className="text-3xl font-bold text-surface-50 mb-3">No Active File Selected</h2>
          <p className="text-surface-400 text-lg max-w-lg mx-auto mb-8">
            The Graph Wizard needs data to work its magic. Please select a project and a file from the sidebar first.
          </p>
          <button className="btn-genie inline-flex items-center gap-2 text-lg px-6 py-3">
            <ArrowRight size={20} />
            Open Sidebar to Select File
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header & Active Context Indicator */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-bold text-surface-50 tracking-tight flex items-center gap-3">
            Graph Wizard
            <TrendingUp size={32} className="text-accent-cyan" />
          </h2>
          <p className="text-surface-400 mt-2 text-lg">
            3-step AI-powered visualization engine.
          </p>
        </div>

        {/* Active File Target Badge */}
        <div className="flex items-center gap-3 px-4 py-2 bg-blue-500/10 border border-blue-500/20 rounded-xl">
          <span className="text-sm text-surface-400">Target Data:</span>
          <span className="text-sm font-bold text-blue-400">{activeData.fileName}</span>
        </div>
      </div>

      {/* Stepper UI */}
      <div className="flex items-center justify-between relative mb-12 mt-8">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-surface-800 -z-10 rounded-full"></div>
        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-accent-cyan transition-all duration-500 -z-10 rounded-full" style={{ width: step === 1 ? '15%' : step === 2 ? '50%' : '100%' }}></div>

        {[
          { num: 1, label: "Select Chart" },
          { num: 2, label: "Map Columns" },
          { num: 3, label: "Visualize" }
        ].map((s) => (
          <div key={s.num} className="flex flex-col items-center gap-2 bg-surface-950 px-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all duration-300 ${
              step >= s.num ? "bg-accent-cyan text-surface-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]" : "bg-surface-800 text-surface-500"
            }`}>
              {step > s.num ? <CheckCircle2 size={20} /> : s.num}
            </div>
            <span className={`text-sm font-medium ${step >= s.num ? "text-accent-cyan" : "text-surface-500"}`}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Select Chart Type */}
      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-8 duration-500">
          <h3 className="text-xl font-semibold text-surface-100">Step 1: What kind of visualization do you need?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CHART_TYPES.map((chart) => {
              const Icon = chart.icon;
              const isSelected = selectedChart === chart.id;
              return (
                <button
                  key={chart.id}
                  onClick={() => setSelectedChart(chart.id)}
                  className={`relative flex flex-col items-start p-6 rounded-2xl glass-panel transition-all duration-300 text-left hover:-translate-y-1
                    ${isSelected ? "border-accent-cyan shadow-[0_0_20px_rgba(6,182,212,0.15)] bg-accent-cyan/5" : "hover:border-surface-600"}
                  `}
                >
                  <div className={`p-3 rounded-xl mb-4 transition-colors ${isSelected ? "bg-accent-cyan text-surface-900" : "bg-surface-800 text-surface-300"}`}>
                    <Icon size={28} />
                  </div>
                  <h4 className={`text-lg font-bold mb-1 ${isSelected ? "text-accent-cyan" : "text-surface-100"}`}>
                    {chart.name}
                  </h4>
                  <p className="text-sm text-surface-400">{chart.desc}</p>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end pt-6">
            <button
              onClick={() => setStep(2)}
              disabled={!selectedChart}
              className="btn-genie bg-accent-cyan text-surface-900 hover:bg-cyan-400 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 px-8 py-3 text-lg"
            >
              Next Step <ArrowRight size={20} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Placeholder for Column Mapping */}
      {step === 2 && (
        <div className="glass-panel rounded-2xl p-12 text-center animate-in slide-in-from-right-8 duration-500">
          <h3 className="text-2xl font-bold text-surface-100 mb-4">Map Columns (Phase 3)</h3>
          <p className="text-surface-400 max-w-md mx-auto mb-8">
            Here, the AI will automatically fetch the columns of <b>{activeData.fileName}</b> and suggest X and Y axes for your <b>{selectedChart}</b> chart.
          </p>
          <div className="flex items-center justify-center gap-4">
            <button onClick={() => setStep(1)} className="btn-genie-ghost border-surface-600 text-surface-300 hover:text-white">
              Back
            </button>
            <button onClick={() => setStep(3)} className="btn-genie bg-accent-cyan text-surface-900 hover:bg-cyan-400">
              Generate Graph
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Placeholder for Final Render */}
      {step === 3 && (
        <div className="glass-panel rounded-2xl p-12 text-center border border-accent-cyan/30 animate-in zoom-in-95 duration-500">
          <TrendingUp size={64} className="mx-auto text-accent-cyan mb-6 animate-pulse" />
          <h3 className="text-2xl font-bold text-surface-100 mb-2">Your Visualization is Ready</h3>
          <p className="text-surface-400 mb-8">Powered by Recharts & Axcel Genie AI.</p>
          <button onClick={() => setStep(1)} className="btn-genie-ghost border-surface-600 text-surface-300">
            Create Another Chart
          </button>
        </div>
      )}
    </div>
  );
}