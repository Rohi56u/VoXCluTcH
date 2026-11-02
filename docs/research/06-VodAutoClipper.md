# VodAutoClipper repository research

**Repository:** [wAIfu-DEV/VodAutoClipper](https://github.com/wAIfu-DEV/VodAutoClipper) (default branch `main`; repository ID `VodAutoClipper`). The repository describes itself as an automatic Twitch VOD clipper. Its implementation downloads a Twitch VOD and its chat, transcribes the audio, asks an OpenAI chat model to select notable moments, adds high-chat-activity intervals, and extracts MP4 clips.[1][2][3]

## Purpose and user workflow

The supplied workflow is a local Windows command-line application. The user runs `INSTALL.bat`, then `RUN.bat`; the Python script prompts for a Twitch VOD numeric ID. The README says the program is intended to identify stream highlights using audio transcription, chat activity, and an LLM. It reports an approximate run time of an hour on an RTX 2060 and says it works best with one or two speakers.[2][4]

## Architecture and implementation

This is not a web application or service. The application is concentrated in `AutoClipper.py`, which is executed as a script. It reads `.env` from the current working directory, defines fixed paths under `out/`, and calls `main()` at module import/run time without an `if __name__ == "__main__"` guard.[3]

The processing pipeline is sequential:

1. It recreates the `out` directory and prompts for a VOD ID. TwitchDownloaderCLI is invoked once to download the video and once to download chat JSON.[3]
2. FFmpeg converts the video audio to mono 16 kHz WAV and then signed 16-bit PCM. The script reads PCM in chunks, detects quiet intervals using hard-coded thresholds, and submits buffered speech to OpenAI Whisper's `small.en` model on `torch.device("cuda")`.[3]
3. For each speech segment, `librosa.pyin` estimates pitch from C2 to C7. The mean/median estimate is used to label the segment as one of two configured speaker names based on a single pitch threshold; missing estimates become `Unknown`. Consecutive transcript segments with the same label are concatenated.[3]
4. The transcript is sent to the configured OpenAI chat completion model with `openai-prompt.txt` as system prompt and JSON-object response mode. The prompt requests 15 best moments, with title/start/end fields and 30-second-to-eight-minute target duration.[3][5]
5. Chat JSON comments are counted in fixed time buckets; the five most active 30-second intervals are turned into additional candidate clips. Candidate clips are extracted from the original video using FFmpeg stream copy (`-c copy`) and saved in `out/clips/`.[3]

The script includes commented-out faster-whisper alternatives, but the active code uses `openai-whisper`. `faster-whisper` is nevertheless in `requirements.txt`; the README calls its use optional and says changing the script is required.[2][3][6]

## Stack, configuration, entry points, dependencies

- **Language/runtime:** Python; the installation scripts create a local `venv` and invoke `venv/Scripts/...`, indicating Windows-specific launch paths.[4]
- **External tools:** TwitchDownloaderCLI for VOD/chat downloads and FFmpeg for audio conversion and clip extraction. `INSTALL.bat` instructs the user to acquire these separately. Their executable paths are configurable.[3][4]
- **Python dependencies:** `torch`, `numpy==2.0.2`, `librosa==0.10.2.post1`, `faster-whisper==1.0.3`, `openai==1.54.3`, `openai-whisper==20240930`, and `soundfile==0.12.1`. PyTorch installation is directed to the CUDA 12.1 wheel index.[6]
- **Configuration:** `.env` contains `TWITCHDL_PATH`, `FFMPEG_PATH`, `OPENAI_TOKEN`, `OPENAI_MODEL` (default `gpt-4o`), `SPEAKER1_NAME`, `SPEAKER2_NAME`, and `SPEAKER_PITCH_THRESHOLD` (default 250). The parser is hand-written and expects `.env` in the current directory.[3][7]
- **Entry points:** `RUN.bat` starts `AutoClipper.py`; `INSTALL.bat` guides installation, builds the venv, and installs requirements.[4]
- **Tests and automation:** The repository tree contains no test files, test configuration, CI workflow, or package/build manifest. No automated test suite is present in the inspected repository tree.[1]

## Concrete features

- Downloads VOD video and Twitch chat by numeric VOD ID.[3]
- Generates English transcript segments locally with Whisper `small.en`, then groups adjacent lines assigned to the same speaker.[3]
- Labels two speakers through average-pitch thresholding rather than diarization or identity modeling.[2][3]
- Requests LLM-selected transcript moments in structured JSON, using a repository-supplied prompt.[3][5]
- Counts chat messages by time bucket and adds up to five highest-activity candidates.[3]
- Extracts MP4 clip files to `out/clips/` and reports completion in the console.[3]

## License and reuse

The repository includes `LICENSE.txt`, whose opening identifies the **GNU General Public License, Version 3, 29 June 2007**. It is the GPL-3.0 text (not an absent-license case); reuse and redistribution of covered code must follow GPLv3 terms. The repository does not include a separate per-file licensing statement in the inspected Python source, so downstream reuse should preserve the repository's license notices and assess the dependency/tool licenses separately.[8]

## Integration value and repo-specific opportunities

The most reusable integration idea is the staged pipeline and its separable signals: transcript-derived candidates from an LLM, plus a distinct chat-activity candidate source. An integration could treat these as candidate generators feeding a common clip schema (`title`, `start`, `end`), rather than adopting the script wholesale. The source already separates helper routines for timestamp conversion, transcript generation, and chat interval ranking, but the main workflow is tightly coupled to fixed filesystem paths and direct subprocess/API calls.[3]

The script's configuration provides a starting point for configurable TwitchDownloaderCLI/FFmpeg paths, OpenAI credentials/model, and speaker labels. An integration should not assume the current tool is API-ready: there is no callable library boundary, UI, service endpoint, or reusable command-line argument parser evident in the source. Also verify license compatibility before incorporating or distributing code because the project is GPLv3.[3][7][8]

## Limitations and risks grounded in the source

- **Platform and hardware assumptions:** The shipped `.bat` files, `venv/Scripts` path, `.exe` defaults, and explicit CUDA device selection mean the documented setup is Windows- and CUDA-oriented; CPU-only or non-Windows execution is not provided by these launch/config files.[3][4][7]
- **Speaker labeling is a heuristic:** A single fixed pitch threshold divides voice segments into two labels. The README itself says performance is best for one or two speakers. This is not robust multi-speaker diarization and can mislabel speakers with overlapping pitch ranges or changing delivery.[2][3]
- **External service and credentials:** The application requires a working TwitchDownloaderCLI and FFmpeg installation plus an OpenAI account/token. `.env` is read directly and the example has an empty token, with no visible validation or secret-management safeguards.[2][3][4][7]
- **GPU and workload cost:** Active transcription explicitly selects CUDA. The README's roughly one-hour/RTX2060 estimate indicates material compute and time needs; no CPU fallback is active in the code.[2][3]
- **Prompt/output fragility:** OpenAI completion output is parsed directly with `json.loads`; the script assumes expected JSON keys and clip list structure. No schema validation or retry/recovery for malformed model output is shown.[3][5]
- **Clip timing and encoding:** Clip extraction uses stream copy (`-c copy`), which can constrain cut points to source keyframes and may yield imprecise start/end cuts. The script adds 30 seconds around generated candidate boundaries; generated time strings and output titles are accepted with only minimal sanitization.[3]
- **Chat interval edge case:** The top-chat start is computed as `interval_start - 60`; for an active interval near the beginning this becomes negative, while `seconds_to_hms` formats integer division/remainder without clamping. Negative timestamps can therefore produce malformed-looking time strings before the later clip-stage start clamp.[3]
- **Failure handling and destructive output:** Most subprocess failures are checked for download/conversion, but clip extraction return codes are not checked. `out/` is deleted at each run, so prior outputs there are discarded.[3]
- **No test evidence:** No tests or continuous-integration configuration appear in the repository tree, so behavior is not backed by repository-provided automated test coverage.[1]
- **Maintenance uncertainty:** GitHub metadata reports the most recent push as 2024-11-15 and the repository is not archived; that date is repository metadata rather than a guarantee of current compatibility with upstream Twitch, OpenAI, Whisper, or dependency changes.[9]

## References

[1]: https://api.github.com/repos/wAIfu-DEV/VodAutoClipper/git/trees/main?recursive=1 "VodAutoClipper repository tree"
[2]: https://github.com/wAIfu-DEV/VodAutoClipper/blob/main/README.txt "VodAutoClipper README"
[3]: https://github.com/wAIfu-DEV/VodAutoClipper/blob/main/AutoClipper.py "VodAutoClipper implementation"
[4]: https://github.com/wAIfu-DEV/VodAutoClipper/tree/main "VodAutoClipper installation and launch files"
[5]: https://github.com/wAIfu-DEV/VodAutoClipper/blob/main/openai-prompt.txt "VodAutoClipper OpenAI prompt"
[6]: https://github.com/wAIfu-DEV/VodAutoClipper/blob/main/requirements.txt "VodAutoClipper Python requirements"
[7]: https://github.com/wAIfu-DEV/VodAutoClipper/blob/main/.env "VodAutoClipper example configuration"
[8]: https://github.com/wAIfu-DEV/VodAutoClipper/blob/main/LICENSE.txt "VodAutoClipper license text"
[9]: https://api.github.com/repos/wAIfu-DEV/VodAutoClipper "VodAutoClipper GitHub repository metadata"
