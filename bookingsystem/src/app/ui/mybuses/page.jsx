"use client"
import React, { useEffect, useState } from "react";
import Navbar from "../navbar/page";

const MyBuses = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBuses = async () => {
      let driverId = localStorage.getItem("userId");
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
    <Navbar/>
    <div className="min-h-screen  pt-20 bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-center mb-8">My Added Buses</h1>

      {loading ? (
        <p className="text-center text-gray-300">Loading buses...</p>
      ) : buses.length === 0 ? (
        <p className="text-center text-yellow-400 text-lg">No bus found</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div
              key={bus.id}
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-5 shadow-lg hover:scale-[1.03] transition-all duration-300"
            >
              <h2 className="text-xl font-semibold mb-2">{bus.name}</h2>
              <p className="text-gray-300 mb-1">Bus No: {bus.busNumber}</p>
              <p className="text-gray-300 mb-1">
                Route: {bus.route.source} ➜ {bus.route.destination}
              </p>
              <p className="text-gray-300 mb-1">
                Date: {new Date(bus.route.date).toLocaleDateString()}
              </p>
              <p className="text-gray-300 mb-1">Total Seats: {bus.totalSeats}</p>
              <p className="text-green-400 font-semibold">
                Available: {bus.availableSeats}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default MyBuses;
