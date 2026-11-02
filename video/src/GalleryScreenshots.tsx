import React from 'react';
import { AbsoluteFill } from 'remotion';

// Shared styles and helper components
const cardStyle: React.CSSProperties = {
  backgroundColor: '#12141C',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  borderRadius: '14px',
  padding: '20px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
  position: 'relative'
};

const badgeStyle = (color: string, bg: string): React.CSSProperties => ({
  backgroundColor: bg,
  border: `1px solid ${color}`,
  color: color,
  fontSize: '11px',
  fontWeight: 800,
  letterSpacing: '1px',
  padding: '4px 10px',
  borderRadius: '999px',
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px'
});

// ==========================================
// IMAGE 1: CYBER STUDIO DASHBOARD OVERVIEW
// ==========================================
export const GalleryStudioDashboard: React.FC = () => {
  return (
    <AbsoluteFill style={{
      backgroundColor: '#090B10',
      color: '#F8FAFC',
      fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
      padding: '32px 40px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Background ambient lighting */}
      <div style={{
        position: 'absolute',
        top: '-150px',
        right: '-100px',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 245, 212, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none'
      }} />

      {/* Top Navbar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        paddingBottom: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #00F5D4, #9146FF)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 900,
            color: '#000',
            fontSize: '16px'
          }}>VC</div>
          <div>
            <div style={{ fontSize: '15px', fontWeight: 800, letterSpacing: '0.5px' }}>
              VOXCLUTCH <span style={{ color: '#00F5D4' }}>STUDIO</span>
            </div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 600 }}>LIVE CHAT & AUDIO MOMENT RADAR</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <span style={badgeStyle('#00F5D4', 'rgba(0, 245, 212, 0.1)')}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: '#00F5D4' }} />
            RADAR ACTIVE (127.0.0.1:5050)
          </span>
          <span style={badgeStyle('#9146FF', 'rgba(145, 70, 255, 0.1)')}>
            🔒 100% LOCAL PRIVACY
          </span>
        </div>
      </div>

      {/* Hero Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '16px 0' }}>
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '1px' }}>CONNECTED TARGET</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#9146FF', marginTop: '4px' }}>twitch.tv/shroud</div>
          <div style={{ fontSize: '11px', color: '#00F5D4', marginTop: '4px' }}>● Anonymous IRC Active</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '1px' }}>CHAT SIGNALS SEEN</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#F8FAFC', marginTop: '4px' }}>1,842</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Rolling 15s FIFO Window</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '1px' }}>CLUTCH CANDIDATES</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#00F5D4', marginTop: '4px' }}>6 DETECTED</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>3 Kept for Export</div>
        </div>
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700, letterSpacing: '1px' }}>ECHOMAP™ AUDIO FIT</div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#F5A623', marginTop: '4px' }}>+18.4 dB Δ</div>
          <div style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>Peak vs Ambient Baseline</div>
        </div>
      </div>

      {/* Main Split: Live Queue & Candidate Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', flex: 1 }}>
        {/* Left: Moment Queue */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, letterSpacing: '1px', color: '#94A3B8' }}>
              01 // LIVE MOMENT CANDIDATES
            </span>
            <span style={{ fontSize: '11px', color: '#00F5D4', fontWeight: 700 }}>SORTED BY HYPE DENSITY</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Candidate 1 */}
            <div style={{
              backgroundColor: '#181B26',
              border: '1px solid rgba(0, 245, 212, 0.4)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    backgroundColor: 'rgba(0, 245, 212, 0.15)',
                    color: '#00F5D4',
                    fontWeight: 900,
                    fontSize: '15px',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>94</span>
                  <span style={{ fontWeight: 800, fontSize: '14px' }}>Shroud 1v4 Retake Ace</span>
                  <span style={badgeStyle('#10B981', 'rgba(16, 185, 129, 0.15)')}>⭐ KEPT</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', fontFamily: "'DM Mono', monospace" }}>
                  T+14:20 (15.0s) · 14 msgs · 18 unique chatters · Audio +18.4 dB
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{
                  backgroundColor: '#00F5D4',
                  color: '#000',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '6px 12px',
                  borderRadius: '6px'
                }}>Clip Ready ↗</div>
              </div>
            </div>

            {/* Candidate 2 */}
            <div style={{
              backgroundColor: '#141620',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    backgroundColor: 'rgba(145, 70, 255, 0.15)',
                    color: '#C084FC',
                    fontWeight: 900,
                    fontSize: '15px',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>88</span>
                  <span style={{ fontWeight: 800, fontSize: '14px' }}>Insane Wallbang Headshot</span>
                  <span style={badgeStyle('#00F5D4', 'rgba(0, 245, 212, 0.1)')}>CLIPPED</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', fontFamily: "'DM Mono', monospace" }}>
                  T+09:12 (15.0s) · 11 msgs · 14 unique chatters · Audio +14.2 dB
                </div>
              </div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 700 }}>Saved to /exports</div>
            </div>

            {/* Candidate 3 */}
            <div style={{
              backgroundColor: '#141620',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '10px',
              padding: '14px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    backgroundColor: 'rgba(245, 166, 35, 0.15)',
                    color: '#F5A623',
                    fontWeight: 900,
                    fontSize: '15px',
                    padding: '2px 8px',
                    borderRadius: '6px'
                  }}>76</span>
                  <span style={{ fontWeight: 800, fontSize: '14px' }}>Funny Ninja Defuse Fail</span>
                  <span style={badgeStyle('#F5A623', 'rgba(245, 166, 35, 0.1)')}>NEW</span>
                </div>
                <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '6px', fontFamily: "'DM Mono', monospace" }}>
                  T+03:40 (15.0s) · 8 msgs · 11 unique chatters · Audio +9.8 dB
                </div>
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <span style={{ border: '1px solid #334155', color: '#94A3B8', fontSize: '11px', padding: '4px 10px', borderRadius: '4px' }}>Keep</span>
                <span style={{ border: '1px solid #334155', color: '#94A3B8', fontSize: '11px', padding: '4px 10px', borderRadius: '4px' }}>Dismiss</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Heuristic Inspector Panel */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>
                02 // MOMENT #1 SIGNAL BREAKDOWN
              </span>
              <span style={{ color: '#00F5D4', fontSize: '12px', fontWeight: 800 }}>94/100</span>
            </div>

            {/* Velocity */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Chat Velocity (45% weight)</span>
                <span style={{ color: '#00F5D4', fontFamily: "'DM Mono', monospace" }}>14 msgs / 15s (100%)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#1E293B', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '100%', height: '100%', backgroundColor: '#00F5D4' }} />
              </div>
            </div>

            {/* Chatter Entropy */}
            <div style={{ marginBottom: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Chatter Entropy (35% weight)</span>
                <span style={{ color: '#C084FC', fontFamily: "'DM Mono', monospace" }}>E = 0.96 (18 viewers)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#1E293B', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '96%', height: '100%', backgroundColor: '#C084FC' }} />
              </div>
            </div>

            {/* Reaction Cues */}
            <div style={{ marginBottom: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '4px' }}>
                <span style={{ color: '#E2E8F0', fontWeight: 600 }}>Reaction Cues (20% weight)</span>
                <span style={{ color: '#F5A623', fontFamily: "'DM Mono', monospace" }}>85% match (Pog/Clutch)</span>
              </div>
              <div style={{ height: '6px', backgroundColor: '#1E293B', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ width: '85%', height: '100%', backgroundColor: '#F5A623' }} />
              </div>
            </div>

            <div style={{
              backgroundColor: 'rgba(0, 245, 212, 0.06)',
              border: '1px solid rgba(0, 245, 212, 0.2)',
              borderRadius: '8px',
              padding: '10px 14px',
              fontSize: '11px',
              lineHeight: 1.5,
              color: '#94A3B8'
            }}>
              <b style={{ color: '#00F5D4' }}>EchoMap™ Correlated:</b> Audio surge of <b style={{ color: '#FFF' }}>+18.4 dB</b> detected in local VOD at exact chat spike. Rank promoted to #1.
            </div>
          </div>

          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '12px',
            fontSize: '11px',
            color: '#64748B'
          }}>
            <span>Candidate ID: 01a19da3</span>
            <span style={{ color: '#00F5D4', fontWeight: 700 }}>Ready to Render (FFmpeg)</span>
          </div>
        </div>
      </div>

      {/* Footer Status Bar */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748B',
        borderTop: '1px solid rgba(255, 255, 255, 0.06)',
        paddingTop: '12px'
      }}>
        <span>VOXCLUTCH STUDIO WORKSTATION · CODEX × TWITCHCON</span>
        <span>ZERO DISK TRANSCRIPTS · 100% PRIVATE LOOPBACK · FFMPEG POWERED</span>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// IMAGE 2: EXPLAINABLE HEURISTIC ENGINE
// ==========================================
export const GalleryHeuristicEngine: React.FC = () => {
  return (
    <AbsoluteFill style={{
      backgroundColor: '#090B10',
      color: '#F8FAFC',
      fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
      padding: '40px 48px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={badgeStyle('#00F5D4', 'rgba(0, 245, 212, 0.1)')}>EXPLAINABLE REACTION MATH</span>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0 0', letterSpacing: '-0.5px' }}>
            Multi-Factor Hype & Anti-Spam Detection
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 700 }}>NO BLACK-BOX HALLUCINATIONS</div>
          <div style={{ fontSize: '14px', color: '#00F5D4', fontWeight: 800, fontFamily: "'DM Mono', monospace" }}>
            Score = 100 × (0.45·V + 0.35·E + 0.20·R)
          </div>
        </div>
      </div>

      {/* 3 Core Mathematical Pillars */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', margin: '20px 0' }}>
        {/* Pillar 1 */}
        <div style={{ ...cardStyle, borderTop: '4px solid #00F5D4' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#00F5D4' }}>FACTOR 01</span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFF' }}>45% WEIGHT</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '10px 0 6px 0' }}>Chat Velocity (V)</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
            Measures message arrival frequency within the 15-second rolling FIFO buffer. Saturates at 12 messages to prevent infinite scaling.
          </p>
          <div style={{
            backgroundColor: '#181B26',
            borderRadius: '8px',
            padding: '10px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            color: '#00F5D4',
            marginTop: '12px'
          }}>
            V = min(messages / 12, 1.0)
          </div>
        </div>

        {/* Pillar 2 */}
        <div style={{ ...cardStyle, borderTop: '4px solid #C084FC' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#C084FC' }}>FACTOR 02</span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFF' }}>35% WEIGHT</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '10px 0 6px 0' }}>Chatter Entropy (E)</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
            Normalized Shannon entropy of user participation. Single bot spamming 20 times produces 0 score; 15 distinct viewers score 1.0.
          </p>
          <div style={{
            backgroundColor: '#181B26',
            borderRadius: '8px',
            padding: '10px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            color: '#C084FC',
            marginTop: '12px'
          }}>
            E = -Σ(p_i·ln(p_i)) / ln(N)
          </div>
        </div>

        {/* Pillar 3 */}
        <div style={{ ...cardStyle, borderTop: '4px solid #F5A623' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: '#F5A623' }}>FACTOR 03</span>
            <span style={{ fontSize: '18px', fontWeight: 900, color: '#FFF' }}>20% WEIGHT</span>
          </div>
          <h3 style={{ fontSize: '20px', fontWeight: 800, margin: '10px 0 6px 0' }}>Reaction Cues (R)</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', lineHeight: 1.5 }}>
            Targeted streamer lexicon matching (pog, clutch, insane, letsgo, kekw, lmao, hahah). Filters normal stream banter from true hype.
          </p>
          <div style={{
            backgroundColor: '#181B26',
            borderRadius: '8px',
            padding: '10px',
            fontFamily: "'DM Mono', monospace",
            fontSize: '12px',
            color: '#F5A623',
            marginTop: '12px'
          }}>
            R = reaction_msgs / total_msgs
          </div>
        </div>
      </div>

      {/* Real Evaluation Comparison Banner */}
      <div style={{
        ...cardStyle,
        backgroundColor: '#10121A',
        display: 'grid',
        gridTemplateColumns: '1.2fr 0.8fr',
        gap: '24px',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '12px', color: '#00F5D4', fontWeight: 800, letterSpacing: '1px' }}>
            ANTI-SPAM IN ACTION
          </div>
          <div style={{ fontSize: '16px', fontWeight: 800, marginTop: '4px' }}>
            How VoxClutch prevents false positive spams & bot attacks
          </div>
          <div style={{ fontSize: '13px', color: '#94A3B8', marginTop: '4px', lineHeight: 1.4 }}>
            Traditional tools count message volume, clipping troll spams. VoxClutch requires both minimum unique chatter gates and high normalized entropy before any moment is flagged.
          </div>
        </div>

        <div style={{
          backgroundColor: '#181B26',
          borderRadius: '10px',
          padding: '14px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '8px' }}>
            <span style={{ color: '#EF4444' }}>❌ 1 User × 20 Spams:</span>
            <span style={{ color: '#EF4444', fontWeight: 800 }}>Entropy = 0.0 (DISCARDED)</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
            <span style={{ color: '#10B981' }}>✅ 15 Users × 1 Reaction:</span>
            <span style={{ color: '#10B981', fontWeight: 800 }}>Entropy = 1.0 (VERIFIED)</span>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// IMAGE 3: ECHOMAP™ DUAL-SIGNAL AUDIO FUSION
// ==========================================
export const GalleryEchoMapAudio: React.FC = () => {
  return (
    <AbsoluteFill style={{
      backgroundColor: '#090B10',
      color: '#F8FAFC',
      fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
      padding: '36px 44px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={badgeStyle('#F5A623', 'rgba(245, 166, 35, 0.15)')}>🔊 ECHOMAP™ AUDIO CORRELATOR</span>
          <h2 style={{ fontSize: '30px', fontWeight: 900, margin: '8px 0 0 0' }}>
            Local VOD Decibel Analysis & Hype Correlator
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={badgeStyle('#00F5D4', 'rgba(0, 245, 212, 0.1)')}>FFMPEG 8kHz MONO PCM</span>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Zero Cloud Audio Upload</div>
        </div>
      </div>

      {/* Main Waveform Display Card */}
      <div style={{ ...cardStyle, flex: 1, margin: '16px 0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '14px', fontWeight: 800 }}>VOD AUDIO SPECTRUM: </span>
            <span style={{ fontSize: '14px', color: '#94A3B8', fontFamily: "'DM Mono', monospace" }}>shroud_finals_game5.mp4 (4.2 GB)</span>
          </div>
          <div style={{ display: 'flex', gap: '16px', fontSize: '12px' }}>
            <span style={{ color: '#64748B' }}>Ambient Noise: <b style={{ color: '#94A3B8' }}>-38.2 dBFS</b></span>
            <span style={{ color: '#00F5D4' }}>Surge Peak: <b style={{ color: '#00F5D4' }}>-19.8 dBFS</b></span>
            <span style={{ color: '#F5A623', fontWeight: 800 }}>ΔdB Spike: +18.4 dB</span>
          </div>
        </div>

        {/* Visual Decibel Waveform */}
        <div style={{
          height: '140px',
          backgroundColor: '#0F1118',
          borderRadius: '10px',
          border: '1px solid rgba(255, 255, 255, 0.06)',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          padding: '0 20px',
          gap: '4px',
          overflow: 'hidden'
        }}>
          {/* Ambient noise bars */}
          {[22, 28, 25, 30, 26, 24, 32, 28, 26, 31, 29, 27, 34, 30, 28, 35, 32, 29].map((h, i) => (
            <div key={`amb1-${i}`} style={{ flex: 1, height: `${h}%`, backgroundColor: '#334155', borderRadius: '2px' }} />
          ))}

          {/* CLUTCH SURGE SPIKE BARS */}
          {[48, 62, 78, 92, 100, 96, 88, 74, 60, 52].map((h, i) => (
            <div key={`spike-${i}`} style={{
              flex: 1,
              height: `${h}%`,
              background: 'linear-gradient(180deg, #00F5D4, #F5A623)',
              borderRadius: '2px',
              boxShadow: '0 0 10px rgba(0, 245, 212, 0.5)'
            }} />
          ))}

          {/* Trailing ambient bars */}
          {[36, 30, 28, 32, 26, 28, 25, 29, 27, 24, 28, 25, 26, 24, 28, 26, 22, 25].map((h, i) => (
            <div key={`amb2-${i}`} style={{ flex: 1, height: `${h}%`, backgroundColor: '#334155', borderRadius: '2px' }} />
          ))}

          {/* Overlay Box for Clutch Moment */}
          <div style={{
            position: 'absolute',
            left: '38%',
            width: '24%',
            height: '100%',
            backgroundColor: 'rgba(0, 245, 212, 0.08)',
            borderLeft: '2px dashed #00F5D4',
            borderRight: '2px dashed #00F5D4',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '8px'
          }}>
            <span style={{ fontSize: '10px', color: '#00F5D4', fontWeight: 800, letterSpacing: '1px' }}>
              AUDIO SURGE WINDOW (+18.4 dB)
            </span>
            <span style={{ fontSize: '10px', color: '#F5A623', fontWeight: 800, textAlign: 'right' }}>
              CHAT HYPE OVERLAP: 100%
            </span>
          </div>
        </div>

        {/* Fusion Equation Visual */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr auto 1fr auto 1fr',
          gap: '12px',
          alignItems: 'center',
          backgroundColor: '#161924',
          padding: '14px 20px',
          borderRadius: '10px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>CHAT SCORE (70%)</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#00F5D4' }}>94.0</div>
          </div>
          <span style={{ fontSize: '18px', color: '#64748B', fontWeight: 800 }}>+</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>AUDIO FIT (30%)</div>
            <div style={{ fontSize: '20px', fontWeight: 900, color: '#F5A623' }}>88.0</div>
          </div>
          <span style={{ fontSize: '18px', color: '#64748B', fontWeight: 800 }}>=</span>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: '#94A3B8', fontWeight: 700 }}>FINAL COMPOSITE RANK</div>
            <div style={{ fontSize: '24px', fontWeight: 900, color: '#FFF' }}>92.2 // RANK #1</div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <span>VOD START OFFSET: 142 SECONDS · AUTOMATIC RESYNC</span>
        <span>NO AUDIENCE TRANSCRIPTS RETAINED · COMPLIANT WITH TWITCH PRIVACY GUIDELINES</span>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// IMAGE 4: CLIP PRODUCTION & EXPORT STATION
// ==========================================
export const GalleryClipExporter: React.FC = () => {
  return (
    <AbsoluteFill style={{
      backgroundColor: '#090B10',
      color: '#F8FAFC',
      fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
      padding: '36px 44px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Top Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={badgeStyle('#10B981', 'rgba(16, 185, 129, 0.15)')}>🎬 CLIP PRODUCTION STATION</span>
          <h2 style={{ fontSize: '30px', fontWeight: 900, margin: '8px 0 0 0' }}>
            Frame-Accurate Local Clip Slicing
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={badgeStyle('#00F5D4', 'rgba(0, 245, 212, 0.1)')}>CREATOR IN CONTROL</span>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>No Autonomous Auto-Posting</div>
        </div>
      </div>

      {/* Main Grid: Video Player + Export Specs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '24px', flex: 1, margin: '18px 0' }}>
        {/* Left: Video Player Mockup */}
        <div style={{
          ...cardStyle,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '0',
          overflow: 'hidden'
        }}>
          {/* Mock Video Viewport */}
          <div style={{
            flex: 1,
            backgroundColor: '#000',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              position: 'absolute',
              top: '14px',
              left: '16px',
              display: 'flex',
              gap: '8px'
            }}>
              <span style={badgeStyle('#EF4444', 'rgba(239, 68, 68, 0.2)')}>● 1080P60 PREVIEW</span>
              <span style={badgeStyle('#FFF', 'rgba(255, 255, 255, 0.1)')}>T+14:20 - 14:35</span>
            </div>

            {/* Simulated Game Crosshair & Action */}
            <div style={{ textAlign: 'center' }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0, 245, 212, 0.2)',
                border: '2px solid #00F5D4',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 12px auto',
                boxShadow: '0 0 30px rgba(0, 245, 212, 0.5)'
              }}>
                <span style={{ color: '#00F5D4', fontSize: '24px' }}>▶</span>
              </div>
              <div style={{ fontSize: '16px', fontWeight: 800, color: '#FFF' }}>CLUTCH 1v4 ACE HIGHLIGHT</div>
              <div style={{ fontSize: '12px', color: '#94A3B8', marginTop: '4px' }}>clip_shroud_20261103_001.mp4</div>
            </div>

            {/* Bottom Player Scrub Bar */}
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '12px 16px',
              background: 'linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8))',
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <span style={{ fontSize: '11px', color: '#00F5D4', fontFamily: "'DM Mono', monospace" }}>00:08.4 / 00:15.0</span>
              <div style={{ flex: 1, height: '4px', backgroundColor: '#334155', borderRadius: '2px', position: 'relative' }}>
                <div style={{ width: '56%', height: '100%', backgroundColor: '#00F5D4' }} />
                <div style={{ position: 'absolute', left: '56%', top: '-4px', width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#FFF' }} />
              </div>
              <span style={{ fontSize: '11px', color: '#94A3B8' }}>🔊 100%</span>
            </div>
          </div>
        </div>

        {/* Right: Export Details & Quick Share */}
        <div style={{ ...cardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '12px', fontWeight: 800, color: '#94A3B8', letterSpacing: '1px' }}>
              LOCAL EXPORT SPECIFICATIONS
            </span>

            <div style={{ marginTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Output Format:</span>
                <span style={{ fontWeight: 800, color: '#FFF' }}>MP4 (H.264 / AAC)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Resolution:</span>
                <span style={{ fontWeight: 800, color: '#FFF' }}>1920 × 1080 (60 fps)</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>Trim Bounds:</span>
                <span style={{ fontWeight: 800, color: '#00F5D4', fontFamily: "'DM Mono', monospace" }}>[00:14:20.00 - 00:14:35.00]</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                <span style={{ color: '#94A3B8' }}>File Path:</span>
                <span style={{ fontWeight: 700, color: '#C084FC', fontFamily: "'DM Mono', monospace" }}>./exports/clutch_001.mp4</span>
              </div>
            </div>
          </div>

          <div>
            <div style={{ fontSize: '12px', color: '#94A3B8', fontWeight: 700, marginBottom: '8px' }}>
              ONE-CLICK DISTRIBUTION
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <div style={{
                backgroundColor: '#1E293B',
                color: '#FFF',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 700
              }}>
                📂 Reveal in Explorer
              </div>
              <div style={{
                background: 'linear-gradient(90deg, #00F5D4, #9146FF)',
                color: '#000',
                padding: '10px',
                borderRadius: '8px',
                textAlign: 'center',
                fontSize: '12px',
                fontWeight: 800
              }}>
                ⚡ Ready to Post
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '12px',
        color: '#64748B'
      }}>
        <span>LOCAL SUBPROCESSING VIA FFMPEG · ZERO LOSSLESS COMPRESSION COMPROMISES</span>
        <span>IDEAL FOR YOUTUBE SHORTS, TIKTOK, TWITCH CLIPS & X HIGHLIGHTS</span>
      </div>
    </AbsoluteFill>
  );
};

// ==========================================
// IMAGE 5: ARCHITECTURE & PRIVACY GUARANTEE
// ==========================================
export const GalleryArchitecture: React.FC = () => {
  return (
    <AbsoluteFill style={{
      backgroundColor: '#090B10',
      color: '#F8FAFC',
      fontFamily: "'Manrope', 'Inter', system-ui, sans-serif",
      padding: '40px 48px',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      position: 'relative'
    }}>
      {/* Top Banner */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={badgeStyle('#9146FF', 'rgba(145, 70, 255, 0.15)')}>🔒 SECURITY & ARCHITECTURE BLUEPRINT</span>
          <h2 style={{ fontSize: '32px', fontWeight: 900, margin: '8px 0 0 0' }}>
            Privacy-First Dual-Signal Architecture
          </h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={badgeStyle('#10B981', 'rgba(16, 185, 129, 0.15)')}>100% LOCAL PROCESSING</span>
          <div style={{ fontSize: '12px', color: '#64748B', marginTop: '4px' }}>Zero Cloud Telemetry</div>
        </div>
      </div>

      {/* 4 Pipeline Stages */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', margin: '20px 0' }}>
        {/* Layer 1 */}
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', color: '#00F5D4', fontWeight: 800 }}>LAYER 01</div>
          <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0' }}>Signal Ingestion</h4>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>
            Read-only public Twitch IRC over WebSocket. Zero account credentials, zero channel mod scopes.
          </p>
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748B', fontFamily: "'DM Mono', monospace" }}>
            irc-ws.chat.twitch.tv
          </div>
        </div>

        {/* Layer 2 */}
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', color: '#C084FC', fontWeight: 800 }}>LAYER 02</div>
          <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0' }}>Heuristic Engine</h4>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>
            15-second rolling FIFO window in memory. Calculates velocity, normalized entropy, and reaction vernacular.
          </p>
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748B', fontFamily: "'DM Mono', monospace" }}>
            45 / 35 / 20 Formula
          </div>
        </div>

        {/* Layer 3 */}
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', color: '#F5A623', fontWeight: 800 }}>LAYER 03</div>
          <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0' }}>EchoMap™ Correlator</h4>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>
            FFmpeg streams mono 8kHz PCM to compute per-second RMS decibels (dBFS) and delta against ambient floor.
          </p>
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748B', fontFamily: "'DM Mono', monospace" }}>
            70% Chat + 30% Audio
          </div>
        </div>

        {/* Layer 4 */}
        <div style={cardStyle}>
          <div style={{ fontSize: '11px', color: '#10B981', fontWeight: 800 }}>LAYER 04</div>
          <h4 style={{ fontSize: '16px', fontWeight: 800, margin: '6px 0' }}>Production Studio</h4>
          <p style={{ fontSize: '12px', color: '#94A3B8', lineHeight: 1.4 }}>
            Creator approves or rejects candidates. FFmpeg trims 1080p clips directly from local VOD with zero re-encoding loss.
          </p>
          <div style={{ marginTop: '10px', fontSize: '11px', color: '#64748B', fontFamily: "'DM Mono', monospace" }}>
            Ready for Shorts & TikTok
          </div>
        </div>
      </div>

      {/* Privacy Guarantee Matrix */}
      <div style={{
        ...cardStyle,
        backgroundColor: '#10121A',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '20px'
      }}>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>🛡️</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>Zero Disk Chat Logs</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Messages purged from RAM after 15s</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>🔒</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>Loopback Isolation</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Strict 127.0.0.1 host checking</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ fontSize: '20px' }}>⚡</span>
          <div>
            <div style={{ fontSize: '13px', fontWeight: 800, color: '#FFF' }}>No AI Scraping</div>
            <div style={{ fontSize: '11px', color: '#94A3B8' }}>Zero third-party model training</div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
