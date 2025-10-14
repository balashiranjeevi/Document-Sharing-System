import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Sidebar from '../components/Sidebar';
import DocumentList from '../components/DocumentList';
import UploadModal from '../components/UploadModal';
import { documentService } from '../utils/api';

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const response = await documentService.getAll();
      setDocuments(response.data.content || response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
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
          <DocumentList 
            documents={filteredDocuments}
            loading={loading}
            viewMode={viewMode}
            onRefresh={fetchDocuments}
          />
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