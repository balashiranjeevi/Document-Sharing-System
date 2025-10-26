import React, { useState } from "react";
import {
  FiFile,
  FiImage,
  FiFileText,
  FiDownload,
  FiShare2,
  FiEdit3,
  FiTrash2,
  FiMoreVertical,
  FiEye,
  FiUsers,
  FiEdit,
  FiDownload as FiDownloadIcon,
} from "react-icons/fi";
import { documentService } from "../utils/api";
import Notification from "./Notification";
import ShareModal from "./ShareModal";

const DocumentList = ({
  documents = [],
  loading,
  viewMode,
  onRefresh,
  error,
  onSort,
  sortBy,
  sortDir,
  activeSection,
  showNotification,
}) => {
  const [showActions, setShowActions] = useState(null);
  const [shareModal, setShareModal] = useState(null);

  const handleDownload = async (doc) => {
    try {
      const response = await documentService.download(doc.id);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", doc.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  const handleView = async (doc) => {
    try {
      const response = await documentService.view(doc.id);
      const url = window.URL.createObjectURL(
        new Blob([response.data], { type: doc.fileType })
      );
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error viewing file:", error);
    }
  };

  const handleShare = async (doc) => {
    // Generate share URL immediately
    const shareUrl = `${window.location.origin}/shared/${doc.id}`;

    // Show modal immediately
    setShareModal({
      document: doc,
      shareUrl: shareUrl,
    });

    try {
      // Try to call backend share API in background
      await documentService.share(doc.id);
      showNotification("Document shared successfully!", "success");
    } catch (error) {
      showNotification("Share link generated", "success");
    }
  };

  const handleRename = async (doc) => {
    const newTitle = prompt("Enter new title:", doc.title);
    if (newTitle && newTitle !== doc.title && newTitle.trim()) {
      try {
        await documentService.rename(doc.id, newTitle.trim());
        showNotification("Document renamed successfully!", "success");
        onRefresh?.();
      } catch (error) {
        console.error("Error renaming document:", error);
        showNotification("Failed to rename document", "error");
      }
    }
  };

  const handleDelete = async (doc) => {
    const isInTrash = activeSection === "trash";
    const action = isInTrash ? "permanently delete" : "move to trash";

    if (window.confirm(`Are you sure you want to ${action} ${doc.title}?`)) {
      try {
        if (isInTrash) {
          await documentService.permanentDelete(doc.id);
          showNotification("Document permanently deleted!", "success");
        } else {
          await documentService.delete(doc.id);
          showNotification("Document moved to trash!", "success");
        }
        onRefresh?.();
      } catch (error) {
        console.error(`Error ${action}:`, error);
        showNotification(`Failed to ${action} document.`, "error");
      }
    }
  };

  const handleRestore = async (doc) => {
    try {
      await documentService.restore(doc.id);
      showNotification("Document restored successfully!", "success");
      onRefresh?.();
    } catch (error) {
      console.error("Error restoring document:", error);
      showNotification("Failed to restore document.", "error");
    }
  };
  const displayDocuments = documents;
  const displayLoading = loading;
  const displayError = error;

  const getFileIcon = (fileName) => {
    const ext = fileName?.split(".").pop()?.toLowerCase();
    if (["jpg", "jpeg", "png", "gif"].includes(ext)) return FiImage;
    if (["pdf", "doc", "docx", "txt"].includes(ext)) return FiFileText;
    return FiFile;
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (displayError) {
    return (
      <div className="text-center py-12">
        <h3 className="mt-2 text-sm font-medium text-gray-900">Error</h3>
        <p className="mt-1 text-sm text-gray-500">{displayError}</p>
      </div>
    );
  }

  if (displayLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!displayDocuments.length) {
    const emptyMessage =
      activeSection === "shared"
        ? "No shared documents yet. Share some documents to see them here."
        : activeSection === "trash"
        ? "Trash is empty. Deleted documents will appear here."
        : activeSection === "recent"
        ? "No recent documents. Upload or modify documents to see them here."
        : "Get started by uploading a document.";

    return (
      <div className="text-center py-12">
        <FiFile className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No documents found
        </h3>
        <p className="mt-1 text-sm text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  const gridView = (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {displayDocuments.map((doc) => {
        const FileIcon = getFileIcon(doc.fileName);
        return (
          <div
            key={doc.id}
            className="group relative bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center mb-3 relative">
                <FileIcon className="text-blue-500" size={24} />
                {doc.isShared && (
                  <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-1">
                    <FiUsers size={8} />
                  </div>
                )}
              </div>
              <h3 className="text-sm font-medium text-gray-900 text-center truncate w-full">
                {doc.title || doc.fileName}
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                {formatFileSize(doc.size)}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {formatDate(doc.createdAt)}
              </p>
              {doc.permissions && doc.permissions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1">
                  {doc.permissions.map((perm, index) => (
                    <span
                      key={index}
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        perm.permission === "VIEW"
                          ? "bg-blue-100 text-blue-800"
                          : perm.permission === "EDIT"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {perm.permission === "VIEW" && (
                        <FiEye size={10} className="mr-1" />
                      )}
                      {perm.permission === "EDIT" && (
                        <FiEdit size={10} className="mr-1" />
                      )}
                      {perm.permission === "DOWNLOAD" && (
                        <FiDownloadIcon size={10} className="mr-1" />
                      )}
                      {perm.permission}
                    </span>
                  ))}
                </div>
              )}
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleView(doc);
                      setShowActions(null);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FiEye size={14} />
                    <span>View</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(doc);
                      setShowActions(null);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FiDownload size={14} />
                    <span>Download</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleShare(doc);
                      setShowActions(null);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FiShare2 size={14} />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRename(doc);
                      setShowActions(null);
                    }}
                    className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  >
                    <FiEdit3 size={14} />
                    <span>Rename</span>
                  </button>
                  {activeSection === "trash" ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestore(doc);
                          setShowActions(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FiShare2 size={14} />
                        <span>Restore</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(doc);
                          setShowActions(null);
                        }}
                        className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                      >
                        <FiTrash2 size={14} />
                        <span>Delete Forever</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(doc);
                        setShowActions(null);
                      }}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center space-x-2"
                    >
                      <FiTrash2 size={14} />
                      <span>Move to Trash</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );

  const listView = (
    <div className="bg-white rounded-lg border border-gray-200">
      <div className="px-6 py-3 border-b border-gray-200">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-500 uppercase tracking-wider">
          <div className="col-span-5">
            <button
              onClick={() => onSort?.("title")}
              className="flex items-center space-x-1 hover:text-gray-700"
            >
              <span>Name</span>
              {sortBy === "title" && (
                <span>{sortDir === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => onSort?.("size")}
              className="flex items-center space-x-1 hover:text-gray-700"
            >
              <span>Size</span>
              {sortBy === "size" && (
                <span>{sortDir === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          </div>
          <div className="col-span-2">
            <button
              onClick={() => onSort?.("createdAt")}
              className="flex items-center space-x-1 hover:text-gray-700"
            >
              <span>Modified</span>
              {sortBy === "createdAt" && (
                <span>{sortDir === "asc" ? "↑" : "↓"}</span>
              )}
            </button>
          </div>
          <div className="col-span-2">Owner</div>
          <div className="col-span-1"></div>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {displayDocuments.map((doc) => {
          const FileIcon = getFileIcon(doc.fileName);
          return (
            <div key={doc.id} className="px-6 py-4 hover:bg-gray-50 group">
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-5 flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-50 rounded flex items-center justify-center relative">
                    <FileIcon className="text-blue-500" size={16} />
                    {doc.isShared && (
                      <div className="absolute -top-1 -right-1 bg-green-500 text-white rounded-full p-0.5">
                        <FiUsers size={6} />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium text-gray-900 truncate">
                      {doc.title || doc.fileName}
                    </span>
                    {doc.permissions && doc.permissions.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {doc.permissions.map((perm, index) => (
                          <span
                            key={index}
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                              perm.permission === "VIEW"
                                ? "bg-blue-100 text-blue-800"
                                : perm.permission === "EDIT"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {perm.permission === "VIEW" && (
                              <FiEye size={10} className="mr-1" />
                            )}
                            {perm.permission === "EDIT" && (
                              <FiEdit size={10} className="mr-1" />
                            )}
                            {perm.permission === "DOWNLOAD" && (
                              <FiDownloadIcon size={10} className="mr-1" />
                            )}
                            {perm.permission}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {formatFileSize(doc.size)}
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {formatDate(doc.createdAt)}
                </div>
                <div className="col-span-2 text-sm text-gray-500">
                  {doc.ownerName || "You"}
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

  return (
    <>
      {viewMode === "grid" ? gridView : listView}
      {shareModal && (
        <ShareModal
          document={shareModal.document}
          shareUrl={shareModal.shareUrl}
          onClose={() => setShareModal(null)}
        />
      )}
    </>
  );
};

const DocumentListWithNotification = (props) => {
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = "info") => {
    setNotification({ message, type });
  };

  return (
    <>
      <DocumentList {...props} showNotification={showNotification} />
      {notification && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={() => setNotification(null)}
        />
      )}
    </>
  );
};

export default DocumentListWithNotification;
