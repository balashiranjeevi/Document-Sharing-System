import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Notification = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success': return <FiCheck size={20} />;
      case 'error': return <FiX size={20} />;
      case 'warning': return <FiAlertCircle size={20} />;
      default: return <FiInfo size={20} />;
    }
  };

  const getStyles = () => {
    const base = 'flex items-center p-4 rounded-lg shadow-lg transition-all duration-300 ';
    switch (type) {
      case 'success': return base + 'bg-green-50 text-green-800 border border-green-200';
      case 'error': return base + 'bg-red-50 text-red-800 border border-red-200';
      case 'warning': return base + 'bg-yellow-50 text-yellow-800 border border-yellow-200';
      default: return base + 'bg-blue-50 text-blue-800 border border-blue-200';
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 max-w-sm ${isVisible ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300`}>
      <div className={getStyles()}>
        <div className="flex-shrink-0 mr-3">
          {getIcon()}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-3 flex-shrink-0 opacity-70 hover:opacity-100"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};

export default Notification;