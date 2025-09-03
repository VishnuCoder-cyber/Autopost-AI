// frontend/src/components/OnboardingPage.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGenerationOptions, updateUserPreferences, getMe } from '../api/api';

function OnboardingPage({ onOnboardingComplete }) {
  const [defaultCategory, setDefaultCategory] = useState('');
  const [autoGeneratePosts, setAutoGeneratePosts] = useState(true);
  const [collegeName, setCollegeName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [cause, setCause] = useState('');
  const [options, setOptions] = useState({ categories: [], audiences: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [optionsResponse, userResponse] = await Promise.all([
          getGenerationOptions(),
          getMe()
        ]);
        setOptions(optionsResponse.data);
        const userPreferences = userResponse.data.user.preferences;
        if (userPreferences) {
          setDefaultCategory(userPreferences.defaultCategory || '');
          setAutoGeneratePosts(userPreferences.autoGeneratePosts !== undefined ? userPreferences.autoGeneratePosts : true);

          if (userPreferences.categoryDetails) {
            if (userPreferences.categoryDetails.educational) {
              setCollegeName(userPreferences.categoryDetails.educational.collegeName || '');
              setSchoolName(userPreferences.categoryDetails.educational.schoolName || '');
            }
            if (userPreferences.categoryDetails.business) {
              setIndustry(userPreferences.categoryDetails.business.industry || '');
              setCompanyName(userPreferences.categoryDetails.business.companyName || '');
            }
            if (userPreferences.categoryDetails.ngo) {
              setCause(userPreferences.categoryDetails.ngo.cause || '');
            }
          }
        }
      } catch (err) {
        console.error('Error fetching onboarding data:', err);
        setError(err.response?.data?.message || 'Failed to load onboarding options or user data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const categoryDetails = {};
    if (defaultCategory === 'college') {
      categoryDetails.educational = { collegeName };
    } else if (defaultCategory === 'ngo' && (collegeName || schoolName)) {
      categoryDetails.educational = { collegeName, schoolName };
    } else if (defaultCategory === 'business') {
      categoryDetails.business = { industry, companyName };
    } else if (defaultCategory === 'ngo') {
      categoryDetails.ngo = { cause };
    }

    try {
      await updateUserPreferences({
        defaultCategory,
        autoGeneratePosts,
        categoryDetails
      });
      setMessage('Preferences saved successfully!');
      if(onOnboardingComplete) {
        onOnboardingComplete();
      }
      navigate('/dashboard');
    } catch (err) {
      console.error('Error saving preferences:', err);
      setError(err.response?.data?.message || 'Failed to save preferences.');
    } finally {
      setLoading(false);
    }
  };

  const palette = {
    darkGlass: 'rgba(15, 23, 42, 0.4)',
    lightGlass: 'rgba(255, 255, 255, 0.05)',
    primaryBlue: '#3b82f6',
    primaryHover: '#2563eb',
    accentCyan: '#06b6d4',
    lightText: '#e2e8f0',
    grayText: '#94a3b8',
    successGreen: '#22c55e',
    errorRed: '#dc2626',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  };

  const formContainerStyle = {
    padding: '40px',
    maxWidth: '600px',
    margin: '40px auto',
    backgroundColor: palette.darkGlass,
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    textAlign: 'center',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${palette.glassBorder}`,
    color: palette.lightText,
  };

  const headingStyle = {
    fontSize: '2.5em',
    background: `linear-gradient(135deg, ${palette.primaryBlue}, ${palette.accentCyan})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '20px',
    borderBottom: `2px solid ${palette.glassBorder}`,
    paddingBottom: '10px',
    fontWeight: '700',
  };

  const formGroupStyle = {
    marginBottom: '20px',
    textAlign: 'left',
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '600',
    color: palette.lightText,
  };

  const inputStyle = {
    width: '100%',
    padding: '14px',
    border: `1px solid ${palette.glassBorder}`,
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontSize: '1em',
    backgroundColor: palette.lightGlass,
    color: palette.lightText,
    backdropFilter: 'blur(5px)',
    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
  };

  const focusInputStyle = {
    ...inputStyle,
    borderColor: palette.primaryBlue,
    boxShadow: `0 0 10px ${palette.primaryBlue}50`,
  };

  const checkboxContainerStyle = {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '20px',
    marginTop: '25px',
    backgroundColor: palette.lightGlass,
    border: `1px solid ${palette.glassBorder}`,
    borderRadius: '8px',
    padding: '15px',
    transition: 'box-shadow 0.3s ease',
  };

  const checkboxStyle = {
    marginRight: '15px',
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: palette.primaryBlue,
  };

  const buttonStyle = {
    backgroundColor: palette.successGreen,
    color: '#1e293b',
    padding: '14px 30px',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontSize: '1.1em',
    fontWeight: 'bold',
    marginTop: '25px',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
    background: `linear-gradient(135deg, ${palette.successGreen} 0%, #6366f1 100%)`,
  };

  const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
    opacity: 0.9,
  };

  const messageBoxStyle = {
    padding: '15px',
    borderRadius: '12px',
    marginBottom: '20px',
    textAlign: 'center',
    fontWeight: '600',
    backgroundColor: message ? 'rgba(34, 197, 94, 0.2)' : 'rgba(220, 38, 38, 0.2)',
    color: message ? palette.successGreen : palette.errorRed,
    border: `1px solid ${message ? palette.successGreen : palette.errorRed}`,
    backdropFilter: 'blur(5px)',
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: palette.lightText }}>
        <p>Loading onboarding options...</p>
      </div>
    );
  }

  return (
    <div style={formContainerStyle}>
      <h1 style={headingStyle}>Set Up Your Automation Preferences</h1>
      <p style={{ marginBottom: '30px', color: palette.grayText, textAlign: 'center' }}>
        Tell us about your organization to enable smart, automated post generation for special dates.
      </p>

      {error && <div style={{...messageBoxStyle, color: palette.errorRed, border: `1px solid ${palette.errorRed}`}}>{error}</div>}
      {message && <div style={messageBoxStyle}>{message}</div>}

      <form onSubmit={handleSubmit}>
        <div style={formGroupStyle}>
          <label htmlFor="defaultCategory" style={labelStyle}>Primary Category:</label>
          <select
            id="defaultCategory"
            value={defaultCategory}
            onChange={(e) => {
              setDefaultCategory(e.target.value);
              setCollegeName('');
              setSchoolName('');
              setIndustry('');
              setCompanyName('');
              setCause('');
            }}
            style={inputStyle}
            required
            onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          >
            <option value="">Select your category</option>
            {options.categories.map(cat => (
              <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
            ))}
          </select>
        </div>

        {defaultCategory === 'college' && (
          <div style={formGroupStyle}>
            <label htmlFor="collegeName" style={labelStyle}>College Name:</label>
            <input
              type="text"
              id="collegeName"
              value={collegeName}
              onChange={(e) => setCollegeName(e.target.value)}
              style={inputStyle}
              placeholder="e.g., IIT Bombay"
              onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>
        )}
        {(defaultCategory === 'ngo' && (collegeName || schoolName)) && (
          <>
            <div style={formGroupStyle}>
              <label htmlFor="collegeName" style={labelStyle}>College Name (if applicable):</label>
              <input
                type="text"
                id="collegeName"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                style={inputStyle}
                placeholder="e.g., ABC University"
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            <div style={formGroupStyle}>
              <label htmlFor="schoolName" style={labelStyle}>School Name (if applicable):</label>
              <input
                type="text"
                id="schoolName"
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                style={inputStyle}
                placeholder="e.g., XYZ High School"
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
          </>
        )}
        {defaultCategory === 'business' && (
          <>
            <div style={formGroupStyle}>
              <label htmlFor="industry" style={labelStyle}>Industry Type:</label>
              <input
                type="text"
                id="industry"
                value={industry}
                onChange={(e) => setIndustry(e.target.value)}
                style={inputStyle}
                placeholder="e.g., Tech Startup, Retail, Healthcare"
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
            <div style={formGroupStyle}>
              <label htmlFor="companyName" style={labelStyle}>Company Name:</label>
              <input
                type="text"
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                style={inputStyle}
                placeholder="e.g., Innovate Solutions"
                onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
                onBlur={(e) => Object.assign(e.target.style, inputStyle)}
              />
            </div>
          </>
        )}
        {defaultCategory === 'ngo' && !(collegeName || schoolName) && (
          <div style={formGroupStyle}>
            <label htmlFor="cause" style={labelStyle}>Main Cause/Focus:</label>
            <input
              type="text"
              id="cause"
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              style={inputStyle}
              placeholder="e.g., Environmental Protection, Child Welfare"
              onFocus={(e) => Object.assign(e.target.style, focusInputStyle)}
              onBlur={(e) => Object.assign(e.target.style, inputStyle)}
            />
          </div>
        )}

        <div style={checkboxContainerStyle}>
          <input
            type="checkbox"
            id="autoGeneratePosts"
            checked={autoGeneratePosts}
            onChange={(e) => setAutoGeneratePosts(e.target.checked)}
            style={checkboxStyle}
          />
          <label htmlFor="autoGeneratePosts" style={{...labelStyle, margin: 0, fontWeight: '400', lineHeight: 1.4}}>
            Enable Automatic Post Generation (for special dates)
          </label>
        </div>

        <button
          type="submit"
          style={loading ? { ...buttonStyle, opacity: 0.7, cursor: 'not-allowed' } : buttonStyle}
          disabled={loading}
          onMouseEnter={(e) => !loading && Object.assign(e.target.style, { ...buttonStyle, ...buttonHoverStyle })}
          onMouseLeave={(e) => !loading && Object.assign(e.target.style, buttonStyle)}
        >
          {loading ? 'Saving...' : 'Save Preferences'}
        </button>
      </form>
    </div>
  );
}

export default OnboardingPage;