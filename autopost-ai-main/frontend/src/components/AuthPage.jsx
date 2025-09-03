import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser, loginUser, setAuthToken } from '../api/api';

function AuthPage({ handleAuthSuccess }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Handle Login
        const response = await loginUser({ email, password });
        if (response.data && response.data.token) {
          setAuthToken(response.data.token);
          handleAuthSuccess(); // Pass no argument, so App assumes existing user
          navigate('/dashboard');
        } else {
          // This block handles cases where the API returns a 200 but no token, though unlikely.
          setError('Login failed. Please check your credentials.');
          setAuthToken(null);
        }
      } else {
        // Handle Registration
        if (password !== confirmPassword) {
          setError('Passwords do not match.');
          setLoading(false);
          return;
        }
        const response = await registerUser({ username, email, password });
        
        if (response.data && response.data.token) {
          setAuthToken(response.data.token);
          handleAuthSuccess(true); // Pass 'true' to signal this is a new user
        } else {
          setError('Registration failed. Please try again.');
          setAuthToken(null);
        }
      }
      
    } catch (err) {
      console.error('Authentication error:', err.response ? err.response.data : err.message);
      // FIX: Clear any old token on a failed login attempt
      setAuthToken(null); 
      setError(err.response?.data?.message || 'An error occurred during authentication.');
    } finally {
      setLoading(false);
    }
  };

  // Main container styles
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    position: 'relative',
  };

  // Form card styles
  const formCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '24px',
    padding: '40px',
    maxWidth: '450px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    position: 'relative',
    overflow: 'hidden',
  };

  // Decorative elements
  const decorativeCircleStyle = {
    position: 'absolute',
    top: '-50px',
    right: '-50px',
    width: '100px',
    height: '100px',
    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(6, 182, 212, 0.3) 100%)',
    borderRadius: '50%',
    filter: 'blur(10px)',
  };

  // Header styles
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '32px',
  };

  const titleStyle = {
    fontSize: '32px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '16px',
    fontWeight: '400',
  };

  // Form styles
  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  };

  const labelStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: '600',
    marginLeft: '4px',
  };

  // The inline styles for the input elements. We'll rely on the CSS file for placeholder styling.
  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '14px 16px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const inputFocusStyle = {
    borderColor: '#3b82f6',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
  };

  // Button styles
  const submitButtonStyle = {
    background: loading 
      ? 'rgba(107, 114, 128, 0.5)' 
      : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '14px 20px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '8px',
    boxShadow: loading 
      ? 'none' 
      : '0 8px 25px rgba(59, 130, 246, 0.4)',
    transform: loading ? 'none' : 'translateY(0)',
  };

  const switchButtonStyle = {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    padding: '8px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    textAlign: 'center',
    marginTop: '16px',
  };

  // Error message styles
  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    color: '#fca5a5',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '16px',
  };

  // We are removing the inline placeholder style and will use the CSS file.
  // The placeholder text color will be darker for better visibility.

  return (
    <div style={containerStyle}>
      <div style={formCardStyle} className="animate-fadeInUp">
        {/* Decorative elements */}
        <div style={decorativeCircleStyle}></div>
        
        {/* Header */}
        <div style={headerStyle}>
          <h1 style={titleStyle}>
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={subtitleStyle}>
            {isLogin 
              ? 'Sign in to your AutoPost AI account' 
              : 'Join AutoPost AI and automate your content'
            }
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div style={errorStyle}>
            {error}
          </div>
        )}

        {/* Form */}
        <form style={formStyle} onSubmit={handleSubmit}>
          {/* Username field (only for registration) */}
          {!isLogin && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={inputStyle}
                placeholder="Enter your username"
                required={!isLogin}
                disabled={loading}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
          )}

          {/* Email field */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={inputStyle}
              placeholder="Enter your email"
              required
              disabled={loading}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          {/* Password field */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={inputStyle}
              placeholder="Enter your password"
              required
              disabled={loading}
              onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>

          {/* Confirm password field (only for registration) */}
          {!isLogin && (
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={inputStyle}
                placeholder="Confirm your password"
                required={!isLogin}
                disabled={loading}
                onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
          )}

          {/* Submit button */}
          <button
            type="submit"
            style={submitButtonStyle}
            disabled={loading}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 12px 35px rgba(59, 130, 246, 0.6)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.4)';
              }
            }}
          >
            {loading 
              ? (isLogin ? 'Signing In...' : 'Creating Account...') 
              : (isLogin ? 'Sign In' : 'Create Account')
            }
          </button>
        </form>

        {/* Switch between login/register */}
        <button
          onClick={() => setIsLogin(!isLogin)}
          style={switchButtonStyle}
          disabled={loading}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(59, 130, 246, 0.1)';
            e.target.style.color = '#60a5fa';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'none';
            e.target.style.color = '#3b82f6';
          }}
        >
          {isLogin 
            ? "Don't have an account? Sign up" 
            : 'Already have an account? Sign in'
          }
        </button>
      </div>
      
      {/* Add a style block to override the default placeholder color */}
      <style>{`
        input::placeholder {
          color: #a0a7c6; /* A more visible light gray-blue */
          opacity: 1; /* Ensure the placeholder is fully opaque */
        }
      `}</style>
    </div>
  );
}

export default AuthPage;