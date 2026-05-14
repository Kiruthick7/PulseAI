"use client";

import { motion } from "framer-motion";

interface WinProbabilityProps {
  teamA: string;
  teamB: string;
  probA: number; // 0-100
}

export default function WinProbability({ teamA, teamB, probA }: WinProbabilityProps) {
  const displayProbA = Math.round(probA);
  const displayProbB = 100 - displayProbA;

  return (
    <div className="w-full flex flex-col gap-6">
      <div className="flex justify-between items-end gap-6 px-1">
        <div className="flex flex-col gap-2 min-w-0 flex-1">
          <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.3em] whitespace-normal leading-relaxed">
            {teamA}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white leading-none">{displayProbA}</span>
            <span className="text-xs font-bold text-cyan-500/50 leading-none">%</span>
          </div>
        </div>
        
        <div className="flex flex-col items-end gap-2 min-w-0 flex-1">
          <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.3em] whitespace-normal text-right leading-relaxed">
            {teamB}
          </span>
          <div className="flex items-baseline gap-1">
            <span className="text-3xl font-black text-white/20 leading-none">{displayProbB}</span>
            <span className="text-xs font-bold text-white/10 leading-none">%</span>
          </div>
        </div>
      </div>
      
      <div className="relative h-3 w-full bg-white/[0.03] rounded-full overflow-hidden border border-white/5 p-0.5">
        <motion.div
          initial={{ width: "50%" }}
          animate={{ width: `${displayProbA}%` }}
          className="h-full bg-gradient-to-r from-cyan-600 via-cyan-400 to-cyan-300 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.4)] relative z-10"
          transition={{ type: "spring", stiffness: 40, damping: 15 }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
      </div>
      
      <div className="flex justify-center">
        <div className="px-4 py-1.5 bg-white/[0.02] border border-white/10 rounded-full backdrop-blur-md">
          <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.4em]">Neural Prediction Engine v4.2</span>
        </div>
      </div>
    </div>
  );
}
