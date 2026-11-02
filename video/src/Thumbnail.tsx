import React from 'react';
import { AbsoluteFill } from 'remotion';

export const DevpostThumbnail: React.FC = () => {
  return (
    <AbsoluteFill style={{
      backgroundColor: '#070A12',
      color: '#FFFFFF',
      fontFamily: "'Manrope', 'Inter', system-ui, -apple-system, sans-serif",
      padding: '48px 56px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background Radial Glows */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(145, 70, 255, 0.25) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />
      <div style={{
        position: 'absolute',
        bottom: '-120px',
        left: '-100px',
        width: '550px',
        height: '550px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 245, 212, 0.2) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Header Pills */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={{
            backgroundColor: '#9146FF',
            color: '#FFF',
            fontWeight: 800,
            fontSize: '13px',
            padding: '6px 16px',
            borderRadius: '999px',
            letterSpacing: '1.5px',
            boxShadow: '0 0 20px rgba(145, 70, 255, 0.5)'
          }}>
            🟣 CODEX × TWITCHCON
          </span>
          <span style={{
            backgroundColor: 'rgba(0, 245, 212, 0.15)',
            border: '1px solid #00F5D4',
            color: '#00F5D4',
            fontWeight: 800,
            fontSize: '13px',
            padding: '5px 14px',
            borderRadius: '999px',
            letterSpacing: '1px'
          }}>
            ⚡ AI MOMENT RADAR
          </span>
        </div>
        <span style={{ color: '#64748B', fontSize: '14px', fontWeight: 700, letterSpacing: '1px' }}>
          3:2 DEVPOST SHOWCASE
        </span>
      </div>

      {/* Center Hero Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '40px', alignItems: 'center', zIndex: 10 }}>
        <div>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            color: '#00F5D4',
            fontSize: '14px',
            fontWeight: 800,
            letterSpacing: '2px',
            marginBottom: '12px'
          }}>
            <span style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: '#00F5D4', display: 'inline-block' }} />
            EXPLAINABLE STREAMER WORKSTATION
          </div>

          <h1 style={{
            fontSize: '76px',
            fontWeight: 900,
            lineHeight: 1.0,
            margin: '0 0 16px 0',
            letterSpacing: '-2px',
            textTransform: 'uppercase'
          }}>
            Vox<span style={{
              background: 'linear-gradient(90deg, #00F5D4, #C084FC)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>Clutch</span>
          </h1>

          <p style={{
            fontSize: '24px',
            color: '#E2E8F0',
            fontWeight: 600,
            lineHeight: 1.3,
            margin: '0 0 24px 0'
          }}>
            Catch the moment chat saw first.
          </p>

          <p style={{
            fontSize: '16px',
            color: '#94A3B8',
            lineHeight: 1.5,
            margin: '0 0 28px 0',
            maxWidth: '540px'
          }}>
            Dual-signal Twitch radar powered by OpenAI Codex. Real-time chat reaction heuristics paired with local EchoMap™ VOD audio verification.
          </p>

          {/* Key Metric Tags */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <div style={{ backgroundColor: '#131722', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 16px' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 800 }}>IRC LISTEN</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#38BDF8' }}>0 OAuth</div>
            </div>
            <div style={{ backgroundColor: '#131722', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 16px' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 800 }}>AUDIO DELTA</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#00F5D4' }}>+18.4 dB</div>
            </div>
            <div style={{ backgroundColor: '#131722', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '10px 16px' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: 800 }}>PRIVACY</div>
              <div style={{ fontSize: '18px', fontWeight: 900, color: '#F59E0B' }}>100% Local</div>
            </div>
          </div>
        </div>

        {/* Right: Radar Visual Graphic Card */}
        <div style={{
          backgroundColor: '#0F1424',
          border: '2px solid rgba(0, 245, 212, 0.4)',
          borderRadius: '24px',
          padding: '24px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 40px rgba(0, 245, 212, 0.15)',
          position: 'relative'
        }}>
          {/* Radar Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontSize: '12px', color: '#9146FF', fontWeight: 800, letterSpacing: '1px' }}>DUAL-SIGNAL RADAR</span>
            <span style={{
              backgroundColor: '#00F5D4',
              color: '#000',
              padding: '3px 10px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 900
            }}>RANK 87.4</span>
          </div>

          {/* Moment Simulation Preview */}
          <div style={{ backgroundColor: '#161C30', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748B', marginBottom: '6px' }}>
              <span style={{ color: '#00F5D4', fontFamily: 'monospace', fontWeight: 700 }}>00:42:10 → 00:42:25</span>
              <span>LIVE CLUTCH</span>
            </div>
            <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF', marginBottom: '8px' }}>
              Audience reaction spike
            </div>
            <div style={{ display: 'flex', gap: '6px', fontSize: '11px' }}>
              <span style={{ backgroundColor: '#212B45', padding: '3px 8px', borderRadius: '4px', color: '#94A3B8' }}>11 msgs/15s</span>
              <span style={{ backgroundColor: '#212B45', padding: '3px 8px', borderRadius: '4px', color: '#00F5D4' }}>+18.4 dB Audio</span>
            </div>
          </div>

          {/* Audio Wave Bar Visual */}
          <div style={{
            height: '42px',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            backgroundColor: '#0A0E1A',
            borderRadius: '8px',
            padding: '0 10px',
            marginBottom: '14px'
          }}>
            {[14, 18, 12, 24, 38, 42, 36, 40, 20, 16, 12, 10].map((h, i) => (
              <div key={i} style={{
                flex: 1,
                height: `${h}px`,
                backgroundColor: i >= 4 && i <= 7 ? '#00F5D4' : '#334155',
                borderRadius: '2px'
              }} />
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', color: '#64748B' }}>1-Click Local Clip Trim</span>
            <span style={{
              backgroundColor: '#9146FF',
              color: '#FFF',
              padding: '6px 14px',
              borderRadius: '6px',
              fontSize: '11px',
              fontWeight: 800
            }}>Make Clip 🎬</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        paddingTop: '20px',
        zIndex: 10
      }}>
        <div style={{ display: 'flex', gap: '16px', fontSize: '12px', color: '#64748B', fontWeight: 700 }}>
          <span>OPENAI CODEX</span>
          <span>•</span>
          <span>TWITCH IRC</span>
          <span>•</span>
          <span>FFMPEG</span>
          <span>•</span>
          <span>PYTHON 3.10</span>
          <span>•</span>
          <span>SQLITE</span>
        </div>
        <div style={{ fontSize: '13px', color: '#94A3B8', fontWeight: 600 }}>
          github.com/Rohi56u/VoXCluTcH
        </div>
      </div>
    </AbsoluteFill>
  );
};
