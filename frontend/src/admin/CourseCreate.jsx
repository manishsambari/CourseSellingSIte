import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlusCircle,
  FiUploadCloud,
  FiArrowLeft,
  FiCheckCircle,
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
      toast.error("Please upload a course thumbnail image");
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
      toast.error(error.response?.data?.errors || "Error creating course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen font-sans selection:bg-indigo-600 selection:text-white p-4 sm:p-8">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="card-surface p-5 sm:p-6 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Create New Course
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Publish a new technical course track with curriculum details.
            </p>
          </div>

          <Link
            to="/admin/our-courses"
            className="btn-secondary text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            <FiArrowLeft size={12} />
            <span>Catalog</span>
          </Link>
        </div>

        {/* Form */}
        <div className="card-surface p-6 sm:p-8">
          <form onSubmit={handleCreateCourse} className="space-y-4">
            {/* Title */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Course Title</label>
              <input
                type="text"
                placeholder="e.g. Full-Stack Next.js 15 & AI Engineering Masterclass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Description & Syllabus</label>
              <textarea
                placeholder="Describe what students will build, technologies used, prerequisites, and learning outcomes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full p-3 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none resize-y min-h-[100px]"
              />
            </div>

            {/* Price */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-300">Price (INR ₹)</label>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 font-mono text-xs">₹</span>
                <input
                  type="number"
                  placeholder="999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min={0}
                  className="w-full pl-8 pr-3.5 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs text-white placeholder:text-zinc-500 focus:border-indigo-500 focus:outline-none font-mono"
                />
              </div>
            </div>

            {/* Image Upload Dropzone */}
            <div className="space-y-1 pt-1">
              <label className="text-xs font-medium text-zinc-300">Course Thumbnail Artwork</label>

              <div className="border border-dashed border-zinc-700 rounded-xl p-5 text-center hover:border-zinc-500 transition-colors bg-zinc-900/40">
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
                        className="mx-auto max-h-48 rounded-lg object-contain border border-zinc-800"
                      />
                      <div className="text-xs font-medium text-indigo-400 flex items-center justify-center gap-1">
                        <FiCheckCircle size={12} /> Click to replace image
                      </div>
                    </div>
                  ) : (
                    <div className="py-6 space-y-2">
                      <div className="w-10 h-10 rounded-lg bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 text-lg mx-auto">
                        <FiUploadCloud />
                      </div>
                      <div className="text-xs font-medium text-zinc-200">
                        Click to upload course image
                      </div>
                      <p className="text-[11px] text-zinc-500">
                        16:9 ratio recommended (PNG, JPG, WebP)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="pt-3 border-t border-zinc-800 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => navigate("/admin/our-courses")}
                className="btn-secondary text-xs px-4 py-2"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-xs px-5 py-2 flex items-center gap-1.5"
              >
                {loading ? (
                  <span>Publishing...</span>
                ) : (
                  <>
                    <FiPlusCircle size={13} />
                    <span>Publish Course</span>
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
