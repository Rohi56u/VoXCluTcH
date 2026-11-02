"""Bounded local FFmpeg clip export from a creator-supplied video file."""
from __future__ import annotations
import shutil
import subprocess
from pathlib import Path

ALLOWED_VIDEO_SUFFIXES = {'.mp4', '.mov', '.mkv', '.webm'}
MAX_CLIP_SECONDS = 90

def export_clip(source: Path, output: Path, start_seconds: float, end_seconds: float, offset_seconds: float = 0) -> Path:
    if shutil.which('ffmpeg') is None:
        raise RuntimeError('FFmpeg was not found. Install FFmpeg and restart VoxClutch.')
    source = Path(source).resolve()
    if source.suffix.lower() not in ALLOWED_VIDEO_SUFFIXES or not source.is_file():
        raise ValueError('Choose an uploaded MP4, MOV, MKV, or WebM video.')
    start = max(0.0, float(start_seconds) + float(offset_seconds))
    end = max(start, float(end_seconds) + float(offset_seconds))
    duration = min(MAX_CLIP_SECONDS, end - start)
    if duration < 1:
        raise ValueError('Clip window must be at least 1 second.')
    output.parent.mkdir(parents=True, exist_ok=True)
    command = ['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', f'{start:.3f}', '-i', str(source), '-t', f'{duration:.3f}', '-map', '0:v:0?', '-map', '0:a:0?', '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '23', '-c:a', 'aac', '-movflags', '+faststart', str(output)]
    result = subprocess.run(command, capture_output=True, text=True, timeout=300, check=False)
    if result.returncode or not output.exists() or output.stat().st_size == 0:
        output.unlink(missing_ok=True)
        message = (result.stderr or 'FFmpeg could not render this clip.')[-1200:]
        raise RuntimeError(message)
    return output
