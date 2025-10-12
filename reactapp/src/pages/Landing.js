import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiCloud, FiFolder, FiShare2, FiShield, FiUsers, FiZap, FiCheck, FiArrowRight, FiPlay } from 'react-icons/fi';

const Landing = () => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsVisible(prev => ({
            ...prev,
            [entry.target.id]: entry.isIntersecting
          }));
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[id]').forEach((el) => {
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const features = [
    { icon: FiFolder, title: 'Organize', desc: 'Keep your files organized with folders and smart search' },
    { icon: FiShare2, title: 'Share', desc: 'Share files and folders with anyone, with full control over permissions' },
    { icon: FiCloud, title: 'Sync', desc: 'Access your files from anywhere, on any device' }
  ];
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      {/* Header */}
      <header className="flex justify-between items-center p-6">
        <div className="flex items-center space-x-2">
          <FiCloud className="text-blue-600 text-2xl" />
          <span className="text-xl font-bold text-gray-800">DocShare</span>
        </div>
        <div className="space-x-4">
          <Link to="/login" className="btn-secondary">Login</Link>
          <Link to="/register" className="btn-primary">Sign up</Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Your files, anywhere you go
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Store, sync, and share your documents securely. Access your files from any device, anywhere.
          </p>
          <div className="flex justify-center space-x-4 mb-12">
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Get started for free
            </Link>
            <Link to="/login" className="btn-secondary text-lg px-8 py-3">
              Sign in
            </Link>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-3xl mx-auto transform hover:scale-105 transition-transform duration-300">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center relative overflow-hidden group cursor-pointer">
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                <FiPlay className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
              <div className="text-center">
                <FiCloud className="text-6xl text-blue-600 mx-auto mb-4 animate-pulse" />
                <p className="text-blue-800 font-medium">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div id="features" className={`grid md:grid-cols-3 gap-8 mt-20 transition-all duration-1000 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className={`feature-card text-center cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-lg ${
                  activeFeature === index ? 'ring-2 ring-blue-500' : ''
                }`}
                onMouseEnter={() => setActiveFeature(index)}
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <Icon className={`text-4xl mx-auto mb-4 transition-colors duration-300 ${
                  activeFeature === index ? 'text-blue-600' : 'text-gray-400'
                }`} />
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Why Choose Us */}
        <div id="benefits" className="mt-32">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why choose DocShare?</h2>
            <p className="text-xl text-gray-600">Built for teams and individuals who value security and simplicity</p>
          </div>
          <div className={`grid md:grid-cols-2 lg:grid-cols-3 gap-8 transition-all duration-1000 delay-300 ${isVisible.benefits ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="flex items-start space-x-4 group hover:bg-white hover:p-6 hover:rounded-lg hover:shadow-lg transition-all duration-300">
              <FiShield className="text-2xl text-green-600 mt-1 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Bank-level security</h4>
                <p className="text-gray-600">Your files are encrypted and protected with enterprise-grade security</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 group hover:bg-white hover:p-6 hover:rounded-lg hover:shadow-lg transition-all duration-300">
              <FiUsers className="text-2xl text-purple-600 mt-1 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Team collaboration</h4>
                <p className="text-gray-600">Work together seamlessly with real-time sharing and permissions</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 group hover:bg-white hover:p-6 hover:rounded-lg hover:shadow-lg transition-all duration-300">
              <FiZap className="text-2xl text-yellow-600 mt-1 group-hover:scale-110 transition-transform duration-300" />
              <div>
                <h4 className="font-semibold text-gray-900 mb-2">Lightning fast</h4>
                <p className="text-gray-600">Upload and access your files instantly with our optimized infrastructure</p>
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div id="pricing" className="mt-32">
          <div className={`text-center mb-16 transition-all duration-1000 ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Simple, transparent pricing</h2>
            <p className="text-xl text-gray-600">Start free, upgrade when you need more</p>
          </div>
          <div className={`grid md:grid-cols-2 gap-8 max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isVisible.pricing ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-200 hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-gray-900 mb-6">$0<span className="text-lg text-gray-600">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3 opacity-0 animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <FiCheck className="text-green-600" />
                  <span>2 GB storage</span>
                </li>
                <li className="flex items-center space-x-3 opacity-0 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <FiCheck className="text-green-600" />
                  <span>File sharing</span>
                </li>
                <li className="flex items-center space-x-3 opacity-0 animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <FiCheck className="text-green-600" />
                  <span>Basic support</span>
                </li>
              </ul>
              <Link to="/register" className="btn-secondary w-full text-center block hover:scale-105 transition-transform duration-200">
                Get started
              </Link>
            </div>
            <div className="bg-blue-600 rounded-2xl shadow-lg p-8 text-white relative hover:shadow-2xl hover:scale-105 transition-all duration-300">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                <span className="bg-yellow-400 text-yellow-900 px-4 py-1 rounded-full text-sm font-medium">Popular</span>
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">$9<span className="text-lg opacity-80">/month</span></p>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center space-x-3 opacity-0 animate-fade-in" style={{animationDelay: '0.1s'}}>
                  <FiCheck className="text-blue-200" />
                  <span>100 GB storage</span>
                </li>
                <li className="flex items-center space-x-3 opacity-0 animate-fade-in" style={{animationDelay: '0.2s'}}>
                  <FiCheck className="text-blue-200" />
                  <span>Advanced sharing</span>
                </li>
                <li className="flex items-center space-x-3 opacity-0 animate-fade-in" style={{animationDelay: '0.3s'}}>
                  <FiCheck className="text-blue-200" />
                  <span>Priority support</span>
                </li>
                <li className="flex items-center space-x-3 opacity-0 animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <FiCheck className="text-blue-200" />
                  <span>Team collaboration</span>
                </li>
              </ul>
              <Link to="/register" className="bg-white text-blue-600 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium transition-all duration-200 w-full text-center block hover:scale-105">
                Start free trial
              </Link>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div id="cta" className={`mt-32 text-center bg-gray-900 rounded-2xl p-16 transition-all duration-1000 ${isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-300 mb-8">Join thousands of users who trust DocShare with their files</p>
          <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium text-lg inline-flex items-center space-x-2 transition-all duration-300 hover:scale-110 hover:shadow-lg">
            <span>Create your account</span>
            <FiArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-20">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <FiCloud className="text-blue-400 text-2xl" />
                <span className="text-xl font-bold">DocShare</span>
              </div>
              <p className="text-gray-400">Secure document sharing made simple</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Documentation</a></li>
                <li><a href="#" className="hover:text-white">Status</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 DocShare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;