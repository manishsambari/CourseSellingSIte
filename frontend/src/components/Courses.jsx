import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { FaDiscourse } from "react-icons/fa";
import { FaDownload } from "react-icons/fa6";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import { HiMenu, HiX } from "react-icons/hi";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  .courses-root {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e6f0;
  }

  .sidebar {
    background: #0f0f18;
    border-right: 1px solid rgba(255,255,255,0.06);
    width: 240px;
    min-height: 100vh;
    position: fixed;
    top: 0; left: 0;
    display: flex;
    flex-direction: column;
    padding: 32px 20px;
    z-index: 30;
    transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
  }

  .sidebar-logo {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 2px;
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .nav-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: 10px;
    color: #6b6b80;
    font-size: 14px;
    font-weight: 500;
    text-decoration: none;
    transition: all 0.2s ease;
    cursor: pointer;
    border: none;
    background: none;
    width: 100%;
    text-align: left;
  }

  .nav-item:hover {
    background: rgba(167,139,250,0.08);
    color: #c4b5fd;
  }

  .nav-item.active {
    background: rgba(167,139,250,0.12);
    color: #a78bfa;
    border: 1px solid rgba(167,139,250,0.2);
  }

  .nav-item.danger:hover {
    background: rgba(239,68,68,0.08);
    color: #f87171;
  }

  .main-content {
    margin-left: 240px;
    padding: 36px 40px;
    min-height: 100vh;
  }

  .topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 40px;
  }

  .page-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 48px;
    letter-spacing: 3px;
    background: linear-gradient(135deg, #fff 40%, #a78bfa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }

  .search-bar {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 50px;
    padding: 10px 18px;
    transition: border-color 0.2s;
  }

  .search-bar:focus-within {
    border-color: rgba(167,139,250,0.4);
    background: rgba(167,139,250,0.05);
  }

  .search-bar input {
    background: none;
    border: none;
    outline: none;
    color: #e8e6f0;
    font-size: 14px;
    width: 200px;
    font-family: 'DM Sans', sans-serif;
  }

  .search-bar input::placeholder { color: #4a4a60; }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .course-card {
    background: #13131f;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    animation: fadeUp 0.5s ease both;
  }

  .course-card:hover {
    transform: translateY(-6px);
    border-color: rgba(167,139,250,0.3);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.1);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .course-card:nth-child(1) { animation-delay: 0.05s; }
  .course-card:nth-child(2) { animation-delay: 0.10s; }
  .course-card:nth-child(3) { animation-delay: 0.15s; }
  .course-card:nth-child(4) { animation-delay: 0.20s; }
  .course-card:nth-child(5) { animation-delay: 0.25s; }
  .course-card:nth-child(6) { animation-delay: 0.30s; }

  .card-img-wrap {
    position: relative;
    height: 190px;
    overflow: hidden;
  }

  .card-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }

  .course-card:hover .card-img-wrap img {
    transform: scale(1.06);
  }

  .card-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #13131f 0%, transparent 60%);
  }

  .badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(167,139,250,0.85);
    backdrop-filter: blur(8px);
    color: #fff;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 50px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .card-body {
    padding: 20px 22px 22px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .card-title {
    font-size: 17px;
    font-weight: 600;
    color: #f0eeff;
    margin-bottom: 8px;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-desc {
    font-size: 13px;
    color: #6b6b80;
    line-height: 1.6;
    flex: 1;
    margin-bottom: 18px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  .card-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
  }

  .price-current {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    letter-spacing: 1px;
    color: #fff;
  }

  .price-old {
    font-size: 13px;
    color: #4a4a60;
    text-decoration: line-through;
    margin-left: 6px;
  }

  .discount-tag {
    background: rgba(52,211,153,0.12);
    color: #34d399;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 50px;
    border: 1px solid rgba(52,211,153,0.2);
  }

  .enroll-btn {
    display: block;
    text-align: center;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: #fff;
    padding: 13px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    transition: opacity 0.2s, transform 0.2s;
    letter-spacing: 0.3px;
  }

  .enroll-btn:hover {
    opacity: 0.9;
    transform: scale(0.99);
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #4a4a60;
  }

  .empty-icon {
    font-size: 48px;
    margin-bottom: 16px;
    opacity: 0.3;
  }

  .skeleton {
    background: linear-gradient(90deg, #1a1a28 25%, #22223a 50%, #1a1a28 75%);
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
    border-radius: 12px;
  }

  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skeleton-card {
    background: #13131f;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    overflow: hidden;
  }

  .hamburger-btn {
    display: none;
    position: fixed;
    top: 16px;
    left: 16px;
    z-index: 40;
    background: rgba(255,255,255,0.06);
    border: 1px solid rgba(255,255,255,0.1);
    color: #e8e6f0;
    border-radius: 10px;
    padding: 8px;
    cursor: pointer;
    font-size: 22px;
  }

  .sidebar-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 20;
    backdrop-filter: blur(2px);
  }

  .count-badge {
    background: rgba(167,139,250,0.15);
    color: #a78bfa;
    font-size: 13px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 50px;
    border: 1px solid rgba(167,139,250,0.2);
  }

  @media (max-width: 768px) {
    .hamburger-btn { display: flex; align-items: center; justify-content: center; }
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); box-shadow: 0 0 60px rgba(0,0,0,0.8); }
    .sidebar-overlay.open { display: block; }
    .main-content { margin-left: 0; padding: 24px 16px; }
    .page-title { font-size: 36px; }
    .topbar { flex-direction: column; align-items: flex-start; gap: 16px; margin-top: 48px; }
    .search-bar { width: 100%; }
    .search-bar input { width: 100%; }
  }
