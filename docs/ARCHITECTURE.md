# VoxClutch architecture

```text
Anonymous public Twitch IRC WebSocket ──┐
                                         ├─> transient normalized chat event
Synthetic demo input ────────────────────┘              │
                                                        ▼
                                          rolling reaction detector
                                                        │
                                                        ▼
                                        SQLite aggregate moment evidence
                                                        │
                             browser polls local Flask JSON API every 2.5 s
                                                        │
                                                        ▼
                                      creator reviews / keeps / dismisses
                                                        │
                        uploaded authorized VOD + explicit start offset
                                        │
                                        ▼
                             FFmpeg → 1-second audio RMS levels (local)
                                         │
                                         ▼
                     EchoMap: candidate peak vs nearby ambient dBFS
                       chat score (70%) + audio fit (30%) → rank
                                         │
                                         ▼
                             creator review → local FFmpeg clip
```

## Boundaries

- `TwitchChatListener` owns IRC connection, parsing, reconnect and lifecycle. It performs no Helix writes, moderation, chat replies, EventSub subscription, or OAuth flow.
- `MomentDetector` accepts provider-independent user/text/time/event-id tuples. It has no database or web dependency and retains a bounded live window in memory.
- `MomentStore` persists only candidate metadata/evidence and review state; it never receives raw message text.
- `EchoMap` streams uploaded VOD audio as local mono PCM in one-second blocks at 8 kHz, derives per-second RMS dBFS (including a final partial second), and releases each block after the scan. The compact loudness series is kept in process memory for candidate comparisons; raw audio is not retained or sent to a remote model.
- `audio_evidence` compares a candidate's loudest second with the median nearby ambient level. EchoMap fit is explicitly a heuristic and is fused as 70% chat score plus 30% audio-fit score for queue ordering; neither value is a probability or highlight-quality claim.
- Flask routes validate input and enforce loopback binding/request guard. The browser never receives credentials because this MVP has none.
- `export_clip` only sees a constrained path under the server upload directory, validates file type and clip bounds, and invokes FFmpeg without a shell. Rendering is local and synchronous in this prototype; large media workloads should move to a bounded async worker.

## Current limitations and follow-up

This is a functional local hackathon prototype, not a multi-user hosted app. It has no Twitch OAuth, broadcaster identity association, channel authorization/session model, EventSub event feed, baseline calibration, rate limiting, or robust asynchronous job queue. The detector and EchoMap have no labelled evaluation dataset. The dashboard uses short-interval polling rather than SSE/WebSockets. EchoMap depends on the user-provided VOD offset; it does not automatically synchronize streams. Audio peaks can miss quiet visual moments, and loud ambient content can be a false cue. Improve these before claiming production readiness or public deployment.
