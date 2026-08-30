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
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

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
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen font-sans selection:bg-indigo-600 selection:text-white p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Bar */}
        <div className="card-surface p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Manage Course Catalog
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Edit pricing, update curriculums, and delete courses.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/create-course"
              className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <FiPlusCircle size={13} />
              <span>Create Course</span>
            </Link>
            <Link
              to="/admin/dashboard"
              className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <FiArrowLeft size={12} />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" size={14} />
            <input
              type="text"
              placeholder="Filter courses..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none"
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white"
              >
                <FiX size={14} />
              </button>
            )}
          </div>
          <div className="text-xs font-mono text-zinc-500">
            Showing {filteredCourses.length} of {courses.length} courses
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="card-surface h-72 animate-pulse p-4 space-y-3" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="card-surface p-14 text-center max-w-md mx-auto space-y-3">
            <FiBookOpen size={32} className="text-zinc-500 mx-auto" />
            <h3 className="text-base font-bold text-white">No courses found</h3>
            <p className="text-xs text-zinc-400">
              {search ? "No courses match your filter." : "Start by publishing your first course."}
            </p>
            <Link
              to="/admin/create-course"
              className="btn-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
            >
              <FiPlusCircle size={12} />
              <span>Create Course</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="card-surface-interactive overflow-hidden flex flex-col group justify-between"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-zinc-950 border-b border-zinc-800">
                  <img
                    src={
                      course?.image?.url ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600";
                    }}
                  />
                  <span className="absolute top-2.5 right-2.5 tag-badge-green text-[10px]">
                    Active
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-zinc-100 group-hover:text-white line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-zinc-800 flex items-center justify-between">
                    <span className="font-mono text-sm font-bold text-zinc-200">
                      ₹{course.price}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/admin/update-course/${course._id}`}
                        className="btn-secondary text-xs px-2.5 py-1.5 flex items-center gap-1"
                      >
                        <FiEdit size={11} />
                        <span>Edit</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id)}
                        disabled={deletingId === course._id}
                        className="p-1.5 rounded-lg border border-rose-500/20 text-rose-400 hover:bg-rose-500/10 text-xs transition"
                        title="Delete Course"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
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
