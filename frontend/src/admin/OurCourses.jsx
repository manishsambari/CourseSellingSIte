import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FiBookOpen,
  FiPlusCircle,
  FiEdit,
  FiTrash2,
  FiArrowLeft,
  FiSearch,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { RiShieldUserLine } from "react-icons/ri";
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
        <div className="pt-4 border-t border-white/5 flex justify-between items-center mt-auto">
          <div className="skeleton-box h-8 w-20 rounded-md" />
          <div className="skeleton-box h-9 w-24 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  const token = admin?.token;

  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
    }
  }, [token, navigate]);

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

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course permanently?")) {
      return;
    }
    setDeletingId(id);
    try {
      const response = await axios.delete(`${BACKEND_URL}/course/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success(response.data?.message || "Course deleted successfully");
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error deleting course");
    } finally {
      setDeletingId(null);
    }
  };

  const filteredCourses = useMemo(() => {
    if (!search.trim()) return courses;
    const q = search.toLowerCase();
    return courses.filter(
      (c) =>
        c.title?.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q)
    );
  }, [courses, search]);

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen selection:bg-purple-600 selection:text-white font-sans p-4 sm:p-8 lg:p-12">
      {/* Ambient background glows */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-20 left-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <RiShieldUserLine /> Admin Management
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Course Catalog
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Edit pricing, update curriculums, and manage published masterclasses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              to="/admin/create-course"
              className="btn-primary px-5 py-3 rounded-2xl text-xs font-bold shadow-glow flex items-center gap-2"
            >
              <FiPlusCircle size={15} />
              <span>Create New Course</span>
            </Link>
            <Link
              to="/admin/dashboard"
              className="btn-secondary px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2"
            >
              <FiArrowLeft size={13} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search published courses..."
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
          <div className="text-xs text-gray-400 font-mono">
            Showing <strong className="text-white">{filteredCourses.length}</strong> of{" "}
            <strong className="text-white">{courses.length}</strong> total courses
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="glass-card rounded-3xl p-16 text-center border border-white/5">
            <div className="w-16 h-16 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-4 text-2xl">
              <FiBookOpen />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">No courses found</h3>
            <p className="text-gray-400 text-sm max-w-md mx-auto mb-6">
              {search
                ? "No published courses match your search criteria."
                : "Your catalog is empty. Start by publishing your first course."}
            </p>
            <Link
              to="/admin/create-course"
              className="btn-primary px-6 py-3 rounded-2xl text-xs font-bold shadow-glow inline-flex items-center gap-2"
            >
              <FiPlusCircle size={14} />
              <span>Create Course Now</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="glass-card-hover rounded-3xl overflow-hidden flex flex-col group border border-white/5"
              >
                {/* Image Wrap */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={
                      course?.image?.url ||
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
                  <span className="absolute top-3 right-3 bg-emerald-500/90 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md flex items-center gap-1">
                    <FiCheckCircle size={10} /> Active
                  </span>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col">
                  <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors mb-1.5 line-clamp-2">
                    {course.title}
                  </h3>

                  <p className="text-xs text-gray-400 line-clamp-2 mb-4 flex-1">
                    {course.description || "Comprehensive technical course with code examples."}
                  </p>

                  <div className="flex justify-between items-baseline pt-3 border-t border-white/5 mb-4">
                    <span className="text-xs text-gray-500 font-medium">Pricing</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">
                      ₹{course.price}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to={`/admin/update-course/${course._id}`}
                      className="btn-secondary py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 text-purple-300 hover:border-purple-500/40"
                    >
                      <FiEdit size={12} />
                      <span>Edit</span>
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      disabled={deletingId === course._id}
                      className="py-2 px-3 rounded-xl text-xs font-semibold border border-red-500/20 text-red-400 hover:bg-red-500/10 flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                    >
                      <FiTrash2 size={12} />
                      <span>{deletingId === course._id ? "Deleting..." : "Delete"}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default OurCourses;
