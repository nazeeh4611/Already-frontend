import React from 'react';
import { ArrowRight, User, CreditCard, Check, Mail, Phone, UserCircle, Shield } from 'lucide-react';
import axios from 'axios';
import { baseurl } from '../Base/Base';

const CheckoutDetails = ({ formData, handleInputChange, nextStep, validateStep }) => {
  const token = localStorage.getItem('authToken');
  const urlParams = new URLSearchParams(window.location.search);
  const bookingId = urlParams.get("bookingId");

  const sendDetails = async () => {
    try {
      const response = await axios.put(
        `${baseurl}user/update-details`,
        { name: formData.name, email: formData.email, phone: formData.phone, bookingId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return response.status === 200;
    } catch (error) {
      console.error(error);
      return false;
    }
  };

  const handleNext = async () => {
    const success = await sendDetails();
    if (success) {
      nextStep();
    }
  };

  return (
    <>
      <div className="flex justify-center mb-12">
        <div className="flex items-center gap-12 relative">
          <div className="absolute top-5 left-8 right-8 h-0.5 bg-blue-200"></div>
          <div className="absolute top-5 left-8 w-2/3 h-0.5 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0]"></div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] text-white shadow-lg shadow-blue-200">
              <User className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#1846ca]">Details</span>
          </div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-white border-2 border-blue-200 text-blue-400">
              <CreditCard className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Payment</span>
          </div>
          
          <div className="flex flex-col items-center relative z-10">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-2 bg-white border-2 border-blue-200 text-blue-400">
              <Check className="w-5 h-5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Complete</span>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 mb-2">Guest Information</h2>
        <p className="text-sm text-gray-500">Please provide your details to continue</p>
      </div>
      
      <div className="space-y-6 animate-fadeIn">
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
            <UserCircle className="w-4 h-4 inline mr-1" /> Full Name *
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter your full name"
            required
            className="w-full px-5 py-4 border-2 border-blue-100 rounded-2xl focus:outline-none focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-blue-300 bg-blue-50/30 text-gray-900 text-base"
          />
        </div>
        
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
            <Mail className="w-4 h-4 inline mr-1" /> Email Address *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="Enter your email"
            required
            className="w-full px-5 py-4 border-2 border-blue-100 rounded-2xl focus:outline-none focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-blue-300 bg-blue-50/30 text-gray-900 text-base"
          />
        </div>
        
        <div className="relative">
          <label className="block text-xs font-bold uppercase tracking-widest text-blue-400 mb-2">
            <Phone className="w-4 h-4 inline mr-1" /> Phone Number / WhatsApp *
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Enter your phone number"
            required
            className="w-full px-5 py-4 border-2 border-blue-100 rounded-2xl focus:outline-none focus:border-[#1846ca] focus:ring-4 focus:ring-blue-100 transition-all duration-300 hover:border-blue-300 bg-blue-50/30 text-gray-900 text-base"
          />
        </div>
        
        <button 
          onClick={handleNext}
          disabled={!validateStep(1)}
          className="flex items-center justify-center gap-2 w-full py-5 px-6 bg-gradient-to-r from-[#1846ca] to-[#2a5ae0] hover:from-[#1234a0] hover:to-[#1846ca] text-white rounded-2xl font-bold text-base transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          style={{ boxShadow: '0 10px 25px rgba(24,70,202,0.3)' }}
        >
          Continue to Payment 
          <ArrowRight className="w-5 h-5" />
        </button>

        <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100 mt-4">
          <p className="text-xs text-blue-600 font-medium flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Your information is secure and encrypted
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </>
  );
};

export default CheckoutDetails;