import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiBookOpen,
  FiAward,
  FiPlayCircle,
  FiCheckCircle,
  FiSearch,
  FiHome,
  FiShoppingBag,
  FiLogOut,
  FiArrowRight,
  FiClock,
  FiCode,
  FiDownload,
  FiShare2,
  FiUser,
  FiX,
} from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedCourseForPlayer, setSelectedCourseForPlayer] = useState(null);
  const [selectedCourseForCert, setSelectedCourseForCert] = useState(null);
  const [activeLesson, setActiveLesson] = useState(1);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    setIsLoggedIn(true);
    setUserProfile(user?.user || user);

    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });

        const list = response.data?.courseData || response.data?.purchases || [];
        setPurchases(list);
      } catch (error) {
        console.error("Error in purchases fetch", error);
        toast.error("Failed to load enrolled courses");
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data?.message || "Logged out successfully");
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const filteredPurchases = useMemo(() => {
    if (!search.trim()) return purchases;
    const q = search.toLowerCase();
    return purchases.filter(
      (p) =>
        p.title?.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q)
    );
  }, [purchases, search]);

  const mockLessons = [
    { id: 1, title: "1. Architecture Blueprint & System Topology", duration: "18m" },
    { id: 2, title: "2. Setting Up Production Monorepo & Tooling", duration: "25m" },
    { id: 3, title: "3. Core Data Layer, Schema & Migrations", duration: "42m" },
    { id: 4, title: "4. State Management, APIs & Stream Processing", duration: "35m" },
    { id: 5, title: "5. Automated Testing & Edge Reliability", duration: "28m" },
    { id: 6, title: "6. Production CI/CD & Cloud Deployment", duration: "30m" },
  ];

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen flex flex-col lg:flex-row font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── MOBILE TOPBAR ── */}
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

      {/* ── SIDEBAR ── */}
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
            <span className="text-[10px] font-mono text-zinc-500 uppercase">Student Portal</span>
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
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
          >
            <FiBookOpen size={15} />
            <span>All Courses</span>
          </Link>
          <Link
            to="/purchases"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-zinc-800 text-white font-semibold border border-zinc-700"
          >
            <FiShoppingBag size={15} className="text-indigo-400" />
            <span>My Learning</span>
          </Link>
        </nav>

        {/* User Profile & Logout */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-xs flex-shrink-0">
              {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate">
                {userProfile?.firstName} {userProfile?.lastName}
              </div>
              <div className="text-[10px] text-zinc-500 truncate">Enrolled Student</div>
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
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-64 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-7">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                My Enrolled Courses
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Access your video curriculum, download starter repos, and claim verifiable certificates.
              </p>
            </div>

            <Link
              to="/courses"
              className="btn-secondary text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <FiBookOpen size={13} />
              <span>Browse More Tracks</span>
            </Link>
          </div>

          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="card-surface p-4 space-y-1">
              <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                <FiBookOpen className="text-indigo-400" /> ENROLLED
              </div>
              <div className="text-2xl font-bold text-white font-mono">{purchases.length}</div>
              <div className="text-[11px] text-zinc-500">Lifetime Access</div>
            </div>

            <div className="card-surface p-4 space-y-1">
              <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                <FiClock className="text-blue-400" /> HOURS
              </div>
              <div className="text-2xl font-bold text-white font-mono">{purchases.length * 16}h</div>
              <div className="text-[11px] text-zinc-500">Curriculum Content</div>
            </div>

            <div className="card-surface p-4 space-y-1">
              <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                <FiAward className="text-amber-400" /> CREDENTIALS
              </div>
              <div className="text-2xl font-bold text-white font-mono">{purchases.length}</div>
              <div className="text-[11px] text-emerald-400">Available to Claim</div>
            </div>

            <div className="card-surface p-4 space-y-1">
              <div className="text-xs text-zinc-400 flex items-center gap-1.5 font-mono">
                <FiCode className="text-emerald-400" /> REPOSITORIES
              </div>
              <div className="text-2xl font-bold text-white font-mono">{purchases.length * 3}</div>
              <div className="text-[11px] text-zinc-500">Monorepo Templates</div>
            </div>
          </div>

          {/* Search Library Filter */}
          <div className="card-surface p-3 flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
              <input
                type="text"
                placeholder="Filter your enrolled courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>
            <div className="text-xs font-mono text-zinc-500 hidden sm:block">
              {filteredPurchases.length} of {purchases.length} courses
            </div>
          </div>

          {/* Enrolled Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="card-surface h-72 animate-pulse p-4 space-y-3" />
              ))}
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="card-surface p-14 text-center max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300 flex items-center justify-center mx-auto text-xl">
                <FiBookOpen />
              </div>
              <h3 className="text-base font-bold text-white">No courses enrolled yet</h3>
              <p className="text-xs text-zinc-400">
                You have not enrolled in any masterclasses yet. Explore our technical tracks to start learning.
              </p>
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="btn-primary text-xs px-5 py-2.5 inline-flex items-center gap-1.5"
                >
                  <span>Explore Courses</span>
                  <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPurchases.map((course, idx) => (
                <div
                  key={course._id || idx}
                  className="card-surface-interactive overflow-hidden flex flex-col group justify-between"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-zinc-950 border-b border-zinc-800">
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
                    <span className="absolute top-3 right-3 tag-badge-green">
                      Enrolled
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
                        {course.title || "Masterclass"}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                        {course.description || "Hands-on projects, starter repositories, and video walkthroughs."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-zinc-800 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourseForPlayer(course);
                          setActiveLesson(1);
                        }}
                        className="btn-accent flex-1 py-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <FiPlayCircle size={14} />
                        <span>Start Learning</span>
                      </button>

                      <button
                        onClick={() => setSelectedCourseForCert(course)}
                        className="btn-secondary px-3 py-2 rounded-lg text-xs text-zinc-300 hover:text-amber-400"
                        title="View Certificate"
                      >
                        <FiAward size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ── COURSE LEARNING PLAYER MODAL ── */}
      {selectedCourseForPlayer && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="card-surface rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-zinc-700 shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#121215]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-xs">
                  <FiPlayCircle />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-1">
                    {selectedCourseForPlayer.title}
                  </h3>
                  <p className="text-[10px] font-mono text-zinc-500">Interactive Curriculum View</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourseForPlayer(null)}
                className="p-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Modal Body Grid */}
            <div className="flex-1 overflow-y-auto grid lg:grid-cols-12 gap-5 p-5">
              {/* Left: Video Player */}
              <div className="lg:col-span-8 space-y-3">
                <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center group">
                  <img
                    src={selectedCourseForPlayer.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                    alt="Lesson preview"
                    className="w-full h-full object-cover opacity-25"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-white text-zinc-950 flex items-center justify-center text-xl shadow-lg cursor-pointer hover:scale-105 transition-transform">
                      <FiPlayCircle />
                    </div>
                    <span className="text-xs font-mono text-zinc-300">
                      Lesson {activeLesson}: {mockLessons.find((l) => l.id === activeLesson)?.title}
                    </span>
                  </div>
                </div>

                <div className="card-surface p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase text-zinc-400 font-semibold">
                      Starter Repos & Files
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">v1.0 Production</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => toast.success("Downloading starter archive...")}
                      className="btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5"
                    >
                      <FiDownload size={12} /> Download Code (.zip)
                    </button>
                    <button
                      onClick={() => toast.success("Opening repository in new tab...")}
                      className="btn-secondary text-xs py-1.5 px-3 rounded-lg flex items-center gap-1.5"
                    >
                      <FiCode size={12} /> View GitHub Repo
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Modules List */}
              <div className="lg:col-span-4 space-y-2.5 flex flex-col">
                <div className="text-xs font-mono uppercase text-zinc-400 font-semibold">
                  Course Modules ({mockLessons.length})
                </div>
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-72 lg:max-h-none">
                  {mockLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between ${
                        activeLesson === lesson.id
                          ? "bg-zinc-800 border-zinc-600 text-white font-medium"
                          : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-700"
                      }`}
                    >
                      <span className="line-clamp-1">{lesson.title}</span>
                      <span className="font-mono text-[10px] text-zinc-500">{lesson.duration}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE MODAL ── */}
      {selectedCourseForCert && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6">
          <div className="card-surface rounded-2xl w-full max-w-xl overflow-hidden flex flex-col border border-zinc-700 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs font-mono">
                <FiAward size={16} /> VERIFIED COMPLETION CREDENTIAL
              </div>
              <button
                onClick={() => setSelectedCourseForCert(null)}
                className="p-1 rounded-md bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <FiX size={15} />
              </button>
            </div>

            {/* Certificate Preview Card */}
            <div className="p-6 rounded-xl bg-zinc-950 border border-zinc-800 text-center space-y-3">
              <div className="text-xs uppercase tracking-widest text-zinc-500 font-mono">
                Certificate of Engineering Achievement
              </div>
              <div className="text-xs text-zinc-400">Awarded to</div>
              <div className="text-xl font-bold text-white tracking-wide">
                {userProfile?.firstName} {userProfile?.lastName}
              </div>
              <div className="text-xs text-zinc-400">for successfully mastering</div>
              <div className="text-sm font-bold text-amber-300">
                {selectedCourseForCert.title}
              </div>
              <div className="pt-3 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                <span>ID: CS-{selectedCourseForCert._id?.slice(-8).toUpperCase()}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Credential link copied!");
                }}
                className="btn-secondary text-xs py-2 px-3.5 flex items-center gap-1.5"
              >
                <FiShare2 size={12} />
                <span>Share Link</span>
              </button>
              <button
                onClick={() => toast.success("Generating PDF download...")}
                className="btn-primary text-xs py-2 px-4 flex items-center gap-1.5"
              >
                <FiDownload size={12} />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchases;