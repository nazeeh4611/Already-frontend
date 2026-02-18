import React, { useEffect, useState, useRef } from 'react';
import {
  MapPin, Star, ChevronDown, Phone, Mail, ArrowRight, Heart,
  TrendingUp, CheckCircle, Headphones, Hotel, Users, Building,
  Globe, Gem, Quote, Briefcase, Gift, Shield
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

gsap.registerPlugin(ScrollTrigger);

const SectionLabel = ({ children, light = false }) => (
  <div className="inline-flex items-center gap-2 mb-3 px-4 py-1.5 rounded-full border"
    style={{
      background: light ? 'rgba(255,255,255,0.15)' : '#eff6ff',
      borderColor: light ? 'rgba(255,255,255,0.25)' : '#bfdbfe',
      fontFamily: "'Plus Jakarta Sans', sans-serif"
    }}>
    <span className={`w-1.5 h-1.5 rounded-full ${light ? 'bg-yellow-400' : 'bg-blue-500'}`} />
    <span className={`text-xs font-semibold uppercase tracking-widest ${light ? 'text-yellow-200' : 'text-blue-600'}`}>{children}</span>
  </div>
);

const SectionTitle = ({ children, highlight, light = false }) => (
  <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${light ? 'text-white' : 'text-gray-900'}`} style={{ fontFamily: "'Sora', sans-serif" }}>
    {children}{' '}
    {highlight && <span style={{ color: light ? '#fcd34d' : '#1d4ed8' }}>{highlight}</span>}
  </h2>
);

const ContentSections = () => {
  const [expandedFaq, setExpandedFaq] = useState(null);
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

  useEffect(() => {
    const ctx = gsap.context(() => {
      sectionsRef.current.forEach((s) => {
        if (s) gsap.fromTo(s, { y: 50, opacity: 0 }, { y:0, opacity:1, duration:1, scrollTrigger:{ trigger:s, start:"top 88%", toggleActions:"play none none reverse" } });
      });
      if (partnersRef.current) {
        gsap.fromTo(partnersRef.current.children, { scale:0.85, opacity:0 }, { scale:1, opacity:1, duration:0.7, stagger:0.08, ease:"back.out(1.5)", scrollTrigger:{ trigger:partnersRef.current, start:"top 88%" } });
      }
      locationCardsRef.current.forEach((c, i) => {
        if (c) gsap.fromTo(c, { y:30, opacity:0 }, { y:0, opacity:1, duration:0.7, delay:i*0.08, ease:"power2.out", scrollTrigger:{ trigger:c, start:"top 92%" } });
      });
      reviewCardsRef.current.forEach((c, i) => {
        if (c) gsap.fromTo(c, { x: i%2===0?-40:40, opacity:0 }, { x:0, opacity:1, duration:0.9, scrollTrigger:{ trigger:c, start:"top 88%" } });
      });
      servicesRef.current.forEach((c, i) => {
        if (c) gsap.fromTo(c, { y:30, opacity:0 }, { y:0, opacity:1, duration:0.6, delay:i*0.08, scrollTrigger:{ trigger:c, start:"top 92%" } });
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

  const HotelCard = ({ hotel, featured = false }) => (
    <div onClick={() => navigate(`/property/${hotel.id}`)} className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100">
      <div className="relative overflow-hidden h-48">
        <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {featured && (
          <div className="absolute top-3 left-3 px-2.5 py-1 text-xs font-bold text-white rounded-lg" style={{ background: '#f59e0b' }}>Featured</div>
        )}
        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
          <Heart className="h-4 w-4 text-blue-600" />
        </button>
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-1 flex-1 mr-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{hotel.name}</h3>
          <div className="flex items-center gap-1 shrink-0 bg-blue-50 px-2 py-0.5 rounded-lg">
            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold text-gray-800">{hotel.rating}</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
          <MapPin className="h-3 w-3 text-blue-400" />{hotel.location}
        </p>
        <div className="flex gap-1 flex-wrap mb-3">
          {hotel.amenities.slice(0,3).map((a, i) => (
            <span key={i} className="text-[10px] font-medium bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{a}</span>
          ))}
        </div>
        <div className="flex justify-between items-center pt-3 border-t border-gray-100">
          <div>
            <span className="text-lg font-extrabold text-gray-900" style={{ fontFamily: "'Sora', sans-serif" }}>${hotel.price}</span>
            <span className="text-xs text-gray-400 ml-1">/night</span>
          </div>
          <span className="text-xs text-gray-400">{hotel.reviews} reviews</span>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ background: '#f8fafc', fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Sora:wght@700;800&display=swap');`}</style>

      {/* Contact Info Bar */}
      {/* <section ref={el => sectionsRef.current[0] = el} className="py-8 px-4 md:px-6 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon:<Phone className="h-5 w-5 text-blue-600" />, label:'Call Us', val:'0559821924', href:'tel:0559821924' },
            { icon:<Phone className="h-5 w-5 text-blue-600" />, label:'Call Us', val:'0505668081', href:'tel:0505668081' },
            { icon:<Mail className="h-5 w-5 text-blue-600" />, label:'Email', val:'a.medjoum@gmail.com', href:'mailto:a.medjoum@gmail.com' },
            { icon:<Mail className="h-5 w-5 text-blue-600" />, label:'Email', val:'mendjouma@gmail.com', href:'mailto:mendjouma@gmail.com' },
          ].map((c, i) => (
            <a key={i} href={c.href} className="flex items-center gap-3 p-4 bg-white rounded-2xl shadow-sm border border-blue-50 hover:shadow-md hover:border-blue-200 transition-all duration-200 group">
              <div className="w-11 h-11 rounded-xl bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center shrink-0 transition-colors">{c.icon}</div>
              <div className="min-w-0">
                <p className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider">{c.label}</p>
                <p className="text-sm font-bold text-gray-800 truncate">{c.val}</p>
              </div>
            </a>
          ))}
        </div>
      </section> */}

      {/* Partners */}
      <section ref={el => sectionsRef.current[1] = el} className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Our Partners</SectionLabel>
            <SectionTitle highlight="Partners">Trusted Booking</SectionTitle>
            <p className="text-gray-500 max-w-md mx-auto text-sm">Listed on the world's leading booking platforms</p>
          </div>
          <div ref={partnersRef} className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {partners.map((p, i) => (
              <div key={i} className="flex items-center justify-center p-5 bg-gray-50 rounded-2xl hover:bg-blue-50 hover:shadow-md transition-all duration-200 group border border-transparent hover:border-blue-100">
                <img src={p.logo} alt={p.name} className="h-10 object-contain grayscale group-hover:grayscale-0 transition-all duration-300" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section ref={el => sectionsRef.current[2] = el} className="py-16 md:py-20 px-4 md:px-6" style={{ background: '#eff6ff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Why Us</SectionLabel>
            <SectionTitle highlight="Alrkn Alraqy">Why Choose</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
            {whyChooseUs.map((item, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-blue-50 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 text-white group-hover:scale-110 transition-transform" style={{ background: 'linear-gradient(135deg, #1d4ed8, #3b82f6)' }}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 text-base" style={{ fontFamily: "'Sora', sans-serif" }}>{item.title}</h3>
                <p className="text-sm text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section ref={el => sectionsRef.current[3] = el} className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Limited Time</SectionLabel>
            <SectionTitle highlight="Deals">Special</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 text-white flex flex-col justify-between min-h-[220px]" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #1d4ed8 60%, #2563eb 100%)' }}>
              <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/10" />
              <div className="absolute -right-4 top-16 w-24 h-24 rounded-full bg-white/5" />
              <div className="relative z-10">
                <p className="text-blue-200 text-sm font-semibold mb-1 uppercase tracking-wider">Special Offer</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-6xl font-extrabold" style={{ fontFamily: "'Sora', sans-serif" }}>50</span>
                  <span className="text-3xl font-bold">%</span>
                  <span className="text-2xl font-semibold ml-1">OFF</span>
                </div>
                <p className="text-blue-200 mb-6">Select hotel deals across all destinations</p>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-blue-900 hover:shadow-lg transition-all hover:scale-105" style={{ background: '#f59e0b' }}>
                  Learn More <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 flex flex-col justify-between min-h-[220px]" style={{ background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 60%, #fbbf24 100%)' }}>
              <div className="absolute -left-8 -bottom-8 w-40 h-40 rounded-full bg-white/30" />
              <div className="relative z-10">
                <p className="text-yellow-700 text-sm font-semibold mb-1 uppercase tracking-wider">Member Exclusive</p>
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-2xl font-bold text-yellow-900">Get</span>
                  <span className="text-6xl font-extrabold text-yellow-900 mx-2" style={{ fontFamily: "'Sora', sans-serif" }}>20%</span>
                  <span className="text-2xl font-bold text-yellow-900">OFF!</span>
                </div>
                <p className="text-yellow-700 mb-6">Let's explore the world with exclusive member discounts</p>
                <button className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm text-white hover:shadow-lg transition-all hover:scale-105" style={{ background: '#1d4ed8' }}>
                  Book Now <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Hotels */}
      <section ref={el => sectionsRef.current[4] = el} className="py-16 md:py-20 px-4 md:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <SectionLabel>Top Picks</SectionLabel>
              <SectionTitle highlight="Hotels">Featured</SectionTitle>
            </div>
            <button onClick={() => navigate('/property')} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 group transition-colors">
              View All <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredHotels.map(h => <HotelCard key={h.id} hotel={h} featured />)}
          </div>
        </div>
      </section>

      {/* Recommended */}
      <section ref={el => sectionsRef.current[5] = el} className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-10">
            <div>
              <SectionLabel>For You</SectionLabel>
              <SectionTitle highlight="for You">Recommended</SectionTitle>
            </div>
            <button onClick={() => navigate('/property')} className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-800 group transition-colors">
              See More <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {recommendedHotels.map(h => <HotelCard key={h.id} hotel={h} />)}
          </div>
        </div>
      </section>

      {/* Prime Locations */}
      <section ref={el => sectionsRef.current[6] = el} className="py-16 md:py-20 px-4 md:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Destinations</SectionLabel>
            <SectionTitle highlight="Locations">Prime</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {destinations.map((d, i) => (
              <div key={i} ref={el => locationCardsRef.current[i] = el}
                className="group relative overflow-hidden rounded-2xl cursor-pointer shadow-md hover:shadow-xl transition-all duration-300">
                <img src={d.image} alt={d.name} className="w-full h-52 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 via-blue-900/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-5 flex justify-between items-end">
                  <div>
                    <h3 className="text-lg font-bold text-white" style={{ fontFamily: "'Sora', sans-serif" }}>{d.name}</h3>
                    <p className="text-blue-200 text-sm">{d.properties} properties</p>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-yellow-400 flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-all">
                    <ArrowRight className="h-4 w-4 text-blue-900" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section ref={el => sectionsRef.current[7] = el} className="py-16 md:py-20 px-4 md:px-6 text-white" style={{ background: 'linear-gradient(160deg, #1e3a8a 0%, #1d4ed8 100%)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel light>What We Do</SectionLabel>
            <SectionTitle highlight="Services" light>Our Premium</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <div key={i} ref={el => servicesRef.current[i] = el}
                className="group bg-white/10 backdrop-blur rounded-2xl p-6 border border-white/15 hover:bg-white/20 hover:-translate-y-1 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: 'rgba(245,158,11,0.25)', border: '1px solid rgba(245,158,11,0.4)' }}>
                  <span className="text-yellow-300">{s.icon}</span>
                </div>
                <h3 className="font-bold text-white mb-2" style={{ fontFamily: "'Sora', sans-serif" }}>{s.title}</h3>
                <p className="text-blue-200 text-sm mb-4">{s.desc}</p>
                <div className="space-y-1.5">
                  {s.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm text-blue-100">
                      <CheckCircle className="h-3.5 w-3.5 text-yellow-400 shrink-0" />{f}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <section ref={el => sectionsRef.current[8] = el} className="py-16 md:py-20 px-4 md:px-6" style={{ background: '#eff6ff' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>Reviews</SectionLabel>
            <SectionTitle highlight="Testimonials">Guest</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {reviews.map((r, i) => (
              <div key={i} ref={el => reviewCardsRef.current[i] = el}
                className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={r.image} alt={r.name} className="w-12 h-12 rounded-xl object-cover border-2 border-blue-100" />
                    <div>
                      <h4 className="font-bold text-gray-900 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{r.name}</h4>
                      <p className="text-xs text-gray-400">{r.location}</p>
                      <div className="flex items-center gap-0.5 mt-1">
                        {[...Array(r.rating)].map((_, j) => <Star key={j} className="h-3 w-3 fill-yellow-400 text-yellow-400" />)}
                      </div>
                    </div>
                  </div>
                  <Quote className="h-7 w-7 text-blue-200 shrink-0" />
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">"{r.review}"</p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-full">✓ Verified Guest</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section ref={el => sectionsRef.current[9] = el} className="py-16 md:py-20 px-4 md:px-6 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>FAQ</SectionLabel>
            <SectionTitle highlight="Questions">Frequently Asked</SectionTitle>
          </div>
          <div className="space-y-3">
            {faqs.map((f, i) => (
              <div key={i} className="border border-blue-100 rounded-2xl overflow-hidden hover:border-blue-300 transition-colors">
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700 shrink-0">{i+1}</span>
                    <span className="font-semibold text-gray-800 text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>{f.q}</span>
                  </div>
                  <div className={`w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center shrink-0 transition-transform duration-300 ${expandedFaq===i?'rotate-180 bg-blue-100':''}`}>
                    <ChevronDown className="h-4 w-4 text-blue-600" />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${expandedFaq===i?'max-h-64':'max-h-0'}`}>
                  <div className="px-6 pb-5 pl-16">
                    <p className="text-sm text-gray-600 leading-relaxed bg-blue-50 rounded-xl p-4">{f.a}</p>
                    <span className="text-[11px] text-blue-500 font-semibold mt-2 block">Category: {f.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission — LAST */}
      <section ref={el => sectionsRef.current[10] = el} className="py-16 md:py-20 px-4 md:px-6" style={{ background: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <SectionLabel>About Us</SectionLabel>
            <SectionTitle highlight="Mission">Our Vision &</SectionTitle>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 rounded-3xl overflow-hidden shadow-xl">
            <div className="p-10 md:p-14 text-white" style={{ background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)' }}>
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center mb-6">
                <Globe className="h-6 w-6 text-yellow-300" />
              </div>
              <h2 className="text-3xl font-extrabold mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Our Vision</h2>
              <p className="text-blue-100 leading-relaxed mb-8">To be a leading hospitality management company in the Middle East and beyond, setting benchmarks in quality, service, and innovation.</p>
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  {[1,2,3].map(i => <div key={i} className="w-8 h-8 rounded-full bg-blue-400/40 border-2 border-white/40" />)}
                </div>
                <span className="text-sm text-blue-200">Trusted globally</span>
              </div>
            </div>
            <div className="p-10 md:p-14 bg-white">
              <div className="w-12 h-12 rounded-2xl bg-yellow-50 flex items-center justify-center mb-6">
                <CheckCircle className="h-6 w-6 text-yellow-500" />
              </div>
              <h2 className="text-3xl font-extrabold text-gray-900 mb-4" style={{ fontFamily: "'Sora', sans-serif" }}>Our Mission</h2>
              <p className="text-gray-600 leading-relaxed mb-8">To elevate hospitality experiences through expert hotel management services that drive operational excellence, maximize profitability, and deliver outstanding guest satisfaction.</p>
              <div className="grid grid-cols-2 gap-3">
                {['Excellence','Innovation','Partnership','Growth'].map(v => (
                  <div key={v} className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center">
                      <CheckCircle className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-sm font-semibold text-gray-700">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContentSections;