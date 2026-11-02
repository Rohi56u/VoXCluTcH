# FunnyStreamTools repository research

**Repository:** [777Chara777/FunnyStreamTools](https://github.com/777Chara777/FunnyStreamTools)  
**Inspected revision:** `main` at `7b215867388e56e4c62c1795d74f7dec7b9f27c8`  
**Repository metadata:** created 2026-07-08; 25 commits as displayed by GitHub when inspected.  

## Purpose and scope

FunnyStreamTools is a local Python service for streaming overlays, especially OBS browser sources. The source implements an asynchronous provider-to-plugin event pipeline and several browser widgets, including a chat terminal, a canvas composition tool, and a chat-triggered blue-screen effect. The README describes the intended overall product as a modular streaming utility and lists Twitch and Discord integrations; the inspected implementation substantiates Twitch IRC chat and emote-provider integrations, but does not contain a Discord provider or Discord RPC integration. [1] [2] [3] [4]

## Stack and architecture

The backend is Python with FastAPI/Starlette routing and Uvicorn serving, plus asyncio for provider tasks and WebSocket fanout. The front end is static HTML, CSS, and JavaScript served by plugin routes; OBS connects to these pages as browser sources. `main.py` loads dotenv, imports `app` and starts Uvicorn on `127.0.0.1:8000`. The project metadata requires Python `>=3.14`, despite the README's stated Python 3.10+ prerequisite and `.python-version` specifying `3.14`. [2] [3] [5]

`app.main.FunnyStreamTools` scans `providers/` and `plugins/` subdirectories, imports each `main.py`, instantiates classes derived from `BaseProvider` or `BasePlugin`, and builds plugin routers under `/widget/{plugin}`. Provider `start()` methods run as asyncio background tasks during FastAPI lifespan. The `EventBus` stores subscribers keyed by `provider:event`; a provider emits an event under its ID, and listeners receive transformed payloads through callbacks, generally sent over WebSockets. Plugin HTML themes are served by the base class at the plugin prefix. [3] [6] [7] [8]

## Concrete features implemented

- **Twitch chat ingestion:** `TwitchProvider` connects anonymously to Twitch IRC over WebSocket, joins the username configured as `twitch_account`, handles PING/PONG, parses `PRIVMSG` tags and text, and emits `twitch:message` payloads with display name, color, moderator status, and emote positions. It reconnects after exceptions with a five-second delay. [9]
- **Chat emote conversion:** `EmojiProvider` subscribes to `twitch:message`, expands Twitch emote offsets, and maps word tokens to image URLs from 7TV, BetterTTV, and FrankerFaceZ global/channel emote endpoints. It emits `chatemoji:message`. The default account value (`kek`) disables the channel-specific lookup paths. [10]
- **Terminal/chat widget:** `commandchat` serves themed HTML alternatives, with the default page showing a Windows command-prompt aesthetic, WebSocket-driven chat display, emotes, terminal effects, audio beeps, and a bounded line count. Its backend subscribes to `chatemoji:message`. [11]
- **Canvas editor and OBS render widget:** `canvas` exposes admin, widget, file, scene-list, upload, and WebSocket endpoints under `/widget/canvas`. The included admin page supports adding text, image URLs, uploaded files and iframe sources; manipulation of layers, size, position, crop and style; custom CSS; scene save/load; hotkeys; timeline/duration/animation controls; and multi-client presence/cursor signaling. The render page applies state updates to a browser-based scene. [12] [13]
- **Canvas state and event triggers:** `MemeCanvasProvider` keeps in-memory objects, bounds and CSS; it persists named scenes as JSON files under `providers/memecanvas/presets`; it responds to `donation:alert` and `twitch:chat_command` triggers from canvas object metadata, and supports timed visibility. It also opens a UDP listener on `0.0.0.0:8081` for JSON control/cursor messages. [14]
- **Blue-screen effect:** `BlueScreenMeme` subscribes to `twitch:message` and emits a `bluescreen` boolean when message text exactly equals “bluescreen” after trim/lowercase. [15]
- **Emoji combo widget:** `EmojiCombo` counts consecutive messages consisting of the same single `<img>` emote and emits reset events for nonmatching payloads. [16]
- **Dashboard/configuration:** dashboard endpoints retrieve current config and available themes, report inferred plugin/provider dependencies, accept config updates, and trigger module rescans/reloads. The engine writes `config.json` beside the source/executable and can create defaults during discovery. [3] [17]
- **SDK stubs:** `--generate-sdk` invokes runtime introspection to produce `.app_sdk` `.pyi` stubs. [2] [18]

## Entrypoints, dependencies, configuration, and tests

The documented launch entry is repository-root `main.py`; it calls `uvicorn.run(app, host="127.0.0.1", port=8000, reload=False)`. The actual application and plugin discovery live in `app/main.py`. `--generate-sdk` is the only supported command-line option. [2] [3]

`pyproject.toml` lists FastAPI, python-dotenv, python-multipart, requests, Uvicorn, and websockets as runtime dependencies, and PyInstaller in the `dev` group. `uv.lock` pins the resolved graph. `.python-version` and `requires-python` indicate Python 3.14, while the README says 3.10+, so installation compatibility should be checked against metadata rather than README alone. [2] [5]

Configuration is a runtime-created/loaded `config.json` with `providers` and `plugins` groups, including enabled state and selected theme. The README refers to `.env` setup only implicitly; code reads the `twitch_account` environment variable (dotenv is loaded before app import in root launcher). There is no checked-in config file or explicit schema. The repository includes no test files or pytest/tox configuration in the inspected tree. [2] [3] [9] [10]

## License and reuse

The repository includes a `LICENSE` file containing the standard **MIT License**, copyright `(c) 2026 skyred`. It permits use, copying, modification, distribution, sublicensing, and sale, subject to retaining the copyright and permission notice, and includes the standard warranty/liability disclaimer. Reuse must preserve that notice in copies or substantial portions. This repository-level license does not by itself establish the licensing of remotely loaded emotes, external assets, or third-party browser libraries. [19]

## Repo-specific integration opportunities

The cleanest extension seam is a new provider directory implementing `BaseProvider`, emitting `provider:event` messages, paired with plugins extending `BasePlugin` and subscribing to those topics. The loader discovers these modules on startup or dashboard-triggered reload, and plugin HTML pages can be served directly to OBS. A new platform chat provider could normalize messages to the shape already consumed by `EmojiProvider` and the chat widget. A canvas extension can add event topics/actions while retaining the existing editor/render WebSocket protocol. The generated `.app_sdk` stubs are intended to support external plugin development, although no generated stubs are committed in this source tree. [3] [6] [7] [18]

## Limitations and risks visible in source

- **Mismatch between claims and implementation:** README claims local Discord RPC voice activity monitoring, but the repository tree has no Discord-specific provider or integration code. The canvas refers to donation and Twitch chat-command events, but the included providers do not emit those topics; they are extension points, not demonstrated end-to-end integrations. [1] [12] [14]
- **Runtime requirement discrepancy:** README says Python 3.10+, but `pyproject.toml` requires 3.14 or later. This can block installs on common Python versions. [2] [5]
- **No automated tests found:** Changes to dynamic loading, WebSocket behavior, provider parsing, canvas state, or filesystem operations lack a visible automated test suite. [20]
- **Unauthenticated control surface:** the service binds HTTP only to localhost, but dashboard config/reload, canvas upload/admin APIs, and WebSocket controls have no authentication checks in the inspected handlers. The UDP listener binds all interfaces on port 8081 without authentication. Keep network exposure constrained and treat local clients as trusted. [2] [12] [14] [17]
- **Unbounded uploads and file inputs:** canvas upload reads the full file into memory and does not impose a size/type limit. Uploaded filenames are randomized, but supplied extension is retained. [12]
- **Potential unsafe frontend content handling:** the UI constructs DOM HTML using `innerHTML` in multiple places, and canvas supports user-provided iframe URLs and custom CSS; inspect data flow and sanitization before exposing controls to untrusted users. [13]
- **Blocking network calls in async path:** emote lookups use synchronous `requests.get` calls while provider startup executes in the async event loop; no request timeout is specified. Slow third-party services can stall startup/event-loop work. [10]
- **Operational state limitations:** canvas state is in memory and scene files are local JSON; the UDP socket lacks explicit shutdown/close handling in the shown loop. There is no deployment, persistence service, or multi-process coordination configuration in the repository. [3] [14]
- **Supply-chain/API dependence:** emote rendering depends on external APIs/CDNs and requests Twitch chat anonymously; availability and service behavior are outside this codebase. [9] [10] [11]

## References

[1]: https://github.com/777Chara777/FunnyStreamTools/blob/main/README.md "FunnyStreamTools README"
[2]: https://github.com/777Chara777/FunnyStreamTools/blob/main/main.py "Root launcher"
[3]: https://github.com/777Chara777/FunnyStreamTools/blob/main/app/main.py "Application engine and discovery"
[4]: https://github.com/777Chara777/FunnyStreamTools/tree/main/providers "Provider source directory"
[5]: https://github.com/777Chara777/FunnyStreamTools/blob/main/pyproject.toml "Project metadata and dependencies"
[6]: https://github.com/777Chara777/FunnyStreamTools/blob/main/app/baseprovider.py "BaseProvider API"
[7]: https://github.com/777Chara777/FunnyStreamTools/blob/main/app/baseplugin.py "BasePlugin API"
[8]: https://github.com/777Chara777/FunnyStreamTools/blob/main/app/eventbus.py "EventBus implementation"
[9]: https://github.com/777Chara777/FunnyStreamTools/blob/main/providers/twitch/main.py "Twitch provider"
[10]: https://github.com/777Chara777/FunnyStreamTools/blob/main/providers/chatemoji/main.py "Chat emote provider"
[11]: https://github.com/777Chara777/FunnyStreamTools/tree/main/plugins/commandchat "Command chat widget"
[12]: https://github.com/777Chara777/FunnyStreamTools/blob/main/plugins/canvas/main.py "Canvas plugin routes"
[13]: https://github.com/777Chara777/FunnyStreamTools/tree/main/plugins/canvas "Canvas editor and render pages"
[14]: https://github.com/777Chara777/FunnyStreamTools/blob/main/providers/memecanvas/main.py "Canvas provider and UDP listener"
[15]: https://github.com/777Chara777/FunnyStreamTools/blob/main/plugins/bluescreen/main.py "Blue-screen plugin"
[16]: https://github.com/777Chara777/FunnyStreamTools/blob/main/plugins/emojicombo/main.py "Emoji combo plugin"
[17]: https://github.com/777Chara777/FunnyStreamTools/blob/main/plugins/dashboard/main.py "Dashboard API"
[18]: https://github.com/777Chara777/FunnyStreamTools/blob/main/app/sdk.py "SDK stub generator"
[19]: https://github.com/777Chara777/FunnyStreamTools/blob/main/LICENSE "MIT license text"
[20]: https://api.github.com/repos/777Chara777/FunnyStreamTools/git/trees/main?recursive=1 "Repository tree at inspected revision"
