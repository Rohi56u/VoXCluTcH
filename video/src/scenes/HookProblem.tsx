import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const HookProblem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const titleY = interpolate(frame, [0, 25], [40, 0], { extrapolateRight: 'clamp' });

  const chatMessages = [
    { user: 'xX_Shadow_Xx', text: 'YOOOO DID YOU SEE THAT?! 🤯', time: '1s' },
    { user: 'ViperGamer', text: 'POGGERS 1v4 CLUTCH!!', time: '1s' },
    { user: 'Nova_Blast', text: 'LETSGOOOO THAT WAS INSANE', time: '2s' },
    { user: 'Kekw_Andy', text: 'KEKW how did he hit that headshot??', time: '2s' },
    { user: 'CyberKnight', text: 'CLIP THAT RIGHT NOW BRO', time: '3s' },
    { user: 'PixelQueen', text: 'GG WP OMG THAT WAS GODLIKE', time: '3s' },
  ];

  return (
    <AbsoluteFill style={{
      backgroundColor: '#090D16',
      color: '#FFFFFF',
      fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
      padding: '80px 100px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
    }}>
      {/* Top Header Tag */}
      <div style={{
        opacity: titleOpacity,
        transform: `translateY(${titleY}px)`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div style={{
          backgroundColor: 'rgba(255, 75, 75, 0.2)',
          border: '1px solid #FF4B4B',
          borderRadius: '999px',
          padding: '8px 20px',
          color: '#FF6B6B',
          fontWeight: 700,
          fontSize: '18px',
          letterSpacing: '2px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <span style={{ width: 10, height: 10, borderRadius: '50%', backgroundColor: '#FF4B4B', display: 'inline-block' }} />
          THE LIVE STREAMER'S DILEMMA
        </div>
        <span style={{ color: '#64748B', fontSize: '18px' }}>// PROBLEM STATEMENT</span>
      </div>

      {/* Main Grid: Stream Game vs Chat Deluge */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '50px', alignItems: 'center' }}>
        {/* Left Side: Intense Gameplay Simulation */}
        <div>
          <h1 style={{
            fontSize: '64px',
            fontWeight: 800,
            lineHeight: 1.15,
            margin: '0 0 24px 0',
            letterSpacing: '-1.5px'
          }}>
            Streamers miss <span style={{ color: '#FF4B4B', textDecoration: 'underline' }}>80% of clutch moments</span> while fighting for their lives.
          </h1>
          <p style={{ fontSize: '24px', color: '#94A3B8', lineHeight: 1.5, margin: 0 }}>
            You’re laser-focused on the match. Your chat erupts in collective hype.
            By the time you look over, the moment is lost in an endless 6-hour VOD.
          </p>

          <div style={{
            marginTop: '36px',
            display: 'flex',
            gap: '24px'
          }}>
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px 28px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span style={{ color: '#64748B', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Streamer Attention</span>
              <span style={{ color: '#00F5D4', fontSize: '32px', fontWeight: 800 }}>100% GAMEPLAY</span>
            </div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px 28px',
              display: 'flex',
              flexDirection: 'column'
            }}>
              <span style={{ color: '#64748B', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>Manual Clips Marked</span>
              <span style={{ color: '#FF4B4B', fontSize: '32px', fontWeight: 800 }}>0 (MISSED)</span>
            </div>
          </div>
        </div>

        {/* Right Side: Simulated Exploding Chat */}
        <div style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(145, 70, 255, 0.3)',
          borderRadius: '24px',
          padding: '28px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(145, 70, 255, 0.15)',
          overflow: 'hidden',
          position: 'relative'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderBottom: '1px solid #1E293B',
            paddingBottom: '16px',
            marginBottom: '20px'
          }}>
            <span style={{ color: '#9146FF', fontWeight: 700, fontSize: '16px' }}>🟣 TWITCH LIVE CHAT</span>
            <span style={{
              backgroundColor: '#9146FF',
              color: '#FFF',
              padding: '4px 12px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 700
            }}>REACTION SURGE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {chatMessages.map((msg, idx) => {
              const msgDelay = 20 + idx * 15;
              const msgOpacity = interpolate(frame, [msgDelay, msgDelay + 10], [0, 1], { extrapolateRight: 'clamp' });
              const msgScale = spring({ frame: frame - msgDelay, fps, config: { damping: 14 } });

              return (
                <div key={idx} style={{
                  opacity: msgOpacity,
                  transform: `scale(${Math.max(0.8, msgScale)})`,
                  backgroundColor: 'rgba(30, 41, 59, 0.7)',
                  borderLeft: '4px solid #9146FF',
                  borderRadius: '10px',
                  padding: '12px 18px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ color: '#C084FC', fontWeight: 700, marginRight: '10px', fontSize: '15px' }}>{msg.user}:</span>
                    <span style={{ color: '#F1F5F9', fontWeight: 500, fontSize: '16px' }}>{msg.text}</span>
                  </div>
                  <span style={{ color: '#64748B', fontSize: '12px' }}>{msg.time}</span>
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
        <span>VOXCLUTCH RADAR // PART 01</span>
        <span>WHAT IF AN ENGINE MONITORED THE CHAT FOR YOU?</span>
      </div>
    </AbsoluteFill>
  );
};
