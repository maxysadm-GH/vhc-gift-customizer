export function Footer() {
  return (
    <footer style={{
      borderTop: '1px solid #e5e5e5',
      padding: '40px 24px',
      marginTop: 80,
      textAlign: 'center',
      fontSize: 13,
      color: '#999',
      fontFamily: "'Roboto', sans-serif",
    }}>
      <img
        src="https://www.vosgeschocolate.com/cdn/shop/files/logo_200x.png"
        alt="Vosges Haut-Chocolat"
        style={{ height: 30, margin: '0 auto 16px' }}
      />
      <p>Corporate Gifting Program</p>
      <p style={{ marginTop: 8 }}>For inquiries: <a href="mailto:corporate@vosgeschocolate.com" style={{ color: '#38165f' }}>corporate@vosgeschocolate.com</a></p>
      <p style={{ marginTop: 16, fontSize: 11, color: '#ccc' }}>Powered by MBACIO</p>
    </footer>
  );
}
