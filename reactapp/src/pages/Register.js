import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  FiCloud,
  FiEye,
  FiEyeOff,
  FiUser,
  FiMail,
  FiLock,
  FiCheck,
  FiShield,
  FiArrowRight,
  FiBriefcase,
  FiUsers,
} from "react-icons/fi";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    company: "",
    role: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    company: false,
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  // Password strength indicators
  const passwordStrength = {
    minLength: formData.password.length >= 8,
    hasUpperCase: /[A-Z]/.test(formData.password),
    hasLowerCase: /[a-z]/.test(formData.password),
    hasNumber: /[0-9]/.test(formData.password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(formData.password),
  };

  const strengthScore = Object.values(passwordStrength).filter(Boolean).length;
  const strengthLabels = [
    "Very Weak",
    "Weak",
    "Fair",
    "Good",
    "Strong",
    "Very Strong",
  ];
  const strengthColors = [
    "bg-red-500",
    "bg-orange-500",
    "bg-yellow-500",
    "bg-lime-500",
    "bg-green-500",
    "bg-emerald-500",
  ];

  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
  };

  const validateStep1 = () => {
    return (
      formData.name.trim().length >= 2 &&
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) &&
      formData.company.trim().length >= 1
    );
  };

  const validateStep2 = () => {
    return strengthScore >= 4 && acceptedTerms;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (currentStep === 1) {
      if (validateStep1()) {
        setCurrentStep(2);
      }
      return;
    }

    setLoading(true);
    setError("");

    try {
      await register(formData);
      navigate("/dashboard", {
        state: {
          message:
            "Welcome to DocShare! Your enterprise account has been created successfully.",
        },
      });
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again or contact support if the issue persists."
      );
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (field) => {
    const baseClass =
      "w-full px-4 py-3.5 pl-12 border rounded-xl focus:outline-none focus:ring-3 transition-all duration-300 text-gray-900 placeholder-gray-400";

    if (touched[field] && !formData[field]) {
      return `${baseClass} border-red-300 focus:ring-red-500/20 focus:border-red-500 bg-red-50/50`;
    }

    return `${baseClass} border-gray-200 focus:ring-blue-500/30 focus:border-blue-500 bg-white hover:border-gray-300`;
  };

  const features = [
    { icon: FiShield, text: "Enterprise-grade security" },
    { icon: FiUsers, text: "Team collaboration" },
    { icon: FiBriefcase, text: "Business tools integration" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 rounded-full blur-3xl opacity-40"></div>
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
                Enterprise Edition
              </p>
            </div>
          </Link>

          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Start Your Secure
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                {" "}
                Document Journey
              </span>
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Join thousands of enterprises that trust DocShare with their most
              sensitive documents. Get started with enterprise-grade security
              from day one.
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
                    <Icon className="text-blue-600" size={18} />
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

        {/* Right Side - Registration Form */}
        <div className="relative">
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200/60 p-8">
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-4">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                    currentStep >= 1
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  1
                </div>
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                    currentStep >= 2
                      ? "bg-blue-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  2
                </div>
              </div>
              <span className="text-sm text-gray-500 font-medium">
                Step {currentStep} of 2
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {currentStep === 1
                  ? "Create Enterprise Account"
                  : "Security Setup"}
              </h3>
              <p className="text-gray-600">
                {currentStep === 1
                  ? "Start your 14-day free trial. No credit card required."
                  : "Secure your account with a strong password"}
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

              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-5">
                  {/* Name Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiUser className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        className={getInputClass("name")}
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        onBlur={() => handleBlur("name")}
                        placeholder="John Doe"
                      />
                    </div>
                  </div>

                  {/* Email Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Work Email *
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
                        onBlur={() => handleBlur("email")}
                        placeholder="john@company.com"
                      />
                    </div>
                  </div>

                  {/* Company Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Company *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiBriefcase className="text-gray-400" size={18} />
                      </div>
                      <input
                        type="text"
                        required
                        className={getInputClass("company")}
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        onBlur={() => handleBlur("company")}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!validateStep1()}
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-500/30 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2 group"
                  >
                    <span>Continue to Security</span>
                    <FiArrowRight
                      className="group-hover:translate-x-1 transition-transform duration-200"
                      size={18}
                    />
                  </button>
                </div>
              )}

              {/* Step 2: Security Setup */}
              {currentStep === 2 && (
                <div className="space-y-5">
                  {/* Password Field */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Create Secure Password *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <FiLock className="text-gray-400" size={18} />
                      </div>
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        minLength={8}
                        className={getInputClass("password")}
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        onBlur={() => handleBlur("password")}
                        placeholder="Create a strong password"
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

                    {/* Password Strength Indicator */}
                    {formData.password && (
                      <div className="mt-4 space-y-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-700 font-medium">
                            Password strength:
                          </span>
                          <span
                            className={`font-semibold ${
                              strengthScore === 0
                                ? "text-red-600"
                                : strengthScore === 1
                                ? "text-orange-600"
                                : strengthScore === 2
                                ? "text-yellow-600"
                                : strengthScore === 3
                                ? "text-lime-600"
                                : strengthScore === 4
                                ? "text-green-600"
                                : "text-emerald-600"
                            }`}
                          >
                            {strengthLabels[strengthScore]}
                          </span>
                        </div>

                        <div className="flex space-x-1">
                          {[1, 2, 3, 4, 5, 6].map((level) => (
                            <div
                              key={level}
                              className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                                level <= strengthScore
                                  ? strengthColors[level - 1]
                                  : "bg-gray-200"
                              }`}
                            />
                          ))}
                        </div>

                        {/* Password Requirements */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                          {[
                            {
                              met: passwordStrength.minLength,
                              text: "8+ characters",
                            },
                            {
                              met: passwordStrength.hasUpperCase,
                              text: "Uppercase letter",
                            },
                            {
                              met: passwordStrength.hasLowerCase,
                              text: "Lowercase letter",
                            },
                            { met: passwordStrength.hasNumber, text: "Number" },
                            {
                              met: passwordStrength.hasSpecialChar,
                              text: "Special character",
                            },
                          ].map((req, index) => (
                            <div
                              key={index}
                              className="flex items-center space-x-2"
                            >
                              <div
                                className={`w-5 h-5 rounded-full flex items-center justify-center ${
                                  req.met ? "bg-green-100" : "bg-gray-100"
                                }`}
                              >
                                <FiCheck
                                  className={`${
                                    req.met ? "text-green-600" : "text-gray-300"
                                  }`}
                                  size={14}
                                />
                              </div>
                              <span
                                className={
                                  req.met ? "text-green-700" : "text-gray-500"
                                }
                              >
                                {req.text}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Terms Acceptance */}
                  <div className="space-y-3">
                    <label className="flex items-start space-x-3 cursor-pointer p-3 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                      <div className="relative mt-1">
                        <input
                          type="checkbox"
                          checked={acceptedTerms}
                          onChange={(e) => setAcceptedTerms(e.target.checked)}
                          className="sr-only"
                        />
                        <div
                          className={`w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                            acceptedTerms
                              ? "bg-blue-600 border-blue-600"
                              : "bg-white border-gray-300"
                          }`}
                        >
                          {acceptedTerms && (
                            <FiCheck className="text-white" size={14} />
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-700 leading-relaxed">
                        I agree to the{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Terms of Service
                        </a>{" "}
                        and{" "}
                        <a
                          href="#"
                          className="text-blue-600 hover:text-blue-700 font-semibold"
                        >
                          Privacy Policy
                        </a>
                        . I understand that my data will be processed securely.
                      </div>
                    </label>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-gray-500/20 border border-gray-200"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !validateStep2()}
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-300 focus:outline-none focus:ring-3 focus:ring-blue-500/30 shadow-lg hover:shadow-xl disabled:shadow-none flex items-center justify-center space-x-2"
                    >
                      {loading ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          <span>Creating Account...</span>
                        </>
                      ) : (
                        <>
                          <span>Create Enterprise Account</span>
                          <FiArrowRight size={18} />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Login Link */}
              <div className="text-center pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Already have an enterprise account?{" "}
                  <Link
                    to="/login"
                    className="text-blue-600 hover:text-blue-700 font-semibold transition-colors duration-200 inline-flex items-center space-x-1 group"
                  >
                    <span>Sign in here</span>
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

export default Register;
