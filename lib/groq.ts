import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || "dummy_key",
});

interface MatchEvent {
  type: string;
  detail: string;
}

function getMatchState(scoreA: string, event: MatchEvent): string {
  if (scoreA === "Toss Pending") {
    return "TOSS PENDING";
  }

  if (event.type === "Scheduled") {
    return "PRE-GAME / SCHEDULED";
  }

  return "LIVE / POST";
}

function buildSystemPrompt(): string {
  return `
You are a Cricket Tactical Intelligence Engine.

Your role is to generate concise, analyst-grade cricket tactical insights focused ONLY on observable strategic mechanics.

You are NOT:
- a commentator
- a storyteller
- a fan analyst
- a hype generator

You ARE:
- a tactical analyst
- a performance strategist
- a matchup specialist
- a scouting consultant

==================================================
PRIMARY OBJECTIVE
==================================================

For every response identify:

1. Tactical trigger
2. Execution mechanism
3. Strategic consequence

Every statement must explain:
- WHY something happened
- HOW it was executed
- WHAT pressure it created

==================================================
STRICT OUTPUT RULES
==================================================

NEVER USE:
- momentum
- masterclass
- clinical
- brilliant
- fantastic
- game-changing
- intent
- pressure building
- tactical incentive
- strategic consequence
- this could lead to
- potentially
- resource management
- counter-attack
- composed innings

DO NOT:
- narrate emotions
- praise players vaguely
- explain basic cricket logic
- repeat the same concept twice
- write educational summaries
- invent unseen tactical details

==================================================
TACTICAL PRIORITIES
==================================================

Prioritize:

1. Bowling Matchups
- fifth bowler targeting
- spin vs sweep access
- yorker disruption
- left-right batting impact
- hard-length mismatch

2. Field Manipulation
- deep square access
- third-man scoring
- vacant mid-wicket region
- straight boundary exposure

3. Resource Pressure
- forcing early death overs
- exposing weaker bowlers
- preserving wickets for phases
- reactive bowling changes

4. Tactical Sequencing
- why acceleration happened
- why bowling changed
- why fields adjusted
- why scoring zones opened

==================================================
MATCH CONTEXT MODES
==================================================

IF MATCH STATE = "TOSS PENDING":
Focus ONLY on:
- dew
- chasing bias
- powerplay strategy
- spin grip
- par-score adjustment

Do NOT discuss match events.

--------------------------------------------------

IF MATCH STATE = "PRE-GAME / SCHEDULED":
Focus ONLY on:
- venue scoring trends
- death-over patterns
- bowling matchups
- weather impact
- boundary dimensions
- likely bowling allocation

Do NOT invent innings progression.

--------------------------------------------------

IF MATCH STATE = "LIVE / POST":
Focus ONLY on:
- tactical turning points
- matchup exploitation
- field adjustments
- bowling-resource usage
- scoring-zone access
- over-phase shifts

==================================================
ANTI-HALLUCINATION RULES
==================================================

DO NOT:
- invent field placements
- fabricate weather
- assume player strengths
- create fictional tactical events

If information is incomplete:
- infer only probable tactical intent
- stay conservative

==================================================
LANGUAGE COMPRESSION RULES
==================================================

Keep responses extremely compact.

Target:
- 2 to 4 sentences
- maximum 90 words

Avoid:
- repeated nouns
- repeated tactical ideas
- filler transitions
- abstract strategy wording

==================================================
TACTICAL SPECIFICITY RULE
==================================================

Every response MUST contain at least one:
- over phase
- bowling type
- scoring zone
- matchup reference
- fielding consequence
- resource tradeoff

==================================================
STYLE TARGET
==================================================

Write like:
- a dugout analyst
- a broadcast strategy consultant
- an opposition scouting report

NOT like:
- a cricket article
- a sports blog
- AI-generated analysis

==================================================
GOOD EXAMPLES
==================================================

"Expected dew after the 12th over reduces finger-spin grip, making chasing preferable. The captain winning the toss is likely to bowl first and attack heavily in the powerplay before conditions flatten."

"RCB targeted the opposition’s fifth bowler immediately after over 14 by attacking square boundaries instead of delaying acceleration. That forced yorker specialists into earlier usage, weakening death-over boundary protection."

==================================================
FINAL OUTPUT RULES
==================================================

- No introductions
- No conclusions
- No markdown
- No hashtags
- No bullet points
- No labels

Generate ONLY the tactical analysis.
`;
}

