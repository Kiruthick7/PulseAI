"use client";

import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import AIPulseChat, { InsightMessage } from "@/components/match/AIPulseChat";

interface NeuralDataStreamProps {
  messages: InsightMessage[];
  isCooldown: boolean;
}

export default function NeuralDataStream({ messages, isCooldown }: NeuralDataStreamProps) {
  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <div className="flex items-center gap-4 px-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
           <Terminal className="w-5 h-5 text-cyan-400" />
        </div>
        <div className="flex flex-col">
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Neural Data Stream</h3>
          <div className="flex items-center gap-1 mt-1">
             {[...Array(4)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [4, 12, 4] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
                  className="w-[2px] bg-cyan-500/40 rounded-full"
                />
             ))}
          </div>
        </div>
      </div>
      <div className="flex-1 bg-black/40 rounded-[2.5rem] border border-white/5 p-1 min-h-[500px] backdrop-blur-3xl">
         <AIPulseChat messages={messages} isCooldown={isCooldown} />
      </div>
    </div>
  );
}
