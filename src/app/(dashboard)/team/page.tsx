"use client";

import React, { useState } from "react";
import { useAppStore } from "@/lib/store";
import { 
  Users, Key, Shield, UserPlus, Lock, 
  Copy, CheckCircle2, AlertTriangle, Mail, Star
} from "lucide-react";

export default function TeamPage() {
  const { currentUser } = useAppStore();
  const [copied, setCopied] = useState(false);

  // Fallback to strict types if user is not fully loaded
  const role = currentUser?.role || "ADMIN";
  const plan = currentUser?.plan || "PRO"; 
  const isAdvance = plan === "ADVANCE";

  // Highly contextual mock team data mapped to the workspace domain
  const teamMembers = [
    { 
      id: "u1", 
      name: currentUser?.name || "Amit Sharma", 
      email: currentUser?.email || "amit@clario.com", 
      role: role, 
      status: "Active" 
    },
    { 
      id: "u2", 
      name: "Priya Singh", 
      email: "priya@clario.com", 
      role: "MEMBER", 
      status: "Active" 
    },
    { 
      id: "u3", 
      name: "Rahul Verma", 
      email: "rahul@clario.com", 
      role: "MEMBER", 
      status: "Pending" 
    },
  ];

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 animate-in fade-in duration-500">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-800 pb-6">
        <div>
          <h2 className="text-4xl font-bold text-surface-50 tracking-tight flex items-center gap-3">
            Team & Security
            <Shield size={32} className="text-accent-purple" />
          </h2>
          <p className="text-surface-400 mt-2 text-lg">
            Manage your organization's access, API keys, and workspace policies.
          </p>
        </div>
        
        {/* Role Badge */}
        <div className="flex items-center gap-2 px-4 py-2 bg-surface-800 border border-surface-700 rounded-xl">
          <span className="text-sm text-surface-400">Current Role:</span>
          <span className={`text-sm font-bold flex items-center gap-1 ${role === 'ADMIN' ? 'text-brand-400' : 'text-surface-300'}`}>
            {role === 'ADMIN' && <Star size={14} />}
            {role}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Left Column: Team List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-surface-100 flex items-center gap-2">
              <Users size={20} className="text-accent-purple" />
              Workspace Members
            </h3>
            {role === 'ADMIN' && (
              <button className="btn-genie bg-accent-purple text-white hover:bg-purple-500 text-sm flex items-center gap-2">
                <UserPlus size={16} />
                Invite Member
              </button>
            )}
          </div>

          <div className="glass-panel rounded-2xl overflow-hidden border border-surface-700/50">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-surface-900/50 border-b border-surface-700/50 text-surface-400">
                  <tr>
                    <th className="px-6 py-4 font-medium">User</th>
                    <th className="px-6 py-4 font-medium">Role</th>
                    <th className="px-6 py-4 font-medium">Status</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-800">
                  {teamMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-surface-800/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-surface-700 flex items-center justify-center text-xs font-bold text-surface-300">
                            {member.name.split(" ").map(n => n[0]).join("")}
                          </div>
                          <div>
                            <p className="font-medium text-surface-100">{member.name}</p>
                            <p className="text-xs text-surface-500 flex items-center gap-1">
                              <Mail size={12} /> {member.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-md text-xs font-medium border ${
                          member.role === 'ADMIN' 
                            ? 'bg-brand-500/10 border-brand-500/20 text-brand-400' 
                            : 'bg-surface-800 border-surface-700 text-surface-300'
                        }`}>
                          {member.role}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${
                          member.status === 'Active' ? 'text-emerald-400' : 'text-amber-400'
                        }`}>
                          <div className={`w-1.5 h-1.5 rounded-full ${member.status === 'Active' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {member.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {role === 'ADMIN' && member.role !== 'ADMIN' ? (
                          <button className="text-surface-500 hover:text-red-400 transition-colors text-xs font-medium">
                            Remove
                          </button>
                        ) : (
                          <span className="text-surface-600 text-xs">-</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: API Keys & Security */}
        <div className="space-y-6">
          
          {/* API Keys Section */}
          <div className="glass-panel rounded-2xl p-6 relative overflow-hidden">
            {/* Ambient glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-accent-purple/5 blur-3xl -z-10 rounded-full" />
            
            <h3 className="text-lg font-bold text-surface-100 flex items-center gap-2 mb-4">
              <Key size={18} className="text-accent-purple" />
              API Access
            </h3>

            {isAdvance ? (
              <div className="space-y-4">
                <p className="text-sm text-surface-400">
                  Use this key to authenticate with the Axcel Genie pipeline via external scripts.
                </p>
                <div className="relative">
                  <input 
                    type="password" 
                    value="sk_live_genie_8f92a1x99m2po3" 
                    readOnly
                    className="w-full bg-surface-950 border border-surface-700 rounded-lg py-2.5 pl-3 pr-10 text-sm text-surface-300 font-mono focus:outline-none"
                  />
                  <button 
                    onClick={handleCopy}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-surface-400 hover:text-white transition-colors"
                  >
                    {copied ? <CheckCircle2 size={16} className="text-emerald-400" /> : <Copy size={16} />}
                  </button>
                </div>
                <div className="flex items-center gap-2 text-xs text-amber-400 bg-amber-400/10 p-2 rounded-lg border border-amber-400/20">
                  <AlertTriangle size={14} className="shrink-0" />
                  <p>Never share this key publicly or commit it to GitHub.</p>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Lock size={32} className="mx-auto text-surface-600 mb-3" />
                <h4 className="font-medium text-surface-200 mb-2">Advance Plan Required</h4>
                <p className="text-xs text-surface-400 mb-4">
                  Upgrade your workspace to unlock REST API access and programmatic data pipelines.
                </p>
                <button className="w-full btn-genie bg-surface-100 text-surface-900 hover:bg-white text-sm">
                  Upgrade Plan
                </button>
              </div>
            )}
          </div>

          {/* File Lock Controls (Admin Only) */}
          <div className="glass-panel rounded-2xl p-6">
            <h3 className="text-lg font-bold text-surface-100 flex items-center gap-2 mb-4">
              <Lock size={18} className="text-surface-400" />
              Global File Rules
            </h3>
            <p className="text-sm text-surface-400 mb-4">
              Control whether standard members can delete or overwrite raw datasets in the active project.
            </p>
            <label className="flex items-center justify-between p-3 bg-surface-900/50 border border-surface-700/50 rounded-xl cursor-pointer">
              <span className="text-sm font-medium text-surface-200">Strict Lock Mode</span>
              <div className="relative inline-flex h-5 w-9 items-center rounded-full bg-accent-purple">
                <span className="inline-block h-3.5 w-3.5 translate-x-4 rounded-full bg-white transition" />
              </div>
            </label>
          </div>

        </div>
      </div>
    </div>
  );
}