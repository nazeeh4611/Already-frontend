import React, { useEffect, useRef } from 'react';
import { Phone, Mail, Instagram, Facebook, Linkedin, Send, MapPin, Clock, Shield, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Footer = () => {
  const footerRef = useRef(null);
  const sectionsRef = useRef([]);
  const socialRefs = useRef([]);
  const waveRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(waveRef.current,
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 1.5, ease: "power2.out" }
      );

      gsap.fromTo(footerRef.current,
        { opacity: 0, y: 50 },
        { 
          opacity: 1, 
          y: 0, 
          duration: 1, 
          scrollTrigger: { 
            trigger: footerRef.current, 
            start: "top 95%" 
          } 
        }
      );

      sectionsRef.current.forEach((section, i) => {
        if (section) {
          gsap.fromTo(section,
            { y: 30, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 0.8, 
              delay: i * 0.15, 
              ease: "back.out(1.2)",
              scrollTrigger: { 
                trigger: section, 
                start: "top 95%" 
              }
            }
          );
        }
      });

      socialRefs.current.forEach((social, i) => {
        if (social) {
          gsap.fromTo(social,
            { scale: 0, opacity: 0, rotation: -180 },
            { 
              scale: 1, 
              opacity: 1, 
              rotation: 0,
              duration: 0.6, 
              delay: 0.8 + i * 0.1, 
              ease: "back.out(1.7)",
              scrollTrigger: { 
                trigger: footerRef.current, 
                start: "top 95%" 
              }
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <footer ref={footerRef} className="text-white pt-16 pb-8 px-4 md:px-6 relative overflow-hidden" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a8a 70%, #1d4ed8 100%)' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Sora:wght@700;800&display=swap');
        .footer-link { transition: all 0.3s; display: block; position: relative; }
        .footer-link:hover { color: #fbbf24; transform: translateX(8px); }
        .footer-link::before {
          content: '→';
          position: absolute;
          left: -20px;
          opacity: 0;
          transition: all 0.3s;
        }
        .footer-link:hover::before {
          opacity: 1;
          left: -15px;
          color: #fbbf24;
        }
        .footer-contact-item { transition: all 0.3s; }
        .footer-contact-item:hover { color: #fbbf24; transform: translateX(8px); }
        .footer-contact-item:hover .footer-icon { color: #fbbf24; transform: scale(1.1); }
      `}</style>

      <div ref={waveRef} className="absolute top-0 left-0 right-0 overflow-hidden" style={{ height: '80px' }}>
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,20 C360,70 1080,-10 1440,30 L1440,0 L0,0 Z" fill="#fffff" opacity="0.1" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          <div ref={el => sectionsRef.current[0] = el}>
            <h3 className="text-3xl font-extrabold mb-4 text-white" style={{ fontFamily: "'Sora', sans-serif" }}>
              Alrkn <span style={{ color: '#fbbf24' }}>Alraqy</span>
            </h3>
            <p className="text-sm text-blue-200 mb-6 leading-relaxed">
              Premier hospitality management delivering exceptional service across the Middle East, South Africa, and Central Europe.
            </p>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-blue-200">24/7 Concierge Available</span>
            </div>
            <div className="flex gap-2">
              {[
                { href: "tel:0559821924", icon: <Phone className="h-4 w-4" />, label: "Call" },
                { href: "mailto:a.medjoum@gmail.com", icon: <Mail className="h-4 w-4" />, label: "Mail" },
                { href: "#", icon: <Instagram className="h-4 w-4" />, label: "Instagram" },
                { href: "#", icon: <Facebook className="h-4 w-4" />, label: "Facebook" },
                { href: "#", icon: <Linkedin className="h-4 w-4" />, label: "LinkedIn" },
              ].map((s, i) => (
                <a key={i} ref={el => socialRefs.current[i] = el} href={s.href} aria-label={s.label}
                  className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center hover:bg-yellow-400 hover:text-blue-900 transition-all duration-300 hover:scale-110 text-blue-200">
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          <div ref={el => sectionsRef.current[1] = el}>
            <h4 className="font-bold text-lg mb-5 text-white flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="w-1.5 h-6 rounded-full bg-yellow-400 inline-block" />
              Quick Links
            </h4>
            <div className="space-y-3">
              {[["About Us", "/about"], ["Properties", "/properties"], ["Contact", "/contact"], ["Blog", "/blog"], ["Careers", "/careers"]].map(([name, path]) => (
                <Link key={name} to={path} className="footer-link text-sm text-blue-200" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{name}</Link>
              ))}
            </div>
          </div>

          <div ref={el => sectionsRef.current[2] = el}>
            <h4 className="font-bold text-lg mb-5 text-white flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="w-1.5 h-6 rounded-full bg-yellow-400 inline-block" />
              Our Regions
            </h4>
            <div className="space-y-3">
              {[
                { name: "Gulf Countries", count: "45+ properties" },
                { name: "South Africa", count: "28+ properties" },
                { name: "Central Europe", count: "32+ properties" },
                { name: "Middle East", count: "56+ properties" }
              ].map(r => (
                <a key={r.name} href="/property" className="footer-link text-sm text-blue-200 flex justify-between items-center" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                  <span>{r.name}</span>
                  <span className="text-xs bg-white/10 px-2 py-0.5 rounded-full">{r.count}</span>
                </a>
              ))}
            </div>
          </div>

          <div ref={el => sectionsRef.current[3] = el}>
            <h4 className="font-bold text-lg mb-5 text-white flex items-center gap-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span className="w-1.5 h-6 rounded-full bg-yellow-400 inline-block" />
              Contact Us
            </h4>
            <div className="space-y-4">
              <a href="tel:0559821924" className="footer-contact-item flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-yellow-400/20 flex items-center justify-center shrink-0 transition-all">
                  <Phone className="footer-icon h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <span className="text-xs text-blue-300">Main Office</span>
                  <p className="text-sm text-white font-medium">0559821924</p>
                </div>
              </a>
              <a href="tel:0505668081" className="footer-contact-item flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-yellow-400/20 flex items-center justify-center shrink-0 transition-all">
                  <Phone className="footer-icon h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <span className="text-xs text-blue-300">Reservations</span>
                  <p className="text-sm text-white font-medium">0505668081</p>
                </div>
              </a>
              <a href="mailto:a.medjoum@gmail.com" className="footer-contact-item flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-yellow-400/20 flex items-center justify-center shrink-0 transition-all">
                  <Mail className="footer-icon h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <span className="text-xs text-blue-300">Email</span>
                  <p className="text-sm text-white font-medium truncate">a.medjoum@gmail.com</p>
                </div>
              </a>
              <a href="mailto:mendjouma@gmail.com" className="footer-contact-item flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-white/10 group-hover:bg-yellow-400/20 flex items-center justify-center shrink-0 transition-all">
                  <Mail className="footer-icon h-4 w-4 text-yellow-400" />
                </div>
                <div>
                  <span className="text-xs text-blue-300">Support</span>
                  <p className="text-sm text-white font-medium truncate">mendjouma@gmail.com</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
            <Shield className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="font-bold text-white">DTCM Licensed</p>
              <p className="text-xs text-blue-300">Official tourism license</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
            <Award className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="font-bold text-white">Award Winning</p>
              <p className="text-xs text-blue-300">2025 Excellence Award</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-xl p-4">
            <Clock className="h-8 w-8 text-yellow-400" />
            <div>
              <p className="font-bold text-white">24/7 Support</p>
              <p className="text-xs text-blue-300">Round the clock service</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-blue-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            © 2026 Alrkn Alraqy Hotel Management. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="text-xs text-blue-300 hover:text-yellow-400 transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="text-xs text-blue-300 hover:text-yellow-400 transition-colors">Terms of Service</Link>
            <div className="flex items-center gap-2 text-xs text-blue-300" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              <span>Premium Hospitality</span>
              <Send className="h-3 w-3 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;