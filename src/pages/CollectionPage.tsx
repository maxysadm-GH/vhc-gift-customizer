import { useNavigate } from 'react-router-dom';
import { products } from '../data/products';

function StarRating({ rating, count }: { rating: number; count: number }) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  return (
    <span style={{ color: '#c5a059', fontSize: 14, letterSpacing: 2 }}>
      {'★'.repeat(full)}{half ? '½' : ''}{'☆'.repeat(5 - full - (half ? 1 : 0))}
      <span style={{ color: '#999', fontSize: 12, marginLeft: 6 }}>({count})</span>
    </span>
  );
}

export function CollectionPage() {
  const navigate = useNavigate();

  return (
    <div>
      {/* Hero */}
      <section style={{
        background: '#38165f',
        color: '#fff',
        textAlign: 'center',
        padding: '60px 24px',
      }}>
        <h1 style={{
          fontSize: 14,
          fontWeight: 400,
          letterSpacing: 3,
          textTransform: 'uppercase',
          marginBottom: 16,
          fontFamily: "'Roboto', sans-serif",
        }}>Corporate Gifts</h1>
        <p style={{
          fontSize: 16,
          fontWeight: 300,
          maxWidth: 600,
          margin: '0 auto',
          lineHeight: 1.7,
          opacity: 0.9,
        }}>
          Elevate your corporate gifting with Vosges Haut-Chocolat.
          Customize packaging with your brand for a truly memorable experience.
        </p>
      </section>

      {/* Grid */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '48px 24px' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: 24,
        }}>
          {products.map((product) => (
            <div key={product.id} style={{
              border: '1px solid #e5e5e5',
              borderRadius: 0,
              overflow: 'hidden',
              transition: 'box-shadow 0.2s',
              background: '#fff',
            }}
            onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
            >
              <div style={{ overflow: 'hidden', background: '#fafafa' }}>
                <img
                  src={product.image}
                  alt={product.name}
                  style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }}
                />
              </div>
              <div style={{ padding: '16px 20px 20px' }}>
                <h3 style={{ fontSize: 15, fontWeight: 400, marginBottom: 6, color: '#333' }}>
                  {product.name}
                </h3>
                <StarRating rating={product.rating} count={product.reviewCount} />
                <p style={{ fontSize: 15, fontWeight: 400, marginTop: 8, color: '#333' }}>
                  ${product.price.toFixed(2)}
                </p>
                <button style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #333',
                  borderRadius: 0,
                  background: '#fff',
                  color: '#333',
                  fontSize: 13,
                  fontWeight: 400,
                  letterSpacing: 1,
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  marginTop: 16,
                  fontFamily: "'Roboto', sans-serif",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.color = '#fff'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.color = '#333'; }}
                >
                  Add to Bag
                </button>
                {product.customizable && (
                  <button
                    onClick={() => navigate('/customize')}
                    style={{
                      width: '100%',
                      padding: '12px',
                      border: 'none',
                      borderRadius: 0,
                      background: '#38165f',
                      color: '#fff',
                      fontSize: 13,
                      fontWeight: 400,
                      letterSpacing: 1,
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      marginTop: 8,
                      fontFamily: "'Roboto', sans-serif",
                      transition: 'all 0.2s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#4a2070'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#38165f'; }}
                  >
                    Customize
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
