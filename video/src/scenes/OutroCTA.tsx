import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const OutroCTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scale = spring({ frame, fps, config: { damping: 12, stiffness: 80 } });
  const opacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#070A12',
      color: '#FFFFFF',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '80px 100px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      position: 'relative'
    }}>
      {/* Background ambient glow */}
      <div style={{
        position: 'absolute',
        width: '600px',
        height: '600px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(145, 70, 255, 0.15) 0%, rgba(0, 245, 212, 0.1) 40%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      <div style={{ opacity, transform: `scale(${scale})`, zIndex: 10, maxWidth: '900px' }}>
        {/* Brand Tag */}
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: 'rgba(0, 245, 212, 0.1)',
          border: '1px solid #00F5D4',
          borderRadius: '999px',
          padding: '8px 24px',
          color: '#00F5D4',
          fontWeight: 800,
          fontSize: '16px',
          letterSpacing: '2px',
          marginBottom: '28px'
        }}>
          ⚡ OPEN SOURCE STREAMER WORKSTATION
        </div>

        {/* Grand Headline */}
        <h1 style={{
          fontSize: '76px',
          fontWeight: 900,
          margin: '0 0 24px 0',
          letterSpacing: '-2px',
          lineHeight: 1.1
        }}>
          Catch the moment<br />
          <span style={{
            background: 'linear-gradient(90deg, #00F5D4, #C084FC)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>chat saw first.</span>
        </h1>

        <p style={{ fontSize: '24px', color: '#94A3B8', margin: '0 0 44px 0', lineHeight: 1.5 }}>
          Zero Cloud Subscriptions · Zero API Keys · 100% Private & Free
        </p>

        {/* GitHub Badge Card */}
        <div style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          padding: '24px 40px',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '24px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.6)'
        }}>
          <div style={{
            backgroundColor: '#1E293B',
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '28px'
          }}>
            ⭐
          </div>
          <div style={{ textAlign: 'left' }}>
            <div style={{ color: '#64748B', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Star & Fork on GitHub</div>
            <div style={{ color: '#FFF', fontSize: '24px', fontWeight: 800, fontFamily: 'DM Mono, monospace' }}>
              github.com/Rohi56u/VoXCluTcH
            </div>
          </div>
        </div>

        {/* Tech Stack Pills */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', marginTop: '36px' }}>
          {['Python 3.10+', 'Flask 3.0', 'Twitch IRC', 'FFmpeg', 'SQLite', 'EchoMap™'].map((tech, i) => (
            <span key={i} style={{
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '6px 14px',
              fontSize: '14px',
              color: '#94A3B8',
              fontWeight: 600
            }}>{tech}</span>
          ))}
        </div>
      </div>
    </AbsoluteFill>
  );
};
