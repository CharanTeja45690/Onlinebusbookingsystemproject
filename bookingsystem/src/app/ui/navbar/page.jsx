"use client";
import React from "react";
import Link from "next/link";

const Navbar = () => {
  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/10 backdrop-blur-lg border-b border-white/20 shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo / Title */}
        <h1 className="text-2xl font-bold text-white tracking-wide drop-shadow-lg">
          DBMS <span className="text-blue-400">PROJECT</span>
        </h1>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <Link
            href="/"
            className="text-white text-lg font-medium hover:text-blue-400 transition-colors duration-300"
          >
            Home
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
