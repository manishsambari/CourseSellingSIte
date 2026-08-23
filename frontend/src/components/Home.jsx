import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  FaStar,
  FaCheck,
  FaArrowRight,
  FaPlay,
  FaGraduationCap,
  FaCode,
  FaShieldAlt,
  FaUsers,
  FaMobileAlt,
  FaInfinity,
  FaChevronDown,
  FaChevronUp,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaGithub,
  FaYoutube,
  FaDiscord,
} from "react-icons/fa";
import {
  FiSearch,
  FiAward,
  FiBookOpen,
  FiCheckCircle,
  FiClock,
  FiLayers,
  FiTrendingUp,
  FiUser,
  FiArrowUpRight,
} from "react-icons/fi";
import { HiMenu, HiX, HiSparkles } from "react-icons/hi";
import { RiShoppingBag3Line, RiDashboardLine } from "react-icons/ri";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

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
        setCourses(response.data.courses || []);
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

  const sliderSettings = {
    dots: true,
    infinite: courses.length > 3,
    speed: 600,
    slidesToShow: Math.min(courses.length || 1, 3),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(courses.length || 1, 2),
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const faqs = [
    {
      q: "Do I get lifetime access to the courses?",
      a: "Yes! Once you enroll in any course on CourseShip, you get unlimited lifetime access to all lectures, project source code, downloadable cheat sheets, and future updates.",
    },
    {
      q: "Will I receive a verified certificate upon completion?",
      a: "Absolutely. After finishing all course modules and completing the practical capstone projects, you will receive an industry-recognized certificate of completion that you can add directly to your LinkedIn profile and resume.",
    },
    {
      q: "Are the courses suitable for complete beginners?",
      a: "Yes! Every course is structured with beginner-friendly foundations before advancing into real-world architecture, industry best practices, and deep-dive implementations.",
    },
    {
      q: "What is the 30-day money-back guarantee?",
      a: "If you are not completely satisfied with a course within 30 days of purchase, you can request a full refund—no questions asked.",
    },
    {
      q: "Can I get help if I get stuck on a coding exercise?",
      a: "Yes! You gain instant access to our exclusive Discord community where instructors and fellow developers help you troubleshoot and debug your code 24/7.",
    },
  ];

  const categories = [
    { id: "all", label: "🔥 All Courses" },
    { id: "web", label: "🌐 Web Development" },
    { id: "python", label: "🐍 Python & Data" },
    { id: "ai", label: "🤖 AI & Machine Learning" },
    { id: "mobile", label: "📱 Mobile Apps" },
  ];

  const filteredCourses = courses.filter((course) => {
    if (activeCategory === "all") return true;
    const title = (course.title || "").toLowerCase();
    const desc = (course.description || "").toLowerCase();
    if (activeCategory === "web") return title.includes("react") || title.includes("web") || title.includes("node") || desc.includes("javascript") || desc.includes("css");
    if (activeCategory === "python") return title.includes("python") || title.includes("data") || desc.includes("python");
    if (activeCategory === "ai") return title.includes("ai") || title.includes("ml") || desc.includes("machine learning");
    if (activeCategory === "mobile") return title.includes("mobile") || title.includes("react native") || desc.includes("app");
    return true;
  });

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen relative overflow-x-hidden selection:bg-purple-600 selection:text-white font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-0 left-1/4 w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-1/4 right-10 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

      {/* ── TOP NAVBAR ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-11 h-11 gradient-bg rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
                <img src={logo} alt="CourseShip" className="w-7 h-7 rounded-lg object-cover" />
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-bold font-sans tracking-tight text-white flex items-center gap-1.5">
                  Course<span className="gradient-text">Ship</span>
                </span>
                <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">Master Tech</span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
              <Link to="/courses" className="text-gray-300 hover:text-white transition flex items-center gap-1.5">
                <FiBookOpen className="text-purple-400" /> All Courses
              </Link>
              <a href="#features" className="text-gray-300 hover:text-white transition">
                Why Us
              </a>
              <a href="#tracks" className="text-gray-300 hover:text-white transition">
                Career Tracks
              </a>
              <a href="#testimonials" className="text-gray-300 hover:text-white transition">
                Success Stories
              </a>
              <a href="#pricing" className="text-gray-300 hover:text-white transition">
                Pricing
              </a>
              <a href="#faq" className="text-gray-300 hover:text-white transition">
                FAQ
              </a>
            </nav>

            {/* Auth Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <div className="flex items-center gap-3">
                  <Link
                    to="/purchases"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border border-purple-500/30 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20 transition"
                  >
                    <RiShoppingBag3Line size={16} /> My Learning
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-gray-400 hover:text-red-400 transition"
                  >
                    Logout
                  </button>
                  <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {userProfile?.firstName ? userProfile.firstName[0].toUpperCase() : <FiUser size={16} />}
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link
                    to="/login"
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-300 hover:text-white transition hover:bg-white/5"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/signup"
                    className="btn-primary px-5 py-2.5 text-sm font-semibold rounded-xl"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-xl border border-white/10 bg-white/5 text-gray-300 hover:text-white"
            >
              {mobileMenuOpen ? <HiX size={24} /> : <HiMenu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0f0f18] border-b border-white/10 px-6 py-6 space-y-4 animate-fade-in">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-purple-400 text-base font-medium"
            >
              All Courses
            </Link>
            <a
              href="#features"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-purple-400 text-base font-medium"
            >
              Why CourseShip
            </a>
            <a
              href="#tracks"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-purple-400 text-base font-medium"
            >
              Learning Tracks
            </a>
            <a
              href="#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-purple-400 text-base font-medium"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block text-gray-300 hover:text-purple-400 text-base font-medium"
            >
              FAQ
            </a>
            <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
              {isLoggedIn ? (
                <>
                  <Link
                    to="/purchases"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl bg-purple-600/20 text-purple-300 border border-purple-500/30 font-medium"
                  >
                    My Enrolled Courses
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-center py-2.5 text-red-400 font-medium"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 rounded-xl border border-white/10 text-gray-300 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-3 rounded-xl gradient-bg text-white font-semibold shadow-glow"
                  >
                    Get Started Free
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* ── HERO SECTION ── */}
      <section className="relative pt-36 pb-20 md:pt-44 md:pb-28 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 text-center lg:text-left">
            {/* Pill Tag */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-purple-500/30 bg-purple-500/10 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-6 shadow-glow">
              <HiSparkles className="text-yellow-400 animate-spin" style={{ animationDuration: "8s" }} />
              #1 Tech Learning Platform for Engineers
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              Master Tech Skills. <br />
              <span className="gradient-text">Build Production Apps.</span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-gray-400 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              High-impact, project-driven courses crafted by senior engineers. From foundational coding to full-stack microservices and AI agents.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <Link
                to="/courses"
                className="btn-primary px-8 py-4 text-base font-semibold rounded-2xl flex items-center justify-center gap-3 group"
              >
                <span>Explore All Courses</span>
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#tracks"
                className="btn-secondary px-8 py-4 text-base font-semibold rounded-2xl flex items-center justify-center gap-2"
              >
                <FiLayers className="text-purple-400" />
                <span>View Learning Paths</span>
              </a>
            </div>

            {/* Metrics Row */}
            <div className="pt-8 border-t border-white/10 grid grid-cols-3 gap-6 text-center sm:text-left">
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold text-white">50K+</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Active Students</div>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="text-2xl sm:text-3xl font-extrabold gradient-text">4.9★</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Course Rating</div>
              </div>
              <div className="border-l border-white/10 pl-6">
                <div className="text-2xl sm:text-3xl font-extrabold text-white">100%</div>
                <div className="text-xs sm:text-sm text-gray-400 mt-1">Hands-On Projects</div>
              </div>
            </div>
          </div>

          {/* Hero Right Visual Mockup */}
          <div className="lg:col-span-5 relative hidden sm:block">
            <div className="relative mx-auto max-w-md animate-float-slow">
              {/* Glass Hero Card */}
              <div className="glass-card rounded-3xl p-6 shadow-2xl relative z-10 border border-white/10 overflow-hidden">
                <div className="relative h-56 rounded-2xl overflow-hidden mb-6 group">
                  <img
                    src="https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&auto=format&fit=crop&q=80"
                    alt="Course Preview"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f] via-transparent to-black/30 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full gradient-bg flex items-center justify-center text-white shadow-glow hover:scale-110 transition cursor-pointer">
                      <FaPlay size={18} className="ml-1" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium text-purple-300 border border-purple-500/20">
                    Live Demo
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span className="flex items-center gap-1 text-yellow-400 font-semibold">
                      <FaStar /> 4.9 (1,480 reviews)
                    </span>
                    <span className="bg-emerald-500/10 text-emerald-400 px-2.5 py-0.5 rounded-full border border-emerald-500/20 font-medium">
                      Certificate Included
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-white leading-snug">
                    Full-Stack Mastery: React, Node.js & Cloud Deployment
                  </h3>
                  <p className="text-xs text-gray-400 line-clamp-2">
                    Build 5 industry-grade capstone applications from scratch with automated testing and deployment.
                  </p>

                  <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                    <div>
                      <span className="text-2xl font-black text-white font-mono">₹999</span>
                      <span className="text-xs text-gray-500 line-through ml-2">₹4,999</span>
                    </div>
                    <Link
                      to="/courses"
                      className="px-4 py-2 rounded-xl gradient-bg text-white text-xs font-bold hover:opacity-90 shadow-glow"
                    >
                      Preview Course →
                    </Link>
                  </div>
                </div>
              </div>

              {/* Floating auxiliary badges */}
              <div className="absolute -top-6 -right-6 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-purple-500/30 z-20">
                <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white text-base">
                  <FiAward />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">Accredited</div>
                  <div className="text-[10px] text-gray-400">Verified Credentials</div>
                </div>
              </div>

              <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl shadow-xl flex items-center gap-3 border border-emerald-500/30 z-20">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-base">
                  <FiTrendingUp />
                </div>
                <div>
                  <div className="text-xs font-bold text-white">94% Placement</div>
                  <div className="text-[10px] text-gray-400">Within 3 Months</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUSTED LOGOS / TECH MARQUEE ── */}
      <section className="py-12 border-y border-white/5 bg-[#0d0d15]/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-6">
            Master the technologies used by engineers at leading tech companies
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-14 opacity-70">
            {["React", "TypeScript", "Node.js", "Python", "Docker", "Next.js", "PostgreSQL", "AWS"].map((tech) => (
              <span
                key={tech}
                className="text-lg sm:text-xl font-bold font-mono text-gray-400 hover:text-purple-400 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── POPULAR COURSES SECTION ── */}
      <section id="courses" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
              <FiBookOpen /> Featured Catalog
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Popular Masterclasses</h2>
            <p className="text-gray-400 text-sm sm:text-base mt-2">
              Accelerate your engineering journey with our highest-rated interactive courses.
            </p>
          </div>
          <Link
            to="/courses"
            className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 hover:text-purple-300 transition"
          >
            <span>View All Courses</span>
            <FiArrowUpRight size={18} />
          </Link>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeCategory === cat.id
                  ? "gradient-bg text-white shadow-glow"
                  : "glass-card text-gray-400 hover:text-white hover:border-purple-500/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Courses Display */}
        {filteredCourses.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FiBookOpen />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No courses found in this category</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              Check back soon or explore all our available masterclasses in the course catalog.
            </p>
            <button
              onClick={() => setActiveCategory("all")}
              className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold"
            >
              Show All Courses
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredCourses.slice(0, 6).map((course) => (
              <div
                key={course._id}
                className="glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/5"
              >
                {/* Thumbnail */}
                <div className="relative h-52 overflow-hidden">
                  <img
                    src={course.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600";
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
                      <FaStar /> 4.9 (850+ reviews)
                    </span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <FiClock /> Lifetime Access
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white group-hover:text-purple-300 transition-colors mb-2 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-gray-400 text-sm line-clamp-2 mb-6 flex-1">
                    {course.description || "Comprehensive hands-on course covering full stack architecture and best practices."}
                  </p>

                  <div className="pt-4 border-t border-white/5 flex items-center justify-between mt-auto">
                    <div>
                      <div className="text-2xl font-black text-white font-mono">₹{course.price}</div>
                      <div className="text-xs text-gray-500 line-through">₹{Number(course.price || 0) * 4 || 4999}</div>
                    </div>
                    <Link
                      to={`/buy/${course._id}`}
                      className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold shadow-glow"
                    >
                      Enroll Now →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <Link
            to="/courses"
            className="btn-secondary px-8 py-3.5 rounded-2xl text-sm font-semibold inline-flex items-center gap-2"
          >
            <span>Explore Complete Catalog ({courses.length} Masterclasses)</span>
            <FaArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── CORE FEATURES / WHY CHOOSE US ── */}
      <section id="features" className="py-24 bg-[#0d0d15] relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Why CourseShip
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Engineered for Rapid Skill Mastery</h2>
            <p className="text-gray-400 text-base mt-3">
              Everything you need to level up from tutorial hell to writing robust production software.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <FaInfinity className="text-purple-400" />,
                title: "Lifetime Unrestricted Access",
                desc: "Learn at your pace with permanent access to video lessons, code repositories, and future syllabus updates.",
              },
              {
                icon: <FaCode className="text-blue-400" />,
                title: "Real-World Portfolio Projects",
                desc: "Don't just watch videos—build full-stack apps, authentication workflows, databases, and microservices.",
              },
              {
                icon: <FiAward className="text-yellow-400" />,
                title: "Accredited Certifications",
                desc: "Earn shareable certificates to showcase verified engineering competence to recruiters and hiring managers.",
              },
              {
                icon: <FaUsers className="text-emerald-400" />,
                title: "Active Developer Community",
                desc: "Connect with peers, collaborate on open source projects, and get instant debugging help in our Discord.",
              },
              {
                icon: <FaShieldAlt className="text-indigo-400" />,
                title: "30-Day Money Back Guarantee",
                desc: "Try any course 100% risk-free. If it doesn't meet your highest standards, get a prompt full refund.",
              },
              {
                icon: <FaMobileAlt className="text-pink-400" />,
                title: "Learn on Any Screen",
                desc: "Responsive web player optimized for desktops, tablets, and phones so you can code anytime, anywhere.",
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="glass-card p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all group"
              >
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-2xl mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CAREER TRACKS SECTION ── */}
      <section id="tracks" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Structured Curriculums
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Choose Your Learning Path</h2>
          <p className="text-gray-400 text-base mt-3">
            Step-by-step career tracks designed to take you from zero to job-ready software engineer.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Frontend Architect",
              badge: "High Demand",
              topics: ["HTML5 / Modern CSS", "React 19 & Next.js 15", "Tailwind CSS", "TypeScript & State Mgmt"],
              color: "from-blue-500 to-purple-600",
            },
            {
              title: "Backend & Systems",
              badge: "Popular",
              topics: ["Node.js & Express", "PostgreSQL & MongoDB", "REST & GraphQL APIs", "Docker & Redis Caching"],
              color: "from-emerald-500 to-teal-600",
            },
            {
              title: "AI & Data Engineering",
              badge: "Trending",
              topics: ["Python Data Stack", "PyTorch Fundamentals", "LangChain & LLM Agents", "Vector DBs & RAG"],
              color: "from-purple-500 to-pink-600",
            },
            {
              title: "DevOps & Cloud",
              badge: "High Salary",
              topics: ["CI/CD Pipelines", "AWS & Cloud Services", "Kubernetes Clusters", "Infrastructure as Code"],
              color: "from-amber-500 to-orange-600",
            },
          ].map((track, idx) => (
            <div
              key={idx}
              className="glass-card rounded-3xl p-6 flex flex-col justify-between border border-white/5 hover:border-purple-500/30 transition-all group"
            >
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white font-mono">
                    {track.badge}
                  </span>
                  <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${track.color}`} />
                </div>
                <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  {track.title}
                </h3>
                <ul className="space-y-2.5 mb-6 text-sm text-gray-400">
                  {track.topics.map((t, tIdx) => (
                    <li key={tIdx} className="flex items-center gap-2">
                      <FaCheck className="text-purple-400 text-xs flex-shrink-0" />
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                to="/courses"
                className="w-full py-2.5 text-center rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-gray-300 hover:text-white transition flex items-center justify-center gap-1.5"
              >
                <span>View Track Courses</span>
                <FiArrowUpRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS SECTION ── */}
      <section id="testimonials" className="py-24 bg-[#0d0d15] border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Success Stories
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Loved by 50,000+ Developers</h2>
            <p className="text-gray-400 text-base mt-3">
              Here is how CourseShip helped learners transition careers and land senior roles.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                text: "The Full Stack React & Node masterclass was directly responsible for me landing my current SDE role. The project architectures are identical to production systems.",
                name: "Aman Sharma",
                role: "Software Engineer @ Zeta",
                avatar: "https://i.pravatar.cc/120?img=11",
                stars: 5,
              },
              {
                text: "Clear, concise, and zero fluff. In 2 months I built 4 full-featured applications and completely rebuilt my developer portfolio. Worth 10x the price.",
                name: "Priya Patel",
                role: "Frontend Developer @ Swiggy",
                avatar: "https://i.pravatar.cc/120?img=5",
                stars: 5,
              },
              {
                text: "Best technical teaching style I have encountered. The explanations of state management, backend APIs, and microservices are crystal clear.",
                name: "Rohan Verma",
                role: "Backend Engineer @ CRED",
                avatar: "https://i.pravatar.cc/120?img=12",
                stars: 5,
              },
            ].map((t, idx) => (
              <div key={idx} className="glass-card p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                <div>
                  <div className="flex gap-1 text-yellow-400 mb-4">
                    {[...Array(t.stars)].map((_, i) => (
                      <FaStar key={i} size={14} />
                    ))}
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed italic mb-6">"{t.text}"</p>
                </div>
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full object-cover border border-purple-500/30" />
                  <div>
                    <div className="font-bold text-white text-sm">{t.name}</div>
                    <div className="text-xs text-purple-400">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING SECTION ── */}
      <section id="pricing" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Simple Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Invest in Your Engineering Career</h2>
          <p className="text-gray-400 text-base mt-3">
            Choose individual masterclasses or get complete access to everything.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          {/* Individual Masterclass */}
          <div className="glass-card rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Individual Course</h3>
              <p className="text-gray-400 text-xs mb-6">Pay once per course, keep forever</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white font-mono">₹499+</span>
                <span className="text-gray-400 text-xs ml-2">/ one-time</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                {["Single course lifetime access", "Full source code & starter kits", "Course completion certificate", "Discord community support", "Mobile & desktop streaming"].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCheck className="text-emerald-400 text-xs flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/courses"
              className="w-full py-3.5 text-center rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition"
            >
              Browse Masterclasses
            </Link>
          </div>

          {/* Pro All-Access (Featured Glow) */}
          <div className="glass-card rounded-3xl p-8 border-2 border-purple-500/50 shadow-glow relative flex flex-col justify-between bg-gradient-to-b from-[#181829] to-[#0f0f18] scale-105">
            <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 gradient-bg px-4 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider shadow-md">
              Most Popular
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Pro All-Access</h3>
              <p className="text-purple-300 text-xs mb-6">Unlimited access to all courses & tracks</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white font-mono">₹999</span>
                <span className="text-gray-400 text-xs ml-2">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-200 mb-8">
                {[
                  "Access to ALL 50+ masterclasses",
                  "All current & future career tracks",
                  "Priority code review & 1-on-1 Q&A",
                  "Verified professional certificates",
                  "Weekly live coding workshops",
                  "Resume & portfolio reviews",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCheck className="text-purple-400 text-xs flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <Link
              to="/signup"
              className="w-full py-3.5 text-center rounded-xl gradient-bg hover:opacity-95 text-white font-bold text-sm shadow-glow transition"
            >
              Start Free 7-Day Trial
            </Link>
          </div>

          {/* Team / Enterprise */}
          <div className="glass-card rounded-3xl p-8 border border-white/5 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Team Enterprise</h3>
              <p className="text-gray-400 text-xs mb-6">For engineering teams & startups</p>
              <div className="mb-6">
                <span className="text-4xl font-black text-white font-mono">₹4,999</span>
                <span className="text-gray-400 text-xs ml-2">/ month</span>
              </div>
              <ul className="space-y-3 text-sm text-gray-300 mb-8">
                {[
                  "Everything in Pro plan",
                  "Up to 10 team member seats",
                  "Admin dashboard & analytics",
                  "Customized team learning paths",
                  "Dedicated success manager",
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <FaCheck className="text-emerald-400 text-xs flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <a
              href="mailto:support@courseship.com"
              className="w-full py-3.5 text-center rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition"
            >
              Contact Enterprise Sales
            </a>
          </div>
        </div>
      </section>

      {/* ── FAQ ACCORDION SECTION ── */}
      <section id="faq" className="py-24 bg-[#0d0d15] border-t border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-block px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-3">
              Got Questions?
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white">Frequently Asked Questions</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl border border-white/5 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  className="w-full p-6 text-left flex justify-between items-center gap-4 hover:bg-white/5 transition"
                >
                  <span className="font-semibold text-white text-base sm:text-lg">{faq.q}</span>
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-purple-400 flex-shrink-0">
                    {activeFaq === idx ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                  </div>
                </button>
                {activeFaq === idx && (
                  <div className="px-6 pb-6 pt-2 text-sm text-gray-400 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA BANNER ── */}
      <section className="py-24 relative overflow-hidden">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="glass-card rounded-3xl p-12 sm:p-16 border border-purple-500/30 shadow-glow-lg relative overflow-hidden bg-gradient-to-r from-purple-900/40 via-[#13131f] to-indigo-900/40">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold uppercase tracking-wider mb-6">
              <HiSparkles /> Start Learning Today
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white mb-6 tracking-tight leading-tight">
              Ready to Accelerate Your <br />
              <span className="gradient-text">Engineering Journey?</span>
            </h2>
            <p className="text-base sm:text-lg text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              Join over 50,000 developers building practical skills and launching high-paying tech careers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/signup"
                className="btn-primary px-8 py-4 rounded-2xl text-base font-bold shadow-glow"
              >
                Create Free Account
              </Link>
              <Link
                to="/courses"
                className="btn-secondary px-8 py-4 rounded-2xl text-base font-bold"
              >
                Explore All Courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#07070a] border-t border-white/5 pt-16 pb-12 text-gray-400 text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 mb-12">
            {/* Brand Column */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-glow">
                  <img src={logo} alt="Logo" className="w-6 h-6 rounded-md object-cover" />
                </div>
                <span className="text-2xl font-bold text-white tracking-tight">CourseShip</span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
                Empowering developers worldwide with world-class, project-centric engineering education. Build, learn, and excel.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 flex items-center justify-center transition">
                  <FaTwitter size={15} />
                </a>
                <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 flex items-center justify-center transition">
                  <FaGithub size={15} />
                </a>
                <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 flex items-center justify-center transition">
                  <FaYoutube size={15} />
                </a>
                <a href="#" className="w-9 h-9 rounded-xl bg-white/5 hover:bg-purple-500/20 hover:text-purple-400 flex items-center justify-center transition">
                  <FaDiscord size={15} />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Learn</h4>
              <ul className="space-y-2.5">
                <li><Link to="/courses" className="hover:text-purple-400 transition">All Courses</Link></li>
                <li><a href="#tracks" className="hover:text-purple-400 transition">Career Tracks</a></li>
                <li><a href="#features" className="hover:text-purple-400 transition">Platform Features</a></li>
                <li><a href="#pricing" className="hover:text-purple-400 transition">Pricing Plans</a></li>
              </ul>
            </div>

            {/* Account & Resources */}
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Account</h4>
              <ul className="space-y-2.5">
                <li><Link to="/login" className="hover:text-purple-400 transition">Student Login</Link></li>
                <li><Link to="/signup" className="hover:text-purple-400 transition">Create Account</Link></li>
                <li><Link to="/purchases" className="hover:text-purple-400 transition">My Purchases</Link></li>
                <li><Link to="/admin/login" className="hover:text-purple-400 transition">Admin Portal</Link></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h4 className="font-bold text-white text-sm uppercase tracking-wider mb-4">Legal</h4>
              <ul className="space-y-2.5">
                <li><a href="#" className="hover:text-purple-400 transition">Terms of Service</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Refund Policy</a></li>
                <li><a href="#" className="hover:text-purple-400 transition">Cookie Settings</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
            <p>&copy; {new Date().getFullYear()} CourseShip Technologies. All rights reserved.</p>
            <p className="flex items-center gap-1">
              Crafted with <span className="text-red-500">♥</span> for developers worldwide
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;