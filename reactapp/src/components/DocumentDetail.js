import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const DocumentDetail = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/documents/${id}`);
        setDocument(response.data);
      } catch (err) {
        setError('Document not found');
        console.error('Error fetching document:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchDocument();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
        <p className="mt-1 text-sm text-gray-500">The document you're looking for doesn't exist.</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Document not found</h3>
        <p className="mt-1 text-sm text-gray-500">The document you're looking for doesn't exist.</p>
      </div>
    );
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="border-b border-gray-200 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-gray-900">{document.title}</h1>
        <p className="text-sm text-gray-500 mt-1">File: {document.fileName}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Document Information</h3>
          <dl className="space-y-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">File Type</dt>
              <dd className="text-sm text-gray-900">{document.fileType}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">File Size</dt>
              <dd className="text-sm text-gray-900">{document.fileSize ? `${document.fileSize} bytes` : 'Unknown'}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Created</dt>
              <dd className="text-sm text-gray-900">
                {document.createdAt ? new Date(document.createdAt).toLocaleDateString() : 'Unknown'}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Owner</dt>
              <dd className="text-sm text-gray-900">{document.owner?.username || 'Unknown'}</dd>
            </div>
          </dl>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Actions</h3>
          <div className="space-y-2">
            <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded">
              Download
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 rounded">
              Share
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-yellow-600 hover:bg-yellow-50 rounded">
              Edit
            </button>
            <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded">
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;