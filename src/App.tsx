import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { Instagram, ShoppingCart, Menu, X, Timer, AlertCircle } from 'lucide-react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import About from './pages/About';
import Parks from './pages/Parks';
import Contact from './pages/Contact';
import Workouts from './pages/Workouts';
import Store from './pages/Store';
import Legal from './pages/Legal';
import NotFound from './pages/NotFound';

const queryClient = new QueryClient();

function AppContent() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isCartOpen, setIsCartOpen] = React.useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#209D50] via-black to-[#209D50]/80 flex flex-col">
      {/* Navigation */}
      <nav className="fixed w-full z-50 bg-black/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <div className="flex items-center group">
              <Link to="/" className="group">
                <span className="text-3xl md:text-4xl text-[#E1DFD9] logo-text group-hover:text-[#E1DFD9] transition-colors duration-300">
                  BARZ<span className="mx-[0.1em]">.</span>JPG
                </span>
              </Link>
            </div>
            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="flex items-center space-x-2">
                <Link to="/about" className="px-6 py-2 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-full transition-all duration-300 impact-text text-xl">
                  ABOUT
                </Link>
                <Link to="/workouts" className="px-6 py-2 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-full transition-all duration-300 impact-text text-xl">
                  WORKOUTS
                </Link>
                <Link to="/parks" className="px-6 py-2 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-full transition-all duration-300 impact-text text-xl">
                  PARKS
                </Link>
                <Link to="/contact" className="px-6 py-2 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-full transition-all duration-300 impact-text text-xl">
                  CONTACT
                </Link>
                <Link to="/store" className="px-6 py-2 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-full transition-all duration-300 impact-text text-xl">
                  STORE
                </Link>
              </div>
            </div>
            <div className="flex items-center space-x-8 md:space-x-16">
              <div className="flex items-center space-x-4">
                <a 
                  href="https://instagram.com/barz.jpg" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#E1DFD9] hover:text-[#209D50] transition-colors flex items-center"
                >
                  <Instagram className="h-5 w-5" />
                </a>
              </div>
              <div className="relative flex items-center" onClick={() => setIsCartOpen(true)}>
                <ShoppingCart className="h-5 w-5 text-[#E1DFD9] hover:text-[#209D50] cursor-pointer transition-colors" />
                <span className="absolute -top-2 -right-2 bg-[#209D50] text-xs text-white rounded-full h-4 w-4 flex items-center justify-center">0</span>
              </div>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden flex items-center text-[#E1DFD9] hover:text-[#209D50] transition-colors"
              >
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden">
              <div className="px-2 pt-4 pb-6 space-y-2">
                <Link to="/about" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-lg transition-all duration-300 impact-text text-2xl">ABOUT</Link>
                <Link to="/workouts" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-lg transition-all duration-300 impact-text text-2xl">WORKOUTS</Link>
                <Link to="/parks" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-lg transition-all duration-300 impact-text text-2xl">PARKS</Link>
                <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-lg transition-all duration-300 impact-text text-2xl">CONTACT</Link>
                <Link to="/store" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 text-[#E1DFD9] hover:text-[#209D50] hover:bg-white/5 rounded-lg transition-all duration-300 impact-text text-2xl">STORE</Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      {location.pathname === '/' && (
      <section className="relative flex flex-1 items-center justify-center px-4">
        <div className="absolute inset-0 bg-[url('https://i.imgur.com/fAQWVHF.jpg')] bg-cover bg-[center_30%]"></div>
        <div className="absolute inset-0 bg-black/40"></div>

        <div className="relative z-10 flex flex-col items-center text-center gap-[clamp(0.5rem,2vh,1rem)] pb-[max(2rem,env(safe-area-inset-bottom))]">
          <h1 className="hero-headline impact-text text-[#E1DFD9] tracking-wide text-center">
            LOCATE.<br/>TRAIN.<br/>BELONG.
          </h1>

          <Link 
            to="/parks"
            className="inline-flex items-center justify-center rounded-full bg-[#209D50]/90 px-[clamp(1rem,4vw,1.5rem)] py-[clamp(0.6rem,2.2vh,0.9rem)] text-white impact-text shadow-lg text-[clamp(0.95rem,2.8vw,1.125rem)] hover:bg-[#209D50] focus:outline-none focus:ring-2 focus:ring-white/60 border-2 border-black transition-all duration-300 tracking-wider transform hover:scale-105">
            FIND YOUR PARK
          </Link>
        </div>
      </section>)}

      <Routes>
        <Route path="/" element={null} />
        <Route path="/about" element={<About />} />
        <Route path="/workouts" element={<Workouts />} />
        <Route path="/parks" element={<Parks />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/store" element={<Store />} />
        <Route path="/terms" element={<Legal title="Terms & Conditions" />} />
        <Route path="/privacy" element={<Legal title="Privacy Policy" />} />
        <Route path="/cookies" element={<Legal title="Cookie Policy" />} />
        <Route path="/accessibility" element={<Legal title="Accessibility" />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
      
      {/* Established Date */}
      <div className="w-full z-40 bg-black mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-0.25 flex flex-col sm:flex-row justify-between items-center gap-0.25">
            <div className="flex flex-wrap gap-4 text-xs">
              <Link to="/terms" className="text-[#E1DFD9]/60 hover:text-[#E1DFD9] transition-colors">
                Terms & Conditions
              </Link>
              <Link to="/privacy" className="text-[#E1DFD9]/60 hover:text-[#E1DFD9] transition-colors">
                Privacy Policy
              </Link>
              <Link to="/cookies" className="text-[#E1DFD9]/60 hover:text-[#E1DFD9] transition-colors">
                Cookie Policy
              </Link>
              <Link to="/accessibility" className="text-[#E1DFD9]/60 hover:text-[#E1DFD9] transition-colors">
                Accessibility
              </Link>
            </div>
            <div className="flex items-center gap-4">
              <p className="text-[#E1DFD9]/60 text-[10px]">
                © 2024 BARZ.JPG. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div 
            className="bg-[#E1DFD9] rounded-3xl p-8 max-w-md w-full relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => setIsCartOpen(false)}
              className="absolute top-4 right-4 text-black/60 hover:text-black transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-6">
                <Timer className="w-16 h-16 text-[#209D50] animate-pulse" />
                <div className="absolute -bottom-2 -right-2">
                  <AlertCircle className="w-6 h-6 text-[#209D50]" />
                </div>
              </div>
              
              <h2 className="impact-text text-4xl text-[#209D50] mb-4">
                STORE COMING SOON<span className="text-black">.</span>
              </h2>
              
              <p className="text-black/70 mb-6">
                We're working hard to bring you the best calisthenics gear. Our store will be 
                launching soon with a premium selection of equipment for your training needs.
              </p>
              
              <div className="w-full space-y-3">
                <input
                  type="email"
                  placeholder="Enter your email for updates"
                  className="w-full bg-black/5 rounded-full px-6 py-3 text-black
                    border-2 border-transparent focus:border-[#209D50]/50 
                    outline-none transition-all duration-300"
                />
                <button className="w-full bg-[#209D50]/90 text-white py-3 rounded-full
                  impact-text border-2 border-black hover:bg-[#209D50] 
                  transition-all duration-300">
                  NOTIFY ME
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Main App component with providers
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <Router>
        <AppContent />
      </Router>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
