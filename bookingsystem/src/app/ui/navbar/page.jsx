
"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? "bg-black/80 backdrop-blur-xl border-b border-white/20 shadow-2xl"
          : "bg-white/5 backdrop-blur-lg border-b border-white/10"
      }`}
    >
      {/* Animated top border */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer"></div>

      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo with Animation */}
          <div className="relative group">
            <div className="absolute -inset-2 bg-gradient-to-r from-white/20 to-white/5 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <h1 className="relative text-2xl md:text-3xl font-bold text-white tracking-wide drop-shadow-lg cursor-pointer">
              <span className="inline-block transition-transform duration-300 group-hover:scale-110">
                DBMS
              </span>{" "}
              <span className="text-white/90 inline-block transition-all duration-300 group-hover:text-white group-hover:scale-110">
                PROJECT
              </span>
            </h1>
            {/* Underline animation */}
            <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-white transition-all duration-300 group-hover:w-full"></div>
          </div>

          {/* Navigation Links */}
          <div className="flex items-center gap-8">
            <Link
              href="/"
              onClick={() => setActiveLink("home")}
              className="relative text-white text-lg font-medium group overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                Home
              </span>
              {/* Animated underline */}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              {/* Glow effect */}
              <span className="absolute inset-0 bg-white/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
            </Link>
            <Link
              href="/ui/mybooking"
              onClick={() => setActiveLink("home")}
              className="relative text-white text-lg font-medium group overflow-hidden"
            >
              <span className="relative z-10 transition-colors duration-300 group-hover:text-white">
                My Bookings
              </span>
              {/* Animated underline */}
              <span className="absolute bottom-0 left-0 w-full h-[2px] bg-white transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
              {/* Glow effect */}
              <span className="absolute inset-0 bg-white/10 rounded-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 -z-10"></span>
            </Link>

            <Link
              href="/ui/adminlogin"
              onClick={() => setActiveLink("admin")}
              className="relative px-6 py-2 text-white text-lg font-medium group overflow-hidden rounded-xl border border-white/20 transition-all duration-300 hover:border-white/40"
            >
              {/* Background animation */}
              <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300"></span>
              {/* Text */}
              <span className="relative z-10 transition-colors duration-300 group-hover:text-black">
                Admin
              </span>
              {/* Corner accents */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom glow effect */}
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/3 h-[1px] bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </nav>
  );
};

export default Navbar;