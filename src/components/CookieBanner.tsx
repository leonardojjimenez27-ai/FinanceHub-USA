import { useState, useEffect } from 'react';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Comprueba si el usuario ya aceptó las cookies
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      right: '20px',
      backgroundColor: '#0b0f19',
      color: '#ffffff',
      padding: '16px 24px',
      borderRadius: '8px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '12px',
      zIndex: 99999,
      border: '1px solid #1e293b'
    }}>
      <p style={{ margin: 0, fontSize: '14px', fontFamily: 'sans-serif' }}>
        This website uses cookies to ensure you get the best experience. Read our{' '}
        <a href="/privacy-policy" style={{ color: '#3b82f6', textDecoration: 'underline' }}>
          Privacy Policy
        </a>.
      </p>
      <button 
        onClick={acceptCookies}
        style={{
          backgroundColor: '#2563eb',
          color: '#ffffff',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '6px',
          cursor: 'pointer',
          fontWeight: 'bold',
          fontSize: '14px'
        }}
      >
        Got it!
      </button>
    </div>
  );
}