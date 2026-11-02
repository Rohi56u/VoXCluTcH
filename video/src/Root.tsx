import React from 'react';
import { Composition } from 'remotion';
import { MainVideo } from './MainVideo';
import { DevpostThumbnail } from './Thumbnail';

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
    </>
  );
};

