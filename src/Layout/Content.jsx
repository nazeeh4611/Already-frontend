import React, { useEffect, useState, useRef } from 'react';
import {
  MapPin, Star, ChevronDown, Phone, Mail, ArrowRight, Heart,
  TrendingUp, CheckCircle, Headphones, Hotel, Users, Building,
  Globe, Gem, Quote, Briefcase, Gift, Shield, Award, Clock,
  Coffee, Wifi, Dumbbell, Car, Plane, Camera, ThumbsUp
} from 'lucide-react';
import Airbnb from "../assets/Airbnb.png";
import Booking from "../assets/Booking.png";
import Expedia from "../assets/Expedia.png";
import Trivago from "../assets/Trivago.png";
import Hotels from "../assets/Hotels.png";
import Agoda from "../assets/Agoda.png";
import { useNavigate } from 'react-router-dom';
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

gsap.registerPlugin(ScrollTrigger, SplitText);

const SectionLabel = ({ children, light = false }) => (
  <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full border"
    style={{
      background: light ? 'rgba(255,255,255,0.15)' : '#eff6ff',
      borderColor: light ? 'rgba(255,255,255,0.25)' : '#bfdbfe',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
    <span className={`w-1.5 h-1.5 rounded-full ${light ? 'bg-yellow-400' : 'bg-blue-500'}`} />
    <span className={`text-xs font-bold uppercase tracking-widest ${light ? 'text-yellow-200' : 'text-blue-600'}`}>{children}</span>
  </div>
);

const SectionTitle = ({ children, highlight, light = false }) => (
  <h2 className={`text-3xl md:text-4xl lg:text-5xl font-extrabold mb-4 ${light ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Sora', sans-serif" }}>
    {children}{' '}
    <span style={{ color: light ? '#fcd34d' : '#1d4ed8' }} className="relative inline-block">
      {highlight}
      <span className="absolute -bottom-2 left-0 w-full h-1 bg-current opacity-30 rounded-full"></span>
    </span>
  </h2>
);

const ContentSections = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [activeTab, setActiveTab] = useState('featured');
  const [featuredHotels] = useState([
    { id:1, name:"Royal Suite Burj View", location:"Downtown Dubai", price:1200, rating:5.0, reviews:156, image:"https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities:["Infinity Pool","Spa","Butler","Fine Dining"] },
    { id:2, name:"Palm Jumeirah Palace", location:"Palm Jumeirah", price:2500, rating:5.0, reviews:89, image:"https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities:["Private Beach","Yacht","Helipad","Royal Spa"] },
    { id:3, name:"Marina Sky Penthouse", location:"Dubai Marina", price:1800, rating:4.9, reviews:234, image:"https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities:["Rooftop Pool","Gym","Cinema","Concierge"] },
    { id:4, name:"Emirates Hills Mansion", location:"Emirates Hills", price:3500, rating:5.0, reviews:67, image:"https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities:["Tennis Court","Private Pool","Staff","Wine Cellar"] },
  ]);
  const [recommendedHotels] = useState([
    { id:5, name:"JBR Beach Resort", location:"Jumeirah Beach", price:650, rating:4.8, reviews:445, image:"https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities:["Beach","Kids Club","Pool","Sports"] },
    { id:6, name:"Business Bay Executive", location:"Business Bay", price:550, rating:4.7, reviews:312, image:"https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities:["Business Ctr","Meetings","Gym","Restaurant"] },
    { id:7, name:"Al Barsha Family Villa", location:"Al Barsha", price:420, rating:4.9, reviews:189, image:"https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities:["Garden","BBQ","Playground","Parking"] },
    { id:8, name:"Dubai Hills Golf Resort", location:"Dubai Hills", price:750, rating:4.9, reviews:156, image:"https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80", amenities:["Golf","Spa","Pool","Fine Dining"] },
  ]);
  const navigate = useNavigate();
  const sectionsRef = useRef([]);
  const partnersRef = useRef(null);
  const locationCardsRef = useRef([]);
  const reviewCardsRef = useRef([]);
  const servicesRef = useRef([]);
  const statsRef = useRef([]);
  const titleRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          const titles = section.querySelectorAll('.section-title');
          const splitTitles = Array.from(titles).map(title => new SplitText(title, { type: "chars", charsClass: "char" }));
          
          gsap.fromTo(section,
            { y: 50, opacity: 0 },
            { 
              y: 0, 
              opacity: 1, 
              duration: 1,
              scrollTrigger: { 
                trigger: section, 
                start: "top 85%", 
                toggleActions: "play none none reverse" 
              }
            }
          );

          splitTitles.forEach(split => {
            gsap.fromTo(split.chars,
              { y: 40, opacity: 0, rotateX: -45 },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.8,
                stagger: 0.02,
                ease: "back.out(1.2)",
                scrollTrigger: {
                  trigger: section,
                  start: "top 80%"
                }
              }
            );
          });
        }
      });

      if (partnersRef.current) {
        gsap.fromTo(partnersRef.current.children,
          { scale: 0.8, opacity: 0, rotation: -5 },
          { 
            scale: 1, 
            opacity: 1, 
            rotation: 0,
            duration: 0.8, 
            stagger: 0.1, 
            ease: "back.out(1.5)",
            scrollTrigger: { 
              trigger: partnersRef.current, 
              start: "top 85%" 
            }
          }
        );
      }

      locationCardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(card,
            { y: 40, opacity: 0, scale: 0.95 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 0.8, 
              delay: i * 0.08, 
              ease: "back.out(1.2)",
              scrollTrigger: { 
                trigger: card, 
                start: "top 90%" 
              }
            }
          );
        }
      });

      reviewCardsRef.current.forEach((card, i) => {
        if (card) {
          gsap.fromTo(card,
            { x: i % 2 === 0 ? -50 : 50, opacity: 0, rotation: i % 2 === 0 ? -2 : 2 },
            { 
              x: 0, 
              opacity: 1, 
              rotation: 0,
              duration: 1, 
              ease: "power3.out",
              scrollTrigger: { 
                trigger: card, 
                start: "top 85%" 
              }
            }
          );
        }
      });

      servicesRef.current.forEach((service, i) => {
        if (service) {
          gsap.fromTo(service,
            { y: 40, opacity: 0, scale: 0.95 },
            { 
              y: 0, 
              opacity: 1, 
              scale: 1,
              duration: 0.7, 
              delay: i * 0.08, 
              ease: "back.out(1.2)",
              scrollTrigger: { 
                trigger: service, 
                start: "top 90%" 
              }
            }
          );
        }
      });

      statsRef.current.forEach((stat, i) => {
        if (stat) {
          gsap.fromTo(stat,
            { scale: 0.5, opacity: 0 },
            { 
              scale: 1, 
              opacity: 1, 
              duration: 0.8, 
              delay: i * 0.15,
              ease: "elastic.out(1, 0.5)",
              scrollTrigger: { 
                trigger: stat, 
                start: "top 85%" 
              }
            }
          );
        }
      });
    });

    return () => ctx.revert();
  }, []);

  const partners = [
    { name:"Airbnb", logo:Airbnb }, { name:"Booking.com", logo:Booking },
    { name:"Expedia", logo:Expedia }, { name:"Trivago", logo:Trivago },
    { name:"Hotels.com", logo:Hotels }, { name:"Agoda", logo:Agoda },
  ];

  const whyChooseUs = [
    { icon:<Gem className="h-6 w-6" />, title:'Luxury Standards', desc:'5-star international hospitality benchmarks' },
    { icon:<Shield className="h-6 w-6" />, title:'Fully Licensed', desc:'DTCM licensed and regulated operator' },
    { icon:<Headphones className="h-6 w-6" />, title:'24/7 Concierge', desc:'Round-the-clock guest services' },
    { icon:<TrendingUp className="h-6 w-6" />, title:'Best Value', desc:'Competitive rates and exclusive deals' },
  ];

  const services = [
    { icon:<Hotel className="h-7 w-7" />, title:'Hotel Management', desc:'Full-service hotel operations', features:['Operations','Staff Training','Quality Control'] },
    { icon:<Building className="h-7 w-7" />, title:'Resort Management', desc:'Luxury resort & villa management', features:['Guest Experience','Maintenance','Activities'] },
    { icon:<Globe className="h-7 w-7" />, title:'Revenue Optimization', desc:'Dynamic pricing & yield management', features:['Market Analysis','Pricing Strategy','Distribution'] },
    { icon:<Briefcase className="h-7 w-7" />, title:'Marketing Strategy', desc:'Multi-channel distribution & branding', features:['Digital Marketing','Brand Building','Partnerships'] },
    { icon:<Users className="h-7 w-7" />, title:'Staff Training', desc:'Professional hospitality programs', features:['Workshops','Certification','Development'] },
    { icon:<Gift className="h-7 w-7" />, title:'Guest Experiences', desc:'Creating memorable stays & events', features:['Events','Concierge','Special Packages'] },
  ];

  const stats = [
    { value: '500+', label: 'Properties', icon: <Hotel className="h-6 w-6" /> },
    { value: '15K+', label: 'Happy Guests', icon: <Users className="h-6 w-6" /> },
    { value: '4.9', label: 'Avg Rating', icon: <Star className="h-6 w-6" /> },
    { value: '24/7', label: 'Support', icon: <Clock className="h-6 w-6" /> },
  ];

  const faqs = [
    { q:"What makes Alrkn Alraqy different?", a:"We combine regional expertise with global hospitality standards, offering personalized service and operational excellence across our properties.", category:"General" },
    { q:"Do you offer property management services?", a:"Yes, comprehensive hotel management services including operations, marketing, revenue management, and staff training tailored to each property.", category:"Services" },
    { q:"What regions do you operate in?", a:"We specialize in Gulf Countries, South Africa, and Central Europe, focusing on luxury hotel and resort management.", category:"Locations" },
    { q:"How do you ensure guest satisfaction?", a:"Through dedicated 24/7 guest services, personalized attention, and commitment to maintaining international quality standards.", category:"Quality" },
    { q:"Can I partner with Alrkn Alraqy?", a:"We welcome partnerships with property owners and investors. Contact our team to discuss collaboration opportunities.", category:"Partnership" },
  ];

  const reviews = [
    { name:'Mohammed Al-Farsi', rating:5, review:'Exceptional service and attention to detail. Truly world-class hospitality. The team went above and beyond to make our stay memorable.', location:'Dubai', image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name:'Sarah Williams', rating:5, review:'The property exceeded all expectations. Professional management throughout. Every detail was perfectly handled from check-in to check-out.', location:'Cape Town', image:'https://images.unsplash.com/photo-1494790108777-296ef5a0b6e6?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name:'Klaus Schmidt', rating:5, review:'Outstanding standards and wonderful staff. Will definitely return. The personalized service made all the difference.', location:'Vienna', image:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
    { name:'Aisha Al-Mansouri', rating:5, review:'Perfect blend of luxury and comfort. The team anticipated our every need and ensured a flawless experience. Highly recommended.', location:'Abu Dhabi', image:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80' },
  ];

  const destinations = [
    { name:'Dubai Marina', properties:24, image:'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name:'Palm Jumeirah', properties:18, image:'https://images.unsplash.com/photo-1549138144-7e5a56e1e7a1?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name:'Downtown Dubai', properties:31, image:'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name:'Jumeirah Beach', properties:15, image:'https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name:'Business Bay', properties:22, image:'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
    { name:'Emirates Hills', properties:12, image:'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  ];

  const amenities = [
    { icon: <Wifi className="h-5 w-5" />, label: 'Free WiFi' },
    { icon: <Coffee className="h-5 w-5" />, label: 'Breakfast' },
    { icon: <Dumbbell className="h-5 w-5" />, label: 'Fitness Center' },
    { icon: <Car className="h-5 w-5" />, label: 'Parking' },
    { icon: <Plane className="h-5 w-5" />, label: 'Airport Transfer' },
    { icon: <Camera className="h-5 w-5" />, label: 'City Views' },
  ];

  const HotelCard = ({ hotel, featured = false }) => {
    const cardRef = useRef(null);
    
    useEffect(() => {
      if (cardRef.current) {
        gsap.fromTo(cardRef.current,
          { y: 30, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 0.8,
            scrollTrigger: {
              trigger: cardRef.current,
              start: "top 90%"
            }
          }
        );
      }
    }, []);

    return (
      <div ref={cardRef} onClick={() => navigate(`/property/${hotel.id}`)} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
        <div className="relative overflow-hidden h-48">
          <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          {featured && (
            <div className="absolute top-3 left-3 px-3 py-1 text-xs font-bold text-white rounded-lg" style={{ background: '#f59e0b' }}>Featured</div>
          )}
          <button className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all hover:scale-110">
            <Heart className="h-4 w-4 text-blue-600" />
          </button>
          <div className="absolute bottom-3 left-3 right-3 flex gap-1">
            {hotel.amenities.slice(0,3).map((a, i) => (
              <span key={i} className="text-[10px] font-bold bg-white/90 backdrop-blur text-gray-800 px-2 py-1 rounded-full">{a}</span>
            ))}
          </div>
        </div>
        <div className="p-5">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 text-base line-clamp-1 flex-1 mr-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{hotel.name}</h3>
            <div className="flex items-center gap-1 shrink-0 bg-blue-50 px-2 py-1 rounded-lg">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="text-xs font-bold text-gray-800">{hotel.rating}</span>
            </div>
          </div>
          <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
            <MapPin className="h-3 w-3 text-blue-400" />{hotel.location}
          </p>
          <div className="flex justify-between items-center pt-3 border-t border-gray-100">
            <div>
              <span className="text-2xl font-extrabold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>${hotel.price}</span>
              <span className="text-xs text-gray-400 ml-1">/night</span>
            </div>
            <span className="text-xs text-gray-400 bg-gray-50 px-2 py-1 rounded-full">{hotel.reviews} reviews</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');
        .char { display: inline-block; }
      `}</style>

      {/* Stats Section */}
      <section ref={el => sectionsRef.current[0] = el} className="py-12 px-4 md:px-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, i) => (
              <div key={i} ref={el => statsRef.current[i] = el} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-white/20 mb-3 text-yellow-300">
                  {stat.icon}
                </div>
                <div className="text-3xl md:text-4xl font-extrabold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section ref={el => sectionsRef.current[1] = el} className="py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Our Partners</SectionLabel>
            <SectionTitle highlight="Partners">Trusted Booking</SectionTitle>
            <p className="text-gray-500 max-w-md mx-auto text-sm">Listed on the world's leading booking platforms</p>
          </div>
          <div ref={partnersRef} className="grid grid-cols-3 md:grid-cols-6 gap-6">
            {partners.map((p, i) => (
              <div key={i} className="flex items-center justify-center p-6 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:shadow-lg transition-all duration-300 group border border-transparent hover:border-blue-200 hover:scale-105">
                <img src={p.logo} alt={p.name} className="h-12 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={el => sectionsRef.current[2] = el} className="py-20 px-4 md:px-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Why Us</SectionLabel>
            <SectionTitle highlight="Alrkn Alraqy">Why Choose</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-lg border border-blue-50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 text-white group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg" style={{ fontFamily: "'Sora', sans-serif" }}>{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs font-semibold text-blue-600">Learn more →</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section ref={el => sectionsRef.current[3] = el} className="py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Limited Time</SectionLabel>
            <SectionTitle highlight="Deals">Special</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden rounded-3xl p-10 text-white flex flex-col justify-between min-h-[280px] group" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)' }}>
              <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -left-12 -bottom-12 w-40 h-40 rounded-full bg-white/5 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <p className="text-yellow-300 text-sm font-bold mb-2 uppercase tracking-wider">Special Offer</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-7xl font-extrabold" style={{ fontFamily: "'Sora', sans-serif" }}>50</span>
                  <span className="text-4xl font-bold">%</span>
                  <span className="text-3xl font-semibold ml-2">OFF</span>
                </div>
                <p className="text-blue-200 mb-8 text-lg">Select hotel deals across all destinations</p>
                <button className="inline-flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-sm text-blue-900 hover:shadow-2xl transition-all hover:scale-105 group/btn" style={{ background: '#f59e0b' }}>
                  Learn More <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl p-10 flex flex-col justify-between min-h-[280px] group" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 60%, #fbbf24 100%)' }}>
              <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-white/30 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/20 group-hover:scale-150 transition-transform duration-700" />
              <div className="relative z-10">
                <p className="text-yellow-800 text-sm font-bold mb-2 uppercase tracking-wider">Member Exclusive</p>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-7xl font-extrabold text-yellow-900" style={{ fontFamily: "'Sora', sans-serif" }}>20</span>
                  <span className="text-4xl font-bold text-yellow-900">%</span>
                  <span className="text-3xl font-bold text-yellow-900 ml-2">OFF!</span>
                </div>
                <p className="text-yellow-700 mb-8 text-lg">Let's explore the world with exclusive member discounts</p>
                <button className="inline-flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-sm text-white hover:shadow-2xl transition-all hover:scale-105 group/btn" style={{ background: '#1d4ed8' }}>
                  Book Now <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs for Hotels */}
      <section ref={el => sectionsRef.current[4] = el} className="py-20 px-4 md:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Top Picks</SectionLabel>
            <SectionTitle highlight="Hotels">Featured</SectionTitle>
          </div>

          <div className="flex justify-center gap-4 mb-10">
            <button 
              onClick={() => setActiveTab('featured')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'featured' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              Featured Hotels
            </button>
            <button 
              onClick={() => setActiveTab('recommended')}
              className={`px-6 py-3 rounded-xl font-bold text-sm transition-all ${activeTab === 'recommended' ? 'bg-blue-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 hover:bg-blue-50'}`}
            >
              Recommended
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {(activeTab === 'featured' ? featuredHotels : recommendedHotels).map(h => (
              <HotelCard key={h.id} hotel={h} featured={activeTab === 'featured'} />
            ))}
          </div>

          <div className="text-center mt-10">
            <button onClick={() => navigate('/property')} className="inline-flex items-center gap-3 px-8 py-3 rounded-xl font-bold text-sm text-white transition-all hover:shadow-xl hover:scale-105" style={{ background: 'linear-gradient(135deg, #1d4ed8, #1e40af)' }}>
              View All Properties <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Amenities Bar */}
      <section className="py-12 px-4 md:px-6 bg-white border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap justify-center gap-6 md:gap-10">
            {amenities.map((item, i) => (
              <div key={i} className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition-colors group">
                <div className="w-10 h-10 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center transition-all">
                  {item.icon}
                </div>
                <span className="text-sm font-semibold">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Prime Locations */}
      <section ref={el => sectionsRef.current[5] = el} className="py-20 px-4 md:px-6 bg-gradient-to-b from-white to-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Destinations</SectionLabel>
            <SectionTitle highlight="Locations">Prime</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d, i) => (
              <div key={i} ref={el => locationCardsRef.current[i] = el}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-2xl transition-all duration-300">
                <img src={d.image} alt={d.name} className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/90 via-blue-900/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-end">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-1" style={{ fontFamily: "'Sora', sans-serif" }}>{d.name}</h3>
                    <p className="text-blue-200 text-sm">{d.properties} properties</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <ArrowRight className="h-4 w-4 text-blue-900" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section ref={el => sectionsRef.current[6] = el} className="py-20 px-4 md:px-6 text-white" style={{ background: 'linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel light>What We Do</SectionLabel>
            <SectionTitle highlight="Services" light>Our Premium</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <div key={i} ref={el => servicesRef.current[i] = el}
                className="group bg-white/10 backdrop-blur rounded-2xl p-8 border border-white/20 hover:bg-white/20 hover:-translate-y-2 transition-all duration-300">
                <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform" style={{ background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.4)' }}>
                  <span className="text-yellow-300 text-2xl">{s.icon}</span>
                </div>
                <h3 className="font-bold text-white mb-3 text-xl" style={{ fontFamily: "'Sora', sans-serif" }}>{s.title}</h3>
                <p className="text-blue-200 text-sm mb-5 leading-relaxed">{s.desc}</p>
                <div className="space-y-2">
                  {s.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-blue-100">
                      <CheckCircle className="h-4 w-4 text-yellow-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section ref={el => sectionsRef.current[7] = el} className="py-20 px-4 md:px-6" style={{ background: 'linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>Reviews</SectionLabel>
            <SectionTitle highlight="Testimonials">Guest</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((r, i) => (
              <div key={i} ref={el => reviewCardsRef.current[i] = el}
                className="bg-white rounded-2xl p-8 shadow-lg border border-blue-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300">
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <img src={r.image} alt={r.name} className="w-14 h-14 rounded-xl object-cover border-2 border-blue-200" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.name}</h4>
                      <p className="text-xs text-gray-400 mb-1">{r.location}</p>
                      <div className="flex items-center gap-0.5">
                        {[...Array(r.rating)].map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                  </div>
                  <Quote className="h-8 w-8 text-blue-200 shrink-0" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">"{r.review}"</p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">✓ Verified Guest</span>
                  <ThumbsUp className="h-4 w-4 text-gray-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={el => sectionsRef.current[8] = el} className="py-20 px-4 md:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>FAQ</SectionLabel>
            <SectionTitle highlight="Questions">Frequently Asked</SectionTitle>
          </div>
          <div className="space-y-4">
            {faqs.map((f, i) => (
              <div key={i} className="border border-blue-100 rounded-2xl overflow-hidden hover:border-blue-300 transition-all hover:shadow-lg">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-sm font-bold text-blue-700 shrink-0">{i+1}</span>
                    <span className="font-bold text-gray-800 text-base" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.q}</span>
                  </div>
                  <div className={`w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 transition-all duration-300 ${expandedFaq===i ? 'rotate-180 bg-blue-100 scale-110' : ''}`}>
                    <ChevronDown className="h-4 w-4 text-blue-600" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${expandedFaq===i ? 'max-h-64' : 'max-h-0'}`}>
                  <div className="px-6 pb-6 pl-16">
                    <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-xl p-4">{f.a}</p>
                    <span className="text-xs font-bold text-blue-600 mt-3 block">Category: {f.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section ref={el => sectionsRef.current[9] = el} className="py-20 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <SectionLabel>About Us</SectionLabel>
            <SectionTitle highlight="Mission">Our Vision &</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-12 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)' }}>
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Globe className="h-8 w-8 text-yellow-300" />
              </div>
              <h2 className="text-3xl font-extrabold mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Our Vision</h2>
              <p className="text-blue-100 leading-relaxed text-lg mb-8">To be a leading hospitality management company in the Middle East and beyond, setting benchmarks in quality, service, and innovation.</p>
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full bg-blue-400/40 border-2 border-white/40" />)}
                </div>
                <span className="text-sm text-blue-200">Trusted globally</span>
              </div>
            </div>
            <div className="p-12 bg-white">
              <div className="w-16 h-16 rounded-2xl bg-yellow-50 flex items-center justify-center mb-8">
                <Award className="h-8 w-8 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Our Mission</h2>
              <p className="text-gray-600 leading-relaxed text-lg mb-8">To elevate hospitality experiences through expert hotel management services that drive operational excellence, maximize profitability, and deliver outstanding guest satisfaction.</p>
              <div className="grid grid-cols-2 gap-3">
                {['Excellence','Innovation','Partnership','Growth'].map(v => (
                  <div key={v} className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="h-3.5 w-3.5 text-blue-600" />
                    </div>
                    <span className="text-sm font-bold text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-16 px-4 md:px-6 bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-extrabold text-white mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Get Exclusive Deals</h2>
          <p className="text-blue-200 mb-8">Subscribe to our newsletter and receive special offers directly in your inbox</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Your email address" 
              className="flex-1 px-6 py-4 rounded-xl border-2 border-white/30 bg-white/20 text-white placeholder-blue-200 focus:outline-none focus:border-yellow-400 transition-all"
            />
            <button className="px-8 py-4 rounded-xl font-bold text-blue-900 bg-yellow-400 hover:bg-yellow-300 transition-all hover:scale-105 active:scale-95">
              Subscribe
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentSections;