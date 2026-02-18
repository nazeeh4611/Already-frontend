import React, { useEffect, useRef } from 'react';
import { Phone, Mail, Instagram, Facebook, Linkedin, Send } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const sectionsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(footerRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 1, scrollTrigger: { trigger: footerRef.current, start: "top 95%" } }
      );
      sectionsRef.current.forEach((s, i) => {
        if (s) gsap.fromTo(s,
          { y: 25, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, delay: i * 0.1, ease: "power2.out", scrollTrigger: { trigger: s, start: "top 95%" } }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="text-white pt-14 pb-6 px-4 md:px-6" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');
        .footer-link { transition: color 0.2s, transform 0.2s; display: block; }
        .footer-link:hover { color: #fbbf24; transform: translateX(4px); }
        .footer-contact-item { transition: all 0.2s; }
        .footer-contact-item:hover { color: #fbbf24; }
        .footer-contact-item:hover .footer-icon { color: #fbbf24; }
      `}</style>

      <div className="-mt-14 mb-10 -mx-4 md:-mx-6 overflow-hidden" style={{ height: '60px' }}>
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 C360,60 1080,-20 1440,20 L1440,0 L0,0 Z" fill="#f8fafc" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">

          <div ref={el => sectionsRef.current[0] = el}>
            <h3 className="text-2xl font-extrabold mb-3 text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
              Alrkn <span style={{ color: '#fbbf24' }}>Alraqy</span>
            </h3>
            <p className="text-sm text-blue-200 mb-5 leading-relaxed">
              Premier hospitality management delivering exceptional service across the Middle East, South Africa, and Central Europe.
            </p>
            <div className="flex gap-2 flex-wrap">
              {[
                { href: "tel:0559821924", icon: <Phone className="h-4 w-4" />, label: "Call" },
                { href: "mailto:a.medjoum@gmail.com", icon: <Mail className="h-4 w-4" />, label: "Mail" },
                { href: "#", icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
                { href: "#", icon: <Facebook className="h-4 w-4" />, label: "Facebook" },
                { href: "#", icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
              ].map((s, i) => (
                <a key={i} href={s.href} aria-label={s.label}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition-all duration-200 hover:scale-110 text-blue-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div ref={el => sectionsRef.current[1] = el}>
            <h4 className="font-bold mb-4 text-white flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="w-1 h-5 rounded-full bg-yellow-400 inline-block" />
              Quick Links
            </h4>
            <div className="space-y-2">
              {[["About Us", "/about"], ["Properties", "/properties"], ["Contact", "/contact"], ["Blog", "/blog"]].map(([name, path]) => (
                <Link key={name} to={path} className="footer-link text-sm text-blue-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{name}</Link>
              ))}
            </div>
          </div>

          <div ref={el => sectionsRef.current[2] = el}>
            <h4 className="font-bold mb-4 text-white flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="w-1 h-5 rounded-full bg-yellow-400 inline-block" />
              Our Regions
            </h4>
            <div className="space-y-2">
              {["Gulf Countries", "South Africa", "Central Europe", "Middle East"].map(r => (
                <a key={r} href="/property" className="footer-link text-sm text-blue-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r}</a>
              ))}
            </div>
          </div>

          <div ref={el => sectionsRef.current[3] = el}>
            <h4 className="font-bold mb-4 text-white flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="w-1 h-5 rounded-full bg-yellow-400 inline-block" />
              Contact Us
            </h4>
            <div className="space-y-3">
              <a href="tel:0559821924" className="footer-contact-item flex items-center gap-2.5 group" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-yellow-400/20 flex items-center justify-center shrink-0 transition-colors">
                  <Phone className="footer-icon h-3.5 w-3.5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                </div>
                <span className="text-sm text-blue-200 group-hover:text-yellow-300 transition-colors">0559821924</span>
              </a>
              <a href="tel:0505668081" className="footer-contact-item flex items-center gap-2.5 group" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-yellow-400/20 flex items-center justify-center shrink-0 transition-colors">
                  <Phone className="footer-icon h-3.5 w-3.5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                </div>
                <span className="text-sm text-blue-200 group-hover:text-yellow-300 transition-colors">0505668081</span>
              </a>
              <a href="mailto:a.medjoum@gmail.com" className="footer-contact-item flex items-center gap-2.5 group" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-yellow-400/20 flex items-center justify-center shrink-0 transition-colors">
                  <Mail className="footer-icon h-3.5 w-3.5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                </div>
                <span className="text-sm text-blue-200 group-hover:text-yellow-300 transition-colors truncate">a.medjoum@gmail.com</span>
              </a>
              <a href="mailto:mendjouma@gmail.com" className="footer-contact-item flex items-center gap-2.5 group" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                <div className="w-8 h-8 rounded-lg bg-white/10 group-hover:bg-yellow-400/20 flex items-center justify-center shrink-0 transition-colors">
                  <Mail className="footer-icon h-3.5 w-3.5 text-yellow-400 group-hover:text-yellow-300 transition-colors" />
                </div>
                <span className="text-sm text-blue-200 group-hover:text-yellow-300 transition-colors truncate">mendjouma@gmail.com</span>
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-blue-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            © 2026 Alrkn Alraqy Hotel Management. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs text-blue-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            <span>Designed & Developed by Alrkn Alraqy</span>
            <Send className="h-3 w-3 text-yellow-400" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;