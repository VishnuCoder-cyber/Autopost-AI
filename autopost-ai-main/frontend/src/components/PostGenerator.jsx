import React, { useState, useEffect, useRef } from 'react';
import { generatePost, getGenerationOptions, schedulePost } from '../api/api';
import PreviewCard from './PreviewCard';
import DateTimePickerModal from './DateTimePickerModal';

function PostGenerator() {
  const [occasion, setOccasion] = useState('');
  const [category, setCategory] = useState('');
  const [audience, setAudience] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [generatedPost, setGeneratedPost] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [options, setOptions] = useState({ categories: [], audiences: [], occasions: [] });
  const [saveStatus, setSaveStatus] = useState('');
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);

  // Create a ref for the preview section
  const previewRef = useRef(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await getGenerationOptions();
        setOptions(response.data);
        if (response.data.categories.length > 0) setCategory(response.data.categories[0]);
        if (response.data.audiences.length > 0) setAudience(response.data.audiences[0]);
        if (response.data.occasions.length > 0) setOccasion(response.data.occasions[0]);
      } catch (err) {
        console.error('Error fetching generation options:', err);
        if (err.response && err.response.status === 401) {
          setError('Authentication failed. Please ensure you are logged in and the backend is running.');
        } else {
          setError('Failed to load generation options. Please ensure backend is running.');
        }
      }
    };
    fetchOptions();
  }, []);

  // New useEffect to scroll to the preview section when a post is generated
  useEffect(() => {
    if (generatedPost && previewRef.current) {
      previewRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [generatedPost]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setGeneratedPost(null);
    setSaveStatus('');

    try {
      const postData = { occasion, category, audience, customPrompt };
      const response = await generatePost(postData);
      setGeneratedPost(response.data.post);
    } catch (err) {
      console.error('Error generating post:', err);
      setError(err.response?.data?.message || 'Failed to generate post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAsDraft = async () => {
    if (!generatedPost) {
      setSaveStatus('No post to save!');
      return;
    }
    setSaveStatus('Saving as draft...');
    try {
      if (generatedPost.status === 'draft') {
        setSaveStatus('Post already saved as draft!');
      } else {
        setSaveStatus('Post saved as draft!');
      }
    } catch (err) {
      console.error('Error saving post as draft:', err);
      setSaveStatus('Failed to save as draft.');
    }
  };

  const handleScheduleNow = () => {
    if (!generatedPost) {
      setSaveStatus('No post to schedule!');
      return;
    }
    setIsScheduleModalOpen(true);
  };

  const handleCloseScheduleModal = () => {
    setIsScheduleModalOpen(false);
    setSaveStatus('');
  };

  const handleScheduleConfirm = async (postId, scheduledTime) => {
    setSaveStatus('Scheduling post...');
    try {
      const response = await schedulePost(postId, scheduledTime);
      setGeneratedPost(response.data.post);
      setSaveStatus('Post scheduled successfully!');
    } catch (err) {
      console.error('Error scheduling post:', err);
      setSaveStatus(err.response?.data?.message || 'Failed to schedule post.');
    } finally {
      setIsScheduleModalOpen(false);
    }
  };

  // Main container styles
  const containerStyle = {
    maxWidth: '900px',
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

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '18px',
    fontWeight: '400',
    maxWidth: '600px',
    margin: '0 auto',
  };

  // Form container styles
  const formContainerStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '32px',
    marginBottom: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
  };

  const formGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '24px',
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

  const selectStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    outline: 'none',
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
    backgroundPosition: 'right 12px center',
    backgroundRepeat: 'no-repeat',
    backgroundSize: '16px',
    paddingRight: '40px',
  };

  const textareaStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '16px',
    color: '#ffffff',
    fontSize: '14px',
    fontFamily: 'inherit',
    transition: 'all 0.3s ease',
    outline: 'none',
    resize: 'vertical',
    minHeight: '120px',
    gridColumn: '1 / -1',
  };

  const focusStyle = {
    borderColor: '#3b82f6',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
  };

  // Button styles
  const generateButtonStyle = {
    background: loading 
      ? 'rgba(107, 114, 128, 0.5)' 
      : 'linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)',
    color: '#ffffff',
    border: 'none',
    borderRadius: '12px',
    padding: '16px 32px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: loading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    width: '100%',
    marginTop: '8px',
    boxShadow: loading 
      ? 'none' 
      : '0 8px 25px rgba(59, 130, 246, 0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  };

  const actionButtonsStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '24px',
    flexWrap: 'wrap',
  };

  const actionButtonStyle = (type) => {
    const baseStyle = {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      minWidth: '140px',
      justifyContent: 'center',
    };

    switch (type) {
      case 'draft':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(16, 185, 129, 0.4)',
        };
      case 'schedule':
        return {
          ...baseStyle,
          background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          color: '#ffffff',
          boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
        };
      default:
        return baseStyle;
    }
  };

  // Status message styles
  const statusMessageStyle = (isError) => ({
    background: isError 
      ? 'rgba(239, 68, 68, 0.1)' 
      : 'rgba(16, 185, 129, 0.1)',
    border: isError 
      ? '1px solid rgba(239, 68, 68, 0.3)' 
      : '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '12px',
    padding: '12px 16px',
    color: isError ? '#fca5a5' : '#6ee7b7',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
  });

  // Error styles
  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '12px',
    padding: '16px',
    color: '#fca5a5',
    fontSize: '14px',
    textAlign: 'center',
    marginBottom: '20px',
  };

  // Preview section styles
  const previewSectionStyle = {
    background: 'rgba(255, 255, 255, 0.08)',
    backdropFilter: 'blur(15px)',
    borderRadius: '20px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    padding: '32px',
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.2)',
  };

  const previewTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#ffffff',
    marginBottom: '24px',
    textAlign: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
  };

  return (
    <div style={containerStyle} className="animate-fadeInUp">
      {/* Add a style block to fix placeholder visibility */}
      <style>{`
        .post-generator-input::placeholder {
          color: #94a3b8; /* A darker, more visible color */
          opacity: 1; /* Ensure the placeholder is fully opaque */
        }
      `}</style>
      
      {/* Header */}
      <div style={headerStyle}>
        <h1 style={titleStyle}>AI Post Generator</h1>
        <p style={subtitleStyle}>
          Create engaging social media content with AI-powered captions and stunning visuals
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div style={errorStyle}>
          ⚠️ {error}
        </div>
      )}

      {/* Generation Form */}
      <div style={formContainerStyle}>
        <form onSubmit={handleSubmit}>
          <div style={formGridStyle}>
            {/* Occasion Select */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Occasion</label>
              <select
                value={occasion}
                onChange={(e) => setOccasion(e.target.value)}
                style={selectStyle}
                required
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, selectStyle)}
              >
                <option value="">Select an occasion</option>
                {options.occasions.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Category Select */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                style={selectStyle}
                required
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, selectStyle)}
              >
                <option value="">Select a category</option>
                {options.categories.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Audience Select */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Target Audience</label>
              <select
                value={audience}
                onChange={(e) => setAudience(e.target.value)}
                style={selectStyle}
                required
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, selectStyle)}
              >
                <option value="">Select an audience</option>
                {options.audiences.map(opt => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>

            {/* Custom Prompt */}
            <div style={inputGroupStyle}>
              <label style={labelStyle}>Custom Instructions (Optional)</label>
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                style={textareaStyle}
                placeholder="Add specific instructions like tone, style, or call-to-action requirements..."
                className="post-generator-input"
                onFocus={(e) => Object.assign(e.target.style, focusStyle)}
                onBlur={(e) => Object.assign(e.target.style, textareaStyle)}
              />
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="submit"
            style={generateButtonStyle}
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
            {loading ? (
              <>
                <div className="animate-pulse">🤖</div>
                Generating Amazing Content...
              </>
            ) : (
              <>
                ✨ Generate Post
              </>
            )}
          </button>
        </form>
      </div>

      {/* Status Message */}
      {saveStatus && (
        <div style={statusMessageStyle(saveStatus.includes('Failed'))}>
          {saveStatus}
        </div>
      )}

      {/* Preview Section */}
      {generatedPost && (
        <div ref={previewRef} style={previewSectionStyle} className="animate-slideInRight">
          <h2 style={previewTitleStyle}>
            🎨 Generated Post Preview
          </h2>
          
          <PreviewCard post={generatedPost} />
          
          <div style={actionButtonsStyle}>
            <button
              style={actionButtonStyle('draft')}
              onClick={handleSaveAsDraft}
              disabled={loading}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.4)';
              }}
            >
              💾 Save Draft
            </button>
            
            <button
              style={actionButtonStyle('schedule')}
              onClick={handleScheduleNow}
              disabled={loading}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 8px 25px rgba(245, 158, 11, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(245, 158, 11, 0.4)';
              }}
            >
              📅 Schedule Post
            </button>
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <DateTimePickerModal
        isOpen={isScheduleModalOpen}
        onClose={handleCloseScheduleModal}
        onSchedule={handleScheduleConfirm}
        post={generatedPost}
      />
    </div>
  );
}

export default PostGenerator;