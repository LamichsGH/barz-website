import React from 'react';
import { Timer, AlertCircle } from 'lucide-react';

export default function Workouts() {
  return (
    <div className="min-h-screen bg-[#E1DFD9]">
      <section className="pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="impact-text text-5xl md:text-7xl text-[#209D50] mb-6">
              WORKOUTS<span className="text-[#E1DFD9]">.</span>
            </h1>
            <p className="text-black/70 text-lg max-w-2xl mx-auto">
              Our workout plans are currently being developed by fitness experts.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 rounded-3xl p-8 shadow-lg text-center">
              <div className="relative mb-8">
                <Timer className="w-20 h-20 text-[#209D50] animate-pulse mx-auto" />
                <div className="absolute -bottom-2 -right-1/2 translate-x-1/2">
                  <AlertCircle className="w-8 h-8 text-[#209D50]" />
                </div>
              </div>
              
              <h2 className="impact-text text-2xl text-black mb-4">
                COMING SOON
              </h2>
              
              <p className="text-black/70 mb-8">
                We're crafting a comprehensive collection of calisthenics workout plans 
                tailored for all skill levels. Sign up to be notified when they're ready.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-black/5 rounded-full px-6 py-3 text-black
                    border-2 border-transparent focus:border-[#209D50]/50 
                    outline-none transition-all duration-300"
                />
                <button className="bg-[#209D50]/90 text-white px-8 py-3 rounded-full
                  impact-text border-2 border-black hover:bg-[#209D50] 
                  transition-all duration-300 whitespace-nowrap">
                  NOTIFY ME
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}