import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/token/', {
        username,
        password,
      });

      const { access, refresh } = response.data;
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refresh);
      window.location.replace('/ipos');
    } catch (error) {
      const message = error?.response?.data?.detail || 'Something went wrong.';
      setErrorMsg(`🔴 Login failed: ${message}`);
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-[#111827] text-white px-4">
      <div className="w-full max-w-md rounded-xl bg-black/30 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

        {/* 🔷 Logo */}
        <img
          src="/bluestock-logo.png"
          alt="Bluestock Logo"
          className="h-16 mx-auto mb-6 object-contain opacity-90 drop-shadow-[0_0_15px_rgba(99,102,241,0.8)]"
        />

        {/* ✨ Welcome */}
        <h2 className="text-2xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-400 mb-1 tracking-wide">
          Enter Bluestock Terminal
        </h2>
        <p className="text-sm text-center text-white/50 mb-8">
          Your gateway to high-impact IPO insights.
        </p>

        {/* 🔐 Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Username Field */}
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder=" "
              autoComplete="username"
              className="peer w-full px-4 py-3 bg-[#0f172a]/80 text-white placeholder-transparent rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <label
              htmlFor="username"
              className="absolute left-3 top-3 text-sm text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-pink-400 transition-all"
            >
              Username
            </label>
          </div>

          {/* Password Field */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder=" "
              autoComplete="current-password"
              className="peer w-full px-4 py-3 bg-[#0f172a]/80 text-white placeholder-transparent rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
            />
            <label
              htmlFor="password"
              className="absolute left-3 top-3 text-sm text-gray-400 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-pink-400 transition-all"
            >
              Password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-3 text-xs text-indigo-400 hover:text-pink-500 focus:outline-none"
            >
              {showPassword ? 'Hide' : 'Show'}
            </button>
          </div>

          {/* Error Message */}
          {errorMsg && (
            <div className="text-red-400 text-sm font-medium">{errorMsg}</div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 font-semibold rounded-md transition-all transform text-black ${
              loading
                ? 'bg-indigo-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 hover:scale-105 shadow-md hover:shadow-lg'
            }`}
          >
            {loading ? 'Signing in...' : 'Enter Markets'}
          </button>
        </form>

        <p className="text-sm text-center text-white/40 mt-6">
          No account yet?{' '}
          <span
            onClick={() => navigate('/signup')}
            className="text-indigo-400 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;