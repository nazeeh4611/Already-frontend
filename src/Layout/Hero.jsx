import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Calendar, Users, ChevronLeft, ChevronRight, Plus, Minus, MapPin } from 'lucide-react';
import { createPortal } from "react-dom";
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gsap from "gsap";

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

  useEffect(() => {
    if (isOpen && calendarRef.current) {
      gsap.fromTo(calendarRef.current,
        { scale: 0.92, opacity: 0, y: 16 },
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.7)" }
      );
    }
  }, [isOpen]);

  const toggleCalendar = useCallback(() => setIsOpen(o => !o), []);

  useEffect(() => {
    const handler = (e) => {
      if (!e.target.closest('.dp-wrapper')) setIsOpen(false);
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
        onClick={toggleCalendar}
        className="w-full h-14 px-4 text-left bg-white border-2 border-transparent rounded-2xl text-sm font-medium focus:outline-none transition-all duration-200 hover:border-blue-200"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-4 w-4 text-blue-400 shrink-0" />
          <div>
            <span className="block text-[10px] font-semibold text-blue-500 uppercase tracking-widest">{placeholder}</span>
            {value ? (
              <span className="text-gray-800 text-sm">{formatDate(new Date(value))}</span>
            ) : (
              <span className="text-gray-400 text-sm">Select date</span>
            )}
          </div>
        </div>
      </button>

      {isOpen && createPortal(
        <div className="fixed inset-0 z-[99999] flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={toggleCalendar} />
          <div ref={calendarRef} className="relative bg-white rounded-3xl shadow-2xl p-6 w-[340px] border border-blue-100">
            <div className="flex items-center justify-between mb-5">
              <button onClick={() => { const d = new Date(selectedDate); d.setMonth(d.getMonth()-1); setSelectedDate(d); }} className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
                <ChevronLeft className="h-4 w-4 text-blue-600" />
              </button>
              <span className="font-bold text-gray-800" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
              </span>
              <button onClick={() => { const d = new Date(selectedDate); d.setMonth(d.getMonth()+1); setSelectedDate(d); }} className="w-9 h-9 rounded-xl bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
                <ChevronRight className="h-4 w-4 text-blue-600" />
              </button>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-3">
              {dayNames.map(d => <div key={d} className="text-center text-[11px] font-semibold text-gray-400">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {generateCalendar().map((date, i) => {
                const past = isBeforeMinDate(date);
                return (
                  <button key={i} onClick={() => handleDateSelect(date)} disabled={past}
                    className={`h-10 w-full rounded-xl text-sm font-medium transition-all duration-150
                      ${past ? 'text-gray-300 cursor-not-allowed' : ''}
                      ${!past && isSameMonth(date) ? 'text-gray-700 hover:bg-blue-600 hover:text-white' : ''}
                      ${!past && !isSameMonth(date) ? 'text-gray-300' : ''}
                      ${isSelected(date) ? '!bg-blue-600 !text-white shadow-md' : ''}
                      ${isToday(date) && !isSelected(date) ? 'border-2 border-blue-400 text-blue-600 font-bold' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
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
        { scale: 1, opacity: 1, y: 0, duration: 0.35, ease: "back.out(1.7)" }
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
    <div className="fixed inset-0 z-[99999] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div ref={modalRef} className="relative bg-white rounded-3xl shadow-2xl p-8 w-[360px] border border-blue-100">
        <h3 className="text-xl font-bold text-gray-900 mb-6" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>Select Guests</h3>
        <div className="space-y-5">
          {['adults','children','infants'].map((type) => (
            <div key={type} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div>
                <p className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{type.charAt(0).toUpperCase() + type.slice(1)}</p>
                <p className="text-xs text-gray-400">{type==='adults'?'Ages 13+':type==='children'?'Ages 2–12':'Under 2'}</p>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => update(type,'decrement')} disabled={guests[type] <= (type==='adults'?1:0)}
                  className="w-9 h-9 rounded-xl border-2 border-blue-200 flex items-center justify-center text-blue-600 disabled:opacity-30 hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="w-6 text-center font-bold text-gray-800 text-sm">{guests[type]}</span>
                <button onClick={() => update(type,'increment')} disabled={guests[type] >= (type==='adults'?16:5)}
                  className="w-9 h-9 rounded-xl border-2 border-blue-200 flex items-center justify-center text-blue-600 disabled:opacity-30 hover:border-blue-500 hover:bg-blue-50 transition-all">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="w-full mt-6 py-3 rounded-xl font-semibold text-white text-sm transition-all hover:shadow-lg hover:scale-105"
          style={{ background: "linear-gradient(135deg, #1d4ed8, #1e40af)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
          Done
        </button>
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
  const searchRef = useRef(null);
  const badgesRef = useRef(null);
  const slidesRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(titleRef.current,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, delay: 0.3, ease: "power3.out" }
      );
      gsap.fromTo(searchRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, delay: 0.6, ease: "power2.out" }
      );
      if (badgesRef.current?.children) {
        gsap.fromTo(badgesRef.current.children,
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.7, stagger: 0.1, delay: 1, ease: "power2.out" }
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
          scale: index === currentSlide ? 1 : 1.06,
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
      `}</style>

      <div className="relative overflow-hidden" style={{ paddingTop: '68px', minHeight: '580px' }}>
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
          <div className="absolute inset-0" style={{ background: 'linear-gradient(160deg, rgba(30,58,138,0.83) 0%, rgba(29,78,216,0.72) 50%, rgba(59,130,246,0.56) 100%)' }} />
          <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 md:py-20">
          <div ref={titleRef} className="text-center mb-10">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur border border-white/20">
              <MapPin className="w-3.5 h-3.5 text-yellow-300" />
              <span className="text-xs font-semibold text-white/90 tracking-wider uppercase" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                Gulf Countries · South Africa · Central Europe
              </span>
            </div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>
              Find Your Next Stay
            </h1>
            <p className="text-lg text-blue-100/80 max-w-xl mx-auto" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Best Hotels Deals — handpicked luxury properties for every journey
            </p>
          </div>

          <div ref={searchRef} className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-2 md:p-3 border border-blue-100">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-1">
                <div className="px-1 py-1 lg:border-r border-gray-100">
                  <CustomDatePicker value={checkIn} onChange={setCheckIn} placeholder="Check in" />
                </div>
                <div className="px-1 py-1 lg:border-r border-gray-100">
                  <CustomDatePicker value={checkOut} onChange={setCheckOut} placeholder="Check out" minDate={minCheckOut} />
                </div>
                <div className="px-1 py-1 lg:border-r border-gray-100">
                  <button
                    onClick={() => setGuestsOpen(true)}
                    className="w-full h-14 px-4 text-left bg-white border-2 border-transparent rounded-2xl text-sm font-medium text-gray-800 hover:border-blue-200 transition-all duration-200 focus:outline-none"
                    style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="block text-[10px] font-semibold text-blue-500 uppercase tracking-widest">Guests</span>
                        <span className="text-sm">{totalGuests} guest{totalGuests !== 1 ? 's' : ''}, 1 room</span>
                      </div>
                    </div>
                  </button>
                </div>
                <div className="px-1 py-1">
                  <button
                    onClick={handleSearch}
                    className="w-full h-14 rounded-2xl font-bold text-white flex items-center justify-center gap-2 text-sm transition-all duration-200 hover:shadow-xl hover:scale-105 active:scale-95"
                    style={{ background: "linear-gradient(135deg, #f59e0b, #d97706)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  >
                    <Search className="h-4 w-4" />
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
              <div key={b.label} className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/15 backdrop-blur border border-white/20">
                <span className="text-sm">{b.icon}</span>
                <span className="text-xs font-semibold text-white/90" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{b.label}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => setCurrentSlide(p => (p - 1 + carouselImages.length) % carouselImages.length)}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={() => setCurrentSlide(p => (p + 1) % carouselImages.length)}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-xl bg-white/20 backdrop-blur border border-white/30 flex items-center justify-center text-white hover:bg-white/35 transition-all"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <div className="absolute bottom-10 right-6 z-20 flex gap-2">
          {carouselImages.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 h-2.5 bg-yellow-400' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`}
            />
          ))}
        </div>

        <div className="absolute bottom-10 left-6 z-20 hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-black/30 backdrop-blur border border-white/15">
          <span className="text-xs font-semibold text-white/80" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            {carouselImages[currentSlide].label}
          </span>
          <span className="text-white/40 text-xs mx-1">·</span>
          <span className="text-white/50 text-xs">{currentSlide + 1}/{carouselImages.length}</span>
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