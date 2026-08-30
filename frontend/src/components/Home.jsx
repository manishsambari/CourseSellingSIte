import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FiArrowRight,
  FiAward,
  FiCode,
  FiLayers,
  FiUser,
  FiBookOpen,
  FiCheck,
  FiArrowUpRight,
  FiClock,
  FiTerminal,
  FiShield,
} from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
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
  const [loading, setLoading] = useState(true);

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
        console.error("Error in fetchCourses", error);
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

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── TOP HEADER / NAVBAR ── */}
      <header className="header-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
              <img src={logo} alt="CourseShip Logo" className="w-6 h-6 object-cover rounded" />
            </div>
            <span className="text-base font-bold tracking-tight text-white flex items-center gap-1">
              CourseShip
              <span className="text-[11px] font-mono text-zinc-400 font-normal ml-1 border border-zinc-800 px-1.5 py-0.5 rounded bg-zinc-900">
                EDU
              </span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-medium text-zinc-400">
            <Link to="/courses" className="hover:text-white transition-colors">
              Courses
            </Link>
            <a href="#curriculum" className="hover:text-white transition-colors">
              Curriculum
            </a>
            <a href="#features" className="hover:text-white transition-colors">
              Why Us
            </a>
            <a href="#pricing" className="hover:text-white transition-colors">
              Membership
            </a>
          </nav>

          {/* User Auth CTAs */}
          <div className="hidden md:flex items-center gap-3 text-xs">
            {isLoggedIn ? (
              <div className="flex items-center gap-3">
                <Link
                  to="/purchases"
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-200 hover:text-white hover:border-zinc-700 font-medium transition"
                >
                  <RiShoppingBag3Line size={14} className="text-indigo-400" />
                  <span>My Learning</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-zinc-400 hover:text-rose-400 transition font-medium px-2 py-1.5"
                >
                  Log out
                </button>
                <div className="w-8 h-8 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-xs">
                  {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser />}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2.5">
                <Link
                  to="/login"
                  className="px-3.5 py-2 rounded-xl text-zinc-300 hover:text-white font-medium transition"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-zinc-400 hover:text-white rounded-lg bg-zinc-900 border border-zinc-800"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <HiX size={20} /> : <HiMenu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0e0e11] border-b border-zinc-800 px-6 py-5 space-y-4 text-sm">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white font-medium"
            >
              Browse All Courses
            </Link>
            <a
              href="#curriculum"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white font-medium"
            >
              Curriculum Overview
            </a>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-zinc-300 hover:text-white font-medium"
            >
              Platform Features
            </a>
            {isLoggedIn ? (
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <Link
                  to="/purchases"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-indigo-400 font-semibold"
                >
                  My Learning Dashboard
                </Link>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleLogout();
                  }}
                  className="block text-rose-400 font-medium"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="pt-3 border-t border-zinc-800 grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-secondary text-center"
                >
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn-primary text-center"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="pt-32 pb-16 sm:pt-40 sm:pb-24 px-4 sm:px-6 max-w-5xl mx-auto text-center space-y-7">
        {/* Release Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>New: 2026 Full-Stack & AI Systems Tracks</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-[1.12]">
          Build systems that scale. <br className="hidden sm:inline" />
          <span className="text-zinc-400">Master production engineering.</span>
        </h1>

        {/* Subtitle */}
        <p className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto font-normal leading-relaxed">
          Comprehensive, project-driven technical curriculum covering modern full-stack architectures,
          distributed backend microservices, autonomous AI agents, and cloud deployments.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/courses"
            className="btn-primary w-full sm:w-auto px-6 py-3 text-xs font-semibold flex items-center justify-center gap-2"
          >
            <span>Explore All Courses</span>
            <FiArrowRight size={14} />
          </Link>
          <a
            href="#curriculum"
            className="btn-secondary w-full sm:w-auto px-6 py-3 text-xs font-semibold"
          >
            Browse Curriculum
          </a>
        </div>

        {/* Trust Badges Bar */}
        <div className="pt-10 grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-zinc-800/80 text-left">
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="text-xs font-mono text-zinc-400">ENROLLED</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">50,000+</div>
            <div className="text-[11px] text-zinc-500">Engineers learning worldwide</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="text-xs font-mono text-zinc-400">CURRICULUM</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">100%</div>
            <div className="text-[11px] text-zinc-500">Hands-on source code repos</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="text-xs font-mono text-zinc-400">CERTIFICATION</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">Verifiable</div>
            <div className="text-[11px] text-zinc-500">Digital completion credentials</div>
          </div>
          <div className="p-4 rounded-xl bg-zinc-900/40 border border-zinc-800/60">
            <div className="text-xs font-mono text-zinc-400">SUPPORT</div>
            <div className="text-xl font-bold text-white font-mono mt-0.5">24/7</div>
            <div className="text-[11px] text-zinc-500">Developer mentor network</div>
          </div>
        </div>
      </section>

      {/* ── FEATURED COURSES SECTION ── */}
      <section id="curriculum" className="py-14 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
              Curated Curriculum
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
              Production-Grade Courses
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 mt-1">
              Each course includes source code, interactive walkthroughs, and deployment blueprints.
            </p>
          </div>
          <Link
            to="/courses"
            className="text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1.5 self-start sm:self-auto px-3 py-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 transition"
          >
            <span>View all courses</span>
            <FiArrowUpRight size={13} />
          </Link>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card-surface h-80 animate-pulse p-4 space-y-4">
                <div className="h-44 bg-zinc-800/60 rounded-xl" />
                <div className="h-4 bg-zinc-800 rounded w-3/4" />
                <div className="h-3 bg-zinc-800 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="card-surface p-12 text-center max-w-md mx-auto space-y-3">
            <FiBookOpen size={32} className="text-zinc-500 mx-auto" />
            <div className="text-sm font-semibold text-zinc-300">No courses available</div>
            <p className="text-xs text-zinc-500">Check back shortly or run database seeding.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course) => (
              <div
                key={course._id}
                className="card-surface-interactive overflow-hidden flex flex-col group justify-between"
              >
                {/* Image Container */}
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
                  <span className="absolute top-3 right-3 text-[11px] font-mono font-medium text-emerald-400 bg-zinc-950/90 border border-emerald-500/20 px-2 py-0.5 rounded">
                    Instant Access
                  </span>
                </div>

                {/* Card Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5">
                    <h3 className="text-sm sm:text-base font-bold text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between gap-3">
                    <div className="text-[11px] font-mono text-zinc-400 flex items-center gap-1">
                      <FiClock size={12} className="text-zinc-500" />
                      <span>Self-paced</span>
                    </div>
                    <Link
                      to={`/buy/${course._id}`}
                      className="btn-accent text-xs font-semibold py-2 px-3.5 rounded-lg"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── WHY COURSESHIP / PILLARS ── */}
      <section id="features" className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-zinc-800">
        <div className="max-w-2xl mb-10">
          <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider font-semibold">
            Engineering Standard
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mt-1">
            Built for developers who value real code
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="card-surface p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 text-base">
              <FiCode />
            </div>
            <h3 className="text-base font-bold text-white">Full-Stack Repositories</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Every course is paired with complete, clean monorepos, Prisma migrations, Dockerfiles, and CI/CD actions.
            </p>
          </div>

          <div className="card-surface p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 text-base">
              <FiAward />
            </div>
            <h3 className="text-base font-bold text-white">Verifiable Credentials</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Upon completing capstone requirements, receive a unique cryptographic credential URL for your resume.
            </p>
          </div>

          <div className="card-surface p-6 space-y-3">
            <div className="w-9 h-9 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-200 text-base">
              <FiTerminal />
            </div>
            <h3 className="text-base font-bold text-white">Continuous Updates</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              When major framework versions release (React 19, Next 15, Node 22), courses receive full delta updates.
            </p>
          </div>
        </div>
      </section>

      {/* ── MINIMAL MEMBERSHIP CALLOUT ── */}
      <section id="pricing" className="py-14 px-4 sm:px-6 max-w-4xl mx-auto">
        <div className="card-surface p-8 sm:p-10 border border-zinc-700 text-center space-y-5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-mono">
            <FiShield size={12} />
            <span>Lifetime Access Guarantee</span>
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Ready to level up your engineering skills?
            </h3>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto leading-relaxed">
              Explore individual masterclasses or enroll in the complete developer bundle today.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-300 font-medium">
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-emerald-400" /> Full GitHub Repos
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-emerald-400" /> Discord Mastermind
            </span>
            <span className="flex items-center gap-1.5">
              <FiCheck className="text-emerald-400" /> Verifiable Certs
            </span>
          </div>

          <div className="pt-2">
            <Link
              to="/courses"
              className="btn-primary px-6 py-3 text-xs font-bold inline-flex items-center gap-2"
            >
              <span>Explore Course Catalog</span>
              <FiArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CLEAN FOOTER ── */}
      <footer className="py-8 px-4 sm:px-6 lg:px-8 border-t border-zinc-800 text-xs text-zinc-500 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Logo" className="w-5 h-5 rounded object-cover" />
            <span className="font-semibold text-zinc-300">CourseShip</span>
            <span>&copy; {new Date().getFullYear()}</span>
          </div>

          <div className="flex items-center gap-6">
            <Link to="/courses" className="hover:text-zinc-300 transition-colors">
              Courses
            </Link>
            <Link to="/login" className="hover:text-zinc-300 transition-colors">
              Sign In
            </Link>
            <Link to="/admin/login" className="hover:text-zinc-300 transition-colors font-mono">
              Admin Portal
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;