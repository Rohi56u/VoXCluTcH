import React from 'react';
import { Audio, Sequence, staticFile } from 'remotion';
import { HookProblem } from './scenes/HookProblem';
import { RadarReveal } from './scenes/RadarReveal';
import { UIWalkthrough } from './scenes/UIWalkthrough';
import { EchoMapAudio } from './scenes/EchoMapAudio';
import { ClipWorkstation } from './scenes/ClipWorkstation';
import { OutroCTA } from './scenes/OutroCTA';

export const MainVideo: React.FC = () => {
  // Sequence timing (at 30 fps) based on voiceover audio lengths
  const S1_DURATION = 460;  // 15.3s
  const S2_DURATION = 450;  // 15.0s
  const S3_DURATION = 670;  // 22.3s (Full UI Walkthrough)
  const S4_DURATION = 610;  // 20.3s (EchoMap Radar)
  const S5_DURATION = 450;  // 15.0s (Clip Generator)
  const S6_DURATION = 380;  // 12.7s (Outro & GitHub CTA)

  const S1_START = 0;
  const S2_START = S1_START + S1_DURATION;
  const S3_START = S2_START + S2_DURATION;
  const S4_START = S3_START + S3_DURATION;
  const S5_START = S4_START + S4_DURATION;
  const S6_START = S5_START + S5_DURATION;

  return (
    <>
      {/* ========================================================
          SCENE 1: The Live Streamer's Dilemma (0 - 15.3s)
         ======================================================== */}
      <Sequence from={S1_START} durationInFrames={S1_DURATION}>
        <HookProblem />
        <Audio src={staticFile('audio/scene1_problem.mp3')} volume={1.0} />
      </Sequence>

      {/* ========================================================
          SCENE 2: Meet VoxClutch Architecture & Radar (15.3 - 30.3s)
         ======================================================== */}
      <Sequence from={S2_START} durationInFrames={S2_DURATION}>
        <RadarReveal />
        <Audio src={staticFile('audio/scene2_intro.mp3')} volume={1.0} />
      </Sequence>

      {/* ========================================================
          SCENE 3: Studio UI Walkthrough & Demo Burst (30.3 - 52.6s)
         ======================================================== */}
      <Sequence from={S3_START} durationInFrames={S3_DURATION}>
        <UIWalkthrough />
        <Audio src={staticFile('audio/scene3_ui_walkthrough.mp3')} volume={1.0} />
      </Sequence>

      {/* ========================================================
          SCENE 4: EchoMap Audio-Energy Corroboration (52.6 - 73.0s)
         ======================================================== */}
      <Sequence from={S4_START} durationInFrames={S4_DURATION}>
        <EchoMapAudio />
        <Audio src={staticFile('audio/scene4_echomap.mp3')} volume={1.0} />
      </Sequence>

      {/* ========================================================
          SCENE 5: Creator Control & 1-Click Clip Exporter (73.0 - 88.0s)
         ======================================================== */}
      <Sequence from={S5_START} durationInFrames={S5_DURATION}>
        <ClipWorkstation />
        <Audio src={staticFile('audio/scene5_clip.mp3')} volume={1.0} />
      </Sequence>

      {/* ========================================================
          SCENE 6: Outro, Open Source & GitHub Star CTA (88.0 - 100.7s)
         ======================================================== */}
      <Sequence from={S6_START} durationInFrames={S6_DURATION}>
        <OutroCTA />
        <Audio src={staticFile('audio/scene6_outro.mp3')} volume={1.0} />
      </Sequence>
    </>
  );
};
