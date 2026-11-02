import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const ClipWorkstation: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const renderProgress = interpolate(frame, [30, 80], [0, 100], { extrapolateRight: 'clamp' });
  const isRenderDone = frame >= 80;

  return (
    <AbsoluteFill style={{
      backgroundColor: '#090D18',
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
            backgroundColor: 'rgba(0, 245, 212, 0.2)',
            border: '1px solid #00F5D4',
            color: '#00F5D4',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            letterSpacing: '1px'
          }}>CREATOR WORKSTATION</span>
          <span style={{ color: '#64748B', fontSize: '16px' }}>// REVIEW & EXPORT</span>
        </div>
        <span style={{ color: '#00F5D4', fontWeight: 600, fontSize: '16px', letterSpacing: '1px' }}>● 1-CLICK CLIP GENERATOR</span>
      </div>

      {/* Main Grid: Queue Card & Clip Rendering */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '50px', alignItems: 'center' }}>
        {/* Left: The Moment Queue Card in UI */}
        <div>
          <h2 style={{ fontSize: '50px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-1px' }}>
            You stay in control.<br />
            <span style={{ color: '#00F5D4' }}>Review, Keep & Clip.</span>
          </h2>
          <p style={{ fontSize: '20px', color: '#94A3B8', margin: '0 0 28px 0', lineHeight: 1.5 }}>
            No automated bots spamming your social accounts.
            VoxClutch builds your highlight shortlist — you make the final editorial call.
          </p>

          {/* Simulated Moment Queue Item */}
          <div style={{
            backgroundColor: '#0F172A',
            border: '2px solid #00F5D4',
            borderRadius: '20px',
            padding: '24px',
            boxShadow: '0 20px 40px rgba(0, 245, 212, 0.15)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div>
                <span style={{ color: '#00F5D4', fontFamily: 'DM Mono, monospace', fontSize: '18px', fontWeight: 700 }}>00:42:10 → 00:42:25</span>
                <span style={{ color: '#64748B', fontSize: '13px', marginLeft: '12px' }}>LIVE · TWITCH</span>
              </div>
              <div style={{
                backgroundColor: 'rgba(0, 245, 212, 0.15)',
                color: '#00F5D4',
                padding: '4px 12px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '14px'
              }}>
                87.4 ECHOMAP RANK
              </div>
            </div>

            <h4 style={{ fontSize: '22px', fontWeight: 700, margin: '0 0 12px 0' }}>Audience Reaction Spike</h4>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
              <span style={{ backgroundColor: '#1E293B', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', color: '#94A3B8' }}>
                <b>11</b> msgs / 15s
              </span>
              <span style={{ backgroundColor: '#1E293B', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', color: '#94A3B8' }}>
                <b>7</b> unique chatters
              </span>
              <span style={{ backgroundColor: '#1E293B', padding: '6px 12px', borderRadius: '6px', fontSize: '13px', color: '#00F5D4' }}>
                +18.4 dB Audio Echo
              </span>
            </div>

            {/* Actions Bar */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button style={{
                backgroundColor: '#00F5D4',
                color: '#000',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: 700,
                fontSize: '14px'
              }}>✓ Kept</button>
              <button style={{
                backgroundColor: '#1E293B',
                color: '#94A3B8',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontWeight: 600,
                fontSize: '14px'
              }}>Dismiss</button>
              <button style={{
                backgroundColor: '#9146FF',
                color: '#FFF',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 24px',
                fontWeight: 700,
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(145, 70, 255, 0.4)'
              }}>Make Clip 🎬</button>
            </div>
          </div>
        </div>

        {/* Right: FFmpeg Export Engine Simulation */}
        <div style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}>
          <div>
            <span style={{ color: '#64748B', fontSize: '13px', letterSpacing: '1px', textTransform: 'uppercase' }}>LOCAL FFMPEG SUBPROCESS</span>
            <h3 style={{ fontSize: '26px', fontWeight: 800, margin: '6px 0 0 0' }}>Frame-Accurate MP4 Cut</h3>
          </div>

          <div style={{
            backgroundColor: '#070A11',
            borderRadius: '12px',
            padding: '16px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '13px',
            color: '#64748B'
          }}>
            <div>$ ffmpeg -ss 00:42:10 -i vod.mp4</div>
            <div>&nbsp;&nbsp;-t 00:00:15 -c:v libx264 -crf 23</div>
            <div style={{ color: '#00F5D4' }}>&nbsp;&nbsp;exports/voxclutch-c28fa4e.mp4</div>
          </div>

          {/* Progress Bar */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8' }}>{isRenderDone ? 'Rendering Complete!' : 'Rendering video…'}</span>
              <span style={{ color: '#00F5D4', fontWeight: 700 }}>{Math.floor(renderProgress)}%</span>
            </div>
            <div style={{ height: '10px', backgroundColor: '#1E293B', borderRadius: '5px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: `${renderProgress}%`,
                backgroundColor: '#00F5D4',
                borderRadius: '5px'
              }} />
            </div>
          </div>

          {/* Export Ready Card */}
          {isRenderDone && (
            <div style={{
              backgroundColor: 'rgba(0, 245, 212, 0.1)',
              border: '1px solid #00F5D4',
              borderRadius: '12px',
              padding: '16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ color: '#FFF', fontWeight: 700, fontSize: '15px' }}>voxclutch-c28fa4e.mp4</div>
                <div style={{ color: '#64748B', fontSize: '12px' }}>1080p60 · 24.5 MB · Ready for YouTube / TikTok</div>
              </div>
              <span style={{
                backgroundColor: '#00F5D4',
                color: '#000',
                padding: '6px 14px',
                borderRadius: '8px',
                fontWeight: 800,
                fontSize: '13px'
              }}>Download ↓</span>
            </div>
          )}
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
        <span>VOXCLUTCH RADAR // PART 05</span>
        <span>CREATOR EDITORIAL FREEDOM · LOCAL MP4 EXPORTS</span>
      </div>
    </AbsoluteFill>
  );
};
