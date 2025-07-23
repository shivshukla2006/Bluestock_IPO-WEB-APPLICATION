import React from 'react';
import { Link } from 'react-router-dom';
import SubscriptionForm from './SubscriptionForm';

const IPOCard = ({ ipo, userToken }) => {
  const company = ipo.company || {};
  const name = company.name || 'Unnamed';
  const industry = company.industry || '—';
  const status = ipo.status || 'Pending';

  function getLogoPath(name) {
    if (!name) return '/logos/default.png';
    const safeName = name.toLowerCase().replace(/\s|\./g, '');
    return `/logos/${safeName}.png`;
  }

  const logoPath = getLogoPath(name);

  const statusTheme = {
    Upcoming: 'bg-yellow-400/10 text-yellow-400 ring-1 ring-yellow-500',
    Listed: 'bg-green-400/10 text-green-400 ring-1 ring-green-500',
    Closed: 'bg-gray-500/10 text-gray-300 ring-1 ring-gray-500',
    Pending: 'bg-white/10 text-white/60 ring-1 ring-white/20',
  };

  const statusStyle = statusTheme[status] || statusTheme['Pending'];

  const triggerDownload = async (url, fallbackName) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = fallbackName || url.split('/').pop();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href);
    } catch (err) {
      alert("🚫 File download failed. Please try again.");
      console.error('Download error:', err);
    }
  };

  return (
    <div className="bg-black/20 backdrop-blur-xl border border-white/10 shadow-[0_0_30px_#111827aa] rounded-xl p-6 text-white w-full max-w-sm mx-auto hover:shadow-[0_0_40px_#6366f1] transition-all duration-300 group">
      <div className="flex flex-col items-center text-center">
        {/* 🔳 Logo */}
        <div className="w-16 h-16 mb-4 rounded-full bg-white flex items-center justify-center shadow-md">
          <img
            src={logoPath}
            alt={`${name} logo`}
            className="w-14 h-14 object-contain rounded-full"
            onError={(e) => {
              if (!e.target.dataset.fallback) {
                e.target.src = '/logos/default.png';
                e.target.dataset.fallback = 'true';
              }
            }}
          />
        </div>

        <h3 className="text-lg font-bold text-white mb-1 tracking-wide">{name}</h3>
        <p className="text-xs text-white/60 mb-2">{industry}</p>

        <span className={`px-3 py-1 text-xs rounded-full font-medium ${statusStyle}`}>
          {status}
        </span>

        <Link
          to={`/ipo/${ipo.id}`}
          className="mt-3 text-sm text-cyan-400 hover:underline hover:text-cyan-300 transition"
        >
          View Details →
        </Link>

        {/* 📄 DRHP/RHP Links */}
        <div className="mt-4 flex flex-col gap-2 w-full">
          {ipo.rhpLink && (
            <button
              onClick={() => triggerDownload(ipo.rhpLink, 'demo-rhp.pdf')}
              className="w-full bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-medium py-1.5 rounded-md transition shadow-md"
            >
              📄 RHP Download
            </button>
          )}
          {ipo.drhpLink && (
            <button
              onClick={() => triggerDownload(ipo.drhpLink, 'demo-drhp.pdf')}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-medium py-1.5 rounded-md transition shadow-md"
            >
              📄 DRHP Download
            </button>
          )}
        </div>

        {/* 💸 Subscription Form */}
        <div className="mt-6 w-full">
          <SubscriptionForm ipoId={ipo.id} token={userToken} />
        </div>
      </div>
    </div>
  );
};

export default IPOCard;