import React from 'react';
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';

export const HeuristicEngine: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const scoreProgress = interpolate(frame, [30, 90], [0, 84.5], { extrapolateRight: 'clamp' });
  const velocityWidth = interpolate(frame, [15, 60], [0, 92], { extrapolateRight: 'clamp' });
  const diversityWidth = interpolate(frame, [25, 70], [0, 85], { extrapolateRight: 'clamp' });
  const reactionsWidth = interpolate(frame, [35, 80], [0, 75], { extrapolateRight: 'clamp' });

  return (
    <AbsoluteFill style={{
      backgroundColor: '#0A0F1D',
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
            backgroundColor: 'rgba(0, 245, 212, 0.15)',
            border: '1px solid #00F5D4',
            color: '#00F5D4',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '8px',
            fontSize: '14px',
            letterSpacing: '1px'
          }}>ALGORITHM DEEP-DIVE</span>
          <span style={{ color: '#64748B', fontSize: '16px' }}>// SCORING ENGINE</span>
        </div>
        <span style={{ color: '#F59E0B', fontWeight: 600, fontSize: '16px', letterSpacing: '1px' }}>● 15s ROLLING WINDOW</span>
      </div>

      {/* Main Grid: Equation & Live Meters */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '50px', alignItems: 'center' }}>
        {/* Left: The Mathematical Transparency */}
        <div>
          <h2 style={{ fontSize: '50px', fontWeight: 800, margin: '0 0 16px 0', letterSpacing: '-1px' }}>
            Transparent scoring.<br />
            <span style={{ color: '#00F5D4' }}>Zero black-box hallucinations.</span>
          </h2>
          <p style={{ fontSize: '20px', color: '#94A3B8', margin: '0 0 28px 0', lineHeight: 1.5 }}>
            Every flagged moment shows the exact breakdown of chat energy.
            No mysterious AI claims — just pure, deterministic telemetry.
          </p>

          {/* Formula Display Box */}
          <div style={{
            backgroundColor: '#0F172A',
            border: '1px solid rgba(0, 245, 212, 0.3)',
            borderRadius: '16px',
            padding: '24px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '17px',
            lineHeight: 1.6,
            color: '#E2E8F0',
            boxShadow: '0 10px 30px rgba(0,0,0,0.5)'
          }}>
            <div style={{ color: '#64748B', fontSize: '13px', marginBottom: '8px' }}>// DETERMINISTIC COMPOSITE INDEX</div>
            <div>Score = 100 × (</div>
            <div style={{ paddingLeft: '24px', color: '#38BDF8' }}>0.45 × ChatVelocity +</div>
            <div style={{ paddingLeft: '24px', color: '#A855F7' }}>0.35 × ChatterDiversity +</div>
            <div style={{ paddingLeft: '24px', color: '#F59E0B' }}>0.20 × ReactionDensity</div>
            <div>)</div>
          </div>

          {/* Anti-Spam Gate Chips */}
          <div style={{ display: 'flex', gap: '14px', marginTop: '20px' }}>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', fontSize: '14px' }}>
              🛡️ <b>Anti-Spam Gate:</b> Min 5 messages
            </div>
            <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 16px', fontSize: '14px' }}>
              👥 <b>Diversity Gate:</b> Min 3 distinct users
            </div>
          </div>
        </div>

        {/* Right: Live Telemetry Gauges */}
        <div style={{
          backgroundColor: '#0F172A',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '24px',
          padding: '36px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.6)'
        }}>
          {/* Main Score Output */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'baseline',
            borderBottom: '1px solid #1E293B',
            paddingBottom: '20px'
          }}>
            <div>
              <span style={{ color: '#64748B', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px' }}>CANDIDATE MOMENT SCORE</span>
              <div style={{ fontSize: '15px', color: '#00F5D4', fontWeight: 600, marginTop: '4px' }}>THRESHOLD MET (≥ 58.0)</div>
            </div>
            <div style={{ fontSize: '64px', fontWeight: 900, color: '#00F5D4', fontFamily: 'DM Mono, monospace' }}>
              {scoreProgress.toFixed(1)}
            </div>
          </div>

          {/* Meter 1: Velocity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8' }}>🚀 Chat Velocity (45% weight)</span>
              <span style={{ color: '#38BDF8', fontWeight: 700 }}>11 msgs / 15s</span>
            </div>
            <div style={{ height: '12px', backgroundColor: '#1E293B', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${velocityWidth}%`, backgroundColor: '#38BDF8', borderRadius: '6px' }} />
            </div>
          </div>

          {/* Meter 2: Diversity */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8' }}>👥 Unique Chatter Ratio (35% weight)</span>
              <span style={{ color: '#A855F7', fontWeight: 700 }}>7 distinct chatters</span>
            </div>
            <div style={{ height: '12px', backgroundColor: '#1E293B', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${diversityWidth}%`, backgroundColor: '#A855F7', borderRadius: '6px' }} />
            </div>
          </div>

          {/* Meter 3: Reactions */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', marginBottom: '8px' }}>
              <span style={{ color: '#94A3B8' }}>🔥 Reaction Cue Density (20% weight)</span>
              <span style={{ color: '#F59E0B', fontWeight: 700 }}>pog, clutch, kekw</span>
            </div>
            <div style={{ height: '12px', backgroundColor: '#1E293B', borderRadius: '6px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${reactionsWidth}%`, backgroundColor: '#F59E0B', borderRadius: '6px' }} />
            </div>
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
        <span>VOXCLUTCH RADAR // PART 03</span>
        <span>AUDITABLE TELEMETRY · COOLDOWN BOUNDED</span>
      </div>
    </AbsoluteFill>
  );
};
