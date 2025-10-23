import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { FiDownload, FiEye, FiFile, FiImage, FiFileText } from 'react-icons/fi';
import { documentService } from '../utils/api';
import LoadingSpinner from '../components/LoadingSpinner';

const SharedDocument = () => {
  const { id } = useParams();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDocument();
  }, [id]);

  const fetchDocument = async () => {
    try {
      setLoading(true);
      const response = await documentService.getById(id);
      setDocument(response.data);
    } catch (error) {
      setError('Document not found or access denied');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async () => {
    try {
      const response = await documentService.download(id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', document.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleView = async () => {
    try {
      const response = await documentService.view(id);
      const url = window.URL.createObjectURL(new Blob([response.data], { type: document.fileType }));
      window.open(url, '_blank');
    } catch (error) {
      console.error('Error viewing file:', error);
    }
  };

  const getFileIcon = (fileName) => {
    const ext = fileName?.split('.').pop()?.toLowerCase();
    if (['jpg', 'jpeg', 'png', 'gif'].includes(ext)) return FiImage;
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext)) return FiFileText;
    return FiFile;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Document Not Found</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  const FileIcon = getFileIcon(document.fileName);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileIcon className="text-blue-600" size={20} />
            </div>
            <h1 className="text-xl font-semibold text-gray-900">DocShare</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <FileIcon className="text-blue-500" size={32} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {document.title || document.fileName}
              </h2>
              <p className="text-gray-600 mb-4">
                Shared document • {formatFileSize(document.size)}
              </p>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={handleView}
                  className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                >
                  <FiEye size={20} />
                  <span>View Document</span>
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center space-x-2 bg-white text-gray-700 px-6 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <FiDownload size={20} />
                  <span>Download</span>
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Document Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-700">File Name:</span>
                  <span className="ml-2 text-gray-600">{document.fileName}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">File Size:</span>
                  <span className="ml-2 text-gray-600">{formatFileSize(document.size)}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">File Type:</span>
                  <span className="ml-2 text-gray-600">{document.fileType}</span>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Shared:</span>
                  <span className="ml-2 text-gray-600">{new Date(document.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            Powered by <span className="font-semibold text-blue-600">DocShare</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SharedDocument;