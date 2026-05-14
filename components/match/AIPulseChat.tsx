"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal } from "lucide-react";

export interface InsightMessage {
  id: string;
  text: string;
  timestamp: Date;
  provider?: string;
}

interface AIPulseChatProps {
  messages: InsightMessage[];
  isCooldown: boolean;
}

export default function AIPulseChat({ messages, isCooldown }: AIPulseChatProps) {
  const highlightText = (text: string) => {
    const keywords = [
      { regex: /Win Probability/gi, color: "text-cyan-400 font-black" },
      { regex: /Momentum/gi, color: "text-purple-400 font-black" },
      { regex: /Risk/gi, color: "text-pink-500 font-black" },
      { regex: /Target/gi, color: "text-yellow-500 font-black" },
      { regex: /Tactical/gi, color: "text-cyan-500 font-black" },
      { regex: /\d+%/g, color: "text-green-400 font-mono font-black" }
    ];

    let parts: (string | React.ReactNode)[] = [text];
    let matchCount = 0;

    keywords.forEach(({ regex, color }) => {
      const newParts: (string | React.ReactNode)[] = [];
      parts.forEach(part => {
        if (typeof part === "string") {
          const split = part.split(regex);
          const matches = part.match(regex);
          
          split.forEach((s, idx) => {
            newParts.push(s);
            if (matches && matches[idx]) {
              matchCount++;
              newParts.push(<span key={`highlight-${matchCount}-${matches[idx]}`} className={color}>{matches[idx]}</span>);
            }
          });
        } else {
          newParts.push(part);
        }
      });
      parts = newParts;
    });

    return parts;
  };

  return (
    <div className="glass-morphism-dark rounded-3xl border border-white/10 flex flex-col h-[550px] relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

      <div className="px-8 py-4 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <Terminal className="w-4 h-4 text-cyan-500" />
          <span className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">Neural Insights Feed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${isCooldown ? 'bg-yellow-500' : 'bg-green-500 animate-pulse'}`} />
          <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest">
            {isCooldown ? 'Processing...' : 'Active Link'}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        <AnimatePresence mode="popLayout">
          {messages.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="h-full flex flex-col items-center justify-center text-center space-y-4"
            >
              <Cpu className="w-8 h-8 text-white/10 animate-pulse-slow" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-700">Initialising Neural Core...</p>
            </motion.div>
          ) : (
            messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                <div className="absolute -left-4 top-2 w-1 h-full bg-gradient-to-b from-cyan-500 to-transparent rounded-full opacity-40" />
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest">System Broadcast</span>
                    <span className="text-[8px] font-mono text-gray-600">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                    </span>
                  </div>
                  <div className="bg-white/[0.03] p-5 rounded-2xl border border-white/5 group-hover:border-white/10 transition-colors">
                    <p className="text-sm font-medium text-gray-300 leading-relaxed group-hover:text-white transition-colors">
                      {highlightText(msg.text)}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      <div className="px-8 py-3 bg-black/40 border-t border-white/5 flex items-center justify-between">
         <div className="flex items-center gap-4">
            <span className="text-[8px] font-bold text-gray-700 uppercase tracking-widest">Groq Llama-3 70B Engine</span>
            <div className="w-[1px] h-2 bg-white/10" />
            <span className="text-[8px] font-mono text-cyan-500/40 uppercase">Token Stream: Stable</span>
         </div>
         <span className="text-[8px] font-mono text-cyan-500/40">LATENCY: 242ms</span>
      </div>
    </div>
  );
}
