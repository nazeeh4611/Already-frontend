import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import { baseurl } from "../../Base/Base";
import toast from 'react-hot-toast';
import { GoogleLogin } from '@react-oauth/google';
import ForgotPasswordModal from './Forgotmodal';
import { useAuth } from "../../Context/Auth";
import gsap from "gsap";

const AuthModal = ({ show, onClose }) => {
  const { login } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  
  const modalRef = useRef(null);
  const overlayRef = useRef(null);
  const formRef = useRef(null);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [username, setUsername] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");

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
  }, [show, isLogin, showOtpVerification]);

  if (!show) return null;

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setUsername("");
    setRegEmail("");
    setPhone("");
    setRegPassword("");
    setConfirmPassword("");
    setOtp("");
    setErrorMessage("");
    setIsLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!email || !password) {
      setErrorMessage("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Signing in...");
    
    try {
      const res = await axios.post(
        `${baseurl}User/login`,
        { email, password },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
  
      console.log("Login Success:", res.data);
      
      if (res.data.success && res.data.user && res.data.token) {
        login(res.data.user, res.data.token);
        resetForm();
        
        gsap.to(modalRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          duration: 0.3,
          ease: "power2.in",
          onComplete: onClose
        });
        
        toast.success("Welcome back! 🎉", { id: loadingToast });
      } else {
        const message = res.data.message || "Login failed. Please try again.";
        setErrorMessage(message);
        toast.error(message, { id: loadingToast });
      }
    } catch (error) {
      console.error("Login Error:", error.response?.data?.message || error.message);
      const errorMsg = error.response?.data?.message || "Login failed";
      
      let displayMessage = errorMsg;
      if (errorMsg.toLowerCase().includes("invalid credentials")) {
        displayMessage = "Invalid credentials. Please check your email and password.";
      }
      
      setErrorMessage(displayMessage);
      toast.error(displayMessage, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!username || !regEmail || !phone || !regPassword || !confirmPassword) {
      setErrorMessage("Please fill in all fields");
      toast.error("Please fill in all fields");
      return;
    }
    
    if (regPassword !== confirmPassword) {
      const message = "Passwords do not match";
      setErrorMessage(message);
      toast.error(message);
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Creating your account...");
    
    try {
      const res = await axios.post(
        `${baseurl}User/register`,
        {
          username,
          email: regEmail,
          phone,
          password: regPassword,
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("Registration Success:", res.data);
      
      if (res.data.success) {
        setPendingEmail(regEmail);
        setShowOtpVerification(true);
        toast.success("OTP sent to your email! 📧", { id: loadingToast });
      } else {
        const message = res.data.message || "Registration failed. Please try again.";
        setErrorMessage(message);
        toast.error(message, { id: loadingToast });
      }
    } catch (error) {
      console.error("Registration Error:", error.response?.data?.message || error.message);
      const message = error.response?.data?.message || "Registration failed";
      setErrorMessage(message);
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    
    if (!otp || otp.length !== 6) {
      setErrorMessage("Please enter a valid 6-digit OTP");
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    const loadingToast = toast.loading("Verifying OTP...");
    
    try {
      const res = await axios.post(
        `${baseurl}User/verify-otp`,
        {
          email: pendingEmail,
          otp: otp
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      console.log("OTP Verification Success:", res.data);
      
      if (res.data.success && res.data.user && res.data.token) {
        login(res.data.user, res.data.token);
        resetForm();
        setShowOtpVerification(false);
        setPendingEmail("");
        
        gsap.to(modalRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          duration: 0.3,
          ease: "power2.in",
          onComplete: onClose
        });
        
        toast.success("Account verified successfully! ✨", { id: loadingToast });
      } else {
        const message = res.data.message || "Verification failed. Please try again.";
        setErrorMessage(message);
        toast.error(message, { id: loadingToast });
      }
    } catch (error) {
      console.error("OTP Verification Error:", error.response?.data?.message || error.message);
      const message = error.response?.data?.message || "Invalid OTP";
      setErrorMessage(message);
      toast.error(message, { id: loadingToast });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setErrorMessage("");
    
    const loadingToast = toast.loading("Resending OTP...");
    
    try {
      const res = await axios.post(
        `${baseurl}User/resend-otp`,
        { email: pendingEmail },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );
      
      if (res.data.success) {
        toast.success("New OTP sent to your email! 📧", { id: loadingToast });
      } else {
        const message = res.data.message || "Failed to resend OTP";
        setErrorMessage(message);
        toast.error(message, { id: loadingToast });
      }
    } catch (error) {
      console.error("Resend OTP Error:", error.response?.data?.message || error.message);
      const message = error.response?.data?.message || "Failed to resend OTP";
      setErrorMessage(message);
      toast.error(message, { id: loadingToast });
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setErrorMessage("");
    
    const loadingToast = toast.loading("Authenticating with Google...");
    
    try {
      const res = await axios.post(
        `${baseurl}User/google-auth`,
        { 
          credential: credentialResponse.credential 
        },
        { 
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Google Auth Success:", res.data);
      
      if (res.data.success && res.data.user && res.data.token) {
        login(res.data.user, res.data.token);
        resetForm();
        
        gsap.to(modalRef.current, {
          scale: 0.8,
          opacity: 0,
          y: 50,
          duration: 0.3,
          ease: "power2.in",
          onComplete: onClose
        });
        
        toast.success("Welcome! 🎉", { id: loadingToast });
      } else {
        const message = res.data.message || "Authentication failed. Please try again.";
        setErrorMessage(message);
        toast.error(message, { id: loadingToast });
      }
    } catch (error) {
      console.error("Google Auth Error:", error.response?.data?.message || error.message);
      const message = error.response?.data?.message || "Google authentication failed";
      setErrorMessage(message);
      toast.error(message, { id: loadingToast });
    }
  };

  const handleGoogleError = () => {
    console.error("Google Auth Error");
    const message = "Google authentication failed";
    setErrorMessage(message);
    toast.error(message);
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
        setIsLogin(true);
        setShowOtpVerification(false);
        setPendingEmail("");
        onClose();
      }
    });
  };

  const handleForgotPasswordClick = () => {
    setShowForgotPassword(true);
  };

  const handleForgotPasswordClose = () => {
    setShowForgotPassword(false);
  };

  const handleBackFromOtp = () => {
    setShowOtpVerification(false);
    setPendingEmail("");
    setOtp("");
    setErrorMessage("");
  };

  return (
    <>
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
                  {showOtpVerification ? 'Verify OTP' : isLogin ? 'Welcome Back' : 'Create Account'}
                </h2>
                <p className="text-gray-500 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  {showOtpVerification 
                    ? `Enter the OTP sent to ${pendingEmail}`
                    : isLogin ? 'Sign in to your account' : 'Join Alkrin Alraqy'}
                </p>
              </div>
              <button 
                onClick={handleModalClose}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-all hover:scale-110"
              >
                <span className="text-lg">×</span>
              </button>
            </div>

            {!showOtpVerification && (
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setErrorMessage("");
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isLogin 
                      ? 'bg-white text-gray-900 shadow-md' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setErrorMessage("");
                  }}
                  className={`flex-1 py-2.5 px-3 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    !isLogin 
                      ? 'bg-white text-gray-900 shadow-md' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
          
          <div ref={formRef} className="px-6 py-4">
            {errorMessage && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl">
                <p className="text-xs text-red-600 font-medium">{errorMessage}</p>
              </div>
            )}

            {showOtpVerification ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Enter OTP</label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm text-center tracking-widest font-bold"
                    style={{ fontFamily: "'Sora', sans-serif", letterSpacing: '0.5em' }}
                    placeholder="000000"
                    required
                  />
                </div>

                <button
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isLoading}
                  className="w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{background: `linear-gradient(135deg, #f59e0b, #d97706)`}}
                >
                  {isLoading ? 'Verifying...' : 'Verify OTP'}
                </button>

                <div className="text-center space-y-2">
                  <button 
                    type="button" 
                    onClick={handleResendOtp}
                    disabled={isLoading}
                    className="text-sm font-semibold transition-all duration-200 hover:scale-105 inline-flex items-center gap-1"
                    style={{ color: '#f59e0b' }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Resend OTP
                  </button>
                  <br />
                  <button 
                    type="button" 
                    onClick={handleBackFromOtp}
                    className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    ← Back to Registration
                  </button>
                </div>
              </div>
            ) : isLogin ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm"
                      placeholder="Enter your password"
                      required
                    />
                  </div>
                </div>
                
                <div className="text-right">
                  <button 
                    type="button" 
                    onClick={handleForgotPasswordClick}
                    className="text-sm font-semibold transition-all duration-200 hover:scale-105"
                    style={{ color: '#f59e0b' }}
                  >
                    Forgot password?
                  </button>
                </div>
                
                <button
                  type="button"
                  onClick={handleLogin}
                  disabled={isLoading}
                  className="w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{background: `linear-gradient(135deg, #f59e0b, #d97706)`}}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
                  </div>
                </div>
                
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="signin_with"
                    shape="rectangular"
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Username</label>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm"
                      placeholder="Username"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm"
                      placeholder="Phone"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Email Address</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Password</label>
                    <input
                      type="password"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm"
                      placeholder="Password"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">Confirm</label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-yellow-400 focus:ring-4 focus:ring-yellow-100 transition-all duration-200 text-sm"
                      placeholder="Confirm"
                      required
                    />
                  </div>
                </div>
                
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={isLoading}
                  className="w-full py-3.5 text-white rounded-xl font-bold text-sm transition-all duration-200 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{background: `linear-gradient(135deg, #f59e0b, #d97706)`}}
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs">
                    <span className="px-3 bg-white text-gray-400 font-medium">Or continue with</span>
                  </div>
                </div>
                
                <div className="w-full">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={handleGoogleError}
                    theme="outline"
                    size="large"
                    width="100%"
                    text="signup_with"
                    shape="rectangular"
                  />
                </div>
              </div>
            )}
          </div>

          <div className="px-6 pb-6">
            <div className="text-center">
              <p className="text-xs text-gray-400 leading-relaxed">
                By continuing, you agree to our{' '}
                <button className="font-semibold transition-colors duration-200 hover:underline" style={{ color: '#f59e0b' }}>
                  Terms of Service
                </button>
                {' '}and{' '}
                <button className="font-semibold transition-colors duration-200 hover:underline" style={{ color: '#f59e0b' }}>
                  Privacy Policy
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        show={showForgotPassword}
        onClose={handleForgotPasswordClose}
      />
    </>
  );
};

export default AuthModal;