import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';
import { DevpostThumbnail } from './Thumbnail';
import {
  GalleryStudioDashboard,
  GalleryHeuristicEngine,
  GalleryEchoMapAudio,
  GalleryClipExporter,
  GalleryArchitecture
} from './GalleryScreenshots';

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="VoxClutchExplainer"
        component={MainVideo}
        durationInFrames={3020}
        fps={30}
        width={1920}
        height={1080}
      />
      <Composition
        id="DevpostThumbnail"
        component={DevpostThumbnail}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={800}
      />
      <Composition
        id="GalleryStudioDashboard"
        component={GalleryStudioDashboard}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={800}
      />
      <Composition
        id="GalleryHeuristicEngine"
        component={GalleryHeuristicEngine}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={800}
      />
      <Composition
        id="GalleryEchoMapAudio"
        component={GalleryEchoMapAudio}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={800}
      />
      <Composition
        id="GalleryClipExporter"
        component={GalleryClipExporter}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={800}
      />
      <Composition
        id="GalleryArchitecture"
        component={GalleryArchitecture}
        durationInFrames={1}
        fps={30}
        width={1200}
        height={800}
      />
    </>
  );
};

