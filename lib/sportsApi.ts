export type SportsEvent = {
  id: string;
  timeElapsed: number | string;
  type: string;
  detail: string;
  team: string;
  playerName: string;
  scoreA: string;
  scoreB: string;
};

export type MatchState = {
  elapsedSeconds: number | string;
  scoreA: string;
  scoreB: string;
  teamA: string;
  teamB: string;
  teamALogo: string;
  teamBLogo: string;
  teamAColor: string;
  teamBColor: string;
  battingTeam: string;
  striker: string;
  nonStriker: string;
  bowler: string;
  matchStatus: string;
  matchNote: string;
  leagueContext: string;
  targetScore: string;
  maxOvers: string;
  momentumScore: number;
  recentEvents: SportsEvent[];
};

export async function fetchLiveMatchData(): Promise<MatchState> {
  try {
    const res = await fetch("https://site.api.espn.com/apis/site/v2/sports/cricket/8048/scoreboard", {
      next: { revalidate: 15 }
    });
    const data = await res.json();

    if (!data.events || data.events.length === 0) {
      throw new Error("No IPL events found in the current feed.");
    }

    const event = data.events.find((e: any) => e.status.type.state === "in") ||
                  data.events.find((e: any) => e.status.type.state === "post") ||
                  data.events[0];

    const competition = event.competitions[0];
    const teamA = competition.competitors.find((c: any) => c.homeAway === "home");
    const teamB = competition.competitors.find((c: any) => c.homeAway === "away");
    const status = event.status;

    const isLive = status.type.state === "in";
    const isPost = status.type.state === "post";
    const isUpcoming = status.type.state === "pre";

    const scoreAStr = teamA.score ? (teamA.score.includes("(") ? teamA.score.replace(/, target \d+/, "").replace(/ ov/, "") : `${teamA.score} (20.0)`) : "0/0";
    const scoreBStr = teamB.score ? (teamB.score.includes("(") ? teamB.score.replace(/, target \d+/, "").replace(/ ov/, "") : `${teamB.score} (20.0)`) : (isUpcoming ? "Yet to Bat" : "0/0");

    const summaryRes = await fetch(`http://site.api.espn.com/apis/site/v2/sports/cricket/8039/summary?event=${event.id}`);
    const summaryData = await summaryRes.json();

    let recentEvents: SportsEvent[] = [];

    if (summaryData.commentary && summaryData.commentary.length > 0) {
      recentEvents = summaryData.commentary.slice(0, 10).map((c: any, i: number) => ({
        id: `commentary-${i}`,
        timeElapsed: c.over?.toFixed(1) || "LIVE",
        type: c.playType?.name || "Tactical Update",
        detail: c.text || "Analyzing ball trajectory...",
        team: "",
        playerName: "",
        scoreA: scoreAStr,
        scoreB: scoreBStr
      }));
    } else if (isUpcoming) {
      recentEvents = [
        { id: 'm1', timeElapsed: 'PHASE 01', type: 'Neural Sync', detail: 'Tactical Uplink established. Venue atmospheric analysis complete.', scoreA: '0/0', scoreB: '0/0', team: '', playerName: '' },
        { id: 'm2', timeElapsed: 'PHASE 02', type: 'Tactical Intel', detail: 'Head-to-head performance metrics calibrated for evening conditions.', scoreA: '0/0', scoreB: '0/0', team: '', playerName: '' },
        { id: 'm3', timeElapsed: 'PHASE 03', type: 'System Ready', detail: 'Predictive momentum engine online. Awaiting toss sequence.', scoreA: '0/0', scoreB: '0/0', team: '', playerName: '' }
      ];
    } else {
      recentEvents = [{
        id: event.id,
        timeElapsed: isLive ? (status.displayClock || "LIVE") : "0.0",
        type: isPost ? "Final" : (isLive ? "Update" : "Scheduled"),
        detail: status.summary || "Awaiting tactical updates...",
        team: "",
        playerName: "",
        scoreA: scoreAStr,
        scoreB: scoreBStr
      }];
    }

    const matchNote = event.competitions[0].notes?.[0]?.text || (isPost ? status.type.detail : "");
    const leagueName = event.competitions[0].series?.name || "Indian Premier League";
    const matchLabel = event.competitions[0].status?.type?.shortDetail || "";

    const targetMatch = status.summary?.match(/target\s*(\d+)|need\s*(\d+)/i);
    const dynamicTarget = targetMatch ? (targetMatch[1] || targetMatch[2]) : "";

    return {
      elapsedSeconds: isLive ? (status.displayClock || "0.0") : (isPost ? "Final" : "Scheduled"),
      scoreA: isUpcoming ? "Toss Pending" : scoreAStr,
      scoreB: isUpcoming ? "Waiting for Toss" : scoreBStr,
      teamA: teamA.team.displayName || teamA.team.name,
      teamB: teamB.team.displayName || teamB.team.name,
      teamALogo: teamA.team.logo || `https://a.espncdn.com/i/teamlogos/cricket/500/${teamA.team.id}.png`,
      teamBLogo: teamB.team.logo || `https://a.espncdn.com/i/teamlogos/cricket/500/${teamB.team.id}.png`,
      teamAColor: teamA.team.color ? `#${teamA.team.color}` : "#f10920",
      teamBColor: teamB.team.color ? `#${teamB.team.color}` : "#573f82",
      battingTeam: isUpcoming ? "TBD" : (isLive ? (teamA.score?.includes("Batting") ? teamA.team.displayName : teamB.team.displayName) : teamA.team.displayName),
      striker: isUpcoming ? "Awaiting Toss..." : (isLive ? "Dynamic Uplink Active" : "Innings Complete"),
      nonStriker: isUpcoming ? "Awaiting Toss..." : (isLive ? "Waiting..." : "Innings Complete"),
      bowler: isUpcoming ? "Awaiting Toss..." : (isLive ? "Analyzing Delivery Pattern..." : "Innings Complete"),
      matchStatus: isUpcoming ? "PRE-GAME" : (isPost ? "MATCH COMPLETE" : (status.type.detail || status.summary)),
      matchNote: matchNote || (isUpcoming ? "TACTICAL PREVIEW: VENUE ANALYSIS ACTIVE" : ""),
      leagueContext: `${leagueName} • ${matchLabel}`,
      targetScore: isUpcoming ? "" : dynamicTarget,
      maxOvers: "20",
      momentumScore: isPost ? 100 : Math.round(50 + (Math.random() * 30 - 15)),
      recentEvents
    };
  } catch (error) {
    console.error("Error fetching ESPN data:", error);
    return getFallbackIPLData();
  }
}

