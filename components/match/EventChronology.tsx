"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Terminal } from "lucide-react";
import { SportsEvent } from "@/lib/sportsApi";

interface EventChronologyProps {
  events: SportsEvent[];
}

export default function EventChronology({ events }: EventChronologyProps) {
  return (
    <section className="flex flex-col gap-6">
       <div className="flex items-center gap-4 px-4">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
             <Terminal className="w-5 h-5 text-purple-400" />
          </div>
          <div>
             <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Match Event Chronology</h3>
             <span className="text-[8px] font-bold text-purple-500/50 uppercase tracking-widest italic">Holographic Tactical Stream</span>
          </div>
       </div>
       
       <div className="glass-morphism-dark rounded-[2.5rem] border border-white/5 overflow-hidden relative">
          <div className="absolute inset-0 bg-gradient-to-b from-purple-500/[0.02] to-transparent pointer-events-none" />
          
          <div className="p-8 space-y-4 max-h-[500px] overflow-y-auto custom-scrollbar relative z-10">
             {events.map((event, i) => (
               <motion.div 
                 key={event.id}
                 initial={{ opacity: 0, x: -10 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 viewport={{ once: true }}
                 transition={{ delay: i * 0.03 }}
                 className="group flex gap-6 relative"
               >
                 <div className="flex flex-col items-center pt-1">
                    <div className="relative">
                       <div className="w-3 h-3 rounded-full border border-white/20 group-hover:border-cyan-400 transition-colors" />
                       <div className="absolute inset-0 rounded-full bg-cyan-400/20 animate-pulse" />
                    </div>
                    <div className="w-[1px] flex-1 bg-gradient-to-b from-white/10 to-transparent my-2" />
                 </div>

                 <div className="flex-1 bg-white/[0.02] hover:bg-white/[0.04] p-5 rounded-2xl border-l-2 border-l-transparent group-hover:border-l-cyan-500 transition-all duration-300">
                    <div className="flex items-center gap-4 mb-2">
                       <div className="px-2 py-0.5 bg-cyan-500/10 border border-cyan-500/20 rounded-md">
                          <span className="text-[9px] font-mono font-black text-cyan-400 tracking-wider">
                             {(String(event.timeElapsed) === '0.0' || String(event.timeElapsed).includes('PHASE') || isNaN(parseFloat(String(event.timeElapsed)))) 
                               ? event.timeElapsed 
                               : `OV ${event.timeElapsed}`}
                          </span>
                       </div>
                       <span className="text-[9px] font-black text-white/30 uppercase tracking-[0.3em]">{event.type}</span>
                    </div>
                    <p className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors leading-relaxed">
                       {event.detail}
                    </p>
                 </div>
               </motion.div>
             ))}
          </div>
       </div>
    </section>
  );
}
