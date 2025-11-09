"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import emailjs from "emailjs-com";
import Navbar from "../../navbar/page";

const BookBus = () => {
  const { id: busId } = useParams();
  const router = useRouter();
  const [userId, setUserId] = useState(null);

  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  
  // Payment details state
  const [paymentDetails, setPaymentDetails] = useState({
    upiId: "",
    cardNumber: "",
    cardHolderName: "",
    expiryDate: "",
    cvv: "",
  });

  useEffect(() => {
    // Get userId from localStorage
    const id1 = window.localStorage.getItem("userId");
    setUserId(id1);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await fetch(`/api/bus/${busId}`);
        const data = await res.json();
        if (res.ok) {
          setBus(data.bus);
          setTotalPrice(data.bus.price);
        }
      } catch (error) {
        console.error("Error fetching bus:", error);
      } finally {
        setLoading(false);
      }
    };

    if (busId) fetchBus();
  }, [busId]);

  // Update total price when seats change
  useEffect(() => {
    if (bus) {
      setTotalPrice(bus.price * seats);
    }
  }, [seats, bus]);

  const handlePaymentSelect = (method) => {
    setPaymentMethod(method);
    // Reset payment details when changing method
    setPaymentDetails({
      upiId: "",
      cardNumber: "",
      cardHolderName: "",
      expiryDate: "",
      cvv: "",
    });
  };

  const handlePaymentDetailChange = (e) => {
    setPaymentDetails({ ...paymentDetails, [e.target.name]: e.target.value });
  };

  const handleProceedToPayment = () => {
    if (!paymentMethod) {
      setMessage("Please select a payment method");
      return;
    }
    setShowPaymentModal(true);
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === "UPI" && !paymentDetails.upiId) {
      setMessage("❌ Please enter UPI ID");
      return false;
    }
    if ((paymentMethod === "CREDIT_CARD" || paymentMethod === "DEBIT_CARD") && 
        (!paymentDetails.cardNumber || !paymentDetails.cardHolderName || 
         !paymentDetails.expiryDate || !paymentDetails.cvv)) {
      setMessage("❌ Please fill all card details");
      return false;
    }
    return true;
  };

  const handleBooking = async () => {
    setMessage("");
    
    // Skip validation for cash payment
    if (paymentMethod !== "CASH" && !validatePaymentDetails()) {
      return;
    }
    
    setIsProcessing(true);

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          userId, 
          busId, 
          seats,
          price: totalPrice,
          paymentMode: paymentMethod,
          paymentDetails 
        }),
      });

      const data = await res.json();

      if (res.ok) {
        if (paymentMethod === "CASH") {
          setMessage("✅ Booking confirmed! Pay cash on the bus.");
        } else {
          setMessage(`✅ Ticket booked successfully! Transaction ID: ${data.transactionId}`);
        }
        
        setBookingSuccess(true);

        // Send email
        try {
          await emailjs.send(
            "service_zjk2uoq",
            "template_x3fhe5y",
            {
              user_name: data?.userName || "Customer",
              user_email: data?.userEmail || "customer@email.com",
              driver_name: data?.driverName || bus?.driver?.name,
              driver_email: data?.driverEmail || "driver@email.com",
              bus_name: data?.busName || bus?.name,
              route: `${bus?.route?.source} ➜ ${bus?.route?.destination}`,
              seats: seats,
              date: new Date(bus?.route?.date).toLocaleDateString(),
              payment_method: paymentMethod,
              transaction_id: data?.transactionId || "N/A",
              total_amount: totalPrice,
            },
            "gYNsilMKXgq1asd1p"
          );
        } catch (emailError) {
          console.error("Email error:", emailError);
        }

        // Redirect after 2 seconds
        setTimeout(() => {
          router.push("/ui/mybookings");
        }, 2000);
      } else {
        setMessage(data.message || "❌ Booking failed.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      setMessage("Something went wrong. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
          <p className="text-white text-lg">Loading bus details...</p>
        </div>
      </div>
    );
  }

  if (!bus) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <p className="text-yellow-400 text-xl">Bus not found.</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="relative min-h-screen pt-12 bg-black overflow-hidden">
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

        {/* Main Content */}
        <div className="relative z-10 flex justify-center items-center px-4 py-10">
          <div className="w-full max-w-lg animate-fadeInUp">
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
                  Book Your Journey
                </h1>
                <p className="text-white/60">Secure your seats now</p>
              </div>

              {/* Bus Details */}
              <div className="relative mb-8 p-6 bg-white/5 rounded-2xl border border-white/10">
                <div className="space-y-3 text-white/80">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Bus Name:</span>
                    <span className="font-semibold text-white">{bus?.name}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Bus No:</span>
                    <span className="font-semibold text-white">{bus?.busNumber}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Route:</span>
                    <span className="font-semibold text-white">
                      {bus?.route?.source} → {bus?.route?.destination}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Date:</span>
                    <span className="font-semibold text-white">
                      {bus?.route?.date
                        ? new Date(bus.route.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "N/A"}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Available Seats:</span>
                    <span className="font-semibold text-white">{bus?.availableSeats}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Price per Seat:</span>
                    <span className="font-semibold text-white">₹{bus?.price}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60">Driver:</span>
                    <span className="font-semibold text-white">{bus?.driver?.name}</span>
                  </div>
                </div>
              </div>

              {/* Seats Selection */}
              <div className="relative mb-6">
                <label className="block text-white/80 mb-2 font-medium">
                  Number of Seats
                </label>
                <input
                  type="number"
                  min="1"
                  max={bus?.availableSeats || 1}
                  value={seats}
                  onChange={(e) => setSeats(Number(e.target.value))}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                  placeholder="Enter number of seats"
                />
              </div>

              {/* Total Price Display */}
              <div className="relative mb-6 p-4 bg-white/10 border border-white/20 rounded-xl">
                <div className="flex justify-between items-center">
                  <span className="text-white/70 font-medium">Total Amount:</span>
                  <span className="text-2xl font-bold text-white">₹{totalPrice}</span>
                </div>
                <div className="text-white/40 text-sm mt-1 text-right">
                  {seats} seat(s) × ₹{bus?.price}
                </div>
              </div>

              {/* Payment Method Selection */}
              <div className="relative mb-6">
                <label className="block text-white/80 mb-3 font-medium">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {/* UPI Option */}
                  <button
                    onClick={() => handlePaymentSelect("UPI")}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      paymentMethod === "UPI"
                        ? "border-white bg-white/20 shadow-lg"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-2xl">📱</div>
                      <span className="text-white text-sm font-semibold">UPI</span>
                    </div>
                    {paymentMethod === "UPI" && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    )}
                  </button>

                  {/* Credit Card Option */}
                  <button
                    onClick={() => handlePaymentSelect("CREDIT_CARD")}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      paymentMethod === "CREDIT_CARD"
                        ? "border-white bg-white/20 shadow-lg"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-2xl">💳</div>
                      <span className="text-white text-sm font-semibold">Credit Card</span>
                    </div>
                    {paymentMethod === "CREDIT_CARD" && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    )}
                  </button>

                  {/* Debit Card Option */}
                  <button
                    onClick={() => handlePaymentSelect("DEBIT_CARD")}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      paymentMethod === "DEBIT_CARD"
                        ? "border-white bg-white/20 shadow-lg"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-2xl">💳</div>
                      <span className="text-white text-sm font-semibold">Debit Card</span>
                    </div>
                    {paymentMethod === "DEBIT_CARD" && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    )}
                  </button>

                  {/* Cash Option */}
                  <button
                    onClick={() => handlePaymentSelect("CASH")}
                    className={`relative p-4 rounded-xl border-2 transition-all duration-300 transform hover:scale-105 ${
                      paymentMethod === "CASH"
                        ? "border-white bg-white/20 shadow-lg"
                        : "border-white/20 bg-white/5 hover:border-white/40"
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <div className="text-2xl">💵</div>
                      <span className="text-white text-sm font-semibold">Cash</span>
                    </div>
                    {paymentMethod === "CASH" && (
                      <div className="absolute top-2 right-2 w-4 h-4 bg-white rounded-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-black rounded-full"></div>
                      </div>
                    )}
                  </button>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={handleProceedToPayment}
                disabled={!paymentMethod || bookingSuccess}
                className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {bookingSuccess ? "Booking Confirmed" : "Proceed to Book"}
              </button>

              {/* Message */}
              {message && (
                <div className={`mt-4 p-4 rounded-xl text-center text-sm font-medium animate-slideDown ${
                  message.includes("✅") 
                    ? "bg-green-500/20 border border-green-500/40 text-green-300" 
                    : "bg-yellow-500/20 border border-yellow-500/40 text-yellow-300"
                }`}>
                  {message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn">
            <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 w-[90%] max-w-md shadow-2xl animate-scaleIn max-h-[90vh] overflow-y-auto">
              {/* Close Button */}
              <button
                onClick={() => setShowPaymentModal(false)}
                className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
              >
                <span className="text-2xl">×</span>
              </button>

              <div className="text-center">
                <h2 className="text-2xl font-bold text-white mb-4">
                  {paymentMethod === "CASH" ? "Confirm Booking" : "Complete Payment"}
                </h2>
                
                <div className="mb-6 p-4 bg-white/5 rounded-xl">
                  <div className="text-white/60 text-sm mb-2">Total Amount</div>
                  <div className="text-3xl font-bold text-white">₹{totalPrice}</div>
                  <div className="text-white/40 text-sm mt-1">{seats} seat(s) × ₹{bus?.price}</div>
                </div>

                {paymentMethod === "CASH" ? (
                  <div className="mb-6">
                    <div className="bg-yellow-500/20 border border-yellow-500/40 rounded-xl p-4 mb-4">
                      <p className="text-yellow-300 text-sm">
                        💵 You can pay cash directly to the driver on the bus
                      </p>
                    </div>
                  </div>
                ) : paymentMethod === "UPI" ? (
                  <div className="mb-6 text-left">
                    <div className="bg-white/5 rounded-xl p-4 mb-4">
                      <label className="text-white/80 text-sm font-medium block mb-2">
                        Enter UPI ID
                      </label>
                      <input
                        type="text"
                        name="upiId"
                        placeholder="username@paytm"
                        value={paymentDetails.upiId}
                        onChange={handlePaymentDetailChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="mb-6 text-left space-y-3">
                    <div className="bg-white/5 rounded-xl p-4">
                      <label className="text-white/80 text-sm font-medium block mb-2">
                        Card Number
                      </label>
                      <input
                        type="text"
                        name="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength="16"
                        value={paymentDetails.cardNumber}
                        onChange={handlePaymentDetailChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div className="bg-white/5 rounded-xl p-4">
                      <label className="text-white/80 text-sm font-medium block mb-2">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardHolderName"
                        placeholder="John Doe"
                        value={paymentDetails.cardHolderName}
                        onChange={handlePaymentDetailChange}
                        className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/5 rounded-xl p-4">
                        <label className="text-white/80 text-sm font-medium block mb-2">
                          Expiry
                        </label>
                        <input
                          type="text"
                          name="expiryDate"
                          placeholder="MM/YY"
                          maxLength="5"
                          value={paymentDetails.expiryDate}
                          onChange={handlePaymentDetailChange}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        />
                      </div>
                      <div className="bg-white/5 rounded-xl p-4">
                        <label className="text-white/80 text-sm font-medium block mb-2">
                          CVV
                        </label>
                        <input
                          type="text"
                          name="cvv"
                          placeholder="123"
                          maxLength="3"
                          value={paymentDetails.cvv}
                          onChange={handlePaymentDetailChange}
                          className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-white/40"
                        />
                      </div>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={isProcessing}
                  className="w-full py-3 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                      Processing...
                    </span>
                  ) : paymentMethod === "CASH" ? (
                    "Confirm Booking"
                  ) : (
                    `Pay ₹${totalPrice}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

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
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          .animate-fadeInUp {
            animation: fadeInUp 0.8s ease-out forwards;
            opacity: 0;
          }
          .animate-slideDown {
            animation: slideDown 0.4s ease-out forwards;
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
          .animate-scaleIn {
            animation: scaleIn 0.3s ease-out forwards;
          }
        `}</style>
      </div>
    </>
  );
};

export default BookBus;
