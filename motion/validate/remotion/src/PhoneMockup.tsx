import React, { CSSProperties } from 'react';
import { DEVICE, OUTER, PALETTE, THICKNESS } from './devices';

export type PhoneMockupProps = {
  screen: string;
  rotateX?: number;
  rotateY?: number;
  rotateZ?: number;
  perspective?: number;
  depth?: number;
  scale?: number;
  reflection?: number;
  shine?: number;
  shadow?: boolean;
};

const vars = (value: Record<string, string | number>) => value as unknown as CSSProperties;

export const PhoneMockup: React.FC<PhoneMockupProps> = ({
  screen,
  rotateX = 6,
  rotateY = -24,
  rotateZ = -1.5,
  perspective = 1800,
  depth = THICKNESS,
  scale = 1,
  reflection = 0.55,
  shine = 0,
  shadow = true,
}) => {
  const f = DEVICE.frame;
  const hb = DEVICE.homeButton;
  const dep = Math.max(8, Math.min(96, Math.round(depth)));
  const rigW = Math.round(OUTER.w * scale + dep * Math.abs(Math.sin((rotateY * Math.PI) / 180)) + 40);
  const rigH = Math.round(OUTER.h * scale * 1.02 + 24);
  const deviceStyle = vars({
    '--w': `${DEVICE.logical.w}px`,
    '--h': `${DEVICE.logical.h}px`,
    '--side': `${f.side}px`,
    '--top': `${f.top}px`,
    '--bottom': `${f.bottom}px`,
    '--rim': `${f.rim || 4}px`,
    '--r': `${f.radius}px`,
    '--sr': `${DEVICE.displayRadius}px`,
    '--band1': PALETTE.a,
    '--band2': PALETTE.b,
    '--band3': PALETTE.c,
    '--band4': PALETTE.d,
    '--gloss': `${reflection}`,
  });
  const poseStyle = vars({
    width: OUTER.w,
    height: OUTER.h,
    '--depth': `${dep}px`,
    transform: `scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
  });
  const shineX = -140 + shine * 280;
  return (
    <div className="rig3d" style={{ width: rigW, height: rigH, perspective }}>
      {shadow ? (
        <i
          className="shadow3d"
          style={{
            width: Math.round(OUTER.w * scale * 0.92),
            height: Math.round(OUTER.h * scale * 0.16),
            transform: `translateX(${rotateY < 0 ? -58 : -42}%)`,
          }}
        />
      ) : null}
      <div className="motionRot">
        <div className="pose3d" style={poseStyle}>
          <div className="stack3d">
            <i className="slab3d back" style={{ transform: `translateZ(${-dep}px)` }} />
          </div>
          <i className="side3d left" />
          <i className="side3d right" />
          <i className="side3d top" />
          <i className="side3d bottom" />
          <div className={`device finish-${PALETTE.finish || 'satin'}`} style={deviceStyle}>
            <i className="bezel" />
            <div className="screen">
              <img src={screen} alt="" />
              <i
                className="shine3d"
                style={{
                  transform: `translateX(${shineX}%)`,
                  opacity: shine > 0 && shine < 1 ? 0.9 : 0,
                }}
              />
            </div>
            <i className="gloss" />
            {DEVICE.dynamicIsland ? (
              <i
                className="island"
                style={{
                  width: DEVICE.dynamicIsland.w,
                  height: DEVICE.dynamicIsland.h,
                  top: f.top + DEVICE.dynamicIsland.top,
                }}
              />
            ) : null}
            {DEVICE.punchHole ? (
              <i
                className="punch"
                style={{
                  width: DEVICE.punchHole.d,
                  height: DEVICE.punchHole.d,
                  top: f.top + DEVICE.punchHole.top,
                }}
              />
            ) : null}
            {DEVICE.homeIndicator ? <i className="homebar" style={{ bottom: f.bottom + 8 }} /> : null}
            {hb ? (
              <>
                <i className="homebtn" style={{ width: hb.d, height: hb.d, bottom: hb.bottom }} />
                <i className="earpiece" style={{ top: Math.round(f.top * 0.36) }} />
                <i
                  className="frontcam"
                  style={{ top: Math.round(f.top * 0.33), left: 'calc(50% - 30px)', transform: 'none' }}
                />
              </>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
