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
import { FiCheckCircle, FiCopy, FiHelpCircle, FiTerminal, FiCpu } from "react-icons/fi";
import Logo from "./Logo";

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
          setError("You have already mounted this curriculum node!");
          setTimeout(() => navigate("/purchases"), 2500);
        } else {
          setError(error?.response?.data?.errors || "Checkout session failed to mount");
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
      toast.error("Payment matrix not initialized. Please refresh.");
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
      setCardError(pmError.message || "Invalid card credentials");
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: `${user?.user?.firstName || ""} ${user?.user?.lastName || ""}`.trim() || "Developer Node",
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
        toast.success("Transaction Confirmed // Track Mounted 🎉");
        navigate("/purchases");
      } catch (err) {
        toast.error("Payment confirmed, but order record failed. Please contact support.");
      }
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex items-center justify-center font-sans">
        <div className="text-center space-y-3 font-mono">
          <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin mx-auto" />
          <p className="text-cyan-400 text-xs">// INITIALIZING SECURE ESCROW MATRIX...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen flex items-center justify-center px-4 font-sans">
        <div className="cyber-card p-8 max-w-md w-full text-center space-y-4 font-mono">
          <div className="w-12 h-12 bg-[#0c121e] border border-cyan-500/30 text-cyan-400 rounded-xl flex items-center justify-center mx-auto text-xl">
            <FaShieldAlt />
          </div>
          <h2 className="text-base font-bold text-white uppercase font-display">// ENROLLMENT NOTICE</h2>
          <p className="text-zinc-400 text-xs leading-relaxed">{error}</p>
          <div className="pt-2">
            <Link
              to="/purchases"
              className="btn-cyber-primary w-full py-2.5 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <FaArrowLeft size={11} />
              <span>RETURN TO COMMAND CENTER</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#05070e] text-[#f1f5f9] min-h-screen font-sans selection:bg-cyan-400 selection:text-black">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#060912]/90 backdrop-blur-md border-b border-[#162034]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between font-mono">
          <Link to="/">
            <Logo size="sm" subtitle="GATEWAY" />
          </Link>
          <Link
            to="/courses"
            className="text-xs text-zinc-400 hover:text-cyan-400 transition flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#0c121e] border border-[#162034]"
          >
            <FaArrowLeft size={10} />
            <span>// CATALOG</span>
          </Link>
        </div>
      </header>

      {/* ── MAIN CHECKOUT LAYOUT ── */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 pb-16">
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          {/* LEFT: Order Telemetry */}
          <div className="lg:col-span-5 space-y-5">
            <div className="cyber-card p-6 space-y-5">
              <div className="flex items-center justify-between border-b border-[#162034] pb-3">
                <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                  // ORDER SUMMARY
                </span>
                <span className="badge-cyber-green text-[10px]">
                  NODE READY
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
                  className="w-18 h-14 rounded-lg object-cover border border-[#162034] flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="text-sm font-bold text-white font-display line-clamp-2 leading-snug">
                    {course.title || "Engineering Track"}
                  </h3>
                  <div className="text-xs text-cyan-300 font-mono font-bold mt-1">
                    ₹{course.price || 0}
                  </div>
                </div>
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 pt-3 border-t border-[#162034] text-xs font-mono">
                <div className="flex justify-between text-zinc-400">
                  <span>STANDARD TUITION</span>
                  <span className="line-through">₹{Number(course.price || 0) * 4 || 4999}</span>
                </div>
                <div className="flex justify-between text-emerald-400">
                  <span>LAUNCH PRIVILEGE (75% OFF)</span>
                  <span>-₹{Number(course.price || 0) * 3 || 3750}</span>
                </div>
                <div className="flex justify-between text-white font-bold text-sm pt-2.5 border-t border-[#162034]">
                  <span>TOTAL ESCROW</span>
                  <span className="font-mono text-base text-cyan-300">₹{course.price || 0}</span>
                </div>
              </div>

              {/* Inclusions */}
              <div className="pt-3 border-t border-[#162034] space-y-2 font-mono">
                <div className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
                  MOUNTED ARTIFACTS:
                </div>
                <ul className="space-y-1.5 text-xs text-zinc-300">
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-cyan-400 flex-shrink-0" size={13} />
                    <span>Permanent repository clone access</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-cyan-400 flex-shrink-0" size={13} />
                    <span>Video blueprints & architecture diagrams</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-cyan-400 flex-shrink-0" size={13} />
                    <span>Cryptographic SHA-256 completion certificate</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FiCheckCircle className="text-cyan-400 flex-shrink-0" size={13} />
                    <span>Discord engineer channel access</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* RIGHT: Payment Matrix */}
          <div className="lg:col-span-7 space-y-5">
            <div className="cyber-card p-6 sm:p-7 space-y-5">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-[#162034] pb-4 font-mono">
                <div>
                  <h2 className="text-sm font-bold text-white uppercase font-display">// PAYMENT GATEWAY</h2>
                  <p className="text-[11px] text-zinc-400">Select protocol endpoint</p>
                </div>
                <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/30">
                  <FaLock size={9} /> 256-BIT ENCRYPTED
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-2 gap-2.5 font-mono">
                <button
                  type="button"
                  onClick={() => setActiveMethod("card")}
                  className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    activeMethod === "card"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-neon-cyan"
                      : "bg-[#080c14] border-[#162034] text-zinc-400 hover:text-white"
                  }`}
                >
                  <FaCreditCard className="text-cyan-400" />
                  <span>CREDIT / DEBIT</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMethod("upi")}
                  className={`p-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    activeMethod === "upi"
                      ? "bg-cyan-500/10 border-cyan-500 text-cyan-300 shadow-neon-cyan"
                      : "bg-[#080c14] border-[#162034] text-zinc-400 hover:text-white"
                  }`}
                >
                  <FaQrcode className="text-emerald-400" />
                  <span>UPI / QR MATRIX</span>
                </button>
              </div>

              {/* Method 1: Stripe Card */}
              {activeMethod === "card" && (
                <form onSubmit={handlePurchase} className="space-y-4 font-mono">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs text-zinc-300 uppercase">
                        // CARD CREDENTIALS
                      </label>
                      <button
                        type="button"
                        onClick={() => setShowTestCardInfo(!showTestCardInfo)}
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                      >
                        <FiHelpCircle size={11} />
                        <span>TEST CARD INFO</span>
                      </button>
                    </div>

                    {/* Test Card Info Box */}
                    {showTestCardInfo && (
                      <div className="p-3 rounded-lg bg-[#060910] border border-cyan-500/30 text-xs text-cyan-200 space-y-1 font-mono">
                        <div className="flex justify-between items-center">
                          <span>Card: <strong>4242 4242 4242 4242</strong></span>
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard?.writeText("4242424242424242");
                              toast.success("Copied to buffer!");
                            }}
                            className="p-1 text-zinc-400 hover:text-white"
                          >
                            <FiCopy size={12} />
                          </button>
                        </div>
                        <div className="text-[10px] text-zinc-400">
                          MM/YY: Any future date · CVC: Any 3 digits
                        </div>
                      </div>
                    )}

                    {/* Stripe CardElement Box */}
                    <div className="p-3.5 rounded-lg bg-[#060910] border border-[#162034]">
                      <CardElement
                        options={{
                          style: {
                            base: {
                              fontSize: "13px",
                              color: "#00f0ff",
                              fontFamily: "Space Mono, monospace",
                              "::placeholder": {
                                color: "#475569",
                              },
                            },
                            invalid: {
                              color: "#ff0055",
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  {cardError && (
                    <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-xs text-rose-400 font-mono">
                      {cardError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading || !stripe}
                    className="btn-cyber-primary w-full py-3 text-xs flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                        <span>PROCESSING PROTOCOL...</span>
                      </>
                    ) : (
                      <>
                        <FaLock size={11} />
                        <span>AUTHORIZE ₹{course.price || 0}</span>
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Method 2: UPI / QR Matrix */}
              {activeMethod === "upi" && (
                <div className="p-6 rounded-lg bg-[#060910] border border-[#162034] text-center space-y-4 font-mono">
                  <div className="w-36 h-36 bg-white p-2 rounded-lg mx-auto flex items-center justify-center border-2 border-cyan-400 shadow-neon-cyan">
                    <img
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=courseship@upi&pn=CourseShip&am=${course.price || 0}&cu=INR`}
                      alt="UPI QR Code"
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-zinc-300 font-semibold">
                      SCAN VIA BHIM, GPAY, OR PHONEPE
                    </p>
                    <p className="text-[11px] text-cyan-400">VPA: courseship@upi</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveMethod("card")}
                    className="btn-cyber-outline text-xs px-4 py-2"
                  >
                    SWITCH TO CARD
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