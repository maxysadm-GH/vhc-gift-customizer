import { useState, useRef, useEffect } from 'react';
import type { ComboAsset } from '../data/assetMap';
import { imageLabels } from '../data/assetMap';

interface Props {
  asset: ComboAsset;
  boxColorHex: string;
  foilColorHex: string;
  ribbonColorHex: string;
}

export function VideoGallery({ asset, boxColorHex, foilColorHex, ribbonColorHex }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(!!asset.videoUrl);
  const videoRef = useRef<HTMLVideoElement>(null);

  const genericVideoUrl = `${import.meta.env.BASE_URL}video/box-orbit.mp4`;
  const videoSrc = asset.videoUrl || genericVideoUrl;

  // When combo changes and video is showing, update the video src
  useEffect(() => {
    if (showVideo && videoRef.current) {
      videoRef.current.load();
      videoRef.current.play().catch(() => {});
    }
  }, [videoSrc, showVideo]);

  const handleVideoToggle = () => {
    if (showVideo) {
      setShowVideo(false);
      setActiveIndex(0);
      if (videoRef.current) videoRef.current.pause();
    } else {
      setShowVideo(true);
      setActiveIndex(-1);
      setTimeout(() => videoRef.current?.play(), 100);
    }
  };

  const handleThumbClick = (i: number) => {
    setActiveIndex(i);
    setShowVideo(false);
    if (videoRef.current) videoRef.current.pause();
  };

  return (
    <div>
      {/* Main display area */}
      <div style={{
        border: '1px solid #e5e5e5',
        background: '#fafafa',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: 12,
      }}>
        {/* Combo status badge */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          background: 'rgba(255,255,255,0.95)',
          padding: '6px 12px',
          fontSize: 11,
          fontWeight: 400,
          letterSpacing: 0.5,
          color: asset.status === 'ready' ? '#16a34a' : '#d97706',
          border: `1px solid ${asset.status === 'ready' ? '#bbf7d0' : '#fde68a'}`,
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: '50%',
            background: asset.status === 'ready' ? '#16a34a' : '#d97706',
          }} />
          {asset.status === 'ready' ? 'Asset Ready' : 'Generating...'}
        </div>

        {/* Color combo chips */}
        <div style={{
          position: 'absolute',
          top: 12,
          right: 12,
          zIndex: 2,
          display: 'flex',
          gap: 4,
        }}>
          {[
            { hex: boxColorHex, label: 'Box' },
            { hex: foilColorHex, label: 'Foil' },
            { hex: ribbonColorHex, label: 'Ribbon' },
          ].map(({ hex, label }) => (
            <div
              key={label}
              title={label}
              style={{
                width: 20,
                height: 20,
                background: hex,
                border: isLightColor(hex) ? '1px solid #ccc' : '1px solid transparent',
                boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
              }}
            />
          ))}
        </div>

        {/* Image / Video display */}
        {showVideo ? (
          <video
            ref={videoRef}
            src={videoSrc}
            loop
            muted
            autoPlay
            playsInline
            style={{
              width: '100%',
              display: 'block',
              aspectRatio: '1',
              objectFit: 'cover',
              background: '#000',
            }}
          />
        ) : (
          <img
            src={asset.images[activeIndex] || asset.images[0]}
            alt={imageLabels[activeIndex] || 'Product view'}
            style={{
              width: '100%',
              display: 'block',
            }}
          />
        )}

        {/* Image label */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(transparent, rgba(0,0,0,0.5))',
          padding: '24px 16px 12px',
          color: '#fff',
          fontSize: 12,
          fontWeight: 300,
          letterSpacing: 0.5,
        }}>
          {showVideo
            ? (asset.videoUrl ? '360° Turntable — Per-Combo Render' : '360° Product Rotation')
            : (imageLabels[activeIndex] || 'Product View')}
        </div>
      </div>

      {/* Thumbnail strip */}
      <div style={{
        display: 'flex',
        gap: 8,
      }}>
        {/* Video thumbnail (first position for video-first) */}
        <button
          type="button"
          onClick={handleVideoToggle}
          style={{
            flex: 1,
            padding: 0,
            border: showVideo ? '2px solid #38165f' : '1px solid #e5e5e5',
            background: '#1a1a1a',
            cursor: 'pointer',
            overflow: 'hidden',
            aspectRatio: '1',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'border-color 0.15s',
          }}
        >
          {/* Play icon */}
          <div style={{
            width: 0,
            height: 0,
            borderLeft: '12px solid #fff',
            borderTop: '8px solid transparent',
            borderBottom: '8px solid transparent',
            marginLeft: 3,
          }} />
          <div style={{
            position: 'absolute',
            bottom: 4,
            left: 0,
            right: 0,
            textAlign: 'center',
            color: '#fff',
            fontSize: 9,
            fontWeight: 300,
            letterSpacing: 0.5,
          }}>
            360°
          </div>
        </button>

        {/* Photo thumbnails */}
        {asset.images.map((url, i) => (
          <button
            key={i}
            type="button"
            onClick={() => handleThumbClick(i)}
            style={{
              flex: 1,
              padding: 0,
              border: (!showVideo && activeIndex === i) ? '2px solid #38165f' : '1px solid #e5e5e5',
              background: '#fafafa',
              cursor: 'pointer',
              overflow: 'hidden',
              aspectRatio: '1',
              transition: 'border-color 0.15s',
            }}
          >
            <img
              src={url}
              alt={imageLabels[i] || `View ${i + 1}`}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                display: 'block',
                opacity: (!showVideo && activeIndex === i) ? 1 : 0.7,
                transition: 'opacity 0.15s',
              }}
            />
          </button>
        ))}
      </div>

      {/* Combo key info */}
      <div style={{
        marginTop: 12,
        padding: '10px 14px',
        background: '#f8f8f8',
        border: '1px solid #e5e5e5',
        fontSize: 11,
        color: '#999',
        fontFamily: "'Roboto Mono', monospace",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>Combo: {asset.comboKey}</span>
        <span style={{ fontSize: 10, color: '#bbb' }}>TC-VEG-009</span>
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
