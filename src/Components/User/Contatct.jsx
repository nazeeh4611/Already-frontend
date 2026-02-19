// ContactPage.jsx
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    propertyType: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          access_key: 'f1a19ad9-9569-420e-81a0-b84474abd66a',
          ...formData
        })
      });
      
      const result = await response.json();
      
      if (result.success) {
        toast.success('Message sent successfully!');
        setFormData({ 
          name: '', 
          email: '', 
          phone: '', 
          propertyType: '', 
          message: '' 
        });
      }
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-16 md:pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative bg-[#333BF5] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <circle cx="50" cy="50" r="40" fill="none" stroke="white" strokeWidth="0.5"/>
            </svg>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-white/80 text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 block">Get in Touch</span>
              <h1 className="text-4xl md:text-6xl font-light text-white mb-4 md:mb-6 leading-tight">
                Partner With
                <span className="block font-semibold mt-1 md:mt-2">Alrkn Alraqy</span>
              </h1>
              <div className="w-20 md:w-24 h-1 bg-[#FFD700] mx-auto mb-6 md:mb-8"></div>
              <p className="text-base md:text-xl text-white/90 leading-relaxed">
                Let's discuss how we can elevate your property with our premium hotel management services.
              </p>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-16">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 mb-16 md:mb-24">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-16">
              {/* Contact Form */}
              <div>
                <span className="text-[#FFD700] text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 block">Inquiry Form</span>
                <h2 className="text-2xl md:text-4xl font-light text-[#333BF5] mb-8 md:mb-12">
                  Interested in Our
                  <span className="block font-semibold mt-1 md:mt-2">Management Services?</span>
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4 md:space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Your Full Name *"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      required
                      className="w-full px-0 py-2 md:py-3 bg-transparent border-b border-[#333BF5]/20 focus:border-[#FFD700] outline-none text-[#333BF5] text-sm md:text-base placeholder-[#333BF5]/40 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Email Address *"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                      className="w-full px-0 py-2 md:py-3 bg-transparent border-b border-[#333BF5]/20 focus:border-[#FFD700] outline-none text-[#333BF5] text-sm md:text-base placeholder-[#333BF5]/40 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number *"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      required
                      className="w-full px-0 py-2 md:py-3 bg-transparent border-b border-[#333BF5]/20 focus:border-[#FFD700] outline-none text-[#333BF5] text-sm md:text-base placeholder-[#333BF5]/40 transition-colors"
                    />
                  </div>
                  
                  <div>
                    <select
                      value={formData.propertyType}
                      onChange={(e) => setFormData({...formData, propertyType: e.target.value})}
                      required
                      className="w-full px-0 py-2 md:py-3 bg-transparent border-b border-[#333BF5]/20 focus:border-[#FFD700] outline-none text-[#333BF5] text-sm md:text-base"
                    >
                      <option value="" disabled selected>Property Type *</option>
                      <option value="hotel">Hotel</option>
                      <option value="resort">Resort</option>
                      <option value="serviced-apartment">Serviced Apartment</option>
                      <option value="villa">Villa</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Tell us about your property and requirements *"
                      value={formData.message}
                      onChange={(e) => setFormData({...formData, message: e.target.value})}
                      required
                      rows="4"
                      className="w-full px-0 py-2 md:py-3 bg-transparent border-b border-[#333BF5]/20 focus:border-[#FFD700] outline-none text-[#333BF5] text-sm md:text-base placeholder-[#333BF5]/40 transition-colors resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center justify-center md:justify-start space-x-2 md:space-x-3 bg-[#333BF5] text-white px-6 md:px-8 py-3 md:py-4 rounded-full w-full md:w-auto hover:bg-[#FFD700] transition-all duration-300 disabled:opacity-50 group"
                  >
                    <span className="font-medium text-sm md:text-base">
                      {loading ? 'Sending...' : 'Send Inquiry'}
                    </span>
                    <svg className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </button>
                </form>
              </div>

              {/* Contact Info */}
              <div className="space-y-8 md:space-y-12 mt-8 md:mt-0">
                <div>
                  <span className="text-[#FFD700] text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 block">Contact Details</span>
                  <h2 className="text-2xl md:text-4xl font-light text-[#333BF5] mb-8 md:mb-12">
                    Get in Touch
                    <span className="block font-semibold mt-1 md:mt-2">With Our Team</span>
                  </h2>
                </div>

                <div className="space-y-6 md:space-y-8">
                  <div className="flex items-start space-x-3 md:space-x-6 group cursor-pointer" onClick={() => window.location = 'tel:+971559821924'}>
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#333BF5]/10 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#333BF5] transition-all duration-300">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-[#333BF5] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-[#333BF5]/40 mb-1">Call Our Team</p>
                      <p className="text-base md:text-xl text-[#333BF5] font-medium">055 982 1924</p>
                      <p className="text-sm md:text-lg text-[#333BF5]/80">050 566 8081</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 md:space-x-6 group cursor-pointer" onClick={() => window.location = 'mailto:a.medjoum@gmail.com'}>
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#FFD700]/10 rounded-xl md:rounded-2xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFD700] transition-all duration-300">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-[#FFD700] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-[#333BF5]/40 mb-1">Email Us</p>
                      <p className="text-base md:text-xl text-[#333BF5] font-medium">a.medjoum@gmail.com</p>
                      <p className="text-sm md:text-lg text-[#333BF5]/80">mendjouma@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 md:space-x-6">
                    <div className="w-12 h-12 md:w-14 md:h-14 bg-[#333BF5]/10 rounded-xl md:rounded-2xl flex items-center justify-center">
                      <svg className="w-5 h-5 md:w-6 md:h-6 text-[#333BF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-[#333BF5]/40 mb-1">Visit Our Office</p>
                      <p className="text-base md:text-xl text-[#333BF5] font-medium">Iris Tower</p>
                      <p className="text-sm md:text-lg text-[#333BF5]/80">Business Bay, Dubai</p>
                    </div>
                  </div>
                </div>

                {/* Management Team */}
                <div className="bg-[#F6F3F0] p-6 md:p-8 rounded-xl md:rounded-2xl">
                  <h3 className="text-lg md:text-xl font-semibold text-[#333BF5] mb-4 md:mb-6">Management Team</h3>
                  <div className="space-y-3 md:space-y-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#FFD700] rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-xs md:text-sm">AM</span>
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-medium text-[#333BF5]">Ahmed Medjoum</p>
                        <p className="text-xs md:text-sm text-[#333BF5]/60">General Manager</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 md:w-10 md:h-10 bg-[#333BF5] rounded-lg flex items-center justify-center">
                        <span className="text-white font-semibold text-xs md:text-sm">KM</span>
                      </div>
                      <div>
                        <p className="text-sm md:text-base font-medium text-[#333BF5]">Karim Medjoum</p>
                        <p className="text-xs md:text-sm text-[#333BF5]/60">Operations Director</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Business Hours */}
                <div className="border-l-4 border-[#FFD700] pl-4 md:pl-6">
                  <h3 className="text-base md:text-lg font-semibold text-[#333BF5] mb-2">Business Hours</h3>
                  <p className="text-xs md:text-sm text-[#333BF5]/70">Monday - Friday: 9:00 AM - 6:00 PM</p>
                  <p className="text-xs md:text-sm text-[#333BF5]/70">Saturday: 10:00 AM - 2:00 PM</p>
                  <p className="text-xs md:text-sm text-[#333BF5]/70">Sunday: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* Why Choose Us Section */}
          <div className="bg-[#F6F3F0] rounded-2xl md:rounded-3xl p-6 md:p-12 mb-16 md:mb-24">
            <div className="text-center mb-8 md:mb-12">
              <span className="text-[#FFD700] text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 block">Why Partner With Us</span>
              <h2 className="text-2xl md:text-4xl font-light text-[#333BF5] mb-4 md:mb-6">Hotel Management Excellence</h2>
              <div className="w-20 md:w-24 h-1 bg-[#333BF5] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { number: '15+', label: 'Years Experience' },
                { number: '25+', label: 'Properties Managed' },
                { number: '100%', label: 'Client Satisfaction' },
                { number: '24/7', label: 'Support Available' }
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <div className="text-2xl md:text-4xl font-bold text-[#333BF5] mb-1 md:mb-2">{stat.number}</div>
                  <p className="text-xs md:text-sm text-[#333BF5]/60">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}