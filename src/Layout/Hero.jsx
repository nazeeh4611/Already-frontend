import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Calendar, Users, ChevronLeft, ChevronRight, Plus, Minus, MapPin } from 'lucide-react';
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(SplitText);

const carouselImages = [
  { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', label: 'Luxury Hotel Suite' },
  { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', label: 'Infinity Pool' },
  { url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', label: 'Fine Dining' },
  { url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80', label: 'Premium Villas' },
];

const CustomDatePicker = ({ value, onChange, placeholder, minDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const calendarRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    if (isOpen && calendarRef.current) {
      gsap.fromTo(calendarRef.current,
        { scale: 0.92, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.dp-wrapper') && !e.target.closest('.calendar-portal')) setIsOpen(false);
    };
    if (isOpen) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [isOpen]);

  const formatDate = useCallback((date) =>
    date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }), []);

  const generateCalendar = useCallback(() => {
    const firstDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1);
    const start = new Date(firstDay);
    start.setDate(start.getDate() - firstDay.getDay());
    return Array.from({ length: 42 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  }, [selectedDate]);

  const isToday = useCallback((d) => d.toDateString() === new Date().toDateString(), []);
  const isSameMonth = useCallback((d) => d.getMonth() === selectedDate.getMonth(), [selectedDate]);
  const isSelected = useCallback((d) => value && d.toDateString() === new Date(value).toDateString(), [value]);
  const isBeforeMinDate = useCallback((date) => {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    let compare = today;
    if (minDate) { const m = new Date(minDate); m.setHours(0, 0, 0, 0); compare = m > today ? m : today; }
    const d = new Date(date); d.setHours(0, 0, 0, 0);
    return d < compare;
  }, [minDate]);

  const handleDateSelect = useCallback((date) => {
    if (isBeforeMinDate(date)) { toast.error('Cannot select past dates'); return; }
    const y = date.getFullYear(), m = String(date.getMonth() + 1).padStart(2, '0'), d = String(date.getDate()).padStart(2, '0');
    onChange(`${y}-${m}-${d}`);
    setIsOpen(false);
  }, [onChange, isBeforeMinDate]);

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const dayNames = ['Su','Mo','Tu','We','Th','Fr','Sa'];

  return (
    <div className="relative w-full dp-wrapper">
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-14 px-4 text-left bg-white border-2 border-transparent rounded-2xl text-sm font-medium focus:outline-none transition-all duration-200 hover:border-blue-200 hover:shadow-md"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-blue-500 shrink-0" />
          <div>
            <span className="block text-[10px] font-semibold text-blue-600 uppercase tracking-widest">{placeholder}</span>
            {value ? (
              <span className="text-gray-800 text-sm font-medium">{formatDate(new Date(value))}</span>
            ) : (
              <span className="text-gray-400 text-sm">Select date</span>
            )}
          </div>
        </div>
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 calendar-portal">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setIsOpen(false)} />
          <div ref={calendarRef} className="relative bg-white rounded-3xl shadow-2xl p-6 w-full max-w-[360px] border border-blue-200">
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => { const d = new Date(selectedDate); d.setMonth(d.getMonth()-1); setSelectedDate(d); }} className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-all hover:scale-105">
                <ChevronLeft className="h-4 w-4 text-blue-600" />
              </button>
              <span className="font-bold text-gray-800 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </span>
              <button onClick={() => { const d = new Date(selectedDate); d.setMonth(d.getMonth()+1); setSelectedDate(d); }} className="w-10 h-10 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-all hover:scale-105">
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {dayNames.map(d => <div key={d} className="text-center text-xs font-semibold text-gray-400">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {generateCalendar().map((date, i) => {
                const past = isBeforeMinDate(date);
                return (
                  <button key={i} onClick={() => handleDateSelect(date)} disabled={past}
                    className={`h-10 w-full rounded-xl text-sm font-medium transition-all duration-150
                      ${past ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${!past && isSameMonth(date) ? 'text-gray-700 hover:bg-blue-600 hover:text-white hover:scale-105' : ''}
                      ${!past && !isSameMonth(date) ? 'text-gray-300' : ''}
                      ${isSelected(date) ? '!bg-blue-600 !text-white shadow-md scale-105' : ''}
                      ${isToday(date) && !isSelected(date) ? 'border-2 border-blue-400 text-blue-600 font-bold' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
              <button onClick={() => setIsOpen(false)} className="text-sm text-gray-500 hover:text-gray-700 font-medium">Cancel</button>
              <button onClick={() => {
                const today = new Date();
                const y = today.getFullYear(), m = String(today.getMonth() + 1).padStart(2, '0'), d = String(today.getDate()).padStart(2, '0');
                onChange(`${y}-${m}-${d}`);
                setIsOpen(false);
              }} className="text-sm text-blue-600 hover:text-blue-800 font-medium">Today</button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

const GuestSelector = React.memo(({ isOpen, onClose, guests, onGuestsChange }) => {
  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      gsap.fromTo(modalRef.current,
        { scale: 0.92, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const update = useCallback((type, op) => {
    const n = { ...guests };
    if (op === 'increment') n[type] = Math.min(n[type] + 1, type === 'adults' ? 16 : 5);
    else n[type] = Math.max(n[type] - 1, type === 'adults' ? 1 : 0);
    onGuestsChange(n);
  }, [guests, onGuestsChange]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div ref={modalRef} className="relative bg-white rounded-3xl shadow-2xl p-8 w-full max-w-[380px] border border-blue-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Sora', sans-serif" }}>Select Guests</h3>
        <div className="space-y-6">
          {['adults','children','infants'].map((type) => (
            <div key={type} className="flex items-center justify-between">
              <div>
                <p className="font-bold text-gray-800 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p className="text-xs text-gray-400 mt-0.5">{type==='adults'?'Ages 13+':type==='children'?'Ages 2–12':'Under 2'}</p>
              </div>
              <div className="flex items-center gap-4">
                <button onClick={() => update(type,'decrement')} disabled={guests[type] <= (type==='adults'?1:0)}
                  className="w-10 h-10 rounded-xl border-2 border-blue-200 flex items-center justify-center text-blue-600 disabled:opacity-30 hover:border-blue-500 hover:bg-blue-50 transition-all hover:scale-105 active:scale-95">
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-8 text-center font-bold text-gray-800 text-lg">{guests[type]}</span>
                <button onClick={() => update(type,'increment')} disabled={guests[type] >= (type==='adults'?16:5)}
                  className="w-10 h-10 rounded-xl border-2 border-blue-200 flex items-center justify-center text-blue-600 disabled:opacity-30 hover:border-blue-500 hover:bg-blue-50 transition-all hover:scale-105 active:scale-95">
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 pt-5 border-t border-gray-100">
          <button onClick={onClose} className="w-full py-4 rounded-xl font-bold text-white text-base transition-all hover:shadow-xl hover:scale-105 active:scale-95"
            style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
});

const Hero = () => {
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const searchRef = useRef(null);
  const badgesRef = useRef(null);
  const slidesRef = useRef([]);
  const locationBadgeRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(locationBadgeRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "back.out(1.2)" }
      );

      const splitTitle = new SplitText(titleRef.current, { type: "chars", charsClass: "char" });
      gsap.fromTo(splitTitle.chars,
        { y: 100, opacity: 0, rotateX: -90 },
        { y: 0, opacity: 1, rotateX: 0, duration: 1.2, stagger: 0.02, ease: "power3.out", delay: 0.2 }
      );

      gsap.fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, delay: 0.6, ease: "power2.out" }
      );

      gsap.fromTo(searchRef.current,
        { y: 40, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, delay: 0.9, ease: "back.out(1.2)" }
      );

      if (badgesRef.current?.children) {
        gsap.fromTo(badgesRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.6, stagger: 0.08, delay: 1.2, ease: "power2.out" }
        );
      }
    });
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    slidesRef.current.forEach((slide, index) => {
      if (slide) {
        gsap.to(slide, {
          opacity: index === currentSlide ? 1 : 0,
          scale: index === currentSlide ? 1 : 1.1,
          duration: 1.4,
          ease: "power2.inOut"
        });
      }
    });
  }, [currentSlide]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % carouselImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (checkIn && checkOut) {
      const ci = new Date(checkIn), co = new Date(checkOut);
      if (co <= ci) {
        const next = new Date(ci);
        next.setDate(next.getDate() + 1);
        setCheckOut(`${next.getFullYear()}-${String(next.getMonth()+1).padStart(2,'0')}-${String(next.getDate()).padStart(2,'0')}`);
      }
    }
  }, [checkIn, checkOut]);

  const minCheckOut = checkIn ? (() => {
    const d = new Date(checkIn);
    d.setDate(d.getDate() + 1);
    return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
  })() : null;

  const handleSearch = useCallback(() => {
    if (!checkIn || !checkOut) { toast.error('Please select check-in and check-out dates'); return; }
    const p = new URLSearchParams({ checkin: checkIn, checkout: checkOut, adults: guests.adults, children: guests.children, infants: guests.infants });
    navigate(`/property?${p.toString()}`);
  }, [checkIn, checkOut, guests, navigate]);

  const totalGuests = guests.adults + guests.children + guests.infants;

  return (
    <>
      <ToastContainer position="top-right" theme="colored" />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
        .hero-wave { position: absolute; bottom: -2px; left: 0; right: 0; height: 80px; }
        .char { display: inline-block; }
      `}</style>

      <div className="relative overflow-hidden" style={{ minHeight: '600px' }}>
        <div className="absolute inset-0">
          {carouselImages.map((img, index) => (
            <div
              key={index}
              ref={el => slidesRef.current[index] = el}
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage: `url(${img.url})`,
                opacity: index === 0 ? 1 : 0,
              }}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/20" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div ref={locationBadgeRef} className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md border border-white/30 shadow-lg">
              <MapPin className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-xs font-semibold text-white tracking-wider uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Gulf Countries · South Africa · Central Europe
              </span>
            </div>
          </div>

          <div className="text-center mb-8">
            <h1 ref={titleRef} className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Find Your Next Stay
            </h1>
            <p ref={subtitleRef} className="text-lg md:text-xl text-blue-100/90 max-w-2xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Best Hotels Deals — handpicked luxury properties for every journey
            </p>
          </div>

          <div ref={searchRef} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-3 md:p-4 border border-blue-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                <div className="px-1 py-1 lg:border-r border-gray-200">
                  <CustomDatePicker value={checkIn} onChange={setCheckIn} placeholder="CHECK IN" />
                </div>
                <div className="px-1 py-1 lg:border-r border-gray-200">
                  <CustomDatePicker value={checkOut} onChange={setCheckOut} placeholder="CHECK OUT" minDate={minCheckOut} />
                </div>
                <div className="px-1 py-1 lg:border-r border-gray-200">
                  <button
                    onClick={() => setGuestsOpen(true)}
                    className="w-full h-14 px-4 text-left bg-white border-2 border-transparent rounded-2xl text-sm font-medium text-gray-800 hover:border-blue-200 hover:shadow-md transition-all duration-200 focus:outline-none"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-500 shrink-0" />
                      <div>
                        <span className="block text-[10px] font-semibold text-blue-600 uppercase tracking-widest">GUESTS</span>
                        <span className="text-sm font-medium">{totalGuests} guest{totalGuests !== 1 ? 's' : ''}, 1 room</span>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="px-1 py-1">
                  <button
                    onClick={handleSearch}
                    className="w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-base transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <Search className="h-5 w-5" />
                    Search
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div ref={badgesRef} className="flex flex-wrap justify-center gap-3 mt-8">
            {[
              { icon: '🏨', label: '500+ Properties' },
              { icon: '⭐', label: '4.9 Avg Rating' },
              { icon: '🛡️', label: 'DTCM Licensed' },
              { icon: '💳', label: 'Free Cancellation' },
            ].map((b) => (
              <div key={b.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur-md border border-white/30 shadow-lg hover:bg-white/25 transition-all hover:scale-105">
                <span className="text-base">{b.icon}</span>
                <span className="text-xs font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentSlide(p => (p - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={() => setCurrentSlide(p => (p + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all hover:scale-110 active:scale-95"
        >
          <ChevronRight className="h-6 w-6" />
        </button>

        <div className="absolute bottom-8 right-6 z-20 flex gap-2">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-10 h-2.5 bg-yellow-400' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'}`}
            />
          ))}
        </div>

        <div className="absolute bottom-8 left-6 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/40 backdrop-blur-md border border-white/20">
          <span className="text-xs font-semibold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {carouselImages[currentSlide].label}
          </span>
          <span className="text-white/40 text-xs mx-1">·</span>
          <span className="text-white/60 text-xs">{currentSlide + 1}/{carouselImages.length}</span>
        </div>

        <svg className="hero-wave" viewBox="0 0 1440 80" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="white" />
        </svg>
      </div>

      <GuestSelector isOpen={guestsOpen} onClose={() => setGuestsOpen(false)} guests={guests} onGuestsChange={setGuests} />
    </>
  );
};

export default Hero;