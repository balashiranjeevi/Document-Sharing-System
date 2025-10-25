import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiCloud,
  FiEye,
  FiEyeOff,
  FiMail,
  FiLock,
  FiArrowRight,
  FiCheck,
  FiShield,
  FiUser,
  FiZap,
} from "react-icons/fi";
import { validateEmail, validatePassword } from "../utils/validation";
import LoadingSpinner from "../components/LoadingSpinner";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for saved credentials
    const savedEmail = localStorage.getItem("rememberedEmail");
    if (savedEmail) {
      setFormData((prev) => ({ ...prev, email: savedEmail }));
      setRememberMe(true);
    }
  }, []);

  useEffect(() => {
    if (user && location.pathname === "/login") {
      const redirectPath = user.role === "ADMIN" ? "/admin" : "/dashboard";
      // Allow admins to navigate back to previous page, replace login for regular users
      const shouldReplace = user.role !== "ADMIN";
      navigate(redirectPath, { replace: shouldReplace });
    }
  }, [user, navigate, location.pathname]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      if (rememberMe) {
        localStorage.setItem("rememberedEmail", formData.email);
      } else {
        localStorage.removeItem("rememberedEmail");
      }

      await login(formData);
      // Navigation is now handled by useEffect when user state changes
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Invalid email or password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const features = [
    {
      icon: FiShield,
      text: "Enterprise-grade security",
      color: "text-green-500",
    },
    {
      icon: FiZap,
      text: "Lightning fast performance",
      color: "text-yellow-500",
    },
    { icon: FiUser, text: "Team collaboration ready", color: "text-blue-500" },
  ];

  const getInputClass = (field) => {
    const baseClass =
      "w-full px-4 py-3.5 pl-12 border rounded-xl focus:outline-none focus:ring-3 transition-all duration-300 text-gray-900 placeholder-gray-400";

    if (focusedField === field) {
      return `${baseClass} border-blue-500 focus:ring-blue-500/30 bg-white shadow-sm`;
    }

    if (error && formData[field]) {
      return `${baseClass} border-red-300 focus:ring-red-500/20 bg-red-50/50`;
    }

    return `${baseClass} border-gray-200 focus:ring-blue-500/30 focus:border-blue-500 bg-white hover:border-gray-300`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40 animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-30 animate-pulse delay-500"></div>
      </div>

      <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        {/* Left Side - Brand & Features */}
        <div className="text-center lg:text-left space-y-8">
          <Link to="/" className="inline-flex items-center space-x-4 group">
            <div className="relative">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <FiCloud className="text-white text-2xl" />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">DocShare</h1>
              <p className="text-sm text-gray-600 font-medium">
                Enterprise Secure
              </p>
            </div>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Welcome Back to
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Your Workspace
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Secure access to your documents and team collaborations.
              Everything you need, protected with enterprise-grade security.
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div
                  key={index}
                  className="flex items-center space-x-4 text-gray-700"
                >
                  <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-200 flex items-center justify-center">
                    <Icon className={feature.color} size={18} />
                  </div>
                  <span className="font-medium">{feature.text}</span>
                </div>
              );
            })}
          </div>

          {/* Trust Indicators */}
          <div className="pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 font-medium mb-4">
              TRUSTED BY INDUSTRY LEADERS
            </p>
            <div className="flex flex-wrap gap-6 opacity-60">
              {["Fortune 500", "Healthcare", "Finance", "Government"].map(
                (industry, index) => (
                  <div
                    key={index}
                    className="text-gray-700 font-semibold text-sm"
                  >
                    {industry}
                  </div>
                )
              )}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 p-8">
            {/* Security Badge */}
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-1.5 rounded-full text-xs font-semibold shadow-lg flex items-center space-x-2">
                <FiShield className="w-3 h-3" />
                <span>256-bit SSL Encrypted</span>
              </div>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h3>
              <p className="text-gray-600">
                Sign in to your enterprise account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <FiCheck className="text-white text-xs" />
                  </div>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              {/* Email Field */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiMail className="text-gray-400" size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className={getInputClass("email")}
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your work email"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Password
                  </label>
                  <Link
                    to="/forgot-password"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <FiLock className="text-gray-400" size={18} />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    className={getInputClass("password")}
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff size={20} />
                    ) : (
                      <FiEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Security Options */}
              <div className="flex items-center justify-between">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <div className="relative">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="sr-only"
                    />
                    <div
                      className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                        rememberMe
                          ? "bg-blue-600 border-blue-600"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {rememberMe && (
                        <FiCheck className="text-white" size={14} />
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    Remember this device
                  </span>
                </label>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100 focus:outline-none focus:ring-3 focus:ring-blue-500/30 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2 group"
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" />
                    <span>Authenticating...</span>
                  </>
                ) : (
                  <>
                    <span>Secure Sign In</span>
                    <FiArrowRight
                      className={`transition-transform duration-200 ${
                        isHovered ? "translate-x-1" : ""
                      }`}
                      size={18}
                    />
                  </>
                )}
              </button>

              {/* Sign Up Link */}
              <div className="text-center pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Don't have an enterprise account?{" "}
                  <Link
                    to="/register"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 inline-flex items-center space-x-1 group"
                  >
                    <span>Request access</span>
                    <FiArrowRight
                      className="group-hover:translate-x-1 transition-transform duration-200"
                      size={16}
                    />
                  </Link>
                </p>
              </div>
            </form>
          </div>

          {/* Security Footer */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
              <div className="flex items-center space-x-2">
                <FiShield size={12} />
                <span>Enterprise Security</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield size={12} />
                <span>SOC 2 Compliant</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiShield size={12} />
                <span>GDPR Ready</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
