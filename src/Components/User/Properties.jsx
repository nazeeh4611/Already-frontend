import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import {
  Search,
  Heart,
  ChevronLeft,
  ChevronRight,
  Eye,
  X,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Users,
  Square,
  Star,
  Loader2,
  AlertCircle,
  Home,
  Building,
  Building2,
  Crown,
  Hotel,
  Briefcase,
  Calendar,
  ChevronDown,
  Plus,
  Minus,
  XCircle,
  Wifi,
  Coffee,
  Wind,
  Tv,
  Car,
  Shield
} from "lucide-react";
import { createPortal } from "react-dom";
import axios from "axios";
import { baseurl } from "../../Base/Base";
import Navbar from "../../Layout/Navbar";
import Footer from "../../Layout/Footer";

gsap.registerPlugin(ScrollTrigger);

// Color theme constants
const colors = {
  primary: '#fefefd',
  secondary: '#1846ca',
  accent: '#ec920f',
  text: '#1a1a1a',
  textLight: '#6b7280'
};

const CustomDatePicker = React.memo(({ value, onChange, placeholder, minDate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const dropdownRef = useRef(null);

  const toggleCalendar = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const formatDate = useCallback((date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  }, []);

  const generateCalendar = useMemo(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(startDate);
      currentDate.setDate(startDate.getDate() + i);
      days.push(currentDate);
    }
    
    return days;
  }, [selectedDate]);

  const isToday = useCallback((date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }, []);

  const isSameMonth = useCallback((date) => {
    return date.getMonth() === selectedDate.getMonth();
  }, [selectedDate]);

  const isSelected = useCallback((date) => {
    return value && date.toDateString() === new Date(value).toDateString();
  }, [value]);

  const isBeforeMinDate = useCallback((date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    let compareDate = today;
    
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      compareDate = min > today ? min : today;
    }
    
    const checkDate = new Date(date);
    checkDate.setHours(0, 0, 0, 0);
    
    return checkDate < compareDate;
  }, [minDate]);

  const handleDateSelect = useCallback((date) => {
    if (isBeforeMinDate(date)) {
      toast.error('Cannot select past dates', {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      return;
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const formattedDate = `${year}-${month}-${day}`; 
    onChange(formattedDate);
    setIsOpen(false);
  }, [onChange, isBeforeMinDate]);

  const nextMonth = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + 1);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const prevMonth = useCallback(() => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() - 1);
    setSelectedDate(newDate);
  }, [selectedDate]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="relative w-full">
      <div className="relative group">
        <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-[#1846ca] transition-colors z-10" />
        <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-[#1846ca] transition-colors z-10" />
        <button
          onClick={toggleCalendar}
          className="w-full h-11 pl-10 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1846ca] focus:ring-2 focus:ring-[#1846ca]/20 transition-all duration-300 hover:border-[#1846ca] hover:shadow-md bg-white cursor-pointer text-gray-900 text-sm text-left"
        >
          {value ? formatDate(new Date(value)) : placeholder}
        </button>
      </div>

      {isOpen &&
        createPortal(
          <div className="fixed inset-0 z-[99999]">
            <div
              className="absolute inset-0 bg-black/30 backdrop-blur-sm"
              onClick={toggleCalendar}
            />
            <div
              ref={dropdownRef}
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 
                         bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 
                         p-6 w-80 z-[100000]"
            >
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={prevMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronLeft className="h-5 w-5 text-[#1846ca]" />
                </button>
                <h3 className="text-lg font-semibold">
                  {monthNames[selectedDate.getMonth()]} {selectedDate.getFullYear()}
                </h3>
                <button
                  onClick={nextMonth}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <ChevronRight className="h-5 w-5 text-[#1846ca]" />
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 mb-2">
                {dayNames.map(day => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
                    {day}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {generateCalendar.map((date, index) => (
                  <button
                    key={index}
                    onClick={() => handleDateSelect(date)}
                    disabled={isBeforeMinDate(date)}
                    className={`
                      h-10 w-full rounded-lg text-sm font-medium transition-all duration-200
                      ${!isSameMonth(date) ? 'text-gray-300' : 'text-gray-700'}
                      ${isSelected(date) ? 'bg-[#1846ca] text-white' : ''}
                      ${isToday(date) && !isSelected(date) ? 'bg-[#ec920f] text-white' : ''}
                      ${!isSelected(date) && !isToday(date) && !isBeforeMinDate(date) ? 'hover:bg-gray-100' : ''}
                      ${isBeforeMinDate(date) ? 'opacity-30 cursor-not-allowed' : ''}
                    `}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          </div>,
          document.body
        )}
    </div>
  );
});

const GuestSelector = React.memo(({ isOpen, onClose, guests, onGuestsChange }) => {
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const updateGuestCount = useCallback((type, operation) => {
    const newGuests = { ...guests };
    if (operation === 'increment') {
      newGuests[type] = Math.min(newGuests[type] + 1, type === 'adults' ? 16 : 5);
    } else {
      newGuests[type] = Math.max(newGuests[type] - 1, type === 'adults' ? 1 : 0);
    }
    onGuestsChange(newGuests);
  }, [guests, onGuestsChange]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[99999]">
      <div 
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />
      <div 
        ref={dropdownRef}
        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-100 p-6 min-w-[320px]"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-black">Adults</div>
              <div className="text-sm text-gray-500">Ages 13 or above</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGuestCount('adults', 'decrement')}
                disabled={guests.adults <= 1}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1846ca] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Minus className="h-4 w-4 text-[#1846ca]" />
              </button>
              <span className="w-8 text-center font-medium">{guests.adults}</span>
              <button
                onClick={() => updateGuestCount('adults', 'increment')}
                disabled={guests.adults >= 16}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1846ca] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="h-4 w-4 text-[#1846ca]" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-black">Children</div>
              <div className="text-sm text-gray-500">Ages 2-12</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGuestCount('children', 'decrement')}
                disabled={guests.children <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1846ca] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Minus className="h-4 w-4 text-[#1846ca]" />
              </button>
              <span className="w-8 text-center font-medium">{guests.children}</span>
              <button
                onClick={() => updateGuestCount('children', 'increment')}
                disabled={guests.children >= 5}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1846ca] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="h-4 w-4 text-[#1846ca]" />
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="font-medium text-black">Infants</div>
              <div className="text-sm text-gray-500">Under 2</div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateGuestCount('infants', 'decrement')}
                disabled={guests.infants <= 0}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1846ca] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Minus className="h-4 w-4 text-[#1846ca]" />
              </button>
              <span className="w-8 text-center font-medium">{guests.infants}</span>
              <button
                onClick={() => updateGuestCount('infants', 'increment')}
                disabled={guests.infants >= 5}
                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-[#1846ca] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                <Plus className="h-4 w-4 text-[#1846ca]" />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={onClose}
              className="w-full px-4 py-2 bg-[#ec920f] text-white rounded-xl hover:bg-[#d8840e] transition-colors font-medium"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
});

const NeighborhoodScroller = React.memo(({ neighborhoods, filters, onNeighborhoodClick }) => {
  const scrollContainerRef = useRef(null);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(true);

  const checkScrollButtons = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setShowLeftButton(scrollLeft > 0);
      setShowRightButton(scrollLeft < scrollWidth - clientWidth - 1);
    }
  }, []);

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScrollButtons);
      return () => container.removeEventListener('scroll', checkScrollButtons);
    }
  }, [neighborhoods, checkScrollButtons]);

  const scroll = useCallback((direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = 200;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  }, []);

  useEffect(() => {
    gsap.fromTo(scrollContainerRef.current,
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, scrollTrigger: {
        trigger: scrollContainerRef.current,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }}
    );
  }, []);

  if (neighborhoods.length === 0) return null;

  return (
    <section className="mb-8">
      <div className="relative bg-[#1846ca] rounded-2xl shadow-sm border border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-white mb-4">Popular Neighborhoods</h3>
        
        <div className="relative">
          {showLeftButton && (
            <button
              onClick={() => scroll('left')}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 hover:bg-gray-50 p-2 rounded-full transition-all duration-300"
            >
              <ChevronLeft className="h-5 w-5 text-[#1846ca]" />
            </button>
          )}
          
          {showRightButton && (
            <button
              onClick={() => scroll('right')}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-lg border border-gray-200 hover:bg-gray-50 p-2 rounded-full transition-all duration-300"
            >
              <ChevronRight className="h-5 w-5 text-[#1846ca]" />
            </button>
          )}
          
          <div
            ref={scrollContainerRef}
            className="flex gap-4 overflow-x-auto scrollbar-hide py-2 px-8"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              WebkitScrollbar: { display: 'none' }
            }}
          >
            {neighborhoods.map((neighborhood) => (
              <button
                key={neighborhood.name || neighborhood._id}
                onClick={() => onNeighborhoodClick(neighborhood.name)}
                className={`flex-shrink-0 px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 ${
                  filters.neighborhood === neighborhood.name
                    ? 'bg-[#ffffff] text-white shadow-lg'
                    : 'bg-gray-100 hover:bg-[#fffff]/10 text-gray-700 hover:text-[#000000]'
                }`}
              >
                {neighborhood.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
});

const Pagination = React.memo(({ currentPage, totalPages, onPageChange, itemsPerPage, totalItems }) => {
  const getVisiblePages = useMemo(() => {
    const pages = [];
    const showPages = 5;
    
    if (totalPages <= showPages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      let start = Math.max(1, currentPage - Math.floor(showPages / 2));
      let end = Math.min(totalPages, start + showPages - 1);
      
      if (end - start + 1 < showPages) {
        start = Math.max(1, end - showPages + 1);
      }
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }
    
    return pages;
  }, [currentPage, totalPages]);

  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8 px-4">
      <div className="text-sm text-gray-600">
        Showing {startItem} to {endItem} of {totalItems} properties
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronLeft className="h-4 w-4 text-[#1846ca]" />
        </button>
        
        {getVisiblePages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? 'bg-[#1846ca] text-white shadow-md'
                : 'border border-gray-200 hover:bg-gray-50 text-gray-700'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          <ChevronRight className="h-4 w-4 text-[#1846ca]" />
        </button>
      </div>
      
      <div className="text-sm text-gray-600">
        Page {currentPage} of {totalPages}
      </div>
    </div>
  );
});

const StarRating = React.memo(({ rating, showCount = false, count = 0, size = 16 }) => {
  if (!rating || rating === 0) return null;
  
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  
  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={`${
              star <= fullStars
                ? 'fill-[#ec920f] text-[#ec920f]'
                : star === fullStars + 1 && hasHalfStar
                ? 'fill-[#ec920f] text-[#ec920f] opacity-50'
                : 'fill-gray-300 text-gray-300'
            }`}
          />
        ))}
      </div>
      <span className="text-sm font-semibold text-gray-700 ml-1">
        {rating.toFixed(1)}
      </span>
      {showCount && count > 0 && (
        <span className="text-xs text-gray-500">
          ({count})
        </span>
      )}
    </div>
  );
});

