import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';
import IPOCard from './IPOCard';
import Navbar from './Navbar';
import { Helmet } from 'react-helmet';

const IpoList = () => {
  const [ipos, setIpos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  const userToken = localStorage.getItem('accessToken');

  useEffect(() => {
    const fetchIPOs = async () => {
      try {
        const response = await axiosInstance.get('ipos/');
        const data = response.data.results || [];
        setIpos(data);
      } catch (error) {
        console.error('Failed to fetch IPOs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIPOs();
  }, []);

  const uniqueIPOs = ipos.filter(
    (ipo, index, self) =>
      index ===
      self.findIndex(
        (t) =>
          t.company?.name?.toLowerCase().trim() ===
          ipo.company?.name?.toLowerCase().trim()
      )
  );

  const filteredIPOs = uniqueIPOs
    .filter((ipo) =>
      ipo.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((ipo) =>
      selectedStatus === 'all'
        ? true
        : ipo.status?.toLowerCase() === selectedStatus.toLowerCase()
    );

  return (
    <>
      <Helmet>
        <title>IPO Watchlist | Bluestock Terminal</title>
      </Helmet>

      <Navbar />

      <div className="p-6 min-h-screen bg-gradient-to-br from-[#0f172a] via-black to-[#1e1b4b] text-white">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400 mb-6 text-center tracking-wide">
          📈 Bluestock IPO Watchlist
        </h2>

        {/* 🔍 Search Bar */}
        <div className="relative max-w-lg mx-auto mb-8">
          <input
            type="text"
            placeholder="🔍 Search IPO by Company"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 pl-11 text-sm bg-[#0f172a]/90 text-white border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 transition placeholder:text-gray-400 shadow-inner"
          />
          <div className="absolute left-4 top-3 text-gray-400 text-sm pointer-events-none">
            🔍
          </div>
        </div>

        {/* 🎯 Status Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['all', 'ongoing', 'upcoming', 'listed'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-wide transition-all ${
                selectedStatus === status
                  ? 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 text-black shadow-lg'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* 🔄 IPO Listing */}
        {loading ? (
          <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse p-6 rounded-xl bg-black/20 border border-white/10 shadow-md space-y-4"
              >
                <div className="h-6 w-3/4 bg-white/10 rounded" />
                <div className="h-4 w-1/2 bg-white/10 rounded" />
                <div className="h-4 w-full bg-white/5 rounded" />
                <div className="h-4 w-5/6 bg-white/5 rounded" />
                <div className="h-8 w-1/2 bg-white/10 rounded-md mt-4" />
              </div>
            ))}
          </div>
        ) : filteredIPOs.length === 0 ? (
          <p className="text-center text-white/50 text-sm">📭 No IPOs match your search.</p>
        ) : (
          <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredIPOs.map((ipo, index) => (
              <IPOCard key={index} ipo={ipo} userToken={userToken} />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default IpoList;
