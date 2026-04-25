import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  if (!token) {
    toast.error("Please login to admin");
    navigate("/admin/login");
  }

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // delete courses code
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response.data.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-50">
         <p className="text-xl text-gray-500 font-medium">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen p-8 relative">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Our Courses</h1>
            <p className="text-gray-600 mt-1">Manage and organize all your platform courses</p>
          </div>
          <Link
            className="mt-4 md:mt-0 flex items-center bg-white border-2 border-gray-300 text-gray-700 py-2 px-6 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition"
            to={"/admin/dashboard"}
          >
            <i className="fas fa-arrow-left mr-2"></i> Back to Dashboard
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <i className="fas fa-book-open text-2xl text-gray-400"></i>
            </div>
            <p className="text-gray-500 font-medium text-lg">No courses found. Time to create some!</p>
            <Link to="/admin/create-course" className="inline-block mt-4 gradient-bg text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition">
              Create First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <div key={course._id} className="bg-white shadow-lg rounded-2xl p-5 border border-gray-100 card-hover flex flex-col">
                <div className="relative mb-4">
                  <img
                    src={course?.image?.url}
                    alt={course.title}
                    className="h-48 w-full object-cover rounded-xl"
                  />
                  <div className="absolute top-3 right-3 bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    Published
                  </div>
                </div>
                
                <div className="flex-1 flex flex-col">
                  <h2 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2">
                    {course.title}
                  </h2>
                  <p className="text-gray-600 text-sm flex-1 mb-4">
                    {course.description.length > 100
                      ? `${course.description.slice(0, 100)}...`
                      : course.description}
                  </p>
                  
                  <div className="flex justify-between items-center bg-gray-50 p-3 rounded-lg mb-4">
                    <div className="font-bold text-gray-900 text-lg">
                      ₹{course.price}
                    </div>
                    <div className="text-gray-500 line-through text-sm">
                      ₹{course.price * 2}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mt-auto">
                    <Link
                      to={`/admin/update-course/${course._id}`}
                      className="bg-purple-100 text-purple-700 py-2 px-4 rounded-lg font-semibold hover:bg-purple-200 transition text-center flex items-center justify-center"
                    >
                      <i className="fas fa-edit mr-2"></i> Edit
                    </Link>
                    <button
                      onClick={() => handleDelete(course._id)}
                      className="bg-red-50 text-red-600 py-2 px-4 rounded-lg font-semibold hover:bg-red-100 transition flex items-center justify-center"
                    >
                      <i className="fas fa-trash-alt mr-2"></i> Delete
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
