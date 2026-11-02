# ⚡ VoxClutch — Catch the Moment Chat Saw First

[![Python 3.10+](https://img.shields.io/badge/python-3.10+-3776AB.svg?style=flat&logo=python&logoColor=white)](https://www.python.org/)
[![Flask 3.0](https://img.shields.io/badge/framework-Flask%203.0-000000.svg?style=flat&logo=flask&logoColor=white)](https://flask.palletsprojects.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FFmpeg Powered](https://img.shields.io/badge/media-FFmpeg-007808.svg?style=flat&logo=ffmpeg&logoColor=white)](https://ffmpeg.org/)
[![Twitch IRC](https://img.shields.io/badge/Twitch-IRC%20WebSocket-9146FF.svg?style=flat&logo=twitch&logoColor=white)](https://dev.twitch.tv/)
[![Privacy: 100% Local](https://img.shields.io/badge/Privacy-100%25%20Local%20%26%20Private-00C853.svg)](#privacy--security-guarantee)

> **An explainable, creator-in-control Twitch moment radar & automated clip review workstation.**  
> VoxClutch monitors public chat reaction spikes, computes explainable burst heuristics in real time, and pairs with **EchoMap™** local VOD audio-energy analysis to spotlight clutch gameplay moments — keeping the creator 100% in control.

---

## 🌟 Key Highlights

- 🎯 **No Bot / No OAuth Required**: Connects anonymously to public Twitch IRC over WebSocket (`justinfan`). Read-only, zero account linkage, zero channel moderation risks.
- 📊 **Explainable Reaction Scoring**: Transparent multi-factor heuristic (Chat Velocity 45%, Unique Chatter Ratio 35%, Reaction Cue Density 20%). No black-box AI hallucinations.
- 🔊 **EchoMap™ Dual-Signal Fusion**: Scans your local VOD audio with FFmpeg (8kHz mono RMS dBFS) to correlate audio volume peaks against nearby baseline noise (`70% Chat + 30% Audio Fit`).
- 🎬 **Instant Local Clip Rendering**: Synchronous or bounded FFmpeg subprocessing trims high-precision 1080p/60fps clips directly from your local VOD file.
- 🔒 **Zero Data Leakage**: Chat messages are held in a short rolling in-memory buffer and **never** written to disk. Only aggregate signal statistics and candidate metadata are retained in SQLite.
- ⚡ **Offline Synthetic Demo**: Fully testable offline with a single click — no Twitch account or network needed.

---

## 🏗️ System Architecture

```text
  [ Twitch Public Chat ]                     [ Creator VOD File ]
(Anonymous IRC WebSocket)                      (Local MP4 / MKV)
           │                                          │
           ▼                                          ▼
   TwitchChatListener                           FFmpeg Engine
 (Auto-reconnect & parser)                 (8kHz Mono RMS dBFS Extractor)
           │                                          │
           ▼                                          ▼
   MomentDetector                             EchoMap™ Audio Radar
 (15s Rolling Reaction Gate)               (Peak vs. Ambient Delta dB)
           │                                          │
           └─────────────────┬────────────────────────┘
                             ▼
                    Dual-Signal Fusion
             [ 70% Chat + 30% Audio-Fit Rank ]
                             │
                             ▼
                   MomentStore (SQLite)
             (Aggregate Metrics & Timestamps)
                             │
                             ▼
                  Cyber Studio Dashboard
             (Review ➔ Keep / Dismiss / Clip)
                             │
                             ▼
                    Local Clip Exporter
                   (Rendered via FFmpeg)
```

---

## 🧮 How It Works

### 1. Rolling Chat Burst Scoring
VoxClutch maintains a rolling 15-second FIFO window. When message velocity and unique participant gates are met, it computes:

$$\text{Score} = 100 \times \left(0.45 \cdot \min\left(\frac{\text{msgs}}{12}, 1\right) + 0.35 \cdot \min\left(\frac{\text{unique}}{8}, 1\right) + 0.20 \cdot \frac{\text{reactions}}{\text{msgs}}\right)$$

Where reaction cues include curated streamer vernacular (`pog`, `poggers`, `letsgo`, `clutch`, `insane`, `hype`, `kekw`, `lmao`, elongated laughter patterns).

### 2. EchoMap™ Audio Verification
When a VOD is uploaded, EchoMap scans the audio energy into per-second RMS decibels (dBFS):
- Compares candidate window peak with surrounding 40s ambient noise baseline.
- Calculates Decibel Delta: $\Delta\text{dB} = \text{Peak}_{\text{window}} - \text{Median}_{\text{ambient}}$
- Computes Audio Fit: $\text{AudioFit} = \text{clamp}\left(\frac{\Delta\text{dB}}{15} \times 100, 0, 100\right)$
- Fuses final queue ranking:
$$\text{EchoMap Rank} = 0.70 \times \text{ChatScore} + 0.30 \times \text{AudioFit}$$

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **FFmpeg** installed and added to your system `PATH` (for EchoMap and clip generation)
- A modern web browser (Chrome, Edge, Firefox, Brave)

### 1. Clone & Set Up Environment

```bash
# Clone the repository
git clone https://github.com/Rohi56u/VoXCluTcH.git
cd VoXCluTcH

# Create virtual environment
python -m venv .venv

# Activate virtual environment
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# Linux / macOS:
source .venv/bin/activate

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt
```

### 2. Launch VoxClutch

```bash
python app.py
```

Open your browser to: **`http://127.0.0.1:5050`**

---

## 🎮 Workflow Tutorial

1. **Test Offline**: Click **"Run demo"** in the top bar. A synthetic reaction burst will instantly populate the moment queue with full signal explanations.
2. **Connect Live Stream**: Enter any public channel name (e.g. `shroud`, `tarik`, `hasanabi`) in the channel box and hit **Connect**. Watch real-time chatter velocity and candidate moments pop up live.
3. **Attach VOD**: Under the EchoMap panel, click **"Choose VOD"** and select your recording (MP4, MKV, MOV, WebM).
4. **Synchronize & Analyze**: Enter the time offset between stream start and VOD recording start, then click **"Analyze with EchoMap"**. The radar instantly re-ranks candidates based on simultaneous crowd hype and game audio peaks!
5. **Clip & Export**: Click **"Make clip"** on any keeper to have FFmpeg slice a crystal-clear, frame-accurate clip to your `exports/` folder.

---

## 📂 Repository Directory Map

```text
VoXCluTcH/
├── app.py                     # Flask application factory, REST API & security gates
├── pyproject.toml             # Project metadata, ruff & pytest configuration
├── requirements.txt           # Minimal zero-bloat runtime dependencies
├── LICENSE                    # MIT Open Source License
├── README.md                  # Project manual & technical documentation
├── .env.example               # Environment configuration template
│
├── voxclutch/                 # Core engine package
│   ├── twitch_chat.py         # Resilient anonymous Twitch IRC WebSocket client
│   ├── scoring.py             # Deterministic rolling reaction detector
│   ├── echomap.py             # FFmpeg audio decibel extractor & dual-signal fusion
│   ├── clips.py               # Bounded subprocessing local clip exporter
│   └── store.py               # SQLite aggregate candidate & settings storage
│
├── templates/
│   └── index.html             # High-contrast Cyber Studio UI
├── static/
│   ├── app.js                 # Reactive client-side dashboard state machine
│   └── styles.css             # Cyberpunk dark aesthetic styling
│
├── tests/
│   └── test_voxclutch.py      # Comprehensive 20-test verification suite
│
└── docs/                      # Technical whitepapers & Devpost drafts
    ├── ARCHITECTURE.md        # Comprehensive pipeline & interface design
    ├── ECHOMAP.md             # In-depth EchoMap algorithm documentation
    ├── DEVPOST_DRAFT.md       # Hackathon submission summary
    └── research/              # Detailed analysis of 7 related open-source repos
```

---

## 🧪 Verification & Testing

VoxClutch comes with a comprehensive test suite covering scoring bounds, event deduplication, anti-spam chatter gates, SQLite persistence, and EchoMap decibel calculations:

```bash
python -m unittest discover -s tests -v
```

```text
Ran 20 tests in 9.9s
OK (All tests passing)
```

---

## 🛡️ Privacy & Security Guarantee

- **No Remote Telemetry**: Everything runs on `127.0.0.1` (loopback).
- **No Third-Party AI Data Scrapers**: Video files and chat text never leave your machine.
- **No Chat Logging**: Raw chat text is processed ephemerally in RAM and purged after 15 seconds.
- **Host Guard & CSRF Resistance**: Built-in HTTP Host verification and strict origin validation.

---

## 🏷️ Tags & Keywords

`#Twitch` `#StreamerTools` `#Gaming` `#Python` `#Flask` `#FFmpeg` `#EchoMap` `#ClipCreator` `#OpenSource` `#TwitchDev` `#DataScience` `#VideoEditing` `#Hackathon` `#IndieDev`

---

## 📄 License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.  
*Disclaimer: VoxClutch is an independent open-source project and is not affiliated with or endorsed by Twitch Interactive, Inc.*
