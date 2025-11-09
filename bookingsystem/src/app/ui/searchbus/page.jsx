"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/page";


const SearchBus = () => {
  const router = useRouter();
  const [searchData, setSearchData] = useState({
    source: "",
    destination: "",
    date: "",
  });
  const [buses, setBuses] = useState([]);
  const [message, setMessage] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });


  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);


  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };


  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setBuses([]);
    setIsSearching(true);


    try {
      const res = await fetch("/api/search-bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(searchData),
      });


      const data = await res.json();


      if (res.ok && data.buses.length > 0) {
        setBuses(data.buses);
      } else {
        setMessage("No buses found for the selected route and date.");
      }
    } catch (error) {
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };


  const handleBusClick = (busId) => {
    router.push(`/ui/bookbus/${busId}`);
  };


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
        <div className="relative z-10 flex flex-col items-center px-4 py-10">
          {/* Search Form Card */}
          <div className="w-full max-w-md mb-12 animate-fadeInUp">
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 hover:border-white/20 transition-all duration-500">
              {/* Shine Effect */}
              <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                <div
                  className="absolute inset-0 opacity-30"
                  style={{
                    background: "linear-gradient(90deg, transparent, white, transparent)",
                    animation: "borderShine 3s linear infinite",
                  }}
                ></div>
              </div>


              {/* Title */}
              <div className="relative text-center mb-8">
                <h1 className="text-3xl font-bold text-white mb-2">
                  Search Buses
                </h1>
                <p className="text-white/60">Find your perfect journey</p>
              </div>


              {/* Search Form */}
              <div className="space-y-4">
                <div className="relative group">
                  <input
                    type="text"
                    name="source"
                    placeholder="Source Location"
                    value={searchData.source}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>


                <div className="relative group">
                  <input
                    type="text"
                    name="destination"
                    placeholder="Destination Location"
                    value={searchData.destination}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>


                <div className="relative group">
                  <input
                    type="date"
                    name="date"
                    value={searchData.date}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                    required
                  />
                  <div className="absolute inset-0 rounded-xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                </div>


                <button
                  onClick={handleSearch}
                  disabled={isSearching}
                  className="w-full py-3 mt-2 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSearching ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                      Searching...
                    </span>
                  ) : (
                    "Search Buses"
                  )}
                </button>
              </div>
            </div>
          </div>


          {/* Message */}
          {message && (
            <div className="mb-8 p-4 bg-white/10 border border-white/20 rounded-xl text-white text-center animate-slideDown max-w-md">
              {message}
            </div>
          )}


          {/* Results */}
          {buses.length > 0 && (
            <div className="w-full max-w-6xl">
              <h2 className="text-2xl font-bold text-white mb-6 text-center animate-fadeInUp">
                Available Buses
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {buses.map((bus, index) => (
                  <div
                    key={bus.id}
                    onClick={() => handleBusClick(bus.id)}
                    className="relative group cursor-pointer animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/30 transition-all duration-500 hover:transform hover:scale-[1.03] hover:shadow-2xl">
                      {/* Hover Glow */}
                      <div className="absolute inset-0 rounded-2xl bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>


                      {/* Content */}
                      <div className="relative">
                        {/* Bus Name & Price Header */}
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-xl font-bold text-white group-hover:text-white transition-colors flex-1">
                            {bus.name}
                          </h3>
                          <div className="ml-2 px-3 py-1 bg-white/10 border border-white/20 rounded-lg">
                            <span className="text-white font-bold text-lg">₹{bus.price}</span>
                            <span className="text-white/50 text-xs block text-center">per seat</span>
                          </div>
                        </div>


                        {/* Bus Details */}
                        <div className="space-y-2 text-white/70 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                            <span>Bus: {bus.busNumber}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                            <span className="flex items-center gap-1">
                              {bus.route.source} 
                              <span className="text-white/40">→</span> 
                              {bus.route.destination}
                            </span>
                          </div>


                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                            <span>
                              {new Date(bus.route.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>


                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                            <span>Seats: {bus.availableSeats}</span>
                          </div>


                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 bg-white/50 rounded-full"></span>
                            <span>Driver: {bus.driver.name}</span>
                          </div>
                        </div>


                        {/* Book Now Button */}
                        <div className="mt-4 pt-4 border-t border-white/10">
                          <div className="inline-flex items-center gap-2 text-white font-semibold group-hover:gap-3 transition-all duration-300">
                            <span>Book Now</span>
                            <span className="transform group-hover:translate-x-1 transition-transform">→</span>
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
            </div>
          )}
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
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
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
          .animate-slideDown {
            animation: slideDown 0.4s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
};


export default SearchBus;
