import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const EchoMapAudio: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const waveBars = 32;
  const audioFitVal = interpolate(frame, [40, 90], [0, 94.2], { extrapolateRight: 'clamp' });
  const fusedScore = interpolate(frame, [60, 100], [0, 87.4], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#080C17',
      color: '#FFFFFF',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '70px 100px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top Header Tag */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{
            backgroundColor: 'rgba(145, 70, 255, 0.2)',
            border: '1px solid #9146FF',
            color: '#C084FC',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            letterSpacing: '1px'
          }}>DUAL-SIGNAL RADAR</span>
          <span style={{ color: '#64748B', fontSize: '16px' }}>// ECHOMAP™ AUDIO CORROBORATION</span>
        </div>
        <span style={{ color: '#9146FF', fontWeight: 600, fontSize: '16px', letterSpacing: '1px' }}>● 8kHz RMS dBFS EXTRACTION</span>
      </div>

      {/* Main Grid: Waveform & Decibel Delta */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '50px', alignItems: 'center' }}>
        {/* Left: Audio Waveform Scan Simulation */}
        <div>
          <h2 style={{ fontSize: '50px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-1px' }}>
            Does the VOD <span style={{ color: '#C084FC' }}>echo the chat?</span>
          </h2>
          <p style={{ fontSize: '20px', color: '#94A3B8', margin: '0 0 28px 0', lineHeight: 1.5 }}>
            EchoMap maps chat timestamps directly to your local VOD.
            FFmpeg extracts per-second decibel levels (RMS dBFS) to verify game audio surges.
          </p>

          {/* Animated Waveform Display */}
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(145, 70, 255, 0.3)',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 15px 35px rgba(0,0,0,0.5)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748B', fontSize: '13px', marginBottom: '14px' }}>
              <span>LOCAL AUDIO ENERGY SCAN</span>
              <span style={{ color: '#00F5D4' }}>SPIKE DETECTED (+18.4 dB)</span>
            </div>

            {/* Waveform Bars */}
            <div style={{
              height: '110px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              gap: '4px',
              padding: '0 10px'
            }}>
              {Array.from({ length: waveBars }).map((_, i) => {
                const isHighlight = i >= 18 && i <= 24;
                const baseHeight = isHighlight ? 85 : 20;
                const animHeight = baseHeight + Math.sin(frame * 0.2 + i * 0.5) * (isHighlight ? 20 : 8);

                return (
                  <div key={i} style={{
                    flex: 1,
                    height: `${Math.max(10, animHeight)}px`,
                    backgroundColor: isHighlight ? '#00F5D4' : '#334155',
                    borderRadius: '4px',
                    boxShadow: isHighlight ? '0 0 12px rgba(0, 245, 212, 0.5)' : undefined,
                    transition: 'height 0.1s ease'
                  }} />
                );
              })}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', fontSize: '12px', marginTop: '10px' }}>
              <span>VOD 00:41:30</span>
              <span style={{ color: '#00F5D4' }}>MOMENT WINDOW (00:42:10 → 00:42:25)</span>
              <span>VOD 00:43:00</span>
            </div>
          </div>
        </div>

        {/* Right: Dual-Signal Fusion Card */}
        <div style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(145, 70, 255, 0.2)',
          borderRadius: '24px',
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}>
          <div>
            <span style={{ color: '#64748B', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>DUAL-SIGNAL FUSION RANK</span>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginTop: '6px' }}>
              <div style={{ fontSize: '16px', color: '#C084FC', fontWeight: 600 }}>STRONG AUDIO ECHO</div>
              <div style={{ fontSize: '56px', fontWeight: 900, color: '#C084FC', fontFamily: 'DM Mono, monospace' }}>
                {fusedScore.toFixed(1)}
              </div>
            </div>
          </div>

          {/* Signal Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', borderTop: '1px solid #1E293B', paddingTop: '18px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
              <span style={{ color: '#94A3B8' }}>🟣 Chat Score (70%):</span>
              <span style={{ color: '#FFF', fontWeight: 700 }}>84.5</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
              <span style={{ color: '#94A3B8' }}>🔊 Audio Fit (30%):</span>
              <span style={{ color: '#00F5D4', fontWeight: 700 }}>{audioFitVal.toFixed(1)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px' }}>
              <span style={{ color: '#94A3B8' }}>📈 Delta vs Ambient:</span>
              <span style={{ color: '#38BDF8', fontWeight: 700 }}>+18.4 dBFS</span>
            </div>
          </div>

          {/* Privacy Note */}
          <div style={{
            backgroundColor: 'rgba(0, 245, 212, 0.08)',
            border: '1px solid rgba(0, 245, 212, 0.2)',
            borderRadius: '12px',
            padding: '12px 16px',
            fontSize: '13px',
            color: '#E2E8F0',
            lineHeight: 1.4
          }}>
            🔒 <b>Zero Speech-To-Text / No Cloud Model:</b> Raw audio PCM is decoded locally into process memory and wiped immediately.
          </div>
        </div>
      </div>

      {/* Footer bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        color: '#475569',
        fontSize: '16px',
        borderTop: '1px solid #1E293B',
        paddingTop: '20px'
      }}>
        <span>VOXCLUTCH RADAR // PART 04</span>
        <span>CHAT REACTION + GAME SOUND RISE TOGETHER</span>
      </div>
    </AbsoluteFill>
  );
};
