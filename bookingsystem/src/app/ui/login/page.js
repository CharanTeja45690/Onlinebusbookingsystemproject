"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginPage = () => {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState("user"); // "user" or "owner"
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

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
            setIsRegister(false); // Switch back to login
          }, 1500);
        } else {
         localStorage.setItem("userId", data.user.id);
          setMessage("Login successful!");
          // ✅ Navigate based on role
          setTimeout(() => {
            if (role === "USER") {
              router.push("/ui/searchbus"); // redirect to search page
            } else if (role === "OWNER") {
              router.push("/ui/addbus"); // redirect to addbuses screen
            }
          }, 1000);
        }
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch (error) {
      setMessage("Network error");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black  text-white">
      <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-4xl shadow-lg w-[70vw] h-[90vh] text-center">
        <h1 className="text-2xl font-bold mb-4 text-blue-500">
          {isRegister ? "Register Account" : "Login"}
        </h1>

        {/* Role Toggle Buttons */}
        <div className="flex justify-center mb-6 space-x-4">
  {/* User Button */}
  <button
    onClick={() => setActiveRole("user")}
    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform 
      ${activeRole === "user" 
        ? "bg-white text-black scale-105 shadow-lg" 
        : "bg-black text-white hover:bg-gray-800 hover:scale-105"}`}
  >
    User
  </button>

  {/* Bus Owner Button */}
  <button
    onClick={() => setActiveRole("owner")}
    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform 
      ${activeRole === "owner" 
        ? "bg-white text-black scale-105 shadow-lg" 
        : "bg-black text-white hover:bg-gray-800 hover:scale-105"}`}
  >
    Bus Owner
  </button>
</div>


        {/* Login/Register Form */}
       <form onSubmit={handleSubmit} className="flex w-1/2 mx-auto flex-col space-y-3">
  {isRegister && (
    <>
      {/* Full Name */}
      <input
        type="text"
        name="name"
        placeholder="Full Name"
        className="p-2 rounded bg-gray-200 text-black"
        onChange={handleChange}
        required
      />

      {/* Phone Number */}
      <input
        type="tel"
        name="phone"
        placeholder="Phone Number"
        pattern="[0-9]{10}"
        maxLength="10"
        className="p-2 rounded bg-gray-200 text-black"
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Enter email"
        className="p-2 rounded bg-gray-200 text-black"
        onChange={handleChange}
        required
      />

      {/* Password */}
      <input
        type="password"
        name="password"
        placeholder="Set Password"
        className="p-2 rounded bg-gray-200 text-black"
        onChange={handleChange}
        required
      />

      {/* Confirm Password */}
      <input
        type="password"
        name="confirmPassword"
        placeholder="Confirm Password"
        className="p-2 rounded bg-gray-200 text-black"
        onChange={handleChange}
        required
      />
    </>
  )}

  {!isRegister && (
    <>
      {/* Login Email */}
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="p-2 rounded bg-gray-200 text-black"
        onChange={handleChange}
        required
      />

      {/* Login Password */}
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="p-2 rounded bg-gray-200 text-black"
        onChange={handleChange}
        required
      />
    </>
  )}

  {/* Submit Button */}
  <button
    type="submit"
    className="bg-blue-400 hover:bg-blue-600 text-white py-2 rounded-lg mt-2"
  >
    {isRegister ? "Register" : "Login"}
  </button>
</form>


        {/* Message Display */}
        {message && <p className="mt-3 text-sm text-yellow-300">{message}</p>}

        {/* Switch Between Login/Register */}
        <p className="mt-4 text-sm">
          {isRegister ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-green-400 hover:underline"
          >
            {isRegister ? "Login here" : "Register here"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
