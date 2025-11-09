"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../navbar/page";

const MyBookings = () => {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [cancellingId, setCancellingId] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const id = window.localStorage.getItem("userId");
    setUserId(id);

    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    if (userId) {
      fetchBookings();
    }
  }, [userId]);

  const fetchBookings = async () => {
    try {
       const res = await fetch(`/api/cancel-booking?userId=${userId}`);
      const data = await res.json();
      
      if (res.ok) {
        setBookings(data.bookings || []);
      } else {
        setMessage(data.message || "Failed to fetch bookings");
      }
    } catch (error) {
      console.error("Error fetching bookings:", error);
      setMessage("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!confirm("Are you sure you want to cancel this booking?")) {
      return;
    }

    setCancellingId(bookingId);
    setMessage("");

    try {
      const res = await fetch("/api/cancel-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookingId, userId }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Booking cancelled successfully! Refund initiated.");
        // Refresh bookings
        fetchBookings();
      } else {
        setMessage(data.message || "❌ Failed to cancel booking");
      }
    } catch (error) {
      console.error("Cancel booking error:", error);
      setMessage("❌ Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-500/20 border-green-500/40 text-green-300";
      case "PENDING":
        return "bg-yellow-500/20 border-yellow-500/40 text-yellow-300";
      case "REFUNDED":
        return "bg-blue-500/20 border-blue-500/40 text-blue-300";
      case "FAILED":
        return "bg-red-500/20 border-red-500/40 text-red-300";
      default:
        return "bg-white/10 border-white/20 text-white/70";
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            <p className="text-white text-lg">Loading your bookings...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen pt-24 bg-black overflow-hidden">
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

        {/* Main Content */}
        <div className="relative z-10 px-4 py-10">
          <div className="max-w-6xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12 animate-fadeInUp">
              <h1 className="text-4xl font-bold text-white mb-3">
                My Bookings
              </h1>
              <p className="text-white/60">View and manage your bus bookings</p>
            </div>

            {/* Message */}
            {message && (
              <div className={`mb-8 p-4 rounded-xl text-center text-sm font-medium animate-slideDown max-w-2xl mx-auto ${
                message.includes("✅") 
                  ? "bg-green-500/20 border border-green-500/40 text-green-300" 
                  : "bg-red-500/20 border border-red-500/40 text-red-300"
              }`}>
                {message}
              </div>
            )}

            {/* Bookings List */}
            {bookings.length === 0 ? (
              <div className="text-center animate-fadeInUp">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-12 max-w-md mx-auto">
                  <div className="text-6xl mb-4">🎫</div>
                  <h2 className="text-2xl font-bold text-white mb-2">No Bookings Yet</h2>
                  <p className="text-white/60 mb-6">You haven't made any bus bookings</p>
                  <button
                    onClick={() => router.push("/ui/searchbus")}
                    className="px-6 py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] transition-all duration-300"
                  >
                    Search Buses
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {bookings.map((booking, index) => (
                  <div
                    key={booking.id}
                    className="relative group animate-fadeInUp"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all duration-500">
                      {/* Shine Effect */}
                      <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                        <div
                          className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-500"
                          style={{
                            background: "linear-gradient(90deg, transparent, white, transparent)",
                          }}
                        ></div>
                      </div>

                      {/* Content */}
                      <div className="relative">
                        {/* Header with Bus Name and Status */}
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-white mb-1">
                              {booking.bus.name}
                            </h3>
                            <p className="text-white/50 text-sm">
                              Booking ID: #{booking.id}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-lg border text-xs font-semibold ${getStatusColor(booking.payment?.paymentStatus || 'PENDING')}`}>
                            {booking.payment?.paymentStatus || 'PENDING'}
                          </div>
                        </div>

                        {/* Bus Details */}
                        <div className="space-y-3 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Bus Number:</span>
                            <span className="text-white font-medium">{booking.bus.busNumber}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Route:</span>
                            <span className="text-white font-medium">
                              {booking.bus.route.source} → {booking.bus.route.destination}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Travel Date:</span>
                            <span className="text-white font-medium">
                              {new Date(booking.bus.route.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Seats Booked:</span>
                            <span className="text-white font-medium">{booking.seats}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Driver:</span>
                            <span className="text-white font-medium">{booking.bus.driver.name}</span>
                          </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-3 mb-4 p-4 bg-white/5 rounded-xl border border-white/10">
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Total Amount:</span>
                            <span className="text-white font-bold text-lg">₹{booking.price}</span>
                          </div>
                          {booking.payment && (
                            <>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Payment Mode:</span>
                                <span className="text-white font-medium">{booking.payment.paymentMode}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Transaction ID:</span>
                                <span className="text-white/70 font-mono text-xs">
                                  {booking.payment.transactionId}
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-white/60">Payment Date:</span>
                                <span className="text-white font-medium">
                                  {new Date(booking.payment.paymentDate).toLocaleDateString("en-US", {
                                    month: "short",
                                    day: "numeric",
                                    year: "numeric",
                                  })}
                                </span>
                              </div>
                            </>
                          )}
                          <div className="flex justify-between text-sm">
                            <span className="text-white/60">Booked On:</span>
                            <span className="text-white font-medium">
                              {new Date(booking.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                          </div>
                        </div>

                        {/* Cancel Button */}
                        {booking.payment?.paymentStatus !== "REFUNDED" && (
                          <button
                            onClick={() => handleCancelBooking(booking.id)}
                            disabled={cancellingId === booking.id}
                            className="w-full py-3 bg-red-500/20 border border-red-500/40 text-red-300 rounded-xl font-semibold hover:bg-red-500/30 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {cancellingId === booking.id ? (
                              <span className="flex items-center justify-center gap-2">
                                <span className="w-5 h-5 border-2 border-red-300/30 border-t-red-300 rounded-full animate-spin"></span>
                                Cancelling...
                              </span>
                            ) : (
                              "Cancel Booking"
                            )}
                          </button>
                        )}

                        {booking.payment?.paymentStatus === "REFUNDED" && (
                          <div className="w-full py-3 bg-blue-500/20 border border-blue-500/40 text-blue-300 rounded-xl font-semibold text-center">
                            ✓ Booking Cancelled - Refund Processed
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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

export default MyBookings;