function getFallbackIPLData(): MatchState {
  return {
    elapsedSeconds: "SIMULATED",
    scoreA: "194/4 (19.1/20)",
    scoreB: "192/4 (20.0)",
    teamA: "Royal Challengers Bengaluru",
    teamB: "Kolkata Knight Riders",
    teamALogo: "https://a.espncdn.com/i/teamlogos/cricket/500/335970.png",
    teamBLogo: "https://a.espncdn.com/i/teamlogos/cricket/500/335971.png",
    teamAColor: "#f10920",
    teamBColor: "#573f82",
    battingTeam: "RCB",
    striker: "Virat Kohli",
    nonStriker: "F. du Plessis",
    bowler: "Sunil Narine",
    matchStatus: "MATCH COMPLETE",
    matchNote: "RCB WON BY 6 WICKETS",
    leagueContext: "IPL 2026 • Match 54 of 74",
    targetScore: "193",
    maxOvers: "20",
    momentumScore: 100,
    recentEvents: [
      {
        id: "f1",
        timeElapsed: "19.1",
        type: "Boundary",
        detail: "Virat Kohli seals it with a boundary! RCB wins a thriller at Raipur.",
        team: "RCB",
        playerName: "Virat Kohli",
        scoreA: "194/4",
        scoreB: "192/4"
      },
      {
        id: "e18",
        timeElapsed: "18.0",
        type: "Matchup Shift",
        detail: "RCB targets the 5th bowler matchup. 18 runs from the over disrupts the death-overs plan.",
        team: "RCB",
        playerName: "F. du Plessis",
        scoreA: "182/4",
        scoreB: "192/4"
      },
      {
        id: "e15",
        timeElapsed: "15.0",
        type: "Acceleration",
        detail: "Calculated onslaught begins. Strike rotation rate reaches 75% in the middle overs.",
        team: "RCB",
        playerName: "Virat Kohli",
        scoreA: "145/3",
        scoreB: "192/4"
      },
      {
        id: "e10",
        timeElapsed: "10.0",
        type: "Tactical Hold",
        detail: "Strategic consolidation as field spread widens. Required rate steady at 9.5.",
        team: "RCB",
        playerName: "Maxwell",
        scoreA: "92/2",
        scoreB: "192/4"
      },
      {
        id: "e6",
        timeElapsed: "6.0",
        type: "Powerplay",
        detail: "Aggressor unit exploits the powerplay gap at deep mid-wicket.",
        team: "RCB",
        playerName: "F. du Plessis",
        scoreA: "58/1",
        scoreB: "192/4"
      },
      {
        id: "e1",
        timeElapsed: "1.0",
        type: "Opening Charge",
        detail: "First boundary found square of the wicket. Yorker defense successful.",
        team: "RCB",
        playerName: "Virat Kohli",
        scoreA: "12/0",
        scoreB: "192/4"
      }
    ]
  };
}
