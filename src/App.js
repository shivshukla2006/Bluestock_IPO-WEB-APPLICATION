import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import Login from './components/Login';
import SignUp from './components/SignUp';
import IpoList from './components/IpoList';
import IpoDetail from './components/IpoDetail';
import MyApplication from './components/MyApplications';

// 🔐 Reusable Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
};

function App() {
  const accessToken = localStorage.getItem('accessToken');

  return (
    <Router>
      {/* 🔔 Toast Notifications */}
      <Toaster position="top-center" reverseOrder={false} />

      {/* ⚡ Route Definitions */}
      <Routes>
        {/* 👋 Default Route */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🔓 Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* 🔐 Protected Routes */}
        <Route
          path="/ipos"
          element={
            <ProtectedRoute>
              <IpoList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ipo/:id"
          element={
            <ProtectedRoute>
               <IpoDetail token={accessToken} /> 
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplication token={accessToken} />
            </ProtectedRoute>
          }
        />

        {/* ❌ 404 Fallback */}
        <Route
          path="*"
          element={
            <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">
              404 – Page Not Found
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
