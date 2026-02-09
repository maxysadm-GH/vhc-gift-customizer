import { useState } from 'react';
import type { Dispatch } from 'react';
import type { CustomizerState, CustomizerAction } from '../data/customization';
import { LogoUpload } from './LogoUpload';
import { uploadLogo } from '../api/customize';

interface Props {
  state: CustomizerState;
  dispatch: Dispatch<CustomizerAction>;
}

export function OnboardingGate({ state, dispatch }: Props) {
  const [error, setError] = useState('');

  const handleContinue = async () => {
    setError('');

    if (!state.companyName.trim()) { setError('Please enter your company name.'); return; }
    if (!state.email.trim()) { setError('Please enter your email address.'); return; }

    // Upload logo if provided
    if (state.logoFile) {
      dispatch({ type: 'SET_LOGO_UPLOADING', payload: true });
      try {
        const result = await uploadLogo(state.logoFile, state.companyName, state.email);
        dispatch({ type: 'SET_SESSION', payload: { sessionId: result.session_id, logoUrl: result.logo_url } });
      } catch {
        // Continue without logo upload — user can still customize
        dispatch({ type: 'SET_LOGO_UPLOADING', payload: false });
      }
    }

    dispatch({ type: 'SET_STEP', payload: 'customizer' });
  };

  return (
    <div style={{
      maxWidth: 540,
      margin: '0 auto',
      padding: '64px 24px',
    }}>
      {/* Step indicator */}
      <div style={{
        textAlign: 'center',
        marginBottom: 12,
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#999',
      }}>
        Step 1 of 3
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h1 style={{
          fontSize: 28,
          fontWeight: 300,
          color: '#333',
          marginBottom: 8,
          letterSpacing: -0.5,
        }}>
          Welcome to the Vosges Gifting Concierge
        </h1>
        <p style={{ color: '#666', fontSize: 15, lineHeight: 1.6 }}>
          Let's start with your company details. Upload your logo so we can
          prepare your custom preview while you explore options.
        </p>
      </div>

      {/* Card */}
      <div style={{
        border: '1px solid #e5e5e5',
        padding: 32,
        background: '#fff',
      }}>
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

        {/* Company Name */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Company Name *</label>
          <input
            type="text"
            value={state.companyName}
            onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'companyName', value: e.target.value } })}
            placeholder="Acme Corporation"
            style={inputStyle}
          />
        </div>

        {/* Email */}
        <div style={{ marginBottom: 20 }}>
          <label style={labelStyle}>Email *</label>
          <input
            type="email"
            value={state.email}
            onChange={(e) => dispatch({ type: 'SET_FIELD', payload: { field: 'email', value: e.target.value } })}
            placeholder="you@company.com"
            style={inputStyle}
          />
        </div>

        {/* Logo Upload */}
        <LogoUpload
          logoPreviewUrl={state.logoPreviewUrl}
          onUpload={(file, previewUrl) => dispatch({ type: 'SET_LOGO', payload: { file, previewUrl } })}
          onClear={() => dispatch({ type: 'CLEAR_LOGO' })}
        />

        {/* Continue Button */}
        <button
          type="button"
          onClick={handleContinue}
          disabled={state.logoUploading}
          style={{
            width: '100%',
            padding: '16px',
            background: state.logoUploading ? '#999' : '#38165f',
            color: '#fff',
            border: 'none',
            borderRadius: 0,
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: 1.5,
            textTransform: 'uppercase',
            cursor: state.logoUploading ? 'wait' : 'pointer',
            fontFamily: "'Roboto', sans-serif",
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => { if (!state.logoUploading) e.currentTarget.style.background = '#4a2070'; }}
          onMouseLeave={e => { if (!state.logoUploading) e.currentTarget.style.background = '#38165f'; }}
        >
          {state.logoUploading ? 'Uploading Logo...' : 'Continue to Customizer'}
        </button>

        <p style={{
          textAlign: 'center',
          fontSize: 12,
          color: '#999',
          marginTop: 16,
        }}>
          Logo is optional — you can always add it later.
        </p>
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
