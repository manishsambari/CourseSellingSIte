import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiCode,
  FiUser,
  FiBookOpen,
  FiArrowUpRight,
  FiClock,
  FiTerminal,
  FiShield,
  FiCpu,
  FiZap,
} from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { RiShoppingBag3Line } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import Logo from "./Logo";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw);
        setIsLoggedIn(true);
        setUserProfile(parsed?.user || parsed);
      } catch (err) {
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data?.courses || []);
      } catch (error) {
        console.error("Error in fetchCourses", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data?.message || "Session Disconnected");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserProfile(null);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen font-sans selection:bg-cyan-400 selection:text-black">
      {/* ── TOP NAV BAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#060912]/90 backdrop-blur-md border-b border-[#162034]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/">
            <Logo size="md" subtitle="OS.v2" />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-mono tracking-wider uppercase text-zinc-400">
            <Link to="/courses" className="hover:text-cyan-400 transition-colors flex items-center gap-1">
              <span>// TRACKS</span>
            </Link>
            <a href="#terminal" className="hover:text-cyan-400 transition-colors">
              // TELEMETRY
            </a>
            <a href="#curriculum" className="hover:text-cyan-400 transition-colors">
              // CURRICULUM
            </a>
            <a href="#matrix" className="hover:text-cyan-400 transition-colors">
              // BLUEPRINTS
            </a>
          </nav>

          {/* User Auth CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/purchases"
                  className="btn-cyber-outline py-2 px-3 flex items-center gap-1.5 font-mono"
                >
                  <RiShoppingBag3Line size={13} className="text-cyan-400" />
                  <span>[ LEARNING HUB ]</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-xs font-mono text-zinc-400 hover:text-rose-400 transition"
                >
                  EXIT
                </button>
                <div className="w-7 h-7 rounded bg-[#0c121e] border border-cyan-500/40 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs">
                  {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 transition"
                >
                  [ SIGN IN ]
                </Link>
                <Link
                  to="/signup"
                  className="btn-cyber-primary text-xs py-2 px-3.5"
                >
                  JOIN PROTOCOL
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded bg-[#0c121e] border border-[#162034]"
          >
            {mobileMenuOpen ? <HiX size={18} /> : <HiMenu size={18} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#080c14] border-b border-[#162034] px-6 py-5 space-y-4 text-xs font-mono">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-cyan-400"
            >
              // BROWSE TRACKS
            </Link>
            <a
              href="#terminal"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-cyan-400"
            >
              // TELEMETRY VIEW
            </a>
            <a
              href="#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-cyan-400"
            >
              // CURRICULUM OVERVIEW
            </a>
            {isLoggedIn ? (
              <div className="pt-3 border-t border-[#162034] space-y-2">
                <Link
                  to="/purchases"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-cyan-400 font-bold"
                >
                  // MY LEARNING DASHBOARD
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block text-rose-400"
                >
                  // DISCONNECT
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-[#162034] grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-cyber-outline text-center py-2"
                >
                  SIGN IN
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-cyber-primary text-center py-2"
                >
                  JOIN NOW
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="pt-32 pb-14 sm:pt-40 sm:pb-20 px-4 sm:px-6 max-w-6xl mx-auto space-y-8">
        {/* System Tag */}
        <div className="flex justify-center">
          <div className="badge-cyber">
            <FiZap className="text-cyan-400" />
            <span>CORE PROTOCOL // 2026 DISTRIBUTED & AI SYSTEMS</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase leading-[1.1]">
            ENGINEER THE FUTURE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-300 to-purple-400">
              DEPLOY AT SCALE.
            </span>
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 max-w-2xl mx-auto font-mono leading-relaxed">
            High-throughput distributed backends, autonomous multi-agent AI frameworks, cloud native Kubernetes architectures, and production-tested monorepo codebases.
          </p>
        </div>

        {/* Hero CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/courses"
            className="btn-cyber-primary w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2"
          >
            <span>INITIALIZE CURRICULUM</span>
            <FiArrowRight size={14} />
          </Link>
          <a
            href="#curriculum"
            className="btn-cyber-outline w-full sm:w-auto px-6 py-3 text-center"
          >
            EXPLORE BLUEPRINTS
          </a>
        </div>

        {/* ── LIVE CYBER TERMINAL SIMULATOR ── */}
        <div id="terminal" className="pt-6 max-w-3xl mx-auto">
          <div className="terminal-box">
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-[#162034] pb-2.5 mb-3 text-zinc-500 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-zinc-400 font-mono">bash - courseship@production-node-01</span>
              </div>
              <span className="text-cyan-400 font-mono">STATUS: LIVE</span>
            </div>

            {/* Terminal Code Body */}
            <div className="space-y-1 text-[11px] sm:text-xs leading-relaxed font-mono">
              <div className="text-zinc-400">
                <span className="text-emerald-400">$</span> npx courseship init --track=fullstack-ai-next15
              </div>
              <div className="text-cyan-400">
                [✓] Pulling architecture blueprints from registry...
              </div>
              <div className="text-zinc-300">
                [✓] Mounting Docker Compose, Redis Cluster & Prisma schemas
              </div>
              <div className="text-purple-300">
                [✓] Multi-agent LangGraph orchestrator initialized
              </div>
              <div className="text-emerald-400 font-bold pt-1">
                ➔ System compiled successfully: 12 Production Blueprints Ready.
              </div>
            </div>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 text-left">
          <div className="cyber-card p-4 space-y-1">
            <div className="text-[10px] font-mono text-cyan-400">// ACTIVE NODES</div>
            <div className="text-xl font-bold text-white font-mono">50,420+</div>
            <div className="text-[10px] text-zinc-500 font-mono">Global developers</div>
          </div>
          <div className="cyber-card p-4 space-y-1">
            <div className="text-[10px] font-mono text-emerald-400">// REPO ACCESS</div>
            <div className="text-xl font-bold text-white font-mono">100%</div>
            <div className="text-[10px] text-zinc-500 font-mono">Unrestricted monorepos</div>
          </div>
          <div className="cyber-card p-4 space-y-1">
            <div className="text-[10px] font-mono text-purple-400">// UPTIME PROTOCOL</div>
            <div className="text-xl font-bold text-white font-mono">99.98%</div>
            <div className="text-[10px] text-zinc-500 font-mono">Zero downtime SLA</div>
          </div>
          <div className="cyber-card p-4 space-y-1">
            <div className="text-[10px] font-mono text-amber-400">// CRYPTO LEDGER</div>
            <div className="text-xl font-bold text-white font-mono">SHA-256</div>
            <div className="text-[10px] text-zinc-500 font-mono">Verifiable certificates</div>
          </div>
        </div>
      </section>

      {/* ── CURRICULUM SECTION ── */}
      <section id="curriculum" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#162034]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
              // PRODUCTION TRACKS
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase mt-1">
              ENGINEERING MASTERCLASSES
            </h2>
            <p className="text-xs text-zinc-400 font-mono mt-1">
              Select an advanced engineering pathway to mount repo starter kits & video blueprints.
            </p>
          </div>
          <Link
            to="/courses"
            className="btn-cyber-outline text-xs py-2 px-3.5 self-start sm:self-auto flex items-center gap-1.5 font-mono"
          >
            <span>VIEW ALL TRACKS</span>
            <FiArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="cyber-card h-80 animate-pulse p-4 space-y-3" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="cyber-card p-12 text-center max-w-md mx-auto space-y-3 font-mono">
            <FiBookOpen size={32} className="text-zinc-500 mx-auto" />
            <div className="text-sm text-zinc-300">// NO TRACKS MOUNTED</div>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, idx) => (
              <div
                key={course._id}
                className="cyber-card-interactive flex flex-col justify-between group"
              >
                {/* Image Container */}
                <div className="relative h-48 overflow-hidden bg-[#04060a] border-b border-[#162034]">
                  <img
                    src={
                      course.image?.url ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600";
                    }}
                  />
                  <div className="absolute top-3 left-3 badge-cyber text-[10px]">
                    TRACK 0{idx + 1}
                  </div>
                  <div className="absolute bottom-3 left-3 bg-[#060912]/95 border border-[#162034] px-2.5 py-1 rounded text-xs font-mono font-bold text-cyan-300">
                    ₹{course.price}
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 font-mono leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-[#162034] flex items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                      <FiClock size={11} className="text-zinc-400" />
                      <span>SELF-PACED</span>
                    </div>
                    <Link
                      to={`/buy/${course._id}`}
                      className="btn-cyber-primary text-xs py-2 px-3.5 flex items-center gap-1"
                    >
                      <span>INITIALIZE</span>
                      <FiArrowRight size={12} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── ARCHITECTURE BLUEPRINTS SECTION ── */}
      <section id="matrix" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#162034]">
        <div className="max-w-2xl mb-10">
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
            // ARCHITECTURE STANDARD
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight mt-1">
            BUILT FOR ENTERPRISE READINESS
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0c121e] border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg">
              <FiCode />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Monorepo Toolchain</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Every course includes audited production repository setups with TurboRepo, ESLint, TypeScript 5, and Docker configs.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0c121e] border border-purple-500/30 flex items-center justify-center text-purple-400 text-lg">
              <FiCpu />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Autonomous AI & RAG</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Integrate vector databases, fine-tuned LLM agents, LangGraph workflows, and real-time streaming architectures.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0c121e] border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg">
              <FiAward />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Verifiable Credentials</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Cryptographically verified completion certificates shareable on LinkedIn and verifiable through public URL hashes.
            </p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-[#162034] text-xs font-mono text-zinc-500 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <Logo size="sm" subtitle="OS.v2" />

          <div className="flex items-center gap-6">
            <Link to="/courses" className="hover:text-cyan-400 transition-colors">
              // TRACKS
            </Link>
            <Link to="/login" className="hover:text-cyan-400 transition-colors">
              // SIGN IN
            </Link>
            <Link to="/admin/login" className="hover:text-cyan-400 transition-colors">
              // ADMIN STUDIO
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;