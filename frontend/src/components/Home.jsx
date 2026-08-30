import React, { useEffect, useState, useMemo } from "react";
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
  FiCopy,
  FiCheck,
  FiChevronDown,
  FiChevronUp,
  FiLayers,
  FiGitBranch,
  FiActivity,
  FiHelpCircle,
  FiCheckCircle,
  FiStar,
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
  const [activeTab, setActiveTab] = useState("cli");
  const [featuredFilter, setFeaturedFilter] = useState("all");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

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

  const handleCopyCommand = (text) => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    toast.success("Command copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const techStack = [
    { name: "Next.js 15", color: "#00f0ff" },
    { name: "React 19", color: "#38bdf8" },
    { name: "TypeScript 5", color: "#60a5fa" },
    { name: "Python 3.12", color: "#fbbf24" },
    { name: "Rust", color: "#fb923c" },
    { name: "Golang", color: "#2dd4bf" },
    { name: "LangGraph AI", color: "#a855f7" },
    { name: "Docker", color: "#38bdf8" },
    { name: "Kubernetes", color: "#6366f1" },
    { name: "Redis", color: "#f87171" },
    { name: "Kafka", color: "#f43f5e" },
    { name: "PostgreSQL", color: "#818cf8" },
  ];

  const faqs = [
    {
      q: "What do I get after mounting a track?",
      a: "Instant lifetime access to the full video curriculum stream, private GitHub monorepo starter kits with Docker Compose files, lifetime updates, and a cryptographically verifiable SHA-256 certificate.",
    },
    {
      q: "Are the architectures suitable for production use?",
      a: "Yes. Every masterclass is designed with enterprise-grade standards including TurboRepo monorepo tooling, strict TypeScript typing, automated CI/CD GitHub workflows, and containerized Docker topologies.",
    },
    {
      q: "Can I verify my certificates publicly on LinkedIn?",
      a: "Yes. Each completed track issues a unique cryptographic ledger hash (e.g. SHA-256) with a permanent public verification URL and downloadable high-res credentials.",
    },
    {
      q: "Can I expense this with my employer's learning budget?",
      a: "Yes. We provide automated GST / VAT compliant tax invoices with company details upon transaction confirmation.",
    },
  ];

  // Curate top featured tracks with optional quick filter
  const featuredCourses = useMemo(() => {
    const topPicks = courses.slice(0, 6);
    if (featuredFilter === "all") return topPicks;
    return courses.filter((c) => {
      const text = `${c.title} ${c.description}`.toLowerCase();
      if (featuredFilter === "fullstack") return text.includes("next") || text.includes("react") || text.includes("fullstack") || text.includes("typescript");
      if (featuredFilter === "ai") return text.includes("ai") || text.includes("agent") || text.includes("python") || text.includes("langgraph");
      if (featuredFilter === "systems") return text.includes("rust") || text.includes("golang") || text.includes("kubernetes") || text.includes("grpc") || text.includes("system design");
      return true;
    }).slice(0, 6);
  }, [courses, featuredFilter]);

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
              <span>// TRACKS ({courses.length || 16})</span>
            </Link>
            <a href="#terminal" className="hover:text-cyan-400 transition-colors">
              // TELEMETRY
            </a>
            <a href="#curriculum" className="hover:text-cyan-400 transition-colors">
              // FEATURED
            </a>
            <a href="#matrix" className="hover:text-cyan-400 transition-colors">
              // BLUEPRINTS
            </a>
            <a href="#faqs" className="hover:text-cyan-400 transition-colors">
              // FAQS
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
                <div className="w-7 h-7 rounded bg-[#0c121e] border border-cyan-500/40 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs shadow-neon-cyan">
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
                  className="btn-cyber-primary text-xs py-2 px-3.5 font-display"
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
              // BROWSE ALL TRACKS ({courses.length})
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
              // FEATURED MASTERCLASSES
            </a>
            <a
              href="#faqs"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-cyan-400"
            >
              // FREQUENTLY ASKED
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
          <div className="badge-cyber animate-pulse">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block mr-1 shadow-neon-cyan" />
            <FiZap className="text-cyan-400" />
            <span>CORE PROTOCOL // 2026 DISTRIBUTED & AI SYSTEMS</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight uppercase leading-[1.1] font-display">
            ENGINEER THE FUTURE. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 drop-shadow-[0_0_25px_rgba(0,240,255,0.2)]">
              DEPLOY ON THE EDGE.
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
            className="btn-cyber-primary w-full sm:w-auto px-6 py-3 flex items-center justify-center gap-2 font-display"
          >
            <span>INITIALIZE CURRICULUM ({courses.length || 16} TRACKS)</span>
            <FiArrowRight size={14} />
          </Link>
          <a
            href="#terminal"
            className="btn-cyber-outline w-full sm:w-auto px-6 py-3 text-center font-mono flex items-center justify-center gap-2"
          >
            <FiTerminal size={14} className="text-cyan-400" />
            <span>LIVE TERMINAL DEMO</span>
          </a>
        </div>

        {/* ── INTERACTIVE TECH STACK CHIPS ── */}
        <div className="pt-4 flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="px-2.5 py-1 rounded-md bg-[#080c14] border border-[#162034] text-[11px] font-mono text-zinc-300 flex items-center gap-1.5 hover:border-cyan-500/40 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: tech.color }} />
              <span>{tech.name}</span>
            </div>
          ))}
        </div>

        {/* ── LIVE INTERACTIVE MULTI-TAB TERMINAL SIMULATOR ── */}
        <div id="terminal" className="pt-6 max-w-3xl mx-auto">
          <div className="terminal-box border border-cyan-500/30 shadow-2xl">
            {/* Terminal Window Header & Tabs */}
            <div className="flex flex-wrap items-center justify-between border-b border-[#162034] pb-2.5 mb-3 gap-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
                <span className="ml-2 text-zinc-400 font-mono text-[11px]">courseship@node-01: ~</span>
              </div>

              {/* Tab Switchers */}
              <div className="flex items-center gap-1 text-[11px] font-mono">
                <button
                  onClick={() => setActiveTab("cli")}
                  className={`px-2 py-0.5 rounded transition ${
                    activeTab === "cli" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  install.sh
                </button>
                <button
                  onClick={() => setActiveTab("docker")}
                  className={`px-2 py-0.5 rounded transition ${
                    activeTab === "docker" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  docker.yml
                </button>
                <button
                  onClick={() => setActiveTab("agent")}
                  className={`px-2 py-0.5 rounded transition ${
                    activeTab === "agent" ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40" : "text-zinc-500 hover:text-zinc-300"
                  }`}
                >
                  agent_graph.py
                </button>
              </div>

              <button
                onClick={() => handleCopyCommand(
                  activeTab === "cli" ? "npx courseship init --track=fullstack-ai-next15" :
                  activeTab === "docker" ? "docker compose up -d redis postgres kafka" :
                  "python -m langgraph.agent --model=claude-3.5-sonnet"
                )}
                className="text-zinc-400 hover:text-cyan-400 text-xs flex items-center gap-1 transition"
                title="Copy snippet"
              >
                {copied ? <FiCheck className="text-emerald-400" /> : <FiCopy />}
              </button>
            </div>

            {/* Terminal Code Body */}
            <div className="space-y-1 text-[11px] sm:text-xs leading-relaxed font-mono min-h-[120px]">
              {activeTab === "cli" && (
                <>
                  <div className="text-zinc-400">
                    <span className="text-emerald-400">$</span> npx courseship init --track=fullstack-ai-next15
                  </div>
                  <div className="text-cyan-400">
                    [✓] Pulling architecture blueprints from registry (16 tracks indexed)...
                  </div>
                  <div className="text-zinc-300">
                    [✓] Mounting Docker Compose, Redis Cluster & Prisma schemas
                  </div>
                  <div className="text-purple-300">
                    [✓] Multi-agent LangGraph orchestrator initialized
                  </div>
                  <div className="text-emerald-400 font-bold pt-1">
                    ➔ System compiled successfully: 16 Production Blueprints Ready.
                  </div>
                </>
              )}

              {activeTab === "docker" && (
                <>
                  <div className="text-zinc-500"># Production Infrastructure Topology</div>
                  <div className="text-zinc-400"><span className="text-cyan-400">services:</span></div>
                  <div className="text-zinc-300 pl-4"><span className="text-emerald-400">redis_cluster:</span> image: redis:7-alpine, ports: [6379:6379]</div>
                  <div className="text-zinc-300 pl-4"><span className="text-indigo-400">postgres_db:</span> image: pgvector/pgvector:pg16, ports: [5432:5432]</div>
                  <div className="text-zinc-300 pl-4"><span className="text-purple-400">kafka_broker:</span> image: confluentinc/cp-kafka:7.5.0</div>
                  <div className="text-emerald-400 font-bold pt-1">➔ Container network mapped on 127.0.0.1:4000</div>
                </>
              )}

              {activeTab === "agent" && (
                <>
                  <div className="text-zinc-500"># Autonomous Multi-Agent State Machine</div>
                  <div className="text-zinc-400"><span className="text-cyan-400">from</span> langgraph.graph <span className="text-cyan-400">import</span> StateGraph, END</div>
                  <div className="text-zinc-300">workflow = StateGraph(AgentState)</div>
                  <div className="text-purple-300">workflow.add_node(<span className="text-amber-300">"planner"</span>, plan_architecture)</div>
                  <div className="text-purple-300">workflow.add_node(<span className="text-amber-300">"executor"</span>, execute_code_sandboxes)</div>
                  <div className="text-emerald-400 font-bold pt-1">➔ Compiled graph ready for sub-second streaming</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Telemetry Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 text-left">
          <div className="cyber-card p-4 space-y-1">
            <div className="text-[10px] font-mono text-cyan-400 flex items-center gap-1">
              <FiActivity size={10} /> // ACTIVE NODES
            </div>
            <div className="text-xl font-bold text-white font-mono">50,420+</div>
            <div className="text-[10px] text-zinc-500 font-mono">Global developers</div>
          </div>
          <div className="cyber-card p-4 space-y-1">
            <div className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
              <FiLayers size={10} /> // MOUNTED TRACKS
            </div>
            <div className="text-xl font-bold text-white font-mono">{courses.length || 16} Active</div>
            <div className="text-[10px] text-zinc-500 font-mono">Production blueprints</div>
          </div>
          <div className="cyber-card p-4 space-y-1">
            <div className="text-[10px] font-mono text-purple-400 flex items-center gap-1">
              <FiGitBranch size={10} /> // UPTIME PROTOCOL
            </div>
            <div className="text-xl font-bold text-white font-mono">99.98%</div>
            <div className="text-[10px] text-zinc-500 font-mono">Zero downtime SLA</div>
          </div>
          <div className="cyber-card p-4 space-y-1">
            <div className="text-[10px] font-mono text-amber-400 flex items-center gap-1">
              <FiShield size={10} /> // CRYPTO LEDGER
            </div>
            <div className="text-xl font-bold text-white font-mono">SHA-256</div>
            <div className="text-[10px] text-zinc-500 font-mono">Verifiable certificates</div>
          </div>
        </div>
      </section>

      {/* ── UPGRADED FEATURED MASTERCLASSES SECTION ── */}
      <section id="curriculum" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#162034]">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div className="space-y-2">
            <div className="badge-cyber text-[10px]">
              <FiStar className="text-amber-400" />
              <span>CURATED ARCHITECTURES // TOP TIER</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight uppercase font-display">
              FEATURED MASTERCLASSES
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 font-mono max-w-xl">
              Production-grade engineering curricula with full monorepos, video walkthroughs, and verifiable credentials.
            </p>
          </div>

          {/* Quick Category Filter Pills on Featured Section */}
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs">
            <button
              onClick={() => setFeaturedFilter("all")}
              className={`px-3 py-1.5 rounded-md transition ${
                featuredFilter === "all"
                  ? "bg-cyan-400 text-black font-bold shadow-neon-cyan"
                  : "bg-[#080c14] border border-[#162034] text-zinc-400 hover:text-white"
              }`}
            >
              // ALL
            </button>
            <button
              onClick={() => setFeaturedFilter("fullstack")}
              className={`px-3 py-1.5 rounded-md transition ${
                featuredFilter === "fullstack"
                  ? "bg-cyan-400 text-black font-bold shadow-neon-cyan"
                  : "bg-[#080c14] border border-[#162034] text-zinc-400 hover:text-white"
              }`}
            >
              // FULLSTACK
            </button>
            <button
              onClick={() => setFeaturedFilter("ai")}
              className={`px-3 py-1.5 rounded-md transition ${
                featuredFilter === "ai"
                  ? "bg-cyan-400 text-black font-bold shadow-neon-cyan"
                  : "bg-[#080c14] border border-[#162034] text-zinc-400 hover:text-white"
              }`}
            >
              // AI AGENTS
            </button>
            <button
              onClick={() => setFeaturedFilter("systems")}
              className={`px-3 py-1.5 rounded-md transition ${
                featuredFilter === "systems"
                  ? "bg-cyan-400 text-black font-bold shadow-neon-cyan"
                  : "bg-[#080c14] border border-[#162034] text-zinc-400 hover:text-white"
              }`}
            >
              // SYSTEMS
            </button>
          </div>
        </div>

        {/* Courses Grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="cyber-card h-96 animate-pulse p-4 space-y-3" />
            ))}
          </div>
        ) : featuredCourses.length === 0 ? (
          <div className="cyber-card p-12 text-center max-w-md mx-auto space-y-3 font-mono">
            <FiBookOpen size={32} className="text-zinc-500 mx-auto" />
            <div className="text-sm text-zinc-300">// NO TRACKS FOUND</div>
            <button
              onClick={() => setFeaturedFilter("all")}
              className="btn-cyber-outline text-xs px-3.5 py-1.5"
            >
              SHOW ALL FEATURED
            </button>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredCourses.map((course, idx) => (
              <div
                key={course._id}
                className="cyber-card-interactive flex flex-col justify-between group border border-[#162034] hover:border-cyan-500/60 rounded-xl overflow-hidden bg-[#080c14]"
              >
                {/* Image Container with HD Cover & Badges */}
                <div className="relative h-52 overflow-hidden bg-[#04060a] border-b border-[#162034]">
                  <img
                    src={
                      course.image?.url ||
                      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80";
                    }}
                  />
                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 badge-cyber text-[10px] bg-[#060912]/90 backdrop-blur-md">
                    TRACK 0{idx + 1}
                  </div>
                  <div className="absolute top-3 right-3 badge-cyber-green text-[10px] bg-[#060912]/90 backdrop-blur-md">
                    PRODUCTION
                  </div>

                  {/* Bottom Price Pill with Discount */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-[#060912]/95 border border-[#162034] px-2.5 py-1 rounded-md backdrop-blur-md shadow-lg">
                    <span className="text-xs font-mono font-bold text-cyan-300">
                      ₹{course.price}
                    </span>
                    <span className="text-[10px] font-mono line-through text-zinc-500">
                      ₹{Number(course.price) * 4 || 5999}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-400 font-bold bg-emerald-500/10 px-1 rounded">
                      75% OFF
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    <h3 className="font-display text-base font-bold text-white group-hover:text-cyan-300 line-clamp-2 leading-snug transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 font-mono leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  {/* Micro Curriculum Inclusions List */}
                  <div className="space-y-1.5 pt-2 border-t border-[#162034] text-[11px] font-mono text-zinc-400">
                    <div className="flex items-center gap-1.5">
                      <FiCheckCircle size={12} className="text-cyan-400 flex-shrink-0" />
                      <span className="truncate">Production GitHub Starter Monorepo</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiCheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                      <span className="truncate">Docker Topology & Schema Blueprints</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <FiCheckCircle size={12} className="text-purple-400 flex-shrink-0" />
                      <span className="truncate">SHA-256 Ledger Verified Certificate</span>
                    </div>
                  </div>

                  {/* Card Action Row */}
                  <div className="pt-3 border-t border-[#162034] flex items-center justify-between gap-2 font-mono">
                    <div className="text-[11px] text-zinc-500 flex items-center gap-1">
                      <FiClock size={11} className="text-zinc-400" />
                      <span>LIFETIME</span>
                    </div>
                    <Link
                      to={`/buy/${course._id}`}
                      className="btn-cyber-primary text-xs py-2 px-4 flex items-center gap-1.5 font-display group-hover:shadow-neon-cyan transition-all"
                    >
                      <span>INITIALIZE</span>
                      <FiArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── HIGH-TECH CATALOG GATEWAY BANNER ── */}
        <div className="mt-12 p-6 sm:p-8 rounded-xl cyber-card border border-cyan-500/40 bg-gradient-to-r from-[#090d18] via-[#0c1222] to-[#090d18] flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="space-y-1.5 text-center md:text-left">
            <div className="badge-cyber text-[10px]">
              <FiLayers className="text-cyan-400" />
              <span>EXPANDED CATALOG // 16 PRODUCTION BLUEPRINTS</span>
            </div>
            <h3 className="text-lg sm:text-xl font-bold text-white font-display uppercase tracking-wide">
              READY TO EXPLORE THE ENTIRE CATALOG?
            </h3>
            <p className="text-xs text-zinc-400 font-mono max-w-xl">
              Browse all 16 engineering masterclasses across Full-Stack, AI Agents, Low-Latency Systems, Cloud DevOps, and Web3 Security.
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 font-mono">
            <Link
              to="/courses"
              className="btn-cyber-primary text-xs py-3 px-5 flex items-center gap-2 font-display shadow-neon-cyan"
            >
              <span>BROWSE ALL 16 TRACKS</span>
              <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ARCHITECTURE BLUEPRINTS SECTION ── */}
      <section id="matrix" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#162034]">
        <div className="max-w-2xl mb-10">
          <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-widest font-semibold">
            // ARCHITECTURE STANDARD
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display mt-1">
            BUILT FOR ENTERPRISE READINESS
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0c121e] border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg shadow-neon-cyan">
              <FiCode />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Monorepo Toolchain</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Every course includes audited production repository setups with TurboRepo, ESLint, TypeScript 5, and Docker configs.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0c121e] border border-purple-500/30 flex items-center justify-center text-purple-400 text-lg shadow-neon-purple">
              <FiCpu />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Autonomous AI & RAG</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Integrate vector databases, fine-tuned LLM agents, LangGraph workflows, and real-time streaming architectures.
            </p>
          </div>

          <div className="cyber-card p-6 space-y-3">
            <div className="w-10 h-10 rounded-lg bg-[#0c121e] border border-emerald-500/30 flex items-center justify-center text-emerald-400 text-lg shadow-neon-lime">
              <FiAward />
            </div>
            <h3 className="text-base font-bold text-white font-display uppercase">Verifiable Credentials</h3>
            <p className="text-xs text-zinc-400 font-mono leading-relaxed">
              Cryptographically verified completion certificates shareable on LinkedIn and verifiable through public URL hashes.
            </p>
          </div>
        </div>
      </section>

      {/* ── FREQUENTLY ASKED QUESTIONS ── */}
      <section id="faqs" className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto border-t border-[#162034]">
        <div className="text-center space-y-2 mb-10">
          <div className="badge-cyber">
            <FiHelpCircle size={11} />
            <span>KNOWLEDGE MATRIX // FAQS</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
            FREQUENTLY ASKED QUESTIONS
          </h2>
        </div>

        <div className="space-y-3 font-mono">
          {faqs.map((faq, idx) => (
            <div key={idx} className="cyber-card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-cyan-400 transition"
              >
                <span>// {faq.q}</span>
                {openFaq === idx ? <FiChevronUp size={14} className="text-cyan-400" /> : <FiChevronDown size={14} />}
              </button>
              {openFaq === idx && (
                <div className="px-4 pb-4 text-xs text-zinc-400 leading-relaxed border-t border-[#162034] pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
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