import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiCloud,
  FiFolder,
  FiShare2,
  FiShield,
  FiUsers,
  FiZap,
  FiCheck,
  FiArrowRight,
  FiPlay,
  FiStar,
  FiMenu,
  FiX,
  FiDownload,
  FiLock,
  FiGlobe,
  FiTrendingUp,
} from "react-icons/fi";

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubscribing, setIsSubscribing] = useState(false);
  const [stats, setStats] = useState([
    { number: "10M+", label: "Files Secured" },
    { number: "50K+", label: "Active Users" },
    { number: "99.9%", label: "Uptime" },
    { number: "150+", label: "Countries" },
  ]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible((prev) => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting,
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll("[id]").forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: FiFolder,
      title: "Intelligent Organization",
      desc: "Auto-sort and tag your files with smart folders and AI-powered search for instant retrieval.",
      color: "blue",
    },
    {
      icon: FiShare2,
      title: "Secure Global Sharing",
      desc: "Share files with time-limits, password protection, and granular permission controls.",
      color: "green",
    },
    {
      icon: FiCloud,
      title: "Seamless Cross-Device Sync",
      desc: "Access, edit, and sync your documents in real-time across desktop, mobile, and web.",
      color: "purple",
    },
  ];

  const reviews = [
    {
      text: "DocShare transformed our remote workflow—it's fast, secure, and incredibly intuitive.",
      author: "Alex R., Tech Lead at Innovate Inc.",
      avatar: "AR",
    },
    {
      text: "The security features give us peace of mind while collaborating with international teams.",
      author: "Sarah M., Security Analyst at Global Corp",
      avatar: "SM",
    },
    {
      text: "Best document management solution we've implemented. The sync is flawless.",
      author: "James K., Project Manager at TechFlow",
      avatar: "JK",
    },
  ];

  const integrations = [
    { name: "Google Workspace", icon: "G" },
    { name: "Microsoft 365", icon: "M" },
    { name: "Slack", icon: "S" },
    { name: "Notion", icon: "N" },
    { name: "Figma", icon: "F" },
    { name: "Zoom", icon: "Z" },
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Newsletter signup:", email);
    setEmail("");
    setIsSubscribing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 font-sans antialiased">
      <style>
        {`
          .voltage-button {
            position: relative;
            display: inline-block;
            overflow: hidden;
          }
          .voltage-button button {
            position: relative;
            z-index: 2;
            background: #2563eb;
            color: white;
            border: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s ease;
          }
          .voltage-button button:hover {
            background: #1d4ed8;
            transform: scale(1.05);
            box-shadow: 0 10px 25px rgba(37, 99, 235, 0.3);
          }
          .voltage-button svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .voltage-button.active svg {
            opacity: 1;
          }
          .voltage {
            stroke-dasharray: 1000;
            stroke-dashoffset: 1000;
            animation: voltage 2s linear infinite;
            filter: url(#glow);
          }
          @keyframes voltage {
            to {
              stroke-dashoffset: 0;
            }
          }
          .dots {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          .voltage-button.active .dots {
            opacity: 1;
          }
          .dot {
            position: absolute;
            width: 4px;
            height: 4px;
            background: #fff;
            border-radius: 50%;
            animation: dot 1s ease-out infinite;
          }
          .dot-1 { animation-delay: 0s; }
          .dot-2 { animation-delay: 0.1s; }
          .dot-3 { animation-delay: 0.2s; }
          .dot-4 { animation-delay: 0.3s; }
          .dot-5 { animation-delay: 0.4s; }
          @keyframes dot {
            0% {
              transform: scale(0);
              opacity: 1;
            }
            50% {
              transform: scale(1);
              opacity: 0.5;
            }
            100% {
              transform: scale(0);
              opacity: 0;
            }
          }
        `}
      </style>
      {/* Enhanced Header */}
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <FiCloud className="text-blue-600 text-3xl" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              DocShare
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <a
              href="#features"
              className="text-gray-600 hover:text-blue-600 transition duration-150 font-medium group"
            >
              Features
              <div className="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </a>
            <a
              href="#benefits"
              className="text-gray-600 hover:text-blue-600 transition duration-150 font-medium group"
            >
              Benefits
              <div className="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </a>
            <a
              href="#pricing"
              className="text-gray-600 hover:text-blue-600 transition duration-150 font-medium group"
            >
              Pricing
              <div className="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </a>
            <a
              href="#integrations"
              className="text-gray-600 hover:text-blue-600 transition duration-150 font-medium group"
            >
              Integrations
              <div className="h-0.5 bg-blue-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
            </a>
          </nav>

          <div className="hidden lg:flex items-center space-x-4">
            <Link
              to="/login"
              className="text-gray-600 font-medium hover:text-blue-600 transition duration-150"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              Get Started Free
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 py-4 px-6">
            <div className="flex flex-col space-y-4">
              <a
                href="#features"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Features
              </a>
              <a
                href="#benefits"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Benefits
              </a>
              <a
                href="#pricing"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Pricing
              </a>
              <a
                href="#integrations"
                className="text-gray-600 hover:text-blue-600 font-medium"
              >
                Integrations
              </a>
              <div className="pt-4 border-t border-gray-200">
                <Link
                  to="/login"
                  className="block text-gray-600 font-medium mb-3"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block bg-blue-600 text-white text-center py-2.5 rounded-lg font-semibold"
                >
                  Get Started Free
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <main className="container mx-auto px-6">
        <div className="text-center max-w-6xl mx-auto pt-20 pb-32">
          {/* Enhanced Tagline */}
          <div className="inline-flex items-center bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-semibold px-4 py-2 rounded-full mb-6 border border-blue-200">
            <FiTrendingUp className="mr-2" />
            Trusted by 50,000+ teams worldwide
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
            Secure Document Management{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Made Simple
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-10 max-w-4xl mx-auto leading-relaxed">
            Store, sync, and collaborate on documents with enterprise-grade
            security. Join thousands of teams who trust DocShare with their most
            important files.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
            <Link
              to="/register"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-12 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto text-center"
            >
              Start Free Trial - No Credit Card
            </Link>
            <Link
              to="/login"
              className="bg-white text-gray-700 border-2 border-gray-300 text-lg px-12 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
              <span>Login</span>
            </Link>
            <button className="bg-white text-gray-700 border-2 border-gray-300 text-lg px-12 py-4 rounded-xl font-semibold hover:border-blue-600 hover:text-blue-600 transition-all duration-300 inline-flex items-center justify-center space-x-2 w-full sm:w-auto">
              <FiPlay className="w-5 h-5" />
              <span>Watch Demo (2 min)</span>
            </button>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-20">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Enhanced Dashboard Preview */}
          <div className="relative max-w-6xl mx-auto">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-3xl blur-xl opacity-20 -z-10"></div>
            <div className="bg-white rounded-2xl shadow-2xl p-4 border border-gray-200 transform hover:scale-[1.01] transition-transform duration-300">
              <div className="bg-gray-900 rounded-lg p-3 flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-b-lg p-8 aspect-video flex items-center justify-center">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <FiCloud className="text-white text-3xl" />
                  </div>
                  <p className="text-gray-700 font-semibold text-lg">
                    Enterprise-Grade Document Management
                  </p>
                  <p className="text-gray-500 mt-2">Secure • Fast • Reliable</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Enhanced Testimonial Carousel */}
        <div className="max-w-6xl mx-auto mb-32">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Loved by Teams Worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers are saying
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow duration-300"
              >
                <div className="flex text-yellow-500 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <FiStar key={i} className="w-5 h-5 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 text-lg mb-6 italic">
                  "{review.text}"
                </p>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-semibold mr-4">
                    {review.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">
                      {review.author.split(",")[0]}
                    </div>
                    <div className="text-gray-600 text-sm">
                      {review.author.split(",")[1]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Features Section */}
        <section id="features" className="py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Modern Teams
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to manage documents securely and efficiently
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const colorMap = {
                blue: "from-blue-500 to-blue-600",
                green: "from-green-500 to-green-600",
                purple: "from-purple-500 to-purple-600",
              };

              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer ${
                    activeFeature === index ? "ring-2 ring-blue-500" : ""
                  }`}
                  onMouseEnter={() => setActiveFeature(index)}
                >
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${
                      colorMap[feature.color]
                    } rounded-2xl flex items-center justify-center mb-6 shadow-lg`}
                  >
                    <Icon className="text-white text-2xl" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.desc}
                  </p>
                  <div className="mt-6 flex items-center text-blue-600 font-semibold">
                    <span>Learn more</span>
                    <FiArrowRight className="ml-2 w-4 h-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* New Integrations Section */}
        <section id="integrations" className="py-20 bg-white rounded-3xl mb-20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Seamless Integrations
              </h2>
              <p className="text-xl text-gray-600">
                Connect with your favorite tools and workflows
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
              {integrations.map((integration, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-2xl p-6 text-center hover:bg-white hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold text-lg mx-auto mb-4">
                    {integration.icon}
                  </div>
                  <div className="font-semibold text-gray-900">
                    {integration.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Benefits Section */}
        <section id="benefits" className="py-20">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Why Choose DocShare?
              </h2>
              <p className="text-xl text-gray-600">
                Built for security, performance, and collaboration
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-white rounded-2xl p-8 border border-blue-100">
                <FiShield className="text-blue-600 text-3xl mb-6" />
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Military-Grade Encryption
                </h4>
                <p className="text-gray-600">
                  Your files are protected with AES-256 encryption and
                  zero-knowledge architecture.
                </p>
              </div>
              <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border border-purple-100">
                <FiZap className="text-purple-600 text-3xl mb-6" />
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Lightning Fast Sync
                </h4>
                <p className="text-gray-600">
                  Real-time synchronization across all your devices with our
                  global CDN.
                </p>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-white rounded-2xl p-8 border border-green-100">
                <FiUsers className="text-green-600 text-3xl mb-6" />
                <h4 className="text-xl font-bold text-gray-900 mb-4">
                  Team Collaboration
                </h4>
                <p className="text-gray-600">
                  Advanced sharing controls, comments, and version history for
                  teams.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced Pricing Section */}
        <section
          id="pricing"
          className="py-20 bg-gradient-to-br from-gray-900 to-blue-900 rounded-3xl mb-20"
        >
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-white mb-4">
                Simple, Transparent Pricing
              </h2>
              <p className="text-xl text-gray-300">
                No hidden fees. Cancel anytime.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Free Plan */}
              <div className="bg-white rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Free</h3>
                <div className="text-4xl font-bold text-gray-900 mb-6">$0</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />2 GB Storage
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    Basic Sharing
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    30-Day History
                  </li>
                </ul>
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300">
                  Get Started
                </button>
              </div>

              {/* Pro Plan */}
              <div className="bg-white rounded-2xl p-8 text-center border-4 border-blue-500 relative hover:scale-105 transition-transform duration-300">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                    MOST POPULAR
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Pro</h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$9</div>
                <div className="text-gray-600 mb-6">per user/month</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    100 GB Storage
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    Advanced Sharing
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    1-Year History
                  </li>
                </ul>
                <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-300">
                  Start Free Trial
                </button>
              </div>

              {/* Business Plan */}
              <div className="bg-white rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Business
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">$15</div>
                <div className="text-gray-600 mb-6">per user/month</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    Unlimited Storage
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    Admin Controls
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    Unlimited History
                  </li>
                </ul>
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300">
                  Contact Sales
                </button>
              </div>

              {/* Enterprise Plan */}
              <div className="bg-white rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  Enterprise
                </h3>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  Custom
                </div>
                <div className="text-gray-600 mb-6">tailored for you</div>
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    Everything in Business
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    SSO & SCIM
                  </li>
                  <li className="flex items-center text-gray-600">
                    <FiCheck className="text-green-500 mr-3" />
                    Dedicated Support
                  </li>
                </ul>
                <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-200 transition duration-300">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Enhanced CTA Section */}
        <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl mb-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Transform Your Document Workflow?
            </h2>
            <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Join thousands of teams who trust DocShare with their most
              important documents. Start your free 14-day trial today.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/register"
                className="bg-white text-blue-600 text-lg px-12 py-4 rounded-xl font-semibold hover:shadow-2xl transition-all duration-300 hover:scale-105 shadow-lg w-full sm:w-auto text-center"
              >
                Start Free Trial
              </Link>
              <button className="bg-transparent border-2 border-white text-white text-lg px-12 py-4 rounded-xl font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 w-full sm:w-auto">
                Schedule Demo
              </button>
            </div>
            <p className="text-blue-200 mt-6 text-sm">
              No credit card required • Free 14-day trial • Cancel anytime
            </p>
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="py-16 bg-white rounded-3xl mb-20">
          <div className="max-w-4xl mx-auto text-center px-6">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Stay Updated
            </h3>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Get the latest product updates, security tips, and industry
              insights delivered to your inbox.
            </p>
            <form
              onSubmit={handleNewsletterSubmit}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <button
                type="submit"
                disabled={isSubscribing}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 hover:scale-105 hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                {isSubscribing ? "Subscribing..." : "Subscribe"}
              </button>
            </form>
            <p className="text-gray-500 text-sm mt-4">
              No spam, unsubscribe at any time.
            </p>
          </div>
        </section>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 border-b border-gray-800 pb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <FiCloud className="text-blue-400 text-3xl" />
                <span className="text-2xl font-bold">DocShare</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed">
                Secure document sharing and management made simple for the
                modern, connected workforce.
              </p>
              <div className="flex space-x-4 mt-6">
                {/* Social media icons would go here */}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Product</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#features"
                    className="hover:text-white transition duration-150"
                  >
                    Features
                  </a>
                </li>
                <li>
                  <a
                    href="#pricing"
                    className="hover:text-white transition duration-150"
                  >
                    Pricing
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Security
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Integrations
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    About Us
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Careers
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Press
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">
                Resources
              </h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Help Center
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    API Docs
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Community
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Status
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-6 text-white">Legal</h4>
              <ul className="space-y-3 text-gray-400">
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="hover:text-white transition duration-150"
                  >
                    DPA
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} DocShare. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                Privacy
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                Terms
              </a>
              <a href="#" className="text-gray-500 hover:text-white text-sm">
                Security
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
