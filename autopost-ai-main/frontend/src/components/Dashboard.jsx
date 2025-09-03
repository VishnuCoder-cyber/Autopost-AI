import React, { useEffect, useState, useCallback } from 'react';
import {
  getMe,
  getUpcomingSpecialDays,
  getPosts,
  getTodayScheduledPosts,
} from '../api/api';
import { format, isToday, parseISO, isSameDay } from 'date-fns'; // FIX: Imported isSameDay

function Dashboard() {
  const [user, setUser] = useState(null);
  const [commonDays, setCommonDays] = useState([]);
  const [categorySpecificDays, setCategorySpecificDays] = useState([]);
  const [todayPostedPosts, setTodayPostedPosts] = useState([]);
  const [todayScheduledPosts, setTodayScheduledPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isCategoryDatesCollapsed, setIsCategoryDatesCollapsed] = useState(true);
  const [isGlobalDatesCollapsed, setIsGlobalDatesCollapsed] = useState(true);

  // Separate function for a silent fetch that doesn't show a loading spinner
  const fetchDashboardData = useCallback(async () => {
    setError(null);
    try {
      const [
        userResponse,
        upcomingDaysResponse,
        allPostedPostsResponse,
        todayScheduledResponse
      ] = await Promise.all([
        getMe(),
        getUpcomingSpecialDays(),
        getPosts('posted', 1, 100),
        getTodayScheduledPosts(),
      ]);

      setUser(userResponse.data.user);
      setCommonDays(upcomingDaysResponse.data.commonDays || []);
      setCategorySpecificDays(upcomingDaysResponse.data.categorySpecificDays || []);

      const filteredTodayPosts = allPostedPostsResponse.data.posts.filter(post => {
        if (!post.postedTime) return false;
        try {
          const postedDate = parseISO(post.postedTime);
          // FIX: Use isSameDay to correctly filter for posts from today's date
          return !isNaN(postedDate.getTime()) && isSameDay(postedDate, new Date());
        } catch {
          return false;
        }
      });

      setTodayPostedPosts(filteredTodayPosts);
      setTodayScheduledPosts(todayScheduledResponse.data.posts || []);
    } catch (err) {
      console.error('Dashboard fetch error:', err);
      if (err.response?.status === 401) {
        setError('Authentication failed. Please login again.');
      } else {
        setError('Failed to load dashboard data.');
      }
    }
  }, []);

  // Initial data fetch with loading state
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchDashboardData();
      setLoading(false);
    };
    initialFetch();
  }, [fetchDashboardData]);

  // Polling for updates every minute without showing a loading state
  useEffect(() => {
    const pollInterval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(pollInterval);
  }, [fetchDashboardData]);
  
  const toggleCategoryDates = () => {
    setIsCategoryDatesCollapsed(!isCategoryDatesCollapsed);
  };
  
  const toggleGlobalDates = () => {
    setIsGlobalDatesCollapsed(!isGlobalDatesCollapsed);
  };

  // Main container styles
  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    position: 'relative',
  };

  // Header styles
  const headerStyle = {
    textAlign: 'center',
    marginBottom: '40px',
    padding: '40px 20px',
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
  };

  const titleStyle = {
    fontSize: '48px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '16px',
    letterSpacing: '-0.02em',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '18px',
    fontWeight: '400',
    maxWidth: '600px',
    margin: '0 auto',
  };

  // Section styles
  const sectionStyle = {
    marginBottom: '40px',
    padding: '32px',
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
    transition: 'all 0.3s ease',
  };

  const sectionTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  };

  const iconStyle = {
    fontSize: '28px',
    padding: '8px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };
  
  const collapsibleButtonStyle = {
    background: 'none',
    border: 'none',
    color: 'white',
    fontSize: '24px',
    marginLeft: 'auto',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
    display: 'flex',
    alignItems: 'center',
  };

  const arrowStyle = (isCollapsed) => ({
    transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
    transition: 'transform 0.3s ease',
  });

  // Styles for the collapsed CTA message
  const collapsedCtaStyle = {
    textAlign: 'center',
    padding: '40px 20px',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const collapsedCtaTextStyle = {
    fontSize: '18px',
    fontWeight: '500',
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: '16px',
  };
  
  const collapsedCtaButtonStyle = {
    padding: '12px 24px',
    borderRadius: '12px',
    border: 'none',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    color: '#ffffff',
    boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)',
    transition: 'all 0.3s ease',
  };

  const settingsCardStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '20px',
  };

  const settingItemStyle = {
    padding: '20px',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
  };

  const settingLabelStyle = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '8px',
    fontWeight: '500',
  };

  const settingValueStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
  };

  const statusBadgeStyle = (enabled) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    padding: '6px 12px',
    borderRadius: '20px',
    fontSize: '14px',
    fontWeight: '600',
    background: enabled 
      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
      : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
    color: '#ffffff',
    boxShadow: enabled 
      ? '0 4px 12px rgba(16, 185, 129, 0.3)'
      : '0 4px 12px rgba(239, 68, 68, 0.3)',
  });

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
    gap: '24px',
  };

  const postCardStyle = (isToday = false) => ({
    background: isToday 
      ? 'rgba(59, 130, 246, 0.1)' 
      : 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px)',
    borderRadius: '16px',
    border: isToday 
      ? '1px solid rgba(59, 130, 246, 0.3)' 
      : '1px solid rgba(255, 255, 255, 0.1)',
    padding: '20px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    overflow: 'hidden',
    position: 'relative',
  });

  const postImageStyle = {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginTop: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const postTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
    lineHeight: '1.4',
  };

  const postMetaStyle = {
    fontSize: '14px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '6px',
  };

  const todayBadgeStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    color: '#ffffff',
    padding: '4px 8px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(245, 158, 11, 0.4)',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
  };

  const loadingStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#3b82f6',
    fontSize: '18px',
    fontWeight: '500',
  };

  const errorStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#ef4444',
    fontSize: '18px',
    fontWeight: '600',
    background: 'rgba(239, 68, 68, 0.1)',
    borderRadius: '16px',
    border: '1px solid rgba(239, 68, 68, 0.3)',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle} className="animate-pulse">
          🔄 Loading your dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={errorStyle}>
          ⚠️ {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="animate-fadeInUp">
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Dashboard</h1>
        <p style={subtitleStyle}>
          Monitor your automated content strategy and upcoming opportunities
        </p>
      </div>

      {user && (
        <>
          {/* Automation Settings */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <div style={iconStyle}>⚙️</div>
              Automation Settings
            </h2>
            <div style={settingsCardStyle}>
              <div style={settingItemStyle}>
                <div style={settingLabelStyle}>Primary Category</div>
                <div style={settingValueStyle}>
                  {user.preferences.defaultCategory || 'Not set'}
                </div>
              </div>
              <div style={settingItemStyle}>
                <div style={settingLabelStyle}>Auto-Generate Posts</div>
                <div style={settingValueStyle}>
                  <span style={statusBadgeStyle(user.preferences.autoGeneratePosts)}>
                    {user.preferences.autoGeneratePosts ? '✅ Enabled' : '❌ Disabled'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Scheduled Posts */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <div style={iconStyle}>📅</div>
              Today's Scheduled Posts
            </h2>
            {todayScheduledPosts.length > 0 ? (
              <div style={gridStyle}>
                {todayScheduledPosts.map((post) => (
                  <div
                    key={post._id}
                    style={postCardStyle(true)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(59, 130, 246, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={postTitleStyle}>{post.occasion}</div>
                    <div style={postMetaStyle}>
                      📍 Scheduled: {format(parseISO(post.scheduledTime), 'hh:mm a')}
                    </div>
                    <div style={postMetaStyle}>
                      🏷️ Category: {post.category}
                    </div>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt={post.occasion} style={postImageStyle} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={emptyStateStyle}>
                📭 No scheduled posts for today. Time to create some content!
              </div>
            )}
          </div>

          {/* Today's Posted Content */}
          <div style={sectionStyle}>
            <h2 style={sectionTitleStyle}>
              <div style={iconStyle}>✨</div>
              Today's Published Posts ({format(new Date(), 'MMM dd, yyyy')})
            </h2>
            {todayPostedPosts.length > 0 ? (
              <div style={gridStyle}>
                {todayPostedPosts.map((post) => (
                  <div
                    key={post._id}
                    style={postCardStyle(true)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 20px 60px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div style={todayBadgeStyle}>Published</div>
                    <div style={postTitleStyle}>{post.occasion}</div>
                    <div style={postMetaStyle}>
                      🕐 Posted: {format(parseISO(post.postedTime), 'hh:mm a')}
                    </div>
                    <div style={postMetaStyle}>
                      🏷️ Category: {post.category}
                    </div>
                    {post.imageUrl && (
                      <img src={post.imageUrl} alt={post.occasion} style={postImageStyle} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div style={emptyStateStyle}>
                📝 No posts published today yet.
              </div>
            )}
          </div>

          {/* Upcoming Category-Specific Days */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ ...sectionTitleStyle, margin: 0 }}>
                <div style={iconStyle}>🎯</div>
                Upcoming {user.preferences.defaultCategory} Opportunities
              </h2>
              <button onClick={toggleCategoryDates} style={collapsibleButtonStyle}>
                <span style={arrowStyle(isCategoryDatesCollapsed)}>▼</span>
              </button>
            </div>
            {/* Show content only if not collapsed */}
            {!isCategoryDatesCollapsed ? (
              categorySpecificDays.length > 0 ? (
                <div style={gridStyle}>
                  {categorySpecificDays.map((day, index) => (
                    <div
                      key={index}
                      style={postCardStyle(isToday(parseISO(day.date)))}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(6, 182, 212, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {isToday(parseISO(day.date)) && <div style={todayBadgeStyle}>Today!</div>}
                      <div style={postTitleStyle}>{day.occasion}</div>
                      <div style={postMetaStyle}>
                        📅 Date: {format(parseISO(day.date), 'MMM dd, yyyy')}
                      </div>
                      <div style={postMetaStyle}>
                        🏷️ Category: {day.category}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={emptyStateStyle}>
                  🔍 No upcoming special days for your category. Consider expanding your content strategy!
                </div>
              )
            ) : (
              // Display CTA when collapsed
              <div style={collapsedCtaStyle}>
                <p style={collapsedCtaTextStyle}>Want to see more upcoming opportunities?</p>
                <button 
                  onClick={toggleCategoryDates}
                  style={collapsedCtaButtonStyle}
                >
                  See All
                </button>
              </div>
            )}
          </div>

          {/* Global Special Days */}
          <div style={sectionStyle}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ ...sectionTitleStyle, margin: 0 }}>
                <div style={iconStyle}>🌍</div>
                Global & National Events
              </h2>
              <button onClick={toggleGlobalDates} style={collapsibleButtonStyle}>
                <span style={arrowStyle(isGlobalDatesCollapsed)}>▼</span>
              </button>
            </div>
            {/* Show content only if not collapsed */}
            {!isGlobalDatesCollapsed ? (
              commonDays.length > 0 ? (
                <div style={gridStyle}>
                  {commonDays.map((day, index) => (
                    <div
                      key={index}
                      style={postCardStyle(isToday(parseISO(day.date)))}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 20px 60px rgba(168, 85, 247, 0.4)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      {isToday(parseISO(day.date)) && <div style={todayBadgeStyle}>Today!</div>}
                      <div style={postTitleStyle}>{day.occasion}</div>
                      <div style={postMetaStyle}>
                        📅 Date: {format(parseISO(day.date), 'MMM dd, yyyy')}
                      </div>
                      <div style={postMetaStyle}>
                        🏷️ Category: {day.category}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={emptyStateStyle}>
                  🌐 No upcoming global events found.
                </div>
              )
            ) : (
              // Display CTA when collapsed
              <div style={collapsedCtaStyle}>
                <p style={collapsedCtaTextStyle}>Want to see more upcoming events?</p>
                <button 
                  onClick={toggleGlobalDates}
                  style={collapsedCtaButtonStyle}
                >
                  See All
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;