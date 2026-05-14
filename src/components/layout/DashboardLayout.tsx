import React from "react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import GenieChat from "@/components/layout/GenieChat";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full bg-surface-900 overflow-hidden font-sans text-surface-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header />
        <main className="flex-1 overflow-y-auto relative z-10">
          {children}
        </main>
      </div>
      {/* Floating AI Sparkle Button */}
      <GenieChat />
    </div>
  );
}