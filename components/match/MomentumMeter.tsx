"use client";

import { motion } from "framer-motion";

interface MomentumMeterProps {
  score: number;
}

export default function MomentumMeter({ score }: MomentumMeterProps) {
  const normalizedScore = Math.round(Math.min(Math.max(score, 0), 100));
  const isPreGame = score === 50;
  const rotation = ((score - 50) * 1.8);

  return (
    <div className="flex flex-col items-center gap-6 group">
      <div className="relative w-64 h-32 overflow-hidden">
        <div className="absolute inset-0 rounded-t-full border-[12px] border-white/5" />
        <div className="absolute inset-0 rounded-t-full border-[12px] border-cyan-500/20 blur-sm" />

        <motion.div
          animate={isPreGame ? {
            rotate: [-2, 2, -2],
          } : {
            rotate: rotation
          }}
          transition={isPreGame ? {
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          } : {
            type: "spring",
            stiffness: 50,
            damping: 15
          }}
          className="absolute bottom-0 left-1/2 -ml-[2px] w-1 h-32 bg-gradient-to-t from-cyan-500 to-transparent origin-bottom z-20"
        >
          <div className="w-4 h-4 bg-cyan-500 rounded-full -ml-[6px] mt-28 shadow-[0_0_15px_rgba(34,211,238,0.8)]" />
        </motion.div>
      </div>

      <div className="flex flex-col items-center -mt-12 relative z-20">
        <div className="flex items-baseline gap-1">
          <motion.span
            key={score}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-black text-white text-glow-cyan tabular-nums"
          >
            {normalizedScore}
          </motion.span>
          <span className="text-[10px] font-black text-cyan-400 tracking-tighter">FLUX</span>
        </div>
        <div className="mt-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/20 rounded-lg">
           <span className="text-[8px] font-black text-cyan-400 uppercase tracking-[0.4em]">Sentiment Index</span>
        </div>
      </div>

      <div className="w-full flex justify-between px-2">
        <div className="flex flex-col items-start gap-1">
          <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
            <div className={`h-full bg-red-500/40 transition-all duration-700 ${normalizedScore < 50 ? 'w-full' : 'w-0'}`} />
          </div>
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Defensive</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="h-1 w-8 bg-white/5 rounded-full overflow-hidden">
             <div className={`h-full bg-green-500/40 transition-all duration-700 ${normalizedScore >= 50 ? 'w-full' : 'w-0'}`} />
          </div>
          <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">Aggressive</span>
        </div>
      </div>
    </div>
  );
}
