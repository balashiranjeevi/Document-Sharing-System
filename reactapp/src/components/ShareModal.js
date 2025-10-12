import React, { useState } from 'react';
import { FiX, FiCopy, FiMail, FiGlobe, FiLock } from 'react-icons/fi';

const ShareModal = ({ document, onClose, onShare }) => {
  const [shareType, setShareType] = useState('private');
  const [email, setEmail] = useState('');
  const [permission, setPermission] = useState('read');
  const [shareLink, setShareLink] = useState('');

  const generateShareLink = () => {
    const link = `${window.location.origin}/shared/${document.id}`;
    setShareLink(link);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareLink);
    // Show toast notification
  };

  const handleShare = () => {
    const shareData = {
      type: shareType,
      email: shareType === 'email' ? email : null,
      permission,
      generateLink: shareType === 'link'
    };
    onShare(shareData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Share "{document.title}"</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <FiX size={20} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Share with</label>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="shareType"
                  value="private"
                  checked={shareType === 'private'}
                  onChange={(e) => setShareType(e.target.value)}
                  className="mr-3"
                />
                <FiLock className="mr-2 text-gray-500" size={16} />
                <span>Keep private</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="shareType"
                  value="email"
                  checked={shareType === 'email'}
                  onChange={(e) => setShareType(e.target.value)}
                  className="mr-3"
                />
                <FiMail className="mr-2 text-gray-500" size={16} />
                <span>Share with specific people</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="radio"
                  name="shareType"
                  value="link"
                  checked={shareType === 'link'}
                  onChange={(e) => setShareType(e.target.value)}
                  className="mr-3"
                />
                <FiGlobe className="mr-2 text-gray-500" size={16} />
                <span>Anyone with the link</span>
              </label>
            </div>
          </div>

          {shareType === 'email' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="input-field"
              />
            </div>
          )}

          {shareType !== 'private' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Permission</label>
              <select
                value={permission}
                onChange={(e) => setPermission(e.target.value)}
                className="input-field"
              >
                <option value="read">Can view</option>
                <option value="write">Can edit</option>
              </select>
            </div>
          )}

          {shareType === 'link' && shareLink && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Share link</label>
              <div className="flex">
                <input
                  type="text"
                  value={shareLink}
                  readOnly
                  className="input-field rounded-r-none"
                />
                <button
                  onClick={copyToClipboard}
                  className="px-3 py-2 bg-gray-100 border border-l-0 border-gray-300 rounded-r-lg hover:bg-gray-200"
                >
                  <FiCopy size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          {shareType === 'link' && !shareLink && (
            <button onClick={generateShareLink} className="btn-primary">
              Generate Link
            </button>
          )}
          {shareType !== 'private' && shareType !== 'link' && (
            <button onClick={handleShare} className="btn-primary">
              Share
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareModal;