import { NextResponse } from "next/server";
import { fetchLiveMatchData } from "@/lib/sportsApi";

export async function GET() {
  try {
    const match = await fetchLiveMatchData();
    return NextResponse.json(match);
  } catch (error) {
    console.error("Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch match data" }, { status: 500 });
  }
}
