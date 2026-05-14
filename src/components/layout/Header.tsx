"use client";

import React from "react";
import { useSession, signOut } from "next-auth/react";
import { useAppStore } from "@/lib/store";
import { useActiveWorkspace } from "@/hooks/useActiveWorkspace";
import { Menu, FileText, Bell, LogOut, User, Loader2 } from "lucide-react";

export default function Header() {
  // ✅ Status destructure kiya loading handle karne ke liye
  const { data: session, status } = useSession(); 
  const { toggleSidebar } = useAppStore();

  const workspace = useActiveWorkspace() as any;
  const activeData = workspace.activeData || workspace.data;
  const isLoadingWorkspace = workspace.isLoading;
  const isContextMissing = workspace.isContextMissing;

  return (
    <header className="h-16 bg-surface-950 border-b border-surface-800 flex items-center justify-between px-4 z-30 sticky top-0">
      {/* Left side: Context Badge (No changes here) */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-surface-800 rounded-lg text-surface-400 hover:text-surface-100 transition-colors"
        >
          <Menu size={20} />
        </button>

        <div className="h-6 w-px bg-surface-800 hidden md:block"></div>

        <div className="hidden md:flex items-center">
          {isLoadingWorkspace ? (
            <div className="text-sm text-surface-500 animate-pulse font-medium">Identifying workspace...</div>
          ) : isContextMissing ? (
            <div className="text-sm text-surface-500 italic">No context selected</div>
          ) : (
            <div className="flex items-center gap-2 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg">
              <FileText size={14} className="text-brand-400" />
              <span className="text-sm font-medium text-brand-100">
                {activeData?.breadcrumb}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Right side: Notifications & Profile */}
      <div className="flex items-center gap-3">
        <button className="p-2 hover:bg-surface-800 rounded-lg text-surface-400 hover:text-surface-100 transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-brand-500 rounded-full border-2 border-surface-950"></span>
        </button>

        <div className="flex items-center gap-3 pl-3 border-l border-surface-800 min-w-[180px] justify-end">
          
          {/* ✅ Case 1: Session Loading */}
          {status === "loading" ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="text-right">
                <div className="h-3 w-20 bg-surface-800 rounded mb-1"></div>
                <div className="h-2 w-12 bg-surface-800 rounded ml-auto"></div>
              </div>
              <div className="w-9 h-9 rounded-full bg-surface-800 flex items-center justify-center">
                <Loader2 size={16} className="text-surface-600 animate-spin" />
              </div>
            </div>
          ) : session?.user ? (
            /* ✅ Case 2: Logged In User */
            <>
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-surface-100 truncate max-w-[120px]">
                  {session.user.name}
                </div>
                <div className="text-[10px] uppercase tracking-wider font-bold text-brand-400">
                  {/* Future: replace with session.user.plan from DB */}
                  Pro Member
                </div>
              </div>

              <div className="w-9 h-9 rounded-full border border-surface-700 overflow-hidden bg-surface-800 flex items-center justify-center shadow-inner group">
                {session.user.image ? (
                  <img 
                    src={session.user.image} 
                    alt="Profile" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                ) : (
                  <User size={18} className="text-surface-400" />
                )}
              </div>

              <button 
                onClick={() => signOut({ callbackUrl: '/login' })}
                className="p-2 hover:bg-red-500/10 text-surface-500 hover:text-red-400 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut size={18} />
              </button>
            </>
          ) : (
            /* ✅ Case 3: Logged Out (Fallback) */
            <div className="text-sm text-surface-500">Not signed in</div>
          )}
        </div>
      </div>
    </header>
  );
}