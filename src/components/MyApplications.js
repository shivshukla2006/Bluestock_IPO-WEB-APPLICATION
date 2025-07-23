import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FiSearch, FiCalendar } from 'react-icons/fi';

const MyApplication = ({ token, refreshSignal }) => {
  const [applications, setApplications] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/subscriptions/', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        if (Array.isArray(response.data.results)) {
          setApplications(response.data.results);
        } else {
          setApplications([]);
        }
      } catch (err) {
        console.error('❌ AxiosError:', err.message);
        console.error('🔍 Error response:', err.response?.data || err);
      }
    };
    fetchApplications();
  }, [token, refreshSignal]);

  const filteredApps = applications.filter((app) => {
    const name = app.ipo?.company?.name?.toLowerCase() || '';
    const appDate = app.application_date?.split('T')[0];
    return (
      name.includes(searchTerm.toLowerCase()) &&
      (filterDate ? appDate === filterDate : true)
    );
  });

  const formatDate = (isoDate) => {
    const d = new Date(isoDate);
    return `${d.getDate().toString().padStart(2, '0')}/${(d.getMonth() + 1)
      .toString()
      .padStart(2, '0')}/${d.getFullYear()}`;
  };

  const formatNumber = (num) =>
    typeof num === 'number' ? num.toLocaleString() : num;

  const getLogo = (app) => {
    const name = app.ipo?.company?.name || '';
    const fileName = name.replace(/\s+/g, '').toLowerCase() + '.png';
    return `/logos/${fileName}`;
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-gradient-to-tr from-[#0f172a] via-[#1e293b] to-[#0f172a] min-h-screen text-white rounded-xl shadow-inner">
      <h2 className="text-3xl font-extrabold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 tracking-wide">
        📈 My IPO Applications
      </h2>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6 items-center">
        <div className="relative">
          <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search IPO by company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 bg-gray-800 text-white placeholder-gray-400 border border-gray-600 rounded-lg shadow-inner focus:ring-2 focus:ring-purple-500 focus:outline-none"
          />
        </div>

        <div className="relative">
          <FiCalendar className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="w-56 pl-10 pr-4 py-2 bg-gray-800 text-white border border-gray-600 rounded-lg shadow-inner focus:ring-2 focus:ring-pink-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-gray-700 shadow-lg">
        <table className="min-w-full text-sm backdrop-blur-md bg-gray-900/70 text-white rounded-lg overflow-hidden">
          <thead className="bg-gradient-to-r from-gray-800 to-gray-700 text-xs text-purple-300 uppercase tracking-wider">
            <tr>
              <th className="px-6 py-3 text-left">Company</th>
              <th className="px-6 py-3 text-left">Shares</th>
              <th className="px-6 py-3 text-left">Date</th>
              <th className="px-6 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length > 0 ? (
              filteredApps.map((app) => (
                <tr
                  key={app.id}
                  className="border-t border-gray-700 hover:bg-indigo-500/10 transition-all duration-200"
                >
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center shadow-md">
                      <img
                        src={getLogo(app)}
                        alt="logo"
                        className="h-50 w-20 object-contain rounded-full"
                        onError={(e) => {
                          if (!e.target.dataset.fallback) {
                            e.target.src = '/logos/quantifyltd.png';
                            e.target.dataset.fallback = 'true';
                          }
                        }}
                      />
                    </div>
                    <span className="font-medium text-white/90">
                      {app.ipo?.company?.name || 'N/A'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-blue-300 font-semibold">
                    {formatNumber(app.shares_applied)}
                  </td>
                  <td className="px-6 py-4 text-purple-300">
                    {formatDate(app.application_date)}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-bold shadow-sm ${
                        app.status === 'approved'
                          ? 'bg-green-500/80 text-white'
                          : app.status === 'rejected'
                          ? 'bg-red-500/80 text-white'
                          : 'bg-yellow-500/80 text-black animate-pulse'
                      }`}
                    >
                      {app.status || 'pending'}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="px-6 py-10 text-center text-white/40">
                  No matching applications found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyApplication;