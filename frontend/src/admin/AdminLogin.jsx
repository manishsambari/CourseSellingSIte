import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      toast.success(response.data.message);
      navigate("/admin/dashboard");
      localStorage.setItem("admin", JSON.stringify(response.data));
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "AdminLogin failed!!!");
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen relative overflow-hidden flex items-center justify-center py-20 md:py-0">
      <div className="blob w-96 h-96 bg-purple-400 top-0 -left-48"></div>
      <div className="blob w-96 h-96 bg-blue-400 bottom-0 -right-48" style={{animationDelay: '2s'}}></div>

      {/* Header */}
      <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 z-20">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center">
          <Link to={"/"} className="flex items-center space-x-2">
            <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
              <img src={logo} alt="Logo" className="w-7 h-7 rounded-full object-cover" />
            </div>
            <span className="text-2xl font-bold gradient-text hidden sm:block">CourseShip Admin</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link to={"/admin/signup"} className="text-gray-700 hover:text-purple-600 transition font-medium">
              Signup
            </Link>
            <Link to={"/courses"} className="gradient-bg text-white px-5 py-2 rounded-lg hover:opacity-90 transition font-medium">
              Join now
            </Link>
          </div>
        </div>
      </header>

      {/* AdminLogin Form */}
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-xl w-full max-w-md m-4 relative z-10 border border-gray-100 card-hover">
        <div className="text-center mb-8">
          <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <i className="fas fa-lock text-white text-2xl"></i>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Portal</h2>
          <p className="text-gray-600">Log in to manage your dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Admin Email
            </label>
            <input
              type="text"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none"
              placeholder="admin@example.com"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                required
              />
              <span className="absolute right-4 top-3.5 text-gray-400 hover:text-purple-600 cursor-pointer transition">
                <i className="fas fa-eye"></i>
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg text-center border border-red-100">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            className="w-full gradient-bg text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-all shadow-md transform active:scale-95 mt-4"
          >
            Login to Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;
