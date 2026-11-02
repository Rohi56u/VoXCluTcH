# Research, provenance, and license notes

VoxClutch is an original, clean-room MVP implementation. The seven public repositories listed below were reviewed for product patterns, system boundaries, and risks. This project does **not** bundle their source code, models, frontend assets, or dependencies. Their ideas informed the product design only; each upstream repository keeps its own license and obligations. This is an engineering note, not legal advice.

| Repository reviewed | License found in repository | VoxClutch design input |
|---|---|---|
| [twitch-gemini-ai-chatbot](https://github.com/VirtuallyJesse/twitch-gemini-ai-chatbot) | Root MIT; package metadata said ISC (inconsistency to resolve upstream) | Distinct Twitch transport, storage, and UI seams; avoid broad bot actions in MVP. |
| [AI-VTUBER-Twitch-Companion](https://github.com/gaetan-warin/AI-VTUBER-Twitch-Companion) | MIT file with questionable Bootstrap attribution; bundled assets need separate review | Realtime separation; avoid copying its computer-control or unverified assets. |
| [FunnyStreamTools](https://github.com/777Chara777/FunnyStreamTools) | MIT | Provider/event-bus concept; future OBS signal widget. |
| [overlabels](https://github.com/jasperfrontend/overlabels) | AGPL-3.0-or-later | Tested overlay/event-feed product patterns; no source/schema reuse. |
| [Auto-clipper](https://github.com/bendawg2010/Auto-clipper) | MIT | Shared highlight candidate abstraction and local FFmpeg pipeline idea. |
| [VodAutoClipper](https://github.com/wAIfu-DEV/VodAutoClipper) | GPL-3.0 | Combine independent transcript/chat cues as a future direction; no GPL code copied. |
| [pyTwitchAPI](https://github.com/Teekeks/pyTwitchAPI) | MIT | Twitch API/EventSub/chat integration boundary; current MVP instead uses anonymous read-only IRC websocket. |

Detailed source-level notes are in `docs/research/`. License identification reflects inspected repository files at research time; verify exact revisions and all third-party dependencies/assets before redistribution or commercial use.

## Third-party runtime

Runtime requirements are Flask and websocket-client, each under its own package license and distribution. FFmpeg must be installed separately and is not bundled. Google Fonts are requested by the browser from Google Fonts; a network-independent typography fallback is configured. No VOD downloader, pretrained model, OpenAI/Gemini key, or bundled third-party media asset is included.

## Data and security scope

Twitch connection is anonymous and read-only. VoxClutch requests no OAuth credential and has no moderation, posting, channel-setting, or private-message functionality. Chat messages are processed transiently in memory for counts; text is not stored in SQLite. Candidate evidence stores aggregate counts and timing only. The starter server binds only to loopback and rejects non-loopback traffic. This is a hackathon/local prototype, not a hardened internet-facing deployment; do not reverse-proxy it publicly without adding authentication, CSRF protections, TLS, and deployment-specific security controls.
