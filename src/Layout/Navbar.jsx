import React, { useState, useEffect, useRef } from "react";
import AuthModal from "../Components/ReusableComponent/AuthModal";
import OtpModal from "../Components/ReusableComponent/OtpModal";
import axios from "axios";
import { baseurl } from "../Base/Base.js";
import { useNavigate, Link, NavLink } from "react-router-dom";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { ClientId } from "../Base/Base.js";
import { useAuth } from "../Context/Auth";
import gsap from "gsap";
import { Menu, X, ChevronDown, User, LogOut, Home, Building2, Info, Phone } from "lucide-react";

const Navbar = () => {
  const { user, isLogged, checkAuthStatus, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [registeredEmail, setRegisteredEmail] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        navbarRef.current,
        { y: -80, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo(
        logoRef.current,
        { scale: 0.85, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.9, delay: 0.2, ease: "back.out(1.7)" }
      );
      if (menuRef.current) {
        gsap.fromTo(
          menuRef.current.children,
          { y: -20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.3, ease: "power2.out" }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    if (isMenuOpen && mobileMenuRef.current) {
      gsap.fromTo(
        mobileMenuRef.current,
        { x: "100%", opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5, ease: "power3.out" }
      );
      gsap.fromTo(
        ".mobile-menu-item",
        { x: 40, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.4, stagger: 0.08, delay: 0.15, ease: "power2.out" }
      );
    }
  }, [isMenuOpen]);

  const handleRegisterSuccess = (email) => {
    setRegisteredEmail(email);
    setShowOtpModal(true);
  };

  const handleLoginSuccess = async () => {
    try {
      await checkAuthStatus();
      setTimeout(() => setShowAuthModal(false), 100);
    } catch {
      setShowAuthModal(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${baseurl}User/logout`, {}, { withCredentials: true });
      logout();
      setShowProfileDropdown(false);
    } catch {}
  };

  const handleLogoClick = () => {
    gsap.to(logoRef.current, {
      scale: 0.92,
      duration: 0.15,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut",
    });
    navigate("/");
  };

  const navItems = [
    { name: "Home", icon: <Home className="w-4 h-4" />, path: "/" },
    { name: "Properties", icon: <Building2 className="w-4 h-4" />, path: "/property" },
    { name: "About", icon: <Info className="w-4 h-4" />, path: "/about" },
    { name: "Contact", icon: <Phone className="w-4 h-4" />, path: "/contact" },
  ];

  return (
    <GoogleOAuthProvider clientId={ClientId}>
      <header
        ref={navbarRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-white shadow-lg py-2 border-b border-blue-100"
            : "bg-white/95 backdrop-blur-md py-3 shadow-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div
              ref={logoRef}
              className="flex items-center cursor-pointer group"
              onClick={handleLogoClick}
            >
              <img
                src="/logo.png"
                alt="Alrkn Alraqy"
                className="h-14 md:h-16 w-auto object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            <nav ref={menuRef} className="hidden md:flex items-center space-x-10">
              {navItems.map((item) => (
                <NavLink
                  key={item.name}
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) =>
                    `relative flex items-center gap-2 text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-blue-700"
                        : "text-gray-600 hover:text-blue-600"
                    }`
                  }
                  style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                >
                  {({ isActive }) => (
                    <>
                      {item.name}
                      <span
                        className={`absolute -bottom-1 left-0 h-[2px] rounded-full transition-all duration-300 ${
                          isActive ? "w-full bg-blue-700" : "w-0"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              ))}
            </nav>

            <div className="flex items-center space-x-3">
              <div className="hidden md:block">
                {!isLogged ? (
                  <button
                    onClick={() => setShowAuthModal(true)}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white text-sm transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95"
                    style={{
                      background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                    }}
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </button>
                ) : (
                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowProfileDropdown(!showProfileDropdown)
                      }
                      className="flex items-center space-x-2 px-3 py-2 rounded-xl text-white font-semibold text-sm transition-all duration-200 hover:shadow-lg"
                      style={{
                        background: "linear-gradient(135deg, #1d4ed8, #1e40af)",
                      }}
                    >
                      <div className="w-7 h-7 rounded-lg bg-white/25 flex items-center justify-center font-bold text-white">
                        {user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="hidden lg:block max-w-[90px] truncate">
                        {user?.name}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${
                          showProfileDropdown ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                    {showProfileDropdown && (
                      <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl py-2 border border-blue-50 overflow-hidden">
                        <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                          <p className="text-sm font-semibold text-gray-900">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                          onClick={() => setShowProfileDropdown(false)}
                        >
                          Profile
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          <LogOut className="w-4 h-4" /> Logout
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <button
                className="md:hidden w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center border border-blue-100"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? (
                  <X className="w-5 h-5 text-blue-700" />
                ) : (
                  <Menu className="w-5 h-5 text-blue-700" />
                )}
              </button>
            </div>
          </div>

          {isMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="fixed top-[68px] right-0 bottom-0 w-72 bg-white shadow-2xl p-6 md:hidden border-l border-blue-100"
            >
              <nav className="flex flex-col space-y-2">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    end={item.path === "/"}
                    className={({ isActive }) =>
                      `mobile-menu-item flex items-center gap-3 py-3 px-4 text-sm font-medium rounded-xl transition-all ${
                        isActive
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                      }`
                    }
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span className="text-blue-500">{item.icon}</span>
                    {item.name}
                  </NavLink>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      <AuthModal
        show={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onRegisterSuccess={handleRegisterSuccess}
        onLoginSuccess={handleLoginSuccess}
      />
      <OtpModal
        show={showOtpModal}
        onClose={() => {
          setShowOtpModal(false);
          setRegisteredEmail("");
        }}
        email={registeredEmail}
      />
    </GoogleOAuthProvider>
  );
};

export default Navbar;
