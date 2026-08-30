import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiHome,
  FiBookOpen,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiLogIn,
  FiArrowRight,
  FiClock,
  FiAward,
  FiChevronDown,
  FiTerminal,
} from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("default");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

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
        console.error("Error fetching courses", error);
        toast.error("Failed to mount catalog tracks");
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

  const categories = [
    { id: "all", label: "// ALL TRACKS" },
    { id: "fullstack", label: "// 01 FULLSTACK" },
    { id: "ai", label: "// 02 AI & AGENTS" },
    { id: "backend", label: "// 03 DISTRIBUTED BACKEND" },
    { id: "cloud", label: "// 04 DEVOPS & CLOUD" },
    { id: "web3", label: "// 05 WEB3 & SMART CONTRACTS" },
  ];

  // Filtering & Sorting
  const filteredCourses = courses
    .filter((course) => {
      const matchesSearch =
        (course.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
        (course.description || "").toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;
      if (selectedCategory === "all") return true;

      const text = `${course.title} ${course.description}`.toLowerCase();
      if (selectedCategory === "fullstack") return text.includes("react") || text.includes("next") || text.includes("web") || text.includes("frontend");
      if (selectedCategory === "ai") return text.includes("ai") || text.includes("agent") || text.includes("python") || text.includes("llm");
      if (selectedCategory === "cloud") return text.includes("aws") || text.includes("devops") || text.includes("docker") || text.includes("cloud");
      if (selectedCategory === "backend") return text.includes("node") || text.includes("backend") || text.includes("microservice") || text.includes("grpc");
      if (selectedCategory === "web3") return text.includes("solidity") || text.includes("web3") || text.includes("smart contract") || text.includes("crypto");
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
      if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
      if (sortBy === "alpha") return (a.title || "").localeCompare(b.title || "");
      return 0;
    });

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex flex-col lg:flex-row font-sans selection:bg-cyan-400 selection:text-black">
      {/* ── MOBILE HEADER ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#060912] border-b border-[#162034] sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-[#0c121e] border border-cyan-500/40 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-5 h-5 rounded object-cover" />
          </div>
          <span className="font-display font-bold text-white tracking-wider text-xs uppercase">CourseShip OS</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded bg-[#0c121e] border border-[#162034] text-zinc-300 hover:text-cyan-400"
        >
          {isSidebarOpen ? <HiX size={18} /> : <HiMenu size={18} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        />
      )}

      {/* ── SIDEBAR NAVIGATION ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080c14] border-r border-[#162034] flex flex-col p-5 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-[#0c121e] border border-cyan-500/30 flex items-center justify-center overflow-hidden shadow-neon-cyan">
            <img src={logo} alt="CourseShip" className="w-6 h-6 object-cover rounded" />
          </div>
          <div className="flex flex-col">
            <span className="font-display text-sm font-bold tracking-wider text-white uppercase">CourseShip</span>
            <span className="text-[10px] font-mono text-cyan-400">// TRACK EXPLORER</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="space-y-1.5 flex-1 text-xs font-mono">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#0c121e] transition"
          >
            <FiHome size={14} />
            <span>// 00 HOME</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0c121e] text-cyan-300 font-bold border border-cyan-500/30"
          >
            <FiBookOpen size={14} className="text-cyan-400" />
            <span>// 01 TRACKS</span>
          </Link>
          <Link
            to="/purchases"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#0c121e] transition"
          >
            <FiShoppingBag size={14} />
            <span>// 02 MY LEARNING</span>
          </Link>
        </nav>

        {/* User Card / Auth */}
        <div className="pt-4 border-t border-[#162034] space-y-3 font-mono">
          {isLoggedIn ? (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-[#0c121e] border border-[#162034] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </div>
                  <div className="text-[10px] text-cyan-400 truncate">NODE // VERIFIED</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-[11px] transition"
              >
                <FiLogOut size={12} />
                <span>DISCONNECT</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="btn-cyber-outline w-full py-2 text-center text-xs"
              >
                SIGN IN
              </Link>
              <Link
                to="/signup"
                className="btn-cyber-primary w-full py-2 text-center text-xs"
              >
                JOIN OS
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 lg:ml-64 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-7">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="badge-cyber mb-1.5">
                <FiTerminal size={11} />
                <span>CATALOG MATRIX // ACTIVE</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight">
                ENGINEERING TRACKS
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Full-stack architectures, autonomous agents, and system design masterclasses.
              </p>
            </div>

            <div className="badge-cyber text-xs self-start sm:self-auto font-mono">
              MOUNTED: <span className="text-cyan-400 font-bold ml-1">{filteredCourses.length}</span> TRACKS
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="cyber-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={14} />
              <input
                type="text"
                placeholder="$ grep --track keyword..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#060910] border border-[#162034] text-xs font-mono text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto flex items-center justify-end gap-2">
              <span className="text-xs text-zinc-400 hidden sm:inline font-mono">// SORT:</span>
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 rounded-lg bg-[#060910] border border-[#162034] text-xs font-mono text-white outline-none cursor-pointer"
                >
                  <option value="default" className="bg-[#090d18] text-white">RECOMMENDED</option>
                  <option value="price-low" className="bg-[#090d18] text-white">PRICE: LOW TO HIGH</option>
                  <option value="price-high" className="bg-[#090d18] text-white">PRICE: HIGH TO LOW</option>
                  <option value="alpha" className="bg-[#090d18] text-white">ALPHABETICAL</option>
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={13} />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono uppercase whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-cyan-400 text-black font-bold shadow-neon-cyan"
                    : "bg-[#080c14] text-zinc-400 hover:text-white border border-[#162034]"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="cyber-card h-80 animate-pulse p-4 space-y-3" />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="cyber-card p-14 text-center max-w-md mx-auto space-y-3 font-mono">
              <FiBookOpen size={32} className="text-zinc-500 mx-auto" />
              <h3 className="text-sm font-bold text-white uppercase">// NO MATCHING TRACKS</h3>
              <p className="text-xs text-zinc-400">
                Grep returned 0 records. Modify search criteria.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn-cyber-outline text-xs px-4 py-2"
              >
                RESET QUERY
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course, idx) => (
                <div
                  key={course._id}
                  className="cyber-card-interactive flex flex-col justify-between group"
                >
                  {/* Image */}
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
                      NODE // 0{idx + 1}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#060912]/95 border border-[#162034] px-2.5 py-1 rounded text-xs font-mono font-bold text-cyan-300">
                      ₹{course.price}
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 font-mono leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#162034] flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          <FiClock size={11} className="text-cyan-400" /> LIFETIME
                        </span>
                        <span className="flex items-center gap-1">
                          <FiAward size={11} className="text-emerald-400" /> SHA-256
                        </span>
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
        </div>
      </main>
    </div>
  );
}

export default Courses;