"use client";

import React, { useState } from "react";
import { MessageCircle, ChevronDown, ChevronRight, Sparkles, ExternalLink } from "lucide-react";

const FAQS = [
  {
    id: 1,
    question: "How do I select a file for processing?",
    answer: "Expand a project in the sidebar, click any file. The active file will appear in the header badge. Then tools like Smart Date Fixer will automatically use it.",
  },
  {
    id: 2,
    question: "How do I upload new data?",
    answer: "In the sidebar, hover over a project and click the '+' icon. You can drag & drop CSV, Excel, or JSON files. They will appear in the project after upload.",
  },
  {
    id: 3,
    question: "What are the available tools?",
    answer: "Navigate to the Toolbox page. You'll find 14+ AI-powered tools categorized as Cleaning, Analytics, Optimization, and more. Each tool works on the selected active file.",
  },
  {
    id: 4,
    question: "How does the Graph Wizard work?",
    answer: "Select an active file first. Then go to Graph Wizard, choose a chart type, and the AI will automatically suggest column mappings and render a visualization.",
  },
  {
    id: 5,
    question: "How do I connect Google Drive or OneDrive?",
    answer: "Cloud sync is coming soon! You'll be able to connect your cloud storage and directly add files to projects without manual upload.",
  },
];

export default function HelpPage() {
  const [openId, setOpenId] = useState<number | null>(null);

  const toggleFaq = (id: number) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold text-surface-50 flex items-center gap-3">
          <MessageCircle size={28} className="text-brand-400" />
          Help & Support
        </h1>
        <p className="text-surface-400 mt-2">
          Get answers to common questions or chat with Genie AI assistant.
        </p>
      </div>

      {/* FAQ Section */}
      <div className="glass-panel rounded-2xl border border-surface-800 p-6 space-y-4">
        <h2 className="text-lg font-bold text-surface-100 flex items-center gap-2">
          <Sparkles size={20} className="text-brand-400" /> Frequently Asked Questions
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div
                key={faq.id}
                className="border border-surface-700/50 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left bg-surface-800/30 hover:bg-surface-800/60 transition-colors"
                >
                  <span className="text-sm font-medium text-surface-200 pr-4">{faq.question}</span>
                  {isOpen ? (
                    <ChevronDown size={18} className="text-brand-400 shrink-0" />
                  ) : (
                    <ChevronRight size={18} className="text-surface-500 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 py-4 text-sm text-surface-400 leading-relaxed border-t border-surface-700/50 bg-surface-900/20">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Cloud Sync Coming Soon */}
      <div className="glass-panel rounded-2xl border border-surface-800 p-6">
        <h2 className="text-lg font-bold text-surface-100 mb-2 flex items-center gap-2">
          <ExternalLink size={20} className="text-brand-400" /> Cloud Integration
        </h2>
        <p className="text-sm text-surface-400 mb-4">
          Connect your Google Drive or OneDrive to sync files directly into your projects. No manual uploads needed.
        </p>
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-surface-800 text-xs font-bold text-surface-400 border border-surface-700">
            Google Drive (Coming Soon)
          </div>
          <div className="px-4 py-2 rounded-xl bg-surface-800 text-xs font-bold text-surface-400 border border-surface-700">
            OneDrive (Coming Soon)
          </div>
        </div>
      </div>

      {/* Chat with Genie */}
      <div className="text-center py-4">
        <p className="text-surface-500 text-sm">
          Still need help? Click the <Sparkles size={14} className="inline text-brand-400" /> icon at the bottom-right to chat with Genie AI.
        </p>
      </div>
    </div>
  );
}