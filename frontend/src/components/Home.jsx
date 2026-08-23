import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaArrowRight,
  FaCheckCircle,
} from "react-icons/fa";
import {
  FiAward,
  FiCode,
  FiLayers,
  FiUser,
  FiArrowUpRight,
  FiCheck,
} from "react-icons/fi";
import { HiMenu, HiX, HiSparkles } from "react-icons/hi";
import { RiShoppingBag3Line } from "react-icons/ri";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        console.log("Error in fetchCourses", error);
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

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen selection:bg-purple-600 selection:text-white font-sans antialiased">
      {/* Subtle ambient lighting */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* ── MINIMAL NAVBAR ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-white/5">
        <div className="max-w-6xl mx-auto px-6 h-18 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 gradient-bg rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <img src={logo} alt="CourseShip" className="w-5 h-5 rounded object-cover" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">
              Course<span className="gradient-text">Ship</span>
            </span>
          </Link>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-8 text-xs font-medium text-gray-400">
            <Link to="/courses" className="hover:text-white transition">
              Courses
            </Link>
            <a href="#features" className="hover:text-white transition">
              Curriculum
            </a>
            <a href="#pro-pass" className="hover:text-white transition">
              All-Access
            </a>
          </div>

          {/* Auth Actions */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/purchases"
                  className="px-4 py-2 rounded-xl border border-purple-500/30 bg-purple-500/10 text-purple-300 font-semibold flex items-center gap-2 hover:bg-purple-500/20 transition"
                >
                  <RiShoppingBag3Line size={14} /> My Learning
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-gray-400 hover:text-red-400 transition font-medium"
                >
                  Logout
                </button>
                <div className="w-8 h-8 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-xs">
                  {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="text-gray-400 hover:text-white transition font-medium px-3 py-2"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary px-4 py-2 rounded-xl font-bold shadow-glow"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-white"
          >
            {mobileMenuOpen ? <HiX size={22} /> : <HiMenu size={22} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card border-b border-white/5 p-6 space-y-4 text-sm animate-fade-in">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-white"
            >
              Browse Courses
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  to="/purchases"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-purple-300 font-semibold"
                >
                  My Learning
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block text-red-400"
                >
                  Log Out
                </button>
              </>
            ) : (
              <div className="pt-2 border-t border-white/5 space-y-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gray-400"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary block text-center py-2.5 rounded-xl font-bold"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </nav>

      {/* ── MINIMAL HERO SECTION ── */}
      <section className="pt-36 pb-16 sm:pt-44 sm:pb-24 px-6 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
            <HiSparkles size={14} className="text-purple-400" />
            <span>Next-Gen Engineering Masterclasses</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl font-black text-white tracking-tight leading-[1.1]">
            Learn Faster. <br className="hidden sm:inline" />
            <span className="gradient-text">Build Production Code.</span>
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-gray-400 max-w-xl mx-auto font-normal leading-relaxed">
            Project-based courses in Full-Stack, AI Agents, Cloud, and Systems Architecture.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/courses"
              className="btn-primary w-full sm:w-auto px-8 py-3.5 rounded-2xl text-sm font-bold shadow-glow flex items-center justify-center gap-2"
            >
              <span>Explore All Courses</span>
              <FaArrowRight size={13} />
            </Link>
            <a
              href="#courses-preview"
              className="btn-secondary w-full sm:w-auto px-7 py-3.5 rounded-2xl text-sm font-semibold text-gray-300 hover:text-white"
            >
              Preview Curriculum
            </a>
          </div>

          {/* Minimal Trust Strip */}
          <div className="pt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs text-gray-500 font-medium">
            <span className="flex items-center gap-2">
              <FaStar className="text-yellow-400 text-xs" /> 4.9/5 Student Rating
            </span>
            <span className="flex items-center gap-2">
              <FaCheckCircle className="text-emerald-400 text-xs" /> 50,000+ Enrolled
            </span>
            <span className="flex items-center gap-2">
              <FiAward className="text-purple-400 text-xs" /> Verified Certificates
            </span>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES ── */}
      <section id="courses-preview" className="py-16 px-6 max-w-6xl mx-auto">
        <div className="flex items-end justify-between mb-10">
          <div>
            <span className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">
              Curated Catalog
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1">
              Featured Masterclasses
            </h2>
          </div>
          <Link
            to="/courses"
            className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1 transition"
          >
            <span>View all</span>
            <FiArrowUpRight size={14} />
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.slice(0, 6).map((course) => (
            <div
              key={course._id}
              className="glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/5"
            >
              <div className="relative h-44 overflow-hidden">
                <img
                  src={
                    course.image?.url ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                  }
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#13131f] via-transparent to-transparent opacity-80" />
                <span className="absolute bottom-3 left-4 text-xs font-bold text-white font-mono bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/10">
                  ₹{course.price}
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-6">
                    {course.description}
                  </p>
                </div>

                <Link
                  to={`/buy/${course._id}`}
                  className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold shadow-glow text-center block"
                >
                  Enroll Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── 3 CORE PILLARS (CLEAN & MINIMAL) ── */}
      <section id="features" className="py-16 px-6 max-w-6xl mx-auto border-t border-white/5">
        <div className="grid md:grid-cols-3 gap-6">
          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-base shadow-glow">
              <FiCode />
            </div>
            <h3 className="text-base font-bold text-white">Production-Ready Code</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Build full architectures, real-world APIs, and deployable applications.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base">
              <FiAward />
            </div>
            <h3 className="text-base font-bold text-white">Verifiable Certificates</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Earn shareable credentials recognized on LinkedIn and portfolio resumes.
            </p>
          </div>

          <div className="glass-card p-6 sm:p-8 rounded-3xl border border-white/5 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-base">
              <FiLayers />
            </div>
            <h3 className="text-base font-bold text-white">Lifetime Updates</h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Permanent access to all curriculum updates, Discord rooms, and source files.
            </p>
          </div>
        </div>
      </section>

      {/* ── MINIMAL PRO CALLOUT BANNER ── */}
      <section id="pro-pass" className="py-16 px-6 max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-purple-500/30 relative overflow-hidden shadow-2xl text-center space-y-6">
          <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white mx-auto shadow-glow">
            <HiSparkles size={20} />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Get Unlimited Access to Every Course
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 max-w-lg mx-auto leading-relaxed">
              Unlock the entire library of masterclasses, starter repos, and priority mentor assistance.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-300 font-medium">
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-emerald-400" /> All 8+ Masterclasses
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-emerald-400" /> Discord Mastermind
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-emerald-400" /> Verified Credentials
            </span>
          </div>

          <div>
            <Link
              to="/courses"
              className="btn-primary px-8 py-3.5 rounded-2xl text-sm font-bold shadow-glow inline-flex items-center gap-2"
            >
              <span>Explore Masterclasses</span>
              <FaArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── MINIMAL FOOTER ── */}
      <footer className="py-12 px-6 border-t border-white/5 text-xs text-gray-500">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Logo" className="w-5 h-5 rounded" />
            <span className="font-bold text-gray-300">CourseShip</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/courses" className="hover:text-gray-300 transition">
              Courses
            </Link>
            <Link to="/login" className="hover:text-gray-300 transition">
              Sign In
            </Link>
            <Link to="/admin/login" className="hover:text-purple-400 transition font-medium">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;