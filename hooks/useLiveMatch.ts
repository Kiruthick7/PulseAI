"use client";

import { useState, useEffect, useRef } from "react";
import { MatchState } from "@/lib/sportsApi";

export function useLiveMatch() {
  const [gameState, setGameState] = useState<MatchState | null>(null);
  const fetchedInsightIds = useRef<Set<string>>(new Set());

  useEffect(() => {
    const fetchState = async () => {
      try {
        const res = await fetch("/api/live-match");
        const data: MatchState = await res.json();
        setGameState(data);
      } catch (err) {
        console.error("Match fetch error:", err);
      }
    };

    const interval = setInterval(fetchState, 5000);
    fetchState();
    return () => clearInterval(interval);
  }, []);

  return { gameState, fetchedInsightIds };
}
