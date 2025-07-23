import axiosInstance from '../utils/axiosInstance';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'Investor',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    let errs = {};
    if (!form.fullName.trim()) errs.fullName = 'Full name is required';
    if (!form.username.trim()) errs.username = 'Username is required';
    if (!form.email.includes('@')) errs.email = 'Enter a valid email';
    if (form.password.length < 6) errs.password = 'Password too short';
    if (form.password !== form.confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    return errs;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validate();
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/register/', {
        full_name: form.fullName,
        username: form.username,
        email: form.email,
        phone: form.phone,
        password: form.password,
        confirm_password: form.confirmPassword,
        role: form.role,
      });

      console.log('✅ Signup response:', response.data);

      alert('🟢 Signup successful! Redirecting...');
      navigate('/login');
    } catch (err) {
      console.error('❌ Signup error:', err.response?.data || err.message);
      alert('🔴 Signup failed. Please check your info and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-[#0f172a] px-4 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-black/30 backdrop-blur-xl p-8 rounded-xl shadow-2xl max-w-lg w-full border border-white/10 space-y-5"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-sky-400 to-cyan-400 tracking-tight">
          🚀 Join the IPO Wave
        </h2>

        {['fullName', 'username', 'email', 'phone', 'password', 'confirmPassword'].map((field) => (
          <div key={field} className="relative">
            <input
              type={field.includes('password') ? 'password' : 'text'}
              name={field}
              value={form[field]}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full px-4 py-3 bg-[#0f172a]/80 text-white placeholder-transparent border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 transition"
            />
            <label
              htmlFor={field}
              className="absolute left-3 top-3 text-sm text-gray-400 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-focus:top-0 peer-focus:text-sm peer-focus:text-cyan-400"
            >
              {field.replace(/([A-Z])/g, ' $1')}
            </label>
            {errors[field] && <p className="text-red-400 text-xs mt-1">{errors[field]}</p>}
          </div>
        ))}

        <div>
          <label className="block mb-2 text-sm text-white/80">Account Type</label>
          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-[#0f172a]/80 border border-gray-700 text-white rounded-md focus:ring-2 focus:ring-cyan-500"
          >
            <option>Investor</option>
            <option>Analyst</option>
            <option>Company</option>
          </select>
        </div>

        <div className="flex items-center text-sm">
          <input type="checkbox" required className="mr-2 accent-cyan-500" />
          <span>
            I agree to the <strong className="text-cyan-400">Terms & Conditions</strong>
          </span>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 font-bold rounded-md text-black ${
            loading
              ? 'bg-cyan-300 cursor-not-allowed'
              : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:scale-105 transition shadow-md hover:shadow-xl'
          }`}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
};

export default SignUp;