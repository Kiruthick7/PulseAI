"use client";

import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { MatchState } from "@/lib/sportsApi";

interface ScoreboardHeroProps {
  gameState: MatchState | null;
}

export default function ScoreboardHero({ gameState }: ScoreboardHeroProps) {
  return (
    <section className="glass-morphism-dark rounded-[3rem] p-12 border border-white/5 shadow-2xl relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-transparent to-purple-500/5 pointer-events-none" />
      
      <div className="flex flex-col gap-8 relative z-10">
        <div className="flex justify-between items-center px-2">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <Trophy className="w-4 h-4 text-cyan-400" />
             </div>
             <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.4em]">{gameState?.leagueContext || "IPL 2026 Season"}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Team A */}
          <div className="lg:col-span-4 flex flex-col gap-6 items-center lg:items-start">
             <div className="flex flex-col items-center lg:items-start relative">
                {gameState?.matchNote?.includes(gameState?.teamA) && (
                  <div className="absolute -top-4 -left-4 px-3 py-1 bg-cyan-500 text-[8px] font-black text-black uppercase tracking-widest rounded-lg z-20 shadow-[0_0_15px_rgba(34,211,238,0.5)]">VICTOR</div>
                )}
                <div className="w-24 h-24 rounded-full bg-black/40 border border-white/10 p-4 mb-4 group-hover:scale-110 transition-transform duration-700">
                  <img src={gameState?.teamALogo} alt={gameState?.teamA} className="w-full h-full object-contain" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-center lg:text-left">{gameState?.teamA}</h2>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em]">Aggressor Unit</span>
             </div>
             <div className="flex flex-col items-center lg:items-start">
                <span className="text-5xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{gameState?.scoreA}</span>
                <span className="text-[10px] font-black text-cyan-500 uppercase tracking-[0.5em] mt-2">Active Inning Performance</span>
             </div>
          </div>

          {/* VS & Status */}
          <div className="lg:col-span-4 flex flex-col items-center justify-center gap-6">
             <div className="relative">
                <div className="w-20 h-20 rounded-full border-2 border-white/5 flex items-center justify-center relative">
                   <span className="text-xl font-black text-white/20 italic">VS</span>
                   {!gameState?.matchNote && <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />}
                </div>
             </div>
             <div className="text-center">
                <div className="px-6 py-2 bg-white/[0.03] border border-white/10 rounded-full mb-4">
                   <span className="text-[10px] font-black text-cyan-400 uppercase tracking-[0.4em]">{gameState?.matchStatus}</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                   <div className="text-[8px] font-bold text-gray-700 uppercase tracking-[0.6em]">Neural Sync v1.0.42</div>
                   
                   {gameState?.maxOvers && (
                      <div className="flex items-center gap-3">
                         <div className="w-1.5 h-[1px] bg-cyan-500/40" />
                         <span className="text-[9px] font-mono font-black text-cyan-500/80 uppercase tracking-[0.4em]">
                            Quota: {gameState.maxOvers} Overs
                         </span>
                         <div className="w-1.5 h-[1px] bg-cyan-500/40" />
                      </div>
                   )}

                   {gameState?.targetScore && (
                     <div className="flex flex-col items-center gap-3">
                        <div className="mt-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 shadow-[0_0_15px_rgba(34,211,238,0.15)] flex items-center gap-3">
                           <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                           <span className="text-[11px] font-mono font-black text-cyan-300 uppercase tracking-[0.2em] drop-shadow-[0_0_10px_rgba(34,211,238,0.4)]">
                              Target: {gameState.targetScore}
                           </span>
                        </div>
                     </div>
                   )}

                   {gameState?.matchNote && (
                     <motion.div 
                       initial={{ opacity: 0, y: 10, scale: 0.95 }}
                       animate={{ opacity: 1, y: 0, scale: 1 }}
                       className="mt-6 px-8 py-3 bg-green-500/20 border border-green-500/40 rounded-2xl shadow-[0_0_30px_rgba(34,197,94,0.2)] flex flex-col items-center gap-1"
                     >
                        <span className="text-[10px] font-black text-green-500/60 uppercase tracking-[0.4em] mb-1">Match Resolution</span>
                        <span className="text-sm lg:text-lg font-black text-white uppercase tracking-wider drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] text-center">
                           {gameState.matchNote}
                        </span>
                     </motion.div>
                   )}
                </div>
             </div>
          </div>

          {/* Team B */}
          <div className="lg:col-span-4 flex flex-col gap-6 items-center lg:items-end">
             <div className="flex flex-col items-center lg:items-end relative">
                {gameState?.matchNote?.includes(gameState?.teamB) && (
                  <div className="absolute -top-4 -right-4 px-3 py-1 bg-purple-500 text-[8px] font-black text-white uppercase tracking-widest rounded-lg z-20 shadow-[0_0_15px_rgba(168,85,247,0.5)]">VICTOR</div>
                )}
                <div className="w-24 h-24 rounded-full bg-black/40 border border-white/10 p-4 mb-4 group-hover:scale-110 transition-transform duration-700">
                  <img src={gameState?.teamBLogo} alt={gameState?.teamB} className="w-full h-full object-contain" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-widest text-center lg:text-right">{gameState?.teamB}</h2>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-[0.4em]">Defender Unit</span>
             </div>
             <div className="flex flex-col items-center lg:items-end">
                <span className="text-5xl font-black tabular-nums tracking-tighter text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.1)]">{gameState?.scoreB}</span>
                <span className="text-[10px] font-black text-purple-500 uppercase tracking-[0.5em] mt-2">Responsive Counter State</span>
             </div>
          </div>
        </div>
      </div>
    </section>
  );
}
