import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  const isAuthenticated = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-all duration-500 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse delay-500"></div>
      </div>

      <header className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex items-center justify-between">
          <Link to="/" className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
            Clumpcoder
          </Link>
          <nav className="hidden md:flex items-center gap-6 text-gray-700">
            <a href="#services" className="hover:text-gray-900 transition-colors">Services</a>
            <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#contact" className="hover:text-gray-900 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800 transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="px-4 py-2 rounded-lg border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white transition-colors"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-md transition-all"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 flex flex-col items-center text-center">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-white/80 backdrop-blur-sm text-gray-700 border border-gray-200 animate-fade-in">
            Innovative IT Services
          </span>
          <h1 className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight animate-slide-down">
            Build, Ship, and Scale with
            <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent"> Clumpcoder</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg sm:text-xl text-gray-600 animate-fade-in">
            We design, build, and scale robust web, mobile, and cloud solutions for startups and enterprises.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 animate-slide-up">
            {isAuthenticated ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 rounded-xl bg-gray-900 text-white hover:bg-gray-800 transition-all shadow-lg"
              >
                Go to Dashboard
              </button>
            ) : (
              <button
                onClick={() => navigate('/register')}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all shadow-lg transform hover:scale-105"
              >
                Start your project
              </button>
            )}
            <a
              href="#services"
              className="px-6 py-3 rounded-xl border border-gray-300 bg-white/80 backdrop-blur-sm text-gray-900 hover:bg-white transition-all shadow"
            >
              Explore services
            </a>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="relative z-10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: 'Custom Web Development',
                desc: 'Modern web apps built with React, Node.js, and best practices.',
                icon: '🧩',
              },
              {
                title: 'Mobile Applications',
                desc: 'Cross-platform apps with smooth UX and reliable performance.',
                icon: '📱',
              },
              {
                title: 'Cloud & DevOps',
                desc: 'Scalable infrastructure, CI/CD, containers, and observability.',
                icon: '☁️',
              },
              {
                title: 'AI & Data Engineering',
                desc: 'Practical ML, analytics pipelines, and AI integrations.',
                icon: '🤖',
              },
              {
                title: 'UI/UX Design',
                desc: 'Accessible, delightful interfaces that convert and retain.',
                icon: '🎨',
              },
              {
                title: 'Dedicated Teams',
                desc: 'Experienced engineers embedded with your product team.',
                icon: '👥',
              },
            ].map(({ title, desc, icon }, index) => (
              <div
                key={title}
                className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 p-6 animate-fade-in"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="text-3xl mb-3" aria-hidden>{icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
                <p className="text-gray-600">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section id="services" className="relative z-10 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">Services tailored to your goals</h2>
            <p className="mt-3 text-gray-600 max-w-2xl mx-auto">From discovery to launch and beyond—partner with a team that delivers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: 'Discovery & Architecture',
                points: ['Product strategy', 'Technical architecture', 'Roadmapping'],
              },
              {
                title: 'Build & Integrate',
                points: ['Feature development', 'API & integrations', 'Automated testing'],
              },
              {
                title: 'Run & Scale',
                points: ['Cloud infra & CI/CD', 'Monitoring & SRE', 'Performance tuning'],
              },
            ].map(({ title, points }) => (
              <div key={title} className="bg-white/90 backdrop-blur-md rounded-2xl shadow-lg border border-gray-200/70 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
                <ul className="space-y-2 text-gray-700">
                  {points.map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <span className="mt-1">✅</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section id="contact" className="relative z-10 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 sm:p-10 text-center text-white shadow-xl">
            <h3 className="text-2xl sm:text-3xl font-bold mb-2">Have a project in mind?</h3>
            <p className="opacity-90">Let’s discuss how Clumpcoder can help you ship faster.</p>
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
              {isAuthenticated ? (
                <button
                  onClick={() => navigate('/dashboard')}
                  className="px-6 py-3 rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Open Dashboard
                </button>
              ) : (
                <button
                  onClick={() => navigate('/register')}
                  className="px-6 py-3 rounded-xl bg-white text-gray-900 hover:bg-gray-100 transition-colors"
                >
                  Get Started
                </button>
              )}
              <a href="mailto:hello@clumpcoder.com" className="px-6 py-3 rounded-xl border border-white/60 text-white hover:bg-white/10 transition-colors">
                Email us
              </a>
            </div>
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-gray-200/70 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-gray-600">
          <p>© {new Date().getFullYear()} Clumpcoder. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-gray-800">Login</Link>
            <Link to="/register" className="hover:text-gray-800">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
