"use client";

import { motion } from "framer-motion";
import { Award, TrendingUp } from "lucide-react";

const MOCK_LEADERS = [
  { name: "CricketGod99", points: 12450, trend: "up" },
  { name: "StumpSmasher", points: 11200, trend: "up" },
  { name: "BoundaryKing", points: 9800, trend: "down" },
  { name: "GooglyMaster", points: 8500, trend: "up" },
  { name: "NeuralFan_42", points: 7200, trend: "neutral" },
];

export default function Leaderboard() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <Award className="w-5 h-5 text-yellow-500" />
          <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Global Pulse Board</h3>
        </div>
        <span className="text-[8px] font-bold text-yellow-500/50 uppercase tracking-widest">Season 1 Active</span>
      </div>

      <div className="glass-morphism-dark rounded-3xl border border-white/5 overflow-hidden">
        <div className="p-4 space-y-4">
          {MOCK_LEADERS.map((leader, i) => (
            <motion.div
              key={leader.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.02] border border-transparent hover:border-white/5 transition-all group"
            >
              <div className="flex items-center gap-4">
                <span className={`text-xs font-black w-6 ${i < 3 ? 'text-yellow-500' : 'text-gray-600'}`}>0{i + 1}</span>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-gray-300 group-hover:text-white transition-colors">{leader.name}</span>
                  <div className="flex items-center gap-1">
                    <div className="w-1 h-1 rounded-full bg-green-500" />
                    <span className="text-[8px] font-black text-gray-600 uppercase tracking-widest">Verified Fan</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono text-xs font-black text-white">{leader.points.toLocaleString()}</span>
                <TrendingUp className={`w-3 h-3 ${leader.trend === 'up' ? 'text-green-500' : 'text-red-500'} opacity-50`} />
              </div>
            </motion.div>
          ))}
        </div>
        <div className="bg-white/[0.03] p-4 border-t border-white/5 text-center">
           <button className="text-[10px] font-black text-cyan-500 uppercase tracking-widest hover:text-cyan-400 transition-colors">
             View Full Standings
           </button>
        </div>
      </div>
    </div>
  );
}
