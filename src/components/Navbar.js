import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

const Navbar = () => {
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.replace('/login');
  };

  const token = localStorage.getItem('accessToken');
  let username = 'Guest';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      username = decoded.first_name || decoded.username || 'Guest';
    } catch (err) {
      console.warn('Invalid token');
    }
  }

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/30 backdrop-blur-md border-b border-white/10 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* 🔷 Logo + Home */}
        <div className="flex items-center gap-4">
          <img
            src="/bluestock-logo.png"
            alt="Bluestock"
            className="h-9 w-auto object-contain drop-shadow-[0_0_8px_rgba(99,102,241,0.6)]"
          />
          <Link
            to="/ipos"
            className={`text-sm font-semibold tracking-wide uppercase ${
              isActive('/ipos')
                ? 'text-cyan-400 underline underline-offset-4'
                : 'text-white/80 hover:text-cyan-300'
            } transition`}
          >
            Home
          </Link>
          <Link
            to="/my-applications"
            className={`text-sm font-semibold tracking-wide uppercase ${
              isActive('/my-applications')
                ? 'text-cyan-400 underline underline-offset-4'
                : 'text-white/80 hover:text-cyan-300'
            } transition`}
          >
            My Applications
          </Link>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-white/80">
            Welcome <strong className="text-green-400">{username}</strong> 👋
          </span>
          <button
            onClick={handleLogout}
            className="bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-500 text-sm font-medium text-white px-4 py-2 rounded-md shadow-md hover:scale-105 transition-transform hover:shadow-xl"
          >
            🔓 Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

