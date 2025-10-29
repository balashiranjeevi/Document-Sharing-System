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
  const [scrolled, setScrolled] = useState(false);

  const stats = [
    {
      number: "10M+",
      label: "Files Secured",
      color: "from-blue-500 to-cyan-500",
    },
    {
      number: "50K+",
      label: "Active Users",
      color: "from-purple-500 to-pink-500",
    },
    {
      number: "99.9%",
      label: "Uptime",
      color: "from-green-500 to-emerald-500",
    },
    { number: "150+", label: "Countries", color: "from-orange-500 to-red-500" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

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

    return () => {
      window.removeEventListener("scroll", handleScroll);
      observer.disconnect();
    };
  }, []);

  const features = [
    {
      icon: FiFolder,
      title: "Intelligent Organization",
      desc: "Auto-sort and tag your files with smart folders and AI-powered search for instant retrieval.",
      color: "blue",
      gradient: "from-blue-500 to-cyan-500",
    },
    {
      icon: FiShare2,
      title: "Secure Global Sharing",
      desc: "Share files with time-limits, password protection, and granular permission controls.",
      color: "green",
      gradient: "from-green-500 to-emerald-500",
    },
    {
      icon: FiCloud,
      title: "Seamless Cross-Device Sync",
      desc: "Access, edit, and sync your documents in real-time across desktop, mobile, and web.",
      color: "purple",
      gradient: "from-purple-500 to-pink-500",
    },
  ];

  const reviews = [
    {
      text: "DocShare transformed our remote workflow—it's fast, secure, and incredibly intuitive.",
      author: "Alex R.",
      role: "Tech Lead at Innovate Inc.",
      avatar: "AR",
      rating: 5,
    },
    {
      text: "The security features give us peace of mind while collaborating with international teams.",
      author: "Sarah M.",
      role: "Security Analyst at Global Corp",
      avatar: "SM",
      rating: 5,
    },
    {
      text: "Best document management solution we've implemented. The sync is flawless.",
      author: "James K.",
      role: "Project Manager at TechFlow",
      avatar: "JK",
      rating: 5,
    },
  ];

  const integrations = [
    {
      name: "Google Workspace",
      icon: "G",
      color: "from-red-500 to-yellow-500",
    },
    { name: "Microsoft 365", icon: "M", color: "from-blue-500 to-cyan-500" },
    { name: "Slack", icon: "S", color: "from-purple-500 to-pink-500" },
    { name: "Notion", icon: "N", color: "from-gray-700 to-gray-900" },
    { name: "Figma", icon: "F", color: "from-red-500 to-purple-500" },
    { name: "Zoom", icon: "Z", color: "from-blue-600 to-blue-800" },
  ];

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubscribing(true);
    await new Promise((resolve) => setTimeout(resolve, 2000));
    console.log("Newsletter signup:", email);
    setEmail("");
    setIsSubscribing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 font-sans antialiased">
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
          }
          
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          
          @keyframes shimmer {
            0% { background-position: -1000px 0; }
            100% { background-position: 1000px 0; }
          }

          @keyframes slideInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-float {
            animation: float 3s ease-in-out infinite;
          }

          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 8s ease infinite;
          }

          .animate-shimmer {
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent);
            background-size: 1000px 100%;
            animation: shimmer 2s infinite;
          }

          .slide-in-up {
            animation: slideInUp 0.6s ease-out forwards;
          }

          .scale-in {
            animation: scaleIn 0.5s ease-out forwards;
          }

          .glass-morphism {
            background: rgba(255, 255, 255, 0.7);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(255, 255, 255, 0.3);
          }

          .gradient-border {
            position: relative;
            background: white;
            border-radius: 1rem;
          }

          .gradient-border::before {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: 1rem;
            padding: 2px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            mask-composite: exclude;
          }

          .hover-lift {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .hover-lift:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
          }

          .text-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
          }

          .btn-glow {
            position: relative;
            overflow: hidden;
          }

          .btn-glow::before {
            content: '';
            position: absolute;
            top: 50%;
            left: 50%;
            width: 0;
            height: 0;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.3);
            transform: translate(-50%, -50%);
            transition: width 0.6s, height 0.6s;
          }

          .btn-glow:hover::before {
            width: 300px;
            height: 300px;
          }
        `}
      </style>

      {/* Enhanced Header with Glass Morphism */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "glass-morphism shadow-lg py-3" : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full blur-md opacity-70 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                  <FiCloud className="text-white text-xl" />
                </div>
              </div>
              <span className="text-2xl font-bold text-gradient">DocShare</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-8">
              {["Features", "Benefits", "Pricing", "Integrations"].map(
                (item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    className="relative text-gray-700 hover:text-blue-600 transition duration-300 font-medium group"
                  >
                    {item}
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></span>
                  </a>
                )
              )}
            </nav>

            {/* CTA Buttons */}
            <div className="hidden lg:flex items-center space-x-4">
              <Link
                to="/login"
                className="text-gray-700 font-semibold hover:text-blue-600 transition duration-300"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2.5 rounded-full font-semibold overflow-hidden group btn-glow"
              >
                <span className="relative z-10">Get Started Free</span>
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden text-gray-700 p-2 hover:bg-gray-100 rounded-lg transition"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <FiX size={24} /> : <FiMenu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 p-6 glass-morphism rounded-2xl slide-in-up">
              <nav className="flex flex-col space-y-4">
                {["Features", "Benefits", "Pricing", "Integrations"].map(
                  (item) => (
                    <a
                      key={item}
                      href={`#${item.toLowerCase()}`}
                      className="text-gray-700 hover:text-blue-600 font-medium transition py-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item}
                    </a>
                  )
                )}
                <div className="pt-4 border-t border-gray-200 space-y-3">
                  <Link
                    to="/login"
                    className="block text-center text-gray-700 font-semibold py-2"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="block bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 rounded-full font-semibold"
                  >
                    Get Started Free
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section with Modern Design */}
      <main className="pt-32">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-6xl mx-auto pb-20">
            {/* Badge */}
            <div className="inline-flex items-center glass-morphism px-5 py-2 rounded-full mb-8 scale-in">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-3 animate-pulse"></div>
              <FiTrendingUp className="text-blue-600 mr-2" size={16} />
              <span className="text-sm font-semibold text-gray-700">
                Trusted by 50,000+ teams worldwide
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-6 leading-tight slide-in-up">
              Secure Document
              <br />
              <span className="text-gradient">Management Made Simple</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-12 max-w-4xl mx-auto leading-relaxed slide-in-up">
              Store, sync, and collaborate on documents with enterprise-grade
              security. Join thousands of teams who trust DocShare.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-16 slide-in-up">
              <Link
                to="/register"
                className="group relative bg-gradient-to-r from-blue-600 to-purple-600 text-white text-lg px-10 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 w-full sm:w-auto text-center overflow-hidden btn-glow"
              >
                <span className="relative z-10">Start Free Trial</span>
              </Link>
              <button className="group flex items-center justify-center space-x-2 glass-morphism text-gray-700 text-lg px-10 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 w-full sm:w-auto">
                <FiPlay className="group-hover:scale-110 transition-transform" />
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Stats Grid with Gradient Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-5xl mx-auto mb-20">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="group glass-morphism p-6 rounded-2xl hover-lift cursor-pointer"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div
                    className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent mb-2`}
                  >
                    {stat.number}
                  </div>
                  <div className="text-gray-600 font-medium text-sm">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Dashboard Preview with 3D Effect */}
            <div className="relative max-w-6xl mx-auto perspective-1000">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-3xl opacity-20 animate-gradient"></div>
              <div className="relative glass-morphism rounded-3xl p-6 shadow-2xl hover-lift">
                <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4">
                  <div className="flex space-x-2 mb-4">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-xl p-12 aspect-video flex items-center justify-center">
                    <div className="text-center">
                      <div className="relative mb-6">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-xl opacity-50"></div>
                        <div className="relative w-24 h-24 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl animate-float">
                          <FiCloud className="text-white text-4xl" />
                        </div>
                      </div>
                      <h3 className="text-gray-900 font-bold text-2xl mb-2">
                        Enterprise-Grade Security
                      </h3>
                      <p className="text-gray-600">Secure • Fast • Reliable</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Testimonials Section */}
          <section id="testimonials" className="py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  Loved by Teams
                  <span className="text-gradient"> Worldwide</span>
                </h2>
                <p className="text-xl text-gray-600">
                  See what our customers are saying
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {reviews.map((review, index) => (
                  <div
                    key={index}
                    className="glass-morphism rounded-3xl p-8 hover-lift"
                    style={{ animationDelay: `${index * 0.2}s` }}
                  >
                    <div className="flex text-yellow-500 mb-6">
                      {[...Array(review.rating)].map((_, i) => (
                        <FiStar key={i} className="w-5 h-5 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                      "{review.text}"
                    </p>
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                        {review.avatar}
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">
                          {review.author}
                        </div>
                        <div className="text-gray-500 text-sm">
                          {review.role}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Features Section with Cards */}
          <section id="features" className="py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  Powerful Features for
                  <span className="text-gradient"> Modern Teams</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  Everything you need to manage documents securely and
                  efficiently
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {features.map((feature, index) => {
                  const Icon = feature.icon;
                  return (
                    <div
                      key={index}
                      className={`group glass-morphism rounded-3xl p-8 hover-lift cursor-pointer ${
                        activeFeature === index
                          ? "ring-4 ring-blue-500 ring-opacity-50"
                          : ""
                      }`}
                      onMouseEnter={() => setActiveFeature(index)}
                    >
                      <div
                        className={`w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300`}
                      >
                        <Icon className="text-white text-2xl" />
                      </div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-gradient transition">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 leading-relaxed mb-6">
                        {feature.desc}
                      </p>
                      <div className="flex items-center text-blue-600 font-semibold group-hover:translate-x-2 transition-transform">
                        <span>Learn more</span>
                        <FiArrowRight className="ml-2" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Integrations Section */}
          <section id="integrations" className="py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  Seamless
                  <span className="text-gradient"> Integrations</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Connect with your favorite tools and workflows
                </p>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                {integrations.map((integration, index) => (
                  <div
                    key={index}
                    className="glass-morphism rounded-2xl p-6 text-center hover-lift cursor-pointer group"
                  >
                    <div
                      className={`w-14 h-14 bg-gradient-to-r ${integration.color} rounded-xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform`}
                    >
                      {integration.icon}
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {integration.name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits Section */}
          <section id="benefits" className="py-20">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  Why Choose
                  <span className="text-gradient"> DocShare?</span>
                </h2>
                <p className="text-xl text-gray-600">
                  Built for security, performance, and collaboration
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="glass-morphism rounded-3xl p-8 hover-lift group">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <FiShield className="text-white text-2xl" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    Military-Grade Encryption
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Your files are protected with AES-256 encryption and
                    zero-knowledge architecture.
                  </p>
                </div>
                <div className="glass-morphism rounded-3xl p-8 hover-lift group">
                  <div className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <FiZap className="text-white text-2xl" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    Lightning Fast Sync
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Real-time synchronization across all your devices with our
                    global CDN.
                  </p>
                </div>
                <div className="glass-morphism rounded-3xl p-8 hover-lift group">
                  <div className="w-14 h-14 bg-gradient-to-r from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform">
                    <FiUsers className="text-white text-2xl" />
                  </div>
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    Team Collaboration
                  </h4>
                  <p className="text-gray-600 leading-relaxed">
                    Advanced sharing controls, comments, and version history for
                    teams.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Pricing Section */}
          <section id="pricing" className="py-20">
            <div className="max-w-7xl mx-auto">
              <div className="text-center mb-16">
                <h2 className="text-5xl font-bold text-gray-900 mb-4">
                  Simple, Transparent
                  <span className="text-gradient"> Pricing</span>
                </h2>
                <p className="text-xl text-gray-600">
                  No hidden fees. Cancel anytime.
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Free Plan */}
                <div className="glass-morphism rounded-3xl p-8 hover-lift">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Free
                  </h3>
                  <div className="text-5xl font-bold text-gray-900 mb-6">
                    $0
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>2 GB Storage</span>
                    </li>
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Basic Sharing</span>
                    </li>
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>30-Day History</span>
                    </li>
                  </ul>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300">
                    Get Started
                  </button>
                </div>

                {/* Pro Plan */}
                <div className="relative glass-morphism rounded-3xl p-8 hover-lift ring-4 ring-blue-500 ring-opacity-50">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-1.5 rounded-full text-sm font-bold shadow-lg">
                      MOST POPULAR
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-gradient">$9</span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>100 GB Storage</span>
                    </li>
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Advanced Sharing</span>
                    </li>
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>1-Year History</span>
                    </li>
                  </ul>
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-full font-semibold hover:shadow-xl transition duration-300 btn-glow">
                    Start Free Trial
                  </button>
                </div>

                {/* Business Plan */}
                <div className="glass-morphism rounded-3xl p-8 hover-lift">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Business
                  </h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-5xl font-bold text-gray-900">
                      $15
                    </span>
                    <span className="text-gray-600 ml-2">/month</span>
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Unlimited Storage</span>
                    </li>
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Admin Controls</span>
                    </li>
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Unlimited History</span>
                    </li>
                  </ul>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300">
                    Contact Sales
                  </button>
                </div>

                {/* Enterprise Plan */}
                <div className="glass-morphism rounded-3xl p-8 hover-lift">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Enterprise
                  </h3>
                  <div className="text-5xl font-bold text-gray-900 mb-6">
                    Custom
                  </div>
                  <ul className="space-y-4 mb-8">
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Everything in Business</span>
                    </li>
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>SSO & SCIM</span>
                    </li>
                    <li className="flex items-start text-gray-600">
                      <FiCheck className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span>Dedicated Support</span>
                    </li>
                  </ul>
                  <button className="w-full bg-gray-100 text-gray-700 py-3 rounded-full font-semibold hover:bg-gray-200 transition duration-300">
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20">
            <div className="relative max-w-5xl mx-auto rounded-3xl overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-gradient"></div>
              <div className="relative px-6 py-16 text-center">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                  Ready to Transform Your Workflow?
                </h2>
                <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
                  Join thousands of teams who trust DocShare. Start your free
                  14-day trial today.
                </p>
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                  <Link
                    to="/register"
                    className="bg-white text-blue-600 text-lg px-10 py-4 rounded-full font-semibold hover:shadow-2xl transition-all duration-300 w-full sm:w-auto text-center hover:scale-105"
                  >
                    Start Free Trial
                  </Link>
                  <button className="bg-transparent border-2 border-white text-white text-lg px-10 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 w-full sm:w-auto">
                    Schedule Demo
                  </button>
                </div>
                <p className="text-blue-200 mt-6 text-sm">
                  No credit card required • Free 14-day trial • Cancel anytime
                </p>
              </div>
            </div>
          </section>

          {/* Newsletter Section */}
          <section className="py-16 mb-20">
            <div className="max-w-4xl mx-auto glass-morphism rounded-3xl p-12 text-center">
              <h3 className="text-4xl font-bold text-gray-900 mb-4">
                Stay <span className="text-gradient">Updated</span>
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                Get the latest product updates, security tips, and industry
                insights delivered to your inbox.
              </p>
              <form
                onSubmit={handleNewsletterSubmit}
                className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto"
              >
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-4 border-2 border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                  required
                />
                <button
                  type="submit"
                  disabled={isSubscribing}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed btn-glow"
                >
                  {isSubscribing ? "Subscribing..." : "Subscribe"}
                </button>
              </form>
              <p className="text-gray-500 text-sm mt-4">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </section>
        </div>
      </main>

      {/* Enhanced Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-12 border-b border-gray-700 pb-12">
            <div className="lg:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-full">
                  <FiCloud className="text-white text-2xl" />
                </div>
                <span className="text-2xl font-bold">DocShare</span>
              </div>
              <p className="text-gray-400 max-w-md leading-relaxed mb-6">
                Secure document sharing and management made simple for the
                modern, connected workforce.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Product</h4>
              <ul className="space-y-3">
                {["Features", "Pricing", "Security", "Integrations"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href={`#${item.toLowerCase()}`}
                        className="text-gray-400 hover:text-white transition duration-150"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Company</h4>
              <ul className="space-y-3">
                {["About Us", "Careers", "Blog", "Press"].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition duration-150"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Resources</h4>
              <ul className="space-y-3">
                {["Help Center", "API Docs", "Community", "Status"].map(
                  (item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-gray-400 hover:text-white transition duration-150"
                      >
                        {item}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-lg mb-6 text-white">Legal</h4>
              <ul className="space-y-3">
                {[
                  "Privacy Policy",
                  "Terms of Service",
                  "Cookie Policy",
                  "DPA",
                ].map((item) => (
                  <li key={item}>
                    <a
                      href="#"
                      className="text-gray-400 hover:text-white transition duration-150"
                    >
                      {item}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} DocShare. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              {["Privacy", "Terms", "Security"].map((item) => (
                <a
                  key={item}
                  href="#"
                  className="text-gray-500 hover:text-white text-sm transition"
                >
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
