import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const UIWalkthrough: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Mouse cursor animation
  // Phase 1 (0-150): cursor moves to Run Demo and clicks
  const cursorX = interpolate(frame, [30, 90, 110, 200, 260, 320, 400, 480], [960, 1380, 1380, 1380, 500, 500, 680, 680], { extrapolateRight: 'clamp' });
  const cursorY = interpolate(frame, [30, 90, 110, 200, 260, 320, 400, 480], [600, 310, 310, 310, 620, 620, 620, 620], { extrapolateRight: 'clamp' });
  const isDemoClicked = frame >= 95;
  const isKeptClicked = frame >= 265;
  const isEchoMapActive = frame >= 420;

  // Animated Telemetry
  const messagesSeen = Math.floor(interpolate(frame, [95, 160], [0, 11], { extrapolateRight: 'clamp' }));
  const momentsCount = Math.floor(interpolate(frame, [110, 170], [0, 1], { extrapolateRight: 'clamp' }));
  const uptimeSec = Math.floor(interpolate(frame, [95, 670], [0, 42], { extrapolateRight: 'clamp' }));

  // Card appearance spring
  const cardScale = spring({ frame: frame - 120, fps, config: { damping: 14 } });
  const cardOpacity = interpolate(frame, [120, 140], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#101014',
      color: '#F1F5F9',
      fontFamily: "'Manrope', system-ui, -apple-system, sans-serif",
      padding: '24px 36px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Top Bar */}
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '16px',
        marginBottom: '20px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '15px' }}>
          <span style={{ color: '#64748B', fontWeight: 600 }}>STUDIO</span>
          <span style={{ color: '#334155' }}>/</span>
          <span style={{ color: '#00F5D4', fontWeight: 700 }}>LIVE MOMENTS RADAR</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <span style={{
            backgroundColor: 'rgba(0, 245, 212, 0.1)',
            border: '1px solid #00F5D4',
            color: '#00F5D4',
            padding: '4px 14px',
            borderRadius: '999px',
            fontSize: '12px',
            fontWeight: 800,
            letterSpacing: '1px'
          }}>
            🔒 PRIVATE BY DEFAULT (LOOPBACK)
          </span>
          <span style={{
            backgroundColor: isDemoClicked ? 'rgba(0, 245, 212, 0.2)' : 'rgba(100, 116, 139, 0.2)',
            color: isDemoClicked ? '#00F5D4' : '#94A3B8',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '13px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <span style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: isDemoClicked ? '#00F5D4' : '#64748B',
              boxShadow: isDemoClicked ? '0 0 10px #00F5D4' : undefined
            }} />
            {isDemoClicked ? 'DEMO SIGNAL POPULATED' : 'DEMO READY'}
          </span>
        </div>
      </header>

      {/* Main Grid: Control Panel + Metrics + Queue */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.8fr', gap: '28px', flex: 1 }}>
        {/* Left Column: Controls & Metrics */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Section 01: Connect Signal */}
          <div style={{
            backgroundColor: '#161821',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '16px',
            padding: '20px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 700, letterSpacing: '1px' }}>01 // CONNECT STREAM</span>
              <span style={{ fontSize: '12px', color: '#9146FF', fontWeight: 600 }}>READ-ONLY IRC · NO SCOPES</span>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '14px' }}>
              <div style={{
                flex: 1,
                backgroundColor: '#0F111A',
                border: '1px solid #2A2E3D',
                borderRadius: '8px',
                padding: '10px 14px',
                fontSize: '14px',
                color: '#E2E8F0',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span style={{ color: '#64748B', marginRight: '6px' }}>twitch.tv/</span>
                <span style={{ fontWeight: 700, color: '#00F5D4' }}>shroud</span>
              </div>
              <button style={{
                backgroundColor: '#9146FF',
                color: '#FFF',
                border: 'none',
                borderRadius: '8px',
                padding: '0 18px',
                fontWeight: 700,
                fontSize: '13px'
              }}>Connect ↗</button>
            </div>

            {/* Offline Demo Box */}
            <div style={{
              backgroundColor: '#0E1018',
              border: isDemoClicked ? '1px solid #00F5D4' : '1px dashed #2A2E3D',
              borderRadius: '10px',
              padding: '12px 16px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <strong style={{ fontSize: '13px', display: 'block', color: '#F1F5F9' }}>Want to test offline?</strong>
                <span style={{ fontSize: '12px', color: '#64748B' }}>Injects synthetic reaction burst</span>
              </div>
              <button style={{
                backgroundColor: isDemoClicked ? '#00F5D4' : '#1E2333',
                color: isDemoClicked ? '#000' : '#FFF',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 14px',
                fontWeight: 800,
                fontSize: '12px',
                boxShadow: isDemoClicked ? '0 0 16px rgba(0, 245, 212, 0.4)' : undefined
              }}>
                ✳ Run demo
              </button>
            </div>
          </div>

          {/* Metrics Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ backgroundColor: '#161821', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>CHAT SIGNALS ⌁</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#38BDF8', fontFamily: 'monospace', margin: '4px 0' }}>
                {String(messagesSeen).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '10px', color: '#475569' }}>observed this session</div>
            </div>

            <div style={{ backgroundColor: '#161821', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>CANDIDATES ◉</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#00F5D4', fontFamily: 'monospace', margin: '4px 0' }}>
                {String(momentsCount).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '10px', color: '#475569' }}>ranked by audience energy</div>
            </div>

            <div style={{ backgroundColor: '#161821', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px' }}>
              <div style={{ fontSize: '11px', color: '#64748B', textTransform: 'uppercase', fontWeight: 700 }}>SESSION CLOCK ◷</div>
              <div style={{ fontSize: '32px', fontWeight: 900, color: '#F59E0B', fontFamily: 'monospace', margin: '4px 0' }}>
                00:{String(uptimeSec).padStart(2, '0')}
              </div>
              <div style={{ fontSize: '10px', color: '#475569' }}>since stream connect</div>
            </div>
          </div>

          {/* EchoMap VOD Setup Box */}
          <div style={{
            backgroundColor: '#161821',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '16px',
            padding: '18px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#64748B', fontWeight: 700 }}>ECHOMAP · LOCAL VOD CORROBORATION</span>
              <span style={{ fontSize: '12px', color: '#00F5D4' }}>FFmpeg 8kHz Scan</span>
            </div>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{
                backgroundColor: '#0F111A',
                border: '1px solid #2A2E3D',
                borderRadius: '6px',
                padding: '6px 12px',
                fontSize: '12px',
                color: '#E2E8F0',
                flex: 1
              }}>
                📁 Attached: <b>match_final_game.mp4</b>
              </div>
              <div style={{ fontSize: '12px', color: '#94A3B8' }}>Offset: <b>12s</b></div>
            </div>
            <button style={{
              width: '100%',
              backgroundColor: isEchoMapActive ? 'rgba(0, 245, 212, 0.2)' : '#1E2333',
              color: isEchoMapActive ? '#00F5D4' : '#E2E8F0',
              border: isEchoMapActive ? '1px solid #00F5D4' : '1px solid #2A2E3D',
              borderRadius: '8px',
              padding: '10px',
              fontWeight: 700,
              fontSize: '13px'
            }}>
              {isEchoMapActive ? '✓ EchoMap Audio Analysis Complete (+18.4 dB)' : 'Analyze with EchoMap ↗'}
            </button>
          </div>
        </div>

        {/* Right Column: Moment Queue & Review Card */}
        <div style={{
          backgroundColor: '#14161F',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '20px',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '14px', color: '#64748B', fontWeight: 700 }}>02 // MOMENT QUEUE</span>
              <span style={{ backgroundColor: '#1E2333', color: '#00F5D4', padding: '3px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: 800 }}>
                {momentsCount} MOMENT CANDIDATE
              </span>
            </div>
            <span style={{ color: '#64748B', fontSize: '12px' }}>CLEAR QUEUE</span>
          </div>

          {/* Moment Card */}
          {frame >= 110 && (
            <div style={{
              opacity: cardOpacity,
              transform: `scale(${Math.max(0.85, cardScale)})`,
              backgroundColor: '#1A1D29',
              border: isKeptClicked ? '2px solid #00F5D4' : '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '14px',
              boxShadow: isKeptClicked ? '0 10px 30px rgba(0, 245, 212, 0.2)' : '0 10px 25px rgba(0,0,0,0.3)'
            }}>
              {/* Card Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontFamily: 'monospace', fontWeight: 800, color: '#00F5D4', fontSize: '16px' }}>00:15 → 00:30</span>
                  <span style={{ backgroundColor: '#262A3B', color: '#94A3B8', padding: '2px 8px', borderRadius: '4px', fontSize: '11px', fontWeight: 700 }}>
                    DEMO · {isKeptClicked ? 'KEPT' : 'NEW'}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '6px' }}>
                  <div style={{ width: '60px', height: '6px', backgroundColor: '#262A3B', borderRadius: '3px', overflow: 'hidden' }}>
                    <div style={{ width: '84%', height: '100%', backgroundColor: '#00F5D4' }} />
                  </div>
                  <span style={{ fontWeight: 900, fontSize: '18px', color: '#00F5D4', fontFamily: 'monospace' }}>84.2</span>
                  <span style={{ fontSize: '10px', color: '#64748B', fontWeight: 800 }}>CHAT</span>
                </div>
              </div>

              <h3 style={{ fontSize: '20px', fontWeight: 800, margin: 0, color: '#FFF' }}>
                Audience reaction spike
              </h3>

              {/* Signal Chips */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{ backgroundColor: '#262A3B', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1' }}>
                  <b>11</b> msgs / 15s
                </span>
                <span style={{ backgroundColor: '#262A3B', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1' }}>
                  <b>7</b> unique chatters
                </span>
                <span style={{ backgroundColor: '#262A3B', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', color: '#CBD5E1' }}>
                  <b>8</b> reaction cues
                </span>
              </div>

              {/* EchoMap Corroboration Badge */}
              {isEchoMapActive && (
                <div style={{
                  backgroundColor: 'rgba(145, 70, 255, 0.15)',
                  border: '1px solid #9146FF',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ color: '#C084FC', fontWeight: 700, fontSize: '13px' }}>Strong audio echo · +18.4 dB</span>
                    <div style={{ color: '#94A3B8', fontSize: '11px' }}>VOD peak vs surrounding baseline noise</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '10px', color: '#C084FC', fontWeight: 700, display: 'block' }}>DUAL RANK</span>
                    <span style={{ fontSize: '20px', fontWeight: 900, color: '#C084FC', fontFamily: 'monospace' }}>87.4</span>
                  </div>
                </div>
              )}

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '14px' }}>
                <span style={{ fontSize: '12px', color: '#64748B', maxWidth: '65%' }}>
                  Why flagged: fast chat + 7 distinct voices. Heuristic signal, not an AI verdict.
                </span>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button style={{
                    backgroundColor: isKeptClicked ? '#00F5D4' : '#262A3B',
                    color: isKeptClicked ? '#000' : '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}>
                    {isKeptClicked ? '✓ Kept' : 'Keep'}
                  </button>
                  <button style={{
                    backgroundColor: '#9146FF',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '6px',
                    padding: '8px 14px',
                    fontWeight: 700,
                    fontSize: '12px'
                  }}>
                    Make clip 🎬
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Toast Notification Simulation */}
          {isKeptClicked && (
            <div style={{
              marginTop: '16px',
              backgroundColor: '#00F5D4',
              color: '#000',
              fontWeight: 800,
              fontSize: '13px',
              borderRadius: '8px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              ✓ Moment saved to your keepers.
            </div>
          )}
        </div>
      </div>

      {/* Animated Mouse Pointer */}
      <div style={{
        position: 'absolute',
        top: `${cursorY}px`,
        left: `${cursorX}px`,
        width: '26px',
        height: '26px',
        pointerEvents: 'none',
        zIndex: 999,
        transition: 'transform 0.05s ease',
        filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.8))'
      }}>
        <svg viewBox="0 0 24 24" width="28" height="28" fill="#FFF" stroke="#000" strokeWidth="1.5">
          <path d="M4 2l16 11-7.5 1.5 4.5 8-3 1.5-4.5-8L4 21V2z" />
        </svg>
      </div>
    </AbsoluteFill>
  );
};
