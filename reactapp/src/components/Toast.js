import React, { useState, useEffect } from 'react';
import { FiCheck, FiX, FiAlertCircle, FiInfo } from 'react-icons/fi';

const Toast = ({ message, type = 'info', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onClose, 300); // Wait for animation to complete
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const toastConfig = {
    success: {
      icon: <FiCheck size={20} />,
      styles: 'flex items-center p-4 rounded-lg shadow-lg border bg-green-50 border-green-200 text-green-800'
    },
    error: {
      icon: <FiX size={20} />,
      styles: 'flex items-center p-4 rounded-lg shadow-lg border bg-red-50 border-red-200 text-red-800'
    },
    warning: {
      icon: <FiAlertCircle size={20} />,
      styles: 'flex items-center p-4 rounded-lg shadow-lg border bg-yellow-50 border-yellow-200 text-yellow-800'
    },
    info: {
      icon: <FiInfo size={20} />,
      styles: 'flex items-center p-4 rounded-lg shadow-lg border bg-blue-50 border-blue-200 text-blue-800'
    }
  };
  
  const config = toastConfig[type] || toastConfig.info;

  return (
    <div
      className={`fixed top-4 right-4 z-50 transition-all duration-300 transform ${
        isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <div className={config.styles}>
        <div className="mr-3">{config.icon}</div>
        <div className="flex-1">
          <p className="font-medium">{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(onClose, 300);
          }}
          className="ml-3 hover:opacity-70"
        >
          <FiX size={16} />
        </button>
      </div>
    </div>
  );
};

export default Toast;