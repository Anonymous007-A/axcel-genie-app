"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { User, Shield, Moon, Sun, Monitor, Globe, Clock, Save, CheckCircle2 } from "lucide-react";

export default function SettingsPage() {
  const { currentUser, setCurrentUser } = useAppStore();
  const [theme, setTheme] = useState("dark");
  const [dateFormat, setDateFormat] = useState("DD/MM/YYYY");
  const [timeFormat, setTimeFormat] = useState("HH:mm:ss");
  const [language, setLanguage] = useState("English");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // TODO: API call to save settings
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-surface-50">Settings</h1>
        <p className="text-surface-400 mt-2">Manage your workspace preferences and account settings.</p>
      </div>

      {/* Profile Section */}
      <div className="glass-panel rounded-2xl border border-surface-800 p-6 space-y-4">
        <h2 className="text-lg font-bold text-surface-100 flex items-center gap-2">
          <User size={20} className="text-brand-400" /> Profile
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-surface-500 uppercase tracking-wider">Name</label>
            <p className="text-surface-100 font-medium">{currentUser?.name || "Amit Sharma"}</p>
          </div>
          <div>
            <label className="text-xs text-surface-500 uppercase tracking-wider">Email</label>
            <p className="text-surface-100 font-medium">{currentUser?.email || "amit@clario.com"}</p>
          </div>
          <div>
            <label className="text-xs text-surface-500 uppercase tracking-wider">Plan</label>
            <p className="text-brand-400 font-bold">{currentUser?.plan || "PRO"}</p>
          </div>
          <div>
            <label className="text-xs text-surface-500 uppercase tracking-wider">Role</label>
            <p className="text-surface-100 font-medium">{currentUser?.role || "ADMIN"}</p>
          </div>
        </div>
      </div>

      {/* Preferences */}
      <div className="glass-panel rounded-2xl border border-surface-800 p-6 space-y-6">
        <h2 className="text-lg font-bold text-surface-100 flex items-center gap-2">
          <Shield size={20} className="text-brand-400" /> Preferences
        </h2>

        {/* Theme */}
        <div>
          <label className="text-xs text-surface-500 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Monitor size={14} /> Theme
          </label>
          <div className="flex gap-3">
            {[
              { id: "dark", icon: Moon, label: "Dark" },
              { id: "light", icon: Sun, label: "Light" },
              { id: "system", icon: Monitor, label: "System" },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setTheme(opt.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                  theme === opt.id
                    ? "bg-brand-500/10 border-brand-500 text-brand-400"
                    : "bg-surface-800 border-surface-700 text-surface-400 hover:border-surface-600"
                }`}
              >
                <opt.icon size={16} />
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date & Time Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="text-xs text-surface-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Clock size={14} /> Date Format
            </label>
            <select
              value={dateFormat}
              onChange={(e) => setDateFormat(e.target.value)}
              className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 focus:outline-none focus:border-brand-500"
            >
              <option>DD/MM/YYYY</option>
              <option>MM/DD/YYYY</option>
              <option>YYYY-MM-DD</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-surface-500 uppercase tracking-wider flex items-center gap-2 mb-3">
              <Clock size={14} /> Time Format
            </label>
            <select
              value={timeFormat}
              onChange={(e) => setTimeFormat(e.target.value)}
              className="w-full bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 focus:outline-none focus:border-brand-500"
            >
              <option>HH:mm:ss</option>
              <option>hh:mm A</option>
            </select>
          </div>
        </div>

        {/* Language */}
        <div>
          <label className="text-xs text-surface-500 uppercase tracking-wider flex items-center gap-2 mb-3">
            <Globe size={14} /> Language
          </label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full md:w-1/2 bg-surface-800 border border-surface-700 rounded-xl px-4 py-3 text-sm text-surface-200 focus:outline-none focus:border-brand-500"
          >
            <option>English</option>
            <option>हिंदी</option>
            <option>Español</option>
          </select>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-surface-800 flex items-center justify-between">
          <p className="text-xs text-surface-500">Changes are saved automatically in production.</p>
          <button
            onClick={handleSave}
            className="btn-genie flex items-center gap-2 px-6 py-2.5"
          >
            {saved ? (
              <>
                <CheckCircle2 size={16} /> Saved
              </>
            ) : (
              <>
                <Save size={16} /> Save Preferences
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}