import React from 'react';
import { Composition } from 'remotion';
import { PhoneScene } from './PhoneScene';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="PhonePromo"
    component={PhoneScene}
    durationInFrames={150}
    fps={30}
    width={1080}
    height={1350}
    defaultProps={{ caption: "Motion, rendered.", subtitle: "Rotation, fluid easing and real motion blur." }}
  />
);
