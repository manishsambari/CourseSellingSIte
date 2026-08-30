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
} from "react-icons/fa";
import { FiCheckCircle, FiCopy, FiHelpCircle } from "react-icons/fi";
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
      <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen flex items-center justify-center font-sans">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-zinc-700 border-t-white rounded-full animate-spin mx-auto" />
          <p className="text-zinc-400 text-xs font-mono">Initializing secure checkout...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen flex items-center justify-center px-4 font-sans">
        <div className="card-surface p-8 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 bg-zinc-900 border border-zinc-800 text-zinc-300 rounded-xl flex items-center justify-center mx-auto text-xl">
            <FaShieldAlt />
          </div>
          <h2 className="text-lg font-bold text-white">Enrollment Notice</h2>
          <p className="text-zinc-400 text-xs leading-relaxed">{error}</p>
          <div className="pt-2">
            <Link
              to="/purchases"
              className="btn-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={11} />
              <span>Go to My Enrolled Courses</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#09090b] text-[#f4f4f5] min-h-screen font-sans selection:bg-indigo-600 selection:text-white">
      {/* ── HEADER ── */}
      <header className="header-nav fixed top-0 left-0 right-0 z-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <img src={logo} alt="CourseShip" className="w-5 h-5 rounded object-cover" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">CourseShip Checkout</span>
          </Link>
          <Link
            to="/courses"
            className="text-xs font-medium text-zinc-400 hover:text-white transition flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800"
          >
            <FaArrowLeft size={10} />
            <span>Back to Courses</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN CHECKOUT LAYOUT ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Order Summary */}
          <div className="lg:col-span-5 space-y-5">
            <div className="card-surface p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                  Order Summary
                </span>
                <span className="tag-badge-green">
                  Instant Access
                </span>
              </div>

              {/* Course Card Preview */}
              <div className="flex gap-3.5 items-center">
                <img
                  src={
                    course.image?.url ||
                    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"
                  }
                  alt={course.title}
                  className="w-18 h-14 rounded-lg object-cover border border-zinc-800 flex-shrink-0"
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
              <div className="space-y-2 pt-3 border-t border-zinc-800 text-xs">
                <div className="flex justify-between text-zinc-400 font-mono">
                  <span>Regular Price</span>
                  <span className="line-through">₹{Number(course.price || 0) * 4 || 4999}</span>
                </div>
                <div className="flex justify-between text-emerald-400 font-mono">
                  <span>Launch Discount (75% OFF)</span>
                  <span>-₹{Number(course.price || 0) * 3 || 3750}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2.5 border-t border-zinc-800">
                  <span>Total Due</span>
                  <span className="font-mono text-base text-white">₹{course.price || 0}</span>
                </div>
              </div>

              {/* Inclusions checklist */}
              <div className="pt-3 border-t border-zinc-800 space-y-2">
                <div className="text-[11px] font-mono uppercase tracking-wider text-zinc-500 font-semibold">
                  Course Inclusions:
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-indigo-400 flex-shrink-0" size={13} />
                    <span>Complete lifetime curriculum access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-indigo-400 flex-shrink-0" size={13} />
                    <span>Monorepo source code & blueprints</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-indigo-400 flex-shrink-0" size={13} />
                    <span>Verified certificate of completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-indigo-400 flex-shrink-0" size={13} />
                    <span>Private Discord developer community</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: Payment Options & Stripe */}
          <div className="lg:col-span-7 space-y-5">
            <div className="card-surface p-6 sm:p-7 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
                <div>
                  <h2 className="text-base font-bold text-white">Payment Method</h2>
                  <p className="text-xs text-zinc-400">Select payment provider</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 bg-zinc-900 px-2.5 py-1 rounded-md border border-zinc-800 font-mono">
                  <FaLock size={9} className="text-emerald-400" /> 256-bit SSL
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setActiveMethod("card")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    activeMethod === "card"
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <FaCreditCard className="text-indigo-400" />
                  <span>Credit / Debit Card</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod("upi")}
                  className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    activeMethod === "upi"
                      ? "bg-zinc-800 border-zinc-600 text-white"
                      : "bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                >
                  <FaQrcode className="text-emerald-400" />
                  <span>UPI / QR</span>
                </button>
              </div>

              {/* Method 1: Stripe Card Form */}
              {activeMethod === "card" && (
                <form onSubmit={handlePurchase} className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-semibold text-zinc-300">
                        Card Information
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTestCardInfo(!showTestCardInfo)}
                        className="text-[11px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-mono"
                      >
                        <FiHelpCircle size={12} />
                        <span>Test Card</span>
                      </button>
                    </div>

                    {/* Test Card Info Box */}
                    {showTestCardInfo && (
                      <div className="p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs text-zinc-300 space-y-1 font-mono">
                        <div className="flex justify-between items-center">
                          <span>Card: <strong>4242 4242 4242 4242</strong></span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText("4242424242424242");
                              toast.success("Test card copied!");
                            }}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <FiCopy size={12} />
                          </button>
                        </div>
                        <div className="text-[11px] text-zinc-500 font-sans">
                          Expiry: Any future date · CVC: Any 3 digits
                        </div>
                      </div>
                    )}

                    {/* Stripe CardElement Box */}
                    <div className="p-3.5 rounded-xl bg-zinc-900 border border-zinc-800">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "14px",
                              color: "#f4f4f5",
                              fontFamily: "Inter, sans-serif",
                              "::placeholder": {
                                color: "#71717a",
                              },
                            },
                            invalid: {
                              color: "#f43f5e",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {cardError && (
                    <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-400">
                      {cardError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !stripe}
                    className="btn-accent w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Processing Payment...</span>
                      </>
                    ) : (
                      <>
                        <FaLock size={11} />
                        <span>Pay ₹{course.price || 0}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Method 2: UPI / QR Demo */}
              {activeMethod === "upi" && (
                <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center space-y-4">
                  <div className="w-36 h-36 bg-white p-2 rounded-xl mx-auto flex items-center justify-center">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=courseship@upi&pn=CourseShip&am=${course.price || 0}&cu=INR`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-zinc-300 font-semibold">
                      Scan with any UPI App (GPay, PhonePe, Paytm)
                    </p>
                    <p className="text-[11px] text-zinc-500 font-mono">UPI ID: courseship@upi</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMethod("card")}
                    className="btn-secondary text-xs px-4 py-2"
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