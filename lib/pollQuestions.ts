export interface PollOption {
  label: string;
  votes: number;
}

export interface PollQuestion {
  phase: "PRE-GAME" | "LIVE" | "POST-MATCH";
  question: string;
  options: PollOption[];
}

export const TACTICAL_POLLS: PollQuestion[] = [
  // PRE-GAME
  {
    phase: "PRE-GAME",
    question: "Who will have the biggest impact in the Powerplay today?",
    options: [
      { label: "Opening Batters", votes: 58 },
      { label: "New Ball Bowlers", votes: 42 }
    ]
  },
  {
    phase: "PRE-GAME",
    question: "Strategic Prediction: Better to bat first or chase on this surface?",
    options: [
      { label: "Bat First", votes: 31 },
      { label: "Chase", votes: 69 }
    ]
  },
  {
    phase: "PRE-GAME",
    question: "Toss Tactical Choice: Should the captain opt for an extra spinner?",
    options: [
      { label: "Yes, track is dry", votes: 75 },
      { label: "No, stick to pace", votes: 25 }
    ]
  },
  
  // LIVE
  {
    phase: "LIVE",
    question: "Should the bowling side introduce spin now to stem the flow?",
    options: [
      { label: "Yes, increase pressure", votes: 68 },
      { label: "No, keep attacking with pace", votes: 32 }
    ]
  },
  {
    phase: "LIVE",
    question: "Tactical Shift: Should the batting side go for the 15-run over now?",
    options: [
      { label: "Aggressive Intent", votes: 82 },
      { label: "Consolidate Base", votes: 18 }
    ]
  },
  {
    phase: "LIVE",
    question: "Momentum Check: Who is winning the tactical battle in these middle overs?",
    options: [
      { label: "Batting Strategy", votes: 54 },
      { label: "Bowling Execution", votes: 46 }
    ]
  },
  {
    phase: "LIVE",
    question: "Death Over Strategy: Focus on Yorkers or slower-ball variations?",
    options: [
      { label: "Lethal Yorkers", votes: 45 },
      { label: "Deceptive Slower Balls", votes: 55 }
    ]
  },

  // POST-MATCH
  {
    phase: "POST-MATCH",
    question: "What was the definitive tactical turning point of this match?",
    options: [
      { label: "The Powerplay Start", votes: 24 },
      { label: "The Middle-Order Stand", votes: 76 }
    ]
  },
  {
    phase: "POST-MATCH",
    question: "Neural MVP: Who provided the most tactical value under pressure?",
    options: [
      { label: "Top Performer A", votes: 62 },
      { label: "Top Performer B", votes: 38 }
    ]
  }
];

export function getTacticalPoll(matchStatus: string, index: number = 0): PollQuestion {
  let phase: "PRE-GAME" | "LIVE" | "POST-MATCH" = "LIVE";
  
  if (matchStatus === "PRE-GAME") phase = "PRE-GAME";
  if (matchStatus === "MATCH COMPLETE") phase = "POST-MATCH";
  
  const filtered = TACTICAL_POLLS.filter(p => p.phase === phase);
  return filtered[index % filtered.length] || TACTICAL_POLLS[0];
}
