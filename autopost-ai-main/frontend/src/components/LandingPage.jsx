import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LandingPage.css'; // <-- ADD THIS LINE

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('monthly');

  const palette = {
    primaryBlue: '#46A5F1',
    accentCyan: '#89D3F8',
    lightText: '#E0F7FA',
    darkText: '#263238',
    grayText: '#B0BEC5',
  };

  const dynamicStyles = {
    btn: {
      padding: '0.75rem 1.5rem',
      borderRadius: '50px',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '0.9rem',
      transition: 'all 0.3s ease',
      border: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
    },
    btnPrimary: {
      background: `linear-gradient(135deg, ${palette.primaryBlue} 0%, ${palette.accentCyan} 100%)`,
      color: palette.darkText,
      boxShadow: '0 4px 20px rgba(0, 0, 0, 0.2)',
    },
    btnSecondary: {
      background: 'transparent',
      color: palette.lightText,
      border: `2px solid ${palette.grayText}`,
    },
    btnLarge: {
      padding: '1rem 2rem',
      fontSize: '1.1rem',
    },
  };

  return (
    <div className="landing-container">
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">AutoPost AI</h1>
          <p className="hero-subtitle">
            Revolutionize your social media with AI-powered content creation, intelligent scheduling, 
            and stunning visuals. Transform your brand presence effortlessly.
          </p>
          <div className="hero-buttons">
            <Link to="/register" className="btn" style={{...dynamicStyles.btn, ...dynamicStyles.btnPrimary, ...dynamicStyles.btnLarge}}>
              🚀 Start Free Trial
            </Link>
            <Link to="/demo" className="btn" style={{...dynamicStyles.btn, ...dynamicStyles.btnSecondary, ...dynamicStyles.btnLarge}}>
              📹 Watch Demo
            </Link>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section">
        <h2 className="section-title">How It Works</h2>
        <div className="grid-container">
          <div className="card step-card">
            <div className="step-number">1</div>
            <div className="card-icon">🎯</div>
            <h3 className="card-title">Define Your Brand</h3>
            <p className="card-text">
              Tell our AI about your brand voice, target audience, and content preferences. 
              Set up your unique social media strategy in minutes.
            </p>
          </div>
          <div className="card step-card">
            <div className="step-number">2</div>
            <div className="card-icon">✨</div>
            <h3 className="card-title">AI Creates Magic</h3>
            <p className="card-text">
              Watch as Gemini crafts engaging captions, generates relevant hashtags, 
              and Unsplash provides stunning visuals tailored to your content.
            </p>
          </div>
          <div className="card step-card">
            <div className="step-number">3</div>
            <div className="card-icon">⚡</div>
            <h3 className="card-title">Automate & Optimize</h3>
            <p className="card-text">
              Schedule posts for optimal engagement times across all platforms. 
              Track performance and let AI optimize your future content.
            </p>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <h2 className="section-title">Powerful Features</h2>
        <div className="grid-container">
          <div className="card">
            <div className="card-icon">🤖</div>
            <h3 className="card-title">AI Content Generation</h3>
            <p className="card-text">
              Advanced Gemini powered content creation that understands your brand voice 
              and creates engaging, platform-optimized posts.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">🎨</div>
            <h3 className="card-title">Visual Intelligence</h3>
            <p className="card-text">
              Source high-quality, copyright-free images from Unsplash, perfectly matched to your content automatically.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">📅</div>
            <h3 className="card-title">Smart Scheduling</h3>
            <p className="card-text">
              Post at optimal times across all platforms with our intelligent scheduling system 
              that learns when your audience is most active.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">📊</div>
            <h3 className="card-title">Analytics & Insights</h3>
            <p className="card-text">
              Deep performance analytics help you understand what works, 
              with AI recommendations for improving engagement.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">🔗</div>
            <h3 className="card-title">Multi-Platform</h3>
            <p className="card-text">
              Seamlessly manage Instagram, Facebook, Twitter, LinkedIn, and TikTok 
              from one unified, intuitive dashboard.
            </p>
          </div>
          <div className="card">
            <div className="card-icon">🛡️</div>
            <h3 className="card-title">Enterprise Security</h3>
            <p className="card-text">
              Bank-level encryption, secure API connections, and compliance with 
              international data protection standards.
            </p>
          </div>
        </div>
      </section>

      <section id="pricing" className="section">
        <h2 className="section-title">Simple, Transparent Pricing</h2>
        <div className="pricing-container">
          <div className="pricing-toggle">
            <button 
              className={`toggle-button ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              Monthly
            </button>
            <button 
              className={`toggle-button ${activeTab === 'yearly' ? 'active' : ''}`}
              onClick={() => setActiveTab('yearly')}
            >
              Yearly (Save 20%)
            </button>
          </div>
        </div>
        
        <div className="grid-container">
          <div className="pricing-card">
            <h3 className="card-title">Starter</h3>
            <div className="price">
              ₹{activeTab === 'monthly' ? '0' : '0'}
              <span className="price-unit">/{activeTab === 'monthly' ? 'month' : 'year'}</span>
            </div>
            <ul className="feature-list">
              <li>✅ 5 posts per day</li>
              <li>✅ Basic AI content</li>
              <li>✅ Unsplash images</li>
              <li>✅ 2 social platforms</li>
              <li>✅ Email support</li>
            </ul>
            <Link to="/register" className="btn" style={{...dynamicStyles.btn, ...dynamicStyles.btnSecondary, width: '100%', justifyContent: 'center'}}>
              Start Free
            </Link>
          </div>
          
          <div className={`pricing-card pro`}>
            <div className="badge">Most Popular</div>
            <h3 className="card-title">Pro</h3>
            <div className="price">
              ₹{activeTab === 'monthly' ? '499' : '4,790'}
              <span className="price-unit">/{activeTab === 'monthly' ? 'month' : 'year'}</span>
            </div>
            <ul className="feature-list">
              <li>🚀 Unlimited posts</li>
              <li>🚀 Gemini powered content</li>
              <li>🚀 Unsplash image sourcing</li>
              <li>🚀 All social platforms</li>
              <li>🚀 Advanced analytics</li>
              <li>🚀 Priority support</li>
            </ul>
            <Link to="/register" className="btn" style={{...dynamicStyles.btn, ...dynamicStyles.btnPrimary, width: '100%', justifyContent: 'center'}}>
              Start Pro Trial
            </Link>
          </div>
          
          <div className="pricing-card">
            <h3 className="card-title">Enterprise</h3>
            <div className="price">
              Custom
              <span className="price-unit">/month</span>
            </div>
            <ul className="feature-list">
              <li>⭐ Everything in Pro</li>
              <li>⭐ White-label solution</li>
              <li>⭐ Custom integrations</li>
              <li>⭐ Dedicated support</li>
              <li>⭐ SLA guarantee</li>
            </ul>
            <Link to="/contact" className="btn" style={{...dynamicStyles.btn, ...dynamicStyles.btnSecondary, width: '100%', justifyContent: 'center'}}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      <section id="testimonials" className="section">
        <h2 className="section-title">What Our Users Say</h2>
        <div className="grid-container">
          <div className="card">
            <p className="card-text">
              "AutoPost AI transformed our social media strategy completely. The AI-generated content 
              from Gemini is so good, our engagement increased by 300% in just two months!"
            </p>
            <h4 className="card-title" style={{fontSize: '1.1rem', marginTop: '1.5rem'}}>
              - Sarah Chen, Marketing Director
            </h4>
          </div>
          <div className="card">
            <p className="card-text">
              "As a small business owner, I don't have time for social media. AutoPost AI handles 
              everything while keeping my brand voice authentic. It's like having a marketing team!"
            </p>
            <h4 className="card-title" style={{fontSize: '1.1rem', marginTop: '1.5rem'}}>
              - Mike Rodriguez, Restaurant Owner
            </h4>
          </div>
          <div className="card">
            <p className="card-text">
              "The visual content from Unsplash is incredible. It provides images that perfectly 
              match our posts, and the scheduling automation saves us 10+ hours per week."
            </p>
            <h4 className="card-title" style={{fontSize: '1.1rem', marginTop: '1.5rem'}}>
              - Emma Thompson, Content Creator
            </h4>
          </div>
        </div>
      </section>

      <section id="contact" className="cta-section">
        <h2 className="cta-title">Ready to Transform Your Social Media?</h2>
        <p className="cta-subtitle">
          Join thousands of businesses already using AutoPost AI to create engaging content, 
          save time, and grow their audience with the power of artificial intelligence.
        </p>
        <Link to="/register" className="btn" style={{...dynamicStyles.btn, ...dynamicStyles.btnLarge, background: palette.lightText, color: palette.darkText}}>
          🚀 Start Your Free Trial Now
        </Link>
      </section>
    </div>
  );
};

export default React.memo(LandingPage);