import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight } from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function AdminSignup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
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
        `${BACKEND_URL}/admin/signup`,
        { firstName, lastName, email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message || "Admin account registered! Please sign in.");
      navigate("/admin/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Admin signup failed.");
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
          <span className="font-bold text-white tracking-tight text-sm flex items-center gap-1.5">
            CourseShip <span className="tag-badge-indigo text-[10px]">Admin</span>
          </span>
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <Link to="/admin/login" className="text-zinc-400 hover:text-white transition">
            Admin Login
          </Link>
          <Link
            to="/login"
            className="px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900 text-zinc-200 hover:text-white transition"
          >
            Student Portal
          </Link>
        </div>
      </header>

      {/* ── ADMIN SIGNUP CARD ── */}
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <div className="card-surface p-7 sm:p-8 space-y-5 shadow-xl">
          {/* Header */}
          <div className="space-y-1">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-base mb-3">
              <FiShield />
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Admin Registration
            </h2>
            <p className="text-xs text-zinc-400">
              Create an administrative account to manage the course catalog
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {/* Names */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">First Name</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Admin"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-zinc-300">Last Name</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="User"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Admin Email</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@courseship.com"
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
                  placeholder="•••••••• (min 6 characters)"
                  required
                  minLength={6}
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

            {/* Error Message */}
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
                <span>Registering Admin...</span>
              ) : (
                <>
                  <span>Create Admin Account</span>
                  <FiArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-3 border-t border-zinc-800 text-center text-xs text-zinc-500">
            Already registered?{" "}
            <Link to="/admin/login" className="text-zinc-300 hover:text-white font-medium underline underline-offset-2">
              Sign in
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <footer className="p-4 text-center text-[11px] text-zinc-600 font-mono">
        CourseShip Admin Security &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default AdminSignup;
