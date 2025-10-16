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
      // Mock data when API fails
      setDocuments([
        { id: 1, title: 'Project Proposal.pdf', fileName: 'project-proposal.pdf', fileSize: 2048576, createdAt: '2024-01-15', owner: { username: 'john_doe' } },
        { id: 2, title: 'Meeting Notes.docx', fileName: 'meeting-notes.docx', fileSize: 1024000, createdAt: '2024-01-14', owner: { username: 'jane_smith' } },
        { id: 3, title: 'Budget Report.xlsx', fileName: 'budget-report.xlsx', fileSize: 3072000, createdAt: '2024-01-13', owner: { username: 'bob_wilson' } },
        { id: 4, title: 'Design Mockups.png', fileName: 'design-mockups.png', fileSize: 5120000, createdAt: '2024-01-12', owner: { username: 'alice_brown' } }
      ]);
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