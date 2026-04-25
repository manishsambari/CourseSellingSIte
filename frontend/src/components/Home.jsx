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
import logo from "../../public/logo.webp";

// ─── Extra styles for new sections ───────────────────────────────────────────
const extraStyles = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  .progress-bar {
    height: 8px;
    background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
    border-radius: 10px;
    transition: width 0.8s ease;
  }

  .testimonial-card {
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    backdrop-filter: blur(10px);
  }

  .feature-card {
    transition: all 0.3s ease;
  }

  .feature-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }

  .pricing-card {
    transition: all 0.3s ease;
  }

  .pricing-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  }

  .stat-number {
    font-size: 2rem;
    font-weight: 800;
    color: #1a1a1a;
    line-height: 1;
  }

  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
    margin-top: 2px;
  }

  .section-tag {
    display: inline-block;
    background: #f3f0ff;
    color: #7c3aed;
    font-size: 0.8rem;
    font-weight: 600;
    padding: 4px 14px;
    border-radius: 999px;
    margin-bottom: 12px;
    letter-spacing: 0.3px;
  }
`;

function Home() {
  // ─── ALL ORIGINAL STATE & LOGIC UNCHANGED ────────────────────────────────
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

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
        settings: { slidesToShow: 3, slidesToScroll: 2, infinite: true, dots: true },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 2, slidesToScroll: 2, initialSlide: 2 },
      },
      {
        breakpoint: 480,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <>
      <style>{extraStyles}</style>
      <div className="bg-gray-50 min-h-screen relative overflow-hidden">
        <div className="blob w-96 h-96 bg-purple-400 top-20 -left-48"></div>
        <div className="blob w-96 h-96 bg-blue-400 bottom-20 -right-48" style={{ animationDelay: "2s" }}></div>

        <div className="relative z-10 text-gray-900">

          {/* ── HEADER (original, unchanged) ── */}
          <header className="fixed w-full top-0 z-50 nav-blur border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div className="flex items-center space-x-2">
                  <div className="w-10 h-10 gradient-bg rounded-lg flex items-center justify-center">
                    <img src={logo} alt="" className="w-7 h-7 rounded-full object-cover" />
                  </div>
                  <h1 className="text-2xl font-bold gradient-text">CourseShip</h1>
                </div>
                {/* NEW: nav links from Arena */}
                <div className="hidden md:flex items-center space-x-8">
                  <a href="#courses" className="text-gray-700 hover:text-purple-600 transition font-medium">Courses</a>
                  <a href="#features" className="text-gray-700 hover:text-purple-600 transition font-medium">Features</a>
                  <a href="#pricing" className="text-gray-700 hover:text-purple-600 transition font-medium">Pricing</a>
                  <a href="#testimonials" className="text-gray-700 hover:text-purple-600 transition font-medium">Reviews</a>
                </div>
                <div className="space-x-4 flex items-center">
                  {isLoggedIn ? (
                    <button onClick={handleLogout} className="text-gray-700 hover:text-purple-600 transition font-medium px-4">
                      Logout
                    </button>
                  ) : (
                    <>
                      <Link to="/login" className="hidden md:block text-gray-700 hover:text-purple-600 transition font-medium">Login</Link>
                      <Link to="/signup" className="gradient-bg text-white px-6 py-2 rounded-lg hover:opacity-90 transition font-medium">Get Started</Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          {/* ── HERO (original layout + NEW stats row from Arena) ── */}
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
                <Link
                  to="/courses"
                  className="gradient-bg text-white px-8 py-4 rounded-lg font-semibold text-lg hover:opacity-90 transition flex items-center justify-center space-x-2"
                >
                  <span>Explore courses</span>
                </Link>
                <Link
                  to="https://www.youtube.com/learncodingofficial"
                  className="bg-white text-gray-800 px-8 py-4 rounded-lg font-semibold text-lg border-2 border-gray-300 hover:border-purple-600 transition flex items-center justify-center"
                >
                  Course videos
                </Link>
              </div>

              {/* NEW: Stats row */}
              <div className="mt-10 flex items-center justify-center md:justify-start gap-8">
                <div>
                  <div className="stat-number">500K+</div>
                  <div className="stat-label">Active Learners</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="stat-number">10K+</div>
                  <div className="stat-label">Courses</div>
                </div>
                <div className="w-px h-10 bg-gray-200" />
                <div>
                  <div className="stat-number">4.9/5</div>
                  <div className="stat-label">Rating</div>
                </div>
              </div>
            </div>

            <div className="relative floating hidden md:block">
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=600&fit=crop"
                alt="Learning"
                className="rounded-2xl shadow-2xl"
              />
              {/* NEW: floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-white p-5 rounded-xl shadow-xl flex items-center gap-3">
                <div className="w-11 h-11 gradient-bg rounded-full flex items-center justify-center text-white text-lg">🏆</div>
                <div>
                  <div className="font-bold text-gray-900 text-sm">Certificate Ready</div>
                  <div className="text-xs text-gray-500">Industry Recognized</div>
                </div>
              </div>
            </div>
          </section>

          {/* ── COURSES SECTION (original slider, unchanged) ── */}
          <section id="courses" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Courses</h2>
                <p className="text-xl text-gray-600">Explore our most loved courses by thousands of students</p>
              </div>
              <Slider {...settings}>
                {courses.map((course) => (
                  <div key={course._id} className="p-4">
                    <div className="bg-white rounded-2xl shadow-lg overflow-hidden card-hover border border-gray-100 mx-2">
                      <div className="relative">
                        <img className="h-48 w-full object-cover" src={course.image.url} alt="" />
                      </div>
                      <div className="p-6 text-left">
                        <h2 className="text-xl font-bold text-gray-900 mb-2 truncate">{course.title}</h2>
                        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
                          <span>
                            <span className="font-bold text-gray-900 text-xl">₹{course.price}</span>
                          </span>
                        </div>
                        <Link
                          to={`/buy/${course._id}`}
                          className="block text-center gradient-bg text-white w-full py-2 px-4 rounded-lg hover:opacity-90 transition font-medium"
                        >
                          Enroll Now
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
              <div className="text-center mt-12">
                <Link
                  to="/courses"
                  className="border-2 border-purple-600 text-purple-600 px-8 py-3 rounded-lg font-semibold hover:bg-purple-600 hover:text-white transition inline-block"
                >
                  View All Courses →
                </Link>
              </div>
            </div>
          </section>

          {/* ── NEW: FEATURES SECTION ── */}
          <section id="features" className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="section-tag">Why Us</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose CourseShip?</h2>
                <p className="text-xl text-gray-600">Everything you need to succeed in your learning journey</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  { icon: "♾️", title: "Lifetime Access", desc: "Learn at your own pace with unlimited access to course materials forever." },
                  { icon: "👨‍🏫", title: "Expert Instructors", desc: "Learn from industry professionals with years of real-world experience." },
                  { icon: "🎓", title: "Certificates", desc: "Earn recognized certificates to showcase your skills to employers." },
                  { icon: "📱", title: "Mobile Learning", desc: "Access courses on any device, anywhere, anytime for maximum flexibility." },
                  { icon: "💬", title: "Community Support", desc: "Join vibrant communities and get help from peers and mentors." },
                  { icon: "🛠️", title: "Real Projects", desc: "Build portfolio-worthy projects that demonstrate your new skills." },
                ].map((f, i) => (
                  <div key={i} className="feature-card bg-white p-8 rounded-2xl shadow-md">
                    <div className="w-14 h-14 gradient-bg rounded-xl flex items-center justify-center mb-6 text-2xl">
                      {f.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                    <p className="text-gray-600">{f.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── NEW: TESTIMONIALS SECTION ── */}
          <section id="testimonials" className="py-20 gradient-bg relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <div className="text-center mb-16">
                <h2 className="text-4xl font-bold text-white mb-4">What Our Students Say</h2>
                <p className="text-xl text-purple-100">Join thousands of successful learners</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8">
                {[
                  {
                    text: "The best investment in my career! Landed my dream job as a web developer within 3 months of completing the bootcamp.",
                    name: "Sarah Johnson",
                    role: "Frontend Developer",
                    img: "https://i.pravatar.cc/100?img=1",
                  },
                  {
                    text: "Amazing instructors and comprehensive content. The hands-on projects really helped solidify my understanding of data science.",
                    name: "Michael Chen",
                    role: "Data Analyst",
                    img: "https://i.pravatar.cc/100?img=3",
                  },
                  {
                    text: "I switched from graphic design to UI/UX thanks to CourseShip. The community support is incredible and the courses are top-notch!",
                    name: "Emily Rodriguez",
                    role: "UX Designer",
                    img: "https://i.pravatar.cc/100?img=5",
                  },
                ].map((t, i) => (
                  <div key={i} className="testimonial-card p-8 rounded-2xl border border-white border-opacity-20">
                    <div className="flex mb-4 text-yellow-400 text-lg">{"★★★★★"}</div>
                    <p className="text-white mb-6">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <img src={t.img} alt={t.name} className="w-12 h-12 rounded-full" />
                      <div>
                        <div className="font-bold text-white">{t.name}</div>
                        <div className="text-purple-200 text-sm">{t.role}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── NEW: PRICING SECTION ── */}
          <section id="pricing" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <span className="section-tag">Pricing</span>
                <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
                <p className="text-xl text-gray-600">Flexible pricing for every learner</p>
              </div>
              <div className="grid md:grid-cols-3 gap-8 items-center">
                {/* Free */}
                <div className="pricing-card bg-white p-8 rounded-2xl border-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">₹0</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                    {["Access to free courses", "Community forums", "Basic progress tracking"].map((item) => (
                      <li key={item} className="flex items-center gap-2"><span className="text-green-500">✓</span> {item}</li>
                    ))}
                    {["Premium courses", "Certificates"].map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-400"><span>✕</span> {item}</li>
                    ))}
                  </ul>
                  <Link to="/signup" className="block text-center w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition">
                    Get Started
                  </Link>
                </div>
                {/* Pro — highlighted */}
                <div className="pricing-card gradient-bg p-8 rounded-2xl relative transform scale-105 shadow-2xl">
                  <div className="absolute top-0 right-0 bg-yellow-400 text-gray-900 px-4 py-1 rounded-bl-lg rounded-tr-2xl font-semibold text-xs">
                    Popular
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">Pro</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-white">₹999</span>
                    <span className="text-purple-200">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-white text-sm">
                    {["All free features", "Access to all courses", "Certificates of completion", "Priority support", "Downloadable resources"].map((item) => (
                      <li key={item} className="flex items-center gap-2"><span>✓</span> {item}</li>
                    ))}
                  </ul>
                  <Link to="/signup" className="block text-center w-full bg-white text-purple-600 py-3 rounded-lg font-semibold hover:bg-gray-100 transition">
                    Start Free Trial
                  </Link>
                </div>
                {/* Enterprise */}
                <div className="pricing-card bg-white p-8 rounded-2xl border-2 border-gray-200">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Enterprise</h3>
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">₹4,999</span>
                    <span className="text-gray-500">/month</span>
                  </div>
                  <ul className="space-y-3 mb-8 text-gray-700 text-sm">
                    {["All Pro features", "Team management", "Custom learning paths", "Dedicated account manager", "Advanced analytics"].map((item) => (
                      <li key={item} className="flex items-center gap-2"><span className="text-green-500">✓</span> {item}</li>
                    ))}
                  </ul>
                  <a href="mailto:hello@courseship.com" className="block text-center w-full gradient-bg text-white py-3 rounded-lg font-semibold hover:opacity-90 transition">
                    Contact Sales
                  </a>
                </div>
              </div>
            </div>
          </section>

          {/* ── NEW: CTA BANNER ── */}
          <section className="py-20 gradient-bg relative overflow-hidden">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Ready to Transform Your Career?</h2>
              <p className="text-xl text-purple-100 mb-8">Join 500,000+ learners and start your journey today</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/signup" className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition">
                  Start Free Trial
                </Link>
                <Link to="/courses" className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition">
                  Browse Courses
                </Link>
              </div>
            </div>
          </section>

          {/* ── FOOTER (original, unchanged) ── */}
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
                  <p className="text-gray-400 mb-4">
                    Empowering learners worldwide to achieve their dreams through quality education.
                  </p>
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
    </>
  );
}

export default Home;