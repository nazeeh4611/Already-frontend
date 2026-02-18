// Homepage.jsx
import React, { useEffect, useRef, useState } from "react";
import Navbar from "../../Layout/Navbar";
import Footer from "../../Layout/Footer";
import Hero from "../../Layout/Hero";
import ContentSections from "../../Layout/Content";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Homepage = () => {
  const scrollBtnRef = useRef(null);
  const [showScroll, setShowScroll] = useState(false);

  useEffect(() => {
    // Floating icon gentle bob
    gsap.fromTo(".floating-icon",
      { y: 0 },
      { y: -7, duration: 2.5, repeat: -1, yoyo: true, stagger: 0.35, ease: "sine.inOut" }
    );

    const handleScroll = () => setShowScroll(window.scrollY > 350);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (scrollBtnRef.current) {
      gsap.to(scrollBtnRef.current, {
        opacity: showScroll ? 1 : 0,
        scale: showScroll ? 1 : 0.75,
        duration: 0.3,
        ease: "back.out(1.7)",
      });
    }
  }, [showScroll]);

  return (
    <div style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: '#f8fafc' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');

        .floating-icon { transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1); }
        .floating-icon:hover { transform: scale(1.18) translateY(-4px) !important; }

        .tooltip-wrap { position: relative; }
        .tooltip-label {
          position: absolute;
          right: calc(100% + 10px);
          top: 50%;
          transform: translateY(-50%);
          background: #0f172a;
          color: #fbbf24;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.04em;
          white-space: nowrap;
          padding: 5px 10px;
          border-radius: 8px;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.18s;
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        .tooltip-label::after {
          content: '';
          position: absolute;
          left: 100%; top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
          border-left-color: #0f172a;
        }
        .tooltip-wrap:hover .tooltip-label { opacity: 1; }

        .scroll-top-btn { opacity: 0; transform: scale(0.75); }

        /* Grain texture */
        body::after {
          content: '';
          position: fixed;
          inset: 0;
          pointer-events: none;
          z-index: 9999;
          opacity: 0.016;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 160px;
        }
      `}</style>

      <Navbar />
      <Hero />
      <ContentSections />
      <Footer />

      {/* ── Floating Contact Buttons ─────────────────────── */}
      <div className="fixed right-5 bottom-24 flex flex-col gap-3 z-50 md:right-6 md:bottom-28">

        {/* WhatsApp */}
        <div className="tooltip-wrap">
          <span className="tooltip-label">WhatsApp</span>
          <a
            href="https://wa.me/0559821924"
            target="_blank"
            rel="noopener noreferrer"
            className="floating-icon w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/20"
            style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)', boxShadow: '0 6px 24px rgba(22,163,74,0.4)' }}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.087-.177.181-.076.355.101.174.449.741.964 1.201.662.591 1.221.774 1.394.861.174.087.276.072.378-.043.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087.159.058 1.01.476 1.184.563.174.087.289.13.332.202.043.072.043.419-.101.824z"/>
            </svg>
          </a>
        </div>

        {/* Email */}
        <div className="tooltip-wrap">
          <span className="tooltip-label">Email Us</span>
          <a
            href="mailto:a.medjoum@gmail.com"
            className="floating-icon w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/20"
            style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)', boxShadow: '0 6px 24px rgba(29,78,216,0.4)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </a>
        </div>

        {/* Phone */}
        <div className="tooltip-wrap">
          <span className="tooltip-label">Call Us</span>
          <a
            href="tel:0559821924"
            className="floating-icon w-12 h-12 rounded-2xl flex items-center justify-center shadow-xl border border-white/20"
            style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)', boxShadow: '0 6px 24px rgba(245,158,11,0.4)' }}
          >
            <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999zM13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766 4.006 4.006 9.024 4.299 10.559 4.299.398 0 .602-.023.641-.027a1 1 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"/>
            </svg>
          </a>
        </div>
      </div>

      {/* ── Scroll to Top ───────────────────────────────── */}
      <button
        ref={scrollBtnRef}
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        aria-label="Scroll to top"
        className="scroll-top-btn fixed bottom-6 right-5 md:right-6 z-50 w-11 h-11 rounded-2xl flex items-center justify-center shadow-xl border border-blue-100"
        style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)', boxShadow: '0 6px 20px rgba(29,78,216,0.35)' }}
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {/* ── Live Support Badge ─────────────────────────── */}
      <div
        className="fixed bottom-6 left-5 md:left-6 z-50 hidden md:flex items-center gap-2 px-3 py-2 rounded-xl border border-blue-100"
        style={{ background: 'rgba(239,246,255,0.92)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 20px rgba(29,78,216,0.1)' }}
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", fontSize: '11px', fontWeight: 700, color: '#1d4ed8', letterSpacing: '0.03em' }}>
          24/7 Concierge Online
        </span>
      </div>
    </div>
  );
};

export default Homepage;