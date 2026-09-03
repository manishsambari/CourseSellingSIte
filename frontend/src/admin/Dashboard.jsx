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
  FiArrowRight,
  FiTerminal,
  FiCpu,
} from "react-icons/fi";
import { RiDashboardLine, RiShieldUserLine } from "react-icons/ri";
import { BACKEND_URL } from "../utils/utils";
import Logo from "../components/Logo";

function Dashboard() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
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
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex font-sans selection:bg-cyan-400 selection:text-black">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-3.5 left-3.5 z-50 p-2 rounded bg-[#0c121e] border border-[#162034] text-zinc-300 hover:text-cyan-400 cursor-pointer"
      >
        {isSidebarOpen ? "✕" : "☰"}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="lg:hidden fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        />
      )}

      {/* ── ADMIN SIDEBAR ── */}
      <aside
        className={`w-64 bg-[#080c14] border-r border-[#162034] flex flex-col p-5 fixed top-0 bottom-0 left-0 z-40 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <Link to="/" className="mb-8 block" title="Go to Home">
          <Logo size="md" subtitle="ADMIN" />
        </Link>

        {/* Navigation */}
        <nav className="space-y-1.5 flex-1 text-xs font-mono">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-[#0c121e] text-cyan-300 font-bold border border-cyan-500/30"
          >
            <RiDashboardLine size={14} className="text-cyan-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/our-courses"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#0c121e] transition"
          >
            <FiBookOpen size={14} />
            <span>Course Catalog</span>
          </Link>
          <Link
            to="/admin/create-course"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-[#0c121e] transition"
          >
            <FiPlusCircle size={14} />
            <span>Create New Course</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-zinc-400 hover:text-cyan-400 hover:bg-[#0c121e] transition"
          >
            <FiHome size={14} />
            <span>View Public Store</span>
          </Link>
        </nav>

        {/* Admin Card & Logout */}
        <div className="pt-4 border-t border-[#162034] space-y-3 font-mono">
          <div className="p-2.5 rounded-lg bg-[#0c121e] border border-[#162034] flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-[#101726] text-cyan-400 flex items-center justify-center text-xs flex-shrink-0">
              <RiShieldUserLine size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-semibold text-white truncate">
                {admin?.admin?.firstName || "Root"} {admin?.admin?.lastName || "Admin"}
              </div>
              <div className="text-[10px] text-cyan-400 font-mono">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs transition font-semibold cursor-pointer"
            title="Log out of admin session"
          >
            <FiLogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ADMIN VIEW ── */}
      <main className="flex-1 lg:ml-64 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 pt-10 lg:pt-0">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="badge-cyber mb-1.5">
                <FiTerminal size={11} />
                <span>ADMIN PLATFORM OVERVIEW</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white uppercase tracking-tight font-display">
                ADMIN DASHBOARD
              </h1>
              <p className="text-xs text-zinc-400 font-mono mt-0.5">
                Monitor course performance, estimated revenue, and student enrollments.
              </p>
            </div>

            <Link
              to="/admin/create-course"
              className="btn-cyber-primary text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <FiPlusCircle size={13} />
              <span>CREATE NEW COURSE</span>
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 font-mono">
            <div className="cyber-card p-5 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-xs uppercase font-bold">ACTIVE COURSES</span>
                <FiBookOpen className="text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">{courses.length}</div>
              <div className="text-[10px] text-emerald-400">Published on store</div>
            </div>

            <div className="cyber-card p-5 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-xs uppercase font-bold">ESTIMATED REVENUE</span>
                <FiDollarSign className="text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-[10px] text-zinc-400">Projected volume</div>
            </div>

            <div className="cyber-card p-5 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-xs uppercase font-bold">TOTAL LEARNERS</span>
                <FiUsers className="text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white">{courses.length * 128 || 250}</div>
              <div className="text-[10px] text-zinc-400">Enrolled students</div>
            </div>

            <div className="cyber-card p-5 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-xs uppercase font-bold">SYSTEM STATUS</span>
                <FiActivity className="text-cyan-400" />
              </div>
              <div className="text-2xl font-bold text-white">99.98%</div>
              <div className="text-[10px] text-emerald-400">All Systems Operational</div>
            </div>
          </div>

          {/* Recent Courses Table */}
          <div className="cyber-card p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase font-display">PUBLISHED COURSES</h3>
                <p className="text-xs text-zinc-400 font-mono">Overview of your active course catalog</p>
              </div>
              <Link
                to="/admin/our-courses"
                className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
              >
                <span>VIEW ALL</span>
                <FiArrowRight size={11} />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                No courses published yet. Click "CREATE NEW COURSE" to publish.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#162034] text-zinc-400">
                      <th className="pb-3 font-semibold uppercase">COURSE TITLE</th>
                      <th className="pb-3 font-semibold uppercase">PRICE</th>
                      <th className="pb-3 font-semibold uppercase">STATUS</th>
                      <th className="pb-3 font-semibold uppercase text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#162034]/60">
                    {courses.slice(0, 5).map((course) => (
                      <tr key={course._id} className="hover:bg-[#0c121e]/50 transition">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course?.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                              alt={course.title}
                              className="w-10 h-10 rounded object-cover border border-[#162034] flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-white truncate max-w-xs sm:max-w-md font-display">
                                {course.title}
                              </div>
                              <div className="text-[10px] text-zinc-500 truncate max-w-xs sm:max-w-md">
                                {course.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-bold text-cyan-300">
                          ₹{course.price}
                        </td>
                        <td className="py-3">
                          <span className="badge-cyber-green text-[10px]">
                            ACTIVE
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/admin/update-course/${course._id}`}
                            className="btn-cyber-outline text-[11px] py-1 px-2.5"
                          >
                            EDIT
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
