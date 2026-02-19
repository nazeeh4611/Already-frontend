import React, { useState, useEffect, useRef } from "react";
import gsap from "gsap";

const OtpModal = ({ show, onClose, email }) => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const modalRef = useRef(null);
  const overlayRef = useRef(null);

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
    }
  }, [show]);

  useEffect(() => {
    if (show) {
      setTimeLeft(60);
      setCanResend(false);
    }
  }, [show]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  if (!show) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleVerify = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/verify-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          email,
          otp
        }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "OTP verification failed");
      }

      gsap.to(modalRef.current, {
        scale: 0.8,
        opacity: 0,
        y: 50,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          window.location.href = "/";
        }
      });
    } catch (error) {
      alert(error.message || "OTP verification failed");
    }
  };

  const handleResend = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/user/resend-otp", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to resend OTP");
      }
      
      setTimeLeft(60);
      setCanResend(false);
      
      gsap.fromTo(".resend-message",
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
      );
    } catch (error) {
      alert("Failed to resend OTP");
      console.error(error);
    }
  };

  const handleClose = () => {
    gsap.to(modalRef.current, {
      scale: 0.8,
      opacity: 0,
      y: 50,
      duration: 0.3,
      ease: "power2.in",
      onComplete: onClose
    });
    gsap.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: "power2.in"
    });
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div ref={overlayRef} className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div ref={modalRef} className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-blue-100">
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
          .otp-input {
            font-family: 'Sora', sans-serif;
            letter-spacing: 0.5em;
          }
        `}</style>
        
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all hover:scale-110"
        >
          <span className="text-lg">×</span>
        </button>
        
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center" 
            style={{ background: 'linear-gradient(135deg, #f59e0b20, #f59e0b40)' }}>
            <svg className="w-8 h-8" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>
            Verify Your Email
          </h2>
          <p className="text-gray-500 text-sm leading-relaxed" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            We've sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-base mt-1" style={{ color: '#f59e0b', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {email}
          </p>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-2 text-center uppercase tracking-wider">
              Enter Verification Code
            </label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
              className="otp-input w-full px-4 py-4 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-gray-800 placeholder-gray-300 text-center text-2xl font-bold"
              placeholder="000000"
              maxLength={6}
            />
          </div>
          
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100">
              <svg className="w-4 h-4" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-gray-600 text-sm font-medium">
                Time remaining: <span className="font-bold" style={{ color: '#f59e0b' }}>{formatTime(timeLeft)}</span>
              </span>
            </div>
          </div>
          
          <button
            onClick={handleVerify}
            disabled={otp.length !== 6}
            className="w-full py-4 text-white rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            style={{ 
              background: otp.length === 6 
                ? 'linear-gradient(135deg, #f59e0b, #d97706)' 
                : 'linear-gradient(135deg, #9ca3af, #6b7280)'
            }}
          >
            {otp.length === 6 ? 'Verify Code' : `Enter ${6 - otp.length} more digits`}
          </button>
          
          <div className="text-center space-y-2">
            <p className="text-gray-400 text-xs">Didn't receive the code?</p>
            <button
              onClick={handleResend}
              disabled={!canResend}
              className="font-semibold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 inline-flex items-center gap-1"
              style={{ color: canResend ? '#f59e0b' : '#9ca3af' }}
            >
              {canResend ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Resend Code
                </>
              ) : (
                `Resend in ${formatTime(timeLeft)}`
              )}
            </button>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-blue-50 border border-blue-100">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-gray-800 text-xs font-medium mb-1">Having trouble?</p>
              <p className="text-gray-500 text-xs leading-relaxed">
                Check your spam folder or ensure your email address is correct. The code expires in 10 minutes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OtpModal;