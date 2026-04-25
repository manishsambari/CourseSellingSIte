import React, { useState, useEffect } from "react";
import axios from "axios"; // Import axios for API call
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi"; // Import menu and close icons
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to toggle sidebar

  console.log("courses: ", courses);

  // Check token
  useEffect(() => {
    const token = localStorage.getItem("user");
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses || []);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        setCourses([]);
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Logout
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  // Toggle sidebar for mobile devices
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      {/* Hamburger menu button for mobile */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 text-3xl text-gray-800"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX /> : <HiMenu />} {/* Toggle menu icon */}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen bg-white border-r border-gray-200 w-64 p-5 transform z-20 transition-transform duration-300 ease-in-out ${
          isSidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full"
        } md:translate-x-0 md:static md:shadow-none`}
      >
        <div className="flex items-center mb-10 mt-10 md:mt-0 space-x-3">
          <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
            <img src={logo} alt="Profile" className="rounded-md h-8 w-8 object-cover" />
          </div>
          <span className="text-xl font-bold gradient-text">CourseShip</span>
        </div>
        <nav>
          <ul className="space-y-2">
            <li>
              <a href="/" className="flex items-center p-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium">
                <RiHome2Fill className="mr-3 text-xl" /> Home
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 bg-purple-50 text-purple-600 rounded-lg transition font-medium">
                <FaDiscourse className="mr-3 text-xl" /> Courses
              </a>
            </li>
            <li>
              <a href="/purchases" className="flex items-center p-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium">
                <FaDownload className="mr-3 text-xl" /> Purchases
              </a>
            </li>
            <li>
              <a href="#" className="flex items-center p-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium">
                <IoMdSettings className="mr-3 text-xl" /> Settings
              </a>
            </li>
            <li className="pt-4 mt-4 border-t border-gray-100">
              {isLoggedIn ? (
                <Link to={"/"}
                  className="flex items-center p-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                  onClick={handleLogout}
                >
                  <IoLogOut className="mr-3 text-xl" /> Logout
                </Link>
              ) : (
                <Link to={"/login"} className="flex items-center p-3 text-gray-700 hover:bg-purple-50 hover:text-purple-600 rounded-lg transition font-medium">
                  <IoLogIn className="mr-3 text-xl" /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 w-full p-4 sm:p-8 md:p-10 relative">
        <header className="flex justify-between items-center mb-10 bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-2xl font-bold text-gray-900 ml-10 md:ml-0">All Courses</h1>
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center bg-gray-50 rounded-full border border-gray-200 px-4 py-2 focus-within:ring-2 focus-within:ring-purple-200 focus-within:border-purple-400 transition">
              <FiSearch className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search courses..."
                className="bg-transparent focus:outline-none w-48 lg:w-64 text-sm"
              />
            </div>
            <FaCircleUser className="text-4xl text-purple-600 cursor-pointer hover:opacity-80 transition" />
          </div>
        </header>

        {/* Vertically Scrollable Courses Section */}
        <div className="overflow-y-auto h-[75vh] pb-10 pr-2">
          {loading ? (
            <p className="text-center text-gray-500 font-medium">Loading courses...</p>
          ) : courses.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <FaDiscourse className="text-2xl text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No courses posted yet by admin</p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 flex flex-col"
                >
                  <div className="relative">
                    <img
                      src={course.image.url}
                      alt={course.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 right-4 bg-purple-400 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Featured
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{course.title}</h3>
                    <p className="text-gray-600 mb-4 text-sm flex-1">
                      {course.description.length > 100
                        ? `${course.description.slice(0, 100)}...`
                        : course.description}
                    </p>
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <span className="text-2xl font-bold text-gray-900">₹{course.price}</span>
                        <span className="text-gray-500 line-through ml-2 text-sm">₹5999</span>
                      </div>
                      <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs font-semibold">
                        Discount
                      </span>
                    </div>

                    {/* Buy page */}
                    <Link
                      to={`/buy/${course._id}`} // Pass courseId in URL
                      className="mt-auto gradient-bg text-white text-center w-full py-3 rounded-lg font-semibold hover:opacity-90 transition block"
                    >
                      Buy Now
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Courses;