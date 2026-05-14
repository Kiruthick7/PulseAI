"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const EMOJIS = ["🔥", "👏", "😲", "☝️", "🏏", "💯"];

export default function ReactionPulse() {
  const [reactions, setReactions] = useState<{ id: number; emoji: string }[]>([]);

  const addReaction = (emoji: string) => {
    const id = Date.now();
    setReactions((prev) => [...prev, { id, emoji }]);
    setTimeout(() => {
      setReactions((prev) => prev.filter((r) => r.id !== id));
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2 p-2 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => addReaction(emoji)}
            className="w-10 h-10 flex items-center justify-center text-xl hover:bg-white/10 rounded-xl transition-colors active:scale-90"
          >
            {emoji}
          </button>
        ))}
      </div>

      <div className="fixed bottom-32 right-12 pointer-events-none z-[100]">
        <AnimatePresence>
          {reactions.map((r) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 0, scale: 0.5 }}
              animate={{ opacity: 1, y: -200, scale: 1.5, x: Math.random() * 40 - 20 }}
              exit={{ opacity: 0 }}
              className="absolute bottom-0 text-4xl"
            >
              {r.emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
