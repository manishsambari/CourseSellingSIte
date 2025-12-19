import { useState } from "react";
// import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";

function Signup() {
  const [firstName, setFirstName] = useState("");  // vlaue mai dalne ke liye
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // page reload na ho form submit krne pe

    try {
      const response = await axios.post(
        `${BACKEND_URL}/user/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Sugnup successful: ", response.data);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Signup failed!!!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-black">
      <div className="h-screen container mx-auto flex items-center justify-center text-white">
        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-6 bg-gray-900/50 backdrop-blur-xl border-b border-gray-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-lg flex items-center justify-center">
              <span className="text-black font-bold text-lg">C</span>
            </div>
            <Link to={"/"} className="text-2xl font-bold text-white">
              Course<span className="text-emerald-400">Ship</span>
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to={"/login"}
              className="text-gray-300 hover:text-white px-4 py-2 border border-gray-700 hover:border-gray-600 rounded-lg font-medium transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to={"/courses"}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-300"
            >
              Explore
            </Link>
          </div>
        </header>

        {/* Signup Form */}
        <div className="bg-gray-900 p-8 rounded-xl border border-gray-800 shadow-2xl w-[500px] m-8 md:m-0 mt-20">
          <h2 className="text-3xl font-bold mb-4 text-center text-white">
            Welcome to <span className="text-emerald-400">CourseShip</span>
          </h2>
          <p className="text-center text-gray-400 mb-8">
            Join us and start your learning journey
          </p>

          <form onSubmit={handleSubmit}> 
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label htmlFor="firstname" className="block text-gray-300 mb-2 font-medium">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)} // jo user type kr raha vo dekna chaiye cuz of target.value
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter first name"
                  required
                />
              </div>
              <div>
                <label htmlFor="lastname" className="block text-gray-300 mb-2 font-medium">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter last name"
                  required
                />
              </div>
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-300 mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                placeholder="name@example.com"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-300 mb-2 font-medium">
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Create a strong password"
                  required
                />
              </div>
            </div>
            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 px-6 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Create Account
            </button>

            <p className="text-center text-gray-400 mt-6">
              Already have an account?{" "}
              <Link to="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Sign in here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
