import DOMPurify from 'dompurify';

// Input sanitization helper
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim());
  }
  return input;
};

// URL validation helper
export const validateUrl = (url, baseUrl) => {
  const allowedHosts = ['localhost', '127.0.0.1'];
  try {
    const urlObj = new URL(url, baseUrl);
    if (process.env.NODE_ENV === 'production') {
      return urlObj.origin === new URL(baseUrl).origin;
    }
    return allowedHosts.some(host => urlObj.hostname === host) || urlObj.origin === new URL(baseUrl).origin;
  } catch {
    return false;
  }
};

// ID validation helper
export const validateId = (id) => {
  return id && (typeof id === 'string' || typeof id === 'number') && !isNaN(id);
};

// Email validation
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Password validation
export const validatePassword = (password) => {
  return password && password.length >= 6;
};