import { useReducer, useState } from 'react';
import type { FormEvent } from 'react';
import { Box3D } from '../components/Box3D';
import { ColorSwatchPicker } from '../components/ColorSwatchPicker';
import { FontPicker } from '../components/FontPicker';
import { MarqueeCardPicker } from '../components/MarqueeCardPicker';
import { HangTagPicker } from '../components/HangTagPicker';
import { LogoUpload } from '../components/LogoUpload';
import type { CustomizerState, ColorOption, FontOption, MarqueeStyle, HangTagStyle } from '../data/customization';
import {
  defaultState,
  boxColors, foilColors, ribbonColors, fontOptions,
} from '../data/customization';

type Action =
  | { type: 'SET_LEVEL'; payload: 'duet' | 'signature' }
  | { type: 'SET_BOX_COLOR'; payload: ColorOption }
  | { type: 'SET_FOIL_COLOR'; payload: ColorOption }
  | { type: 'SET_RIBBON_COLOR'; payload: ColorOption }
  | { type: 'SET_MARQUEE_STYLE'; payload: MarqueeStyle }
  | { type: 'SET_HANG_TAG_STYLE'; payload: HangTagStyle }
  | { type: 'SET_FONT'; payload: FontOption }
  | { type: 'SET_LOGO'; payload: { file: File; previewUrl: string } }
  | { type: 'CLEAR_LOGO' }
  | { type: 'SET_FIELD'; payload: { field: 'companyName' | 'email' | 'message'; value: string } }
  | { type: 'SET_QUANTITY'; payload: number }
  | { type: 'RESET' };

function reducer(state: CustomizerState, action: Action): CustomizerState {
  switch (action.type) {
    case 'SET_LEVEL': return { ...state, level: action.payload };
    case 'SET_BOX_COLOR': return { ...state, boxColor: action.payload };
    case 'SET_FOIL_COLOR': return { ...state, foilColor: action.payload };
    case 'SET_RIBBON_COLOR': return { ...state, ribbonColor: action.payload };
    case 'SET_MARQUEE_STYLE': return { ...state, marqueeStyle: action.payload };
    case 'SET_HANG_TAG_STYLE': return { ...state, hangTagStyle: action.payload };
    case 'SET_FONT': return { ...state, font: action.payload };
    case 'SET_LOGO': return { ...state, logoFile: action.payload.file, logoPreviewUrl: action.payload.previewUrl };
    case 'CLEAR_LOGO': return { ...state, logoFile: null, logoPreviewUrl: null };
    case 'SET_FIELD': return { ...state, [action.payload.field]: action.payload.value };
    case 'SET_QUANTITY': return { ...state, quantity: action.payload };
    case 'RESET': return defaultState;
    default: return state;
  }
}

const API_BASE = import.meta.env.VITE_API_BASE || '';

interface PreviewResult {
  success: boolean;
  preview_images?: string[];
  message?: string;
}

