import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight } from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setLoading(true);
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message || "Welcome back!");
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Login failed. Please check your credentials.");
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen flex flex-col justify-between font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── TOP HEADER ── */}
      <header className="w-full max-w-6xl mx-auto p-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-5 h-5 rounded object-cover" />
          </div>
          <span className="font-bold text-white tracking-tight text-sm">CourseShip</span>
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <Link to="/courses" className="text-zinc-400 hover:text-white transition">
            Explore Courses
          </Link>
          <Link
            to="/signup"
            className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 hover:text-white transition"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* ── FORM CONTAINER ── */}
      <div className="max-w-sm w-full mx-auto px-4 py-8">
        <div className="card-surface p-7 sm:p-8 space-y-5 shadow-xl">
          {/* Header */}
          <div className="space-y-1">
            <h2 className="text-xl font-bold text-white tracking-tight">
              Sign In
            </h2>
            <p className="text-xs text-zinc-400">
              Access your enrolled engineering courses
            </p>
          </div>

          {/* Portal Switcher */}
          <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-zinc-900 border border-zinc-800 text-xs font-medium">
            <button
              type="button"
              className="py-1.5 rounded-md bg-zinc-800 text-white font-semibold shadow-sm"
            >
              Student
            </button>
            <Link
              to="/admin/login"
              className="py-1.5 text-center rounded-md text-zinc-400 hover:text-white transition"
            >
              Admin Portal
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Email Address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-9 pr-9 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="p-2.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? (
                <span>Signing In...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-3 border-t border-zinc-800 text-center text-xs text-zinc-500">
            Don't have an account?{" "}
            <Link to="/signup" className="text-zinc-300 hover:text-white font-medium underline underline-offset-2">
              Sign up
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-[11px] text-zinc-600 font-mono">
        CourseShip &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default Login;
