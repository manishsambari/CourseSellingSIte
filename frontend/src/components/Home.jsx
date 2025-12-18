import React, { useEffect, useState } from "react";
import logo from "../../public/logo.webp";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // token
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // fetch courses
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        console.log(response.data.courses);
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  // logout
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

  var settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800">
      <div className="text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6 backdrop-blur-sm bg-white/10 rounded-b-2xl">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              CourseShip
            </h1>
          </div>
          <div className="space-x-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="bg-transparent text-white px-4 py-2 border-2 border-cyan-400 rounded-full font-medium hover:bg-cyan-400 hover:text-black transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-6 py-2 rounded-full font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero section */}
        <section className="text-center py-20 px-6">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent">
                CourseShip
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              🚀 Navigate Your Learning Journey with Expert-Crafted Courses
            </p>
            <p className="text-lg text-gray-400 mb-12">
              Unlock your potential with cutting-edge skills and industry-leading expertise
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={"/courses"}
                className="bg-gradient-to-r from-cyan-400 to-blue-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center gap-2"
              >
                🎯 Explore Courses
              </Link>
              <Link
                to={"https://www.youtube.com/learncodingofficial"}
                className="bg-white/10 backdrop-blur-sm text-white px-8 py-4 rounded-full font-semibold text-lg border-2 border-white/20 hover:bg-white/20 transition-all duration-300 flex items-center gap-2"
              >
                📺 Watch Videos
              </Link>
            </div>
          </div>
        </section>
        {/* Courses Section */}
        <section className="px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Featured Courses
            </h2>
            <p className="text-gray-300 text-lg">Discover courses that will transform your career</p>
          </div>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/20 hover:border-cyan-400/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
                  <div className="relative">
                    <img
                      className="h-48 w-full object-cover"
                      src={course.image.url}
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2">
                      {course.title}
                    </h3>
                    <Link 
                      to={`/buy/${course._id}`} 
                      className="inline-block w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-white py-3 px-6 rounded-full font-semibold text-center hover:shadow-lg transform hover:scale-105 transition-all duration-300"
                    >
                      🚀 Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>

        {/* Footer */}
        <footer className="bg-black/30 backdrop-blur-sm border-t border-white/10 mt-20">
          <div className="px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                    CourseShip
                  </h1>
                </div>
                <p className="text-gray-400 mb-4">Navigate your learning journey</p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a href="#" className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors">
                    <FaFacebook className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-pink-600 rounded-full flex items-center justify-center hover:bg-pink-500 transition-colors">
                    <FaInstagram className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-300 transition-colors">
                    <FaTwitter className="text-white" />
                  </a>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Connect</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-cyan-400 cursor-pointer transition-colors">
                    📺 YouTube Channel
                  </li>
                  <li className="hover:text-cyan-400 cursor-pointer transition-colors">
                    💬 Telegram Community
                  </li>
                  <li className="hover:text-cyan-400 cursor-pointer transition-colors">
                    🐙 GitHub Repository
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-cyan-400">Legal</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-cyan-400 cursor-pointer transition-colors">
                    📋 Terms & Conditions
                  </li>
                  <li className="hover:text-cyan-400 cursor-pointer transition-colors">
                    🔒 Privacy Policy
                  </li>
                  <li className="hover:text-cyan-400 cursor-pointer transition-colors">
                    💰 Refund Policy
                  </li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-white/10 mt-8 pt-8 text-center">
              <p className="text-gray-400">
                © 2024 CourseShip. All rights reserved. Made with ❤️ for learners worldwide.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
