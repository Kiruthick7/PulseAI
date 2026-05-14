import { NextResponse } from "next/server";
import { generateCricketInsight } from "@/lib/groq";

export async function POST(req: Request) {
  try {
    const { event, scoreA, scoreB, striker, bowler, battingTeam } = await req.json();
    
    const insightText = await generateCricketInsight(event, scoreA, scoreB, striker, bowler, battingTeam);
    
    return NextResponse.json({ 
      insightText,
      provider: "Groq Llama-3"
    });
  } catch (error) {
    return NextResponse.json({ error: "Insight generation failed" }, { status: 500 });
  }
}
