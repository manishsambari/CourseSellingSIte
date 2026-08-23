import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { Toaster } from "react-hot-toast";
import Purchases from "./components/Purchases";
import Buy from "./components/Buy";
import Courses from "./components/Courses";
import AdminSignup from "./admin/AdminSignup";
import AdminLogin from "./admin/AdminLogin";
import Dashboard from "./admin/Dashboard";
import CourseCreate from "./admin/CourseCreate";
import UpdateCourse from "./admin/UpdateCourse";
import OurCourses from "./admin/OurCourses";

function App() {
  const admin = JSON.parse(localStorage.getItem("admin") || "null");
  return (
    <div className="bg-[#0a0a0f] min-h-screen text-[#e8e6f0]">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* User / Learner Routes */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route path="/purchases" element={<Purchases />} />

        {/* Admin Routes */}
        <Route path="/admin/signup" element={<AdminSignup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={admin?.token ? <Dashboard /> : <Navigate to="/admin/login" />}
        />
        <Route path="/admin/create-course" element={<CourseCreate />} />
        <Route path="/admin/update-course/:id" element={<UpdateCourse />} />
        <Route path="/admin/our-courses" element={<OurCourses />} />
      </Routes>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#161622",
            color: "#f3f4f6",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            boxShadow: "0 20px 40px -15px rgba(0,0,0,0.6)",
            fontSize: "13px",
            fontWeight: "500",
            borderRadius: "14px",
            padding: "12px 18px",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#161622",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#161622",
            },
          },
        }}
      />
    </div>
  );
}

export default App;
