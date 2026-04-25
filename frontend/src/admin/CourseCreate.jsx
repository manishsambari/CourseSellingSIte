import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function CourseCreate() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [imagePreview, setImagePreview] = useState("");

  const navigate = useNavigate();

  const changePhotoHandler = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setImagePreview(reader.result);
      setImage(file);
    };
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("image", image);

    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = admin.token;
    if (!token) {
      navigate("/admin/login");
      return;
    }

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
      console.log(response.data);
      toast.success(response.data.message || "Course created successfully");
      navigate("/admin/our-courses");
      setTitle("");
      setPrice("");
      setImage("");
      setDescription("");
      setImagePreview("");
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.errors);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="blob w-96 h-96 bg-purple-400 top-0 -left-20"></div>
      
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative z-10">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-gray-100">
          <div>
            <h3 className="text-3xl font-bold text-gray-900">Create New Course</h3>
            <p className="text-gray-600 mt-2">Fill in the details below to publish a new course</p>
          </div>
          <button onClick={() => navigate("/admin/dashboard")} className="text-gray-500 hover:text-purple-600 transition">
             <i className="fas fa-times text-2xl"></i>
          </button>
        </div>

        <form onSubmit={handleCreateCourse} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Course Title</label>
            <input
              type="text"
              placeholder="e.g. Advanced React Masterclass"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-gray-50"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Description</label>
            <textarea
              placeholder="Detailed description of what students will learn..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-gray-50 min-h-[120px] resize-y"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">Price (₹)</label>
            <div className="relative">
              <span className="absolute left-4 top-3 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                placeholder="0.00"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all bg-gray-50"
                required
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">Course Thumbnail</label>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-purple-500 transition-colors bg-gray-50 group">
              <input
                type="file"
                onChange={changePhotoHandler}
                className="hidden"
                id="course-image"
                accept="image/*"
              />
              <label htmlFor="course-image" className="cursor-pointer block">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="mx-auto max-h-64 rounded-lg object-contain shadow-md"
                  />
                ) : (
                  <div className="py-8">
                    <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 group-hover:text-purple-500 mb-4 transition-colors"></i>
                    <p className="text-gray-600 font-medium">Click to upload or drag and drop</p>
                    <p className="text-gray-400 text-sm mt-2">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                  </div>
                )}
              </label>
            </div>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/admin/dashboard")}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-8 py-3 gradient-bg text-white rounded-lg font-semibold hover:opacity-90 transition shadow-md flex items-center"
            >
              <i className="fas fa-plus mr-2"></i> Publish Course
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CourseCreate;
