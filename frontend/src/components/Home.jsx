import { useEffect, useState } from "react";
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
  const [courses, setCourses] = useState([]);  // jo courses backend se aayenge unko store karne ke liye aur frontend me dikhane ke liye
  const [isLoggedIn, setIsLoggedIn] = useState(false); // when user is logged in see logout button

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
    fetchCourses(); // yahape call hoga function
  }, []);



  // logout function when user clicks logout button
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

  // this is react slider code or slick
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
    <div className="min-h-screen bg-black font-sans">
      <div className="text-white container mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between p-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">C</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white">
              Course<span className="text-emerald-400">Ship</span>
            </h1>
          </div>
          <div className="space-x-3">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to={"/login"}
                  className="text-gray-300 hover:text-white px-4 py-2 border border-gray-700 hover:border-gray-600 rounded-lg font-medium transition-all duration-300"
                >
                  Login
                </Link>
                <Link
                  to={"/signup"}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
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
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-white">
              Course<span className="text-emerald-400">Ship</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 leading-relaxed">
              Master new skills with expert-crafted courses
            </p>
            <p className="text-lg text-gray-500 mb-12">
              Join thousands of learners advancing their careers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                to={"/courses"}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
              >
                Explore Courses
              </Link>
              <Link
                to={"https://www.youtube.com/watch?v=OETDZw-7qF0"}
                className="bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold text-lg border border-gray-700 transition-all duration-300"
              >
                Watch Videos
              </Link>
            </div>
          </div>
        </section>




        {/* Courses Section */}
        <section className="px-6 pb-20">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4 text-white">
              Featured <span className="text-emerald-400">Courses</span>
            </h2>
            <p className="text-gray-400 text-lg">Discover courses that will transform your career</p>
          </div>
          <Slider {...settings}>
            {courses.map((course) => (
              <div key={course._id} className="p-4">
                <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 hover:shadow-xl">
                  <div className="relative">
                    <img
                      className="h-48 w-full object-cover"
                      src={course.image.url}
                      alt={course.title}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-white mb-4">
                      {course.title}
                    </h3>
                    <Link
                      to={`/buy/${course._id}`}
                      className="inline-block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-6 rounded-lg font-semibold text-center transition-all duration-300"
                    >
                      Enroll Now
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </section>








        {/* Footer */}
        <footer className="bg-gray-900 border-t border-gray-800 mt-20">
          <div className="px-6 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
                    <span className="text-black font-bold text-lg">C</span>
                  </div>
                  <h1 className="text-2xl font-bold text-white">
                    Course<span className="text-emerald-400">Ship</span>
                  </h1>
                </div>
                <p className="text-gray-400 mb-4">Navigate your learning journey</p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                    <FaFacebook className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                    <FaInstagram className="text-white" />
                  </a>
                  <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg flex items-center justify-center transition-colors">
                    <FaTwitter className="text-white" />
                  </a>
                </div>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Connect</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white cursor-pointer transition-colors">
                    YouTube Channel
                  </li>
                  <li className="hover:text-white cursor-pointer transition-colors">
                    Telegram Community
                  </li>
                  <li className="hover:text-white cursor-pointer transition-colors">
                    GitHub Repository
                  </li>
                </ul>
              </div>

              <div className="text-center">
                <h3 className="text-lg font-semibold mb-4 text-emerald-400">Legal</h3>
                <ul className="space-y-3 text-gray-400">
                  <li className="hover:text-white cursor-pointer transition-colors">
                    Terms & Conditions
                  </li>
                  <li className="hover:text-white cursor-pointer transition-colors">
                    Privacy Policy
                  </li>
                  <li className="hover:text-white cursor-pointer transition-colors">
                    Refund Policy
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-800 mt-8 pt-8 text-center">
              <p className="text-gray-500">
                © 2024 CourseShip. All rights reserved.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default Home;
