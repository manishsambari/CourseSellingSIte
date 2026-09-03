import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  FiBookOpen,
  FiAward,
  FiPlayCircle,
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
  FiTerminal,
  FiCpu,
} from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import { BACKEND_URL } from "../utils/utils";
import Logo from "./Logo";

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
        toast.error("Failed to mount enrolled nodes");
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
    { id: 1, title: "01. Architecture Blueprint & System Topology", duration: "18m" },
    { id: 2, title: "02. Setting Up Production Monorepo & Toolchain", duration: "25m" },
    { id: 3, title: "03. Core Data Layer, Schema & Migrations", duration: "42m" },
    { id: 4, title: "04. State Management, APIs & Stream Processing", duration: "35m" },
    { id: 5, title: "05. Automated Testing & Edge Reliability", duration: "28m" },
    { id: 6, title: "06. Production CI/CD & Cloud Deployment", duration: "30m" },
  ];

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex flex-col lg:flex-row font-sans selection:bg-cyan-400 selection:text-black">
      {/* ── MOBILE TOPBAR ── */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3 bg-[#060912] border-b border-[#162034] sticky top-0 z-40">
        <Link to="/">
          <Logo size="sm" subtitle="HUB" />
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded bg-[#0c121e] border border-[#162034] text-zinc-300 hover:text-cyan-400 cursor-pointer"
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
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-[#080c14] border-r border-[#162034] flex flex-col p-5 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="mb-8 block" title="Go to Home">
          <Logo size="md" subtitle="LEARNING" />
        </Link>

        {/* Links */}
        <nav className="space-y-1.5 flex-1 text-xs font-mono">
          <Link
            to="/"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#0c121e] transition"
          >
            <FiHome size={14} />
            <span>Home</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#0c121e] transition"
          >
            <FiBookOpen size={14} />
            <span>Explore Courses</span>
          </Link>
          <Link
            to="/purchases"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0c121e] text-cyan-300 font-bold border border-cyan-500/30"
          >
            <FiShoppingBag size={14} className="text-cyan-400" />
            <span>My Enrolled Courses</span>
          </Link>
        </nav>

        {/* User Card & Logout */}
        <div className="pt-4 border-t border-[#162034] space-y-3 font-mono">
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
      </aside>

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-64 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-7">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="badge-cyber mb-1.5">
                <FiCpu size={11} />
                <span>LEARNER DASHBOARD</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
                My Learning Dashboard
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Access video walkthroughs, repository starters, and verified certificates.
              </p>
            </div>

            <Link
              to="/courses"
              className="btn-cyber-outline text-xs px-3.5 py-2 flex items-center gap-1.5 self-start sm:self-auto font-mono"
            >
              <FiBookOpen size={12} />
              <span>Browse More Courses</span>
            </Link>
          </div>

          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
            <div className="cyber-card p-4 space-y-1">
              <div className="text-xs text-cyan-400 flex items-center gap-1.5 font-bold">
                <FiBookOpen /> // ENROLLED
              </div>
              <div className="text-2xl font-bold text-white">{purchases.length}</div>
              <div className="text-[10px] text-zinc-500">Active Courses</div>
            </div>

            <div className="cyber-card p-4 space-y-1">
              <div className="text-xs text-emerald-400 flex items-center gap-1.5 font-bold">
                <FiClock /> // HOURS
              </div>
              <div className="text-2xl font-bold text-white">{purchases.length * 16}h</div>
              <div className="text-[10px] text-zinc-500">Video Walkthroughs</div>
            </div>

            <div className="cyber-card p-4 space-y-1">
              <div className="text-xs text-purple-400 flex items-center gap-1.5 font-bold">
                <FiAward /> // CERTIFICATES
              </div>
              <div className="text-2xl font-bold text-white">{purchases.length}</div>
              <div className="text-[10px] text-zinc-500">Verified Credentials</div>
            </div>

            <div className="cyber-card p-4 space-y-1">
              <div className="text-xs text-amber-400 flex items-center gap-1.5 font-bold">
                <FiCode /> // REPOSITORIES
              </div>
              <div className="text-2xl font-bold text-white">{purchases.length * 3}</div>
              <div className="text-[10px] text-zinc-500">Code Starters</div>
            </div>
          </div>

          {/* Search Library Filter */}
          <div className="cyber-card p-3 flex items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={14} />
              <input
                type="text"
                placeholder="Search your enrolled courses..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2 rounded-lg bg-[#060910] border border-[#162034] text-xs font-mono text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
              />
            </div>
            <div className="text-xs font-mono text-zinc-400 hidden sm:block">
              ENROLLED: {filteredPurchases.length} OF {purchases.length} COURSES
            </div>
          </div>

          {/* Enrolled Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="cyber-card h-72 animate-pulse p-4 space-y-3" />
              ))}
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="cyber-card p-14 text-center max-w-md mx-auto space-y-3 font-mono">
              <div className="w-12 h-12 rounded bg-[#0c121e] border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto text-xl">
                <FiBookOpen />
              </div>
              <h3 className="text-sm font-bold text-white uppercase font-display">// NO ENROLLED COURSES YET</h3>
              <p className="text-xs text-zinc-400">
                You have not enrolled in any courses yet. Explore our curriculum to get started!
              </p>
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="btn-cyber-primary text-xs px-5 py-2.5 inline-flex items-center gap-1.5"
                >
                  <span>EXPLORE COURSES</span>
                  <FiArrowRight size={12} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPurchases.map((course, idx) => (
                <div
                  key={course._id || idx}
                  className="cyber-card-interactive flex flex-col justify-between group"
                >
                  {/* Thumbnail */}
                  <div className="relative h-44 overflow-hidden bg-[#04060a] border-b border-[#162034]">
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
                    <span className="absolute top-2.5 right-2.5 badge-cyber-green text-[10px]">
                      ENROLLED
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <h3 className="font-display text-sm sm:text-base font-bold text-white group-hover:text-cyan-300 line-clamp-2 leading-snug">
                        {course.title || "Curriculum Track"}
                      </h3>
                      <p className="text-xs text-zinc-400 line-clamp-2 font-mono leading-relaxed">
                        {course.description || "Hands-on projects, starter repositories, and video walkthroughs."}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="pt-3 border-t border-[#162034] flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourseForPlayer(course);
                          setActiveLesson(1);
                        }}
                        className="btn-cyber-primary flex-1 py-2 text-xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <FiPlayCircle size={13} />
                        <span>START LEARNING</span>
                      </button>

                      <button
                        onClick={() => setSelectedCourseForCert(course)}
                        className="btn-cyber-outline px-3 py-2 text-xs text-zinc-300 hover:text-amber-400 cursor-pointer"
                        title="View Certificate"
                      >
                        <FiAward size={13} />
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-mono">
          <div className="cyber-card w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col border border-cyan-500/40 shadow-2xl">
            {/* Modal Header */}
            <div className="p-4 border-b border-[#162034] flex items-center justify-between bg-[#060910]">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded bg-[#0c121e] border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-xs">
                  <FiPlayCircle />
                </div>
                <div>
                  <h3 className="text-xs sm:text-sm font-bold text-white font-display line-clamp-1">
                    {selectedCourseForPlayer.title}
                  </h3>
                  <p className="text-[10px] text-cyan-400">Course Playback · HD Stream</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourseForPlayer(null)}
                className="p-1.5 rounded bg-[#0c121e] hover:bg-[#162034] text-zinc-400 hover:text-white transition cursor-pointer"
              >
                <FiX size={15} />
              </button>
            </div>

            {/* Modal Body Grid */}
            <div className="flex-1 overflow-y-auto grid lg:grid-cols-12 gap-5 p-5">
              {/* Left: Video Player */}
              <div className="lg:col-span-8 space-y-3">
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden border border-[#162034] flex items-center justify-center group">
                  <img
                    src={selectedCourseForPlayer.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                    alt="Lesson preview"
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2">
                    <div className="w-14 h-14 rounded-full bg-cyan-400 text-black flex items-center justify-center text-xl shadow-neon-cyan cursor-pointer hover:scale-105 transition-transform">
                      <FiPlayCircle />
                    </div>
                    <span className="text-xs text-cyan-300 font-mono">
                      Lesson 0{activeLesson}: {mockLessons.find((l) => l.id === activeLesson)?.title}
                    </span>
                  </div>
                </div>

                <div className="terminal-box space-y-2">
                  <div className="flex items-center justify-between text-zinc-400 text-[11px]">
                    <span className="text-cyan-400 uppercase font-bold">COURSE RESOURCES & CODE</span>
                    <span>Production Setup</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => toast.success("Downloading starter code archive...")}
                      className="btn-cyber-outline text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                    >
                      <FiDownload size={11} /> Download Zip (.ZIP)
                    </button>
                    <button
                      onClick={() => toast.success("Opening repository in new tab...")}
                      className="btn-cyber-outline text-xs py-1.5 px-3 flex items-center gap-1.5 cursor-pointer"
                    >
                      <FiCode size={11} /> View on GitHub
                    </button>
                  </div>
                </div>
              </div>

              {/* Right: Modules List */}
              <div className="lg:col-span-4 space-y-2.5 flex flex-col font-mono">
                <div className="text-xs font-bold text-cyan-400 uppercase">
                  Course Lessons ({mockLessons.length})
                </div>
                <div className="space-y-1.5 flex-1 overflow-y-auto max-h-72 lg:max-h-none">
                  {mockLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson.id)}
                      className={`w-full text-left p-2.5 rounded-lg border text-xs transition flex items-center justify-between cursor-pointer ${
                        activeLesson === lesson.id
                          ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 font-bold"
                          : "bg-[#060910] border-[#162034] text-zinc-400 hover:text-white"
                      }`}
                    >
                      <span className="line-clamp-1">{lesson.title}</span>
                      <span className="text-[10px] text-zinc-500">{lesson.duration}</span>
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
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 font-mono">
          <div className="cyber-card w-full max-w-xl overflow-hidden flex flex-col border border-cyan-500/40 shadow-2xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[#162034] pb-3">
              <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
                <FiAward size={15} /> Verified Certificate of Completion
              </div>
              <button
                onClick={() => setSelectedCourseForCert(null)}
                className="p-1 rounded bg-[#0c121e] text-zinc-400 hover:text-white cursor-pointer"
              >
                <FiX size={14} />
              </button>
            </div>

            {/* Certificate Canvas */}
            <div className="p-6 rounded-lg bg-[#060910] border-2 border-cyan-500/30 text-center space-y-3 shadow-neon-cyan">
              <div className="text-[11px] uppercase tracking-widest text-cyan-400 font-bold">
                CERTIFICATE OF COMPLETION
              </div>
              <div className="text-[11px] text-zinc-400">This certifies that</div>
              <div className="text-xl font-bold text-white tracking-wide font-display uppercase">
                {userProfile?.firstName} {userProfile?.lastName}
              </div>
              <div className="text-[11px] text-zinc-400">has successfully completed all project requirements for</div>
              <div className="text-sm font-bold text-cyan-300 font-display">
                {selectedCourseForCert.title}
              </div>
              <div className="pt-3 border-t border-[#162034] flex items-center justify-between text-[10px] text-zinc-500">
                <span>CERT ID: CS-{selectedCourseForCert._id?.slice(-8).toUpperCase()}</span>
                <span>DATE: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-2.5 pt-1">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Certificate link copied to clipboard!");
                }}
                className="btn-cyber-outline text-xs py-2 px-3.5 flex items-center gap-1.5 cursor-pointer"
              >
                <FiShare2 size={11} />
                <span>Share Link</span>
              </button>
              <button
                onClick={() => toast.success("Preparing certificate PDF...")}
                className="btn-cyber-primary text-xs py-2 px-4 flex items-center gap-1.5 cursor-pointer"
              >
                <FiDownload size={11} />
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