import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff, FiShield, FiArrowRight, FiTerminal } from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";
import Logo from "../components/Logo";

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
      toast.success(response.data.message || "Root Privilege Granted // Dashboard Mounted");
      localStorage.setItem("admin", JSON.stringify(response.data));
      navigate("/admin/dashboard");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Access Denied: Root credentials rejected.");
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
          <Link to="/login" className="text-zinc-400 hover:text-cyan-400 transition">
            // STUDENT PORTAL
          </Link>
          <Link
            to="/admin/signup"
            className="btn-cyber-outline py-1.5 px-3 text-[11px]"
          >
            REGISTER ROOT
          </Link>
        </div>
      </header>

      {/* ── ADMIN LOGIN FORM CARD ── */}
      <div className="max-w-sm w-full mx-auto px-4 py-8">
        <div className="cyber-card p-7 sm:p-8 space-y-5">
          {/* Header */}
          <div className="space-y-1">
            <div className="badge-cyber mb-2">
              <FiShield size={11} />
              <span>ROOT ACCESS // ELEVATED</span>
            </div>
            <h2 className="text-xl font-extrabold text-white uppercase font-display">
              ADMIN SIGN IN
            </h2>
            <p className="text-[11px] text-zinc-400">
              Authenticate root credentials to access catalog studio
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5 pt-1">
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase text-zinc-300">// ROOT KEY</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={13} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
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

            {/* Error Message */}
            {errorMessage && (
              <div className="p-2.5 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {errorMessage}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-cyber-primary w-full py-2.5 text-xs flex items-center justify-center gap-1.5 mt-2"
            >
              {loading ? (
                <span>VALIDATING ROOT...</span>
              ) : (
                <>
                  <span>AUTHENTICATE ROOT</span>
                  <FiArrowRight size={13} />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="pt-3 border-t border-[#162034] text-center text-xs text-zinc-500">
            Need root account?{" "}
            <Link to="/admin/signup" className="text-cyan-400 hover:underline">
              Register here
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom info */}
      <footer className="p-4 text-center text-[10px] text-zinc-600 font-mono">
        COURSESHIP // RESTRICTED ACCESS AREA &copy; {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default AdminLogin;
