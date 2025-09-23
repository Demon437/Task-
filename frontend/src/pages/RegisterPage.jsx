import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
// Using axios from CDN (alternative if not installed via npm)
const axios = window.axios || require('axios');

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        form
      );
      toast.success(res.data?.message || 'Registration successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 transition-all duration-500 relative overflow-hidden flex items-center justify-center p-4">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20 blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-200 rounded-full opacity-20 blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/4 left-1/4 w-60 h-60 bg-indigo-200 rounded-full opacity-15 blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative z-10 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl border border-white/20 p-8 w-full max-w-md animate-slide-down">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">Join us to manage your tasks efficiently</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="John Doe"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              aria-required="true"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-white/80 backdrop-blur-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              aria-required="true"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            aria-label="Register account"
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating account...
              </>
            ) : (
              'Register'
            )}
          </button>

          <div className="text-center pt-4">
            <small className="text-gray-600">
              Already have an account?{' '}
              <span
                role="button"
                className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer transition-colors duration-200"
                onClick={() => navigate('/login')}
              >
                Login now
              </span>
            </small>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
