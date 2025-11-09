"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState("user");
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    const endpoint = isRegister ? `/api/register` : `/api/login`;
    const role = activeRole === "user" ? "USER" : "OWNER";

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, role }),
      });

      const data = await res.json();

      if (res.ok) {
        if (isRegister) {
          setMessage("Registration successful! Redirecting to login...");
          setTimeout(() => {
            setIsRegister(false);
            setIsLoading(false);
          }, 1500);
        } else {
          const userId = data.user.id;
          localStorage.setItem("userId", userId);
          setMessage("Login successful!");
          setTimeout(() => {
            if (role === "USER") {
              router.push("/ui/searchbus");
            } else if (role === "OWNER") {
              router.push("/ui/addbus");
            }
          }, 1000);
        }
      } else {
        setMessage(data.message || "Something went wrong");
        setIsLoading(false);
      }
    } catch (error) {
      setMessage("Network error");
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex items-center mt-8 justify-center min-h-screen bg-black overflow-hidden">
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
            <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
              <span className="inline-block animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
                {isRegister ? "Create Account" : "Welcome Back"}
              </span>
            </h1>
            <p className="text-white/60 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
              {isRegister ? "Join us today" : "Sign in to continue"}
            </p>
          </div>

          {/* Role Toggle */}
          <div className="relative flex gap-2 mb-8 p-1 bg-white/5 rounded-2xl animate-fadeInUp" style={{ animationDelay: '0.3s' }}>
            <div 
              className="absolute h-[calc(100%-8px)] rounded-xl bg-white transition-all duration-300 ease-out"
              style={{
                width: 'calc(50% - 4px)',
                left: activeRole === "user" ? '4px' : 'calc(50% + 0px)',
              }}
            ></div>
            <button
              onClick={() => setActiveRole("user")}
              className={`relative flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeRole === "user" ? "text-black" : "text-white/70 hover:text-white"
              }`}
            >
              User
            </button>
            <button
              onClick={() => setActiveRole("owner")}
              className={`relative flex-1 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeRole === "owner" ? "text-black" : "text-white/70 hover:text-white"
              }`}
            >
              Bus Owner
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <>
                <div className="animate-slideInLeft" style={{ animationDelay: '0.4s' }}>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="animate-slideInLeft" style={{ animationDelay: '0.5s' }}>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number"
                    pattern="[0-9]{10}"
                    maxLength="10"
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                    onChange={handleChange}
                    required
                  />
                </div>
              </>
            )}

            <div className="animate-slideInLeft" style={{ animationDelay: isRegister ? '0.6s' : '0.4s' }}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                onChange={handleChange}
                required
              />
            </div>

            <div className="animate-slideInLeft" style={{ animationDelay: isRegister ? '0.7s' : '0.5s' }}>
              <input
                type="password"
                name="password"
                placeholder="Password"
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                onChange={handleChange}
                required
              />
            </div>

            {isRegister && (
              <div className="animate-slideInLeft" style={{ animationDelay: '0.8s' }}>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/50 focus:outline-none focus:border-white/40 focus:bg-white/15 transition-all duration-300"
                  onChange={handleChange}
                  required
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 mt-6 bg-white text-black rounded-xl font-semibold hover:bg-white/90 transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed animate-fadeInUp"
              style={{ animationDelay: isRegister ? '0.9s' : '0.6s' }}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin"></span>
                  Processing...
                </span>
              ) : (
                isRegister ? "Create Account" : "Sign In"
              )}
            </button>
          </form>

          {/* Message */}
          {message && (
            <div className="mt-4 p-3 bg-white/10 border border-white/20 rounded-xl text-white text-center text-sm animate-slideDown">
              {message}
            </div>
          )}

          {/* Toggle Login/Register */}
          <div className="mt-6 text-center text-white/60 text-sm animate-fadeInUp" style={{ animationDelay: isRegister ? '1s' : '0.7s' }}>
            {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
            <button
              onClick={() => setIsRegister(!isRegister)}
              className="text-white font-semibold hover:underline transition-all"
            >
              {isRegister ? "Sign In" : "Create Account"}
            </button>
          </div>
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

export default LoginPage;
