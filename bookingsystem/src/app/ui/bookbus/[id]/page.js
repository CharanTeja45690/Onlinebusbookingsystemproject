"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import emailjs from "emailjs-com";
import Navbar from "../../navbar/page";

const BookBus = () => {
  const { id: busId } = useParams();
  const userId = localStorage.getItem("userId");

  const [bus, setBus] = useState(null);
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBus = async () => {
      try {
        const res = await fetch(`/api/bus/${busId}`);
        const data = await res.json();
        if (res.ok) setBus(data.bus);
      } catch (error) {
        console.error("Error fetching bus:", error);
      } finally {
        setLoading(false);
      }
    };

    if (busId) fetchBus();
  }, [busId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, busId, seats }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("✅ Booking successful! Sending confirmation email...");

        // ✅ Send email using EmailJS
        await emailjs.send(
          "service_zjk2uoq",
          "template_x3fhe5y",
          {
            user_name: data.userName,
            user_email: data.userEmail,
            driver_name: data.driverName,
            driver_email: data.driverEmail,
            bus_name: data.busName,
            route: `${data.route.source} ➜ ${data.route.destination}`,
            seats: seats,
            date: new Date(data.route.date).toLocaleDateString(),
          },
          "gYNsilMKXgq1asd1p"
        );

        // await emailjs.send(
        //   "service_zjk2uoq",
        //   "template_gzu8eq9",
        //   {
        //     user_name: data.userName,
        //     user_email: data.userEmail,
        //     driver_name: data.driverName,
        //     driver_email: data.driverEmail,
        //     bus_name: data.busName,
        //     route: `${data.route.source} ➜ ${data.route.destination}`,
        //     seats: seats,
        //     date: new Date(data.route.date).toLocaleDateString(),
        //   },
        //   "gYNsilMKXgq1asd1p"
        // );
        setMessage("✅ Booking confirmed and emails sent!");
      } else {
        setMessage(data.message || "❌ Booking failed.");
      }
    } catch (error) {
      console.error("EmailJS error:", error);
      setMessage("Something went wrong while sending emails.");
    }
  };

  if (loading)
    return <p className="text-center text-white mt-20">Loading bus details...</p>;

  if (!bus)
    return <p className="text-center text-yellow-400 mt-20">Bus not found.</p>;

  return (
    <>
    <Navbar/>
    <div className="min-h-screen  pt-20  bg-black flex justify-center items-center text-white">
      <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-2xl p-8 w-[420px]">
        <h1 className="text-2xl font-bold mb-4 text-center">Book Your Bus</h1>

        <div className="mb-6 space-y-2">
          <p><span className="font-semibold">Bus Name:</span> {bus?.name}</p>
          <p><span className="font-semibold">Bus No:</span> {bus?.busNumber}</p>
          <p>
            <span className="font-semibold">Route:</span>{" "}
            {bus?.route?.source} ➜ {bus?.route?.destination}
          </p>
          <p>
            <span className="font-semibold">Date:</span>{" "}
            {bus?.route?.date
              ? new Date(bus.route.date).toLocaleDateString()
              : "N/A"}
          </p>
          <p>
            <span className="font-semibold">Available Seats:</span>{" "}
            {bus?.availableSeats}
          </p>
          <p><span className="font-semibold">Driver:</span> {bus?.driver?.name}</p>
        </div>

        <form onSubmit={handleBooking} className="flex flex-col space-y-4">
          <input
            type="number"
            min="1"
            max={bus?.availableSeats || 1}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            placeholder="Enter number of seats"
            required
          />

          <button
            type="submit"
            className="bg-green-500 hover:bg-green-600 py-2 rounded-lg text-white font-semibold transition-all duration-300"
          >
            Confirm Booking
          </button>
        </form>

        {message && (
          <p className="text-center text-yellow-300 mt-4">{message}</p>
        )}
      </div>
    </div>
    </>
  );
};

export default BookBus;
