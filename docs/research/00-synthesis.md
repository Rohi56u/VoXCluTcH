# Twitch Hackathon Blueprint: VoxClutch — Live Moments to Shareable Clips

## Executive recommendation

Build **VoxClutch**, a creator-facing assistant that watches a Twitch channel’s live chat and stream events, detects likely “clip-worthy” moments, and turns them into a reviewable, timestamped highlight queue. The MVP should prioritize one reliable loop: ingest live chat and Twitch events, detect bursts of audience reaction, associate them with a time window, and let the streamer review and export a clip candidate. AI should explain and rank candidates—not autonomously moderate the channel or publish content.

This direction combines the strongest hackathon-sized seams in the research: Twitch chat/EventSub integration, real-time overlays and dashboards, and clip/highlight workflows. It deliberately avoids trying to reproduce a full chatbot, avatar suite, overlay editor, or generalized video editor in one sprint.

**Hackathon success criterion:** a connected streamer can see a live “moment radar,” understand why a moment was flagged, and create a usable clip candidate with minimal friction.

## Product definition

**Users:** Twitch streamers and moderators who want to capture memorable live moments without continuously monitoring chat or scrubbing a VOD.

**Problem:** exciting moments are easy to miss while streaming. Chat activity and Twitch event signals offer useful cues, but are scattered and do not by themselves create an organized, reviewable highlight workflow.

**MVP promise:** VoxClutch turns real-time audience signals into an explainable, timestamped shortlist of moments for human review.

**Non-goals for the MVP:** autonomous moderation, predictions or channel-setting changes; a general-purpose AI chatbot; a full overlay authoring platform; automated publishing to social networks; robust audiovisual event detection; multi-platform support; or promises of accurate semantic understanding of the stream itself.

## Practical MVP architecture

Use a simple, independently testable service architecture. Keep the event path and media path distinct so the live experience remains responsive even if a VOD download or clip render is slow.

```text
Twitch OAuth (broadcaster consent)
        │
        ├── Twitch chat / EventSub adapter ──┐
        │                                    ▼
        │                            Event normalizer
        │                                    │
        │                                    ▼
        │                       Moment detector + scorer
        │                                    │
        ▼                                    ▼
Minimal web dashboard ◄── REST + WebSocket ── Moment store
                                             │
                                             ▼
                               Optional clip worker (VOD)
                                             │
                                             ▼
                                 Candidate clip + review
```

### Suggested implementation choices

For a short hackathon, choose one primary backend language and keep the rest ordinary. **Python with FastAPI/Starlette and asyncio** is a plausible baseline because the supplied Twitch Python library combines Helix, chat, OAuth and EventSub APIs. A lightweight browser dashboard can be plain TypeScript/React or static HTML/JavaScript. Alternatively, a TypeScript backend can use the Twitch bot research’s Node stack. Do not build both stacks; choose based on team familiarity and the shortest path to a working Twitch connection.

Core components:

1. **Twitch connection adapter.** Encapsulate OAuth, chat connection, Helix lookups and EventSub subscription lifecycle. Request only necessary scopes. Begin with a single broadcaster and the least privileged read-oriented signals required. Use real Twitch authorization and validate all returned identities and scopes.
2. **Event normalizer.** Convert provider-specific messages into a small internal schema, e.g. `{id, channelId, type, occurredAt, actor, text?, metadata}`. Normalize timestamps to UTC and deduplicate by provider event/message ID where available. Avoid leaking tokens or raw private data into logs.
3. **Moment detector.** Start with deterministic, transparent signals: chat messages per short time bucket, unique active chatters, emote/reaction density, and optionally configured Twitch event cues. Use a rolling baseline so a busy channel is not constantly flagged. Merge adjacent high-scoring buckets into a candidate window with pre/post padding. The first version can use a weighted score and thresholds; an LLM is optional and should not be on the critical ingestion path.
4. **Moment store.** Save candidates and their evidence (window, score, signal breakdown, status) in SQLite or another small durable store. Keep raw chat retention short and configurable; store aggregates or message IDs where feasible. In-memory operation can support a demo, but should be described as ephemeral.
5. **Realtime API.** REST endpoints for connection status, settings, candidate list/detail, and review actions; WebSocket or server-sent events for newly detected moments. Apply per-channel authorization on every read and write.
6. **Dashboard.** Show Twitch connection health, live signal chart, ranked candidate queue, timestamps, “why flagged” evidence, and human actions such as keep, dismiss, adjust boundaries, or open the relevant VOD timestamp. A clear “not connected” and reconnect state is essential to demo reliability.
7. **Optional clip worker.** If time permits and a VOD is available, generate a clip candidate from the selected window using a supported Twitch workflow or a locally available authorized source plus FFmpeg. Keep the worker asynchronous, bounded, and separate from chat ingestion. Do not assume a third-party downloader, video permission, or reliable source access without testing. If the clip path is not dependable, deliver timestamped candidates and a VOD deep link instead.

