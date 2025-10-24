import React, { useState, useEffect } from "react";
import {
  FiUsers,
  FiFile,
  FiActivity,
  FiSettings,
  FiBarChart,
  FiSearch,
  FiDownload,
  FiTrash2,
  FiEdit,
  FiRefreshCw,
  FiTrendingUp,
  FiShield,
  FiDatabase,
  FiClock,
  FiEye,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiBell,
  FiHardDrive,
  FiZap,
} from "react-icons/fi";
import Header from "../components/Header";
import LoadingSpinner from "../components/LoadingSpinner";
import AdminChart from "../components/AdminChart";
import ActivityLog from "../components/ActivityLog";
import axios from "axios";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("users");
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    totalStorage: 0,
    activeUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userSearch, setUserSearch] = useState("");
  const [docSearch, setDocSearch] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedDocs, setSelectedDocs] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([
        fetchStats(),
        fetchUsers(),
        fetchDocuments(),
        fetchActivities(),
      ]);
      setLoading(false);
    };
    loadData();

    // Set up real-time updates every 30 seconds
    const interval = setInterval(() => {
      fetchStats();
      fetchUsers();
      fetchDocuments();
      fetchActivities();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("admin/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      setStats({
        totalUsers: 0,
        totalDocuments: 0,
        totalStorage: "0 GB",
        activeUsers: 0,
      });
    }
  };

  const fetchUsers = async () => {
    try {
      setError(null);
      const response = await axios.get("admin/users");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setError("Failed to load users");
      setUsers([]);
    }
  };

  const fetchDocuments = async () => {
    try {
      const response = await axios.get("admin/documents");
      setDocuments(response.data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setDocuments([]);
    }
  };

  const fetchActivities = async () => {
    try {
      const response = await axios.get("admin/activities");
      setActivities(response.data);
    } catch (error) {
      console.error("Error fetching activities:", error);
      setActivities([]);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;

    try {
      await axios.delete(`admin/users/${userId}`);
      await fetchUsers();
    } catch (error) {
      setError("Failed to delete user");
    }
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: FiBarChart },
    { id: "users", label: "Users", icon: FiUsers },
    { id: "documents", label: "Documents", icon: FiFile },
    { id: "analytics", label: "Analytics", icon: FiTrendingUp },
    { id: "activity", label: "Activity", icon: FiActivity },
    { id: "system", label: "System", icon: FiShield },
    { id: "settings", label: "Settings", icon: FiSettings },
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      green: { bg: "bg-green-100", text: "text-green-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      orange: { bg: "bg-orange-100", text: "text-orange-600" },
    };
    return colorMap[color] || colorMap.blue;
  };

  const StatCard = ({ title, value, icon: Icon, color = "blue" }) => {
    const colors = getColorClasses(color);
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-lg ${colors.bg}`}>
            <Icon className={colors.text} size={24} />
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900">{value}</p>
          </div>
        </div>
      </div>
    );
  };

  const UserTable = () => {
    const filteredUsers = users.filter(
      (user) =>
        user.username?.toLowerCase().includes(userSearch.toLowerCase()) ||
        user.email?.toLowerCase().includes(userSearch.toLowerCase())
    );

    const handleBulkDelete = async () => {
      if (selectedUsers.length === 0) return;
      if (!window.confirm(`Delete ${selectedUsers.length} selected users?`))
        return;

      try {
        await Promise.all(
          selectedUsers.map((id) => axios.delete(`admin/users/${id}`))
        );
        setSelectedUsers([]);
        await fetchUsers();
      } catch (error) {
        setError("Failed to delete selected users");
      }
    };

    const handleStatusChange = async (userId, newStatus) => {
      try {
        await axios.put(`admin/users/${userId}/status`, {
          status: newStatus,
        });
        await fetchUsers();
      } catch (error) {
        setError("Failed to update user status");
      }
    };

    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium text-gray-900">
              User Management
            </h3>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <FiSearch
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={userSearch}
                  onChange={(e) => setUserSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              {selectedUsers.length > 0 && (
                <button
                  onClick={handleBulkDelete}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 flex items-center space-x-2"
                >
                  <FiTrash2 size={16} />
                  <span>Delete Selected ({selectedUsers.length})</span>
                </button>
              )}
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
                <FiDownload size={16} />
                <span>Export</span>
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <input
                    type="checkbox"
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedUsers(filteredUsers.map((u) => u.id));
                      } else {
                        setSelectedUsers([]);
                      }
                    }}
                    checked={
                      selectedUsers.length === filteredUsers.length &&
                      filteredUsers.length > 0
                    }
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedUsers([...selectedUsers, user.id]);
                        } else {
                          setSelectedUsers(
                            selectedUsers.filter((id) => id !== user.id)
                          );
                        }
                      }}
                    />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {user.username || user.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {user.email || "N/A"}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "ADMIN"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {user.role || "USER"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={user.status || "ACTIVE"}
                      onChange={(e) =>
                        handleStatusChange(user.id, e.target.value)
                      }
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border-0 ${
                        user.status === "ACTIVE"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      <option value="ACTIVE">Active</option>
                      <option value="INACTIVE">Inactive</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.createdAt
                      ? new Date(user.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button className="text-blue-600 hover:text-blue-700 mr-3">
                      <FiEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">
            Manage users, documents, and system settings
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Users"
            value={stats.totalUsers || 0}
            icon={FiUsers}
            color="blue"
          />
          <StatCard
            title="Total Documents"
            value={stats.totalDocuments || 0}
            icon={FiFile}
            color="green"
          />
          <StatCard
            title="Storage Used"
            value={stats.totalStorage || "0 GB"}
            icon={FiBarChart}
            color="purple"
          />
          <StatCard
            title="Active Users"
            value={stats.activeUsers || 0}
            icon={FiUsers}
            color="orange"
          />
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <nav className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === tab.id
                      ? "border-blue-600 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
            <button
              onClick={() => {
                setError(null);
                fetchUsers();
                fetchStats();
              }}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Tab Content */}
        <div>
          {loading ? (
            <div className="flex justify-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        User Registration Trends
                      </h3>
                      <AdminChart
                        data={[
                          { name: "Jan", value: 65 },
                          { name: "Feb", value: 59 },
                          { name: "Mar", value: 80 },
                          { name: "Apr", value: 81 },
                          { name: "May", value: 56 },
                          { name: "Jun", value: 55 },
                        ]}
                        type="line"
                        height={250}
                      />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Document Types Distribution
                      </h3>
                      <AdminChart
                        data={[
                          { name: "PDF", value: 400 },
                          { name: "DOC", value: 300 },
                          { name: "TXT", value: 200 },
                          { name: "IMG", value: 100 },
                        ]}
                        type="pie"
                        height={250}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      System Performance Overview
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="text-center">
                        <FiZap
                          className="mx-auto text-green-500 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600">System Health</p>
                        <p className="text-2xl font-bold text-green-600">98%</p>
                      </div>
                      <div className="text-center">
                        <FiHardDrive
                          className="mx-auto text-blue-500 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600">Storage Usage</p>
                        <p className="text-2xl font-bold text-blue-600">45%</p>
                      </div>
                      <div className="text-center">
                        <FiClock
                          className="mx-auto text-orange-500 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600">
                          Avg Response Time
                        </p>
                        <p className="text-2xl font-bold text-orange-600">
                          120ms
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "analytics" && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        User Growth Analytics
                      </h3>
                      <AdminChart
                        data={[
                          { name: "Week 1", value: 120 },
                          { name: "Week 2", value: 150 },
                          { name: "Week 3", value: 180 },
                          { name: "Week 4", value: 220 },
                        ]}
                        type="bar"
                        height={250}
                      />
                    </div>
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">
                        Document Upload Trends
                      </h3>
                      <AdminChart
                        data={[
                          { name: "Mon", value: 45 },
                          { name: "Tue", value: 52 },
                          { name: "Wed", value: 38 },
                          { name: "Thu", value: 61 },
                          { name: "Fri", value: 55 },
                          { name: "Sat", value: 28 },
                          { name: "Sun", value: 32 },
                        ]}
                        type="line"
                        height={250}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Performance Metrics
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      <div className="text-center">
                        <FiTrendingUp
                          className="mx-auto text-green-500 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600">Growth Rate</p>
                        <p className="text-2xl font-bold text-green-600">
                          +15%
                        </p>
                      </div>
                      <div className="text-center">
                        <FiUserCheck
                          className="mx-auto text-blue-500 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600">User Retention</p>
                        <p className="text-2xl font-bold text-blue-600">87%</p>
                      </div>
                      <div className="text-center">
                        <FiFile
                          className="mx-auto text-purple-500 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600">
                          Avg Documents/User
                        </p>
                        <p className="text-2xl font-bold text-purple-600">
                          12.5
                        </p>
                      </div>
                      <div className="text-center">
                        <FiEye
                          className="mx-auto text-orange-500 mb-2"
                          size={32}
                        />
                        <p className="text-sm text-gray-600">Page Views</p>
                        <p className="text-2xl font-bold text-orange-600">
                          2.4K
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "users" && <UserTable />}
              {activeTab === "documents" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Document Management
                    </h3>
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="relative flex-1">
                        <FiSearch
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={16}
                        />
                        <input
                          type="text"
                          placeholder="Search documents..."
                          value={docSearch}
                          onChange={(e) => setDocSearch(e.target.value)}
                          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2">
                        <FiDownload size={16} />
                        <span>Export</span>
                      </button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              <input
                                type="checkbox"
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setSelectedDocs(documents.map((d) => d.id));
                                  } else {
                                    setSelectedDocs([]);
                                  }
                                }}
                                checked={
                                  selectedDocs.length === documents.length &&
                                  documents.length > 0
                                }
                              />
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Name
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Owner
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Size
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Uploaded
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {documents
                            .filter((doc) =>
                              doc.name
                                ?.toLowerCase()
                                .includes(docSearch.toLowerCase())
                            )
                            .map((doc) => (
                              <tr key={doc.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <input
                                    type="checkbox"
                                    checked={selectedDocs.includes(doc.id)}
                                    onChange={(e) => {
                                      if (e.target.checked) {
                                        setSelectedDocs([
                                          ...selectedDocs,
                                          doc.id,
                                        ]);
                                      } else {
                                        setSelectedDocs(
                                          selectedDocs.filter(
                                            (id) => id !== doc.id
                                          )
                                        );
                                      }
                                    }}
                                  />
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {doc.name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {doc.type}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {doc.owner}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {doc.size}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                  {new Date(
                                    doc.uploadedAt
                                  ).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                  <button className="text-blue-600 hover:text-blue-700 mr-3">
                                    <FiDownload size={16} />
                                  </button>
                                  <button className="text-red-600 hover:text-red-700">
                                    <FiTrash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === "activity" && (
                <div className="space-y-6">
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      System Activity
                    </h3>
                    <AdminChart />
                  </div>
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      Recent Activity Logs
                    </h3>
                    <ActivityLog activities={activities} />
                  </div>
                </div>
              )}
              {activeTab === "settings" && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    System Settings
                  </h3>
                  <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">
                        Storage Settings
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Max Storage Per User
                          </label>
                          <input
                            type="text"
                            defaultValue="200 MB"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Auto-delete Trash After
                          </label>
                          <select className="w-full px-3 py-2 border border-gray-300 rounded-md">
                            <option value="2">2 days</option>
                            <option value="7">7 days</option>
                            <option value="30">30 days</option>
                          </select>
                        </div>
                      </div>
                    </div>
                    <div className="border-b border-gray-200 pb-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">
                        Security Settings
                      </h4>
                      <div className="space-y-3">
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            Require email verification for new users
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            defaultChecked
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">
                            Enable two-factor authentication
                          </span>
                        </label>
                      </div>
                    </div>
                    <div>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        Save Settings
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
