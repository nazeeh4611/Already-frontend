// AboutUs.jsx
import React from 'react';
import Navbar from '../../Layout/Navbar';
import Footer from '../../Layout/Footer';

export default function AboutUs() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="pt-16 md:pt-20 pb-16">
        {/* Hero Section */}
        <div className="relative bg-[#333BF5] overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0 0 L100 100 M100 0 L0 100" stroke="white" strokeWidth="0.5"/>
            </svg>
          </div>
          <div className="px-4 sm:px-6 lg:px-8 py-16 md:py-24">
            <div className="max-w-3xl mx-auto md:mx-0">
              <span className="text-white/80 text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 block">Welcome to</span>
              <h1 className="text-4xl md:text-6xl font-light text-white mb-4 md:mb-6 leading-tight">
                Alrkn Alraqy
                <span className="block font-semibold mt-1 md:mt-2">Hotel Management</span>
              </h1>
              <div className="w-20 md:w-24 h-1 bg-[#FFD700] mb-6 md:mb-8"></div>
              <p className="text-base md:text-xl text-white/90 leading-relaxed">
                Redefining hospitality excellence through innovation, integrity, and impeccable service.
              </p>
            </div>
          </div>
        </div>

        {/* Company Story */}
        <div className="px-4 sm:px-6 lg:px-8 -mt-8 md:-mt-16">
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl p-6 md:p-12 mb-16 md:mb-24">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-start">
              <div>
                <span className="text-[#FFD700] text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 block">Our Story</span>
                <h2 className="text-2xl md:text-4xl font-light text-[#333BF5] mb-6 md:mb-8">
                  Premier Hospitality
                  <span className="block font-semibold mt-1 md:mt-2">Management Company</span>
                </h2>
                <div className="space-y-4 md:space-y-6 text-[#333BF5]/80 leading-relaxed text-sm md:text-base">
                  <p>
                    Alrkn Alraqy Hotel Management stands as a beacon of excellence in the Dubai hospitality scene. Founded on a deep understanding of both regional charm and global standards, we've crafted a unique approach that puts guest satisfaction at the heart of everything we do.
                  </p>
                  <p>
                    Our team of industry professionals brings decades of combined experience, ensuring every property under our care not just meets but exceeds expectations. We don't just manage hotels; we curate experiences that linger in memories long after check-out.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4 md:space-y-6 mt-4 md:mt-0">
                <div className="bg-[#F6F3F0] p-6 md:p-8 rounded-xl md:rounded-2xl border-l-4 border-[#FFD700]">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#333BF5] mb-3 md:mb-4">Our Vision</h3>
                  <p className="text-[#333BF5] text-sm md:text-base leading-relaxed">
                    To be the most trusted name in Middle Eastern hospitality, where every stay tells a story and every partnership builds lasting value.
                  </p>
                </div>
                
                <div className="bg-[#F6F3F0] p-6 md:p-8 rounded-xl md:rounded-2xl border-l-4 border-[#333BF5]">
                  <h3 className="text-xl md:text-2xl font-semibold text-[#FFD700] mb-3 md:mb-4">Our Mission</h3>
                  <p className="text-[#333BF5] text-sm md:text-base leading-relaxed">
                    To deliver exceptional hospitality through innovative management, passionate service, and unwavering commitment to quality.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Values */}
          <div className="mb-16 md:mb-24">
            <div className="text-center mb-10 md:mb-16">
              <span className="text-[#FFD700] text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 block">What Drives Us</span>
              <h2 className="text-3xl md:text-5xl font-light text-[#333BF5] mb-4 md:mb-6">Our Core Values</h2>
              <div className="w-20 md:w-24 h-1 bg-[#333BF5] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
              {[
                { title: 'Excellence', desc: 'Setting benchmarks in quality and service' },
                { title: 'Innovation', desc: 'Embracing new ideas and technologies' },
                { title: 'Integrity', desc: 'Honest and transparent in all we do' },
                { title: 'Partnership', desc: 'Building lasting relationships' }
              ].map((value, i) => (
                <div key={i} className="text-center group">
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl mx-auto mb-4 md:mb-6 flex items-center justify-center text-white text-lg md:text-2xl font-light bg-[#333BF5] group-hover:bg-[#FFD700] transition-all duration-500">
                    0{i+1}
                  </div>
                  <h3 className="text-base md:text-xl font-semibold text-[#333BF5] mb-2 md:mb-3">{value.title}</h3>
                  <p className="text-xs md:text-sm text-[#333BF5]/60 leading-relaxed">{value.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              {/* Contact Details */}
              <div className="p-6 md:p-12 order-2 md:order-1">
                <span className="text-[#FFD700] text-xs md:text-sm tracking-widest uppercase mb-3 md:mb-4 block">Get in Touch</span>
                <h2 className="text-2xl md:text-4xl font-light text-[#333BF5] mb-8 md:mb-12">
                  Let's Connect
                  <span className="block font-semibold mt-1 md:mt-2">And Create Together</span>
                </h2>
                
                <div className="space-y-4 md:space-y-6">
                  <div className="flex items-start space-x-3 md:space-x-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#333BF5]/10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#333BF5] transition-colors duration-300">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-[#333BF5] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-[#333BF5]/60 mb-1">Phone Numbers</p>
                      <p className="text-sm md:text-base text-[#333BF5] font-medium">055 982 1924</p>
                      <p className="text-sm md:text-base text-[#333BF5] font-medium">050 566 8081</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 md:space-x-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#FFD700]/10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-[#FFD700] transition-colors duration-300">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-[#FFD700] group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-[#333BF5]/60 mb-1">Email Addresses</p>
                      <p className="text-sm md:text-base text-[#333BF5] font-medium">a.medjoum@gmail.com</p>
                      <p className="text-sm md:text-base text-[#333BF5] font-medium">mendjouma@gmail.com</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3 md:space-x-4 group">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-[#333BF5]/10 rounded-lg md:rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 md:w-5 md:h-5 text-[#333BF5]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs md:text-sm text-[#333BF5]/60 mb-1">Office Address</p>
                      <p className="text-sm md:text-base text-[#333BF5] font-medium">Iris Tower, Business Bay</p>
                      <p className="text-sm md:text-base text-[#333BF5]/80">Dubai, UAE</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map/Image Section */}
              <div className="relative min-h-[250px] md:min-h-[400px] bg-[#333BF5] order-1 md:order-2">
                <div className="absolute inset-0 opacity-20">
                  <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <pattern id="grid" patternUnits="userSpaceOnUse" width="10" height="10">
                      <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5"/>
                    </pattern>
                    <rect width="100" height="100" fill="url(#grid)"/>
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center text-white p-6 md:p-12">
                    <div className="w-16 h-16 md:w-24 md:h-24 border-2 border-white/30 rounded-xl md:rounded-2xl flex items-center justify-center mx-auto mb-4 md:mb-6 backdrop-blur">
                      <span className="text-2xl md:text-4xl font-light">AR</span>
                    </div>
                    <h3 className="text-xl md:text-2xl font-light mb-1 md:mb-2">Alrkn Alraqy</h3>
                    <p className="text-sm md:text-base text-white/80">Hotel Management</p>
                    <div className="w-8 md:w-12 h-1 bg-[#FFD700] mx-auto mt-4 md:mt-6"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}