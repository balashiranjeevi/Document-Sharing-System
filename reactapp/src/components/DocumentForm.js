import React, { useState } from 'react';
import axios from 'axios';

// Configure axios for CSRF protection
axios.defaults.withCredentials = true;
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
import { sanitizeInput } from '../utils/validation';
import LoadingSpinner from './LoadingSpinner';

const DocumentForm = ({ document, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: document?.title || '',
    fileName: document?.fileName || '',
    fileType: document?.fileType || '',
    ownerId: document?.ownerId || ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    const title = sanitizeInput(formData.title);
    const fileName = sanitizeInput(formData.fileName);
    const fileType = sanitizeInput(formData.fileType);
    
    if (!title || title.length < 2) {
      newErrors.title = 'Title must be at least 2 characters';
    } else if (title.length > 255) {
      newErrors.title = 'Title must not exceed 255 characters';
    }
    
    if (!fileName) {
      newErrors.fileName = 'File name is required';
    } else if (fileName.length > 255) {
      newErrors.fileName = 'File name must not exceed 255 characters';
    }
    
    if (!fileType) {
      newErrors.fileType = 'File type is required';
    }
    
    if (!formData.ownerId || isNaN(formData.ownerId)) {
      newErrors.ownerId = 'Valid Owner ID is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      let result;
      if (document?.id) {
        result = await axios.put(`/documents/${document.id}`, formData, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
      } else {
        result = await axios.post('/documents', formData, {
          headers: { 'X-Requested-With': 'XMLHttpRequest' }
        });
      }
      onSave?.(result.data);
    } catch (error) {
      console.error('Error saving document:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = ['title', 'fileName', 'fileType'].includes(name) ? sanitizeInput(value) : value;
    setFormData(prev => ({ ...prev, [name]: sanitizedValue }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="fileName" className="block text-sm font-medium text-gray-700">
          File Name
        </label>
        <input
          type="text"
          id="fileName"
          name="fileName"
          value={formData.fileName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.fileName && <p className="mt-1 text-sm text-red-600">{errors.fileName}</p>}
      </div>

      <div>
        <label htmlFor="fileType" className="block text-sm font-medium text-gray-700">
          File Type
        </label>
        <input
          type="text"
          id="fileType"
          name="fileType"
          value={formData.fileType}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.fileType && <p className="mt-1 text-sm text-red-600">{errors.fileType}</p>}
      </div>

      <div>
        <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700">
          Owner ID
        </label>
        <input
          type="text"
          id="ownerId"
          name="ownerId"
          value={formData.ownerId}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
        {errors.ownerId && <p className="mt-1 text-sm text-red-600">{errors.ownerId}</p>}
      </div>

      <div className="flex justify-end space-x-3">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center space-x-2"
        >
          {loading && <LoadingSpinner size="sm" />}
          <span>{loading ? 'Saving...' : 'Save'}</span>
        </button>
      </div>
    </form>
  );
};

export default DocumentForm;