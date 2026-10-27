import React from 'react';
import { AbsoluteFill, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from 'remotion';
import { PhoneMockup } from './PhoneMockup';
import { MOTION, STAGE } from './devices';
import { BG, DEVICE_CSS, GRAIN, INK } from './styles';

export type PhoneSceneProps = {
  caption?: string;
  subtitle?: string;
};

// One temporal sample of the phone. `lag` samples the motion that many frames
// earlier, so stacking several copies reproduces a real shutter's motion blur:
// strongest while the phone turns, gone once it settles (all samples equal).
const PhoneLayer: React.FC<{ lag: number; first: boolean }> = ({ lag, first }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const f = frame - lag;
  const enter = spring({
    frame: Math.max(0, f - 6),
    fps,
    config: { damping: 200, stiffness: 80, mass: 0.9 },
  });
  const phoneOpacity = interpolate(enter, [0, 1], [0, 1]);
  const phoneY = interpolate(enter, [0, 1], [120, 0]);
  const floatY = Math.sin((f / fps) * 1.3) * 10;
  const turnOffset = (1 - enter) * -MOTION.turn;
  const rotateY = MOTION.base.rotateY + turnOffset + Math.sin((f / fps) * 0.8) * MOTION.sway;
  const rotateX = MOTION.base.rotateX + Math.cos((f / fps) * 0.7) * 1.4;
  const shineRaw = interpolate(f, [Math.round(fps * 1.4), Math.round(fps * 2.6)], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const shine = first ? shineRaw : 0;
  return (
    <div style={{ opacity: phoneOpacity, transform: `translateY(${phoneY + floatY}px)` }}>
      <PhoneMockup
        screen={staticFile('screen.png')}
        scale={STAGE.scale}
        depth={STAGE.depth}
        rotateX={rotateX}
        rotateY={rotateY}
        rotateZ={MOTION.base.rotateZ}
        shine={shine}
        shadow={first}
      />
    </div>
  );
};

export const PhoneScene: React.FC<PhoneSceneProps> = ({
  caption = "Motion, rendered.",
  subtitle = "Rotation, fluid easing and real motion blur.",
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const captionIn = spring({
    frame: Math.max(0, frame - 4),
    fps,
    config: { damping: 200, stiffness: 90 },
  });
  const captionY = interpolate(captionIn, [0, 1], [46, 0]);
  const subIn = spring({
    frame: Math.max(0, frame - 12),
    fps,
    config: { damping: 200, stiffness: 90 },
  });
  const subY = interpolate(subIn, [0, 1], [30, 0]);
  const bgScale = interpolate(frame, [0, Math.round(fps * 1.2)], [1.06, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        backgroundColor: '#05060a',
        color: INK,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "Helvetica Neue", Inter, Arial, sans-serif',
        WebkitFontSmoothing: 'antialiased',
      }}
    >
      <style>{DEVICE_CSS}</style>
      <div
        style={{
          position: 'absolute',
          inset: '-4%',
          background: BG,
          transform: `scale(${bgScale})`,
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: GRAIN,
          opacity: 0.045,
          mixBlendMode: 'overlay',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: STAGE.padding,
          top: STAGE.padding,
          maxWidth: STAGE.width - STAGE.padding * 2,
        }}
      >
        {caption ? (
          <h1
            style={{
              fontSize: STAGE.titleSize,
              lineHeight: 1.03,
              letterSpacing: STAGE.titleSize * -0.028,
              margin: 0,
              marginBottom: subtitle ? STAGE.subSize * 0.75 : 0,
              fontWeight: 700,
              opacity: captionIn,
              transform: `translateY(${captionY}px)`,
            }}
          >
            {caption}
          </h1>
        ) : null}
        {subtitle ? (
          <p
            style={{
              fontSize: STAGE.subSize,
              lineHeight: 1.35,
              letterSpacing: STAGE.subSize * -0.01,
              margin: 0,
              fontWeight: 400,
              opacity: 0.62 * subIn,
              transform: `translateY(${subY}px)`,
            }}
          >
            {subtitle}
          </p>
        ) : null}
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: STAGE.stageTop,
          height: STAGE.stageHeight,
        }}
      >
        {Array.from({ length: MOTION.blurLayers }).map((_, i) => {
          const opacity =
            MOTION.blurLayers === 1
              ? 1
              : 1 - (1 - MOTION.trailOpacity) * (i / (MOTION.blurLayers - 1));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity,
              }}
            >
              <PhoneLayer lag={i * MOTION.blurLag} first={i === 0} />
            </div>
          );
        })}
      </div>
    </AbsoluteFill>
  );
};
