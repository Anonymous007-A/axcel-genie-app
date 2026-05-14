"use client";

import React, { useState, useMemo, useEffect } from "react";
import { 
  BarChart3, LineChart, AreaChart, 
  Settings2, ChevronRight, ChevronLeft, 
  Sparkles, CheckCircle2, Layout, 
  MousePointer2, Palette, Database, Loader2
} from "lucide-react";
import { 
  ResponsiveContainer, AreaChart as ReArea, Area, 
  BarChart as ReBar, Bar, LineChart as ReLine, Line, 
  XAxis, YAxis, CartesianGrid, Tooltip 
} from "recharts";

const mockPreviewData = [
  { name: "08:00", val: 120 }, { name: "10:00", val: 115 },
  { name: "12:00", val: 240 }, { name: "14:00", val: 118 },
  { name: "16:00", val: 122 }, { name: "18:00", val: 110 },
];

type WizardStep = "selection" | "config" | "preview" | "success";
type ChartType = "area" | "bar" | "line";

export default function GraphWizard() {
  const [step, setStep] = useState<WizardStep>("selection");
  const [chartType, setChartType] = useState<ChartType>("area");
  const [xAxis, setXAxis] = useState("Timestamp");
  const [yAxis, setYAxis] = useState("TDS (ppm)");
  const [accentColor, setAccentColor] = useState("#22d3ee"); // Default Cyan
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = ["Timestamp", "TDS (ppm)", "pH Level", "Temperature", "Flow Rate"];

  // Logic: Ensure yAxis is never the same as xAxis
  useEffect(() => {
    if (xAxis === yAxis) {
      const fallback = columns.find(col => col !== xAxis);
      if (fallback) setYAxis(fallback);
    }
  }, [xAxis]);

  const handleFinalize = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep("success");
    }, 1500);
  };

  const SelectionStage = () => (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest flex items-center gap-2">
            <MousePointer2 size={12} /> Select X-Axis
          </label>
          <select 
            value={xAxis}
            onChange={(e) => setXAxis(e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 focus:border-brand-500 outline-none transition-all"
          >
            {columns.map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>
        <div className="space-y-3">
          <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest flex items-center gap-2">
            <Database size={12} /> Select Y-Axis
          </label>
          <select 
            value={yAxis}
            onChange={(e) => setYAxis(e.target.value)}
            className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 focus:border-brand-500 outline-none transition-all"
          >
            {columns.filter(c => c !== xAxis).map(col => <option key={col} value={col}>{col}</option>)}
          </select>
        </div>
      </div>
      <div className="p-4 bg-brand-500/5 border border-brand-500/10 rounded-2xl flex items-start gap-4">
        <Sparkles className="text-brand-400 shrink-0" size={20} />
        <p className="text-xs text-surface-400 leading-relaxed">
          <b>Genie Insight:</b> Monitoring <b>{yAxis}</b> against <b>{xAxis}</b> is the standard for water quality compliance.
        </p>
      </div>
    </div>
  );

  const ConfigStage = () => (
    <div className="space-y-8 animate-in slide-in-from-right-4 duration-300">
      <div className="space-y-4">
        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest flex items-center gap-2">
          <Layout size={12} /> Chart Style
        </label>
        <div className="grid grid-cols-3 gap-4">
          {[
            { id: "area", icon: AreaChart, label: "Area" },
            { id: "bar", icon: BarChart3, label: "Bar" },
            { id: "line", icon: LineChart, label: "Line" },
          ].map((type) => (
            <button
              key={type.id}
              onClick={() => setChartType(type.id as ChartType)}
              className={`flex flex-col items-center gap-3 p-4 rounded-2xl border transition-all ${
                chartType === type.id 
                ? "bg-brand-500/10 border-brand-500 text-brand-400" 
                : "bg-surface-800 border-surface-700 text-surface-500 hover:border-surface-600"
              }`}
            >
              <type.icon size={24} />
              <span className="text-[10px] font-bold uppercase">{type.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* --- Visual Accent Picker (Fixed & Re-added) --- */}
      <div className="space-y-4">
        <label className="text-[10px] font-black text-surface-500 uppercase tracking-widest flex items-center gap-2">
          <Palette size={12} /> Visual Accent
        </label>
        <div className="flex gap-4">
          {["#22d3ee", "#818cf8", "#fbbf24", "#34d399", "#f43f5e"].map(color => (
            <button 
              key={color}
              onClick={() => setAccentColor(color)}
              style={{ backgroundColor: color }}
              className={`w-8 h-8 rounded-full border-4 transition-all hover:scale-110 active:scale-95 ${
                accentColor === color ? "border-surface-50 scale-125" : "border-transparent"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );

  const PreviewStage = () => (
    <div className="space-y-6 animate-in zoom-in-95 duration-300">
      <div className="h-[250px] w-full bg-surface-950/50 rounded-2xl p-4 border border-surface-800">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === "area" ? (
            <ReArea data={mockPreviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', border: 'none', borderRadius: '8px' }} />
              <Area type="monotone" dataKey="val" stroke={accentColor} fill={accentColor} fillOpacity={0.2} strokeWidth={3} />
            </ReArea>
          ) : chartType === "bar" ? (
            <ReBar data={mockPreviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <Bar dataKey="val" fill={accentColor} radius={[4, 4, 0, 0]} />
            </ReBar>
          ) : (
            <ReLine data={mockPreviewData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="name" tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <YAxis tick={{fontSize: 10, fill: '#6b7280'}} axisLine={false} tickLine={false} />
              <Line type="monotone" dataKey="val" stroke={accentColor} strokeWidth={3} dot={{ fill: accentColor, r: 4 }} />
            </ReLine>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );

  const SuccessStage = () => (
    <div className="text-center py-10 space-y-4 animate-in zoom-in-95 duration-500">
      <div className="mx-auto w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center">
        <CheckCircle2 size={32} className="text-emerald-400" />
      </div>
      <h3 className="text-xl font-bold text-surface-50">Widget Synchronized!</h3>
      <p className="text-sm text-surface-400 max-w-xs mx-auto">
        Your custom <b>{chartType}</b> chart for <b>{yAxis}</b> is now active in your dashboard.
      </p>
      <button 
        onClick={() => setStep("selection")}
        className="text-brand-400 font-bold text-xs uppercase tracking-widest hover:text-brand-300 transition-colors mt-4"
      >
        Configure New View
      </button>
    </div>
  );

  return (
    <div className="glass-panel rounded-3xl border border-surface-800 overflow-hidden bg-surface-900/10 shadow-2xl">
      <div className="p-6 border-b border-surface-800 flex items-center justify-between bg-surface-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-500 rounded-xl">
            <Settings2 size={20} className="text-surface-950" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-surface-50">Graph Wizard</h2>
            {step !== "success" && (
              <p className="text-[10px] text-surface-500 uppercase tracking-widest font-black">
                Step {step === "selection" ? "1" : step === "config" ? "2" : "3"} of 3
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-8 min-h-[380px] flex flex-col justify-center">
        {step === "selection" && <SelectionStage />}
        {step === "config" && <ConfigStage />}
        {step === "preview" && <PreviewStage />}
        {step === "success" && <SuccessStage />}
      </div>

      {step !== "success" && (
        <div className="p-6 bg-surface-900/40 border-t border-surface-800 flex justify-between">
          {step !== "selection" ? (
            <button
              onClick={() => setStep(step === "preview" ? "config" : "selection")}
              className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold text-surface-400 hover:text-surface-200 transition-all"
            >
              <ChevronLeft size={18} /> Back
            </button>
          ) : <div />}

          <button
            onClick={() => {
              if (step === "selection") setStep("config");
              else if (step === "config") setStep("preview");
              else handleFinalize();
            }}
            disabled={isSubmitting}
            className="flex items-center gap-2 bg-surface-50 hover:bg-white text-surface-950 px-8 py-2.5 rounded-xl text-sm font-bold shadow-lg transition-all"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : (
              step === "preview" ? "Add to Dashboard" : "Next"
            )}
            {!isSubmitting && step !== "preview" && <ChevronRight size={18} />}
          </button>
        </div>
      )}
    </div>
  );
}