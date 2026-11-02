import asyncio
from pathlib import Path
import edge_tts

AUDIO_DIR = Path(__file__).resolve().parent / "public" / "audio"
AUDIO_DIR.mkdir(parents=True, exist_ok=True)

VOICE = "en-IN-PrabhatNeural"  # Clear, studio-quality Indian English Male

SCRIPTS = {
    "scene1_problem.mp3": (
        "As a streamer, your attention is 100% on the game. "
        "Chat erupts with collective hype when a clutch moment happens—"
        "but by the time you look, the moment is lost in an endless 6-hour VOD."
    ),
    "scene2_intro.mp3": (
        "Meet VoxClutch: the explainable, creator-controlled Twitch moment radar. "
        "It monitors public chat reactions in real time—with zero bot permissions, "
        "zero OAuth secrets, and zero cloud tracking."
    ),
    "scene3_ui_walkthrough.mp3": (
        "Inside the cyber studio dashboard, connect to any public Twitch channel or run the offline demo. "
        "The engine scores a 15-second rolling window using transparent heuristics—"
        "message velocity, unique chatters, and reaction cues. "
        "You stay in full control to review, keep, or dismiss moments in your queue."
    ),
    "scene4_echomap.mp3": (
        "Now, EchoMap corroborates chat with your local VOD sound. "
        "FFmpeg decodes per-second audio decibels locally—without any cloud transcription or AI hallucinations. "
        "When crowd hype and game sound rise together, the moment surges to the top of your queue."
    ),
    "scene5_clip.mp3": (
        "Once reviewed, one click triggers local FFmpeg to export a frame-accurate 1080p MP4 directly from your recording—"
        "ready for YouTube Shorts, TikTok, and Instagram Reels."
    ),
    "scene6_outro.mp3": (
        "VoxClutch: catch the moment chat saw first. "
        "100% free, private, and open source. "
        "Star and clone the repository today on GitHub!"
    ),
}

async def generate_all():
    print(f"Generating TTS audio with voice: {VOICE}")
    for filename, text in SCRIPTS.items():
        out_path = AUDIO_DIR / filename
        print(f"Generating {filename}...")
        communicate = edge_tts.Communicate(text, VOICE, rate="+3%")
        await communicate.save(str(out_path))
        print(f"Saved {out_path} ({out_path.stat().st_size} bytes)")
    print("All audio files generated successfully.")

if __name__ == "__main__":
    asyncio.run(generate_all())
