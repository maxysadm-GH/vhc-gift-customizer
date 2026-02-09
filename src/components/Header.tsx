import { Link } from 'react-router-dom';

export function Header() {
  return (
    <header style={{
      borderBottom: '1px solid #e5e5e5',
      background: '#fff',
      position: 'sticky',
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <Link to="/">
          <img
            src="https://www.vosgeschocolate.com/cdn/shop/files/logo_200x.png"
            alt="Vosges Haut-Chocolat"
            style={{ height: 40 }}
          />
        </Link>
        <nav style={{ display: 'flex', gap: 32, fontSize: 13, fontWeight: 400, letterSpacing: '1.5px', textTransform: 'uppercase', fontFamily: "'Roboto', sans-serif" }}>
          <Link to="/" style={{ color: '#333', textDecoration: 'none' }}>Corporate Gifts</Link>
          <a href="https://www.vosgeschocolate.com" target="_blank" rel="noopener noreferrer" style={{ color: '#333', textDecoration: 'none' }}>Shop</a>
        </nav>
      </div>
    </header>
  );
}