### Data model sketch

- `Channel`: Twitch broadcaster ID, display name, connection state, selected settings.
- `SignalEvent`: provider event ID, channel ID, type, UTC time, normalized metadata; raw chat text is optional and subject to retention policy.
- `MomentCandidate`: ID, channel ID, start/end offsets, created time, score, signal summary, status (`new`, `kept`, `dismissed`, `exported`), optional VOD/clip reference.
- `UserSession`: authenticated application user and authorized channel association; never treat possession of a channel ID as authorization.

Keep access tokens in a secret store or encrypted server-side storage. Do not expose them to browser JavaScript. Use secure, HTTP-only session cookies, CSRF protections for state-changing browser requests, strict origin policy, rate limits, and a narrowly scoped callback. For a hackathon demo, local-only mode is acceptable if explicitly stated; do not expose unauthenticated control endpoints publicly.

## Repository-to-feature mapping

The following is a **design and evaluation map**, not an instruction to copy source code. Each repository contributes a pattern, problem domain, or interface idea; implementation should be original unless a specific reuse audit establishes compatible rights and obligations.

| Research source | Useful design input | MVP application | Avoid inheriting blindly |
|---|---|---|---|
| `twitch-gemini-ai-chatbot` | Clear seams between Twitch transport, AI/tool dispatch, storage/config, and media providers; dashboard status/config patterns | Model our Twitch adapter, event normalization, storage interface, and optional explanation service as separate components | Broadcaster action surface, optional keys, untracked tests, mutable `latest` dependency, and license metadata conflict (root MIT vs package ISC) |
| `AI-VTUBER-Twitch-Companion` | Modular realtime UI, socket events, pluggable model and retrieval flow | Use the idea of separating browser UI events from backend processing; consider an optional creator persona only after core value is proven | Unsafe local assumptions, wildcard CORS, weak secrets, unconfirmed computer actions, OAuth risks, questionable asset provenance, and untested security controls |
| `FunnyStreamTools` | Provider/plugin event bus and OBS browser-widget integration | Optional second-phase OBS “moment radar” widget consuming normalized moment events | Unauthenticated config/reload/canvas controls, wide UDP bind, upload and HTML risks, version mismatch, and no tests |
| `overlabels` | Mature overlay/event normalization, token-authenticated rendering, real-time broadcast, and tested full-stack workflows | Reference for a later authenticated OBS overlay and structured event feed | AGPL-3.0-or-later obligations; substantial Laravel operations footprint; do not couple MVP to its internal schema or imply self-hosting support |
| `Auto-clipper` | Highlight candidate record, detector abstraction, clip manager, VOD workflow | Optional later worker for local analysis/export behind a stable candidate interface | Game-specific unvalidated detector heuristics, local filesystem assumptions, compute-heavy processing, and smoke tests that do not establish detection quality |
| `VodAutoClipper` | Independent signals from transcript/LLM and chat-activity buckets | Future offline VOD enrichment; combine candidate sources after live MVP | GPL-3.0 code reuse concerns, Windows/CUDA coupling, heuristic speaker labels, fragile JSON/timestamp handling, destructive output cleanup, and no tests |
| `pyTwitchAPI` | Unified typed Twitch API/OAuth/chat/EventSub interfaces and mock endpoint concepts | Candidate integration choice if implementing backend in Python; evaluate WebSocket vs webhook by deployment topology | Library is not a complete product: transport lifecycle, scopes, callback networking, and integration tests remain our responsibility; MIT notice must be retained if reused |

## Integration boundaries and contracts

Define stable internal interfaces before wiring providers. This keeps the product useful if the Twitch transport, persistence engine, or detector changes.

