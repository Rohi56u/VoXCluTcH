"""Local, non-transcribing audio cues for EchoMap chat/VOD corroboration."""
from __future__ import annotations
from array import array
import math
import shutil
import statistics
import subprocess
import sys
from threading import Thread
from pathlib import Path

SAMPLE_RATE = 8000

def _rms_dbfs_from_pcm(stream) -> list[float]:
    """Read little-endian mono s16le PCM and return one RMS dBFS value per second."""
    samples_per_second = SAMPLE_RATE
    bytes_per_second = samples_per_second * 2
    levels = []
    while True:
        block = bytearray()
        while len(block) < bytes_per_second:
            chunk = stream.read(bytes_per_second - len(block))
            if not chunk:
                break
            block.extend(chunk)
        raw = bytes(block)
        if not raw:
            break
        if len(raw) % 2:
            raise RuntimeError('FFmpeg returned an incomplete 16-bit PCM sample.')
        samples = array('h')
        samples.frombytes(raw)
        if sys.byteorder != 'little':
            samples.byteswap()
        mean_square = sum(sample * sample for sample in samples) / len(samples)
        rms = math.sqrt(mean_square)
        levels.append(round(20 * math.log10(max(rms / 32768.0, 1e-6)), 2))
    return levels

def analyze_audio_levels(video_path: Path, timeout_seconds: int = 300) -> list[float]:
    """Decode mono PCM at 8 kHz and return one RMS dBFS value per second.

    Audio samples stay in process memory only. The source video is never uploaded
    to an AI or remote analysis provider.
    """
    if shutil.which('ffmpeg') is None:
        raise RuntimeError('FFmpeg was not found. Install FFmpeg to run EchoMap.')
    command = [
        'ffmpeg', '-hide_banner', '-loglevel', 'error', '-i', str(Path(video_path).resolve()),
        '-vn', '-ac', '1', '-ar', str(SAMPLE_RATE), '-f', 's16le', 'pipe:1',
    ]
    try:
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
    except OSError as exc:
        raise RuntimeError('FFmpeg could not be started for local audio analysis.') from exc

    levels: list[float] = []
    read_errors: list[Exception] = []
    stderr_tail = bytearray()

    def read_audio() -> None:
        try:
            if process.stdout is not None:
                levels.extend(_rms_dbfs_from_pcm(process.stdout))
        except Exception as exc:  # surfaced in the calling thread after FFmpeg exits
            read_errors.append(exc)

    def read_errors_from_ffmpeg() -> None:
        if process.stderr is None:
            return
        for chunk in iter(lambda: process.stderr.read(4096), b''):
            stderr_tail.extend(chunk)
            if len(stderr_tail) > 4096:
                del stderr_tail[:-4096]

    audio_reader = Thread(target=read_audio, daemon=True)
    error_reader = Thread(target=read_errors_from_ffmpeg, daemon=True)
    audio_reader.start()
    error_reader.start()
    try:
        return_code = process.wait(timeout=timeout_seconds)
    except subprocess.TimeoutExpired as exc:
        process.kill()
        process.wait()
        audio_reader.join()
        error_reader.join()
        if process.stdout is not None:
            process.stdout.close()
        if process.stderr is not None:
            process.stderr.close()
        raise RuntimeError('Local audio analysis timed out. Try a shorter VOD.') from exc
    audio_reader.join()
    error_reader.join()
    if process.stdout is not None:
        process.stdout.close()
    if process.stderr is not None:
        process.stderr.close()

    if read_errors:
        raise RuntimeError(f'Could not read FFmpeg PCM output: {read_errors[0]}') from read_errors[0]
    if return_code:
        detail = bytes(stderr_tail).decode('utf-8', 'replace')[-1000:]
        if 'does not contain any stream' in detail.lower():
            raise ValueError('This VOD has no readable audio track.')
        raise RuntimeError(detail or 'FFmpeg could not read audio from this VOD.')
    if not levels:
        raise ValueError('No audio samples were found in this VOD.')
    return levels

def _clamp(value: float, low: float, high: float) -> float:
    return max(low,min(high,value))

def audio_evidence(levels_db: list[float], start_seconds: float, end_seconds: float, source_offset_seconds: float = 0) -> dict:
    """Compare a candidate's audio peak against surrounding VOD ambience."""
    if not levels_db:
        return {'available':False,'reason':'No analyzed audio data.'}
    start=max(0,int(math.floor(float(start_seconds)+float(source_offset_seconds))))
    end=min(len(levels_db),int(math.ceil(float(end_seconds)+float(source_offset_seconds))))
    if end<=start:
        return {'available':False,'reason':'Candidate timestamp is outside the analyzed VOD.'}
    candidate=levels_db[start:end]
    if not candidate:
        return {'available':False,'reason':'Candidate timestamp is outside the analyzed VOD.'}
    # Compare with nearby sound, excluding the event itself and a small buffer.
    before=levels_db[max(0,start-45):max(0,start-5)]
    after=levels_db[min(len(levels_db),end+5):min(len(levels_db),end+45)]
    baseline=before+after
    if len(baseline)<3:
        baseline=[level for i,level in enumerate(levels_db) if not start<=i<end]
    if not baseline:
        return {'available':False,'reason':'Not enough surrounding VOD audio for comparison.'}
    ambient=statistics.median(baseline)
    peak=max(candidate)
    delta=round(peak-ambient,1)
    audio_fit=round(_clamp(delta/15.0*100.0,0.0,100.0),1)
    if delta>=9: label='Strong audio echo'
    elif delta>=3: label='Audio activity nearby'
    else: label='No clear audio spike'
    return {'available':True,'peak_dbfs':round(peak,1),'ambient_dbfs':round(ambient,1),'delta_db':delta,'audio_fit':audio_fit,'label':label,'seconds_checked':len(candidate)}

def enrich_moments(moments: list[dict], levels_db: list[float] | None, source_offset_seconds: float = 0) -> list[dict]:
    """Add an explicitly heuristic cross-signal score and rank; never call it confidence."""
    enriched=[]
    for original in moments:
        item=dict(original)
        if levels_db is not None:
            evidence=audio_evidence(levels_db,item['start_seconds'],item['end_seconds'],source_offset_seconds)
            item['audio_evidence']=evidence
            if evidence.get('available'):
                item['echomap_score']=round(0.7*float(item['score'])+0.3*evidence['audio_fit'],1)
                item['echomap_label']=evidence['label']
        enriched.append(item)
    if levels_db is not None:
        enriched.sort(key=lambda item:(item.get('echomap_score',item['score']),item['created_at']),reverse=True)
    return enriched
