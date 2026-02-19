import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  Heart, Share2, Star, MapPin, Users, Bed, Bath, Wifi, Car, Coffee, Tv,
  Wind, Dumbbell, WavesLadder, Shield, Clock, Phone, Mail, Calendar,
  ChevronLeft, ChevronRight, Check, X, Map as MapIcon, CalendarDays,
  ChevronDown, CheckCircle, XCircle, AlertCircle, Info, Loader2, Award,
  ThumbsUp, Home, Building, Building2, Crown, Hotel, Briefcase, Sparkles,
  Zap, Sun, Moon, Shield as ShieldIcon, Award as AwardIcon, Phone as PhoneIcon,
  Mail as MailIcon, MessageCircle, ExternalLink, Grid, Maximize2, Minimize2
} from 'lucide-react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';
import axios from 'axios';
import { baseurl } from '../../Base/Base';
import { useParams, useLocation, Link, useNavigate } from "react-router-dom";
import GoogleMapsComponent from '../../Layout/Map';
import PropertyReviews from '../../Layout/Ratereview';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const PropertyDetailsPage = ({ user, isLogged, onAuthRequired }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedDates, setSelectedDates] = useState({ checkin: '', checkout: '' });
  const [isMapExpanded, setIsMapExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [amenities, setAmenities] = useState({});
  const [property, setProperty] = useState({});
  const [showCalendar, setShowCalendar] = useState({ checkin: false, checkout: false });
  const [selectedGuests, setSelectedGuests] = useState(1);
  const [showGuestDropdown, setShowGuestDropdown] = useState(false);
  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(new Date());
  const [bookedDates, setBookedDates] = useState([]);
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const [error, setError] = useState(null);
  const [dateError, setDateError] = useState('');
  const [selectedPricingPeriod, setSelectedPricingPeriod] = useState('night');
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [showQuantityDropdown, setShowQuantityDropdown] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState('');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [dailyPrices, setDailyPrices] = useState({});
  const [isSaved, setIsSaved] = useState(false);
  const [showFullGallery, setShowFullGallery] = useState(false);
  const [galleryImageIndex, setGalleryImageIndex] = useState(0);
  const heroRef = useRef(null);
  const contentRef = useRef(null);
  const sidebarRef = useRef(null);

  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
      gsap.fromTo('.amenity-item',
        { scale: 0.85, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.5, stagger: 0.05,
          scrollTrigger: {
            trigger: '.amenities-grid',
            start: "top 80%",
            toggleActions: "play none none reverse"
          }
        }
      );
    });
    return () => ctx.revert();
  }, [property]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: document.title, url });
        showToast('Shared successfully!', 'success');
      } catch (err) {
        if (err.name !== 'AbortError') showToast('Sharing cancelled', 'warning');
      }
    } else {
      await navigator.clipboard.writeText(url);
      showToast("Link copied to clipboard!", 'success');
    }
  };

  const showToast = (message, type = 'info') => setToast({ message, type });
  const closeToast = () => setToast(null);

  const CustomToast = ({ message, type = 'default', onClose }) => {
    useEffect(() => {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }, [onClose]);

    const configs = {
      success: { bg: 'from-emerald-500 to-emerald-600', icon: <CheckCircle className="w-5 h-5" /> },
      error: { bg: 'from-red-500 to-red-600', icon: <AlertCircle className="w-5 h-5" /> },
      warning: { bg: 'from-amber-500 to-amber-600', icon: <AlertCircle className="w-5 h-5" /> },
      default: { bg: 'from-blue-600 to-blue-700', icon: <Info className="w-5 h-5" /> },
    };
    const c = configs[type] || configs.default;

    return (
      <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right-4 fade-in duration-300">
        <div className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl bg-gradient-to-r ${c.bg} text-white backdrop-blur-sm border border-white/20`}>
          {c.icon}
          <span className="text-sm font-semibold">{message}</span>
          <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center gap-2">
      <Loader2 className="w-5 h-5 animate-spin" />
      <span>Processing...</span>
    </div>
  );

  const ImageGalleryModal = ({ isOpen, onClose, images, currentIndex }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-[99999] bg-black/98 flex items-center justify-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(24,70,202,0.15)_0%,_transparent_70%)]" />
        <button onClick={onClose} className="absolute top-6 right-6 text-white/80 hover:text-white z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-sm">
          <X className="w-6 h-6" />
        </button>
        <button onClick={() => setGalleryImageIndex((prev) => (prev - 1 + images.length) % images.length)}
          className="absolute left-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-sm">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <button onClick={() => setGalleryImageIndex((prev) => (prev + 1) % images.length)}
          className="absolute right-6 top-1/2 -translate-y-1/2 text-white/80 hover:text-white z-10 bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all backdrop-blur-sm">
          <ChevronRight className="w-6 h-6" />
        </button>
        <img src={images[galleryImageIndex]?.url} alt="Gallery" className="max-w-[90vw] max-h-[85vh] object-contain rounded-2xl shadow-2xl" />
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <button key={index} onClick={() => setGalleryImageIndex(index)}
              className={`rounded-full transition-all duration-300 ${index === galleryImageIndex ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/70'}`} />
          ))}
        </div>
      </div>
    );
  };

  const SkeletonBlock = ({ className }) => <div className={`animate-pulse bg-gradient-to-r from-blue-50 via-blue-100 to-blue-50 rounded-xl ${className}`} />;

  const PropertySkeleton = () => (
    <div className="space-y-4">
      <SkeletonBlock className="h-10 w-3/4" />
      <SkeletonBlock className="h-5 w-1/2" />
      <SkeletonBlock className="h-[420px] rounded-3xl" />
      <div className="grid grid-cols-4 gap-3">
        {[...Array(4)].map((_, i) => <SkeletonBlock key={i} className="h-28" />)}
      </div>
    </div>
  );

  const SidebarSkeleton = () => (
    <div className="space-y-4">
      <SkeletonBlock className="h-10 w-1/2" />
      <SkeletonBlock className="h-14 rounded-2xl" />
      <SkeletonBlock className="h-14 rounded-2xl" />
      <SkeletonBlock className="h-14 rounded-2xl" />
      <SkeletonBlock className="h-14 rounded-2xl" />
    </div>
  );

  const getPriceForDate = useCallback((dateString) => {
    if (!property.pricing) return property.pricing?.night || 0;
    const date = new Date(dateString);
    const dayName = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'][date.getDay()];
    if (property.pricing.customDates && Array.isArray(property.pricing.customDates)) {
      for (const customDate of property.pricing.customDates) {
        const startDate = new Date(customDate.startDate);
        const endDate = new Date(customDate.endDate);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        if (date >= startDate && date <= endDate) return customDate.price || property.pricing?.night || 0;
      }
    }
    if (property.pricing.weekdays && property.pricing.weekdays[dayName]) return property.pricing.weekdays[dayName];
    return property.pricing?.night || 0;
  }, [property.pricing]);

  const getProperty = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      if (!id) throw new Error('Property ID is required');
      const response = await axios.get(`${baseurl}user/property/${id}`, { headers: { 'Content-Type': 'application/json' } });
      const data = response.data?.property;
      if (!data) throw new Error('Property not found');
      setProperty(data);
      setAmenities(data.amenities || {});
      const availablePeriods = [];
      if (data.pricing?.night) availablePeriods.push('night');
      if (data.pricing?.week) availablePeriods.push('week');
      if (data.pricing?.month) availablePeriods.push('month');
      if (data.pricing?.year) availablePeriods.push('year');
      if (availablePeriods.length > 0) setSelectedPricingPeriod(availablePeriods[0]);
      if (data.bookings && Array.isArray(data.bookings) && data.bookings.length > 0) {
        const dates = [];
        data.bookings.forEach(booking => {
          if (booking?.bookingStatus === 'confirmed' && booking?.checkIn && booking?.checkOut) {
            const checkIn = new Date(booking.checkIn);
            const checkOut = new Date(booking.checkOut);
            if (!isNaN(checkIn.getTime()) && !isNaN(checkOut.getTime())) {
              for (let dt = new Date(checkIn); dt <= checkOut; dt.setDate(dt.getDate() + 1)) dates.push(new Date(dt));
            }
          }
        });
        setBookedDates(dates);
      }
      if (data.availability?.blockedDates && Array.isArray(data.availability.blockedDates)) {
        const blocked = [];
        data.availability.blockedDates.forEach(block => {
          if (block?.startDate && block?.endDate) {
            const startDate = new Date(block.startDate);
            const endDate = new Date(block.endDate);
            if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
              for (let dt = new Date(startDate); dt <= endDate; dt.setDate(dt.getDate() + 1)) blocked.push(new Date(dt));
            }
          }
        });
        setBlockedDates(blocked);
      }
    } catch (error) {
      setError(error.message || 'Failed to load property details');
      showToast(error.message || 'Failed to load property details', 'error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { if (id) getProperty(); }, [id, getProperty]);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const checkinParam = urlParams.get('checkin');
    const checkoutParam = urlParams.get('checkout');
    const guestsParam = urlParams.get('guests');
    if (checkinParam && checkoutParam) {
      const checkinDate = new Date(checkinParam);
      const checkoutDate = new Date(checkoutParam);
      if (!isNaN(checkinDate.getTime()) && !isNaN(checkoutDate.getTime())) {
        setSelectedDates({ checkin: checkinParam, checkout: checkoutParam });
      }
    }
    if (guestsParam) {
      const guests = parseInt(guestsParam);
      if (!isNaN(guests) && guests > 0 && guests <= 20) setSelectedGuests(guests);
    }
  }, [location.search]);

  useEffect(() => {
    if (selectedDates.checkin && selectedDates.checkout && property.pricing) {
      const prices = {};
      const checkin = new Date(selectedDates.checkin);
      const checkout = new Date(selectedDates.checkout);
      for (let dt = new Date(checkin); dt < checkout; dt.setDate(dt.getDate() + 1)) {
        const dateString = dt.toISOString().split('T')[0];
        prices[dateString] = getPriceForDate(dateString);
      }
      setDailyPrices(prices);
    }
  }, [selectedDates, property.pricing, getPriceForDate]);

  const nextImage = () => { if (property.images?.length > 0) setCurrentImageIndex((prev) => (prev + 1) % property.images.length); };
  const prevImage = () => { if (property.images?.length > 0) setCurrentImageIndex((prev) => (prev - 1 + property.images.length) % property.images.length); };

  const formatPrice = (price) => {
    if (!price || isNaN(price)) return 'AED 0';
    return `AED ${parseInt(price).toLocaleString()}`;
  };

  const getAvailablePricingPeriods = () => {
    const periods = [];
    if (property.pricing?.night) periods.push({ key: 'night', label: 'Night', value: property.pricing.night });
    if (property.pricing?.week) periods.push({ key: 'week', label: 'Week', value: property.pricing.week });
    if (property.pricing?.month) periods.push({ key: 'month', label: 'Month', value: property.pricing.month });
    if (property.pricing?.year) periods.push({ key: 'year', label: 'Year', value: property.pricing.year });
    return periods;
  };

  const getCurrentPrice = () => {
    if (selectedPricingPeriod === 'night' && selectedDates.checkin) return getPriceForDate(selectedDates.checkin);
    const map = { night: property.pricing?.night, week: property.pricing?.week, month: property.pricing?.month, year: property.pricing?.year };
    return map[selectedPricingPeriod] || property.pricing?.night || 0;
  };

  const getDaysInMonth = (date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const getFirstDayOfMonth = (date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();

  const getLastBookedDateInRange = (startDate, endDate) => {
    if (!startDate || !endDate || (bookedDates.length === 0 && blockedDates.length === 0)) return null;
    const start = new Date(startDate); start.setHours(0, 0, 0, 0);
    const end = new Date(endDate); end.setHours(0, 0, 0, 0);
    const allBlocked = [...bookedDates, ...blockedDates].map(d => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; }).filter(d => d >= start && d < end).sort((a, b) => b - a);
    return allBlocked.length > 0 ? allBlocked[0] : null;
  };

  const isDateDisabled = (date, type = 'checkin') => {
    if (!date || isNaN(date.getTime())) return true;
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const checkDate = new Date(date); checkDate.setHours(0, 0, 0, 0);
    if (checkDate < today) return true;
    if (type === 'checkout' && selectedDates.checkin) {
      const checkinDate = new Date(selectedDates.checkin); checkinDate.setHours(0, 0, 0, 0);
      if (checkDate <= checkinDate) return true;
    }
    if (type === 'checkin' && (selectedPricingPeriod === 'week' || selectedPricingPeriod === 'month' || selectedPricingPeriod === 'year')) {
      let calc = new Date(checkDate);
      if (selectedPricingPeriod === 'week') calc.setDate(calc.getDate() + (selectedQuantity * 7));
      else if (selectedPricingPeriod === 'month') calc.setMonth(calc.getMonth() + selectedQuantity);
      else if (selectedPricingPeriod === 'year') calc.setFullYear(calc.getFullYear() + 1);
      if (getLastBookedDateInRange(checkDate, calc)) return true;
    }
    const allBlocked = [...bookedDates, ...blockedDates];
    return allBlocked.some(b => { const x = new Date(b); x.setHours(0, 0, 0, 0); return x.getTime() === checkDate.getTime(); });
  };

  const isDateSelected = (date, type) => {
    const selectedDate = type === 'checkin' ? selectedDates.checkin : selectedDates.checkout;
    if (!selectedDate || !date) return false;
    const sel = new Date(selectedDate); const cd = new Date(date);
    if (isNaN(sel.getTime()) || isNaN(cd.getTime())) return false;
    return cd.toDateString() === sel.toDateString();
  };

  const CustomCalendar = ({ type, onDateSelect, isOpen, onClose }) => {
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const dayNames = ["Su","Mo","Tu","We","Th","Fr","Sa"];
    const daysInMonth = getDaysInMonth(currentCalendarMonth);
    const firstDay = getFirstDayOfMonth(currentCalendarMonth);
    const today = new Date();
    if (!isOpen) return null;
    return (
      <div className="absolute top-full left-0 right-0 mt-3 z-[100]">
        <div className="bg-white rounded-3xl shadow-2xl border border-blue-100 overflow-hidden" style={{ boxShadow: '0 25px 60px rgba(24,70,202,0.15)' }}>
          <div className="bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] px-6 py-4">
            <div className="flex items-center justify-between">
              <button onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1))} className="p-2 hover:bg-white/20 rounded-full transition-all text-white">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <div className="text-center">
                <p className="text-white font-bold text-lg">{monthNames[currentCalendarMonth.getMonth()]}</p>
                <p className="text-blue-200 text-sm">{currentCalendarMonth.getFullYear()}</p>
              </div>
              <button onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1))} className="p-2 hover:bg-white/20 rounded-full transition-all text-white">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-7 mb-3">
              {dayNames.map((d, i) => <div key={i} className="text-center text-xs font-bold text-blue-400 py-2">{d}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} className="h-11" />)}
              {[...Array(daysInMonth)].map((_, idx) => {
                const day = idx + 1;
                const date = new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth(), day);
                const disabled = isDateDisabled(date, type);
                const selected = isDateSelected(date, type);
                const isToday = date.toDateString() === today.toDateString();
                const ds = date.toISOString().split('T')[0];
                const dayPrice = getPriceForDate(ds);
                return (
                  <button key={day} disabled={disabled}
                    onClick={() => {
                      if (!disabled) {
                        const y = date.getFullYear(), m = String(date.getMonth()+1).padStart(2,'0'), d2 = String(date.getDate()).padStart(2,'0');
                        onDateSelect(`${y}-${m}-${d2}`);
                        onClose();
                      }
                    }}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center transition-all duration-200 text-xs relative
                      ${selected ? 'bg-gradient-to-br from-[#1846ca] to-[#2a5ae0] text-white shadow-lg shadow-blue-200 scale-105'
                        : isToday ? 'bg-blue-50 text-[#1846ca] border-2 border-[#1846ca] font-bold'
                        : disabled ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-700 hover:bg-blue-50 hover:text-[#1846ca] cursor-pointer'}`}>
                    <span className="font-semibold text-sm">{day}</span>
                    {!disabled && selectedPricingPeriod === 'night' && dayPrice > 0 && (
                      <span className={`text-[9px] ${selected ? 'text-blue-100' : 'text-blue-400'}`}>{dayPrice.toLocaleString()}</span>
                    )}
                  </button>
                );
              })}
            </div>
            <div className="flex justify-between items-center mt-4 pt-3 border-t border-gray-100">
              <div className="flex gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-[#1846ca] inline-block" /> Selected</span>
                <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-gray-200 inline-block" /> Unavailable</span>
              </div>
              <button onClick={onClose} className="text-sm text-gray-400 hover:text-[#1846ca] font-medium transition-colors">Close</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const QuantitySelector = ({ dark = false }) => {
    const maxQ = selectedPricingPeriod === 'week' ? 52 : selectedPricingPeriod === 'month' ? 12 : 1;
    const label = selectedPricingPeriod === 'week' ? 'Weeks' : selectedPricingPeriod === 'month' ? 'Months' : 'Years';
    return (
      <div className="relative quantity-selector-container">
        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${dark ? 'text-blue-200' : 'text-blue-400'}`}>Number of {label}</label>
        <div onClick={() => setShowQuantityDropdown(!showQuantityDropdown)}
          className={`w-full p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${dark ? 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/15' : 'border-blue-100 bg-blue-50/30 hover:border-[#1846ca]'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${dark ? 'bg-white/20' : 'bg-blue-100'}`}>
              <Calendar className={`w-4 h-4 ${dark ? 'text-white' : 'text-[#1846ca]'}`} />
            </div>
            <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>{selectedQuantity} {selectedQuantity === 1 ? label.slice(0,-1) : label}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dark ? 'text-white/60' : 'text-blue-400'} ${showQuantityDropdown ? 'rotate-180' : ''}`} />
        </div>
        {showQuantityDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-blue-100 rounded-2xl shadow-2xl p-3 max-h-52 overflow-y-auto" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.18)' }}>
            {[...Array(maxQ)].map((_, i) => (
              <div key={i+1} onClick={() => { setSelectedQuantity(i+1); setShowQuantityDropdown(false); }}
                className={`p-3 rounded-xl cursor-pointer transition-colors mb-1 text-sm font-medium ${selectedQuantity === i+1 ? 'bg-[#1846ca] text-white' : 'hover:bg-blue-50 text-gray-700'}`}>
                {i+1} {i+1 === 1 ? label.slice(0,-1) : label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const MonthSelector = ({ dark = false }) => {
    const monthNames = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const cy = new Date().getFullYear();
    const months = [];
    for (let y = cy; y <= cy + 2; y++) {
      for (let m = 0; m < 12; m++) {
        const d = new Date(y, m, 1);
        if (d >= new Date()) months.push({ value: `${y}-${String(m+1).padStart(2,'0')}`, label: `${monthNames[m]} ${y}` });
      }
    }
    return (
      <div className="relative month-selector-container">
        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${dark ? 'text-blue-200' : 'text-blue-400'}`}>Starting Month</label>
        <div onClick={() => setShowMonthDropdown(!showMonthDropdown)}
          className={`w-full p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${dark ? 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/15' : 'border-blue-100 bg-blue-50/30 hover:border-[#1846ca]'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${dark ? 'bg-white/20' : 'bg-blue-100'}`}>
              <CalendarDays className={`w-4 h-4 ${dark ? 'text-white' : 'text-[#1846ca]'}`} />
            </div>
            <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>{selectedMonth ? months.find(m => m.value === selectedMonth)?.label : 'Select Month'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dark ? 'text-white/60' : 'text-blue-400'} ${showMonthDropdown ? 'rotate-180' : ''}`} />
        </div>
        {showMonthDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-blue-100 rounded-2xl shadow-2xl p-3 max-h-52 overflow-y-auto" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.18)' }}>
            {months.map(m => (
              <div key={m.value} onClick={() => { setSelectedMonth(m.value); setShowMonthDropdown(false); }}
                className={`p-3 rounded-xl cursor-pointer transition-colors mb-1 text-sm font-medium ${selectedMonth === m.value ? 'bg-[#1846ca] text-white' : 'hover:bg-blue-50 text-gray-700'}`}>
                {m.label}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const CustomDatePicker = ({ label, value, onChange, isOpen, onToggle, disabled, dark = false }) => {
    const displayDate = value && !isNaN(new Date(value).getTime()) ? new Date(value) : null;
    return (
      <div className="relative date-picker-container">
        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${dark ? 'text-blue-200' : 'text-blue-400'}`}>{label}</label>
        <div onClick={() => { if (disabled) { showToast('Complete previous selections first', 'error'); return; } onToggle(); }}
          className={`w-full p-4 border-2 rounded-2xl cursor-pointer transition-all duration-200 ${
            disabled
              ? dark ? 'border-white/10 bg-white/5 opacity-50 cursor-not-allowed' : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
              : isOpen
                ? dark ? 'border-white/60 bg-white/20 shadow-lg' : 'border-[#1846ca] bg-blue-50/50 shadow-lg shadow-blue-100'
                : dark ? 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/15' : 'border-blue-100 bg-blue-50/30 hover:border-[#1846ca]'
          }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-xl ${disabled ? dark ? 'bg-white/10' : 'bg-gray-100' : dark ? 'bg-white/20' : 'bg-blue-100'}`}>
                <CalendarDays className={`w-4 h-4 ${disabled ? dark ? 'text-white/30' : 'text-gray-400' : dark ? 'text-white' : 'text-[#1846ca]'}`} />
              </div>
              {displayDate ? (
                <div>
                  <p className={`font-bold text-base ${dark ? 'text-white' : 'text-gray-900'}`}>{displayDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
                  <p className={`text-xs ${dark ? 'text-blue-200' : 'text-gray-500'}`}>{displayDate.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric' })}</p>
                </div>
              ) : (
                <div>
                  <p className={`font-medium ${dark ? 'text-white/60' : 'text-gray-400'}`}>Select date</p>
                  <p className={`text-xs ${dark ? 'text-white/40' : 'text-gray-300'}`}>Choose {label.toLowerCase()}</p>
                </div>
              )}
            </div>
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dark ? 'text-white/60' : 'text-blue-400'} ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </div>
        {!disabled && (
          <CustomCalendar type={label.toLowerCase()} onDateSelect={onChange} isOpen={isOpen} onClose={() => setShowCalendar({ checkin: false, checkout: false })} />
        )}
      </div>
    );
  };

  const GuestSelector = ({ dark = false }) => {
    const max = property.guests || 4;
    return (
      <div className="relative guest-selector-container">
        <label className={`block text-xs font-bold uppercase tracking-widest mb-2 ${dark ? 'text-blue-200' : 'text-blue-400'}`}>Guests</label>
        <div onClick={() => setShowGuestDropdown(!showGuestDropdown)}
          className={`w-full p-4 border-2 rounded-2xl cursor-pointer transition-all flex items-center justify-between ${dark ? 'border-white/20 bg-white/10 hover:border-white/40 hover:bg-white/15' : 'border-blue-100 bg-blue-50/30 hover:border-[#1846ca]'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${dark ? 'bg-white/20' : 'bg-blue-100'}`}>
              <Users className={`w-4 h-4 ${dark ? 'text-white' : 'text-[#1846ca]'}`} />
            </div>
            <span className={`font-semibold ${dark ? 'text-white' : 'text-gray-800'}`}>{selectedGuests} {selectedGuests === 1 ? 'Guest' : 'Guests'}</span>
          </div>
          <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${dark ? 'text-white/60' : 'text-blue-400'} ${showGuestDropdown ? 'rotate-180' : ''}`} />
        </div>
        {showGuestDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-blue-100 rounded-2xl shadow-2xl p-3" style={{ boxShadow: '0 20px 40px rgba(24,70,202,0.18)' }}>
            {[...Array(max)].map((_, i) => (
              <div key={i+1} onClick={() => { setSelectedGuests(i+1); setShowGuestDropdown(false); }}
                className={`p-3 rounded-xl cursor-pointer transition-colors mb-1 text-sm font-medium ${selectedGuests === i+1 ? 'bg-[#1846ca] text-white' : 'hover:bg-blue-50 text-gray-700'}`}>
                {i+1} {i+1 === 1 ? 'Guest' : 'Guests'}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const calculateTotalUnits = () => {
    if (selectedPricingPeriod === 'night' && selectedDates.checkin && selectedDates.checkout) {
      const ci = new Date(selectedDates.checkin), co = new Date(selectedDates.checkout);
      if (isNaN(ci.getTime()) || isNaN(co.getTime())) return 1;
      const n = Math.ceil((co - ci) / 86400000);
      return n > 0 ? n : 1;
    }
    return selectedQuantity;
  };

  const calculateCheckoutDate = () => {
    if (selectedPricingPeriod === 'night' && selectedDates.checkin && selectedDates.checkout) return selectedDates.checkout;
    if (!selectedDates.checkin) return '';
    const d = new Date(selectedDates.checkin);
    if (isNaN(d.getTime())) return '';
    let co = new Date(d);
    if (selectedPricingPeriod === 'week') co.setDate(co.getDate() + (selectedQuantity * 7));
    else if (selectedPricingPeriod === 'month') co.setMonth(co.getMonth() + selectedQuantity);
    else if (selectedPricingPeriod === 'year') co.setFullYear(co.getFullYear() + 1);
    return `${co.getFullYear()}-${String(co.getMonth()+1).padStart(2,'0')}-${String(co.getDate()).padStart(2,'0')}`;
  };

  const calculateFees = () => {
    let subtotal = 0;
    if (selectedPricingPeriod === 'night' && selectedDates.checkin && selectedDates.checkout) {
      subtotal = Object.values(dailyPrices).reduce((s, p) => s + p, 0);
    } else {
      subtotal = getCurrentPrice() * calculateTotalUnits();
    }
    const cleaningFee = property.fees?.cleaningFee || 0;
    const serviceFee = property.fees?.serviceFee || 0;
    const cityTax = property.fees?.cityTourismTax ? (subtotal * property.fees.cityTourismTax / 100) : 0;
    const vat = property.fees?.vatGst ? (subtotal * property.fees.vatGst / 100) : 0;
    return { subtotal, cleaningFee, serviceFee, cityTax, vat, total: subtotal + cleaningFee + serviceFee + cityTax + vat };
  };

  const handleDateChange = (date, type) => {
    if (!date) return;
    if (type === 'checkin') {
      if (selectedPricingPeriod !== 'night') {
        let calc = new Date(date);
        if (selectedPricingPeriod === 'week') calc.setDate(calc.getDate() + (selectedQuantity * 7));
        else if (selectedPricingPeriod === 'month') calc.setMonth(calc.getMonth() + selectedQuantity);
        else if (selectedPricingPeriod === 'year') calc.setFullYear(calc.getFullYear() + 1);
        const last = getLastBookedDateInRange(date, calc);
        if (last) {
          const next = new Date(last); next.setDate(next.getDate() + 1);
          showToast(`Period has bookings. Next available: ${next.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`, 'error');
          return;
        }
        const co = new Date(calc);
        setSelectedDates({ checkin: date, checkout: `${co.getFullYear()}-${String(co.getMonth()+1).padStart(2,'0')}-${String(co.getDate()).padStart(2,'0')}` });
      } else {
        setSelectedDates({ checkin: date, checkout: '' });
      }
    } else {
      if (selectedDates.checkin && new Date(date) <= new Date(selectedDates.checkin)) {
        showToast('Check-out must be after check-in', 'error');
        return;
      }
      setSelectedDates(prev => ({ ...prev, checkout: date }));
    }
  };

  const handlePricingPeriodChange = (period) => {
    setSelectedPricingPeriod(period);
    setSelectedQuantity(1);
    setSelectedMonth('');
    setSelectedDates({ checkin: '', checkout: '' });
    setShowCalendar({ checkin: false, checkout: false });
    setDailyPrices({});
  };

  const handleBookNow = async () => {
    if (!isLogged || !user?._id) {
      if (onAuthRequired) onAuthRequired();
      else showToast('Please login before booking', 'error');
      return;
    }
    if (selectedPricingPeriod === 'month' && !selectedMonth) { showToast('Please select a starting month', 'error'); return; }
    if (!selectedDates.checkin) { showToast('Please select check-in date', 'error'); return; }
    const fees = calculateFees();
    const units = calculateTotalUnits();
    const checkoutDate = selectedPricingPeriod === 'night' ? selectedDates.checkout : calculateCheckoutDate();
    if (!checkoutDate) { showToast('Unable to calculate checkout date', 'error'); return; }
    const bookingData = {
      propertyId: property._id, checkinDate: selectedDates.checkin, checkoutDate,
      guests: selectedGuests, pricingPeriod: selectedPricingPeriod, units,
      pricePerUnit: getCurrentPrice(), subtotal: fees.subtotal, cleaningFee: fees.cleaningFee,
      serviceFee: fees.serviceFee, cityTax: fees.cityTax, vat: fees.vat, totalPrice: fees.total, userId: user._id,
    };
    try {
      setBookingLoading(true);
      const response = await axios.post(`${baseurl}user/add-booking`, bookingData, { headers: { 'Content-Type': 'application/json' }, withCredentials: true });
      if (response.status === 200 || response.status === 201) {
        const bookingId = response.data?.booking?._id;
        if (!bookingId) { showToast('Booking created, but ID missing.', 'error'); return; }
        showToast('Booking successful! Redirecting...', 'success');
        setTimeout(() => navigate(`/checkout?${new URLSearchParams({ bookingId, propertyId: property._id }).toString()}`), 1500);
      } else {
        showToast('Booking failed. Please try again.', 'error');
      }
    } catch (error) {
      if (error.response?.status === 401) {
        if (onAuthRequired) onAuthRequired();
        else showToast('Please login before booking', 'error');
      } else {
        showToast(error.response?.data?.message || 'Booking failed. Please try again.', 'error');
      }
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.date-picker-container') && !e.target.closest('.guest-selector-container') && !e.target.closest('.quantity-selector-container') && !e.target.closest('.month-selector-container')) {
        setShowCalendar({ checkin: false, checkout: false });
        setShowGuestDropdown(false);
        setShowQuantityDropdown(false);
        setShowMonthDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (error && !loading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="text-center py-20">
            <div className="w-24 h-24 rounded-3xl bg-blue-100 flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-12 h-12 text-[#1846ca]" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">Property Not Found</h1>
            <p className="text-gray-500 mb-8 max-w-md">{error}</p>
            <Link to="/property">
              <button className="px-8 py-4 bg-[#1846ca] text-white rounded-2xl font-semibold hover:bg-[#1234a0] transition-all shadow-lg shadow-blue-200">
                Browse Properties
              </button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (loading || !property._id) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-slate-50 pt-24 pb-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2"><PropertySkeleton /></div>
              <div><SidebarSkeleton /></div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const availablePricingPeriods = getAvailablePricingPeriods();
  const fees = calculateFees();
  const units = calculateTotalUnits();

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">

          <div ref={heroRef} className="mb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-blue-100 text-[#1846ca] text-xs font-bold uppercase tracking-widest rounded-full">
                    {property.propertyType || 'Property'}
                  </span>
                  {property.ratings?.average > 0 && (
                    <span className="px-3 py-1 bg-amber-50 text-amber-600 text-xs font-bold rounded-full flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-500" />
                      {property.ratings.average.toFixed(1)}
                    </span>
                  )}
                </div>
                <h1 className="text-3xl sm:text-4xl font-black text-gray-900 mb-2 leading-tight">{property.title || 'Property Title'}</h1>
                <div className="flex items-center gap-2 text-gray-500">
                  <MapPin className="w-4 h-4 text-[#1846ca]" />
                  <span className="text-sm font-medium">{property.location || 'Location'}</span>
                  {property.ratings?.total > 0 && (
                    <span className="text-sm text-gray-400">· {property.ratings.total} reviews</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={() => setIsSaved(!isSaved)}
                  className={`flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-200 ${isSaved ? 'bg-[#1846ca] text-white shadow-lg shadow-blue-200' : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-[#1846ca] hover:text-[#1846ca]'}`}>
                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
                  {isSaved ? 'Saved' : 'Save'}
                </button>
                <button onClick={handleShare}
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl font-semibold text-sm bg-white text-gray-700 border-2 border-gray-200 hover:border-[#1846ca] hover:text-[#1846ca] transition-all duration-200">
                  <Share2 className="w-4 h-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8 items-start">
            <div ref={contentRef} className="lg:col-span-2 space-y-6">

              <div className="relative rounded-3xl overflow-hidden group bg-gray-100 shadow-xl" style={{ height: '460px' }}>
                <img
                  src={property.images?.[currentImageIndex]?.url || 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop'}
                  alt="Property"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200&h=800&fit=crop'; }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                {property.images?.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 duration-200">
                      <ChevronLeft className="w-5 h-5 text-[#1846ca]" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm rounded-2xl p-3 shadow-lg hover:bg-white transition-all opacity-0 group-hover:opacity-100 duration-200">
                      <ChevronRight className="w-5 h-5 text-[#1846ca]" />
                    </button>
                  </>
                )}
                <button onClick={() => { setGalleryImageIndex(currentImageIndex); setShowFullGallery(true); }}
                  className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-2xl shadow-lg hover:bg-white transition-all">
                  <Maximize2 className="w-4 h-4 text-gray-700" />
                </button>
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {property.images?.map((_, i) => (
                    <button key={i} onClick={() => setCurrentImageIndex(i)}
                      className={`rounded-full transition-all duration-300 ${i === currentImageIndex ? 'w-8 h-2.5 bg-white' : 'w-2.5 h-2.5 bg-white/50 hover:bg-white/80'}`} />
                  ))}
                </div>
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full font-semibold">
                  {currentImageIndex + 1} / {property.images?.length || 1}
                </div>
              </div>

              {property.images?.length > 1 && (
                <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                  {property.images.slice(0, 6).map((img, i) => (
                    <div key={i} onClick={() => setCurrentImageIndex(i)}
                      className={`relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-200 ${i === currentImageIndex ? 'ring-3 ring-[#1846ca] ring-offset-2 scale-95' : 'opacity-75 hover:opacity-100 hover:scale-95'}`}
                      style={{ height: '70px' }}>
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                      {i === 5 && property.images.length > 6 && (
                        <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-sm font-bold">+{property.images.length - 6}</div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { icon: Users, label: 'Guests', value: property.guests },
                  { icon: Bed, label: 'Bedrooms', value: property.bedrooms },
                  { icon: Bed, label: 'Beds', value: property.beds },
                  { icon: Bath, label: 'Bathrooms', value: property.bathrooms },
                ].map(({ icon: Icon, label, value }, i) => (
                  <div key={i} className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm hover:shadow-md hover:border-blue-200 transition-all duration-200">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-3">
                      <Icon className="w-5 h-5 text-[#1846ca]" />
                    </div>
                    <p className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">{label}</p>
                    <p className="text-xl font-black text-gray-900">{value || '—'}</p>
                  </div>
                ))}
              </div>

              {property.propertyHighlights?.length > 0 && (
                <div className="bg-gradient-to-br from-[#1846ca] to-[#1234a0] rounded-3xl p-6 shadow-xl shadow-blue-200">
                  <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-blue-200" />
                    Property Highlights
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {property.propertyHighlights.map((h, i) => (
                      <div key={i} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-2xl px-4 py-3">
                        <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3.5 h-3.5 text-white" />
                        </div>
                        <span className="text-sm text-white font-medium">{h.name || h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
                <h2 className="text-xl font-bold text-gray-900 mb-4">About This Property</h2>
                <p className="text-gray-600 leading-relaxed text-[15px]">{property.description}</p>
              </div>

              {property.roomsAndSpaces && (
                <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Rooms & Spaces</h2>
                  <div className="space-y-5">
                    {Object.entries(property.roomsAndSpaces).map(([key, value]) => value && (
                      <div key={key} className="border-b border-gray-100 pb-5 last:border-0 last:pb-0">
                        <h3 className="font-bold text-[#1846ca] mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</h3>
                        <p className="text-gray-600 text-sm leading-relaxed">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {Object.keys(amenities).length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-[#1846ca]" />
                    Amenities
                  </h2>
                  <div className="space-y-6 amenities-grid">
                    {Object.entries(amenities).map(([category, items], i) => (
                      <div key={i}>
                        <p className="text-xs font-bold uppercase tracking-widest text-blue-400 mb-3">{category}</p>
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {Array.isArray(items) && items.map((amenity, j) => (
                            <div key={j} className="amenity-item flex items-center gap-3 p-3 rounded-2xl bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                              <div className="w-7 h-7 rounded-xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                                <Check className="w-3.5 h-3.5 text-[#1846ca]" />
                              </div>
                              <span className="text-sm text-gray-700 font-medium">{amenity.name || amenity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#1846ca]" />
                    Location
                  </h2>
                  <button onClick={() => setIsMapExpanded(!isMapExpanded)}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-[#1846ca] bg-blue-50 rounded-xl hover:bg-blue-100 transition-colors">
                    {isMapExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                    {isMapExpanded ? 'Collapse' : 'Expand'}
                  </button>
                </div>
                {property.mapLocation?.lat && property.mapLocation?.lng ? (
                  <GoogleMapsComponent lat={property.mapLocation.lat} lng={property.mapLocation.lng} location={property.location} isExpanded={isMapExpanded} />
                ) : (
                  <div className={`bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl flex items-center justify-center transition-all duration-300 ${isMapExpanded ? 'h-96' : 'h-64'}`}>
                    <div className="text-center">
                      <div className="w-16 h-16 rounded-2xl bg-white/80 flex items-center justify-center mx-auto mb-3 shadow-sm">
                        <MapIcon className="w-8 h-8 text-[#1846ca]" />
                      </div>
                      <p className="font-semibold text-gray-700">{property.location}</p>
                    </div>
                  </div>
                )}
                {property.nearbyAttractions?.length > 0 && (
                  <div className="mt-5 pt-5 border-t border-gray-100">
                    <p className="text-sm font-bold text-gray-700 mb-3">Nearby Attractions</p>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {property.nearbyAttractions.map((a, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50/50 px-3 py-2 rounded-xl">
                          <div className="w-2 h-2 rounded-full bg-[#ec920f] flex-shrink-0" />
                          <span>{a.name}</span>
                          <span className="ml-auto text-xs text-gray-400 font-medium">{a.distance}km</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {property.houseRules && (
                <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#1846ca]" />
                    House Rules
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      {[
                        { icon: Clock, label: 'Check-in', value: `After ${property.houseRules.checkIn || '3:00 PM'}` },
                        { icon: Clock, label: 'Check-out', value: `Before ${property.houseRules.checkOut || '11:00 AM'}` },
                        { icon: Users, label: 'Max Guests', value: `${property.houseRules.maxGuests || property.guests || 6} Guests` },
                      ].map(({ icon: Icon, label, value }, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-blue-50/50">
                          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                            <Icon className="w-5 h-5 text-[#1846ca]" />
                          </div>
                          <div>
                            <p className="text-xs text-gray-400 font-semibold">{label}</p>
                            <p className="font-bold text-gray-800">{value}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="space-y-3">
                      {[
                        { key: 'smoking', allowed: property.houseRules.smoking, label: 'Smoking' },
                        { key: 'parties', allowed: property.houseRules.parties, label: 'Parties & Events' },
                        { key: 'pets', allowed: property.houseRules.pets, label: 'Pets' },
                        { key: 'children', allowed: property.houseRules.children, label: 'Children' },
                      ].map(({ key, allowed, label }) => (
                        <div key={key} className={`flex items-center gap-3 p-3 rounded-2xl ${allowed ? 'bg-emerald-50' : 'bg-red-50'}`}>
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${allowed ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {allowed ? <Check className="w-4 h-4 text-emerald-600" /> : <X className="w-4 h-4 text-red-500" />}
                          </div>
                          <span className={`text-sm font-semibold ${allowed ? 'text-emerald-700' : 'text-red-600'}`}>
                            {allowed ? `${label} allowed` : `No ${label.toLowerCase()}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {property.extraServices?.length > 0 && (
                <div className="bg-white rounded-3xl p-6 border border-blue-50 shadow-sm">
                  <h2 className="text-xl font-bold text-gray-900 mb-6">Extra Services</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {property.extraServices.map((s, i) => (
                      <div key={i} className="p-5 border-2 border-blue-100 rounded-2xl hover:border-[#1846ca] hover:bg-blue-50/30 transition-all duration-200">
                        <h3 className="font-bold text-gray-900 mb-1">{s.name}</h3>
                        <p className="text-gray-500 text-sm mb-3">{s.description}</p>
                        <p className="font-black text-[#1846ca] text-lg">AED {s.price} <span className="text-xs font-medium text-gray-400">per trip</span></p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <PropertyReviews propertyId={id} baseurl={baseurl} />
            </div>

            <div ref={sidebarRef} className="lg:col-span-1">
              <div className="sticky top-24 space-y-5">

                <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ boxShadow: '0 25px 50px rgba(24,70,202,0.22)' }}>

                  <div className="p-6" style={{ background: 'linear-gradient(145deg, #1846ca 0%, #1a3fb5 60%, #0f2d8a 100%)' }}>
                    <div className="flex items-baseline gap-2 mb-5">
                      <span className="text-4xl font-black text-white">{formatPrice(getCurrentPrice())}</span>
                      <span className="text-blue-200 font-medium text-base">/{selectedPricingPeriod}</span>
                    </div>

                    {availablePricingPeriods.length > 1 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {availablePricingPeriods.map((p) => (
                          <button key={p.key} onClick={() => handlePricingPeriodChange(p.key)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wide transition-all duration-200 ${selectedPricingPeriod === p.key ? 'bg-white text-[#1846ca] shadow-md' : 'bg-white/15 text-white hover:bg-white/25 border border-white/20'}`}>
                            {p.label}
                          </button>
                        ))}
                      </div>
                    )}

                    <div className="space-y-3 mb-5">
                      {(selectedPricingPeriod === 'week' || selectedPricingPeriod === 'month' || selectedPricingPeriod === 'year') && <QuantitySelector dark={true} />}
                      {selectedPricingPeriod === 'month' && <MonthSelector dark={true} />}
                      <CustomDatePicker dark={true} label="Check-in" value={selectedDates.checkin} onChange={(d) => handleDateChange(d, 'checkin')} isOpen={showCalendar.checkin} onToggle={() => setShowCalendar({ checkin: !showCalendar.checkin, checkout: false })} disabled={selectedPricingPeriod === 'month' && !selectedMonth} />
                      {selectedPricingPeriod === 'night' && (
                        <CustomDatePicker dark={true} label="Check-out" value={selectedDates.checkout} onChange={(d) => handleDateChange(d, 'checkout')} isOpen={showCalendar.checkout} onToggle={() => setShowCalendar({ checkin: false, checkout: !showCalendar.checkout })} disabled={!selectedDates.checkin} />
                      )}
                      <GuestSelector dark={true} />
                    </div>

                    <button onClick={handleBookNow}
                      disabled={bookingLoading}
                      className="w-full py-4 rounded-2xl font-black text-[#1846ca] text-base bg-white hover:bg-blue-50 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-xl"
                      style={{ boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}>
                      {bookingLoading ? <LoadingSpinner /> : 'Reserve Now'}
                    </button>

                    {!selectedDates.checkin && (
                      <p className="text-center text-blue-200 text-xs mt-3 font-medium">Select dates above to continue</p>
                    )}
                  </div>

                  <div className="bg-white p-6">
                    {selectedPricingPeriod === 'night' && Object.keys(dailyPrices).length > 0 && (
                      <div className="mb-4 pb-4 border-b border-gray-100">
                        <p className="font-bold text-gray-500 mb-3 text-xs uppercase tracking-widest">Daily Breakdown</p>
                        <div className="space-y-2 max-h-36 overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                          {Object.entries(dailyPrices).map(([date, price]) => (
                            <div key={date} className="flex justify-between items-center text-xs">
                              <span className="text-gray-500">{new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              <span className="font-bold text-[#1846ca]">{formatPrice(price)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-500">{formatPrice(getCurrentPrice())} × {units} {selectedPricingPeriod}{units > 1 ? 's' : ''}</span>
                        <span className="font-semibold text-gray-800">{formatPrice(fees.subtotal)}</span>
                      </div>
                      {fees.cleaningFee > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Cleaning fee</span>
                          <span className="font-semibold text-gray-800">{formatPrice(fees.cleaningFee)}</span>
                        </div>
                      )}
                      {fees.serviceFee > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">Service fee</span>
                          <span className="font-semibold text-gray-800">{formatPrice(fees.serviceFee)}</span>
                        </div>
                      )}
                      {fees.cityTax > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">City Tax ({property.fees?.cityTourismTax}%)</span>
                          <span className="font-semibold text-gray-800">{formatPrice(fees.cityTax)}</span>
                        </div>
                      )}
                      {fees.vat > 0 && (
                        <div className="flex justify-between items-center">
                          <span className="text-gray-500">VAT ({property.fees?.vatGst}%)</span>
                          <span className="font-semibold text-gray-800">{formatPrice(fees.vat)}</span>
                        </div>
                      )}
                      <div className="border-t-2 border-gray-100 pt-3 flex justify-between items-center">
                        <span className="font-black text-gray-900 text-base">Total</span>
                        <span className="font-black text-[#1846ca] text-2xl">{formatPrice(fees.total)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm border border-blue-50">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#1846ca] to-[#2a5ae0] flex items-center justify-center shadow-lg shadow-blue-200">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <p className="font-bold text-gray-900">Wavescation Team</p>
                      <p className="text-xs text-gray-400">Professional Management</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                    <Clock className="w-4 h-4 text-[#1846ca]" />
                    <span>Responds within an hour</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <a href="tel:+971555175056">
                      <button className="w-full py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#1846ca] font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                        <PhoneIcon className="w-4 h-4" /> Call
                      </button>
                    </a>
                    <a href="mailto:info@wavescation.com">
                      <button className="w-full py-3 rounded-2xl bg-blue-50 hover:bg-blue-100 text-[#1846ca] font-semibold text-sm flex items-center justify-center gap-2 transition-colors">
                        <MailIcon className="w-4 h-4" /> Email
                      </button>
                    </a>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-5 shadow-sm border border-blue-50">
                  <p className="font-bold text-gray-900 mb-4">Quick Info</p>
                  <div className="space-y-3">
                    {[
                      { label: 'Property ID', value: `#${property._id?.slice(-8) || 'N/A'}`, color: 'text-[#1846ca]' },
                      { label: 'Minimum Stay', value: `1 ${selectedPricingPeriod}`, color: 'text-gray-800' },
                    ].map(({ label, value, color }, i) => (
                      <div key={i} className="flex justify-between items-center py-2 border-b border-gray-50 last:border-0">
                        <span className="text-gray-400 text-sm">{label}</span>
                        <span className={`font-bold text-sm ${color}`}>{value}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center py-2 border-b border-gray-50">
                      <span className="text-gray-400 text-sm">Instant Booking</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm"><CheckCircle className="w-4 h-4" /> Yes</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-400 text-sm">Free Cancellation</span>
                      <span className="flex items-center gap-1 text-emerald-600 font-bold text-sm"><CheckCircle className="w-4 h-4" /> Yes</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 relative overflow-hidden rounded-3xl shadow-2xl" style={{ background: 'linear-gradient(135deg, #0f2d8a 0%, #1846ca 50%, #2a5ae0 100%)' }}>
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.2) 0%, transparent 50%)' }} />
            <div className="relative z-10 p-10 text-center max-w-2xl mx-auto">
              <p className="text-blue-200 text-sm font-bold uppercase tracking-widest mb-3">Ready to Stay?</p>
              <h2 className="text-3xl font-black text-white mb-4">Experience Luxury Living</h2>
              <p className="text-blue-100 mb-8 leading-relaxed">Book now for the best rates and instant confirmation. Your dream stay awaits.</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={handleBookNow}
                  disabled={!selectedDates.checkin || bookingLoading || (selectedPricingPeriod === 'month' && !selectedMonth)}
                  className="px-8 py-4 rounded-2xl font-bold text-[#1846ca] bg-white hover:bg-blue-50 transition-all hover:scale-105 active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100">
                  {bookingLoading ? <LoadingSpinner /> : `Book — ${formatPrice(getCurrentPrice())}/${selectedPricingPeriod}`}
                </button>
                <Link to="/property">
                  <button className="px-8 py-4 border-2 border-white/40 text-white rounded-2xl font-bold hover:bg-white/10 transition-all hover:scale-105 active:scale-95">
                    More Properties
                  </button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-10 py-6 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap gap-6 text-sm text-gray-400">
              {['Privacy Policy', 'Terms of Service', 'Support', 'Contact'].map(l => (
                <a key={l} href="#" className="hover:text-[#1846ca] transition-colors font-medium">{l}</a>
              ))}
            </div>
            <p className="text-sm text-gray-400">© 2025 Wavescation. All rights reserved.</p>
          </div>
        </div>
      </div>

      <ImageGalleryModal isOpen={showFullGallery} onClose={() => setShowFullGallery(false)} images={property.images || []} currentIndex={galleryImageIndex} />

      <div className="fixed right-5 bottom-24 flex flex-col gap-3 z-50">
        {[
          { href: 'https://wa.me/971555175056', img: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg', alt: 'WhatsApp' },
          { href: 'mailto:info@wavescation.com', img: 'https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png', alt: 'Email' },
        ].map(({ href, img, alt }) => (
          <a key={alt} href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
            className="w-12 h-12 bg-white rounded-2xl shadow-xl flex items-center justify-center hover:scale-110 transition-all border border-gray-100 hover:border-[#1846ca] hover:shadow-blue-100">
            <img src={img} alt={alt} className="w-6 h-6" />
          </a>
        ))}
        <a href="tel:+971555175056" className="w-12 h-12 bg-[#1846ca] rounded-2xl shadow-xl shadow-blue-200 flex items-center justify-center hover:scale-110 transition-all">
          <PhoneIcon className="w-5 h-5 text-white" />
        </a>
      </div>

      <Footer />

      {toast && <CustomToast message={toast.message} type={toast.type} onClose={closeToast} />}
    </>
  );
};

export default PropertyDetailsPage;