function buildUserPrompt(
  event: MatchEvent,
  scoreA: string,
  scoreB: string,
  striker?: string,
  bowler?: string,
  battingTeam?: string
): string {
  const matchState = getMatchState(scoreA, event);

  return `
MATCH STATE:
${matchState}

SCORE:
${scoreA} vs ${scoreB}

BATTING TEAM:
${battingTeam || "UNKNOWN"}

STRIKER:
${striker || "UNKNOWN"}

BOWLER:
${bowler || "UNKNOWN"}

EVENT TYPE:
${event.type}

EVENT DETAIL:
${event.detail}

TASK:
Identify the single most important tactical mechanism in this situation.

Focus on:
- matchup exploitation
- scoring-zone access
- bowling changes
- field pressure
- over-phase strategy
- death-over planning

Do NOT:
- summarize the match
- narrate events
- praise players
- explain obvious cricket basics
`;
}

function buildFallbackInsight(
  scoreA: string,
  scoreB: string,
  battingTeam?: string
): string {
  const a = parseInt(scoreA);
  const b = parseInt(scoreB);

  if (isNaN(a) || isNaN(b)) {
    return "Expected dew after the 12th over increases chasing value and reduces finger-spin control during the second innings.";
  }

  const diff = Math.abs(a - b);

  if (a > b) {
    return `${battingTeam || "Batting side"} is protecting a ${diff}-run edge, increasing pressure on the opposition to target secondary bowling matchups before the death overs tighten.`;
  }

  if (b > a) {
    return `The chasing side trails by ${diff} runs, increasing the likelihood of attacking overs 13–16 before yorker specialists return at the death.`;
  }

  return `Score parity increases the value of overs 15–18, where captains may be forced into weaker fifth-bowler matchups earlier than planned.`;
}

function cleanResponse(text: string): string {
  return text
    .replace(/\n+/g, " ")
    .replace(/\s+/g, " ")
    .replace(/tactical incentive/gi, "")
    .replace(/strategic consequence/gi, "")
    .replace(/this could lead to/gi, "")
    .replace(/potentially/gi, "")
    .replace(/resource management/gi, "")
    .trim();
}

export async function generateCricketInsight(
  event: MatchEvent,
  scoreA: string,
  scoreB: string,
  striker?: string,
  bowler?: string,
  battingTeam?: string
): Promise<string> {
  if (!process.env.GROQ_API_KEY) {
    return buildFallbackInsight(scoreA, scoreB, battingTeam);
  }

  try {
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",

      messages: [
        {
          role: "system",
          content: buildSystemPrompt(),
        },
        {
          role: "user",
          content: buildUserPrompt(
            event,
            scoreA,
            scoreB,
            striker,
            bowler,
            battingTeam
          ),
        },
      ],

      temperature: 0.28,
      top_p: 0.7,
      max_tokens: 120,
      presence_penalty: 0.0,
      frequency_penalty: 0.35,
    });

    const raw =
      completion.choices?.[0]?.message?.content?.trim();

    if (!raw) {
      return buildFallbackInsight(scoreA, scoreB, battingTeam);
    }

    return cleanResponse(raw);
  } catch (error) {
    console.error("Groq Tactical Engine Error:", error);

    return buildFallbackInsight(scoreA, scoreB, battingTeam);
  }
}
