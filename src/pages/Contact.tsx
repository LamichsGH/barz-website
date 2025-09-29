import React from 'react';
import { Mail, Send, MapPin } from 'lucide-react';

export default function Contact() {
  return (
    <div className="min-h-screen bg-[#E1DFD9]">
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="impact-text text-5xl md:text-7xl text-[#209D50] mb-6">
              GET IN TOUCH<span className="text-[#E1DFD9]">.</span>
            </h1>
            <p className="text-black/70 text-lg max-w-2xl mx-auto">
              Questions, suggestions, or just want to connect? We're here to help.
              Reach out and become part of the movement.
            </p>
          </div>

          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-8">
              <div className="bg-white/80 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-[#209D50]/20 p-3 rounded-full">
                    <MapPin className="h-6 w-6 text-[#209D50]" />
                  </div>
                  <h3 className="impact-text text-2xl text-black">SUGGEST A PARK</h3>
                </div>
                <p className="text-black/60 mb-4">
                  Want to suggest a new park? We'd love to hear from you!
                </p>
                <p className="text-black/60 mb-4">
                  Email your suggestions to{' '}
                  <a href="mailto:bar.jpg@gmail.com" className="text-[#209D50] hover:text-[#209D50]/80 transition-colors">
                    bar.jpg@gmail.com
                  </a>
                  {' '}with the subject line "Park suggestion" using this template:
                </p>
                <div className="bg-black/5 rounded-xl p-4 space-y-2 font-mono text-sm text-black/70">
                  <p>Park Name:</p>
                  <p>Address:</p>
                  <p>Description:</p>
                  <p>Best Features:</p>
                  <p>Photos: (Please attach 2-3 high-quality images)</p>
                  <p>Additional Notes:</p>
                </div>
                <p className="text-black/60 mt-4">
                  Your suggestions help us grow our community of park enthusiasts. We review all submissions and update our listings regularly.
                </p>
              </div>

              <div className="bg-white/80 rounded-3xl p-8 hover:bg-white/90 transition-all duration-300 shadow-lg">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="bg-[#209D50]/20 p-3 rounded-full">
                    <Mail className="h-6 w-6 text-[#209D50]" />
                  </div>
                  <h3 className="impact-text text-2xl text-black">EMAIL US</h3>
                </div>
                <p className="text-black/60">
                  For general inquiries and support:
                  <a href="mailto:info@barz.jpg" className="block text-[#209D50] hover:text-[#209D50]/80 transition-colors">
                    info@barz.jpg
                  </a>
                </p>
              </div>

              <div className="bg-[#209D50] rounded-3xl p-8 relative overflow-hidden group">
                <div className="relative z-10">
                  <h3 className="impact-text text-3xl text-white mb-4">JOIN OUR NEWSLETTER</h3>
                  <p className="text-white/80 mb-6">
                    Stay updated with new locations, events, and community highlights.
                  </p>
                  <div className="flex gap-2">
                    <input
                      type="email"
                      placeholder="Enter your email"
                      className="flex-1 bg-white/20 rounded-full px-6 py-3 text-white placeholder-white/60
                        border-2 border-transparent focus:border-white/40 outline-none transition-all duration-300"
                    />
                    <button className="bg-black/30 hover:bg-black/50 text-white p-3 rounded-full
                      transition-all duration-300 group-hover:scale-105">
                      <Send className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-[#209D50] to-[#209D50]/50
                  group-hover:scale-105 transition-transform duration-500" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}