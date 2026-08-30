import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  FiEdit,
  FiUploadCloud,
  FiArrowLeft,
  FiCheckCircle,
  FiTerminal,
} from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";

function UpdateCourse() {
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [initialLoading, setInitialLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const { data } = await axios.get(`${BACKEND_URL}/course/${id}`, {
          withCredentials: true,
        });
        if (data?.course) {
          setTitle(data.course.title || "");
          setDescription(data.course.description || "");
          setPrice(data.course.price || "");
          setImage(data.course.image?.url || "");
          setImagePreview(data.course.image?.url || "");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to fetch track data from registry");
      } finally {
        setInitialLoading(false);
      }
    };
    fetchCourseData();
  }, [id]);

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleUpdateCourse = async (e) => {
    e.preventDefault();
    const admin = JSON.parse(localStorage.getItem("admin") || "null");
    const token = admin?.token;
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
      return;
    }

    setUpdating(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    if (image && typeof image !== "string") {
      formData.append("image", image);
    }

    try {
      const response = await axios.put(
        `${BACKEND_URL}/course/update/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data?.message || "Track updated in registry successfully!");
      navigate("/admin/our-courses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Error updating track");
    } finally {
      setUpdating(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex items-center justify-center font-mono">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
          <p className="text-cyan-400 text-xs">// PULLING TRACK BUFFER...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen font-mono selection:bg-cyan-400 selection:text-black p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="cyber-card p-5 sm:p-6 flex items-center justify-between gap-4">
          <div>
            <div className="badge-cyber mb-1 text-[10px]">
              <FiTerminal size={11} />
              <span>REGISTRY BUFFER // PATCH</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display">
              UPDATE TRACK MATRIX
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Modify curriculum parameters, pricing, or artwork buffer.
            </p>
          </div>

          <Link
            to="/admin/our-courses"
            className="btn-cyber-outline text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            <FiArrowLeft size={12} />
            <span>CATALOG</span>
          </Link>
        </div>

        {/* Form */}
        <div className="cyber-card p-6 sm:p-8">
          <form onSubmit={handleUpdateCourse} className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase text-zinc-300">// TRACK TITLE</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080c14] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase text-zinc-300">// DESCRIPTION & SYLLABUS</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full p-3 rounded-lg bg-[#080c14] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none resize-y min-h-[100px]"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-[11px] uppercase text-zinc-300">// PRICE (INR ₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-xs">₹</span>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min={0}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-[#080c14] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Thumbnail Preview and Upload */}
            <div className="space-y-1 pt-1">
              <label className="text-[11px] uppercase text-zinc-300">// COVER ARTWORK BUFFER</label>

              <div className="border border-dashed border-[#1c2a45] rounded-xl p-5 text-center hover:border-cyan-500/50 transition-colors bg-[#080c14]">
                <input
                  type="file"
                  onChange={changePhotoHandler}
                  className="hidden"
                  id="course-image-update"
                  accept="image/*"
                />
                <label htmlFor="course-image-update" className="cursor-pointer block">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded object-contain border border-[#162034]"
                      />
                      <div className="text-xs font-mono text-cyan-400 flex items-center justify-center gap-1">
                        <FiCheckCircle size={12} /> CLICK TO REPLACE IMAGE BUFFER
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-[#0c121e] border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg mx-auto shadow-neon-cyan">
                        <FiUploadCloud />
                      </div>
                      <div className="text-xs font-semibold text-white uppercase font-display">
                        Click to select new image
                      </div>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-[#162034] flex items-center justify-end gap-2.5 font-mono">
              <button
                type="button"
                onClick={() => navigate("/admin/our-courses")}
                className="btn-cyber-outline text-xs px-4 py-2"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={updating}
                className="btn-cyber-primary text-xs px-5 py-2 flex items-center gap-1.5"
              >
                {updating ? (
                  <span>PATCHING BUFFER...</span>
                ) : (
                  <>
                    <FiEdit size={13} />
                    <span>SAVE PATCH</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateCourse;
