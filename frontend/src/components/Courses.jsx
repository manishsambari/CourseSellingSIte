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
        toast.error("Failed to load course catalog");
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
    { id: "all", label: "All Topics" },
    { id: "fullstack", label: "Full Stack" },
    { id: "ai", label: "AI & ML" },
    { id: "cloud", label: "Cloud & DevOps" },
    { id: "backend", label: "Backend" },
    { id: "web3", label: "Web3" },
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
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen flex flex-col lg:flex-row selection:bg-purple-600 selection:text-white font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-20 left-1/3 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

      {/* ── MOBILE TOPBAR ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0d0d15]/95 backdrop-blur-md border-b border-white/5 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-5 h-5 rounded object-cover" />
          </div>
          <span className="font-bold text-white tracking-tight">CourseShip</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-300 hover:text-white"
        >
          {isSidebarOpen ? <HiX size={20} /> : <HiMenu size={20} />}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
        />
      )}

      {/* ── SIDEBAR (DESKTOP & MOBILE DRAWER) ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-[#0d0d15] border-r border-white/5 flex flex-col p-6 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 mb-8 group">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <img src={logo} alt="CourseShip" className="w-6 h-6 rounded-md object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1">
              Course<span className="gradient-text">Ship</span>
            </span>
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">Learning Hub</span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="space-y-1.5 flex-1 text-sm font-medium">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <FiHome size={18} />
            <span>Home</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600/15 text-purple-300 border border-purple-500/25 font-semibold"
          >
            <FiBookOpen size={18} className="text-purple-400" />
            <span>All Courses</span>
          </Link>
          <Link
            to="/purchases"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <FiShoppingBag size={18} />
            <span>My Learning</span>
          </Link>
        </nav>

        {/* Bottom User Profile / Auth Area */}
        <div className="pt-6 border-t border-white/5 space-y-3">
          {isLoggedIn ? (
            <div className="space-y-3">
              <div className="glass-card p-3 rounded-2xl flex items-center gap-3 border border-white/5">
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
                  {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-white truncate">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </div>
                  <div className="text-[11px] text-gray-400 truncate">{userProfile?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition"
              >
                <FiLogOut size={14} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/5 text-xs font-semibold transition"
              >
                <FiLogIn size={14} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="w-full flex items-center justify-center py-2.5 rounded-xl gradient-bg text-white text-xs font-bold shadow-glow hover:opacity-95 transition"
              >
                Create Account
              </Link>
            </div>
          )}
        </div>
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 lg:ml-72 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <FiBookOpen /> Masterclasses Catalog
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                Explore Engineering Courses
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Learn modern stacks through hands-on, production-grade applications.
              </p>
            </div>

            <div className="text-xs font-mono text-gray-400 bg-white/5 border border-white/5 px-4 py-2 rounded-xl self-start md:self-auto">
              <span className="text-white font-bold">{filteredCourses.length}</span> Courses Available
            </div>
          </div>

          {/* Search & Filter Controls */}
          <div className="glass-card p-4 rounded-2xl border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search courses, stacks, or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-gray-500 outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto flex items-center justify-end gap-2">
              <span className="text-xs text-gray-400 hidden sm:inline">Sort:</span>
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2.5 rounded-xl glass-input text-xs text-white outline-none cursor-pointer"
                >
                  <option value="default" className="bg-[#141420] text-white">Recommended</option>
                  <option value="price-low" className="bg-[#141420] text-white">Price: Low to High</option>
                  <option value="price-high" className="bg-[#141420] text-white">Price: High to Low</option>
                  <option value="alpha" className="bg-[#141420] text-white">Alphabetical (A-Z)</option>
                </select>
                <FiChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={14} />
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "gradient-bg text-white shadow-glow"
                    : "glass-card text-gray-400 hover:text-white border border-white/5 hover:border-purple-500/30"
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
                <div key={n} className="glass-card rounded-3xl h-96 animate-pulse border border-white/5 p-6 space-y-4">
                  <div className="h-44 bg-white/5 rounded-2xl" />
                  <div className="h-4 bg-white/5 rounded w-3/4" />
                  <div className="h-3 bg-white/5 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center border border-white/5 max-w-md mx-auto space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-2xl">
                <FiBookOpen />
              </div>
              <h3 className="text-lg font-bold text-white">No matching courses found</h3>
              <p className="text-xs text-gray-400">
                Try searching for a different keyword or select another category filter.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn-secondary px-5 py-2 rounded-xl text-xs font-semibold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/5"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-black/40">
                    <img
                      src={
                        course.image?.url ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13131f] via-transparent to-transparent opacity-80" />
                    <span className="absolute bottom-3 left-4 text-xs font-bold text-white font-mono bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                      ₹{course.price}
                    </span>
                    <span className="absolute top-4 right-4 bg-emerald-500/90 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      75% OFF
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 min-h-[3rem] leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <FiClock size={13} className="text-purple-400" /> Lifetime
                        </span>
                        <span className="flex items-center gap-1">
                          <FiAward size={13} className="text-emerald-400" /> Certificate
                        </span>
                      </div>
                      <Link
                        to={`/buy/${course._id}`}
                        className="btn-primary px-4 py-2 rounded-xl text-xs font-bold shadow-glow flex items-center gap-1.5"
                      >
                        <span>Enroll</span>
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