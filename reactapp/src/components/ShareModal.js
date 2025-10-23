import React, { useState } from 'react';
import { FiX, FiCopy, FiCheck, FiMail, FiMessageSquare, FiShare2, FiEye, FiDownload } from 'react-icons/fi';

const ShareModal = ({ document, shareUrl, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [accessLevel, setAccessLevel] = useState('view');

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
    }
  };

  const handleEmailShare = () => {
    const subject = `Shared Document: ${document.title}`;
    const body = `I've shared a document with you: ${document.title}\n\nView it here: ${shareUrl}`;
    window.open(`mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`);
  };

  const handleSocialShare = (platform) => {
    const text = `Check out this document: ${document.title}`;
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + shareUrl)}`,
      telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(text)}`
    };
    window.open(urls[platform], '_blank');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Share Document</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <FiX size={20} />
          </button>
        </div>

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
                onClick={() => setAccessLevel('view')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  accessLevel === 'view'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                <FiEye size={16} />
                <span>View Only</span>
              </button>
              <button
                onClick={() => setAccessLevel('download')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                  accessLevel === 'download'
                    ? 'bg-blue-50 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
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
                value={shareUrl}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg bg-gray-50 text-sm"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 border border-l-0 border-gray-300 rounded-r-lg text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-50 text-green-700 border-green-300'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
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
                <span className="text-sm font-medium text-gray-700">Email</span>
              </button>
              <button
                onClick={() => handleSocialShare('whatsapp')}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiMessageSquare size={16} className="text-green-500" />
                <span className="text-sm font-medium text-gray-700">WhatsApp</span>
              </button>
              <button
                onClick={() => handleSocialShare('twitter')}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiShare2 size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Twitter</span>
              </button>
              <button
                onClick={() => handleSocialShare('telegram')}
                className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <FiMessageSquare size={16} className="text-blue-500" />
                <span className="text-sm font-medium text-gray-700">Telegram</span>
              </button>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-sm text-blue-800">
              🔒 Anyone with this link can {accessLevel === 'view' ? 'view' : 'view and download'} the document. Share responsibly.
            </p>
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;