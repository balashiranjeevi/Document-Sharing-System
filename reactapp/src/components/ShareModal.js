import React, { useState, useEffect } from "react";
import {
  FiX,
  FiCopy,
  FiCheck,
  FiMail,
  FiMessageSquare,
  FiShare2,
  FiEye,
  FiDownload,
  FiUserPlus,
  FiUsers,
  FiUser,
  FiSettings,
} from "react-icons/fi";
import UserSearchModal from "./UserSearchModal";
import { documentService } from "../utils/api";

const ShareModal = ({ document, shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState("view");
  const [activeTab, setActiveTab] = useState("link"); // 'link' or 'users'
  const [showUserSearch, setShowUserSearch] = useState(false);
  const [permissions, setPermissions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [actualShareUrl, setActualShareUrl] = useState(shareUrl);

  const updateShareSettings = async (level) => {
    try {
      setSharing(true);
      console.log('Sharing with access level:', level);
      const response = await documentService.share(document.id, { accessLevel: level });
      
      // Prefer direct S3 URL over server URL for better performance
      const newShareUrl = response.data.directUrl || response.data.s3Url || response.data.shareUrl || actualShareUrl;
      setActualShareUrl(newShareUrl);
      console.log('Share URL updated:', newShareUrl);
      console.log('Available URLs:', {
        directUrl: response.data.directUrl,
        s3Url: response.data.s3Url,
        shareUrl: response.data.shareUrl
      });
    } catch (error) {
      console.error("Error updating share settings:", error);
    } finally {
      setSharing(false);
    }
  };

  // Initial share when modal opens
  React.useEffect(() => {
    updateShareSettings(accessLevel);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(actualShareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  };

  const handleEmailShare = () => {
    const subject = `Shared Document: ${document.title}`;
    const body = `I've shared a document with you: ${document.title}\n\nView it here: ${actualShareUrl}`;
    window.open(
      `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(
        body
      )}`
    );
  };

  const handleSocialShare = (platform) => {
    const text = `Check out this document: ${document.title}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
      )}&url=${encodeURIComponent(actualShareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(
        text + " " + actualShareUrl
      )}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(
        actualShareUrl
      )}&text=${encodeURIComponent(text)}`,
    };
    window.open(urls[platform], "_blank");
  };

  // Load permissions when modal opens
  useEffect(() => {
    loadPermissions();
  }, [document.id]);

  const loadPermissions = async () => {
    setLoading(true);
    try {
      const response = await documentService.getPermissions(document.id);
      setPermissions(response.data || []);
    } catch (error) {
      console.error("Error loading permissions:", error);
      setError("Failed to load permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleGrantPermission = async (user, permission = "VIEW") => {
    try {
      await documentService.grantPermission(document.id, user.id, permission);
      await loadPermissions(); // Refresh permissions
    } catch (error) {
      console.error("Error granting permission:", error);
      setError("Failed to grant permission");
    }
  };

  const handleRevokePermission = async (userId) => {
    try {
      await documentService.revokePermission(document.id, userId);
      await loadPermissions(); // Refresh permissions
    } catch (error) {
      console.error("Error revoking permission:", error);
      setError("Failed to revoke permission");
    }
  };

  const handleUpdatePermission = async (userId, permission) => {
    try {
      await documentService.updatePermission(document.id, userId, permission);
      await loadPermissions(); // Refresh permissions
    } catch (error) {
      console.error("Error updating permission:", error);
      setError("Failed to update permission");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Share Document
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setActiveTab("link")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "link"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiShare2 className="inline mr-2" size={16} />
            Share Link
          </button>
          <button
            onClick={() => setActiveTab("users")}
            className={`flex-1 px-6 py-3 text-sm font-medium transition-colors ${
              activeTab === "users"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <FiUsers className="inline mr-2" size={16} />
            Manage Access
          </button>
        </div>

        <div>
          {activeTab === "link" ? (
            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {document.title}
                </h3>
                <p className="text-sm text-gray-500">
                  Share this document with others using the options below.
                </p>
              </div>

              {/* Access Level */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Access Level
                </label>
                <div className="flex space-x-3">
                  <button
                    onClick={async () => {
                      setAccessLevel("view");
                      await updateShareSettings("view");
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      accessLevel === "view"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FiEye size={16} />
                    <span>View Only</span>
                  </button>
                  <button
                    onClick={async () => {
                      setAccessLevel("download");
                      await updateShareSettings("download");
                    }}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                      accessLevel === "download"
                        ? "bg-blue-50 border-blue-200 text-blue-700"
                        : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <FiDownload size={16} />
                    <span>View & Download</span>
                  </button>
                </div>
              </div>

              {/* Share Link */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Share Link
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={actualShareUrl}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
                  />
                  <button
                    onClick={handleCopy}
                    className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg text-sm font-medium transition-colors ${
                      copied
                        ? "bg-green-50 text-green-700 border-green-300"
                        : "bg-white text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {copied ? <FiCheck size={16} /> : <FiCopy size={16} />}
                  </button>
                </div>
              </div>

              {/* Quick Share Options */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Quick Share
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={handleEmailShare}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiMail size={16} className="text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Email
                    </span>
                  </button>
                  <button
                    onClick={() => handleSocialShare("whatsapp")}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiMessageSquare size={16} className="text-green-500" />
                    <span className="text-sm font-medium text-gray-700">
                      WhatsApp
                    </span>
                  </button>
                  <button
                    onClick={() => handleSocialShare("twitter")}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiShare2 size={16} className="text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Twitter
                    </span>
                  </button>
                  <button
                    onClick={() => handleSocialShare("telegram")}
                    className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <FiMessageSquare size={16} className="text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">
                      Telegram
                    </span>
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  🔗 This is a direct cloud link. Anyone with this link can{" "}
                  {accessLevel === "view" ? "view" : "view and download"} the
                  document. Share responsibly.
                </p>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="mb-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Manage Access
                  </h3>
                  <button
                    onClick={() => setShowUserSearch(true)}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <FiUserPlus size={16} />
                    <span>Add User</span>
                  </button>
                </div>
                <p className="text-sm text-gray-500">
                  Control who can access this document.
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-800">{error}</p>
                </div>
              )}

              <div className="space-y-3 max-h-64 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : permissions.length > 0 ? (
                  permissions.map((permission) => (
                    <div
                      key={permission.id}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <FiUser className="text-blue-600" size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {permission.user.username}
                          </p>
                          <p className="text-xs text-gray-500">
                            {permission.user.email}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <select
                          value={permission.permission}
                          onChange={(e) =>
                            handleUpdatePermission(
                              permission.user.id,
                              e.target.value
                            )
                          }
                          className="text-sm border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="VIEW">View</option>
                          <option value="DOWNLOAD">Download</option>
                        </select>
                        <button
                          onClick={() =>
                            handleRevokePermission(permission.user.id)
                          }
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <FiX size={16} />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <FiUsers className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900">
                      No shared users
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Add users to grant them access to this document.
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end p-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>

        {showUserSearch && (
          <UserSearchModal
            isOpen={showUserSearch}
            onClose={() => setShowUserSearch(false)}
            onSelectUser={(user) => handleGrantPermission(user)}
            currentPermissions={permissions}
          />
        )}
      </div>
    </div>
  );
};

export default ShareModal;
