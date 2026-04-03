import { useState } from 'react';
import type { Dispatch } from 'react';
import type { CustomizerAction, CustomizerState } from '../data/customization';
import { createShopifyCheckout, logOrderToBackend } from '../api/customize';

interface Props {
  previewImages: string[];
  previewMessage: string;
  companyName: string;
  state: CustomizerState;
  dispatch: Dispatch<CustomizerAction>;
}

export function PreviewResults({ previewImages, previewMessage, companyName, state, dispatch }: Props) {
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');

  const handleCheckout = async () => {
    setCheckoutError('');
    setCheckoutLoading(true);
    try {
      const checkoutData = {
        company_name: state.companyName,
        email: state.email,
        quantity: state.quantity,
        level: state.level,
        box_color: state.boxColor.name,
        foil_color: state.foilColor.name,
        ribbon_color: state.ribbonColor.name,
        font: state.font.name,
        marquee_style: state.marqueeStyle,
        hang_tag_style: state.hangTagStyle,
        message: state.message,
        logo_url: state.logoUrl || '',
        session_id: state.sessionId || '',
      };
      const result = await createShopifyCheckout(checkoutData);
      // Log to Airtable + trigger n8n (non-blocking)
      void logOrderToBackend({
        ...checkoutData,
        shopify_cart_id: result.cartId,
        checkout_url: result.checkoutUrl,
      });
      // Redirect to Shopify checkout
      window.location.href = result.checkoutUrl;
    } catch (err) {
      setCheckoutError(err instanceof Error ? err.message : 'Failed to start checkout. Please try again.');
      setCheckoutLoading(false);
    }
  };

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

      {/* Order summary */}
      <div style={{
        background: '#f9f9f9',
        border: '1px solid #e5e5e5',
        padding: '20px 24px',
        marginBottom: 24,
        fontSize: 14,
        color: '#555',
      }}>
        <div style={{ fontWeight: 500, marginBottom: 12, color: '#333', letterSpacing: 0.5 }}>Order Summary</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px 24px' }}>
          <span style={{ color: '#999' }}>Product:</span>
          <span>9-Piece Vegan Truffle Collection</span>
          <span style={{ color: '#999' }}>Quantity:</span>
          <span>{state.quantity.toLocaleString()} units</span>
          <span style={{ color: '#999' }}>Level:</span>
          <span>{state.level === 'signature' ? 'Signature' : 'Duet'}</span>
          <span style={{ color: '#999' }}>Box Color:</span>
          <span>{state.boxColor.name}</span>
          <span style={{ color: '#999' }}>Foil:</span>
          <span>{state.foilColor.name}</span>
          <span style={{ color: '#999' }}>Ribbon:</span>
          <span>{state.ribbonColor.name}</span>
          {state.companyName && (
            <>
              <span style={{ color: '#999' }}>Company:</span>
              <span>{state.companyName}</span>
            </>
          )}
        </div>
      </div>

      {checkoutError && (
        <div style={{
          background: '#fef2f2',
          border: '1px solid #fecaca',
          color: '#b91c1c',
          padding: '12px 16px',
          marginBottom: 16,
          fontSize: 14,
        }}>
          {checkoutError}
        </div>
      )}

      <div style={{ display: 'flex', gap: 12 }}>
        <button
          onClick={handleCheckout}
          disabled={checkoutLoading}
          style={{
            flex: 1,
            padding: '14px',
            background: checkoutLoading ? '#7c4d9e' : '#38165f',
            color: '#fff',
            border: 'none',
            borderRadius: 0,
            fontSize: 14,
            fontWeight: 400,
            letterSpacing: 1,
            textTransform: 'uppercase',
            cursor: checkoutLoading ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s',
          }}
        >
          {checkoutLoading ? 'Opening Checkout...' : 'Proceed to Checkout'}
        </button>
        <button
          onClick={() => dispatch({ type: 'SET_STEP', payload: 'customizer' })}
          disabled={checkoutLoading}
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
          disabled={checkoutLoading}
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

      <p style={{ textAlign: 'center', fontSize: 12, color: '#aaa', marginTop: 16 }}>
        Your customization details will be attached to the order. A VHC concierge will confirm production specs within 1 business day.
      </p>
    </div>
  );
}
