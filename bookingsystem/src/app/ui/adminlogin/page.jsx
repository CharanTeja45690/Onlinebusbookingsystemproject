"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const AdminLoginPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = () => {
    setMessage("");
    setIsLoading(true);

    // Simple validation
    if (formData.username === "admin" && formData.password === "password") {
      setMessage("Login successful!");
      setTimeout(() => {
        router.push("/ui/bookings");
      }, 1000);
    } else {
      setMessage("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-black overflow-hidden">
      {/* Animated Background Grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)`,
          backgroundSize: '50px 50px',
          animation: 'gridMove 20s linear infinite'
        }}></div>
      </div>

      {/* Gradient Orbs */}
      <div 
        className="absolute w-96 h-96 rounded-full opacity-30 blur-3xl"
        style={{
          background: 'radial-gradient(circle, white, transparent)',
          left: `${mousePosition.x / 10}px`,
          top: `${mousePosition.y / 10}px`,
          transition: 'all 0.3s ease-out'
        }}
      ></div>
      <div 
        className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl"
        style={{
          background: 'radial-gradient(circle, white, transparent)',
          right: `${mousePosition.x / 15}px`,
          bottom: `${mousePosition.y / 15}px`,
          transition: 'all 0.5s ease-out'
        }}
      ></div>

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md mx-4">
        <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl p-8 transition-all duration-500 hover:border-white/20">
          
          {/* Animated Border Effect */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden">
            <div className="absolute inset-0 opacity-50" style={{
              background: 'linear-gradient(90deg, transparent, white, transparent)',
              animation: 'borderShine 3s linear infinite'
            }}></div>
          </div>

          {/* Header */}
          <div className="relative text-center mb-8">
            {/* Admin Icon */}
            <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center text-4xl animate-fadeInUp">
              🔐
            </div>
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
              Admin Portal
            </h1>
            <p className="text-white/60 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              Secure access for administrators
            </p>
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div className="animate-slideInLeft" style={{ animationDelay: '0.3s' }}>
              <label className="block text-white/70 text-sm mb-2 ml-1">Username</label>
              <input
                type="text"
                name="username"
                placeholder="Enter admin username"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                onChange={handleChange}
                value={formData.username}
              />
            </div>

            <div className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
              <label className="block text-white/70 text-sm mb-2 ml-1">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                onChange={handleChange}
                value={formData.password}
              />
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className="w-full py-3 mt-6 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed animate-fadeInUp"
              style={{ animationDelay: '0.5s' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Authenticating...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </div>

          {/* Message */}
          {message && (
            <div className={`mt-4 p-3 rounded-xl text-center text-sm animate-slideDown ${
              message.includes("successful") 
                ? "bg-green-500/20 border border-green-500/40 text-green-300" 
                : "bg-red-500/20 border border-red-500/40 text-red-300"
            }`}>
              {message}
            </div>
          )}

          {/* Info Box */}
          {/* <div className="mt-6 p-4 bg-white/5 border border-white/10 rounded-xl animate-fadeInUp" style={{ animationDelay: '0.6s' }}>
            <p className="text-white/40 text-xs text-center">
              ⚠️ Demo Credentials: <br/>
              <span className="text-white/60 font-mono">Username: admin | Password: password</span>
            </p>
          </div> */}
        </div>

        {/* Decorative Elements */}
        <div className="absolute -top-10 -left-10 w-20 h-20 border border-white/20 rounded-full animate-pulse"></div>
        <div className="absolute -bottom-10 -right-10 w-32 h-32 border border-white/10 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        @keyframes borderShine {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
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
          animation: fadeInUp 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideInLeft {
          animation: slideInLeft 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default AdminLoginPage;