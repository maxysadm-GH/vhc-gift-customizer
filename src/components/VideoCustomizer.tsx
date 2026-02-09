import type { Dispatch } from 'react';
import { useState } from 'react';
import { VideoGallery } from './VideoGallery';
import { ColorSwatchPicker } from './ColorSwatchPicker';
import { FontPicker } from './FontPicker';
import { MarqueeCardPicker } from './MarqueeCardPicker';
import { HangTagPicker } from './HangTagPicker';
import type { CustomizerState, CustomizerAction } from '../data/customization';
import { boxColors, foilColors, ribbonColors, fontOptions } from '../data/customization';
import { buildComboKey } from '../data/assetMap';
import { useAssetMap } from '../hooks/useAssetMap';
import { generatePreview } from '../api/customize';

interface Props {
  state: CustomizerState;
  dispatch: Dispatch<CustomizerAction>;
  previewImages: string[];
  setPreviewImages: (imgs: string[]) => void;
  previewMessage: string;
  setPreviewMessage: (msg: string) => void;
}

export function VideoCustomizer({ state, dispatch, setPreviewImages, setPreviewMessage }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { getCombo } = useAssetMap();

  const comboKey = buildComboKey(state.boxColor.name, state.foilColor.name, state.ribbonColor.name);
  const asset = getCombo(comboKey);

  const handleGeneratePreview = async () => {
    setError('');
    if (state.quantity < (state.level === 'signature' ? 1000 : 50)) {
      setError(`Minimum quantity is ${state.level === 'signature' ? '1,000' : '50'} units.`);
      return;
    }

    setLoading(true);
    try {
      const result = await generatePreview({
        logo_url: state.logoUrl || '',
        company_name: state.companyName,
        box_color: state.boxColor.name,
        foil_color: state.foilColor.name,
        ribbon_color: state.ribbonColor.name,
        email: state.email,
        quantity: state.quantity,
        level: state.level,
        font: state.font.name,
        marquee_style: state.marqueeStyle,
        hang_tag_style: state.hangTagStyle,
        message: state.message,
      });

      if (result.success && result.preview_images) {
        setPreviewImages(result.preview_images);
        setPreviewMessage(result.message || 'Here\'s how your corporate gift will look.');
        dispatch({ type: 'SET_PREVIEW', payload: { images: result.preview_images, message: result.message || '' } });
      } else {
        setError(result.message || 'Failed to generate preview.');
      }
    } catch {
      setError('Failed to generate preview. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{
        maxWidth: 500,
        margin: '0 auto',
        padding: '120px 24px',
        textAlign: 'center',
      }}>
        <div style={{
          width: 48,
          height: 48,
          border: '3px solid #e5e5e5',
          borderTopColor: '#38165f',
          borderRadius: '50%',
          margin: '0 auto 24px',
          animation: 'spin 1s linear infinite',
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ fontSize: 18, fontWeight: 300, color: '#333' }}>Generating your preview...</p>
        <p style={{ fontSize: 14, color: '#999', marginTop: 8 }}>This will take just a moment</p>
      </div>
    );
  }

  return (
    <div>
      {/* Step indicator */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px 24px 0',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <div style={{ fontSize: 13, color: '#999' }}>
          <a
            href="#"
            onClick={(e) => { e.preventDefault(); dispatch({ type: 'SET_STEP', payload: 'onboarding' }); }}
            style={{ color: '#999', textDecoration: 'none' }}
          >
            Corporate Gifts
          </a>
          <span style={{ margin: '0 8px' }}>/</span>
          <span style={{ color: '#333' }}>Customize</span>
        </div>
        <div style={{
          fontSize: 12,
          letterSpacing: 2,
          textTransform: 'uppercase',
          color: '#999',
        }}>
          Step 2 of 3
        </div>
      </div>

      {/* Product detail layout */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px 24px 64px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        alignItems: 'start',
      }}>
        {/* Left: Video Gallery */}
        <div style={{ position: 'sticky', top: 100 }}>
          <VideoGallery
            asset={asset}
            boxColorHex={state.boxColor.hex}
            foilColorHex={state.foilColor.hex}
            ribbonColorHex={state.ribbonColor.hex}
          />
        </div>

        {/* Right: Options */}
        <div>
          {/* Product header */}
          <h1 style={{
            fontSize: 24,
            fontWeight: 300,
            color: '#333',
            marginBottom: 4,
          }}>
            9-Piece Vegan Truffle Collection
          </h1>
          <p style={{ color: '#666', fontSize: 14, marginBottom: 4 }}>
            72% cacao dark chocolate with early-harvest olive oil
          </p>
          <p style={{ fontSize: 18, fontWeight: 400, color: '#333', marginBottom: 4 }}>
            $38.00 <span style={{ fontSize: 13, color: '#999', fontWeight: 300 }}>per box</span>
          </p>
          <p style={{ fontSize: 13, color: '#999', marginBottom: 8 }}>
            Forest Raspberry Rose, Tahitian Orchid Vanilla, Sicilian Blood Orange
          </p>

          {/* Session info */}
          {state.companyName && (
            <div style={{
              padding: '10px 14px',
              background: '#f8f5ff',
              border: '1px solid #e5ddf0',
              fontSize: 13,
              color: '#666',
              marginBottom: 16,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
              <span>Customizing for <strong style={{ color: '#333' }}>{state.companyName}</strong></span>
              {state.logoPreviewUrl && (
                <img src={state.logoPreviewUrl} alt="Logo" style={{ height: 24, objectFit: 'contain' }} />
              )}
            </div>
          )}

          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', marginBottom: 24 }} />

          {error && (
            <div style={{
              background: '#fff5f5',
              border: '1px solid #fecaca',
              color: '#dc2626',
              padding: '12px 16px',
              fontSize: 14,
              marginBottom: 20,
            }}>
              {error}
            </div>
          )}

          {/* Level Toggle */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Customization Level</label>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {(['duet', 'signature'] as const).map((level) => {
                const isSelected = state.level === level;
                return (
                  <button
                    key={level}
                    type="button"
                    onClick={() => dispatch({ type: 'SET_LEVEL', payload: level })}
                    style={{
                      padding: '16px',
                      border: isSelected ? '2px solid #38165f' : '1px solid #e5e5e5',
                      borderRadius: 0,
                      background: isSelected ? '#f8f5ff' : '#fff',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                  >
                    <div style={{ fontSize: 14, fontWeight: 400, color: '#333', marginBottom: 4, textTransform: 'capitalize' }}>
                      {level} Collection
                    </div>
                    <div style={{ fontSize: 12, color: '#999' }}>
                      {level === 'duet'
                        ? 'Dual-branded — Min 50 units'
                        : 'Single-branded — Min 1,000 units'}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Colors */}
          <ColorSwatchPicker
            label="Box Color"
            options={boxColors}
            selected={state.boxColor}
            onChange={(c) => dispatch({ type: 'SET_BOX_COLOR', payload: c })}
          />
          <ColorSwatchPicker
            label="Foil Color"
            options={foilColors}
            selected={state.foilColor}
            onChange={(c) => dispatch({ type: 'SET_FOIL_COLOR', payload: c })}
          />
          <ColorSwatchPicker
            label="Ribbon Color"
            options={ribbonColors}
            selected={state.ribbonColor}
            onChange={(c) => dispatch({ type: 'SET_RIBBON_COLOR', payload: c })}
          />

          {/* Marquee Card */}
          <MarqueeCardPicker
            selected={state.marqueeStyle}
            onChange={(s) => dispatch({ type: 'SET_MARQUEE_STYLE', payload: s })}
            font={state.font}
            boxColor={state.boxColor.hex}
            companyName={state.companyName}
          />

          {/* Hang Tag */}
          <HangTagPicker
            selected={state.hangTagStyle}
            onChange={(s) => dispatch({ type: 'SET_HANG_TAG_STYLE', payload: s })}
            font={state.font}
            boxColor={state.boxColor.hex}
            companyName={state.companyName}
          />

          {/* Font */}
          <FontPicker
            options={fontOptions}
            selected={state.font}
            onChange={(f) => dispatch({ type: 'SET_FONT', payload: f })}
            companyName={state.companyName}
          />

          <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', marginBottom: 24 }} />

          {/* Quantity */}
          <div style={{ marginBottom: 20 }}>
            <label style={labelStyle}>Quantity *</label>
            <input
              type="number"
              value={state.quantity || ''}
              min={state.level === 'signature' ? 1000 : 50}
              onChange={(e) => dispatch({ type: 'SET_QUANTITY', payload: parseInt(e.target.value) || 0 })}
              placeholder={state.level === 'signature' ? 'Min 1,000 units' : 'Min 50 units'}
              style={inputStyle}
            />
          </div>

          {/* Message */}
          <div style={{ marginBottom: 28 }}>
            <label style={labelStyle}>Message for Card (Optional)</label>
            <textarea
              value={state.message}
              onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'message', value: e.target.value } })}
              placeholder="100 words max for card personalization"
              maxLength={700}
              rows={3}
              style={{ ...inputStyle, resize: 'vertical' }}
            />
          </div>

          {/* Generate Preview */}
          <button
            type="button"
            onClick={handleGeneratePreview}
            style={{
              width: '100%',
              padding: '16px',
              background: '#38165f',
              color: '#fff',
              border: 'none',
              borderRadius: 0,
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: 1.5,
              textTransform: 'uppercase',
              cursor: 'pointer',
              fontFamily: "'Roboto', sans-serif",
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#4a2070'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#38165f'; }}
          >
            Generate Custom Preview
          </button>
        </div>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: 13,
  fontWeight: 400,
  letterSpacing: 1,
  textTransform: 'uppercase',
  marginBottom: 12,
  color: '#333',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  border: '1px solid #e5e5e5',
  borderRadius: 0,
  fontSize: 14,
  fontFamily: "'Roboto', sans-serif",
  fontWeight: 300,
  color: '#333',
  outline: 'none',
  transition: 'border-color 0.15s',
};
