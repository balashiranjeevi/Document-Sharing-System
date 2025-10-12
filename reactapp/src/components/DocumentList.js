import React, { useState } from 'react';
import { FiFile, FiImage, FiFileText, FiDownload, FiShare2, FiEdit3, FiTrash2, FiMoreVertical } from 'react-icons/fi';

const DocumentList = ({ documents, loading, viewMode, onRefresh }) => {
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [showActions, setShowActions] = useState(null);

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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!documents.length) {
    return (
      <div className="text-center py-12">
        <FiFile className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No documents</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by uploading a document.</p>
      </div>
    );
  }

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {documents.map((doc) => {
          const FileIcon = getFileIcon(doc.fileName);
          return (
            <div
              key={doc.id}
              className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <FileIcon className="text-blue-500" size={24} />
                </div>
                <h3 className="text-sm font-medium text-gray-900 text-center truncate w-full">
                  {doc.title || doc.fileName}
                </h3>
                <p className="text-xs text-gray-500 mt-1">{formatFileSize(doc.fileSize)}</p>
                <p className="text-xs text-gray-400 mt-1">{formatDate(doc.createdAt)}</p>
              </div>

              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowActions(showActions === doc.id ? null : doc.id);
                  }}
                  className="p-1 rounded hover:bg-gray-100"
                >
                  <FiMoreVertical size={16} />
                </button>

                {showActions === doc.id && (
                  <div className="absolute right-0 mt-1 w-40 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <FiDownload size={14} />
                      <span>Download</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <FiShare2 size={14} />
                      <span>Share</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2">
                      <FiEdit3 size={14} />
                      <span>Rename</span>
                    </button>
                    <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2">
                      <FiTrash2 size={14} />
                      <span>Delete</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">Name</div>
          <div className="col-span-2">Size</div>
          <div className="col-span-2">Modified</div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-1"></div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {documents.map((doc) => {
          const FileIcon = getFileIcon(doc.fileName);
          return (
            <div
              key={doc.id}
              className="px-6 py-4 hover:bg-gray-50 cursor-pointer group"
              onClick={() => setSelectedDoc(doc)}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center">
                    <FileIcon className="text-blue-500" size={16} />
                  </div>
                  <span className="text-sm font-medium text-gray-900 truncate">
                    {doc.title || doc.fileName}
                  </span>
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {formatFileSize(doc.fileSize)}
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {formatDate(doc.createdAt)}
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {doc.owner?.username || 'You'}
                </div>
                <div className="col-span-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowActions(showActions === doc.id ? null : doc.id);
                    }}
                    className="p-1 rounded hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <FiMoreVertical size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DocumentList;