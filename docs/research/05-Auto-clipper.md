# Auto-clipper — repository research

**Repository:** [`bendawg2010/Auto-clipper`](https://github.com/bendawg2010/Auto-clipper), ID `Auto-clipper`  
**Inspected revision:** default branch `claude/twitch-clip-analyzer-MPT08` (the API reports it as the default branch). Findings below describe checked-in files on that branch, not merely the README. [1] [2]

## Purpose

Auto-clipper is a locally run desktop/web application for finding and producing highlight clips from gaming videos, especially Twitch and YouTube VODs. The application can download a supported source URL or accept a local upload, analyze the video with selectable detection approaches, extract highlight clips, and offer editing/export tools. The core is not a hosted clip-processing service: its Python Flask server binds to loopback in the desktop launcher and invokes local video-processing tools. [3] [4] [5]

Repository metadata describes the project as using YOLO object detection, pixel analysis, and voice-triggered clipping. Source code makes the architecture more specific: the Arc Raiders adapter samples frames and scores local detections and pixel features; separate audio, motion, scene, chat, and other analyzers also exist. “Voice” refers to detecting phrases such as “clip it” from transcribed VOD audio, not a general conversational interface. [1] [6] [7]

## Stack and architecture

- **Backend:** Python 3 with Flask routes in `app.py`; the backend starts background analysis jobs and maintains session/job state on disk. The app serves the UI and exposes JSON APIs for analysis, clips, edits, presets, profiles, and related functions. [3] [8]
- **Frontend:** HTML templates and static JavaScript/CSS (`templates/index.html`, `static/js/app.js`, `static/css/style.css`). A separate `site/` folder contains a static project landing page; it is not the app UI. [2] [9]
- **Detection:** OpenCV and NumPy-based frame analysis; optional local Ultralytics YOLO weights; several detector modules implement audio-level, motion, scene-change, game-profile and external/model-backed analysis paths. `analysis/clip_modes.py` defines `CV`, `YOLO`, `VOICE`, `HYBRID`, and `ALL`. [6] [7] [10]
- **Media processing:** `yt-dlp` downloads source VODs. FFmpeg/ffprobe are invoked as system executables for probing, extraction, transcoding, thumbnails, and transformations. Speech-trigger scanning can use either `faster-whisper` or `openai-whisper`, imported optionally by its detector. [5] [11] [12]
- **Desktop packaging:** `desktop.py` starts Flask on `127.0.0.1:8080` in a thread and opens a pywebview window, falling back to the system browser if pywebview is absent. Shell, batch, and macOS command launchers plus CI installer packaging are present. [13] [14]

## Concrete features visible in source

The API and `ClipManager` implement source download and partial-range download, upload, analysis job/session status, a local VOD library, and generated clip listing, downloading, trimming, and deletion. Video output is built through FFmpeg command invocations. [5] [8] [11]

Editing/export endpoints include vertical TikTok and YouTube Short conversion, GIF creation, watermark upload/application, split and extend, merge, burned-in captions, zoom/pan, sound effects, volume-spike analysis, smart thumbnails, and metadata updates. Additional endpoints support batch conversion, highlight reels, duplicate detection/sorting, manual clip creation, configurable highlight rules and presets, custom game profiles, and watch-folder control. These are source-level routes; their presence does not by itself establish production reliability or compatibility with every input/platform. [8] [11]

Detection specifics include selectable detector modes and sensitivity/override parameters. `ArcClipDetectorAdapter` samples frames (one-second default, adjustable via `sample_fps`), optionally applies local YOLO plus an OpenCV `PixelAnalyzer`, combines scores, clusters events into segments, and returns highlight dictionaries. Its code explicitly falls back to pixel-based analysis when model weights or YOLO are unavailable; a requested YOLO-only path also retains a pixel safety fallback if the model cannot be used. [6] [7]

## Entry points, configuration, and dependencies

The principal web-app entry point is `app.py`; its `__main__` block starts the service. `desktop.py` is the native-window wrapper. `launch.sh`, `run.sh`, `run.bat`, `Auto-Clipper.bat`, and `Auto-Clipper.command` provide platform launch paths. `install.sh` installs system prerequisites and Python dependencies; `requirements.txt` is the Python dependency manifest. The project also provides `Makefile` targets including `install`, `run`, `test`, and `lint`. [2] [13] [14]

The processing pipeline relies on FFmpeg and ffprobe being available on `PATH` (the installer checks/installs FFmpeg). `ClipManager` configures `yt-dlp` for downloads, including a best-at-or-below-720p format preference and retries. YOLO is an optional runtime dependency/path: the repository includes `models/best.pt` and model notes, while analysis code also accommodates missing weights. Whisper packages are optional and detected at runtime. [5] [7] [11] [12] [15]

The checked-in test suite is small and smoke-oriented. `tests/test_smoke.py` checks project files/import and syntax-related behavior, shell script syntax, download-error message mapping, and environment-info shape. `tests/conftest.py` adds the repository root to `sys.path`. `Makefile` runs the smoke test directly; it does not demonstrate comprehensive detector accuracy, end-to-end media tests, platform installer validation, or API security coverage. [16] [17]

## License and reuse

The repository contains a root `LICENSE` file stating **MIT License**, copyright `(c) 2026 bendawg2010`. Its terms permit use, copying, modification, distribution, sublicensing, and sale subject to preserving the copyright and permission notice, and include the standard “as is” warranty/liability disclaimer. GitHub metadata independently labels the repository MIT. For redistribution, preserve the included notices and separately review licenses/terms for bundled model weights, Python packages, media inputs, and external services; the root license alone does not establish rights to those third-party materials. [1] [18]

## Repo-specific integration opportunities

- The Flask JSON API and stable-looking highlight-dictionary boundary (`timestamp`, `duration`, `pre_pad`, `label`, `confidence`) give an integration point for a separate UI or orchestrator. Detection methods are selected in the app and routed into a common analysis/clip extraction flow. [7] [8]
- `ClipManager` is a concentrated adapter boundary for downloading, extracting, and transforming media. An integration could invoke its processing capabilities or place a wrapper around those responsibilities rather than reimplementing FFmpeg recipes. It is currently a Python class coupled to filesystem paths and subprocesses, not a separately deployed service. [5] [11]
- The detector modules and `ClipMode` abstraction offer a natural extension point for adding a detector or game-specific profile. Existing profile and analyzer interfaces should be followed; the Arc Raiders implementation contains many game-specific visual heuristics and should not be assumed to generalize to other games without profile/config work. [6] [7] [10]
- The app exposes library/session, batch-analysis, manual-clip, and editing routes, which may support workflows that manage local assets or add a post-processing step. Watch-folder support offers a potential local automation handoff, subject to verifying its assumptions and runtime behavior. [8]

## Limitations and risks

- **Local machine requirements:** substantial video workloads depend on locally installed FFmpeg and may use CPU or optional model acceleration. Bundling `best.pt` does not guarantee that its model is appropriate for other games or that every deployment can load it. [7] [11] [15]
- **Platform inconsistency:** launcher and installer paths vary. For example, `launch.sh` explicitly uses macOS `osascript` dialogs, while `install.sh` claims Mac/Linux support and separate batch installers exist. Validate the exact target platform path rather than treating all launch scripts as interchangeable. [14]
- **Processing and download constraints:** the download implementation sets a 720p-or-lower preference by default, and source URL availability, authentication, platform rules, network failures, codec support, and FFmpeg availability can constrain results. [5] [11]
- **Detector quality is heuristic/model-dependent:** frame sampling can miss short events; visual scoring is tailored to game HUD/VFX patterns; model availability, scoring thresholds, and selected mode affect results. Repository code establishes implementation, not measured precision/recall or generalized game coverage. [6] [7] [10]
- **Voice trigger dependency:** the trigger detector needs a supported Whisper package and FFmpeg audio extraction; it should not be assumed present just because the feature is exposed. [12]
- **Security/deployment posture:** the supplied desktop wrapper binds to loopback, but the Flask app has many mutating endpoints and works with local filesystem paths/assets. Do not expose it to an untrusted network without reviewing request validation, authorization, file handling, and subprocess argument construction. The smoke tests do not establish security controls. [8] [13] [16]
- **License scope:** MIT covers repository copyrightable code under its terms; it does not automatically license third-party model datasets/weights, dependency code, or downloaded videos. Inspect their provenance and terms independently before redistributing or commercial use. [18]
- **Tests are not comprehensive:** the current visible tests are smoke checks, not end-to-end correctness or quality benchmarks. [16] [17]

## References

[1]: https://api.github.com/repos/bendawg2010/Auto-clipper "GitHub repository metadata"
[2]: https://github.com/bendawg2010/Auto-clipper/tree/claude/twitch-clip-analyzer-MPT08 "Repository tree on default branch"
[3]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/app.py "Flask app and API implementation"
[4]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/desktop.py "Desktop launcher implementation"
[5]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/clip_manager.py "Download and clip manager"
[6]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/analysis/clip_modes.py "Detection modes"
[7]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/analysis/arc_clip_detector.py "Arc Raiders detection pipeline"
[8]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/app.py "Application routes and analysis flow"
[9]: https://github.com/bendawg2010/Auto-clipper/tree/claude/twitch-clip-analyzer-MPT08/static "Frontend static assets"
[10]: https://github.com/bendawg2010/Auto-clipper/tree/claude/twitch-clip-analyzer-MPT08/analysis "Analysis modules"
[11]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/requirements.txt "Python requirements"
[12]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/analysis/clip_trigger_detector.py "Whisper-based speech trigger detector"
[13]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/desktop.py "Loopback desktop server and webview wrapper"
[14]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/install.sh "Cross-platform install script"
[15]: https://github.com/bendawg2010/Auto-clipper/tree/claude/twitch-clip-analyzer-MPT08/models "Bundled model files and notes"
[16]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/tests/test_smoke.py "Smoke test suite"
[17]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/Makefile "Development and test targets"
[18]: https://github.com/bendawg2010/Auto-clipper/blob/claude/twitch-clip-analyzer-MPT08/LICENSE "Root MIT license"
