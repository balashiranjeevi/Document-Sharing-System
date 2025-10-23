export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const { status, data } = error.response;
    
    switch (status) {
      case 401:
        return 'Authentication required. Please log in again.';
      case 403:
        return 'Access denied. You do not have permission to perform this action.';
      case 404:
        return 'Resource not found.';
      case 422:
        return data.message || 'Invalid data provided.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.message || `Error ${status}: Something went wrong.`;
    }
  } else if (error.request) {
    // Network error
    return 'Network error. Please check your connection and try again.';
  } else {
    // Other error
    return error.message || 'An unexpected error occurred.';
  }
};

export const logError = (error, context = '') => {
  console.error(`Error ${context}:`, {
    message: error.message,
    stack: error.stack,
    response: error.response?.data,
    status: error.response?.status
  });
};

export const createErrorHandler = (context) => (error) => {
  logError(error, context);
  return handleApiError(error);
};