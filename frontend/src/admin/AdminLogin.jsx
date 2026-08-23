import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function AdminLogin() {
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
        `${BACKEND_URL}/admin/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message || "Admin login successful!");
      localStorage.setItem("admin", JSON.stringify(response.data));
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Admin authentication failed.");
      } else {
        setErrorMessage("Network error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen relative overflow-hidden flex flex-col justify-between selection:bg-purple-600 selection:text-white font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/3 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-0 right-1/3 w-[500px] h-[500px] bg-red-600/5 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

      {/* ── HEADER ── */}
      <header className="w-full max-w-7xl mx-auto p-6 flex justify-between items-center relative z-20">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <img src={logo} alt="Logo" className="w-6 h-6 rounded-md object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold text-white tracking-tight flex items-center gap-1.5">
              CourseShip <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 font-mono">Admin</span>
            </span>
          </div>
        </Link>
        <div className="flex items-center gap-4 text-xs font-semibold">
          <Link to="/login" className="text-gray-400 hover:text-white transition">
            Student Portal
          </Link>
          <Link
            to="/admin/signup"
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-purple-300 border border-purple-500/20 transition"
          >
            Admin Register
          </Link>
        </div>
      </header>

      {/* ── ADMIN LOGIN FORM CARD ── */}
      <div className="max-w-md w-full mx-auto px-4 py-8 relative z-10">
        <div className="glass-card rounded-3xl p-8 sm:p-10 border border-white/10 shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 text-2xl mx-auto shadow-glow mb-4">
              <FiShield />
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Admin Portal
            </h2>
            <p className="text-xs sm:text-sm text-gray-400">
              Sign in to manage courses, enrollments & analytics
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 pt-2">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@courseship.com"
                  required
                  className="w-full pl-11 pr-4 py-3 rounded-2xl glass-input text-sm text-white placeholder:text-gray-500 outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-gray-300">Admin Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-2xl glass-input text-sm text-white placeholder:text-gray-500 outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <span>⚠️</span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3.5 rounded-2xl text-sm font-bold shadow-glow flex items-center justify-center gap-2 mt-4 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Dashboard</span>
                  <FiArrowRight size={15} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-4 border-t border-white/5 text-center text-xs text-gray-400">
            Need an admin account?{" "}
            <Link to="/admin/signup" className="text-purple-400 hover:text-purple-300 font-semibold underline underline-offset-4">
              Register here
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <footer className="p-6 text-center text-xs text-gray-500 relative z-10">
        &copy; {new Date().getFullYear()} CourseShip. Restricted Staff Access.
      </footer>
    </div>
  );
}

export default AdminLogin;
