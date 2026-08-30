import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight, FiTerminal } from "react-icons/fi";
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
      toast.success(response.data.message || "Root Profile Registered // Please Authenticate");
      navigate("/admin/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Root registration rejected. Check parameters.");
      } else {
        setErrorMessage("Network connection timed out.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex flex-col justify-between font-mono selection:bg-cyan-400 selection:text-black">
      {/* ── TOP HEADER ── */}
      <header className="w-full max-w-6xl mx-auto p-5 flex justify-between items-center">
        <Link to="/">
          <Logo size="sm" subtitle="ROOT" />
        </Link>
        <div className="flex items-center gap-3 text-xs">
          <Link to="/admin/login" className="text-zinc-400 hover:text-cyan-400 transition">
            // ROOT LOGIN
          </Link>
          <Link
            to="/login"
            className="btn-cyber-outline py-1.5 px-3 text-[11px]"
          >
            STUDENT PORTAL
          </Link>
        </div>
      </header>

      {/* ── ADMIN SIGNUP CARD ── */}
      <div className="max-w-md w-full mx-auto px-4 py-8">
        <div className="cyber-card p-7 sm:p-8 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <div className="badge-cyber mb-2">
              <FiShield size={11} />
              <span>ROOT REGISTRATION PROTOCOL</span>
            </div>
            <h2 className="text-xl font-extrabold text-white uppercase font-display">
              REGISTER ROOT NODE
            </h2>
            <p className="text-[11px] text-zinc-400">
              Create an administrative profile to mount & manage tracks
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {/* Names */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <label className="text-[11px] uppercase text-zinc-300">// FIRST NAME</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Root"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[11px] uppercase text-zinc-300">// LAST NAME</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Admin"
                  required
                  className="w-full px-3 py-2 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase text-zinc-300">// ROOT EMAIL</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={13} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="root@courseship.dev"
                  required
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase text-zinc-300">// ROOT KEY (MIN 6 CHARS)</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={13} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full pl-9 pr-9 py-2 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-cyan-400"
                >
                  {showPassword ? <FiEyeOff size={13} /> : <FiEye size={13} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {errorMessage && (
              <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? (
                <span>INITIALIZING ROOT...</span>
              ) : (
                <>
                  <span>CREATE ROOT PROFILE</span>
                  <FiArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="pt-3 border-t border-[#162034] text-center text-xs text-zinc-500">
            Root account exists?{" "}
            <Link to="/admin/login" className="text-cyan-400 hover:underline">
              Authenticate here
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="p-4 text-center text-[10px] text-zinc-600 font-mono">
        COURSESHIP // RESTRICTED ACCESS AREA &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default AdminSignup;
