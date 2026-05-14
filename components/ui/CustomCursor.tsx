"use client";

import { useEffect, useState } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";

export default function CustomCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 200 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const moveMouse = (e: MouseEvent) => {
      mouseX.set(e.clientX - 16);
      mouseY.set(e.clientY - 16);
    };

    const handleHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      setIsHovering(!!target.closest("button, a, [role='button']"));
    };

    window.addEventListener("mousemove", moveMouse);
    window.addEventListener("mouseover", handleHover);

    return () => {
      window.removeEventListener("mousemove", moveMouse);
      window.removeEventListener("mouseover", handleHover);
    };
  }, [mouseX, mouseY]);

  return (
    <motion.div
      style={{
        translateX: cursorX,
        translateY: cursorY,
      }}
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[9999] flex items-center justify-center"
    >
      <div className="w-1 h-1 bg-cyan-400 rounded-full shadow-[0_0_8px_rgba(34,211,238,1)]" />

      <motion.div
        animate={{
          rotate: 360,
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.8 : 0.4
        }}
        transition={{
          rotate: { duration: 10, repeat: Infinity, ease: "linear" },
          scale: { type: "spring", stiffness: 300, damping: 20 }
        }}
        className="absolute inset-0 border border-cyan-500/40 rounded-full border-dashed"
      />

      {[0, 90, 180, 270].map((rot) => (
        <motion.div
          key={rot}
          style={{ rotate: rot }}
          animate={{ scale: isHovering ? 1.2 : 1 }}
          className="absolute w-2 h-2 border-t border-l border-cyan-400/60"
        />
      ))}
    </motion.div>
  );
}
