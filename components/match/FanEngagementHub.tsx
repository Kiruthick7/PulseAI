"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, Target, Share2 } from "lucide-react";
import ReactionPulse from "@/components/engagement/ReactionPulse";
import { getTacticalPoll } from "@/lib/pollQuestions";

interface FanEngagementHubProps {
  gameState: any;
}

export default function FanEngagementHub({ gameState }: FanEngagementHubProps) {
  const [voted, setVoted] = useState(false);
  const [pollIndex] = useState(() => Math.floor(Math.random() * 3));

  const poll = getTacticalPoll(gameState?.matchStatus || "LIVE", pollIndex);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center gap-4 px-4">
        <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Fan Tactical Link</h3>
          <span className="text-[8px] font-bold text-cyan-500/50 uppercase tracking-widest italic">Interactive Engagement Stream</span>
        </div>
      </div>

      <div className="glass-morphism-dark rounded-[2.5rem] border border-white/10 overflow-hidden flex flex-col">
        <div className="p-8 border-b border-white/5 bg-white/[0.01]">
           <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Broadcast Energy</span>
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                  <span className="text-[8px] font-mono text-cyan-500/40 uppercase">Live Pulse</span>
                </div>
              </div>
              <ReactionPulse />
           </div>
        </div>

        <div className="p-8 space-y-6">
          <div className="flex items-center gap-3">
             <Target className="w-4 h-4 text-purple-400" />
             <span className="text-[10px] font-black uppercase tracking-[0.2em] text-purple-400">Live Tactical Poll</span>
          </div>

          <h4 className="text-sm font-bold text-gray-200 leading-tight pr-4">
            {poll.question}
          </h4>

          <div className="flex flex-col gap-3">
            {poll.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setVoted(true)}
                disabled={voted}
                className="group relative w-full overflow-hidden rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all p-4 text-left"
              >
                {voted && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${opt.votes}%` }}
                    className="absolute inset-y-0 left-0 bg-cyan-500/10 z-0"
                  />
                )}
                <div className="relative z-10 flex justify-between items-center">
                  <span className={`text-[11px] font-bold transition-colors ${voted ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
                    {opt.label}
                  </span>
                  {voted && (
                    <span className="text-[11px] font-black text-cyan-400 font-mono">
                      {opt.votes}%
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          <div className="pt-4 flex justify-between items-center border-t border-white/5">
             <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest">
               {voted ? "Vote Cast Recorded" : "Awaiting Fan Input"}
             </span>
             <Share2 className="w-3 h-3 text-gray-700 cursor-pointer hover:text-white transition-colors" />
          </div>
        </div>
      </div>
    </section>
  );
}
