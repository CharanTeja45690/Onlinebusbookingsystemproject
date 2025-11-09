"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../navbar/page";

const AddBus = () => {
  const [userId, setUserId] = useState(window.localStorage.getItem("userId") || "");
  const [busData, setBusData] = useState({
    name: "",
    busNumber: "",
    totalSeats: "",
    availableSeats: "",
    source: "",
    destination: "",
    date: "",
    driverName: "",
    licenseNo: "",
    price: "",
    ownerid: "",
  });
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const id = window.localStorage.getItem("userId");
    setUserId(id);
    setBusData(prev => ({ ...prev, ownerid: id }));

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setBusData({ ...busData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/add-bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(busData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Bus added successfully!");
        setBusData({
          name: "",
          busNumber: "",
          totalSeats: "",
          availableSeats: "",
          source: "",
          destination: "",
          date: "",
          driverName: "",
          licenseNo: "",
          price: "",
          ownerid: userId,
        });
      } else {
        setMessage(data.message || "❌ Failed to add bus");
      }
    } catch (error) {
      setMessage("❌ Network error, please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleViewBuses = () => {
    window.location.href = "http://localhost:3000/ui/mybuses";
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
        <div className="relative z-10 flex justify-center items-center px-4 py-10">
          <div className="w-full max-w-2xl animate-fadeInUp">
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
                  Add New Bus
                </h1>
                <p className="text-white/60">Enter bus details to add to your fleet</p>
              </div>

              {/* Form */}
              <div className="relative space-y-6">
                {/* Bus Information Section */}
                <div className="space-y-4">
                  <h2 className="text-white/80 font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">🚌</span>
                    Bus Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="name"
                      placeholder="Bus Name"
                      value={busData.name}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                    <input
                      type="text"
                      name="busNumber"
                      placeholder="Bus Number (KA-01-AB-1234)"
                      value={busData.busNumber}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                    <input
                      type="number"
                      name="totalSeats"
                      placeholder="Total Seats"
                      value={busData.totalSeats}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                    <input
                      type="number"
                      name="availableSeats"
                      placeholder="Available Seats"
                      value={busData.availableSeats}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Route Information Section */}
                <div className="space-y-4">
                  <h2 className="text-white/80 font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">🛣️</span>
                    Route Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="source"
                      placeholder="Source Location"
                      value={busData.source}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                    <input
                      type="text"
                      name="destination"
                      placeholder="Destination"
                      value={busData.destination}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                    <input
                      type="date"
                      name="date"
                      value={busData.date}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                    <input
                      type="number"
                      name="price"
                      placeholder="Price per Seat (₹)"
                      value={busData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Driver Information Section */}
                <div className="space-y-4">
                  <h2 className="text-white/80 font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                    <span className="w-6 h-6 bg-white/10 rounded-full flex items-center justify-center text-xs">👤</span>
                    Driver Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                      type="text"
                      name="driverName"
                      placeholder="Driver Name"
                      value={busData.driverName}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                    <input
                      type="text"
                      name="licenseNo"
                      placeholder="Driver License Number"
                      value={busData.licenseNo}
                      onChange={handleChange}
                      className="px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                      required
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center gap-2">
                        <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                        Adding Bus...
                      </span>
                    ) : (
                      "Add Bus"
                    )}
                  </button>
                  <button
                    onClick={handleViewBuses}
                    className="flex-1 py-3 bg-white/10 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/15 hover:border-white/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300"
                  >
                    View My Buses
                  </button>
                </div>

                {/* Message */}
                {message && (
                  <div className={`p-4 rounded-xl text-center text-sm font-medium animate-slideDown ${
                    message.includes("✅") 
                      ? "bg-green-500/20 border border-green-500/40 text-green-300" 
                      : "bg-red-500/20 border border-red-500/40 text-red-300"
                  }`}>
                    {message}
                  </div>
                )}
              </div>
            </div>
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
          @keyframes slideDown {
            from {
              opacity: 0;
              transform: translateY(-10px);
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

export default AddBus;
