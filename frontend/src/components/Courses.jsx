import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaArrowRight,
  FaShieldAlt,
  FaGraduationCap,
  FaFilter,
  FaSortAmountDown,
} from "react-icons/fa";
import {
  FiSearch,
  FiBookOpen,
  FiShoppingBag,
  FiLogOut,
  FiLogIn,
  FiHome,
  FiUser,
  FiClock,
  FiAward,
  FiX,
  FiSliders,
  FiArrowUpRight,
} from "react-icons/fi";
import { RiDashboardLine, RiHome2Line } from "react-icons/ri";
import { HiMenu, HiX, HiSparkles } from "react-icons/hi";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function SkeletonCard() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/5 flex flex-col">
      <div className="skeleton-box h-52 w-full" />
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="skeleton-box h-4 w-1/3 rounded-md" />
        <div className="skeleton-box h-6 w-4/5 rounded-md" />
        <div className="skeleton-box h-4 w-full rounded-md" />
        <div className="skeleton-box h-4 w-2/3 rounded-md" />
        <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
          <div className="skeleton-box h-8 w-20 rounded-md" />
          <div className="skeleton-box h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("recommended");

  useEffect(() => {
    const userRaw = localStorage.getItem("user");
    if (userRaw) {
      try {
        const parsed = JSON.parse(userRaw);
        setIsLoggedIn(true);
        setUserProfile(parsed?.user || parsed);
      } catch (e) {
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
        setCourses(response.data.courses || []);
      } catch (error) {
        console.log("Error in fetchCourses", error);
        setCourses([]);
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
    { id: "all", label: "All Masterclasses" },
    { id: "web", label: "Web Development" },
    { id: "backend", label: "Backend & Systems" },
    { id: "python", label: "Python & Data" },
    { id: "ai", label: "AI & ML" },
  ];

  const filteredCourses = useMemo(() => {
    let result = [...courses];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (c) =>
          c.title?.toLowerCase().includes(q) ||
          c.description?.toLowerCase().includes(q)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter((c) => {
        const text = `${c.title || ""} ${c.description || ""}`.toLowerCase();
        if (selectedCategory === "web")
          return text.includes("react") || text.includes("web") || text.includes("frontend") || text.includes("javascript") || text.includes("css") || text.includes("node");
        if (selectedCategory === "backend")
          return text.includes("backend") || text.includes("node") || text.includes("express") || text.includes("mongo") || text.includes("sql") || text.includes("system");
        if (selectedCategory === "python")
          return text.includes("python") || text.includes("data") || text.includes("django");
        if (selectedCategory === "ai")
          return text.includes("ai") || text.includes("ml") || text.includes("machine learning") || text.includes("deep learning");
        return true;
      });
    }

    // Sorting
    if (sortBy === "price-low") {
      result.sort((a, b) => (Number(a.price) || 0) - (Number(b.price) || 0));
    } else if (sortBy === "price-high") {
      result.sort((a, b) => (Number(b.price) || 0) - (Number(a.price) || 0));
    } else if (sortBy === "title") {
      result.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return result;
  }, [courses, search, selectedCategory, sortBy]);

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen flex selection:bg-purple-600 selection:text-white font-sans">
      {/* Ambient background blur circles */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-20 left-1/3 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-5 left-5 z-50 p-2.5 rounded-xl glass-card border border-white/10 text-gray-300 hover:text-white shadow-lg"
      >
        {isSidebarOpen ? <HiX size={22} /> : <HiMenu size={22} />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity"
        />
      )}

      {/* ── SIDEBAR ── */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-[#0d0d15] border-r border-white/5 flex flex-col p-6 transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 mb-10 group">
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

        {/* Navigation */}
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

        {/* Bottom User Area */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          {isLoggedIn ? (
            <div className="space-y-3">
              <div className="glass-card p-3 rounded-2xl flex items-center gap-3 border border-white/5">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
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
      <main className="flex-1 lg:ml-72 min-h-screen p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-12 lg:pt-0">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <HiSparkles /> Explore Curriculum
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                All Masterclasses
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Foundational to advanced hands-on courses built by industry practitioners.
              </p>
            </div>

            {/* Live Search and Sort Controls */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search Bar */}
              <div className="relative flex-1 sm:w-72">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  type="text"
                  placeholder="Search courses, stacks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-10 py-3 rounded-2xl glass-input text-sm text-white placeholder:text-gray-500 outline-none"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <FiX size={16} />
                  </button>
                )}
              </div>

              {/* Sort Selector */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full sm:w-auto px-4 py-3 rounded-2xl glass-input text-sm text-gray-300 font-medium appearance-none cursor-pointer pr-10"
                >
                  <option value="recommended" className="bg-[#13131f] text-white">Recommended</option>
                  <option value="price-low" className="bg-[#13131f] text-white">Price: Low to High</option>
                  <option value="price-high" className="bg-[#13131f] text-white">Price: High to Low</option>
                  <option value="title" className="bg-[#13131f] text-white">Alphabetical (A-Z)</option>
                </select>
                <FaSortAmountDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={12} />
              </div>
            </div>
          </div>

          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? "gradient-bg text-white shadow-glow"
                    : "glass-card text-gray-400 hover:text-white hover:border-purple-500/30"
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Results Summary Counter */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-6 font-medium">
            <span>
              Showing <strong className="text-white">{filteredCourses.length}</strong> of{" "}
              <strong className="text-white">{courses.length}</strong> masterclasses
            </span>
            {(search || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="text-purple-400 hover:text-purple-300 transition underline underline-offset-4"
              >
                Reset filters
              </button>
            )}
          </div>

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center border border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                <FiBookOpen />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">No matching courses found</h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
                Try searching with different keywords or switch categories to discover available courses.
              </p>
              <button
                onClick={() => {
                  setSearch("");
                  setSelectedCategory("all");
                }}
                className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold shadow-glow"
              >
                Show All Courses
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <div
                  key={course._id}
                  className="glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/5"
                >
                  {/* Thumbnail */}
                  <div className="relative h-52 overflow-hidden">
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
                    <span className="absolute top-4 right-4 bg-purple-600/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
                      Featured
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
                      <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                        <FaStar /> 4.9 (1.2k+ reviews)
                      </span>
                      <span className="text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-emerald-500/20">
                        Certificate
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                      {course.description ||
                        "Master real-world principles, testing, deployment, and best practices."}
                    </p>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                      <div>
                        <div className="text-2xl font-black text-white font-mono">₹{course.price}</div>
                        <div className="text-xs text-gray-500 line-through">
                          ₹{Number(course.price || 0) * 4 || 4999}
                        </div>
                      </div>
                      <Link
                        to={`/buy/${course._id}`}
                        className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow flex items-center gap-1.5 group-hover:shadow-glow-lg"
                      >
                        <span>Enroll Now</span>
                        <FaArrowRight size={11} />
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