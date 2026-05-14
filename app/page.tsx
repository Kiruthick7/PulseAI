"use client";

import { useEffect, useState } from "react";
import { Radio, Trophy } from "lucide-react";
import { useLiveMatch } from "@/hooks/useLiveMatch";
import { InsightMessage } from "@/components/match/AIPulseChat";
import { SportsEvent } from "@/lib/sportsApi";
import PredictionModal from "@/components/engagement/PredictionModal";
import ScoreboardHero from "@/components/match/ScoreboardHero";
import NeuralDataStream from "@/components/match/NeuralDataStream";
import EventChronology from "@/components/match/EventChronology";
import FanEngagementHub from "@/components/match/FanEngagementHub";
import MomentumMeter from "@/components/match/MomentumMeter";
import WinProbability from "@/components/match/WinProbability";
import { Activity, User, Zap, Target } from "lucide-react";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [mounted, setMounted] = useState(false);
  const { gameState, fetchedInsightIds } = useLiveMatch();
  const [messages, setMessages] = useState<InsightMessage[]>([]);
  const [hypePoints, setHypePoints] = useState(0);
  const [showPrediction, setShowPrediction] = useState(false);
  const [isCooldown, setIsCooldown] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem("cricketpulse_points");
    if (saved) setHypePoints(parseInt(saved, 10));
  }, []);

  // Trigger AI insight when new events occur
  useEffect(() => {
    if (gameState?.recentEvents?.length) {
      const latestEvent = gameState.recentEvents[0];
      if (!fetchedInsightIds.current.has(latestEvent.id) && !isCooldown) {
        generateInsight(latestEvent);
        fetchedInsightIds.current.add(latestEvent.id);
      }
    }
  }, [gameState, isCooldown]);

  const generateInsight = async (event: SportsEvent) => {
    setIsCooldown(true);
    try {
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        body: JSON.stringify({ 
          event, 
          scoreA: gameState?.scoreA, 
          scoreB: gameState?.scoreB,
          battingTeam: gameState?.battingTeam,
          striker: gameState?.striker,
          bowler: gameState?.bowler
        }),
      });
      const data = await res.json();
      
      const newMessage: InsightMessage = {
        id: Math.random().toString(36).substr(2, 9),
        text: data.insightText || "Tactical sync active. Recalibrating analysis...",
        timestamp: new Date(),
      };
      
      setMessages(prev => [newMessage, ...prev].slice(0, 10));
    } catch (err) {
      console.error("AI Insight error:", err);
    } finally {
      setTimeout(() => setIsCooldown(false), 15000);
    }
  };

  const handlePredict = (points: number) => {
    const newPoints = hypePoints + points;
    setHypePoints(newPoints);
    localStorage.setItem("cricketpulse_points", newPoints.toString());
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-[#020408] text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#164e63_0%,transparent_50%)] opacity-40 animate-neural-pulse" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')] opacity-[0.03] contrast-150" />
      </div>

      <nav className="relative z-50 border-b border-white/5 bg-[#020408]/80 backdrop-blur-xl px-6 lg:px-10 py-6">
        <div className="max-w-[1800px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-6">
            <div className="relative group cursor-pointer hover-glitch">
              <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-[#020408] px-4 py-2 rounded-lg border border-white/10 flex items-center gap-3">
                <Radio className="w-5 h-5 text-cyan-500 animate-pulse" />
                <span className="text-xl font-black uppercase tracking-[0.3em] bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
                  Pulse<span className="text-cyan-500">AI</span>
                </span>
              </div>
            </div>
            <div className="hidden md:block h-6 w-[1px] bg-white/10" />
            <div className="hidden md:flex items-center gap-3 text-gray-400">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] font-black uppercase tracking-[0.4em]">IPL 2026 Live Stream</span>
            </div>
          </div>

          <div className="flex items-center gap-6 lg:gap-8">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1">Fan Hype Rank</span>
              <div className="flex items-center gap-3">
                <Trophy className="w-4 h-4 text-yellow-500" />
                <span className="text-xl font-black text-white tabular-nums">{hypePoints}</span>
              </div>
            </div>
            {gameState?.matchStatus !== "PRE-GAME" && gameState?.matchStatus !== "MATCH COMPLETE" && (
              <button 
                onClick={() => setShowPrediction(true)}
                className="px-6 lg:px-8 py-3 bg-white text-black text-[9px] lg:text-[10px] font-black uppercase tracking-[0.3em] rounded-full hover:bg-cyan-400 hover:text-white transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
              >
                Predict Momentum
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-[1800px] mx-auto p-6 lg:p-10 flex flex-col gap-10 pb-32">
        <ScoreboardHero gameState={gameState} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          <div className="lg:col-span-8 flex flex-col gap-12 order-1">
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 px-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                   <User className="w-5 h-5 text-cyan-400" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Biometric Player Uplink</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { label: "On Strike", val: gameState?.striker, icon: Target, color: "text-cyan-400" },
                  { label: "Non-Striker", val: gameState?.nonStriker, icon: User, color: "text-gray-400" },
                  { label: "Bowler", val: gameState?.bowler, icon: Zap, color: "text-pink-500" }
                ].map((p, i) => (
                  <motion.div 
                    key={i} 
                    whileHover={{ y: -5, backgroundColor: "rgba(255,255,255,0.05)" }}
                    className="glass-morphism-dark rounded-[2rem] p-6 border border-white/5 transition-all duration-500 group"
                  >
                    <div className="flex flex-col gap-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">{p.label}</span>
                        <p.icon className={`w-4 h-4 ${p.color}`} />
                      </div>
                      <div className="text-lg font-black text-white">{p.val}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4 px-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                   <Activity className="w-5 h-5 text-purple-400" />
                </div>
                <h3 className="text-xs font-black uppercase tracking-[0.4em] text-gray-400">Match Flux Analysis</h3>
              </div>
              <div className="glass-morphism-dark rounded-[2.5rem] p-8 border border-white/10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <MomentumMeter score={gameState?.momentumScore ?? 50} />
                <WinProbability 
                  teamA={gameState?.teamA || "HOME"} 
                  teamB={gameState?.teamB || "AWAY"} 
                  probA={gameState?.momentumScore ?? 50} 
                />
              </div>
            </div>

            <EventChronology events={gameState?.recentEvents || []} />
          </div>

          <div className="lg:col-span-4 flex flex-col gap-12 order-2">
            <NeuralDataStream messages={messages} isCooldown={isCooldown} />
            <FanEngagementHub gameState={gameState} />
          </div>
        </div>
      </main>

      <PredictionModal
        isOpen={showPrediction}
        onClose={() => setShowPrediction(false)}
        onPredict={handlePredict}
        context="Will the next ball result in a boundary?"
      />
    </div>
  );
}
