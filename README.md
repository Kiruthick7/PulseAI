# CricketPulse AI: The Infinite Cricket Companion

Built for the Google Hackathon, CricketPulse AI is a real-time, AI-powered second-screen engagement platform.

## Features
- **Cinematic Dashboard**: Futuristic Cyber-Sports UI with glassmorphism and neon highlights.
- **AI Pulse Stream**: Real-time contextual commentary powered by Groq Llama-3.
- **Momentum Gauge**: Dynamic match pressure analysis.
- **Fan Engagement**: Prediction Hub with a "Hype Points" gamification system.
- **Cloud Native**: Optimized for Google Cloud Run with ultra-low latency.

## Tech Stack
- **Frontend**: Next.js 15, Tailwind CSS, Framer Motion
- **AI**: Groq SDK (Llama-3-70b)
- **Deployment**: Docker, Google Cloud Run
- **Data**: Lightweight polling for real-time match state.

## Setup & Deployment

### Local Development
1. Clone the repository.
2. Install dependencies: `npm install`
3. Set environment variables in `.env.local`:
   ```env
   GROQ_API_KEY=your_key
   FORCE_MOCK_DATA=true
   ```
4. Run: `npm run dev`

### Deployment to Google Cloud Run
1. Build the Docker image:
   ```bash
   gcloud builds submit --tag gcr.io/[PROJECT_ID]/cricket-pulse
   ```
2. Deploy to Cloud Run:
   ```bash
   gcloud run deploy cricket-pulse \
     --image gcr.io/[PROJECT_ID]/cricket-pulse \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated \
     --set-env-vars GROQ_API_KEY=your_key
   ```

## Demo Flow for Judges
1. **Initial Impression**: Showcase the "Neural Stream" and glowing scoreboard.
2. **Real-time Event**: Watch as new ball-by-ball events trigger AI commentary.
3. **Engagement**: Trigger a prediction poll (Automatic after major events like Boundaries/Wickets).
4. **Gamification**: Accumulate "Hype Points" and show the leaderboard-ready state.
