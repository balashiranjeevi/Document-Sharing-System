import React from "react";
import {
  FiUpload,
  FiEye,
  FiDownload,
  FiShare,
  FiTrash2,
  FiEdit,
  FiRotateCcw,
} from "react-icons/fi";

const ActivityLog = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case "upload":
        return <FiUpload className="text-green-500" />;
      case "view":
        return <FiEye className="text-blue-500" />;
      case "download":
        return <FiDownload className="text-purple-500" />;
      case "share":
        return <FiShare className="text-indigo-500" />;
      case "delete":
        return <FiTrash2 className="text-red-500" />;
      case "edit":
        return <FiEdit className="text-yellow-500" />;
      case "restore":
        return <FiRotateCcw className="text-teal-500" />;
      default:
        return <FiEdit className="text-gray-500" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
      </div>
      <div className="divide-y divide-gray-200">
        {activities.length === 0 ? (
          <div className="px-6 py-4 text-gray-500">No recent activities</div>
        ) : (
          activities.map((activity) => (
            <div
              key={activity.id}
              className="px-6 py-4 flex items-center space-x-3"
            >
              {getActivityIcon(activity.type)}
              <div className="flex-1">
                <p className="text-sm text-gray-900">{activity.description}</p>
                <p className="text-xs text-gray-500">{activity.timestamp}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ActivityLog;
