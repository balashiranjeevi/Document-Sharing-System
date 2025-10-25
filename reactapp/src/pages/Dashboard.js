import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import DocumentList from "../components/DocumentList";
import UploadModal from "../components/UploadModal";
import LoadingSpinner from "../components/LoadingSpinner";
import { documentService } from "../utils/api";
import { handleApiError, logError } from "../utils/errorHandler";
import {
  FiPlus,
  FiRefreshCw,
  FiAlertCircle,
  FiBarChart,
  FiTrendingUp,
  FiHardDrive,
  FiUsers,
  FiClock,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiChevronLeft,
  FiChevronRight,
  FiDownloadCloud,
  FiFolder,
  FiImage,
  FiVideo,
  FiMusic,
  FiFileText,
} from "react-icons/fi";

const Dashboard = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Clear error on mount
  useEffect(() => {
    setError(null);
  }, []);
  const [showUpload, setShowUpload] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeSection, setActiveSection] = useState("home");
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    totalFiles: 0,
    storageUsed: "0 GB",
    sharedFiles: 0,
    recentUploads: 0,
  });
  const [pagination, setPagination] = useState({
    page: 0,
    size: 12,
    totalElements: 0,
    totalPages: 0,
    sortBy: "createdAt",
    sortDir: "desc",
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchDocuments(0);
      if (activeSection === "home") {
        fetchStats();
      }
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, activeSection, refreshTrigger]);

  const fetchStats = async () => {
    try {
      const response = await documentService.getStats();
      const data = response.data || {};
      const maxStorage = data.maxStorage || 200 * 1024 * 1024; // 200MB in bytes
      const storageUsed = data.storageUsed || 0;
      const totalFiles = data.total || 0;
      const sharedFiles = data.shared || 0;
      setStats({
        totalFiles: totalFiles,
        storageUsed: formatStorage(storageUsed),
        storageUsedBytes: storageUsed,
        sharedFiles: sharedFiles,
        recentUploads: data.recent || 0,
        storagePercentage: data.storagePercentage || 0,
        freeStorage: formatStorage(maxStorage - storageUsed),
        sharedPercentage:
          totalFiles > 0 ? Math.round((sharedFiles / totalFiles) * 100) : 0,
      });
    } catch (error) {
      logError(error, "fetching stats");
      setStats({
        totalFiles: 0,
        storageUsed: "0 GB",
        sharedFiles: 0,
        recentUploads: 0,
        storagePercentage: 0,
        freeStorage: "200 MB",
        sharedPercentage: 0,
      });
    }
  };

  const formatStorage = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handlePageChange = (newPage) => {
    fetchDocuments(newPage);
  };

  const handleSort = (sortBy) => {
    const sortDir =
      pagination.sortBy === sortBy && pagination.sortDir === "asc"
        ? "desc"
        : "asc";
    fetchDocuments(0, pagination.size, sortBy, sortDir);
  };

  const fetchDocuments = async (
    page = pagination.page,
    size = pagination.size,
    sortBy = pagination.sortBy,
    sortDir = pagination.sortDir
  ) => {
    try {
      setLoading(true);
      setError(null);
      let response;

      switch (activeSection) {
        case "recent":
          response = await documentService.getRecent();
          setDocuments(response.data || []);
          setPagination((prev) => ({
            ...prev,
            totalElements: response.data?.length || 0,
            totalPages: 1,
          }));
          setError(null);
          break;
        case "shared":
          response = await documentService.getShared();
          setDocuments(response.data || []);
          setPagination((prev) => ({
            ...prev,
            totalElements: response.data?.length || 0,
            totalPages: 1,
          }));
          setError(null);
          break;
        case "trash":
          response = await documentService.getTrash();
          setDocuments(response.data || []);
          setPagination((prev) => ({
            ...prev,
            totalElements: response.data?.length || 0,
            totalPages: 1,
          }));
          setError(null);
          break;
        case "documents":
        case "images":
        case "videos":
        case "audio":
          response = await documentService.getByType(activeSection);
          setDocuments(response.data || []);
          setPagination((prev) => ({
            ...prev,
            totalElements: response.data?.length || 0,
            totalPages: 1,
          }));
          setError(null);
          break;
        case "home":
        default:
          // Use getAll with pagination for home section to show all documents
          response = await documentService.getAll({
            page,
            size,
            sortBy,
            sortDir,
            search: searchTerm || undefined,
          });
          setDocuments(response.data.content || []);
          setPagination((prev) => ({
            ...prev,
            totalElements: response.data.totalElements || 0,
            totalPages: response.data.totalPages || 0,
            currentPage: response.data.currentPage || page,
            hasNext: response.data.hasNext || false,
            hasPrevious: response.data.hasPrevious || false,
          }));
          setError(null);
      }
    } catch (error) {
      logError(error, "fetching documents");
      const errorMessage = handleApiError(error);
      setError(errorMessage);
      setDocuments([]);
    } finally {
      setLoading(false);
    }
  };

  const handleUploadSuccess = () => {
    setShowUpload(false);
    // Immediately refresh documents and stats after upload
    fetchDocuments();
    fetchStats();
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleFolderClick = (folderType) => {
    setActiveSection(folderType);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case "upload":
        setShowUpload(true);
        break;
      case "refresh":
        fetchDocuments();
        setRefreshTrigger((prev) => prev + 1);
        break;
      default:
        break;
    }
  };

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchDocuments();
      setRefreshTrigger((prev) => prev + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, [activeSection]);

  const filteredDocuments = documents.filter(
    (doc) =>
      doc.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sectionTitles = {
    home: "Dashboard Overview",
    recent: "Recent Files",
    shared: "Shared with Me",
    trash: "Trash",
    documents: "Documents",
    images: "Images",
    videos: "Videos",
    audio: "Audio Files",
  };

  const sectionIcons = {
    home: FiBarChart,
    recent: FiClock,
    shared: FiUsers,
    trash: FiTrash2,
    documents: FiFileText,
    images: FiImage,
    videos: FiVideo,
    audio: FiMusic,
  };

  const statsCards = [
    {
      title: "Total Files",
      value: (stats.totalFiles || 0).toLocaleString(),
      icon: FiHardDrive,
      color: "blue",
      trend: `${stats.totalFiles || 0} files`,
      description: "All your documents",
    },
    {
      title: "Storage Used",
      value: stats.storageUsed,
      icon: FiBarChart,
      color: "green",
      trend: `${stats.freeStorage} free`,
      description: "Of 200 MB total",
    },
    {
      title: "Shared Files",
      value: (stats.sharedFiles || 0).toLocaleString(),
      icon: FiUsers,
      color: "purple",
      trend: `${stats.sharedPercentage || 0}% shared`,
      description: "Collaborating with team",
    },
    {
      title: "Recent Uploads",
      value: (stats.recentUploads || 0).toLocaleString(),
      icon: FiClock,
      color: "orange",
      trend: "Last 7 days",
      description: "New additions",
    },
  ];

  const getColorClasses = (color) => {
    const colors = {
      blue: "from-blue-500 to-blue-600",
      green: "from-green-500 to-green-600",
      purple: "from-purple-500 to-purple-600",
      orange: "from-orange-500 to-orange-600",
    };
    return colors[color] || colors.blue;
  };

  const getSectionIcon = () => {
    const Icon = sectionIcons[activeSection] || FiFolder;
    return <Icon size={24} className="text-blue-600" />;
  };

  return (
    <div className="h-screen flex bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      <Sidebar
        onSectionChange={setActiveSection}
        activeSection={activeSection}
        refreshTrigger={refreshTrigger}
        onFolderClick={handleFolderClick}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header
          onUpload={() => setShowUpload(true)}
          onSearch={setSearchTerm}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />

        <main className="flex-1 p-6 overflow-auto">
          {/* Header Section */}
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="flex items-center space-x-4 mb-4 lg:mb-0">
              <div className="p-3 bg-white rounded-2xl shadow-sm border border-gray-200/60">
                {getSectionIcon()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {sectionTitles[activeSection] || "Documents"}
                </h1>
                <p className="text-gray-600 mt-1">
                  {activeSection === "home"
                    ? "Overview of your documents and storage usage"
                    : `Manage your ${activeSection.toLowerCase()} files and folders`}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* View Mode Toggle */}
              <div className="flex bg-white rounded-xl border border-gray-200/60 p-1 shadow-sm">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === "grid"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiGrid size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2.5 rounded-lg transition-all duration-200 ${
                    viewMode === "list"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 text-white shadow-md"
                      : "text-gray-400 hover:text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <FiList size={20} />
                </button>
              </div>

              {/* Quick Actions */}
              <button
                onClick={() => handleQuickAction("refresh")}
                className="p-2.5 text-gray-500 hover:text-gray-700 transition-all duration-200 hover:bg-white rounded-xl border border-gray-200/60 shadow-sm hover:shadow-md"
                title="Refresh"
              >
                <FiRefreshCw size={20} />
              </button>

              <button
                onClick={() => handleQuickAction("upload")}
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
              >
                <FiPlus size={20} />
                <span>Upload Files</span>
              </button>
            </div>
          </div>

          {/* Stats Overview - Only show on home */}
          {activeSection === "home" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {statsCards.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={index}
                    className="group bg-white rounded-2xl border border-gray-200/60 p-6 shadow-sm hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className={`p-3 rounded-xl bg-gradient-to-r ${getColorClasses(
                          stat.color
                        )}`}
                      >
                        <Icon className="text-white" size={24} />
                      </div>
                      <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        {stat.trend}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-2xl font-bold text-gray-900">
                        {stat.value}
                      </p>
                      <p className="text-lg font-semibold text-gray-700">
                        {stat.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {stat.description}
                      </p>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`bg-gradient-to-r ${getColorClasses(
                            stat.color
                          )} h-2 rounded-full transition-all duration-1000`}
                          style={{
                            width: `${
                              stat.title === "Storage Used"
                                ? stats.storagePercentage || 0
                                : stat.title === "Shared Files"
                                ? stats.sharedPercentage || 0
                                : Math.min(
                                    100,
                                    ((stats.totalFiles || 0) / 1000) * 100
                                  )
                            }%`,
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-2xl border border-gray-200/60 p-6 mb-6 shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <FiSearch className="text-gray-400" size={20} />
                </div>
                <input
                  type="text"
                  placeholder="Search documents, files, and folders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                />
              </div>

              <div className="flex items-center space-x-3">
                <button className="flex items-center space-x-3 px-4 py-3.5 border border-gray-300 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all duration-200 group">
                  <FiFilter
                    size={18}
                    className="text-gray-500 group-hover:text-gray-700"
                  />
                  <span className="text-sm font-semibold text-gray-700">
                    Filters
                  </span>
                </button>

                <div className="text-sm text-gray-500 bg-gray-100 px-3 py-2 rounded-lg font-medium">
                  {pagination.totalElements.toLocaleString()} items
                </div>
              </div>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
              <div className="flex items-center">
                <FiAlertCircle className="text-red-500 mr-3" size={20} />
                <div>
                  <h3 className="text-red-800 font-medium">Error</h3>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => {
                    setError(null);
                    fetchDocuments();
                  }}
                  className="ml-auto text-red-600 hover:text-red-800 text-sm font-medium"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Content Area */}
          {loading ? (
            <div className="flex flex-col items-center justify-center h-96 bg-white rounded-2xl border border-gray-200/60 shadow-sm">
              <LoadingSpinner size="lg" className="mb-4" />
              <p className="text-gray-600 text-lg font-medium">
                Loading your documents...
              </p>
              <p className="text-gray-500 text-sm mt-2">
                This will just take a moment
              </p>
            </div>
          ) : (
            <>
              <DocumentList
                documents={filteredDocuments}
                loading={loading}
                viewMode={viewMode}
                onRefresh={() => {
                  fetchDocuments();
                  setRefreshTrigger((prev) => prev + 1);
                }}
                onSort={handleSort}
                sortBy={pagination.sortBy}
                sortDir={pagination.sortDir}
                activeSection={activeSection}
              />

              {/* Enhanced Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between mt-8 pt-6 border-t border-gray-200">
                  <div className="text-sm text-gray-600 mb-4 sm:mb-0">
                    Showing{" "}
                    <span className="font-semibold">
                      {filteredDocuments.length}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold">
                      {pagination.totalElements.toLocaleString()}
                    </span>{" "}
                    items
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(pagination.page - 1)}
                      disabled={pagination.page === 0}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <FiChevronLeft size={18} />
                      <span>Previous</span>
                    </button>

                    <div className="flex items-center space-x-1 mx-4">
                      {Array.from(
                        { length: Math.min(5, pagination.totalPages) },
                        (_, i) => {
                          const pageNum = i;
                          const isActive = pagination.page === pageNum;
                          return (
                            <button
                              key={pageNum}
                              onClick={() => handlePageChange(pageNum)}
                              className={`w-10 h-10 text-sm font-semibold rounded-xl transition-all duration-200 ${
                                isActive
                                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg"
                                  : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                              }`}
                            >
                              {pageNum + 1}
                            </button>
                          );
                        }
                      )}

                      {pagination.totalPages > 5 && (
                        <span className="px-2 text-gray-500">...</span>
                      )}
                    </div>

                    <button
                      onClick={() => handlePageChange(pagination.page + 1)}
                      disabled={pagination.page >= pagination.totalPages - 1}
                      className="flex items-center space-x-2 px-4 py-2.5 text-sm font-semibold bg-white border border-gray-300 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                    >
                      <span>Next</span>
                      <FiChevronRight size={18} />
                    </button>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {filteredDocuments.length === 0 && !loading && (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200/60 shadow-sm">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <FiDownloadCloud className="text-blue-500" size={32} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {searchTerm ? "No documents found" : "No documents yet"}
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
                    {searchTerm
                      ? `No documents match "${searchTerm}". Try adjusting your search terms.`
                      : `Get started by uploading your first document to organize your work.`}
                  </p>
                  {!searchTerm && (
                    <button
                      onClick={() => setShowUpload(true)}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
                    >
                      <FiPlus className="inline mr-2" size={20} />
                      Upload Your First File
                    </button>
                  )}
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
