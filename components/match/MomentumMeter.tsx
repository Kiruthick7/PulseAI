"use client";

import { motion } from "framer-motion";

interface MomentumMeterProps {
  score: number;
}

export default function MomentumMeter({ score }: MomentumMeterProps) {
  // score is 0-100, 50 is neutral
  const normalizedScore = Math.round(Math.min(Math.max(score, 0), 100));
  const rotation = (normalizedScore / 100) * 180 - 90; // -90 to 90 degrees

  return (
    <div className="flex flex-col items-center gap-8 py-4 w-full">
      <div className="relative w-48 h-24 overflow-hidden">
        {/* The Meter Arch Background */}
        <div className="absolute bottom-0 w-48 h-48 rounded-full border-[12px] border-white/5" />
        
        {/* The Active Meter Arch */}
        <motion.div 
          className="absolute bottom-0 w-48 h-48 rounded-full border-[12px] border-transparent border-t-cyan-500/40 border-r-cyan-500/40"
          style={{ rotate: rotation }}
          animate={{ rotate: rotation }}
          transition={{ type: "spring", stiffness: 30, damping: 15 }}
        />
        
        {/* Glow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent z-10" />
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
