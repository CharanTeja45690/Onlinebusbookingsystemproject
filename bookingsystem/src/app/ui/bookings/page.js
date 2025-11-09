"use client";
import React, { useEffect, useState } from "react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const fetchBookings = async (filters = {}) => {
    try {
      setLoading(true);
      const params = new URLSearchParams(filters).toString();
      const url = params ? `/api/bookings?${params}` : `/api/bookings`;

      const res = await fetch(url);
      const data = await res.json();
      if (res.ok) {
        setBookings(data.bookings);
        setFilteredBookings(data.bookings);
      } else {
        setBookings([]);
        setFilteredBookings([]);
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleFilter = async () => {
    if (!filterType || !filterValue.trim()) {
      fetchBookings();
      return;
    }

    const filters = {};
    if (filterType === "date") filters.date = filterValue;
    if (filterType === "route") filters.route = filterValue;
    if (filterType === "bus") filters.busNumber = filterValue;

    await fetchBookings(filters);
  };

  return (
    <div className="relative min-h-screen bg-black overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
            animation: "gridMove 25s linear infinite",
          }}
        ></div>
      </div>

      {/* Gradient Orbs */}
      <div
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, white, transparent)",
          left: `${mousePosition.x / 12}px`,
          top: `${mousePosition.y / 12}px`,
          transition: "all 0.3s ease-out",
        }}
      ></div>
      <div
        className="absolute w-96 h-96 rounded-full opacity-15 blur-3xl pointer-events-none"
        style={{
          background: "radial-gradient(circle, white, transparent)",
          right: `${mousePosition.x / 18}px`,
          bottom: `${mousePosition.y / 18}px`,
          transition: "all 0.5s ease-out",
        }}
      ></div>

      {/* Main Content */}
      <div className="relative z-10 p-6 md:p-10">
        {/* Header */}
        <div className="text-center mb-10 animate-fadeInUp">
          <h1 className="text-5xl font-bold text-white mb-3">
            All Bookings
          </h1>
          <p className="text-white/60 text-lg">Manage and view all bus reservations</p>
        </div>

        {/* Filter Section */}
        <div className="max-w-5xl mx-auto mb-8 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 hover:border-white/20 transition-all duration-500">
            {/* Shine Effect */}
            <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
              <div
                className="absolute inset-0 opacity-30"
                style={{
                  background: "linear-gradient(90deg, transparent, white, transparent)",
                  animation: "borderShine 3s linear infinite",
                }}
              ></div>
            </div>

            <div className="relative flex flex-col md:flex-row items-center gap-4">
              {/* Filter Type Select */}
              <div className="w-full md:w-48">
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                >
                  <option value="" className="bg-gray-900">Filter By</option>
                  <option value="date" className="bg-gray-900">📅 Date</option>
                  <option value="route" className="bg-gray-900">🛣️ Route</option>
                  <option value="bus" className="bg-gray-900">🚌 Bus Number</option>
                </select>
              </div>

              {/* Filter Value Input */}
              <div className="flex-1 w-full">
                <input
                  type={filterType === "date" ? "date" : "text"}
                  placeholder={
                    filterType === "route"
                      ? "Enter source or destination"
                      : filterType === "bus"
                      ? "Enter bus number"
                      : "Select filter type first"
                  }
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2 w-full md:w-auto">
                <button
                  onClick={handleFilter}
                  className="flex-1 md:flex-initial px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg"
                >
                  Search
                </button>
                <button
                  onClick={() => {
                    setFilterType("");
                    setFilterValue("");
                    fetchBookings();
                  }}
                  className="flex-1 md:flex-initial px-6 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/15 hover:border-white/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
              <p className="text-white/60 text-lg">Loading bookings...</p>
            </div>
          ) : filteredBookings.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-white/60 text-xl">No bookings found</p>
              <p className="text-white/40 text-sm mt-2">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">
              {/* Table Container */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-4 text-white/80 font-semibold text-sm">Booking ID</th>
                      <th className="text-left p-4 text-white/80 font-semibold text-sm">User</th>
                      <th className="text-left p-4 text-white/80 font-semibold text-sm">Bus</th>
                      <th className="text-left p-4 text-white/80 font-semibold text-sm">Driver</th>
                      <th className="text-left p-4 text-white/80 font-semibold text-sm">Route</th>
                      <th className="text-left p-4 text-white/80 font-semibold text-sm">Seats</th>
                      <th className="text-left p-4 text-white/80 font-semibold text-sm">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((b, index) => (
                      <tr
                        key={b.id}
                        className="border-b border-white/5 hover:bg-white/5 transition-all duration-300 animate-slideInLeft"
                        style={{ animationDelay: `${index * 0.05}s` }}
                      >
                        <td className="p-4 text-white/90">
                          <span className="font-mono text-sm">#{b.id}</span>
                        </td>
                        <td className="p-4 text-white/90">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-sm">
                              {b.user?.name?.charAt(0).toUpperCase()}
                            </div>
                            <span>{b.user?.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/90">
                          <div className="flex flex-col">
                            <span className="font-semibold">{b.bus?.name}</span>
                            <span className="text-white/50 text-xs">{b.bus?.busNumber}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/90">{b.driver?.name}</td>
                        <td className="p-4 text-white/90">
                          <div className="flex items-center gap-2">
                            <span>{b.route?.source}</span>
                            <span className="text-white/40">→</span>
                            <span>{b.route?.destination}</span>
                          </div>
                        </td>
                        <td className="p-4 text-white/90">
                          <span className="px-3 py-1 bg-white/10 rounded-full text-sm font-semibold">
                            {b.seats}
                          </span>
                        </td>
                        <td className="p-4 text-white/90">
                          {new Date(b.route?.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Footer Info */}
              <div className="border-t border-white/10 p-4 bg-white/5">
                <p className="text-white/60 text-sm text-center">
                  Total Bookings: <span className="text-white font-semibold">{filteredBookings.length}</span>
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(60px, 60px); }
        }
        @keyframes borderShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </div>
  );
};

export default AllBookings;