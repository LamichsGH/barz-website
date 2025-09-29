import React from 'react';
import { Star } from 'lucide-react';

const images = {
  movement: "https://i.imgur.com/x7djQKN.jpg",
  mission: "https://i.imgur.com/JJJbEaM.jpg",
  journey: "https://i.imgur.com/mMhr8Vl.jpg"
};

export default function About() {
  return (
    <div className="min-h-screen bg-[#E1DFD9]">
      <section className="relative py-24 md:py-32 pt-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-32">
            {/* The Movement Section */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="space-y-6">
                <h2 className="impact-text text-5xl md:text-6xl lg:text-7xl text-[#209D50]">
                  THE MOVEMENT<span className="text-[#E1DFD9]">.</span>
                </h2>
                <p className="text-lg text-black/80 leading-[1.6] space-y-4">
                  BARZ.JPG was born from a simple idea: capturing the spirit of the calisthenics 
                  community and making it easier for people to find local workout spots.
                </p>
                <p className="text-lg text-black/80 leading-[1.6]">
                  The best gym is the one that's always open, always free, and right around 
                  the corner. Our goal is to bring people together, inspire each other, and show 
                  that anyone can start their fitness journey.
                </p>
              </div>
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src={images.movement}
                  alt="The Movement"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                />
              </div>
            </div>

            {/* Our Mission Section */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl md:order-2 relative">
                <img
                  src={images.mission}
                  alt="Our Mission"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                />
              </div>
              <div className="md:order-1">
                <div className="space-y-6">
                  <h3 className="impact-text text-2xl text-black">OUR MISSION</h3>
                  <p className="text-lg text-black/80 leading-[1.6]">
                    Our mission is to build the go-to platform for the calisthenics community, 
                    making it easy for people to discover parks and connect with others.
                  </p>
                  <p className="text-lg text-black/80 leading-[1.6]">
                    We're not just mapping workout spots—we're creating a space where people 
                    can come together, support each other, and grow stronger as a community.
                  </p>
                </div>
              </div>
            </div>

            {/* The Journey Section */}
            <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
              <div className="space-y-6">
                  <h3 className="impact-text text-2xl text-black">THE JOURNEY</h3>
                  <p className="text-lg text-black/80 leading-[1.6]">
                    It all started with capturing the energy and spirit of London's calisthenics 
                    community on Instagram. The community is motivating, welcoming, and always 
                    looking to improve.
                  </p>
                  <p className="text-lg text-black/80 leading-[1.6]">
                    While searching for parks, I realized there wasn't an easy way for people to 
                    find local workout spots. So, I created this hub to help people discover parks, 
                    connect with others, and be part of our growing community.
                  </p>
              </div>
              <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl relative">
                <img
                  src={images.journey}
                  alt="The Journey"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-700"
                />
              </div>
            </div>

            {/* Join Us Section */}
            <div className="max-w-2xl mx-auto text-center">
              <div className="space-y-6">
                <div>
                  <h3 className="impact-text text-2xl text-black">JOIN US</h3>
                  <p className="text-lg text-black/80 leading-[1.6] mt-4">
                    Whether you're working toward your first pull-up or reaching for new heights, 
                    BARZ.JPG is a place where every step counts.
                  </p>
                  <p className="text-lg text-black/80 leading-[1.6] mt-4">
                    It's more than just fitness—it's about pushing your limits, supporting 
                    one another, and celebrating progress, big or small.
                  </p>
                </div>

                <div className="transform hover:scale-105 transition-transform duration-300 mt-12">
                  <p className="impact-text text-4xl md:text-5xl text-[#209D50]">50+</p>
                  <p className="text-sm text-black/60 mt-2">PARKS MAPPED</p>
                </div>
                <a
                  href="https://instagram.com/barz.jpg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-12 bg-[#209D50]/90 text-white px-12 py-4 rounded-full text-lg
                  impact-text border-2 border-black hover:bg-[#209D50] transition-all duration-300
                  transform hover:scale-105 tracking-wider whitespace-nowrap inline-block">
                  JOIN THE MOVEMENT
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}