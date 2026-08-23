import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import {
  FaArrowLeft,
  FaShieldAlt,
  FaLock,
  FaCreditCard,
  FaQrcode,
  FaCheck,
} from "react-icons/fa";
import { FiCheckCircle, FiCopy, FiHelpCircle, FiClock, FiAward } from "react-icons/fi";
import { HiSparkles } from "react-icons/hi";
import logo from "../../public/logo.webp";

function Buy() {
  const { courseId } = useParams();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const navigate = useNavigate();
  const [course, setCourse] = useState({});
  const [clientSecret, setClientSecret] = useState("");
  const [error, setError] = useState("");
  const [activeMethod, setActiveMethod] = useState("card");
  const [cardError, setCardError] = useState("");
  const [showTestCardInfo, setShowTestCardInfo] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;

  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchBuyCourseData = async () => {
      try {
        const response = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
            withCredentials: true,
          }
        );
        setCourse(response.data?.course || {});
        setClientSecret(response.data?.clientSecret || "");
      } catch (error) {
        if (error?.response?.status === 400) {
          setError("You have already enrolled in this course!");
          setTimeout(() => navigate("/purchases"), 2500);
        } else {
          setError(error?.response?.data?.errors || "Checkout failed to initialize");
        }
      } finally {
        setInitialLoading(false);
      }
    };
    if (token) fetchBuyCourseData();
  }, [courseId, token, navigate]);

  const handlePurchase = async (event) => {
    event.preventDefault();
    if (!stripe || !elements || !clientSecret) {
      toast.error("Payment system not ready. Please refresh.");
      return;
    }

    setLoading(true);
    setCardError("");
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }

    const { error: pmError } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (pmError) {
      setCardError(pmError.message || "Invalid card details");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${user?.user?.firstName || ""} ${user?.user?.lastName || ""}`.trim() || "Student",
            email: user?.user?.email,
          },
        },
      }
    );

    if (confirmError) {
      setCardError(confirmError.message || "Payment confirmation failed");
      setLoading(false);
    } else if (paymentIntent?.status === "succeeded") {
      const paymentInfo = {
        email: user?.user?.email,
        userId: user?.user?._id,
        courseId: courseId,
        paymentId: paymentIntent.id,
        amount: paymentIntent.amount,
        status: paymentIntent.status,
      };

      try {
        await axios.post(`${BACKEND_URL}/order`, paymentInfo, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        toast.success("Payment Successful! Welcome aboard 🎉");
        navigate("/purchases");
      } catch (err) {
        toast.error("Payment confirmed, but order record failed. Please contact support.");
      }
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen flex items-center justify-center font-sans">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto shadow-glow" />
          <p className="text-gray-400 text-xs font-medium">Initializing secure checkout session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen flex items-center justify-center px-4 font-sans">
        <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full text-center border border-white/10 shadow-2xl space-y-4">
          <div className="w-14 h-14 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center mx-auto text-2xl">
            <FaShieldAlt />
          </div>
          <h2 className="text-xl font-bold text-white">Enrollment Notice</h2>
          <p className="text-gray-400 text-xs leading-relaxed">{error}</p>
          <div className="pt-2">
            <Link
              to="/purchases"
              className="btn-primary w-full py-3 rounded-xl text-xs font-bold shadow-glow flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={12} />
              <span>Go to My Enrolled Courses</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen selection:bg-purple-600 selection:text-white font-sans">
      {/* Ambient background glows */}
      <div className="fixed top-20 right-20 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" />
      <div className="fixed bottom-20 left-1/4 w-[450px] h-[450px] bg-blue-600/10 rounded-full blur-[140px] pointer-events-none -z-10 animate-glow" style={{ animationDelay: "2s" }} />

      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav bg-[#0a0a0f]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 gradient-bg rounded-lg flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <img src={logo} alt="CourseShip" className="w-5 h-5 rounded object-cover" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">CourseShip</span>
          </Link>
          <Link
            to="/courses"
            className="text-xs font-semibold text-gray-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10"
          >
            <FaArrowLeft size={11} />
            <span>Back to Courses</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN CHECKOUT LAYOUT ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 border border-white/10 shadow-2xl space-y-5">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                  Order Summary
                </span>
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                  Instant Access
                </span>
              </div>

              {/* Course Card Preview */}
              <div className="flex gap-4 items-center">
                <img
                  src={
                    course.image?.url ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                  }
                  alt={course.title}
                  className="w-20 h-16 rounded-xl object-cover border border-white/10 shadow-sm flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white line-clamp-2 leading-snug">
                    {course.title || "Masterclass"}
                  </h3>
                  <div className="text-xs text-emerald-400 font-mono font-bold mt-1">
                    ₹{course.price || 0}
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2.5 pt-3 border-t border-white/5 text-xs">
                <div className="flex justify-between text-gray-400">
                  <span>Regular Tuition</span>
                  <span className="line-through font-mono">₹{Number(course.price || 0) * 4 || 4999}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>Launch Special (75% OFF)</span>
                  <span className="font-mono">-₹{Number(course.price || 0) * 3 || 3750}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2 border-t border-white/5">
                  <span>Total Payable</span>
                  <span className="font-mono gradient-text text-base">₹{course.price || 0}</span>
                </div>
              </div>

              {/* Inclusions checklist */}
              <div className="pt-3 border-t border-white/5 space-y-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Included in this enrollment:
                </div>
                <ul className="space-y-1.5 text-xs text-gray-300">
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-purple-400 flex-shrink-0" size={13} />
                    <span>Full lifetime curriculum access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-purple-400 flex-shrink-0" size={13} />
                    <span>GitHub repository source code</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-purple-400 flex-shrink-0" size={13} />
                    <span>Verifiable certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-purple-400 flex-shrink-0" size={13} />
                    <span>24/7 Discord mentor community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: Payment Options & Stripe Element */}
          <div className="lg:col-span-7 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white">Payment Method</h2>
                  <p className="text-xs text-gray-400">Select your preferred payment option</p>
                </div>
                <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 font-mono">
                  <FaLock size={10} /> 256-bit Encrypted
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setActiveMethod("card")}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    activeMethod === "card"
                      ? "bg-purple-600/20 border-purple-500/50 text-white shadow-glow"
                      : "glass-card border-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <FaCreditCard className="text-purple-400" />
                  <span>Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod("upi")}
                  className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    activeMethod === "upi"
                      ? "bg-purple-600/20 border-purple-500/50 text-white shadow-glow"
                      : "glass-card border-white/5 text-gray-400 hover:text-white"
                  }`}
                >
                  <FaQrcode className="text-emerald-400" />
                  <span>UPI / QR</span>
                </button>
              </div>

              {/* Method 1: Card via Stripe */}
              {activeMethod === "card" && (
                <form onSubmit={handlePurchase} className="space-y-5">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-gray-300">
                        Card Information
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTestCardInfo(!showTestCardInfo)}
                        className="text-[11px] text-purple-400 hover:text-purple-300 flex items-center gap-1 underline underline-offset-2"
                      >
                        <FiHelpCircle size={12} />
                        <span>Test Card Credentials</span>
                      </button>
                    </div>

                    {/* Test Card Info Box */}
                    {showTestCardInfo && (
                      <div className="p-3.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200 space-y-1.5 animate-fade-in font-mono">
                        <div className="flex justify-between items-center">
                          <span>Card: <strong>4242 4242 4242 4242</strong></span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText("4242424242424242");
                              toast.success("Test card copied!");
                            }}
                            className="p-1 hover:text-white"
                          >
                            <FiCopy size={12} />
                          </button>
                        </div>
                        <div className="text-[11px] text-purple-300 font-sans">
                          MM/YY: Any future date (e.g. 12/28) · CVC: Any 3 digits (e.g. 123)
                        </div>
                      </div>
                    )}

                    {/* Stripe CardElement Box */}
                    <div className="p-4 rounded-2xl bg-[#0e0e18] border border-white/10 shadow-inner">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "14px",
                              color: "#ffffff",
                              fontFamily: "Inter, sans-serif",
                              "::placeholder": {
                                color: "#6b7280",
                              },
                            },
                            invalid: {
                              color: "#ef4444",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {cardError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-xs text-red-300">
                      {cardError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !stripe}
                    className="btn-primary w-full py-3.5 rounded-xl text-xs font-bold shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <FaLock size={12} />
                        <span>Pay ₹{course.price || 0} Securely</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Method 2: UPI / QR Demo */}
              {activeMethod === "upi" && (
                <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 text-center space-y-4">
                  <div className="w-40 h-40 bg-white p-2 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=upi://pay?pa=courseship@upi&pn=CourseShip&am=${course.price || 0}&cu=INR`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-gray-300 font-semibold">
                      Scan with Google Pay, PhonePe, Paytm, or BHIM
                    </p>
                    <p className="text-[11px] text-gray-500 font-mono">UPI ID: courseship@upi</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMethod("card")}
                    className="btn-secondary px-5 py-2 rounded-xl text-xs font-semibold"
                  >
                    Switch to Card Payment
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Buy;