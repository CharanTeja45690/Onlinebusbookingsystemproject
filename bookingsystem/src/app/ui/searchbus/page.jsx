"use client";
import React, { useState } from "react";
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

  const handleChange = (e) => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value });
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setMessage("");
    setBuses([]);

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
    }
  };

  // 🚌 Navigate to BookBus screen with busId
  const handleBusClick = (busId) => {
    router.push(`/ui/bookbus/${busId}`);
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen bg-black flex flex-col items-center py-10 text-white">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-8 w-[450px]">
        <h1 className="text-2xl font-bold text-center mb-6">Search Available Buses</h1>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="flex flex-col space-y-4">
          <input
            type="text"
            name="source"
            placeholder="Source Location"
            value={searchData.source}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <input
            type="text"
            name="destination"
            placeholder="Destination Location"
            value={searchData.destination}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />
          <input
            type="date"
            name="date"
            value={searchData.date}
            onChange={handleChange}
            className="p-2 rounded bg-white/20 text-white placeholder-gray-300"
            required
          />

          <button
            type="submit"
            className="mt-2 bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition-all duration-300"
          >
            Search
          </button>
        </form>
      </div>

      {/* Results */}
      <div className="mt-10 w-[90%] max-w-3xl">
        {message && <p className="text-center text-yellow-300">{message}</p>}

        {buses.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
            {buses.map((bus) => (
              <div
                key={bus.id}
                onClick={() => handleBusClick(bus.id)} // 👈 Navigate when clicked
                className="cursor-pointer bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-5 hover:scale-[1.03] hover:bg-white/20 transition-all duration-300"
              >
                <h2 className="text-xl font-semibold mb-2">{bus.name}</h2>
                <p className="text-gray-300">Bus Number: {bus.busNumber}</p>
                <p className="text-gray-300">Route: {bus.route.source} ➜ {bus.route.destination}</p>
                <p className="text-gray-300">
                  Date: {new Date(bus.route.date).toLocaleDateString()}
                </p>
                <p className="text-gray-300">Available Seats: {bus.availableSeats}</p>
                <p className="text-gray-300">Driver: {bus.driver.name}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
};

export default SearchBus;

