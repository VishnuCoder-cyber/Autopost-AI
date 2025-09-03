import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setAuthToken } from '../api/api'; // Import the setAuthToken function

function Navbar({ isAuthenticated, setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [hoveredLink, setHoveredLink] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setAuthToken(null); // FIX: This correctly clears the token from local storage and the Axios header
    setIsAuthenticated(false);
    navigate('/');
  };

  // Check if current route is active
  const isActiveRoute = (path) => location.pathname === path;

  // Navbar container styles
  const navbarStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    background: 'rgba(15, 23, 42, 0.95)',
    backdropFilter: 'blur(20px)',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
    transition: 'all 0.3s ease',
  };

  // Navbar content wrapper
  const navContentStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '70px',
  };

  // Logo styles
  const logoStyle = {
    fontSize: '24px',
    fontWeight: '800',
    color: '#ffffff',
    textDecoration: 'none',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    letterSpacing: '0.5px',
    transition: 'all 0.3s ease',
  };

  // Navigation links container
  const navLinksStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '32px',
    listStyle: 'none',
  };

  // Individual link styles
  const linkStyle = (isActive, isHovered) => ({
    color: isActive ? '#3b82f6' : (isHovered ? '#06b6d4' : 'rgba(255, 255, 255, 0.9)'),
    textDecoration: 'none',
    fontSize: '14px',
    fontWeight: isActive ? '600' : '500',
    padding: '8px 16px',
    borderRadius: '8px',
    background: isActive ? 'rgba(59, 130, 246, 0.1)' : (isHovered ? 'rgba(255, 255, 255, 0.05)' : 'transparent'),
    border: isActive ? '1px solid rgba(59, 130, 246, 0.2)' : '1px solid transparent',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-1px)' : 'translateY(0)',
    boxShadow: isHovered ? '0 4px 12px rgba(0, 0, 0, 0.2)' : 'none',
  });

  // Logout button styles
  const logoutButtonStyle = (isHovered) => ({
    background: isHovered 
      ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
      : 'linear-gradient(135deg, #f87171 0%, #ef4444 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    transform: isHovered ? 'translateY(-2px)' : 'translateY(0)',
    boxShadow: isHovered 
      ? '0 8px 25px rgba(239, 68, 68, 0.4)' 
      : '0 4px 15px rgba(239, 68, 68, 0.3)',
  });

  // Mobile menu button styles
  const mobileMenuButtonStyle = {
    display: 'none',
    flexDirection: 'column',
    gap: '4px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '6px',
    transition: 'all 0.3s ease',
  };

  const mobileMenuLineStyle = {
    width: '24px',
    height: '2px',
    backgroundColor: '#ffffff',
    borderRadius: '1px',
    transition: 'all 0.3s ease',
  };

  // Mobile menu overlay styles
  const mobileMenuOverlayStyle = {
    position: 'fixed',
    top: '70px',
    left: 0,
    right: 0,
    background: 'rgba(15, 23, 42, 0.98)',
    backdropFilter: 'blur(20px)',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '20px',
    zIndex: 999,
    transform: isMobileMenuOpen ? 'translateY(0)' : 'translateY(-100%)',
    opacity: isMobileMenuOpen ? 1 : 0,
    transition: 'all 0.3s ease',
  };

  const mobileLinksStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    maxWidth: '400px',
    margin: '0 auto',
  };

  const mobileLinkStyle = (isActive) => ({
    ...linkStyle(isActive, false),
    display: 'block',
    textAlign: 'center',
    padding: '12px 20px',
    fontSize: '16px',
  });

  return (
    <>
      <nav style={navbarStyle}>
        <div style={navContentStyle}>
          {/* Logo */}
          <Link to="/" style={logoStyle}>
            AutoPost AI
          </Link>

          {/* Desktop Navigation */}
          {isAuthenticated && (
            <>
              <ul style={{...navLinksStyle, '@media (max-width: 768px)': { display: 'none' }}} className="desktop-nav">
                <li>
                  <Link
                    to="/dashboard"
                    style={linkStyle(isActiveRoute('/dashboard'), hoveredLink === 'dashboard')}
                    onMouseEnter={() => setHoveredLink('dashboard')}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link
                    to="/generate"
                    style={linkStyle(isActiveRoute('/generate'), hoveredLink === 'generate')}
                    onMouseEnter={() => setHoveredLink('generate')}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    Manual Post
                  </Link>
                </li>
                <li>
                  <Link
                    to="/schedule"
                    style={linkStyle(isActiveRoute('/schedule'), hoveredLink === 'schedule')}
                    onMouseEnter={() => setHoveredLink('schedule')}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    Scheduler
                  </Link>
                </li>
                <li>
                  <Link
                    to="/feed"
                    style={linkStyle(isActiveRoute('/feed'), hoveredLink === 'feed')}
                    onMouseEnter={() => setHoveredLink('feed')}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    Feed
                  </Link>
                </li>
                <li>
                  <Link
                    to="/onboarding"
                    style={linkStyle(isActiveRoute('/onboarding'), hoveredLink === 'preferences')}
                    onMouseEnter={() => setHoveredLink('preferences')}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    Preferences
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    style={logoutButtonStyle(hoveredLink === 'logout')}
                    onMouseEnter={() => setHoveredLink('logout')}
                    onMouseLeave={() => setHoveredLink(null)}
                  >
                    Logout
                  </button>
                </li>
              </ul>

              {/* Mobile Menu Button */}
              <button 
                style={{...mobileMenuButtonStyle, '@media (min-width: 769px)': { display: 'none' }}}
                className="mobile-menu-btn"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                <div style={mobileMenuLineStyle}></div>
                <div style={mobileMenuLineStyle}></div>
                <div style={mobileMenuLineStyle}></div>
              </button>
            </>
          )}

          {/* Auth Links for non-authenticated users */}
          {!isAuthenticated && (
            <div style={{...navLinksStyle, gap: '16px'}}>
              <Link
                to="/login"
                style={linkStyle(isActiveRoute('/login'), hoveredLink === 'login')}
                onMouseEnter={() => setHoveredLink('login')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Login
              </Link>
              <Link
                to="/register"
                style={{
                  ...linkStyle(isActiveRoute('/register'), hoveredLink === 'register'),
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
                  color: 'white',
                  fontWeight: '600',
                }}
                onMouseEnter={() => setHoveredLink('register')}
                onMouseLeave={() => setHoveredLink(null)}
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isAuthenticated && (
        <div style={mobileMenuOverlayStyle} className="mobile-menu">
          <div style={mobileLinksStyle}>
            <Link
              to="/dashboard"
              style={mobileLinkStyle(isActiveRoute('/dashboard'))}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link
              to="/generate"
              style={mobileLinkStyle(isActiveRoute('/generate'))}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Manual Post
            </Link>
            <Link
              to="/schedule"
              style={mobileLinkStyle(isActiveRoute('/schedule'))}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Scheduler
            </Link>
            <Link
              to="/feed"
              style={mobileLinkStyle(isActiveRoute('/feed'))}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Feed
            </Link>
            <Link
              to="/onboarding"
              style={mobileLinkStyle(isActiveRoute('/onboarding'))}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Preferences
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setIsMobileMenuOpen(false);
              }}
              style={{
                ...logoutButtonStyle(false),
                width: '100%',
                marginTop: '16px',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      )}

      {/* Add responsive styles */}
      <style jsx>{`
        @media (max-width: 768px) {
          .desktop-nav {
            display: none !important;
          }
          .mobile-menu-btn {
            display: flex !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
}

export default Navbar;