`;

function SkeletonCard() {
  return (
    <div className="skeleton-card">
      <div className="skeleton" style={{ height: 190 }} />
      <div style={{ padding: "20px 22px 22px" }}>
        <div className="skeleton" style={{ height: 18, marginBottom: 10, width: "70%" }} />
        <div className="skeleton" style={{ height: 13, marginBottom: 6 }} />
        <div className="skeleton" style={{ height: 13, marginBottom: 20, width: "80%" }} />
        <div className="skeleton" style={{ height: 44, borderRadius: 12 }} />
      </div>
    </div>
  );
}

function Courses() {
  const [courses, setCourses] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, { withCredentials: true });
        const data = response.data.courses || [];
        setCourses(data);
        setFiltered(data);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        setCourses([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  useEffect(() => {
    const q = search.toLowerCase();
    setFiltered(courses.filter(c =>
      c.title?.toLowerCase().includes(q) || c.description?.toLowerCase().includes(q)
    ));
  }, [search, courses]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="courses-root">

        {/* Hamburger */}
        <button className="hamburger-btn" onClick={() => setIsSidebarOpen(o => !o)}>
          {isSidebarOpen ? <HiX /> : <HiMenu />}
        </button>

        {/* Overlay */}
        <div
          className={`sidebar-overlay ${isSidebarOpen ? "open" : ""}`}
          onClick={() => setIsSidebarOpen(false)}
        />

        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 40 }}>
            <img src={logo} alt="logo" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "cover" }} />
            <span className="sidebar-logo">CourseShip</span>
          </div>
          <nav style={{ display: "flex", flexDirection: "column", gap: 4, flex: 1 }}>
            <a href="/" className="nav-item"><RiHome2Fill size={18} /> Home</a>
            <a href="#" className="nav-item active"><FaDiscourse size={16} /> Courses</a>
            <a href="/purchases" className="nav-item"><FaDownload size={16} /> Purchases</a>
            <a href="#" className="nav-item"><IoMdSettings size={18} /> Settings</a>
          </nav>
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)", paddingTop: 16 }}>
            {isLoggedIn ? (
              <button className="nav-item danger" onClick={handleLogout} style={{ color: "#f87171" }}>
                <IoLogOut size={18} /> Logout
              </button>
            ) : (
              <Link to="/login" className="nav-item">
                <IoLogIn size={18} /> Login
              </Link>
            )}
          </div>
        </aside>

        {/* Main */}
        <main className="main-content">
          <div className="topbar">
            <div>
              <div className="page-title">All Courses</div>
              {!loading && (
                <div style={{ marginTop: 8 }}>
                  <span className="count-badge">{filtered.length} course{filtered.length !== 1 ? "s" : ""} available</span>
                </div>
              )}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div className="search-bar">
                <FiSearch color="#4a4a60" size={15} />
                <input
                  type="text"
                  placeholder="Search courses..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <FaCircleUser size={36} color="#7c3aed" style={{ cursor: "pointer", flexShrink: 0 }} />
            </div>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="courses-grid">
              {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><FaDiscourse /></div>
              <p style={{ fontSize: 18, fontWeight: 600, color: "#6b6b80", marginBottom: 8 }}>
                {search ? "No courses match your search" : "No courses available yet"}
              </p>
              <p style={{ fontSize: 14, color: "#4a4a60" }}>
                {search ? "Try a different keyword" : "Check back soon — new courses are being added"}
              </p>
            </div>
          ) : (
            <div className="courses-grid">
              {filtered.map((course) => (
                <div key={course._id} className="course-card">
                  <div className="card-img-wrap">
                    <img
                      src={course.image?.url || course.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                      alt={course.title}
                      onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600" }}
                    />
                    <div className="card-img-overlay" />
                    <span className="badge">Featured</span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{course.title}</h3>
                    <p className="card-desc">{course.description}</p>
                    <div className="card-footer">
                      <div>
                        <span className="price-current">₹{course.price}</span>
                        <span className="price-old">₹5,999</span>
                      </div>
                      <span className="discount-tag">🔥 On Sale</span>
                    </div>
                    <Link to={`/buy/${course._id}`} className="enroll-btn">
                      Enroll Now →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
}

export default Courses;