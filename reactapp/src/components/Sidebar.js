import React, { useState, useEffect } from 'react';
import { FiHome, FiClock, FiShare2, FiTrash2, FiFolder, FiPlus } from 'react-icons/fi';
import { dashboardService, folderService } from '../utils/api';

const Sidebar = ({ onSectionChange, activeSection, refreshTrigger, onFolderClick }) => {
  const [stats, setStats] = useState({ total: 0, recent: 0, shared: 0, trash: 0 });
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchFolders();
  }, [refreshTrigger]);

  const fetchStats = async () => {
    try {
      const response = await dashboardService.getStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchFolders = async () => {
    try {
      const response = await folderService.getAll();
      setFolders(response.data);
    } catch (error) {
      console.error('Error fetching folders:', error);
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const menuItems = [
    { id: 'home', label: 'Home', icon: FiHome, count: stats.total },
    { id: 'recent', label: 'Recent', icon: FiClock, count: stats.recent },
    { id: 'shared', label: 'Shared', icon: FiShare2, count: stats.shared },
    { id: 'trash', label: 'Trash', icon: FiTrash2, count: stats.trash },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left transition-colors ${
                  activeSection === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <Icon size={18} />
                  <span>{item.label}</span>
                </div>
                {item.count > 0 && (
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    activeSection === item.id ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                  }`}>
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="px-6 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-900">Folders</h3>
          <button className="p-1 text-gray-400 hover:text-gray-600">
            <FiPlus size={16} />
          </button>
        </div>
        
        <div className="space-y-1">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => onFolderClick(folder.type)}
              className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <div className="flex items-center space-x-3">
                <FiFolder className="text-blue-500" size={16} />
                <span className="text-sm text-gray-700">{folder.name}</span>
              </div>
              <span className="text-xs text-gray-400">{folder.count}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-auto p-6 border-t border-gray-200">
        <div className="bg-gray-50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Storage</span>
            <span className="text-sm font-medium text-gray-900">
              {formatFileSize(stats.storageUsed || 0)} of 200 MB
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full" 
              style={{ width: `${Math.min(stats.storagePercentage || 0, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;