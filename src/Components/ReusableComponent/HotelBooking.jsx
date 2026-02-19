import React from "react";
import { motion } from "framer-motion";
import { Phone, Mail, MapPin, Star } from "lucide-react";

const HotelBooking = () => {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(24,70,202,0.15)_0%,_transparent_70%)]" />
      
      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 50, opacity: 1 }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
        className="absolute top-20 left-0 w-48 h-24 bg-white/30 backdrop-blur-sm rounded-full"
      ></motion.div>

      <motion.div
        initial={{ x: 200, opacity: 0 }}
        animate={{ x: -50, opacity: 1 }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "mirror" }}
        className="absolute bottom-20 right-0 w-56 h-28 bg-white/30 backdrop-blur-sm rounded-full"
      ></motion.div>

      <motion.div
        initial={{ x: -200, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="flex flex-col items-center relative z-10"
      >
        <div className="flex items-center space-x-6">
          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="w-16 h-32 bg-gradient-to-b from-[#1846ca] to-[#2a5ae0] rounded-2xl shadow-xl"
          ></motion.div>
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 3.5, repeat: Infinity }}
            className="w-16 h-32 bg-gradient-to-b from-pink-500 to-pink-600 rounded-2xl shadow-xl"
          ></motion.div>
        </div>
        <div className="flex space-x-4 mt-4">
          <motion.div
            animate={{ x: [0, -3, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-20 bg-gray-700 rounded-xl shadow-lg"
          ></motion.div>
          <motion.div
            animate={{ x: [0, 3, 0] }}
            transition={{ duration: 2.2, repeat: Infinity }}
            className="w-14 h-24 bg-emerald-700 rounded-xl shadow-lg"
          ></motion.div>
        </div>
      </motion.div>

      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="ml-16 w-72 bg-white rounded-3xl shadow-2xl overflow-hidden relative"
        style={{ boxShadow: '0 30px 60px rgba(24,70,202,0.25)' }}
      >
        <div className="h-32 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] relative">
          <div className="absolute -bottom-10 left-6 w-20 h-20 bg-white rounded-2xl shadow-xl flex items-center justify-center">
            <Hotel className="w-10 h-10 text-[#1846ca]" />
          </div>
        </div>
        
        <div className="pt-12 px-6 pb-6">
          <h3 className="text-xl font-black text-gray-900 mb-1">Luxury Suite</h3>
          <div className="flex items-center gap-1 mb-3">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            ))}
          </div>
          
          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="w-4 h-4 text-[#1846ca]" />
              <span>Dubai Marina</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Phone className="w-4 h-4 text-[#1846ca]" />
              <span>+971 55 517 5056</span>
            </div>
          </div>
          
          <div className="flex items-baseline gap-2 mb-4">
            <span className="text-3xl font-black text-[#1846ca]">AED 899</span>
            <span className="text-sm text-gray-400">/night</span>
          </div>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="w-full py-4 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white rounded-2xl font-bold text-base shadow-lg"
          >
            BOOK NOW
          </motion.button>
          
          <div className="mt-4 flex justify-center gap-4">
            <a href="tel:+971555175056" className="p-3 bg-blue-50 rounded-xl text-[#1846ca] hover:bg-blue-100 transition">
              <Phone className="w-5 h-5" />
            </a>
            <a href="mailto:info@alrknalraqy.com" className="p-3 bg-blue-50 rounded-xl text-[#1846ca] hover:bg-blue-100 transition">
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default HotelBooking;