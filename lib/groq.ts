import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
});

export async function generateCricketInsight(event: any, scoreA: string, scoreB: string, striker?: string, bowler?: string, battingTeam?: string) {
  if (!process.env.GROQ_API_KEY) {
    return "Tactical Sync Active: Current parity suggests a high-pressure climax. Analysis suggests targeting the 5th bowler matchup to disrupt the death-over plan early.";
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are an elite Cricket Performance Data Scientist. 
          Your goal is to provide granular, concrete tactical insights. 
          
          STRICT RULES:
          1. NO generic buzzwords (e.g., "masterclass", "think tank", "momentum shift", "clinical").
          2. NO vague narratives. 
          3. MUST identify specific mechanics: Bowler matchups (e.g., "targeting the spinner's line"), field placements (e.g., "exploiting the gap at deep mid-wicket"), or tactical pressure points (e.g., "depleting the opponent's strike bowler overs early").
          4. FOCUS on causal links: Why did this event happen and what is the observable effect on the opposition's strategy?
          
          GOOD EXAMPLE: "RCB’s chase turned decisively in overs 15–18, when they targeted the opposition’s fifth-bowler matchup and consistently found boundaries square of the wicket. Rather than waiting for the final over assault, RCB disrupted the death-overs plan early, forcing the captain to burn his best yorker options before the finish."
          
          IF TOSS IS PENDING: Focus on how the toss will dictate the powerplay strategy. Example: "With the toss pending, the tactical focus is on the dew factor; winning the flip and bowling first could neutralize the spinner's grip, forcing the batting side to find an additional 15-20 runs in the first inning."
          
          IF MATCH IS SCHEDULED/PRE-GAME: Focus on venue stats, head-to-head tactical matchups, or weather impact. Do not assume in-game events.`
        },
        {
          role: "user",
          content: `TACTICAL UPLINK:
          Match State: ${scoreA === "Toss Pending" ? "TOSS PENDING" : (event.type === "Scheduled" ? "PRE-GAME / SCHEDULED" : "LIVE / POST")}
          State: ${scoreA} vs ${scoreB}
          Batting Unit: ${battingTeam || "Analyzing..."}
          Active Striker: ${striker || "Tracking..."}
          Active Bowler: ${bowler || "Analyzing..."}
          Event Context: ${event.type} - ${event.detail}
          
          Analyze the specific causal tactical shift or provide a pre-match tactical forecast.`
        }
      ],
      model: "llama-3.3-70b-versatile",
      max_tokens: 512,
    });

    return completion.choices[0]?.message?.content || "Neural analysis interrupted. Re-linking tactical streams...";
  } catch (error) {
    console.error("Groq AI Error", error);
    // Robust Neural Reserve Fallback
    const winDiff = parseInt(scoreA) - parseInt(scoreB);
    if (isNaN(winDiff)) return "Tactical uplink established. Analyzing match metadata for momentum shifts...";
    
    return `Strategic Sync Active: ${scoreA} vs ${scoreB} parity suggests a high-pressure climax. Neural indicators suggest ${winDiff > 0 ? "Aggressor" : "Defender"} unit is maintaining a ${Math.abs(winDiff)} run edge in this phase.`;
  }
}
