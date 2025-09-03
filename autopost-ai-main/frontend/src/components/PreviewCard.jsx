import React from 'react';

function PreviewCard({ post }) {
  // Empty state styles - moved to the top
  const emptyCardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '40px 24px', // This was the duplicate key, keeping the more specific value
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    textAlign: 'center',
  };

  const emptyIconStyle = {
    fontSize: '48px',
    marginBottom: '16px',
  };

  const emptyTextStyle = {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
    margin: 0,
  };

  if (!post) {
    return (
      <div style={emptyCardStyle}>
        <div style={emptyIconStyle}>📭</div>
        <p style={emptyTextStyle}>No post data available for preview</p>
      </div>
    );
  }

  // Main card container styles
  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '24px',
    maxWidth: '500px',
    margin: '0 auto',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)',
    position: 'relative',
    overflow: 'hidden',
    transition: 'all 0.3s ease',
  };

  // Decorative gradient overlay
  const gradientOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #3b82f6 0%, #06b6d4 50%, #8b5cf6 100%)',
    borderRadius: '20px 20px 0 0',
  };

  // Header styles
  const headerStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '20px',
    paddingBottom: '16px',
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const avatarStyle = {
    width: '48px',
    height: '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
    color: '#ffffff',
    border: '2px solid rgba(255, 255, 255, 0.2)',
  };

  const userInfoStyle = {
    flex: 1,
  };

  const usernameStyle = {
    fontSize: '16px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '4px',
  };

  const timestampStyle = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.6)',
  };

  // Image styles
  const imageContainerStyle = {
    width: '100%',
    marginBottom: '16px',
    borderRadius: '12px',
    overflow: 'hidden',
    position: 'relative',
  };

  const imageStyle = {
    width: '100%',
    height: '280px',
    objectFit: 'cover',
    display: 'block',
    transition: 'transform 0.3s ease',
  };

  const imageOverlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.1) 100%)',
    pointerEvents: 'none',
  };

  // Caption styles
  const captionContainerStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const captionStyle = {
    color: '#ffffff',
    fontSize: '14px',
    lineHeight: '1.6',
    whiteSpace: 'pre-wrap',
    margin: 0,
  };

  // Metadata styles
  const metadataStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  };

  const metaItemStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    padding: '8px 12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const metaLabelStyle = {
    fontSize: '12px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '2px',
    fontWeight: '500',
  };

  const metaValueStyle = {
    fontSize: '13px',
    color: '#ffffff',
    fontWeight: '600',
  };

  // Status badge styles
  const statusBadgeStyle = (status) => {
    let colors = {
      background: 'rgba(107, 114, 128, 0.2)',
      border: 'rgba(107, 114, 128, 0.3)',
      color: '#d1d5db'
    };

    switch (status) {
      case 'draft':
        colors = {
          background: 'rgba(245, 158, 11, 0.2)',
          border: 'rgba(245, 158, 11, 0.3)',
          color: '#fbbf24'
        };
        break;
      case 'scheduled':
        colors = {
          background: 'rgba(59, 130, 246, 0.2)',
          border: 'rgba(59, 130, 246, 0.3)',
          color: '#60a5fa'
        };
        break;
      case 'posting':
        colors = {
          background: 'rgba(6, 182, 212, 0.2)',
          border: 'rgba(6, 182, 212, 0.3)',
          color: '#22d3ee'
        };
        break;
      case 'posted':
        colors = {
          background: 'rgba(16, 185, 129, 0.2)',
          border: 'rgba(16, 185, 129, 0.3)',
          color: '#34d399'
        };
        break;
      case 'failed':
        colors = {
          background: 'rgba(239, 68, 68, 0.2)',
          border: 'rgba(239, 68, 68, 0.3)',
          color: '#f87171'
        };
        break;
      default: // Added a default case here
        break;
    }

    return {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '20px',
      fontSize: '12px',
      fontWeight: '600',
      background: colors.background,
      border: `1px solid ${colors.border}`,
      color: colors.color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };
  };

  // Get status emoji
  const getStatusEmoji = (status) => {
    switch (status) {
      case 'draft': return '📝';
      case 'scheduled': return '⏰';
      case 'posting': return '📤';
      case 'posted': return '✅';
      case 'failed': return '❌';
      default: return '📄';
    }
  };

  return (
    <div 
      style={cardStyle}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-5px)';
        e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
      }}
    >
      {/* Gradient overlay */}
      <div style={gradientOverlayStyle}></div>

      {/* Header */}
      <div style={headerStyle}>
        <div style={avatarStyle}>
          AI
        </div>
        <div style={userInfoStyle}>
          <div style={usernameStyle}>AutoPost AI</div>
          <div style={timestampStyle}>Just now</div>
        </div>
        <div style={statusBadgeStyle(post.status)}>
          {getStatusEmoji(post.status)} {post.status}
        </div>
      </div>

      {/* Post Image */}
      {post.imageUrl && (
        <div style={imageContainerStyle}>
          <img
            src={post.imageUrl}
            alt={post.occasion}
            style={imageStyle}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://placehold.co/500x280/1e293b/3b82f6?text=Image+Not+Available";
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.05)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
            }}
          />
          <div style={imageOverlayStyle}></div>
        </div>
      )}

      {/* Post Metadata */}
      <div style={metadataStyle}>
        <div style={metaItemStyle}>
          <div style={metaLabelStyle}>Occasion</div>
          <div style={metaValueStyle}>🎉 {post.occasion}</div>
        </div>
        <div style={metaItemStyle}>
          <div style={metaLabelStyle}>Category</div>
          <div style={metaValueStyle}>🏷️ {post.category}</div>
        </div>
        <div style={metaItemStyle}>
          <div style={metaLabelStyle}>Audience</div>
          <div style={metaValueStyle}>👥 {post.audience}</div>
        </div>
      </div>

      {/* Scheduled Time (if available) */}
      {post.scheduledTime && (
        <div style={metaItemStyle}>
          <div style={metaLabelStyle}>Scheduled For</div>
          <div style={metaValueStyle}>
            📅 {new Date(post.scheduledTime).toLocaleString()}
          </div>
        </div>
      )}

      {/* Caption */}
      <div style={captionContainerStyle}>
        <p style={captionStyle}>{post.caption}</p>
      </div>

      {/* Engagement Simulation */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-around',
        padding: '12px 0',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        marginTop: '8px',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
        }}>
          <span style={{ fontSize: '16px' }}>❤️</span>
          {Math.floor(Math.random() * 500) + 50}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
        }}>
          <span style={{ fontSize: '16px' }}>💬</span>
          {Math.floor(Math.random() * 50) + 5}
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '14px',
        }}>
          <span style={{ fontSize: '16px' }}>↗️</span>
          {Math.floor(Math.random() * 25) + 2}
        </div>
      </div>
    </div>
  );
}

export default PreviewCard;