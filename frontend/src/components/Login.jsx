import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiArrowRight, FiUser, FiAlertCircle } from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";
import Logo from "./Logo";

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
        { withCredentials: true, headers: { "Content-Type": "application/json" }}
      );

      const userName = response.data?.user?.firstName || "Learner";
      toast.success(`Welcome back, ${userName}! Logged in successfully.`);
      
      localStorage.setItem("user", JSON.stringify(response.data));
      navigate("/");
    } 
    catch (error) {
      if (error.response?.data?.errors) {
        const err = error.response.data.errors;
        if (Array.isArray(err)) {
          setErrorMessage(err.join(", "));
        } else if (typeof err === "string") {
          setErrorMessage(err);
        } else {
          setErrorMessage("Invalid email or password. Please try again.");
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
      <header className="w-full max-w-6xl mx-auto p-5 flex justify-between items-center">
        <Link to="/" title="Go to CourseShip Home">
          <Logo size="sm" subtitle="AUTH" />
        </Link>
        <div className="flex items-center gap-3 text-xs font-mono">
          <Link
            to="/courses"
            className="text-zinc-400 hover:text-cyan-400 transition hidden sm:inline-block"
          >
            Explore Courses
          </Link>
          <Link
            to="/signup"
            className="btn-cyber-outline py-1.5 px-3.5 text-xs font-semibold"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* ── LOGIN FORM CONTAINER ── */}
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <div className="cyber-card p-7 sm:p-9 space-y-6 border border-[#162034] shadow-2xl">
          {/* Header */}
          <div className="space-y-1.5 text-center sm:text-left">
            <div className="badge-cyber mb-2 inline-flex font-mono text-[10px]">
              <FiUser size={12} className="text-cyan-400" />
              <span>LEARNER SIGN IN</span>
            </div>
            <h1 className="text-2xl font-extrabold text-white uppercase font-display tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs text-zinc-400 font-mono">
              Sign in to continue your course progress and access your projects.
            </p>
          </div>

          {/* Portal Switcher Tabs */}
          <div className="grid grid-cols-2 gap-1.5 p-1 rounded-lg bg-[#060910] border border-[#162034] text-xs font-mono">
            <button
              type="button"
              className="py-2 text-center rounded-md bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 font-bold shadow-neon-cyan transition"
            >
              Student Login
            </button>
            <Link
              to="/admin/login"
              className="py-2 text-center rounded-md text-zinc-400 hover:text-white hover:bg-[#0c121e] transition"
            >
              Admin Portal
            </Link>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-mono font-medium text-zinc-300">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={14} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  required
                  autoComplete="email"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none transition font-mono"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-mono font-medium text-zinc-300">
                  Password
                </label>
              </div>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={14} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                  autoComplete="current-password"
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

            {/* Error Message Box */}
            {errorMessage && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-mono flex items-start gap-2">
                <FiAlertCircle size={15} className="flex-shrink-0 mt-0.5 text-rose-400" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-primary w-full py-3 text-xs flex items-center justify-center gap-2 mt-2 font-display uppercase tracking-wider disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Footer Callout */}
          <div className="pt-4 border-t border-[#162034] text-center text-xs font-mono text-zinc-400">
            Don't have an account?{" "}
            <Link to="/signup" className="text-cyan-400 font-bold hover:underline ml-1">
              Sign up here
            </Link>
          </div>
        </div>
      </div>

      {/* Page Footer */}
      <footer className="p-4 text-center text-xs text-zinc-600 font-mono">
        CourseShip &copy; {new Date().getFullYear()} · All rights reserved.
      </footer>
    </div>
  );
}

export default Login;
