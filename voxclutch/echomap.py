"""Local, non-transcribing audio cues for EchoMap chat/VOD corroboration."""
from __future__ import annotations
from array import array
import math
import shutil
import statistics
import subprocess
import sys
from pathlib import Path

SAMPLE_RATE = 8000

def analyze_audio_levels(video_path: Path, timeout_seconds: int = 300) -> list[float]:
    """Decode mono PCM at 8 kHz and return one RMS dBFS value per second.

    Audio samples stay in process memory only. The source video is never uploaded
    to an AI or remote analysis provider.
    """
    if shutil.which('ffmpeg') is None:
        raise RuntimeError('FFmpeg was not found. Install FFmpeg to run EchoMap.')
    command = ['ffmpeg','-hide_banner','-loglevel','error','-i',str(Path(video_path).resolve()),'-vn','-ac','1','-ar',str(SAMPLE_RATE),'-f','s16le','pipe:1']
    try:
        result = subprocess.run(command,capture_output=True,timeout=timeout_seconds,check=False)
    except subprocess.TimeoutExpired as exc:
        raise RuntimeError('Local audio analysis timed out. Try a shorter VOD.') from exc
    if result.returncode:
        detail=result.stderr.decode('utf-8','replace')[-1000:]
        if b'does not contain any stream' in result.stderr or b'Output file #0 does not contain any stream' in result.stderr:
            raise ValueError('This VOD has no readable audio track.')
        raise RuntimeError(detail or 'FFmpeg could not read audio from this VOD.')
    samples=array('h')
    samples.frombytes(result.stdout)
    if sys.byteorder!='little': samples.byteswap()
    if not samples: raise ValueError('No audio samples were found in this VOD.')
    per_second=SAMPLE_RATE
    levels=[]
    for first in range(0,len(samples),per_second):
        block=samples[first:first+per_second]
        mean_square=sum(sample*sample for sample in block)/len(block)
        rms=math.sqrt(mean_square)
        levels.append(round(20*math.log10(max(rms/32768.0,1e-6)),2))
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
