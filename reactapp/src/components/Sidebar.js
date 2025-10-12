import React, { useState } from 'react';
import { FiHome, FiClock, FiShare2, FiTrash2, FiFolder, FiPlus } from 'react-icons/fi';

const Sidebar = () => {
  const [activeItem, setActiveItem] = useState('home');

  const menuItems = [
    { id: 'home', label: 'Home', icon: FiHome },
    { id: 'recent', label: 'Recent', icon: FiClock },
    { id: 'shared', label: 'Shared', icon: FiShare2 },
    { id: 'trash', label: 'Trash', icon: FiTrash2 },
  ];

  const folders = [
    { id: 1, name: 'Documents', count: 12 },
    { id: 2, name: 'Images', count: 8 },
    { id: 3, name: 'Projects', count: 5 },
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
                onClick={() => setActiveItem(item.id)}
                className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  activeItem === item.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
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
            <span className="text-sm font-medium text-gray-900">2.1 GB of 15 GB</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '14%' }}></div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;