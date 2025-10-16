import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DocumentList from '../components/DocumentList';
import UploadModal from '../components/UploadModal';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState({
    page: 0,
    size: 10,
    totalElements: 0,
    totalPages: 0,
    sortBy: 'id',
    sortDir: 'asc'
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDocuments(0);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    fetchDocuments(newPage);
  };

  const handleSort = (sortBy) => {
    const sortDir = pagination.sortBy === sortBy && pagination.sortDir === 'asc' ? 'desc' : 'asc';
    fetchDocuments(0, pagination.size, sortBy, sortDir);
  };

  const fetchDocuments = async (page = pagination.page, size = pagination.size, sortBy = pagination.sortBy, sortDir = pagination.sortDir) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get('/api/documents', {
        params: { 
          page, 
          size, 
          sortBy, 
          sortDir, 
          search: searchTerm 
        }
      });
      setDocuments(response.data.content || []);
      setPagination(prev => ({
        ...prev,
        page: response.data.currentPage,
        totalElements: response.data.totalElements,
        totalPages: response.data.totalPages,
        sortBy,
        sortDir
      }));
    } catch (error) {
      console.error('Error fetching documents:', error);
      setError('Failed to load documents. Please try again.');
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    fetchDocuments();
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-screen flex bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 flex flex-col">
        <Header 
          onUpload={() => setShowUpload(true)}
          onSearch={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
              <button 
                onClick={() => fetchDocuments()} 
                className="ml-2 underline hover:no-underline"
              >
                Retry
              </button>
            </div>
          )}
          
          {loading ? (
            <LoadingSpinner size="lg" className="h-64" />
          ) : (
            <>
              <DocumentList 
                documents={filteredDocuments}
                loading={loading}
                viewMode={viewMode}
                onRefresh={fetchDocuments}
                onSort={handleSort}
                sortBy={pagination.sortBy}
                sortDir={pagination.sortDir}
              />
              
              {pagination.totalPages > 1 && (
                <div className="flex justify-center items-center mt-6 space-x-2">
                  <button
                    onClick={() => handlePageChange(pagination.page - 1)}
                    disabled={pagination.page === 0}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  
                  <span className="px-4 py-2 text-sm text-gray-700">
                    Page {pagination.page + 1} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={() => handlePageChange(pagination.page + 1)}
                    disabled={pagination.page >= pagination.totalPages - 1}
                    className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {showUpload && (
        <UploadModal 
          onClose={() => setShowUpload(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
};


export default Dashboard;