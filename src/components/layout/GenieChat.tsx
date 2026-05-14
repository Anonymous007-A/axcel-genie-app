"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Send, Sparkles, X, 
  Bot, Loader2, Maximize2, Minimize2 
} from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function GenieChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Hello! I am your AI Assistant. How can I help you analyze your data today?",
    },
  ]);
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "I have analyzed the current data trend. Everything looks stable. Do you want me to generate a detailed report for the selected parameters?",
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  if (!isOpen) {
    return (
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-4 bg-brand-500 hover:bg-brand-400 text-surface-950 rounded-2xl shadow-2xl z-[100] transition-all active:scale-95"
      >
        <Sparkles size={24} />
      </button>
    );
  }

  return (
    <div 
      className={`fixed right-6 z-[100] transition-all duration-300 flex flex-col glass-panel border border-surface-700/50 shadow-2xl overflow-hidden ${
        isMinimized ? "bottom-6 h-16 w-72" : "bottom-6 h-[500px] w-[350px] rounded-3xl"
      }`}
    >
      {/* Header */}
      <div className="p-4 bg-surface-800/50 border-b border-surface-700/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Bot size={20} className="text-brand-400" />
          <span className="text-sm font-bold text-surface-50">AI Assistant</span>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setIsMinimized(!isMinimized)} className="p-1 hover:bg-surface-700 rounded text-surface-400">
            {isMinimized ? <Maximize2 size={16} /> : <Minimize2 size={16} />}
          </button>
          <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-surface-700 rounded text-surface-400">
            <X size={16} />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Chat Messages - FIXED CLASS: hide-scrollbar */}
          <div 
            ref={scrollRef} 
            className="flex-1 overflow-y-auto p-4 space-y-4 bg-surface-900/20 hide-scrollbar"
          >
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${
                  msg.role === "user" ? "bg-brand-500 text-surface-950 font-bold" : "bg-surface-800 text-surface-200 border border-surface-700"
                }`}>
                  {msg.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-surface-800 p-3 rounded-2xl">
                  <Loader2 size={14} className="animate-spin text-brand-400" />
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-4 bg-surface-900/50 border-t border-surface-700/50 flex gap-2">
            <input 
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask anything..."
              className="flex-1 bg-surface-800 border border-surface-700 rounded-xl px-4 py-2 text-xs text-surface-200 focus:outline-none focus:border-brand-500"
            />
            <button onClick={handleSend} className="p-2 bg-brand-500 text-surface-950 rounded-xl">
              <Send size={16} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}