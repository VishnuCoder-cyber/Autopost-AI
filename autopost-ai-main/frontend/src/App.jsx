// App.js
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { getMe, setAuthToken } from './api/api';

// Component imports
import Navbar from './components/Navbar';
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import PostGenerator from './components/PostGenerator';
import SchedulerView from './components/SchedulerView';
import SimulatedFeed from './components/SimulatedFeed';
import OnboardingPage from './components/OnboardingPage';
import LandingPage from './components/LandingPage';
import Footer from './components/Footer';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUserOnboarded, setIsUserOnboarded] = useState(false);

  // Function to handle authentication success from AuthPage
  const handleAuthSuccess = (isNewUser = false) => {
    setIsAuthenticated(true);
    setIsUserOnboarded(!isNewUser);
  };

  // Check auth and onboarding status on app load. This runs only once.
  useEffect(() => {
    const checkAuthStatus = async () => {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        try {
          // KEY FIX: Set the auth token in Axios headers before making the call
          setAuthToken(token);
          
          const response = await getMe();
          const userPreferences = response.data.user.preferences;
          setIsAuthenticated(true);
          
          if (userPreferences && userPreferences.defaultCategory) {
            setIsUserOnboarded(true);
          } else {
            setIsUserOnboarded(false);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
          setIsAuthenticated(false);
          setAuthToken(null); // Clear token if it's invalid
        }
      } else {
        setIsAuthenticated(false);
        setIsUserOnboarded(false);
      }
      setIsLoading(false);
    };

    checkAuthStatus();
  }, []);

  const appContainerStyle = {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    zIndex: 1,
  };

  const contentWrapperStyle = {
    flex: 1,
    paddingTop: isAuthenticated ? '90px' : '0',
    paddingBottom: '20px',
    position: 'relative',
    zIndex: 2,
  };

  const pageContainerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    position: 'relative',
  };

  const ProtectedRoute = ({ children, requiredOnboarding = true }) => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white' }}>
          Loading...
        </div>
      );
    }
    if (!isAuthenticated) {
      return <Navigate to="/login" replace />;
    }
    if (requiredOnboarding && !isUserOnboarded) {
      return <Navigate to="/onboarding" replace />;
    }
    return (
      <div style={pageContainerStyle} className="animate-fadeInUp">
        {children}
      </div>
    );
  };

  const PublicRoute = ({ children }) => {
    if (isLoading) {
      return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white' }}>
          Loading...
        </div>
      );
    }
    if (isAuthenticated) {
      return <Navigate to={isUserOnboarded ? "/dashboard" : "/onboarding"} replace />;
    }
    return (
      <div style={pageContainerStyle} className="animate-fadeInUp">
        {children}
      </div>
    );
  };
  
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', color: 'white' }}>
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <div style={appContainerStyle}>
        {isAuthenticated && (
          <Navbar 
            isAuthenticated={isAuthenticated} 
            setIsAuthenticated={setIsAuthenticated} 
          />
        )}
        <main style={contentWrapperStyle}>
          <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to={isUserOnboarded ? "/dashboard" : "/onboarding"} replace />
                ) : (
                  <LandingPage />
                )
              } 
            />
            <Route 
              path="/login" 
              element={<PublicRoute><AuthPage handleAuthSuccess={handleAuthSuccess} /></PublicRoute>} 
            />
            <Route 
              path="/register" 
              element={<PublicRoute><AuthPage handleAuthSuccess={handleAuthSuccess} /></PublicRoute>} 
            />
            <Route 
              path="/dashboard" 
              element={<ProtectedRoute><Dashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/generate" 
              element={<ProtectedRoute><PostGenerator /></ProtectedRoute>} 
            />
            <Route 
              path="/schedule" 
              element={<ProtectedRoute><SchedulerView /></ProtectedRoute>} 
            />
            <Route 
              path="/feed" 
              element={<ProtectedRoute><SimulatedFeed /></ProtectedRoute>} 
            />
            <Route 
              path="/onboarding" 
              element={
                <ProtectedRoute requiredOnboarding={false}>
                  <OnboardingPage onOnboardingComplete={() => setIsUserOnboarded(true)} />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="*" 
              element={
                <Navigate to={isAuthenticated ? (isUserOnboarded ? "/dashboard" : "/onboarding") : "/"} replace />
              } 
            />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;