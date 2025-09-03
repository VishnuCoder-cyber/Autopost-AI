import React, { useState, useEffect } from 'react';

function DateTimePickerModal({ isOpen, onClose, onSchedule, post }) {
  const [selectedDateTime, setSelectedDateTime] = useState('');
  const [error, setError] = useState('');

  // Helper to format date for datetime-local input
  const formatDateTimeLocal = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Reset state when modal opens or post changes
  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      now.setMinutes(now.getMinutes() + 5);
      now.setSeconds(0);
      now.setMilliseconds(0);

      const defaultDateTime = formatDateTimeLocal(now);
      setSelectedDateTime(defaultDateTime);
      setError('');
    }
  }, [isOpen, post]);

  const handleConfirm = () => {
    if (!selectedDateTime) {
      setError('Please select a date and time.');
      return;
    }

    const scheduledDate = new Date(selectedDateTime);
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    if (scheduledDate.getTime() < startOfToday.getTime()) {
      setError('Scheduled time must be today or in the future.');
      return;
    }

    onSchedule(post._id, scheduledDate.toISOString());
    onClose();
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Calculate minimum allowed date
  const startOfTodayForInput = new Date();
  startOfTodayForInput.setHours(0, 0, 0, 0);
  const minDateTimeForInput = formatDateTimeLocal(startOfTodayForInput);

  // Modal overlay styles
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
    animation: 'fadeIn 0.3s ease',
  };

  // Modal content styles
  const modalContentStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.4)',
    position: 'relative',
    textAlign: 'center',
    animation: 'slideIn 0.3s ease',
  };

  // Close button styles
  const closeButtonStyle = {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'rgba(255, 255, 255, 0.1)',
    border: 'none',
    borderRadius: '50%',
    width: '40px',
    height: '40px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    color: 'rgba(255, 255, 255, 0.8)',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  // Header styles
  const headerStyle = {
    marginBottom: '32px',
  };

  const titleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    background: 'linear-gradient(135deg, #ffffff 0%, #3b82f6 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '8px',
  };

  const subtitleStyle = {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '16px',
    fontWeight: '400',
  };

  // Icon container styles
  const iconContainerStyle = {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontSize: '36px',
    boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
  };

  // Input container styles
  const inputContainerStyle = {
    marginBottom: '24px',
  };

  const inputLabelStyle = {
    display: 'block',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '14px',
    fontWeight: '600',
    marginBottom: '12px',
    textAlign: 'left',
  };

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '12px',
    padding: '16px',
    color: '#ffffff',
    fontSize: '16px',
    fontFamily: 'inherit',
    width: '100%',
    boxSizing: 'border-box',
    transition: 'all 0.3s ease',
    outline: 'none',
  };

  const inputFocusStyle = {
    borderColor: '#3b82f6',
    background: 'rgba(255, 255, 255, 0.15)',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.2)',
  };

  // Error message styles
  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.1)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    borderRadius: '8px',
    padding: '12px',
    color: '#fca5a5',
    fontSize: '14px',
    marginTop: '12px',
    textAlign: 'center',
  };

  // Button group styles
  const buttonGroupStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginTop: '32px',
  };

  const buttonStyle = {
    padding: '14px 28px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    minWidth: '120px',
  };

  const confirmButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: '#ffffff',
    boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
  };

  const cancelButtonStyle = {
    ...buttonStyle,
    background: 'rgba(255, 255, 255, 0.1)',
    color: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  // Quick time options
  const quickOptionsStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))',
    gap: '12px',
    marginBottom: '20px',
  };

  const quickOptionButtonStyle = {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '8px',
    padding: '10px 12px',
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  };

  const handleQuickOption = (minutes) => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + minutes);
    now.setSeconds(0);
    now.setMilliseconds(0);
    setSelectedDateTime(formatDateTimeLocal(now));
    setError('');
  };

  return (
    <div style={modalOverlayStyle} onClick={handleOverlayClick}>
      <div style={modalContentStyle} onClick={(e) => e.stopPropagation()}>
        {/* Close button */}
        <button
          onClick={onClose}
          style={closeButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.2)';
            e.target.style.color = '#ffffff';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255, 255, 255, 0.1)';
            e.target.style.color = 'rgba(255, 255, 255, 0.8)';
          }}
        >
          ✕
        </button>

        {/* Icon */}
        <div style={iconContainerStyle}>
          📅
        </div>

        {/* Header */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>Schedule Your Post</h2>
          <p style={subtitleStyle}>Choose the perfect time to share your content</p>
        </div>

        {/* Quick time options */}
        <div style={quickOptionsStyle}>
          <button
            style={quickOptionButtonStyle}
            onClick={() => handleQuickOption(5)}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            +5 min
          </button>
          <button
            style={quickOptionButtonStyle}
            onClick={() => handleQuickOption(30)}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            +30 min
          </button>
          <button
            style={quickOptionButtonStyle}
            onClick={() => handleQuickOption(60)}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            +1 hour
          </button>
          <button
            style={quickOptionButtonStyle}
            onClick={() => handleQuickOption(1440)}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(59, 130, 246, 0.2)';
              e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.05)';
              e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            Tomorrow
          </button>
        </div>

        {/* Date/Time input */}
        <div style={inputContainerStyle}>
          <label style={inputLabelStyle}>Select Date & Time</label>
          <input
            type="datetime-local"
            value={selectedDateTime}
            onChange={(e) => {
              setSelectedDateTime(e.target.value);
              setError('');
            }}
            style={inputStyle}
            min={minDateTimeForInput}
            onFocus={(e) => Object.assign(e.target.style, inputFocusStyle)}
            onBlur={(e) => Object.assign(e.target.style, inputStyle)}
          />
          {error && <div style={errorStyle}>⚠️ {error}</div>}
        </div>

        {/* Action buttons */}
        <div style={buttonGroupStyle}>
          <button
            onClick={handleConfirm}
            style={confirmButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 12px 35px rgba(16, 185, 129, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 8px 25px rgba(16, 185, 129, 0.4)';
            }}
          >
            ✅ Confirm Schedule
          </button>
          <button
            onClick={onClose}
            style={cancelButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.15)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.1)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            Cancel
          </button>
        </div>
      </div>

      {/* Add animations */}
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0; 
            transform: translateY(30px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </div>
  );
}

export default DateTimePickerModal;