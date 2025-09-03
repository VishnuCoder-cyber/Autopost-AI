// frontend/src/components/SimulatedFeed.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getSimulatedFeedPosts } from '../api/api';
import { format } from 'date-fns';

function SimulatedFeed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = useCallback(async () => {
    setError(null);
    const cachedPosts = localStorage.getItem('simulatedFeedPosts');
    if (cachedPosts) {
      try {
        const parsedPosts = JSON.parse(cachedPosts);
        setPosts(prevPosts => {
          if (JSON.stringify(parsedPosts) !== JSON.stringify(prevPosts)) {
            return parsedPosts;
          }
          return prevPosts;
        });
        setLoading(false);
      } catch (e) {
        console.error('Error parsing cached posts:', e);
        localStorage.removeItem('simulatedFeedPosts');
      }
    } else {
      setLoading(true);
    }

    try {
      const response = await getSimulatedFeedPosts();
      const newPosts = response.data.posts;
      setPosts(prevPosts => {
        if (JSON.stringify(newPosts) !== JSON.stringify(prevPosts)) {
          localStorage.setItem('simulatedFeedPosts', JSON.stringify(newPosts));
          return newPosts;
        } else {
          return prevPosts;
        }
      });
    } catch (err) {
      console.error('Error fetching simulated feed posts:', err);
      setError(err.response?.data?.message || 'Failed to fetch posts for the simulated feed.');
      if (!cachedPosts) {
        setLoading(false);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
    const pollInterval = setInterval(fetchPosts, 15000);
    return () => clearInterval(pollInterval);
  }, [fetchPosts]);

  const palette = {
    darkGlass: 'rgba(15, 23, 42, 0.4)',
    lightGlass: 'rgba(255, 255, 255, 0.05)',
    primaryBlue: '#3b82f6',
    accentCyan: '#06b6d4',
    lightText: '#e2e8f0',
    grayText: '#94a3b8',
    glassBorder: 'rgba(255, 255, 255, 0.1)',
  };

  const containerStyle = {
    padding: '40px',
    maxWidth: '700px',
    margin: '40px auto',
    backgroundColor: palette.darkGlass,
    borderRadius: '24px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${palette.glassBorder}`,
  };

  const headingStyle = {
    fontSize: '2.5em',
    background: `linear-gradient(135deg, ${palette.primaryBlue}, ${palette.accentCyan})`,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '30px',
    borderBottom: `2px solid ${palette.glassBorder}`,
    paddingBottom: '10px',
    textAlign: 'center',
    fontWeight: '700',
  };

  const postCardStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
    marginBottom: '25px',
    overflow: 'hidden',
    border: `1px solid ${palette.glassBorder}`,
    backdropFilter: 'blur(8px)',
    transition: 'all 0.3s ease',
  };

  const postCardHoverStyle = {
    transform: 'translateY(-5px)',
    boxShadow: '0 10px 30px rgba(0,0,0,0.4)',
  };

  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '15px',
    borderBottom: `1px solid ${palette.glassBorder}`,
  };

  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    marginRight: '10px',
    objectFit: 'cover',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.2em',
    fontWeight: 'bold',
    background: `linear-gradient(135deg, ${palette.primaryBlue} 0%, ${palette.accentCyan} 100%)`,
    color: '#1e293b',
  };

  const usernameStyle = {
    fontWeight: 'bold',
    color: palette.lightText,
    fontSize: '1.1em',
  };

  const imageContainerStyle = {
    width: '100%',
    maxHeight: '450px',
    overflow: 'hidden',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  };

  const imageStyle = {
    width: '100%',
    height: 'auto',
    display: 'block',
    objectFit: 'cover',
  };

  const contentStyle = {
    padding: '15px',
    color: palette.lightText,
    fontSize: '0.95em',
    lineHeight: '1.5',
  };

  const engagementBar = {
    display: 'flex',
    justifyContent: 'space-around',
    padding: '10px 15px',
    borderTop: `1px solid ${palette.glassBorder}`,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  };

  const engagementItem = {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    color: palette.grayText,
    fontSize: '0.9em',
    fontWeight: '500',
    transition: 'color 0.3s ease, transform 0.3s ease',
    cursor: 'pointer',
  };
  
  const engagementItemHover = {
    color: palette.primaryBlue,
    transform: 'translateY(-2px)',
  };

  const iconStyle = {
    fontSize: '1.2em',
    color: palette.accentCyan,
  };

  const timestampStyle = {
    fontSize: '0.8em',
    color: palette.grayText,
    padding: '0 15px 15px',
    textAlign: 'right',
  };

  const retryButtonStyle = {
    marginTop: '15px',
    padding: '12px 25px',
    backgroundColor: palette.primaryBlue,
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 'bold',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  };

  const retryButtonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 20px rgba(0,0,0,0.3)',
  };

  if (loading && posts.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: palette.lightText }}>
        <p>Loading simulated feed...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: '#dc2626' }}>
        <p>Error: {error}</p>
        <p>Please ensure your backend is running and you are logged in.</p>
        <button
          onClick={fetchPosts}
          style={retryButtonStyle}
          onMouseEnter={(e) => Object.assign(e.target.style, retryButtonHoverStyle)}
          onMouseLeave={(e) => Object.assign(e.target.style, retryButtonStyle)}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Your Simulated Social Feed</h1>
      {posts.length === 0 ? (
        <p style={{ textAlign: 'center', color: palette.grayText }}>No posts found in your simulated feed yet. Generate and schedule some posts!</p>
      ) : (
        posts.map((post) => (
          <div 
            key={post._id} 
            style={postCardStyle}
            onMouseEnter={(e) => Object.assign(e.currentTarget.style, postCardHoverStyle)}
            onMouseLeave={(e) => Object.assign(e.currentTarget.style, postCardStyle)}
            className="animate-fadeInUp"
          >
            <div style={headerStyle}>
              <div style={avatarStyle}>
                {post.userId && post.userId.username ? post.userId.username[0].toUpperCase() : 'U'}
              </div>
              <span style={usernameStyle}>{post.userId ? post.userId.username || 'Unknown User' : 'Unknown User'}</span>
            </div>
            <div style={imageContainerStyle}>
              <img src={post.imageUrl} alt={post.occasion} style={imageStyle} />
            </div>
            <div style={contentStyle}>
              <p>{post.caption}</p>
            </div>
            <div style={engagementBar}>
              <div 
                style={engagementItem}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, engagementItemHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, engagementItem)}
              >
                <span style={iconStyle}>❤️</span> {post.engagement.likes} Likes
              </div>
              <div 
                style={engagementItem}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, engagementItemHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, engagementItem)}
              >
                <span style={iconStyle}>💬</span> {post.engagement.comments} Comments
              </div>
              <div 
                style={engagementItem}
                onMouseEnter={(e) => Object.assign(e.currentTarget.style, engagementItemHover)}
                onMouseLeave={(e) => Object.assign(e.currentTarget.style, engagementItem)}
              >
                <span style={iconStyle}>↗️</span> {post.engagement.shares} Shares
              </div>
            </div>
            <p style={timestampStyle}>
            Posted: {post.postedTime ? format(new Date(post.postedTime), 'MMM dd, yyyy hh:mm a') : 'N/A'}
            </p>
          </div>
        ))
      )}
    </div>
  );
}

export default SimulatedFeed;