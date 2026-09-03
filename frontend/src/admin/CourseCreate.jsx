import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlusCircle,
  FiUploadCloud,
  FiArrowLeft,
  FiCheckCircle,
  FiTerminal,
} from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    if (!image) {
      toast.error("Please upload a course thumbnail artwork");
      return;
    }

    const admin = JSON.parse(localStorage.getItem("admin") || "null");
    const token = admin?.token;
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    try {
      const response = await axios.post(
        `${BACKEND_URL}/course/create`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data?.message || "Course published successfully!");
      navigate("/admin/our-courses");
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.errors || "Error publishing course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen font-sans selection:bg-cyan-400 selection:text-black p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="cyber-card p-5 sm:p-6 flex items-center justify-between gap-4">
          <div>
            <div className="badge-cyber mb-1 text-[10px] font-mono">
              <FiTerminal size={11} />
              <span>ADMIN // COURSE CREATION</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight uppercase font-display">
              CREATE NEW COURSE
            </h1>
            <p className="text-xs text-zinc-400 font-mono mt-0.5">
              Publish a new engineering course with curriculum details and pricing.
            </p>
          </div>

          <Link
            to="/admin/our-courses"
            className="btn-cyber-outline text-xs px-3.5 py-2 flex items-center gap-1.5 font-mono cursor-pointer"
          >
            <FiArrowLeft size={12} />
            <span>CATALOG</span>
          </Link>
        </div>

        {/* Form */}
        <div className="cyber-card p-6 sm:p-8">
          <form onSubmit={handleCreateCourse} className="space-y-4">
            {/* Title */}
            <div className="space-y-1 font-mono">
              <label className="text-xs uppercase text-zinc-300 font-medium">COURSE TITLE</label>
              <input
                type="text"
                placeholder="e.g. Next.js 15, Rust & Distributed AI Agents"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-[#080c14] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-1 font-mono">
              <label className="text-xs uppercase text-zinc-300 font-medium">COURSE DESCRIPTION & SYLLABUS</label>
              <textarea
                placeholder="Describe curriculum, architectural patterns, stack components, and project details..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full p-3 rounded-lg bg-[#080c14] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none resize-y min-h-[100px]"
              />
            </div>

            {/* Price */}
            <div className="space-y-1 font-mono">
              <label className="text-xs uppercase text-zinc-300 font-medium">PRICE (INR ₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-cyan-400 font-mono text-xs">₹</span>
                <input
                  type="number"
                  placeholder="999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min={0}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-[#080c14] border border-[#162034] text-xs text-white placeholder:text-zinc-600 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Image Upload Dropzone */}
            <div className="space-y-1 pt-1 font-mono">
              <label className="text-xs uppercase text-zinc-300 font-medium">COURSE THUMBNAIL IMAGE</label>

              <div className="border border-dashed border-[#1c2a45] rounded-xl p-5 text-center hover:border-cyan-500/50 transition-colors bg-[#080c14]">
                <input
                  type="file"
                  onChange={changePhotoHandler}
                  className="hidden"
                  id="course-image-upload"
                  accept="image/*"
                />
                <label htmlFor="course-image-upload" className="cursor-pointer block">
                  {imagePreview ? (
                    <div className="space-y-3">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-48 rounded object-contain border border-[#162034]"
                      />
                      <div className="text-xs font-mono text-cyan-400 flex items-center justify-center gap-1">
                        <FiCheckCircle size={12} /> Click to change image
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-[#0c121e] border border-cyan-500/30 flex items-center justify-center text-cyan-400 text-lg mx-auto shadow-neon-cyan">
                        <FiUploadCloud />
                      </div>
                      <div className="text-xs font-semibold text-white uppercase font-display">
                        Click to upload course image
                      </div>
                      <p className="text-[10px] text-zinc-500 font-mono">
                        16:9 ratio recommended (PNG, JPG, WebP)
                      </p>
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
                className="btn-cyber-outline text-xs px-4 py-2 cursor-pointer"
              >
                CANCEL
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-cyber-primary text-xs px-5 py-2 flex items-center gap-1.5 cursor-pointer"
              >
                {loading ? (
                  <span>Publishing Course...</span>
                ) : (
                  <>
                    <FiPlusCircle size={13} />
                    <span>PUBLISH COURSE</span>
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

export default CourseCreate;
