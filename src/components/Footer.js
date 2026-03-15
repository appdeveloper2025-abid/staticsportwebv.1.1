import React from 'react';

const Footer = () => {
  return (
    <footer style={{
      padding: '24px 32px',
      textAlign: 'center',
      marginTop: '64px',
      borderTop: '1px solid rgba(255, 255, 255, 0.1)',
      background: 'rgba(255, 255, 255, 0.02)'
    }}>
      <p style={{ fontSize: '14px', opacity: '0.8' }}>
        Developed by <strong style={{ color: 'var(--primary)' }}>ABID MEHMOOD</strong> & <strong style={{ color: 'var(--secondary)' }}>Yasir Hameed</strong>
      </p>
      <p style={{ fontSize: '12px', opacity: '0.6', marginTop: '8px' }}>
        © {new Date().getFullYear()} Sports Management System. All rights reserved.
      </p>
    </footer>
  );
};

export default Footer;
