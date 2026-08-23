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
  FaPaypal,
  FaGooglePay,
  FaApplePay,
  FaCheck,
  FaStar,
  FaQrcode,
} from "react-icons/fa";
import { SiVisa, SiMastercard } from "react-icons/si";
import { FiCheckCircle, FiHelpCircle, FiClock, FiAward, FiCopy } from "react-icons/fi";
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
        setCourse(response.data.course || {});
        setClientSecret(response.data.clientSecret || "");
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
          <div className="w-14 h-14 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto shadow-glow" />
          <p className="text-gray-400 text-sm font-medium">Initializing secure checkout session...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#0a0a0f] text-[#e8e6f0] min-h-screen flex items-center justify-center px-4 font-sans">
        <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full text-center border border-white/10 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-400 rounded-2xl flex items-center justify-center mx-auto mb-6 text-2xl">
            <FaShieldAlt />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Enrollment Notice</h2>
          <p className="text-gray-400 text-sm mb-8 leading-relaxed">{error}</p>
          <Link
            to="/purchases"
            className="btn-primary w-full py-3.5 rounded-xl text-sm font-bold shadow-glow flex items-center justify-center gap-2"
          >
            <FaArrowLeft size={13} />
            <span>Go to My Enrolled Courses</span>
          </Link>
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
      <header className="fixed top-0 left-0 right-0 z-50 glass-nav">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center shadow-glow group-hover:scale-105 transition-transform">
              <img src={logo} alt="CourseShip" className="w-6 h-6 rounded-md object-cover" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">CourseShip</span>
          </Link>
          <Link
            to="/courses"
            className="text-xs font-semibold text-gray-400 hover:text-white transition flex items-center gap-2 px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10"
          >
            <FaArrowLeft size={11} />
            <span>Back to Courses</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN CHECKOUT LAYOUT ── */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Order Summary */}
          <div className="lg:col-span-5 space-y-6">
            <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/10 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-400 font-mono">
                  Order Summary
                </span>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
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
                  className="w-20 h-20 rounded-2xl object-cover border border-white/10 flex-shrink-0"
                />
                <div className="min-w-0">
                  <h3 className="text-base font-bold text-white line-clamp-2 leading-snug">
                    {course.title}
                  </h3>
                  <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                    <FiClock /> Full Lifetime Access
                  </p>
                </div>
              </div>

              {/* What You Get Checklist */}
              <div className="space-y-2.5 pt-4 border-t border-white/5 text-xs text-gray-300">
                <div className="font-semibold text-white mb-2">Included in this enrollment:</div>
                {[
                  "Complete video curriculum with HD streaming",
                  "Full starter code & production repositories",
                  "Certificate of completion (verifiable)",
                  "24/7 student Discord community support",
                  "30-day money-back guarantee",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <FaCheck className="text-emerald-400 text-[10px] flex-shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* Price Breakdown */}
              <div className="pt-6 border-t border-white/5 space-y-3 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Regular Price</span>
                  <span className="line-through font-mono">₹{Number(course.price || 0) * 4 || 4999}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Special Promotion (75% OFF)</span>
                  <span className="font-mono">-₹{(Number(course.price || 0) * 3) || 3999}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Estimated Tax & GST</span>
                  <span className="text-emerald-400">Included</span>
                </div>
                <div className="pt-4 border-t border-white/10 flex justify-between items-baseline">
                  <span className="text-base font-bold text-white">Total Amount Due</span>
                  <span className="text-3xl font-black gradient-text font-mono">
                    ₹{course.price}
                  </span>
                </div>
              </div>
            </div>

            {/* Test Credentials Helper Card */}
            <div className="glass-card rounded-2xl p-4 border border-purple-500/20 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-purple-300 flex items-center gap-1.5">
                  <HiSparkles /> Testing Checkout?
                </span>
                <button
                  type="button"
                  onClick={() => setShowTestCardInfo(!showTestCardInfo)}
                  className="text-[11px] text-purple-400 hover:text-purple-300 underline"
                >
                  {showTestCardInfo ? "Hide Test Info" : "View Test Card"}
                </button>
              </div>
              {showTestCardInfo && (
                <div className="bg-purple-950/40 p-3 rounded-xl border border-purple-500/20 font-mono text-[11px] space-y-1 text-purple-200">
                  <div>Card Number: <strong>4242 4242 4242 4242</strong></div>
                  <div>Expiry: <strong>12/28</strong> · CVC: <strong>123</strong></div>
                  <div>Postal Code: <strong>Any (e.g. 560001)</strong></div>
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: Payment Options & Card Element */}
          <div className="lg:col-span-7">
            <div className="glass-card rounded-3xl p-6 sm:p-10 border border-white/10 shadow-2xl">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Payment Details</h2>
                  <p className="text-xs text-gray-400 mt-1">Select your preferred payment method</p>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                  <FaLock size={10} /> 256-Bit Encrypted
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-4 gap-2.5 mb-8">
                {[
                  { id: "card", icon: <FaCreditCard size={18} />, label: "Credit Card" },
                  { id: "upi", icon: <FaQrcode size={18} />, label: "UPI / QR" },
                  { id: "paypal", icon: <FaPaypal size={18} />, label: "PayPal" },
                  { id: "gpay", icon: <FaGooglePay size={20} />, label: "Google Pay" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveMethod(tab.id)}
                    className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                      activeMethod === tab.id
                        ? "bg-purple-600/20 border-purple-500 text-purple-300 shadow-glow"
                        : "bg-white/5 border-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span className="text-[11px] truncate w-full text-center">{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Card Form */}
              {activeMethod === "card" && (
                <form onSubmit={handlePurchase} className="space-y-6">
                  {/* Card Brand Header */}
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <label className="font-semibold text-gray-300">Card Information</label>
                    <div className="flex items-center gap-2 text-xl text-gray-400">
                      <SiVisa />
                      <SiMastercard />
                    </div>
                  </div>

                  {/* Stripe Card Element Container */}
                  <div className="p-4 rounded-2xl glass-input">
                    <CardElement
                      options={{
                        style: {
                          base: {
                            fontSize: "15px",
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

                  {cardError && (
                    <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                      <span>⚠️</span>
                      <span>{cardError}</span>
                    </div>
                  )}

                  {/* Customer Billing Summary */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-xs text-gray-400 space-y-1">
                    <div className="text-gray-300 font-semibold">Billing Contact</div>
                    <div>{user?.user?.firstName} {user?.user?.lastName} ({user?.user?.email})</div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={!stripe || loading}
                    className="btn-primary w-full py-4 rounded-2xl text-base font-bold shadow-glow flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <FaLock size={14} />
                        <span>Complete Enrollment • ₹{course.price}</span>
                      </>
                    )}
                  </button>

                  <div className="text-center text-[11px] text-gray-500 flex items-center justify-center gap-2">
                    <FaShieldAlt size={12} className="text-emerald-400" />
                    <span>Guaranteed safe & secure checkout powered by Stripe PCI Level 1</span>
                  </div>
                </form>
              )}

              {/* UPI Tab */}
              {activeMethod === "upi" && (
                <div className="text-center py-8 space-y-4">
                  <div className="w-40 h-40 bg-white p-3 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
                    <FaQrcode size={120} className="text-gray-900" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-sm">Scan with Any UPI App</h4>
                    <p className="text-xs text-gray-400 mt-1">GPay, PhonePe, Paytm, BHIM</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMethod("card")}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-glow"
                  >
                    Pay with Card Instead
                  </button>
                </div>
              )}

              {/* Other Methods */}
              {(activeMethod === "paypal" || activeMethod === "gpay") && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto text-2xl">
                    <HiSparkles />
                  </div>
                  <h4 className="font-bold text-white text-base">Instant 1-Click Checkout</h4>
                  <p className="text-xs text-gray-400 max-w-sm mx-auto">
                    Use our primary Credit/Debit card checkout for instant automatic provisioning of your course access.
                  </p>
                  <button
                    type="button"
                    onClick={() => setActiveMethod("card")}
                    className="btn-primary px-6 py-2.5 rounded-xl text-xs font-bold shadow-glow"
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