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
  FiTerminal,
} from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";

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
    if (!window.confirm("Are you sure you want to delete this track from registry permanently?")) {
      return;
    }
    setDeletingId(id);
    try {
      const response = await axios.delete(`${BACKEND_URL}/course/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      toast.success(response.data?.message || "Track removed from registry");
      setCourses((prev) => prev.filter((course) => course._id !== id));
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error deleting track");
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
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen font-sans selection:bg-cyan-400 selection:text-black p-4 sm:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="cyber-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="badge-cyber mb-1.5 font-mono text-[10px]">
              <FiTerminal size={11} />
              <span>REGISTRY // CATALOG MANAGEMENT</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display">
              MANAGE TRACK CATALOG
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Edit pricing metadata, update syllabus, and purge courses from registry.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              to="/admin/create-course"
              className="btn-cyber-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <FiPlusCircle size={13} />
              <span>MOUNT NEW TRACK</span>
            </Link>
            <Link
              to="/admin/dashboard"
              className="btn-cyber-outline text-xs px-3.5 py-2 flex items-center gap-1.5"
            >
              <FiArrowLeft size={12} />
              <span>DASHBOARD</span>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-3">
          <div className="relative w-full sm:w-80 font-mono">
            <FiSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400" size={13} />
            <input
              type="text"
              placeholder="$ grep --catalog keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-lg bg-[#080c14] border border-[#162034] text-xs text-white placeholder:text-zinc-500 focus:border-cyan-500 focus:outline-none"
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
            // MOUNTED: {filteredCourses.length} OF {courses.length}
          </div>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((n) => (
              <div key={n} className="cyber-card h-72 animate-pulse p-4 space-y-3" />
            ))}
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="cyber-card p-14 text-center max-w-md mx-auto space-y-3 font-mono">
            <FiBookOpen size={32} className="text-zinc-500 mx-auto" />
            <h3 className="text-base font-bold text-white uppercase">// NO TRACKS FOUND</h3>
            <p className="text-xs text-zinc-400">
              {search ? "Grep returned 0 records." : "Catalog is empty. Mount your first track."}
            </p>
            <Link
              to="/admin/create-course"
              className="btn-cyber-primary text-xs px-4 py-2 inline-flex items-center gap-1.5"
            >
              <FiPlusCircle size={12} />
              <span>MOUNT TRACK</span>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCourses.map((course, idx) => (
              <div
                key={course._id}
                className="cyber-card-interactive flex flex-col justify-between group"
              >
                {/* Image */}
                <div className="relative h-40 overflow-hidden bg-[#04060a] border-b border-[#162034]">
                  <img
                    src={
                      course?.image?.url ||
                      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                    }
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
                    onError={(e) => {
                      e.target.src =
                        "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600";
                    }}
                  />
                  <span className="absolute top-2.5 left-2.5 badge-cyber text-[10px]">
                    NODE 0{idx + 1}
                  </span>
                  <span className="absolute top-2.5 right-2.5 badge-cyber-green text-[10px]">
                    LIVE
                  </span>
                </div>

                {/* Content */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-1">
                    <h3 className="font-display text-sm font-bold text-white group-hover:text-cyan-300 line-clamp-2 leading-snug">
                      {course.title}
                    </h3>
                    <p className="text-xs text-zinc-400 font-mono line-clamp-2 leading-relaxed">
                      {course.description}
                    </p>
                  </div>

                  <div className="pt-2.5 border-t border-[#162034] flex items-center justify-between font-mono">
                    <span className="text-sm font-bold text-cyan-300">
                      ₹{course.price}
                    </span>

                    <div className="flex items-center gap-1.5">
                      <Link
                        to={`/admin/update-course/${course._id}`}
                        className="btn-cyber-outline text-xs py-1.5 px-2.5 flex items-center gap-1"
                      >
                        <FiEdit size={11} />
                        <span>EDIT</span>
                      </Link>
                      <button
                        onClick={() => handleDelete(course._id)}
                        disabled={deletingId === course._id}
                        className="p-1.5 rounded border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 text-xs transition"
                        title="Purge Track"
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
