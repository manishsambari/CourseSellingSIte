import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../utils/utils";
import { FaArrowLeft, FaShieldAlt, FaLock, FaCreditCard, FaPaypal, FaGooglePay, FaApplePay } from "react-icons/fa";
import { SiVisa, SiMastercard, SiAmex } from "react-icons/si";
import logo from "../../public/logo.webp";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
  
  .buy-root {
    font-family: 'DM Sans', sans-serif;
    background: #0a0a0f;
    min-height: 100vh;
    color: #e8e6f0;
  }
  
  .glow-card {
    background: linear-gradient(135deg, rgba(30,30,45,0.95) 0%, rgba(20,20,35,0.98) 100%);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(167,139,250,0.15);
    box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.05);
  }
  
  .price-glow {
    background: linear-gradient(135deg, #a78bfa, #60a5fa);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
  
  .stripe-element {
    padding: 16px;
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 16px;
    transition: all 0.2s ease;
  }
  
  .stripe-element:focus-within {
    border-color: rgba(167,139,250,0.5);
    background: rgba(167,139,250,0.05);
    box-shadow: 0 0 0 3px rgba(167,139,250,0.1);
  }
  
  .payment-method-btn {
    background: rgba(255,255,255,0.03);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 14px;
    padding: 12px;
    transition: all 0.2s ease;
    cursor: pointer;
  }
  
  .payment-method-btn:hover {
    background: rgba(167,139,250,0.08);
    border-color: rgba(167,139,250,0.3);
    transform: translateY(-1px);
  }
  
  .payment-method-btn.active {
    background: rgba(167,139,250,0.12);
    border-color: #a78bfa;
    box-shadow: 0 0 0 1px #a78bfa;
  }
  
  .order-item {
    background: rgba(255,255,255,0.02);
    border-radius: 20px;
    padding: 20px;
    border: 1px solid rgba(255,255,255,0.05);
  }
  
  .secure-badge {
    background: rgba(52,211,153,0.1);
    border: 1px solid rgba(52,211,153,0.2);
    border-radius: 100px;
    padding: 8px 16px;
    font-size: 13px;
    font-weight: 500;
    color: #34d399;
  }
  
  @keyframes fadeSlideUp {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  .animate-fade-up {
    animation: fadeSlideUp 0.6s cubic-bezier(0.2, 0.9, 0.4, 1.1) forwards;
  }
  
  .card-brand-icons {
    display: flex;
    gap: 8px;
    align-items: center;
  }
`;

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

  const user = JSON.parse(localStorage.getItem("user"));
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
        setCourse(response.data.course);
        setClientSecret(response.data.clientSecret);
      } catch (error) {
        if (error?.response?.status === 400) {
          setError("You have already purchased this course");
          setTimeout(() => navigate("/purchases"), 2000);
        } else {
          setError(error?.response?.data?.errors || "Something went wrong");
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
      toast.error("Payment system not ready. Please try again.");
      return;
    }

    setLoading(true);
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setLoading(false);
      return;
    }

    const { error: pmError, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
    });

    if (pmError) {
      setCardError(pmError.message);
      setLoading(false);
      return;
    }

    const { paymentIntent, error: confirmError } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: user?.user?.firstName,
            email: user?.user?.email,
          },
        },
      }
    );

    if (confirmError) {
      setCardError(confirmError.message);
      setLoading(false);
    } else if (paymentIntent.status === "succeeded") {
      const paymentInfo = {
        email: user?.user?.email,
        userId: user.user._id,
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
        toast.success("Payment Successful! 🎉");
        navigate("/purchases");
      } catch (err) {
        toast.error("Payment recorded but order failed. Contact support.");
      }
    }
    setLoading(false);
  };

  if (initialLoading) {
    return (
      <div className="buy-root">
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-3 border-purple-500/20 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-400">Loading secure checkout...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="buy-root">
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="glow-card rounded-2xl p-8 max-w-md text-center animate-fade-up">
            <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Checkout Unavailable</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link to="/purchases" className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl transition-all duration-200 font-medium">
              <FaArrowLeft size={14} /> Go to My Purchases
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <style>{styles}</style>
      <div className="buy-root">
        {/* Simple Header */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0f]/80 backdrop-blur-xl border-b border-white/5">
          <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img src={logo} alt="CourseShip" className="w-10 h-10 rounded-xl object-cover" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">CourseShip</span>
            </Link>
            <Link to="/courses" className="text-gray-400 hover:text-white transition flex items-center gap-2">
              <FaArrowLeft size={14} /> Back to Courses
            </Link>
          </div>
        </header>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
          <div className="grid lg:grid-cols-5 gap-8 animate-fade-up">
            {/* Order Summary - Left Side */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="glow-card rounded-2xl overflow-hidden sticky top-28">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={course.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600"} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0f18] via-transparent to-transparent"></div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-white mb-2">{course.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed mb-6">
                    {course.description || "Comprehensive course with expert instruction, hands-on projects, and lifetime access."}
                  </p>
                  
                  <div className="border-t border-white/10 pt-6 space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Order Total</span>
                      <div className="text-right">
                        <span className="text-3xl font-bold price-glow">₹{course.price}</span>
                        <span className="text-gray-500 text-sm line-through ml-2">₹5,999</span>
                      </div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Course fee</span>
                      <span>₹{course.price}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                      <span>Tax (GST)</span>
                      <span>Included</span>
                    </div>
                    <div className="border-t border-white/10 pt-4 mt-2">
                      <div className="flex justify-between font-semibold text-white">
                        <span>Total Amount</span>
                        <span className="text-xl price-glow">₹{course.price}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Section - Right Side */}
            <div className="lg:col-span-3 order-1 lg:order-2">
              <div className="glow-card rounded-2xl p-6 md:p-8">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                  <h2 className="text-2xl font-bold text-white">Complete Payment</h2>
                  <div className="secure-badge flex items-center gap-2">
                    <FaLock size={12} /> Secured by Stripe
                  </div>
                </div>

                {/* Payment Methods Tabs */}
                <div className="grid grid-cols-4 gap-2 mb-8">
                  {[
                    { id: "card", icon: <FaCreditCard />, label: "Card" },
                    { id: "paypal", icon: <FaPaypal />, label: "PayPal" },
                    { id: "gpay", icon: <FaGooglePay />, label: "Google Pay" },
                    { id: "apple", icon: <FaApplePay />, label: "Apple Pay" },
                  ].map((method) => (
                    <button
                      key={method.id}
                      onClick={() => setActiveMethod(method.id)}
                      className={`payment-method-btn flex flex-col items-center gap-2 text-sm font-medium transition-all ${
                        activeMethod === method.id ? "active text-purple-400" : "text-gray-400"
                      }`}
                    >
                      <span className="text-xl">{method.icon}</span>
                      <span>{method.label}</span>
                    </button>
                  ))}
                </div>

                {/* Card Payment Form */}
                {activeMethod === "card" && (
                  <form onSubmit={handlePurchase}>
                    <div className="space-y-6">
                      {/* Card Brand Icons */}
                      <div className="flex justify-end gap-2 mb-2">
                        <SiVisa className="text-2xl text-gray-500" />
                        <SiMastercard className="text-2xl text-gray-500" />
                        <SiAmex className="text-2xl text-gray-500" />
                      </div>
                      
                      {/* Stripe Card Element */}
                      <div className="stripe-element">
                        <CardElement
                          options={{
                            style: {
                              base: {
                                fontSize: "16px",
                                color: "#e8e6f0",
                                fontFamily: "'DM Sans', sans-serif",
                                "::placeholder": { color: "#4a4a60" },
                                iconColor: "#a78bfa",
                              },
                              invalid: { color: "#f87171" },
                            },
                            hidePostalCode: true,
                          }}
                        />
                      </div>

                      {cardError && (
                        <p className="text-red-400 text-sm flex items-center gap-2">
                          <span>⚠️</span> {cardError}
                        </p>
                      )}

                      {/* Contact Info Display */}
                      <div className="bg-purple-500/5 rounded-xl p-4 border border-purple-500/10">
                        <p className="text-sm text-gray-400 mb-1">Billing contact</p>
                        <p className="text-white font-medium">{user?.user?.firstName} {user?.user?.lastName}</p>
                        <p className="text-gray-400 text-sm">{user?.user?.email}</p>
                      </div>

                      {/* Submit Button */}
                      <button
                        type="submit"
                        disabled={!stripe || loading}
                        className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold py-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 text-lg"
                      >
                        {loading ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Processing Payment...
                          </>
                        ) : (
                          <>
                            <FaLock size={16} /> Pay ₹{course.price}
                          </>
                        )}
                      </button>

                      {/* Secure Notice */}
                      <div className="flex items-center justify-center gap-2 text-xs text-gray-500 pt-2">
                        <FaShieldAlt size={12} />
                        <span>Your payment information is encrypted and secure</span>
                      </div>
                    </div>
                  </form>
                )}

                {/* Placeholder for other payment methods */}
                {activeMethod !== "card" && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      {activeMethod === "paypal" && <FaPaypal className="text-3xl text-blue-400" />}
                      {activeMethod === "gpay" && <FaGooglePay className="text-3xl text-green-400" />}
                      {activeMethod === "apple" && <FaApplePay className="text-3xl text-gray-300" />}
                    </div>
                    <h3 className="text-white font-semibold mb-2">Coming Soon</h3>
                    <p className="text-gray-400 text-sm">This payment method will be available shortly.</p>
                    <button 
                      onClick={() => setActiveMethod("card")}
                      className="mt-4 text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Use Credit/Debit Card instead →
                    </button>
                  </div>
                )}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-xs text-gray-500">
                <span className="flex items-center gap-2">
                  <FaLock size={10} /> PCI Compliant
                </span>
                <span className="flex items-center gap-2">
                  <FaShieldAlt size={10} /> 256-bit SSL
                </span>
                <span>⭐ 30-Day Refund Policy</span>
                <span>⏱️ Lifetime Access</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Buy;