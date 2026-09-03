import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FiSearch,
  FiBookOpen,
  FiShoppingBag,
  FiUser,
  FiLogOut,
  FiArrowRight,
  FiClock,
  FiAward,
  FiChevronDown,
  FiTerminal,
  FiX,
  FiFilter,
  FiShield,
  FiLayers,
  FiDollarSign,
  FiRotateCcw,
} from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import Logo from "./Logo";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceFilter, setPriceFilter] = useState("all");
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
      toast.success(response.data?.message || "Logged out successfully");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setUserProfile(null);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const categories = [
    { id: "all", label: "ALL COURSES" },
    { id: "fullstack", label: "FULLSTACK" },
    { id: "ai", label: "AI & AGENTS" },
    { id: "backend", label: "DISTRIBUTED BACKEND" },
    { id: "cloud", label: "DEVOPS & CLOUD" },
    { id: "web3", label: "WEB3 & SECURITY" },
  ];

  // Helper to count tracks per category
  const categoryCounts = useMemo(() => {
    const counts = { all: courses.length, fullstack: 0, ai: 0, backend: 0, cloud: 0, web3: 0 };
    courses.forEach((c) => {
      const text = `${c.title} ${c.description}`.toLowerCase();
      if (text.includes("react") || text.includes("next") || text.includes("web") || text.includes("frontend") || text.includes("typescript") || text.includes("mern") || text.includes("mobile")) counts.fullstack++;
      if (text.includes("ai") || text.includes("agent") || text.includes("python") || text.includes("llm") || text.includes("generative")) counts.ai++;
      if (text.includes("node") || text.includes("backend") || text.includes("microservice") || text.includes("grpc") || text.includes("rust") || text.includes("golang") || text.includes("system design") || text.includes("java")) counts.backend++;
      if (text.includes("aws") || text.includes("devops") || text.includes("docker") || text.includes("cloud") || text.includes("kubernetes")) counts.cloud++;
      if (text.includes("solidity") || text.includes("web3") || text.includes("smart contract") || text.includes("crypto") || text.includes("security") || text.includes("pentesting")) counts.web3++;
    });
    return counts;
  }, [courses]);

  // Filtering & Sorting
  const filteredCourses = useMemo(() => {
    return courses
      .filter((course) => {
        const matchesSearch =
          (course.title || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
          (course.description || "").toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // Price Filter
        if (priceFilter === "under-1500" && Number(course.price) >= 1500) return false;
        if (priceFilter === "1500-plus" && Number(course.price) < 1500) return false;

        // Category Filter
        if (selectedCategory === "all") return true;
        const text = `${course.title} ${course.description}`.toLowerCase();
        if (selectedCategory === "fullstack") return text.includes("react") || text.includes("next") || text.includes("web") || text.includes("frontend") || text.includes("typescript") || text.includes("mern") || text.includes("mobile");
        if (selectedCategory === "ai") return text.includes("ai") || text.includes("agent") || text.includes("python") || text.includes("llm") || text.includes("generative");
        if (selectedCategory === "cloud") return text.includes("aws") || text.includes("devops") || text.includes("docker") || text.includes("cloud") || text.includes("kubernetes");
        if (selectedCategory === "backend") return text.includes("node") || text.includes("backend") || text.includes("microservice") || text.includes("grpc") || text.includes("rust") || text.includes("golang") || text.includes("system design") || text.includes("java");
        if (selectedCategory === "web3") return text.includes("solidity") || text.includes("web3") || text.includes("smart contract") || text.includes("crypto") || text.includes("security") || text.includes("pentesting");
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "price-low") return (a.price || 0) - (b.price || 0);
        if (sortBy === "price-high") return (b.price || 0) - (a.price || 0);
        if (sortBy === "alpha") return (a.title || "").localeCompare(b.title || "");
        return 0;
      });
  }, [courses, searchQuery, selectedCategory, priceFilter, sortBy]);

  const activeCategoryTitle = useMemo(() => {
    const cat = categories.find((c) => c.id === selectedCategory);
    return cat ? cat.label : "ALL COURSES";
  }, [selectedCategory, categories]);

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex flex-col lg:flex-row font-sans selection:bg-cyan-400 selection:text-black">
      {/* ── MOBILE TOPBAR ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#060912] border-b border-[#162034] sticky top-0 z-40">
        <Link to="/">
          <Logo size="sm" subtitle="CATALOG" />
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded bg-[#0c121e] border border-[#162034] text-zinc-300 hover:text-cyan-400 flex items-center gap-1.5 text-xs font-mono cursor-pointer"
        >
          <FiFilter size={14} className="text-cyan-400" />
          <span>FILTERS</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        />
      )}

      {/* ── DEDICATED CATALOG FILTER & NAVIGATION SIDEBAR ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#080c14] border-r border-[#162034] flex flex-col p-5 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand / Logo */}
        <div className="mb-6 flex items-center justify-between">
          <Link to="/" title="Return to Homepage">
            <Logo size="md" subtitle="COURSES" />
          </Link>
          {isSidebarOpen && (
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded bg-[#0c121e] text-zinc-400 hover:text-white cursor-pointer"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Sidebar Filter Navigation */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-1 font-mono">
          {/* Section: Categories */}
          <div className="space-y-2">
            <div className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest flex items-center gap-1.5">
              <FiLayers className="text-cyan-400" />
              <span>COURSE CATEGORIES</span>
            </div>

            <div className="space-y-1">
              {categories.map((cat) => {
                const count = categoryCounts[cat.id] || 0;
                const isActive = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      if (isSidebarOpen) setIsSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono transition-all text-left cursor-pointer ${
                      isActive
                        ? "bg-cyan-500/15 border border-cyan-500/50 text-cyan-300 font-bold shadow-neon-cyan"
                        : "text-zinc-400 hover:text-white hover:bg-[#0c121e]"
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    <span
                      className={`text-[10px] px-1.5 py-0.2 rounded border ${
                        isActive
                          ? "bg-cyan-400 text-black border-cyan-400 font-bold"
                          : "bg-[#060910] border-[#162034] text-zinc-500"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section: Price Filter */}
          <div className="space-y-2 pt-2 border-t border-[#162034]">
            <div className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest flex items-center gap-1.5">
              <FiDollarSign className="text-emerald-400" />
              <span>PRICE FILTER</span>
            </div>

            <div className="grid grid-cols-1 gap-1 text-xs">
              <button
                onClick={() => setPriceFilter("all")}
                className={`px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                  priceFilter === "all"
                    ? "bg-[#0c121e] text-emerald-300 font-bold border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                All Prices
              </button>
              <button
                onClick={() => setPriceFilter("under-1500")}
                className={`px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                  priceFilter === "under-1500"
                    ? "bg-[#0c121e] text-emerald-300 font-bold border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Under ₹1,500
              </button>
              <button
                onClick={() => setPriceFilter("1500-plus")}
                className={`px-3 py-1.5 rounded-lg text-left transition cursor-pointer ${
                  priceFilter === "1500-plus"
                    ? "bg-[#0c121e] text-emerald-300 font-bold border border-emerald-500/30"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                ₹1,500 & Above
              </button>
            </div>
          </div>

          {/* Section: Shortcuts */}
          <div className="space-y-2 pt-2 border-t border-[#162034]">
            <div className="text-[10px] uppercase text-zinc-400 font-bold tracking-widest">
              QUICK NAVIGATION
            </div>
            <div className="space-y-1 text-xs">
              <Link
                to="/purchases"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-cyan-300 hover:bg-[#0c121e] transition"
              >
                <FiShoppingBag size={13} className="text-cyan-400" />
                <span>My Enrolled Courses</span>
              </Link>
              <Link
                to="/admin/dashboard"
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-purple-300 hover:bg-[#0c121e] transition"
              >
                <FiShield size={13} className="text-purple-400" />
                <span>Admin Portal</span>
              </Link>
            </div>
          </div>
        </div>

        {/* User Card & Logout Footer */}
        <div className="pt-4 border-t border-[#162034] space-y-3 font-mono">
          {isLoggedIn ? (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-lg bg-[#0c121e] border border-[#162034] flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold flex items-center justify-center text-xs flex-shrink-0 shadow-neon-cyan">
                  {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-semibold text-white truncate">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </div>
                  <div className="text-[10px] text-cyan-400 truncate">Learner Account</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs transition font-semibold cursor-pointer"
                title="Log out of your account"
              >
                <FiLogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="btn-cyber-outline w-full py-2 text-center text-xs block font-medium"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="btn-cyber-primary w-full py-2 text-center text-xs block font-medium"
              >
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CATALOG VIEW ── */}
      <main className="flex-1 lg:ml-72 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-7">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="badge-cyber mb-1.5 font-mono text-[10px]">
                <FiTerminal size={11} />
                <span>COURSE CATALOG · {activeCategoryTitle}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
                ENGINEERING MASTERCLASSES
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Full-stack architectures, autonomous agents, and system design masterclasses.
              </p>
            </div>

            <div className="badge-cyber text-xs self-start sm:self-auto font-mono">
              SHOWING: <span className="text-cyan-400 font-bold ml-1">{filteredCourses.length}</span> / {courses.length} COURSES
            </div>
          </div>

          {/* Search & Sort Controls */}
          <div className="cyber-card p-3 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={13} />
              <input
                type="text"
                placeholder="Search courses by keyword or tech..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#060910] border border-[#162034] text-xs text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white cursor-pointer"
                >
                  <FiX size={13} />
                </button>
              )}
            </div>

            {/* Sort & Reset Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              {(selectedCategory !== "all" || priceFilter !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setPriceFilter("all");
                    setSearchQuery("");
                  }}
                  className="btn-cyber-outline text-xs px-2.5 py-2 flex items-center gap-1 text-zinc-400 hover:text-rose-400 cursor-pointer"
                  title="Reset all filters"
                >
                  <FiRotateCcw size={11} />
                  <span>RESET</span>
                </button>
              )}

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
              <h3 className="text-sm font-bold text-white uppercase font-display">NO MATCHING COURSES</h3>
              <p className="text-xs text-zinc-400">
                No courses matched your query. Try clearing search filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                  setPriceFilter("all");
                }}
                className="btn-cyber-outline text-xs px-4 py-2 cursor-pointer"
              >
                RESET ALL FILTERS
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
                        "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=800&auto=format&fit=crop&q=80";
                      }}
                    />
                    <div className="absolute top-3 left-3 badge-cyber text-[10px]">
                      COURSE 0{idx + 1}
                    </div>
                    <div className="absolute bottom-3 left-3 bg-[#060912]/95 border border-[#162034] px-2.5 py-1 rounded text-xs font-mono font-bold text-cyan-300 shadow-md">
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

                    <div className="pt-3 border-t border-[#162034] flex items-center justify-between font-mono">
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400">
                        <span className="flex items-center gap-1">
                          <FiClock size={11} className="text-cyan-400" /> LIFETIME
                        </span>
                        <span className="flex items-center gap-1">
                          <FiAward size={11} className="text-emerald-400" /> SHA-256
                        </span>
                      </div>
                      <Link
                        to={`/buy/${course._id}`}
                        className="btn-cyber-primary text-xs py-2 px-3.5 flex items-center gap-1 font-display"
                      >
                        <span>ENROLL NOW</span>
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