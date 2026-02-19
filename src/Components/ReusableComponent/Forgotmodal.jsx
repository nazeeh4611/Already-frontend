import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { baseurl } from "../../Base/Base";
import { toast } from 'react-toastify';
import gsap from "gsap";

const ForgotPasswordModal = ({ show, onClose }) => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    if (show && modalRef.current && overlayRef.current) {
      gsap.fromTo(overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: "power2.out" }
      );
      gsap.fromTo(modalRef.current,
        { scale: 0.8, opacity: 0, y: 50 },
        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: "back.out(1.7)" }
      );
      
      if (formRef.current) {
        gsap.fromTo(formRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.4, stagger: 0.05, delay: 0.2, ease: "power2.out" }
        );
      }
    }
  }, [show, isEmailSent]);

  if (!show) return null;

  const resetForm = () => {
    setEmail("");
    setIsEmailSent(false);
    setIsLoading(false);
  };

  const handleSendResetLink = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `${baseurl}User/forgot-password`,
        { email },
        { withCredentials: true }
      );

      console.log("Reset link sent:", res.data);
      setIsEmailSent(true);
      toast.success("Reset link sent to your email!");
      
      gsap.fromTo(".success-message",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.4, ease: "back.out(1.7)" }
      );
    } catch (error) {
      console.error("Forgot Password Error:", error.response?.data?.message || error.message);
      toast.error(error.response?.data?.message || "Failed to send reset link");
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in"
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        resetForm();
        onClose();
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div ref={overlayRef} className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleModalClose} />
      <div ref={modalRef} className="relative bg-white rounded-3xl shadow-2xl w-full max-w-md border border-blue-100 overflow-hidden">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
        `}</style>
        
        <div className="px-6 py-6" style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #ffffff 100%)' }}>
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>
                {isEmailSent ? 'Check Your Email' : 'Forgot Password'}
              </h2>
              <p className="text-gray-500 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {isEmailSent 
                  ? 'We\'ve sent a reset link to your email' 
                  : 'Enter your email to reset your password'
                }
              </p>
            </div>
            <button 
              onClick={handleModalClose}
              className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all hover:scale-110"
            >
              <span className="text-lg">×</span>
            </button>
          </div>
        </div>
        
        <div ref={formRef} className="px-6 py-4">
          {!isEmailSent ? (
            <form onSubmit={handleSendResetLink} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm"
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                style={{background: `linear-gradient(135deg, #f59e0b, #d97706)`}}
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          ) : (
            <div className="space-y-4 text-center success-message">
              <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b20, #f59e0b40)' }}>
                <svg className="w-8 h-8" style={{ color: '#f59e0b' }} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900 mb-2">Email Sent Successfully!</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  We've sent a password reset link to <strong className="text-gray-700">{email}</strong>. 
                  Check your inbox and follow the instructions to reset your password.
                </p>
              </div>
              <button
                onClick={handleModalClose}
                className="w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-xl"
                style={{background: `linear-gradient(135deg, #f59e0b, #d97706)`}}
              >
                Done
              </button>
            </div>
          )}
        </div>

        {!isEmailSent && (
          <div className="px-6 pb-6">
            <div className="text-center">
              <button 
                onClick={handleModalClose}
                className="text-sm font-semibold transition-all duration-200 hover:scale-105 inline-flex items-center gap-1"
                style={{ color: '#f59e0b' }}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Sign In
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPasswordModal;