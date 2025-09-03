import React, { useEffect, useState, useCallback } from 'react';
import { 
  getPosts, 
  deletePost, 
  updatePost,
  triggerDailyGeneration as apiTriggerDailyGeneration, 
  triggerPostProcessing as apiTriggerPostProcessing
} from '../api/api'; 
import { format, parseISO } from 'date-fns';

function Scheduler() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('scheduled');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEditingPost, setCurrentEditingPost] = useState(null);
  const [editForm, setEditForm] = useState({
    caption: '',
    scheduledTime: ''
  });
  const [modalMessage, setModalMessage] = useState('');
  const [modalType, setModalType] = useState('');

  // Separate function for a silent fetch that doesn't show a loading spinner
  const fetchPostsSilent = useCallback(async (status, page) => {
    setError(null);
    try {
      const response = await getPosts(status, page, 10);
      setPosts(response.data.posts);
      setCurrentPage(response.data.currentPage);
      setTotalPages(response.data.totalPages);
    } catch (err) {
      console.error(`Error fetching ${status} posts:`, err);
      setError(`Failed to load ${status} posts.`);
    }
  }, []);

  // Initial data fetch with loading state
  useEffect(() => {
    const initialFetch = async () => {
      setLoading(true);
      await fetchPostsSilent(filterStatus, currentPage);
      setLoading(false);
    };
    initialFetch();
  }, [filterStatus, currentPage, fetchPostsSilent]);

  // Polling for updates every 30 seconds without showing a loading state
  useEffect(() => {
    const pollInterval = setInterval(() => fetchPostsSilent(filterStatus, currentPage), 30000);
    return () => clearInterval(pollInterval);
  }, [filterStatus, currentPage, fetchPostsSilent]);

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) { 
      try {
        await deletePost(postId);
        setModalMessage('Post deleted successfully!');
        setModalType('success');
        await fetchPostsSilent(filterStatus, currentPage); // Use silent fetch after delete
      } catch (err) {
        console.error('Error deleting post:', err);
        setModalMessage('Failed to delete post.');
        setModalType('error');
      }
    }
  };

  const handleEdit = (post) => {
    setCurrentEditingPost(post);
    setEditForm({
      caption: post.caption,
      scheduledTime: post.scheduledTime ? format(parseISO(post.scheduledTime), "yyyy-MM-dd'T'HH:mm") : ''
    });
    setShowEditModal(true);
    setModalMessage('');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!currentEditingPost) return;

    try {
      const updatedData = {
        caption: editForm.caption,
        scheduledTime: editForm.scheduledTime ? new Date(editForm.scheduledTime).toISOString() : null,
      };
      await updatePost(currentEditingPost._id, updatedData);
      setModalMessage('Post updated successfully!');
      setModalType('success');
      setShowEditModal(false);
      await fetchPostsSilent(filterStatus, currentPage); // Use silent fetch after edit
    } catch (err) {
      console.error('Error updating post:', err);
      setModalMessage('Failed to update post.');
      setModalType('error');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const triggerProcessing = async () => {
    try {
      // FIX: Use the imported apiTriggerPostProcessing function
      await apiTriggerPostProcessing(); 
      setModalMessage('Processing triggered successfully!');
      setModalType('success');
      await fetchPostsSilent(filterStatus, currentPage);
    } catch (err) {
      console.error('Error triggering processing:', err);
      setModalMessage('Failed to trigger processing.');
      setModalType('error');
    }
  };

  const triggerDailyGeneration = async () => {
    try {
      // FIX: Use the imported apiTriggerDailyGeneration function
      await apiTriggerDailyGeneration();
      setModalMessage('Daily generation triggered successfully!');
      setModalType('success');
      await fetchPostsSilent(filterStatus, currentPage);
    } catch (err) {
      console.error('Error triggering daily generation:', err);
      setModalMessage('Failed to trigger daily generation.');
      setModalType('error');
    }
  };

  const closeModal = () => {
    setShowEditModal(false);
    setModalMessage('');
    setModalType('');
  };

  // Main container styles
  const containerStyle = {
    maxWidth: '1200px',
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
    fontSize: '36px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 50%, #06b6d4 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '12px',
  };

  // Filter section styles
  const filterSectionStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '24px',
    marginBottom: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
  };

  const filterTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '16px',
    textAlign: 'center',
  };

  const filterButtonsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
    marginBottom: '20px',
  };

  const filterButtonStyle = (isActive) => ({
    padding: '10px 20px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isActive 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
    boxShadow: isActive ? '0 4px 15px rgba(59, 130, 246, 0.4)' : 'none',
  });

  const actionButtonsStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    justifyContent: 'center',
  };

  const actionButtonStyle = (type) => {
    const baseStyle = {
      padding: '10px 20px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
    };

    switch (type) {
      case 'processing':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
        };
      case 'generation':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
        };
      default:
        return baseStyle;
    }
  };

  // Status message styles
  const statusMessageStyle = (type) => ({
    background: type === 'success' 
      ? 'rgba(16, 185, 129, 0.1)' 
      : 'rgba(239, 68, 68, 0.1)',
    border: type === 'success' 
      ? '1px solid rgba(16, 185, 129, 0.3)' 
      : '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: type === 'success' ? '#6ee7b7' : '#fca5a5',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
  });

  // Posts grid styles
  const postsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  };

  // Post card styles
  const postCardStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(15px)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '24px',
    transition: 'all 0.3s ease',
    position: 'relative',
    overflow: 'hidden',
  };

  const postHeaderStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '16px',
  };

  const postTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: '8px',
  };

  const postMetaStyle = {
    fontSize: '13px',
    color: 'rgba(255, 255, 255, 0.7)',
    marginBottom: '4px',
  };

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
      gap: '4px',
      padding: '4px 8px',
      borderRadius: '12px',
      fontSize: '11px',
      fontWeight: '600',
      background: colors.background,
      border: `1px solid ${colors.border}`,
      color: colors.color,
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    };
  };

  const postImageStyle = {
    width: '100%',
    height: '180px',
    objectFit: 'cover',
    borderRadius: '12px',
    marginBottom: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  };

  const postCaptionStyle = {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    lineHeight: '1.5',
    marginBottom: '16px',
    display: '-webkit-box',
    WebkitLineClamp: 3,
    WebkitBoxOrient: 'vertical',
    overflow: 'hidden',
  };

  const postActionsStyle = {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap',
  };

  const postActionButtonStyle = (type) => {
    const baseStyle = {
      padding: '6px 12px',
      border: 'none',
      borderRadius: '8px',
      fontSize: '12px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    };

    switch (type) {
      case 'edit':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
        };
      case 'delete':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          color: '#ffffff',
        };
      default:
        return baseStyle;
    }
  };

  // Pagination styles
  const paginationStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '8px',
    marginTop: '32px',
  };

  const pageButtonStyle = (isActive) => ({
    padding: '8px 12px',
    border: isActive ? 'none' : '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: isActive 
      ? 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)'
      : 'rgba(255, 255, 255, 0.1)',
    color: isActive ? '#ffffff' : 'rgba(255, 255, 255, 0.8)',
  });

  // Modal styles
  const modalOverlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(15, 23, 42, 0.8)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 2000,
    padding: '20px',
  };

  const modalContentStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '32px',
    maxWidth: '600px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    position: 'relative',
  };

  const modalTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '24px',
    textAlign: 'center',
  };

  const formGroupStyle = {
    marginBottom: '20px',
  };

  const labelStyle = {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '8px',
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: '120px',
    resize: 'vertical',
  };

  const modalButtonsStyle = {
    display: 'flex',
    gap: '12px',
    justifyContent: 'center',
    marginTop: '24px',
  };

  const submitButtonStyle = {
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
  };

  const closeButtonStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.8)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  // Loading and empty states
  const loadingStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#3b82f6',
    fontSize: '18px',
    fontWeight: '500',
  };

  const emptyStateStyle = {
    textAlign: 'center',
    padding: '60px 20px',
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: '16px',
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

  if (loading && posts.length === 0) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle} className="animate-pulse">
          🔄 Loading posts...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle} className="animate-fadeInUp">
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>Content Scheduler</h1>
        <p style={{ color: 'rgba(255, 255, 255, 0.8)', fontSize: '16px', margin: 0 }}>
          Manage your scheduled posts and automation triggers
        </p>
      </div>

      {/* Filter Section */}
      <div style={filterSectionStyle}>
        <h3 style={filterTitleStyle}>📊 Filter by Status</h3>
        <div style={filterButtonsStyle}>
          {['draft', 'scheduled', 'posted', 'failed'].map(status => (
            <button
              key={status}
              style={filterButtonStyle(filterStatus === status)}
              onClick={() => { setFilterStatus(status); setCurrentPage(1); }}
              onMouseEnter={(e) => {
                if (filterStatus !== status) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.transform = 'translateY(-2px)';
                }
              }}
              onMouseLeave={(e) => {
                if (filterStatus !== status) {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }
              }}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </button>
          ))}
        </div>

        <div style={actionButtonsStyle}>
          <button
            style={actionButtonStyle('processing')}
            onClick={triggerProcessing}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
            }}
          >
            ⚡ Trigger Processing
          </button>
          <button
            style={actionButtonStyle('generation')}
            onClick={triggerDailyGeneration}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(139, 92, 246, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(139, 92, 246, 0.4)';
            }}
          >
            🤖 Trigger Daily Generation
          </button>
        </div>
      </div>

      {/* Status Message */}
      {modalMessage && (
        <div style={statusMessageStyle(modalType)}>
          {modalType === 'success' ? '✅' : '⚠️'} {modalMessage}
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div style={errorStyle}>
          ⚠️ {error}
        </div>
      )}

      {/* Posts Grid */}
      {!loading && !error && (
        posts.length > 0 ? (
          <>
            <div style={postsGridStyle}>
              {posts.map(post => (
                <div
                  key={post._id}
                  style={postCardStyle}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.boxShadow = '0 20px 60px rgba(0, 0, 0, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={postHeaderStyle}>
                    <div>
                      <h3 style={postTitleStyle}>{post.occasion}</h3>
                      <div style={statusBadgeStyle(post.status)}>
                        {post.status}
                      </div>
                    </div>
                  </div>

                  <div style={postMetaStyle}>
                    🏷️ Category: {post.category}
                  </div>
                  <div style={postMetaStyle}>
                    👥 Audience: {post.audience}
                  </div>

                  {post.scheduledTime && (
                    <div style={postMetaStyle}>
                      📅 Scheduled: {format(parseISO(post.scheduledTime), 'MMM dd, yyyy hh:mm a')}
                    </div>
                  )}

                  {post.postedTime && (
                    <div style={postMetaStyle}>
                      ✅ Posted: {format(parseISO(post.postedTime), 'MMM dd, yyyy hh:mm a')}
                    </div>
                  )}

                  {post.imageUrl && (
                    <img src={post.imageUrl} alt={post.occasion} style={postImageStyle} />
                  )}

                  <p style={postCaptionStyle}>{post.caption}</p>

                  <div style={postActionsStyle}>
                    {(post.status === 'draft' || post.status === 'scheduled') && (
                      <button
                        style={postActionButtonStyle('edit')}
                        onClick={() => handleEdit(post)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(245, 158, 11, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        ✏️ Edit
                      </button>
                    )}
                    {(post.status === 'draft' || post.status === 'scheduled' || post.status === 'failed') && (
                      <button
                        style={postActionButtonStyle('delete')}
                        onClick={() => handleDelete(post._id)}
                        onMouseEnter={(e) => {
                          e.target.style.transform = 'translateY(-1px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = 'translateY(0)';
                          e.target.style.boxShadow = 'none';
                        }}
                      >
                        🗑️ Delete
                      </button>
                    )}
                  </div>

                  {post.errors && post.errors.length > 0 && (
                    <div style={{
                      marginTop: '12px',
                      padding: '8px 12px',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '8px',
                      fontSize: '12px',
                      color: '#fca5a5',
                    }}>
                      <strong>Errors:</strong>
                      <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                        {post.errors.map((err, idx) => (
                          <li key={idx} style={{ marginBottom: '2px' }}>
                            {format(parseISO(err.timestamp), 'MMM dd, hh:mm a')}: {err.message}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={paginationStyle}>
                <button
                  style={pageButtonStyle(false)}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    style={pageButtonStyle(page === currentPage)}
                    onClick={() => handlePageChange(page)}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  style={pageButtonStyle(false)}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Next →
                </button>
              </div>
            )}
          </>
        ) : (
          <div style={emptyStateStyle}>
            📭 No posts found for this status.
          </div>
        )
      )}

      {/* Edit Modal */}
      {showEditModal && currentEditingPost && (
        <div style={modalOverlayStyle} onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div style={modalContentStyle}>
            <button
              style={{
                position: 'absolute',
                top: '16px',
                right: '16px',
                background: 'none',
                border: 'none',
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: '20px',
                cursor: 'pointer',
              }}
              onClick={closeModal}
            >
              ✕
            </button>

            <h2 style={modalTitleStyle}>✏️ Edit Post</h2>

            {modalMessage && (
              <div style={statusMessageStyle(modalType)}>
                {modalType === 'success' ? '✅' : '⚠️'} {modalMessage}
              </div>
            )}

            <form onSubmit={handleEditSubmit}>
              <div style={formGroupStyle}>
                <label style={labelStyle}>Caption</label>
                <textarea
                  style={textareaStyle}
                  value={editForm.caption}
                  onChange={(e) => setEditForm({ ...editForm, caption: e.target.value })}
                  required
                />
              </div>

              <div style={formGroupStyle}>
                <label style={labelStyle}>Scheduled Time</label>
                <input
                  type="datetime-local"
                  style={inputStyle}
                  value={editForm.scheduledTime}
                  onChange={(e) => setEditForm({ ...editForm, scheduledTime: e.target.value })}
                />
              </div>

              <div style={modalButtonsStyle}>
                <button
                  type="submit"
                  style={submitButtonStyle}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.6)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
                  }}
                >
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  style={closeButtonStyle}
                  onClick={closeModal}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Scheduler;