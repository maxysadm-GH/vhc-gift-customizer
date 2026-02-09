import type { CSSProperties } from 'react';

interface Box3DProps {
  boxColor: string;
  foilColor: string;
  ribbonColor: string;
  size?: number;
}

export function Box3D({ boxColor, foilColor, ribbonColor, size = 200 }: Box3DProps) {
  const half = size / 2;
  const depth = size * 0.6;
  const halfDepth = depth / 2;

  const scene: CSSProperties = {
    width: size,
    height: size,
    perspective: size * 3,
    margin: '0 auto',
  };

  const cube: CSSProperties = {
    width: size,
    height: size,
    position: 'relative',
    transformStyle: 'preserve-3d',
    animation: 'boxSpin 10s linear infinite',
    transform: 'rotateX(-15deg) rotateY(-30deg)',
  };

  const face: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    backfaceVisibility: 'hidden',
  };

  // Determine if box color is light for contrast
  const isLight = isLightColor(boxColor);
  const textColor = isLight ? '#333' : '#fff';

  return (
    <div style={scene}>
      <style>{`
        @keyframes boxSpin {
          from { transform: rotateX(-15deg) rotateY(0deg); }
          to { transform: rotateX(-15deg) rotateY(360deg); }
        }
        .vhc-box-cube:hover {
          animation-play-state: paused !important;
        }
      `}</style>
      <div className="vhc-box-cube" style={cube}>
        {/* Front face */}
        <div style={{
          ...face,
          background: boxColor,
          transform: `translateZ(${halfDepth}px)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          border: isLight ? '1px solid #ddd' : 'none',
        }}>
          {/* Ribbon strip */}
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: size * 0.08,
            background: ribbonColor,
            transform: 'translateY(-50%)',
            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
          }} />
          {/* Brand text */}
          <div style={{
            fontSize: size * 0.055,
            fontWeight: 300,
            letterSpacing: 3,
            textTransform: 'uppercase',
            color: textColor,
            opacity: 0.7,
            position: 'relative',
            zIndex: 1,
            marginTop: size * -0.2,
          }}>
            Vosges
          </div>
        </div>

        {/* Back face */}
        <div style={{
          ...face,
          background: boxColor,
          transform: `rotateY(180deg) translateZ(${halfDepth}px)`,
          border: isLight ? '1px solid #ddd' : 'none',
        }} />

        {/* Right face */}
        <div style={{
          ...face,
          width: depth,
          background: boxColor,
          transform: `rotateY(90deg) translateZ(${half}px)`,
          left: (size - depth) / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isLight ? '1px solid #ddd' : 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: size * 0.08,
            background: ribbonColor,
            transform: 'translateY(-50%)',
          }} />
        </div>

        {/* Left face */}
        <div style={{
          ...face,
          width: depth,
          background: boxColor,
          transform: `rotateY(-90deg) translateZ(${half}px)`,
          left: (size - depth) / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isLight ? '1px solid #ddd' : 'none',
        }}>
          <div style={{
            position: 'absolute',
            top: '50%',
            left: 0,
            right: 0,
            height: size * 0.08,
            background: ribbonColor,
            transform: 'translateY(-50%)',
          }} />
        </div>

        {/* Top / Lid face with foil */}
        <div style={{
          ...face,
          height: depth,
          background: boxColor,
          transform: `rotateX(90deg) translateZ(${half}px)`,
          top: (size - depth) / 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: isLight ? '1px solid #ddd' : 'none',
        }}>
          {/* Foil logo area */}
          <div style={{
            width: size * 0.4,
            height: depth * 0.35,
            background: foilColor,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: size * 0.04,
            fontWeight: 300,
            letterSpacing: 2,
            textTransform: 'uppercase',
            color: isLightColor(foilColor) ? '#333' : '#fff',
            boxShadow: `0 0 ${size * 0.05}px ${foilColor}44`,
          }}>
            LOGO
          </div>
          {/* Ribbon cross on lid */}
          <div style={{
            position: 'absolute',
            top: 0,
            bottom: 0,
            left: '50%',
            width: size * 0.08,
            background: ribbonColor,
            transform: 'translateX(-50%)',
            opacity: 0.9,
          }} />
        </div>

        {/* Bottom face */}
        <div style={{
          ...face,
          height: depth,
          background: boxColor,
          transform: `rotateX(-90deg) translateZ(${half}px)`,
          top: (size - depth) / 2,
          border: isLight ? '1px solid #ddd' : 'none',
        }} />
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const c = hex.replace('#', '');
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 155;
}
