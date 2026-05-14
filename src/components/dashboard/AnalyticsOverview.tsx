"use client";

import React from "react";
import { 
  XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, AreaChart, Area 
} from "recharts";
import { Droplets, Activity, Zap, HardDrive } from "lucide-react";

const waterData = [
  { time: "08:00", tds: 120, ph: 7.2, production: 400 },
  { time: "10:00", tds: 115, ph: 7.1, production: 550 },
  { time: "12:00", tds: 125, ph: 7.0, production: 600 },
  { time: "14:00", tds: 110, ph: 7.2, production: 450 },
  { time: "16:00", tds: 118, ph: 7.3, production: 700 },
  { time: "18:00", tds: 122, ph: 7.1, production: 500 },
];

export default function AnalyticsOverview() {
  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* 1. Quick Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg TDS Level", value: "118 ppm", icon: Droplets, color: "text-cyan-400" },
          { label: "System Health", value: "98.2%", icon: Activity, color: "text-emerald-400" },
          { label: "Power Usage", value: "4.2 kWh", icon: Zap, color: "text-amber-400" },
          { label: "Daily Output", value: "3,200 L", icon: HardDrive, color: "text-purple-400" },
        ].map((stat, i) => (
          <div key={i} className="glass-panel p-5 rounded-2xl border border-surface-800/50 bg-surface-900/10 hover:border-surface-700 transition-all">
            <div className="flex items-center justify-between mb-3">
              <div className={`p-2 rounded-lg bg-surface-800/50 ${stat.color}`}>
                <stat.icon size={18} />
              </div>
              <span className="text-[10px] font-bold text-surface-500 uppercase font-mono tracking-tighter">Live</span>
            </div>
            <p className="text-surface-400 text-xs font-medium">{stat.label}</p>
            <h3 className="text-xl font-bold text-surface-50 mt-1">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* 2. Water Plant Analytics Chart */}
      <div className="glass-panel p-6 rounded-2xl border border-surface-800/50 bg-surface-900/20">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-bold text-surface-50">Plant Analytics</h3>
            <p className="text-xs text-surface-500">Real-time TDS monitoring for Clario Industries</p>
          </div>
          <div className="px-3 py-1 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            <span className="text-[10px] font-bold text-cyan-400 uppercase">Sensors Online</span>
          </div>
        </div>

        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={waterData}>
              <defs>
                <linearGradient id="colorTds" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" vertical={false} />
              <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fill: '#6b7280', fontSize: 11}} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '12px', fontSize: '12px' }}
                itemStyle={{ color: '#22d3ee' }}
              />
              <Area type="monotone" dataKey="tds" stroke="#22d3ee" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTds)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}