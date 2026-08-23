import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import {
  FiPlusCircle,
  FiUploadCloud,
  FiArrowLeft,
  FiDollarSign,
  FiType,
  FiFileText,
  FiImage,
  FiX,
  FiCheckCircle,
} from "react-icons/fi";
import { RiShieldUserLine } from "react-icons/ri";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

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
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen selection:bg-purple-600 selection:text-white font-sans p-4 sm:p-8 lg:p-12">
      {/* Ambient background glows */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-20 left-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header Bar */}
        <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <RiShieldUserLine /> Admin Studio
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Create New Masterclass
            </h1>
            <p className="text-gray-400 text-sm mt-1">
              Publish a new technical course with syllabus & curriculum metadata.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/admin/our-courses"
              className="btn-secondary px-5 py-3 rounded-2xl text-xs font-semibold flex items-center gap-2"
            >
              <FiArrowLeft size={13} />
              <span>Back to Catalog</span>
            </Link>
          </div>
        </div>

        {/* Creation Form Card */}
        <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
          <form onSubmit={handleCreateCourse} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <FiType /> Course Title
              </label>
              <input
                type="text"
                placeholder="e.g. Next.js 15 & AI Engineering Masterclass"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-3.5 rounded-2xl glass-input text-sm text-white placeholder:text-gray-500 outline-none"
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <FiFileText /> Curriculum & Course Description
              </label>
              <textarea
                placeholder="Describe what students will build, technologies used, prerequisites, and learning outcomes..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={4}
                className="w-full p-4 rounded-2xl glass-input text-sm text-white placeholder:text-gray-500 outline-none resize-y min-h-[120px]"
              />
            </div>

            {/* Price */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <FiDollarSign /> Course Price (INR ₹)
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-mono font-bold">₹</span>
                <input
                  type="number"
                  placeholder="999"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  required
                  min={0}
                  className="w-full pl-9 pr-4 py-3.5 rounded-2xl glass-input text-sm text-white placeholder:text-gray-500 outline-none font-mono"
                />
              </div>
            </div>

            {/* Thumbnail Upload Dropzone */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-300 flex items-center gap-1.5">
                <FiImage /> Course Cover Artwork
              </label>

              <div className="relative border-2 border-dashed border-white/10 rounded-2xl p-6 text-center hover:border-purple-500/50 transition-colors group bg-white/[0.02]">
                <input
                  type="file"
                  onChange={changePhotoHandler}
                  className="hidden"
                  id="course-image-upload"
                  accept="image/*"
                />
                <label htmlFor="course-image-upload" className="cursor-pointer block">
                  {imagePreview ? (
                    <div className="space-y-4">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="mx-auto max-h-56 rounded-xl object-contain border border-white/10 shadow-lg"
                      />
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold">
                        <FiCheckCircle /> Click to change thumbnail
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 space-y-3">
                      <div className="w-14 h-14 rounded-2xl gradient-bg flex items-center justify-center text-white text-2xl mx-auto shadow-glow group-hover:scale-110 transition-transform">
                        <FiUploadCloud />
                      </div>
                      <div className="font-bold text-white text-sm">
                        Click to upload course artwork
                      </div>
                      <p className="text-xs text-gray-400">
                        High resolution recommended (16:9 aspect ratio, PNG, JPG, or WebP)
                      </p>
                    </div>
                  )}
                </label>
              </div>
            </div>

            {/* Submit Bar */}
            <div className="pt-4 border-t border-white/5 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => navigate("/admin/our-courses")}
                className="btn-secondary px-6 py-3.5 rounded-xl text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary px-8 py-3.5 rounded-xl text-xs font-bold shadow-glow flex items-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Publishing...</span>
                  </>
                ) : (
                  <>
                    <FiPlusCircle size={15} />
                    <span>Publish Masterclass</span>
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
