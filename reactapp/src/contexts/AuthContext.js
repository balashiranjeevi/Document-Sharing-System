import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import DOMPurify from 'dompurify';

// Input sanitization helper
const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return DOMPurify.sanitize(input.trim());
  }
  return input;
};

// Set default base URL for axios
axios.defaults.baseURL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (token && savedUser) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        if (payload.exp > currentTime) {
          const userData = JSON.parse(savedUser);
          // Sanitize user data from localStorage
          const sanitizedUser = {
            ...userData,
            name: sanitizeInput(userData.name),
            email: sanitizeInput(userData.email)
          };
          setUser(sanitizedUser);
        } else {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      const API_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
      const response = await axios.post(`${API_URL}/auth/login`, credentials);
      const { token, user } = response.data;

      if (!token || !user) {
        throw new Error("Invalid response from server");
      }

      // Sanitize user data before storing
      const sanitizedUser = {
        ...user,
        name: sanitizeInput(user.name),
        email: sanitizeInput(user.email)
      };
      
      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(sanitizedUser));
      setUser(sanitizedUser);
      return response.data;
    } catch (error) {
      console.error("Login error:", error);
      throw new Error(error.response?.data?.message || "Login failed");
    }
  };

  const register = async (userData) => {
    try {
      const API_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      console.error("Registration error:", error);
      throw new Error(error.response?.data?.message || "Registration failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  const searchUsers = async (query) => {
    try {
      // Validate and sanitize search query
      if (!query || typeof query !== 'string' || query.trim().length === 0) {
        throw new Error('Invalid search query');
      }
      
      const sanitizedQuery = sanitizeInput(query);
      if (sanitizedQuery.length > 100) {
        throw new Error('Search query too long');
      }
      
      const API_URL =
        process.env.REACT_APP_API_BASE_URL || "http://localhost:8080/api";
      const response = await axios.get(`${API_URL}/auth/users/search`, {
        params: { q: sanitizedQuery },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      return response.data;
    } catch (error) {
      console.error("User search error:", error);
      throw new Error(error.response?.data?.message || "User search failed");
    }
  };

  const value = {
    user,
    login,
    register,
    logout,
    searchUsers,
    loading,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
