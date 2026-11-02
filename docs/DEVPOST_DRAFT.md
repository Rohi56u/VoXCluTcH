# Devpost submission draft

## Project name
**VoxClutch — catch the moment chat saw first**

## One-line description
VoxClutch turns Twitch chat reaction bursts into explainable, timestamped moments that streamers can review and optionally clip from their own VOD.

## Inspiration
Streamers split attention between gameplay, production and chat. A memorable moment can pass in seconds while a creator is looking elsewhere. Chat often reacts collectively before anyone has time to mark the moment, but a burst of messages alone is noisy and hard to review later.

## What it does
VoxClutch connects to public Twitch chat in anonymous read-only mode, scores a rolling reaction window using visible signals (message velocity, distinct chatters and reaction cues), and builds a timestamped moment queue. Its new **EchoMap** feature scans a creator-supplied VOD locally, compares each candidate's audio peak with nearby ambience, and adds a second evidence stream to help rank moments where the chat reaction and the sound track align. Creators—not a model—keep or dismiss suggestions, and can render a local MP4 segment from a VOD they are entitled to process.

## How we built it
Python, Flask, SQLite, a dedicated Twitch IRC WebSocket adapter, a deterministic scoring module, HTML/CSS/JavaScript, and FFmpeg. EchoMap derives one-second local RMS dBFS values, compares a candidate peak against nearby ambient audio, and fuses the result with the chat score using a documented 70/30 heuristic. No transcription model or remote audio service is used. The demo mode injects synthetic events to make the interaction demonstrable without Twitch credentials or a live channel. Raw chat text is not stored in SQLite.

## What makes it different
The system shows why it raised a moment instead of presenting an opaque “AI highlight” label. EchoMap adds an independent, local VOD-audio clue to the chat signal while keeping those scores and their limits visible. It is creator-controlled and designed to degrade gracefully: chat-only timestamped review still works if VOD analysis, clip export or Twitch connection is unavailable. It does not autonomously moderate, change channel settings or publish content.

## Challenges we ran into
Anonymous public chat is best-effort and can be rate-limited or unavailable, so a clearly labelled synthetic fallback is built in. Real-time events and VOD-relative time need explicit alignment. EchoMap relies on a user-supplied offset and loudness is only a supporting clue: quiet visual highlights may have no audio spike, while unrelated sound can be loud. Both ranking components are heuristics, not a measured prediction of highlight quality.

## Accomplishments
- A usable dashboard with real-time connection state and a demo-safe workflow.
- A testable, deterministic detector with inspectable score evidence.
- EchoMap's local chat-to-audio comparison and clearly separated dB evidence.
- Persistent review states without persisting raw chat transcripts.
- An optional local clip path that keeps VOD handling in the creator's control.

## What's next
Add automatic VOD offset alignment; evaluate chat and EchoMap ranking against opt-in, labelled clips; use adaptive per-channel baselines; move long media analysis to a job queue; add a secure OBS browser-source widget; and build deletion/export controls for retained moment metadata.

## Demo script (60–90 seconds)
1. Show the dashboard's read-only/privacy posture.
2. Click **Run demo**, label it synthetic, and point to the score breakdown.
3. Keep one candidate and dismiss/restore another.
4. Upload a short, rights-cleared sample VOD, run EchoMap, and show the per-moment decibel comparison and combined heuristic ranking.
5. If time permits, export one reviewed segment; explain the supplied time offset and local-only processing.
6. Close with the creator-in-control boundary: recommendations only, no auto-posting or moderation.

## Claims checklist
Only say “live Twitch chat” after demonstrating an actual channel connection. Label the sample burst as synthetic. Do not claim measured accuracy, viral prediction, semantic/audio understanding, automatic VOD synchronization, OAuth protection, production-scale performance, or Twitch endorsement. Add screenshots/video and a public repository URL only after you create/publish them.
