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
    { id: "all", label: "All Tracks" },
    { id: "fullstack", label: "Full-Stack" },
    { id: "ai", label: "AI & ML" },
    { id: "backend", label: "Backend Systems" },
    { id: "cloud", label: "Cloud & DevOps" },
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
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen flex flex-col lg:flex-row font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── MOBILE HEADER ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#0e0e11] border-b border-zinc-800 sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-5 h-5 rounded object-cover" />
          </div>
          <span className="font-bold text-white tracking-tight text-sm">CourseShip</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white"
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#0e0e11] border-r border-zinc-800 flex flex-col p-5 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="CourseShip" className="w-6 h-6 object-cover rounded" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white">CourseShip</span>
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Catalog</span>
          </div>
        </Link>

        {/* Links */}
        <nav className="space-y-1 flex-1 text-xs font-medium">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
          >
            <FiHome size={15} />
            <span>Home</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-zinc-800 text-white font-semibold border border-zinc-700"
          >
            <FiBookOpen size={15} className="text-indigo-400" />
            <span>Courses</span>
          </Link>
          <Link
            to="/purchases"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
          >
            <FiShoppingBag size={15} />
            <span>My Learning</span>
          </Link>
        </nav>

        {/* User Card / Auth */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          {isLoggedIn ? (
            <div className="space-y-2.5">
              <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
                  {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-medium text-white truncate">
                    {userProfile?.firstName} {userProfile?.lastName}
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">{userProfile?.email}</div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition"
              >
                <FiLogOut size={13} />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 text-xs font-medium transition"
              >
                <FiLogIn size={13} />
                <span>Sign In</span>
              </Link>
              <Link
                to="/signup"
                className="btn-primary w-full py-2 text-xs font-semibold"
              >
                Sign Up
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
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Engineering Courses
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Learn modern stacks through hands-on, production-grade applications.
              </p>
            </div>

            <div className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg self-start sm:self-auto">
              <span className="text-white font-semibold">{filteredCourses.length}</span> Courses
            </div>
          </div>

          {/* Search & Sort Controls */}
          <div className="card-surface p-3 flex flex-col sm:flex-row items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
              <input
                type="text"
                placeholder="Search courses or stacks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative w-full sm:w-auto flex items-center justify-end gap-2">
              <span className="text-xs text-zinc-400 hidden sm:inline font-mono">Sort:</span>
              <div className="relative w-full sm:w-auto">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto appearance-none pl-3 pr-8 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white outline-none cursor-pointer"
                >
                  <option value="default" className="bg-[#121215] text-white">Recommended</option>
                  <option value="price-low" className="bg-[#121215] text-white">Price: Low to High</option>
                  <option value="price-high" className="bg-[#121215] text-white">Price: High to Low</option>
                  <option value="alpha" className="bg-[#121215] text-white">Alphabetical (A-Z)</option>
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id
                    ? "bg-white text-zinc-950 font-semibold"
                    : "bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800"
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
                <div key={n} className="card-surface h-80 animate-pulse p-4 space-y-4">
                  <div className="h-44 bg-zinc-800/60 rounded-xl" />
                  <div className="h-4 bg-zinc-800 rounded w-3/4" />
                  <div className="h-3 bg-zinc-800 rounded w-full" />
                </div>
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="card-surface p-14 text-center max-w-md mx-auto space-y-3">
              <FiBookOpen size={32} className="text-zinc-500 mx-auto" />
              <h3 className="text-sm font-bold text-white">No courses match your search</h3>
              <p className="text-xs text-zinc-400">
                Try searching for a different keyword or reset active filters.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedCategory("all");
                }}
                className="btn-secondary text-xs px-4 py-2"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="card-surface-interactive overflow-hidden flex flex-col group justify-between"
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden bg-zinc-950 border-b border-zinc-800">
                    <img
                      src={
                        course.image?.url ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600";
                      }}
                    />
                    <span className="absolute bottom-3 left-3 text-xs font-bold text-white font-mono bg-zinc-950/90 border border-zinc-800 px-2.5 py-1 rounded-md">
                      ₹{course.price}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
                        {course.title}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                      <div className="flex items-center gap-3 text-[11px] text-zinc-400 font-mono">
                        <span className="flex items-center gap-1">
                          <FiClock size={11} className="text-zinc-500" /> Lifetime
                        </span>
                        <span className="flex items-center gap-1">
                          <FiAward size={11} className="text-emerald-400" /> Cert
                        </span>
                      </div>
                      <Link
                        to={`/buy/${course._id}`}
                        className="btn-accent text-xs font-semibold py-2 px-3.5 rounded-lg flex items-center gap-1"
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