import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Target, Zap, TrendingUp, Trophy } from "lucide-react";

interface PredictionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPredict: (points: number) => void;
  context: string;
}

export default function PredictionModal({ isOpen, onClose, onPredict, context }: PredictionModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-lg glass-morphism-dark rounded-[2.5rem] p-12 border border-cyan-500/30 shadow-[0_0_50px_rgba(34,211,238,0.2)] overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

            <div className="flex justify-between items-start mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-cyan-500/10 border border-cyan-500/30 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <Target className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-white uppercase tracking-tighter">Engagement Link</h2>
                  <span className="text-[10px] font-black text-cyan-500/60 uppercase tracking-[0.3em]">Predictive Analysis Active</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl transition-colors">
                <X className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            <div className="bg-white/[0.03] p-8 rounded-3xl border border-white/5 mb-10">
              <p className="text-lg font-bold text-gray-200 leading-relaxed">
                {context}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                { label: "High Confidence", points: 500, icon: Trophy, color: "from-yellow-500 to-orange-600" },
                { label: "Standard Play", points: 200, icon: Zap, color: "from-cyan-500 to-blue-600" },
                { label: "Momentum Bet", points: 100, icon: TrendingUp, color: "from-pink-500 to-purple-600" },
                { label: "Quick Pick", points: 50, icon: Target, color: "from-green-500 to-emerald-600" }
              ].map((opt, i) => (
                <button
                  key={i}
                  onClick={() => {
                    onPredict(opt.points);
                    onClose();
                  }}
                  className="group relative flex flex-col items-center justify-center p-6 rounded-[2rem] bg-white/[0.03] border border-white/10 hover:border-white/30 transition-all active:scale-95"
                >
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${opt.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                    <opt.icon className="w-6 h-6 text-white" />
                  </div>
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1 group-hover:text-white transition-colors">{opt.label}</span>
                  <span className="text-xl font-black text-white">{opt.points}pts</span>
                </button>
              ))}
            </div>

            <p className="text-center text-[10px] font-black text-gray-600 uppercase tracking-[0.2em]">
              Points will be credited upon match resolution
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
