import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const RadarReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoScale = spring({ frame, fps, config: { damping: 12, stiffness: 90 } });
  const sweepAngle = (frame * 5) % 360;

  const features = [
    { icon: '🔒', title: 'Zero Bot / Zero OAuth', desc: 'Connects anonymously via public IRC. No channel moderation risk.' },
    { icon: '⚡', title: 'Real-Time Radar', desc: '15-second rolling reaction window identifies hype bursts instantly.' },
    { icon: '🛡️', title: '100% Private & Local', desc: 'Binds to loopback (127.0.0.1). Chat text is never logged to disk.' },
    { icon: '🎮', title: 'Creator-In-Control', desc: 'Suggests moments into a review queue. No automated posting.' },
  ];

  return (
    <AbsoluteFill style={{
      backgroundColor: '#070A11',
      color: '#FFFFFF',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '70px 100px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top Breadcrumb */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <span style={{
            background: 'linear-gradient(135deg, #9146FF 0%, #00F5D4 100%)',
            color: '#000',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            letterSpacing: '1px'
          }}>VOXCLUTCH v0.2.0</span>
          <span style={{ color: '#64748B', fontSize: '16px' }}>// ARCHITECTURAL INTRO</span>
        </div>
        <span style={{ color: '#00F5D4', fontWeight: 600, fontSize: '16px', letterSpacing: '1px' }}>● 100% LOCAL MVP</span>
      </div>

      {/* Main Content Area */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px', alignItems: 'center' }}>
        {/* Left Side: Radar Visualizer */}
        <div style={{
          position: 'relative',
          width: '520px',
          height: '520px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          {/* Concentric Radar Rings */}
          {[120, 240, 360, 480].map((radius, i) => (
            <div key={i} style={{
              position: 'absolute',
              width: `${radius}px`,
              height: `${radius}px`,
              borderRadius: '50%',
              border: `1px solid rgba(0, 245, 212, ${0.15 + i * 0.05})`,
              boxShadow: i === 3 ? '0 0 50px rgba(0, 245, 212, 0.1)' : undefined
            }} />
          ))}

          {/* Crosshairs */}
          <div style={{ position: 'absolute', width: '480px', height: '1px', backgroundColor: 'rgba(0, 245, 212, 0.2)' }} />
          <div style={{ position: 'absolute', height: '480px', width: '1px', backgroundColor: 'rgba(0, 245, 212, 0.2)' }} />

          {/* Sweeping Radar Beam */}
          <div style={{
            position: 'absolute',
            width: '240px',
            height: '240px',
            top: '20px',
            left: '20px',
            transformOrigin: 'bottom right',
            transform: `rotate(${sweepAngle}deg)`,
            background: 'conic-gradient(from 0deg, rgba(0, 245, 212, 0.4) 0deg, transparent 60deg)',
            borderRadius: '100% 0 0 0',
            pointerEvents: 'none'
          }} />

          {/* Blip Detections */}
          <div style={{
            position: 'absolute',
            top: '140px',
            right: '120px',
            backgroundColor: '#00F5D4',
            width: '14px',
            height: '14px',
            borderRadius: '50%',
            boxShadow: '0 0 20px #00F5D4, 0 0 40px #00F5D4',
            animation: 'pulse 1s infinite'
          }} />

          {/* Center Brand Core */}
          <div style={{
            transform: `scale(${logoScale})`,
            backgroundColor: '#0F172A',
            border: '2px solid #00F5D4',
            width: '130px',
            height: '130px',
            borderRadius: '50%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            boxShadow: '0 0 40px rgba(0, 245, 212, 0.35)',
            zIndex: 10
          }}>
            <span style={{ fontSize: '32px', fontWeight: 900, color: '#00F5D4', letterSpacing: '-1px' }}>VC</span>
            <span style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '2px' }}>RADAR</span>
          </div>
        </div>

        {/* Right Side: Headline and Feature Matrix */}
        <div>
          <h2 style={{
            fontSize: '56px',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 16px 0',
            letterSpacing: '-1px'
          }}>
            Meet <span style={{
              background: 'linear-gradient(90deg, #00F5D4, #9146FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>VoxClutch</span>
          </h2>
          <p style={{ fontSize: '22px', color: '#94A3B8', margin: '0 0 36px 0', lineHeight: 1.4 }}>
            An explainable, creator-in-control radar that catches the moments chat saw first.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            {features.map((feat, idx) => {
              const featDelay = 15 + idx * 10;
              const featOpacity = interpolate(frame, [featDelay, featDelay + 10], [0, 1], { extrapolateRight: 'clamp' });
              const featY = interpolate(frame, [featDelay, featDelay + 15], [20, 0], { extrapolateRight: 'clamp' });

              return (
                <div key={idx} style={{
                  opacity: featOpacity,
                  transform: `translateY(${featY}px)`,
                  backgroundColor: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  borderRadius: '16px',
                  padding: '20px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
                }}>
                  <div style={{ fontSize: '28px', marginBottom: '8px' }}>{feat.icon}</div>
                  <h4 style={{ fontSize: '18px', fontWeight: 700, color: '#F8FAFC', margin: '0 0 6px 0' }}>{feat.title}</h4>
                  <p style={{ fontSize: '14px', color: '#64748B', margin: 0, lineHeight: 1.4 }}>{feat.desc}</p>
                </div>
              );
            })}
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
        <span>VOXCLUTCH RADAR // PART 02</span>
        <span>NO BLACK BOX. 100% EXPLAINABLE HEURISTICS.</span>
      </div>
    </AbsoluteFill>
  );
};
