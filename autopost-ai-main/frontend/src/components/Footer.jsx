import React from 'react';

function Footer() {
  const palette = {
    darkBlue: 'rgba(15, 23, 42, 0.95)',
    lightText: '#f1f5f9', // Updated
    primaryBlue: '#3b82f6',
  };

  const footerStyle = {
    backgroundColor: palette.darkBlue,
    color: palette.lightText,
    padding: '35px 20px',
    marginTop: 'auto',
    textAlign: 'center',
    fontFamily: 'Inter, sans-serif',
    fontSize: '1em',
    lineHeight: '1.6',
    boxShadow: '0 -6px 20px rgba(0,0,0,0.4)',
    backdropFilter: 'blur(8px)',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  };

  const copyrightStyle = {
    marginBottom: '8px',
    fontWeight: '400',
    letterSpacing: '0.5px',
    color: palette.lightText,
  };

  const builtWithStyle = {
    fontSize: '0.9em',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '5px',
    color: palette.lightText,
  };

  const heartStyle = {
    color: palette.primaryBlue,
    fontSize: '1.2em',
    animation: 'pulse 1.5s infinite',
    display: 'inline-block',
  };

  return (
    <footer style={footerStyle}>
      <p style={copyrightStyle}>
        &copy; {new Date().getFullYear()} **AutoPost AI**. All rights reserved.
      </p>
      <p style={builtWithStyle}>
        Built <span style={heartStyle}>❤️</span>
      </p>
    </footer>
  );
}

// FIX: Wrapped the component in React.memo for performance
export default React.memo(Footer);