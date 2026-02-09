import type { Dispatch } from 'react';
import type { CustomizerAction } from '../data/customization';

interface Props {
  previewImages: string[];
  previewMessage: string;
  companyName: string;
  dispatch: Dispatch<CustomizerAction>;
}

export function PreviewResults({ previewImages, previewMessage, companyName, dispatch }: Props) {
  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 24px' }}>
      {/* Step indicator */}
      <div style={{
        textAlign: 'center',
        marginBottom: 12,
        fontSize: 12,
        letterSpacing: 2,
        textTransform: 'uppercase',
        color: '#999',
      }}>
        Step 3 of 3
      </div>

      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <h2 style={{ fontSize: 24, fontWeight: 300, color: '#333', marginBottom: 8 }}>
          Your Custom Preview{companyName ? ` for ${companyName}` : ''}
        </h2>
        <p style={{ color: '#666', fontSize: 15 }}>
          {previewMessage || 'Here\'s how your corporate gift will look.'}
        </p>
      </div>

      {previewImages.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${Math.min(previewImages.length, 3)}, 1fr)`,
          gap: 16,
          marginBottom: 40,
        }}>
          {previewImages.map((url, i) => (
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
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'customizer' })}
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
          Adjust Options
        </button>
        <button
          onClick={() => dispatch({ type: 'RESET' })}
          style={{
            flex: 1,
            padding: '14px',
            background: '#fff',
            color: '#999',
            border: '1px solid #e5e5e5',
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
