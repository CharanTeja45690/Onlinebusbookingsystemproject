"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/page";

const MyBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchBuses = async () => {
      // Simulate getting userId
      let driverId = window.localStorage.getItem("userId");
      try {
        const res = await fetch(`/api/driver/${driverId}/buses`);
        const data = await res.json();

        if (res.ok) {
          setBuses(data.buses);
        } else {
          setBuses([]);
        }
      } catch (error) {
        console.error("Error fetching buses:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBuses();
  }, []);

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen pt-24 bg-black overflow-hidden">
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
        <div className="relative z-10 px-4 py-10">
          {/* Header */}
          <div className="text-center mb-12 animate-fadeInUp">
            <h1 className="text-5xl font-bold text-white mb-3">
              My Bus Fleet
            </h1>
            <p className="text-white/60 text-lg">Manage your buses and routes</p>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mb-4"></div>
                <p className="text-white/60 text-lg">Loading your buses...</p>
              </div>
            ) : buses.length === 0 ? (
              <div className="text-center py-20 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
                <div className="text-6xl mb-4">🚌</div>
                <p className="text-white/60 text-xl mb-2">No buses found</p>
                <p className="text-white/40 text-sm">Add your first bus to get started</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buses.map((bus, index) => (
                  <div
                    key={bus.id}
                    className="relative group animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-[1.03] hover:shadow-2xl">
                      {/* Hover Glow */}
                      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                      {/* Content */}
                      <div className="relative">
                        {/* Bus Icon & Name */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-xl">
                                🚌
                              </div>
                              <h2 className="text-xl font-bold text-white group-hover:text-white transition-colors">
                                {bus.name}
                              </h2>
                            </div>
                            <div className="flex items-center gap-2 ml-13">
                              <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-mono text-white/80">
                                {bus.busNumber}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-white/10 mb-4"></div>

                        {/* Bus Details */}
                        <div className="space-y-3">
                          {/* Route */}
                          <div className="flex items-center gap-2 text-white/70">
                            <span className="text-white/50">🛣️</span>
                            <div className="flex items-center gap-2 flex-1">
                              <span className="text-sm">{bus.route.source}</span>
                              <span className="text-white/40">→</span>
                              <span className="text-sm">{bus.route.destination}</span>
                            </div>
                          </div>

                          {/* Date */}
                          <div className="flex items-center gap-2 text-white/70">
                            <span className="text-white/50">📅</span>
                            <span className="text-sm">
                              {new Date(bus.route.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>

                          {/* Seats Info */}
                          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/10">
                            <div className="flex-1">
                              <div className="text-white/50 text-xs mb-1">Total Seats</div>
                              <div className="text-white font-semibold">{bus.totalSeats}</div>
                            </div>
                            <div className="flex-1">
                              <div className="text-white/50 text-xs mb-1">Available</div>
                              <div className="text-green-400 font-semibold">{bus.availableSeats}</div>
                            </div>
                            <div className="flex-1">
                              <div className="text-white/50 text-xs mb-1">Booked</div>
                              <div className="text-white font-semibold">
                                {bus.totalSeats - bus.availableSeats}
                              </div>
                            </div>
                          </div>

                          {/* Progress Bar */}
                          <div className="mt-3">
                            <div className="flex justify-between text-xs text-white/50 mb-1">
                              <span>Occupancy</span>
                              <span>
                                {Math.round(((bus.totalSeats - bus.availableSeats) / bus.totalSeats) * 100)}%
                              </span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-gradient-to-r from-green-400 to-white transition-all duration-500"
                                style={{
                                  width: `${((bus.totalSeats - bus.availableSeats) / bus.totalSeats) * 100}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Corner Accents */}
                      <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats Summary (if buses exist) */}
          {!loading && buses.length > 0 && (
            <div className="max-w-4xl mx-auto mt-12 animate-fadeInUp" style={{ animationDelay: `${buses.length * 0.1 + 0.2}s` }}>
              <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">{buses.length}</div>
                    <div className="text-white/60 text-sm">Total Buses</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-white mb-1">
                      {buses.reduce((sum, bus) => sum + bus.totalSeats, 0)}
                    </div>
                    <div className="text-white/60 text-sm">Total Seats</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-green-400 mb-1">
                      {buses.reduce((sum, bus) => sum + bus.availableSeats, 0)}
                    </div>
                    <div className="text-white/60 text-sm">Available Seats</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes gridMove {
            0% { transform: translate(0, 0); }
            100% { transform: translate(60px, 60px); }
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
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
          }
        `}</style>
      </div>
    </>
  );
};

export default MyBuses;