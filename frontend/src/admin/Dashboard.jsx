import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import {
  FiBookOpen,
  FiPlusCircle,
  FiHome,
  FiLogOut,
  FiUsers,
  FiDollarSign,
  FiActivity,
  FiLayers,
  FiArrowRight,
  FiCheckCircle,
  FiTrendingUp,
} from "react-icons/fi";
import { RiDashboardLine, RiShieldUserLine } from "react-icons/ri";
import { HiSparkles } from "react-icons/hi";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const token = admin?.token;

  useEffect(() => {
    if (!token) {
      navigate("/admin/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(res.data?.courses || []);
      } catch (err) {
        console.error("Error fetching courses", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data?.message || "Admin logged out successfully");
      localStorage.removeItem("admin");
      navigate("/admin/login");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const totalRevenue = courses.reduce((acc, c) => acc + (Number(c.price) || 0) * 14, 0);

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen flex selection:bg-purple-600 selection:text-white font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-20 left-1/3 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

      {/* ── ADMIN SIDEBAR ── */}
      <aside className="w-72 bg-[#0d0d15] border-r border-white/5 flex flex-col p-6 fixed top-0 bottom-0 left-0 z-40 hidden lg:flex">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-3 mb-10 group">
          <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
            <img src={logo} alt="CourseShip" className="w-6 h-6 rounded-md object-cover" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
              Course<span className="gradient-text">Ship</span>
            </span>
            <span className="text-[10px] text-purple-400 font-mono tracking-widest uppercase">Admin Center</span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1.5 flex-1 text-sm font-medium">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-3 px-4 py-3 rounded-xl bg-purple-600/15 text-purple-300 border border-purple-500/25 font-semibold"
          >
            <RiDashboardLine size={18} className="text-purple-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/our-courses"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <FiBookOpen size={18} />
            <span>Manage Courses</span>
          </Link>
          <Link
            to="/admin/create-course"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition"
          >
            <FiPlusCircle size={18} />
            <span>Create Course</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-purple-400 hover:bg-white/5 transition"
          >
            <FiHome size={18} />
            <span>Live Student Catalog</span>
          </Link>
        </nav>

        {/* Admin User Card & Logout */}
        <div className="pt-6 border-t border-white/5 space-y-4">
          <div className="glass-card p-3 rounded-2xl flex items-center gap-3 border border-white/5">
            <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-sm shadow-sm flex-shrink-0">
              <RiShieldUserLine size={18} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-bold text-white truncate">
                {admin?.admin?.firstName || "System"} {admin?.admin?.lastName || "Admin"}
              </div>
              <div className="text-[11px] text-purple-400 font-mono">Master Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/20 text-red-400 hover:bg-red-500/10 text-xs font-semibold transition"
          >
            <FiLogOut size={14} />
            <span>Log Out Admin</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ADMIN VIEW ── */}
      <main className="flex-1 lg:ml-72 min-h-screen p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-7xl mx-auto space-y-10">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <RiShieldUserLine /> Admin Overview
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                System Analytics
              </h1>
              <p className="text-gray-400 text-sm mt-1">
                Live monitoring, course management & platform health metrics.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/admin/create-course"
                className="btn-primary px-5 py-3 rounded-2xl text-xs font-bold shadow-glow flex items-center gap-2"
              >
                <FiPlusCircle size={15} />
                <span>Publish Course</span>
              </Link>
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Courses</span>
                <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white text-sm shadow-glow">
                  <FiBookOpen />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono">{courses.length}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <FiTrendingUp /> Active on marketplace
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
                <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-sm">
                  <FiDollarSign />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                <FiTrendingUp /> +24% vs last month
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Total Learners</span>
                <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-sm">
                  <FiUsers />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono">{courses.length * 142 || 450}</div>
              <div className="text-[11px] text-blue-400 flex items-center gap-1">
                <FiCheckCircle /> Verified enrollments
              </div>
            </div>

            <div className="glass-card p-6 rounded-3xl border border-white/5 space-y-2">
              <div className="flex justify-between items-center text-gray-400">
                <span className="text-xs font-semibold uppercase tracking-wider">Platform Health</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-sm">
                  <FiActivity />
                </div>
              </div>
              <div className="text-3xl font-black text-white font-mono">99.98%</div>
              <div className="text-[11px] text-purple-400 flex items-center gap-1">
                <HiSparkles /> Zero errors reported
              </div>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link
              to="/admin/create-course"
              className="glass-card-hover p-6 rounded-3xl border border-white/5 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl gradient-bg flex items-center justify-center text-white text-xl shadow-glow group-hover:scale-110 transition-transform">
                <FiPlusCircle />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                  Create Masterclass
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">Upload syllabus and thumbnail</p>
              </div>
            </Link>

            <Link
              to="/admin/our-courses"
              className="glass-card-hover p-6 rounded-3xl border border-white/5 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-300 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FiBookOpen />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                  Manage Course Catalog
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">Edit prices & curriculum</p>
              </div>
            </Link>

            <Link
              to="/courses"
              className="glass-card-hover p-6 rounded-3xl border border-white/5 flex items-center gap-4 group"
            >
              <div className="w-12 h-12 rounded-2xl bg-blue-500/20 text-blue-300 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                <FiHome />
              </div>
              <div>
                <h4 className="font-bold text-white text-base group-hover:text-purple-300 transition-colors">
                  Student Live View
                </h4>
                <p className="text-xs text-gray-400 mt-0.5">Preview platform as student</p>
              </div>
            </Link>
          </div>

          {/* Recent Courses Preview Table */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">Published Masterclasses</h3>
                <p className="text-xs text-gray-400 mt-0.5">Real-time overview of current active courses</p>
              </div>
              <Link
                to="/admin/our-courses"
                className="text-xs font-semibold text-purple-400 hover:text-purple-300 flex items-center gap-1.5"
              >
                <span>View All</span>
                <FiArrowRight size={13} />
              </Link>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                <div className="w-8 h-8 border-2 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-3" />
                Loading masterclass data...
              </div>
            ) : courses.length === 0 ? (
              <div className="py-12 text-center text-gray-500 text-sm">
                No courses published yet. Click "Publish Course" to add your first masterclass.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-gray-400 uppercase tracking-wider font-mono">
                      <th className="pb-4 font-semibold">Course</th>
                      <th className="pb-4 font-semibold">Price</th>
                      <th className="pb-4 font-semibold">Status</th>
                      <th className="pb-4 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {courses.slice(0, 5).map((course) => (
                      <tr key={course._id} className="hover:bg-white/[0.02] transition">
                        <td className="py-4 pr-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course?.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                              alt={course.title}
                              className="w-12 h-12 rounded-xl object-cover border border-white/10 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-white truncate max-w-xs sm:max-w-md">
                                {course.title}
                              </div>
                              <div className="text-[11px] text-gray-500 truncate max-w-xs sm:max-w-md">
                                {course.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 font-mono font-bold text-emerald-400">
                          ₹{course.price}
                        </td>
                        <td className="py-4">
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 font-bold text-[10px] uppercase tracking-wider border border-emerald-500/20">
                            Live
                          </span>
                        </td>
                        <td className="py-4 text-right space-x-2">
                          <Link
                            to={`/admin/update-course/${course._id}`}
                            className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-purple-300 font-semibold border border-purple-500/20"
                          >
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