export function CustomizePage() {
  const [state, dispatch] = useReducer(reducer, defaultState);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PreviewResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!state.companyName.trim()) { setError('Company name is required.'); return; }
    if (!state.email.trim()) { setError('Email is required.'); return; }
    if (state.quantity < (state.level === 'signature' ? 1000 : 50)) {
      setError(`Minimum quantity is ${state.level === 'signature' ? '1,000' : '50'} units.`);
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('company_name', state.companyName);
      formData.append('box_color', state.boxColor.name);
      formData.append('foil_color', state.foilColor.name);
      formData.append('ribbon_color', state.ribbonColor.name);
      formData.append('email', state.email);
      formData.append('quantity', String(state.quantity));
      formData.append('level', state.level);
      formData.append('font', state.font.name);
      formData.append('marquee_style', state.marqueeStyle);
      formData.append('hang_tag_style', state.hangTagStyle);
      formData.append('message', state.message);
      if (state.logoFile) formData.append('logo', state.logoFile);

      const res = await fetch(`${API_BASE}/webhook/customize-preview`, {
        method: 'POST',
        body: formData,
      });

      const data: PreviewResult = await res.json();
      setResult(data);
    } catch {
      setError('Failed to generate preview. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  if (result) {
    return (
      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 24, fontWeight: 300, color: '#333', marginBottom: 8 }}>
            Your Custom Preview
          </h2>
          <p style={{ color: '#666', fontSize: 15 }}>
            {result.message || 'Here\'s how your corporate gift will look.'}
          </p>
        </div>
        {result.preview_images && result.preview_images.length > 0 && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${Math.min(result.preview_images.length, 3)}, 1fr)`,
            gap: 16,
            marginBottom: 40,
          }}>
            {result.preview_images.map((url, i) => (
              <div key={i} style={{ border: '1px solid #e5e5e5', overflow: 'hidden' }}>
                <img src={url} alt={`Preview ${i + 1}`} style={{ width: '100%' }} />
                <div style={{ padding: 8, textAlign: 'center', fontSize: 13, color: '#666' }}>
                  View {i + 1}
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={() => alert('Order submitted! Our concierge team will be in touch.')}
            style={{
              flex: 1,
              padding: '14px',
              background: '#38165f',
              color: '#fff',
              border: 'none',
              borderRadius: 0,
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: 1,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Submit Order
          </button>
          <button
            onClick={() => { setResult(null); dispatch({ type: 'RESET' }); }}
            style={{
              flex: 1,
              padding: '14px',
              background: '#fff',
              color: '#333',
              border: '1px solid #333',
              borderRadius: 0,
              fontSize: 14,
              fontWeight: 400,
              letterSpacing: 1,
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

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
      {/* Breadcrumb */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px 24px',
        fontSize: 13,
        color: '#999',
      }}>
        <a href="/" style={{ color: '#999', textDecoration: 'none' }}>Corporate Gifts</a>
        <span style={{ margin: '0 8px' }}>/</span>
        <span style={{ color: '#333' }}>Customize</span>
      </div>

      {/* Product detail layout */}
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '0 24px 64px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 48,
        alignItems: 'start',
      }}>
        {/* Left: Image + 3D Box */}
        <div style={{ position: 'sticky', top: 100 }}>
          {/* Hero product image */}
          <div style={{
            border: '1px solid #e5e5e5',
            marginBottom: 24,
            background: '#fafafa',
          }}>
            <img
              src="https://cdn.shopify.com/s/files/1/0012/8660/2848/files/Vegan_9pc_001.jpg?v=1727797701"
              alt="9-Piece Vegan Truffle Collection"
              style={{ width: '100%' }}
            />
          </div>

          {/* 3D Box Preview */}
          <div style={{
            background: '#f8f8f8',
            border: '1px solid #e5e5e5',
            padding: 32,
          }}>
            <p style={{
              fontSize: 11,
              fontWeight: 400,
              letterSpacing: 2,
              textTransform: 'uppercase',
              textAlign: 'center',
              color: '#999',
              marginBottom: 20,
            }}>
              Live Box Preview
            </p>
            <Box3D
              boxColor={state.boxColor.hex}
              foilColor={state.foilColor.hex}
              ribbonColor={state.ribbonColor.hex}
              size={220}
            />
            <p style={{
              fontSize: 11,
              textAlign: 'center',
              color: '#bbb',
              marginTop: 16,
            }}>
              Hover to pause rotation
            </p>
          </div>
        </div>

        {/* Right: Options */}
        <div>
          <form onSubmit={handleSubmit}>
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
            <p style={{ fontSize: 13, color: '#999', marginBottom: 24 }}>
              Forest Raspberry Rose, Tahitian Orchid Vanilla, Sicilian Blood Orange
            </p>

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
              <label style={{
                display: 'block',
                fontSize: 13,
                fontWeight: 400,
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginBottom: 12,
                color: '#333',
              }}>
                Customization Level
              </label>
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

            {/* Logo */}
            <LogoUpload
              logoPreviewUrl={state.logoPreviewUrl}
              onUpload={(file, previewUrl) => dispatch({ type: 'SET_LOGO', payload: { file, previewUrl } })}
              onClear={() => dispatch({ type: 'CLEAR_LOGO' })}
            />

            <hr style={{ border: 'none', borderTop: '1px solid #e5e5e5', marginBottom: 24 }} />

            {/* Form fields */}
            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Company Name *</label>
              <input
                type="text"
                value={state.companyName}
                onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'companyName', value: e.target.value } })}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Email *</label>
              <input
                type="email"
                value={state.email}
                onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'email', value: e.target.value } })}
                required
                style={inputStyle}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={labelStyle}>Quantity *</label>
              <input
                type="number"
                value={state.quantity || ''}
                min={state.level === 'signature' ? 1000 : 50}
                onChange={(e) => dispatch({ type: 'SET_QUANTITY', payload: parseInt(e.target.value) || 0 })}
                placeholder={state.level === 'signature' ? 'Min 1,000 units' : 'Min 50 units'}
                required
                style={inputStyle}
              />
            </div>

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

            {/* Submit */}
            <button
              type="submit"
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
          </form>
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
  marginBottom: 8,
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
