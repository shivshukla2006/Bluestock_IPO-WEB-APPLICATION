import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axiosInstance from '../utils/axiosInstance';
import SubscriptionForm from './SubscriptionForm';

const IpoDetail = ({ token }) => {
  const { id } = useParams();
  const [ipo, setIpo] = useState(null);

  useEffect(() => {
    const fetchIpo = async () => {
      try {
        const res = await axiosInstance.get(`ipos/${id}/`);
        setIpo(res.data);
      } catch (err) {
        console.error('Failed to fetch IPO:', err);
      }
    };
    fetchIpo();
  }, [id]);

  if (!ipo) {
    return (
      <p className="text-center mt-10 text-white/60 animate-pulse">
        Loading IPO details...
      </p>
    );
  }

  const company = ipo.company || {};
  const name = company.name || 'Unnamed';

  const rhpLinkRaw = ipo.rhpLink || ipo.rhp_link || null;
  const drhpLinkRaw = ipo.drhpLink || ipo.drhp_link || null;

  const getLogoPath = (name) => {
    if (!name) return '/logos/default.png';
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/gi, '');
    return `/logos/${safeName}.png`;
  };

  const logoPath = getLogoPath(name);

  const triggerDownload = async (fileUrl) => {
    try {
      const res = await fetch(fileUrl);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fileUrl.split('/').pop(); // Filename from URL
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      alert("🚫 Couldn't download file. Please try again later.");
      console.error('Download error:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-10 bg-gradient-to-br from-[#0f172a] via-black to-[#1e1b4b] text-white shadow-2xl rounded-xl">
      <Link
        to="/ipos"
        className="text-sm text-cyan-400 hover:text-cyan-300 hover:underline block mb-6"
      >
        ← Back to IPO List
      </Link>

      <div className="flex flex-col sm:flex-row items-center gap-6 mb-8 text-center sm:text-left">
        <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center">
          <img
            src={logoPath}
            alt={`${name} logo`}
            className="w-16 h-16 object-contain rounded-full"
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.src = '/logos/default.png';
                e.target.dataset.fallback = 'true';
              }
            }}
          />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-pink-500">
            {name}
          </h2>
          <p className="text-sm text-white/60 mt-1">{company.industry || '—'}</p>
        </div>
      </div>

      {/* 📊 IPO Quick Info */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-sm mb-8">
        <div>
          <p className="text-white/60">Issue Price</p>
          <p className="font-semibold text-lime-300">₹{ipo.issue_price}</p>
        </div>
        <div>
          <p className="text-white/60">Open – Close</p>
          <p className="text-white/90">
            {ipo.opening_date} – {ipo.closing_date}
          </p>
        </div>
        <div>
          <p className="text-white/60">Total Shares</p>
          <p className="text-white/90">{ipo.total_shares}</p>
        </div>
        <div className="col-span-2 sm:col-span-3">
          <p className="text-white/60">Status</p>
          <span
            className={`inline-block mt-1 px-3 py-1 rounded-full text-xs font-bold shadow-sm ${
              ipo.status === 'Listed'
                ? 'bg-green-600/80 text-white'
                : ipo.status === 'Upcoming'
                ? 'bg-yellow-500/90 text-black animate-pulse'
                : 'bg-gray-500/50 text-white/80'
            }`}
          >
            {ipo.status}
          </span>
        </div>
      </div>

      {/* 🗂 Prospectus Downloads */}
      {(rhpLinkRaw || drhpLinkRaw) && (
        <div className="mt-8">
          <h3 className="text-lg font-semibold text-cyan-400 mb-4">📁 Prospectus Downloads</h3>
          <div className="flex gap-4 flex-wrap">
            {rhpLinkRaw && (
              <button
                onClick={() => triggerDownload(rhpLinkRaw)}
                className="px-4 py-2 rounded-md bg-indigo-500 hover:bg-indigo-600 text-white text-sm font-medium shadow-md transition-shadow"
              >
                📄 Download RHP
              </button>
            )}
            {drhpLinkRaw && (
              <button
                onClick={() => triggerDownload(drhpLinkRaw)}
                className="px-4 py-2 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium shadow-md transition-shadow"
              >
                📃 Download DRHP
              </button>
            )}
          </div>
        </div>
      )}

      {/* 💸 Subscribe to this IPO */}
      <div className="mt-12">
        <SubscriptionForm token={token} ipoId={ipo.id} />
      </div>
    </div>
  );
};

export default IpoDetail;