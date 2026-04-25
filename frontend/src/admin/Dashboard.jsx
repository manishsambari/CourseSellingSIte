// import React from "react";
import { Link } from "react-router-dom";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/utils";

function Dashboard() {
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response.data.errors || "Error in logging out");
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 p-6 flex flex-col shadow-sm relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 gradient-bg rounded-full flex items-center justify-center p-1 mb-4 shadow-md">
             <img src={logo} alt="Profile" className="rounded-full h-full w-full object-cover border-2 border-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Admin Panel</h2>
          <p className="text-sm text-gray-500">Superuser</p>
        </div>
        
        <nav className="flex flex-col space-y-3 flex-1">
          <Link to="/admin/our-courses" className="w-full bg-purple-50 text-purple-600 hover:bg-purple-100 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center">
            <i className="fas fa-book mr-3"></i> Our Courses
          </Link>
          <Link to="/admin/create-course" className="w-full gradient-bg text-white hover:opacity-90 font-semibold py-3 px-4 rounded-lg transition-opacity shadow-sm flex items-center">
            <i className="fas fa-plus-circle mr-3"></i> Create Course
          </Link>
          <Link to="/" className="w-full text-gray-600 hover:bg-gray-100 font-medium py-3 px-4 rounded-lg transition-colors flex items-center">
            <i className="fas fa-home mr-3"></i> Home
          </Link>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-gray-100">
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full text-red-600 hover:bg-red-50 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center"
            >
              <i className="fas fa-sign-out-alt mr-3"></i> Logout
            </button>
          </Link>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        <div className="blob w-96 h-96 bg-purple-400 top-20 -right-20"></div>
        <div className="blob w-96 h-96 bg-blue-400 bottom-20 left-20" style={{animationDelay: '2s'}}></div>
        
        <header className="bg-white border-b border-gray-200 px-8 py-6 relative z-10">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        </header>

        <main className="flex-1 p-8 overflow-y-auto relative z-10 flex items-center justify-center">
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-gray-100 max-w-lg w-full card-hover">
            <div className="w-24 h-24 gradient-bg rounded-full flex items-center justify-center mx-auto mb-6 shadow-md">
              <i className="fas fa-tachometer-alt text-white text-4xl"></i>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome back, Admin!</h2>
            <p className="text-gray-600 text-lg">Manage your courses, view enrollments, and track progress all from one place.</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
