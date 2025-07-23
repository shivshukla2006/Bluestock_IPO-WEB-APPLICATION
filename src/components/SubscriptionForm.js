import React, { useState } from 'react';
import axios from 'axios';

const SubscriptionForm = ({ ipoId, token }) => {
  const [shares, setShares] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleApply = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      await axios.post(
        'http://127.0.0.1:8000/api/subscriptions/',
        {
          ipo_id: ipoId,
          shares_applied: Number(shares),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      setMessage('✅ Application launched.');
      setShares('');
    } catch (error) {
      console.error(error);
      if (error.response?.data?.detail) {
        setMessage(`❌ ${error.response.data.detail}`);
      } else {
        setMessage('❌ Error submitting application. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleApply}
      className="mt-6 bg-black/30 backdrop-blur-lg border border-fuchsia-900/20 rounded-2xl px-6 py-8 shadow-[0_0_40px_rgba(255,0,255,0.1)] max-w-md mx-auto text-white animate-fade-in duration-700"
    >
      <h3 className="text-lg font-semibold mb-6 text-fuchsia-400 tracking-wider text-center">
        🚀 Deploy IPO Subscription
      </h3>

      <label className="block mb-2 text-sm text-fuchsia-300 font-medium">
        Enter Share Quantity
      </label>
      <input
        type="number"
        required
        min={1}
        value={shares}
        onChange={(e) => setShares(e.target.value)}
        className="w-full px-4 py-3 rounded-md bg-black/40 text-white border border-fuchsia-500/20 focus:ring-2 focus:ring-fuchsia-500 outline-none placeholder:text-gray-400 tracking-widest text-center text-md backdrop-blur-md transition-all focus:scale-105"
        placeholder="Ex. 250"
      />

      <button
        type="submit"
        disabled={loading}
        className={`w-full mt-6 py-2 font-bold text-black rounded-full transition-all text-sm tracking-wide shadow-lg ${
          loading
            ? 'bg-fuchsia-300 cursor-wait'
            : 'bg-gradient-to-r from-fuchsia-400 via-indigo-400 to-cyan-400 hover:scale-105 hover:shadow-[0_0_20px_#f0f]'
        }`}
      >
        {loading ? 'Activating Order...' : '💸 SUBMIT'}
      </button>

      {message && (
        <p
          className={`mt-6 text-center text-sm tracking-wide ${
            message.startsWith('✅')
              ? 'text-lime-300 animate-pulse'
              : 'text-rose-400'
          }`}
        >
          {message}
        </p>
      )}
    </form>
  );
};

export default SubscriptionForm;