- `TwitchSource.start(channel, credentials)`, `stop()`, and `on_event(event)` own all Twitch-specific connection details.
- `NormalizedEvent` is the only input accepted by detection logic. Provider SDK models should not cross into the detector or frontend.
- `MomentDetector.ingest(event) -> MomentCandidate[]` is deterministic and unit-testable. It should accept a clock abstraction for repeatable tests.
- `MomentRepository` exposes create/list/update-status/delete/retention operations. Provider credentials are not part of candidate records.
- `RealtimePublisher.publish(channelId, event)` carries only the minimum dashboard-safe payload and enforces channel authorization at subscription time.
- `ClipProvider.createCandidate(sourceRef, start, end)` is optional and asynchronous. Use a provider adapter so supported Twitch APIs, local FFmpeg workflows, or a future vendor can be swapped without changing moment detection.
- `ExplanationProvider.explain(candidateEvidence)` is optional, bounded, and advisory. It must not trigger channel actions; show evidence and label generated text as an explanation, not fact.

Explicitly document ownership: event ingestion owns reconnect/backoff and deduplication; the detector owns scoring/window merging; repository owns persistence and retention; API owns authorization and validation; clip worker owns media processing and cleanup. Avoid shared mutable globals across listener and web processes.

## Differentiators

1. **Evidence, not a black box.** Each candidate explains whether it was driven by chat velocity, unique participants, emote/reaction density, or a Twitch event. The streamer can tune thresholds.
2. **Live-first workflow.** Surface moments while the stream is underway rather than requiring a long VOD analysis job after the fact.
3. **Human-in-the-loop by default.** The app recommends and prepares; a person decides what is a highlight and when to export. No autonomous moderation or posting.
4. **Graceful degradation.** If AI, a clip provider, or a WebSocket disconnects, the timestamp queue and dashboard remain useful.
5. **Streamer-controlled data.** Minimize retained chat, make retention visible, and support deletion. This can be a credible trust differentiator as well as an engineering advantage.
6. **Integration-ready boundaries.** The same normalized moment feed can later power an OBS widget, VOD processor, or creator analytics view without binding the core to one UI.

## Devpost pitch draft

**VoxClutch: Never miss the moment chat saw first.**

Streamers cannot watch gameplay, manage production, and scan chat for every unforgettable beat at once. VoxClutch listens for audience-reaction patterns and Twitch event cues, then turns them into an explainable, timestamped highlight queue in real time. Instead of asking an AI to take over the channel, VoxClutch shows why each moment stood out and leaves the final keep, trim, or dismiss decision with the creator. The MVP brings Twitch signals, lightweight scoring, and a live review dashboard together behind modular interfaces, with optional clip creation as a follow-on. It is built to fail gracefully, minimize stored chat, and make the streamer—not the model—the editor.

**Demo flow:** connect a test channel; inject or observe chat reactions; show the score rise and a candidate appear; inspect its evidence and timestamp; keep or dismiss it; open the VOD position or generate a clip if the optional media path is working.

**Suggested Devpost framing:** emphasize the working end-to-end loop, transparent signal breakdown, human approval, and honest scope. Distinguish actual implemented features from roadmap items. Do not claim that heuristic chat bursts identify “viral” moments or that unmeasured detection is accurate.

## Ordered implementation plan

### Phase 0 — Scope and spike (first 10% of hackathon)
- Choose one runtime stack and one supported Twitch connection topology.
- Verify app registration, OAuth redirect, required scopes, a test broadcaster, chat ingestion, and at least one event path end to end.
- Decide whether MVP output is a VOD timestamp/deep link or a rendered clip; make the former the reliable baseline.
- Record API limits, event permissions, test constraints, and demo fallback before building UI.

### Phase 1 — Secure connection skeleton
- Implement OAuth state validation and server-side session/token handling.
- Add least-privilege scope checks, reconnect behavior, redacted logging, and channel ownership checks.
- Build a connection-status endpoint and a test harness that can feed synthetic normalized events.

### Phase 2 — Normalization and detector
- Specify `NormalizedEvent` and `MomentCandidate` schemas.
- Implement rolling chat-rate and unique-chatter aggregates, configurable thresholds, cooldown, adjacent-window merging, and bounded pre/post padding.
- Save evidence explaining each score; make all time logic injectable and deterministic.
- Add tests for bursts, quiet periods, duplicates, clock boundaries, cooldowns, and merge behavior.

