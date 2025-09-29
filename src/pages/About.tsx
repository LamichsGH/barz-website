import React from 'react';
import { Star } from 'lucide-react';

const images = {
  movement: "https://i.imgur.com/x7djQKN.jpg",
  mission: "https://i.imgur.com/JJJbEaM.jpg",
  journey: "https://i.imgur.com/mMhr8Vl.jpg"
};

export default function About() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E1DFD9] via-[#E1DFD9] to-[#D5D3CD]">
      {/* Hero Section */}
      <section className="relative pt-32 pb-16">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/5 pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <h1 className="impact-text text-6xl md:text-8xl lg:text-9xl text-primary mb-6">
              ABOUT<span className="text-primary/60">.</span>
            </h1>
            <div className="w-24 h-1 bg-primary mx-auto"></div>
          </div>
        </div>
      </section>

      <section className="relative pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-40">
            {/* The Movement Section */}
            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="space-y-8 md:pr-8">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                    <span className="text-sm font-semibold text-primary tracking-wider">01</span>
                  </div>
                  <h2 className="impact-text text-5xl md:text-7xl lg:text-8xl text-primary leading-none">
                    THE<br/>MOVEMENT<span className="text-primary/40">.</span>
                  </h2>
                </div>
                <div className="space-y-6 pl-4 border-l-4 border-primary/20">
                  <p className="text-xl text-foreground/90 leading-relaxed font-medium">
                    BARZ.JPG was born from a simple idea: capturing the spirit of the calisthenics 
                    community and making it easier for people to find local workout spots.
                  </p>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    The best gym is the one that's always open, always free, and right around 
                    the corner. Our goal is to bring people together, inspire each other, and show 
                    that anyone can start their fitness journey.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 p-2">
                  <img
                    src={images.movement}
                    alt="The Movement - Calisthenics community workout"
                    className="w-full h-full object-cover rounded-xl hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary/10 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Our Mission Section */}
            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="relative md:order-2">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 p-2">
                  <img
                    src={images.mission}
                    alt="Our Mission - Building calisthenics community platform"
                    className="w-full h-full object-cover rounded-xl hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-primary/10 rounded-full blur-xl"></div>
              </div>
              <div className="md:order-1 md:pl-8">
                <div className="space-y-8">
                  <div className="space-y-4">
                    <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                      <span className="text-sm font-semibold text-primary tracking-wider">02</span>
                    </div>
                    <h3 className="impact-text text-4xl md:text-6xl text-foreground leading-tight">
                      OUR MISSION
                    </h3>
                  </div>
                  <div className="space-y-6 pl-4 border-l-4 border-primary/20">
                    <p className="text-xl text-foreground/90 leading-relaxed font-medium">
                      Our mission is to build the go-to platform for the calisthenics community, 
                      making it easy for people to discover parks and connect with others.
                    </p>
                    <p className="text-lg text-foreground/80 leading-relaxed">
                      We're not just mapping workout spots—we're creating a space where people 
                      can come together, support each other, and grow stronger as a community.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* The Journey Section */}
            <div className="grid md:grid-cols-2 gap-16 md:gap-24 items-center">
              <div className="space-y-8 md:pr-8">
                <div className="space-y-4">
                  <div className="inline-block px-4 py-2 bg-primary/10 rounded-full">
                    <span className="text-sm font-semibold text-primary tracking-wider">03</span>
                  </div>
                  <h3 className="impact-text text-4xl md:text-6xl text-foreground leading-tight">
                    THE JOURNEY
                  </h3>
                </div>
                <div className="space-y-6 pl-4 border-l-4 border-primary/20">
                  <p className="text-xl text-foreground/90 leading-relaxed font-medium">
                    It all started with capturing the energy and spirit of London's calisthenics 
                    community on Instagram. The community is motivating, welcoming, and always 
                    looking to improve.
                  </p>
                  <p className="text-lg text-foreground/80 leading-relaxed">
                    While searching for parks, I realized there wasn't an easy way for people to 
                    find local workout spots. So, I created this hub to help people discover parks, 
                    connect with others, and be part of our growing community.
                  </p>
                </div>
              </div>
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-xl bg-gradient-to-br from-primary/10 to-primary/5 p-2">
                  <img
                    src={images.journey}
                    alt="The Journey - London calisthenics community Instagram origin"
                    className="w-full h-full object-cover rounded-xl hover:scale-105 transition-all duration-700"
                  />
                </div>
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
              </div>
            </div>

            {/* Join Us Section */}
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl p-12 md:p-16 text-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"></div>
                <div className="absolute top-0 left-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl"></div>
                <div className="absolute bottom-0 right-1/4 w-40 h-40 bg-primary/10 rounded-full blur-2xl"></div>
                
                <div className="relative z-10 space-y-8">
                  <div className="space-y-6">
                    <div className="inline-block px-4 py-2 bg-primary/20 rounded-full">
                      <span className="text-sm font-semibold text-primary tracking-wider">04</span>
                    </div>
                    <h3 className="impact-text text-5xl md:text-7xl text-foreground leading-tight">
                      JOIN US
                    </h3>
                    <div className="max-w-2xl mx-auto space-y-6">
                      <p className="text-xl text-foreground/90 leading-relaxed font-medium">
                        Whether you're working toward your first pull-up or reaching for new heights, 
                        BARZ.JPG is a place where every step counts.
                      </p>
                      <p className="text-lg text-foreground/80 leading-relaxed">
                        It's more than just fitness—it's about pushing your limits, supporting 
                        one another, and celebrating progress, big or small.
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-center gap-12 py-8">
                    <div className="text-center group cursor-default">
                      <div className="transform group-hover:scale-110 transition-transform duration-300">
                        <p className="impact-text text-6xl md:text-7xl text-primary mb-2">50+</p>
                        <p className="text-sm font-semibold text-foreground/70 tracking-wider uppercase">Parks Mapped</p>
                      </div>
                    </div>
                    
                    <div className="w-px h-16 bg-primary/20 hidden sm:block"></div>
                    
                    <div className="text-center">
                      <a
                        href="https://instagram.com/barz.jpg"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full
                        impact-text text-lg tracking-wider transition-all duration-300
                        hover:bg-primary/90 hover:scale-105 hover:shadow-lg
                        border-2 border-primary hover:border-primary/80
                        shadow-lg hover:shadow-xl">
                        JOIN THE MOVEMENT
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}