# EchoMap: independent chat and VOD-audio evidence

EchoMap is VoxClutch's upgraded review feature. A reaction burst says the audience responded; EchoMap asks a separate question: **does the creator's VOD also show an audio-energy change near that moment?** The result gives a streamer another clue while reviewing a long session, not an automatic declaration that a moment is a highlight.

## Workflow

1. Attach an MP4, MOV, MKV, or WebM VOD the creator is entitled to process.
2. Set the number of seconds between the start of that VOD and the moment the VoxClutch chat listener began. The tool does not infer this alignment.
3. Select **Analyze with EchoMap**. FFmpeg decodes audio locally, converts it to mono signed 16-bit PCM at 8 kHz, and streams it through a one-second buffer. The service calculates one root-mean-square (RMS) loudness value per full second, plus one value for any final partial second.
4. For each candidate window, EchoMap maps the listener-relative timestamps into VOD time. It compares the loudest second in the candidate with the median RMS level of nearby audio, excluding the event window and a five-second guard band.
5. The dashboard shows the candidate's chat score separately from the audio evidence, adds a 70/30 chat/audio fit for queue ranking, and describes the decibel difference. The creator decides whether to keep, dismiss, or export a clip.

## Score, with limits

`audio_fit = clamp((candidate_peak_dBFS - nearby_median_dBFS) / 15 × 100, 0, 100)`

`echomap_score = 0.70 × chat_score + 0.30 × audio_fit`

The chat score itself is a weighted reaction-burst heuristic. EchoMap uses no trained model and has no measured precision/recall data. It is not an AI confidence value, automatic highlight decision, or prediction that a clip will go viral. Loud gameplay or background music can produce an audio cue unrelated to chat, and visual-only moments can have no audio spike at all. Incorrect VOD offsets produce incorrect evidence. The “audio echo” label is an explainable signal comparison only.

## Privacy and resource use

The VOD stays in the local `uploads/` folder. Decoded PCM is processed in bounded blocks in the local analysis process and is not persisted. VoxClutch does not call a transcription service or send video/audio to an external AI provider. For dashboard comparison, the application holds a compact per-second dBFS array in process memory; the array is not persisted to SQLite. The uploaded source remains on disk until the user removes it. The upload limit is 500 MB and one FFmpeg analysis is bounded by a five-minute timeout. Long files still consume local CPU and the compact per-second array grows with duration, so use shorter VODs for a hackathon demo.

## Implementation and tests

- `voxclutch/echomap.py`: FFmpeg decoding, per-second RMS, nearby-ambient comparison, and explainable fusion/ranking.
- `POST /api/audio/analyze`: validates upload and VOD offset, then runs local analysis.
- `GET /api/moments`: adds temporary audio evidence and an EchoMap ranking when a VOD has been analyzed.
- Dashboard: VOD upload, offset control, explicit re-analysis, per-candidate dB evidence and fit.
- `tests/test_voxclutch.py`: synthetic PCM/RMS and dBFS-delta checks, plus API coverage for upload, offset validation, and candidate enrichment. The PCM checks mock FFmpeg; they do not replace a run against a real VOD and FFmpeg binary.