### Phase 3 — Persisted API and live dashboard
- Add a durable lightweight repository and retention cleanup.
- Implement list/detail/keep/dismiss/settings APIs with validation and authorization.
- Add WebSocket/SSE updates and reconnect/backfill behavior.
- Build a responsive candidate queue with signal chart, evidence, VOD link, and clear connection health.

### Phase 4 — Clip or OBS integration (only after the core loop works)
- Spike the chosen clip workflow against a real permitted VOD; verify timing, availability, latency, and cleanup.
- If unreliable, ship timestamp deep links and keep clip rendering as a documented next step.
- If reliable, run clipping in a queue with timeouts, resource limits, output validation, and user-controlled cleanup.
- Consider an OBS browser-source widget consuming only authorized, read-only moment events.

### Phase 5 — Polish, validation, and demo hardening
- Add tests for API authorization, repository retention, reconnects, and event deduplication; test with synthetic traffic and a live test channel.
- Run dependency and secret scans; pin direct dependencies and commit a lockfile.
- Restrict CORS, secure cookies, request sizes, upload types, network bindings, and log contents; disable unused admin/moderation routes.
- Create deterministic demo fixtures and a fallback recording. Label synthetic data and roadmap functionality accurately.
- Prepare a short demo emphasizing connection, signal evidence, candidate review, and the human approval step.

## Risks and mitigations

- **Twitch availability/scopes:** validate early; use mock events for UI work but clearly separate mock from live demo behavior.
- **False positives:** make thresholds visible and tune per channel; call the output a candidate queue, not automatic highlight truth.
- **Chat privacy:** minimize content retention, aggregate where possible, disclose what is stored, and provide deletion/retention controls.
- **Media processing uncertainty:** isolate as an optional worker and do not make clip export a hard dependency of the demo.
- **Realtime complexity:** reconnect safely, deduplicate, and support dashboard backfill from persistence.
- **Credential exposure:** server-side secrets only, secure OAuth state and cookies, redact logs, and avoid broad scopes.
- **Untested inspiration projects:** the supplied research reports missing or limited tests in most candidates. Establish our own detector, authorization, and workflow tests rather than inferring production readiness from feature lists.

## Licensing and reuse cautions

This blueprint synthesizes repository research; it does **not** grant rights to use any repository’s code, assets, models, or branding. Do not recommend or perform source-code copying absent a verified license and compatibility review for the exact files and intended distribution/deployment model.

The research reports these project-level license findings: `twitch-gemini-ai-chatbot` has an MIT root LICENSE but ISC package metadata conflict; `AI-VTUBER-Twitch-Companion` has an MIT file with incongruous Bootstrap Authors attribution and separate avatar/runtime asset concerns; `FunnyStreamTools` is MIT; `overlabels` is AGPL-3.0-or-later; `Auto-clipper` is MIT; `VodAutoClipper` is GPL-3.0; and `pyTwitchAPI` is MIT. These are research summaries, not legal opinions or a substitute for checking current repository contents and notices.

For any dependency or asset, verify the exact version, license text, copyright notices, transitive dependencies, bundled model/runtime/CDN terms, and Twitch/API terms. MIT projects still require notice preservation and third-party review. AGPL/GPL obligations may be incompatible with a proprietary or differently licensed deliverable and require counsel or project-policy review before reuse or distribution. Resolve the chatbot MIT/ISC mismatch with maintainers or policy before relying on it. The VTuber attribution inconsistency warrants provenance review. Do not reuse Live2D models, fonts, icons, datasets, model weights, or media merely because a repository has a permissive top-level license.

For a hackathon, the lowest-risk route is an original implementation against official Twitch interfaces, using separately reviewed SDK dependencies and original UI/assets, with a third-party notices file and documented dependency inventory.

## Definition of done

The MVP is complete when a streamer can securely connect a test Twitch account, see a live connection state, produce a candidate from real or clearly labeled synthetic reaction signals, inspect its timestamp and evidence, keep or dismiss it, and recover the queue after a page refresh. The core detector and authorization behavior have automated tests, secrets are not sent to the browser, and the demo makes no unsupported claims about clip quality or AI accuracy.
