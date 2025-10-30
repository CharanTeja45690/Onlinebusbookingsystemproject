"use client"
import React, { useState } from "react";
import Navbar from "../navbar/page";

const AddBus = () => {
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
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setBusData({ ...busData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("/api/add-bus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(busData),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Bus added successfully!");
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
        });
      } else {
        setMessage(data.message || "Failed to add bus");
      }
    } catch (error) {
      setMessage("Network error, please try again.");
    }
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-black flex justify-center items-center text-white">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 my-10 w-[450px]">
        <h1 className="text-xl font-bold text-center mb-6">Add Bus Details</h1>

        <form onSubmit={handleSubmit} className="flex flex-col text-xs space-y-3">
          {/* Bus Details */}
          <input
            type="text"
            name="name"
            placeholder="Bus Name"
            value={busData.name}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <input
            type="text"
            name="busNumber"
            placeholder="Bus Number (e.g., KA-01-AB-1234)"
            value={busData.busNumber}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <input
            type="number"
            name="totalSeats"
            placeholder="Total Seats"
            value={busData.totalSeats}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <input
            type="number"
            name="availableSeats"
            placeholder="Available Seats"
            value={busData.availableSeats}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />

          {/* Route Details */}
          <input
            type="text"
            name="source"
            placeholder="Source Location"
            value={busData.source}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={busData.destination}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <input
            type="date"
            name="date"
            value={busData.date}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />

          {/* Driver Details */}
          <input
            type="text"
            name="driverName"
            placeholder="Driver Name"
            value={busData.driverName}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <input
            type="text"
            name="licenseNo"
            placeholder="Driver License Number"
            value={busData.licenseNo}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />

          <button
            type="submit"
            className="mt-4 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            Add Bus
          </button>
          <button onClick={()=>{
        window.location.href="http://localhost:3000/ui/mybuses"
      }} className="p-3 rounded bg-amber-300 text-black font-bold">See my buses</button>
        </form>

        {message && <p className="mt-4 text-center text-yellow-300">{message}</p>}
      </div>
      
    </div>
    </>
  );
};

export default AddBus;
