import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight, FiAlertCircle } from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";
import Logo from "../components/Logo";

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
      toast.success(response.data?.message || "Admin account registered successfully! Please sign in.");
      navigate("/admin/login");
    } catch (error) {
      if (error.response?.data?.errors) {
        const err = error.response.data.errors;
        if (Array.isArray(err)) {
          setErrorMessage(err.join(", "));
        } else if (typeof err === "string") {
          setErrorMessage(err);
        } else {
          setErrorMessage("Admin registration failed. Please verify your details.");
        }
      } else {
        setErrorMessage("Unable to connect to the server. Please check your connection.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex flex-col justify-between font-sans selection:bg-cyan-400 selection:text-black">
      {/* ── TOP HEADER ── */}
      <header className="w-full max-w-6xl mx-auto p-5 flex justify-between items-center font-mono">
        <Link to="/" title="Go to CourseShip Home">
          <Logo size="sm" subtitle="ADMIN" />
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <Link to="/admin/login" className="text-zinc-400 hover:text-cyan-400 transition hidden sm:inline-block">
            Admin Login
          </Link>
          <Link
            to="/login"
            className="btn-cyber-outline py-1.5 px-3.5 text-xs font-semibold"
          >
            Student Portal
          </Link>
        </div>
      </header>

      {/* ── ADMIN SIGNUP CARD ── */}
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <div className="cyber-card p-7 sm:p-9 space-y-6 border border-[#162034] shadow-2xl">
          {/* Header */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="badge-cyber mb-2 inline-flex font-mono text-[10px]">
              <FiShield size={12} className="text-cyan-400" />
              <span>ADMINISTRATOR REGISTRATION</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white uppercase font-display tracking-tight">
              Register Admin
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Create an administrator account to publish courses, track sales, and configure platforms.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Names */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  First Name
                </label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Admin"
                  required
                  autoComplete="given-name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none transition font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Last Name
                </label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Manager"
                  required
                  autoComplete="family-name"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none transition font-mono"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Admin Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@courseship.dev"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none transition font-mono"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Password (min. 6 characters)
              </label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full pl-10 pr-10 py-2.5 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-cyan-400 transition p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-start gap-2">
                <FiAlertCircle size={15} className="flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-primary w-full py-3 text-xs flex items-center justify-center gap-2 mt-2 font-display uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  <span>Registering Admin...</span>
                </>
              ) : (
                <>
                  <span>Create Admin Account</span>
                  <FiArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-4 border-t border-[#162034] text-center text-xs font-mono text-zinc-400">
            Already have an admin account?{" "}
            <Link to="/admin/login" className="text-cyan-400 font-bold hover:underline ml-1">
              Sign in here
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-xs text-zinc-600 font-mono">
        CourseShip &copy; {new Date().getFullYear()} · Restricted Administrator Area
      </footer>
    </div>
  );
}

export default AdminSignup;
