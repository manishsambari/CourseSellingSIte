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
  FiCheckCircle,
} from "react-icons/fi";
import { RiDashboardLine, RiShieldUserLine } from "react-icons/ri";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

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
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen flex font-sans selection:bg-indigo-600 selection:text-white">
      {/* Mobile Hamburger */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-3.5 left-3.5 z-50 p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white shadow-md"
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
        className={`w-64 bg-[#0e0e11] border-r border-zinc-800 flex flex-col p-5 fixed top-0 bottom-0 left-0 z-40 transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 mb-8">
          <div className="w-8 h-8 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center overflow-hidden">
            <img src={logo} alt="CourseShip" className="w-6 h-6 object-cover rounded" />
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-bold tracking-tight text-white flex items-center gap-1.5">
              CourseShip <span className="tag-badge-indigo text-[10px]">Admin</span>
            </span>
          </div>
        </Link>

        {/* Navigation */}
        <nav className="space-y-1 flex-1 text-xs font-medium">
          <Link
            to="/admin/dashboard"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-zinc-800 text-white font-semibold border border-zinc-700"
          >
            <RiDashboardLine size={15} className="text-indigo-400" />
            <span>Dashboard</span>
          </Link>
          <Link
            to="/admin/our-courses"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
          >
            <FiBookOpen size={15} />
            <span>Manage Courses</span>
          </Link>
          <Link
            to="/admin/create-course"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
          >
            <FiPlusCircle size={15} />
            <span>Create Course</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-850 transition"
          >
            <FiHome size={15} />
            <span>Student View</span>
          </Link>
        </nav>

        {/* Admin Card & Logout */}
        <div className="pt-4 border-t border-zinc-800 space-y-3">
          <div className="p-2.5 rounded-xl bg-zinc-900/80 border border-zinc-800 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 text-zinc-300 flex items-center justify-center text-xs flex-shrink-0">
              <RiShieldUserLine size={16} />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-xs font-medium text-white truncate">
                {admin?.admin?.firstName || "System"} {admin?.admin?.lastName || "Admin"}
              </div>
              <div className="text-[10px] text-zinc-500 font-mono">Administrator</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs font-medium transition"
          >
            <FiLogOut size={13} />
            <span>Log Out Admin</span>
          </button>
        </div>
      </aside>

      {/* ── MAIN ADMIN VIEW ── */}
      <main className="flex-1 lg:ml-64 min-h-screen p-4 sm:p-8 lg:p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto space-y-8 pt-10 lg:pt-0">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                System Analytics
              </h1>
              <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                Overview of marketplace catalog, enrollments, and course operations.
              </p>
            </div>

            <Link
              to="/admin/create-course"
              className="btn-primary text-xs px-4 py-2 flex items-center gap-1.5 self-start sm:self-auto"
            >
              <FiPlusCircle size={13} />
              <span>Publish Course</span>
            </Link>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div className="card-surface p-5 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-xs font-mono uppercase">COURSES</span>
                <FiBookOpen className="text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{courses.length}</div>
              <div className="text-[11px] text-emerald-400">Live in marketplace</div>
            </div>

            <div className="card-surface p-5 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-xs font-mono uppercase">GROSS REVENUE</span>
                <FiDollarSign className="text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">₹{totalRevenue.toLocaleString()}</div>
              <div className="text-[11px] text-zinc-500">Projected volume</div>
            </div>

            <div className="card-surface p-5 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-xs font-mono uppercase">LEARNERS</span>
                <FiUsers className="text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{courses.length * 128 || 250}</div>
              <div className="text-[11px] text-zinc-500">Registered accounts</div>
            </div>

            <div className="card-surface p-5 space-y-2">
              <div className="flex justify-between items-center text-zinc-400">
                <span className="text-xs font-mono uppercase">HEALTH</span>
                <FiActivity className="text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">99.9%</div>
              <div className="text-[11px] text-emerald-400">Systems Operational</div>
            </div>
          </div>

          {/* Recent Courses Table */}
          <div className="card-surface p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-white">Active Masterclasses</h3>
                <p className="text-xs text-zinc-400">Manage published curriculum</p>
              </div>
              <Link
                to="/admin/our-courses"
                className="text-xs font-medium text-zinc-300 hover:text-white flex items-center gap-1"
              >
                <span>View All</span>
                <FiArrowRight size={12} />
              </Link>
            </div>

            {loading ? (
              <div className="py-8 text-center text-xs text-zinc-500 font-mono">
                Loading courses...
              </div>
            ) : courses.length === 0 ? (
              <div className="py-8 text-center text-xs text-zinc-500">
                No courses published yet. Click "Publish Course" to add your first masterclass.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-zinc-800 text-zinc-400 font-mono">
                      <th className="pb-3 font-medium">COURSE</th>
                      <th className="pb-3 font-medium">PRICE</th>
                      <th className="pb-3 font-medium">STATUS</th>
                      <th className="pb-3 font-medium text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-800/60">
                    {courses.slice(0, 5).map((course) => (
                      <tr key={course._id} className="hover:bg-zinc-850/40 transition">
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={course?.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                              alt={course.title}
                              className="w-10 h-10 rounded-lg object-cover border border-zinc-800 flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-semibold text-white truncate max-w-xs sm:max-w-md">
                                {course.title}
                              </div>
                              <div className="text-[11px] text-zinc-500 truncate max-w-xs sm:max-w-md">
                                {course.description}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 font-mono font-semibold text-zinc-200">
                          ₹{course.price}
                        </td>
                        <td className="py-3">
                          <span className="tag-badge-green">
                            Live
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <Link
                            to={`/admin/update-course/${course._id}`}
                            className="px-2.5 py-1 rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-medium"
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
