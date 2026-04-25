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
    <div className="bg-gray-50 min-h-screen relative overflow-hidden">
      <div className="blob w-96 h-96 bg-purple-400 top-20 -left-48"></div>
      <div className="blob w-96 h-96 bg-blue-400 bottom-20 -right-48" style={{animationDelay: '2s'}}></div>
      
      <div className="relative z-10 text-gray-900">
        {/* Header */}
        <header className="fixed w-full top-0 z-50 nav-blur border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-2">
                <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                  <img src={logo} alt="" className="w-7 h-7 rounded-full object-cover" />
                </div>
                <h1 className="text-2xl font-bold gradient-text">CourseShip</h1>
              </div>
              <div className="space-x-4 flex items-center">
                {isLoggedIn ? (
                  <button onClick={handleLogout} className="text-gray-700 hover:text-purple-600 transition font-medium px-4">Logout</button>
                ) : (
                  <>
                    <Link to={"/login"} className="hidden md:block text-gray-700 hover:text-purple-600 transition font-medium">Login</Link>
                    <Link to={"/signup"} className="gradient-bg text-white px-6 py-2 rounded-lg hover:opacity-90 transition font-medium">Get Started</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Main section */}
        <section className="relative pt-32 pb-20 overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-block mb-4 px-4 py-2 bg-purple-100 rounded-full">
              <span className="text-purple-600 font-semibold text-sm">🚀 #1 Learning Platform</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Master Skills for Your <span className="gradient-text">Dream Career</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 leading-relaxed">
              Sharpen your skills with courses crafted by experts. Join our community of learners today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to={"/courses"} className="gradient-bg text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition flex items-center justify-center space-x-2">
                <span>Explore courses</span>
              </Link>
              <Link to={"https://www.youtube.com/learncodingofficial"} className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-purple-600 transition flex items-center justify-center">
                Course videos
              </Link>
            </div>
          </div>
          <div className="relative floating hidden md:block">
            <img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop" alt="Learning" className="rounded-2xl shadow-2xl" />
          </div>
        </section>

        {/* Courses Section */}
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Courses</h2>
              <p className="text-xl text-gray-600">Explore our most loved courses by thousands of students</p>
            </div>
            <Slider className="" {...settings}>
              {courses.map((course) => (
                <div key={course._id} className="p-4">
                  <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 mx-2">
                    <div className="relative">
                      <img className="h-48 w-full object-cover" src={course.image.url} alt="" />
                    </div>
                    <div className="p-6 text-left">
                      <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">{course.title}</h2>
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                         <span><span className="font-bold text-gray-900 text-xl">₹{course.price}</span></span>
                      </div>
                      <Link to={`/buy/${course._id}`} className="block text-center gradient-bg text-white w-full py-2 px-4 rounded-lg hover:opacity-90 transition font-medium">
                        Enroll Now
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-gray-300 py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 mb-8">
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                    <img src={logo} alt="" className="w-6 h-6 rounded-full object-cover" />
                  </div>
                  <span className="text-xl font-bold text-white">CourseShip</span>
                </div>
                <p className="text-gray-400 mb-4">Empowering learners worldwide to achieve their dreams through quality education.</p>
                <div className="flex space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition"><FaFacebook /></a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition"><FaInstagram /></a>
                  <a href="#" className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-purple-600 transition"><FaTwitter /></a>
                </div>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Connect</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-purple-400 transition">Youtube - Learn Coding</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition">Telegram - Learn Coding</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition">Github - Learn Coding</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold text-white mb-4">Legal</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="hover:text-purple-400 transition">Terms & Conditions</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition">Privacy Policy</a></li>
                  <li><a href="#" className="hover:text-purple-400 transition">Refund & Cancellation</a></li>
                </ul>
              </div>
            </div>
            <div className="border-t border-gray-800 pt-8 text-center">
              <p className="text-gray-400">&copy; 2024 CourseShip. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
