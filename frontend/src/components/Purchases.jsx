import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";
import logo from "../../public/logo.webp";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  .purchases-root {
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

  .count-badge {
    background: rgba(167,139,250,0.15);
    color: #a78bfa;
    font-size: 13px;
    font-weight: 500;
    padding: 4px 12px;
    border-radius: 50px;
    border: 1px solid rgba(167,139,250,0.2);
    margin-top: 8px;
    display: inline-block;
  }

  .purchases-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 24px;
  }

  .purchase-card {
    background: #13131f;
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 20px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    animation: fadeUp 0.5s ease both;
  }

  .purchase-card:hover {
    transform: translateY(-6px);
    border-color: rgba(167,139,250,0.3);
    box-shadow: 0 20px 60px rgba(0,0,0,0.4), 0 0 0 1px rgba(167,139,250,0.1);
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .purchase-card:nth-child(1) { animation-delay: 0.05s; }
  .purchase-card:nth-child(2) { animation-delay: 0.10s; }
  .purchase-card:nth-child(3) { animation-delay: 0.15s; }
  .purchase-card:nth-child(4) { animation-delay: 0.20s; }
  .purchase-card:nth-child(5) { animation-delay: 0.25s; }
  .purchase-card:nth-child(6) { animation-delay: 0.30s; }

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

  .purchase-card:hover .card-img-wrap img {
    transform: scale(1.06);
  }

  .card-img-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, #13131f 0%, transparent 60%);
  }

  .owned-badge {
    position: absolute;
    top: 14px;
    right: 14px;
    background: rgba(52,211,153,0.85);
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

  .price-tag {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 1px;
    color: #34d399;
  }

  .paid-tag {
    background: rgba(52,211,153,0.12);
    color: #34d399;
    font-size: 11px;
    font-weight: 600;
    padding: 4px 10px;
    border-radius: 50px;
    border: 1px solid rgba(52,211,153,0.2);
  }

  .access-btn {
    display: block;
    text-align: center;
    background: linear-gradient(135deg, #059669, #0d9488);
    color: #fff;
    padding: 13px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    transition: opacity 0.2s, transform 0.2s;
    letter-spacing: 0.3px;
  }

  .access-btn:hover {
    opacity: 0.9;
    transform: scale(0.99);
  }

  .empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #4a4a60;
  }

  .empty-icon {
    font-size: 56px;
    margin-bottom: 20px;
    opacity: 0.2;
  }

  .browse-btn {
    display: inline-block;
    margin-top: 20px;
    background: linear-gradient(135deg, #7c3aed, #4f46e5);
    color: #fff;
    padding: 12px 28px;
    border-radius: 12px;
    font-weight: 600;
    font-size: 14px;
    text-decoration: none;
    transition: opacity 0.2s;
  }

  .browse-btn:hover { opacity: 0.85; }

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

  .error-banner {
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.2);
    color: #f87171;
    padding: 12px 18px;
    border-radius: 12px;
    margin-bottom: 24px;
    font-size: 14px;
  }

  @media (max-width: 768px) {
    .hamburger-btn { display: flex; align-items: center; justify-content: center; }
    .sidebar { transform: translateX(-100%); }
    .sidebar.open { transform: translateX(0); box-shadow: 0 0 60px rgba(0,0,0,0.8); }
    .sidebar-overlay.open { display: block; }
    .main-content { margin-left: 0; padding: 24px 16px; }
    .page-title { font-size: 36px; }
    .topbar { flex-direction: column; align-items: flex-start; gap: 8px; margin-top: 48px; }
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

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    setIsLoggedIn(!!token);
    if (!token) navigate("/login");
  }, []);

  useEffect(() => {
    if (!token) return;
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setPurchases(response.data.courseData || []);
        setErrorMessage("");
      } catch (error) {
        const errorMsg = error.response?.data?.errors || "Failed to fetch purchase data";
        setErrorMessage(errorMsg);
        if (error.response?.status === 401) {
          localStorage.removeItem("user");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchPurchases();
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, { withCredentials: true });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="purchases-root">

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
            <Link to="/" className="nav-item"><RiHome2Fill size={18} /> Home</Link>
            <Link to="/courses" className="nav-item"><FaDiscourse size={16} /> Courses</Link>
            <a href="#" className="nav-item active"><FaDownload size={16} /> Purchases</a>
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
              <div className="page-title">My Purchases</div>
              {!loading && (
                <span className="count-badge">
                  {purchases.length} course{purchases.length !== 1 ? "s" : ""} owned
                </span>
              )}
            </div>
          </div>

          {/* Error */}
          {errorMessage && (
            <div className="error-banner">⚠ {errorMessage}</div>
          )}

          {/* Grid */}
          {loading ? (
            <div className="purchases-grid">
              {[...Array(4)].map((_, i) => <SkeletonCard key={i} />)}
            </div>
          ) : purchases.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎒</div>
              <p style={{ fontSize: 20, fontWeight: 600, color: "#6b6b80", marginBottom: 8 }}>
                No purchases yet
              </p>
              <p style={{ fontSize: 14, color: "#4a4a60" }}>
                Start learning by enrolling in a course below.
              </p>
              <Link to="/courses" className="browse-btn">Browse Courses →</Link>
            </div>
          ) : (
            <div className="purchases-grid">
              {purchases.map((purchase, index) => (
                <div key={purchase._id || index} className="purchase-card">
                  <div className="card-img-wrap">
                    <img
                      src={purchase.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"}
                      alt={purchase.title || "Course"}
                      onError={e => { e.target.src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"; }}
                    />
                    <div className="card-img-overlay" />
                    <span className="owned-badge">✓ Owned</span>
                  </div>
                  <div className="card-body">
                    <h3 className="card-title">{purchase.title || "Untitled Course"}</h3>
                    <p className="card-desc">
                      {/* BUG FIX: safely access description */}
                      {purchase.description
                        ? purchase.description.length > 100
                          ? `${purchase.description.slice(0, 100)}...`
                          : purchase.description
                        : "No description available."}
                    </p>
                    <div className="card-footer">
                      <span className="price-tag">
                        ₹{purchase.price ?? "—"}
                      </span>
                      <span className="paid-tag">✓ Paid</span>
                    </div>
                    <Link to={`/course/${purchase._id}`} className="access-btn">
                      Access Course →
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

export default Purchases;