const PropertyCard = React.memo(({ property, index, likedProperties, onToggleLike, onPropertyClick, hoveredProperty, onMouseEnter, onMouseLeave }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardRef = useRef(null);
  
  const propertyTypes = useMemo(() => [
    { value: "Apartment", label: "Apartment", icon: <Building size={16} /> },
    { value: "Villa", label: "Villa", icon: <Home size={16} /> },
    { value: "Studio", label: "Studio", icon: <Building2 size={16} /> },
    { value: "Penthouse", label: "Penthouse", icon: <Crown size={16} /> },
    { value: "Townhouse", label: "Townhouse", icon: <Hotel size={16} /> },
    { value: "Office", label: "Office", icon: <Briefcase size={16} /> }
  ], []);

  useEffect(() => {
    gsap.fromTo(cardRef.current,
      { y: 30, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.6, 
        delay: index * 0.05,
        ease: "power2.out",
        scrollTrigger: {
          trigger: cardRef.current,
          start: "top 85%",
          end: "bottom 15%",
          toggleActions: "play none none reverse"
        }
      }
    );
  }, [index]);

  const handleToggleLike = useCallback((e) => {
    e.stopPropagation();
    onToggleLike(property._id);
  }, [property._id, onToggleLike]);

  const handleClick = useCallback(() => {
    onPropertyClick(property._id, index);
  }, [property._id, index, onPropertyClick]);

  const handleViewClick = useCallback((e) => {
    e.stopPropagation();
    onPropertyClick(property._id, index);
  }, [property._id, index, onPropertyClick]);

  const getDisplayPrice = useCallback(() => {
    if (!property.pricing) {
      return { price: null, period: '' };
    }
    
    if (property.pricing.night !== undefined && property.pricing.night !== null && property.pricing.night > 0) {
      return { price: property.pricing.night, period: '/night' };
    }
    
    if (property.pricing.week !== undefined && property.pricing.week !== null && property.pricing.week > 0) {
      return { price: property.pricing.week, period: '/week' };
    }
    
    if (property.pricing.month !== undefined && property.pricing.month !== null && property.pricing.month > 0) {
      return { price: property.pricing.month, period: '/month' };
    }
    
    if (property.pricing.year !== undefined && property.pricing.year !== null && property.pricing.year > 0) {
      return { price: property.pricing.year, period: '/year' };
    }
    
    return { price: null, period: '' };
  }, [property.pricing]);

  const displayPrice = useMemo(() => getDisplayPrice(), [getDisplayPrice]);

  const hasRatings = property.ratings && property.ratings.average > 0;
  const rating = hasRatings ? property.ratings.average : 0;
  const reviewCount = hasRatings ? property.ratings.total : 0;

  return (
    <article
      ref={cardRef}
      onMouseEnter={() => onMouseEnter(property._id)}
      onMouseLeave={() => onMouseLeave(null)}
      className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 overflow-hidden transition-all duration-300 cursor-pointer"
      onClick={handleClick}
    >
      <div className="relative h-56 overflow-hidden bg-gray-100">
        {property.images && property.images.length > 0 ? (
          <>
            {!imageLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-[#1846ca] animate-spin" />
              </div>
            )}
            <img
              src={hoveredProperty === property._id && property.images[1] 
                ? property.images[1].url 
                : property.images[0].url}
              alt={property.title}
              className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
            />
          </>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No Image</span>
          </div>
        )}

        <div className="absolute top-3 left-3">
          <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-full text-xs font-medium text-gray-700 shadow-sm">
            {propertyTypes.find(t => t.value === property.type)?.icon}
            <span>{property.type}</span>
          </div>
        </div>

        {property.images && property.images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            {property.images.length} photos
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-base text-gray-900 line-clamp-1 flex-1">
            {property.title || "Untitled Property"}
          </h3>
          {hasRatings && (
            <div className="flex items-center gap-1 bg-[#ec920f]/10 px-2 py-1 rounded-full">
              <Star className="h-3 w-3 fill-[#ec920f] text-[#ec920f]" />
              <span className="text-xs font-medium text-gray-700">{rating.toFixed(1)}</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center text-gray-500 text-xs gap-1 mb-3">
          <MapPin size={12} className="text-[#1846ca]" />
          <span className="line-clamp-1">
            {property.neighborhood?.name || property.location || "Location not specified"}
          </span>
        </div>

        <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
          {property.bedrooms && (
            <div className="flex items-center gap-1">
              <Bed size={14} className="text-[#1846ca]" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'Bed' : 'Beds'}</span>
            </div>
          )}
          {property.bathrooms && (
            <div className="flex items-center gap-1">
              <Bath size={14} className="text-[#1846ca]" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'Bath' : 'Baths'}</span>
            </div>
          )}
          {property.guests && (
            <div className="flex items-center gap-1">
              <Users size={14} className="text-[#1846ca]" />
              <span>Up to {property.guests} guests</span>
            </div>
          )}
        </div>

        {property.amenities?.general && property.amenities.general.length > 0 && (
          <div className="flex items-center gap-1 mb-4">
            {property.amenities.general.slice(0, 3).map((amenity, idx) => (
              <span key={idx} className="bg-gray-50 text-gray-600 px-2 py-1 rounded-md text-xs border border-gray-100">
                {amenity.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-end justify-between pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-bold text-[#1846ca]">
              AED {displayPrice.price !== null ? displayPrice.price.toLocaleString() : 'N/A'}
            </span>
            <span className="text-gray-500 text-xs ml-1">{displayPrice.period}</span>
          </div>
          <button
            onClick={handleViewClick}
            className="px-4 py-2 bg-[#ec920f] hover:bg-[#d6820e] text-white rounded-lg transition-all duration-300 text-xs font-medium shadow-sm hover:shadow-md"
          >
            View Details
          </button>
        </div>
      </div>
    </article>
  );
});

const DateAvailabilityMessage = React.memo(({ checkIn, checkOut, onClearDates }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  return (
    <div className="bg-gradient-to-br from-[#1846ca]/5 to-[#ec920f]/5 border-2 border-[#ec920f]/20 rounded-2xl p-6 shadow-lg max-w-2xl mx-auto my-8">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="bg-[#ec920f]/10 rounded-full p-3">
            <AlertCircle className="h-8 w-8 text-[#ec920f]" />
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            No Properties Available for Selected Dates
          </h3>
          
          <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
            <div className="flex items-center gap-2 text-gray-700 mb-2">
              <Calendar className="h-5 w-5 text-[#ec920f]" />
              <span className="font-semibold">Your Selected Dates:</span>
            </div>
            <div className="text-gray-600 ml-7">
              <span className="font-medium">{formatDate(checkIn)}</span>
              <span className="mx-2">→</span>
              <span className="font-medium">{formatDate(checkOut)}</span>
            </div>
          </div>
          
          <p className="text-gray-700 mb-4">
            Unfortunately, all properties are booked or unavailable for these dates. 
            Please try:
          </p>
          
          <ul className="space-y-2 mb-4 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#ec920f] font-bold">•</span>
              <span>Selecting different dates</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ec920f] font-bold">•</span>
              <span>Reducing your stay duration</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#ec920f] font-bold">•</span>
              <span>Browsing all properties without date filters</span>
            </li>
          </ul>
          
          <button
            onClick={onClearDates}
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-[#ec920f] to-[#d6820e] hover:from-[#d6820e] hover:to-[#c0770c] text-white font-semibold rounded-xl transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
          >
            Clear Dates & View All Properties
          </button>
        </div>
      </div>
    </div>
  );
});

const Properties = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [likedProperties, setLikedProperties] = useState([]);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [properties, setProperties] = useState([]);
  const [neighborhoods, setNeighborhoods] = useState([]);
  const [sortBy, setSortBy] = useState("featured");
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const [guestsOpen, setGuestsOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [hasActiveSearch, setHasActiveSearch] = useState(false);
  const [hasPropertiesInDatabase, setHasPropertiesInDatabase] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const mainContentRef = useRef(null);
  const heroRef = useRef(null);
  const searchRef = useRef(null);
  
  const [filters, setFilters] = useState({
    priceRange: [0, 200000],
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    guests: "",
    minArea: "",
    neighborhood: ""
  });

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(heroRef.current,
        { y: -30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
      );

      gsap.fromTo(searchRef.current,
        { scale: 0.98, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.8, delay: 0.2, ease: "power2.out" }
      );
    });

    return () => ctx.revert();
  }, []);

  const propertyTypes = useMemo(() => [
    { value: "Apartment", label: "Apartment", icon: <Building size={16} /> },
    { value: "Villa", label: "Villa", icon: <Home size={16} /> },
    { value: "Studio", label: "Studio", icon: <Building2 size={16} /> },
    { value: "Penthouse", label: "Penthouse", icon: <Crown size={16} /> },
    { value: "Townhouse", label: "Townhouse", icon: <Hotel size={16} /> },
    { value: "Office", label: "Office", icon: <Briefcase size={16} /> }
  ], []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    if (checkIn && checkOut) {
      const checkInDate = new Date(checkIn);
      const checkOutDate = new Date(checkOut);
      if (checkOutDate <= checkInDate) {
        const newCheckOut = new Date(checkInDate);
        newCheckOut.setDate(newCheckOut.getDate() + 1);
        const year = newCheckOut.getFullYear();
        const month = String(newCheckOut.getMonth() + 1).padStart(2, "0");
        const day = String(newCheckOut.getDate()).padStart(2, "0");
        setCheckOut(`${year}-${month}-${day}`);
      }
    }
  }, [checkIn, checkOut]);

  const getUrlParams = useCallback(() => {
    const searchParams = new URLSearchParams(location.search);
    const params = {};
    
    const urlPage = searchParams.get("page");
    if (urlPage) {
      setCurrentPage(parseInt(urlPage));
    }
    
    if (searchParams.get("checkin")) {
      params.checkin = searchParams.get("checkin");
      setCheckIn(searchParams.get("checkin"));
    }
    if (searchParams.get("checkout")) {
      params.checkout = searchParams.get("checkout");
      setCheckOut(searchParams.get("checkout"));
    }
    if (searchParams.get("adults")) {
      params.adults = searchParams.get("adults");
      setGuests((prev) => ({ ...prev, adults: parseInt(searchParams.get("adults")) || 1 }));
    }
    if (searchParams.get("children")) {
      params.children = searchParams.get("children");
      setGuests((prev) => ({ ...prev, children: parseInt(searchParams.get("children")) || 0 }));
    }
    if (searchParams.get("infants")) {
      params.infants = searchParams.get("infants");
      setGuests((prev) => ({ ...prev, infants: parseInt(searchParams.get("infants")) || 0 }));
    }
  
    if (searchParams.get("locationId")) {
      params.locationId = searchParams.get("locationId");
    }
  
    return params;
  }, [location.search]);

  const buildQueryString = useCallback((includePage = false) => {
    const params = new URLSearchParams();
    
    if (checkIn) params.set('checkin', checkIn);
    if (checkOut) params.set('checkout', checkOut);
    params.set('adults', guests.adults.toString());
    if (guests.children > 0) params.set('children', guests.children.toString());
    if (guests.infants > 0) params.set('infants', guests.infants.toString());
    if (includePage && currentPage > 1) params.set('page', currentPage.toString());
    
    return params.toString();
  }, [checkIn, checkOut, guests, currentPage]);

  const updateUrlWithPage = useCallback((page) => {
    const searchParams = new URLSearchParams(location.search);
    if (page > 1) {
      searchParams.set('page', page.toString());
    } else {
      searchParams.delete('page');
    }
    const queryString = searchParams.toString();
    const newUrl = queryString ? `${location.pathname}?${queryString}` : location.pathname;
    window.history.replaceState(null, '', newUrl);
  }, [location.search, location.pathname]);

  const axiosInstance = useMemo(() => {
    return axios.create({
      baseURL: baseurl,
      timeout: 10000,
    });
  }, []);

  const fetchProperties = useCallback(async (page = 1) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const urlParams = getUrlParams();
      const queryParams = new URLSearchParams();
  
      Object.keys(urlParams).forEach(key => {
        if (key !== 'page') {
          queryParams.set(key, urlParams[key]);
        }
      });
  
      queryParams.set('page', page.toString());
      queryParams.set('limit', itemsPerPage.toString());
  
      console.log('Fetching with query:', queryParams.toString());
      const response = await axiosInstance.get(`user/properties?${queryParams.toString()}`);
  
      console.log('Backend Response:', response.data);
  
      if (response.data.success) {
        setProperties(response.data.data || []);
        setTotalCount(response.data.totalCount || 0);
        setTotalPages(response.data.totalPages || 0);
        setHasPropertiesInDatabase(response.data.totalPropertiesInDatabase > 0);  
              
        console.log('State Updated:', {
          propertiesReturned: response.data.data?.length,
          totalPropertiesInDatabase: response.data.totalPropertiesInDatabase,
          totalCount: response.data.totalCount,
          hasDateFilter: response.data.hasDateFilter,
          hasPropertiesInDatabase: response.data.totalPropertiesInDatabase > 0
        });
      } else {
        setError("Failed to load properties");
      }
    } catch (error) {
      setError("Failed to load properties. Please try again.");
      console.error("Error fetching properties:", error);
    } finally {
      setIsLoading(false);
    }
  }, [getUrlParams, axiosInstance, itemsPerPage]);

  const fetchNeighborhoods = useCallback(async () => {
    try {
      const cachedNeighborhoods = sessionStorage.getItem('neighborhoods');
      if (cachedNeighborhoods) {
        setNeighborhoods(JSON.parse(cachedNeighborhoods));
        return;
      }

      const response = await axios.get(`${baseurl}user/location`);
      if (response.data && response.data.location) {
        setNeighborhoods(response.data.location);
        sessionStorage.setItem('neighborhoods', JSON.stringify(response.data.location));
      }
    } catch (error) {
      console.error("Error fetching neighborhoods:", error);
    }
  }, []);

  useEffect(() => {
    fetchNeighborhoods();
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const page = parseInt(searchParams.get('page') || '1');
    setCurrentPage(page);
    fetchProperties(page);
  }, [location.search, fetchProperties]);

  const toggleLike = useCallback((id) => {
    setLikedProperties((prev) =>
      prev.includes(id) ? prev.filter((pid) => pid !== id) : [...prev, id]
    );
  }, []);

  const handleFilterChange = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setCurrentPage(1);
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({
      priceRange: [0, 200000],
      propertyType: "",
      bedrooms: "",
      bathrooms: "",
      guests: "",
      minArea: "",
      neighborhood: ""
    });
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const clearSearch = useCallback(() => {
    setCheckIn('');
    setCheckOut('');
    setGuests({ adults: 1, children: 0, infants: 0 });
    navigate('/property');
  }, [navigate]);

  const handlePropertyClick = useCallback((propertyId, index) => {
    const queryString = buildQueryString(true);
    const url = queryString ? `/property/${propertyId}?${queryString}` : `/property/${propertyId}`;
    
    const isFirstOrSecondRow = index < 8;
    
    if (isFirstOrSecondRow) {
      navigate(url);
    } else {
      window.open(url, '_blank');
    }
  }, [buildQueryString, navigate]);

  const handleNeighborhoodClick = useCallback((neighborhood) => {
    handleFilterChange('neighborhood', filters.neighborhood === neighborhood ? "" : neighborhood);
  }, [filters.neighborhood, handleFilterChange]);

  const handleNewSearch = useCallback(() => {
    const searchParams = new URLSearchParams();
    
    if (checkIn) searchParams.set('checkin', checkIn);
    if (checkOut) searchParams.set('checkout', checkOut);
    searchParams.set('adults', guests.adults.toString());
    if (guests.children > 0) searchParams.set('children', guests.children.toString());
    if (guests.infants > 0) searchParams.set('infants', guests.infants.toString());
    
    navigate(`/property?${searchParams.toString()}`);
  }, [checkIn, checkOut, guests, navigate]);

  const filteredProperties = useMemo(() => {
    if (!properties || properties.length === 0) return [];

    let filtered = properties.filter((property) => {
      if (!property) return false;

      const matchesSearch = !debouncedSearchTerm || 
        (property.title && property.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (property.location && property.location.toLowerCase().includes(debouncedSearchTerm.toLowerCase())) ||
        (property.neighborhood?.name && property.neighborhood.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()));

      const propertyPrice = property.pricing?.night || property.pricing?.week || property.pricing?.month || property.pricing?.year || 0;
      const matchesPrice = !filters.priceRange || 
        (propertyPrice >= filters.priceRange[0] && propertyPrice <= filters.priceRange[1]);

      const matchesType = !filters.propertyType || property.type === filters.propertyType;

      const matchesBedrooms = !filters.bedrooms || 
        (property.bedrooms && property.bedrooms >= Number(filters.bedrooms));

      const matchesBathrooms = !filters.bathrooms || 
        (property.bathrooms && property.bathrooms >= Number(filters.bathrooms));

      const matchesGuests = !filters.guests || 
        (property.guests && property.guests >= Number(filters.guests));

      const matchesArea = !filters.minArea || 
        (property.area && property.area >= Number(filters.minArea));

      const matchesNeighborhood = !filters.neighborhood || 
        (property.neighborhood?.name && property.neighborhood.name === filters.neighborhood);

      return matchesSearch && matchesPrice && matchesType && 
             matchesBedrooms && matchesBathrooms && matchesGuests && 
             matchesArea && matchesNeighborhood;
    });

    switch (sortBy) {
      case "priceLow":
        return filtered.sort((a, b) => {
          const priceA = a.pricing?.night || a.pricing?.week || a.pricing?.month || a.pricing?.year || 0;
          const priceB = b.pricing?.night || b.pricing?.week || b.pricing?.month || b.pricing?.year || 0;
          return priceA - priceB;
        });
      case "priceHigh":
        return filtered.sort((a, b) => {
          const priceA = a.pricing?.night || a.pricing?.week || a.pricing?.month || a.pricing?.year || 0;
          const priceB = b.pricing?.night || b.pricing?.week || b.pricing?.month || b.pricing?.year || 0;
          return priceB - priceA;
        });
      case "newest":
        return filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
      case "area":
        return filtered.sort((a, b) => (b.area || 0) - (a.area || 0));
      default:
        return filtered;
    }
  }, [properties, debouncedSearchTerm, filters, sortBy]);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
    updateUrlWithPage(page);
    fetchProperties(page);
    
    setTimeout(() => {
      if (mainContentRef.current) {
        const mainTop = mainContentRef.current.offsetTop;
        const navbarHeight = 80;
        const targetScrollPosition = Math.max(0, mainTop - navbarHeight);
        
        window.scrollTo({ 
          top: targetScrollPosition, 
          behavior: 'smooth' 
        });
      }
    }, 50);
  }, [updateUrlWithPage, fetchProperties]);

  const PropertySkeleton = React.memo(() => (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden animate-pulse border border-gray-100">
      <div className="h-56 bg-gradient-to-r from-gray-100 to-gray-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-gray-200 rounded-lg w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex gap-3">
          <div className="h-4 bg-gray-200 rounded w-16"></div>
          <div className="h-4 bg-gray-200 rounded w-16"></div>
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-5 bg-gray-200 rounded w-20"></div>
          <div className="h-8 bg-gray-200 rounded w-24"></div>
        </div>
      </div>
    </div>
  ));

  const totalGuests = useMemo(() => guests.adults + guests.children + guests.infants, [guests]);
  const guestDisplayText = useMemo(() => totalGuests === 1 ? '1 Guest' : `${totalGuests} Guests`, [totalGuests]);

  const minCheckOutDate = useMemo(() => {
    if (!checkIn) return null;
    const date = new Date(checkIn);
    date.setDate(date.getDate() + 1);
    return date.toISOString().split('T')[0];
  }, [checkIn]);

  useEffect(() => {
    setHasActiveSearch(checkIn || checkOut || guests.adults > 1 || guests.children > 0 || guests.infants > 0);
  }, [checkIn, checkOut, guests]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#fefefd] flex items-center justify-center p-6">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md border border-gray-200">
          <AlertCircle className="w-16 h-16 text-[#ec920f] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#ec920f] hover:bg-[#d6820e] text-white px-6 py-3 rounded-xl transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen bg-[#fefefd]">
        <div className="min-h-screen bg-gradient-to-b from-[#fefefd] to-white">
          <Navbar />

          <main ref={mainContentRef} className="container mx-auto px-4 pt-24 pb-10">
            <section ref={heroRef} className="mb-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                Find Your Next Stay
              </h1>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Prest Hotels Deals — handpicked luxury properties for every journey
              </p>
            </section>

            <section ref={searchRef} className="mb-8">
              <div className="rounded-2xl shadow-lg border border-gray-200 p-6 bg-[#1846ca]">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Check In</label>
                    <CustomDatePicker
                      value={checkIn}
                      onChange={setCheckIn}
                      placeholder="Select date"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-2">Check Out</label>
                    <CustomDatePicker
                      value={checkOut}
                      onChange={setCheckOut}
                      placeholder="Select date"
                      minDate={minCheckOutDate}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1846ca] mb-2">Guests</label>
                    <div className="relative group">
                      <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-[#1846ca] transition-colors z-10" />
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-hover:text-[#1846ca] transition-colors z-10" />
                      <button
                        onClick={() => setGuestsOpen(!guestsOpen)}
                        className="w-full h-11 pl-10 pr-10 border border-gray-200 rounded-xl focus:outline-none focus:border-[#1846ca] focus:ring-2 focus:ring-[#1846ca]/20 transition-all duration-300 hover:border-[#1846ca] hover:shadow-md bg-white cursor-pointer text-gray-900 text-sm text-left"
                      >
                        {guestDisplayText}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-end gap-2">
                    <button
                      onClick={handleNewSearch}
                      className="flex-1 h-11 rounded-xl font-medium text-white bg-[#ec920f] hover:bg-[#d6820e] transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
                    >
                      <Search className="h-4 w-4"/>
                      Search
                    </button>
                    {hasActiveSearch && (
                      <button
                        onClick={clearSearch}
                        className="h-11 px-4 rounded-xl font-medium text-gray-700 bg-white hover:bg-gray-50 border border-gray-300 transition-all duration-300 flex items-center justify-center gap-2"
                        title="Clear search"
                      >
                        <XCircle className="h-4 w-4 text-[#ec920f]"/>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>

            <NeighborhoodScroller 
              neighborhoods={neighborhoods}
              filters={filters}
              onNeighborhoodClick={handleNeighborhoodClick}
            />

            <section className="mb-8">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="relative flex-1 max-w-2xl">
                  <div className="flex items-center gap-3 bg-white shadow-sm border border-gray-200 px-4 py-3 rounded-xl hover:shadow-md transition-all duration-300">
                    <Search className="text-[#ec920f]" size={20} />
                    <input
                      type="text"
                      placeholder="Search by property name, location, or neighborhood..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="flex-1 outline-none bg-transparent placeholder-gray-400 text-gray-700"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setFilterOpen(!filterOpen)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-xl shadow-sm transition-all duration-300 ${
                      filterOpen 
                        ? 'bg-[#1846ca] text-white' 
                        : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
                    }`}
                  >
                    <SlidersHorizontal size={18} />
                    <span className="hidden sm:inline">Filters</span>
                  </button>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-3 rounded-xl shadow-sm bg-white border border-gray-200 outline-none hover:bg-gray-50 transition-all duration-300 text-gray-700"
                  >
                    <option value="featured">Featured</option>
                    <option value="priceLow">Price: Low to High</option>
                    <option value="priceHigh">Price: High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="area">Largest Area</option>
                  </select>
                </div>
              </div>

              {filterOpen && (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 mt-4 overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-800">Filter Properties</h3>
                      <button
                        onClick={resetFilters}
                        className="text-[#ec920f] hover:text-[#d6820e] text-sm font-medium transition-colors"
                      >
                        Reset All
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Price Range (${filters.priceRange[0].toLocaleString()} - ${filters.priceRange[1].toLocaleString()})
                        </label>
                        <input
                          type="range"
                          min="0"
                          max="200000"
                          step="5000"
                          value={filters.priceRange[1]}
                          onChange={(e) => handleFilterChange('priceRange', [0, +e.target.value])}
                          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1846ca]"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Property Type
                        </label>
                        <select
                          value={filters.propertyType}
                          onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none hover:border-[#1846ca] transition-colors"
                        >
                          <option value="">All Types</option>
                          {propertyTypes.map((type) => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Neighborhood
                        </label>
                        <select
                          value={filters.neighborhood}
                          onChange={(e) => handleFilterChange('neighborhood', e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none hover:border-[#1846ca] transition-colors"
                        >
                          <option value="">All Neighborhoods</option>
                          {neighborhoods.map((neighborhood) => (
                            <option key={neighborhood._id || neighborhood.name} value={neighborhood.name}>
                              {neighborhood.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Minimum Area (m²)
                        </label>
                        <input
                          type="number"
                          value={filters.minArea}
                          onChange={(e) => handleFilterChange('minArea', e.target.value)}
                          placeholder="Any size"
                          className="w-full px-3 py-2 rounded-lg border border-gray-200 outline-none hover:border-[#1846ca] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Min Bedrooms
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4, 5].map(num => (
                            <button
                              key={num}
                              onClick={() => handleFilterChange('bedrooms', 
                                filters.bedrooms === num.toString() ? "" : num.toString())}
                              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                                filters.bedrooms === num.toString()
                                  ? 'bg-[#1846ca] text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {num}+
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Min Bathrooms
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 3, 4].map(num => (
                            <button
                              key={num}
                              onClick={() => handleFilterChange('bathrooms', 
                                filters.bathrooms === num.toString() ? "" : num.toString())}
                              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                                filters.bathrooms === num.toString()
                                  ? 'bg-[#1846ca] text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {num}+
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Min Guests
                        </label>
                        <div className="flex gap-2">
                          {[1, 2, 4, 6, 8].map(num => (
                            <button
                              key={num}
                              onClick={() => handleFilterChange('guests', 
                                filters.guests === num.toString() ? "" : num.toString())}
                              className={`px-3 py-2 rounded-lg text-sm transition-all ${
                                filters.guests === num.toString()
                                  ? 'bg-[#1846ca] text-white'
                                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                              }`}
                            >
                              {num}+
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </section>

            <div className="mb-6">
              <p className="text-gray-600">
                {isLoading ? 'Loading...' : `Showing ${filteredProperties.length} of ${totalCount} properties`}
              </p>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, i) => (
                  <PropertySkeleton key={i} />
                ))}
              </div>
            ) : filteredProperties.length === 0 ? (
              <div className="py-8">
                {(checkIn && checkOut && hasPropertiesInDatabase && totalCount === 0) ? (
                  <DateAvailabilityMessage 
                    checkIn={checkIn}
                    checkOut={checkOut}
                    onClearDates={clearSearch}
                  />
                ) : (
                  <div className="text-center py-16">
                    <div className="bg-white rounded-2xl shadow-sm p-8 max-w-md mx-auto border border-gray-200">
                      <Search className="w-16 h-16 text-[#ec920f] mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">No properties found</h3>
                      <p className="text-gray-600 mb-4">Try adjusting your search or filters</p>
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          resetFilters();
                          clearSearch();
                        }}
                        className="bg-[#ec920f] hover:bg-[#d6820e] text-white px-6 py-3 rounded-xl transition-all duration-300"
                      >
                        Clear All Filters
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProperties.map((property, index) => (
                    <PropertyCard
                      key={property._id || index}
                      property={property}
                      index={index}
                      likedProperties={likedProperties}
                      onToggleLike={toggleLike}
                      onPropertyClick={handlePropertyClick}
                      hoveredProperty={hoveredProperty}
                      onMouseEnter={setHoveredProperty}
                      onMouseLeave={setHoveredProperty}
                    />
                  ))}
                </div>
                
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  itemsPerPage={itemsPerPage}
                  totalItems={totalCount}
                />
              </>
            )}
          </main>
        </div>
      </div>
      
      <GuestSelector 
        isOpen={guestsOpen}
        onClose={() => setGuestsOpen(false)}
        guests={guests}
        onGuestsChange={setGuests}
      />
      
      <div className="fixed right-4 bottom-20 flex flex-col gap-4 z-50">
        <a
          href="https://wa.me/971522596860"
          target="_blank"
          rel="noopener noreferrer"
          className="animate-pulse bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform border border-gray-200"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp"
            className="h-10 w-10"
          />
        </a>
        <a
          href="mailto:Info@wavescation.com"
          className="animate-pulse bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform border border-gray-200"
        >
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/4/4e/Gmail_Icon.png"
            alt="Mail"
            className="h-10 w-10"
          />
        </a>
        <a
          href="tel:+971522596860"
          className="animate-pulse bg-white p-2 rounded-full shadow-lg hover:scale-110 transition-transform border border-gray-200"
        >
          <svg className="h-10 w-10 text-[#ec920f]" fill="currentColor" viewBox="0 0 20 20">
            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z"/>
          </svg>
        </a>
      </div>
      
      <Footer/>

      <style>
        {`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        `}
      </style>
    </>
  );
};

export default Properties;