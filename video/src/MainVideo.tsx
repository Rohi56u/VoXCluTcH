import React from 'react';
import { Sequence } from 'remotion';
import { HookProblem } from './scenes/HookProblem';
import { RadarReveal } from './scenes/RadarReveal';
import { HeuristicEngine } from './scenes/HeuristicEngine';
import { EchoMapAudio } from './scenes/EchoMapAudio';
import { ClipWorkstation } from './scenes/ClipWorkstation';
import { OutroCTA } from './scenes/OutroCTA';

export const MainVideo: React.FC = () => {
  return (
    <>
      {/* Scene 1: The Live Streamer's Dilemma (0 - 8s) */}
      <Sequence from={0} durationInFrames={240}>
        <HookProblem />
      </Sequence>

      {/* Scene 2: Meet VoxClutch & Architecture (8s - 17s) */}
      <Sequence from={240} durationInFrames={270}>
        <RadarReveal />
      </Sequence>

      {/* Scene 3: Deterministic Scoring Engine (17s - 27s) */}
      <Sequence from={510} durationInFrames={300}>
        <HeuristicEngine />
      </Sequence>

      {/* Scene 4: EchoMap Audio-Energy Corroboration (27s - 38s) */}
      <Sequence from={810} durationInFrames={330}>
        <EchoMapAudio />
      </Sequence>

      {/* Scene 5: Creator Control & 1-Click Clip Exporter (38s - 48s) */}
      <Sequence from={1140} durationInFrames={300}>
        <ClipWorkstation />
      </Sequence>

      {/* Scene 6: Outro, Open Source & Star CTA (48s - 55s) */}
      <Sequence from={1440} durationInFrames={210}>
        <OutroCTA />
      </Sequence>
    </>
  );
};
