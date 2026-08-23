import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FaPlay,
  FaCheck,
  FaGraduationCap,
  FaAward,
  FaClock,
  FaCode,
  FaDownload,
  FaStar,
  FaArrowRight,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import {
  FiBookOpen,
  FiShoppingBag,
  FiLogOut,
  FiLogIn,
  FiHome,
  FiUser,
  FiSearch,
  FiX,
  FiLayers,
  FiFileText,
  FiExternalLink,
} from "react-icons/fi";
import { RiDashboardLine } from "react-icons/ri";
import { HiMenu, HiX, HiSparkles } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function SkeletonCard() {
  return (
    <div className="glass-card rounded-3xl overflow-hidden border border-white/5 flex flex-col">
      <div className="skeleton-box h-48 w-full" />
      <div className="p-6 space-y-4 flex-1 flex flex-col">
        <div className="skeleton-box h-4 w-1/3 rounded-md" />
        <div className="skeleton-box h-6 w-3/4 rounded-md" />
        <div className="skeleton-box h-3 w-full rounded-md" />
        <div className="skeleton-box h-3 w-4/5 rounded-md" />
        <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
          <div className="skeleton-box h-8 w-20 rounded-md" />
          <div className="skeleton-box h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  
  // Interactive Modals
  const [activeCourseModal, setActiveCourseModal] = useState(null);
  const [activeCertificateModal, setActiveCertificateModal] = useState(null);
  const [activeLesson, setActiveLesson] = useState(1);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;

  useEffect(() => {
    setIsLoggedIn(!!token);
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    if (!token) return;
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPurchases(response.data.courseData || []);
        setErrorMessage("");
      } catch (error) {
        const errorMsg =
          error.response?.data?.errors || "Failed to fetch purchase data";
        setErrorMessage(errorMsg);
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
          navigate("/login");
        }
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
    { id: 1, title: "1. Course Overview & Environment Setup", duration: "18m", type: "video" },
    { id: 2, title: "2. Architecture & Production Best Practices", duration: "25m", type: "video" },
    { id: 3, title: "3. Building the Core Application Features", duration: "42m", type: "code" },
    { id: 4, title: "4. State Management, APIs & Database Integration", duration: "35m", type: "video" },
    { id: 5, title: "5. Automated Testing & Performance Tuning", duration: "28m", type: "code" },
    { id: 6, title: "6. Production Deployment & Capstone Submission", duration: "30m", type: "project" },
  ];

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen flex selection:bg-purple-600 selection:text-white font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-20 left-1/3 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

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
          className="lg:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
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
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">Student Portal</span>
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
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <FiBookOpen size={18} />
            <span>All Courses</span>
          </Link>
          <Link
            to="/purchases"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600/15 text-purple-300 border border-purple-500/25 font-semibold"
          >
            <FiShoppingBag size={18} className="text-purple-400" />
            <span>My Learning</span>
          </Link>
        </nav>

        {/* User Card & Logout */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="glass-card p-3 rounded-2xl flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              {user?.user?.firstName ? user.user.firstName[0].toUpperCase() : <FiUser />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {user?.user?.firstName} {user?.user?.lastName}
              </div>
              <div className="text-[11px] text-gray-400 truncate">{user?.user?.email}</div>
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
      </aside>

      {/* ── MAIN CONTENT AREA ── */}
      <main className="flex-1 lg:ml-72 min-h-screen p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-12 lg:pt-0">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <FaGraduationCap /> Student Dashboard
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                My Enrolled Courses
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Access your active masterclasses, source codes, and certificates.
              </p>
            </div>

            {/* Search within Purchases */}
            <div className="relative w-full sm:w-72">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search your library..."
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
          </div>

          {/* Quick Learning Stats Row */}
          {!loading && purchases.length > 0 && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-10">
              <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center text-white text-lg shadow-glow">
                  <FiBookOpen />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">{purchases.length}</div>
                  <div className="text-xs text-gray-400">Courses Enrolled</div>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-lg">
                  <FaClock />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">{purchases.length * 18}h</div>
                  <div className="text-xs text-gray-400">Hours of Content</div>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-lg">
                  <FaAward />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">{purchases.length}</div>
                  <div className="text-xs text-gray-400">Certificates Earned</div>
                </div>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-lg">
                  <FaCode />
                </div>
                <div>
                  <div className="text-2xl font-black text-white font-mono">{purchases.length * 4}</div>
                  <div className="text-xs text-gray-400">Projects Available</div>
                </div>
              </div>
            </div>
          )}

          {/* Error Banner if any */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm mb-6 flex items-center gap-3">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center border border-white/5">
              <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl">
                <FiShoppingBag />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {search ? "No matching enrolled courses" : "Your learning shelf is empty"}
              </h3>
              <p className="text-gray-400 text-sm max-w-md mx-auto mb-8 leading-relaxed">
                {search
                  ? "Try searching for a different keyword or view all your enrolled courses."
                  : "You have not enrolled in any masterclasses yet. Explore our curated catalog and start building real projects today."}
              </p>
              <Link
                to="/courses"
                className="btn-primary px-8 py-3.5 rounded-2xl text-sm font-bold shadow-glow inline-flex items-center gap-2"
              >
                <span>Browse All Courses</span>
                <FaArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPurchases.map((purchase, idx) => (
                <div
                  key={purchase._id || idx}
                  className="glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/5"
                >
                  {/* Thumbnail */}
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={
                        purchase.image?.url ||
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                      }
                      alt={purchase.title || "Course"}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={(e) => {
                        e.target.src =
                          "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#13131f] via-transparent to-transparent opacity-80" />
                    <span className="absolute top-4 right-4 bg-emerald-500/90 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1.5">
                      <FaCheckCircle size={11} /> Owned
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2">
                      {purchase.title || "Untitled Course"}
                    </h3>

                    <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                      {purchase.description ||
                        "Full curriculum with practical coding labs, starter code, and verified certificate."}
                    </p>

                    {/* Progress Indicator */}
                    <div className="mb-6 space-y-2">
                      <div className="flex justify-between text-xs text-gray-400 font-medium">
                        <span>Course Progress</span>
                        <span className="text-emerald-400 font-bold">100% Ready</span>
                      </div>
                      <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-purple-500 to-emerald-400 rounded-full w-3/4" />
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="grid grid-cols-2 gap-3 pt-2 border-t border-white/5">
                      <button
                        onClick={() => setActiveCourseModal(purchase)}
                        className="btn-primary py-2.5 px-3 rounded-xl text-xs font-bold shadow-glow flex items-center justify-center gap-1.5"
                      >
                        <FaPlay size={10} />
                        <span>Start Learning</span>
                      </button>
                      <button
                        onClick={() => setActiveCertificateModal(purchase)}
                        className="btn-secondary py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 hover:border-emerald-500/40 hover:text-emerald-300"
                      >
                        <FaAward size={13} className="text-yellow-400" />
                        <span>Certificate</span>
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
      {activeCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-4xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#13131f]">
              <div className="min-w-0 pr-4">
                <span className="text-xs font-bold text-purple-400 uppercase tracking-wider">
                  Course Learning Portal
                </span>
                <h3 className="text-xl font-bold text-white truncate mt-0.5">
                  {activeCourseModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveCourseModal(null)}
                className="w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                <FiX size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 grid lg:grid-cols-12 gap-6 bg-[#0a0a0f]">
              {/* Left Video Player Simulation */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative aspect-video rounded-2xl bg-black overflow-hidden border border-white/10 flex items-center justify-center group">
                  <img
                    src={activeCourseModal.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                    alt="Lesson preview"
                    className="w-full h-full object-cover opacity-40"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white shadow-glow hover:scale-110 transition cursor-pointer mb-2">
                      <FaPlay size={20} className="ml-1" />
                    </div>
                    <span className="text-xs font-medium text-gray-300 bg-black/60 px-3 py-1 rounded-full border border-white/10">
                      Playing Lesson #{activeLesson}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="text-sm font-bold text-white">Lesson Resources & Downloads</div>
                  <div className="flex flex-wrap gap-2 text-xs">
                    <a
                      href="https://github.com"
                      target="_blank"
                      rel="noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 flex items-center gap-1.5 border border-purple-500/20"
                    >
                      <FaCode /> Starter GitHub Repo <FiExternalLink size={11} />
                    </a>
                    <button
                      onClick={() => toast.success("Resource package downloaded!")}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-300 flex items-center gap-1.5 border border-emerald-500/20"
                    >
                      <FaDownload /> Download Cheat Sheet
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Curriculum / Lessons List */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-sm font-bold text-white flex justify-between items-center mb-2">
                  <span>Course Syllabus</span>
                  <span className="text-xs text-purple-400 font-mono">6 Modules</span>
                </div>
                <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                  {mockLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs font-medium transition flex items-center justify-between ${
                        activeLesson === lesson.id
                          ? "bg-purple-600/20 border-purple-500/40 text-purple-200"
                          : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        {activeLesson === lesson.id ? (
                          <FaPlay className="text-purple-400 flex-shrink-0 text-[10px]" />
                        ) : (
                          <FaCheckCircle className="text-emerald-500 flex-shrink-0 text-[11px]" />
                        )}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono ml-2 flex-shrink-0">
                        {lesson.duration}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── CERTIFICATE VIEWER MODAL ── */}
      {activeCertificateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-card w-full max-w-2xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl p-6 sm:p-10 relative">
            <button
              onClick={() => setActiveCertificateModal(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition"
            >
              <FiX size={20} />
            </button>

            {/* Certificate Canvas Preview */}
            <div className="p-8 rounded-2xl border-2 border-yellow-500/30 bg-gradient-to-b from-[#181829] to-[#0c0c14] text-center relative overflow-hidden shadow-2xl">
              <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white mx-auto mb-4 shadow-glow">
                <FaAward size={28} />
              </div>
              <span className="text-[11px] font-mono tracking-widest text-purple-400 uppercase">
                Certificate of Completion
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2 mb-2 font-serif">
                {user?.user?.firstName} {user?.user?.lastName || "Developer"}
              </h2>
              <p className="text-xs text-gray-400 max-w-md mx-auto mb-4">
                has successfully demonstrated proficiency and completed all practical capstone projects for
              </p>
              <h3 className="text-lg font-bold gradient-text mb-6">
                {activeCertificateModal.title}
              </h3>

              <div className="flex justify-between items-center text-[10px] text-gray-500 border-t border-white/10 pt-4 font-mono">
                <span>ID: CS-{Math.random().toString(36).substring(2, 9).toUpperCase()}</span>
                <span>Date: {new Date().toLocaleDateString()}</span>
                <span>CourseShip Verified</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center mt-6">
              <button
                onClick={() => toast.success("Certificate PDF downloading!")}
                className="btn-primary px-6 py-3 rounded-xl text-xs font-bold shadow-glow flex items-center gap-2"
              >
                <FaDownload /> Download Certificate PDF
              </button>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  toast.success("Certificate link copied to clipboard!");
                }}
                className="btn-secondary px-6 py-3 rounded-xl text-xs font-semibold"
              >
                Share Certificate Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Purchases;