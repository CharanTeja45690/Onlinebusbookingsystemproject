"use client";
import React, { useEffect, useState } from "react";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterType, setFilterType] = useState(""); // "date", "route", "bus"
  const [filterValue, setFilterValue] = useState("");

  // ✅ Fetch all bookings initially
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

  // ✅ Handle API-based filtering
  const handleFilter = async () => {
    if (!filterType || !filterValue.trim()) {
      fetchBookings(); // load all if empty
      return;
    }

    const filters = {};
    if (filterType === "date") filters.date = filterValue;
    if (filterType === "route") filters.route = filterValue;
    if (filterType === "bus") filters.busNumber = filterValue;

    await fetchBookings(filters);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black text-white p-10">
      <h1 className="text-4xl font-extrabold text-center mb-10">
        🚌 All Bookings
      </h1>

      {/* 🔍 Filter Section */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-8">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-800 border border-gray-700 p-2 rounded-md w-48 focus:outline-none"
        >
          <option value="">Filter By</option>
          <option value="date">Date</option>
          <option value="route">Route</option>
          <option value="bus">Bus Number</option>
        </select>

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
          className="bg-gray-800 border border-gray-700 p-2 rounded-md w-64 focus:outline-none"
        />

        <button
          onClick={handleFilter}
          className="bg-blue-600 hover:bg-blue-700 transition text-white px-4 py-2 rounded-md font-semibold"
        >
          Search
        </button>

        <button
          onClick={() => {
            setFilterType("");
            setFilterValue("");
            fetchBookings();
          }}
          className="bg-gray-700 hover:bg-gray-800 transition text-white px-4 py-2 rounded-md font-semibold"
        >
          Reset
        </button>
      </div>

      {/* 🧾 Table Section */}
      {loading ? (
        <p className="text-center text-gray-300">Loading bookings...</p>
      ) : filteredBookings.length === 0 ? (
        <p className="text-center text-yellow-400">No bookings found.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-white/10 shadow-lg">
          <table className="w-full text-sm text-left text-gray-300">
            <thead className="bg-gray-800 text-gray-400 uppercase text-xs">
              <tr>
                <th className="p-3">Booking ID</th>
                <th className="p-3">User</th>
                <th className="p-3">Bus</th>
                <th className="p-3">Driver</th>
                <th className="p-3">Route</th>
                <th className="p-3">Seats</th>
                <th className="p-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((b) => (
                <tr
                  key={b.id}
                  className="border-t border-gray-700 hover:bg-gray-800 transition"
                >
                  <td className="p-3">{b.id}</td>
                  <td className="p-3">{b.user?.name}</td>
                  <td className="p-3">{b.bus?.busNumber || b.bus?.name}</td>
                  <td className="p-3">{b.driver?.name}</td>
                  <td className="p-3">
                    {b.route?.source} ➜ {b.route?.destination}
                  </td>
                  <td className="p-3">{b.seats}</td>
                  <td className="p-3">
                    {new Date(b.route?.date).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AllBookings;

