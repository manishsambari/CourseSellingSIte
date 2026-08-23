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
import { HiMenu, HiX, HiSparkles } from "react-icons/hi";
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
    { id: 1, title: "1. Course Overview & Architecture Blueprint", duration: "18m", type: "video" },
    { id: 2, title: "2. Setting Up Production Toolchain & Monorepo", duration: "25m", type: "video" },
    { id: 3, title: "3. Building the Core High-Performance Engine", duration: "42m", type: "code" },
    { id: 4, title: "4. State Management, APIs & Database Integration", duration: "35m", type: "video" },
    { id: 5, title: "5. Automated Testing & Reliability Hardening", duration: "28m", type: "code" },
    { id: 6, title: "6. Production Deployment & Capstone Submission", duration: "30m", type: "project" },
  ];

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen flex flex-col lg:flex-row selection:bg-purple-600 selection:text-white font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-20 left-1/3 w-[450px] h-[450px] bg-emerald-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

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

      {/* ── SIDEBAR ── */}
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
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">Student Portal</span>
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
        <div className="pt-6 border-t border-white/5 space-y-3">
          <div className="glass-card p-3 rounded-2xl flex items-center gap-3 border border-white/5">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-xs shadow-sm flex-shrink-0">
              {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {userProfile?.firstName} {userProfile?.lastName}
              </div>
              <div className="text-[11px] text-purple-400 font-mono">Enrolled Student</div>
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

      {/* ── MAIN CONTENT ── */}
      <main className="flex-1 lg:ml-72 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <FiShoppingBag /> Learning Dashboard
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                My Enrolled Courses
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Continue learning, resume video lessons, and download verified certificates.
              </p>
            </div>

            <Link
              to="/courses"
              className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow flex items-center gap-2 self-start md:self-auto"
            >
              <FiBookOpen size={14} />
              <span>Explore More Courses</span>
            </Link>
          </div>

          {/* Overview Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <FiBookOpen className="text-purple-400" /> Enrolled
              </div>
              <div className="text-2xl font-black text-white font-mono">{purchases.length}</div>
              <div className="text-[11px] text-gray-500">Lifetime Access</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <FiClock className="text-blue-400" /> Content
              </div>
              <div className="text-2xl font-black text-white font-mono">{purchases.length * 18}h</div>
              <div className="text-[11px] text-gray-500">Hours of Lessons</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <FiAward className="text-yellow-400" /> Certificates
              </div>
              <div className="text-2xl font-black text-white font-mono">{purchases.length}</div>
              <div className="text-[11px] text-emerald-400">Available to Claim</div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-white/5 space-y-1">
              <div className="text-xs text-gray-400 flex items-center gap-1.5">
                <FiCode className="text-emerald-400" /> Projects
              </div>
              <div className="text-2xl font-black text-white font-mono">{purchases.length * 4}</div>
              <div className="text-[11px] text-gray-500">GitHub Starters</div>
            </div>
          </div>

          {/* Search Library Filter */}
          <div className="glass-card p-3 rounded-2xl border border-white/5 flex items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="Search your library..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder:text-gray-500 outline-none"
              />
            </div>
            <div className="text-xs text-gray-400 pr-2 hidden sm:block">
              Showing {filteredPurchases.length} of {purchases.length} courses
            </div>
          </div>

          {/* Enrolled Courses Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="glass-card rounded-3xl h-80 animate-pulse border border-white/5 p-6" />
              ))}
            </div>
          ) : filteredPurchases.length === 0 ? (
            <div className="glass-card rounded-3xl p-16 text-center border border-white/5 max-w-md mx-auto space-y-4">
              <div className="w-16 h-16 rounded-3xl gradient-bg flex items-center justify-center text-white text-2xl mx-auto shadow-glow">
                <HiSparkles />
              </div>
              <h3 className="text-xl font-bold text-white">No courses enrolled yet</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                You haven't enrolled in any masterclasses yet. Explore our technical catalog to start learning.
              </p>
              <div className="pt-2">
                <Link
                  to="/courses"
                  className="btn-primary px-6 py-3 rounded-xl text-xs font-bold shadow-glow inline-flex items-center gap-2"
                >
                  <span>Browse Catalog</span>
                  <FiArrowRight size={13} />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPurchases.map((course, idx) => (
                <div
                  key={course._id || idx}
                  className="glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/5 justify-between"
                >
                  {/* Thumbnail wrap */}
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
                    <span className="absolute top-4 right-4 bg-emerald-500/90 text-black text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                      Active Access
                    </span>
                    <span className="absolute bottom-3 left-4 text-xs font-bold text-white font-mono bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1">
                      <FiCheckCircle className="text-emerald-400" /> Enrolled
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div>
                      <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors line-clamp-2 min-h-[3rem] leading-snug">
                        {course.title || "Masterclass"}
                      </h3>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                        {course.description || "Hands-on projects, starter repositories, and video walkthroughs."}
                      </p>
                    </div>

                    {/* Progress indicator */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-[11px] text-gray-400">
                        <span>Progress</span>
                        <span className="text-purple-400 font-mono font-bold">100% Complete</span>
                      </div>
                      <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                        <div className="h-full gradient-bg rounded-full w-full" />
                      </div>
                    </div>

                    {/* Actions Bar */}
                    <div className="pt-3 border-t border-white/5 flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedCourseForPlayer(course);
                          setActiveLesson(1);
                        }}
                        className="btn-primary flex-1 py-2.5 rounded-xl text-xs font-bold shadow-glow flex items-center justify-center gap-1.5"
                      >
                        <FiPlayCircle size={14} />
                        <span>Start Learning</span>
                      </button>

                      <button
                        onClick={() => setSelectedCourseForCert(course)}
                        className="btn-secondary px-3 py-2.5 rounded-xl text-xs font-semibold text-gray-300 hover:text-yellow-400 flex items-center gap-1"
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="glass-card rounded-3xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col border border-white/10 shadow-2xl">
            {/* Modal Header */}
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#11111c]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white text-xs">
                  <FiPlayCircle />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white line-clamp-1">
                    {selectedCourseForPlayer.title}
                  </h3>
                  <p className="text-[11px] text-gray-400">Interactive Curriculum Player</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCourseForPlayer(null)}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition"
              >
                <FiX size={18} />
              </button>
            </div>

            {/* Modal Content Grid */}
            <div className="flex-1 overflow-y-auto grid lg:grid-cols-12 gap-6 p-6">
              {/* Video Player & Lab Preview */}
              <div className="lg:col-span-8 space-y-4">
                <div className="relative aspect-video bg-black rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center shadow-lg group">
                  <img
                    src={selectedCourseForPlayer.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800"}
                    alt="Lesson preview"
                    className="w-full h-full object-cover opacity-30"
                  />
                  <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3">
                    <div className="w-16 h-16 rounded-full gradient-bg flex items-center justify-center text-white text-2xl shadow-glow cursor-pointer hover:scale-110 transition-transform">
                      <FiPlayCircle />
                    </div>
                    <span className="text-xs font-semibold text-gray-300">
                      Lesson {activeLesson}: {mockLessons.find((l) => l.id === activeLesson)?.title || "Module Lesson"}
                    </span>
                  </div>
                </div>

                <div className="glass-card p-4 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      Module Resources & Repositories
                    </h4>
                    <span className="text-[11px] text-purple-400 font-mono">Starter Kit v2.4</span>
                  </div>
                  <div className="flex flex-wrap gap-2 pt-1">
                    <button
                      onClick={() => toast.success("Downloading starter code archive...")}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <FiDownload size={12} /> Download Code (.zip)
                    </button>
                    <button
                      onClick={() => toast.success("Opening GitHub repository...")}
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <FiCode size={12} /> View GitHub Repo
                    </button>
                  </div>
                </div>
              </div>

              {/* Lesson Curriculum List */}
              <div className="lg:col-span-4 space-y-3 flex flex-col">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Course Modules ({mockLessons.length})
                </div>
                <div className="space-y-2 flex-1 overflow-y-auto pr-1 max-h-80 lg:max-h-none">
                  {mockLessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setActiveLesson(lesson.id)}
                      className={`w-full text-left p-3 rounded-xl border text-xs transition flex items-center justify-between ${
                        activeLesson === lesson.id
                          ? "bg-purple-600/20 border-purple-500/40 text-purple-200 font-semibold"
                          : "glass-card border-white/5 text-gray-400 hover:text-white hover:border-white/10"
                      }`}
                    >
                      <span className="line-clamp-1">{lesson.title}</span>
                      <span className="font-mono text-[10px] text-gray-500">{lesson.duration}</span>
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
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div className="glass-card rounded-3xl w-full max-w-2xl overflow-hidden flex flex-col border border-white/10 shadow-2xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-4">
              <div className="flex items-center gap-2 text-yellow-400 font-bold text-sm">
                <FiAward size={18} /> Verified Certificate of Completion
              </div>
              <button
                onClick={() => setSelectedCourseForCert(null)}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white"
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Certificate Canvas Preview */}
            <div className="p-8 rounded-2xl bg-gradient-to-br from-[#181829] to-[#0c0c14] border-2 border-yellow-500/30 text-center space-y-4 shadow-xl relative overflow-hidden">
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white mx-auto shadow-glow">
                <img src={logo} alt="Logo" className="w-7 h-7 rounded object-cover" />
              </div>
              <div className="text-xs uppercase tracking-widest text-purple-400 font-mono font-bold">
                Certificate of Engineering Excellence
              </div>
              <div className="text-xs text-gray-400">This is to proudly certify that</div>
              <div className="text-2xl font-black text-white tracking-wide font-sans">
                {userProfile?.firstName} {userProfile?.lastName}
              </div>
              <div className="text-xs text-gray-400">
                has successfully completed all modules and projects for
              </div>
              <div className="text-base font-bold text-yellow-300">
                {selectedCourseForCert.title}
              </div>
              <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-500 font-mono">
                <span>Verification ID: CS-{selectedCourseForCert._id?.slice(-8).toUpperCase()}</span>
                <span>Issued: {new Date().toLocaleDateString()}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => {
                  navigator.clipboard?.writeText(window.location.href);
                  toast.success("Certificate link copied to clipboard!");
                }}
                className="btn-secondary px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
              >
                <FiShare2 size={13} />
                <span>Share Link</span>
              </button>
              <button
                onClick={() => toast.success("Downloading Certificate PDF...")}
                className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow flex items-center gap-1.5"
              >
                <FiDownload size={13} />
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